import { contours, geoPath } from "d3";
import { SEABED_COLORS } from "@/data/underwater";
import type { UnderwaterMap } from "@/types/underwater";
import type { SpaceFaction } from "@/types/world-spaces";

const NS = "http://www.w3.org/2000/svg";
export function drawUnderwaterTerrain(
  map: UnderwaterMap,
  factions: SpaceFaction[],
  width: number,
  height: number
): SVGGElement {
  const root = document.createElementNS(NS, "g");
  root.setAttribute("data-seabed", "");
  const contour = contours().size([map.columns, map.rows]).thresholds([0.5]);
  const path = (values: number[]) => geoPath()(contour(values)[0]) || "";
  const transform = `scale(${width / map.columns} ${height / map.rows})`;
  const shape = (d: string, fill: string, attrs: Record<string, string> = {}) => {
    const p = document.createElementNS(NS, "path");
    for (const [key, value] of Object.entries({ d, fill, transform, "vector-effect": "non-scaling-stroke", ...attrs }))
      p.setAttribute(key, value);
    root.append(p);
    return p;
  };
  const defs = document.createElementNS(NS, "defs"),
    clip = document.createElementNS(NS, "clipPath");
  clip.id = "fpb-sea-water";
  clip.setAttribute("clipPathUnits", "userSpaceOnUse");
  const waterPath = document.createElementNS(NS, "path");
  waterPath.setAttribute("d", path(map.depths.map(d => Number(d > 0))));
  waterPath.setAttribute("transform", transform);
  clip.append(waterPath);
  defs.append(clip);
  root.append(defs);
  // Land remains opaque so seabed and politics are visually distinct from the surface.
  shape(path(map.depths.map(d => Number(d === 0))), SEABED_COLORS[0], { "data-sea-terrain": "0" });
  for (let code = 1; code <= 6; code++)
    shape(path(map.terrain.map(t => Number(t === code))), map.view === "political" ? "#1c4a62" : SEABED_COLORS[code], {
      "data-sea-terrain": String(code),
      stroke: "#97c6cb",
      "stroke-opacity": "0.25",
      "stroke-width": "0.6"
    });
  if (map.view !== "terrain")
    for (const [index, id] of map.factionIds.entries()) {
      const color = factions.find(f => f.id === id)?.color || "#d9ca8b";
      shape(path(map.owners.map(owner => Number(owner === index + 1))), color, {
        "data-sea-owner": id,
        "fill-opacity": map.view === "political" ? "0.65" : "0.24",
        stroke: color,
        "stroke-width": "1.4",
        "clip-path": "url(#fpb-sea-water)"
      });
    }
  if (map.view !== "political") {
    for (const contour of contours().size([map.columns, map.rows]).thresholds([200, 1000, 3200, 6000])(map.depths)) {
      const line = shape(geoPath()(contour) || "", "none", {
        stroke: "#b9d8dd",
        "stroke-opacity": "0.28",
        "stroke-width": "0.6",
        "data-sea-isobath": String(contour.value),
        "pointer-events": "none"
      });
      const title = document.createElementNS(NS, "title");
      title.textContent = `${contour.value} m`;
      line.append(title);
    }
  }
  return root;
}
