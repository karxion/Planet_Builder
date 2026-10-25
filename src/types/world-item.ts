import type { MagicItemCategory, MagicItemRarity } from "./magic-item-reference";

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
