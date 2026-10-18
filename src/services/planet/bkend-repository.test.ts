import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BKEND_API,
  BKEND_SESSION_KEY,
  BKEND_UPLOAD,
  bkendCloudProject,
  bkendDeferred,
  bkendPlanetProject,
  bkendResponse,
  createBkendStorage
} from "./bkend-test-helpers";

let repository: typeof import("./bkend-repository").ProjectRepository;
let ConflictError: typeof import("./bkend-repository").ProjectConflictError;
let storage: Storage;
let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

const oldSession = { accessToken: "old-access", refreshToken: "old-refresh", email: "old@example.test" };
const newTokens = { accessToken: "new-access", refreshToken: "new-refresh" };
const newFileId = "file/new?#%";
const blob = new Blob(["mock project"], { type: "application/gzip" });

function storeSession(value: unknown = oldSession): void {
  storage.setItem(BKEND_SESSION_KEY, JSON.stringify(value));
}

function storedSession(): unknown {
  return JSON.parse(storage.getItem(BKEND_SESSION_KEY) ?? "null");
}

function headersAt(index: number): Headers {
  return new Headers(fetchMock.mock.calls[index][1]?.headers);
}

function callsTo(path: string) {
  return fetchMock.mock.calls.filter(([url]) => url === `${BKEND_API}${path}`);
}

