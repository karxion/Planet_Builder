import { DUNGEON_DEVICE_BY_ID } from "@/data/dungeon-devices";
import type { DeviceState, DungeonEntity, DungeonV2 } from "@/types/dungeon-v2";

export type DungeonDeviceAction = "reveal" | "telegraph" | "trigger" | "disable" | "destroy" | "reset";
export function syncDungeonDevice(entity: DungeonEntity): void {
  const device = entity.device;
  if (!device) return;
  const template = DUNGEON_DEVICE_BY_ID.get(device.templateId)!;
  const off = ["disabled", "destroyed"].includes(device.state);
  const open = off || device.open || !device.powered;
  entity.blocksMovement = template.blocksMovement && !open;
  entity.blocksSight = template.blocksSight && !open;
  if (device.templateId === "pit") entity.blocksMovement = !off && device.state === "triggered";
  if (device.templateId === "bridge")
    entity.blocksMovement = device.state === "destroyed" || device.state === "triggered";
  entity.movementCost = device.templateId === "flood" && device.state === "triggered" ? 2 : 1;
}
export function operateDungeonDevice(
  source: DungeonV2,
  floorId: string,
  entityId: string,
  action: DungeonDeviceAction,
  eventId: string
): DungeonV2 {
  if (!eventId || eventId.length > 200) throw new Error("기믹 이벤트 ID 필요");
  if (source.progress.events.includes(eventId)) return structuredClone(source);
  const d = structuredClone(source),
    floor = d.floors.find(f => f.id === floorId),
    entity = floor?.entities.find(e => e.id === entityId);
  if (!entity?.device) throw new Error("기믹을 찾을 수 없습니다.");
  const initial = entity.device;
  if (initial.state === "destroyed" && action !== "reset" && action !== "reveal") return d;
  if (
    action === "trigger" &&
    (["disabled", "destroyed"].includes(initial.state) || initial.cooldownUntil > d.progress.round)
  )
    return d;
  if (action === "reveal") entity.revealed = true;
  else if (action === "reset") {
    initial.state = "armed";
    initial.open = false;
    initial.powered = true;
    initial.cooldownUntil = 0;
  } else if (action === "telegraph") initial.state = "telegraphed";
  else if (action === "disable" || action === "destroy") {
    initial.state = action === "destroy" ? "destroyed" : "disabled";
    initial.powered = false;
  } else {
    initial.state = "triggered";
    initial.lastEventId = eventId;
    initial.cooldownUntil = d.progress.round + DUNGEON_DEVICE_BY_ID.get(initial.templateId)!.cooldown;
    if (["seal", "portcullis"].includes(initial.templateId)) {
      if (initial.key && !d.progress.keys.includes(initial.key)) throw new Error("필요 열쇠가 없습니다.");
      initial.open = true;
    }
  }
  syncDungeonDevice(entity);
  if (action === "trigger" && initial.templateId === "alarm") {
    const room = floor!.rooms.find(r => r.id === entity.roomId)!;
    initial.arrivedGuardIds ||= [];
    for (const id of initial.guardIds || []) {
      if (initial.arrivedGuardIds.includes(id)) continue;
      const guard = floor!.entities.find(e => e.id === id && e.feature?.kind === "monster");
      if (!guard) throw new Error("경보의 기존 경비 참조가 손상됐습니다.");
      let moved = false;
      for (let y = room.y; y <= room.y + room.height - guard.height && !moved; y++)
        for (let x = room.x; x <= room.x + room.width - guard.width && !moved; x++) {
          const covered = new Set<number>();
          for (let cy = y; cy < y + guard.height; cy++)
            for (let cx = x; cx < x + guard.width; cx++) covered.add(cy * floor!.settings.width + cx);
          if (
            [...covered].some(k => floor!.tiles[k] !== "0") ||
            [...floor!.entities, ...floor!.endpoints].some(
              e =>
                e.id !== guard.id &&
                Array.from({ length: e.height }, (_, dy) => dy + e.y).some(cy =>
                  Array.from({ length: e.width }, (_, dx) => dx + e.x).some(cx =>
                    covered.has(cy * floor!.settings.width + cx)
                  )
                )
            )
          )
            continue;
          guard.x = x;
          guard.y = y;
          guard.roomId = room.id;
          initial.arrivedGuardIds.push(id);
          moved = true;
        }
    }
  }
  // Explicit, bounded queue. Each device receives one effect per event, even across cyclic floor circuits.
  const propagate =
    (action === "trigger" || action === "disable" || action === "destroy") &&
    ["lever", "crystal"].includes(initial.templateId);
  const queue = propagate ? [...initial.targets] : [],
    seen = new Set([`${floorId}/${entityId}`]);
  while (queue.length) {
    if (seen.size > 1000) throw new Error("연동 장치 예산 초과");
    const ref = queue.shift()!,
      key = `${ref.floorId}/${ref.entityId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const targetFloor = d.floors.find(f => f.id === ref.floorId),
      target = targetFloor?.entities.find(e => e.id === ref.entityId);
    if (!target?.device) throw new Error("끊긴 연동 장치 참조");
    if (target.device.state === "destroyed") continue;
    target.device.state = "disabled";
    target.device.open = true;
    target.device.powered = false;
    target.device.lastEventId = eventId;
    syncDungeonDevice(target);
    queue.push(...target.device.targets);
  }
  d.progress.events = [...d.progress.events, eventId].slice(-128);
  d.progress.log = [
    ...d.progress.log,
    `${d.progress.round}: ${floorId}/${entityId}: ${action}${initial.templateId === "alarm" ? " (기존 경비에 경보 전달; 증원 생성 없음)" : ""}`
  ].slice(-100);
  return d;
}
export function advanceDungeonRound(source: DungeonV2): DungeonV2 {
  const d = structuredClone(source);
  d.progress.round++;
  for (const floor of d.floors)
    for (const entity of floor.entities) {
      const device = entity.device;
      if (!device || !["triggered", "cooldown"].includes(device.state) || !device.cooldownUntil) continue;
      device.state = (device.cooldownUntil > d.progress.round ? "cooldown" : "armed") as DeviceState;
      syncDungeonDevice(entity);
    }
  return d;
}
