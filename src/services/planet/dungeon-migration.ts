import { battlePreset } from "@/data/battle-map";
import { DUNGEON_DEVICE_BY_ID } from "@/data/dungeon-devices";
import { DEFAULT_DUNGEON_SETTINGS } from "@/generators/dungeon-layout";
import type { DungeonInterior } from "@/types/dungeon-interior";
import type { DeviceTemplateId, DungeonEntity, DungeonFloor, DungeonV2 } from "@/types/dungeon-v2";
import { dungeonRoomCenter } from "@/utils/dungeon-grid";

/** No geometry/encounter reroll: numeric v1 references map to stable prefixed IDs. */
export function migrateDungeonV1(source: DungeonInterior, id: string, name: string): DungeonV2 {
  const floorId = `${id}:legacy`,
    flags = { locked: false, edited: false, origin: "migrated" as const };
  const settings = {
    ...DEFAULT_DUNGEON_SETTINGS,
    width: source.width,
    height: source.height,
    roomCount: source.rooms.length,
    themeId: source.themeId,
    monsterId: source.monsterId,
    difficulty: source.difficulty
  };
  const rooms = source.rooms.map(room => ({
    ...flags,
    id: `${floorId}:r:${room.id}`,
    legacyId: room.id,
    x: room.x,
    y: room.y,
    width: room.width,
    height: room.height,
    role:
      room.id === source.entranceRoomId
        ? ("entrance" as const)
        : room.id === source.bossRoomId
          ? ("objective" as const)
          : ("guard" as const),
    secret: room.secret,
    revealed: !room.secret,
    note: ""
  }));
  const entities: DungeonEntity[] = source.features.map(feature => {
    const mechanic =
      feature.kind === "trap" ? feature.trapId : feature.kind === "gimmick" ? feature.gimmickId : undefined;
    const template = mechanic && DUNGEON_DEVICE_BY_ID.get(mechanic as DeviceTemplateId);
    return {
      ...flags,
      id: `${floorId}:e:${feature.id}`,
      roomId: `${floorId}:r:${feature.roomId}`,
      x: feature.x,
      y: feature.y,
      assetId: template ? template.assetId : feature.kind === "chest" ? "D11" : "D08",
      rotation: 0,
      width: 1,
      height: 1,
      revealed: false,
      blocksMovement: false,
      blocksSight: false,
      movementCost: 1,
      kind: template ? "device" : "feature",
      feature: structuredClone(feature),
      ...(template
        ? {
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
            }
          }
        : {})
    };
  });
  const entrance = rooms.find(r => r.legacyId === source.entranceRoomId)!,
    objective = rooms.find(r => r.legacyId === source.bossRoomId)!;
  const entry = dungeonRoomCenter(entrance),
    exit = dungeonRoomCenter(objective);
  const free = (p: { x: number; y: number }, room: typeof entrance) => {
    if (!entities.some(e => e.x === p.x && e.y === p.y)) return p;
    for (let y = room.y; y < room.y + room.height; y++)
      for (let x = room.x; x < room.x + room.width; x++)
        if (!entities.some(e => e.x === x && e.y === y)) return { x, y };
    throw new Error("기존 방에 접속구를 둘 공간이 없습니다.");
  };
  const floor: DungeonFloor = {
    ...flags,
    id: floorId,
    name: "1F",
    elevationFt: 0,
    originX: 0,
    originY: 0,
    direction: 0,
    cellFeet: 5,
    seed: source.seed,
    layoutRevision: source.generation,
    contentRevision: 0,
    settings,
    tiles: source.tiles,
    rooms,
    entities,
    revealed: true,
    note: "",
    endpoints: [
      {
        id: `${floorId}:up`,
        roomId: entrance.id,
        ...free(entry, entrance),
        direction: 0,
        width: 1,
        height: 1,
        revealed: true
      },
      {
        id: `${floorId}:down`,
        roomId: objective.id,
        ...free(exit, objective),
        direction: 180,
        width: 1,
        height: 1,
        revealed: true
      }
    ]
  };
  return {
    version: 2,
    generatorVersion: 1,
    id,
    name,
    seed: source.seed,
    defaults: settings,
    floors: [floor],
    floorOrder: [floorId],
    connections: [],
    entrance: { floorId, roomId: entrance.id },
    objective: { floorId, roomId: objective.id, kind: "boss" },
    battleMap: structuredClone(source.battleMap || battlePreset("small")),
    progress: { round: 0, keys: [], events: [], log: [] }
  };
}
