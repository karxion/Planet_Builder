import { battlePreset, isBattleMapSettings } from "@/data/battle-map";
import { isDungeonFloor, isDungeonV2 } from "@/data/dungeon-v2-validation";
import type { DungeonV2 } from "@/types/dungeon-v2";

/** Return an explicit recovery candidate; the caller keeps/export the original record until Apply. */
export function recoverDungeonV2(raw: unknown): { d: DungeonV2; removed: string[] } | undefined {
  if (
    !raw ||
    typeof raw !== "object" ||
    !("version" in raw) ||
    raw.version !== 2 ||
    !("floors" in raw) ||
    !Array.isArray(raw.floors)
  )
    return;
  const source = raw as Record<string, unknown>,
    floors = structuredClone(raw.floors.filter(isDungeonFloor));
  if (!floors.length) return;
  const unique = floors.filter((f, i) => floors.findIndex(v => v.id === f.id) === i),
    first = unique[0];
  const valid = new Set(unique.map(f => f.id));
  const removed = raw.floors
    .filter(f => !isDungeonFloor(f) || !valid.has(f.id))
    .map((f, i) => (f && typeof f === "object" && "id" in f ? String(f.id) : `damaged-floor-${i + 1}`));
  const order = Array.isArray(source.floorOrder)
    ? source.floorOrder.filter((id): id is string => typeof id === "string" && valid.has(id))
    : [];
  const safeId = typeof source.id === "string" && source.id.length <= 200 ? source.id : "recovered";
  const safeSeed = typeof source.seed === "string" ? source.seed.slice(0, 512) : "recovered";
  const d: DungeonV2 = {
    version: 2,
    generatorVersion: 1,
    id: safeId,
    name: typeof source.name === "string" ? source.name.slice(0, 512) : "Recovered dungeon",
    seed: safeSeed,
    defaults: { ...first.settings },
    floors: unique,
    floorOrder: [...new Set([...order, ...unique.map(f => f.id)])],
    connections: [],
    entrance: { floorId: first.id, roomId: first.rooms[0].id },
    objective: { floorId: unique.at(-1)!.id, roomId: unique.at(-1)!.rooms.at(-1)!.id, kind: "relic" },
    battleMap: isBattleMapSettings(source.battleMap) ? structuredClone(source.battleMap) : battlePreset("medium"),
    progress: { round: 0, keys: [], events: [], log: [] }
  };
  // Quarantine unresolved circuits. Valid floors retain geometry and entities; only dead circuit refs are removed.
  for (const f of d.floors)
    for (const e of f.entities)
      if (e.device) {
        const before = e.device.targets.length;
        e.device.targets = e.device.targets.filter(t =>
          d.floors.find(f => f.id === t.floorId)?.entities.some(e => e.id === t.entityId && e.device)
        );
        if (e.device.targets.length !== before) removed.push(`circuit:${e.id}`);
      }
  if (Array.isArray(source.connections))
    for (const connection of source.connections) {
      const candidate = { ...d, connections: [connection] };
      if (
        isDungeonV2(candidate) &&
        [connection.from, connection.to].every(ref =>
          d.floors.find(f => f.id === ref.floorId)?.endpoints.some(e => e.id === ref.endpointId)
        ) &&
        (!connection.requiredDevice ||
          d.floors
            .find(f => f.id === connection.requiredDevice.floorId)
            ?.entities.some(e => e.id === connection.requiredDevice.entityId && e.device))
      )
        d.connections.push(structuredClone(connection));
      else removed.push(`connection:${connection?.id || "unknown"}`);
    }
  return isDungeonV2(d) ? { d, removed } : undefined;
}
