import Alea from "alea";
import {
  CLASS_PROFILES,
  COMMONER_CR_PROFILES,
  COUNTRY_CLASS_WEIGHTS,
  NPC_EPIC_MIN_LEVEL,
  NPC_PROFESSIONS,
  NPC_PROFILE_MAX_LEVEL,
  NPC_TIER_RANGES
} from "@/data/npc-progression";
import { abilityModifier, NPC_STAT_BLOCKS } from "@/data/npc-stat-blocks";
import type {
  CommonerCr,
  CountryArchetype,
  CountryNpcProfile,
  NpcClassId,
  NpcProgression,
  NpcTier,
  WorldNpc
} from "@/types/campaign-world";
import type { AdministrativeSnapshot } from "./campaign-generator";

export interface NpcGenerationContext {
  archetype: CountryArchetype;
  nationalSeat: boolean;
  continentalSeat: boolean;
}

export function inferCountryArchetype(government: string): CountryArchetype {
  if (/교국|신정|성국|theocra|holy|pontifica/i.test(government)) return "theocratic";
  if (/마법|마도|비전|magocra|arcane|wizard/i.test(government)) return "arcane";
  if (/군사|군정|기사단|military|stratocra|knight/i.test(government)) return "military";
  if (/자연|삼림|드루이드|druid|sylvan|nature/i.test(government)) return "nature";
  if (/상업|무역|상인|merchant|trade|mercantile/i.test(government)) return "mercantile";
  return "balanced";
}

export function npcTier(level: number): NpcTier {
  if (!Number.isSafeInteger(level) || level < 1) throw new RangeError("Invalid NPC level");
  if (level >= NPC_EPIC_MIN_LEVEL) return "epic";
  return (NPC_TIER_RANGES.findIndex(([, max]) => level <= max) + 1) as Exclude<NpcTier, "epic">;
}
export const isNpcCity = (village: AdministrativeSnapshot["villages"][number]): boolean =>
  village.capital || (village.population || 0) > 5;

export function generateCommonerCr(seed: string, npcId: string): CommonerCr {
  const variants = Object.entries(COMMONER_CR_PROFILES) as [CommonerCr, { weight: number }][];
  let roll = Alea(`${seed}:${npcId}:commoner-cr-v1`)() * variants.reduce((sum, [, profile]) => sum + profile.weight, 0);
  for (const [cr, profile] of variants) {
    roll -= profile.weight;
    if (roll < 0) return cr;
  }
  return "0";
}

export function npcCommonerProfile(npc: WorldNpc) {
  if (npc.progression?.classId !== "none") return undefined;
  const cr = npc.progression.commonerCr || "0";
  const { ac, hp, attackBonus, damage, xp } = COMMONER_CR_PROFILES[cr];
  return {
    kind: cr === "0" ? ("srd-commoner" as const) : ("fpb-commoner-variant" as const),
    cr,
    ac,
    hp,
    attackBonus,
    damage,
    xp,
    proficiency: 2,
    speedFt: 30,
    damageType: "bludgeoning" as const,
    attacksPerAction: 1,
    reachFt: 5
  };
}

export function buildNpcContexts(input: AdministrativeSnapshot, profiles: CountryNpcProfile[] = []) {
  const contexts = new Map<number, NpcGenerationContext>();
  const archetypes = new Map(input.states.map(state => [state.id, inferCountryArchetype(state.government || "")]));
  for (const profile of profiles) archetypes.set(profile.stateId, profile.archetype);
  const continentalSeats = new Map<number, AdministrativeSnapshot["villages"][number]>();
  const nationalSeats = new Map<number, AdministrativeSnapshot["villages"][number]>();
  const ranked = [...input.villages].sort((a, b) => (b.population || 0) - (a.population || 0) || a.id - b.id);
  for (const village of ranked) {
    if (!isNpcCity(village)) continue;
    if (village.capital && village.stateId && !nationalSeats.has(village.stateId))
      nationalSeats.set(village.stateId, village);
    if (village.continentId !== undefined && !continentalSeats.has(village.continentId)) {
      continentalSeats.set(village.continentId, village);
    }
  }
  for (const village of input.villages) {
    contexts.set(village.id, {
      archetype: archetypes.get(village.stateId) || "balanced",
      nationalSeat: nationalSeats.get(village.stateId)?.id === village.id,
      continentalSeat: village.continentId !== undefined && continentalSeats.get(village.continentId)?.id === village.id
    });
  }
  return contexts;
}

