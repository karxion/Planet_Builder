const SVG_NS = "http://www.w3.org/2000/svg";
const ORIGINAL = "data-fpb-individual-transform";
const DUPLICATE = "data-fpb-duplicate-of";

export function restoreIndividualMapIcons(view: ParentNode): void {
  view.querySelector("#fpb-individual-leaders")?.remove();
  for (const element of view.querySelectorAll<SVGElement>(`[${ORIGINAL}]`)) {
    const original = element.getAttribute(ORIGINAL);
    if (original) element.setAttribute("transform", original);
    else element.removeAttribute("transform");
    element.removeAttribute(ORIGINAL);
    element.removeAttribute("data-fpb-individual-unresolved");
  }
  for (const element of view.querySelectorAll(`[${DUPLICATE}]`)) element.removeAttribute(DUPLICATE);
}

/** Retain every real location. Only duplicate SVG instances of the same record are hidden. */
export function applyIndividualMapIcons(view: SVGGElement): void {
  restoreIndividualMapIcons(view);
  for (const selector of ["#burgIcons > g > use", "#markers > svg", "#burgLabels text", "#anchors use"]) {
    const seen = new Set<string>();
    for (const element of view.querySelectorAll<SVGElement>(selector)) {
      const id = element.id;
      if (!id) continue;
      if (seen.has(id)) element.setAttribute(DUPLICATE, id);
      seen.add(id);
    }
  }
  const map = view.ownerSVGElement;
  if (map && !map.querySelector("#fpb-individual-icon-style")) {
    const style = document.createElementNS(SVG_NS, "style");
    style.id = "fpb-individual-icon-style";
    style.textContent = `[${DUPLICATE}] { visibility: hidden; pointer-events: none; }`;
    (map.querySelector("defs") || map).append(style);
  }
}
