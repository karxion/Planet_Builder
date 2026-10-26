// @vitest-environment jsdom

import { select } from "d3";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createContentSanitizer } from "@/services/content-sanitizer";

vi.mock("../utils", () => ({
  clipPoly: (points: number[][]) => points,
  P: () => true,
  rn: (value: number) => value,
  round: (value: string) => value
}));
import "./ocean-layers";

beforeEach(() => {
  document.body.innerHTML = '<svg><g id="oceanLayers"></g></svg>';
  vi.stubGlobal("oceanLayers", select<SVGGElement, unknown>("#oceanLayers"));
  vi.stubGlobal("TIME", false);
  vi.stubGlobal("ERROR", false);
  vi.stubGlobal("graphWidth", 100);
  vi.stubGlobal("graphHeight", 100);
  // A boundary ocean cell and three outside cells trace a closed triangle.
  vi.stubGlobal("grid", {
    cells: { i: [0], t: [-1], b: [1], v: [[1, 2, 3]] },
    vertices: {
      c: [[], [0, 1, 2], [0, 2, 3], [0, 3, 1]],
      v: [[], [2, 3, undefined], [3, 1, undefined], [1, 2, undefined]],
      p: [
        [0, 0],
        [10, 10],
        [90, 10],
        [50, 90]
      ]
    }
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("ocean contours after map restoration", () => {
  it.each([null, "", "invalid", "-1,NaN"])("renders without crashing with lost or invalid layers %s", layers => {
    const group = document.querySelector("g")!;
    if (layers !== null) group.setAttribute("layers", layers);
    expect(() => window.OceanLayers()).not.toThrow();
    expect(group.querySelector("path")?.getAttribute("d")).toMatch(/^M/);
  });

  it.each(["none", "random", "-6,-3,-1"])("retains %s after sanitized import and regeneration", layers => {
    const map = createContentSanitizer(window).sanitizeMapSvg(
      `<svg id="map"><g id="oceanLayers" layers="${layers}"/></svg>`
    );
    document.body.replaceChildren(map);
    vi.stubGlobal("oceanLayers", select<SVGGElement, unknown>("#oceanLayers"));
    window.OceanLayers();
    expect(map.querySelector("#oceanLayers")?.getAttribute("layers")).toBe(layers);
    expect(map.querySelectorAll("path").length).toBe(layers === "none" ? 0 : 1);
  });
});
