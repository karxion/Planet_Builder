import { describe, expect, it } from "vitest";
import type { SettlementMapInput } from "@/types/settlement-map";
import { generateSettlementHistory, generateSettlementMap } from "./settlement-map";

const settlementFixture: SettlementMapInput = {
  seed: "city-17",
  name: "누에리온",
  capital: true,
  port: true,
  walls: true,
  river: true,
  population: 52
};
describe("settlement map generation", () => {
  it("repeats the same geometry and changes with the seed", () => {
    expect(generateSettlementMap(settlementFixture)).toEqual(generateSettlementMap(settlementFixture));
    expect(generateSettlementMap({ ...settlementFixture, seed: "other" }).buildings).not.toEqual(
      generateSettlementMap(settlementFixture).buildings
    );
  });
  it.each([
    "a",
    "b",
    "c",
    "17",
    "해안 도시"
  ])("creates finite, bounded lots with doors and a clear market: %s", seed => {
    const map = generateSettlementMap({ ...settlementFixture, seed });
    expect(map.buildings.length).toBeGreaterThan(70);
    for (const b of map.buildings) {
      expect(Math.hypot(b.center[0] - 620, b.center[1] - 410)).toBeGreaterThanOrEqual(78);
      expect(b.polygon.length).toBeGreaterThanOrEqual(3);
      for (const [x, y] of [...b.polygon, b.door]) {
        expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(map.width);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(map.height);
      }
    }
  });
  it("does not mutate settings and provides reproducible fictional history", () => {
    const input = { ...settlementFixture };
    generateSettlementMap(input);
    expect(input).toEqual(settlementFixture);
    const history = generateSettlementHistory("s", "도시", true, false);
    expect(history).toContain("수도");
    expect(history).toBe(generateSettlementHistory("s", "도시", true, false));
  });
});
