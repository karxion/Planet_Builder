import { describe, expect, it } from "vitest";
import { getMapFitTransform } from "./mapViewport";

describe("map viewport fit", () => {
  it.each([
    [719, 764, 1440, 842],
    [719, 764, 1920, 1022],
    [1440, 720, 390, 744],
    [1440, 720, 650, 664],
    [2400, 1200, 1440, 842]
  ])("covers the viewport without changing the map aspect ratio (%i x %i in %i x %i)", (mw, mh, vw, vh) => {
    const { k, x, y } = getMapFitTransform(mw, mh, vw, vh);
    expect(x).toBeLessThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(0);
    expect(x + mw * k).toBeGreaterThanOrEqual(vw - 1e-9);
    expect(y + mh * k).toBeGreaterThanOrEqual(vh - 1e-9);
    expect((mw * k) / (mh * k)).toBeCloseTo(mw / mh);
    expect(x + (mw * k) / 2).toBeCloseTo(vw / 2);
    expect(y + (mh * k) / 2).toBeCloseTo(vh / 2);
  });

  it("resets to a centered fit instead of the unscaled top-left map", () => {
    const fit = getMapFitTransform(719, 764, 1440, 842);
    expect(fit.k).toBeCloseTo(1440 / 719);
    expect(fit.x).toBe(0);
    expect(fit.y).toBeLessThan(0);
  });
});
