import { describe, expect, it } from "vitest";
import {
  getRpgResourceIcon,
  isRpgAsset,
  migrateMarkerIcon,
  RPG_MAP_ASSETS,
  SETTLEMENT_ASSETS,
  selectResourceSites
} from "./rpg-map-assets";

describe("RPG map asset pack", () => {
  it("has original, self-contained, uniquely named assets without replacing terrain", () => {
    expect(RPG_MAP_ASSETS).toHaveLength(44);
    expect(new Set(RPG_MAP_ASSETS.map(asset => asset.id)).size).toBe(44);
    expect(new Set(RPG_MAP_ASSETS.map(asset => asset.category)).size).toBe(3);
    expect(new Set<string>(RPG_MAP_ASSETS.map(asset => asset.category)).has("terrain")).toBe(false);
    for (const asset of RPG_MAP_ASSETS) {
      if (asset.body.startsWith("<image")) {
        expect(asset.body).toMatch(/^<image href="data:image\/webp;base64,[A-Za-z0-9+/=]+"/);
        expect(asset.viewBox).toBe("0 0 64 64");
      } else {
        expect(asset.body.includes("<path")).toBe(true);
        expect(asset.body).not.toMatch(/(?:href=|<image)/);
      }
      expect(asset.body).not.toMatch(/(?:<script|onload=|url\(|https?:\/\/)/);
      expect(asset.ko).toBeTruthy();
      expect(asset.en).toBeTruthy();
    }
  });
  it("provides 16 distinct embedded token images with stable resource IDs", () => {
    const tokens = RPG_MAP_ASSETS.filter(asset => asset.category === "resources");
    expect(tokens).toHaveLength(16);
    expect(new Set(tokens.map(asset => asset.body)).size).toBe(16);
    for (const token of tokens) {
      const encoded = token.body.match(/base64,([A-Za-z0-9+/=]+)/)![1];
      const bytes = atob(encoded);
      expect(bytes.slice(0, 4)).toBe("RIFF");
      expect(bytes.slice(8, 12)).toBe("WEBP");
      expect(bytes.length).toBeLessThan(100_000);
    }
  });
  it("provides unique redesigned art for all landmarks and settlements", () => {
    const tokens = RPG_MAP_ASSETS.filter(asset => asset.category === "landmarks" || asset.category === "settlements");
    expect(tokens).toHaveLength(28);
    expect(new Set(tokens.map(asset => asset.body)).size).toBe(28);
    for (const token of tokens) {
      expect(token.body).toMatch(/^<image href="data:image\/webp;base64,/);
      expect(token.viewBox).toBe("0 0 64 64");
    }
  });
  it("maps all standard settlement types to real assets", () => {
    for (const id of Object.values(SETTLEMENT_ASSETS)) expect(isRpgAsset(`rpg-${id}`)).toBe(true);
  });
  it("replaces only default marker art and preserves custom art", () => {
    expect(migrateMarkerIcon("mines", "⛏️")).toBe("#rpg-mine");
    expect(migrateMarkerIcon("dances", "#rpg-town")).toBe("#rpg-market");
    expect(migrateMarkerIcon("mines", "custom")).toBe("custom");
    expect(migrateMarkerIcon("mines", "https://example.com/icon.png").startsWith("https:")).toBe(true);
    expect(migrateMarkerIcon("custom", "⛏️")).toBe("⛏️");
  });
  it("uses specific resource families and preserves custom symbols", () => {
    expect(getRpgResourceIcon("good-wood")).toBe("#rpg-wood");
    expect(getRpgResourceIcon("good-iron")).toBe("#rpg-ore");
    expect(getRpgResourceIcon("good-gold")).toBe("#rpg-gold");
    expect(getRpgResourceIcon("custom-resource")).toBe("#custom-resource");
    expect(getRpgResourceIcon("#rpg-fish")).toBe("#rpg-fish");
  });
});

describe("resource icon placement", () => {
  const sites = [
    { cell: 1, good: 1, x: 10, y: 10 },
    { cell: 2, good: 1, x: 12, y: 10 },
    { cell: 3, good: 2, x: 11, y: 10 },
    { cell: 4, good: 1, x: 40, y: 40 }
  ];
  it("is deterministic and retains actual cell coordinates", () => {
    const result = selectResourceSites(sites, 8);
    expect(result).toEqual(selectResourceSites([...sites].reverse(), 8));
    for (const site of result) expect(sites.includes(site)).toBe(true);
  });
  it("prioritizes rare resources when sites overlap", () => {
    expect(selectResourceSites(sites, 8).map(site => site.cell)).toEqual([3, 4]);
  });
  it("avoids overlapping icons across spatial bucket boundaries", () => {
    const result = selectResourceSites(sites, 8);
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        expect(Math.hypot(result[i].x - result[j].x, result[i].y - result[j].y)).toBeGreaterThanOrEqual(8);
      }
    }
    expect(selectResourceSites(sites, 0)).toEqual(sites);
  });
});
