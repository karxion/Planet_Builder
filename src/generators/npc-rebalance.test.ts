import { describe, expect, it } from "vitest";
import { type AdministrativeSnapshot, createCampaign } from "./campaign-generator";
import { rebalanceCampaignNpcs } from "./npc-rebalance";

const input: AdministrativeSnapshot = {
  states: [{ id: 1, name: "군사 왕국", government: "military", x: 1, y: 1 }],
  fiefs: [],
  villages: [
    {
      id: 1,
      stateId: 1,
      fiefId: 0,
      name: "수도",
      x: 1,
      y: 1,
      capital: true,
      port: true,
      population: 50,
      continentId: 1
    },
    {
      id: 2,
      stateId: 1,
      fiefId: 0,
      name: "마을",
      x: 2,
      y: 2,
      capital: false,
      port: false,
      population: 1,
      continentId: 1
    }
  ]
};
describe("legacy NPC tier upgrade", () => {
  it("upgrades old identities without replacing their notes and adds national and continental talent once", () => {
    const world = createCampaign(input, "old");
    world.npcs = world.npcs.filter(n => Number(n.id.split(":").at(-1)) < 4);
    delete world.npcGenerationVersion;
    for (const n of world.npcs) delete n.progression;
    world.npcs[0].notes = "이름과 메모 보존";
    world.npcs[0].edited = true;
    const old = world.npcs.map(n => ({ id: n.id, name: n.name, notes: n.notes }));
    expect(rebalanceCampaignNpcs(world, input)).toBe(true);
    expect(world.npcs.slice(0, old.length).map(n => ({ id: n.id, name: n.name, notes: n.notes }))).toEqual(old);
    expect(
      world.npcs.some(n => n.progression?.scope === "country" && n.progression.level >= 9 && n.progression.level <= 12)
    ).toBe(true);
    expect(
      world.npcs.some(
        n => n.progression?.scope === "continent" && n.progression.level >= 13 && n.progression.level <= 16
      )
    ).toBe(true);
    expect(
      world.npcs
        .filter(n => n.villageId === "village:2" && n.progression?.classId !== "none")
        .every(n => n.progression!.level <= 4)
    ).toBe(true);
    const count = world.npcs.length;
    expect(rebalanceCampaignNpcs(world, input)).toBe(false);
    expect(world.npcs).toHaveLength(count);
  });
  it("preserves manually edited T5 and Epic NPCs during a forced rebalance", () => {
    const world = createCampaign(input, "manual");
    const npc = world.npcs.find(n => n.progression?.classId !== "none")!;
    npc.edited = true;
    for (const level of [18, 24]) {
      npc.progression!.level = level;
      rebalanceCampaignNpcs(world, input, true);
      expect(npc.progression!.level).toBe(level);
    }
  });
});
