import type { RealmHeritage } from "./realm-heritage";

export type AdministrationLevel = "village" | "fief" | "region" | "country";
export type NpcTemplateId = "commoner" | "guard" | "scout" | "noble";
export type CountryArchetype = "balanced" | "military" | "arcane" | "theocratic" | "nature" | "mercantile";
export type NpcClassId =
  | "none"
  | "fighter"
  | "paladin"
  | "wizard"
  | "sorcerer"
  | "warlock"
  | "cleric"
  | "druid"
  | "ranger"
  | "rogue"
  | "bard"
  | "barbarian"
  | "monk";
export type NpcRank = "common" | "trained" | "notable" | "noble" | "elite" | "legendary";
export type NpcScope = "settlement" | "country" | "continent";
export type CommonerCr = "0" | "1/8" | "1/4" | "1/2";
export type NpcTier = 1 | 2 | 3 | 4 | 5 | "epic";

export interface NpcProgression {
  level: number;
  classId: NpcClassId;
  rank: NpcRank;
  scope: NpcScope;
  archetype: CountryArchetype;
  commonerCr?: CommonerCr;
}

export interface CountryNpcProfile {
  stateId: number;
  archetype: CountryArchetype;
}

export interface AdministrativeUnit {
  id: string;
  level: AdministrationLevel;
  name: string;
  parentId?: string;
  sourceId: number;
  stateId: number;
  x: number;
  y: number;
}

export interface WorldNpc {
  id: string;
  villageId: string;
  name: string;
  role: string;
  templateId: NpcTemplateId;
  appearance: string;
  personality: string;
  goal: string;
  secret: string;
  notes: string;
  edited: boolean;
  progression?: NpcProgression;
}

export interface CampaignWorld {
  version: 1;
  ruleset: "srd-5.2.1";
  seed: string;
  generation: number;
  mapLevel?: AdministrationLevel;
  units: AdministrativeUnit[];
  npcs: WorldNpc[];
  npcProfiles?: CountryNpcProfile[];
  npcGenerationVersion?: 1;
  heritage?: RealmHeritage;
}

export interface NpcStatBlock {
  name: string;
  page: number;
  ac: number;
  hp: number;
  hitDice: string;
  cr: string;
  xp: number;
  abilities: [number, number, number, number, number, number];
  skills: string;
  passivePerception: number;
  languages: string;
  gear: string;
  traits: string[];
  actions: string[];
  reactions: string[];
}
