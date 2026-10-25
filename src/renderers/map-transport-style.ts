import { getMapTransportStyle, TRANSPORT_STYLE_ATTRIBUTE, TRANSPORT_STYLE_VERSION } from "@/data/map-transport-style";

export function applyMapTransportStyle(map: SVGSVGElement, preset = "default"): boolean {
  let changed = false;
  for (const [selector, attributes] of Object.entries(getMapTransportStyle(preset))) {
    const group = map.querySelector<SVGGElement>(selector);
    if (!group || group.getAttribute(TRANSPORT_STYLE_ATTRIBUTE) === TRANSPORT_STYLE_VERSION) continue;
    // Persist the migration marker with the SVG so later manual style edits survive reopening.
    for (const [name, value] of Object.entries(attributes)) {
      group.style.removeProperty(name);
      group.setAttribute(name, String(value));
    }
    group.setAttribute(TRANSPORT_STYLE_ATTRIBUTE, TRANSPORT_STYLE_VERSION);
    changed = true;
  }
  return changed;
}
