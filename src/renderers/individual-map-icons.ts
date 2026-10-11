import { findClosestCell } from "@/utils";
import type { IconBounds } from "@/utils/mapIconGroups";
import { BoundsIndex, spaceResourceIcons } from "@/utils/resourceIconSpacing";
import { settlementDisplayRepresentatives } from "@/utils/settlementTokens";

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

export function applyIndividualMapIcons(view: SVGGElement): void {
  restoreIndividualMapIcons(view);
  const matrix = view.getScreenCTM();
  const map = view.ownerSVGElement;
  if (!matrix || !map || !pack.cells?.p) return;
  const inverse = matrix.inverse();
  const scale = Math.hypot(matrix.a, matrix.b);
  if (!scale) return;
  const bounds = (element: SVGElement): IconBounds | undefined => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (!box.width || !box.height || style.display === "none" || style.visibility === "hidden") return;
    const a = new DOMPoint(box.left, box.top).matrixTransform(inverse);
    const b = new DOMPoint(box.right, box.bottom).matrixTransform(inverse);
    return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y };
  };
  const representatives = settlementDisplayRepresentatives(pack.burgs);
  const seen = new Set<string>();
  const markerById = new Map(pack.markers.map(marker => [marker.i, marker]));
  const items: {
    element: SVGElement;
    id: number;
    kind: "burg" | "marker";
    cell: number;
    priority: number;
    box: IconBounds;
  }[] = [];
  for (const element of view.querySelectorAll<SVGElement>("#burgIcons > g > use, #markers > svg")) {
    const kind = element.id.startsWith("burg") ? "burg" : "marker";
    const id = Number(kind === "burg" ? element.dataset.id : element.id.slice(6));
    const entity = kind === "burg" ? pack.burgs[id] : markerById.get(id);
    if (!entity || (kind === "burg" && pack.burgs[id].removed)) continue;
    const representative = kind === "burg" ? representatives.get(id) : id;
    const key = `${kind}${id}`;
    if (representative !== id || seen.has(key)) {
      element.setAttribute(DUPLICATE, `${kind}${representative}`);
      continue;
    }
    seen.add(key);
    const box = bounds(element);
    if (!box) continue;
    const burg = kind === "burg" ? pack.burgs[id] : undefined;
    items.push({
      element,
      id,
      kind,
      cell: entity.cell,
      priority: burg ? (burg.capital ? 1e9 : 0) + (burg.population || 0) : -1,
      box
    });
  }
  for (const selector of ["#burgLabels text", "#anchors use"]) {
    const ids = new Set<number>();
    for (const element of view.querySelectorAll<SVGElement>(selector)) {
      const id = Number(element.dataset.id);
      const representative = representatives.get(id);
      if (representative !== undefined && (representative !== id || ids.has(id))) {
        element.setAttribute(DUPLICATE, `burg${representative}`);
      }
      ids.add(id);
    }
  }
  if (!map.querySelector("#fpb-individual-icon-style")) {
    const style = document.createElementNS(SVG_NS, "style");
    style.id = "fpb-individual-icon-style";
    style.textContent = `[${DUPLICATE}] { visibility: hidden; pointer-events: none; }`;
    (map.querySelector("defs") || map).append(style);
  }
  items.sort((a, b) => b.priority - a.priority || a.kind.localeCompare(b.kind) || a.id - b.id);
  const reserved = [...view.querySelectorAll<SVGElement>("#goodsIcons > g[data-cell]")]
    .map(bounds)
    .filter((box): box is IconBounds => Boolean(box));
  const resourceIndex = new BoundsIndex();
  for (const box of reserved) resourceIndex.add(box);
  const resourcePadding = 3 / scale;
  const reservedBounds = reserved.map(box => ({
    x: box.x - resourcePadding,
    y: box.y - resourcePadding,
    width: box.width + resourcePadding * 2,
    height: box.height + resourcePadding * 2
  }));
  const gap = Math.max(0.75, 3 / scale);
  const placements = spaceResourceIcons(
    items.map((item, key) => ({ ...item.box, key })),
    reservedBounds,
    [],
    gap,
    (item, candidate) => {
      const x = candidate.x + candidate.width / 2;
      const y = candidate.y + candidate.height / 2;
      if (x < 0 || y < 0 || x > graphWidth || y > graphHeight) return false;
      const cell = findClosestCell(x, y, undefined, pack);
      const source = items[item.key].cell;
      return (
        cell !== undefined &&
        pack.cells.h[cell] >= 20 === pack.cells.h[source] >= 20 &&
        pack.cells.state[cell] === pack.cells.state[source]
      );
    }
  );
  const pending = placements.filter(item => item.unresolved);
  if (pending.length) {
    // A linked display offset can leave a cramped border; the actual settlement never moves.
    const fallback = new Map(
      spaceResourceIcons(
        pending,
        [...reservedBounds, ...placements.filter(item => !item.unresolved)],
        [],
        gap,
        (_, candidate) =>
          candidate.x >= 0 &&
          candidate.y >= 0 &&
          candidate.x + candidate.width <= graphWidth &&
          candidate.y + candidate.height <= graphHeight
      ).map(item => [item.key, item])
    );
    for (let i = 0; i < placements.length; i++) placements[i] = fallback.get(placements[i].key) || placements[i];
  }
  const leaders = document.createElementNS(SVG_NS, "g");
  leaders.id = "fpb-individual-leaders";
  leaders.setAttribute("pointer-events", "none");
  leaders.setAttribute("stroke", "#59665c");
  leaders.setAttribute("stroke-opacity", "0.4");
  leaders.setAttribute("stroke-width", String(0.6 / scale));
  leaders.setAttribute("fill", "none");
  const move = (element: SVGElement, dx: number, dy: number) => {
    const original = element.getAttribute("transform") || "";
    element.setAttribute(ORIGINAL, original);
    element.setAttribute("transform", `translate(${dx} ${dy}) ${original}`.trim());
  };
  for (const placement of placements) {
    const item = items[placement.key];
    const dx = placement.x - placement.sourceX;
    const dy = placement.y - placement.sourceY;
    move(item.element, dx, dy);
    if (placement.unresolved) item.element.setAttribute("data-fpb-individual-unresolved", "true");
    if (item.kind === "burg") {
      const label = view.querySelector<SVGElement>(`#burgLabel${item.id}:not([${DUPLICATE}])`);
      const box = label && bounds(label);
      if (label && box) {
        const x = placement.x + placement.width / 2 - box.width / 2;
        const candidates = [
          { ...box, x, y: placement.y + placement.height + 1.5 / scale },
          { ...box, x, y: placement.y - box.height - 1.5 / scale },
          { ...box, x: placement.x + placement.width + 1.5 / scale, y: placement.y },
          { ...box, x: placement.x - box.width - 1.5 / scale, y: placement.y }
        ];
        const target =
          candidates.find(candidate => !resourceIndex.overlaps(candidate, 6 / scale).length) || candidates[0];
        move(label, target.x - box.x, target.y - box.y);
      }
      const anchor = view.querySelector<SVGElement>(`#anchor${item.id}:not([${DUPLICATE}])`);
      if (anchor) move(anchor, dx, dy);
    }
    if (Math.hypot(dx, dy) < placement.width / 2) continue;
    const line = document.createElementNS(SVG_NS, "path");
    line.setAttribute(
      "d",
      `M${placement.sourceX + placement.width / 2},${placement.sourceY + placement.height / 2}l${dx},${dy}`
    );
    leaders.append(line);
  }
  view.querySelector("#burgIcons")?.before(leaders);
}
