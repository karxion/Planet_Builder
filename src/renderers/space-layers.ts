import { SPACE_LAYER_IDS, spaceLayers, type SpaceLayerId } from "@/data/space-layers";
import type { WorldSpacesData } from "@/types/world-spaces";

const NS = "http://www.w3.org/2000/svg";
/** Organize only this world's overlay; surface SVG groups and world coordinates stay untouched. */
export function applySpaceLayers(root: SVGElement, data: WorldSpacesData, width: number, height: number): void {
  if (data.activeSpace === "surface") return;
  const map = data.activeSpace === "underwater" ? data.underwater : data.underground;
  for (const [id, columns, rows] of [
    ["toggleCells", map?.columns || 32, map?.rows || 20],
    ["toggleGrid", 16, 10]
  ] as const) {
    const path = document.createElementNS(NS, "path");
    let d = "";
    for (let x = 1; x < columns; x++) d += `M${(x * width) / columns},0V${height}`;
    for (let y = 1; y < rows; y++) d += `M0,${(y * height) / rows}H${width}`;
    for (const [key, value] of Object.entries({
      d,
      fill: "none",
      stroke: "#d6dec7",
      "stroke-opacity": "0.3",
      "stroke-width": "0.6",
      "pointer-events": "none",
      "vector-effect": "non-scaling-stroke",
      "data-space-layer": id
    }))
      path.setAttribute(key, value);
    root.append(path);
  }
  const preferences = data.layers?.[data.activeSpace],
    visible = spaceLayers(data);
  const order = [...new Set([...(preferences?.order || []), ...SPACE_LAYER_IDS])];
  const groups = new Map<SpaceLayerId, SVGGElement>();
  for (const id of order) {
    const group = document.createElementNS(NS, "g");
    group.dataset.spaceLayerGroup = id;
    if (!visible[id]) group.setAttribute("display", "none");
    groups.set(id, group);
  }
  for (const node of root.querySelectorAll<SVGElement>("[data-space-layer]"))
    groups.get(node.dataset.spaceLayer as SpaceLayerId)?.append(node);
  for (const group of groups.values()) root.append(group);
}
