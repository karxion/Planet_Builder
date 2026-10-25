import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services", () => ({ Services: {} }));
vi.mock("@/utils", () => ({
  calculateVoronoi: vi.fn(),
  ensureEl: vi.fn(),
  last: vi.fn(),
  link: vi.fn(),
  minmax: vi.fn(),
  parseError: vi.fn(),
  rn: vi.fn()
}));

describe("promise-based map loading", () => {
  beforeEach(() => {
    vi.stubGlobal("ERROR", false);
    vi.stubGlobal("VERSION", "1.135.0");
    vi.stubGlobal("parseMapVersion", (value: string) => value);
    vi.stubGlobal("isValidVersion", (value: string) => /^\d+\.\d+\.\d+$/.test(value));
    vi.stubGlobal("compareVersions", () => ({ isOlder: false, isNewer: true }));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("rejects an invalid file instead of waiting for an unrelated map:loaded event", async () => {
    const { Load } = await import("./load");
    await expect(Load.loadMap(new Blob(["not a map"]))).rejects.toThrow("Invalid map file");
  });

  it("rejects unsupported map versions before mutating the current map", async () => {
    const { Load } = await import("./load");
    const payload = ["9.0.0|test", "", "", "", "", '<svg id="map"></svg>', "", "", "", ""].join("\r\n");
    await expect(Load.loadMap(new Blob([payload]))).rejects.toThrow("Unsupported map version");
  });

  it("propagates file reading errors to its caller", async () => {
    const { Load } = await import("./load");
    const file = new Blob();
    vi.spyOn(file, "arrayBuffer").mockRejectedValue(new Error("read failed"));
    await expect(Load.loadMap(file)).rejects.toThrow("read failed");
  });
  it("rejects oversized files before allocating their contents", async () => {
    const { Load } = await import("./load");
    const file = new Blob(["small"]);
    Object.defineProperty(file, "size", { value: 128 * 1024 * 1024 + 1 });
    const read = vi.spyOn(file, "arrayBuffer");
    await expect(Load.loadMap(file)).rejects.toThrow("128 MiB");
    expect(read).not.toHaveBeenCalled();
  });
  it("rejects a gzip stream that expands beyond the import budget", async () => {
    const { MAX_IMPORT_BYTES } = await import("./bounded-stream");
    const cancel = vi.fn();
    const chunk = new Uint8Array(1);
    Object.defineProperty(chunk, "byteLength", { value: MAX_IMPORT_BYTES + 1 });
    vi.stubGlobal("DecompressionStream", class {
      readable = new ReadableStream({ start(controller) { controller.enqueue(chunk); }, cancel });
      writable = new WritableStream();
    });
    const { Load } = await import("./load");
    await expect(Load.loadMap(new Blob([new Uint8Array([0x1f, 0x8b, 0])]))).rejects.toThrow("Invalid map file");
    expect(cancel).toHaveBeenCalledOnce();
  });
});
