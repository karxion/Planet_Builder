import { describe, expect, it } from "vitest";
import { isWorldMagicItem } from "@/data/world-item-validation";
import { uniqueItemBonusLines } from "@/data/unique-item-bonuses";
import { translateText } from "@/services/ui-language";
import type { MagicItemCategory, MagicItemRarity } from "@/types/magic-item-reference";
import { createWorldItem, synchronizeItemLibrary } from "./world-items";
import { createUniqueItemBonus, synchronizeUniqueItemBonus } from "./unique-item-bonuses";

describe("Unique item bonus traits", () => {
  it("is deterministic across rename, ownership changes and toggling uniqueness", () => {
    const item = createWorldItem("seed", "item:unique:1", "왕관");
    const bonus = createUniqueItemBonus("seed", item);
    item.name = "새 이름";
    item.owner = { kind: "custom", label: "새 소유자" };
    expect(createUniqueItemBonus("seed", item)).toEqual(bonus);
    item.unique = false;
    expect(synchronizeUniqueItemBonus("seed", item)).toBe(true);
    expect(item.uniqueBonus).toBeUndefined();
    item.unique = true;
    synchronizeUniqueItemBonus("seed", item);
    expect(item.uniqueBonus).toEqual(bonus);
    expect(synchronizeUniqueItemBonus("seed", item)).toBe(false);
  });
  it.each<[MagicItemRarity, number, number]>([
    ["common", 1, 3],
    ["uncommon", 1, 4],
    ["rare", 1, 5],
    ["veryRare", 2, 10],
    ["legendary", 3, 15],
    ["artifact", 3, 15]
  ])("caps the %s budget without modifying base stats or rarity", (rarity, checkBonus, magnitude) => {
    const item = { ...createWorldItem("seed", "item:unique:1", "왕관"), category: "ring" as const, rarity };
    const power = item.power;
    synchronizeUniqueItemBonus("seed", item);
    expect(item.uniqueBonus).toMatchObject({ checkBonus, magnitude, effect: "temporaryHp" });
    expect(item.power).toBe(power);
    expect(item.rarity).toBe(rarity);
    expect(isWorldMagicItem(item)).toBe(true);
  });
  it.each<MagicItemCategory>([
    "weapon",
    "armor",
    "potion",
    "ring",
    "rod",
    "staff",
    "wand",
    "scroll",
    "wondrous"
  ])("assigns valid category-specific traits to %s", category => {
    const item = { ...createWorldItem("seed", "item:unique:2", "보물"), category, rarity: "legendary" as const };
    synchronizeUniqueItemBonus("seed", item);
    expect(item.uniqueBonus).toMatchObject({
      effect: category === "weapon" ? "forceDamage" : category === "potion" ? "healing" : "temporaryHp",
      magnitude: category === "weapon" || category === "potion" ? 3 : 15
    });
    expect(isWorldMagicItem(item)).toBe(true);
  });
  it("migrates existing edited unique items without touching their identity, text or image", () => {
    const item = createWorldItem("seed", "item:manual:legacy", "전승");
    delete item.uniqueBonus;
    item.edited = true;
    item.power = "직접 작성한 효능";
    const original = structuredClone(item);
    const world = {
      version: 1 as const,
      ruleset: "srd-5.2.1" as const,
      seed: "seed",
      generation: 0,
      units: [],
      npcs: [],
      itemLibrary: { version: 1 as const, items: [item], deletedIds: [] }
    };
    expect(synchronizeItemLibrary(world, [])).toBe(true);
    expect(item).toMatchObject(original);
    expect(item.uniqueBonus).toBeDefined();
    expect(synchronizeItemLibrary(world, [])).toBe(false);
  });
  it("rejects corrupt or out-of-budget stored bonus data and preserves legacy compatibility", () => {
    const item = createWorldItem("seed", "item:unique:3", "보물");
    const bonus = item.uniqueBonus!;
    for (const invalid of [
      { ...bonus, checkBonus: 4 },
      { ...bonus, magnitude: Infinity },
      { ...bonus, skill: "__proto__" },
      { ...bonus, effect: "unknown" },
      { ...bonus, version: 2 }
    ])
      expect(isWorldMagicItem({ ...item, uniqueBonus: invalid })).toBe(false);
    expect(isWorldMagicItem({ ...item, unique: false })).toBe(false);
    delete item.uniqueBonus;
    expect(isWorldMagicItem(item)).toBe(true);
  });
  it("formats numerical effects and symbolism in Korean and English", () => {
    const item = { ...createWorldItem("seed", "item:unique:4", "검"), category: "weapon" as const };
    const bonus = createUniqueItemBonus("seed", item)!;
    expect(uniqueItemBonusLines(bonus, value => translateText(value, "ko")).join(" ")).toContain("역장 피해 1d6");
    const english = uniqueItemBonusLines(bonus, value => translateText(value, "en")).join(" ");
    expect(english).toContain("1d6 force damage");
    expect(english).not.toMatch(/[가-힣]/);
  });
});
