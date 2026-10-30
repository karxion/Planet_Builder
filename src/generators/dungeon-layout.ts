import Alea from "alea";
import { ADVENTURE_MONSTER_BY_ID, ADVENTURE_THEME_BY_ID } from "@/data/adventure-sites";
import { battlePreset } from "@/data/battle-map";
import { DUNGEON_ASSET_BY_ID } from "@/data/dungeon-assets";
import { DUNGEON_DEVICE_TEMPLATES, DUNGEON_LIMITS } from "@/data/dungeon-devices";
import type {
  DungeonConnection,
  DungeonEntity,
  DungeonFloor,
  DungeonFloorSettings,
  DungeonV2,
  DungeonV2Room
} from "@/types/dungeon-v2";
import { dungeonDistances, dungeonRoomCenter } from "@/utils/dungeon-grid";
import { syncDungeonDevice } from "./dungeon-devices";

export const DEFAULT_DUNGEON_SETTINGS: DungeonFloorSettings = {
  concept: "폐성채",
  structure: "fortress",
  environment: "dry",
  width: 64,
  height: 36,
  roomCount: 8,
  deviceDensity: 4,
  themeId: "goblin-stockade",
  monsterId: "goblin-2014",
  difficulty: "normal"
};
const flags = () => ({ locked: false, edited: false, origin: "generated" as const });
export function assertDungeonSettings(s: DungeonFloorSettings): void {
  const int = (n: number, min: number, max: number) => Number.isSafeInteger(n) && n >= min && n <= max;
  if (
    !s ||
    typeof s.concept !== "string" ||
    s.concept.length > 500 ||
    !int(s.width, 8, 256) ||
    !int(s.height, 8, 256) ||
    !int(s.roomCount, 1, DUNGEON_LIMITS.rooms) ||
    !int(s.deviceDensity, 0, 12) ||
    !["fortress", "cavern", "maze", "tower", "crypt"].includes(s.structure) ||
    !["dry", "flooded", "lava"].includes(s.environment) ||
    !["normal", "challenging", "hell"].includes(s.difficulty) ||
    !ADVENTURE_THEME_BY_ID.get(s.themeId)?.monsters.includes(s.monsterId) ||
    !ADVENTURE_MONSTER_BY_ID.has(s.monsterId)
  )
    throw new Error("층 설정을 확인하세요 (8~256칸, 방 1~200개).");
}
export function assertDungeonBudget(floors: DungeonFloor[]): void {
  if (
    !floors.length ||
    floors.length > DUNGEON_LIMITS.floors ||
    floors.reduce((n, f) => n + f.settings.width * f.settings.height, 0) > DUNGEON_LIMITS.cells
  )
    throw new Error("최대 100층·총 262,144칸의 생성 예산을 초과합니다.");
}
const overlaps = (a: DungeonV2Room, b: DungeonV2Room) =>
  a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y;

