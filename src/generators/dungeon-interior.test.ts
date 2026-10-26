import Digger from "rot-js/lib/map/digger";
import RNG from "rot-js/lib/rng";
import { describe, expect, it, vi } from "vitest";
import { ADVENTURE_THEMES } from "@/data/adventure-sites";
import { CR_XP } from "@/data/dungeon-content";
import { cleanDungeonInterior, isDungeonInterior } from "@/data/dungeon-validation";
import { MAGIC_ITEM_BY_ID } from "@/data/magic-item-references";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { dungeonDistances, dungeonRoomCenter, hiddenDungeonTiles } from "@/utils/dungeon-grid";
import { generateDungeonInterior } from "./dungeon-interior";

const generate = (difficulty: "normal" | "challenging" | "hell" = "normal", seed = "dungeon-test") =>
  generateDungeonInterior(seed, "wizard-tower", "archmage", difficulty);
describe("Dungeon interiors", () => {
  it("preserves generated layouts, difficulty and rewards through a compressed FPB project", async () => {
    const dungeon = generate("hell");
    const rows = Array<string>(36).fill("");
    rows[0] = "1.135.0|license|2026-10-18|123|960|540|1";
    rows[5] = '<svg id="map"></svg>';
    rows[35] = JSON.stringify([{ i: 7, type: "dungeons", interior: dungeon }]);
    const project = createPlanetProject({
      mapPayload: rows.join("\r\n"),
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135.0",
      upstreamCommit: "03a1050"
    });
    const decoded = await decodePlanetProject(await encodePlanetProject(project));
    const marker = JSON.parse(decoded.mapPayload.split("\r\n")[35])[0];
    expect(marker.interior).toEqual(dungeon);
    expect(isDungeonInterior(marker.interior)).toBe(true);
  });
  it("is deterministic, serializable and isolates rot-js RNG state and seed", () => {
    RNG.setSeed(98472);
    const state = RNG.getState();
    const dungeon = generate();
    expect(generate()).toEqual(dungeon);
    expect(JSON.parse(JSON.stringify(dungeon))).toEqual(dungeon);
    expect(isDungeonInterior(dungeon)).toBe(true);
    expect(RNG.getSeed()).toBe(98472);
    expect(RNG.getState()).toEqual(state);
  });
  it("restores RNG even when the library throws", () => {
    RNG.setSeed(119);
    const state = RNG.getState();
    const spy = vi.spyOn(Digger.prototype, "create").mockImplementationOnce(() => {
      throw new Error("failed");
    });
    try {
      expect(() => generate()).toThrow("failed");
    } finally {
      spy.mockRestore();
    }
    expect(RNG.getSeed()).toBe(119);
    expect(RNG.getState()).toEqual(state);
  });
  it.each(ADVENTURE_THEMES)("generates connected rooms and reachable noncritical secret rooms: $id", theme => {
    for (const seed of ["a", "b", "c"]) {
      const dungeon = generateDungeonInterior(seed, theme.id, theme.monsters[0], "hell");
      expect(isDungeonInterior(dungeon), `${theme.id}:${seed}`).toBe(true);
      expect(dungeon.rooms.length).toBeGreaterThanOrEqual(8);
      expect(dungeon.rooms.some(room => room.secret)).toBe(true);
      const start = dungeonRoomCenter(dungeon.rooms.find(room => room.id === dungeon.entranceRoomId)!);
      const connected = dungeonDistances(dungeon.width, dungeon.height, dungeon.tiles, start);
      expect(connected.size).toBe(dungeon.tiles.split("").filter(tile => tile === "0").length);
      const visible = dungeonDistances(
        dungeon.width,
        dungeon.height,
        dungeon.tiles,
        start,
        hiddenDungeonTiles(dungeon.rooms, dungeon.width)
      );
      for (const room of dungeon.rooms.filter(room => !room.secret)) {
        const point = dungeonRoomCenter(room);
        expect(visible.has(point.y * dungeon.width + point.x)).toBe(true);
      }
    }
  });
  it("preserves geometry across difficulties and adds hell mechanics without another CR inflation", () => {
    const normal = generate();
    const challenge = generate("challenging");
    const hell = generate("hell");
    expect(normal.targetCr).toBe(normal.baseCr);
    expect([1, 2]).toContain(challenge.targetCr - challenge.baseCr);
    expect(hell.targetCr).toBe(challenge.targetCr);
    expect(hell.tiles).toBe(normal.tiles);
    expect(hell.rooms).toEqual(normal.rooms);
    expect(challenge.rooms).toEqual(normal.rooms);
    expect(normal.features.filter(feature => feature.kind === "gimmick")).toHaveLength(0);
    expect(hell.features.filter(feature => feature.kind === "gimmick")).toHaveLength(3);
    expect(hell.features.filter(feature => feature.kind === "trap").length).toBeGreaterThan(
      challenge.features.filter(feature => feature.kind === "trap").length
    );
    const boss = challenge.features.find(feature => feature.kind === "monster" && feature.boss)!;
    expect(boss.kind === "monster" && boss.hpMultiplier).toBeGreaterThan(1);
  });
  it("keeps fractional targets supported and caps CR at 30", () => {
    const low = generateDungeonInterior("low", "goblin-stockade", "goblin-2014", "challenging");
    expect(low.targetCr - low.baseCr).toBeLessThanOrEqual(2);
    expect(CR_XP[String(low.targetCr)]).toBeDefined();
    const high = generateDungeonInterior("high", "monster-labyrinth", "tarrasque", "hell");
    expect(high.targetCr).toBe(30);
    expect(isDungeonInterior(high)).toBe(true);
  });
  it("places distinct features on room floors, preserves a safe entrance and rewards secret rooms", () => {
    const dungeon = generate("hell");
    expect(new Set(dungeon.features.map(feature => `${feature.x},${feature.y}`)).size).toBe(dungeon.features.length);
    expect(dungeon.features.some(feature => feature.roomId === dungeon.entranceRoomId)).toBe(false);
    for (const feature of dungeon.features) {
      expect(dungeon.tiles[feature.y * dungeon.width + feature.x]).toBe("0");
      if (feature.kind === "chest" && feature.itemId) expect(MAGIC_ITEM_BY_ID.has(feature.itemId)).toBe(true);
    }
    for (const room of dungeon.rooms.filter(room => room.secret))
      expect(dungeon.features.some(feature => feature.roomId === room.id && feature.kind === "chest")).toBe(true);
  });
  it.each([NaN, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("rejects invalid generation %s", generation => {
    expect(() => generateDungeonInterior("x", "wizard-tower", "mage", "normal", generation)).toThrow();
  });
  it("rejects unknown sources and preserves site metadata when removing invalid interiors", () => {
    expect(() => generateDungeonInterior("x", "wizard-tower", "lich")).toThrow();
    const adventure = { themeId: "wizard-tower" };
    const marker = { interior: { version: 9 }, adventure };
    cleanDungeonInterior(marker);
    expect(marker).not.toHaveProperty("interior");
    expect(marker.adventure).toBe(adventure);
  });
  it("treats non-string difficulty objects as corrupt instead of throwing during map load", () => {
    const dungeon = { ...generate(), difficulty: { toString: 1 } };
    expect(() => isDungeonInterior(dungeon)).not.toThrow();
    expect(isDungeonInterior(dungeon)).toBe(false);
    const marker = { interior: dungeon };
    cleanDungeonInterior(marker);
    expect(marker).not.toHaveProperty("interior");
  });
  it.each([
    "tiles",
    "room",
    "overlap",
    "monster",
    "trap",
    "loot",
    "boss",
    "target",
    "size",
    "secret"
  ])("rejects corrupted %s data", kind => {
    const dungeon = generate("hell");
    if (kind === "tiles") dungeon.tiles = dungeon.tiles.replace("0", "X");
    if (kind === "room") dungeon.rooms[0].width = 10000;
    if (kind === "overlap")
      dungeon.features[1] = {
        ...dungeon.features[1],
        x: dungeon.features[0].x,
        y: dungeon.features[0].y,
        roomId: dungeon.features[0].roomId
      };
    if (kind === "monster") {
      const feature = dungeon.features.find(feature => feature.kind === "monster")!;
      if (feature.kind === "monster") feature.monsterId = "fake";
    }
    if (kind === "trap") {
      const feature = dungeon.features.find(feature => feature.kind === "trap")!;
      if (feature.kind === "trap") feature.dc = Infinity;
    }
    if (kind === "loot") {
      const feature = dungeon.features.find(feature => feature.kind === "chest")!;
      if (feature.kind === "chest") feature.itemId = "<script>";
    }
    if (kind === "boss") dungeon.bossRoomId = dungeon.entranceRoomId;
    if (kind === "target") dungeon.targetCr = 99;
    if (kind === "size") dungeon.width = 999999;
    if (kind === "secret") dungeon.rooms[0].secret = true;
    expect(isDungeonInterior(dungeon)).toBe(false);
  });
});

it("accepts and roundtrips a custom battle viewport without changing dungeon geometry", async () => {
 const dungeon=generateDungeonInterior("battle-save","wizard-tower","mage");
 dungeon.battleMap={columns:96,rows:54,cellPixels:48};
 expect(isDungeonInterior(JSON.parse(JSON.stringify(dungeon)))).toBe(true);
 const copy=structuredClone(dungeon);copy.battleMap!.cellPixels=128;
 expect(isDungeonInterior(copy)).toBe(false);
 expect(isDungeonInterior({...dungeon,battleMap:undefined})).toBe(true);
});
