import type { ItemReferenceEdition, TreasureDesign } from "./magic-item-reference";

export type ItemRarity = "rare" | "veryRare" | "legendary";
export type DndAlignment = "LG" | "NG" | "CG" | "LN" | "N" | "CN" | "LE" | "NE" | "CE";
export type DeityRank = "lesser" | "intermediate" | "greater";

export interface NationHeritage {
  stateId: number;
  ageYears: number;
}

export interface RealmTreasure {
  id: string;
  stateId: number;
  ownerType: "country" | "city";
  settlementId?: string;
  name: string;
  rarity: ItemRarity;
  unique: boolean;
  power: string;
  symbolism: string;
  rpEffect: string;
  history: string;
  notes: string;
  edited: boolean;
  design?: TreasureDesign;
}

export interface RealmReligion {
  id: string;
  stateId: number;
  name: string;
  symbol: string;
  alignment: DndAlignment;
  deityName: string;
  deityRank: DeityRank;
  doctrine: string;
  headquartersId: string;
  notes: string;
  edited: boolean;
}

export interface RealmHeritage {
  version: 1;
  nations: NationHeritage[];
  treasures: RealmTreasure[];
  religions: RealmReligion[];
  showHeadquarters: boolean;
  itemReferenceEdition?: ItemReferenceEdition;
}
