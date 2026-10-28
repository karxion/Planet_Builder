import Alea from "alea";
import { UNDERGROUND_DEPTHS, undergroundLevel } from "@/data/underground";
import type { UndergroundMode, UndergroundSurface } from "@/types/underground";
import { UNDERGROUND_LEVELS, type UndergroundCell, type UndergroundLayer } from "@/types/underground";
import type { SpaceSite, SpaceSiteKind, WorldSpacesData } from "@/types/world-spaces";
import { generateHollowWorld } from "./hollow-world";
import { inverseSurface, undergroundRoute } from "./inverse-surface";
import { prepareUndergroundWorld } from "./underground-world-data";

interface Point {
  x: number;
  y: number;
}
export interface UndergroundEntrance extends Point {
  name: string;
}
export interface UndergroundOptions {
  seed: string;
  chambers: number;
  mode?: UndergroundMode;
  surface?: UndergroundSurface;
}
const COLUMNS = 128,
  ROWS = 80;
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Seeded regional cave network, independent of surface cells, NPCs and the DOM. */
export function generateUnderground(
  existing: WorldSpacesData,
  options: UndergroundOptions,
  entrances: UndergroundEntrance[] = []
): WorldSpacesData {
  if (
    !options.seed.trim() ||
    options.seed.length > 120 ||
    !Number.isInteger(options.chambers) ||
    options.chambers < 12 ||
    options.chambers > 36
  )
    throw new Error("지저 시드와 공동 수(12~36)를 확인해 주세요.");
  const mode = options.mode || "tunnels";
  if (!["tunnels", "hollow"].includes(mode)) throw new Error("지저 세계 구조를 확인하세요.");
  if (mode === "hollow") return generateHollowWorld(existing, options, entrances);
  const elevations = options.surface ? inverseSurface(options.surface, COLUMNS, ROWS) : undefined;
  const { data, generation, prefix } = prepareUndergroundWorld(existing, mode);
  const add = (suffix: string, kind: SpaceSiteKind, point: Point, depth: number, name: string): SpaceSite => {
    const site: SpaceSite = {
      id: prefix + suffix,
      space: "underground",
      kind,
      name,
      x: point.x / COLUMNS,
      y: point.y / ROWS,
      depth,
      radius: kind === "territory" ? 0.075 : 0.03,
      terrain: "cavern",
      residents: kind === "city" ? "지저 거주민" : "",
      population: kind === "city" ? 1200 : 0,
      notes: "",
      origin: "underground",
      edited: false
    };
    data.sites.push(site);
    return site;
  };
  const link = (a: SpaceSite, b: SpaceSite, name: string) => {
    data.links.push({ id: `${prefix}link:${data.links.length}`, name, from: a.id, to: b.id, origin: "underground" });
  };
  const selectedEntrances: UndergroundEntrance[] = [];
  for (const entrance of entrances) {
    if (!Number.isFinite(entrance.x) || !Number.isFinite(entrance.y)) continue;
    const p = { ...entrance, x: clamp(entrance.x, 0.025, 0.975), y: clamp(entrance.y, 0.04, 0.96) };
    if (selectedEntrances.every(other => distance(other, p) >= 0.14)) selectedEntrances.push(p);
    if (selectedEntrances.length === 4) break;
  }
  const levels: UndergroundLayer[] = [];
  const centersByLevel: Point[][] = [];
  const carvers: ((p: Point) => void)[] = [];
  for (const [levelIndex, levelId] of UNDERGROUND_LEVELS.entries()) {
    const rng = Alea(`${options.seed.trim()}:${levelId}`);
    const cells: UndergroundCell[] = Array(COLUMNS * ROWS).fill(0);
    const centers: Point[] = [];
    const draw = (p: Point, rx: number, ry: number, type: UndergroundCell, rough = false) => {
      for (let y = Math.max(0, Math.floor(p.y - ry - 1)); y <= Math.min(ROWS - 1, Math.ceil(p.y + ry + 1)); y++)
        for (let x = Math.max(0, Math.floor(p.x - rx - 1)); x <= Math.min(COLUMNS - 1, Math.ceil(p.x + rx + 1)); x++) {
          const d = ((x + 0.5 - p.x) / rx) ** 2 + ((y + 0.5 - p.y) / ry) ** 2;
          if (d < (rough ? 0.8 + rng() * 0.4 : 1)) cells[y * COLUMNS + x] = type;
        }
    };
    const tunnel = (a: Point, b: Point) => {
      if (elevations) {
        const cell = (p: Point) =>
          Math.min(ROWS - 1, Math.max(0, Math.floor(p.y))) * COLUMNS +
          Math.min(COLUMNS - 1, Math.max(0, Math.floor(p.x)));
        const path = undergroundRoute(
          COLUMNS,
          ROWS,
          cell(a),
          cell(b),
          i => 1 + Math.round(((elevations[i] + 5000) / 8000) * 8)
        );
        for (const i of path) draw({ x: (i % COLUMNS) + 0.5, y: Math.floor(i / COLUMNS) + 0.5 }, 1.2, 1.2, 1);
        return;
      }
      const steps = Math.ceil(distance(a, b) * 2);
      const bend = (rng() - 0.5) * 6;
      for (let step = 0; step <= steps; step++) {
        const t = steps ? step / steps : 0;
        draw(
          {
            x: a.x + (b.x - a.x) * t + Math.sin(t * Math.PI) * bend,
            y: a.y + (b.y - a.y) * t + (Math.sin(t * Math.PI * 2) * bend) / 2
          },
          1.5,
          1.4,
          1
        );
      }
    };
    for (let attempt = 0; centers.length < options.chambers && attempt < 3000; attempt++) {
      const p = { x: 9 + rng() * (COLUMNS - 18), y: 7 + rng() * (ROWS - 14) };
      if (centers.some(other => distance(other, p) < 9)) continue;
      const inverse = elevations?.[Math.floor(p.y) * COLUMNS + Math.floor(p.x)];
      if (inverse !== undefined && rng() > 0.2 + ((3000 - inverse) / 8000) * 0.8) continue;
      // Cell centers keep place anchors on a known dry cell.
      p.x = Math.floor(p.x) + 0.5;
      p.y = Math.floor(p.y) + 0.5;
      centers.push(p);
      const rx = 4 + rng() * 4,
        ry = 3 + rng() * 2.5;
      draw(p, rx, ry, 1, true);
      if (rng() < 0.45)
        draw({ x: p.x + rx * 0.35, y: p.y + ry * 0.2 }, rx * 0.4, ry * 0.4, levelIndex === 2 && rng() < 0.5 ? 3 : 2);
    }
    const records = centers.map((point, i) => {
      const city = i % 4 === 0;
      const site = add(
        `${levelId}:room:${i}`,
        city ? "city" : "terrain",
        point,
        UNDERGROUND_DEPTHS[levelId],
        `${["회색", "푸른", "흑요"][levelIndex]} ${city ? "거주지" : "공동"} ${i + 1}`
      );
      site.factionId = `ug-faction:${Math.min(2, Math.floor((point.x / COLUMNS) * 3))}`;
      if (city) {
        site.population = 800 + Math.floor(rng() * 70) * 100;
        const territory = add(`${levelId}:territory:${i}`, "territory", point, site.depth, `${site.name} 세력권`);
        territory.factionId = site.factionId;
      }
      draw(point, 1.8, 1.8, 1);
      return site;
    });
    // Minimum spanning tree guarantees all generated settlements share a dry route.
    const reached = new Set([0]);
    while (reached.size < centers.length) {
      let a = 0,
        b = 0,
        best = Infinity;
      for (const i of reached)
        for (let j = 0; j < centers.length; j++) {
          if (reached.has(j)) continue;
          const d = distance(centers[i], centers[j]);
          if (d < best) {
            a = i;
            b = j;
            best = d;
          }
        }
      tunnel(centers[a], centers[b]);
      link(records[a], records[b], "지저 터널");
      reached.add(b);
    }
    for (let i = 0; i < centers.length; i += 5) {
      const j = (i + 3) % centers.length;
      tunnel(centers[i], centers[j]);
      link(records[i], records[j], "우회 터널");
    }
    const connect = (p: Point) => {
      const nearest = centers.reduce((a, b) => (distance(p, a) < distance(p, b) ? a : b));
      draw(p, 2.5, 2.2, 1);
      tunnel(p, nearest);
    };
    // Preserve manually authored/edited locations, opening a small chamber at their recorded position.
    for (const site of data.sites.filter(
      s =>
        s.space === "underground" &&
        undergroundLevel(s.depth) === levelId &&
        (s.origin !== "underground" || s.edited) &&
        s.kind !== "territory"
    ))
      connect({ x: site.x * COLUMNS, y: site.y * ROWS });
    carvers.push(connect);
    centersByLevel.push(centers);
    levels.push({ id: levelId, cells, ...(elevations ? { elevations: [...elevations] } : {}) });
  }
  for (const [i, entrance] of selectedEntrances.entries()) {
    const p = { x: entrance.x * COLUMNS, y: entrance.y * ROWS };
    const below = add(`entry:${i}`, "gateway", p, 300, `${entrance.name.slice(0, 75)} 아래 입구`);
    const above = add(`surface:${i}`, "gateway", p, 0, `${entrance.name.slice(0, 75)} 지저 입구`);
    above.space = "surface";
    carvers[0](p);
    link(above, below, "지상·지저 출입구");
  }
  for (let i = 0; i < 2; i++) {
    const center = centersByLevel[i][Math.floor(centersByLevel[i].length / 2)];
    const p = { x: center.x + 2.5, y: center.y + 2.5 };
    const a = add(`descent:${i}:from`, "gateway", p, UNDERGROUND_DEPTHS[UNDERGROUND_LEVELS[i]], "층간 하강로");
    const b = add(`descent:${i}:to`, "gateway", p, UNDERGROUND_DEPTHS[UNDERGROUND_LEVELS[i + 1]], "층간 상승로");
    carvers[i](p);
    carvers[i + 1](p);
    link(a, b, "층간 통로");
  }
  data.underground = {
    version: 1,
    seed: options.seed.trim(),
    generation,
    activeLevel: "upper",
    columns: COLUMNS,
    rows: ROWS,
    chambers: options.chambers,
    mode,
    surfaceInverted: Boolean(elevations),
    levels
  };
  data.activeSpace = "underground";
  return data;
}
