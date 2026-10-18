// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services", () => ({ Services: {} }));
vi.mock("@/utils", () => ({
  calculateVoronoi: vi.fn(),
  ensureEl: (id: string) => document.getElementById(id),
  last: vi.fn(),
  link: vi.fn(),
  minmax: vi.fn(),
  parseError: () => "Import rejected",
  rn: vi.fn()
}));

describe("map import security boundary", () => {
  let removeMap: ReturnType<typeof vi.fn>;
  let original: SVGSVGElement;
  const originalNotes = [{ id: "burg1", name: "기존 마을", legend: "기존 메모" }];

  beforeEach(() => {
    document.body.innerHTML = '<svg id="map"></svg><div id="coas"></div>';
    original = document.querySelector<SVGSVGElement>("#map")!;
    removeMap = vi.fn();
    vi.stubGlobal("svg", { remove: removeMap });
    vi.stubGlobal("notes", originalNotes);
    vi.stubGlobal("ERROR", false);
    vi.stubGlobal("VERSION", "1.135.0");
    vi.stubGlobal("parseMapVersion", (value: string) => value);
    vi.stubGlobal("isValidVersion", () => true);
    vi.stubGlobal("compareVersions", () => ({ isOlder: false, isNewer: false }));
    vi.stubGlobal("alertMessage", document.createElement("div"));
    vi.stubGlobal("$", () => ({ dialog: vi.fn() }));
  });
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    "map root",
    "definitions",
    "notes"
  ])("rejects invalid %s before replacing the current map", async invalid => {
    const { Load } = await import("./load");
    const rows = Array<string>(46).fill("");
    rows[0] = "1.135.0|test";
    rows[4] = invalid === "notes" ? "null" : "[]";
    rows[5] = invalid === "map root" ? '<svg id="map"></svg><svg></svg>' : '<svg id="map"></svg>';
    rows[45] = invalid === "definitions" ? '</svg><svg id="injected"></svg>' : "";
    const bytes = new TextEncoder().encode(rows.join("\r\n"));
    const file = { arrayBuffer: async () => bytes.buffer } as Blob;
    await expect(Load.loadMap(file)).rejects.toThrow("Map loading failed");
    expect(removeMap).not.toHaveBeenCalled();
    expect(document.querySelector("#map")).toBe(original);
    expect(notes).toBe(originalNotes);
    expect(document.querySelector("#injected")).toBeNull();
  });
});
