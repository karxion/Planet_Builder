import Alea from "alea";
import { seabedGlyph } from "./seabed-glyphs";
import {
  SEABED_RELIEF_IDS,
  depthBand,
  seabedReliefDetails,
  seabedReliefId,
  seabedReliefName
} from "@/data/seabed-relief";
import type { UnderwaterMap } from "@/types/underwater";
import type { SpaceSite } from "@/types/world-spaces";

const NS = "http://www.w3.org/2000/svg";
const svg = (tag: string, attrs: Record<string, string | number>, text?: string) => {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
};
export function seabedReliefDefs(): SVGDefsElement {
  const defs = svg("defs", {}) as SVGDefsElement;
  for (const id of SEABED_RELIEF_IDS) {
    const symbol = svg("symbol", {
      id: `fpb-seafloor-${id}`,
      viewBox: "0 0 32 18",
      preserveAspectRatio: "xMidYMid meet"
    });
    symbol.append(seabedGlyph(id));
    defs.append(symbol);
  }
  return defs;
}
/** Sample actual saved cells, with rare landforms represented before widespread plain/shelf classes. */
export function sampleSeabedRelief(map: UnderwaterMap, width: number, height: number, sites: SpaceSite[]): number[] {
  const candidates = Array.from({ length: 17 }, () => [] as number[]),
    rng = Alea(`${map.seed}:cartographic-relief-v2`);
  const cities = sites.filter(site => site.space === "underwater" && ["city", "gateway"].includes(site.kind));
  const point = (i: number) => ({
    x: (((i % map.columns) + 0.5) / map.columns) * width,
    y: ((Math.floor(i / map.columns) + 0.5) / map.rows) * height
  });
  for (let i = 0; i < map.terrain.length; i++) {
    if (!map.depths[i] || !map.terrain[i]) continue;
    const p = point(i);
    if (p.x < 12 || p.x > width - 12 || p.y < 10 || p.y > height - 12) continue;
    if (cities.some(s => Math.abs(s.x * width - p.x) < 30 && p.y > s.y * height - 23 && p.y < s.y * height + 30))
      continue;
    candidates[map.terrain[i]].push(i);
  }
  for (const cells of candidates)
    for (let n = cells.length - 1; n > 0; n--) {
      const j = Math.floor(rng() * (n + 1));
      [cells[n], cells[j]] = [cells[j], cells[n]];
    }
  const chosen: number[] = [],
    bins = new Map<string, { x: number; y: number }[]>();
  const limit = Math.min(1800, Math.max(80, Math.round((width * height) / 2000)));
  const priority = [14, 4, 8, 9, 15, 11, 10, 5, 12, 13, 7, 2, 16, 6, 1, 3];
  const claim = (kind: number) => {
    while (candidates[kind].length) {
      const i = candidates[kind].pop()!,
        p = point(i),
        bx = Math.floor(p.x / 32),
        by = Math.floor(p.y / 32);
      let overlap = false;
      for (let x = bx - 1; x <= bx + 1; x++)
        for (let y = by - 1; y <= by + 1; y++)
          if (bins.get(`${x}:${y}`)?.some(q => Math.abs(q.x - p.x) < 30 && Math.abs(q.y - p.y) < 23)) overlap = true;
      if (overlap) continue;
      const key = `${bx}:${by}`;
      if (!bins.has(key)) bins.set(key, []);
      bins.get(key)!.push(p);
      chosen.push(i);
      return true;
    }
    return false;
  };
  while (chosen.length < limit) {
    const before = chosen.length;
    for (const kind of priority) {
      if (chosen.length === limit) break;
      claim(kind);
    }
    if (chosen.length === before) break;
  }
  return chosen;
}
export function drawSeabedRelief(map: UnderwaterMap, width: number, height: number, sites: SpaceSite[]): SVGGElement {
  const root = svg("g", { "data-seabed-relief": "" }) as SVGGElement;
  for (const cell of sampleSeabedRelief(map, width, height, sites)) {
    const kind = map.terrain[cell],
      id = seabedReliefId(kind),
      band = depthBand(map.depths[cell]);
    const x = (((cell % map.columns) + 0.5) / map.columns) * width,
      y = ((Math.floor(cell / map.columns) + 0.5) / map.rows) * height;
    const mark = svg("g", {
      "data-seabed-relief-cell": cell,
      "data-seabed-terrain": kind,
      "data-depth-band": band,
      "data-space-layer": "toggleRelief",
      "data-space-x": x / width,
      "data-space-y": y / height,
      role: "button",
      tabindex: 0,
      cursor: "pointer",
      "aria-label": seabedReliefName(map, cell)
    });
    mark.append(svg("circle", { cx: x, cy: y, r: 9, fill: "transparent", "pointer-events": "all" }));
    mark.append(svg("use", { href: `#fpb-seafloor-${id}`, x: x - 12, y: y - 7, width: 24, height: 14 }));
    mark.append(svg("title", {}, seabedReliefDetails(map, cell)));
    root.append(mark);
  }
  return root;
}
