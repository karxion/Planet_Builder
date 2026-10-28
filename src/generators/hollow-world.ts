import Alea from "alea";
import { HOLLOW_REFERENCE_DEPTH } from "@/data/underground";
import type { UndergroundCell } from "@/types/underground";
import type { SpaceSite, SpaceSiteKind, WorldSpacesData } from "@/types/world-spaces";
import { inverseSurface, undergroundRoute } from "./inverse-surface";
import type { UndergroundEntrance, UndergroundOptions } from "./underground";
import { prepareUndergroundWorld } from "./underground-world-data";

/** A single continuous inner landscape, not a stack of disconnected cave floors. */
export function generateHollowWorld(
  existing: WorldSpacesData,
  options: UndergroundOptions,
  entrances: UndergroundEntrance[]
): WorldSpacesData {
  if (!options.surface) throw new Error("공동 세계 생성에는 현재 지상 지형이 필요합니다.");
  const columns = 128,
    rows = 80,
    elevations = inverseSurface(options.surface, columns, rows);
  const rng = Alea(`${options.seed.trim()}:hollow-world`),
    phase = rng() * Math.PI * 2;
  const cells: UndergroundCell[] = elevations.map((height, i) =>
    height < 0
      ? 2
      : height > 1800
        ? 4
        : Math.sin((i % columns) * 0.085 + phase) * Math.cos(Math.floor(i / columns) * 0.11) > 0.15
          ? 5
          : 1
  );
  const { data, prefix, generation } = prepareUndergroundWorld(existing, "hollow");
  const point = (i: number) => ({ x: ((i % columns) + 0.5) / columns, y: (Math.floor(i / columns) + 0.5) / rows });
  const cell = (p: { x: number; y: number }) =>
    Math.min(rows - 1, Math.max(0, Math.floor(p.y * rows))) * columns +
    Math.min(columns - 1, Math.max(0, Math.floor(p.x * columns)));
  const add = (suffix: string, kind: SpaceSiteKind, i: number, name: string, factionId?: string): SpaceSite => {
    const population = kind === "city" ? 3000 + Math.floor(rng() * 60) * 100 : 0;
    const p = point(i),
      old = data.sites.find(
        s =>
          s.origin === "underground" &&
          s.edited &&
          s.id.endsWith(`:hollow:${suffix}`) &&
          (kind === "gateway" || (s.x === p.x && s.y === p.y))
      );
    if (old) return old;
    const site: SpaceSite = {
      id: `${prefix}hollow:${suffix}`,
      kind,
      space: "underground",
      name,
      ...p,
      depth: HOLLOW_REFERENCE_DEPTH,
      radius: kind === "territory" ? 0.085 : 0.03,
      terrain: cells[i] === 2 ? "lake" : cells[i] === 4 ? "rock" : "plain",
      population,
      residents: kind === "city" ? "내부 세계 거주민" : "",
      notes: "",
      origin: "underground",
      edited: false,
      ...(factionId ? { factionId } : {})
    };
    data.sites.push(site);
    return site;
  };
  const allDry = cells.map((_, i) => i).filter(i => [1, 4, 5].includes(cells[i]));
  const interior = allDry.filter(
    i =>
      i % columns >= 5 &&
      i % columns < columns - 7 &&
      Math.floor(i / columns) >= 4 &&
      Math.floor(i / columns) < rows - 4
  );
  const dry = interior.length >= Math.round(options.chambers / 3) ? interior : allDry;
  const centers: number[] = [],
    settlements: SpaceSite[] = [];
  for (let n = 0; n < Math.round(options.chambers / 3) && centers.length < dry.length; n++) {
    let selected = -1,
      best = -Infinity;
    for (const i of dry) {
      if (centers.includes(i)) continue;
      const separation = centers.length
        ? Math.min(
            ...centers.map(c =>
              Math.hypot(
                ((i % columns) - (c % columns)) / columns,
                (Math.floor(i / columns) - Math.floor(c / columns)) / rows
              )
            )
          )
        : 0;
      const score = separation * 8 + (cells[i] === 1 ? 0.35 : 0) + rng() * 0.08;
      if (score > best) {
        best = score;
        selected = i;
      }
    }
    if (selected < 0) break;
    centers.push(selected);
    const faction = `ug-faction:${Math.min(2, Math.floor(((selected % columns) / columns) * 3))}`;
    const city = add(`city:${n}`, "city", selected, `내부 거주지 ${n + 1}`, faction);
    settlements.push(city);
    add(`territory:${n}`, "territory", selected, `${city.name} 영역`, city.factionId);
  }
  const connect = (a: SpaceSite, b: SpaceSite) => {
    const route = undergroundRoute(columns, rows, cell(a), cell(b), i =>
      cells[i] === 2 ? 12 : cells[i] === 4 ? 3 : cells[i] === 5 ? 2 : 1
    );
    if (route.length < 2) return;
    const transport = route.some(i => cells[i] === 2) ? "water" : "land",
      path = route.map(point);
    path[0] = { x: a.x, y: a.y };
    path[path.length - 1] = { x: b.x, y: b.y };
    data.links.push({
      id: `${prefix}hollow:route:${data.links.length}`,
      name: transport === "water" ? "내부 육로·내해 항로" : "내부 육로",
      from: a.id,
      to: b.id,
      origin: "underground",
      transport,
      path
    });
  };
  const reached = new Set<number>();
  if (settlements.length) reached.add(0);
  while (reached.size < settlements.length) {
    let a = 0,
      b = 0,
      best = Infinity;
    for (const i of reached)
      for (let j = 0; j < settlements.length; j++) {
        if (reached.has(j)) continue;
        const d = Math.hypot(settlements[i].x - settlements[j].x, settlements[i].y - settlements[j].y);
        if (d < best) {
          a = i;
          b = j;
          best = d;
        }
      }
    connect(settlements[a], settlements[b]);
    reached.add(b);
  }
  const chosen: UndergroundEntrance[] = [];
  for (const entry of entrances) {
    if (
      !Number.isFinite(entry.x) ||
      !Number.isFinite(entry.y) ||
      entry.x < 0 ||
      entry.x > 1 ||
      entry.y < 0 ||
      entry.y > 1
    )
      continue;
    if (chosen.some(e => Math.hypot(e.x - entry.x, e.y - entry.y) < 0.14)) continue;
    chosen.push(entry);
    if (chosen.length === 4) break;
  }
  for (const [n, entry] of chosen.entries()) {
    const i = cell(entry),
      below = add(`entry:${n}`, "gateway", i, cells[i] === 2 ? "내해 관문" : "내부 세계 관문");
    if (!below.edited) {
      below.x = entry.x;
      below.y = entry.y;
    }
    // Use the same world coordinate on both sides; a sea exit is explicitly a gateway, not a city.
    let above = data.sites.find(s => s.origin === "underground" && s.edited && s.id.endsWith(`:hollow:surface:${n}`));
    if (!above) {
      above = {
        ...below,
        id: `${prefix}hollow:surface:${n}`,
        space: "surface",
        depth: 0,
        name: `${entry.name.slice(0, 75)} 공동세계 출입구`,
        x: entry.x,
        y: entry.y,
        edited: false
      };
      data.sites.push(above);
    }
    data.links.push({
      id: `${prefix}hollow:entry-link:${n}`,
      name: "지상·공동세계 통로",
      from: above.id,
      to: below.id,
      origin: "underground"
    });
    if (settlements.length)
      connect(
        below,
        settlements.reduce((a, b) =>
          Math.hypot(a.x - below.x, a.y - below.y) < Math.hypot(b.x - below.x, b.y - below.y) ? a : b
        )
      );
  }
  for (const [code, name] of [
    [2, "내해"],
    [4, "내부 산지"],
    [5, "내부 숲"]
  ] as const) {
    const places = cells.map((c, i) => (c === code ? i : -1)).filter(i => i >= 0);
    if (places.length) add(`landmark:${code}`, "terrain", places[Math.floor(rng() * places.length)], name);
  }
  data.underground = {
    version: 1,
    seed: options.seed.trim(),
    generation,
    activeLevel: "upper",
    columns,
    rows,
    chambers: options.chambers,
    mode: "hollow",
    surfaceInverted: true,
    levels: [{ id: "upper", cells, elevations }]
  };
  data.activeSpace = "underground";
  return data;
}
