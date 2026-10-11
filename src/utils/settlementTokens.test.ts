import { describe, expect, it } from "vitest";
import {
  isSettlementPositionOccupied,
  MIN_SETTLEMENT_DISTANCE,
  settlementDisplayRepresentatives,
  settlementTokenAppearance
} from "./settlementTokens";

describe("settlement display deduplication", () => {
  const town = (i: number, extra = {}) => ({ i, name: "아르온", x: 10, y: 10, state: 1, population: 1, ...extra });

  it("shows the larger settlement once for nearby same-name city and village entries", () => {
    const result = settlementDisplayRepresentatives([town(1), town(2, { x: 15, population: 8 })]);
    expect([...result]).toEqual([
      [2, 2],
      [1, 2]
    ]);
  });

  it("prioritizes a capital and handles duplicate ids deterministically", () => {
    const items = [town(1, { capital: 1 }), town(2, { population: 8 }), town(1, { capital: 1 })];
    expect([...settlementDisplayRepresentatives(items)]).toEqual([
      [1, 1],
      [2, 1]
    ]);
  });

  it("preserves distant namesakes and those in different countries", () => {
    const result = settlementDisplayRepresentatives([town(1), town(2, { x: 100 }), town(3, { state: 2 })]);
    expect([...result]).toEqual([
      [1, 1],
      [2, 2],
      [3, 3]
    ]);
  });

  it("preserves differently named settlements at the same position", () => {
    const result = settlementDisplayRepresentatives([town(1), town(2, { name: "벨리온" })]);
    expect(result.get(2)).toBe(2);
  });

  it("normalizes names without changing source data and reappears after a rename", () => {
    const items = [town(1), town(2, { name: " 아르 온 " })];
    const original = structuredClone(items);
    expect(settlementDisplayRepresentatives(items).get(2)).toBe(1);
    expect(items).toEqual(original);
    items[1].name = "벨리온";
    expect(settlementDisplayRepresentatives(items).get(2)).toBe(2);
  });

  it("does not merge unnamed entries and ignores removed and invalid positions", () => {
    const result = settlementDisplayRepresentatives([
      town(1, { name: "" }),
      town(2, { name: "" }),
      town(3, { removed: true }),
      town(4, { x: NaN }),
      town(0)
    ]);
    expect([...result]).toEqual([
      [1, 1],
      [2, 2]
    ]);
  });

  it("deduplicates same-cell entries and does not turn a chain into one distant settlement", () => {
    const result = settlementDisplayRepresentatives([
      town(1, { cell: 4 }),
      town(2, { cell: 4, x: 100 }),
      town(3, { x: 30 }),
      town(4, { x: 50 })
    ]);
    expect(result.get(2)).toBe(1);
    expect(result.get(3)).toBe(1);
    expect(result.get(4)).toBe(4);
  });
});

describe("settlement token placement", () => {
  const burgs = [
    { i: 0, x: 0, y: 0 },
    { i: 1, x: 30, y: 20 },
    { i: 2, x: 50, y: 20, removed: true }
  ];
  it("rejects neighboring positions, including identical coordinates", () => {
    expect(isSettlementPositionOccupied(burgs, 30, 20)).toBe(true);
    expect(isSettlementPositionOccupied(burgs, 31, 21)).toBe(true);
    expect(isSettlementPositionOccupied(burgs, 30 + MIN_SETTLEMENT_DISTANCE, 20)).toBe(false);
  });
  it("ignores self, removed settlements and the sentinel", () => {
    expect(isSettlementPositionOccupied(burgs, 30, 20, 1)).toBe(false);
    expect(isSettlementPositionOccupied(burgs, 50, 20)).toBe(false);
    expect(isSettlementPositionOccupied(burgs, 0, 0)).toBe(false);
  });
});

describe("population-aware settlement tokens", () => {
  it.each([
    [0.05, "hamlet"],
    [0.4, "village"],
    [2, "town"],
    [8, "city"]
  ])("renders population %s as %s", (population, tier) => {
    expect(settlementTokenAppearance(Number(population), 0, "#rpg-village", 6).icon).toBe(`#rpg-${tier}`);
  });
  it("keeps capitals distinct and scales larger populations without unbounded growth", () => {
    expect(settlementTokenAppearance(0.1, 1, "#rpg-capital", 10).icon).toBe("#rpg-capital");
    expect(settlementTokenAppearance(2, 0, "#rpg-village", 6).size).toBeGreaterThan(
      settlementTokenAppearance(0.1, 0, "#rpg-village", 6).size
    );
    expect(settlementTokenAppearance(1e9, 1, "#rpg-capital", 10).size).toBeLessThan(MIN_SETTLEMENT_DISTANCE);
    expect(Number.isFinite(settlementTokenAppearance(Number.NaN, 0, "#rpg-village", 6).size)).toBe(true);
  });
  it("preserves custom and special-purpose icons", () => {
    expect(settlementTokenAppearance(50, 0, "#rpg-village", 7, false)).toEqual({ icon: "#rpg-village", size: 7 });
    for (const icon of ["#custom-icon", "#icon-circle", "#rpg-harbor", "#rpg-fort"]) {
      expect(settlementTokenAppearance(50, 1, icon, 7)).toEqual({ icon, size: 7 });
    }
  });
});
