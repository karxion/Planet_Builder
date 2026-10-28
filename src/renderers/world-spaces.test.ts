// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { generateUnderground } from "@/generators/underground";
import { generateUnderwater } from "@/generators/underwater";
import { emptyWorldSpaces, WorldSpaceStore } from "@/services/world-spaces/model";
import { drawWorldSpaces } from "./world-spaces";

beforeEach(() => {
  document.body.innerHTML = '<svg><g id="viewbox"></g></svg>';
});
const labels = { surface: "지상", underwater: "수중", underground: "지저" };

it("draws reference geography, safe labels, independent territories and cross-space gateways", () => {
  const store = new WorldSpaceStore();
  const a = store.addSite("underwater", "city", 0.25, 0.5);
  const b = store.addSite("underground", "city", 0.25, 0.5);
  store.addSite("underwater", "territory", 0.25, 0.5);
  store.update(d => {
    d.activeSpace = "underwater";
    d.sites[0].name = '<img src=x onerror="alert(1)">';
    d.links.push({ id: "gate", name: "passage", from: a.id, to: b.id });
  });
  const parent = document.querySelector<SVGGElement>("#viewbox")!;
  const original = store.snapshot();
  drawWorldSpaces({
    parent,
    data: original,
    width: 1000,
    height: 500,
    selected: a.id,
    labels,
    landPath: "M0,0L100,0L0,100Z"
  });
  expect(parent.querySelectorAll("#fpb-world-spaces")).toHaveLength(1);
  expect(parent.querySelector("ellipse")?.getAttribute("cx")).toBe("250");
  expect(parent.querySelector("[data-space-travel]")?.getAttribute("data-space-travel")).toBe(b.id);
  expect(parent.querySelector("img,script")).toBeNull();
  expect(parent.textContent).toContain('<img src=x onerror="alert(1)">');
  expect(store.snapshot()).toEqual(original);
  drawWorldSpaces({ parent, data: original, width: 1000, height: 500, selected: "", labels });
  expect(parent.querySelectorAll("#fpb-world-spaces")).toHaveLength(1);
});

describe("space visibility", () => {
  it("renders seabed, water-clipped ownership, bathymetric contours and routed trade paths", () => {
    const data = generateUnderwater(emptyWorldSpaces(), "render-ocean", {
      columns: 48,
      rows: 32,
      heights: Array.from({ length: 48 * 32 }, (_, i) => (i % 48 > 20 && i % 48 < 27 ? 40 : 5))
    });
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    const original = structuredClone(data);
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    expect(parent.querySelectorAll("[data-sea-owner]")).toHaveLength(6);
    expect(parent.querySelectorAll("[data-sea-isobath]")).toHaveLength(4);
    expect(parent.querySelector("[data-sea-route]")?.getAttribute("d")).toContain("L");
    expect(parent.querySelector("[data-sea-owner]")?.getAttribute("clip-path")).toBe("url(#fpb-sea-water)");
    expect(data).toEqual(original);
    data.underwater!.view = "terrain";
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    expect(parent.querySelector("[data-sea-owner]")).toBeNull();
    expect(parent.querySelectorAll("#fpb-sea-water")).toHaveLength(1);
  });
  it("renders only the selected underground depth with terrain contours and working depth passages", () => {
    const data = generateUnderground(emptyWorldSpaces(), { seed: "render-caves", chambers: 12 });
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    const before = structuredClone(data);
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    expect(parent.querySelector('[data-underground-level="upper"]')).not.toBeNull();
    expect(parent.querySelector("#fpb-underground-floor path")?.getAttribute("d")).toContain("M");
    const middleGateway = data.sites.find(s => s.kind === "gateway" && s.depth === 1500)!;
    expect(parent.querySelector(`[data-space-travel="${middleGateway.id}"]`)).not.toBeNull();
    const deepCity = data.sites.find(s => s.kind === "city" && s.depth === 4000)!;
    expect(parent.querySelector(`[data-space-site="${deepCity.id}"]`)).toBeNull();
    expect(parent.querySelector('[clip-path="url(#fpb-underground-floor)"]')).not.toBeNull();
    expect(data).toEqual(before);
    data.underground!.activeLevel = "deep";
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    expect(parent.querySelector(`[data-space-site="${deepCity.id}"]`)).not.toBeNull();
    expect(parent.querySelectorAll("#fpb-underground-floor")).toHaveLength(1);
  });
  it("shows only the active space and leaves the surface uncovered", () => {
    const store = new WorldSpaceStore();
    store.addSite("underwater", "city", 0.5, 0.5);
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    drawWorldSpaces({ parent, data: store.snapshot(), width: 1000, height: 500, selected: "", labels });
    expect(parent.querySelector("rect")).toBeNull();
    expect(parent.querySelector("[data-space-site]")).toBeNull();
  });
});
