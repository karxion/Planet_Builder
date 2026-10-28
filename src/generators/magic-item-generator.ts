import Alea from "alea";
import { generatedTemplate as gf, generatedText as gt } from "@/utils/generation-text";
import {
  ALL_REFERENCE_OPTIONS,
  CATEGORY_WEIGHTS,
  MAGIC_ITEM_BY_ID,
  MAGIC_ITEM_CATEGORIES,
  optionKey,
  type ReferenceOption,
  referenceOptions
} from "@/data/magic-item-references";
import type { CountryArchetype } from "@/types/campaign-world";
import type { ItemReferenceEdition, MagicItemCategory, TreasureDesign } from "@/types/magic-item-reference";
import type { ItemRarity, RealmTreasure } from "@/types/realm-heritage";

export function eligibleItemReferences(rarity: ItemRarity, edition: ItemReferenceEdition): ReferenceOption[] {
  return ALL_REFERENCE_OPTIONS.filter(
    option => option.rarity === rarity && (edition === "mixed" || option.reference.edition === edition)
  );
}

export function chooseItemReference(
  seed: string,
  itemId: string,
  rarity: ItemRarity,
  edition: ItemReferenceEdition = "mixed",
  archetype: CountryArchetype = "balanced",
  category?: MagicItemCategory
): ReferenceOption {
  const random = Alea(`${seed}:${itemId}:reference-v1:${edition}`);
  const selectedEdition = edition === "mixed" ? (random() < 0.5 ? "2014" : "2024") : edition;
  const compatible = eligibleItemReferences(rarity, selectedEdition);
  const candidates = category ? compatible.filter(option => option.reference.category === category) : compatible;
  if (!candidates.length) throw new Error("No compatible magic item references");
  // Weight item families, not their subtype count, to avoid overproducing variable families.
  const counts = new Map<string, number>();
  for (const option of candidates) counts.set(option.reference.id, (counts.get(option.reference.id) || 0) + 1);
  const weight = (option: ReferenceOption) =>
    (CATEGORY_WEIGHTS[archetype][option.reference.category] || 1) / counts.get(option.reference.id)!;
  let roll = random() * candidates.reduce((sum, option) => sum + weight(option), 0);
  return (
    candidates.find(option => {
      roll -= weight(option);
      return roll < 0;
    }) || candidates.at(-1)!
  );
}

export function referencePowerSummary(option: ReferenceOption): string {
  return gf(
    "{category} · {reference} · {edition}. 원본의 핵심 효과·행동 비용·충전·재충전·저주·제약은 선택한 판본과 하위형을 따릅니다. RP 상징성은 추가 전투 효과를 자동 부여하지 않습니다.",
    "{category} · {reference} · {edition}. Core effects, action costs, charges, recharge, curses and restrictions follow the selected edition and variant. RP symbolism does not automatically grant additional combat effects.",
    {
      category: gt(MAGIC_ITEM_CATEGORIES[option.reference.category]),
      reference: `${option.reference.name}${option.variant ? ` (${option.variant})` : ""}`,
      edition: option.reference.edition
    }
  );
}

export function applyItemReference(
  item: RealmTreasure,
  option: ReferenceOption,
  method: TreasureDesign["method"] = "reskin"
): void {
  if (item.rarity !== option.rarity) throw new Error("Reference rarity mismatch");
  item.design = {
    version: 1,
    referenceId: option.reference.id,
    edition: option.reference.edition,
    method,
    ...(option.variant ? { variant: option.variant } : {})
  };
  item.power = referencePowerSummary(option);
}

export function isTreasureDesign(value: unknown, rarity: ItemRarity): value is TreasureDesign {
  if (!value || typeof value !== "object") return false;
  const design = value as TreasureDesign;
  if (
    design.version !== 1 ||
    !["2014", "2024"].includes(design.edition) ||
    !["reskin", "inspired"].includes(design.method) ||
    typeof design.referenceId !== "string" ||
    (design.variant !== undefined && typeof design.variant !== "string")
  )
    return false;
  const reference = MAGIC_ITEM_BY_ID.get(design.referenceId);
  return Boolean(
    reference &&
      reference.edition === design.edition &&
      referenceOptions(reference).some(option => option.rarity === rarity && option.variant === design.variant)
  );
}

export function designOption(item: RealmTreasure): ReferenceOption | undefined {
  if (!item.design) return;
  return eligibleItemReferences(item.rarity, item.design.edition).find(
    option => optionKey(option) === `${item.design!.referenceId}|${item.design!.variant || ""}`
  );
}
