// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ dungeon: vi.fn(), encounter: vi.fn(), edit: vi.fn() }));
vi.mock("./dungeon-interior", () => ({ openDungeonInteriorMap: mocks.dungeon }));

let events: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  events = vi.spyOn(window, "addEventListener");
  document.body.innerHTML =
    '<svg id="map"><defs></defs><g id="viewbox"><g id="markers"><svg id="marker7"></svg></g></g></svg>';
  document.querySelector<SVGGElement>("#viewbox")!.getScreenCTM = () => ({ a: 1, b: 0 }) as DOMMatrix;
  vi.stubGlobal(
    "MutationObserver",
    class {
      observe() {}
      disconnect() {}
    }
  );
  vi.stubGlobal("customization", 0);
  vi.stubGlobal("elSelected", null);
  vi.stubGlobal("notes", [{ id: "marker7", name: "기존 장소 이름", legend: "<p>수동 기록</p>" }]);
  vi.stubGlobal("pack", {
    cells: { burg: new Uint16Array(4) },
    burgs: [],
    markers: [{ i: 7, cell: 3, x: 100, y: 100, type: "dungeons", icon: "#rpg-dungeon", lock: true }]
  });
  vi.stubGlobal("editMarker", mocks.edit);
  vi.stubGlobal("openLocalEncounter", mocks.encounter);
  vi.stubGlobal("renderMarkerGlyph", () => "");
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(() => {
  for (const [name, handler, options] of events.mock.calls) window.removeEventListener(name, handler, options);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const openBadge = async () => {
  const { initMapIconGroups } = await import("./map-icon-groups");
  initMapIconGroups();
  document
    .querySelector<SVGGElement>("[data-object-anchor]")!
    .dispatchEvent(new MouseEvent("click", { bubbles: true }));
};
describe("Place badge actions", () => {
  it("opens a dungeon interior directly and retains separate marker editing", async () => {
    const before = structuredClone(pack);
    await openBadge();
    const dialog = document.querySelector<HTMLDialogElement>("#fpb-object-dialog")!;
    expect(dialog.textContent).toContain("기존 장소 이름");
    const primary = dialog.querySelector<HTMLButtonElement>('[data-object-action="dungeon"]')!;
    expect(primary.textContent).toBe("던전 내부 지도");
    primary.click();
    expect(mocks.dungeon).toHaveBeenCalledWith(7);
    expect(mocks.edit).not.toHaveBeenCalled();
    expect(dialog.open).toBe(false);
    expect(JSON.stringify(pack)).toBe(JSON.stringify(before));
    document
      .querySelector<SVGGElement>("[data-object-anchor]")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    document.querySelectorAll<HTMLButtonElement>("#fpb-object-dialog .fpb-object-actions button")[1].click();
    expect(mocks.edit).toHaveBeenCalledWith(7);
  });
  it("routes encounters to the existing NPC flow", async () => {
    pack.markers[0].type = "encounters";
    pack.markers[0].icon = "#rpg-camp";
    await openBadge();
    document.querySelector<HTMLButtonElement>('[data-object-action="encounter"]')!.click();
    expect(mocks.encounter).toHaveBeenCalledWith(7);
    expect(mocks.dungeon).not.toHaveBeenCalled();
  });
  it("keeps caves and normal objects in the normal editor", async () => {
    pack.markers[0].type = "caves";
    await openBadge();
    expect(document.querySelector("[data-object-action]")).toBeNull();
    document.querySelector<HTMLButtonElement>("#fpb-object-dialog .fpb-object-actions button")!.click();
    expect(mocks.edit).toHaveBeenCalledWith(7);
    expect(mocks.dungeon).not.toHaveBeenCalled();
  });
});