export function generateNpcProgression(
  seed: string,
  npcId: string,
  village: AdministrativeSnapshot["villages"][number],
  slot: number,
  context: NpcGenerationContext
): NpcProgression {
  const random = Alea(`${seed}:${npcId}:progression-v1`);
  const tier = slot === 6 ? 4 : slot >= 4 ? 3 : isNpcCity(village) && [0, 3].includes(slot) ? 2 : 1;
  const [min, max] = NPC_TIER_RANGES[tier - 1];
  const common = slot === 2 || (slot === 0 && !isNpcCity(village));
  const noble = slot === 4 || (slot === 0 && isNpcCity(village));
  const weights = Object.entries(COUNTRY_CLASS_WEIGHTS[context.archetype]) as [Exclude<NpcClassId, "none">, number][];
  // Knights are a profession; martial training is represented by Fighter or Paladin.
  if (slot === 1) {
    for (const entry of weights) if (["fighter", "paladin"].includes(entry[0])) entry[1] *= 3;
  }
  if (slot === 3 && tier === 1) {
    for (const entry of weights) if (["ranger", "druid", "rogue"].includes(entry[0])) entry[1] *= 4;
  }
  let roll = random() * weights.reduce((total, [, weight]) => total + weight, 0);
  const classId = common
    ? "none"
    : weights.find(([, weight]) => {
        roll -= weight;
        return roll < 0;
      })![0];
  const lower = noble ? Math.max(min, max - 2) : min;
  return {
    level: common ? 1 : lower + Math.floor(random() * (max - lower + 1)),
    classId,
    rank: common
      ? "common"
      : noble
        ? "noble"
        : tier === 4
          ? "legendary"
          : tier === 3
            ? "elite"
            : tier === 2
              ? "notable"
              : "trained",
    scope: tier === 4 ? "continent" : tier === 3 ? "country" : "settlement",
    archetype: context.archetype,
    ...(common ? { commonerCr: generateCommonerCr(seed, npcId) } : {})
  };
}

export function npcProfession(progression: NpcProgression): string {
  const title = NPC_PROFESSIONS[progression.classId];
  if (progression.scope === "continent") return `전설의 ${title}`;
  if (progression.rank === "noble") return `${progression.scope === "country" ? "대귀족" : "영주"} · ${title}`;
  if (progression.scope === "country") return `국가 수석 ${title}`;
  return title;
}

export function npcCombatProfile(npc: WorldNpc) {
  const progression = npc.progression;
  if (!progression || progression.classId === "none" || progression.level > NPC_PROFILE_MAX_LEVEL) return undefined;
  const { level, classId } = progression;
  const profile = CLASS_PROFILES[classId];
  const abilities = [...NPC_STAT_BLOCKS[npc.templateId].abilities];
  abilities[2] = Math.max(abilities[2], 14);
  abilities[profile.primary] = Math.max(abilities[profile.primary], Math.min(20, 16 + Math.floor(level / 4)));
  if (profile.casting !== undefined) abilities[profile.casting] = Math.max(abilities[profile.casting], 14);
  const constitution = abilityModifier(abilities[2]);
  const proficiency = 2 + Math.floor((level - 1) / 4);
  const primary = abilityModifier(abilities[profile.primary]);
  return {
    kind: "fpb-simplified-level-profile" as const,
    level,
    classId,
    abilities,
    hp: profile.hitDie + constitution + (level - 1) * (profile.hitDie / 2 + 1 + constitution),
    ac: profile.armor,
    proficiency,
    attackBonus: proficiency + primary,
    spellSaveDc:
      profile.casting !== undefined ? 8 + proficiency + abilityModifier(abilities[profile.casting]) : undefined
  };
}
