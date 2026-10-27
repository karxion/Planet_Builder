import { geographyFromTerrain, itemOrigin } from "@/generators/unique-item-bonuses";
import { inferCountryArchetype } from "@/generators/npc-progression";
import type { CampaignWorld } from "@/types/campaign-world";
import type { UniqueItemOrigin, WorldMagicItem } from "@/types/world-item";

// Read map geography in the controller; generation stays independent of map globals and DOM.
export function mapItemOrigin(world: CampaignWorld, item: WorldMagicItem): UniqueItemOrigin {
  if (item.origin) return item.origin;
  const origin = itemOrigin(world, item);
  if (world.heritage?.treasures.some(treasure => treasure.id === item.sourceTreasureId && treasure.origin))
    return origin;
  if (typeof pack === "undefined" || !pack.cells?.h) return origin;
  const source = world.heritage?.treasures.find(treasure => treasure.id === item.sourceTreasureId);
  const owner = item.owner;
  const unitId =
    source?.settlementId ||
    (source
      ? `country:${source.stateId}`
      : owner.kind === "unit"
        ? owner.id
        : owner.kind === "npc"
          ? world.npcs.find(npc => npc.id === owner.id)?.villageId
          : undefined);
  const unit = world.units.find(unit => unit.id === unitId);
  const cell = item.reward?.cell ?? (unit && typeof findCell === "function" ? findCell(unit.x, unit.y) : undefined);
  if (cell !== undefined && Number.isFinite(pack.cells.h[cell])) {
    origin.geography = geographyFromTerrain(
      pack.cells.h[cell],
      pack.cells.biome?.[cell] || 0,
      Boolean(pack.cells.c?.[cell]?.some(neighbor => pack.cells.h[neighbor] < 20))
    );
  }
  const stateId = source?.stateId ?? unit?.stateId ?? (cell !== undefined ? pack.cells.state?.[cell] : undefined);
  if (!world.npcProfiles?.some(profile => profile.stateId === stateId)) {
    const state = stateId === undefined ? undefined : pack.states?.[stateId];
    origin.archetype = inferCountryArchetype(`${state?.form || ""} ${state?.formName || ""}`);
  } else origin.archetype = world.npcProfiles.find(profile => profile.stateId === stateId)!.archetype;
  return origin;
}