export function generateDungeonFloor(
  seed: string,
  id: string,
  settings: DungeonFloorSettings,
  previous?: DungeonFloor
): DungeonFloor {
  assertDungeonSettings(settings);
  if (previous?.locked) throw new Error("잠긴 층은 재생성할 수 없습니다.");
  const layoutRevision = previous ? previous.layoutRevision + 1 : 0;
  const random = Alea(`${seed}:dungeon-v2:1:${id}:layout:${layoutRevision}`);
  const { width, height } = settings;
  const tiles = Array<string>(width * height).fill("1");
  const protectedRoomIds = new Set([
    ...(previous?.endpoints.map(e => e.roomId) || []),
    ...(previous?.entities.filter(e => e.locked || e.edited).map(e => e.roomId) || [])
  ]);
  const rooms = structuredClone(previous?.rooms.filter(r => r.locked || r.edited || protectedRoomIds.has(r.id)) || []);
  const protectedTiles = new Map<number, string>();
  if (previous)
    for (const room of rooms)
      for (let y = room.y; y < room.y + room.height; y++)
        for (let x = room.x; x < room.x + room.width; x++)
          protectedTiles.set(y * width + x, previous.tiles[y * previous.settings.width + x]);
  for (const room of rooms)
    if (room.x + room.width >= width || room.y + room.height >= height)
      throw new Error("연결 접속구/보호된 방을 새 크기에 보존할 수 없습니다.");
  const aspect = settings.structure === "tower" ? 1 : settings.structure === "crypt" ? 3 : width / height;
  const cols = Math.max(1, Math.min(Math.floor((width - 2) / 6), Math.ceil(Math.sqrt(settings.roomCount * aspect))));
  const rows = Math.max(1, Math.min(Math.floor((height - 2) / 6), Math.ceil(settings.roomCount / cols)));
  const available = Array.from({ length: cols * rows }, (_, n) => n);
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  const desired = Math.min(settings.roomCount, cols * rows);
  for (const n of available) {
    if (rooms.length >= desired) break;
    const sectorWidth = Math.floor((width - 2) / cols),
      sectorHeight = Math.floor((height - 2) / rows);
    const rw = Math.max(3, sectorWidth - 2 - Math.floor(random() * Math.min(3, sectorWidth - 4)));
    const rh = Math.max(3, sectorHeight - 2 - Math.floor(random() * Math.min(3, sectorHeight - 4)));
    const candidate: DungeonV2Room = {
      ...flags(),
      id: `${id}:r:${layoutRevision}:${n}`,
      x: 1 + (n % cols) * sectorWidth,
      y: 1 + Math.floor(n / cols) * sectorHeight,
      width: rw,
      height: rh,
      role: rooms.length ? (["guard", "puzzle", "reward", "rest"] as const)[rooms.length % 4] : "entrance",
      secret: false,
      revealed: true,
      note: ""
    };
    if (!rooms.some(r => overlaps(r, candidate))) rooms.push(candidate);
  }
  if (!rooms.length) throw new Error("요청한 공간에 방을 배치할 수 없습니다.");
  const carve = (x: number, y: number) => {
    if (x > 0 && y > 0 && x < width - 1 && y < height - 1)
      tiles[y * width + x] = protectedTiles.get(y * width + x) || "0";
  };
  for (const room of rooms)
    for (let y = room.y; y < room.y + room.height; y++) for (let x = room.x; x < room.x + room.width; x++) carve(x, y);
  const dig = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    let { x, y } = a;
    const horizontalFirst = settings.structure === "maze" ? random() > 0.5 : true;
    const horizontal = () => {
      while (x !== b.x) {
        carve(x, y);
        carve(x, y + 1);
        x += Math.sign(b.x - x);
      }
    };
    const vertical = () => {
      while (y !== b.y) {
        carve(x, y);
        carve(x + 1, y);
        y += Math.sign(b.y - y);
      }
    };
    if (horizontalFirst) {
      horizontal();
      vertical();
    } else {
      vertical();
      horizontal();
    }
    carve(x, y);
  };
  for (let i = 1; i < rooms.length; i++) dig(dungeonRoomCenter(rooms[i - 1]), dungeonRoomCenter(rooms[i]));
  if (rooms.length > 2) dig(dungeonRoomCenter(rooms[0]), dungeonRoomCenter(rooms[rooms.length - 1]));
  if (settings.structure === "cavern")
    for (const room of rooms) {
      for (let y = room.y - 1; y <= room.y + room.height; y++)
        for (let x = room.x - 1; x <= room.x + room.width; x++) if (random() > 0.6) carve(x, y);
    }
  const endpoints = structuredClone(previous?.endpoints || []);
  if (!previous) {
    const first = rooms[0],
      last = rooms[rooms.length - 1];
    endpoints.push({
      id: `${id}:up`,
      roomId: first.id,
      x: first.x,
      y: first.y,
      direction: 0,
      width: 1,
      height: 1,
      revealed: true
    });
    endpoints.push({
      id: `${id}:down`,
      roomId: last.id,
      x: last.x + last.width - 1,
      y: last.y + last.height - 1,
      direction: 180,
      width: 1,
      height: 1,
      revealed: true
    });
  }
  const floor: DungeonFloor = {
    ...flags(),
    id,
    name: previous?.name || id,
    elevationFt: previous?.elevationFt || 0,
    originX: previous?.originX || 0,
    originY: previous?.originY || 0,
    direction: previous?.direction || 0,
    cellFeet: previous?.cellFeet || 5,
    seed,
    layoutRevision,
    contentRevision: previous?.contentRevision || 0,
    settings: { ...settings },
    tiles: tiles.join(""),
    rooms,
    endpoints,
    entities: structuredClone(
      previous?.entities.filter(
        e => e.locked || e.edited || rooms.some(r => r.id === e.roomId && (r.locked || r.edited))
      ) || []
    ),
    revealed: previous?.revealed ?? true,
    note: previous?.note || ""
  };
  floor.entities = populateDungeonFloor(floor, true);
  return floor;
}

