import type { UndergroundMap } from "./underground";

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
  notes: string;
  origin?: "underground";
  /** Edited generated places survive explicit underground regeneration. */
  edited?: boolean;
}

export interface SpaceLink {
  id: string;
  name: string;
  from: string;
  to: string;
  origin?: "underground";
}

export interface WorldSpacesData {
  version: 1;
  activeSpace: WorldSpace;
  sites: SpaceSite[];
  factions: SpaceFaction[];
  links: SpaceLink[];
  underground?: UndergroundMap;
}
