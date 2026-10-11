export function isDungeonLocation(marker: { type?: string; icon?: string }): boolean {
  return (
    marker.type === "dungeons" ||
    marker.type === "dungeon" ||
    marker.type === "rpg-dungeon" ||
    (marker.icon === "#rpg-dungeon" && marker.type !== "caves")
  );
}

export function getDungeonUrl(worldSeed: string, cell: number): string {
  let hash = 2166136261;
  for (const char of `${worldSeed}:dungeon:${cell}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const url = new URL("https://watabou.github.io/one-page-dungeon/");
  const legacySeed = `${worldSeed}${cell}`;
  url.searchParams.set("seed", /^\d+$/.test(legacySeed) ? legacySeed : String(hash >>> 0));
  return url.href;
}
