import Alea from "alea";
import Digger from "rot-js/lib/map/digger";
import RNG from "rot-js/lib/rng";
import { ADVENTURE_MONSTER_BY_ID, ADVENTURE_THEME_BY_ID } from "@/data/adventure-sites";
import { CR_XP, DUNGEON_TRAPS, numericCr } from "@/data/dungeon-content";
import { ALL_REFERENCE_OPTIONS } from "@/data/magic-item-references";
import type {
  DungeonDifficulty,
  DungeonFeature,
  DungeonInterior,
  DungeonPoint,
  DungeonRoom
} from "@/types/dungeon-interior";
import { dungeonRoomCenter as center, dungeonDistances, hiddenDungeonTiles } from "@/utils/dungeon-grid";

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0 || 1;
}
function createFloor(seed: string, width: number, height: number): { tiles: string; rooms: DungeonRoom[] } {
  const savedState = RNG.getState();
  const savedSeed = RNG.getSeed();
  try {
    // Digger's finite wall search, not elapsed time, determines the result.
    for (let attempt = 0; attempt < 8; attempt++) {
      RNG.setSeed(hashSeed(`${seed}:${attempt}`));
      const tiles = Array<string>(width * height).fill("1");
      const map = new Digger(width, height, {
        roomWidth: [5, 9],
        roomHeight: [5, 7],
        corridorLength: [2, 7],
        dugPercentage: 0.34,
        timeLimit: Number.POSITIVE_INFINITY
      });
      map.create((x, y, value) => {
        tiles[y * width + x] = value ? "1" : "0";
      });
      const rooms = map.getRooms().map((room, id) => {
        const doors: DungeonPoint[] = [];
        room.getDoors((x, y) => {
          doors.push({ x, y });
        });
        return {
          id,
          x: room.getLeft(),
          y: room.getTop(),
          width: room.getRight() - room.getLeft() + 1,
          height: room.getBottom() - room.getTop() + 1,
          secret: false,
          doors
        };
      });
      if (rooms.length >= 8) return { tiles: tiles.join(""), rooms };
    }
    throw new Error("Unable to generate enough dungeon rooms");
  } finally {
    RNG.setSeed(savedSeed).setState(savedState);
  }
}

