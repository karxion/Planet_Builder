import { describe, expect, it } from "vitest";
import { seabedIndex } from "@/data/underwater";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import { emptyWorldSpaces, isWorldSpaces, WorldSpaceStore } from "@/services/world-spaces/model";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { generateUnderwater, type SeaSurface } from "./underwater";

function surface(): SeaSurface {
  const columns = 96,
    rows = 64;
  return {
    columns,
    rows,
    heights: Array.from({ length: columns * rows }, (_, i) => {
      const x = i % columns,
        y = Math.floor(i / columns);
      return x > 30 && x < 65 && y > 16 && y < 48 ? 45 : 5;
    })
  };
}
const generate = () => generateUnderwater(emptyWorldSpaces(), "sea-test", surface());

describe("seabed and aquatic realms", () => {
  it("reproduces terrain/realms without mutating the source, and keeps land dry/unclaimed", () => {
    const source = emptyWorldSpaces(),
      input = surface(),
      before = structuredClone(input);
    const a = generateUnderwater(source, "sea-test", input),
      map = a.underwater!;
    expect(a).toEqual(generateUnderwater(source, "sea-test", input));
    expect(isWorldSpaces(a)).toBe(true);
    expect(source).toEqual(emptyWorldSpaces());
    expect(input).toEqual(before);
    for (const [i, h] of input.heights.entries())
      if (h >= 20) {
        expect(map.depths[i]).toBe(0);
        expect(map.terrain[i]).toBe(0);
        expect(map.owners[i]).toBe(0);
      }
    for (const kind of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) expect(map.terrain).toContain(kind);
    expect(map.depths).not.toEqual(generateUnderwater(source, "other-sea", input).underwater!.depths);
  });
  it("creates six peoples' cities on water, routes around land, and editable diplomacy", () => {
    const data = generate(),
      map = data.underwater!;
    expect(data.factions.map(f => f.people)).toContain("멀포크");
    expect(data.factions.map(f => f.people)).toContain("사후아긴");
    expect(map.factionIds).toHaveLength(6);
    expect(data.relations).toHaveLength(15);
    const capitals = data.sites.filter(s => s.name.endsWith("중심도시"));
    expect(capitals).toHaveLength(6);
    for (const site of data.sites) expect(map.depths[seabedIndex(map, site.x, site.y)]).toBe(site.depth);
    for (const link of data.links) {
      expect(link.path!.length).toBeGreaterThan(2);
      for (const p of link.path!) expect(map.depths[seabedIndex(map, p.x, p.y)]).toBeGreaterThan(0);
    }
    for (const [owner, capital] of capitals.entries()) {
      const start = seabedIndex(map, capital.x, capital.y),
        queue = [start],
        seen = new Set(queue);
      for (let p = 0; p < queue.length; p++) {
        const cell = queue[p],
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
            n = yy * map.columns + xx;
          if (xx < 0 || yy < 0 || xx >= map.columns || yy >= map.rows || seen.has(n) || map.owners[n] !== owner + 1)
            continue;
          seen.add(n);
          queue.push(n);
        }
      }
      expect(seen.size).toBe(map.owners.filter(n => n === owner + 1).length);
    }
  });
  it("retains authored places, edited cities, peoples and diplomacy across regeneration", () => {
    const data = generate(),
      city = data.sites[0];
    city.name = "직접 수정한 수중 도시";
    city.edited = true;
    data.factions[0].people = "멀포크·다양한 주민";
    data.relations![0].status = "allied";
    const result = generateUnderwater(data, "next", surface());
    expect(result.sites.find(s => s.id === city.id)).toEqual(city);
    expect(result.factions[0].people).toBe("멀포크·다양한 주민");
    expect(result.relations![0].status).toBe("allied");
    expect(isWorldSpaces(result)).toBe(true);
  });
  it("removes factions from influence and relations without deleting cities", () => {
    const store = new WorldSpaceStore();
    store.restore(generate());
    const before = store.snapshot();
    const id = before.factions[0].id;
    store.removeFaction(id);
    const data = store.snapshot();
    expect(isWorldSpaces(data)).toBe(true);
    expect(data.underwater!.factionIds).not.toContain(id);
    expect(data.relations!.some(r => r.from === id || r.to === id)).toBe(false);
    expect(data.sites).toHaveLength(before.sites.length);
    expect(data.sites[0].factionId).toBeUndefined();
  });
  it("reuses an edited city when the same generation slot is still at its location", () => {
    const data = generate(),
      city = data.sites[0];
    city.edited = true;
    city.name = "보존할 수도";
    const regenerated = generateUnderwater(data, "sea-test", surface());
    expect(
      regenerated.sites.filter(s => s.factionId === city.factionId && s.x === city.x && s.y === city.y)
    ).toHaveLength(1);
    expect(regenerated.sites.find(s => s.id === city.id)?.name).toBe("보존할 수도");
    expect(isWorldSpaces(regenerated)).toBe(true);
  });
  it("uses local seabed depth for new places and rejects land placement atomically", () => {
    const store = new WorldSpaceStore();
    store.restore(generate());
    const map = store.snapshot().underwater!;
    expect(() => store.addSite("underwater", "city", 0.5, 0.5)).toThrow();
    const site = store.addSite("underwater", "city", 0.1, 0.1);
    expect(site.depth).toBe(map.depths[seabedIndex(map, 0.1, 0.1)]);
  });
  it.each([
    "bad-depth",
    "sparse",
    "land-owner",
    "unknown-faction",
    "duplicate-relation",
    "bad-path"
  ])("rejects corrupt %s", kind => {
    const data = generate(),
      m = data.underwater!;
    if (kind === "bad-depth") m.depths[0] = -1;
    if (kind === "sparse") m.depths = new Array(m.depths.length);
    if (kind === "land-owner") m.owners[m.depths.indexOf(0)] = 1;
    if (kind === "unknown-faction") m.factionIds[0] = "missing";
    if (kind === "duplicate-relation")
      data.relations!.push({ ...data.relations![0], from: data.relations![0].to, to: data.relations![0].from });
    if (kind === "bad-path") data.links[0].path![0].x = 0.99;
    expect(isWorldSpaces(data)).toBe(false);
  });
  it("roundtrips bathymetry, realms, routes and relations through compressed FPB", async () => {
    const p = createPlanetProject({
      mapPayload: `1.135|test\r\n${"x".repeat(150)}`,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test"
    });
    p.worldSpaces = generate();
    const restored = await decodePlanetProject(await encodePlanetProject(p));
    expect(restored.worldSpaces).toEqual(p.worldSpaces);
  });
});
