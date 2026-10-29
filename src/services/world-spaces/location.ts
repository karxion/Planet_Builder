import { siteInActiveLevel, undergroundIndex, undergroundLabel } from "@/data/underground";
import { SEABED_TERRAINS, seabedIndex } from "@/data/underwater";
import { getUiLanguage } from "@/services/ui-language";
import type { WorldSpacesData } from "@/types/world-spaces";

/** Resolves only the active world's records, never surface pack cells. Coordinates are normalized. */
export function spaceLocation(data: WorldSpacesData, x: number, y: number): string | undefined {
  if (data.activeSpace === "surface") return;
  const ko = getUiLanguage() === "ko";
  const space = data.activeSpace === "underwater" ? (ko ? "해저" : "Underwater") : ko ? "지저" : "Underground";
  if (![x, y].every(Number.isFinite) || x < 0 || x > 1 || y < 0 || y > 1) return space;
  let terrain = "",
    depth = "",
    ownerId: string | undefined,
    claimedFloor = true;
  if (data.activeSpace === "underwater" && data.underwater) {
    const map = data.underwater,
      i = seabedIndex(map, x, y);
    terrain = SEABED_TERRAINS[map.terrain[i]][ko ? "ko" : "en"];
    depth = map.depths[i] ? `${ko ? "수심" : "Depth"} ${map.depths[i]} m` : "";
    if (map.depths[i]) ownerId = map.factionIds[map.owners[i] - 1];
    else claimedFloor = false;
  } else if (data.activeSpace === "underground" && data.underground) {
    const map = data.underground,
      layer = map.levels.find(l => l.id === map.activeLevel)!;
    const cell = layer.cells[undergroundIndex(map, x, y)];
    claimedFloor = map.mode === "hollow" ? [1, 4, 5].includes(cell) : cell > 0;
    terrain = (
      ko
        ? ["암반", "공동", "지하호수", "용암", "고지대", "지저 숲"]
        : ["Rock", "Cavern", "Underground lake", "Lava", "Uplands", "Underground forest"]
    )[cell];
    depth = map.mode === "hollow" ? (ko ? "공동 세계" : "Hollow world") : undergroundLabel(map.activeLevel);
  }
  const matches = data.sites
    .filter(
      site =>
        siteInActiveLevel(site, data) &&
        ["territory", "terrain"].includes(site.kind) &&
        Math.hypot(site.x - x, site.y - y) <= site.radius
    )
    .sort((a, b) => a.radius - b.radius);
  const territory = claimedFloor
    ? matches.find(site => site.kind === "territory" && (!ownerId || site.factionId === ownerId))
    : undefined;
  const region = matches.find(site => site.kind === "terrain");
  // Seabed owners are exact cell ownership; nearby territories cannot override them or claim land.
  const owner = data.factions.find(
    f => f.id === (data.activeSpace === "underwater" && data.underwater ? ownerId : territory?.factionId)
  );
  return [...new Set([space, territory?.name, owner?.name, region?.name, terrain, depth].filter(Boolean))].join(" · ");
}