export function generateDungeonInterior(
  seed: string,
  themeId: string,
  monsterId: string,
  difficulty: DungeonDifficulty = "normal",
  generation = 0
): DungeonInterior {
  const theme = ADVENTURE_THEME_BY_ID.get(themeId);
  const monster = ADVENTURE_MONSTER_BY_ID.get(monsterId);
  if (
    !theme ||
    !monster ||
    !theme.monsters.includes(monsterId) ||
    !["normal", "challenging", "hell"].includes(difficulty) ||
    !Number.isSafeInteger(generation) ||
    generation < 0 ||
    seed.length > 512
  )
    throw new Error("Invalid dungeon settings");
  const baseCr = numericCr(monster.cr);
  const random = Alea(`${seed}:interior-v1:${generation}`);
  const targetCr = difficulty === "normal" ? baseCr : Math.min(30, Math.floor(baseCr) + 1 + Math.floor(random() * 2));
  const width = 58 + Math.min(18, Math.floor(baseCr / 2) * 2);
  const height = 42 + Math.min(12, Math.floor(baseCr / 3) * 2);
  const floor = createFloor(`${seed}:interior-v1:${generation}`, width, height);
  const entrance = floor.rooms[0];
  const distances = dungeonDistances(width, height, floor.tiles, center(entrance));
  if (distances.size !== floor.tiles.split("").filter(tile => tile === "0").length)
    throw new Error("Disconnected dungeon");
  const ordered = [...floor.rooms].sort(
    (a, b) => distances.get(center(b).y * width + center(b).x)! - distances.get(center(a).y * width + center(a).x)!
  );
  const bossRoom = ordered[0];
  // A secret room must never be the only route to another room, including the boss.
  for (const candidate of ordered.filter(room => room.id !== entrance.id && room.id !== bossRoom.id)) {
    candidate.secret = true;
    const visible = dungeonDistances(
      width,
      height,
      floor.tiles,
      center(entrance),
      hiddenDungeonTiles(floor.rooms, width)
    );
    if (!floor.rooms.filter(room => !room.secret).every(room => visible.has(center(room).y * width + center(room).x)))
      candidate.secret = false;
    if (floor.rooms.filter(room => room.secret).length >= 2) break;
  }
  const features: DungeonFeature[] = [];
  const occupied = new Set<string>([`${center(entrance).x},${center(entrance).y}`]);
  const pointIn = (room: DungeonRoom): DungeonPoint => {
    const choices: DungeonPoint[] = [];
    for (let y = room.y + 1; y < room.y + room.height - 1; y++)
      for (let x = room.x + 1; x < room.x + room.width - 1; x++)
        if (!occupied.has(`${x},${y}`) && !(x === room.x + 1 && y === room.y + 1)) choices.push({ x, y });
    if (!choices.length) throw new Error("Dungeon room is full");
    const point = choices[Math.floor(random() * choices.length)];
    occupied.add(`${point.x},${point.y}`);
    return point;
  };
  const add = (
    room: DungeonRoom,
    data:
      | Omit<Extract<DungeonFeature, { kind: "monster" }>, "id" | "roomId" | "x" | "y">
      | Omit<Extract<DungeonFeature, { kind: "trap" }>, "id" | "roomId" | "x" | "y">
      | Omit<Extract<DungeonFeature, { kind: "chest" }>, "id" | "roomId" | "x" | "y">
      | Omit<Extract<DungeonFeature, { kind: "gimmick" }>, "id" | "roomId" | "x" | "y">
  ) => {
    features.push({ ...data, ...pointIn(room), id: features.length, roomId: room.id });
  };
  // Elite adjustments are a homebrew target, not a recertified official monster CR.
  const multiplier = Math.round(Math.sqrt(CR_XP[String(targetCr)] / CR_XP[String(baseCr)]) * 100) / 100;
  add(bossRoom, {
    kind: "monster",
    monsterId,
    count: 1,
    boss: true,
    hpMultiplier: multiplier,
    damageMultiplier: multiplier
  });
  const dc = Math.min(22, 10 + Math.floor(targetCr / 3) + (difficulty === "hell" ? 2 : 0));
  const chest = (room: DungeonRoom) => {
    const rarity = targetCr < 5 ? "uncommon" : targetCr < 11 ? "rare" : targetCr < 17 ? "veryRare" : "legendary";
    const options = ALL_REFERENCE_OPTIONS.filter(
      option => option.rarity === rarity && option.reference.edition === monster.edition
    );
    const option = options[Math.floor(random() * options.length)];
    add(room, {
      kind: "chest",
      gold: Math.round((20 + random() * 80) * Math.max(1, targetCr) ** 2),
      ...(option ? { itemId: option.reference.id, ...(option.variant ? { variant: option.variant } : {}) } : {})
    });
  };
  chest(bossRoom);
  for (const room of floor.rooms.filter(room => room.secret)) chest(room);
  const ordinary = floor.rooms.filter(room => room.id !== entrance.id && room.id !== bossRoom.id && !room.secret);
  const themedMonsters = theme.monsters.map(id => ADVENTURE_MONSTER_BY_ID.get(id)!);
  const weaker = themedMonsters.filter(
    candidate => CR_XP[String(numericCr(candidate.cr))] <= CR_XP[String(targetCr)] * 0.6
  );
  const candidates = weaker.length
    ? weaker
    : [themedMonsters.reduce((a, b) => (numericCr(a.cr) < numericCr(b.cr) ? a : b))];
  for (const room of ordinary) {
    if (candidates.length && random() < 0.65) {
      const guard = candidates[Math.floor(random() * candidates.length)];
      const count = Math.max(
        1,
        Math.min(6, Math.floor((CR_XP[String(targetCr)] * 0.45) / CR_XP[String(numericCr(guard.cr))]))
      );
      add(room, { kind: "monster", monsterId: guard.id, count, boss: false, hpMultiplier: 1, damageMultiplier: 1 });
    }
  }
  const trapCount = difficulty === "normal" ? 1 : difficulty === "challenging" ? 2 : Math.min(7, ordinary.length);
  for (const room of ordinary.slice(0, trapCount)) {
    const trap = DUNGEON_TRAPS[Math.floor(random() * DUNGEON_TRAPS.length)];
    add(room, {
      kind: "trap",
      trapId: trap.id,
      dc,
      damageDice: Math.min(10, 1 + Math.floor(targetCr / 4) + (difficulty === "hell" ? 1 : 0))
    });
  }
  if (difficulty === "hell") {
    add(bossRoom, { kind: "gimmick", gimmickId: "ward", dc });
    add(bossRoom, { kind: "gimmick", gimmickId: "flood", dc });
    if (ordinary[0]) add(ordinary[0], { kind: "gimmick", gimmickId: "alarm", dc });
  }
  return {
    version: 1,
    seed,
    generation,
    themeId,
    monsterId,
    difficulty,
    baseCr,
    targetCr,
    width,
    height,
    ...floor,
    entranceRoomId: entrance.id,
    bossRoomId: bossRoom.id,
    features
  };
}
