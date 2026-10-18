import type { CountryArchetype } from "@/types/campaign-world";
import type { MagicItemCategory, MagicItemRarity, MagicItemReference } from "@/types/magic-item-reference";
import { SRD_MAGIC_ITEMS } from "./srd-magic-items.generated";

export const MAGIC_ITEM_SOURCES = {
  "2014": { label: "SRD 5.1 · 2014", url: "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf" },
  "2024": { label: "SRD 5.2.1 · 2024", url: "https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf" }
};
export const MAGIC_ITEM_CATEGORIES: Record<MagicItemCategory, string> = {
  armor: "갑옷·방패",
  weapon: "무기·탄약",
  potion: "물약",
  ring: "반지",
  rod: "로드",
  staff: "스태프",
  wand: "완드",
  scroll: "스크롤",
  wondrous: "경이로운 물건"
};
export const TREASURE_FORMS: Record<MagicItemCategory, string> = {
  armor: "수호 갑주",
  weapon: "의장 병기",
  potion: "봉인 영약",
  ring: "서약 반지",
  rod: "권능의 홀",
  staff: "현자의 지팡이",
  wand: "비전의 주문봉",
  scroll: "계승 두루마리",
  wondrous: "전승 성물"
};
export const MAGIC_ITEM_REFERENCES = SRD_MAGIC_ITEMS;
export const MAGIC_ITEM_BY_ID = new Map(MAGIC_ITEM_REFERENCES.map(reference => [reference.id, reference]));
export interface ReferenceOption {
  reference: MagicItemReference;
  rarity: MagicItemRarity;
  variant?: string;
}

const giantBelt = [
  ["rare", "Hill giant (Strength 21)"],
  ["veryRare", "Stone/frost giant (Strength 23)"],
  ["veryRare", "Fire giant (Strength 25)"],
  ["legendary", "Cloud giant (Strength 27)"],
  ["legendary", "Storm giant (Strength 29)"]
] as const;
const giantPotion = [
  ["uncommon", "Hill giant (Strength 21)"],
  ["rare", "Frost/stone giant (Strength 23)"],
  ["rare", "Fire giant (Strength 25)"],
  ["veryRare", "Cloud giant (Strength 27)"],
  ["legendary", "Storm giant (Strength 29)"]
] as const;
const healing = [
  ["common", "Healing (2d4 + 2)"],
  ["uncommon", "Greater healing (4d4 + 4)"],
  ["rare", "Superior healing (8d4 + 8)"],
  ["veryRare", "Supreme healing (10d4 + 20)"]
] as const;
const scrolls = [
  ["common", "Cantrip"],
  ["common", "Level 1"],
  ["uncommon", "Level 2"],
  ["uncommon", "Level 3"],
  ["rare", "Level 4"],
  ["rare", "Level 5"],
  ["veryRare", "Level 6"],
  ["veryRare", "Level 7"],
  ["veryRare", "Level 8"],
  ["legendary", "Level 9"]
] as const;
const variableTables: Record<string, readonly (readonly [MagicItemRarity, string])[]> = {
  "Belt of Giant Strength": giantBelt,
  "Potion of Giant Strength": giantPotion,
  "Potion of Healing": healing,
  "Potions of Healing": healing,
  "Spell Scroll": scrolls,
  "Horn of Valhalla": [
    ["rare", "Silver"],
    ["rare", "Brass"],
    ["veryRare", "Bronze"],
    ["legendary", "Iron"]
  ],
  "Crystal Ball": [
    ["veryRare", "Standard"],
    ["legendary", "Mind Reading"],
    ["legendary", "Telepathy"],
    ["legendary", "True Seeing"]
  ]
};
const rarityMap: Record<string, MagicItemRarity> = {
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  "very rare": "veryRare",
  legendary: "legendary",
  artifact: "artifact"
};

export function referenceOptions(reference: MagicItemReference): ReferenceOption[] {
  const table = variableTables[reference.name];
  if (table && (reference.rarityVaries || reference.rarities.length > 1))
    return table.map(([rarity, variant]) => ({ reference, rarity, variant }));
  if (reference.rarityVaries) {
    const options = [
      ...reference.rules.matchAll(/^([A-Z][A-Za-z -]+)\s*\((Common|Uncommon|Rare|Very Rare|Legendary)\)\./gm)
    ];
    return options.map(match => ({ reference, rarity: rarityMap[match[2].toLowerCase()], variant: match[1].trim() }));
  }
  if (reference.name === "Feather Token") {
    return ["Anchor", "Bird", "Fan", "Swan Boat", "Tree", "Whip"].map(variant => ({
      reference,
      rarity: reference.rarities[0],
      variant
    }));
  }
  if (reference.rarities.length > 1) {
    return [...reference.metadata.matchAll(/\b(very rare|uncommon|common|rare|legendary)\s*\(([^)]+)\)/gi)].map(
      match => ({ reference, rarity: rarityMap[match[1].toLowerCase()], variant: match[2] })
    );
  }
  return reference.rarities.map(rarity => ({ reference, rarity }));
}

export const ALL_REFERENCE_OPTIONS = MAGIC_ITEM_REFERENCES.flatMap(referenceOptions);
export const CATEGORY_WEIGHTS: Record<CountryArchetype, Partial<Record<MagicItemCategory, number>>> = {
  balanced: {},
  military: { weapon: 6, armor: 5 },
  arcane: { wand: 6, staff: 5, rod: 4, scroll: 3, ring: 3 },
  theocratic: { staff: 4, rod: 4, wondrous: 3 },
  nature: { staff: 5, potion: 3, wondrous: 2 },
  mercantile: { wondrous: 4, ring: 3 }
};

export const optionKey = (option: ReferenceOption): string => `${option.reference.id}|${option.variant || ""}`;
export function referenceSourceUrl(reference: MagicItemReference): string {
  return `${MAGIC_ITEM_SOURCES[reference.edition].url}#page=${reference.page}`;
}
