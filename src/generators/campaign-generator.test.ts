import { describe, expect, it } from "vitest";
import { isCampaignWorld } from "@/data/campaign-validation";
import { abilityModifier, NPC_STAT_BLOCKS } from "@/data/npc-stat-blocks";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import type { PackedGraph } from "@/types/PackedGraph";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { removeLegacyDivisions } from "./administration-policy";
import {
  type AdministrativeSnapshot,
  belongsTo,
  buildAdministration,
  createCampaign,
  generateVillageNpcs
} from "./campaign-generator";

const input: AdministrativeSnapshot = {
  states: [
    { id: 1, name: "Arden", x: 10, y: 20 },
    { id: 2, name: "Vale", x: 80, y: 20 }
  ],
  fiefs: [
    { id: 1, stateId: 1, name: "North", x: 10, y: 10, neighbors: [2] },
    { id: 2, stateId: 1, name: "South", x: 10, y: 30, neighbors: [1, 3] },
    { id: 3, stateId: 2, name: "West", x: 80, y: 20, neighbors: [2] }
  ],
  villages: [
    { id: 1, stateId: 1, fiefId: 1, name: "Oak", x: 10, y: 10, capital: true, port: false },
    { id: 2, stateId: 1, fiefId: 0, name: "Brook", x: 20, y: 20, capital: false, port: true },
    { id: 3, stateId: 2, fiefId: 3, name: "Hill", x: 80, y: 20, capital: false, port: false }
  ]
};

describe("Administrative campaign", () => {
  it("is deterministic without consuming global random state", () => {
    const random = Math.random;
    expect(createCampaign(input, "550021")).toEqual(createCampaign(input, "550021"));
    expect(Math.random).toBe(random);
  });
  it("creates only the four supported levels and keeps country boundaries", () => {
    const units = buildAdministration(input);
    expect(new Set(units.map(u => u.level))).toEqual(new Set(["country", "region", "fief", "village"]));
    expect(belongsTo("village:1", "country:1", units)).toBe(true);
    expect(belongsTo("village:1", "country:2", units)).toBe(false);
    expect(units.find(u => u.id === "fief:2:3")?.parentId).not.toBe(units.find(u => u.id === "fief:1:2")?.parentId);
  });
  it("assigns villages without a province to a direct fief", () => {
    const units = buildAdministration(input);
    expect(units.find(u => u.id === "village:2")?.parentId).toBe("fief:1:0");
    expect(belongsTo("village:2", "country:1", units)).toBe(true);
  });
  it("generates four NPCs per village with persistent identities", () => {
    const world = createCampaign(input, "550021");
    expect(world.npcs).toHaveLength(12);
    expect(new Set(world.npcs.map(n => n.id)).size).toBe(12);
    expect(world.npcs[0].templateId).toBe("noble");
    expect(world.npcs.find(n => n.villageId === "village:2" && n.role === "항구 상인")).toBeDefined();
    expect(isCampaignWorld(world)).toBe(true);
  });
  it("does not change existing NPCs when another village is added", () => {
    expect(createCampaign(input, "a").npcs.slice(0, 4)).toEqual(generateVillageNpcs("a", input.villages[0]));
    expect(generateVillageNpcs("a", input.villages[0], 1)).not.toEqual(generateVillageNpcs("a", input.villages[0]));
  });
  it("uses 2024 SRD stats, including commoner Training and revised scout skills", () => {
    expect(NPC_STAT_BLOCKS.commoner.traits[0].includes("이점")).toBe(true);
    expect(NPC_STAT_BLOCKS.guard).toMatchObject({ ac: 16, hp: 11, cr: "1/8", abilities: [13, 12, 12, 10, 11, 10] });
    expect(NPC_STAT_BLOCKS.scout.skills.includes("은신 +6")).toBe(true);
    expect(abilityModifier(9)).toBe(-1);
    expect(abilityModifier(16)).toBe(3);
  });
  it("round-trips hierarchy, NPC edits and GM notes through FPB", async () => {
    const project = createPlanetProject({
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test",
      mapPayload: `1.135|test\r\n${"x".repeat(150)}`
    });
    project.campaign = createCampaign(input, "a");
    project.campaign.mapLevel = "region";
    project.campaign.npcs[0].notes = "GM only: keep this note";
    project.campaign.npcs[0].edited = true;
    expect((await decodePlanetProject(await encodePlanetProject(project))).campaign).toEqual(project.campaign);
  });
  it("rejects malformed NPCs, unknown rule templates and broken parents", () => {
    const invalid = createCampaign(input, "a");
    invalid.units[0].parentId = "country:2";
    expect(isCampaignWorld(invalid)).toBe(false);
    expect(isCampaignWorld({ ...createCampaign(input, "a"), npcs: [{ id: "npc:1" }] })).toBe(false);
    expect(isCampaignWorld({ ...createCampaign(input, "a"), generation: -1 })).toBe(false);
  });
  it("strips all culture, religion, arbitrary zone data and related economic modifiers", () => {
    const world = {
      cells: { i: [0, 1], culture: new Uint16Array([1, 2]), religion: new Uint16Array([2, 1]) },
      cultures: [{ name: "old culture" }],
      religions: [{ name: "old religion" }],
      zones: [{ name: "old zone" }],
      burgs: [{ i: 1, culture: 2, temple: 1 }],
      states: [{ i: 1, culture: 2 }],
      goods: [{ multipliers: { culture: { 1: 2 }, religion: { 1: 2 }, cultureType: { Hunting: 2 }, state: { 1: 2 } } }],
      markers: [
        { i: 1, type: "sacred-forests" },
        { i: 2, type: "inns" }
      ]
    } as unknown as PackedGraph;
    expect(removeLegacyDivisions(world)).toEqual(["marker1"]);
    expect(world.cultures).toEqual([]);
    expect(world.religions).toEqual([]);
    expect(world.zones).toEqual([]);
    expect([...world.cells.culture]).toEqual([0, 0]);
    expect([...world.cells.religion]).toEqual([0, 0]);
    expect(world.goods[0].multipliers).toEqual({ state: { 1: 2 } });
    expect(world.markers).toHaveLength(1);
    expect(world.burgs[0].temple).toBe(0);
  });
});
