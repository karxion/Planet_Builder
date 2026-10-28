import type { UndergroundMap } from "./underground";
import type { SeaRelation, UnderwaterMap } from "./underwater";
import type { NpcProgression } from "./campaign-world";

export const SPACE_IDS = ["surface", "underwater", "underground"] as const;
export type WorldSpace = (typeof SPACE_IDS)[number];
export const SITE_KINDS = ["city", "territory", "terrain", "gateway"] as const;
export type SpaceSiteKind = (typeof SITE_KINDS)[number];
export const TERRAIN_KINDS = ["plain", "reef", "trench", "cavern", "lake", "rock"] as const;
export type SpaceTerrain = (typeof TERRAIN_KINDS)[number];

export interface SpaceFaction {
  id: string;
  name: string;
  color: string;
  notes: string;
  people?: string;
}

export interface SpaceSite {
  id: string;
  space: WorldSpace;
  kind: SpaceSiteKind;
  name: string;
  /** Normalized world-map coordinates, shared by every space. */
  x: number;
  y: number;
  /** Distance below sea level (underwater) or local surface (underground). */
  depth: number;
  radius: number;
  terrain: SpaceTerrain;
  factionId?: string;
  residents: string;
  population: number;
  capital?: boolean;
  notes: string;
  origin?: "underground" | "underwater";
  /** Edited generated places survive explicit space regeneration. */
  edited?: boolean;
}

export interface SpaceLink {
  id: string;
  name: string;
  from: string;
  to: string;
  origin?: "underground" | "underwater";
  path?: { x: number; y: number }[];
  transport?: "land" | "water";
}

export interface WorldSpacesData {
  version: 1;
  activeSpace: WorldSpace;
  sites: SpaceSite[];
  factions: SpaceFaction[];
  links: SpaceLink[];
  underground?: UndergroundMap;
  underwater?: UnderwaterMap;
  relations?: SeaRelation[];
  content?: SpaceContent;
}

export interface SpaceNpc {
  id: string;
  siteId: string;
  name: string;
  role: string;
  people: string;
  interaction: "trade" | "quest" | "lore";
  greeting: string;
  offer: string;
  notes: string;
  edited: boolean;
  progression?: NpcProgression;
}
export interface SpaceItem {
  id: string;
  siteId: string;
  npcId: string;
  name: string;
  category: string;
  rarity: "rare" | "veryRare" | "legendary";
  effects: string[];
  history: string;
  notes: string;
  edited: boolean;
}
export interface SpaceContent {
  version: 1;
  npcs: SpaceNpc[];
  items: SpaceItem[];
}
