export type ItemReferenceEdition = "2014" | "2024" | "mixed";
export type MagicItemRarity = "common" | "uncommon" | "rare" | "veryRare" | "legendary" | "artifact";
export type MagicItemCategory =
  | "armor"
  | "weapon"
  | "potion"
  | "ring"
  | "rod"
  | "staff"
  | "wand"
  | "scroll"
  | "wondrous";

export interface MagicItemReference {
  id: string;
  edition: "2014" | "2024";
  name: string;
  metadata: string;
  rules: string;
  page: number;
  endPage: number;
  category: MagicItemCategory;
  rarities: MagicItemRarity[];
  rarityVaries: boolean;
  attunement: boolean;
}

export interface TreasureDesign {
  version: 1;
  referenceId: string;
  edition: "2014" | "2024";
  method: "reskin" | "inspired";
  variant?: string;
}
