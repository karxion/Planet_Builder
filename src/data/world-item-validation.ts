import { isNpcPortrait } from "@/data/npc-portrait";
import { UNIQUE_ITEM_SKILLS, UNIQUE_ITEM_BUDGETS } from "@/data/unique-item-bonuses";
import type { MagicItemRarity } from "@/types/magic-item-reference";
import type { ItemLibrary, ItemOwner, WorldMagicItem } from "@/types/world-item";

const text = (value: unknown, max = 4000): value is string => typeof value === "string" && value.length <= max;
const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));
const itemId = (value: unknown): value is string => text(value, 200) && /^item:[a-zA-Z0-9:-]+$/.test(value);

export function isItemOwner(value: unknown): value is ItemOwner {
  if (!record(value)) return false;
  if (value.kind === "none") return true;
  if (!text(value.label, 200) || !value.label.trim()) return false;
  if (value.kind === "custom") return true;
  return (
    (value.kind === "npc" || value.kind === "unit") &&
    text(value.id, 200) &&
    (value.kind === "npc" ? /^npc:[0-9:]+$/ : /^(country|region|fief|village):[0-9:]+$/).test(value.id)
  );
}

export function isWorldMagicItem(value: unknown): value is WorldMagicItem {
  if (!record(value) || !itemId(value.id) || !isItemOwner(value.owner)) return false;
  if (!text(value.name, 200) || !value.name.trim()) return false;
  if (!["common", "uncommon", "rare", "veryRare", "legendary", "artifact"].includes(String(value.rarity))) return false;
  if (
    !["armor", "weapon", "potion", "ring", "rod", "staff", "wand", "scroll", "wondrous"].includes(
      String(value.category)
    )
  )
    return false;
  if (typeof value.unique !== "boolean" || typeof value.edited !== "boolean") return false;
  if (value.uniqueBonus !== undefined) {
    const bonus = value.uniqueBonus;
    const budget = UNIQUE_ITEM_BUDGETS[value.rarity as MagicItemRarity];
    const effect = value.category === "weapon" ? "forceDamage" : value.category === "potion" ? "healing" : "temporaryHp";
    if (!value.unique || !record(bonus) || bonus.version !== 1 ||
      !Object.hasOwn(UNIQUE_ITEM_SKILLS, String(bonus.skill)) ||
      bonus.checkBonus !== budget.check || bonus.effect !== effect ||
      bonus.magnitude !== (effect === "temporaryHp" ? budget.hp : budget.dice)) return false;
  }
  if (![value.appearance, value.power, value.history, value.notes].every(part => text(part))) return false;
  if (value.image !== undefined && !isNpcPortrait(value.image)) return false;
  if (
    value.referenceId !== undefined &&
    (!text(value.referenceId, 200) || !/^srd(51|521):[a-z0-9-]+$/.test(value.referenceId))
  )
    return false;
  if (value.variant !== undefined && !text(value.variant, 200)) return false;
  if (
    value.sourceTreasureId !== undefined &&
    (!text(value.sourceTreasureId, 200) || !/^treasure:(country|city):\d+:\d+$/.test(value.sourceTreasureId))
  )
    return false;
  const reward = value.reward;
  return (
    reward === undefined ||
    (record(reward) &&
      Number.isSafeInteger(reward.markerId) &&
      Number(reward.markerId) >= 0 &&
      Number.isSafeInteger(reward.cell) &&
      Number(reward.cell) >= 0 &&
      text(reward.name, 200))
  );
}

export function isItemLibrary(value: unknown): value is ItemLibrary {
  if (!record(value) || value.version !== 1 || !Array.isArray(value.items) || !Array.isArray(value.deletedIds))
    return false;
  if (value.items.length > 100000 || value.deletedIds.length > 100000) return false;
  const ids = new Set<string>();
  for (const item of value.items) {
    if (!isWorldMagicItem(item) || ids.has(item.id)) return false;
    ids.add(item.id);
  }
  const deleted = new Set<string>();
  for (const id of value.deletedIds) {
    if (!itemId(id) || deleted.has(id) || ids.has(id)) return false;
    deleted.add(id);
  }
  return true;
}
