import type { NpcClassId } from "@/types/campaign-world";

export type RulesReferenceEdition = "2014" | "2024";
export type RulesReferenceKind = "character" | "item";
export interface RulesReferenceLink {
  id: string;
  label: string;
  url: string;
}

// External research links only. No wiki rules text is bundled or fetched at runtime.
export const RULES_REFERENCE_SITES = {
  "2014": {
    home: "https://dnd5e.wikidot.com/",
    species: "https://dnd5e.wikidot.com/lineage",
    spells: "https://dnd5e.wikidot.com/spells",
    equipment: "https://dnd5e.wikidot.com/adventuring-gear",
    items: "https://dnd5e.wikidot.com/wondrous-items"
  },
  "2024": {
    home: "https://dnd2024.wikidot.com/",
    species: "https://dnd2024.wikidot.com/species:all",
    feats: "https://dnd2024.wikidot.com/feat:all",
    spells: "https://dnd2024.wikidot.com/spell:all",
    equipment: "https://dnd2024.wikidot.com/equipment:all",
    items: "https://dnd2024.wikidot.com/magic-item:all"
  }
} as const;

const classPaths: Record<Exclude<NpcClassId, "none">, string> = {
  fighter: "fighter",
  paladin: "paladin",
  wizard: "wizard",
  sorcerer: "sorcerer",
  warlock: "warlock",
  cleric: "cleric",
  druid: "druid",
  ranger: "ranger",
  rogue: "rogue",
  bard: "bard",
  barbarian: "barbarian",
  monk: "monk"
};

export function rulesReferenceLinks(
  kind: RulesReferenceKind,
  edition: RulesReferenceEdition,
  classId: NpcClassId = "none"
): RulesReferenceLink[] {
  const site = RULES_REFERENCE_SITES[edition];
  const link = (id: string, label: string, url: string): RulesReferenceLink => ({ id, label, url });
  const shared = [
    link("items", "마법 아이템 목록", site.items),
    link("equipment", "일반 장비 목록", site.equipment),
    link("spells", "주문 목록", site.spells)
  ];
  if (kind === "item") return shared;
  const links = [link("overview", "직업·배경·특기 목차", site.home)];
  if (classId !== "none" && Object.hasOwn(classPaths, classId))
    links.unshift(
      link("class", "선택한 직업 규칙", `${site.home}${classPaths[classId]}${edition === "2024" ? ":main" : ""}`)
    );
  links.push(link("species", "종족 목록", site.species));
  if (edition === "2024") links.push(link("feats", "특기 목록", RULES_REFERENCE_SITES[edition].feats));
  return [...links, ...shared];
}
