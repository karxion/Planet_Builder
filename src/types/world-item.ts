import type { MagicItemCategory, MagicItemRarity } from "./magic-item-reference";

export type UniqueItemSkill =
  | "athletics"
  | "stealth"
  | "perception"
  | "arcana"
  | "insight"
  | "persuasion"
  | "survival"
  | "medicine";

export interface LegacyUniqueItemBonus {
  version: 1;
  skill: UniqueItemSkill;
  checkBonus: number;
  effect: "forceDamage" | "temporaryHp" | "healing";
  magnitude: number;
}

export type UniqueEffectAxis = "category" | "nation" | "rarity" | "history" | "geography";
export type ItemGeography =
  | "unknown"
  | "coast"
  | "forest"
  | "mountain"
  | "desert"
  | "tundra"
  | "swamp"
  | "plains"
  | "underground";
export interface UniqueItemOrigin {
  archetype: import("./campaign-world").CountryArchetype;
  geography: ItemGeography;
}
export interface ContextualUniqueItemBonus {
  version: 2;
  effects: { id: string; axis: UniqueEffectAxis }[];
}
export type UniqueItemBonus = LegacyUniqueItemBonus | ContextualUniqueItemBonus;

export type ItemOwner =
  | { kind: "none" }
  | { kind: "npc" | "unit"; id: string; label: string }
  | { kind: "custom"; label: string };

export interface ItemDungeonLink {
  markerId: number;
  cell: number;
  name: string;
}

export interface WorldMagicItem {
  id: string;
  name: string;
  category: MagicItemCategory;
  rarity: MagicItemRarity;
  unique: boolean;
  uniqueBonus?: UniqueItemBonus;
  origin?: UniqueItemOrigin;
  appearance: string;
  power: string;
  history: string;
  notes: string;
  owner: ItemOwner;
  reward?: ItemDungeonLink;
  referenceId?: string;
  variant?: string;
  sourceTreasureId?: string;
  image?: string;
  edited: boolean;
}

export interface ItemLibrary {
  version: 1;
  items: WorldMagicItem[];
  deletedIds: string[];
}

export interface ItemDungeonChoice extends ItemDungeonLink {
  x: number;
  y: number;
}
