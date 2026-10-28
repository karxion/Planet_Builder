import { afterEach, describe, expect, it } from "vitest";
import { setGenerationLanguage } from "@/services/generation-language";
import { emptyWorldSpaces, isWorldSpaces, WorldSpaceStore } from "@/services/world-spaces/model";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import { generateUnderwater } from "./underwater";
import { generateUnderground } from "./underground";
import { synchronizeSpaceContent } from "./space-content";

const surface = { columns: 32, rows: 24, heights: Array.from({ length: 768 }, (_, i) => (i % 32 < 9 ? 50 : 8)) };
afterEach(() => setGenerationLanguage("ko"));
describe("Space-specific cities, residents and relics", () => {
  it("creates separate city names and deterministic local content without altering surface records", () => {
    const sea = generateUnderwater(emptyWorldSpaces(), "content", surface);
    const data = generateUnderground(sea, { seed: "content", chambers: 12 });
    const homes = data.sites.filter(site => site.kind === "city" && site.space !== "surface");
    expect(new Set(homes.map(site => site.name)).size).toBe(homes.length);
    expect(homes.every(site => !/거주지 \d+|중심도시|교역항/.test(site.name))).toBe(true);
    expect(data.content!.npcs).toHaveLength(homes.length * 4);
    expect(data.content!.items).toHaveLength(homes.length * 3);
    expect(isWorldSpaces(data)).toBe(true);
    for (const npc of data.content!.npcs) {
      if (npc.interaction === "trade") expect(npc.progression!.classId).toBe("none");
      else expect(npc.progression!.level).toBeGreaterThanOrEqual(5);
      expect(npc.progression!.level).toBeLessThanOrEqual(8);
    }
    const before = structuredClone(data);
    synchronizeSpaceContent(data);
    expect(data).toEqual(before);
    expect(generateUnderwater(emptyWorldSpaces(), "content", surface)).toEqual(sea);
    for (const item of data.content!.items) {
      expect(item.effects).toHaveLength({ rare: 2, veryRare: 3, legendary: 4 }[item.rarity]);
      expect(new Set(item.effects).size).toBe(item.effects.length);
      expect(data.content!.npcs.find(npc => npc.id === item.npcId)?.siteId).toBe(item.siteId);
    }
    const seaIds = new Set(sea.sites.map(site => site.id));
    expect(data.content!.items.filter(item => seaIds.has(item.siteId))).toEqual(sea.content!.items);
  });
  it("generates English cities, NPC interaction hooks and effects in English", () => {
    setGenerationLanguage("en");
    const sea = generateUnderwater(emptyWorldSpaces(), "English", surface);
    const data = generateUnderground(sea, { seed: "English", chambers: 12, mode: "hollow", surface });
    expect(JSON.stringify(data.content)).not.toMatch(/[가-힣]/);
    expect(data.sites.filter(site => site.kind === "city").every(site => !/[가-힣]/.test(site.name))).toBe(true);
  });
  it("backfills old generated cities without replacing manual names and survives regeneration of edited residents", () => {
    const data = generateUnderwater(emptyWorldSpaces(), "old", surface);
    delete data.content;
    const manual = data.sites.find(site => site.kind === "city")!;
    manual.name = "내가 지은 도시";
    manual.edited = true;
    const generated = data.sites.filter(site => site.kind === "city")[1];
    generated.name = "진주 왕국 교역항";
    const store = new WorldSpaceStore();
    store.restore(data);
    const hydrated = store.snapshot();
    expect(hydrated.sites.find(site => site.id === manual.id)!.name).toBe("내가 지은 도시");
    expect(hydrated.sites.find(site => site.id === generated.id)!.name).not.toBe(generated.name);
    const npc = hydrated.content!.npcs.find(npc => npc.siteId === generated.id)!;
    npc.name = "직접 편집한 교역상";
    npc.notes = "친분 기록";
    npc.edited = true;
    const regenerated = generateUnderwater(hydrated, "new", surface);
    expect(regenerated.content!.npcs.find(item => item.id === npc.id)).toEqual(npc);
    expect(regenerated.sites.some(site => site.id === npc.siteId)).toBe(true);
    expect(isWorldSpaces(regenerated)).toBe(true);
  });
  it("round-trips content in FPB and rejects cross-space or broken resident/item references", async () => {
    const data = generateUnderwater(emptyWorldSpaces(), "save", surface);
    const project = createPlanetProject({
      mapPayload: `1.135|test\r\n${"x".repeat(150)}`,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test"
    });
    project.worldSpaces = data;
    expect((await decodePlanetProject(await encodePlanetProject(project))).worldSpaces).toEqual(data);
    const broken = structuredClone(data);
    broken.content!.npcs[0].siteId = "missing";
    expect(isWorldSpaces(broken)).toBe(false);
    const surfaceHome = structuredClone(data);
    surfaceHome.sites.find(site => site.id === surfaceHome.content!.npcs[0].siteId)!.space = "surface";
    expect(isWorldSpaces(surfaceHome)).toBe(false);
    const foreignOwner = structuredClone(data);
    foreignOwner.content!.items[0].npcId = foreignOwner.content!.npcs.at(-1)!.id;
    expect(isWorldSpaces(foreignOwner)).toBe(false);
  });
});
