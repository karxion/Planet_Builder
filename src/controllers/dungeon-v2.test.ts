// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateDungeonInterior } from "@/generators/dungeon-interior";
import { recoverDungeonV2 } from "@/services/planet/dungeon-recovery";
import type { DungeonV2 } from "@/types/dungeon-v2";

describe("Dungeon v2 draft editor", () => {
  beforeEach(async () => {
    vi.resetModules();
    document.body.innerHTML = "";
    vi.stubGlobal("pack", { markers: [{ i: 1, cell: 3, type: "dungeons", icon: "#rpg-dungeon", x: 3, y: 4 }] });
    vi.stubGlobal("notes", [{ id: "marker1", name: "Original", legend: "" }]);
    vi.stubGlobal("seed", "ui");
    vi.stubGlobal("drawMarkers", vi.fn());
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  const click = (selector: string) => document.querySelector<HTMLButtonElement>(selector)!.click();
  const data = () => pack.markers[0].interior as DungeonV2;
  it("previews without writing, cancels safely, applies and opens saved v2 without rerolling", async () => {
    const { openDungeonV2 } = await import("./dungeon-v2");
    openDungeonV2(1);
    expect(pack.markers[0].interior).toBeUndefined();
    click("[data-cancel]");
    expect(pack.markers[0].interior).toBeUndefined();
    openDungeonV2(1);
    click("[data-apply]");
    const d = data();
    expect(d.version).toBe(2);
    expect(d.floors).toHaveLength(3);
    openDungeonV2(1);
    expect(pack.markers[0].interior).toBe(d);
    expect(document.querySelector("[data-apply]")).toBeNull();
    click("[data-insert]");
    expect(data()).toBe(d);
    expect(document.querySelector("[data-apply]")).not.toBeNull();
    click("[data-cancel]");
    expect(data()).toBe(d);
    click("[data-insert]");
    click("[data-apply]");
    expect(data().floors).toHaveLength(4);
    expect(data().floors.slice(0, 3)).toEqual(d.floors);
    click("[data-undo]");
    expect(data()).toEqual(d);
  });
  it("converts v1 only after Apply and preserves geometry and encounter values", async () => {
    const v1 = generateDungeonInterior("legacy-ui", "wizard-tower", "mage", "hell");
    pack.markers[0].interior = v1;
    const { openDungeonV2 } = await import("./dungeon-v2");
    openDungeonV2(1);
    expect(pack.markers[0].interior).toBe(v1);
    click("[data-apply]");
    expect(data().floors[0].tiles).toBe(v1.tiles);
    expect(data().floors[0].entities.map(e => e.feature)).toEqual(v1.features);
  });
  it("creates a separate marker for a new dungeon and excludes GM controls from player view", async () => {
    const { openDungeonV2 } = await import("./dungeon-v2");
    openDungeonV2(1);
    click("[data-apply]");
    const original = structuredClone(data());
    click("[data-new]");
    expect(pack.markers).toHaveLength(1);
    click("[data-apply]");
    expect(pack.markers).toHaveLength(2);
    expect(pack.markers[0].interior).toEqual(original);
    const checkbox = document.querySelector<HTMLInputElement>("[data-gm]")!;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change"));
    expect(document.querySelector("[data-floor-settings]")).toBeNull();
    expect(document.querySelector("[data-dv2-entity]")).toBeNull();
  });
  it("excludes private diagnostics and hidden floor names from the entire player dialog", async () => {
    const { openDungeonV2 } = await import("./dungeon-v2");
    openDungeonV2(1);
    click("[data-apply]");
    const d = data();
    d.floors[1].name = "GM_ONLY_FLOOR";
    d.floors[1].revealed = false;
    d.floors[0].note = "GM_ONLY_NOTES";
    d.connections[0].id = "GM_ONLY_CONNECTION";
    d.connections[0].to.endpointId = "missing";
    const checkbox = document.querySelector<HTMLInputElement>("[data-gm]")!;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change"));
    expect(document.querySelector("#fpb-dungeon-v2")!.innerHTML).not.toContain("GM_ONLY");
    expect(document.querySelector(".fpb-dv2-warning")).toBeNull();
  });
  it("preserves unsupported originals and isolates damaged floors only in a recovery draft", async () => {
    const { openDungeonV2 } = await import("./dungeon-v2");
    pack.markers[0].interior = { version: 99 };
    openDungeonV2(1);
    expect(document.querySelector("[data-raw]")).not.toBeNull();
    expect(pack.markers[0].interior).toEqual({ version: 99 });
    delete pack.markers[0].interior;
    openDungeonV2(1);
    click("[data-apply]");
    const broken = JSON.parse(JSON.stringify(data()));
    broken.floors[1].tiles = "bad";
    pack.markers[0].interior = broken;
    const recovery = recoverDungeonV2(broken);
    expect(recovery?.d.floors).toHaveLength(2);
    expect(broken.floors[1].tiles).toBe("bad");
    openDungeonV2(1);
    click("[data-recover]");
    expect(pack.markers[0].interior).toBe(broken);
    expect(document.querySelector("[data-apply]")).not.toBeNull();
  });
});
