// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ts from "typescript";
import markerGeneratorSource from "./markers-generator.ts?raw";
import { ALIGNMENT_TENETS, DEITY_NAMES, FAITH_MOTIFS, TREASURE_EPITHETS, TREASURE_MOTIFS } from "@/data/realm-heritage";
import { NPC_CLASSES, NPC_RANKS, NPC_PROFESSIONS, MAJOR_NPC_GOALS } from "@/data/npc-progression";
import { TREASURE_FORMS, MAGIC_ITEM_CATEGORIES } from "@/data/magic-item-references";
import { ADVENTURE_MONSTERS, ADVENTURE_THEMES } from "@/data/adventure-sites";
import { SEA_PEOPLES } from "@/data/underwater";
import { generatedMarkerNote } from "@/data/marker-localization";
import { getGenerationLanguage, setGenerationLanguage } from "@/services/generation-language";
import { setUiLanguage } from "@/services/ui-language";
import { emptyWorldSpaces, isWorldSpaces } from "@/services/world-spaces/model";
import { generatedText as gt, generatedTemplate as gf } from "@/utils/generation-text";
import { createCampaign, regenerateCampaignNpcs, type AdministrativeSnapshot } from "./campaign-generator";
import { synchronizeHeritage } from "./realm-heritage";
import { createWorldItem } from "./world-items";
import { generateSettlementHistory } from "./settlement-map";
import { generateUnderground } from "./underground";
import { generateUnderwater } from "./underwater";
import { isCampaignWorld } from "@/data/campaign-validation";

