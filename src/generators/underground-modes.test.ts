import { describe, expect, it } from "vitest";
import { isUndergroundMap, paintUnderground, siteInActiveLevel, undergroundIndex } from "@/data/underground";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import { emptyWorldSpaces, isWorldSpaces, WorldSpaceStore } from "@/services/world-spaces/model";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import type { UndergroundSurface } from "@/types/underground";
import { inverseSurface, undergroundRoute } from "./inverse-surface";
import { generateUnderground } from "./underground";

const surface = (): UndergroundSurface => ({
  columns: 128,
  rows: 80,
  heights: Array.from({ length: 128 * 80 }, (_, i) =>
    i % 128 > 35 && i % 128 < 95 && Math.floor(i / 128) > 20 && Math.floor(i / 128) < 60 ? 60 : 5
  )
});
const hollow = () =>
  generateUnderground(emptyWorldSpaces(), { seed: "hollow-check", chambers: 24, mode: "hollow", surface: surface() }, [
    { name: "지상도시", x: 0.4112, y: 0.4353 }
  ]);

describe("underground world structures", () => {
  it("inverts heights and swaps the surface land and sea for a continuous hollow world", () => {
    const input = surface(),
      before = structuredClone(input),
      a = generateUnderground(emptyWorldSpaces(), {
        seed: "hollow-check",
        chambers: 24,
        mode: "hollow",
        surface: input
      });
    const map = a.underground!,
      layer = map.levels[0];
    expect(map.mode).toBe("hollow");
    expect(map.levels).toHaveLength(1);
    expect(isWorldSpaces(a)).toBe(true);
    for (const [i, height] of input.heights.entries()) expect(layer.cells[i] === 2).toBe(height >= 20);
    expect(input).toEqual(before);
    expect(a).toEqual(
      generateUnderground(emptyWorldSpaces(), { seed: "hollow-check", chambers: 24, mode: "hollow", surface: input })
    );
    expect(layer.elevations![0]).toBe(2250);
    expect(Math.min(...layer.elevations!)).toBe(-2500);
    for (const site of a.sites.filter(s => s.kind === "city"))
      expect([1, 4, 5]).toContain(layer.cells[undergroundIndex(map, site.x, site.y)]);
  });
  it("makes tunnel networks preferentially occupy inverse lowlands", () => {
    const input: UndergroundSurface = {
      columns: 128,
      rows: 80,
      heights: Array.from({ length: 128 * 80 }, (_, i) => (i % 128 < 64 ? 80 : 0))
    };
    const data = generateUnderground(emptyWorldSpaces(), {
      seed: "inverse-caves",
      chambers: 24,
      mode: "tunnels",
      surface: input
    });
    let low = 0,
      high = 0;
    for (const layer of data.underground!.levels)
      for (const [i, c] of layer.cells.entries())
        if (c > 0) {
          if (i % 128 < 64) low++;
          else high++;
        }
    expect(low).toBeGreaterThan(high);
    expect(data.underground!.surfaceInverted).toBe(true);
    expect(data.underground!.levels).toHaveLength(3);
    expect(isWorldSpaces(data)).toBe(true);
  });
  it("uses weighted connected routes and preserves exact surface entrance coordinates", () => {
    const data = hollow(),
      map = data.underground!;
    const entry = data.sites.find(s => s.space === "surface")!;
    expect(entry.x).toBe(0.4112);
    expect(entry.y).toBe(0.4353);
    expect(data.links.some(l => l.transport === "water")).toBe(true);
    for (const route of data.links.filter(l => l.path))
      for (let i = 1; i < route.path!.length; i++) {
        const a = undergroundIndex(map, route.path![i - 1].x, route.path![i - 1].y),
          b = undergroundIndex(map, route.path![i].x, route.path![i].y);
        expect(
          Math.abs((a % 128) - (b % 128)) + Math.abs(Math.floor(a / 128) - Math.floor(b / 128))
        ).toBeLessThanOrEqual(1);
      }
    const route = undergroundRoute(5, 5, 2, 22, i => (i % 5 === 2 && i !== 2 && i !== 22 ? 9 : 1));
    expect(route[0]).toBe(2);
    expect(route.at(-1)).toBe(22);
    expect(route.length).toBeGreaterThan(5);
  });
  it("keeps manual/edited places and unrelated space data when switching structures", () => {
    const first = hollow(),
      edited = first.sites.find(s => s.kind === "city")!;
    edited.name = "수정한 내부도시";
    edited.edited = true;
    const store = new WorldSpaceStore();
    store.restore(first);
    const sea = store.addSite("underwater", "city", 0.3, 0.7);
    const second = generateUnderground(store.snapshot(), {
      seed: "switch",
      chambers: 12,
      mode: "tunnels",
      surface: surface()
    });
    expect(second.sites.find(s => s.id === edited.id)).toEqual(edited);
    expect(second.sites.find(s => s.id === sea.id)).toEqual(sea);
    expect(isWorldSpaces(second)).toBe(true);
    const again = generateUnderground(
      first,
      { seed: "hollow-check", chambers: 24, mode: "hollow", surface: surface() },
      [{ name: "지상도시", x: 0.4112, y: 0.4353 }]
    );
    expect(again.sites.filter(s => s.kind === "city" && s.x === edited.x && s.y === edited.y)).toHaveLength(1);
    expect(again.sites.find(s => s.id === edited.id)?.name).toBe("수정한 내부도시");
  });
  it("supports all saved depths on one hollow view and coherent terrain painting", () => {
    const data = hollow(),
      map = data.underground!;
    expect(siteInActiveLevel({ ...data.sites[0], depth: 1500 }, data)).toBe(true);
    paintUnderground(map, 0.5, 0.5, 2, 5);
    expect(map.levels[0].cells[40 * 128 + 64]).toBe(5);
    expect(map.levels[0].elevations![40 * 128 + 64]).toBe(600);
    expect(isWorldSpaces(data)).toBe(true);
    const store = new WorldSpaceStore();
    store.restore(data);
    expect(() => store.addSite("underground", "city", 0.6, 0.6)).toThrow();
    expect(store.addSite("underground", "city", 0.1, 0.1).depth).toBe(40000);
  });
  it("roundtrips mode, inverse relief, roads and gates through FPB", async () => {
    const p = createPlanetProject({
      mapPayload: `1.135|test\r\n${"x".repeat(150)}`,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test"
    });
    p.worldSpaces = hollow();
    expect((await decodePlanetProject(await encodePlanetProject(p))).worldSpaces).toEqual(p.worldSpaces);
  });
  it("keeps old tunnel files unchanged and rejects malformed mode/elevation data", () => {
    const old = generateUnderground(emptyWorldSpaces(), { seed: "old", chambers: 12 }).underground!;
    delete old.mode;
    delete old.surfaceInverted;
    const store = new WorldSpaceStore(),
      data = emptyWorldSpaces();
    data.underground = old;
    store.restore(data);
    expect(store.snapshot().underground).toEqual(old);
    const bad = hollow().underground!;
    bad.activeLevel = "deep";
    expect(isUndergroundMap(bad)).toBe(false);
    bad.activeLevel = "upper";
    bad.levels[0].elevations = [0];
    expect(isUndergroundMap(bad)).toBe(false);
    expect(() => inverseSurface({ columns: 2, rows: 2, heights: [1] }, 128, 80)).toThrow();
  });
});
