import { describe, expect, it } from "vitest";
import type { WorldNpc } from "@/types/campaign-world";
import { selectLocalEncounterNpc } from "./localEncounter";

const homes = [
  { i: 1, x: 100, y: 100, state: 1 },
  { i: 2, x: 1, y: 1, state: 2 },
  { i: 3, x: 50, y: 50, state: 1 },
  { i: 4, x: 0, y: 0, state: 1, removed: true }
];
const npcs = [1, 2, 3, 4].map(
  id => ({ id: `npc:${id}:0:0`, villageId: `village:${id}`, name: `인물 ${id}` }) as WorldNpc
);
describe("local encounter NPC selection", () => {
  it("uses the nearest active settlement in the same country, not a closer foreign town", () => {
    expect(selectLocalEncounterNpc({ x: 0, y: 0, cell: 7 }, 1, homes, npcs)?.id).toBe("npc:3:0:0");
  });
  it("is stable across input order and does not mutate NPCs", () => {
    const copy = structuredClone(npcs);
    const point = { x: 0, y: 0, cell: 7 };
    expect(selectLocalEncounterNpc(point, 1, homes, npcs)).toEqual(
      selectLocalEncounterNpc(point, 1, [...homes].reverse(), [...npcs].reverse())
    );
    expect(npcs).toEqual(copy);
  });
  it("returns no link when no matching NPC exists or the point is invalid", () => {
    expect(selectLocalEncounterNpc({ x: 0, y: 0, cell: 7 }, 0, homes, npcs)).toBeUndefined();
    expect(selectLocalEncounterNpc({ x: NaN, y: 0, cell: 7 }, 1, homes, npcs)).toBeUndefined();
    expect(selectLocalEncounterNpc({ x: 0, y: 0, cell: 7 }, 1, homes, [])).toBeUndefined();
  });
});
