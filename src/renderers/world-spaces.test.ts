// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { WorldSpaceStore } from "@/services/world-spaces/model";
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
  it("shows only the active space and leaves the surface uncovered", () => {
    const store = new WorldSpaceStore();
    store.addSite("underwater", "city", 0.5, 0.5);
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    drawWorldSpaces({ parent, data: store.snapshot(), width: 1000, height: 500, selected: "", labels });
    expect(parent.querySelector("rect")).toBeNull();
    expect(parent.querySelector("[data-space-site]")).toBeNull();
  });
});
