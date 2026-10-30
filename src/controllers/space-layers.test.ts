// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SPACE_LAYER_IDS, spaceLayers } from "@/data/space-layers";
import { emptyWorldSpaces, isWorldSpaces } from "@/services/world-spaces/model";
import { WorldSpaces } from "@/services/world-spaces/state";
import { initSpaceLayerControls } from "./space-layers";

let events: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  WorldSpaces.restore(emptyWorldSpaces());
  document.body.innerHTML = `<div id="layersContent"><select id="layersPreset"><option value="political">Political</option>
    <option value="physical">Physical</option><option value="cultural">Culture</option><option value="custom">Custom</option></select>
    <button id="savePresetButton">+</button><button id="removePresetButton">-</button>
    <ul id="mapLayers">${[...SPACE_LAYER_IDS, "toggleTemperature"].map(id => `<li id="${id}" class="buttonoff">${id}</li>`).join("")}</ul></div>`;
  events = vi.spyOn(document, "addEventListener");
});
afterEach(() => {
  for (const [name, handler, options] of events.mock.calls) document.removeEventListener(name, handler, options);
  delete window.worldSpaceLayerOrder;
  delete window.worldSpaceLayerKey;
  delete window.getDefaultPresets;
  vi.restoreAllMocks();
});
describe("active-world layer menu", () => {
  it("routes click and keyboard controls without invoking surface handlers, and restores the surface UI", () => {
    const relief = document.getElementById("toggleRelief")!,
      legacy = vi.fn();
    relief.onclick = legacy;
    const surface = document.getElementById("layersContent")!.innerHTML;
    let sync = () => {};
    sync = initSpaceLayerControls(() => sync());
    WorldSpaces.update(d => {
      d.activeSpace = "underwater";
    });
    sync();
    expect(relief.getAttribute("aria-pressed")).toBe("true");
    relief.click();
    expect(legacy).not.toHaveBeenCalled();
    expect(spaceLayers(WorldSpaces.snapshot()).toggleRelief).toBe(false);
    WorldSpaces.update(d => {
      d.activeSpace = "underground";
    });
    sync();
    expect(spaceLayers(WorldSpaces.snapshot()).toggleRelief).toBe(true);
    relief.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " " }));
    expect(spaceLayers(WorldSpaces.snapshot()).toggleRelief).toBe(false);
    WorldSpaces.update(d => {
      d.activeSpace = "surface";
    });
    sync();
    expect(document.getElementById("layersContent")!.innerHTML).toBe(surface);
    relief.click();
    expect(legacy).toHaveBeenCalledOnce();
  });
  it("blocks unsupported data layers and surface preset mutations, while applying supported presets", () => {
    const legacy = vi.fn(),
      select = document.querySelector<HTMLSelectElement>("#layersPreset")!;
    select.onchange = legacy;
    window.getDefaultPresets = () => ({ physical: ["toggleRelief", "toggleBurgIcons", "toggleLabels", "toggleLakes"] });
    let sync = () => {};
    sync = initSpaceLayerControls(() => sync());
    WorldSpaces.update(d => {
      d.activeSpace = "underwater";
    });
    sync();
    const before = WorldSpaces.snapshot();
    document.getElementById("toggleTemperature")!.click();
    expect(WorldSpaces.snapshot()).toEqual(before);
    expect(document.getElementById("toggleTemperature")!.getAttribute("aria-disabled")).toBe("true");
    expect(document.querySelector<HTMLOptionElement>('option[value="cultural"]')!.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>("#savePresetButton")!.disabled).toBe(true);
    select.value = "physical";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(legacy).not.toHaveBeenCalled();
    expect(spaceLayers(WorldSpaces.snapshot())).toMatchObject({
      toggleRelief: true,
      toggleStates: false,
      toggleGoods: false
    });
    expect(isWorldSpaces(WorldSpaces.snapshot())).toBe(true);
  });
  it("saves the current world's layer order and routes its plain hotkeys", () => {
    let sync = () => {};
    sync = initSpaceLayerControls(() => sync());
    WorldSpaces.update(d => {
      d.activeSpace = "underground";
    });
    sync();
    const labels = document.getElementById("toggleLabels")!;
    labels.dataset.shortcut = "L";
    document.getElementById("mapLayers")!.prepend(labels);
    expect(window.worldSpaceLayerOrder!()).toBe(true);
    expect(WorldSpaces.snapshot().layers!.underground!.order![0]).toBe("toggleLabels");
    expect(window.worldSpaceLayerKey!(new KeyboardEvent("keyup", { code: "KeyL" }))).toBe(true);
    expect(spaceLayers(WorldSpaces.snapshot()).toggleLabels).toBe(false);
    expect(window.worldSpaceLayerKey!(new KeyboardEvent("keyup", { code: "KeyL", ctrlKey: true }))).toBe(false);
    WorldSpaces.update(d => {
      d.activeSpace = "surface";
    });
    sync();
    expect(window.worldSpaceLayerOrder!()).toBe(false);
  });
});
