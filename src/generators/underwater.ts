import Alea from "alea";
import { SEA_PEOPLES, SEABED_GEOLOGY_VERSION } from "@/data/underwater";
import { generatedText as gt, generatedTemplate as gf } from "@/utils/generation-text";
import type { UnderwaterMap } from "@/types/underwater";
import type { SpaceSite, WorldSpacesData } from "@/types/world-spaces";

import { generateSeabed, type SeaSurface } from "./seabed";

export type { SeaSurface } from "./seabed";

export function generateUnderwater(existing: WorldSpacesData, seed: string, surface: SeaSurface): WorldSpacesData {
  const { columns, rows } = surface,
    size = columns * rows;
  const { depths, terrain, features, water } = generateSeabed(seed, surface);
  const rng = Alea(`${seed.trim()}:aquatic-realms-v2`);
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

  const data = structuredClone(existing);
  data.sites = data.sites.filter(s => s.origin !== "underwater" || s.edited);
  const kept = new Set(data.sites.map(s => s.id));
  data.links = data.links.filter(l => l.origin !== "underwater" && kept.has(l.from) && kept.has(l.to));
  let generation = (data.underwater?.generation || 0) + 1;
  while ([...data.sites, ...data.links].some(s => s.id.startsWith(`sea:${generation}:`))) generation++;
  const prefix = `sea:${generation}:`,
    factionIds = SEA_PEOPLES.map(p => `sea-${p.id}`);
  for (const [n, profile] of SEA_PEOPLES.entries()) {
    const existing = data.factions.find(f => f.id === factionIds[n]);
    const authored = (value: string | undefined, source: string) =>
      [gt(source, "ko"), gt(source, "en")].includes(value || "");
    if (
      existing &&
      authored(existing.name, profile.name) &&
      authored(existing.notes, profile.notes) &&
      authored(existing.people, profile.people)
    ) {
      existing.name = gt(profile.name);
      existing.notes = gt(profile.notes);
      existing.people = gt(profile.people);
    }
    if (!existing)
      data.factions.push({
        id: factionIds[n],
        name: gt(profile.name),
        people: gt(profile.people),
        color: profile.color,
        notes: gt(profile.notes)
      });
  }
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
      name: gf("{name} {kind}", "{name} {kind}", {
        name: faction.name.slice(0, 90),
        kind: gt(capital ? "중심도시" : "교역항")
      }),
      ...point(i),
      depth: depths[i],
      radius: 0.035,
      terrain: terrain[i] === 6 ? "reef" : [4, 14].includes(terrain[i]) ? "trench" : "plain",
      factionId: faction.id,
      residents: faction.people || gt(profile.people),
      population,
      notes: gt("해저 거주지 · 깊이는 해수면 아래 바닥 수심"),
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
      name: gf("{name} 교역로", "{name} Trade route", {
        name: data.factions.find(f => f.id === factionIds[n])!.name.slice(0, 90)
      }),
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
    view: "combined",
    geologyVersion: SEABED_GEOLOGY_VERSION,
    features
  };
  data.underwater = map;
  data.activeSpace = "underwater";
  return data;
}
