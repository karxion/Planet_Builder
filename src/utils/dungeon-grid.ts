import type { DungeonPoint, DungeonRoom } from "@/types/dungeon-interior";

export const dungeonRoomCenter = (room: Pick<DungeonRoom, "x" | "y" | "width" | "height">): DungeonPoint => ({
  x: Math.floor(room.x + room.width / 2),
  y: Math.floor(room.y + room.height / 2)
});
export function dungeonDistances(
  width: number,
  height: number,
  tiles: string,
  start: DungeonPoint,
  blocked = new Set<number>()
): Map<number, number> {
  const origin = start.y * width + start.x;
  const distances = new Map<number, number>();
  if (tiles[origin] !== "0" || blocked.has(origin)) return distances;
  distances.set(origin, 0);
  const queue = [origin];
  for (let i = 0; i < queue.length; i++) {
    const tile = queue[i];
    const x = tile % width;
    const y = Math.floor(tile / width);
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ]) {
      const next = ny * width + nx;
      if (
        nx < 0 ||
        ny < 0 ||
        nx >= width ||
        ny >= height ||
        tiles[next] !== "0" ||
        blocked.has(next) ||
        distances.has(next)
      )
        continue;
      distances.set(next, distances.get(tile)! + 1);
      queue.push(next);
    }
  }
  return distances;
}
export function hiddenDungeonTiles(rooms: DungeonRoom[], width: number): Set<number> {
  const hidden = new Set<number>();
  for (const room of rooms.filter(room => room.secret)) {
    for (let y = room.y; y < room.y + room.height; y++)
      for (let x = room.x; x < room.x + room.width; x++) hidden.add(y * width + x);
    for (const door of room.doors) hidden.add(door.y * width + door.x);
  }
  return hidden;
}
