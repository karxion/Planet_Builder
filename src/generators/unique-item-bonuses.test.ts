import { describe, expect, it } from "vitest";
import { isWorldMagicItem } from "@/data/world-item-validation";
import { uniqueItemBonusLines } from "@/data/unique-item-bonuses";
import {
  ITEM_ARCHETYPES,
  ITEM_CATEGORIES,
  ITEM_GEOGRAPHIES,
  UNIQUE_EFFECT_BY_ID,
  UNIQUE_EFFECT_COUNTS
} from "@/data/unique-item-effects";
import { translateText } from "@/services/ui-language";
import type { CampaignWorld } from "@/types/campaign-world";
import type { MagicItemRarity } from "@/types/magic-item-reference";
import { createWorldItem, synchronizeItemLibrary } from "./world-items";
import {
  createUniqueItemBonus,
  geographyFromTerrain,
  itemCreationBackground,
  itemOrigin,
  synchronizeUniqueItemBonus
} from "./unique-item-bonuses";

describe("Contextual unique item effects", () => {
  it.each<MagicItemRarity>([
    "common",
    "uncommon",
    "rare",
    "veryRare",
    "legendary",
    "artifact"
  ])("assigns exactly the %s effect budget across all categories, nations and biomes", rarity => {
    for (const category of ITEM_CATEGORIES)
      for (const archetype of ITEM_ARCHETYPES)
        for (const geography of ITEM_GEOGRAPHIES) {
          const item = {
            ...createWorldItem("seed", `item:${category}`, "보물"),
            category,
            rarity,
            origin: { archetype, geography }
          };
          synchronizeUniqueItemBonus("seed", item);
          const bonus = createUniqueItemBonus("seed", item)!;
          expect(bonus.effects).toHaveLength(UNIQUE_EFFECT_COUNTS[rarity]);
          expect(new Set(bonus.effects.map(effect => effect.id)).size).toBe(bonus.effects.length);
          expect(new Set(bonus.effects.map(effect => effect.axis)).size).toBe(bonus.effects.length);
          for (const effect of bonus.effects) {
            const definition = UNIQUE_EFFECT_BY_ID.get(effect.id)!;
            if (effect.axis === "category") expect(definition.theme).toBe(category);
            if (effect.axis === "nation") expect(definition.theme).toBe(archetype);
            if (effect.axis === "geography") expect(definition.theme).toBe(geography);
          }
          expect(isWorldMagicItem(item)).toBe(true);
        }
  });
  it("retains powers on rename, transfer, toggling and repeated synchronization", () => {
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
  it("uses creation histories rather than names, and changes only compatible contextual powers", () => {
    const samples = ["맹세", "전쟁", "봉인 의식", "구호", "항해", "계승"];
    expect(samples.map(itemCreationBackground)).toEqual(["oath", "war", "ritual", "rescue", "journey", "legacy"]);
    const selected = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const item = { ...createWorldItem("seed", `item:sample:${i}`, "전쟁"), rarity: "legendary" as const };
      for (const history of samples) {
        const bonus = createUniqueItemBonus("seed", { ...item, history })!;
        const effect = bonus.effects.find(effect => effect.axis === "history")!;
        expect(UNIQUE_EFFECT_BY_ID.get(effect.id)!.theme).toBe(itemCreationBackground(history));
        bonus.effects.forEach(effect => selected.add(effect.id));
      }
    }
    expect(selected.size).toBeGreaterThan(20);
  });
  it("migrates legacy bonuses on edited items without changing saved text, images, owners or reward links", () => {
    const item = createWorldItem("seed", "item:manual:legacy", "전승");
    item.category = "weapon";
    item.uniqueBonus = { version: 1, skill: "athletics", checkBonus: 1, effect: "forceDamage", magnitude: 1 };
    item.edited = true;
    item.power = "직접 작성한 효능";
    item.image = "data:image/jpeg;base64,/9j/2Q==";
    item.reward = { markerId: 1, cell: 3, name: "폐허" };
    expect(isWorldMagicItem(item)).toBe(true);
    const { uniqueBonus, ...original } = structuredClone(item);
    const world: CampaignWorld = {
      version: 1,
      ruleset: "srd-5.2.1",
      seed: "seed",
      generation: 0,
      units: [],
      npcs: [],
      itemLibrary: { version: 1, items: [item], deletedIds: [] }
    };
    expect(synchronizeItemLibrary(world, [])).toBe(true);
    expect(item).toMatchObject(original);
    expect(item.uniqueBonus).toMatchObject({ version: 2, effects: expect.any(Array) });
    expect(synchronizeItemLibrary(world, [])).toBe(false);
    expect(isWorldMagicItem(JSON.parse(JSON.stringify(item)))).toBe(true);
  });
  it("derives nation from linked source/owner and keeps the origin after ownership transfer", () => {
    const world: CampaignWorld = {
      version: 1,
      ruleset: "srd-5.2.1",
      seed: "seed",
      generation: 0,
      units: [{ id: "country:1", sourceId: 1, stateId: 1, level: "country", name: "왕국", x: 0, y: 0 }],
      npcs: [],
      npcProfiles: [{ stateId: 1, archetype: "military" }]
    };
    const item = createWorldItem("seed", "item:origin", "보물", { kind: "unit", id: "country:1", label: "왕국" });
    item.origin = itemOrigin(world, item, "mountain");
    expect(item.origin).toEqual({ archetype: "military", geography: "mountain" });
    item.owner = { kind: "none" };
    expect(itemOrigin(world, item, "coast")).toEqual(item.origin);
  });
  it("classifies real terrain, including coasts and elevated mountains", () => {
    expect(
      [
        [30, 1, false],
        [75, 6, false],
        [30, 6, true],
        [30, 6, false],
        [30, 10, false],
        [30, 12, false],
        [30, 4, false]
      ].map(([h, b, c]) => geographyFromTerrain(Number(h), Number(b), Boolean(c)))
    ).toEqual(["desert", "mountain", "coast", "forest", "tundra", "swamp", "plains"]);
  });
  it("rejects corrupt, duplicated, excessive and category-incompatible powers; accepts missing legacy powers", () => {
    const item = createWorldItem("seed", "item:validation", "보물");
    const bonus = createUniqueItemBonus("seed", item)!;
    for (const invalid of [
      { version: 3, effects: bonus.effects },
      { version: 2, effects: [] },
      { version: 2, effects: [bonus.effects[0], bonus.effects[0]] },
      { version: 2, effects: [{ axis: "category", id: "__proto__" }, bonus.effects[1]] },
      {
        version: 2,
        effects: [
          { axis: "category", id: item.category === "potion" ? "weapon-strike" : "potion-purge" },
          bonus.effects[1]
        ]
      }
    ])
      expect(isWorldMagicItem({ ...item, uniqueBonus: invalid })).toBe(false);
    expect(isWorldMagicItem({ ...item, origin: { archetype: "invalid", geography: "coast" } })).toBe(false);
    expect(isWorldMagicItem({ ...item, unique: false })).toBe(false);
    delete item.uniqueBonus;
    expect(isWorldMagicItem(item)).toBe(true);
  });
  it("formats every power and its numeric budget in Korean and English", () => {
    for (const effect of UNIQUE_EFFECT_BY_ID.values()) {
      const bonus = { version: 2 as const, effects: [{ id: effect.id, axis: effect.axis }] };
      const ko = uniqueItemBonusLines(bonus, value => translateText(value, "ko"), "legendary")[0];
      const en = uniqueItemBonusLines(bonus, value => translateText(value, "en"), "legendary")[0];
      expect(ko).toMatch(/[가-힣]/);
      expect(en).not.toMatch(/[가-힣{}]/);
      expect(ko).not.toMatch(/[{}]/);
      if (effect.ko.includes("{dice}")) expect(en).toContain("3d6");
    }
  });
});
