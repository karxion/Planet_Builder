import { findClosestCell } from "@/utils";
import type { IconBounds } from "@/utils/mapIconGroups";
import { BoundsIndex, type ResourceLayoutItem, spaceResourceIcons } from "@/utils/resourceIconSpacing";

const SVG_NS = "http://www.w3.org/2000/svg";
const SOURCE_TRANSFORM = "data-fpb-resource-transform";
const TERRAIN_CLEARANCE = "data-fpb-terrain-clearance";

export function restoreResourceIconSpacing(view: ParentNode): void {
  view.querySelector("#fpb-resource-leaders")?.remove();
  view.querySelectorAll<SVGElement>(`[${SOURCE_TRANSFORM}]`).forEach(element => {
    const transform = element.getAttribute(SOURCE_TRANSFORM);
    if (transform) element.setAttribute("transform", transform);
    else element.removeAttribute("transform");
    element.removeAttribute(SOURCE_TRANSFORM);
    element.removeAttribute("data-fpb-resource-unresolved");
  });
  for (const element of view.querySelectorAll(`[${TERRAIN_CLEARANCE}]`)) element.removeAttribute(TERRAIN_CLEARANCE);
}

export function applyResourceIconSpacing(view: SVGGElement): void {
  restoreResourceIconSpacing(view);
  const matrix = view.getScreenCTM();
  const map = view.ownerSVGElement;
  if (!matrix || !map || !pack.cells?.p) return;
  const inverse = matrix.inverse();
  const scale = Math.hypot(matrix.a, matrix.b);
  if (!scale) return;
  const gap = Math.max(1.5, 6 / scale);
  const rectangle = (element: SVGElement): IconBounds | undefined => {
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return;
    const a = new DOMPoint(box.left, box.top).matrixTransform(inverse);
    const b = new DOMPoint(box.right, box.bottom).matrixTransform(inverse);
    return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y };
  };
  const elements = new Map<number, SVGElement>();
  const items: ResourceLayoutItem[] = [];
  view.querySelectorAll<SVGGElement>("#goodsIcons > g[data-cell]").forEach(element => {
    const bounds = rectangle(element);
    if (!bounds) return;
    const key = Number(element.dataset.cell);
    if (!pack.cells.p[key]) return;
    elements.set(key, element);
    items.push({ ...bounds, key });
  });
  if (!items.length) return;
  const obstacles: IconBounds[] = [];
  view.querySelectorAll<SVGElement>("#burgIcons > g > use, #markers > svg").forEach(element => {
    const bounds = rectangle(element);
    if (bounds) obstacles.push(bounds);
  });
  // Curved text can have a very large bounding box; reserve only the painted glyphs.
  view.querySelectorAll<SVGTextElement>("#labels text, #fpb-administration text").forEach(element => {
    if (!rectangle(element)) return;
    const transform = element.getScreenCTM();
    if (!transform) return;
    const local = inverse.multiply(transform);
    for (let i = 0; i < element.getNumberOfChars(); i++) {
      const box = element.getExtentOfChar(i);
      const points = [
        new DOMPoint(box.x, box.y),
        new DOMPoint(box.x + box.width, box.y),
        new DOMPoint(box.x, box.y + box.height),
        new DOMPoint(box.x + box.width, box.y + box.height)
      ].map(point => point.matrixTransform(local));
      const x = Math.min(...points.map(point => point.x));
      const y = Math.min(...points.map(point => point.y));
      obstacles.push({
        x,
        y,
        width: Math.max(...points.map(point => point.x)) - x,
        height: Math.max(...points.map(point => point.y)) - y
      });
    }
  });
  const terrain: (IconBounds & { element: SVGElement })[] = [];
  view.querySelectorAll<SVGElement>("#terrain > use").forEach(element => {
    const bounds = rectangle(element);
    if (bounds) terrain.push({ ...bounds, element });
  });
  const allowed = (item: ResourceLayoutItem, candidate: IconBounds, sameProvince: boolean): boolean => {
    const x = candidate.x + candidate.width / 2;
    const y = candidate.y + candidate.height / 2;
    if (x < 0 || y < 0 || x > graphWidth || y > graphHeight) return false;
    const cell = findClosestCell(x, y, undefined, pack);
    if (cell === undefined) return false;
    return (
      pack.cells.h[cell] >= 20 === pack.cells.h[item.key] >= 20 &&
      pack.cells.state[cell] === pack.cells.state[item.key] &&
      (!sameProvince || pack.cells.province[cell] === pack.cells.province[item.key])
    );
  };
  const placements = spaceResourceIcons(
    items,
    obstacles,
    terrain,
    gap,
    (item, candidate) => allowed(item, candidate, true),
    { reserveSources: true }
  );
  const pending = placements.filter(item => item.unresolved);
  if (pending.length) {
    const fallback = new Map(
      spaceResourceIcons(
        pending,
        [
          ...obstacles,
          ...placements.filter(item => !item.unresolved),
          ...items.filter(item => !pending.some(site => site.key === item.key))
        ],
        terrain,
        gap,
        (item, candidate) => allowed(item, candidate, false),
        { reserveSources: true }
      ).map(item => [item.key, item])
    );
    for (let i = 0; i < placements.length; i++) placements[i] = fallback.get(placements[i].key) || placements[i];
  }
  const relief = new BoundsIndex<(typeof terrain)[number]>();
  for (const box of terrain) relief.add(box);
  const leaders = document.createElementNS(SVG_NS, "g");
  leaders.id = "fpb-resource-leaders";
  leaders.setAttribute("pointer-events", "none");
  leaders.setAttribute("fill", "none");
  leaders.setAttribute("stroke", "#59665c");
  leaders.setAttribute("stroke-opacity", "0.65");
  leaders.setAttribute("stroke-width", String(0.75 / scale));
  for (const placement of placements) {
    const element = elements.get(placement.key)!;
    const dx = placement.x - placement.sourceX;
    const dy = placement.y - placement.sourceY;
    const original = element.getAttribute("transform") || "";
    element.setAttribute(SOURCE_TRANSFORM, original);
    element.setAttribute("transform", `translate(${dx} ${dy}) ${original}`.trim());
    if (placement.unresolved) element.setAttribute("data-fpb-resource-unresolved", "true");
    for (const box of relief.overlaps(placement, gap)) box.element.setAttribute(TERRAIN_CLEARANCE, "true");
    if (Math.hypot(dx, dy) <= placement.width / 2) continue;
    const line = document.createElementNS(SVG_NS, "path");
    const x = placement.sourceX + placement.width / 2;
    const y = placement.sourceY + placement.height / 2;
    line.setAttribute("d", `M${x},${y}l${dx},${dy}`);
    leaders.append(line);
  }
  view.querySelector("#goodsIcons")?.before(leaders);
  if (!map.querySelector("#fpb-resource-clearance-style")) {
    const style = document.createElementNS(SVG_NS, "style");
    style.id = "fpb-resource-clearance-style";
    style.textContent = `[${TERRAIN_CLEARANCE}="true"] { visibility: hidden; pointer-events: none; }`;
    (map.querySelector("defs") || map).append(style);
  }
}
