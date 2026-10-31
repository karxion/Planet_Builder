// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { dungeonFloorCell, dungeonInSpace, markerSpace } from "@/data/dungeon-spaces";
import { emptyWorldSpaces } from "@/services/world-spaces/model";
import { generateUnderwater } from "./underwater";
import { generateUnderground } from "./underground";
import { populateAdventureMarkers } from "./adventure-site-markers";
import { prepareSpaceDungeons } from "@/controllers/space-dungeons";
import type { PackedGraph } from "@/types/PackedGraph";
import { drawWorldSpaces } from "@/renderers/world-spaces";

const width = 1000,
  height = 600;
const surface = { columns: 48, rows: 32, heights: Array.from({ length: 1536 }, (_, i) => (i % 48 < 20 ? 50 : 8)) };
const world = () =>
  generateUnderground(
    generateUnderwater(emptyWorldSpaces(), "sea-dungeons", surface),
    { seed: "cave-dungeons", chambers: 12 },
    []
  );
const fixture = () => {
  const p = Array.from({ length: 960 }, (_, i) => [20 + (i % 40) * 24, 40 + Math.floor(i / 40) * 22]);
  return {
    states: [
      { i: 0, name: "Neutral" },
      { i: 1, name: "Surface kingdom" }
    ],
    burgs: [],
    markers: [],
    cells: {
      i: Uint16Array.from(p.map((_, i) => i)),
      p,
      h: p.map(() => 40),
      burg: p.map(() => 0),
      state: p.map(() => 1)
    }
  } as unknown as PackedGraph;
};
const settings = { settlementDistance: 8, siteDistance: 16, maxPerCountry: 4 };
afterEach(() => vi.unstubAllGlobals());

describe("Dungeon placement across world spaces", () => {
  it("generates separate surface, seabed and all three cavern layers at valid floor cells", () => {
    const data = world(),
      original = structuredClone(data),
      pack = fixture();
    const notes: { id: string; name: string; legend: string }[] = [];
    populateAdventureMarkers(pack, notes, "all-spaces", { width, height }, settings);
    const surfaceMarkers = structuredClone(pack.markers);
    expect(surfaceMarkers.length).toBeGreaterThan(0);
    for (const scope of ["underwater", "upper", "middle", "deep"] as const) {
      data.activeSpace = scope === "underwater" ? scope : "underground";
      if (scope !== "underwater") data.underground!.activeLevel = scope;
      const result = populateAdventureMarkers(pack, notes, "all-spaces", { width, height }, settings, 0, data);
      expect(result.placements.length).toBeGreaterThan(0);
      const markers = pack.markers.filter(m => dungeonInSpace(m, data));
      expect(markers.length).toBeGreaterThan(0);
      for (const marker of markers) {
        expect(dungeonFloorCell(data, marker.x / width, marker.y / height)).toBeDefined();
        expect(marker.cell).toBeLessThan(pack.cells.i.length);
      }
      const before = pack.markers.length;
      populateAdventureMarkers(pack, notes, "all-spaces", { width, height }, settings, 0, data);
      expect(pack.markers.length).toBe(before);
      const parent = document.createElementNS("http://www.w3.org/2000/svg", "g");
      drawWorldSpaces({
        parent,
        data,
        width,
        height,
        selected: "",
        labels: { surface: "Surface", underwater: "Sea", underground: "Caves" },
        dungeons: pack.markers
      });
      expect(parent.querySelectorAll("[data-space-dungeon]")).toHaveLength(markers.length);
    }
    expect(pack.markers.filter(m => markerSpace(m) === "surface")).toEqual(surfaceMarkers);
    expect(new Set(pack.markers.map(m => m.i)).size).toBe(pack.markers.length);
    expect(new Set(notes.map(n => n.id)).size).toBe(notes.length);
    expect(data.underwater).toEqual(original.underwater);
    expect(data.underground!.levels).toEqual(original.underground!.levels);
    // Marker JSON is carried verbatim by existing MAP/FPB serialization, including saved interiors.
    expect(JSON.parse(JSON.stringify(pack.markers))).toEqual(pack.markers);
  });

  it("retains authored interiors, notes and other spaces during explicit seabed regeneration", () => {
    const data = world(),
      source = fixture();
    data.activeSpace = "underwater";
    const notesList: { id: string; name: string; legend: string }[] = [];
    populateAdventureMarkers(source, notesList, "keep", { width, height }, settings, 0, data);
    source.markers[0].interior = { version: 99 };
    const preserved = structuredClone(source.markers[0]);
    notesList[0].legend = "authored GM notes";
    source.markers.push({ i: 999, cell: 0, x: 50, y: 50, type: "dungeons", icon: "#rpg-dungeon" });
    vi.stubGlobal("pack", source);
    vi.stubGlobal("notes", notesList);
    vi.stubGlobal("seed", "keep");
    vi.stubGlobal("graphWidth", width);
    vi.stubGlobal("graphHeight", height);
    const before = structuredClone(source.markers);
    const commit = prepareSpaceDungeons(data);
    expect(source.markers).toEqual(before);
    commit();
    expect(pack.markers.find(m => m.i === preserved.i)).toEqual(preserved);
    expect(pack.markers.some(m => m.i === 999)).toBe(true);
    expect(notes.find(n => n.id === `marker${preserved.i}`)?.legend).toBe("authored GM notes");
  });

  it("keeps surface generation independent of colocated subsurface markers", () => {
    const a = fixture(),
      b = fixture();
    b.markers.push({ i: 999, cell: 1, x: 200, y: 200, type: "dungeons", icon: "#rpg-dungeon", space: "underwater" });
    const left = populateAdventureMarkers(a, [], "stable-surface", { width, height }, settings);
    const right = populateAdventureMarkers(b, [], "stable-surface", { width, height }, settings);
    expect(right).toEqual(left);
  });
  it("places hollow-world dungeons on inner land while excluding inner seas", () => {
    const data = generateUnderground(
      emptyWorldSpaces(),
      { seed: "hollow-dungeons", chambers: 12, mode: "hollow", surface },
      []
    );
    const pack = fixture();
    const result = populateAdventureMarkers(pack, [], "hollow", { width, height }, settings, 0, data);
    expect(result.placements.length).toBeGreaterThan(0);
    for (const marker of pack.markers) {
      expect(marker.levelId).toBe("upper");
      const cell = dungeonFloorCell(data, marker.x / width, marker.y / height)!;
      expect([1, 4, 5]).toContain(data.underground!.levels[0].cells[cell]);
    }
  });
});
