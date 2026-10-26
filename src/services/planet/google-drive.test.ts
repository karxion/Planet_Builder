import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  connectDrive,
  disconnectDrive,
  driveConnected,
  listDriveFiles,
  loadDriveFile,
  saveDriveFile
} from "./google-drive";

const scope = "https://www.googleapis.com/auth/drive.file";
const revoke = vi.fn();
const fetchMock = vi.fn();
let callback: (value: object) => void;
let popupError: () => void;

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("window", {
    google: {
      accounts: {
        oauth2: {
          revoke,
          initTokenClient: vi.fn(options => {
            callback = options.callback;
            popupError = options.error_callback;
            return { requestAccessToken: () => {} };
          })
        }
      }
    }
  });
  fetchMock.mockReset();
});
afterEach(() => {
  disconnectDrive();
  vi.unstubAllGlobals();
});
async function login() {
  const pending = connectDrive();
  callback({ access_token: "test-token", expires_in: 3600, scope });
  await pending;
}

describe("Google Drive project storage", () => {
  it("requires a connection before accessing Drive", async () => {
    await expect(listDriveFiles()).rejects.toThrow("다시 연결");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects declined permissions and closed popups", async () => {
    let pending = connectDrive();
    callback({ access_token: "test-token", expires_in: 3600, scope: "email" });
    await expect(pending).rejects.toThrow("권한");
    expect(driveConnected()).toBe(false);
    pending = connectDrive();
    popupError();
    await expect(pending).rejects.toThrow("연결 창");
  });
  it("reads every page with app-only filters and excludes trashed files", async () => {
    await login();
    fetchMock
      .mockResolvedValueOnce(Response.json({ files: [{ id: "one", name: "첫 행성.fpb" }], nextPageToken: "page2" }))
      .mockResolvedValueOnce(Response.json({ files: [{ id: "two", name: "둘째.fpb" }] }));
    expect(await listDriveFiles()).toHaveLength(2);
    const first = new URL(fetchMock.mock.calls[0][0]);
    expect(first.searchParams.get("q")).toContain("trashed = false");
    expect(first.searchParams.get("q")).toContain("appProperties");
    expect(new URL(fetchMock.mock.calls[1][0]).searchParams.get("pageToken")).toBe("page2");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer test-token");
  });
  it("creates a fresh multipart snapshot with the original bytes", async () => {
    await login();
    fetchMock.mockResolvedValue(Response.json({ id: "saved" }));
    await saveDriveFile("테스트 행성", new Blob(["compressed bytes"]));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("uploadType=multipart");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toContain("multipart/related; boundary=fpb-");
    const body = await init.body.text();
    expect(body).toContain('"appProperties":{"fpb":"1"}');
    expect(body).toContain("compressed bytes");
    expect(body).toContain("테스트 행성-");
  });
  it("clears expired authorization and requires reconnect", async () => {
    await login();
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));
    await expect(listDriveFiles()).rejects.toThrow("만료");
    expect(driveConnected()).toBe(false);
  });
  it("bounds downloads and encodes file IDs", async () => {
    await login();
    fetchMock.mockResolvedValue(new Response("fpb", { headers: { "content-length": String(129 * 1024 * 1024) } }));
    await expect(loadDriveFile("a/b")).rejects.toThrow("size limit");
    expect(fetchMock.mock.calls[0][0]).toContain("a%2Fb?alt=media");
  });
  it("rejects in-flight results after an account disconnect", async () => {
    await login();
    let finish!: (value: Response) => void;
    fetchMock.mockImplementation(
      () =>
        new Promise(resolve => {
          finish = resolve;
        })
    );
    const pending = listDriveFiles();
    disconnectDrive();
    finish(Response.json({ files: [] }));
    await expect(pending).rejects.toThrow("연결이 변경");
  });
});
