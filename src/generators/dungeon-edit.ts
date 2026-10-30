import { DUNGEON_ASSET_BY_ID } from "@/data/dungeon-assets";
import type { DungeonAssetId, DungeonEntity, DungeonV2 } from "@/types/dungeon-v2";
import { dungeonRoomCenter } from "@/utils/dungeon-grid";
import { syncDungeonDevice } from "./dungeon-devices";

export function addDungeonEntity(
  source: DungeonV2,
  floorId: string,
  roomId: string,
  assetId: DungeonAssetId,
  x: number,
  y: number,
  rotation: 0 | 90 | 180 | 270,
  id: string
): DungeonV2 {
  const d = structuredClone(source),
    f = d.floors.find(f => f.id === floorId),
    room = f?.rooms.find(r => r.id === roomId),
    asset = DUNGEON_ASSET_BY_ID.get(assetId);
  if (!f || !room || !asset || f.locked || room.locked) throw new Error("잠기지 않은 층/방을 선택하세요.");
  const rotated = rotation === 90 || rotation === 270,
    width = rotated ? asset.height : asset.width,
    height = rotated ? asset.width : asset.height;
  if (
    !Number.isSafeInteger(x) ||
    !Number.isSafeInteger(y) ||
    x < room.x ||
    y < room.y ||
    x + width > room.x + room.width ||
    y + height > room.y + room.height
  )
    throw new Error("부품 전체가 선택한 방 안에 들어가야 합니다.");
  const points = new Set<string>();
  for (let cy = y; cy < y + height; cy++)
    for (let cx = x; cx < x + width; cx++) {
      if (f.tiles[cy * f.settings.width + cx] !== "0") throw new Error("부품이 벽과 겹칩니다.");
      points.add(`${cx},${cy}`);
    }
  if (
    [...f.entities, ...f.endpoints].some(e =>
      Array.from({ length: e.height }, (_, dy) => dy + e.y).some(cy =>
        Array.from({ length: e.width }, (_, dx) => dx + e.x).some(cx => points.has(`${cx},${cy}`))
      )
    )
  )
    throw new Error("다른 부품/접속구와 겹칩니다.");
  const entity: DungeonEntity = {
    id,
    roomId,
    x,
    y,
    width,
    height,
    assetId,
    rotation,
    kind: "prop",
    revealed: true,
    blocksMovement: asset.blocksMovement,
    blocksSight: asset.blocksSight,
    movementCost: 1,
    locked: false,
    edited: true,
    origin: "manual"
  };
  f.entities.push(entity);
  return d;
}
export function addDungeonRegion(
  source: DungeonV2,
  floorId: string,
  roomId: string,
  x: number,
  y: number,
  width: number,
  height: number,
  id: string
): DungeonV2 {
  const d = structuredClone(source),
    f = d.floors.find(f => f.id === floorId),
    from = f?.rooms.find(r => r.id === roomId);
  if (
    !f ||
    !from ||
    f.locked ||
    ![x, y, width, height].every(Number.isSafeInteger) ||
    x < 1 ||
    y < 1 ||
    width < 3 ||
    height < 3 ||
    x + width >= f.settings.width ||
    y + height >= f.settings.height
  )
    throw new Error("층 안쪽의 빈 영역을 3×3칸 이상으로 선택하세요.");
  for (let cy = y; cy < y + height; cy++)
    for (let cx = x; cx < x + width; cx++)
      if (f.tiles[cy * f.settings.width + cx] !== "1") throw new Error("기존 지형과 겹치지 않는 빈 영역을 선택하세요.");
  const room = {
    id,
    x,
    y,
    width,
    height,
    role: "rest" as const,
    secret: false,
    revealed: true,
    note: "",
    locked: false,
    edited: true,
    origin: "manual" as const
  };
  const tiles = f.tiles.split("");
  for (let cy = y; cy < y + height; cy++)
    for (let cx = x; cx < x + width; cx++) tiles[cy * f.settings.width + cx] = "0";
  const start = dungeonRoomCenter(from),
    end = dungeonRoomCenter(room);
  let cx = start.x,
    cy = start.y;
  while (cx !== end.x) {
    tiles[cy * f.settings.width + cx] = "0";
    cx += Math.sign(end.x - cx);
  }
  while (cy !== end.y) {
    tiles[cy * f.settings.width + cx] = "0";
    cy += Math.sign(end.y - cy);
  }
  tiles[cy * f.settings.width + cx] = "0";
  f.tiles = tiles.join("");
  f.rooms.push(room);
  return d;
}
export function regenerateDungeonRoom(source: DungeonV2, floorId: string, roomId: string): DungeonV2 {
  const d = structuredClone(source),
    f = d.floors.find(f => f.id === floorId),
    r = f?.rooms.find(r => r.id === roomId);
  if (!f || !r || f.locked || r.locked || r.edited)
    throw new Error("잠김/수동 방은 먼저 잠금을 해제하고 자동 편집을 허용하세요.");
  const protectedCells = new Set<number>();
  for (const e of [...f.endpoints, ...f.entities])
    for (let y = e.y; y < e.y + e.height; y++)
      for (let x = e.x; x < e.x + e.width; x++) protectedCells.add(y * f.settings.width + x);
  const tiles = f.tiles.split(""),
    revision = (r.revision || 0) + 1;
  r.revision = revision;
  // Boundary/doors/IDs and all entity footprints stay unchanged. Interior isolated pillars never seal a corridor.
  for (let y = r.y + 2; y < r.y + r.height - 2; y++)
    for (let x = r.x + 2; x < r.x + r.width - 2; x++) {
      const k = y * f.settings.width + x;
      if (protectedCells.has(k)) continue;
      tiles[k] = (x - r.x) % 3 === (revision % 2) + 1 && (y - r.y) % 3 === 1 ? "1" : "0";
    }
  f.tiles = tiles.join("");
  return d;
}
export function deleteDungeonFloor(source: DungeonV2, id: string): DungeonV2 {
  if (source.floors.length === 1 || source.entrance.floorId === id || source.objective.floorId === id)
    throw new Error("마지막 층 또는 입구/목표 층은 먼저 참조를 옮겨야 삭제할 수 있습니다.");
  const f = source.floors.find(f => f.id === id);
  if (!f || f.locked) throw new Error("잠긴 층은 삭제할 수 없습니다.");
  if (
    source.floors.some(
      other => other.id !== id && other.entities.some(e => e.device?.targets.some(t => t.floorId === id))
    )
  )
    throw new Error("다른 층의 연동 장치 참조를 먼저 수정하세요.");
  if (
    source.connections.some(
      c => (c.from.floorId === id || c.to.floorId === id) && (c.requiredKey || c.requiredDevice || c.kind !== "stairs")
    )
  )
    throw new Error("특수 연결을 먼저 수동으로 재연결하세요.");
  const d = structuredClone(source);
  d.floors = d.floors.filter(f => f.id !== id);
  d.floorOrder = d.floorOrder.filter(f => f !== id);
  d.connections = d.connections.filter(c => c.from.floorId !== id && c.to.floorId !== id);
  return d;
}
export function duplicateDungeon(source: DungeonV2, newId: string, seed: string, includeProgress = false): DungeonV2 {
  const d = structuredClone(source),
    map = new Map<string, string>([[d.id, newId]]);
  for (const f of d.floors) {
    map.set(f.id, `${newId}:f:${map.size}`);
    for (const r of f.rooms) map.set(r.id, `${newId}:r:${map.size}`);
    for (const e of [...f.entities, ...f.endpoints]) map.set(e.id, `${newId}:e:${map.size}`);
  }
  for (const c of d.connections) map.set(c.id, `${newId}:c:${map.size}`);
  const result = d;
  const remap = (id: string) => map.get(id) || id;
  result.id = newId;
  result.seed = seed;
  result.floorOrder = result.floorOrder.map(remap);
  for (const f of result.floors) {
    f.id = remap(f.id);
    for (const r of f.rooms) r.id = remap(r.id);
    for (const e of [...f.endpoints, ...f.entities]) {
      e.id = remap(e.id);
      e.roomId = remap(e.roomId);
    }
    for (const e of f.entities) {
      if (e.device) {
        e.device.guardIds = e.device.guardIds?.map(remap);
        e.device.arrivedGuardIds = e.device.arrivedGuardIds?.map(remap);
      }
      if (e.device)
        for (const t of e.device.targets) {
          t.floorId = remap(t.floorId);
          t.entityId = remap(t.entityId);
        }
    }
  }
  for (const ref of [result.entrance, result.objective]) {
    ref.floorId = remap(ref.floorId);
    ref.roomId = remap(ref.roomId);
  }
  for (const c of result.connections) {
    c.id = remap(c.id);
    for (const ref of [c.from, c.to]) {
      ref.floorId = remap(ref.floorId);
      ref.endpointId = remap(ref.endpointId);
    }
    if (c.requiredDevice) {
      c.requiredDevice.floorId = remap(c.requiredDevice.floorId);
      c.requiredDevice.entityId = remap(c.requiredDevice.entityId);
    }
  }
  if (!includeProgress) {
    result.progress = { round: 0, keys: [], events: [], log: [] };
    for (const f of result.floors)
      for (const e of f.entities)
        if (e.device) {
          e.device.state = "armed";
          e.device.open = false;
          e.device.powered = true;
          e.device.cooldownUntil = 0;
          e.device.lastEventId = "";
          e.device.arrivedGuardIds = [];
          syncDungeonDevice(e);
        }
  }
  return result;
}
