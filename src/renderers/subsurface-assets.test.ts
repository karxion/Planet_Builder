// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emptyWorldSpaces } from "@/services/world-spaces/model";
import { generateUnderwater } from "@/generators/underwater";
import { generateUnderground } from "@/generators/underground";
import { siteInActiveLevel } from "@/data/underground";
import { drawWorldSpaces } from "./world-spaces";
import { SUBSURFACE_ASSET_IDS } from "./subsurface-assets";

const labels = { surface: "Surface", underwater: "Underwater", underground: "Underground" };
const surface = { columns: 32, rows: 24, heights: Array.from({ length: 768 }, (_, i) => (i % 32 < 9 ? 50 : 8)) };
beforeEach(() => {
  document.body.innerHTML = '<svg><g id="viewbox"></g></svg>';
});
afterEach(() => {
  vi.unstubAllGlobals();
});
describe("Subsurface PNG regional overlays", () => {
  it.each([
    "underwater",
    "underground"
  ] as const)("renders %s PNGs with every city's own readable name and no other-space scenery", space => {
    const sea = generateUnderwater(emptyWorldSpaces(), "png", surface);
    const data = generateUnderground(sea, { seed: "png", chambers: 12 });
    data.activeSpace = space;
    const before = structuredClone(data),
      parent = document.querySelector<SVGGElement>("#viewbox")!;
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    const cities = data.sites.filter(site => site.kind === "city" && siteInActiveLevel(site, data));
    expect(parent.querySelectorAll("[data-space-city-label]:not([data-space-city-label=''])")).toHaveLength(
      cities.length
    );
    for (const city of cities) expect(parent.textContent).toContain(city.name);
    expect(
      parent.querySelectorAll(`[data-subsurface-asset='${space === "underwater" ? "ss01" : "us01"}']`)
    ).toHaveLength(cities.length);
    expect(parent.querySelector(`[data-subsurface-asset='${space === "underwater" ? "us01" : "ss01"}']`)).toBeNull();
    expect(parent.querySelectorAll("symbol image[data-subsurface-module]")).toHaveLength(24);
    for (const use of parent.querySelectorAll("use[data-subsurface-asset]"))
      expect(parent.querySelector(use.getAttribute("href")!)).not.toBeNull();
    expect(data).toEqual(before);
    data.activeSpace = "surface";
    drawWorldSpaces({ parent, data, width: 1000, height: 500, selected: "", labels });
    expect(parent.querySelector("[data-subsurface-asset], image[data-subsurface-module]")).toBeNull();
  });
  it("embeds the new dedicated PNGs in independent map exports", async () => {
    vi.resetModules();
    const { inlineSceneImages } = await import("./scene-assets");
    vi.stubGlobal("location", { href: "http://localhost/", origin: "http://localhost" });
    const fetcher = vi.fn(async () => ({
      ok: true,
      blob: async () => new window.Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" })
    }));
    vi.stubGlobal("fetch", fetcher);
    const result = await inlineSceneImages(
      '<svg xmlns="http://www.w3.org/2000/svg"><image data-subsurface-module="ss01"/><image data-subsurface-module="ss01"/></svg>'
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result).toContain("data:image/png;base64,");
    expect(result).not.toContain("/assets/subsurface/");
    expect(SUBSURFACE_ASSET_IDS).toHaveLength(24);
  });
});