function stageSave(existing = false): void {
  if (existing) fetchMock.mockResolvedValueOnce(bkendResponse(bkendCloudProject()));
  fetchMock.mockResolvedValueOnce(bkendResponse({ data: { url: BKEND_UPLOAD, fileId: newFileId } }));
}

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv("VITE_BKEND_API_URL", `${BKEND_API}/`);
  vi.stubEnv("VITE_BKEND_PROJECT_ID", "test-project");
  vi.stubEnv("VITE_BKEND_ENV", "test");
  storage = createBkendStorage();
  fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error("Unexpected mocked fetch"));
  vi.stubGlobal("sessionStorage", storage);
  vi.stubGlobal("fetch", fetchMock);
  const module = await import("./bkend-repository");
  repository = module.ProjectRepository;
  ConflictError = module.ProjectConflictError;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("bkend auth validation", () => {
  it.each([
    "{broken",
    "null",
    "[]",
    '"token"',
    "42",
    "{}",
    '{"accessToken":{}}',
    '{"accessToken":0}',
    '{"accessToken":"  "}'
  ])("treats malformed stored sessions as signed out: %s", value => {
    storage.setItem(BKEND_SESSION_KEY, value);
    expect(repository.isAuthenticated()).toBe(false);
    expect(repository.getEmail()).toBe("");
  });

  it("fails closed when browser storage cannot be read", () => {
    vi.spyOn(storage, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    expect(repository.isAuthenticated()).toBe(false);
    expect(repository.getEmail()).toBe("");
  });

  it("ignores malformed optional stored fields without sending an invalid refresh token", async () => {
    storeSession({ accessToken: "valid", refreshToken: {}, email: [] });
    fetchMock.mockResolvedValueOnce(bkendResponse(null, 401));
    expect(repository.isAuthenticated()).toBe(true);
    expect(repository.getEmail()).toBe("");
    await expect(repository.list()).rejects.toThrow("401");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(headersAt(0).get("Authorization")).toBe("Bearer valid");
  });

  it.each([
    null,
    [],
    {},
    { accessToken: {} },
    { access_token: 12 },
    { tokens: "bad" },
    { accessToken: " " },
    { ...newTokens, refreshToken: [] }
  ])("rejects malformed sign-in tokens without replacing the stored session: %j", async result => {
    storeSession();
    fetchMock.mockResolvedValueOnce(bkendResponse({ data: result }));
    await expect(repository.signIn("new@example.test", "password")).rejects.toThrow();
    expect(storedSession()).toEqual(oldSession);
  });

  it.each([
    newTokens,
    { token: newTokens },
    { tokens: newTokens },
    { data: { tokens: { access_token: "new-access", refresh_token: "new-refresh" } } }
  ])("preserves the existing token response variants: %j", async result => {
    fetchMock.mockResolvedValueOnce(bkendResponse(result));
    await repository.signIn("new@example.test", "password");
    expect(storedSession()).toEqual({ ...newTokens, email: "new@example.test" });
  });

  it.each(["signIn", "signUp"] as const)("does not refresh or send existing credentials for %s", async method => {
    storeSession();
    fetchMock.mockResolvedValueOnce(bkendResponse({ message: "Bad credentials" }, 401));
    await expect(repository[method]("new@example.test", "wrong")).rejects.toThrow("Bad credentials");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(headersAt(0).has("Authorization")).toBe(false);
  });
});

describe("bkend refresh and session races", () => {
  it("shares one refresh for concurrent 401s and retries with consistent request headers", async () => {
    storeSession();
    const pendingRefresh = bkendDeferred<Response>();
    fetchMock
      .mockResolvedValueOnce(bkendResponse({}, 401))
      .mockResolvedValueOnce(bkendResponse({}, 401))
      .mockReturnValueOnce(pendingRefresh.promise)
      .mockImplementation(async () => bkendResponse({ data: [] }));
    const first = repository.list();
    const second = repository.list();
    await vi.waitFor(() => expect(callsTo("/auth/refresh")).toHaveLength(1));
    pendingRefresh.resolve(bkendResponse({ data: { tokens: newTokens } }));
    await expect(Promise.all([first, second])).resolves.toEqual([[], []]);
    expect(callsTo("/auth/refresh")).toHaveLength(1);
    expect(JSON.parse(String(fetchMock.mock.calls[2][1]?.body))).toEqual({ refreshToken: "old-refresh" });
    for (const index of [3, 4]) {
      expect(headersAt(index).get("Authorization")).toBe("Bearer new-access");
      expect(headersAt(index).get("x-project-id")).toBe("test-project");
      expect(headersAt(index).get("x-environment")).toBe("test");
      expect(headersAt(index).get("Content-Type")).toBe("application/json");
    }
  });

  it("reuses refreshed credentials for a delayed old-token 401", async () => {
    storeSession();
    const delayed = bkendDeferred<Response>();
    fetchMock
      .mockResolvedValueOnce(bkendResponse({}, 401))
      .mockReturnValueOnce(delayed.promise)
      .mockResolvedValueOnce(bkendResponse(newTokens))
      .mockImplementation(async () => bkendResponse([]));
    const first = repository.list();
    const second = repository.list();
    await first;
    delayed.resolve(bkendResponse({}, 401));
    await second;
    expect(callsTo("/auth/refresh")).toHaveLength(1);
  });

  it("retries at most once even if the refreshed request is unauthorized", async () => {
    storeSession();
    fetchMock
      .mockResolvedValueOnce(bkendResponse({}, 401))
      .mockResolvedValueOnce(bkendResponse({ accessToken: "new-access" }))
      .mockResolvedValueOnce(bkendResponse({}, 401));
    await expect(repository.list()).rejects.toThrow("401");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(storedSession()).toEqual({ ...oldSession, accessToken: "new-access" });
  });

  it("rejects a malformed refresh without storing stringified garbage, then permits another attempt", async () => {
    storeSession();
    fetchMock
      .mockResolvedValueOnce(bkendResponse({}, 401))
      .mockResolvedValueOnce(bkendResponse({ refreshToken: "rotated" }))
      .mockResolvedValueOnce(bkendResponse({}, 401))
      .mockResolvedValueOnce(bkendResponse(newTokens))
      .mockResolvedValueOnce(bkendResponse([]));
    await expect(repository.list()).rejects.toThrow();
    expect(storedSession()).toEqual(oldSession);
    await expect(repository.list()).resolves.toEqual([]);
    expect(callsTo("/auth/refresh")).toHaveLength(2);
  });

  it.each(["signOut", "signIn"] as const)("does not let pending refresh overwrite %s", async action => {
    storeSession();
    const pendingRefresh = bkendDeferred<Response>();
    fetchMock.mockResolvedValueOnce(bkendResponse({}, 401)).mockReturnValueOnce(pendingRefresh.promise);
    const operation = expect(repository.list()).rejects.toThrow("세션");
    await vi.waitFor(() => expect(callsTo("/auth/refresh")).toHaveLength(1));
    fetchMock.mockResolvedValueOnce(bkendResponse(action === "signIn" ? { accessToken: "another" } : {}, 200));
    if (action === "signIn") await repository.signIn("another@example.test", "password");
    else await repository.signOut();
    pendingRefresh.resolve(bkendResponse(newTokens));
    await operation;
    expect(storedSession()).toEqual(
      action === "signIn" ? { accessToken: "another", email: "another@example.test" } : null
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not replay an old request under a new login", async () => {
    storeSession();
    const delayed = bkendDeferred<Response>();
    fetchMock.mockReturnValueOnce(delayed.promise).mockResolvedValueOnce(bkendResponse(newTokens));
    const operation = expect(repository.rename(bkendCloudProject(), "Rename")).rejects.toThrow("세션");
    await repository.signIn("new@example.test", "password");
    delayed.resolve(bkendResponse({}, 401));
    await operation;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("invalidates a refresh started with old credentials while sign-in is pending", async () => {
    storeSession();
    const pendingSignIn = bkendDeferred<Response>();
    const pendingRefresh = bkendDeferred<Response>();
    fetchMock
      .mockReturnValueOnce(pendingSignIn.promise)
      .mockResolvedValueOnce(bkendResponse({}, 401))
      .mockReturnValueOnce(pendingRefresh.promise);
    const signIn = repository.signIn("new@example.test", "password");
    const operation = expect(repository.list()).rejects.toThrow("세션");
    await vi.waitFor(() => expect(callsTo("/auth/refresh")).toHaveLength(1));
    pendingSignIn.resolve(bkendResponse(newTokens));
    await signIn;
    pendingRefresh.resolve(bkendResponse({ accessToken: "refreshed-old-account" }));
    await operation;
    expect(storedSession()).toEqual({ ...newTokens, email: "new@example.test" });
  });

  it("clears sign-out locally immediately and does not erase a newer login on late failure", async () => {
    storeSession();
    const delayed = bkendDeferred<Response>();
    fetchMock.mockReturnValueOnce(delayed.promise).mockResolvedValueOnce(bkendResponse(newTokens));
    const operation = expect(repository.signOut()).rejects.toThrow("500");
    expect(repository.isAuthenticated()).toBe(false);
    expect(headersAt(0).get("Authorization")).toBe("Bearer old-access");
    await repository.signIn("new@example.test", "password");
    delayed.resolve(bkendResponse({}, 500));
    await operation;
    expect(storedSession()).toEqual({ ...newTokens, email: "new@example.test" });
  });

  it("does not allow an older sign-in to replace a newer sign-in", async () => {
    const delayed = bkendDeferred<Response>();
    fetchMock.mockReturnValueOnce(delayed.promise).mockResolvedValueOnce(bkendResponse(newTokens));
    const operation = expect(repository.signIn("old@example.test", "password")).rejects.toThrow("세션");
    await repository.signIn("new@example.test", "password");
    delayed.resolve(bkendResponse({ accessToken: "stale" }));
    await operation;
    expect(repository.getEmail()).toBe("new@example.test");
  });

  it.each(["signIn", "signUp"] as const)("does not let a late %s restore a signed-out session", async method => {
    const delayed = bkendDeferred<Response>();
    fetchMock.mockReturnValueOnce(delayed.promise).mockResolvedValueOnce(bkendResponse({}, 204));
    const operation = expect(repository[method]("old@example.test", "password")).rejects.toThrow("세션");
    await repository.signOut();
    delayed.resolve(bkendResponse(newTokens));
    await operation;
    expect(repository.isAuthenticated()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("bkend save cleanup", () => {
  beforeEach(() => storeSession());

  it("rejects oversized blobs before making requests", async () => {
    const largeBlob = new Blob([new Uint8Array(20 * 1024 * 1024 + 1)]);
    await expect(repository.save(bkendPlanetProject(), largeBlob)).rejects.toThrow("20MB");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves the revision preflight and encoded project path", async () => {
    fetchMock.mockResolvedValueOnce(bkendResponse(bkendCloudProject({ revision: 4 })));
    await expect(repository.save(bkendPlanetProject(), blob, bkendCloudProject())).rejects.toBeInstanceOf(
      ConflictError
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${BKEND_API}/data/projects/${encodeURIComponent(bkendCloudProject().id)}`);
  });

  it.each([
    "upload rejection",
    "upload network",
    "registration rejection",
    "registration network"
  ])("cleans only the new file after %s and preserves the primary error", async failure => {
    stageSave(true);
    if (failure === "upload rejection") fetchMock.mockResolvedValueOnce(bkendResponse({}, 403));
    else if (failure === "upload network") fetchMock.mockRejectedValueOnce(new Error("Upload disconnected"));
    else {
      fetchMock.mockResolvedValueOnce(bkendResponse({}, 204));
      if (failure === "registration rejection") {
        fetchMock.mockResolvedValueOnce(bkendResponse({ message: "Registration rejected" }, 500));
      } else fetchMock.mockRejectedValueOnce(new Error("Registration disconnected"));
    }
    fetchMock.mockResolvedValueOnce(bkendResponse({ message: "Cleanup rejected" }, 500));
    const message = failure.startsWith("upload")
      ? failure.endsWith("network")
        ? "Upload disconnected"
        : "업로드"
      : failure.endsWith("network")
        ? "Registration disconnected"
        : "Registration rejected";
    await expect(repository.save(bkendPlanetProject(), blob, bkendCloudProject())).rejects.toThrow(message);
    const deletes = fetchMock.mock.calls.filter(([, init]) => init?.method === "DELETE");
    expect(deletes).toHaveLength(1);
    expect(deletes[0][0]).toBe(`${BKEND_API}/files/${encodeURIComponent(newFileId)}`);
    expect(callsTo(`/data/projects/${encodeURIComponent(bkendCloudProject().id)}`)).toHaveLength(1);
  });

  it.each([false, true])("cleans the staged file on a rejected metadata write (existing=%s)", async existing => {
    stageSave(existing);
    fetchMock
      .mockResolvedValueOnce(bkendResponse({}, 204))
      .mockResolvedValueOnce(bkendResponse({}, 204))
      .mockResolvedValueOnce(bkendResponse({ message: "Metadata rejected" }, 400))
      .mockResolvedValueOnce(bkendResponse({}, 204));
    await expect(
      repository.save(bkendPlanetProject(), blob, existing ? bkendCloudProject() : undefined)
    ).rejects.toThrow("Metadata rejected");
    const last = fetchMock.mock.calls.at(-1)!;
    expect(last[0]).toBe(`${BKEND_API}/files/${encodeURIComponent(newFileId)}`);
    expect(last[1]?.method).toBe("DELETE");
  });

  it.each([
    "network",
    "server error",
    "timeout",
    "malformed success"
  ])("does not delete either file when the metadata outcome is ambiguous: %s", async failure => {
    stageSave(true);
    fetchMock.mockResolvedValueOnce(bkendResponse({}, 204)).mockResolvedValueOnce(bkendResponse({}, 204));
    if (failure === "network") fetchMock.mockRejectedValueOnce(new Error("Metadata disconnected"));
    else if (failure === "malformed success") fetchMock.mockResolvedValueOnce(new Response("not JSON"));
    else fetchMock.mockResolvedValueOnce(bkendResponse({}, failure === "timeout" ? 408 : 500));
    await expect(repository.save(bkendPlanetProject(), blob, bkendCloudProject())).rejects.toThrow();
    expect(fetchMock.mock.calls.filter(([, init]) => init?.method === "DELETE")).toHaveLength(0);
  });

  it("cleans a known allocation when its upload URL is malformed", async () => {
    fetchMock
      .mockResolvedValueOnce(bkendResponse({ fileId: newFileId, url: {} }))
      .mockResolvedValueOnce(bkendResponse({}, 204));
    await expect(repository.save(bkendPlanetProject(), blob)).rejects.toThrow("URL");
    expect(fetchMock.mock.calls[1][0]).toBe(`${BKEND_API}/files/${encodeURIComponent(newFileId)}`);
    expect(fetchMock.mock.calls[1][1]?.method).toBe("DELETE");
  });

  it("does not stringify a malformed file ID or perform the upload", async () => {
    fetchMock.mockResolvedValueOnce(bkendResponse({ fileId: {}, url: BKEND_UPLOAD }));
    await expect(repository.save(bkendPlanetProject(), blob)).rejects.toThrow("URL");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refuses to upload over or clean an existing file returned as a new allocation", async () => {
    fetchMock
      .mockResolvedValueOnce(bkendResponse(bkendCloudProject()))
      .mockResolvedValueOnce(bkendResponse({ fileId: bkendCloudProject().fileId, url: BKEND_UPLOAD }));
    await expect(repository.save(bkendPlanetProject(), blob, bkendCloudProject())).rejects.toThrow("기존 파일");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("commits metadata before deleting the old file and tolerates cleanup failure", async () => {
    stageSave(true);
    const saved = bkendCloudProject({ fileId: newFileId, revision: 4 });
    fetchMock
      .mockResolvedValueOnce(bkendResponse({}, 204))
      .mockResolvedValueOnce(bkendResponse({}, 204))
      .mockResolvedValueOnce(bkendResponse({ data: saved }))
      .mockRejectedValueOnce(new Error("Cleanup disconnected"));
    await expect(repository.save(bkendPlanetProject(), blob, bkendCloudProject())).resolves.toEqual(saved);
    expect(fetchMock.mock.calls[2][0]).toBe(BKEND_UPLOAD);
    expect(fetchMock.mock.calls[2][1]?.body).toBe(blob);
    expect([...headersAt(2)]).toEqual([["content-type", blob.type]]);
    const record = JSON.parse(String(fetchMock.mock.calls[4][1]?.body));
    expect(record).toMatchObject({
      fileId: newFileId,
      revision: 4,
      name: bkendPlanetProject().planet.name,
      sizeBytes: blob.size
    });
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body)).filename).toBe("Test_planet_.fpb");
    expect(fetchMock.mock.calls[5][0]).toBe(`${BKEND_API}/files/${encodeURIComponent(bkendCloudProject().fileId)}`);
    expect(fetchMock.mock.calls[5][1]?.method).toBe("DELETE");
  });

  it("does not continue a save or issue cleanup requests under a different login", async () => {
    stageSave();
    const upload = bkendDeferred<Response>();
    fetchMock.mockReturnValueOnce(upload.promise).mockResolvedValueOnce(bkendResponse(newTokens));
    const operation = expect(repository.save(bkendPlanetProject(), blob)).rejects.toThrow("세션");
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await repository.signIn("new@example.test", "password");
    upload.resolve(bkendResponse({}, 204));
    await operation;
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

describe("bkend request and path consistency", () => {
  it("encodes rename and removal IDs and deletes the file only after project deletion", async () => {
    storeSession();
    const project = bkendCloudProject();
    fetchMock
      .mockResolvedValueOnce(bkendResponse(project))
      .mockResolvedValueOnce(bkendResponse({}, 204))
      .mockResolvedValueOnce(bkendResponse({}, 204));
    await repository.rename(project, "Renamed");
    await repository.remove(project);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      `${BKEND_API}/data/projects/${encodeURIComponent(project.id)}`,
      `${BKEND_API}/data/projects/${encodeURIComponent(project.id)}`,
      `${BKEND_API}/files/${encodeURIComponent(project.fileId)}`
    ]);
    expect(fetchMock.mock.calls.map(([, init]) => init?.method)).toEqual(["PATCH", "DELETE", "DELETE"]);
  });

  it("does not delete the file if project deletion fails", async () => {
    fetchMock.mockResolvedValueOnce(bkendResponse({}, 403));
    await expect(repository.remove(bkendCloudProject())).rejects.toThrow("403");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("encodes download IDs and does not leak API headers to signed storage URLs", async () => {
    storeSession();
    const url = "https://storage.example.test/download?signature=private";
    fetchMock
      .mockResolvedValueOnce(bkendResponse({ downloadUrl: url }))
      .mockResolvedValueOnce(new Response("downloaded"));
    expect(await (await repository.load(bkendCloudProject())).text()).toBe("downloaded");
    expect(fetchMock.mock.calls[0][0]).toBe(
      `${BKEND_API}/files/${encodeURIComponent(bkendCloudProject().fileId)}/download-url`
    );
    expect(fetchMock.mock.calls[1]).toEqual([url]);
  });

  it.each([null, { url: {} }, { url: " " }])("rejects malformed download responses: %j", async body => {
    fetchMock.mockResolvedValueOnce(bkendResponse(body));
    await expect(repository.load(bkendCloudProject())).rejects.toThrow("URL");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    null,
    [],
    "upstream failure",
    { error: null }
  ])("reports HTTP status for malformed error bodies: %j", async body => {
    fetchMock.mockResolvedValueOnce(bkendResponse(body, 503));
    await expect(repository.list()).rejects.toThrow("503");
  });

  it("reports an HTTP error for a non-JSON error response", async () => {
    fetchMock.mockResolvedValueOnce(new Response("Unavailable", { status: 502 }));
    await expect(repository.list()).rejects.toThrow("502");
  });

  it("preserves array and enveloped list responses", async () => {
    const project = bkendCloudProject();
    fetchMock
      .mockResolvedValueOnce(bkendResponse([project]))
      .mockResolvedValueOnce(bkendResponse({ data: { items: [project] } }));
    await expect(repository.list()).resolves.toEqual([project]);
    await expect(repository.list()).resolves.toEqual([project]);
  });

  it("makes no network request when configuration is missing", async () => {
    vi.stubEnv("VITE_BKEND_PROJECT_ID", "");
    vi.resetModules();
    const { ProjectRepository } = await import("./bkend-repository");
    expect(ProjectRepository.isConfigured()).toBe(false);
    await expect(ProjectRepository.list()).rejects.toThrow("환경 변수");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
