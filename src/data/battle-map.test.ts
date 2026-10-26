import { describe, expect, it } from "vitest";
import {
  battleBox,
  battlePreset,
  battleRows,
  battleTravel,
  isBattleMapSettings,
  MAX_PNG_PIXELS,
  scenePngSize
} from "./battle-map";

describe("battle map scale", () => {
  it.each([
    ["small", 25, 14, 4, 2],
    ["medium", 48, 27, 8, 4],
    ["large", 72, 41, 12, 6]
  ] as const)("matches %s travel and integer 16:9 dimensions", (preset, columns, rows, walk, dash) => {
    const settings = battlePreset(preset);
    expect(settings).toMatchObject({ columns, rows });
    expect(battleTravel(settings)).toMatchObject({ walk, dash });
    expect(isBattleMapSettings(settings)).toBe(true);
  });
  it("supports more than 72 columns, portrait ratios and independent export cell size", () => {
    expect(isBattleMapSettings({ columns: 144, rows: 81, cellPixels: 32 })).toBe(true);
    expect(isBattleMapSettings({ columns: 24, rows: 48, cellPixels: 64 })).toBe(true);
    expect(battleRows(48, "4:3")).toBe(36);
    expect(battleRows(48, "1:1")).toBe(48);
  });
  it.each([
    { columns: 0, rows: 14, cellPixels: 64 },
    { columns: 25.5, rows: 14, cellPixels: 64 },
    { columns: 257, rows: 14, cellPixels: 16 },
    { columns: 25, rows: NaN, cellPixels: 64 },
    { columns: 256, rows: 256, cellPixels: 64 },
    { columns: 72, rows: 41, cellPixels: Infinity }
  ])("rejects unsafe dimensions %j", settings => expect(isBattleMapSettings(settings)).toBe(false));
  it("aligns crop edges to whole grid cells without distorting city geometry", () => {
    const settings = battlePreset("small");
    const box = battleBox(settings, { x: 630, y: 410 });
    expect(box.width / 10).toBe(25);
    expect(box.height / 10).toBe(14);
    expect(box.x % 10).toBe(0);
    expect(box.y % 10).toBe(0);
  });
});

describe("PNG-only output budget", () => {
  it.each([
    [8192, 4096, 3000, 1500],
    [4096, 8192, 1500, 3000],
    [4608, 2592, 3000, 1687],
    [1600, 896, 1600, 896]
  ])("fits %ix%i while preserving orientation", (width, height, expectedWidth, expectedHeight) => {
    expect(scenePngSize(width, height)).toEqual({ width: expectedWidth, height: expectedHeight });
  });
  it("bounds a square by total pixel budget and keeps existing project settings valid", () => {
    const before = { columns: 128, rows: 64, cellPixels: 64 };
    expect(isBattleMapSettings(before)).toBe(true);
    const size = scenePngSize(8192, 8192);
    expect(size.width).toBe(size.height);
    expect(size.width * size.height).toBeLessThanOrEqual(MAX_PNG_PIXELS);
    expect(before).toEqual({ columns: 128, rows: 64, cellPixels: 64 });
  });
  it.each([
    [0, 100],
    [NaN, 100],
    [Infinity, 100],
    [3.5, 20]
  ])("rejects invalid dimensions %s/%s", (width, height) => expect(() => scenePngSize(width, height)).toThrow());
});
