import Alea from "alea";
import images from "@/data/seabed-relief-images.json";
import {
  DEPTH_BANDS,
  SEABED_RELIEF_IDS,
  depthBand,
  seabedReliefDetails,
  seabedReliefId,
  seabedReliefName,
  seabedReliefUrl
} from "@/data/seabed-relief";
import type { UnderwaterMap } from "@/types/underwater";
import type { SpaceSite } from "@/types/world-spaces";
import { getUiLanguage } from "@/services/ui-language";

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
    const asset = images[id];
    const symbol = svg("symbol", {
      id: `fpb-seafloor-${id}`,
      viewBox: `0 0 ${asset.mapWidth} ${asset.mapHeight}`,
      preserveAspectRatio: "xMidYMid meet"
    });
    symbol.append(
      svg("image", {
        href: seabedReliefUrl(id),
        width: asset.mapWidth,
        height: asset.mapHeight,
        "data-seabed-relief-module": id
      })
    );
    defs.append(symbol);
  }
  return defs;
}
/** Bake the reading key into independent image exports, where the HTML overlay is absent. */
export function drawSeabedDepthKey(height: number): SVGGElement {
  const ko = getUiLanguage() === "ko";
  const root = svg("g", {
    "data-seabed-export-key": "",
    transform: `translate(12 ${Math.max(12, height - 142)})`,
    "pointer-events": "none"
  }) as SVGGElement;
  root.append(
    svg("rect", { width: 238, height: 130, rx: 5, fill: "#1c292a", "fill-opacity": 0.96, stroke: "#72745b" })
  );
  root.append(
    svg(
      "text",
      { x: 12, y: 22, fill: "#dcc68f", "font-size": 12, "font-weight": 700 },
      ko ? "수심 단계 · 1–4" : "Depth bands · 1–4"
    )
  );
  DEPTH_BANDS.forEach((band, n) => {
    const y = 36 + n * 21;
    root.append(svg("rect", { x: 12, y, width: 16, height: 16, rx: 3, fill: band.color }));
    root.append(
      svg(
        "text",
        { x: 20, y: y + 12, "text-anchor": "middle", "font-size": 11, fill: "#102332", "font-weight": 700 },
        String(n + 1)
      )
    );
    root.append(
      svg("text", { x: 36, y: y + 12, fill: "#eee8d7", "font-size": 11 }, `${band[ko ? "ko" : "en"]} · ${band.range}`)
    );
  });
  return root;
}

/** Sample actual saved cells, with rare landforms represented before widespread plain/shelf classes. */
export function sampleSeabedRelief(map: UnderwaterMap, width: number, height: number, sites: SpaceSite[]): number[] {
  const candidates = Array.from({ length: 17 }, () => [] as number[]),
    rng = Alea(`${map.seed}:bathymetric-icons-v1`);
  const cities = sites.filter(site => site.space === "underwater" && ["city", "gateway"].includes(site.kind));
  const point = (i: number) => ({
    x: (((i % map.columns) + 0.5) / map.columns) * width,
    y: ((Math.floor(i / map.columns) + 0.5) / map.rows) * height
  });
  for (let i = 0; i < map.terrain.length; i++) {
    if (!map.depths[i] || !map.terrain[i]) continue;
    const p = point(i);
    if (p.x < 20 || p.x > width - 20 || p.y < 20 || p.y > height - 24) continue;
    if (cities.some(s => Math.abs(s.x * width - p.x) < 36 && p.y > s.y * height - 27 && p.y < s.y * height + 42))
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
  const limit = Math.min(140, Math.max(32, Math.round((width * height) / 11000)));
  const priority = [14, 4, 8, 9, 15, 11, 10, 5, 12, 13, 7, 2, 16, 6, 1, 3];
  const claim = (kind: number) => {
    while (candidates[kind].length) {
      const i = candidates[kind].pop()!,
        p = point(i),
        bx = Math.floor(p.x / 48),
        by = Math.floor(p.y / 48);
      let overlap = false;
      for (let x = bx - 1; x <= bx + 1; x++)
        for (let y = by - 1; y <= by + 1; y++)
          if (bins.get(`${x}:${y}`)?.some(q => Math.abs(q.x - p.x) < 45 && Math.abs(q.y - p.y) < 39)) overlap = true;
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
    mark.append(svg("circle", { cx: x, cy: y, r: 18, fill: "transparent", "pointer-events": "all" }));
    mark.append(svg("use", { href: `#fpb-seafloor-${id}`, x: x - 19, y: y - 18, width: 38, height: 32 }));
    mark.append(
      svg("rect", {
        x: x + 8,
        y: y + 6,
        width: 12,
        height: 12,
        rx: 3,
        fill: DEPTH_BANDS[band - 1].color,
        stroke: "#1c3145",
        "stroke-width": 0.7
      })
    );
    mark.append(
      svg(
        "text",
        {
          x: x + 14,
          y: y + 15,
          "text-anchor": "middle",
          "font-family": "Arial, sans-serif",
          "font-size": 9,
          "font-weight": 700,
          fill: "#102332",
          "pointer-events": "none"
        },
        String(band)
      )
    );
    mark.append(svg("title", {}, seabedReliefDetails(map, cell)));
    root.append(mark);
  }
  return root;
}
