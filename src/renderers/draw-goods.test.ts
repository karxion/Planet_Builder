import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./rpg-asset-renderer", () => ({
  escapeAttribute: (value: string) => value,
  installRpgAssetDefinitions: vi.fn()
}));
vi.mock("../utils", () => ({ rn: (value: number) => value }));
vi.mock("@/data/rpg-map-assets", () => ({
  getRpgResourceIcon: () => "#rpg-wood",
  selectResourceSites: vi.fn((sites: unknown[]) => sites)
}));

import { selectResourceSites } from "@/data/rpg-map-assets";
import { drawGoods } from "./draw-goods";

afterEach(() => vi.unstubAllGlobals());

describe("half-size resource tokens", () => {
  for (const baseSize of [14, 20]) {
    it(`renders migrated ${baseSize / 2}px tokens without changing spacing or source data`, () => {
      const attributes = new Map<string, string | number>([
        ["data-size", baseSize / 2],
        ["data-site-spacing", baseSize * 1.5]
      ]);
      const html = vi.fn();
      const selection = {
        empty: () => false,
        html,
        attr: (key: string, value?: number) => {
          if (value === undefined) return attributes.get(key);
          attributes.set(key, value);
          return selection;
        }
      };
      vi.stubGlobal("TIME", false);
      vi.stubGlobal("goods", { select: () => selection, style: vi.fn() });
      vi.stubGlobal("pack", { goods: [{ i: 1, visible: true }], cells: { i: [0], good: [1], p: [[100, 100]] } });
      vi.stubGlobal("Goods", { get: () => ({ i: 1, name: "Wood", icon: "wood" }) });
      drawGoods();
      expect(html.mock.calls.at(-1)?.[0].includes(`width="${baseSize / 2}" height="${baseSize / 2}"`)).toBe(true);
      expect(attributes.get("data-display-size")).toBe(baseSize / 2);
      expect(attributes.get("data-size")).toBe(baseSize / 2);
      expect(selectResourceSites).toHaveBeenLastCalledWith([{ cell: 0, good: 1, x: 100, y: 100 }], baseSize * 1.5);
    });
  }
});
