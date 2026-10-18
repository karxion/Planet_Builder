import Alea from "alea";
import { type QuadtreeLeaf, quadtree } from "d3";
import { ADVENTURE_MONSTER_BY_ID, ADVENTURE_THEMES } from "@/data/adventure-sites";
import type { AdventurePlacementResult, AdventureSettings, AdventureSnapshot } from "@/types/adventure-site";

export function defaultAdventureSettings(width: number, height: number): AdventureSettings {
  const span = Math.min(width, height);
  return {
    settlementDistance: Math.max(16, Math.round(span * 0.06)),
    siteDistance: Math.max(20, Math.round(span * 0.045)),
    maxPerCountry: 6
  };
}
export function isAdventureSettings(settings: AdventureSettings): boolean {
  return (
    Number.isFinite(settings.settlementDistance) &&
    settings.settlementDistance >= 1 &&
    settings.settlementDistance <= 10000 &&
    Number.isFinite(settings.siteDistance) &&
    settings.siteDistance >= 1 &&
    settings.siteDistance <= 10000 &&
    Number.isInteger(settings.maxPerCountry) &&
    settings.maxPerCountry >= 1 &&
    settings.maxPerCountry <= 20
  );
}
interface Obstacle {
  x: number;
  y: number;
  radius: number;
}
const index = (points: Obstacle[]) =>
  quadtree<Obstacle>()
    .x(point => point.x)
    .y(point => point.y)
    .addAll(points);
function collides(tree: ReturnType<typeof index>, x: number, y: number, maximum: number): boolean {
  let collision = false;
  tree.visit((node, x0, y0, x1, y1) => {
    if (collision || x1 < x - maximum || x0 > x + maximum || y1 < y - maximum || y0 > y + maximum) return true;
    if (!node.length) {
      let leaf: QuadtreeLeaf<Obstacle> | undefined = node;
      while (leaf) {
        const point = leaf.data;
        if ((point.x - x) ** 2 + (point.y - y) ** 2 < point.radius ** 2) collision = true;
        leaf = leaf.next;
      }
    }
    return collision;
  });
  return collision;
}
const crValue = (cr: string) => (cr.includes("/") ? Number(cr.split("/")[0]) / Number(cr.split("/")[1]) : Number(cr));

export function generateAdventureSites(
  input: AdventureSnapshot,
  seed: string,
  settings = defaultAdventureSettings(input.width, input.height),
  generation = 0
): AdventurePlacementResult {
  if (!isAdventureSettings(settings) || !Number.isSafeInteger(generation) || generation < 0)
    throw new Error("Invalid adventure generation settings");
  const result: AdventurePlacementResult = { placements: [], countries: [] };
  const towns = index(
    input.settlements.map(town => ({ ...town, radius: settings.settlementDistance * (town.city ? 1.5 : 1) }))
  );
  const occupied = index(input.markers.map(marker => ({ ...marker, radius: settings.siteDistance })));
  const grouped = new Map<number, AdventureSnapshot["cells"]>();
  for (const cell of input.cells) {
    if (cell.height < 20 || !Number.isFinite(cell.x) || !Number.isFinite(cell.y)) continue;
    if (!grouped.has(cell.stateId)) grouped.set(cell.stateId, []);
    grouped.get(cell.stateId)!.push(cell);
  }
  for (const country of [...input.countries].filter(country => country.id > 0).sort((a, b) => a.id - b.id)) {
    const cells = [...(grouped.get(country.id) || [])].sort((a, b) => a.id - b.id);
    const target = Math.min(settings.maxPerCountry, Math.max(1, Math.ceil(Math.sqrt(cells.length) / 8)));
    const existing = input.markers.filter(marker => marker.adventure && marker.stateId === country.id).length;
    const random = Alea(`${seed}:adventure-sites-v1:${country.id}:${generation}`);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    let added = 0;
    for (const cell of cells) {
      if (existing + added >= target) break;
      if (
        cell.x < 16 ||
        cell.y < 32 ||
        cell.x > input.width - 16 ||
        cell.y > input.height - 16 ||
        cell.height < 20 ||
        collides(towns, cell.x, cell.y, settings.settlementDistance * 1.5) ||
        collides(occupied, cell.x, cell.y, settings.siteDistance)
      )
        continue;
      const hostile = random() < 0.3;
      const themes = ADVENTURE_THEMES.filter(theme => (theme.kind === "hostileSettlement") === hostile);
      const theme = themes[Math.floor(random() * themes.length)];
      const monsters = theme.monsters.map(id => ADVENTURE_MONSTER_BY_ID.get(id)!);
      const weight = (cr: string) => (crValue(cr) <= 4 ? 8 : crValue(cr) <= 10 ? 5 : crValue(cr) <= 16 ? 2 : 0.35);
      let roll = random() * monsters.reduce((sum, monster) => sum + weight(monster.cr), 0);
      const monster =
        monsters.find(monster => {
          roll -= weight(monster.cr);
          return roll < 0;
        }) || monsters.at(-1)!;
      result.placements.push({
        cell: cell.id,
        stateId: country.id,
        x: cell.x,
        y: cell.y,
        name: `${country.name} · ${theme.name} ${existing + added + 1}`,
        adventure: {
          version: 1,
          themeId: theme.id,
          monsterId: monster.id,
          inhabitants:
            theme.id === "underworld-passage"
              ? 20 + Math.floor(random() * 61)
              : hostile
                ? 8 + Math.floor(random() * 33)
                : crValue(monster.cr) >= 10
                  ? 1
                  : 2 + Math.floor(random() * 11),
          cleared: false,
          edited: false,
          generation
        }
      });
      occupied.add({ x: cell.x, y: cell.y, radius: settings.siteDistance });
      added++;
    }
    result.countries.push({
      stateId: country.id,
      target,
      existing,
      added,
      missing: Math.max(0, target - existing - added)
    });
  }
  return result;
}
