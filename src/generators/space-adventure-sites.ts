import type { AdventureSnapshot } from "@/types/adventure-site";
import type { WorldSpacesData } from "@/types/world-spaces";
import { dungeonFloorCell, dungeonInSpace, dungeonSpaceLabel } from "@/data/dungeon-spaces";
import { siteInActiveLevel } from "@/data/underground";
import type { Marker } from "./markers-generator";
import { isDungeonLocation } from "@/data/dungeon-locations";

export function spaceAdventureSnapshot(
  data: WorldSpacesData,
  markers: Marker[],
  width: number,
  height: number
): AdventureSnapshot {
  const map = data.activeSpace === "underwater" ? data.underwater : data.underground;
  if (!map) throw new Error("Generate the current space map first");
  const sites = data.sites.filter(s => siteInActiveLevel(s, data));
  const ids = "depths" in map ? map.factionIds : [...new Set(sites.flatMap(s => (s.factionId ? [s.factionId] : [])))];
  // Neutral floor is a real placement region too, including unclaimed caverns.
  const countries = [
    { id: 1, name: dungeonSpaceLabel(data) },
    ...ids.map((id, i) => ({
      id: i + 2,
      name: data.factions.find(f => f.id === id)?.name || dungeonSpaceLabel(data)
    }))
  ];
  const stateAt = (x: number, y: number) => {
    if ("depths" in map) {
      const i =
        Math.min(map.rows - 1, Math.floor(y * map.rows)) * map.columns +
        Math.min(map.columns - 1, Math.floor(x * map.columns));
      return (map.owners[i] || 0) + 1;
    }
    const nearest = sites
      .filter(s => s.factionId && ["city", "territory"].includes(s.kind))
      .reduce<(typeof sites)[number] | undefined>(
        (a, b) => (!a || Math.hypot(b.x - x, b.y - y) < Math.hypot(a.x - x, a.y - y) ? b : a),
        undefined
      );
    return nearest?.factionId ? ids.indexOf(nearest.factionId) + 2 : 1;
  };
  const cells: AdventureSnapshot["cells"] = [];
  for (let i = 0; i < map.columns * map.rows; i++) {
    const x = ((i % map.columns) + 0.5) / map.columns,
      y = (Math.floor(i / map.columns) + 0.5) / map.rows;
    if (dungeonFloorCell(data, x, y) === undefined) continue;
    cells.push({ id: i, stateId: stateAt(x, y), x: x * width, y: y * height, height: 20 });
  }
  return {
    width,
    height,
    countries: countries.filter(c => cells.some(cell => cell.stateId === c.id)),
    cells,
    settlements: sites
      .filter(s => s.kind === "city" || s.kind === "gateway")
      .map(s => ({ x: s.x * width, y: s.y * height, city: s.kind === "city" && Boolean(s.capital) })),
    markers: markers
      .filter(m => dungeonInSpace(m, data))
      .map(m => ({
        x: m.x,
        y: m.y,
        stateId: stateAt(m.x / width, m.y / height),
        adventure: isDungeonLocation(m)
      }))
  };
}
