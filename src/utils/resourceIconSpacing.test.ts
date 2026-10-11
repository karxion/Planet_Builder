import { describe, expect, it } from "vitest";
import { boundsOverlap } from "./mapIconGroups";
import { BoundsIndex, spaceResourceIcons } from "./resourceIconSpacing";

const token = (key: number, x = 0, y = 0) => ({ key, x, y, width: 7, height: 7 });

describe("individual resource clearance", () => {
  it("reserves other source sites so an unresolved token cannot be covered later", () => {
    const items = [token(1), token(2, 14)];
    const results = spaceResourceIcons(
      items,
      [token(3)],
      [],
      3,
      (item, candidate) => (item.key === 1 ? candidate.x >= 10 && candidate.y === 0 : false),
      { reserveSources: true }
    );
    expect(results[1].unresolved).toBe(true);
    expect(boundsOverlap(results[0], results[1], 3)).toBe(false);
  });
  it("keeps an unobstructed token at its source", () => {
    expect(spaceResourceIcons([token(1)], [], [], 3)).toEqual([
      { ...token(1), sourceX: 0, sourceY: 0, unresolved: false }
    ]);
  });

  it("leaves the requested gap around settlements and other resources", () => {
    const obstacle = { x: 0, y: 0, width: 15, height: 15 };
    const result = spaceResourceIcons([token(1), token(2, 4)], [obstacle], [], 3);
    expect(result.every(item => !item.unresolved && !boundsOverlap(item, obstacle, 3))).toBe(true);
    expect(boundsOverlap(result[0], result[1], 3)).toBe(false);
  });

  it("prefers a nearby terrain-free gap", () => {
    const terrain = token(2);
    const [result] = spaceResourceIcons([token(1)], [], [terrain], 3);
    expect(boundsOverlap(result, terrain, 3)).toBe(false);
    expect(Math.hypot(result.x, result.y)).toBeLessThan(20);
  });

  it("retains a token in dense decorative terrain so the renderer can clear only local glyphs", () => {
    const terrain = { x: -200, y: -200, width: 400, height: 400 };
    const [result] = spaceResourceIcons([token(1)], [], [terrain], 3);
    expect(result.unresolved).toBe(false);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("respects land and administrative placement constraints", () => {
    const [result] = spaceResourceIcons([token(1)], [token(2)], [], 3, (_, candidate) => candidate.x >= 10);
    expect(result.unresolved).toBe(false);
    expect(result.x).toBeGreaterThanOrEqual(10);
  });

  it("preserves source data and produces deterministic results regardless of input order", () => {
    const items = [token(2, 4), token(1)];
    const original = structuredClone(items);
    const result = spaceResourceIcons(items, [], [], 3);
    expect(result).toEqual(spaceResourceIcons([...items].reverse(), [], [], 3));
    expect(items).toEqual(original);
    expect(result.map(item => [item.key, item.sourceX])).toEqual([
      [1, 0],
      [2, 4]
    ]);
  });

  it("does not silently hide sites when no legal position exists", () => {
    const [result] = spaceResourceIcons([token(1)], [], [], 3, () => false);
    expect(result).toMatchObject({ ...token(1), unresolved: true });
  });

  it("indexes large and negative rectangles once across bucket boundaries", () => {
    const index = new BoundsIndex(8);
    const obstacle = { x: -20, y: -20, width: 40, height: 40 };
    index.add(obstacle);
    expect(index.overlaps(token(1), 3)).toEqual([obstacle]);
    expect(index.overlaps(token(2, 23), 3)).toEqual([]);
    expect(index.overlaps(token(3, 22), 3)).toEqual([obstacle]);
  });
});
