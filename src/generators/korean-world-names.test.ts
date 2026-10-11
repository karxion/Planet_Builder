import Alea from "alea";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildAdministration, generateVillageNpcs, synchronizeNpcPlaceNames } from "./campaign-generator";
import { generateKoreanName, koreanizeWorldNames, koreanStateFullName } from "./korean-world-names";

describe("Korean world names", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("generates deterministic Hangul names with a seeded random stream", () => {
    const names = (seed: string) => {
      const random = Alea(seed);
      return Array.from({ length: 100 }, () => generateKoreanName(random));
    };
    expect(names("world")).toEqual(names("world"));
    expect(names("other")).not.toEqual(names("world"));
    expect(names("world").every(name => /^[가-힣]{3,6}$/.test(name))).toBe(true);
    expect(new Set(names("world")).size).toBeGreaterThan(95);
  });

  it.each([
    ["Kingdom", "왕국"],
    ["Empire", "제국"],
    ["Theocracy", "교국"],
    ["Duchy", "공국"],
    ["Republic", "공화국"],
    ["Grand Duchy", "대공국"],
    ["Federation", "연방 공화국"],
    ["Union", "연합국"]
  ])("uses the political suffix for %s", (formName, suffix) => {
    expect(koreanStateFullName({ name: "세레온", formName })).toBe(`세레온 ${suffix}`);
  });

  it("supports a custom Korean political system without adding an English prefix", () => {
    expect(koreanStateFullName({ name: "루미아", formName: "마도 공화국" })).toBe("루미아 마도 공화국");
    expect(koreanStateFullName({ name: "루미아" })).toBe("루미아");
  });

  const oldWorld = () => ({
    burgs: [
      { i: 1, name: "Oak", x: 10, y: 20 },
      { i: 2, name: "달빛마을" },
      { i: 3, name: "Locked", lock: true }
    ],
    states: [
      { i: 0, name: "Neutrals" },
      { i: 1, name: "Oak", form: "Monarchy", formName: "Kingdom", fullName: "Kingdom of Oak" },
      { i: 2, name: "은빛", formName: "Republic", fullName: "은빛 자유공화국" }
    ],
    provinces: [{ i: 1, name: "Oak", formName: "County", fullName: "Oak County" }],
    rivers: [{ i: 0, name: "Thames" }],
    features: [{ i: 4, type: "lake", name: "Blue" }]
  });

  it("converts existing English names consistently without moving entities or changing government codes", () => {
    const world = oldWorld();
    expect(koreanizeWorldNames(world, "seed")).toBe(true);
    expect(world.states[1].name).toBe(world.burgs[0].name);
    expect(world.provinces[0].name).toBe(world.burgs[0].name);
    expect(world.states[1].fullName).toBe(`${world.burgs[0].name} 왕국`);
    expect(world.states[1].formName).toBe("Kingdom");
    expect(world.provinces[0].fullName).toBe(`${world.burgs[0].name} 영지`);
    expect(world.burgs[0]).toMatchObject({ x: 10, y: 20 });
    expect(world.burgs[1].name).toBe("달빛마을");
    expect(world.burgs[2].name).toBe("Locked");
    expect(world.states[2].fullName).toBe("은빛 자유공화국");
    expect(world.rivers[0].name).toMatch(/^[가-힣]+$/);
    expect(world.features[0].name).toMatch(/^[가-힣]+$/);
    expect(koreanizeWorldNames(world, "seed")).toBe(false);
    const other = oldWorld();
    koreanizeWorldNames(other, "seed");
    expect(other).toEqual(world);
  });

  it("keeps regions and fiefs Korean in the administrative hierarchy", () => {
    const units = buildAdministration({
      states: [{ id: 1, name: "세레온 왕국", x: 0, y: 0 }],
      fiefs: [{ id: 1, stateId: 1, name: "루미아 영지", x: 0, y: 0, neighbors: [] }],
      villages: []
    });
    expect(units.map(unit => unit.name)).toEqual(["세레온 왕국", "루미아 지역", "루미아 영지"]);
  });

  it("uses Korean defaults without restoring culture data or appending Latin state suffixes", async () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("pack", { cultures: [] });
    await import("./names-generator");
    const names = window.Names;
    expect(names.getCulture(0)).toMatch(/^[가-힣]+$/);
    expect(names.getCultureShort(0)).toMatch(/^[가-힣]+$/);
    expect(names.getState("루미아", 0)).toBe("루미아");
    expect(pack.cultures).toEqual([]);
  });

  it("updates old place references in generated NPC goals while preserving edited NPCs", () => {
    const village = { id: 1, stateId: 1, fiefId: 1, name: "Oak", x: 1, y: 2, capital: false, port: false };
    const npcs = generateVillageNpcs("seed", village);
    npcs[1].edited = true;
    const changed = synchronizeNpcPlaceNames(npcs, [], [{ ...village, name: "달빛마을" }]);
    expect(changed[0].goal).toBe(npcs[0].goal.replace("Oak", "달빛마을"));
    expect(changed[1]).toEqual(npcs[1]);
    expect(npcs[0].goal).toMatch(/^Oak에서 /);
    expect(synchronizeNpcPlaceNames(changed, [], [{ ...village, name: "달빛마을" }])).toEqual(changed);
  });
});
