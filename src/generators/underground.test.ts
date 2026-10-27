import { describe, expect, it } from "vitest";
import { isUndergroundMap, paintUnderground, undergroundLevel } from "@/data/underground";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import { emptyWorldSpaces, isWorldSpaces, WorldSpaceStore } from "@/services/world-spaces/model";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import type { UndergroundMap } from "@/types/underground";
import { generateUnderground } from "./underground";

const options = { seed: "cavern-test", chambers: 24 };
const generate = () => generateUnderground(emptyWorldSpaces(), options, [{ name: "지상 도시", x: 0.3, y: 0.7 }]);
function flood(map: UndergroundMap, levelId: string) {
  const cells = map.levels.find(level => level.id === levelId)!.cells;
  const queue = [cells.indexOf(1)];
  const seen = new Set(queue);
  for (let i = 0; i < queue.length; i++) {
    const cell = queue[i],
      x = cell % map.columns,
      y = Math.floor(cell / map.columns);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ]) {
      const xx = x + dx,
        yy = y + dy,
        next = yy * map.columns + xx;
      if (xx < 0 || yy < 0 || xx >= map.columns || yy >= map.rows || seen.has(next) || cells[next] !== 1) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return seen;
}

describe("underground map generation", () => {
  it("is reproducible, bounded, valid and leaves source data untouched", () => {
    const source = emptyWorldSpaces();
    const before = structuredClone(source);
    const a = generateUnderground(source, options);
    expect(a).toEqual(generateUnderground(source, options));
    expect(source).toEqual(before);
    expect(isWorldSpaces(a)).toBe(true);
    expect(a.underground!.levels).toHaveLength(3);
    expect(a.underground!.levels[0].cells).not.toEqual(
      generateUnderground(source, { ...options, seed: "different" }).underground!.levels[0].cells
    );
    for (const level of a.underground!.levels) {
      expect(level.cells.length).toBe(128 * 80);
      expect(level.cells.filter(c => c === 0).length).toBeGreaterThan(2000);
      expect(level.cells.filter(c => c === 1).length).toBeGreaterThan(500);
    }
  });
  it.each([12, 24, 36])("connects all cities and gateways with dry routes at density %i", chambers => {
    const data = generateUnderground(emptyWorldSpaces(), { ...options, chambers }, [{ name: "지상", x: 0.12, y: 0.8 }]);
    const map = data.underground!;
    for (const level of map.levels) {
      const seen = flood(map, level.id);
      for (const site of data.sites.filter(
        s => s.space === "underground" && ["city", "gateway"].includes(s.kind) && undergroundLevel(s.depth) === level.id
      )) {
        const index =
          Math.min(map.rows - 1, Math.floor(site.y * map.rows)) * map.columns +
          Math.min(map.columns - 1, Math.floor(site.x * map.columns));
        expect(level.cells[index], site.name).toBe(1);
        expect(seen.has(index), site.name).toBe(true);
      }
    }
    const byId = new Map(data.sites.map(site => [site.id, site]));
    expect(data.links.some(l => byId.get(l.from)!.space === "surface")).toBe(true);
    expect(
      data.links.filter(l => undergroundLevel(byId.get(l.from)!.depth) !== undergroundLevel(byId.get(l.to)!.depth))
    ).toHaveLength(2);
  });
  it("retains manual/edited places, custom factions and their manual links across regeneration", () => {
    const store = new WorldSpaceStore();
    const manual = store.addSite("underground", "city", 0.92, 0.92);
    const underwater = store.addSite("underwater", "city", 0.2, 0.3);
    const initial = generateUnderground(store.snapshot(), options);
    const edited = initial.sites.find(s => s.origin === "underground" && s.kind === "city")!;
    edited.name = "직접 만든 도시";
    edited.edited = true;
    initial.factions[0].name = "수정한 세력";
    initial.links.push({ id: "manual-link", name: "수동 연결", from: manual.id, to: edited.id });
    const result = generateUnderground(initial, { ...options, seed: "next" });
    expect(result.sites.find(s => s.id === manual.id)).toEqual(manual);
    expect(result.sites.find(s => s.id === underwater.id)).toEqual(underwater);
    expect(result.sites.find(s => s.id === edited.id)).toEqual(edited);
    expect(result.links.some(l => l.id === "manual-link")).toBe(true);
    expect(result.factions[0].name).toBe("수정한 세력");
    expect(result.sites.filter(s => s.origin === "underground" && !s.edited).every(s => s.id.startsWith("ug:2:"))).toBe(
      true
    );
    expect(isWorldSpaces(result)).toBe(true);
  });
  it("roundtrips terrain, active depth and places in compressed FPB", async () => {
    const project = createPlanetProject({
      mapPayload: `1.135|test\r\n${"x".repeat(150)}`,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test"
    });
    project.worldSpaces = generate();
    project.worldSpaces.underground!.activeLevel = "deep";
    const decoded = await decodePlanetProject(await encodePlanetProject(project));
    expect(decoded.worldSpaces).toEqual(project.worldSpaces);
    expect(decoded.mapPayload).toBe(project.mapPayload);
  });
  it.each([
    null,
    "sparse",
    "overlarge",
    "duplicate",
    "bad-code",
    "fractional",
    "unknown-level"
  ])("rejects corrupt terrain %s", variant => {
    const data = generate();
    const map = data.underground!;
    if (variant === null) Object.assign(data, { underground: null });
    if (variant === "sparse") map.levels[0].cells = new Array(map.columns * map.rows);
    if (variant === "overlarge") map.columns = 100000;
    if (variant === "duplicate") map.levels[0].id = map.levels[1].id;
    if (variant === "bad-code") Object.assign(map.levels[0].cells, { 0: 99 });
    if (variant === "fractional") map.rows = 80.5;
    if (variant === "unknown-level") Object.assign(map, { activeLevel: "unknown" });
    expect(isWorldSpaces(data)).toBe(false);
  });
  it("paints only the active level and supports map edges without invalidating the grid", () => {
    const map = generate().underground!;
    const before = structuredClone(map);
    paintUnderground(map, 0.5, 0.5, 3, 2);
    paintUnderground(map, 1, 1, 3, 1);
    expect(isUndergroundMap(map)).toBe(true);
    expect(map.levels[1]).toEqual(before.levels[1]);
    expect(map.levels[2]).toEqual(before.levels[2]);
    expect(map.levels[0].cells[40 * 128 + 64]).toBe(2);
    expect(() => paintUnderground(map, 0, 0, 1.5, 1)).toThrow();
  });
});
