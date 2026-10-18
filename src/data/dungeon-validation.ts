import type { DungeonInterior } from "@/types/dungeon-interior";
import { dungeonDistances, dungeonRoomCenter, hiddenDungeonTiles } from "@/utils/dungeon-grid";
import { ADVENTURE_MONSTER_BY_ID, ADVENTURE_THEME_BY_ID } from "./adventure-sites";
import { CR_XP, DUNGEON_GIMMICKS, DUNGEON_TRAPS, numericCr } from "./dungeon-content";
import { ALL_REFERENCE_OPTIONS, MAGIC_ITEM_BY_ID } from "./magic-item-references";

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const integer = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= max;
export function isDungeonInterior(value: unknown): value is DungeonInterior {
  if (
    !record(value) ||
    value.version !== 1 ||
    typeof value.seed !== "string" ||
    value.seed.length > 512 ||
    !integer(value.generation, 0, Number.MAX_SAFE_INTEGER) ||
    typeof value.themeId !== "string" ||
    typeof value.monsterId !== "string"
  )
    return false;
  const theme = ADVENTURE_THEME_BY_ID.get(value.themeId);
  const monster = ADVENTURE_MONSTER_BY_ID.get(value.monsterId);
  if (
    !theme ||
    !monster ||
    !theme.monsters.includes(value.monsterId) ||
    value.baseCr !== numericCr(monster.cr) ||
    typeof value.targetCr !== "number" ||
    !CR_XP[String(value.targetCr)] ||
    typeof value.difficulty !== "string" ||
    !["normal", "challenging", "hell"].includes(value.difficulty)
  )
    return false;
  if (
    value.difficulty === "normal"
      ? value.targetCr !== value.baseCr
      : ![
          Math.min(30, Math.floor(value.baseCr as number) + 1),
          Math.min(30, Math.floor(value.baseCr as number) + 2)
        ].includes(value.targetCr)
  )
    return false;
  if (
    !integer(value.width, 20, 100) ||
    !integer(value.height, 20, 80) ||
    typeof value.tiles !== "string" ||
    value.tiles.length !== value.width * value.height ||
    /[^01]/.test(value.tiles) ||
    !Array.isArray(value.rooms) ||
    value.rooms.length < 2 ||
    value.rooms.length > 100 ||
    !Array.isArray(value.features) ||
    value.features.length > 500
  )
    return false;
  const { width, height, tiles } = value;
  const ids = new Set<number>();
  const roomTiles = new Set<number>();
  for (const room of value.rooms) {
    if (
      !record(room) ||
      !integer(room.id, 0, 10000) ||
      ids.has(room.id) ||
      !integer(room.x, 1, width - 2) ||
      !integer(room.y, 1, height - 2) ||
      !integer(room.width, 3, 20) ||
      !integer(room.height, 3, 20) ||
      room.x + room.width >= width ||
      room.y + room.height >= height ||
      typeof room.secret !== "boolean" ||
      !Array.isArray(room.doors) ||
      room.doors.length > 40
    )
      return false;
    ids.add(room.id);
    for (let y: number = room.y; y < room.y + room.height; y++)
      for (let x: number = room.x; x < room.x + room.width; x++) {
        const index = y * width + x;
        if (tiles[index] !== "0" || roomTiles.has(index)) return false;
        roomTiles.add(index);
      }
    for (const door of room.doors) {
      if (
        !record(door) ||
        !integer(door.x, room.x - 1, room.x + room.width) ||
        !integer(door.y, room.y - 1, room.y + room.height) ||
        tiles[door.y * width + door.x] !== "0" ||
        (door.x >= room.x && door.x < room.x + room.width && door.y >= room.y && door.y < room.y + room.height)
      )
        return false;
    }
  }
  const interior = value as unknown as DungeonInterior;
  const entrance = interior.rooms.find(room => room.id === interior.entranceRoomId);
  const boss = interior.rooms.find(room => room.id === interior.bossRoomId);
  if (!entrance || !boss || entrance.id === boss.id || entrance.secret || boss.secret) return false;
  const distances = dungeonDistances(width, height, tiles, dungeonRoomCenter(entrance));
  if (distances.size !== tiles.split("").filter(tile => tile === "0").length) return false;
  const visible = dungeonDistances(
    width,
    height,
    tiles,
    dungeonRoomCenter(entrance),
    hiddenDungeonTiles(interior.rooms, width)
  );
  if (
    !interior.rooms
      .filter(room => !room.secret)
      .every(room => visible.has(dungeonRoomCenter(room).y * width + dungeonRoomCenter(room).x))
  )
    return false;
  const positions = new Set<string>();
  const bossMultiplier =
    Math.round(Math.sqrt(CR_XP[String(interior.targetCr)] / CR_XP[String(interior.baseCr)]) * 100) / 100;
  ids.clear();
  for (const feature of interior.features) {
    if (
      !record(feature) ||
      !integer(feature.id, 0, 10000) ||
      ids.has(feature.id) ||
      !integer(feature.x, 1, width - 2) ||
      !integer(feature.y, 1, height - 2)
    )
      return false;
    const room = interior.rooms.find(room => room.id === feature.roomId);
    if (
      !room ||
      room.id === entrance.id ||
      feature.x < room.x ||
      feature.x >= room.x + room.width ||
      feature.y < room.y ||
      feature.y >= room.y + room.height ||
      positions.has(`${feature.x},${feature.y}`)
    )
      return false;
    ids.add(feature.id);
    positions.add(`${feature.x},${feature.y}`);
    if (feature.kind === "monster") {
      if (
        !theme.monsters.includes(feature.monsterId) ||
        !integer(feature.count, 1, 6) ||
        typeof feature.boss !== "boolean" ||
        typeof feature.hpMultiplier !== "number" ||
        !Number.isFinite(feature.hpMultiplier) ||
        feature.hpMultiplier < 1 ||
        feature.hpMultiplier > 10 ||
        feature.damageMultiplier !== feature.hpMultiplier ||
        feature.hpMultiplier !== (feature.boss ? bossMultiplier : 1) ||
        (feature.boss && (feature.monsterId !== interior.monsterId || feature.count !== 1))
      )
        return false;
    } else if (feature.kind === "trap") {
      if (
        !DUNGEON_TRAPS.some(trap => trap.id === feature.trapId) ||
        !integer(feature.dc, 10, 22) ||
        !integer(feature.damageDice, 1, 10)
      )
        return false;
    } else if (feature.kind === "gimmick") {
      if (!DUNGEON_GIMMICKS.some(gimmick => gimmick.id === feature.gimmickId) || !integer(feature.dc, 10, 22))
        return false;
    } else if (feature.kind === "chest") {
      if (
        !integer(feature.gold, 0, 1000000) ||
        (feature.itemId !== undefined && !MAGIC_ITEM_BY_ID.has(feature.itemId)) ||
        (feature.variant !== undefined && (typeof feature.variant !== "string" || feature.variant.length > 200)) ||
        (feature.itemId !== undefined &&
          !ALL_REFERENCE_OPTIONS.some(
            option =>
              option.reference.id === feature.itemId &&
              option.reference.edition === monster.edition &&
              option.variant === feature.variant
          ))
      )
        return false;
    } else return false;
  }
  const bosses = interior.features.filter(feature => feature.kind === "monster" && feature.boss);
  return bosses.length === 1 && bosses[0].roomId === boss.id;
}

export function cleanDungeonInterior(marker: { interior?: unknown }): void {
  if (marker.interior !== undefined && !isDungeonInterior(marker.interior)) delete marker.interior;
}
