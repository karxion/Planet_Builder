import type { IconBounds, IconGroup } from "@/utils/mapIconGroups";
import { escapeAttribute } from "./rpg-asset-renderer";

export interface MapIconItem extends IconBounds {
  key: string;
  kind: "settlement" | "marker" | "resource";
  entityId: number;
  name: string;
  icon: string;
  element: SVGElement;
  population?: number;
}

export function clearMapIconGroups(root: ParentNode): void {
  root.querySelector("#fpb-icon-groups")?.remove();
  root.querySelectorAll("[data-fpb-clustered]").forEach(element => {
    element.removeAttribute("data-fpb-clustered");
  });
}

export function renderMapIconGroups(
  view: SVGGElement,
  groups: IconGroup<MapIconItem>[],
  label: (count: number) => string,
  onOpen: (group: IconGroup<MapIconItem>, button: SVGGElement) => void
): void {
  const matrix = view.getScreenCTM();
  if (!matrix) return;
  const inverse = matrix.inverse();
  const scale = Math.hypot(matrix.a, matrix.b);
  const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  layer.id = "fpb-icon-groups";
  const style = document.createElementNS(layer.namespaceURI, "style");
  style.textContent = "[data-fpb-clustered='true']{visibility:hidden;pointer-events:none}";
  layer.append(style);
  for (const group of groups) {
    if (group.items.length < 2) continue;
    const point = new DOMPoint(group.x, group.y).matrixTransform(inverse);
    const centerX = group.items.reduce((sum, item) => sum + item.x + item.width / 2, 0) / group.items.length;
    const centerY = group.items.reduce((sum, item) => sum + item.y + item.height / 2, 0) / group.items.length;
    const source = new DOMPoint(centerX, centerY).matrixTransform(inverse);
    if (Math.hypot(group.x + group.width / 2 - centerX, group.y + group.height / 2 - centerY) > 8) {
      const line = document.createElementNS(layer.namespaceURI, "path");
      line.setAttribute(
        "d",
        `M${source.x},${source.y}L${point.x + group.width / 2 / scale},${point.y + group.height / 2 / scale}`
      );
      line.setAttribute("stroke", "#7e7049");
      line.setAttribute("stroke-width", String(1 / scale));
      line.setAttribute("fill", "none");
      line.setAttribute("pointer-events", "none");
      layer.append(line);
    }
    const button = document.createElementNS(layer.namespaceURI, "g") as SVGGElement;
    button.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${1 / scale})`);
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", label(group.items.length));
    button.setAttribute("data-count", String(group.items.length));
    const settlement = group.items
      .filter(item => item.kind === "settlement")
      .sort((a, b) => (b.population || 0) - (a.population || 0) || a.entityId - b.entityId)[0];
    const icon = (settlement || group.items[0]).icon;
    const glyph = icon.startsWith("#")
      ? `<use href="${escapeAttribute(icon)}" x="3" y="3" width="20" height="20"/>`
      : `<text x="13" y="18" text-anchor="middle" font-size="16">${escapeAttribute(icon.startsWith("http") || icon.startsWith("data:") ? "*" : icon)}</text>`;
    button.innerHTML = `<title>${escapeAttribute(label(group.items.length))}</title>
      <rect width="42" height="26" rx="5" fill="#202923" fill-opacity="0.9" stroke="#c7ad65" stroke-width="1"/>
      ${glyph}<text x="31" y="17" text-anchor="middle" fill="#f3ebce" font-family="sans-serif" font-size="11" font-weight="700">${group.items.length > 99 ? "99+" : group.items.length}</text>`;
    const open = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      onOpen(group, button);
    };
    button.addEventListener("click", open);
    button.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") open(event);
    });
    for (const item of group.items) {
      item.element.setAttribute("data-fpb-clustered", "true");
      if (item.kind === "settlement") {
        view.querySelector(`#anchor${item.entityId}`)?.setAttribute("data-fpb-clustered", "true");
      }
    }
    layer.append(button);
  }
  view.insertBefore(layer, view.querySelector("#fogging-cont"));
}
