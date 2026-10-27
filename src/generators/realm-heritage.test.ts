import { describe, expect, it } from "vitest";
import { isCampaignWorld } from "@/data/campaign-validation";
import { ALIGNMENTS, DEITY_RANKS } from "@/data/realm-heritage";
import { isRealmHeritage } from "@/data/realm-heritage-validation";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { type AdministrativeSnapshot, createCampaign } from "./campaign-generator";
import { nationalTreasureCount, synchronizeHeritage } from "./realm-heritage";

const input: AdministrativeSnapshot = {
  states: [
    { id: 0, name: "무소속", x: 0, y: 0 },
    { id: 1, name: "태양 왕국", x: 100, y: 100, area: 10 },
    { id: 2, name: "은빛 제국", x: 300, y: 200, area: 90 }
  ],
  fiefs: [],
  villages: [
    { id: 1, stateId: 1, fiefId: 0, name: "햇빛성", x: 100, y: 100, capital: true, port: false, population: 20 },
    { id: 2, stateId: 2, fiefId: 0, name: "은빛성", x: 300, y: 200, capital: true, port: false, population: 50 },
    { id: 3, stateId: 1, fiefId: 0, name: "농촌", x: 120, y: 120, capital: false, port: false, population: 0.2 }
  ]
};

describe("Realm heritage", () => {
  it("records actual country/city terrain once and shares it with item-library traits", async () => {
    const terrain: AdministrativeSnapshot = {
      ...input,
      states: input.states.map(state => ({ ...state, geography: "mountain" })),
      villages: input.villages.map(village => ({ ...village, geography: "coast" }))
    };
    const world = createCampaign(terrain, "heritage");
    const treasures = world.heritage!.treasures;
    expect(
      treasures.filter(item => item.ownerType === "country").every(item => item.origin?.geography === "mountain")
    ).toBe(true);
    expect(treasures.filter(item => item.ownerType === "city").every(item => item.origin?.geography === "coast")).toBe(
      true
    );
    const { synchronizeItemLibrary, treasureWorldItem } = await import("./world-items");
    const { createUniqueItemBonus } = await import("./unique-item-bonuses");
    synchronizeItemLibrary(world, [], treasures);
    for (const treasure of treasures) {
      const item = world.itemLibrary!.items.find(item => item.sourceTreasureId === treasure.id)!;
      expect(item.origin).toEqual(treasure.origin);
      expect(item.uniqueBonus).toEqual(createUniqueItemBonus(world.seed, treasureWorldItem(world, treasure)));
    }
    synchronizeHeritage(world, input);
    expect(treasures[0].origin?.geography).toBe("mountain");
  });

  it("fills missing legacy provenance without replacing edited treasure records", () => {
    const world = createCampaign(input, "heritage");
    const item = world.heritage!.treasures[0];
    delete item.origin;
    item.edited = true;
    item.power = "직접 쓴 효과";
    item.history = "직접 쓴 유래";
    const before = structuredClone(item);
    expect(synchronizeHeritage(world, input)).toBe(true);
    expect(item).toMatchObject(before);
    expect(world.heritage!.treasures[0].origin?.geography).toBe("unknown");
    expect(isRealmHeritage(world.heritage)).toBe(true);
    item.origin = { archetype: "invalid", geography: "ocean" } as never;
    expect(isRealmHeritage(world.heritage)).toBe(false);
  });

  it("generates at least one very rare or legendary national treasure for every real country", () => {
    const world = createCampaign(input, "heritage");
    expect(isCampaignWorld(world)).toBe(true);
    for (const stateId of [1, 2]) {
      const items = world.heritage!.treasures.filter(item => item.ownerType === "country" && item.stateId === stateId);
      expect(items.length).toBeGreaterThanOrEqual(1);
      expect(items.every(item => ["veryRare", "legendary"].includes(item.rarity))).toBe(true);
    }
    expect(world.heritage!.nations.some(nation => nation.stateId === 0)).toBe(false);
  });

  it("increases counts monotonically with territory and age and caps excessive accumulation", () => {
    expect(nationalTreasureCount(0, 0)).toBe(1);
    expect(nationalTreasureCount(0.4, 0)).toBeGreaterThan(nationalTreasureCount(0.1, 0));
    expect(nationalTreasureCount(0.1, 1200)).toBeGreaterThan(nationalTreasureCount(0.1, 50));
    expect(nationalTreasureCount(1, 10000)).toBe(12);
    const world = createCampaign(input, "heritage");
    world.heritage!.treasures = world.heritage!.treasures.filter(item => item.ownerType !== "country");
    world.heritage!.nations.forEach(nation => {
      nation.ageYears = 400;
    });
    synchronizeHeritage(world, input);
    expect(
      world.heritage!.treasures.filter(item => item.ownerType === "country" && item.stateId === 2).length
    ).toBeGreaterThan(
      world.heritage!.treasures.filter(item => item.ownerType === "country" && item.stateId === 1).length
    );
  });

  it("gives capital cities unique heirlooms rated rare through legendary with RP symbolism", () => {
    const world = createCampaign(input, "heritage");
    const items = world.heritage!.treasures.filter(item => item.ownerType === "city");
    expect(items.map(item => item.settlementId)).toEqual(["village:1", "village:2"]);
    expect(
      items.every(
        item =>
          item.unique && ["rare", "veryRare", "legendary"].includes(item.rarity) && item.rpEffect && item.symbolism
      )
    ).toBe(true);
  });

  it("reproduces results independently of input order without mutating random state or inputs", () => {
    const before = structuredClone(input);
    const random = Math.random;
    const first = createCampaign(input, "heritage").heritage;
    const second = createCampaign(
      { ...input, states: [...input.states].reverse(), villages: [...input.villages].reverse() },
      "heritage"
    ).heritage;
    expect(second).toEqual(first);
    expect(Math.random).toBe(random);
    expect(input).toEqual(before);
  });

  it("supports all nine alignments, all deity ranks and valid headquarters without cell religion data", () => {
    const alignments = new Set<string>();
    const ranks = new Set<string>();
    for (let index = 0; index < 100; index++) {
      const world = createCampaign(input, String(index));
      for (const religion of world.heritage!.religions) {
        alignments.add(religion.alignment);
        ranks.add(religion.deityRank);
        expect(world.units.some(unit => unit.id === religion.headquartersId && unit.stateId === religion.stateId)).toBe(
          true
        );
        expect(religion.symbol).not.toBe("");
        expect(religion.deityName).not.toBe("");
      }
    }
    expect(alignments).toEqual(new Set(Object.keys(ALIGNMENTS)));
    expect(ranks).toEqual(new Set(Object.keys(DEITY_RANKS)));
  });

  it("still creates national treasures and a headquarters at the center of an uninhabited country", () => {
    const world = createCampaign({ ...input, villages: [] }, "empty");
    expect(world.heritage!.religions.every(religion => religion.headquartersId === `country:${religion.stateId}`)).toBe(
      true
    );
    expect(world.heritage!.treasures.length).toBeGreaterThan(1);
  });

  it("migrates old projects, fills new countries, preserves edited records and never silently deletes historical treasures", () => {
    const world = createCampaign(input, "heritage");
    delete world.heritage;
    expect(isCampaignWorld(world)).toBe(true);
    expect(synchronizeHeritage(world, input)).toBe(true);
    const heritage = world.heritage!;
    heritage.treasures[0].name = "custom";
    heritage.treasures[0].edited = true;
    heritage.religions[0].notes = "private lore";
    const before = structuredClone(heritage);
    expect(synchronizeHeritage(world, input)).toBe(false);
    expect(heritage).toEqual(before);
    heritage.nations[0].ageYears = 10000;
    synchronizeHeritage(world, input);
    const count = heritage.treasures.length;
    heritage.nations[0].ageYears = 0;
    synchronizeHeritage(world, input);
    expect(heritage.treasures).toHaveLength(count);
    expect(heritage.treasures[0].name).toBe("custom");
    expect(heritage.religions[0].notes).toBe("private lore");
    synchronizeHeritage(world, {
      ...input,
      states: [...input.states, { id: 3, name: "새 나라", x: 400, y: 400, area: 5 }]
    });
    expect(heritage.treasures.some(item => item.stateId === 3)).toBe(true);
  });

  it("round-trips treasures, religions, histories and map visibility through FPB", async () => {
    const project = createPlanetProject({
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test",
      mapPayload: `1.135|test\r\n${"x".repeat(150)}`
    });
    project.campaign = createCampaign(input, "heritage");
    project.campaign.heritage!.showHeadquarters = false;
    project.campaign.heritage!.itemReferenceEdition = "2024";
    project.campaign.heritage!.treasures[0].design!.method = "inspired";
    project.campaign.heritage!.treasures[0].notes = "secret";
    expect((await decodePlanetProject(await encodePlanetProject(project))).campaign?.heritage).toEqual(
      project.campaign.heritage
    );
  });

  it.each([
    null,
    [],
    { version: 2 },
    { showHeadquarters: "yes" },
    { nations: [{ stateId: 1, ageYears: -1 }] },
    { nations: [{ stateId: 1, ageYears: 10001 }] }
  ])("rejects malformed heritage %j", patch => {
    const heritage = createCampaign(input, "heritage").heritage!;
    expect(isRealmHeritage(patch === null || Array.isArray(patch) ? patch : { ...heritage, ...patch })).toBe(false);
  });

  it("rejects illegal treasure rarities, nonunique city symbols, invalid religion enums and duplicate IDs", () => {
    const world = createCampaign(input, "heritage");
    const heritage = world.heritage!;
    heritage.treasures[0].rarity = "rare";
    expect(isCampaignWorld(world)).toBe(false);
    heritage.treasures[0].rarity = "veryRare";
    const city = heritage.treasures.find(item => item.ownerType === "city")!;
    city.unique = false;
    expect(isRealmHeritage(heritage)).toBe(false);
    city.unique = true;
    expect(isRealmHeritage({ ...heritage, religions: [{ ...heritage.religions[0], alignment: "__proto__" }] })).toBe(
      false
    );
    expect(isRealmHeritage({ ...heritage, religions: [{ ...heritage.religions[0], deityRank: "supreme" }] })).toBe(
      false
    );
    expect(isRealmHeritage({ ...heritage, treasures: [heritage.treasures[0], heritage.treasures[0]] })).toBe(false);
  });
});
