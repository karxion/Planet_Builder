import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setGenerationLanguage } from "@/services/generation-language";

describe("GoodsModule", () => {
  let goodsModule: any;

  beforeEach(async () => {
    setGenerationLanguage("ko");
    globalThis.TIME = false;
    globalThis.seed = "seed";
    globalThis.window = globalThis.window || ({} as any);
    globalThis.grid = { cells: { temp: [20, 20, 20, 20] } } as any;
    globalThis.biomesData = {
      habitability: Array(20).fill(50),
      i: [],
      name: [],
      color: [],
      biomesMatrix: [],
      iconsDensity: [],
      icons: [],
      cost: []
    } as any;
    globalThis.pack = {
      cells: {
        i: [0, 1, 2, 3],
        biome: Uint8Array.from([0, 0, 0, 0]),
        h: Uint8Array.from([20, 20, 20, 20]),
        t: Uint16Array.from([1, 1, 1, 1]),
        r: Uint16Array.from([0, 0, 0, 0]),
        g: Uint16Array.from([0, 0, 0, 0]),
        f: Uint16Array.from([0, 0, 0, 0]),
        good: Uint16Array.from([1, 2, 1, 2])
      },
      features: [{ type: "land" }],
      goods: [
        {
          i: 1,
          name: "Custom A",
          tags: [],
          value: 1,
          unit: "unit",
          icon: "icon-a",
          color: "#ffffff",
          chance: 100,
          distribution: "true"
        },
        {
          i: 2,
          name: "Custom B",
          tags: [],
          value: 1,
          unit: "unit",
          icon: "icon-b",
          color: "#000000",
          chance: 100,
          distribution: "true"
        }
      ]
    } as any;

    const { GoodsModule } = await import("./goods-generator");
    goodsModule = new GoodsModule();
    globalThis.Goods = goodsModule as any;
  });
  afterEach(() => setGenerationLanguage("ko"));

  it("uses the selected language for new catalogue names while preserving IDs, recipes and custom names", () => {
    goodsModule.restoreDefaults();
    const ko = structuredClone(globalThis.pack.goods);
    expect(ko.every((good: { name: string }) => /[가-힣]/.test(good.name))).toBe(true);
    expect(ko[1].name).toBe("석재");
    setGenerationLanguage("en");
    goodsModule.restoreDefaults();
    expect(globalThis.pack.goods[0].name).toBe("Wood");
    expect(globalThis.pack.goods.map(({ name, unit, ...rest }: any) => rest)).toEqual(
      ko.map(({ name, unit, ...rest }: any) => rest)
    );
  });

  it("keeps the current catalogue when rerolling placement", () => {
    goodsModule.generate({ randomSeed: 123 });

    expect(globalThis.pack.goods).toHaveLength(2);
    expect(globalThis.pack.goods[0].name).toBe("Custom A");
    expect(globalThis.pack.goods[1].name).toBe("Custom B");
  });

  it("restores the default catalogue when requested explicitly", () => {
    goodsModule.restoreDefaults();

    expect(globalThis.pack.goods.some((good: any) => good.name === "목재")).toBe(true);
    expect(globalThis.pack.goods[0].name).not.toBe("Custom A");
  });

  it("restores the original defaults even after the current catalogue was edited", () => {
    goodsModule.generate();
    globalThis.pack.goods[0].name = "Edited Wood";

    goodsModule.restoreDefaults();

    expect(globalThis.pack.goods[0].name).toBe("목재");
  });

  it("initialises the catalogue from defaults when none exists yet", () => {
    globalThis.pack.goods = [];
    goodsModule.generate();

    expect(globalThis.pack.goods.some((good: any) => good.name === "목재")).toBe(true);
  });

  it("does not corrupt the default template when a restored good is edited", () => {
    goodsModule.restoreDefaults();
    const wood = globalThis.pack.goods.find((good: any) => good.name === "목재")!;
    wood.name = "Edited Wood";

    goodsModule.restoreDefaults();

    expect(globalThis.pack.goods.find((good: any) => good.name === "Edited Wood")).toBeUndefined();
    expect(globalThis.pack.goods.some((good: any) => good.name === "목재")).toBe(true);
  });

  it("clears a single good when it is no longer placeable", () => {
    globalThis.pack.goods[0].chance = 0;
    goodsModule.regeneratePlacement(1);

    const goodIds = Array.from(globalThis.pack.cells.good);
    expect(goodIds.some(id => id === 1)).toBe(false);
    expect(goodIds.filter(id => id === 2)).toHaveLength(2);
  });
});
