import { describe, expect, it } from "vitest";
import {
  ALL_REFERENCE_OPTIONS,
  MAGIC_ITEM_REFERENCES,
  optionKey,
  referenceOptions,
  referenceSourceUrl,
  TREASURE_FORMS
} from "@/data/magic-item-references";
import { isRealmHeritage } from "@/data/realm-heritage-validation";
import type { ItemReferenceEdition } from "@/types/magic-item-reference";
import type { ItemRarity } from "@/types/realm-heritage";
import { type AdministrativeSnapshot, createCampaign } from "./campaign-generator";
import {
  applyItemReference,
  chooseItemReference,
  designOption,
  eligibleItemReferences,
  isTreasureDesign
} from "./magic-item-generator";
import { synchronizeHeritage } from "./realm-heritage";

const input: AdministrativeSnapshot = {
  states: [{ id: 1, name: "별빛 왕국", x: 10, y: 10, area: 100, government: "마법 왕국" }],
  fiefs: [],
  villages: [{ id: 1, stateId: 1, fiefId: 0, name: "별빛성", x: 10, y: 10, capital: true, port: false, population: 20 }]
};
const options = (name: string, edition: "2014" | "2024") =>
  referenceOptions(MAGIC_ITEM_REFERENCES.find(item => item.name === name && item.edition === edition)!);

