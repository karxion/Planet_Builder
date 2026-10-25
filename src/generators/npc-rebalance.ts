import { MAJOR_NPC_GOALS } from "@/data/npc-progression";
import type { CampaignWorld } from "@/types/campaign-world";
import { type AdministrativeSnapshot, generateVillageNpcs } from "./campaign-generator";
import { buildNpcContexts, generateNpcProgression, npcProfession } from "./npc-progression";

export function rebalanceCampaignNpcs(
  world: CampaignWorld,
  input: AdministrativeSnapshot,
  force = false,
  refillSeats?: Set<string>
): boolean {
  const contexts = buildNpcContexts(input, world.npcProfiles);
  const homes = new Map(input.villages.map(v => [`village:${v.id}`, v]));
  let changed = false;
  for (const npc of world.npcs) {
    if (npc.progression && (!force || npc.edited)) continue;
    const home = homes.get(npc.villageId);
    if (!home) continue;
    const parsed = Number(npc.id.split(":").at(-1));
    const slot =
      Number.isInteger(parsed) && parsed >= 0 && parsed <= 6
        ? parsed
        : npc.templateId === "noble"
          ? 0
          : npc.templateId === "guard"
            ? 1
            : npc.templateId === "scout"
              ? 3
              : 2;
    npc.progression = generateNpcProgression(world.seed, npc.id, home, slot, contexts.get(home.id)!);
    if (!npc.edited && npc.progression.classId !== "none") npc.role = npcProfession(npc.progression);
    changed = true;
  }
  if (!world.npcGenerationVersion || refillSeats) {
    const occupied = new Set(world.npcs.map(npc => `${npc.villageId}:${npc.id.split(":").at(-1)}`));
    for (const home of input.villages) {
      if (refillSeats && !refillSeats.has(`village:${home.id}`)) continue;
      const context = contexts.get(home.id)!;
      const slots = [...(context.nationalSeat ? [4, 5] : []), ...(context.continentalSeat ? [6] : [])];
      if (!slots.length) continue;
      const identities = generateVillageNpcs(`${world.seed}:major`, home, world.generation);
      for (const slot of slots) {
        if (occupied.has(`village:${home.id}:${slot}`)) continue;
        if (
          slot === 6 &&
          world.npcs.some(
            npc => npc.progression?.scope === "continent" && homes.get(npc.villageId)?.continentId === home.continentId
          )
        )
          continue;
        const id = `npc:${home.id}:${world.generation}:${slot}`;
        const progression = generateNpcProgression(world.seed, id, home, slot, context);
        world.npcs.push({
          ...identities[slot % 4],
          id,
          templateId: slot === 5 ? "guard" : "noble",
          progression,
          role: npcProfession(progression),
          goal: `${home.name}에서 ${MAJOR_NPC_GOALS[slot === 6 ? "continent" : "country"][slot % 4]}`,
          notes: "",
          edited: false
        });
        changed = true;
      }
    }
    world.npcGenerationVersion = 1;
    changed = true;
  }
  return changed;
}
