import { contours, geoPath } from "d3";
import type { UndergroundMap } from "@/types/underground";

const NS = "http://www.w3.org/2000/svg";
/** Contours smooth the saved terrain grid; no random geometry is created while rendering. */
export function drawUndergroundTerrain(map: UndergroundMap, width: number, height: number): SVGGElement {
  const root = document.createElementNS(NS, "g");
  root.setAttribute("data-underground-level", map.activeLevel);
  root.setAttribute("data-underground-mode", map.mode || "tunnels");
  const layer = map.levels.find(level => level.id === map.activeLevel)!;
  const cells = layer.cells,
    hollow = map.mode === "hollow",
    dark = !hollow || map.illumination === "dark";
  root.setAttribute("data-underground-illumination", dark ? "dark" : "luminous");
  const contour = contours().size([map.columns, map.rows]).thresholds([0.5]);
  const path = (predicate: (cell: number) => boolean) =>
    geoPath()(contour(cells.map(cell => Number(predicate(cell))))[0]) || "";
  const floor = path(cell => (hollow ? [1, 4, 5].includes(cell) : cell > 0));
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
    [floor, hollow ? (dark ? "#414b46" : "#65775b") : "#4a4456", hollow ? "#a6b895" : "#a296a7"],
    [path(cell => cell === 2), "#245f79", "#6da3b4"],
    [path(cell => cell === 3), "#a54b34", "#e7a061"],
    ...(hollow
      ? [
          [path(cell => cell === 4), dark ? "#696252" : "#a2936c", "#c4b688"],
          [path(cell => cell === 5), dark ? "#263e39" : "#345c4f", "#6b8e6c"]
        ]
      : [])
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
  if (layer.elevations)
    for (const contour of contours()
      .size([map.columns, map.rows])
      .thresholds(hollow ? [0, 800, 1600, 2400] : [-3000, -1000, 1000])(layer.elevations)) {
      const line = document.createElementNS(NS, "path");
      for (const [key, value] of Object.entries({
        d: geoPath()(contour) || "",
        fill: "none",
        stroke: "#d1d0ac",
        "stroke-opacity": "0.23",
        "stroke-width": "0.6",
        "vector-effect": "non-scaling-stroke",
        transform,
        "clip-path": "url(#fpb-underground-floor)",
        "pointer-events": "none"
      }))
        line.setAttribute(key, value);
      root.append(line);
    }
  return root;
}
