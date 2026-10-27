import { ALIGNMENTS, DEITY_RANKS, ITEM_RARITIES } from "@/data/realm-heritage";
import { isTreasureDesign } from "@/generators/magic-item-generator";
import type { RealmHeritage } from "@/types/realm-heritage";
import { isUniqueItemOrigin } from "./unique-item-effects";

const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));
const text = (value: unknown): value is string => typeof value === "string" && value.length <= 4000;
const id = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const list = (value: unknown): value is unknown[] => Array.isArray(value) && value.length <= 100000;

export function isRealmHeritage(value: unknown): value is RealmHeritage {
  if (
    !record(value) ||
    value.version !== 1 ||
    typeof value.showHeadquarters !== "boolean" ||
    !list(value.nations) ||
    !list(value.treasures) ||
    !list(value.religions)
  )
    return false;
  const states = new Set<number>();
  if (
    value.itemReferenceEdition !== undefined &&
    !["2014", "2024", "mixed"].includes(value.itemReferenceEdition as string)
  )
    return false;
  for (const nation of value.nations) {
    if (
      !record(nation) ||
      !id(nation.stateId) ||
      !id(nation.ageYears) ||
      nation.ageYears > 10000 ||
      states.has(nation.stateId)
    )
      return false;
    states.add(nation.stateId);
  }
  const ids = new Set<string>();
  for (const item of value.treasures) {
    if (
      !record(item) ||
      !text(item.id) ||
      !/^treasure:(country|city):\d+:\d+$/.test(item.id) ||
      ids.has(item.id) ||
      !id(item.stateId) ||
      !["country", "city"].includes(item.ownerType as string) ||
      typeof item.rarity !== "string" ||
      !Object.hasOwn(ITEM_RARITIES, item.rarity) ||
      typeof item.unique !== "boolean" ||
      typeof item.edited !== "boolean" ||
      (item.ownerType === "country" && item.rarity === "rare") ||
      (item.ownerType === "city" &&
        (!item.unique || typeof item.settlementId !== "string" || !/^village:\d+$/.test(item.settlementId))) ||
      (item.settlementId !== undefined &&
        (typeof item.settlementId !== "string" || !/^village:\d+$/.test(item.settlementId)))
    )
      return false;
    for (const key of ["name", "power", "symbolism", "rpEffect", "history", "notes"])
      if (!text(item[key])) return false;
    if (!(item.name as string).trim() || (item.name as string).length > 200) return false;
    if (item.design !== undefined && !isTreasureDesign(item.design, item.rarity as "rare" | "veryRare" | "legendary"))
      return false;
    if (item.origin !== undefined && !isUniqueItemOrigin(item.origin)) return false;
    ids.add(item.id);
  }
  for (const religion of value.religions) {
    if (
      !record(religion) ||
      !text(religion.id) ||
      !/^faith:\d+:\d+$/.test(religion.id) ||
      ids.has(religion.id) ||
      !id(religion.stateId) ||
      typeof religion.edited !== "boolean" ||
      typeof religion.alignment !== "string" ||
      !Object.hasOwn(ALIGNMENTS, religion.alignment) ||
      typeof religion.deityRank !== "string" ||
      !Object.hasOwn(DEITY_RANKS, religion.deityRank) ||
      typeof religion.headquartersId !== "string" ||
      !/^(village|country):\d+$/.test(religion.headquartersId)
    )
      return false;
    for (const key of ["name", "symbol", "deityName", "doctrine", "notes"]) if (!text(religion[key])) return false;
    if (
      !(religion.name as string).trim() ||
      (religion.name as string).length > 200 ||
      !(religion.deityName as string).trim()
    )
      return false;
    ids.add(religion.id);
  }
  return true;
}
