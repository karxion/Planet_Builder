// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import images from "@/data/seabed-relief-images.json";
import { DEPTH_BANDS, SEABED_RELIEF_IDS, depthBand, seabedReliefId } from "@/data/seabed-relief";
import { emptyWorldSpaces } from "@/services/world-spaces/model";
import type { UnderwaterMap, SeabedTerrain } from "@/types/underwater";
import { drawWorldSpaces } from "./world-spaces";
import { sampleSeabedRelief } from "./seabed-relief";

const labels = { surface: "Surface", underwater: "Sea", underground: "Underground" };
const fixture = (): UnderwaterMap => {
  const terrain = Array.from({ length: 96 * 64 }, (_, i) => (1 + Math.floor((i % 96) / 6)) as SeabedTerrain);
  const depths = [0, 100, 1500, 4500, 7000, 2500, 60, 3200, 2200, 3000, 1800, 2100, 3600, 4800, 10300, 4500, 120];
  return {
    version: 1,
    seed: "all-landforms",
    generation: 1,
    columns: 96,
    rows: 64,
    terrain,
    depths: terrain.map(t => depths[t]),
    owners: terrain.map(() => 0),
    factionIds: [],
    view: "combined",
    geologyVersion: 4
  };
};
beforeEach(() => {
  document.body.innerHTML = '<svg><g id="viewbox"></g></svg>';
});
afterEach(() => vi.unstubAllGlobals());
describe("bathymetric terrain icons", () => {
  it.each([
    [1, 1],
    [200, 1],
    [201, 2],
    [2000, 2],
    [2001, 3],
    [6000, 3],
    [6001, 4],
    [11000, 4]
  ])("maps actual depth %i to reading band %i", (depth, band) => {
    expect(depthBand(depth)).toBe(band);
    expect(DEPTH_BANDS[band - 1].max).toBeGreaterThanOrEqual(depth);
  });
  it("rejects land, missing and corrupt depth values", () => {
    for (const depth of [0, -1, NaN, Infinity, 11001]) expect(() => depthBand(depth)).toThrow();
    expect(() => seabedReliefId(0)).toThrow();
    expect(() => seabedReliefId(99)).toThrow();
  });
  it("covers every available landform at its actual cell without regenerating geography", () => {
    const map = fixture(),
      before = structuredClone(map);
    const cells = sampleSeabedRelief(map, 1920, 1280, []);
    expect(new Set(cells.map(i => map.terrain[i]))).toEqual(new Set(Array.from({ length: 16 }, (_, i) => i + 1)));
    expect(cells.length).toBeGreaterThan(400);
    expect(cells.length).toBeLessThanOrEqual(1800);
    expect(cells).toEqual(sampleSeabedRelief(map, 1920, 1280, []));
    expect(new Set(cells).size).toBe(cells.length);
    const data = { ...emptyWorldSpaces(), activeSpace: "underwater" as const, underwater: map };
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    drawWorldSpaces({ parent, data, width: 1920, height: 1280, selected: "", labels });
    const marks = parent.querySelectorAll<SVGElement>("[data-seabed-relief-cell]");
    expect(marks).toHaveLength(cells.length);
    for (const mark of marks) {
      const cell = Number(mark.dataset.seabedReliefCell),
        band = depthBand(map.depths[cell]);
      expect(Number(mark.dataset.seabedTerrain)).toBe(map.terrain[cell]);
      expect(Number(mark.dataset.spaceX)).toBeCloseTo(((cell % 96) + 0.5) / 96, 12);
      expect(Number(mark.dataset.spaceY)).toBeCloseTo((Math.floor(cell / 96) + 0.5) / 64, 12);
      expect(Number(mark.dataset.depthBand)).toBe(band);
      expect(mark.querySelector("use")!.getAttribute("href")).toBe(
        `#fpb-seafloor-${seabedReliefId(map.terrain[cell])}`
      );
      expect(mark.querySelector("title")!.textContent).toContain(map.depths[cell].toLocaleString("ko-KR"));
      const definition = parent.querySelector(mark.querySelector("use")!.getAttribute("href")!);
      expect(definition?.querySelector("path")).not.toBeNull();
      expect(definition?.querySelector("image")).toBeNull();
      expect(mark.querySelector("text, rect")).toBeNull();
      expect(Number(mark.querySelector("use")!.getAttribute("width"))).toBeLessThanOrEqual(24);
    }
    expect(map).toEqual(before);
    data.layers = { underwater: { visible: { toggleRelief: false } } };
    drawWorldSpaces({ parent, data, width: 1920, height: 1280, selected: "", labels });
    expect(parent.querySelector('[data-space-layer-group="toggleRelief"]')!.getAttribute("display")).toBe("none");
  });
  it("keeps the terrain shape and exposes changed depths through inspection without numbered badges", () => {
    const map = fixture(),
      parent = document.querySelector<SVGGElement>("#viewbox")!;
    const cell = sampleSeabedRelief(map, 1920, 1280, []).find(i => map.terrain[i] === 10)!;
    const data = { ...emptyWorldSpaces(), activeSpace: "underwater" as const, underwater: map };
    map.depths[cell] = 6800;
    drawWorldSpaces({ parent, data, width: 1920, height: 1280, selected: "", labels });
    const mark = parent.querySelector(`[data-seabed-relief-cell="${cell}"]`)!;
    expect(mark.getAttribute("data-depth-band")).toBe("4");
    expect(mark.querySelector("use")!.getAttribute("href")).toContain("seamount");
    expect(mark.querySelector("text, rect")).toBeNull();
    expect(mark.querySelector("title")!.textContent).toContain("6,800");
  });
  it("has sixteen distinct real-alpha PNG originals, 2/3 masters and small map images with recorded hashes", () => {
    expect(SEABED_RELIEF_IDS).toHaveLength(16);
    const hashes = new Set<string>();
    let bytes = 0;
    for (const id of SEABED_RELIEF_IDS) {
      const asset = images[id];
      for (const [file, sha] of [
        [`assets/seabed-relief-originals/${id}.png`, asset.originalSha256],
        [`public/assets/seabed-relief/${asset.file}`, asset.sha256],
        [`public/assets/seabed-relief/${asset.mapFile}`, asset.mapSha256]
      ]) {
        const data = readFileSync(resolve(process.cwd(), file));
        expect(data.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
        expect(data[25]).toBe(6);
        expect(createHash("sha256").update(data).digest("hex")).toBe(sha);
      }
      expect(asset.width).toBe(Math.round((asset.originalWidth * 2) / 3));
      expect(asset.height).toBe(Math.round((asset.originalHeight * 2) / 3));
      expect(Math.max(asset.mapWidth, asset.mapHeight)).toBeLessThanOrEqual(128);
      hashes.add(asset.originalSha256);
      bytes += readFileSync(resolve(process.cwd(), `public/assets/seabed-relief/${asset.mapFile}`)).length;
    }
    expect(hashes.size).toBe(16);
    expect(bytes).toBeLessThan(512000);
  });
  it("embeds new PNG modules in portable SVG/PNG source and rejects unknown names", async () => {
    vi.resetModules();
    const { inlineSceneImages } = await import("./scene-assets");
    vi.stubGlobal("location", { href: "http://localhost/", origin: "http://localhost" });
    const fetcher = vi.fn(async () => ({
      ok: true,
      blob: async () => new window.Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" })
    }));
    vi.stubGlobal("fetch", fetcher);
    const result = await inlineSceneImages(
      '<svg xmlns="http://www.w3.org/2000/svg"><image data-seabed-relief-module="dunes"/><image data-seabed-relief-module="dunes"/></svg>'
    );
    expect(fetcher).toHaveBeenCalledOnce();
    expect(result).toContain('href="data:image/png;base64,');
    await expect(
      inlineSceneImages('<svg xmlns="http://www.w3.org/2000/svg"><image data-seabed-relief-module="unknown"/></svg>')
    ).rejects.toThrow("Unknown scene module");
  });
});
