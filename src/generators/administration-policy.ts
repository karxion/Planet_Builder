import type { PackedGraph } from "@/types/PackedGraph";

export const ADMINISTRATIVE_ONLY = true;

export function clearCultures(world: PackedGraph): void {
  world.cultures = [];
  world.cells.culture = new Uint16Array(world.cells.i.length);
}

export function clearReligions(world: PackedGraph): void {
  world.religions = [];
  world.cells.religion = new Uint16Array(world.cells.i.length);
}

export function removeLegacyDivisions(world: PackedGraph): string[] {
  clearCultures(world);
  clearReligions(world);
  world.zones = [];
  const removedMarkers = (world.markers || []).filter(marker => marker.type?.startsWith("sacred-"));
  world.markers = (world.markers || []).filter(marker => !marker.type?.startsWith("sacred-"));
  for (const burg of world.burgs || []) {
    if (!burg?.i) continue;
    burg.culture = 0;
    burg.type = "Generic";
    burg.temple = 0;
  }
  for (const state of world.states || []) {
    if (!state?.i) continue;
    state.culture = 0;
    state.type = "Generic";
  }
  for (const good of world.goods || []) {
    if (!good.multipliers) continue;
    delete good.multipliers.culture;
    delete good.multipliers.cultureType;
    delete good.multipliers.religion;
    delete good.multipliers.zone;
  }
  return removedMarkers.map(marker => `marker${marker.i}`);
}
