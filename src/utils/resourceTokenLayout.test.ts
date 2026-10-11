import { describe, expect, it } from "vitest";
import { migrateResourceTokenLayout } from "./resourceTokenLayout";

describe("resource token size migration", () => {
  it("halves existing tokens and preserves their original distribution spacing", () => {
    expect(migrateResourceTokenLayout("14", "1")).toEqual({ size: 7, spacing: 21 });
    expect(migrateResourceTokenLayout("20", "1")).toEqual({ size: 10, spacing: 30 });
    expect(migrateResourceTokenLayout("6", "1")).toEqual({ size: 3, spacing: 9 });
  });
  it("never halves tokens again after save/reload", () => {
    expect(migrateResourceTokenLayout("7", "2", "21")).toEqual({ size: 7, spacing: 21 });
    expect(migrateResourceTokenLayout("10", "2", "30")).toEqual({ size: 10, spacing: 30 });
  });
  it("keeps newly edited size values literal", () => {
    expect(migrateResourceTokenLayout("12", "2", "21").size).toBe(12);
  });
  it("normalizes legacy pre-token defaults and missing values", () => {
    expect(migrateResourceTokenLayout("6", undefined)).toEqual({ size: 7, spacing: 21 });
    expect(migrateResourceTokenLayout("9", undefined)).toEqual({ size: 7, spacing: 21 });
    expect(migrateResourceTokenLayout(undefined, undefined)).toEqual({ size: 7, spacing: 21 });
  });
});
