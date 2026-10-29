import { describe, expect, it, vi } from "vitest";
import { ADVENTURE_MONSTERS, ADVENTURE_THEMES, CREATURE_TYPES, isAdventureSite } from "@/data/adventure-sites";
import { isDungeonLocation } from "@/data/dungeon-locations";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import type { AdventureSnapshot } from "@/types/adventure-site";
import type { PackedGraph } from "@/types/PackedGraph";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { populateAdventureMarkers } from "./adventure-site-markers";
import { generateAdventureSites } from "./adventure-sites";

const cells = Array.from({ length: 450 }, (_, id) => ({
  id,
  x: 20 + (id % 30) * 19,
  y: 40 + Math.floor(id / 30) * 22,
  height: 40,
  stateId: id % 30 < 15 ? 1 : 2
}));
const input: AdventureSnapshot = {
  width: 600,
  height: 400,
  countries: [
    { id: 1, name: "강철 왕국" },
    { id: 2, name: "별빛 공국" }
  ],
  cells,
  settlements: [
    { x: 150, y: 190, city: true },
    { x: 450, y: 190, city: false }
  ],
  markers: [{ x: 280, y: 100, stateId: 1, adventure: false }]
};
const settings = { settlementDistance: 40, siteDistance: 50, maxPerCountry: 4 };
function fixture(): PackedGraph {
  return {
    states: [{ i: 0, name: "무소속" }, ...input.countries.map(country => ({ i: country.id, name: country.name }))],
    cells: {
      i: cells.map(cell => cell.id),
      p: cells.map(cell => [cell.x, cell.y]),
      h: cells.map(cell => cell.height),
      state: cells.map(cell => cell.stateId),
      burg: cells.map(() => 0)
    },
    burgs: [
      { i: 0 },
      ...input.settlements.map((town, i) => ({ i: i + 1, ...town, capital: town.city, population: 2 }))
    ],
    markers: []
  } as unknown as PackedGraph;
}
describe("National wilderness adventure sites", () => {
  it("integrates with legacy marker generation and honors disabled dungeon generation and locks", async () => {
    vi.stubGlobal("pack", fixture());
    vi.stubGlobal("notes", []);
    vi.stubGlobal("seed", "legacy-hook");
    vi.stubGlobal("graphWidth", 600);
    vi.stubGlobal("graphHeight", 400);
    vi.stubGlobal("TIME", false);
    vi.stubGlobal("Markers", undefined);
    try {
      await import("./markers-generator");
      const config = {
        type: "dungeons",
        icon: "#rpg-dungeon",
        min: 0,
        each: 1,
        multiplier: 1,
        list: () => [],
        add: () => {}
      };
      Markers.setConfig([config]);
      Markers.regenerate();
      expect(pack.markers.length).toBeGreaterThan(0);
      expect(pack.markers.every(marker => isAdventureSite(marker.adventure))).toBe(true);
      pack.markers[0].lock = true;
      Markers.setConfig([{ ...config, multiplier: 0 }]);
      Markers.regenerate();
      expect(pack.markers).toHaveLength(1);
      expect(pack.markers[0].lock).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it("provides every creature type, hostile factions, wizard towers and underworld entrances", () => {
    expect(ADVENTURE_MONSTERS).toHaveLength(31);
    expect(ADVENTURE_THEMES).toHaveLength(17);
    expect(new Set(ADVENTURE_MONSTERS.map(monster => monster.type))).toEqual(new Set(Object.keys(CREATURE_TYPES)));
    expect(new Set(ADVENTURE_MONSTERS.map(monster => monster.id)).size).toBe(31);
    for (const theme of ADVENTURE_THEMES)
      expect(theme.monsters.every(id => ADVENTURE_MONSTERS.some(monster => monster.id === id))).toBe(true);
    expect(ADVENTURE_THEMES.find(theme => theme.id === "wizard-tower")?.kind).toBe("dungeon");
    expect(ADVENTURE_THEMES.find(theme => theme.id === "underworld-passage")?.kind).toBe("dungeon");
    expect(ADVENTURE_THEMES.filter(theme => theme.kind === "hostileSettlement")).toHaveLength(2);
    expect(new Set(ADVENTURE_MONSTERS.map(monster => monster.cr))).toContain("1/4");
    expect(new Set(ADVENTURE_MONSTERS.map(monster => monster.cr))).toContain("30");
  });
  it("places sites in every eligible country while respecting all settlements, cities and other markers", () => {
    const result = generateAdventureSites(input, "world", settings);
    expect(result.countries.every(country => country.missing === 0 && country.added > 0)).toBe(true);
    for (const site of result.placements) {
      expect(site.stateId).toBe(site.x < 300 ? 1 : 2);
      expect(isAdventureSite(site.adventure)).toBe(true);
      for (const town of input.settlements)
        expect(Math.hypot(site.x - town.x, site.y - town.y)).toBeGreaterThanOrEqual(
          settings.settlementDistance * (town.city ? 1.5 : 1)
        );
      for (const marker of input.markers)
        expect(Math.hypot(site.x - marker.x, site.y - marker.y)).toBeGreaterThanOrEqual(50);
      for (const other of result.placements.filter(other => other !== site))
        expect(Math.hypot(site.x - other.x, site.y - other.y)).toBeGreaterThanOrEqual(50);
    }
  });
  it("checks a farther city's larger exclusion radius even if a closer village is outside its own radius", () => {
    const result = generateAdventureSites(
      {
        ...input,
        countries: [input.countries[0]],
        cells: [{ id: 1, stateId: 1, x: 300, y: 200, height: 40 }],
        markers: [],
        settlements: [
          { x: 345, y: 200, city: false },
          { x: 300, y: 255, city: true }
        ]
      },
      "world",
      settings
    );
    expect(result.placements).toHaveLength(0);
    expect(result.countries[0].missing).toBe(1);
  });
  it("reports lack of room without moving towns or weakening requested distances", () => {
    const original = structuredClone(input);
    const result = generateAdventureSites(input, "world", { ...settings, settlementDistance: 1000 });
    expect(result.placements).toHaveLength(0);
    expect(result.countries.every(country => country.missing > 0)).toBe(true);
    expect(input).toEqual(original);
  });
  it("never places on water, unowned land, or the clipping margin", () => {
    const result = generateAdventureSites(
      {
        ...input,
        settlements: [],
        markers: [],
        cells: [
          { id: 0, x: 100, y: 100, height: 10, stateId: 1 },
          { id: 1, x: 150, y: 100, height: 40, stateId: 0 },
          { id: 2, x: 1, y: 100, height: 40, stateId: 1 }
        ]
      },
      "edge",
      settings
    );
    expect(result.placements).toHaveLength(0);
  });
  it("is deterministic, independent of input order and isolated from global randomness", () => {
    const random = Math.random;
    const before = structuredClone(input);
    const first = generateAdventureSites(input, "world", settings);
    expect(
      generateAdventureSites(
        {
          ...input,
          cells: [...cells].reverse(),
          countries: [...input.countries].reverse(),
          settlements: [...input.settlements].reverse()
        },
        "world",
        settings
      )
    ).toEqual(first);
    expect(generateAdventureSites(input, "other", settings)).not.toEqual(first);
    expect(generateAdventureSites(input, "world", settings, 1)).not.toEqual(first);
    expect(Math.random).toBe(random);
    expect(input).toEqual(before);
  });
  it("varies themes and individual CRs and gives underworld passages large populations", () => {
    const themes = new Set<string>();
    const threats = new Set<string>();
    for (let i = 0; i < 100; i++)
      for (const placement of generateAdventureSites(input, String(i), settings).placements) {
        themes.add(placement.adventure.themeId);
        threats.add(placement.adventure.monsterId);
        if (placement.adventure.themeId === "underworld-passage")
          expect(placement.adventure.inhabitants).toBeGreaterThanOrEqual(20);
      }
    expect(themes.size).toBe(17);
    expect(threats.size).toBeGreaterThan(20);
  });
  it("adds serializable map markers and source notes once without replacing manual markers", () => {
    const pack = fixture();
    pack.markers.push({ i: 99, cell: 0, x: 20, y: 40, icon: "#rpg-ruins", type: "custom", lock: true });
    const notes = [{ id: "marker99", name: "manual", legend: "private story" }];
    const preserved = structuredClone(pack.markers[0]);
    const result = populateAdventureMarkers(pack, notes, "world", { width: 600, height: 400 }, settings);
    expect(result.placements.length).toBeGreaterThan(0);
    expect(pack.markers[0]).toEqual(preserved);
    expect(pack.markers[1].i).toBe(100);
    expect(pack.markers.slice(1).every(isDungeonLocation)).toBe(true);
    expect(notes[1].legend).toContain("CR은 대표 몬스터 한 개체");
    expect(notes[1].legend).toContain('rel="noopener noreferrer"');
    const snapshot = structuredClone(pack.markers);
    expect(
      populateAdventureMarkers(pack, notes, "world", { width: 600, height: 400 }, settings).placements
    ).toHaveLength(0);
    expect(pack.markers).toEqual(snapshot);
    expect(JSON.parse(JSON.stringify(pack.markers))).toEqual(snapshot);
  });
  it.each([Uint16Array, Uint32Array])("accepts actual typed cell indexes without losing candidate coordinates: %s", ArrayType => {
    const arrayPack = fixture();
    const typedPack = { ...fixture(), cells: { ...fixture().cells, i: new ArrayType(arrayPack.cells.i) } };
    const arrayNotes: { id: string; name: string; legend: string }[] = [];
    const typedNotes: { id: string; name: string; legend: string }[] = [];
    const expected = populateAdventureMarkers(arrayPack, arrayNotes, "typed-world", { width: 600, height: 400 }, settings);
    const result = populateAdventureMarkers(typedPack, typedNotes, "typed-world", { width: 600, height: 400 }, settings);
    expect(result.placements.length).toBeGreaterThan(0);
    expect(result).toEqual(expected);
    expect(typedPack.markers).toEqual(arrayPack.markers);
    expect(typedNotes).toEqual(arrayNotes);
    expect(typedPack.cells.i).toBeInstanceOf(ArrayType);
    expect(populateAdventureMarkers(typedPack, typedNotes, "typed-world", { width: 600, height: 400 }, settings).placements).toHaveLength(0);
  });
  it("round-trips marker metadata in the map payload of an FPB file", async () => {
    const pack = fixture();
    const notes: { id: string; name: string; legend: string }[] = [];
    populateAdventureMarkers(pack, notes, "world", { width: 600, height: 400 }, settings);
    const lines = Array<string>(46).fill("");
    lines[0] = "1.135|test";
    lines[4] = JSON.stringify(notes);
    lines[35] = JSON.stringify(pack.markers);
    const project = createPlanetProject({
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135",
      upstreamCommit: "test",
      mapPayload: lines.join("\r\n")
    });
    const restored = await decodePlanetProject(await encodePlanetProject(project));
    expect(JSON.parse(restored.mapPayload.split("\r\n")[35])).toEqual(pack.markers);
  });
  it.each([
    { themeId: "unknown" },
    { monsterId: "unknown" },
    { themeId: "orc-raiders", monsterId: "lich" },
    { inhabitants: 0 },
    { inhabitants: 1001 },
    { generation: -1 },
    { cleared: "yes" }
  ])("rejects malformed metadata %j", patch => {
    expect(
      isAdventureSite({
        version: 1,
        themeId: "wizard-tower",
        monsterId: "mage",
        inhabitants: 1,
        cleared: false,
        edited: false,
        generation: 0,
        ...patch
      })
    ).toBe(false);
  });
  it.each([
    { settlementDistance: 0 },
    { maxPerCountry: 21 },
    { siteDistance: Number.NaN }
  ])("rejects invalid settings %j", patch => {
    expect(() => generateAdventureSites(input, "world", { ...settings, ...patch })).toThrow();
  });
});
