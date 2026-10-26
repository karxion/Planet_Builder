import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BKEND_API, BKEND_SESSION_KEY, bkendCloudProject, bkendPlanetProject, bkendResponse, bkendRevision, createBkendStorage } from "./bkend-test-helpers";

describe("Immutable cloud revisions across independent clients", () => {
  let first: typeof import("./bkend-repository").ProjectRepository;
  let second: typeof first;
  let rows: Map<string, ReturnType<typeof bkendRevision>>;
  let files: Set<string>;
  let requests: { path: string; method: string }[];
  let loseResponse: boolean;
  beforeEach(async () => {
    vi.stubEnv("VITE_BKEND_API_URL", BKEND_API);
    vi.stubEnv("VITE_BKEND_PROJECT_ID", "test");
    vi.stubEnv("VITE_BKEND_CONCURRENCY", "immutable-v1");
    const storage = createBkendStorage();
    storage.setItem(BKEND_SESSION_KEY, JSON.stringify({ accessToken: "user-access" }));
    vi.stubGlobal("sessionStorage", storage);
    rows = new Map([[bkendRevision().revisionKey, bkendRevision()]]);
    files = new Set([bkendCloudProject().fileId]);
    requests = [];
    loseResponse = false;
    let sequence = 0;
    vi.stubGlobal("fetch", vi.fn(async (input: string, init: RequestInit = {}) => {
      const url = new URL(input);
      const method = init.method ?? "GET";
      requests.push({ path: url.pathname, method });
      if (url.pathname === "/files/presigned-url") {
        const fileId = `file-${++sequence}`;
        return bkendResponse({ fileId, url: `https://storage.example.test/${fileId}` });
      }
      if (url.hostname === "storage.example.test") { files.add(url.pathname.slice(1)); return bkendResponse(); }
      if (url.pathname === "/files" && method === "POST") return bkendResponse();
      if (url.pathname.startsWith("/files/") && method === "DELETE") { files.delete(decodeURIComponent(url.pathname.slice(7))); return bkendResponse(); }
      if (url.pathname === "/data/project_revisions" && method === "GET") {
        const filter = JSON.parse(url.searchParams.get("andFilters") || "{}");
        const items = [...rows.values()].filter(row => !filter.projectId || row.projectId === filter.projectId).sort((a, b) => b.revision - a.revision);
        return bkendResponse({ items: filter.projectId ? items.slice(0, 1) : items });
      }
      if (url.pathname === "/data/project_revisions" && method === "POST") {
        const record = JSON.parse(String(init.body));
        // Both clients share an owner: simulates server UNIQUE(createdBy, revisionKey), not a client lock.
        if (rows.has(record.revisionKey)) return bkendResponse({ message: "data/duplicate-value" }, 409);
        const saved = { ...record, id: `record-${rows.size}`, createdAt: "2026-10-26T00:00:00Z", updatedAt: "2026-10-26T00:00:00Z" };
        rows.set(record.revisionKey, saved);
        if (loseResponse) throw new Error("Response lost after commit");
        return bkendResponse(saved);
      }
      throw new Error(`Unexpected ${method} ${url.pathname}`);
    }));
    vi.resetModules();
    first = (await import("./bkend-repository")).ProjectRepository;
    vi.resetModules();
    second = (await import("./bkend-repository")).ProjectRepository;
  });
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  it("allows exactly one simultaneous save and removes only the losing staged file", async () => {
    const results = await Promise.allSettled([
      first.save(bkendPlanetProject(), new Blob(["PC one"]), bkendCloudProject()),
      second.save(bkendPlanetProject(), new Blob(["PC two"]), bkendCloudProject())
    ]);
    expect(results.filter(result => result.status === "fulfilled")).toHaveLength(1);
    const rejected = results.find(result => result.status === "rejected") as PromiseRejectedResult;
    expect(rejected.reason.name).toBe("ProjectConflictError");
    expect(rows.size).toBe(2);
    const current = (await first.list())[0];
    expect(current.revision).toBe(4);
    expect(files).toEqual(new Set([bkendCloudProject().fileId, current.fileId]));
    expect(requests.some(request => request.method === "PATCH")).toBe(false);
  });
  it("uses the same uniqueness rule for rename versus deletion", async () => {
    const results = await Promise.allSettled([first.rename(bkendCloudProject(), "New name"), second.remove(bkendCloudProject())]);
    expect(results.filter(result => result.status === "fulfilled")).toHaveLength(1);
    expect(rows.size).toBe(2);
    expect(files).toEqual(new Set([bkendCloudProject().fileId]));
    await expect(first.save(bkendPlanetProject(), new Blob(["stale"]), bkendCloudProject())).rejects.toMatchObject({ name: "ProjectConflictError" });
  });
  it("does not resurrect a deleted project from an older row", async () => {
    await first.remove(bkendCloudProject());
    expect(await second.list()).toEqual([]);
    await expect(second.rename(bkendCloudProject(), "resurrect")).rejects.toMatchObject({ name: "ProjectConflictError" });
  });
  it("keeps a committed file when a successful write response is lost", async () => {
    loseResponse = true;
    await expect(first.save(bkendPlanetProject(), new Blob(["committed"]), bkendCloudProject())).rejects.toThrow("Response lost");
    const current = (await second.list())[0];
    expect(current.revision).toBe(4);
    expect(files.has(current.fileId)).toBe(true);
    await expect(second.save(bkendPlanetProject(), new Blob(["retry"]), bkendCloudProject())).rejects.toMatchObject({ name: "ProjectConflictError" });
  });
  it("fails closed before uploads when the server invariant has not been configured", async () => {
    vi.stubEnv("VITE_BKEND_CONCURRENCY", "");
    await expect(first.save(bkendPlanetProject(), new Blob(["local"]))).rejects.toThrow("충돌 방지 설정");
    await expect(first.rename(bkendCloudProject(), "Rename")).rejects.toThrow("충돌 방지 설정");
    await expect(first.remove(bkendCloudProject())).rejects.toThrow("충돌 방지 설정");
    expect(requests).toEqual([]);
  });
});
