import type { WorldNpc } from "@/types/campaign-world";

export interface EncounterHome {
  i: number;
  state?: number;
  x: number;
  y: number;
  removed?: boolean;
}

export function selectLocalEncounterNpc(
  marker: { x: number; y: number; cell: number },
  stateId: number,
  homes: EncounterHome[],
  npcs: WorldNpc[]
): WorldNpc | undefined {
  if (![marker.x, marker.y, marker.cell, stateId].every(Number.isFinite)) return;
  const byHome = new Map<string, WorldNpc[]>();
  for (const npc of npcs) {
    if (!byHome.has(npc.villageId)) byHome.set(npc.villageId, []);
    byHome.get(npc.villageId)!.push(npc);
  }
  const nearest = homes
    .filter(
      home =>
        home?.i &&
        !home.removed &&
        (home.state || 0) === stateId &&
        Number.isFinite(home.x) &&
        Number.isFinite(home.y) &&
        byHome.has(`village:${home.i}`)
    )
    .sort(
      (a, b) => Math.hypot(a.x - marker.x, a.y - marker.y) - Math.hypot(b.x - marker.x, b.y - marker.y) || a.i - b.i
    )[0];
  if (!nearest) return;
  const candidates = byHome
    .get(`village:${nearest.i}`)!
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));
  return candidates[Math.abs(Math.trunc(marker.cell)) % candidates.length];
}
