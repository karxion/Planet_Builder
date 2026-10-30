// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateUnderwater } from "@/generators/underwater";
import { generateUnderground } from "@/generators/underground";
import { emptyWorldSpaces } from "@/services/world-spaces/model";
import { WorldSpaces } from "@/services/world-spaces/state";
import { EditorDrafts } from "@/services/editor-drafts";
import { initWorldSpaces, refreshWorldSpaces, renderSpacePanel } from "./world-spaces";

let windowEvents: ReturnType<typeof vi.spyOn>, documentEvents: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  document.body.innerHTML =
    '<button id="fpb-settings-button"></button><svg id="map"><g id="viewbox"></g></svg><div id="notes"></div>';
  vi.stubGlobal("graphWidth", 1000);
  vi.stubGlobal("graphHeight", 500);
  EditorDrafts.clear();
  windowEvents = vi.spyOn(window, "addEventListener");
  documentEvents = vi.spyOn(document, "addEventListener");
});
afterEach(() => {
  for (const [name, handler, options] of windowEvents.mock.calls) window.removeEventListener(name, handler, options);
  for (const [name, handler, options] of documentEvents.mock.calls)
    document.removeEventListener(name, handler, options);
  delete window.worldSpaceMapTip;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const surface = { columns: 32, rows: 24, heights: Array.from({ length: 768 }, (_, i) => (i % 32 < 9 ? 50 : 8)) };
describe("World space map interaction", () => {
  it("inspects bathymetric icons with exact saved depth by click and keyboard, without changing project data", () => {
    const data = generateUnderwater(emptyWorldSpaces(), "depth-key", surface);
    WorldSpaces.restore(data);
    initWorldSpaces(vi.fn());
    const before = WorldSpaces.snapshot();
    const mark = document.querySelector<SVGElement>("[data-seabed-relief-cell]")!;
    const cell = Number(mark.dataset.seabedReliefCell);
    mark.querySelector("use")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const panel = document.querySelector<HTMLElement>("#fpb-space-panel")!;
    expect(panel.hidden).toBe(false);
    expect(panel.textContent).toContain(data.underwater!.depths[cell].toLocaleString("ko-KR"));
    expect(panel.querySelector("form")).toBeNull();
    panel.querySelector<HTMLButtonElement>("[data-close]")!.click();
    mark.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    expect(panel.hidden).toBe(false);
    expect(WorldSpaces.snapshot()).toEqual(before);
    const tip = window.worldSpaceMapTip!([Number(mark.dataset.spaceX) * 1000, Number(mark.dataset.spaceY) * 500], mark);
    expect(tip).toContain(data.underwater!.depths[cell].toLocaleString("ko-KR"));
    expect(document.querySelectorAll("#fpb-seabed-depth-key li")).toHaveLength(4);
    document.querySelector<HTMLButtonElement>("#fpb-seabed-depth-key button")!.click();
    expect(panel.textContent).toContain("지형 아이콘·수심 범례");
    expect(panel.querySelectorAll(".fpb-seabed-relief-row img")).toHaveLength(16);
    WorldSpaces.update(d => {
      d.layers = { underwater: { visible: { toggleRelief: false } } };
    });
    refreshWorldSpaces();
    expect(document.querySelector("#fpb-seabed-depth-key")).toBeNull();
    WorldSpaces.update(d => {
      d.activeSpace = "surface";
    });
    refreshWorldSpaces();
    expect(document.querySelector("[data-seabed-relief-cell]")).toBeNull();
  });
  it.each([
    "underwater",
    "underground"
  ] as const)("opens %s scenery with click and keyboard without mutating the world", space => {
    const data = generateUnderground(generateUnderwater(emptyWorldSpaces(), "select", surface), {
      seed: "select",
      chambers: 12
    });
    data.activeSpace = space;
    WorldSpaces.restore(data);
    initWorldSpaces(vi.fn());
    const before = WorldSpaces.snapshot();
    const object = document.querySelector<SVGElement>("[data-scenery-cell]")!;
    const hit = object.querySelector("circle")!;
    expect(object.closest('[pointer-events="none"]')).toBeNull();
    const background = document.querySelector("#viewbox")!;
    const clicked = vi.fn();
    background.addEventListener("click", clicked);
    hit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const panel = document.querySelector<HTMLElement>("#fpb-space-panel")!;
    expect(panel.hidden).toBe(false);
    expect(panel.querySelector("[data-content]")!.innerHTML).toContain(`<h4>${object.getAttribute("aria-label")}</h4>`);
    expect(clicked).not.toHaveBeenCalled();
    panel.querySelector<HTMLButtonElement>("[data-close]")!.click();
    object.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(panel.hidden).toBe(false);
    expect(WorldSpaces.snapshot()).toEqual(before);
    const roots = [...document.querySelector("#fpb-world-spaces")!.children];
    const scenery = roots.findIndex(el => el.hasAttribute("data-subsurface-scenery"));
    const territory = roots.findIndex(el => el.tagName.toLowerCase() === "ellipse");
    expect(scenery).toBeGreaterThan(territory);
    WorldSpaces.update(d => {
      d.activeSpace = space === "underwater" ? "underground" : "underwater";
    });
    renderSpacePanel();
    expect(panel.querySelector('[data-tab="sites"]')!.getAttribute("aria-pressed")).toBe("true");
    expect(panel.querySelector('[data-tab="object"]')).toBeNull();
  });

  it("keeps city selection working, escapes tooltip names, and returns to the surface path", () => {
    const data = generateUnderground(emptyWorldSpaces(), { seed: "cities", chambers: 12 });
    const city = data.sites.find(s => s.kind === "city" && s.depth === 300)!;
    city.name = "<img src=x onerror=alert(1)> City";
    WorldSpaces.restore(data);
    initWorldSpaces(vi.fn());
    const mark = document.querySelector<SVGElement>(`g[data-space-site="${city.id}"]`)!;
    mark.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(document.querySelector<HTMLInputElement>('#fpb-space-panel input[name="name"]')!.value).toBe(city.name);
    expect(window.worldSpaceMapTip!([city.x * 1000, city.y * 500], mark)).toContain("&lt;img");
    WorldSpaces.update(d => {
      d.activeSpace = "surface";
    });
    refreshWorldSpaces();
    expect(window.worldSpaceMapTip!([100, 100], document.querySelector("#map")!)).toBeUndefined();
    expect(document.querySelector("[data-scenery-cell]")).toBeNull();
  });

  it("routes legacy mouse movement before querying any surface cell, note or tooltip", () => {
    const source = readFileSync(resolve(process.cwd(), "public/modules/ui/general.js"), "utf8");
    const code = source.slice(source.indexOf("function handleMouseMove()"), source.indexOf("let currentNoteId"));
    window.worldSpaceMapTip = () => "Underground territory";
    const tip = vi.fn(),
      findCell = vi.fn(),
      showNotes = vi.fn();
    const env = {
      window,
      document,
      d3: { mouse: () => [10, 10], event: { target: document.querySelector("#map") } },
      options: {},
      notesEditor: null,
      tooltip: { dataset: {} },
      tip,
      findCell,
      showNotes
    };
    const handler = new Function(...Object.keys(env), `${code}; return handleMouseMove;`)(...Object.values(env));
    handler.call(document.querySelector("#viewbox"));
    expect(tip).toHaveBeenCalledWith("Underground territory");
    expect(findCell).not.toHaveBeenCalled();
    expect(showNotes).not.toHaveBeenCalled();
    window.worldSpaceMapTip = () => undefined;
    handler.call(document.querySelector("#viewbox"));
    expect(findCell).toHaveBeenCalledWith(10, 10);
  });
});
