export const RETIRED_MAP_LAYERS = [
  ["toggleCompass", "compass"],
  ["togglePrecipitation", "prec"],
  ["togglePopulation", "population"],
  ["toggleRulers", "ruler"],
  ["toggleIce", "ice"]
] as const;

const originalTerrainTypes: Record<string, string> = {
  mountain: "mount",
  highlands: "mount",
  hill: "hill",
  forest: "deciduous",
  pine: "conifer",
  palm: "palm",
  swamp: "swamp",
  dunes: "dune",
  cactus: "dune",
  deadwood: "dune",
  grass: "grass",
  volcano: "mount"
};

export function restoreLegacyTerrainIcon(href: string): string {
  if (!href.startsWith("#rpg-")) return href;
  const type = originalTerrainTypes[href.slice(5)];
  return type ? `#relief-${type}-1` : href;
}
