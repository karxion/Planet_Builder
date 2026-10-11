import { describe, expect, it } from "vitest";
import { RETIRED_MAP_LAYERS, restoreLegacyTerrainIcon } from "./map-layer-policy";

describe("map layer policy", () => {
  it("retires only the five requested display layers", () => {
    expect(RETIRED_MAP_LAYERS.map(([control]) => control)).toEqual([
      "toggleCompass",
      "togglePrecipitation",
      "togglePopulation",
      "toggleRulers",
      "toggleIce"
    ]);
  });
  it("recovers temporarily converted RPG terrain without touching legacy or custom art", () => {
    expect(restoreLegacyTerrainIcon("#rpg-forest")).toBe("#relief-deciduous-1");
    expect(restoreLegacyTerrainIcon("#rpg-highlands")).toBe("#relief-mount-1");
    expect(restoreLegacyTerrainIcon("#relief-mountSnow-3-bw")).toBe("#relief-mountSnow-3-bw");
    expect(restoreLegacyTerrainIcon("#my-custom-forest")).toBe("#my-custom-forest");
    expect(restoreLegacyTerrainIcon("#rpg-capital")).toBe("#rpg-capital");
  });
});
