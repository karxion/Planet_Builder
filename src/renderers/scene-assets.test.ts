// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import manifest from "@/data/scene-image-manifest.json";
import { SCENE_ASSET_IDS, sceneAsset, sceneAssetDefs } from "./scene-assets";

afterEach(() => vi.unstubAllGlobals());
describe("generated modular PNG asset library", () => {
  it.each([
    "overview",
    "battle"
  ] as const)("selects the proper half of each generated %s image without stretching it", view => {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${sceneAssetDefs(view)}</defs>${SCENE_ASSET_IDS.map((id, i) => sceneAsset(id, i * 40, 40, 30)).join("")}</svg>`;
    const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
    expect(doc.querySelector("parsererror,script,foreignObject")).toBeNull();
    expect(doc.querySelectorAll("symbol")).toHaveLength(8);
    for (const id of SCENE_ASSET_IDS) {
      const symbol = doc.getElementById(`scene-${id}`)!;
      const image = symbol.querySelector("image")!;
      expect(image.getAttribute("href")).toContain(`/assets/scene-maps/${id}.png`);
      expect(symbol.getAttribute("viewBox")).toBe(
        `${view === "battle" ? manifest[id].battleInset : 0} 0 ${manifest[id].width / 2 - (view === "battle" ? manifest[id].battleInset : 0)} ${manifest[id].height}`
      );
      expect(image.getAttribute("x")).toBe(String(view === "battle" ? -manifest[id].width / 2 : 0));
    }
    for (const node of doc.querySelectorAll("use"))
      expect(doc.getElementById(node.getAttribute("href")!.slice(1))).not.toBeNull();
  });
  it("embeds actual PNG bytes once per image for independent exports", async () => {
    vi.resetModules();
    const { inlineSceneImages } = await import("./scene-assets");
    const bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const fetcher = vi.fn(async () => ({
      ok: true,
      blob: async () => new window.Blob([bytes], { type: "image/png" })
    }));
    vi.stubGlobal("fetch", fetcher);
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg"><image data-generated-module="house"/><image data-generated-module="house"/></svg>';
    const result = await inlineSceneImages(svg);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result).toContain('href="data:image/png;base64,iVBORw0KGgo=');
  });
  it("rejects missing modules rather than exporting broken image references", async () => {
    vi.resetModules();
    const { inlineSceneImages } = await import("./scene-assets");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 404 }))
    );
    await expect(
      inlineSceneImages('<svg xmlns="http://www.w3.org/2000/svg"><image data-generated-module="house"/></svg>')
    ).rejects.toThrow("404");
  });
});
