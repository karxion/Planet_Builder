// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { anchoredMapObjects } from "@/utils/anchoredMapObjects";
import { applyIndividualMapIcons, restoreIndividualMapIcons } from "./individual-map-icons";
import { clearAnchoredMapObjects, drawAnchoredMapObjects } from "./anchored-map-objects";

const markers = [
  { i: 0, cell: 1, x: 100, y: 80, icon: "M", type: "mine" },
  { i: 1, cell: 1, x: 100, y: 80, icon: "T", type: "temple" },
  { i: 2, cell: 1, x: 160, y: 80, icon: "R", type: "ruin" },
  { i: 3, cell: 2, x: 300, y: 160, icon: "C", type: "cave" }
];
const burgs = [
  { i: 0, x: 0, y: 0 },
  { i: 1, name: "City", x: 100, y: 80 }
];
let zoom = 1;
beforeEach(() => {
  document.body.innerHTML =
    '<svg id="map"><defs></defs><g id="viewbox"><g id="burgIcons"><g><use id="burg1" x="100" y="80"/></g></g><g id="markers">' +
    markers.map(m => `<svg id="marker${m.i}" x="${m.x - 15}" y="${m.y - 30}"/>`).join("") +
    "</g></g></svg>";
  vi.stubGlobal("pack", {
    markers: structuredClone(markers),
    burgs: structuredClone(burgs),
    cells: { burg: [0, 1, 0] }
  });
  vi.stubGlobal("renderMarkerGlyph", () => '<text x="15" y="15">M</text>');
  zoom = 1;
  document.querySelector<SVGGElement>("#viewbox")!.getScreenCTM = () => ({ a: zoom, b: 0 }) as DOMMatrix;
});
afterEach(() => vi.unstubAllGlobals());
const label = (group: ReturnType<typeof anchoredMapObjects>[number]) => `Objects ${group.markers.length}`;

describe("Objects stay at their recorded locations", () => {
  it("waits for the initial world to be generated before building badges", () => {
    vi.stubGlobal("pack", {});
    const view = document.querySelector<SVGGElement>("#viewbox")!;
    expect(() => drawAnchoredMapObjects(view, label, vi.fn())).not.toThrow();
    expect(view.querySelector("#fpb-anchored-objects")).toBeNull();
  });
  it("groups only city-local records; a manually moved marker is never snapped by its old cell", () => {
    const groups = anchoredMapObjects(markers, burgs, [0, 1, 0]);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toMatchObject({ key: "burg:1", x: 100, y: 80, markers: [markers[0], markers[1]] });
    expect(groups[1]).toMatchObject({ key: "point:160:80", x: 160, y: 80 });
    expect(groups[1].burgId).toBeUndefined();
  });

  it("cleans legacy displacement, keeps city anchors fixed, and gives compact badges click/keyboard access", () => {
    const view = document.querySelector<SVGGElement>("#viewbox")!;
    const marker = view.querySelector("#marker0")!;
    marker.setAttribute("data-fpb-individual-transform", "");
    marker.setAttribute("transform", "translate(-120 -300)");
    view.insertAdjacentHTML("beforeend", '<g id="fpb-individual-leaders"><path d="M0 0L100 100"/></g>');
    const before = structuredClone(pack);
    applyIndividualMapIcons(view);
    const open = vi.fn();
    drawAnchoredMapObjects(view, label, open);
    expect(marker.hasAttribute("transform")).toBe(false);
    expect(view.querySelector("#fpb-individual-leaders")).toBeNull();
    expect(view.querySelector("#burg1")!.getAttribute("x")).toBe("100");
    expect(view.querySelector("#burg1")!.hasAttribute("transform")).toBe(false);
    const badge = view.querySelector<SVGGElement>('[data-object-anchor="burg:1"]')!;
    expect(badge.getAttribute("transform")).toBe("translate(100 80) scale(1)");
    expect(badge.querySelector("text")!.textContent).toBe("M");
    badge.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    badge.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(open).toHaveBeenCalledTimes(2);
    expect(open.mock.calls[0][0].markers).toHaveLength(2);
    expect(pack).toEqual(before);
  });

  it("scales presentation around the same point and removes transient badges from a saved clone", () => {
    const view = document.querySelector<SVGGElement>("#viewbox")!;
    drawAnchoredMapObjects(view, label, vi.fn());
    zoom = 4;
    drawAnchoredMapObjects(view, label, vi.fn());
    expect(view.querySelectorAll("#fpb-anchored-objects")).toHaveLength(1);
    expect(view.querySelector('[data-object-anchor="point:160:80"]')!.getAttribute("transform")).toBe(
      "translate(160 80) scale(0.25)"
    );
    const clone = view.cloneNode(true) as SVGGElement;
    clearAnchoredMapObjects(clone);
    restoreIndividualMapIcons(clone);
    expect(clone.querySelector("[data-fpb-object-badged], #fpb-anchored-objects")).toBeNull();
    expect(clone.querySelector("#marker2")!.getAttribute("x")).toBe("145");
    expect(view.querySelector("#fpb-anchored-objects")).not.toBeNull();
    document.body.dataset.worldSpace = "underwater";
    drawAnchoredMapObjects(view, label, vi.fn());
    expect(view.querySelector("#fpb-anchored-objects")).toBeNull();
  });

  it("keeps different cities with identical names and nearby coordinates visible", () => {
    const view = document.querySelector<SVGGElement>("#viewbox")!;
    view
      .querySelector("#burgIcons > g")!
      .insertAdjacentHTML("beforeend", '<use id="burg2" x="101" y="80"/><use id="burg1" x="100" y="80"/>');
    applyIndividualMapIcons(view);
    expect(view.querySelector("#burg2")!.hasAttribute("data-fpb-duplicate-of")).toBe(false);
    expect(view.querySelectorAll('[data-fpb-duplicate-of="burg1"]')).toHaveLength(1);
  });
});
