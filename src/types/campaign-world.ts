export type AdministrationLevel = "village" | "fief" | "region" | "country";
export type NpcTemplateId = "commoner" | "guard" | "scout" | "noble";

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
}

export interface CampaignWorld {
  version: 1;
  ruleset: "srd-5.2.1";
  seed: string;
  generation: number;
  mapLevel?: AdministrationLevel;
  units: AdministrativeUnit[];
  npcs: WorldNpc[];
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
