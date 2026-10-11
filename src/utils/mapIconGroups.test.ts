import { describe, expect, it } from "vitest";
import { boundsOverlap, groupMapIcons, type IconBounds } from "./mapIconGroups";

const icon = (id: number, x: number, y = 0) => ({ id, x, y, width: 10, height: 10 });

describe("screen-space icon grouping", () => {
  it("keeps badges away from individually rendered resource tokens", () => {
    const resource = { x: -20, y: -20, width: 40, height: 40 };
    const groups = groupMapIcons([icon(1, 0), icon(2, 5)], [resource]);
    expect(groups).toHaveLength(1);
    expect(boundsOverlap(groups[0], resource, 6)).toBe(false);
  });
  it("keeps separated sites at their original positions", () => {
    const items = [icon(1, 0), icon(2, 100)];
    const groups = groupMapIcons(items);
    expect(groups.map(group => group.items.length)).toEqual([1, 1]);
    expect(groups[0].x).toBe(0);
    expect(groups[1].x).toBe(100);
  });

  it("groups mixed kinds and preserves every entity and source coordinate", () => {
    const items = [icon(1, 0), icon(2, 5), icon(3, 9)];
    const original = structuredClone(items);
    const groups = groupMapIcons(items);
    expect(groups).toHaveLength(1);
    expect(groups[0].items).toEqual(items);
    expect(items).toEqual(original);
  });

  it("does not merge a continent through chains of overlapping neighbors", () => {
    const groups = groupMapIcons(Array.from({ length: 80 }, (_, i) => icon(i, i * 8)));
    expect(groups.length).toBeGreaterThan(5);
    expect(groups.every(group => group.items.length < 15)).toBe(true);
    expect(groups.flatMap(group => group.items)).toHaveLength(80);
  });

  it("keeps group badges separate from other badges and single sites", () => {
    const items = Array.from({ length: 70 }, (_, i) => icon(i, (i % 10) * 12, Math.floor(i / 10) * 12));
    const groups = groupMapIcons([...items, icon(100, -30, 32)]);
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) expect(boundsOverlap(groups[i], groups[j])).toBe(false);
    }
  });

  it("splits previously overlapping sites after zoom increases their separation", () => {
    expect(groupMapIcons([icon(1, 0), icon(2, 9)])).toHaveLength(1);
    expect(groupMapIcons([icon(1, 0), icon(2, 90)])).toHaveLength(2);
  });

  it("handles bucket boundaries and negative map positions", () => {
    expect(groupMapIcons([icon(1, -65), icon(2, -60)])).toHaveLength(1);
    expect(groupMapIcons([icon(1, 60), icon(2, 65)])).toHaveLength(1);
  });

  it("ignores invalid and invisible rectangles", () => {
    const items: IconBounds[] = [
      icon(1, 0),
      { x: NaN, y: 0, width: 10, height: 10 },
      { x: 0, y: 0, width: 0, height: 10 }
    ];
    expect(groupMapIcons(items)).toHaveLength(1);
    expect(groupMapIcons([])).toEqual([]);
  });

  it("is deterministic for the same screen geometry", () => {
    const items = Array.from({ length: 100 }, (_, i) => icon(i, (i % 10) * 9, Math.floor(i / 10) * 8));
    expect(groupMapIcons(items)).toEqual(groupMapIcons(items));
  });
  it("also combines overlapping icons larger than the usual grouping radius", () => {
    const groups = groupMapIcons([
      { x: 0, y: 0, width: 150, height: 150 },
      { x: 100, y: 100, width: 150, height: 150 }
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].items).toHaveLength(2);
  });
});