describe("Official magic item references", () => {
  it("pins both complete SRD item indexes with unique IDs, rules, pages and selectable variants", () => {
    expect(MAGIC_ITEM_REFERENCES.filter(item => item.edition === "2014")).toHaveLength(240);
    expect(MAGIC_ITEM_REFERENCES.filter(item => item.edition === "2024")).toHaveLength(258);
    expect(new Set(MAGIC_ITEM_REFERENCES.map(item => item.id)).size).toBe(498);
    expect(new Set(ALL_REFERENCE_OPTIONS.map(optionKey)).size).toBe(ALL_REFERENCE_OPTIONS.length);
    const excluded = MAGIC_ITEM_REFERENCES.filter(item => !referenceOptions(item).length).map(
      item => `${item.edition}: ${item.name}`
    );
    expect(excluded).toEqual([]);
    for (const item of MAGIC_ITEM_REFERENCES) {
      expect(item.rules.length).toBeGreaterThan(30);
      expect(item.page).toBeGreaterThanOrEqual(item.edition === "2014" ? 207 : 209);
      expect(item.page).toBeLessThanOrEqual(253);
      expect(referenceSourceUrl(item)).toContain(`#page=${item.page}`);
    }
  });

  it.each(["2014", "2024"] as const)("separates variable and enhancement rarities in %s", edition => {
    expect(
      options("Belt of Giant Strength", edition)
        .filter(item => item.rarity === "legendary")
        .map(item => item.variant)
    ).toEqual(["Cloud giant (Strength 27)", "Storm giant (Strength 29)"]);
    expect(
      options("Spell Scroll", edition)
        .filter(item => item.rarity === "legendary")
        .map(item => item.variant)
    ).toEqual(["Level 9"]);
    expect(options("Horn of Valhalla", edition).find(item => item.variant === "Iron")?.rarity).toBe("legendary");
    expect(options("Weapon, +1, +2, or +3", edition).map(item => [item.rarity, item.variant])).toEqual([
      ["uncommon", "+1"],
      ["rare", "+2"],
      ["veryRare", "+3"]
    ]);
    expect(options("Ioun Stone", edition).some(item => item.rarity === "legendary")).toBe(true);
    expect(options("Figurine of Wondrous Power", edition).some(item => item.rarity === "veryRare")).toBe(true);
  });

  it("keeps renamed and edition-exclusive sources separate", () => {
    expect(options("Crystal Ball", "2014").filter(item => item.rarity === "legendary")).toHaveLength(3);
    expect(options("Crystal Ball", "2024").map(item => item.rarity)).toEqual(["veryRare"]);
    expect(options("Potions of Healing", "2024").find(item => item.rarity === "veryRare")?.variant).toContain(
      "10d4 + 20"
    );
    expect(options("Feather Token", "2014")).toHaveLength(6);
    expect(options("Feather Token", "2024")).toHaveLength(6);
    expect(MAGIC_ITEM_REFERENCES.some(item => item.edition === "2024" && item.name === "Mysterious Deck")).toBe(true);
  });

  it.each([
    "mixed",
    "2014",
    "2024"
  ] as ItemReferenceEdition[])("generates reproducibly without crossing rarity or edition boundaries (%s)", edition => {
    const random = Math.random;
    for (const rarity of ["rare", "veryRare", "legendary"] as ItemRarity[]) {
      expect(eligibleItemReferences(rarity, edition).length).toBeGreaterThan(10);
      for (let i = 0; i < 100; i++) {
        const option = chooseItemReference(String(i), "item", rarity, edition, "arcane");
        expect(chooseItemReference(String(i), "item", rarity, edition, "arcane")).toEqual(option);
        expect(option.rarity).toBe(rarity);
        if (edition !== "mixed") expect(option.reference.edition).toBe(edition);
      }
    }
    expect(Math.random).toBe(random);
  });

  it("weights national character while retaining both editions in mixed mode", () => {
    let militaryWeapons = 0;
    let arcaneWeapons = 0;
    const editions = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const military = chooseItemReference(String(i), "item", "veryRare", "mixed", "military");
      const arcane = chooseItemReference(String(i), "item", "veryRare", "mixed", "arcane");
      militaryWeapons += Number(military.reference.category === "weapon" || military.reference.category === "armor");
      arcaneWeapons += Number(arcane.reference.category === "weapon" || arcane.reference.category === "armor");
      editions.add(military.reference.edition);
    }
    expect(militaryWeapons).toBeGreaterThan(arcaneWeapons * 2);
    expect(editions).toEqual(new Set(["2014", "2024"]));
  });

  it("preserves reference category when switching editions so existing item forms do not change", () => {
    for (const edition of ["2014", "2024"] as const) {
      for (const rarity of ["rare", "veryRare", "legendary"] as ItemRarity[]) {
        for (const category of new Set(
          eligibleItemReferences(rarity, "mixed").map(option => option.reference.category)
        )) {
          expect(
            chooseItemReference("category", "item", rarity, edition, "balanced", category).reference.category
          ).toBe(category);
        }
      }
    }
  });

  it("migrates only unedited old treasures and leaves narrative and manual effects intact", () => {
    const world = createCampaign(input, "items");
    const heritage = world.heritage!;
    heritage.itemReferenceEdition = "2014";
    for (const item of heritage.treasures) delete item.design;
    heritage.treasures[0].edited = true;
    heritage.treasures[0].power = "GM effect";
    const before = structuredClone(heritage.treasures);
    expect(synchronizeHeritage(world, input)).toBe(true);
    expect(heritage.treasures[0]).toEqual(before[0]);
    for (const [index, item] of heritage.treasures.entries()) {
      if (index === 0) continue;
      expect(item.design?.edition).toBe("2014");
      expect(item.name).toBe(before[index].name);
      expect(item.history).toBe(before[index].history);
      expect(designOption(item)).toBeDefined();
    }
    expect(isRealmHeritage(heritage)).toBe(true);
    expect(synchronizeHeritage(world, input)).toBe(false);
  });

  it("names new creations for the selected reference category rather than an unrelated object", () => {
    for (let i = 0; i < 20; i++) {
      for (const item of createCampaign(input, String(i)).heritage!.treasures) {
        const reference = designOption(item)!;
        expect(item.name).toContain(TREASURE_FORMS[reference.reference.category]);
        expect(item.power).toContain(reference.reference.name);
        expect(item.rpEffect).toContain(item.symbolism);
      }
    }
  });

  it("rejects unknown sources, invalid variants, editions and rarity mismatches", () => {
    const item = createCampaign(input, "items").heritage!.treasures[0];
    const option = chooseItemReference("test", "item", item.rarity, "2024");
    applyItemReference(item, option);
    expect(isTreasureDesign(item.design, item.rarity)).toBe(true);
    for (const patch of [
      { version: 2 },
      { referenceId: "unknown" },
      { edition: "2014" },
      { method: "official" },
      { variant: "invented" }
    ]) {
      expect(isTreasureDesign({ ...item.design, ...patch }, item.rarity)).toBe(false);
    }
    expect(() => applyItemReference(item, chooseItemReference("test", "item", "rare"))).toThrow("rarity mismatch");
    expect(isTreasureDesign(null, item.rarity)).toBe(false);
  });
});
