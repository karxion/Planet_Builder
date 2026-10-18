import { describe, expect, it } from "vitest";
import { isCampaignWorld, isNpcProgression } from "@/data/campaign-validation";
import { NPC_STAT_BLOCKS } from "@/data/npc-stat-blocks";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import type { CountryArchetype, NpcClassId, NpcProgression } from "@/types/campaign-world";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import {
  type AdministrativeSnapshot,
  createCampaign,
  regenerateCampaignNpcs,
  remainingNpcContexts,
  updateNpcProgressions
} from "./campaign-generator";
import {
  generateCommonerCr,
  generateNpcProgression,
  inferCountryArchetype,
  npcCombatProfile,
  npcCommonerProfile,
  npcTier
} from "./npc-progression";

const input: AdministrativeSnapshot = {
  states: [
    { id: 1, name: "강철 제국", government: "군사 국가", x: 0, y: 0 },
    { id: 2, name: "비전 왕국", government: "마법 국가", x: 20, y: 20 }
  ],
  fiefs: [],
  villages: [
    {
      id: 1,
      stateId: 1,
      fiefId: 0,
      name: "수도",
      capital: true,
      population: 20,
      continentId: 1,
      port: false,
      x: 0,
      y: 0
    },
    {
      id: 2,
      stateId: 1,
      fiefId: 0,
      name: "농촌",
      capital: false,
      population: 0.4,
      continentId: 1,
      port: false,
      x: 5,
      y: 5
    },
    {
      id: 3,
      stateId: 2,
      fiefId: 0,
      name: "마법 수도",
      capital: true,
      population: 10,
      continentId: 1,
      port: false,
      x: 20,
      y: 20
    },
    {
      id: 4,
      stateId: 2,
      fiefId: 0,
      name: "독립 도시",
      capital: false,
      population: 8,
      continentId: 2,
      port: true,
      x: 30,
      y: 30
    },
    { id: 5, stateId: 0, fiefId: 0, name: "무소속", capital: false, population: 0.2, port: false, x: 40, y: 40 }
  ]
};

