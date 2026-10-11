import { afterEach, describe, expect, it, vi } from "vitest";
import { RPG_MAP_ASSETS } from "@/data/rpg-map-assets";
import { installRpgAssetDefinitions, rpgIconPreview } from "./rpg-asset-renderer";

afterEach(() => vi.unstubAllGlobals());

describe("resource token rendering", () => {
  it("renders embedded raster previews without external image requests", () => {
    const preview = rpgIconPreview("#rpg-wood");
    expect(preview.includes('viewBox="0 0 64 64"')).toBe(true);
    expect(preview.includes('<image href="data:image/webp;base64,')).toBe(true);
    expect(preview.includes("undefined")).toBe(false);
    expect(rpgIconPreview("#rpg-capital").includes('<image href="data:image/webp;base64,')).toBe(true);
    expect(rpgIconPreview('<unsafe "icon">')).toBe("&lt;unsafe &quot;icon&quot;&gt;");
  });

  it("upgrades existing definitions in place and preserves stable IDs", () => {
    const attributes = new Map([["data-version", "2"]]);
    const group = {
      id: "fpb-rpg-assets",
      innerHTML: "old vectors",
      getAttribute: (key: string) => attributes.get(key),
      setAttribute: (key: string, value: string) => attributes.set(key, value)
    };
    const append = vi.fn();
    vi.stubGlobal("document", { querySelector: () => ({ querySelector: () => group, append }) });
    installRpgAssetDefinitions();
    expect(attributes.get("data-version")).toBe("5");
    expect(append).toHaveBeenCalledWith(group);
    expect((group.innerHTML.match(/<symbol /g) || []).length).toBe(RPG_MAP_ASSETS.length);
    expect((group.innerHTML.match(/<image /g) || []).length).toBe(44);
    expect(group.innerHTML.includes('id="rpg-wood"')).toBe(true);
    const previous = group.innerHTML;
    installRpgAssetDefinitions();
    expect(group.innerHTML).toBe(previous);
    expect(append).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the map has not mounted", () => {
    vi.stubGlobal("document", { querySelector: () => null });
    expect(() => installRpgAssetDefinitions()).not.toThrow();
  });
});