const snapshot: AdministrativeSnapshot = {
  states: [{ id: 1, name: "Silver Kingdom", government: "Monarchy", x: 10, y: 10, geography: "forest" }],
  fiefs: [],
  villages: [
    {
      id: 1,
      stateId: 1,
      fiefId: 0,
      name: "Dawnport",
      x: 10,
      y: 10,
      capital: true,
      port: true,
      population: 20,
      continentId: 1
    }
  ]
};
const surface = { columns: 32, rows: 32, heights: Array.from({ length: 1024 }, (_, i) => (i % 32 < 10 ? 60 : 10)) };
const humanFields = (value: unknown): string[] => {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === "object"
      ? humanFields(child)
      : typeof child === "string" &&
          [
            "name",
            "role",
            "appearance",
            "personality",
            "goal",
            "secret",
            "power",
            "symbolism",
            "history",
            "rpEffect",
            "symbol",
            "deityName",
            "doctrine",
            "residents",
            "people",
            "notes"
          ].includes(key)
        ? [child]
        : []
  );
};
beforeEach(() => setGenerationLanguage("ko"));
afterEach(() => {
  setGenerationLanguage("ko");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Generated world data language", () => {
  it("covers every fixed legacy marker description when storing Korean notes", () => {
    const ast = ts.createSourceFile("markers.ts", markerGeneratorSource, ts.ScriptTarget.Latest, true);
    const missing: string[] = [];
    const visit = (node: ts.Node) => {
      if (
        ts.isStringLiteral(node) &&
        /^[A-Z][a-z]+ /.test(node.text) &&
        /[.!?]$/.test(node.text) &&
        !node.text.includes("http")
      ) {
        const localized = generatedMarkerNote({ name: "", legend: node.text }, "ko");
        if (!/[가-힣]/.test(localized.legend)) missing.push(node.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
    expect(missing).toEqual([]);
  });
  it("uses Korean by default and tracks the selected UI preference", () => {
    expect(getGenerationLanguage()).toBe("ko");
    setUiLanguage("en");
    expect(getGenerationLanguage()).toBe("en");
    setUiLanguage("ko");
    expect(getGenerationLanguage()).toBe("ko");
  });
  it("covers all authored NPC, treasure, faith, adventure and underwater vocabulary in English", () => {
    const vocabulary: string[] = [
      ...Object.values(NPC_PROFESSIONS),
      ...Object.values(NPC_CLASSES),
      ...Object.values(NPC_RANKS),
      ...MAJOR_NPC_GOALS.country,
      ...MAJOR_NPC_GOALS.continent,
      ...Object.values(TREASURE_FORMS),
      ...Object.values(MAGIC_ITEM_CATEGORIES),
      ...TREASURE_EPITHETS,
      ...TREASURE_MOTIFS.map(motif => motif.symbolism),
      ...DEITY_NAMES,
      ...Object.values(ALIGNMENT_TENETS),
      ...FAITH_MOTIFS.flatMap(motif => [motif.name, motif.symbol]),
      ...ADVENTURE_MONSTERS.map(monster => monster.name),
      ...ADVENTURE_THEMES.flatMap(theme => [theme.name, theme.hook]),
      ...SEA_PEOPLES.flatMap(profile => [profile.name, profile.people, profile.notes])
    ];
    expect([...new Set(vocabulary.filter(value => /[가-힣]/.test(gt(value, "en"))))]).toEqual([]);
  });
  it("keeps the same seeded mechanics while generating names, NPC prose, treasures and faiths in English", () => {
    const ko = createCampaign(snapshot, "bilingual");
    expect(ko.npcs.every(npc => /[가-힣]/.test(npc.name))).toBe(true);
    setGenerationLanguage("en");
    const en = createCampaign(snapshot, "bilingual");
    expect(humanFields(en).filter(value => /[가-힣]/.test(value))).toEqual([]);
    expect(en.npcs.map(npc => [npc.id, npc.templateId, npc.progression])).toEqual(
      ko.npcs.map(npc => [npc.id, npc.templateId, npc.progression])
    );
    expect(en.heritage!.treasures.map(item => [item.id, item.rarity, item.design])).toEqual(
      ko.heritage!.treasures.map(item => [item.id, item.rarity, item.design])
    );
    expect(isCampaignWorld(en)).toBe(true);
    expect(createCampaign(snapshot, "bilingual")).toEqual(en);
    expect(
      humanFields(createWorldItem("bilingual", "item:locale", "Dawnport")).filter(value => /[가-힣]/.test(value))
    ).toEqual([]);
    expect(generateSettlementHistory("seed", "Dawnport", true, true)).not.toMatch(/[가-힣]/);
  });
  it("preserves edited records and existing text when the preference changes or new NPCs are generated", () => {
    const world = createCampaign(snapshot, "bilingual");
    world.npcs[0].edited = true;
    world.npcs[0].name = "내가 쓴 이름";
    world.npcs[0].goal = "직접 쓴 목표";
    const savedNpc = structuredClone(world.npcs[0]);
    const treasure = structuredClone(world.heritage!.treasures[0]);
    setGenerationLanguage("en");
    synchronizeHeritage(world, snapshot);
    expect(world.heritage!.treasures[0]).toEqual(treasure);
    regenerateCampaignNpcs(world, snapshot, new Set(["village:1"]));
    expect(world.npcs.find(npc => npc.id === savedNpc.id)).toEqual(savedNpc);
    expect(world.npcs.filter(npc => !npc.edited).every(npc => !/[가-힣]/.test(npc.name + npc.goal + npc.role))).toBe(
      true
    );
    expect(gf("{name}의 보물", "Treasure of {name}", { name: "내 이름" })).toBe("Treasure of 내 이름");
  });
  it.each([
    "tunnels",
    "hollow"
  ] as const)("localizes fresh %s worlds without changing geometry or overwriting manual sites", mode => {
    const ko = generateUnderground(emptyWorldSpaces(), { seed: "language", chambers: 12, mode, surface });
    setGenerationLanguage("en");
    const en = generateUnderground(emptyWorldSpaces(), { seed: "language", chambers: 12, mode, surface });
    expect(humanFields(en).filter(value => /[가-힣]/.test(value))).toEqual([]);
    expect(en.underground).toEqual(ko.underground);
    expect(isWorldSpaces(en)).toBe(true);
    const kept = ko.sites.find(site => site.kind === "city")!;
    kept.edited = true;
    kept.name = "직접 쓴 거주지";
    const regenerated = generateUnderground(ko, { seed: "language2", chambers: 12, mode, surface });
    expect(regenerated.sites.find(site => site.id === kept.id)).toEqual(kept);
    expect(regenerated.factions.every(faction => !/[가-힣]/.test(faction.name + faction.notes))).toBe(true);
  });
  it("localizes newly added polar hollow-world gateways", () => {
    const options = {
      seed: "polar-language",
      chambers: 12,
      mode: "hollow" as const,
      surface,
      entranceStyle: "polar" as const,
      latitudeBounds: { north: 90, south: -90 }
    };
    const ko = generateUnderground(emptyWorldSpaces(), options);
    expect(ko.sites.some(site => site.name.includes("북극권 관문"))).toBe(true);
    setGenerationLanguage("en");
    const en = generateUnderground(emptyWorldSpaces(), options);
    expect(en.sites.some(site => site.name.includes("Arctic gateway"))).toBe(true);
    expect(humanFields(en).filter(value => /[가-힣]/.test(value))).toEqual([]);
    expect(en.underground).toEqual(ko.underground);
  });
  it("localizes underwater factions, residents, cities and routes, retaining custom faction names", () => {
    const ko = generateUnderwater(emptyWorldSpaces(), "language", surface);
    setGenerationLanguage("en");
    const en = generateUnderwater(emptyWorldSpaces(), "language", surface);
    expect(humanFields(en).filter(value => /[가-힣]/.test(value))).toEqual([]);
    expect(en.underwater).toEqual(ko.underwater);
    const regenerated = generateUnderwater(ko, "language", surface);
    expect(humanFields(regenerated).filter(value => /[가-힣]/.test(value))).toEqual([]);
    ko.factions[0].name = "나의 세력";
    ko.factions[0].notes = "내 설정";
    expect(generateUnderwater(ko, "next", surface).factions[0]).toEqual(ko.factions[0]);
    expect(isWorldSpaces(en)).toBe(true);
  });
  it("stores new marker prose in the selected language while retaining links and stable IDs", () => {
    const raw = {
      id: "marker7",
      name: "Dawnport Lighthouse",
      legend:
        '<p>A lighthouse to serve as a beacon for ships in the open sea.</p><a href="https://example.com/view?seed=abc">Watabou</a>'
    };
    const ko = generatedMarkerNote(raw, "ko");
    expect(ko.name).toContain("등대");
    expect(ko.legend).toMatch(/[가-힣]/);
    expect(ko.legend).toContain('href="https://example.com/view?seed=abc"');
    expect(ko.id).toBe(raw.id);
    expect(generatedMarkerNote(raw, "en")).toEqual(raw);
    expect(raw.legend).not.toMatch(/[가-힣]/);
  });
  it("generates map names in the selected language, including direct name-regeneration paths", async () => {
    vi.stubGlobal("pack", { cultures: [] });
    vi.stubGlobal("ERROR", false);
    vi.stubGlobal("WARN", false);
    await import("./names-generator");
    const names = window.Names;
    vi.stubGlobal("nameBases", names.getNameBases());
    expect(names.getDefault()).toMatch(/^[가-힣]+$/);
    setGenerationLanguage("en");
    expect(names.getDefault()).toMatch(/^[A-Za-z '\-]+$/);
    expect(names.getCulture(0)).not.toMatch(/[가-힣]/);
    setGenerationLanguage("ko");
    expect(names.getBase(1)).toMatch(/^[가-힣]+$/);
  });
});
