export type CreatureType =
  | "aberration"
  | "beast"
  | "celestial"
  | "construct"
  | "dragon"
  | "elemental"
  | "fey"
  | "fiend"
  | "giant"
  | "humanoid"
  | "monstrosity"
  | "ooze"
  | "plant"
  | "undead";
export interface AdventureSite {
  version: 1;
  themeId: string;
  monsterId: string;
  inhabitants: number;
  cleared: boolean;
  edited: boolean;
  generation: number;
}
export interface AdventureSettings {
  settlementDistance: number;
  siteDistance: number;
  maxPerCountry: number;
}
export interface AdventureSnapshot {
  width: number;
  height: number;
  countries: { id: number; name: string }[];
  cells: { id: number; stateId: number; x: number; y: number; height: number }[];
  settlements: { x: number; y: number; city: boolean }[];
  markers: { x: number; y: number; stateId: number; adventure: boolean }[];
}
export interface AdventurePlacement {
  cell: number;
  stateId: number;
  x: number;
  y: number;
  name: string;
  adventure: AdventureSite;
}
export interface AdventurePlacementResult {
  placements: AdventurePlacement[];
  countries: { stateId: number; target: number; existing: number; added: number; missing: number }[];
}
