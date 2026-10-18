import { COMMONER_CR_PROFILES, COUNTRY_ARCHETYPES, NPC_CLASSES, NPC_RANKS, NPC_SCOPES } from "@/data/npc-progression";
import { isRealmHeritage } from "@/data/realm-heritage-validation";
import type { CampaignWorld, NpcProgression } from "@/types/campaign-world";

export function isNpcProgression(value: unknown): value is NpcProgression {
  if (!value || typeof value !== "object") return false;
  const profile = value as NpcProgression;
  return (
    Number.isSafeInteger(profile.level) &&
    profile.level >= 1 &&
    Object.hasOwn(NPC_CLASSES, profile.classId) &&
    Object.hasOwn(NPC_RANKS, profile.rank) &&
    Object.hasOwn(NPC_SCOPES, profile.scope) &&
    Object.hasOwn(COUNTRY_ARCHETYPES, profile.archetype) &&
    (profile.classId !== "none" || profile.level === 1) &&
    (profile.commonerCr === undefined ||
      (profile.classId === "none" &&
        typeof profile.commonerCr === "string" &&
        Object.hasOwn(COMMONER_CR_PROFILES, profile.commonerCr)))
  );
}

export function isCampaignWorld(value: unknown): value is CampaignWorld {
  if (!value || typeof value !== "object") return false;
  const world = value as CampaignWorld;
  if (world.heritage !== undefined && !isRealmHeritage(world.heritage)) return false;
  if (world.npcGenerationVersion !== undefined && world.npcGenerationVersion !== 1) return false;
  if (world.npcProfiles !== undefined) {
    if (!Array.isArray(world.npcProfiles) || world.npcProfiles.length > 100000) return false;
    const states = new Set<number>();
    for (const profile of world.npcProfiles) {
      if (
        !profile ||
        !Number.isSafeInteger(profile.stateId) ||
        profile.stateId < 0 ||
        !Object.hasOwn(COUNTRY_ARCHETYPES, profile.archetype) ||
        states.has(profile.stateId)
      )
        return false;
      states.add(profile.stateId);
    }
  }
  if (world.mapLevel && !["village", "fief", "region", "country"].includes(world.mapLevel)) return false;
  if (
    world.version !== 1 ||
    world.ruleset !== "srd-5.2.1" ||
    typeof world.seed !== "string" ||
    !Number.isSafeInteger(world.generation) ||
    world.generation < 0 ||
    !Array.isArray(world.units) ||
    world.units.length > 100000 ||
    !Array.isArray(world.npcs) ||
    world.npcs.length > 100000
  )
    return false;
  const ids = new Set<string>();
  for (const unit of world.units) {
    if (
      !unit ||
      !["village", "fief", "region", "country"].includes(unit.level) ||
      typeof unit.id !== "string" ||
      !/^(village|fief|region|country):[0-9:]+$/.test(unit.id) ||
      ids.has(unit.id) ||
      typeof unit.name !== "string" ||
      unit.name.length > 200 ||
      !Number.isFinite(unit.x) ||
      !Number.isFinite(unit.y) ||
      !Number.isSafeInteger(unit.sourceId) ||
      !Number.isSafeInteger(unit.stateId)
    )
      return false;
    ids.add(unit.id);
  }
  const byId = new Map(world.units.map(unit => [unit.id, unit]));
  const parentLevels = { village: "fief", fief: "region", region: "country" };
  for (const unit of world.units) {
    if (unit.level === "country") {
      if (unit.parentId) return false;
      continue;
    }
    const parent = byId.get(unit.parentId || "");
    if (!parent || parent.level !== parentLevels[unit.level] || parent.stateId !== unit.stateId) return false;
  }
  const npcIds = new Set<string>();
  for (const npc of world.npcs) {
    if (
      !npc ||
      typeof npc.id !== "string" ||
      !/^npc:[0-9:]+$/.test(npc.id) ||
      npcIds.has(npc.id) ||
      typeof npc.villageId !== "string" ||
      !["commoner", "guard", "scout", "noble"].includes(npc.templateId) ||
      typeof npc.edited !== "boolean"
    )
      return false;
    if (npc.progression !== undefined && !isNpcProgression(npc.progression)) return false;
    for (const field of ["name", "role", "appearance", "personality", "goal", "secret", "notes"] as const) {
      if (typeof npc[field] !== "string" || npc[field].length > 4000) return false;
    }
    npcIds.add(npc.id);
  }
  return true;
}
