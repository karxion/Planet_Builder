// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateUnderwater } from "@/generators/underwater";
import { generateUnderground } from "@/generators/underground";
import { emptyWorldSpaces } from "@/services/world-spaces/model";
import { undergroundIndex } from "@/data/underground";
import { drawWorldSpaces } from "./world-spaces";

const labels = { surface: "Surface", underwater: "Sea", underground: "Inner world" };
const surface = {
  columns: 32,
  rows: 24,
  heights: Array.from({ length: 768 }, (_, i) => (i % 32 < 12 ? 70 : i % 32 < 20 ? 5 : 12))
};
beforeEach(() => {
  const source = readFileSync(resolve(process.cwd(), "src/index.html"), "utf8");
  const symbols = ["mount", "deciduous", "grass"]
    .map(kind => source.match(new RegExp(`<symbol id="relief-${kind}-2"[\\s\\S]*?</symbol>`))![0])
    .join("");
  document.body.innerHTML = `<svg><defs>${symbols}</defs><g id="viewbox"><g id="surface-layer"/></g></svg>`;
});
describe("independent space layers", () => {
  it("separates territory fill, borders, terrain, resources, cities, names and routes without changing the world", () => {
    const data = generateUnderwater(emptyWorldSpaces(), "layers", surface),
      before = structuredClone(data);
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    data.layers = {
      underwater: {
        visible: {
          toggleStates: false,
          toggleBurgIcons: false,
          toggleRelief: false,
          toggleGoods: false,
          toggleHeight: true,
          toggleGrid: true
        },
        order: ["toggleLabels", "toggleStates"]
      }
    };
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    const layer = (id: string) => parent.querySelector(`[data-space-layer-group="${id}"]`)!;
    for (const id of ["toggleStates", "toggleBurgIcons", "toggleRelief", "toggleGoods"])
      expect(layer(id).getAttribute("display")).toBe("none");
    for (const id of ["toggleBorders", "toggleLabels", "toggleRoutes", "toggleHeight", "toggleGrid"])
      expect(layer(id).getAttribute("display")).toBeNull();
    expect(layer("toggleLabels").querySelectorAll("[data-space-city-label]").length).toBeGreaterThan(6);
    expect(layer("toggleBurgIcons").querySelector("[data-space-site]")).not.toBeNull();
    expect(layer("toggleBorders").querySelector("path")).not.toBeNull();
    expect(
      [...parent.querySelectorAll("[data-space-layer-group]")]
        .slice(0, 2)
        .map(n => n.getAttribute("data-space-layer-group"))
    ).toEqual(["toggleLabels", "toggleStates"]);
    expect(parent.querySelector("#surface-layer")!.outerHTML).toBe('<g id="surface-layer"></g>');
    delete data.layers;
    expect(data).toEqual(before);
  });
  it("renders surface-style forests, mountains and grass in hollow worlds, with self-contained artwork", () => {
    const data = generateUnderground(emptyWorldSpaces(), {
      seed: "hollow-relief",
      chambers: 12,
      mode: "hollow",
      surface
    });
    const parent = document.querySelector<SVGGElement>("#viewbox")!;
    const before = structuredClone(data);
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    const marks = [...parent.querySelectorAll<SVGUseElement>("[data-hollow-relief]")];
    expect(marks.length).toBeGreaterThan(60);
    expect(new Set(marks.map(n => n.dataset.hollowRelief))).toEqual(new Set(["mount", "deciduous", "grass"]));
    for (const mark of marks) {
      expect(parent.querySelector(mark.getAttribute("href")!)?.querySelector("path,polygon")).not.toBeNull();
      const x = (+mark.getAttribute("x")! + 9) / 1000,
        y = (+mark.getAttribute("y")! + 12) / 500;
      const cell = data.underground!.levels[0].cells[undergroundIndex(data.underground!, x, y)];
      expect(cell).toBe(mark.dataset.hollowRelief === "mount" ? 4 : mark.dataset.hollowRelief === "deciduous" ? 5 : 1);
    }
    expect(parent.querySelector('[data-scenery-asset="c01"]')).toBeNull();
    expect(data).toEqual(before);
  });
});
