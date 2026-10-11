import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./draw-markers";

beforeEach(() => vi.stubGlobal("scale", 1));
afterEach(() => vi.unstubAllGlobals());

describe("RPG marker renderer", () => {
  it("renders an SVG asset with a correctly cased viewBox", () => {
    const markup = drawMarker({ i: 1, icon: "#rpg-mine", x: 50, y: 60 });
    expect(markup.includes('viewBox="0 0 30 30"')).toBe(true);
    expect(markup.includes('<use href="#rpg-mine"')).toBe(true);
    expect(markup.includes('width="26" height="26"')).toBe(true);
    expect(markup.includes("<text")).toBe(false);
  });
  it("preserves icon offsets and custom sizes", () => {
    const markup = renderMarkerGlyph({ icon: "#rpg-portal", dx: 60, dy: 40, px: 20 });
    expect(markup.includes('x="8" y="2" width="20" height="20"')).toBe(true);
  });
  it("keeps custom unicode icons and external images compatible", () => {
    expect(renderMarkerGlyph({ icon: "X" }).includes(">X</text>")).toBe(true);
    const url = "https://example.com/asset.png";
    expect(renderMarkerGlyph({ icon: url }).includes(`href="${url}"`)).toBe(true);
    expect(renderMarkerGlyph({ icon: '<custom "icon">' }).includes("&lt;custom &quot;icon&quot;&gt;")).toBe(true);
  });
  it("preserves marker ground coordinates while zooming", () => {
    const markup = drawMarker({ i: 1, icon: "#rpg-city", x: 50, y: 60, size: 30 }, 0);
    expect(markup.includes('x="35" y="30"')).toBe(true);
  });
});