export function populateDungeonFloor(floor: DungeonFloor, keepManual = true): DungeonEntity[] {
  const random = Alea(`${floor.seed}:dungeon-v2:1:${floor.id}:contents:${floor.contentRevision}`);
  const entities = structuredClone(
    keepManual
      ? floor.entities.filter(
          e => e.locked || e.edited || floor.rooms.some(r => r.id === e.roomId && (r.locked || r.edited))
        )
      : []
  );
  const occupied = new Set<string>();
  for (const e of [...entities, ...floor.endpoints])
    for (let y = e.y; y < e.y + e.height; y++) for (let x = e.x; x < e.x + e.width; x++) occupied.add(`${x},${y}`);
  const place = (
    room: DungeonV2Room,
    assetId: `D${string}`,
    kind: DungeonEntity["kind"],
    extra: Partial<DungeonEntity> = {}
  ) => {
    const definition = DUNGEON_ASSET_BY_ID.get(assetId)!;
    const w = kind === "feature" ? 1 : definition.width,
      h = kind === "feature" ? 1 : definition.height;
    const candidates: { x: number; y: number }[] = [];
    for (let y = room.y; y <= room.y + room.height - h; y++)
      for (let x = room.x; x <= room.x + room.width - w; x++) {
        let free = true;
        for (let cy = y; cy < y + h; cy++)
          for (let cx = x; cx < x + w; cx++)
            if (occupied.has(`${cx},${cy}`) || floor.tiles[cy * floor.settings.width + cx] !== "0") free = false;
        if (free) candidates.push({ x, y });
      }
    if (!candidates.length) return;
    const p = candidates[Math.floor(random() * candidates.length)];
    for (let y = p.y; y < p.y + h; y++) for (let x = p.x; x < p.x + w; x++) occupied.add(`${x},${y}`);
    entities.push({
      ...flags(),
      id: `${floor.id}:e:${floor.layoutRevision}:${floor.contentRevision}:${room.id}:${entities.length}`,
      roomId: room.id,
      ...p,
      assetId,
      rotation: 0,
      width: w,
      height: h,
      revealed: kind === "prop",
      blocksMovement: kind === "prop" && definition.blocksMovement,
      blocksSight: kind === "prop" && definition.blocksSight,
      movementCost: 1,
      kind,
      ...extra
    });
    const added = entities.at(-1)!;
    syncDungeonDevice(added);
    const blocked = new Set<number>();
    for (const e of entities.filter(e => e.blocksMovement))
      for (let y = e.y; y < e.y + e.height; y++)
        for (let x = e.x; x < e.x + e.width; x++) blocked.add(y * floor.settings.width + x);
    const reachable = dungeonDistances(
      floor.settings.width,
      floor.settings.height,
      floor.tiles,
      floor.endpoints[0] || { x: floor.rooms[0].x, y: floor.rooms[0].y },
      blocked
    );
    if (
      !floor.endpoints.every(e => reachable.has(e.y * floor.settings.width + e.x)) ||
      !floor.rooms.every(r =>
        Array.from({ length: r.height }, (_, dy) => dy + r.y).some(y =>
          Array.from({ length: r.width }, (_, dx) => dx + r.x).some(x => reachable.has(y * floor.settings.width + x))
        )
      )
    ) {
      entities.pop();
      for (let y = p.y; y < p.y + h; y++) for (let x = p.x; x < p.x + w; x++) occupied.delete(`${x},${y}`);
    }
  };
  for (const [i, room] of floor.rooms.entries()) {
    if (room.locked || room.edited) continue;
    const asset =
      floor.settings.environment === "flooded"
        ? "D13"
        : floor.settings.structure === "crypt"
          ? "D14"
          : (["D08", "D11", "D15", "D16"][i % 4] as `D${string}`);
    place(room, asset, "prop");
    if (i && random() > 0.4)
      place(room, "D08", "feature", {
        feature: {
          id: i,
          roomId: i,
          x: 0,
          y: 0,
          kind: "monster",
          monsterId: floor.settings.monsterId,
          count: floor.settings.difficulty === "hell" ? 3 : floor.settings.difficulty === "challenging" ? 2 : 1,
          boss: false,
          hpMultiplier: 1,
          damageMultiplier: 1
        },
        revealed: false
      });
  }
  for (let i = 0; i < floor.settings.deviceDensity; i++) {
    const room = floor.rooms[i % floor.rooms.length];
    if (room.locked || room.edited) continue;
    const template = DUNGEON_DEVICE_TEMPLATES[(i + Math.floor(random() * 12)) % 12];
    place(room, template.assetId, "device", {
      blocksMovement: template.blocksMovement,
      blocksSight: template.blocksSight,
      device: {
        templateId: template.id,
        state: "armed",
        open: false,
        powered: true,
        cooldownUntil: 0,
        lastEventId: "",
        targets: [],
        counter: template.counter,
        effectCells: []
      },
      revealed: false
    });
  }
  // A lever/cystal opens an existing gate. No progression gate is automatically locked behind its own key.
  const controller = entities.find(e => e.device && ["lever", "crystal"].includes(e.device.templateId));
  const gate = entities.find(e => e.device && ["ward", "seal", "portcullis"].includes(e.device.templateId));
  if (
    controller?.device &&
    gate &&
    !controller.locked &&
    !controller.edited &&
    !floor.rooms.some(r => r.id === controller.roomId && (r.locked || r.edited)) &&
    !controller.device.targets.length
  )
    controller.device.targets = [{ floorId: floor.id, entityId: gate.id }];
  for (const e of entities)
    if (
      e.device?.templateId === "alarm" &&
      !e.edited &&
      !e.locked &&
      !floor.rooms.some(r => r.id === e.roomId && (r.locked || r.edited))
    ) {
      e.device.guardIds = entities
        .filter(e => e.feature?.kind === "monster")
        .slice(0, 2)
        .map(e => e.id);
      e.device.arrivedGuardIds = [];
    }
  return entities;
}
export function createDungeonV2(seed: string, id: string, count = 3, settings = DEFAULT_DUNGEON_SETTINGS): DungeonV2 {
  assertDungeonSettings(settings);
  if (
    !Number.isSafeInteger(count) ||
    count < 1 ||
    count > DUNGEON_LIMITS.floors ||
    count * settings.width * settings.height > DUNGEON_LIMITS.cells
  )
    throw new Error("층 수/전체 생성 예산을 확인하세요.");
  const floors = Array.from({ length: count }, (_, n) => {
    const f = generateDungeonFloor(seed, `${id}:f:${n}`, settings);
    f.name = n === 0 ? "1F" : `B${n}`;
    f.elevationFt = -15 * n;
    return f;
  });
  const connections = floors.slice(1).map((floor, n) => makeDungeonConnection(floors[n], floor, `${id}:c:${n}`));
  return {
    version: 2,
    generatorVersion: 1,
    id,
    name: settings.concept,
    seed,
    defaults: { ...settings },
    floorOrder: floors.map(f => f.id),
    floors,
    connections,
    entrance: { floorId: floors[0].id, roomId: floors[0].rooms[0].id },
    objective: { floorId: floors[count - 1].id, roomId: floors[count - 1].rooms.at(-1)!.id, kind: "relic" },
    battleMap: battlePreset("medium"),
    progress: { round: 0, keys: [], events: [], log: [] }
  };
}
export function makeDungeonConnection(from: DungeonFloor, to: DungeonFloor, id: string): DungeonConnection {
  return {
    id,
    from: { floorId: from.id, endpointId: from.endpoints.at(-1)!.id },
    to: { floorId: to.id, endpointId: to.endpoints[0].id },
    kind: "stairs",
    bidirectional: true,
    revealed: true
  };
}
export function insertDungeonFloor(
  source: DungeonV2,
  afterId: string,
  newId: string,
  settings: DungeonFloorSettings
): DungeonV2 {
  if (source.floors.some(f => f.id === newId)) throw new Error("중복 층 ID");
  const d = structuredClone(source),
    index = d.floorOrder.indexOf(afterId),
    previous = d.floors.find(f => f.id === afterId);
  if (index < 0 || !previous) throw new Error("기준 층 없음");
  const nextId = d.floorOrder[index + 1],
    next = d.floors.find(f => f.id === nextId);
  if (
    next &&
    d.connections.some(
      c =>
        ((c.from.floorId === afterId && c.to.floorId === nextId) ||
          (c.to.floorId === afterId && c.from.floorId === nextId)) &&
        (c.kind !== "stairs" || c.requiredDevice || c.requiredKey)
    )
  )
    throw new Error("특수 연결은 먼저 수동으로 재연결하세요.");
  const floor = generateDungeonFloor(d.seed, newId, settings);
  floor.elevationFt = next ? (previous.elevationFt + next.elevationFt) / 2 : previous.elevationFt - 15;
  floor.name = `${previous.name}+`;
  d.floors.push(floor);
  d.floorOrder.splice(index + 1, 0, floor.id);
  assertDungeonBudget(d.floors);
  const crossing = d.connections.filter(
    c =>
      (c.from.floorId === afterId && c.to.floorId === nextId) || (c.to.floorId === afterId && c.from.floorId === nextId)
  );
  d.connections = d.connections.filter(c => !crossing.includes(c));
  d.connections.push(makeDungeonConnection(previous, floor, `${newId}:in`));
  if (next) d.connections.push(makeDungeonConnection(floor, next, `${newId}:out`));
  return d;
}
export function regenerateDungeonFloor(
  source: DungeonV2,
  id: string,
  settings: DungeonFloorSettings,
  contentsOnly = false
): DungeonV2 {
  const d = structuredClone(source),
    i = d.floors.findIndex(f => f.id === id);
  if (i < 0 || d.floors[i].locked) throw new Error("층 없음 또는 잠긴 층");
  const before = d.floors[i];
  const required = new Set<string>();
  for (const e of before.entities) for (const guard of e.device?.guardIds || []) required.add(guard);
  for (const f of d.floors)
    for (const e of f.entities)
      for (const ref of e.device?.targets || []) if (ref.floorId === id) required.add(ref.entityId);
  for (const c of d.connections) if (c.requiredDevice?.floorId === id) required.add(c.requiredDevice.entityId);
  const savedLocks = new Map(before.entities.map(e => [e.id, e.locked]));
  for (const e of before.entities) if (required.has(e.id)) e.locked = true;
  if (contentsOnly) {
    before.contentRevision++;
    before.entities = populateDungeonFloor(before);
  } else {
    const protectedIds = new Set([d.entrance, d.objective].filter(r => r.floorId === id).map(r => r.roomId));
    const preserved = structuredClone(before);
    for (const r of preserved.rooms) if (protectedIds.has(r.id)) r.locked = true;
    d.floors[i] = generateDungeonFloor(d.seed, id, settings, preserved);
    for (const r of d.floors[i].rooms)
      if (protectedIds.has(r.id)) r.locked = before.rooms.find(old => old.id === r.id)!.locked;
  }
  for (const e of d.floors[i].entities) if (required.has(e.id)) e.locked = savedLocks.get(e.id)!;
  assertDungeonBudget(d.floors);
  return d;
}
