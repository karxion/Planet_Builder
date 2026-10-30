import { describe, expect, it } from "vitest";
import { DUNGEON_DEVICE_BY_ID } from "@/data/dungeon-devices";
import type { DeviceTemplateId, DungeonEntity, DungeonV2 } from "@/types/dungeon-v2";
import { advanceDungeonRound, operateDungeonDevice, syncDungeonDevice } from "./dungeon-devices";
import { createDungeonV2 } from "./dungeon-layout";

const device = (d: DungeonV2, index: number, templateId: DeviceTemplateId): DungeonEntity => {
  const e = d.floors[index].entities[0],
    t = DUNGEON_DEVICE_BY_ID.get(templateId)!;
  e.kind = "device";
  e.assetId = t.assetId;
  e.device = {
    templateId,
    state: "armed",
    open: false,
    powered: true,
    cooldownUntil: 0,
    lastEventId: "",
    targets: [],
    counter: t.counter,
    effectCells: []
  };
  syncDungeonDevice(e);
  return e;
};
describe("GM device transactions", () => {
  it("opens cross-floor linked wards once even with a cycle and deduplicates repeated event IDs", () => {
    const d = createDungeonV2("devices", "d"),
      a = device(d, 0, "lever"),
      b = device(d, 1, "ward");
    a.device!.targets = [{ floorId: d.floorOrder[1], entityId: b.id }];
    b.device!.targets = [{ floorId: d.floorOrder[0], entityId: a.id }];
    const before = structuredClone(d),
      next = operateDungeonDevice(d, d.floorOrder[0], a.id, "trigger", "event");
    expect(next.floors[1].entities[0]).toMatchObject({
      blocksMovement: false,
      device: { state: "disabled", open: true }
    });
    expect(operateDungeonDevice(next, d.floorOrder[0], a.id, "trigger", "event")).toEqual(next);
    expect(d).toEqual(before);
  });
  it("maintains cooldown and blocks disabled triggers, while reset is explicit", () => {
    const d = createDungeonV2("devices", "d"),
      e = device(d, 0, "rune");
    const triggered = operateDungeonDevice(d, d.floorOrder[0], e.id, "trigger", "one");
    expect(operateDungeonDevice(triggered, d.floorOrder[0], e.id, "trigger", "two")).toEqual(triggered);
    const cooldown = advanceDungeonRound(triggered);
    expect(cooldown.floors[0].entities[0].device!.state).toBe("cooldown");
    expect(advanceDungeonRound(cooldown).floors[0].entities[0].device!.state).toBe("armed");
    const disabled = operateDungeonDevice(d, d.floorOrder[0], e.id, "disable", "off");
    expect(operateDungeonDevice(disabled, d.floorOrder[0], e.id, "trigger", "three")).toEqual(disabled);
    expect(
      operateDungeonDevice(disabled, d.floorOrder[0], e.id, "reset", "reset").floors[0].entities[0].device!.state
    ).toBe("armed");
  });
  it("moves selected existing guards once and retains their IDs without spawning", () => {
    const d = createDungeonV2("guard-move", "d"),
      f = d.floors[0],
      alarm = device(d, 0, "alarm");
    const guard = f.entities.find(e => e.feature?.kind === "monster")!;
    alarm.device!.guardIds = [guard.id];
    const count = f.entities.length;
    const next = operateDungeonDevice(d, f.id, alarm.id, "trigger", "alarm-move");
    expect(next.floors[0].entities).toHaveLength(count);
    expect(next.floors[0].entities.find(e => e.id === guard.id)!.roomId).toBe(alarm.roomId);
    expect(next.floors[0].entities[0].device!.arrivedGuardIds).toEqual([guard.id]);
    const after = operateDungeonDevice(advanceDungeonRound(next), f.id, alarm.id, "trigger", "repeat-move");
    expect(after.floors[0].entities.find(e => e.id === guard.id)).toEqual(
      next.floors[0].entities.find(e => e.id === guard.id)
    );
  });
  it("keeps keys reusable and never spawns guards on repeated alarms", () => {
    const d = createDungeonV2("devices", "d"),
      e = device(d, 0, "seal");
    e.device!.key = "key";
    expect(() => operateDungeonDevice(d, d.floorOrder[0], e.id, "trigger", "locked")).toThrow();
    d.progress.keys = ["key"];
    expect(operateDungeonDevice(d, d.floorOrder[0], e.id, "trigger", "open").progress.keys).toEqual(["key"]);
    const alarm = device(d, 0, "alarm"),
      count = d.floors.flatMap(f => f.entities).length;
    let next = operateDungeonDevice(d, d.floorOrder[0], alarm.id, "trigger", "alarm");
    next = advanceDungeonRound(next);
    next = operateDungeonDevice(next, d.floorOrder[0], alarm.id, "trigger", "alarm2");
    expect(next.floors.flatMap(f => f.entities)).toHaveLength(count);
  });
});
