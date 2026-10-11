import { afterEach, describe, expect, it, vi } from "vitest";
import { applyMapLabelHalos, needsWhiteLabelHalo } from "./map-label-halo";

afterEach(() => vi.unstubAllGlobals());

describe("map label halo", () => {
  it.each([
    "black",
    "#000",
    "rgb(0, 0, 0)",
    "#3e3e4b",
    "#263333",
    "#666"
  ])("adds a white halo to black and neutral dark fills: %s", fill => expect(needsWhiteLabelHalo(fill)).toBe(true));

  it.each([
    "white",
    "#fff",
    "#ccc",
    "red",
    "#004477",
    "#770000",
    "none",
    "transparent",
    "url(#color)"
  ])("preserves light, colored and non-solid fills: %s", fill => expect(needsWhiteLabelHalo(fill)).toBe(false));

  it("embeds a thin exportable SVG rule once and removes the halo when text becomes light", () => {
    const attributes = new Map<string, string>();
    const label = {
      getAttribute: (key: string) => attributes.get(key),
      setAttribute: (key: string, value: string) => attributes.set(key, value),
      hasAttribute: (key: string) => attributes.has(key),
      removeAttribute: (key: string) => attributes.delete(key)
    };
    const styles: { id: string; textContent: string }[] = [];
    const defs = { append: (style: (typeof styles)[number]) => styles.push(style) };
    const map = {
      namespaceURI: "http://www.w3.org/2000/svg",
      querySelector: (selector: string) =>
        selector === "defs" ? defs : styles.find(style => `#${style.id}` === selector)
    };
    const view = { ownerSVGElement: map, querySelectorAll: () => [label] };
    let fill = "#3e3e4b";
    vi.stubGlobal("getComputedStyle", () => ({ fill }));
    vi.stubGlobal("document", { createElementNS: () => ({ id: "", textContent: "" }) });
    applyMapLabelHalos(view as unknown as SVGGElement);
    applyMapLabelHalos(view as unknown as SVGGElement);
    expect(styles).toHaveLength(1);
    expect(styles[0].textContent.includes("stroke: #fff")).toBe(true);
    expect(styles[0].textContent.includes("stroke-width: 0.08em")).toBe(true);
    expect(styles[0].textContent.includes("paint-order: stroke fill")).toBe(true);
    expect(attributes.get("data-fpb-label-halo")).toBe("true");
    expect(attributes.has("fill")).toBe(false);
    fill = "#fff";
    applyMapLabelHalos(view as unknown as SVGGElement);
    expect(attributes.has("data-fpb-label-halo")).toBe(false);
  });
});
