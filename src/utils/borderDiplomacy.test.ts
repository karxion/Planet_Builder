import { describe, expect, it } from "vitest";
import { borderRelation, vassalState } from "@/data/border-diplomacy";
import { setBorderRelation, sharedBorderAnchors } from "@/utils/borderDiplomacy";
import type { BorderGeometry, BorderRelation, DiplomaticState } from "@/types/border-diplomacy";

const states = (): DiplomaticState[] => [
  { i: 0, name: "중립", diplomacy: [] },
  { i: 1, name: "은빛 왕국", diplomacy: ["x", "x", "Rival", "Neutral"] },
  { i: 2, name: "푸른 공국", diplomacy: ["x", "Rival", "x", "Neutral"] },
  { i: 3, name: "별빛 제국", diplomacy: ["x", "Neutral", "Neutral", "x"] }
];
export const borderFixture = (): BorderGeometry => ({
  cells: { h: new Uint8Array([30, 40]), state: new Uint16Array([1, 2]) },
  vertices: {
    p: [
      [0, 0],
      [10, 0],
      [10, 30]
    ],
    v: [[1], [0, 2], [1]],
    c: [
      [0, 1, -1],
      [0, 1, -1],
      [0, 1, -1]
    ]
  },
  states: states()
});

describe("Shared border diplomacy", () => {
  it("locates the arc-length midpoint on the actual border, not the bounding-box center", () => {
    const graph = borderFixture();
    const before = JSON.stringify(graph);
    expect(sharedBorderAnchors(graph)).toEqual([{ a: 1, b: 2, x: 10, y: 10, length: 40 }]);
    expect(JSON.stringify(graph)).toBe(before);
  });
  it("creates exactly one token on the longest connected boundary for each pair", () => {
    const graph = borderFixture();
    graph.vertices.p.push([100, 100], [105, 100]);
    graph.vertices.v.push([4], [3]);
    graph.vertices.c.push([0, 1, -1], [0, 1, -1]);
    expect(sharedBorderAnchors(graph)).toEqual([{ a: 1, b: 2, x: 10, y: 10, length: 40 }]);
  });
  it("handles closed enclave borders", () => {
    const graph = borderFixture();
    graph.vertices = {
      p: [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10]
      ],
      v: [
        [1, 3],
        [0, 2],
        [1, 3],
        [0, 2]
      ],
      c: Array.from({ length: 4 }, () => [0, 1, -1])
    };
    expect(sharedBorderAnchors(graph)).toEqual([{ a: 1, b: 2, x: 10, y: 10, length: 40 }]);
  });
  it("does not place borders on sea coasts, unclaimed land, removed states or point-only contacts", () => {
    for (const mutate of [
      (g: BorderGeometry) => {
        g.cells.h = [19, 40];
      },
      (g: BorderGeometry) => {
        g.cells.state = [0, 2];
      },
      (g: BorderGeometry) => {
        g.states[1].removed = true;
      },
      (g: BorderGeometry) => {
        g.vertices.v = [[], [], []];
      },
      (g: BorderGeometry) => {
        g.vertices.c[1] = [0, -1, -1];
      }
    ]) {
      const graph = borderFixture();
      mutate(graph);
      expect(sharedBorderAnchors(graph)).toEqual([]);
    }
  });
  it.each([
    ["Enemy", "war"],
    ["Rival", "hostile"],
    ["Suspicion", "hostile"],
    ["Unknown", "neutral"],
    ["Neutral", "neutral"],
    ["Friendly", "friendly"],
    ["Ally", "alliance"],
    ["BloodAlly", "blood"],
    ["Vassal", "vassal"],
    ["Suzerain", "vassal"]
  ])("maps legacy %s to %s", (status, expected) => {
    const values = states();
    values[1].diplomacy![2] = status;
    values[2].diplomacy![1] = status;
    expect(borderRelation(values[1], values[2])).toBe(expected);
  });
  it("uses the more dangerous status when loaded records are asymmetric", () => {
    const values = states();
    values[1].diplomacy![2] = "Ally";
    values[2].diplomacy![1] = "Enemy";
    expect(borderRelation(values[1], values[2])).toBe("war");
  });
  it.each([
    "war",
    "hostile",
    "neutral",
    "friendly",
    "alliance",
    "blood"
  ] as BorderRelation[])("saves %s symmetrically and survives JSON round-trip", kind => {
    const values = states();
    expect(setBorderRelation(values, 1, 2, kind)).toBe(true);
    const restored: DiplomaticState[] = JSON.parse(JSON.stringify(values));
    expect(restored[1].diplomacy![2]).toBe(restored[2].diplomacy![1]);
    expect(borderRelation(restored[1], restored[2])).toBe(kind);
  });
  it("preserves vassal direction and detaches an old overlord", () => {
    const values = states();
    expect(setBorderRelation(values, 1, 3, "vassal", 1)).toBe(true);
    expect(setBorderRelation(values, 1, 2, "vassal", 1)).toBe(true);
    expect(values[1].diplomacy![3]).toBe("Neutral");
    expect(values[3].diplomacy![1]).toBe("Neutral");
    expect(values[1].diplomacy![2]).toBe("Vassal");
    expect(values[2].diplomacy![1]).toBe("Suzerain");
    expect(vassalState(values[1], values[2])).toBe(1);
  });
  it("rejects direct and transitive vassal cycles without modifying data", () => {
    const values = states();
    setBorderRelation(values, 1, 2, "vassal", 1);
    setBorderRelation(values, 2, 3, "vassal", 2);
    const before = JSON.stringify(values);
    expect(setBorderRelation(values, 1, 2, "vassal", 2)).toBe(false);
    expect(setBorderRelation(values, 1, 3, "vassal", 3)).toBe(false);
    expect(JSON.stringify(values)).toBe(before);
  });
});
