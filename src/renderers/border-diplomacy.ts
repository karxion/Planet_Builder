import { BORDER_RELATIONS, borderRelation, relationAsset, vassalState } from "@/data/border-diplomacy";
import { t } from "@/services/ui-language";
import type { BorderAnchor, DiplomaticState } from "@/types/border-diplomacy";

const NS = "http://www.w3.org/2000/svg";
const spacingCache = new WeakMap<Element, { count: number; distances: number[]; scale?: number }>();
export function renderBorderDiplomacy(
  parent: SVGGElement,
  anchors: BorderAnchor[],
  states: DiplomaticState[],
  onSelect: (anchor: BorderAnchor) => void
): SVGGElement {
  parent.querySelector(":scope > #diplomacy")?.remove();
  const layer = document.createElementNS(NS, "g");
  layer.id = "diplomacy";
  layer.setAttribute("data-i18n-skip", "");
  const byId = new Map(states.map(state => [state.i, state]));
  for (const anchor of anchors) {
    const a = byId.get(anchor.a),
      b = byId.get(anchor.b);
    if (!a || !b) continue;
    const kind = borderRelation(a, b);
    const dependent = vassalState(a, b);
    const direction =
      kind === "vassal" && dependent
        ? ` · ${dependent === a.i ? a.fullName || a.name : b.fullName || b.name} (${t("종속국")})`
        : "";
    const label = `${a.fullName || a.name} ↔ ${b.fullName || b.name} · ${t(BORDER_RELATIONS[kind].label)}${direction}`;
    const token = document.createElementNS(NS, "g");
    token.classList.add("fpb-border-token");
    token.dataset.a = String(a.i);
    token.dataset.b = String(b.i);
    token.dataset.x = String(anchor.x);
    token.dataset.y = String(anchor.y);
    token.dataset.relation = kind;
    token.setAttribute("role", "button");
    token.setAttribute("tabindex", "0");
    token.setAttribute("aria-label", label);
    const title = document.createElementNS(NS, "title");
    title.textContent = label;
    const hit = document.createElementNS(NS, "circle");
    hit.setAttribute("r", "16");
    hit.setAttribute("fill", "transparent");
    hit.setAttribute("stroke", "transparent");
    const image = document.createElementNS(NS, "image");
    image.setAttribute("href", relationAsset(kind));
    image.setAttribute("x", "-16");
    image.setAttribute("y", "-16");
    image.setAttribute("width", "32");
    image.setAttribute("height", "32");
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    token.append(title, hit, image);
    token.addEventListener("click", event => {
      event.stopPropagation();
      onSelect(anchor);
    });
    token.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      onSelect(anchor);
    });
    layer.append(token);
  }
  parent.append(layer);
  scaleBorderTokens(parent);
  return layer;
}

export function scaleBorderTokens(parent: SVGGElement): void {
  const matrix = parent.getScreenCTM?.();
  const zoom = matrix ? Math.hypot(matrix.a, matrix.b) : 1;
  const inverse = 1 / Math.max(zoom || 1, 0.01);
  const tokens = [...parent.querySelectorAll<SVGGElement>("#diplomacy > g")];
  const layer = parent.querySelector("#diplomacy");
  if (!layer) return;
  let spacing = spacingCache.get(layer);
  if (!spacing || spacing.count !== tokens.length) {
    const points = tokens.map(token => [Number(token.dataset.x), Number(token.dataset.y)]);
    const distances = points.map((point, i) =>
      points.reduce(
        (nearest, other, j) =>
          i === j ? nearest : Math.min(nearest, Math.max(Math.abs(point[0] - other[0]), Math.abs(point[1] - other[1]))),
        Infinity
      )
    );
    spacing = { count: tokens.length, distances };
    spacingCache.set(layer, spacing);
  }
  if (spacing.scale === zoom) return;
  spacing.scale = zoom;
  for (let i = 0; i < tokens.length; i++) {
    const separation = spacing.distances[i] / inverse;
    // Preserve the exact border midpoint; reduce crowded tokens instead of moving or grouping them.
    const size = Math.max(4, Math.min(32, separation * 0.85));
    const token = tokens[i];
    token.dataset.pixelSize = String(size);
    token.setAttribute("transform", `translate(${token.dataset.x} ${token.dataset.y}) scale(${(inverse * size) / 32})`);
  }
}
