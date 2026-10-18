// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Wilderness adventure controls", () => {
  beforeEach(async () => {
    vi.resetModules();
    document.body.innerHTML = '<div id="toolsContent"></div><svg id="map"></svg>';
    const points = Array.from({ length: 240 }, (_, id) => [20 + (id % 20) * 28, 40 + Math.floor(id / 20) * 28]);
    vi.stubGlobal("pack", {
      states: [
        { i: 0, name: "무소속" },
        { i: 1, name: "태양 왕국" }
      ],
      cells: {
        i: points.map((_, id) => id),
        p: points,
        h: points.map(() => 40),
        state: points.map(() => 1),
        burg: points.map(() => 0)
      },
      burgs: [{ i: 0 }, { i: 1, x: 300, y: 200, capital: 1, population: 20 }],
      markers: []
    });
    vi.stubGlobal("notes", []);
    vi.stubGlobal("seed", "sites-ui");
    vi.stubGlobal("graphWidth", 600);
    vi.stubGlobal("graphHeight", 400);
    for (const name of ["turnButtonOn", "drawMarkers", "zoomTo", "toggleAddMarker", "editMarker"])
      vi.stubGlobal(name, vi.fn());
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    const { initDungeonLocations } = await import("./dungeon-locations");
    initDungeonLocations();
    const dialog = document.querySelector<HTMLDialogElement>("dialog")!;
    dialog.showModal = () => {
      dialog.open = true;
    };
    dialog.close = () => {
      dialog.open = false;
    };
    document.getElementById("fpb-dungeons-button")!.click();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  const generate = () =>
    document.querySelector(".fpb-dungeon-settings")!.dispatchEvent(new Event("submit", { cancelable: true }));
  it("generates mapped sites, shows theme/CR/source details and avoids duplicate fills", () => {
    generate();
    expect(pack.markers.length).toBeGreaterThan(0);
    expect(document.querySelector(".fpb-dungeon-list")!.textContent).toContain("CR ");
    expect(document.querySelector('.fpb-dungeon-row a[target="_blank"]')).not.toBeNull();
    expect(drawMarkers).toHaveBeenCalled();
    const count = pack.markers.length;
    generate();
    expect(pack.markers).toHaveLength(count);
    expect(document.querySelector('[role="status"]')!.textContent).toContain("추가 0");
  });
  it("preserves cleared and locked sites as well as manually placed markers during regeneration", () => {
    generate();
    const preserved = pack.markers[0];
    const cleared = document.querySelector<HTMLInputElement>("[data-cleared]")!;
    cleared.checked = true;
    cleared.dispatchEvent(new Event("change"));
    expect(preserved.adventure).toMatchObject({ cleared: true, edited: true });
    expect(preserved.lock).toBe(true);
    pack.markers.push({ i: 999, cell: 0, x: 20, y: 40, type: "dungeons", icon: "#rpg-dungeon" });
    notes.push({ id: "marker999", name: "my manual dungeon", legend: "keep" });
    document.querySelector<HTMLButtonElement>("[data-regenerate]")!.click();
    expect(pack.markers).toContain(preserved);
    expect(pack.markers.some(marker => marker.i === 999)).toBe(true);
    expect(notes.find(note => note.id === "marker999")?.legend).toBe("keep");
  });
  it("reports crowded countries and does not silently reduce user clearance", () => {
    const input = document.querySelector<HTMLInputElement>('[name="settlementDistance"]')!;
    input.value = "1000";
    generate();
    expect(pack.markers).toHaveLength(0);
    expect(document.querySelector('[role="status"]')!.textContent).toContain("공간 부족 국가 1");
    expect(document.querySelector<HTMLInputElement>('[name="settlementDistance"]')!.value).toBe("1000");
  });
  it("keeps the original map and notes when regeneration fails before commit", async () => {
    generate();
    const previousMarkers = structuredClone(pack.markers);
    const previousNotes = structuredClone(notes);
    const adapter = await import("@/generators/adventure-site-markers");
    vi.spyOn(adapter, "populateAdventureMarkers").mockImplementationOnce(() => {
      throw new Error("generation failed");
    });
    document.querySelector<HTMLButtonElement>("[data-regenerate]")!.click();
    expect(pack.markers).toEqual(previousMarkers);
    expect(notes).toEqual(previousNotes);
    expect(document.querySelector('[role="status"]')!.textContent).toContain("기존 거점과 노트를 보존");
  });
});
