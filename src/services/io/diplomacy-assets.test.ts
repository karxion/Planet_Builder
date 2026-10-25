// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Diplomacy export assets", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("embeds each referenced generated image once and never fetches SVG-supplied URLs", async () => {
    vi.resetModules();
    const fetcher = vi
      .fn()
      .mockResolvedValue({ ok: true, arrayBuffer: async () => new Uint8Array([137, 80, 78, 71]).buffer });
    vi.stubGlobal("fetch", fetcher);
    document.body.innerHTML =
      '<svg><g id="diplomacy"><g data-relation="blood"><image href="https://attacker.invalid/track"></image></g><g data-relation="blood"><image href="x"></image></g><g data-relation="invalid"><image href="https://attacker.invalid"></image></g></g></svg>';
    const svg = document.querySelector("svg")!;
    const { inlineDiplomacyAssets } = await import("@/services/io/diplomacy-assets");
    await inlineDiplomacyAssets(svg);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toContain("images/diplomacy/blood.png");
    expect(svg.querySelectorAll("image")).toHaveLength(1);
    expect(svg.querySelectorAll('#diplomacy use[href="#fpb-border-asset-blood"]')).toHaveLength(2);
    expect(svg.querySelector("image")!.getAttribute("href")).toBe("data:image/png;base64,iVBORw==");
  });
  it("allows a failed asset to be retried", async () => {
    vi.resetModules();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValue({ ok: true, arrayBuffer: async () => new Uint8Array([1]).buffer });
    vi.stubGlobal("fetch", fetcher);
    document.body.innerHTML = '<svg><g id="diplomacy"><g data-relation="neutral"><image></image></g></g></svg>';
    const { inlineDiplomacyAssets } = await import("@/services/io/diplomacy-assets");
    await expect(inlineDiplomacyAssets(document.querySelector("svg")!)).rejects.toThrow("unavailable");
    await expect(inlineDiplomacyAssets(document.querySelector("svg")!)).resolves.toBeUndefined();
  });
});
