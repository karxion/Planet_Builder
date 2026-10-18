import { describe, expect, it } from "vitest";
import { NPC_CLASSES } from "@/data/npc-progression";
import { translateText } from "@/services/ui-language";
import type { NpcClassId } from "@/types/campaign-world";
import { RULES_REFERENCE_SITES, rulesReferenceLinks } from "./rules-references";

describe("Wikidot research references", () => {
  it.each(["2014", "2024"] as const)("separates all supported class links by edition (%s)", edition => {
    for (const id of Object.keys(NPC_CLASSES) as NpcClassId[]) {
      const links = rulesReferenceLinks("character", edition, id);
      const classLink = links.find(link => link.id === "class");
      if (id === "none") expect(classLink).toBeUndefined();
      else
        expect(classLink?.url).toBe(`${RULES_REFERENCE_SITES[edition].home}${id}${edition === "2024" ? ":main" : ""}`);
      for (const link of links) {
        expect(new URL(link.url).origin).toBe(new URL(RULES_REFERENCE_SITES[edition].home).origin);
        expect(link.url.startsWith("https://")).toBe(true);
        expect(translateText(link.label, "en")).not.toMatch(/[가-힣]/);
      }
      expect(new Set(links.map(link => link.id)).size).toBe(links.length);
    }
  });

  it("uses the verified distinct spell, item, lineage and feat indexes", () => {
    expect(rulesReferenceLinks("item", "2014").map(link => link.url)).toEqual([
      "https://dnd5e.wikidot.com/wondrous-items",
      "https://dnd5e.wikidot.com/adventuring-gear",
      "https://dnd5e.wikidot.com/spells"
    ]);
    expect(rulesReferenceLinks("item", "2024").find(link => link.id === "spells")?.url).toBe(
      "https://dnd2024.wikidot.com/spell:all"
    );
    expect(rulesReferenceLinks("character", "2024").find(link => link.id === "feats")?.url).toBe(
      "https://dnd2024.wikidot.com/feat:all"
    );
    expect(rulesReferenceLinks("character", "2014").find(link => link.id === "species")?.url).toBe(
      "https://dnd5e.wikidot.com/lineage"
    );
  });

  it("does not construct a class path from an unknown or prototype key", () => {
    for (const id of ["__proto__", "constructor", "wizard/<script>"])
      expect(rulesReferenceLinks("character", "2024", id as NpcClassId).some(link => link.id === "class")).toBe(false);
  });
});
