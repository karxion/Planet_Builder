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
