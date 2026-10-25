import Alea from "alea";
import { UNIQUE_ITEM_BUDGETS } from "@/data/unique-item-bonuses";
import type { MagicItemCategory } from "@/types/magic-item-reference";
import type { UniqueItemBonus, UniqueItemSkill, WorldMagicItem } from "@/types/world-item";

const SKILLS: Record<MagicItemCategory, readonly UniqueItemSkill[]> = {
  weapon: ["athletics", "perception", "survival"],
  armor: ["athletics", "insight", "survival"],
  potion: ["medicine", "survival"],
  ring: ["persuasion", "insight", "stealth"],
  rod: ["arcana", "persuasion"],
  staff: ["arcana", "survival", "insight"],
  wand: ["arcana", "perception"],
  scroll: ["arcana", "insight"],
  wondrous: ["stealth", "perception", "persuasion", "survival"]
};

export function createUniqueItemBonus(seed: string, item: WorldMagicItem): UniqueItemBonus | undefined {
  if (!item.unique) return undefined;
  // Do not seed with names, owners, rarity or checkbox history: editing them must not reroll the skill.
  const random = Alea(`${seed}:${item.id}:unique-bonus-v1`);
  const skills = SKILLS[item.category];
  const budget = UNIQUE_ITEM_BUDGETS[item.rarity];
  const effect = item.category === "weapon" ? "forceDamage" : item.category === "potion" ? "healing" : "temporaryHp";
  return {
    version: 1,
    skill: skills[Math.floor(random() * skills.length)],
    checkBonus: budget.check,
    effect,
    magnitude: effect === "temporaryHp" ? budget.hp : budget.dice
  };
}

export function synchronizeUniqueItemBonus(seed: string, item: WorldMagicItem): boolean {
  const bonus = createUniqueItemBonus(seed, item);
  const previous = item.uniqueBonus;
  if (JSON.stringify(previous) === JSON.stringify(bonus)) return false;
  if (bonus) item.uniqueBonus = bonus;
  else delete item.uniqueBonus;
  return true;
}
