// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { TRANSPORT_STYLE_ATTRIBUTE } from "@/data/map-transport-style";
import { applyMapTransportStyle } from "./map-transport-style";

let map: SVGSVGElement;
beforeEach(() => {
  document.body.innerHTML = `<svg id="map" xmlns="http://www.w3.org/2000/svg"><g id="rivers" fill="#555" style="fill: #555; opacity: .3"><path d="M0,0L1,1Z"/></g><g id="routes"><g id="roads" stroke="#00f" stroke-width=".5"><path d="M1,1L2,2"/></g><g id="trails" stroke="#00f" stroke-width=".5"/><g id="searoutes" stroke="white"/></g></svg>`;
  map = document.querySelector<SVGSVGElement>("svg")!;
});

describe("transport map styles", () => {
  it("uses blue rivers and visibly distinct road weights and patterns", () => {
    expect(applyMapTransportStyle(map)).toBe(true);
    expect(map.querySelector("#rivers")?.getAttribute("fill")).toBe("#278fc4");
    expect(map.querySelector<SVGElement>("#rivers")?.style.fill).toBe("");
    expect(map.querySelector<SVGElement>("#rivers")?.style.opacity).toBe("");
    const roads = map.querySelector("#roads")!;
    const trails = map.querySelector("#trails")!;
    expect(Number(roads.getAttribute("stroke-width"))).toBeGreaterThan(Number(trails.getAttribute("stroke-width")) * 3);
    expect(roads.getAttribute("stroke-dasharray")).toBe("none");
    expect(trails.getAttribute("stroke-dasharray")).toBe("1 1.8");
  });

  it("does not alter geometry, sea lanes, visibility or unrelated groups", () => {
    const paths = [...map.querySelectorAll("path")].map(path => path.outerHTML);
    const sea = map.querySelector("#searoutes")!.outerHTML;
    map.querySelector<SVGElement>("#roads")!.style.display = "none";
    applyMapTransportStyle(map);
    expect([...map.querySelectorAll("path")].map(path => path.outerHTML)).toEqual(paths);
    expect(map.querySelector("#searoutes")!.outerHTML).toBe(sea);
    expect(map.querySelector<SVGElement>("#roads")!.style.display).toBe("none");
  });

  it("preserves manual styles across refreshes and serialized map reloads", () => {
    applyMapTransportStyle(map);
    map.querySelector("#roads")!.setAttribute("stroke-width", "2");
    map.querySelector("#rivers")!.setAttribute("fill", "#00aaff");
    const restored = new DOMParser().parseFromString(new XMLSerializer().serializeToString(map), "image/svg+xml")
      .documentElement as unknown as SVGSVGElement;
    expect(applyMapTransportStyle(restored)).toBe(false);
    expect(restored.querySelector("#roads")?.getAttribute("stroke-width")).toBe("2");
    expect(restored.querySelector("#rivers")?.getAttribute("fill")).toBe("#00aaff");
  });

  it("handles partial maps and uses a light non-blue road palette on dark presets", () => {
    map.querySelector("#trails")!.remove();
    expect(applyMapTransportStyle(map, "night")).toBe(true);
    expect(map.querySelector("#roads")?.getAttribute("stroke")).toBe("#e4c9a0");
    expect(map.querySelector("#rivers")?.getAttribute(TRANSPORT_STYLE_ATTRIBUTE)).toBe("1");
    expect(applyMapTransportStyle(map, "night")).toBe(false);
  });
});
