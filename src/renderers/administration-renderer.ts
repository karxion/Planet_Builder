import type { AdministrationLevel, AdministrativeUnit } from "@/types/campaign-world";
import { getIsolines } from "@/utils/pathUtils";

const colors = ["#70a6a1", "#d4b562", "#bc91b3", "#90ad73", "#cf8f83", "#829cc5", "#c4bc88"];

export function drawAdministration(units: AdministrativeUnit[], level: AdministrationLevel): void {
  const parent = document.getElementById("viewbox");
  if (!parent) return;
  document.getElementById("fpb-administration")?.remove();
  if (level === "country" || level === "village") return;
  const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  layer.id = "fpb-administration";
  layer.setAttribute("pointer-events", "none");
  layer.setAttribute("fill-opacity", "0.48");
  const fiefs = new Map(units.filter(u => u.level === "fief").map(u => [`${u.stateId}:${u.sourceId}`, u]));
  const assignments = new Map<number, string>();
  for (const cell of pack.cells.i) {
    if (pack.cells.h[cell] < 20) continue;
    const state = pack.cells.state[cell];
    const fief = fiefs.get(`${state}:${pack.cells.province[cell]}`) ?? fiefs.get(`${state}:0`);
    if (!fief) continue;
    const id = level === "fief" ? fief.id : fief.parentId!;
    assignments.set(cell, id);
  }
  const paths = getIsolines(pack, cell => assignments.get(cell) || null, { fill: true });
  let index = 0;
  for (const [id, { fill }] of Object.entries(paths)) {
    const path = document.createElementNS(layer.namespaceURI, "path");
    path.setAttribute("d", fill || "");
    path.setAttribute("fill", colors[index++ % colors.length]);
    path.setAttribute("stroke", "#334546");
    path.setAttribute("stroke-width", "0.65");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    path.setAttribute("data-unit", id);
    layer.append(path);
  }
  for (const unit of units.filter(unit => unit.level === level && paths[unit.id])) {
    const label = document.createElementNS(layer.namespaceURI, "text");
    label.setAttribute("x", String(unit.x));
    label.setAttribute("y", String(unit.y));
    label.setAttribute("font-size", level === "region" ? "9" : "6");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "#263333");
    label.setAttribute("fill-opacity", "1");
    label.setAttribute("paint-order", "stroke");
    label.setAttribute("stroke", "#fff");
    label.setAttribute("stroke-width", "1.5");
    label.textContent = unit.name;
    layer.append(label);
  }
  const labels = parent.querySelector(":scope > #labels");
  parent.insertBefore(layer, labels);
  const occupied: DOMRect[] = [];
  for (const label of layer.querySelectorAll("text")) {
    const box = label.getBBox();
    const overlaps = occupied.some(
      other =>
        box.x < other.right + 2 &&
        box.x + box.width > other.x - 2 &&
        box.y < other.bottom + 2 &&
        box.y + box.height > other.y - 2
    );
    if (overlaps) label.remove();
    else occupied.push(new DOMRect(box.x, box.y, box.width, box.height));
  }
}
