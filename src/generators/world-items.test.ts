import { describe, expect, it } from "vitest";
import { isItemLibrary, isWorldMagicItem } from "@/data/world-item-validation";
import { isCampaignWorld } from "@/data/campaign-validation";
import { encodePlanetProject, decodePlanetProject, createPlanetProject } from "@/services/planet/project-codec";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import type { CampaignWorld } from "@/types/campaign-world";
import { createWorldItem, itemImagePrompt, itemOwnerLabel, synchronizeItemLibrary } from "./world-items";

const createWorld = (): CampaignWorld => ({
  version: 1,
  ruleset: "srd-5.2.1",
  seed: "items",
  generation: 0,
  units: [{ id: "country:1", level: "country", name: "은빛 왕국", sourceId: 1, stateId: 1, x: 0, y: 0 }],
  npcs: []
});
const dungeons = [{ markerId: 7, cell: 12, name: "잿빛 탑", x: 10, y: 20 }];
describe("World item library", () => {
  it("deterministically assigns valid SRD-based items with separate ownership and dungeon origins", () => {
    const left = createWorld(),
      right = createWorld();
    expect(synchronizeItemLibrary(left, dungeons)).toBe(true);
    synchronizeItemLibrary(right, dungeons);
    expect(left).toEqual(right);
    expect(left.itemLibrary!.items).toHaveLength(2);
    expect(left.itemLibrary!.items[0].owner.kind).toBe("unit");
    expect(["veryRare", "legendary"]).toContain(left.itemLibrary!.items[0].rarity);
    expect(left.itemLibrary!.items[1].reward).toEqual({ markerId: 7, cell: 12, name: "잿빛 탑" });
    expect(left.itemLibrary!.items[1].owner.kind).toBe("none");
    expect(isItemLibrary(left.itemLibrary)).toBe(true);
    expect(isCampaignWorld(left)).toBe(true);
  });
  it("does not duplicate, overwrite edits or resurrect explicitly deleted items", () => {
    const world = createWorld();
    synchronizeItemLibrary(world, dungeons);
    const first = world.itemLibrary!.items[0];
    first.name = "내 아이템";
    first.edited = true;
    expect(synchronizeItemLibrary(world, dungeons)).toBe(false);
    const removed = world.itemLibrary!.items.pop()!;
    world.itemLibrary!.deletedIds.push(removed.id);
    expect(synchronizeItemLibrary(world, dungeons)).toBe(false);
    expect(world.itemLibrary!.items.map(item => item.name)).toEqual(["내 아이템"]);
  });
  it("imports existing world treasures without generating duplicate national items", () => {
    const world = createWorld();
    const treasures = [
      {
        id: "treasure:country:1:0",
        stateId: 1,
        name: "왕의 인장",
        rarity: "legendary" as const,
        unique: true,
        power: "봉인",
        history: "계승",
        notes: "원본 메모"
      }
    ];
    synchronizeItemLibrary(world, [], treasures);
    synchronizeItemLibrary(world, [], treasures);
    expect(world.itemLibrary!.items).toHaveLength(1);
    expect(world.itemLibrary!.items[0]).toMatchObject({ name: "왕의 인장", sourceTreasureId: treasures[0].id });
    expect(treasures[0].notes).toBe("원본 메모");
  });
  it("keeps the original reward link when the marker index is reused on a different cell", () => {
    const world = createWorld();
    synchronizeItemLibrary(world, dungeons);
    synchronizeItemLibrary(world, [{ ...dungeons[0], cell: 90, name: "새 던전" }]);
    expect(world.itemLibrary!.items.filter(item => item.reward).map(item => item.reward!.cell)).toEqual([12, 90]);
  });
  it("keeps owner snapshots rather than silently reassigning missing NPCs", () => {
    const world = createWorld();
    const item = createWorldItem("seed", "item:manual:test", "보물");
    item.owner = { kind: "npc", id: "npc:1:2", label: "이전 소유주" };
    expect(itemOwnerLabel(item, world)).toContain("이전 소유주");
    expect(itemOwnerLabel(item, world)).toContain("연결 대상 없음");
    expect(isWorldMagicItem(item)).toBe(true);
  });
  it("excludes owners, dungeon origins, history and GM notes from the image prompt", () => {
    const item = createWorldItem("seed", "item:manual:test", "보물");
    item.notes = "비밀 메모";
    item.history = "숨겨진 역사";
    item.reward = { markerId: 7, cell: 12, name: "스포일러 던전" };
    item.owner = { kind: "custom", label: "비밀 소유주" };
    const prompt = itemImagePrompt(item);
    for (const value of [item.notes, item.history, item.reward.name, item.owner.label])
      expect(prompt).not.toContain(value);
    expect(prompt).toContain(item.name);
    expect(prompt).toContain(item.appearance);
  });
  it("validates IDs, duplicate records, owner types and image safety", () => {
    const world = createWorld();
    synchronizeItemLibrary(world, dungeons);
    const library = world.itemLibrary!;
    const item = library.items[0];
    expect(isWorldMagicItem({ ...item, owner: { kind: "npc", id: "bad", label: "x" } })).toBe(false);
    expect(isWorldMagicItem({ ...item, image: "https://tracking.example/image.png" })).toBe(false);
    expect(isWorldMagicItem({ ...item, reward: { markerId: -1, cell: 0, name: "x" } })).toBe(false);
    expect(isItemLibrary({ ...library, items: [item, item] })).toBe(false);
    expect(isItemLibrary({ ...library, deletedIds: [item.id] })).toBe(false);
  });
  it("round-trips images, current owners, dungeon origins, references and deletion records in .fpb", async () => {
    const world = createWorld();
    synchronizeItemLibrary(world, dungeons);
    const item = world.itemLibrary!.items[1];
    item.owner = { kind: "custom", label: "붉은 용병단" };
    item.image = "data:image/jpeg;base64,/9j/2Q==";
    world.itemLibrary!.deletedIds.push("item:manual:deleted");
    const project = createPlanetProject({
      mapPayload: `1.135.0|license|seed\r\n<svg>${"x".repeat(120)}</svg>`,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135.0",
      upstreamCommit: "test"
    });
    project.campaign = world;
    expect((await decodePlanetProject(await encodePlanetProject(project))).campaign).toEqual(world);
  });
});
