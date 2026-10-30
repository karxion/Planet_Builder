import RNG from "rot-js/lib/rng";
import { describe, expect, it } from "vitest";
import { diagnoseDungeonV2, isDungeonV2 } from "@/data/dungeon-v2-validation";
import { cleanDungeonInterior, isDungeonInterior } from "@/data/dungeon-validation";
import { migrateDungeonV1 } from "@/services/planet/dungeon-migration";
import { addDungeonEntity, addDungeonRegion, duplicateDungeon, regenerateDungeonRoom } from "./dungeon-edit";
import { generateDungeonInterior } from "./dungeon-interior";
import {
  createDungeonV2,
  DEFAULT_DUNGEON_SETTINGS,
  insertDungeonFloor,
  regenerateDungeonFloor
} from "./dungeon-layout";

const create = (seed = "test") => createDungeonV2(seed, "dungeon", 3);
describe("Dungeon v2 generation and persistence", () => {
  it("reproduces geometry without changing the shared RNG and keeps floor seeds independent of count", () => {
    const before = RNG.getState(),
      a = create(),
      b = create();
    expect(a).toEqual(b);
    expect(RNG.getState()).toEqual(before);
    expect(createDungeonV2("test", "dungeon", 5).floors.slice(0, 3)).toEqual(a.floors);
    expect(isDungeonV2(a)).toBe(true);
    expect(diagnoseDungeonV2(a)).toEqual([]);
  });
  it.each([
    [8, 8],
    [25, 14],
    [48, 27],
    [72, 41],
    [128, 72],
    [256, 256]
  ])("generates bounded connected %ix%i floors", (width, height) => {
    for (const structure of ["fortress", "cavern", "maze", "tower", "crypt"] as const) {
      const d = createDungeonV2(`${width}:${structure}`, "small", 1, {
        ...DEFAULT_DUNGEON_SETTINGS,
        width,
        height,
        structure
      });
      expect(isDungeonV2(d), structure).toBe(true);
      expect(diagnoseDungeonV2(d), structure).toEqual([]);
    }
  });
  it("preserves all old floor data when inserting or reordering", () => {
    const original = create(),
      snapshot = structuredClone(original);
    const next = insertDungeonFloor(original, original.floorOrder[0], "inserted", original.defaults);
    for (const f of original.floors) expect(next.floors.find(v => v.id === f.id)).toEqual(f);
    expect(original).toEqual(snapshot);
    expect(isDungeonV2(next)).toBe(true);
    expect(diagnoseDungeonV2(next)).toEqual([]);
    next.floorOrder.reverse();
    expect(diagnoseDungeonV2(next)).toEqual([]);
  });
  it("preserves connected landings, manual entities and other floors on regeneration; rejects locked floors", () => {
    const d = create(),
      target = d.floors[1];
    target.entities[0].edited = true;
    const next = regenerateDungeonFloor(d, target.id, { ...target.settings, structure: "cavern" });
    expect(next.floors[0]).toEqual(d.floors[0]);
    expect(next.floors[2]).toEqual(d.floors[2]);
    expect(next.floors[1].endpoints).toEqual(target.endpoints);
    expect(next.floors[1].entities.find(e => e.id === target.entities[0].id)).toEqual(target.entities[0]);
    expect(isDungeonV2(next)).toBe(true);
    expect(diagnoseDungeonV2(next)).toEqual([]);
    target.locked = true;
    expect(() => regenerateDungeonFloor(d, target.id, target.settings)).toThrow();
  });
  it("keeps valid unique IDs across repeated floor rerolls with mixed protected entries", () => {
    for (let n = 0; n < 24; n++) {
      let d = createDungeonV2(`reroll-${n}`, `d-${n}`, 3);
      for (let revision = 0; revision < 3; revision++) {
        const f = d.floors[1];
        f.entities[0].edited = true;
        d = regenerateDungeonFloor(d, f.id, { ...f.settings, structure: "cavern" });
        expect(
          isDungeonV2(d),
          `${n}/${revision}: duplicate IDs ${d.floors[1].entities.length - new Set(d.floors[1].entities.map(e => e.id)).size}`
        ).toBe(true);
        expect(diagnoseDungeonV2(d), `${n}/${revision}`).toEqual([]);
      }
    }
  });
  it("keeps cross-floor circuit targets and protected room terrain unchanged", () => {
    let d = create();
    const target = d.floors[1].entities.find(e => e.device)!;
    const control = d.floors[0].entities.find(e => e.device)!;
    control.device!.targets = [{ floorId: d.floors[1].id, entityId: target.id }];
    const room = d.floors[1].rooms.find(r => r.id === target.roomId)!;
    d = regenerateDungeonRoom(d, d.floors[1].id, room.id);
    d.floors[1].rooms.find(r => r.id === room.id)!.locked = true;
    const before = d.floors[1];
    const next = regenerateDungeonFloor(d, before.id, before.settings);
    expect(next.floors[1].entities.find(e => e.id === target.id)).toEqual(
      before.entities.find(e => e.id === target.id)
    );
    for (let y = room.y; y < room.y + room.height; y++)
      for (let x = room.x; x < room.x + room.width; x++)
        expect(next.floors[1].tiles[y * before.settings.width + x]).toBe(before.tiles[y * before.settings.width + x]);
    expect(next.floors[0]).toEqual(d.floors[0]);
    expect(diagnoseDungeonV2(next)).toEqual([]);
  });
  it("keeps geometry and protected entries on contents-only regeneration", () => {
    const d = create();
    d.floors[0].rooms[0].locked = true;
    const before = d.floors[0].entities.filter(e => e.roomId === d.floors[0].rooms[0].id);
    const next = regenerateDungeonFloor(d, d.floorOrder[0], d.defaults, true);
    expect(next.floors[0].tiles).toBe(d.floors[0].tiles);
    expect(next.floors[0].entities.filter(e => e.roomId === d.floors[0].rooms[0].id)).toEqual(before);
  });
  it("rejects the cell budget before mutating source", () => {
    expect(() => createDungeonV2("x", "x", 100, { ...DEFAULT_DUNGEON_SETTINGS, width: 256, height: 256 })).toThrow();
    const d = create(),
      before = JSON.stringify(d);
    expect(() => insertDungeonFloor(d, d.floorOrder[0], d.floorOrder[0], d.defaults)).toThrow();
    expect(JSON.stringify(d)).toBe(before);
  });
  it("migrates v1 exactly without rerolling geometry or monster stats and keeps future versions", () => {
    const old = generateDungeonInterior("legacy", "wizard-tower", "mage", "hell"),
      copy = structuredClone(old);
    const d = migrateDungeonV1(old, "converted", "Legacy");
    expect(d.floors[0].tiles).toBe(old.tiles);
    expect(d.floors[0].entities.map(e => e.feature)).toEqual(old.features);
    expect(d.floors[0].rooms.map(r => r.legacyId)).toEqual(old.rooms.map(r => r.id));
    expect(old).toEqual(copy);
    expect(isDungeonInterior(d)).toBe(true);
    const marker = { interior: JSON.parse(JSON.stringify(d)) };
    cleanDungeonInterior(marker);
    expect(marker.interior).toEqual(d);
    const future = { interior: { version: 99, secret: "preserve original" } };
    cleanDungeonInterior(future);
    expect(future.interior.version).toBe(99);
    const broken = { interior: { version: 2, floors: [null] } };
    cleanDungeonInterior(broken);
    expect(broken.interior).toBeDefined();
  });
  it("diagnoses dangling links, one-way unreachable floors and self-locked progression", () => {
    const d = create();
    d.connections[0].to.endpointId = "missing";
    expect(diagnoseDungeonV2(d).join()).toContain("접속구");
    const oneWay = create();
    oneWay.connections[0].bidirectional = false;
    [oneWay.connections[0].from, oneWay.connections[0].to] = [oneWay.connections[0].to, oneWay.connections[0].from];
    expect(diagnoseDungeonV2(oneWay).join()).toContain("도달 불가");
    const key = create();
    key.connections[0].requiredKey = "key";
    key.floors[2].entities[0].grantsKey = "key";
    expect(diagnoseDungeonV2(key).join()).toContain("도달 불가");
    key.floors[0].entities[0].grantsKey = "key";
    expect(diagnoseDungeonV2(key)).toEqual([]);
  });
  it("checks full rotated footprints and keeps every existing region during additions", () => {
    const d = create(),
      f = d.floors[0],
      r = f.rooms[0];
    f.entities = [];
    f.endpoints = f.endpoints.filter(e => e.roomId !== r.id);
    const placed = addDungeonEntity(d, f.id, r.id, "D15", r.x, r.y, 90, "manual");
    expect(placed.floors[0].entities[0]).toMatchObject({ width: 2, height: 1, rotation: 90 });
    expect(() => addDungeonEntity(placed, f.id, r.id, "D11", r.x + 1, r.y, 0, "overlap")).toThrow();
    expect(() => addDungeonEntity(d, f.id, r.id, "D32", r.x + r.width - 1, r.y, 0, "edge")).toThrow();
    const regenerated = regenerateDungeonRoom(d, f.id, r.id);
    expect(regenerated.floors[1]).toEqual(d.floors[1]);
    expect(regenerated.floors[0].entities).toEqual(f.entities);
    expect(regenerated.floors[0].rooms[0].id).toBe(r.id);
    expect(() => addDungeonRegion(d, f.id, r.id, r.x, r.y, 3, 3, "bad")).toThrow();
  });
  it("duplicates with new IDs and remaps internal references, preserving the source", () => {
    const d = create(),
      before = structuredClone(d),
      copy = duplicateDungeon(d, "copy", "new-seed");
    expect(copy.id).toBe("copy");
    expect(copy.entrance.floorId).toBe(copy.floors[0].id);
    expect(copy.connections[0].from.floorId).toBe(copy.floors[0].id);
    expect(d).toEqual(before);
    expect(isDungeonV2(copy)).toBe(true);
    expect(diagnoseDungeonV2(copy)).toEqual([]);
  });
});
