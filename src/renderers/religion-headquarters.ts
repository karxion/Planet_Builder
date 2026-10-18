import { t } from "@/services/ui-language";
import type { CampaignWorld } from "@/types/campaign-world";
import type { IconBounds } from "@/utils/mapIconGroups";
import { spaceResourceIcons } from "@/utils/resourceIconSpacing";
import { installRpgAssetDefinitions } from "./rpg-asset-renderer";

const SVG_NS = "http://www.w3.org/2000/svg";
const svg = (tag: string, attributes: Record<string, string | number> = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
};

export function drawReligionHeadquarters(world?: CampaignWorld, dimensions?: { width: number; height: number }): void {
  document.getElementById("fpb-headquarters")?.remove();
  const view = document.querySelector<SVGGElement>("#map #viewbox");
  if (!view || !world?.heritage?.showHeadquarters) return;
  installRpgAssetDefinitions();
  const homes = new Map(world.units.map(unit => [unit.id, unit]));
  const religions = [...world.heritage.religions]
    .sort((a, b) => a.id.localeCompare(b.id))
    .filter(religion => homes.has(religion.headquartersId));
  if (!religions.length) return;
  const obstacles: IconBounds[] = [];
  const matrix = view.getScreenCTM?.();
  if (matrix && typeof DOMPoint !== "undefined") {
    const inverse = matrix.inverse();
    for (const element of view.querySelectorAll<SVGElement>(
      "#burgIcons use, #markers > svg, #goodsIcons > g, #terrain > use, #labels text, #fpb-administration text"
    )) {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || getComputedStyle(element).visibility === "hidden") continue;
      const start = new DOMPoint(rect.left, rect.top).matrixTransform(inverse);
      const end = new DOMPoint(rect.right, rect.bottom).matrixTransform(inverse);
      obstacles.push({ x: start.x, y: start.y, width: end.x - start.x, height: end.y - start.y });
    }
  }
  // Also reserve settlement locations before the map's assets have finished rendering.
  for (const home of world.units.filter(unit => unit.level === "village"))
    obstacles.push({ x: home.x - 10, y: home.y - 10, width: 20, height: 20 });
  const map = view.ownerSVGElement!;
  const width = dimensions?.width ?? (Number(map.getAttribute("width")) || 0);
  const height = dimensions?.height ?? (Number(map.getAttribute("height")) || 0);
  const placements = spaceResourceIcons(
    religions.map((religion, key) => {
      const home = homes.get(religion.headquartersId)!;
      return { key, x: home.x + 14, y: home.y - 12, width: 72, height: 24 };
    }),
    obstacles,
    [],
    4,
    (_, candidate) =>
      candidate.x >= 0 &&
      candidate.y >= 0 &&
      (!width || candidate.x + candidate.width <= width) &&
      (!height || candidate.y + candidate.height <= height)
  );
  const layer = svg("g", { id: "fpb-headquarters" });
  for (const placement of placements) {
    const religion = religions[placement.key];
    const home = homes.get(religion.headquartersId)!;
    const label = `${religion.name} · ${t("총본산")}`;
    const group = svg("g", {
      "data-religion": religion.id,
      role: "button",
      tabindex: 0,
      "aria-label": label,
      cursor: "pointer"
    });
    if (placement.unresolved) group.setAttribute("data-unresolved", "true");
    const line = svg("line", {
      x1: home.x,
      y1: home.y,
      x2: placement.x + 10,
      y2: placement.y + 10,
      stroke: "#706543",
      "stroke-width": 0.6,
      "pointer-events": "none"
    });
    const title = svg("title");
    title.textContent = `${label}\n${religion.symbol}\n${religion.deityName}`;
    const image = svg("use", { href: "#rpg-monument", x: placement.x, y: placement.y, width: 20, height: 20 });
    const text = svg("text", {
      x: placement.x + 23,
      y: placement.y + 12,
      fill: "#20241f",
      stroke: "#fff",
      "stroke-width": 1.3,
      "stroke-linejoin": "round",
      "paint-order": "stroke",
      "font-size": 6,
      "font-family": "Malgun Gothic, sans-serif",
      textLength: 47,
      lengthAdjust: "spacingAndGlyphs"
    });
    text.textContent = `${religion.name.length > 8 ? `${religion.name.slice(0, 7)}...` : religion.name} · ${t("총본산")}`;
    group.append(
      title,
      svg("rect", { x: placement.x - 1, y: placement.y - 1, width: 73, height: 24, fill: "transparent" }),
      line,
      image,
      text
    );
    const open = () => window.dispatchEvent(new CustomEvent("realm:religion-selected", { detail: religion.id }));
    group.addEventListener("click", event => {
      event.stopPropagation();
      open();
    });
    group.addEventListener("keydown", event => {
      if (event instanceof KeyboardEvent && ["Enter", " "].includes(event.key)) {
        event.preventDefault();
        open();
      }
    });
    layer.append(group);
  }
  view.append(layer);
}
