import { anchoredMapObjects, type AnchoredObjectGroup } from "@/utils/anchoredMapObjects";
import { escapeAttribute } from "./rpg-asset-renderer";

const NS = "http://www.w3.org/2000/svg";
export function clearAnchoredMapObjects(root: ParentNode): void {
  root.querySelector("#fpb-anchored-objects")?.remove();
  for (const element of root.querySelectorAll("[data-fpb-object-badged]"))
    element.removeAttribute("data-fpb-object-badged");
}

/** Compact display offsets stay tied to a real anchor; the record and source SVG never move. */
export function drawAnchoredMapObjects(
  view: SVGGElement,
  name: (group: AnchoredObjectGroup) => string,
  open: (group: AnchoredObjectGroup) => void
): void {
  clearAnchoredMapObjects(view);
  if (document.body.dataset.worldSpace) return;
  if (typeof pack === "undefined" || !pack.markers || !pack.burgs || !pack.cells?.burg) return;
  const matrix = view.getScreenCTM();
  const scale = matrix && Math.hypot(matrix.a, matrix.b);
  if (!scale) return;
  const visible = new Map<number, SVGElement>();
  for (const element of view.querySelectorAll<SVGElement>("#markers > svg")) {
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") continue;
    visible.set(Number(element.id.slice(6)), element);
  }
  const groups = anchoredMapObjects(
    pack.markers.filter(marker => visible.has(marker.i)),
    pack.burgs,
    pack.cells.burg
  );
  const layer = document.createElementNS(NS, "g");
  layer.id = "fpb-anchored-objects";
  const style = document.createElementNS(NS, "style");
  style.textContent = '[data-fpb-object-badged="true"]{visibility:hidden;pointer-events:none}';
  layer.append(style);
  for (const group of groups) {
    const button = document.createElementNS(NS, "g");
    const label = name(group);
    button.setAttribute("data-object-anchor", group.key);
    button.setAttribute("data-anchor-x", String(group.x));
    button.setAttribute("data-anchor-y", String(group.y));
    button.setAttribute("transform", `translate(${group.x} ${group.y}) scale(${1 / scale})`);
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-haspopup", "dialog");
    const count = group.markers.length;
    const counted = count > 1;
    const width = counted ? 32 : 20;
    const y = group.burgId ? 11 : -10;
    button.innerHTML = `<title>${escapeAttribute(label)}</title>
      ${group.burgId ? '<path d="M0,2v9" stroke="#d0b474" stroke-width="1.5"/>' : ""}
      <rect x="${-width / 2 - 4}" y="${y - 4}" width="${width + 8}" height="28" fill="transparent"/>
      <rect class="fpb-object-badge" x="${-width / 2}" y="${y}" width="${width}" height="20" rx="4" fill="#1e2925" stroke="#d0b474"/>
      <svg x="${-width / 2 + 2}" y="${y + 2}" width="16" height="16" viewBox="0 0 30 30">${renderMarkerGlyph(group.markers[0])}</svg>
      ${counted ? `<text x="8" y="${y + 14}" fill="#ffe9b5" text-anchor="middle" font-family="Arial,sans-serif" font-size="10">${count > 99 ? "99+" : count}</text>` : ""}`;
    const activate = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      open(group);
    };
    button.addEventListener("click", activate);
    button.addEventListener("keydown", event => {
      if (["Enter", " "].includes(event.key)) activate(event);
    });
    for (const marker of group.markers) visible.get(marker.i)!.setAttribute("data-fpb-object-badged", "true");
    layer.append(button);
  }
  view.insertBefore(layer, view.querySelector("#fogging-cont"));
}
