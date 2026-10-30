import { assertDungeonSettings } from "@/generators/dungeon-layout";
import type { DungeonFloor, DungeonV2 } from "@/types/dungeon-v2";
import { dungeonDistances } from "@/utils/dungeon-grid";
import { ADVENTURE_MONSTER_BY_ID } from "./adventure-sites";
import { isBattleMapSettings } from "./battle-map";
import { DUNGEON_DEVICE_BY_ID, DUNGEON_LIMITS } from "./dungeon-devices";

const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const integer = (n: unknown, min: number, max: number): n is number =>
  typeof n === "number" && Number.isSafeInteger(n) && n >= min && n <= max;
const string = (s: unknown, max = 512): s is string => typeof s === "string" && s.length <= max;
const id = (s: unknown): s is string => string(s, 200) && s.length > 0;
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && Math.abs(v) <= 1e9;
const flags = (v: Record<string, unknown>) =>
  typeof v.locked === "boolean" &&
  typeof v.edited === "boolean" &&
  ["generated", "manual", "migrated"].includes(String(v.origin));
const rotation = (v: unknown) => [0, 90, 180, 270].includes(v as number);
export function isDungeonFloor(value: unknown): value is DungeonFloor {
  try {
    if (
      !object(value) ||
      !id(value.id) ||
      !string(value.name) ||
      !string(value.seed) ||
      !string(value.note, 10000) ||
      !flags(value) ||
      !finite(value.elevationFt) ||
      !finite(value.originX) ||
      !finite(value.originY) ||
      !rotation(value.direction) ||
      !finite(value.cellFeet) ||
      (value.cellFeet as number) <= 0 ||
      typeof value.revealed !== "boolean" ||
      !integer(value.layoutRevision, 0, 1e9) ||
      !integer(value.contentRevision, 0, 1e9)
    )
      return false;
    const f = value as unknown as DungeonFloor;
    assertDungeonSettings(f.settings);
    const { width, height } = f.settings;
    if (
      !string(f.tiles, width * height) ||
      f.tiles.length !== width * height ||
      /[^01]/.test(f.tiles) ||
      !Array.isArray(f.rooms) ||
      !f.rooms.length ||
      f.rooms.length > DUNGEON_LIMITS.rooms ||
      !Array.isArray(f.endpoints) ||
      !f.endpoints.length ||
      f.endpoints.length > 200 ||
      !Array.isArray(f.entities) ||
      f.entities.length > DUNGEON_LIMITS.entities
    )
      return false;
    const ids = new Set<string>(),
      roomCells = new Set<number>();
    for (const r of f.rooms) {
      if (
        !object(r) ||
        !id(r.id) ||
        ids.has(r.id) ||
        !flags(r) ||
        !integer(r.x, 1, width - 2) ||
        !integer(r.y, 1, height - 2) ||
        !integer(r.width, 1, width - 2) ||
        !integer(r.height, 1, height - 2) ||
        r.x + r.width >= width ||
        r.y + r.height >= height ||
        !["entrance", "guard", "puzzle", "reward", "rest", "objective"].includes(r.role) ||
        typeof r.secret !== "boolean" ||
        typeof r.revealed !== "boolean" ||
        !string(r.note, 10000)
      )
        return false;
      ids.add(r.id);
      for (let y = r.y; y < r.y + r.height; y++)
        for (let x = r.x; x < r.x + r.width; x++) {
          const k = y * width + x;
          if (roomCells.has(k)) return false;
          roomCells.add(k);
        }
    }
    const occupied = new Set<number>();
    ids.clear();
    for (const e of [...f.entities, ...f.endpoints]) {
      if (
        !object(e) ||
        !id(e.id) ||
        ids.has(e.id) ||
        !id(e.roomId) ||
        !integer(e.x, 1, width - 2) ||
        !integer(e.y, 1, height - 2) ||
        !integer(e.width, 1, 256) ||
        !integer(e.height, 1, 256) ||
        typeof e.revealed !== "boolean"
      )
        return false;
      const room = f.rooms.find(r => r.id === e.roomId);
      if (
        !room ||
        e.x < room.x ||
        e.y < room.y ||
        e.x + e.width > room.x + room.width ||
        e.y + e.height > room.y + room.height
      )
        return false;
      ids.add(e.id);
      for (let y = e.y; y < e.y + e.height; y++)
        for (let x = e.x; x < e.x + e.width; x++) {
          const k = y * width + x;
          if (f.tiles[k] !== "0" || occupied.has(k)) return false;
          occupied.add(k);
        }
    }
    for (const e of f.entities) {
      if (
        !flags(e as unknown as Record<string, unknown>) ||
        (e.opened !== undefined && typeof e.opened !== "boolean") ||
        (e.looted !== undefined && typeof e.looted !== "boolean") ||
        !/^D(0[1-9]|[12]\d|3[0-2])$/.test(e.assetId) ||
        !rotation(e.rotation) ||
        typeof e.blocksMovement !== "boolean" ||
        typeof e.blocksSight !== "boolean" ||
        !finite(e.movementCost) ||
        e.movementCost < 1 ||
        !["prop", "device", "feature"].includes(e.kind) ||
        (e.grantsKey !== undefined && !id(e.grantsKey))
      )
        return false;
      if (
        e.feature &&
        (!object(e.feature) ||
          !["monster", "trap", "gimmick", "chest"].includes(e.feature.kind) ||
          (e.feature.kind === "monster" &&
            (!ADVENTURE_MONSTER_BY_ID.has(e.feature.monsterId) ||
              !integer(e.feature.count, 1, 6) ||
              !finite(e.feature.hpMultiplier) ||
              !finite(e.feature.damageMultiplier))))
      )
        return false;
      if (e.kind === "device" && !e.device) return false;
      if (!e.device) continue;
      const d = e.device;
      for (const list of [d.guardIds, d.arrivedGuardIds])
        if (list !== undefined && (!Array.isArray(list) || list.length > 100 || !list.every(value => id(value))))
          return false;
      if (
        !object(d) ||
        !DUNGEON_DEVICE_BY_ID.has(d.templateId) ||
        !["armed", "telegraphed", "triggered", "cooldown", "disabled", "destroyed"].includes(d.state) ||
        typeof d.open !== "boolean" ||
        typeof d.powered !== "boolean" ||
        !integer(d.cooldownUntil, 0, 1e9) ||
        !string(d.lastEventId, 200) ||
        !string(d.counter, 5000) ||
        !Array.isArray(d.targets) ||
        d.targets.length > 100 ||
        !d.targets.every(t => object(t) && id(t.floorId) && id(t.entityId)) ||
        !Array.isArray(d.effectCells) ||
        d.effectCells.length > width * height ||
        !d.effectCells.every(p => object(p) && integer(p.x, 0, width - 1) && integer(p.y, 0, height - 1)) ||
        (d.key !== undefined && !id(d.key))
      )
        return false;
    }
    return f.endpoints.every(e => rotation(e.direction));
  } catch {
    return false;
  }
}
/** Structural validity is separate from playability: broken references can be opened for repair. */
export function isDungeonV2(value: unknown): value is DungeonV2 {
  if (
    !object(value) ||
    value.version !== 2 ||
    value.generatorVersion !== 1 ||
    !id(value.id) ||
    !string(value.name) ||
    !string(value.seed) ||
    !isBattleMapSettings(value.battleMap)
  )
    return false;
  const d = value as unknown as DungeonV2;
  try {
    assertDungeonSettings(d.defaults);
  } catch {
    return false;
  }
  if (
    !Array.isArray(d.floors) ||
    !d.floors.length ||
    d.floors.length > DUNGEON_LIMITS.floors ||
    !d.floors.every(isDungeonFloor) ||
    d.floors.reduce((sum, f) => sum + f.settings.width * f.settings.height, 0) > DUNGEON_LIMITS.cells ||
    !Array.isArray(d.floorOrder) ||
    d.floorOrder.length !== d.floors.length ||
    new Set(d.floorOrder).size !== d.floorOrder.length ||
    !d.floorOrder.every(i => d.floors.some(f => f.id === i)) ||
    new Set(d.floors.map(f => f.id)).size !== d.floors.length ||
    !Array.isArray(d.connections) ||
    d.connections.length > 1000 ||
    !object(d.entrance) ||
    !id(d.entrance.floorId) ||
    !id(d.entrance.roomId) ||
    !object(d.objective) ||
    !id(d.objective.floorId) ||
    !id(d.objective.roomId) ||
    !["boss", "rescue", "escape", "relic", "ritual"].includes(d.objective.kind) ||
    !object(d.progress) ||
    !integer(d.progress.round, 0, 1e9) ||
    !Array.isArray(d.progress.keys) ||
    d.progress.keys.length > 1000 ||
    !d.progress.keys.every(k => id(k)) ||
    !Array.isArray(d.progress.events) ||
    d.progress.events.length > 128 ||
    !d.progress.events.every(e => id(e)) ||
    !Array.isArray(d.progress.log) ||
    d.progress.log.length > 100 ||
    !d.progress.log.every(e => string(e, 2000))
  )
    return false;
  const ids = new Set<string>();
  for (const c of d.connections) {
    if (
      !object(c) ||
      !id(c.id) ||
      ids.has(c.id) ||
      !object(c.from) ||
      !object(c.to) ||
      !id(c.from.floorId) ||
      !id(c.from.endpointId) ||
      !id(c.to.floorId) ||
      !id(c.to.endpointId) ||
      !["stairs", "ladder", "lift", "shaft", "drop", "portal", "swim"].includes(c.kind) ||
      typeof c.bidirectional !== "boolean" ||
      typeof c.revealed !== "boolean" ||
      (c.requiredKey !== undefined && !id(c.requiredKey)) ||
      (c.requiredDevice !== undefined &&
        (!object(c.requiredDevice) || !id(c.requiredDevice.floorId) || !id(c.requiredDevice.entityId)))
    )
      return false;
    ids.add(c.id);
  }
  return true;
}
export function diagnoseDungeonV2(d: DungeonV2): string[] {
  const errors: string[] = [],
    byId = new Map(d.floors.map(f => [f.id, f]));
  for (const ref of [d.entrance, d.objective])
    if (!byId.get(ref.floorId)?.rooms.some(r => r.id === ref.roomId))
      errors.push(`입구/목표 참조 손상: ${ref.floorId}`);
  for (const c of d.connections) {
    for (const e of [c.from, c.to])
      if (!byId.get(e.floorId)?.endpoints.some(p => p.id === e.endpointId)) errors.push(`접속구 손상: ${c.id}`);
    if (
      c.requiredDevice &&
      !byId.get(c.requiredDevice.floorId)?.entities.some(e => e.id === c.requiredDevice!.entityId && e.device)
    )
      errors.push(`연결 동력 참조 손상: ${c.id}`);
  }
  for (const f of d.floors)
    for (const e of f.entities)
      for (const guard of e.device?.guardIds || [])
        if (!f.entities.some(e => e.id === guard && e.feature?.kind === "monster"))
          errors.push(`경보 경비 참조 손상: ${e.id}`);
  for (const f of d.floors)
    for (const e of f.entities)
      for (const target of e.device?.targets || [])
        if (!byId.get(target.floorId)?.entities.some(t => t.id === target.entityId && t.device))
          errors.push(`연동 참조 손상: ${e.id}`);
  if (errors.length) return errors;
  // Monotone fixed point: accessible keys/controllers unlock gates; consuming/reset puzzles are not inferred.
  const reachedFloors = new Set([d.entrance.floorId]),
    keys = new Set(d.progress.keys),
    operable = new Set<string>();
  const seeds = new Map<string, Set<string>>();
  const entry = byId.get(d.entrance.floorId);
  const entryEndpoint = entry?.endpoints.find(e => e.roomId === d.entrance.roomId);
  if (entryEndpoint) seeds.set(d.entrance.floorId, new Set([entryEndpoint.id]));
  else if (entry) seeds.set(d.entrance.floorId, new Set(["entrance-room"]));
  const reachedRooms = new Set<string>();
  let changed = true,
    iterations = 0;
  while (changed && iterations++ < d.floors.length * 3 + 10) {
    changed = false;
    for (const floorId of [...reachedFloors]) {
      const f = byId.get(floorId)!;
      if (!f) continue;
      const startIds = seeds.get(floorId) || new Set<string>();
      const starts = f.endpoints.filter(p => startIds.has(p.id));
      if (startIds.has("entrance-room")) {
        const room = f.rooms.find(r => r.id === d.entrance.roomId)!;
        starts.push({
          id: "entrance-room",
          roomId: room.id,
          x: room.x,
          y: room.y,
          width: 1,
          height: 1,
          direction: 0,
          revealed: true
        });
      }
      const blocked = new Set<number>();
      for (const r of f.rooms)
        if (r.secret)
          for (let y = r.y; y < r.y + r.height; y++)
            for (let x = r.x; x < r.x + r.width; x++) blocked.add(y * f.settings.width + x);
      for (const e of f.entities)
        if (e.blocksMovement && !operable.has(`${f.id}/${e.id}`) && !(e.device?.key && keys.has(e.device.key)))
          for (let y = e.y; y < e.y + e.height; y++)
            for (let x = e.x; x < e.x + e.width; x++) blocked.add(y * f.settings.width + x);
      for (const e of f.entities)
        if (
          e.device &&
          ["pit", "bridge"].includes(e.device.templateId) &&
          ["triggered", "destroyed"].includes(e.device.state)
        )
          for (const p of e.device.effectCells) blocked.add(p.y * f.settings.width + p.x);
      const cells = new Set<number>();
      for (const p of starts)
        for (const k of dungeonDistances(f.settings.width, f.settings.height, f.tiles, p, blocked).keys()) cells.add(k);
      for (const r of f.rooms)
        if (
          !r.secret &&
          Array.from({ length: r.height }, (_, dy) => dy + r.y).some(y =>
            Array.from({ length: r.width }, (_, dx) => dx + r.x).some(x => cells.has(y * f.settings.width + x))
          )
        )
          reachedRooms.add(`${f.id}/${r.id}`);
      for (const e of f.entities)
        if (
          cells.has(e.y * f.settings.width + e.x) ||
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
          ].some(([dx, dy]) => cells.has((e.y + dy) * f.settings.width + e.x + dx))
        ) {
          if (e.grantsKey && !keys.has(e.grantsKey)) {
            keys.add(e.grantsKey);
            changed = true;
          }
          if (e.device && ["lever", "crystal"].includes(e.device.templateId))
            for (const t of e.device.targets)
              if (!operable.has(`${t.floorId}/${t.entityId}`)) {
                operable.add(`${t.floorId}/${t.entityId}`);
                changed = true;
              }
        }
      for (const c of d.connections) {
        const from = c.from.floorId === f.id ? c.from : c.bidirectional && c.to.floorId === f.id ? c.to : undefined;
        const to = from === c.from ? c.to : c.from;
        if (!from) continue;
        const endpoint = f.endpoints.find(p => p.id === from.endpointId)!;
        if (
          cells.has(endpoint.y * f.settings.width + endpoint.x) &&
          (!c.requiredKey || keys.has(c.requiredKey)) &&
          (!c.requiredDevice ||
            operable.has(`${c.requiredDevice.floorId}/${c.requiredDevice.entityId}`) ||
            ["disabled", "destroyed"].includes(
              byId.get(c.requiredDevice.floorId)!.entities.find(e => e.id === c.requiredDevice!.entityId)!.device!.state
            )) &&
          !seeds.get(to.floorId)?.has(to.endpointId)
        ) {
          reachedFloors.add(to.floorId);
          if (!seeds.has(to.floorId)) seeds.set(to.floorId, new Set());
          seeds.get(to.floorId)!.add(to.endpointId);
          changed = true;
        }
      }
    }
  }
  for (const f of d.floors)
    for (const r of f.rooms)
      if (!r.secret && !reachedRooms.has(`${f.id}/${r.id}`)) errors.push(`일반 경로 접근 불가: ${f.name}/${r.id}`);
  if (!reachedRooms.has(`${d.objective.floorId}/${d.objective.roomId}`))
    errors.push("목표 도달 불가: 열쇠·동력·단방향 통로를 확인하세요.");
  return errors.slice(0, 100);
}