describe("NPC tiers and country archetypes", () => {
  it("generates all fractional commoner CRs deterministically while keeping most citizens at CR zero", () => {
    const values = Array.from({ length: 2000 }, (_, index) => generateCommonerCr("commoners", `npc:${index}:0:2`));
    expect(new Set(values)).toEqual(new Set(["0", "1/8", "1/4", "1/2"]));
    expect(values.filter(cr => cr === "0").length).toBeGreaterThan(1200);
    expect(values).toEqual(
      Array.from({ length: 2000 }, (_, index) => generateCommonerCr("commoners", `npc:${index}:0:2`))
    );
  });

  it.each(["0", "1/8", "1/4", "1/2"] as const)("provides a separate commoner combat profile for CR %s", cr => {
    const npc = createCampaign(input, "world").npcs.find(npc => npc.progression?.classId === "none")!;
    npc.progression!.commonerCr = cr;
    const profile = npcCommonerProfile(npc)!;
    expect(profile.cr).toBe(cr);
    expect(profile.kind).toBe(cr === "0" ? "srd-commoner" : "fpb-commoner-variant");
    expect(profile.hp).toBeGreaterThanOrEqual(4);
    expect(profile.attackBonus).toBeGreaterThanOrEqual(2);
    expect(profile.damageType).toBe("bludgeoning");
    expect(npcCombatProfile(npc)).toBeUndefined();
    expect(isCampaignWorld(createCampaign(input, "world"))).toBe(true);
  });

  it("fills missing legacy commoner CRs without changing stories, preserves manual CRs and is idempotent", () => {
    const world = createCampaign(input, "world");
    const commoners = world.npcs.filter(npc => npc.progression?.classId === "none");
    commoners.forEach(npc => {
      delete npc.progression!.commonerCr;
    });
    commoners[0].edited = true;
    commoners[0].notes = "keep";
    expect(updateNpcProgressions(world, input)).toBe(true);
    expect(commoners[0]).toMatchObject({ notes: "keep", progression: { commonerCr: "0" } });
    commoners[0].progression!.commonerCr = "1/2";
    updateNpcProgressions(world, input, true);
    expect(commoners[0].progression!.commonerCr).toBe("1/2");
    expect(updateNpcProgressions(world, input)).toBe(false);
    delete commoners[0].progression;
    updateNpcProgressions(world, input);
    expect(commoners[0]).toMatchObject({ progression: { commonerCr: "0" } });
  });

  it.each(["1/3", "1", "__proto__", 0.125, null])("rejects invalid commoner CR %j", commonerCr => {
    expect(
      isNpcProgression({
        level: 1,
        classId: "none",
        rank: "common",
        scope: "settlement",
        archetype: "balanced",
        commonerCr
      })
    ).toBe(false);
  });

  it("rejects commoner CR on a classed character and defaults old commoners to CR zero", () => {
    expect(
      isNpcProgression({
        level: 1,
        classId: "fighter",
        rank: "trained",
        scope: "settlement",
        archetype: "balanced",
        commonerCr: "1/8"
      })
    ).toBe(false);
    const npc = createCampaign(input, "world").npcs.find(npc => npc.progression?.classId === "none")!;
    delete npc.progression!.commonerCr;
    expect(npcCommonerProfile(npc)).toMatchObject({ cr: "0", hp: 4, ac: 10, xp: 10 });
    expect(isNpcProgression(npc.progression)).toBe(true);
  });
  it("does not duplicate an existing continental figure when a larger city is added or partially regenerated", () => {
    const world = createCampaign(input, "world");
    const expanded = {
      ...input,
      villages: [...input.villages, { ...input.villages[3], id: 6, population: 100, continentId: 1 }]
    };
    expect(remainingNpcContexts(expanded, world).get(6)?.continentalSeat).toBe(false);
    regenerateCampaignNpcs(world, expanded, new Set(["village:6"]));
    expect(world.npcs.filter(npc => npc.progression?.scope === "continent")).toHaveLength(2);
  });
  it.each([
    [1, 1],
    [4, 1],
    [5, 2],
    [8, 2],
    [9, 3],
    [12, 3],
    [13, 4],
    [16, 4],
    [17, 5],
    [20, 5],
    [21, "epic"],
    [40, "epic"],
    [1000, "epic"]
  ] as const)("maps level %i to tier %s", (level, tier) => {
    expect(npcTier(level)).toBe(tier);
  });

  it.each([
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1
  ])("rejects invalid tier input %s", level => {
    expect(() => npcTier(level)).toThrow(RangeError);
  });

  it("keeps rural NPCs within tier one and commoners untrained even in a city", () => {
    const world = createCampaign(input, "world");
    for (const npc of world.npcs.filter(npc => npc.villageId === "village:2" || npc.villageId === "village:5")) {
      expect(npc.progression!.level).toBeLessThanOrEqual(4);
    }
    for (const npc of world.npcs.filter(npc => npc.progression?.rank === "common")) {
      expect(npc.progression).toMatchObject({ level: 1, classId: "none" });
    }
    expect(
      world.npcs
        .filter(
          npc =>
            npc.villageId === "village:4" &&
            npc.progression?.scope === "settlement" &&
            npc.progression?.rank !== "common"
        )
        .map(npc => npcTier(npc.progression!.level))
    ).toEqual([2, 1, 2]);
  });

  it("gives each national seat two tier-three talents and each continent only one tier-four talent", () => {
    const world = createCampaign(input, "world");
    const national = world.npcs.filter(npc => npc.progression?.scope === "country");
    expect(national).toHaveLength(4);
    expect(national.every(npc => npcTier(npc.progression!.level) === 3)).toBe(true);
    const legendary = world.npcs.filter(npc => npc.progression?.scope === "continent");
    expect(legendary.map(npc => npc.villageId)).toEqual(["village:1", "village:4"]);
    expect(legendary.every(npc => npcTier(npc.progression!.level) === 4)).toBe(true);
    expect(new Set(world.npcs.map(npc => npc.id)).size).toBe(world.npcs.length);
    expect(isCampaignWorld(world)).toBe(true);
  });

  it("does not create national or continental figures without an eligible city or continent", () => {
    const world = createCampaign(
      { ...input, villages: input.villages.map(v => ({ ...v, capital: false, population: 0.1 })) },
      "a"
    );
    expect(world.npcs.every(npc => npc.progression!.level <= 4)).toBe(true);
    expect(world.npcs).toHaveLength(20);
  });

  it("reserves fifth-tier and epic levels for manual assignment, including during regeneration", () => {
    for (let index = 0; index < 20; index++) {
      const world = createCampaign(input, String(index));
      expect(world.npcs.every(npc => npc.progression!.level <= 16)).toBe(true);
      regenerateCampaignNpcs(world, input, new Set(input.villages.map(village => `village:${village.id}`)));
      expect(world.npcs.every(npc => npc.progression!.level <= 16)).toBe(true);
    }
  });

  it("reclassifies legacy NPCs without changing saved levels, identities or notes", () => {
    const world = createCampaign(input, "legacy-tiers");
    world.npcs[0].progression!.level = 10;
    world.npcs[0].notes = "old city figure";
    world.npcs[1].progression!.level = 20;
    world.npcs[1].edited = true;
    const before = structuredClone(world);
    expect(updateNpcProgressions(world, input)).toBe(false);
    expect(world).toEqual(before);
    expect(npcTier(world.npcs[0].progression!.level)).toBe(3);
    expect(npcTier(world.npcs[1].progression!.level)).toBe(5);
  });

  it.each([21, 40, 1000])("accepts epic narrative level %i without extrapolating combat stats", level => {
    const world = createCampaign(input, "epic");
    const npc = world.npcs[0];
    npc.progression!.level = level;
    expect(isNpcProgression(npc.progression)).toBe(true);
    expect(isCampaignWorld(world)).toBe(true);
    expect(npcTier(level)).toBe("epic");
    expect(npcCombatProfile(npc)).toBeUndefined();
    expect(npcCommonerProfile(npc)).toBeUndefined();
  });

  it("round-trips manually assigned fifth-tier and epic NPCs through FPB", async () => {
    const project = createPlanetProject({
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test",
      mapPayload: `1.135|test\r\n${"x".repeat(150)}`
    });
    project.campaign = createCampaign(input, "epic");
    project.campaign.npcs[0].progression!.level = 21;
    project.campaign.npcs[0].notes = "epic lore";
    project.campaign.npcs[0].edited = true;
    project.campaign.npcs[1].progression!.level = 17;
    const restored = await decodePlanetProject(await encodePlanetProject(project));
    expect(restored.campaign).toEqual(project.campaign);
    expect(npcTier(restored.campaign!.npcs[0].progression!.level)).toBe("epic");
    expect(npcTier(restored.campaign!.npcs[1].progression!.level)).toBe(5);
  });

  it("is independent of input order and does not mutate country weights or global RNG", () => {
    const random = Math.random;
    const first = createCampaign(input, "world");
    const second = createCampaign(
      { ...input, villages: [...input.villages].reverse(), states: [...input.states].reverse() },
      "world"
    );
    const sort = (npcs: typeof first.npcs) => [...npcs].sort((a, b) => a.id.localeCompare(b.id));
    expect(sort(first.npcs)).toEqual(sort(second.npcs));
    expect(createCampaign(input, "world")).toEqual(first);
    expect(Math.random).toBe(random);
  });

  it.each([
    ["military", ["fighter", "paladin"]],
    ["arcane", ["wizard", "sorcerer", "warlock"]],
    ["theocratic", ["cleric", "paladin"]],
    ["nature", ["druid", "ranger"]],
    ["mercantile", ["bard", "rogue"]]
  ] as [
    CountryArchetype,
    NpcClassId[]
  ][])("weights %s specialists without making every NPC identical", (archetype, favored) => {
    const samples = Array.from({ length: 600 }, (_, i) =>
      generateNpcProgression("weights", `npc:1:0:${i}`, input.villages[0], 5, {
        archetype,
        nationalSeat: true,
        continentalSeat: false
      })
    );
    expect(samples.filter(sample => favored.includes(sample.classId)).length).toBeGreaterThan(360);
    expect(new Set(samples.map(sample => sample.classId)).size).toBeGreaterThan(2);
  });

  it.each([
    ["Holy Theocracy", "theocratic"],
    ["은빛 교국", "theocratic"],
    ["마도 공국", "arcane"],
    ["기사단 국가", "military"],
    ["삼림 국가", "nature"],
    ["무역 공화국", "mercantile"],
    ["왕국", "balanced"]
  ])("infers %s as %s without religion data", (government, archetype) => {
    expect(inferCountryArchetype(government)).toBe(archetype);
  });

  it("migrates legacy NPCs without changing identities or edited stories and adds elites only once", () => {
    const legacy = createCampaign(input, "world");
    delete legacy.npcGenerationVersion;
    delete legacy.npcProfiles;
    legacy.npcs = legacy.npcs.filter(npc => Number(npc.id.split(":").at(-1)) < 4);
    legacy.npcs.forEach(npc => {
      delete npc.progression;
    });
    legacy.npcs[0].edited = true;
    legacy.npcs[0].notes = "keep my story";
    const previous = { ...legacy.npcs[0] };
    expect(isCampaignWorld(legacy)).toBe(true);
    expect(updateNpcProgressions(legacy, input)).toBe(true);
    expect(legacy.npcs[0]).toMatchObject(previous);
    expect(legacy.npcs.every(npc => npc.progression)).toBe(true);
    const count = legacy.npcs.length;
    expect(updateNpcProgressions(legacy, input)).toBe(false);
    expect(legacy.npcs).toHaveLength(count);
    legacy.npcs.pop();
    updateNpcProgressions(legacy, input);
    expect(legacy.npcs).toHaveLength(count - 1);
  });

  it("preserves edited NPCs and does not regenerate a duplicate for the same role slot", () => {
    const world = createCampaign(input, "world");
    const retained = world.npcs[0];
    retained.edited = true;
    retained.notes = "custom";
    const count = world.npcs.length;
    regenerateCampaignNpcs(world, input, new Set(["village:1"]));
    expect(world.npcs).toHaveLength(count);
    expect(world.npcs.find(npc => npc.id === retained.id)).toEqual(retained);
    expect(world.npcs.filter(npc => npc.villageId === "village:1" && npc.id.endsWith(":0"))).toHaveLength(1);
    expect(isCampaignWorld(world)).toBe(true);
  });

  it("applies explicit country settings while keeping edited NPCs and other countries unchanged", () => {
    const world = createCampaign(input, "world");
    const edited = world.npcs[0];
    edited.edited = true;
    const before = structuredClone(world);
    world.npcProfiles = [{ stateId: 1, archetype: "nature" }];
    updateNpcProgressions(world, { ...input, villages: input.villages.filter(v => v.stateId === 1) }, true);
    expect(world.npcs[0]).toEqual(before.npcs[0]);
    expect(world.npcs.filter(npc => npc.villageId === "village:3")).toEqual(
      before.npcs.filter(npc => npc.villageId === "village:3")
    );
    expect(world.npcs.find(npc => npc.villageId === "village:1" && !npc.edited)?.progression?.archetype).toBe("nature");
    expect(isCampaignWorld(world)).toBe(true);
  });

  it("computes simplified level stats without mutating or claiming a new official SRD CR", () => {
    const npc = createCampaign(input, "world").npcs[0];
    npc.progression = { level: 20, classId: "wizard", rank: "legendary", scope: "continent", archetype: "arcane" };
    const original = structuredClone(NPC_STAT_BLOCKS);
    const combat = npcCombatProfile(npc)!;
    expect(combat).toMatchObject({
      kind: "fpb-simplified-level-profile",
      hp: 122,
      proficiency: 6,
      attackBonus: 11,
      spellSaveDc: 19
    });
    expect(combat).not.toHaveProperty("cr");
    expect(NPC_STAT_BLOCKS).toEqual(original);
    npc.progression.classId = "paladin";
    expect(npcCombatProfile(npc)?.spellSaveDc).toBe(17);
    npc.progression.classId = "none";
    expect(npcCombatProfile(npc)).toBeUndefined();
  });

  it.each([
    { level: Number.MAX_SAFE_INTEGER + 1 },
    { level: Number.NaN },
    { level: Number.POSITIVE_INFINITY },
    { level: 0 },
    { level: 2.5 },
    { classId: "__proto__" },
    { rank: "invented" },
    { scope: "world" },
    { archetype: "unknown" },
    { classId: "none", level: 4 }
  ])("rejects invalid progression %j", patch => {
    const profile: NpcProgression = {
      level: 4,
      classId: "fighter",
      rank: "trained",
      scope: "settlement",
      archetype: "military"
    };
    expect(isNpcProgression({ ...profile, ...patch })).toBe(false);
    const world = createCampaign(input, "world");
    world.npcs[0].progression = { ...profile, ...patch } as NpcProgression;
    expect(isCampaignWorld(world)).toBe(false);
  });

  it("rejects malformed or duplicate country profiles and invalid migration versions", () => {
    const world = createCampaign(input, "world");
    expect(isCampaignWorld({ ...world, npcProfiles: null })).toBe(false);
    expect(isCampaignWorld({ ...world, npcProfiles: [{ stateId: 1, archetype: "constructor" }] })).toBe(false);
    expect(
      isCampaignWorld({
        ...world,
        npcProfiles: [
          { stateId: 1, archetype: "arcane" },
          { stateId: 1, archetype: "nature" }
        ]
      })
    ).toBe(false);
    expect(isCampaignWorld({ ...world, npcGenerationVersion: 2 })).toBe(false);
  });
});
