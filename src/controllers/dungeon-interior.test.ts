// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Marker } from "@/generators/markers-generator";
import editorCode from "../../public/modules/ui/editors.js?raw";

describe("Dungeon interior interactions", () => {
  beforeEach(async () => {
    vi.resetModules();
    document.body.innerHTML =
      '<svg id="map"><g id="viewbox"><g id="markers"><svg id="marker7"><g><use/></g></svg></g></g></svg>';
    vi.stubGlobal("pack", {
      markers: [
        {
          i: 7,
          type: "dungeons",
          icon: "#rpg-dungeon",
          cell: 3,
          x: 30,
          y: 40,
          adventure: {
            version: 1,
            themeId: "wizard-tower",
            monsterId: "mage",
            inhabitants: 8,
            cleared: false,
            edited: false,
            generation: 0
          }
        }
      ]
    });
    vi.stubGlobal("notes", [{ id: "marker7", name: '<img src=x onerror="alert(1)">' }]);
    vi.stubGlobal("seed", "interior-ui");
    vi.stubGlobal("editMarker", vi.fn());
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    const { initDungeonInterior } = await import("./dungeon-interior");
    initDungeonInterior();
    const dialog = document.querySelector<HTMLDialogElement>("dialog")!;
    dialog.showModal = () => {
      dialog.open = true;
    };
    dialog.close = () => {
      dialog.open = false;
    };
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  const marker = () => pack.markers[0] as Marker;
  const change = (selector: string, value: string) => {
    const select = document.querySelector<HTMLSelectElement>(selector)!;
    select.value = value;
    select.dispatchEvent(new Event("change"));
  };
  it("opens from the actual legacy map click dispatcher and persists generated data only once", () => {
    const changed = vi.fn();
    window.addEventListener("project:changed", changed);
    try {
      new Function("modules", "d3", "window", "editMarker", `${editorCode}\nclicked();`)(
        {},
        { event: { target: document.querySelector("use") } },
        window,
        editMarker
      );
      expect(document.querySelector<HTMLDialogElement>("#fpb-dungeon-interior")!.open).toBe(true);
      expect(marker().interior).toBeDefined();
      expect(editMarker).not.toHaveBeenCalled();
      expect(changed).toHaveBeenCalledTimes(1);
      const dungeon = marker().interior;
      openDungeonInterior(7);
      expect(marker().interior).toBe(dungeon);
      expect(changed).toHaveBeenCalledTimes(1);
      expect(document.querySelector("h2")!.textContent).toContain("<img");
      expect(document.querySelector("h2 img")).toBeNull();
      expect(marker().lock).toBe(true);
    } finally {
      window.removeEventListener("project:changed", changed);
    }
  });
  it("preserves non-dungeon marker editing", () => {
    marker().type = "battlefields";
    marker().icon = "battle";
    delete marker().adventure;
    new Function("modules", "d3", "window", "editMarker", `${editorCode}\nclicked();`)(
      {},
      { event: { target: document.querySelector("use") } },
      window,
      editMarker
    );
    expect(editMarker).toHaveBeenCalledOnce();
    expect(marker().interior).toBeUndefined();
  });
  it("switches difficulty without geometry rerolls, hides secrets and selects rooms", () => {
    openDungeonInterior(7);
    const tiles = marker().interior!.tiles;
    change("[data-difficulty]", "hell");
    expect(marker().interior!.difficulty).toBe("hell");
    expect(marker().interior!.tiles).toBe(tiles);
    const bossId = marker().interior!.bossRoomId;
    change("[data-room-select]", String(bossId));
    expect(document.querySelector(".fpb-interior-detail")!.textContent).toContain("보스 전술");
    const gm = document.querySelector<HTMLInputElement>("[data-gm]")!;
    gm.checked = false;
    gm.dispatchEvent(new Event("change"));
    expect(document.querySelector("[data-feature]")).toBeNull();
    expect(document.querySelector(".fpb-interior-detail")!.textContent).not.toContain("보스");
    for (const room of marker().interior!.rooms.filter(room => room.secret))
      expect(document.querySelector(`[data-room="${room.id}"]`)).toBeNull();
  });
  it("regenerates only after confirmation and preserves data on failure", async () => {
    openDungeonInterior(7);
    const original = marker().interior;
    vi.mocked(confirm).mockReturnValueOnce(false);
    document.querySelector<HTMLButtonElement>("[data-regenerate]")!.click();
    expect(marker().interior).toBe(original);
    const generator = await import("@/generators/dungeon-interior");
    vi.spyOn(generator, "generateDungeonInterior").mockImplementationOnce(() => {
      throw new Error("fail");
    });
    document.querySelector<HTMLButtonElement>("[data-regenerate]")!.click();
    expect(marker().interior).toBe(original);
    expect(document.querySelector('[role="status"]')!.textContent).toContain("보존");
    document.querySelector<HTMLButtonElement>("[data-regenerate]")!.click();
    expect(marker().interior!.generation).toBe(1);
    expect(marker().interior!.tiles).not.toBe(original!.tiles);
  });
  it("provides a CR source selector for old/manual dungeons and retains direct marker editing", () => {
    delete marker().adventure;
    openDungeonInterior(7);
    expect(document.querySelector("[data-theme]")).not.toBeNull();
    change("[data-theme]", "wizard-tower");
    change("[data-monster]", "archmage");
    expect(marker().interior!.baseCr).toBe(12);
    document.querySelector<HTMLButtonElement>("[data-edit-marker]")!.click();
    expect(editMarker).toHaveBeenCalledWith(7);
    openDungeonInterior(7);
    window.dispatchEvent(new Event("map:loaded"));
    expect(document.querySelector<HTMLDialogElement>("dialog")!.open).toBe(false);
  });
  it("uses the saved interior seed after world seed changes and preserves keyboard focus", () => {
    openDungeonInterior(7);
    const original = marker().interior!;
    vi.stubGlobal("seed", "changed-world-seed");
    change("[data-difficulty]", "challenging");
    expect(marker().interior!.seed).toBe(original.seed);
    expect(marker().interior!.tiles).toBe(original.tiles);
    const room = document.querySelector<SVGElement>(`[data-room="${marker().interior!.bossRoomId}"]`)!;
    room.focus();
    room.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(document.activeElement?.getAttribute("data-room")).toBe(String(marker().interior!.bossRoomId));
    expect(document.querySelector<HTMLButtonElement>("[data-zoom-out]")!.disabled).toBe(true);
    document.querySelector<HTMLButtonElement>("[data-zoom-in]")!.click();
    expect(document.querySelector<HTMLButtonElement>("[data-zoom-out]")!.disabled).toBe(false);
  });
  it("exports a player SVG without secrets or encounter data and releases its blob URL", async () => {
    openDungeonInterior(7);
    change("[data-difficulty]", "hell");
    const gm = document.querySelector<HTMLInputElement>("[data-gm]")!;
    gm.checked = false;
    gm.dispatchEvent(new Event("change"));
    let output: Blob | undefined;
    const createObjectURL = vi.fn((blob: Blob) => {
      output = blob;
      return "blob:test-export";
    });
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", Object.assign(class extends URL {}, { createObjectURL, revokeObjectURL }));
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    vi.useFakeTimers();
    try {
      document.querySelector<HTMLButtonElement>("[data-export]")!.click();
      expect(createObjectURL).toHaveBeenCalledOnce();
      const svg = await output!.text();
      expect(svg).not.toContain("data-feature");
      expect(svg).not.toContain("보스");
      for (const room of marker().interior!.rooms.filter(room => room.secret))
        expect(svg).not.toContain(`data-room="${room.id}"`);
      vi.runAllTimers();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-export");
    } finally {
      vi.useRealTimers();
    }
  });
});
