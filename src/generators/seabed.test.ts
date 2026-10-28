import { describe, expect, it } from "vitest";
import { emptyWorldSpaces, isWorldSpaces, WorldSpaceStore } from "@/services/world-spaces/model";
import { generateSeabed } from "./seabed";
import { generateUnderwater } from "./underwater";

const surface = () => ({
  columns: 96,
  rows: 64,
  heights: Array.from({ length: 96 * 64 }, (_, i) =>
    i % 96 > 30 && i % 96 < 65 && Math.floor(i / 96) > 16 && Math.floor(i / 96) < 48 ? 45 : 5
  )
});
const index = (f: { x: number; y: number }) => Math.floor(f.y * 64) * 96 + Math.floor(f.x * 96);

describe("seafloor morphology", () => {
  it("separates shelf, steep slope, sedimentary rise, abyss and hadal depressions", () => {
    const map = generateSeabed("sea-test", surface());
    for (const [i, kind] of map.terrain.entries()) {
      const d = map.depths[i];
      if (kind === 0) expect(d).toBe(0);
      if (kind === 1) expect(d).toBeLessThanOrEqual(200);
      if (kind === 2) expect(d).toBeGreaterThan(200);
      if (kind === 7) {
        expect(d).toBeGreaterThanOrEqual(2600);
        expect(d).toBeLessThanOrEqual(4000);
      }
      if (kind === 3) {
        expect(d).toBeGreaterThanOrEqual(3000);
        expect(d).toBeLessThanOrEqual(6000);
      }
      if (kind === 4 || kind === 14) {
        expect(d).toBeGreaterThan(6000);
        expect(d).toBeLessThanOrEqual(11000);
      }
    }
    for (const code of [7, 8, 9, 10, 11, 12, 13, 14, 15]) expect(map.terrain).toContain(code);
  });
  it("records ridge relief above its base separately from summit depth", () => {
    const map = generateSeabed("sea-test", surface()),
      ridges = map.features.filter(f => f.kind === 5);
    expect(ridges.length).toBeGreaterThan(0);
    expect(new Set(ridges.map(r => r.spreading))).toEqual(new Set(["slow", "fast"]));
    for (const r of ridges) {
      expect(r.relief).toBeGreaterThanOrEqual(2000);
      expect(r.relief).toBeLessThanOrEqual(4000);
      expect(r.baseDepth! - r.summitDepth!).toBe(r.relief);
    }
    expect(
      map.terrain.some(
        (t, i) =>
          t === 9 &&
          [-97, -96, -95, -1, 1, 95, 96, 97].some(
            offset => map.terrain[i + offset] === 5 && map.depths[i] > map.depths[i + offset]
          )
      )
    ).toBe(true);
  });
  it("places connected branching canyons on both margin types with shorter active axes", () => {
    const groups = {
      active: { lengths: [] as number[], branches: 0 },
      passive: { lengths: [] as number[], branches: 0 }
    };
    for (const seed of ["margin-a", "margin-b", "margin-c", "margin-d", "margin-e"]) {
      const map = generateSeabed(seed, surface());
      for (const f of map.features.filter(f => f.kind === 8)) {
        expect(map.terrain[index(f)]).toBe(8);
        expect(f.margin).toBeDefined();
        const group = groups[f.margin!];
        group.lengths.push(f.lengthCells!);
        group.branches += f.tributaries!;
        if (f.tributaries) {
          // The advertised tributaries must be part of a real connected canyon footprint.
          const seen = new Set([index(f)]),
            queue = [...seen];
          for (let q = 0; q < queue.length; q++) {
            const i = queue[q];
            for (const n of [i - 96, i + 96, ...(i % 96 ? [i - 1] : []), ...(i % 96 < 95 ? [i + 1] : [])]) {
              if (seen.has(n) || map.terrain[n] !== 8) continue;
              seen.add(n);
              queue.push(n);
            }
          }
          expect(seen.size).toBeGreaterThan(f.lengthCells!);
        }
      }
    }
    for (const group of Object.values(groups)) expect(group.lengths.length).toBeGreaterThan(5);
    const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
    expect(mean(groups.active.lengths)).toBeLessThan(mean(groups.passive.lengths));
    expect(groups.active.branches / groups.active.lengths.length).toBeGreaterThan(
      groups.passive.branches / groups.passive.lengths.length
    );
  });
  it("makes isolated seamounts taller than 1000m and flat-topped guyots", () => {
    const map = generateSeabed("sea-test", surface());
    const mounts = map.features.filter(f => f.kind === 10 || f.kind === 11);
    expect(mounts.length).toBeGreaterThanOrEqual(2);
    for (const mount of mounts) {
      const i = index(mount);
      expect(mount.relief).toBeGreaterThanOrEqual(1000);
      expect(mount.baseDepth! - mount.summitDepth!).toBe(mount.relief);
      expect(map.depths[i]).toBe(mount.summitDepth);
      if (mount.kind === 11)
        expect(
          [i - 96, i + 96, i - 1, i + 1].filter(n => map.terrain[n] === 11 && map.depths[n] === mount.summitDepth)
            .length
        ).toBeGreaterThanOrEqual(2);
    }
  });
  it("preserves old terrain bytes on load and rejects unsupported geology codes/metadata", () => {
    const data = generateUnderwater(emptyWorldSpaces(), "sea-test", surface()),
      map = data.underwater!;
    delete map.geologyVersion;
    delete map.features;
    map.terrain = map.terrain.map(t => (t > 6 ? 3 : t));
    const before = structuredClone(data),
      store = new WorldSpaceStore();
    store.restore(data);
    expect(store.snapshot()).toEqual(before);
    map.terrain[0] = 15;
    expect(isWorldSpaces(data)).toBe(false);
    map.geologyVersion = 2;
    expect(isWorldSpaces(data)).toBe(true);
    const v2 = structuredClone(data);
    store.restore(v2);
    expect(store.snapshot()).toEqual(v2);
    map.geologyVersion = 3;
    map.features = [{ kind: 8, x: 0.1, y: 0.1, margin: "active", lengthCells: 4, tributaries: 2 }];
    store.restore(data);
    expect(store.snapshot()).toEqual(data);
    map.features[0].lengthCells = -1;
    expect(isWorldSpaces(data)).toBe(false);
    map.features = [{ kind: 10, x: NaN, y: 0.5, relief: 1500 }];
    expect(isWorldSpaces(data)).toBe(false);
  });
  it("keeps all generated features submerged and leaves input land unchanged", () => {
    const input = surface(),
      before = structuredClone(input),
      map = generateSeabed("other-geometry", input);
    expect(input).toEqual(before);
    expect(map).toEqual(generateSeabed("other-geometry", input));
    for (const [i, h] of input.heights.entries())
      if (h >= 20) {
        expect(map.depths[i]).toBe(0);
        expect(map.terrain[i]).toBe(0);
      }
    for (const d of map.depths) {
      expect(Number.isInteger(d)).toBe(true);
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(11000);
    }
  });
});
