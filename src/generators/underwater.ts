import Alea from "alea";
import { SEA_PEOPLES } from "@/data/underwater";
import type { SeabedTerrain, UnderwaterMap } from "@/types/underwater";
import type { SpaceSite, WorldSpacesData } from "@/types/world-spaces";

export interface SeaSurface {
  columns: number;
  rows: number;
  heights: number[];
}
export function generateUnderwater(existing: WorldSpacesData, seed: string, surface: SeaSurface): WorldSpacesData {
  const { columns, rows, heights } = surface,
    size = columns * rows;
  if (
    !seed.trim() ||
    seed.length > 120 ||
    !Number.isInteger(columns) ||
    !Number.isInteger(rows) ||
    columns < 24 ||
    rows < 24 ||
    columns > 192 ||
    rows > 192 ||
    heights.length !== size ||
    !Array.from(heights).every(h => Number.isFinite(h) && h >= 0 && h <= 100)
  )
    throw new Error("수중 생성 시드와 지상 지형을 확인하세요.");
  const water = heights.map(h => h < 20);
  if (water.filter(Boolean).length < 24) throw new Error("수중 지도를 생성할 바다가 부족합니다.");
  const rng = Alea(`${seed.trim()}:seabed`);
  const neighbors = (i: number) => {
    const x = i % columns,
      y = Math.floor(i / columns),
      result: number[] = [];
    if (x) result.push(i - 1);
    if (x < columns - 1) result.push(i + 1);
    if (y) result.push(i - columns);
    if (y < rows - 1) result.push(i + columns);
    return result;
  };
  // Distance from the actual sampled coastline defines continental shelves and slopes.
  const distance = Array<number>(size).fill(Infinity),
    queue: number[] = [];
  water.forEach((sea, i) => {
    if (!sea) {
      distance[i] = 0;
      queue.push(i);
    }
  });
  for (let p = 0; p < queue.length; p++)
    for (const n of neighbors(queue[p]))
      if (distance[n] > distance[queue[p]] + 1) {
        distance[n] = distance[queue[p]] + 1;
        queue.push(n);
      }
  const phase = rng() * Math.PI * 2;
  const depths = heights.map((h, i) => {
    if (!water[i]) return 0;
    const d = Number.isFinite(distance[i]) ? distance[i] : 12;
    const shelf = 2.2 + Math.sin((i % columns) * 0.09 + Math.floor(i / columns) * 0.11 + phase) * 0.6;
    if (d <= shelf) return Math.round(25 + (d / shelf) * 170);
    if (d < shelf + 4) return Math.round(200 + ((d - shelf) / 4) ** 1.2 * 3000);
    return Math.round(
      3600 +
        (20 - h) * 65 +
        550 * Math.sin((i % columns) * 0.07 + phase) +
        400 * Math.cos(Math.floor(i / columns) * 0.12)
    );
  });
  const terrain: SeabedTerrain[] = depths.map(d => (d === 0 ? 0 : d <= 200 ? 1 : d < 3200 ? 2 : 3));
  const offshore = depths
    .map((d, i) => ({ d, i }))
    .filter(p => p.d > 2400)
    .map(p => p.i);
  // Seeded tectonic features enrich the world-map bathymetry; they never cross land.
  for (let feature = 0; feature < 5 && offshore.length; feature++) {
    const start = offshore[Math.floor(rng() * offshore.length)],
      angle = rng() * Math.PI * 2;
    const length = 12 + rng() * Math.min(columns, rows) * 0.45;
    for (let step = -length / 2; step < length / 2; step += 0.4) {
      const x = Math.round((start % columns) + Math.cos(angle) * step + Math.sin(step * 0.18) * 2);
      const y = Math.round(Math.floor(start / columns) + Math.sin(angle) * step);
      if (x < 0 || y < 0 || x >= columns || y >= rows) continue;
      const i = y * columns + x;
      if (depths[i] < 1600 || distance[i] < 3) continue;
      if (feature % 2 === 0) {
        terrain[i] = 4;
        depths[i] = Math.round(6500 + rng() * 4000);
      } else if (terrain[i] !== 4) {
        terrain[i] = 5;
        depths[i] = Math.round(900 + rng() * 1400);
      }
    }
  }
  for (let i = 0; i < size; i++) {
    const reef = Math.sin((i % columns) * 0.31 + phase) * Math.sin(Math.floor(i / columns) * 0.23 - phase);
    if (terrain[i] === 1 && reef > 0.5) terrain[i] = 6;
  }

  const data = structuredClone(existing);
  data.sites = data.sites.filter(s => s.origin !== "underwater" || s.edited);
  const kept = new Set(data.sites.map(s => s.id));
  data.links = data.links.filter(l => l.origin !== "underwater" && kept.has(l.from) && kept.has(l.to));
  let generation = (data.underwater?.generation || 0) + 1;
  while ([...data.sites, ...data.links].some(s => s.id.startsWith(`sea:${generation}:`))) generation++;
  const prefix = `sea:${generation}:`,
    factionIds = SEA_PEOPLES.map(p => `sea-${p.id}`);
  for (const [n, profile] of SEA_PEOPLES.entries())
    if (!data.factions.some(f => f.id === factionIds[n]))
      data.factions.push({
        id: factionIds[n],
        name: profile.name,
        people: profile.people,
        color: profile.color,
        notes: profile.notes
      });
  const seaCells = depths
    .map((d, i) => ({ d, i }))
    .filter(p => p.d > 0)
    .map(p => p.i);
  const capitals: number[] = [];
  const planarDistance = (a: number, b: number) =>
    Math.hypot(((a % columns) - (b % columns)) / columns, (Math.floor(a / columns) - Math.floor(b / columns)) / rows);
  for (const profile of SEA_PEOPLES) {
    let best = -Infinity,
      selected = seaCells[0];
    for (const i of seaCells) {
      if (capitals.includes(i)) continue;
      const separation = capitals.length ? Math.min(...capitals.map(c => planarDistance(i, c))) : 0;
      const score =
        separation * 12 - Math.abs(Math.log((depths[i] + 100) / (profile.depth + 100))) * 0.8 + rng() * 0.03;
      if (score > best) {
        selected = i;
        best = score;
      }
    }
    capitals.push(selected);
  }
  // Multi-source flood fill forms connected influence areas through water, never across land.
  const owners = Array<number>(size).fill(0),
    previous = Array<number>(size).fill(-1),
    steps = Array<number>(size).fill(0);
  const claims = [...capitals];
  capitals.forEach((i, n) => {
    owners[i] = n + 1;
  });
  for (let p = 0; p < claims.length; p++)
    for (const n of neighbors(claims[p]))
      if (water[n] && !owners[n]) {
        owners[n] = owners[claims[p]];
        previous[n] = claims[p];
        steps[n] = steps[claims[p]] + 1;
        claims.push(n);
      }
  const point = (i: number) => ({ x: ((i % columns) + 0.5) / columns, y: (Math.floor(i / columns) + 0.5) / rows });
  const city = (i: number, n: number, capital: boolean): SpaceSite => {
    const profile = SEA_PEOPLES[n],
      faction = data.factions.find(f => f.id === factionIds[n])!;
    const population = (capital ? 30 : 8) * 100 + Math.floor(rng() * 40) * 100;
    const preserved = data.sites.find(
      site =>
        site.origin === "underwater" &&
        site.edited &&
        site.factionId === faction.id &&
        site.id.endsWith(`:city:${n}:${capital ? 0 : 1}`) &&
        Math.floor(site.x * columns) === i % columns &&
        Math.floor(site.y * rows) === Math.floor(i / columns)
    );
    if (preserved) return preserved;
    const site: SpaceSite = {
      id: `${prefix}city:${n}:${capital ? 0 : 1}`,
      space: "underwater",
      kind: "city",
      name: `${faction.name.slice(0, 90)} ${capital ? "중심도시" : "교역항"}`,
      ...point(i),
      depth: depths[i],
      radius: 0.035,
      terrain: terrain[i] === 6 ? "reef" : terrain[i] === 4 ? "trench" : "plain",
      factionId: faction.id,
      residents: faction.people || profile.people,
      population,
      notes: "해저 거주지 · 깊이는 해수면 아래 바닥 수심",
      origin: "underwater",
      edited: false
    };
    data.sites.push(site);
    return site;
  };
  for (const [n, start] of capitals.entries()) {
    const a = city(start, n, true);
    const owned = seaCells.filter(i => owners[i] === n + 1 && steps[i] >= 3 && steps[i] <= 28);
    if (!owned.length) continue;
    const end = owned.reduce((a, b) => (steps[a] > steps[b] ? a : b)),
      b = city(end, n, false);
    const cells = [end];
    let current = end;
    while (current !== start && previous[current] >= 0) {
      current = previous[current];
      cells.push(current);
    }
    const route = cells.reverse().map(point);
    route[0] = { x: a.x, y: a.y };
    route[route.length - 1] = { x: b.x, y: b.y };
    data.links.push({
      id: `${prefix}route:${n}`,
      name: `${data.factions.find(f => f.id === factionIds[n])!.name.slice(0, 90)} 교역로`,
      from: a.id,
      to: b.id,
      origin: "underwater",
      path: route
    });
  }
  data.relations ||= [];
  for (let a = 0; a < factionIds.length; a++)
    for (let b = a + 1; b < factionIds.length; b++) {
      const from = factionIds[a],
        to = factionIds[b];
      if (data.relations.some(r => (r.from === from && r.to === to) || (r.to === from && r.from === to))) continue;
      const status =
        a === 0 && b === 3 ? "allied" : a === 0 && b === 1 ? "rival" : a === 2 && b === 4 ? "trade" : "neutral";
      data.relations.push({ from, to, status });
    }
  const map: UnderwaterMap = {
    version: 1,
    seed: seed.trim(),
    generation,
    columns,
    rows,
    depths,
    terrain,
    owners,
    factionIds,
    view: "combined"
  };
  data.underwater = map;
  data.activeSpace = "underwater";
  return data;
}
