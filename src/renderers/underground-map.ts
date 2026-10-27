import { contours, geoPath } from "d3";
import type { UndergroundMap } from "@/types/underground";

const NS = "http://www.w3.org/2000/svg";
/** Contours smooth the saved terrain grid; no random geometry is created while rendering. */
export function drawUndergroundTerrain(map: UndergroundMap, width: number, height: number): SVGGElement {
  const root = document.createElementNS(NS, "g");
  root.setAttribute("data-underground-level", map.activeLevel);
  const cells = map.levels.find(level => level.id === map.activeLevel)!.cells;
  const contour = contours().size([map.columns, map.rows]).thresholds([0.5]);
  const path = (predicate: (cell: number) => boolean) =>
    geoPath()(contour(cells.map(cell => Number(predicate(cell))))[0]) || "";
  const floor = path(cell => cell > 0);
  const transform = `scale(${width / map.columns} ${height / map.rows})`;
  const defs = document.createElementNS(NS, "defs");
  const clip = document.createElementNS(NS, "clipPath");
  clip.id = "fpb-underground-floor";
  clip.setAttribute("clipPathUnits", "userSpaceOnUse");
  const outline = document.createElementNS(NS, "path");
  outline.setAttribute("d", floor);
  outline.setAttribute("transform", transform);
  clip.append(outline);
  defs.append(clip);
  root.append(defs);
  for (const [d, fill, stroke] of [
    [floor, "#4a4456", "#a296a7"],
    [path(cell => cell === 2), "#245f79", "#6da3b4"],
    [path(cell => cell === 3), "#a54b34", "#e7a061"]
  ]) {
    const shape = document.createElementNS(NS, "path");
    for (const [key, value] of Object.entries({
      d,
      fill,
      stroke,
      transform,
      "stroke-width": "1.2",
      "vector-effect": "non-scaling-stroke",
      "pointer-events": "none"
    }))
      shape.setAttribute(key, value);
    root.append(shape);
  }
  return root;
}
