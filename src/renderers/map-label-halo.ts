import { color } from "d3";

const ATTRIBUTE = "data-fpb-label-halo";
const STYLE_ID = "fpb-label-halo-style";

export function needsWhiteLabelHalo(fill: string): boolean {
  const rgb = color(fill)?.rgb();
  if (!rgb || rgb.opacity === 0) return false;
  const maximum = Math.max(rgb.r, rgb.g, rgb.b);
  const minimum = Math.min(rgb.r, rgb.g, rgb.b);
  return maximum <= 110 && maximum - minimum <= 35;
}

export function applyMapLabelHalos(view: SVGGElement): void {
  const map = view.ownerSVGElement;
  if (!map) return;
  if (!map.querySelector(`#${STYLE_ID}`)) {
    const style = document.createElementNS(map.namespaceURI, "style");
    style.id = STYLE_ID;
    // Keep the rule in the SVG so saved maps, PNG and SVG exports share the same halo.
    style.textContent = `text[${ATTRIBUTE}="true"] { stroke: #fff !important; stroke-width: 0.08em !important; stroke-opacity: 1 !important; stroke-linejoin: round; paint-order: stroke fill !important; }`;
    (map.querySelector("defs") || map).append(style);
  }
  view
    .querySelectorAll<SVGTextElement>("#labels text, #provs text, #provinces text, #fpb-administration text")
    .forEach(label => {
      const enabled = needsWhiteLabelHalo(getComputedStyle(label).fill);
      if (enabled && label.getAttribute(ATTRIBUTE) !== "true") label.setAttribute(ATTRIBUTE, "true");
      else if (!enabled && label.hasAttribute(ATTRIBUTE)) label.removeAttribute(ATTRIBUTE);
    });
}
