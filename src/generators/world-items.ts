import Alea from "alea";
import { synchronizeUniqueItemBonus } from "./unique-item-bonuses";
import {
  ALL_REFERENCE_OPTIONS,
  MAGIC_ITEM_BY_ID,
  MAGIC_ITEM_CATEGORIES,
  TREASURE_FORMS
} from "@/data/magic-item-references";
import type { CampaignWorld } from "@/types/campaign-world";
import type { WorldMagicItem, ItemDungeonChoice, ItemLibrary, ItemOwner } from "@/types/world-item";

export interface TreasureItemSeed {
  id: string;
  stateId: number;
  settlementId?: string;
  name: string;
  rarity: "rare" | "veryRare" | "legendary";
  unique: boolean;
  power: string;
  history: string;
  notes: string;
  design?: { referenceId: string; variant?: string };
}

export const ITEM_RARITY_LABELS = {
  common: "커먼",
  uncommon: "언커먼",
  rare: "레어",
  veryRare: "베리 레어",
  legendary: "레젠더리",
  artifact: "아티팩트"
};

export function createWorldItem(
  seed: string,
  id: string,
  name: string,
  owner: ItemOwner = { kind: "none" },
  national = false
): WorldMagicItem {
  const random = Alea(`${seed}:${id}:world-item-v1`);
  const rarity = national ? (random() < 0.25 ? "legendary" : "veryRare") : "rare";
  const options = ALL_REFERENCE_OPTIONS.filter(option => option.rarity === rarity);
  const option = options[Math.floor(random() * options.length)];
  const item: WorldMagicItem = {
    id,
    name: `${name}의 ${TREASURE_FORMS[option.reference.category]}`.slice(0, 200),
    category: option.reference.category,
    rarity,
    unique: true,
    appearance: "문양이 새겨진 금속 장식과 은은한 마법의 빛",
    power: `${option.reference.name}${option.variant ? ` · ${option.variant}` : ""} · SRD ${option.reference.edition} 원본 규칙 참조`,
    history: "세계관의 전승에 따라 이름과 외형이 달라진 마법 아이템이다",
    notes: "",
    owner,
    referenceId: option.reference.id,
    ...(option.variant ? { variant: option.variant } : {}),
    edited: false
  };
  synchronizeUniqueItemBonus(seed, item);
  return item;
}

export function synchronizeItemLibrary(
  world: CampaignWorld,
  dungeons: ItemDungeonChoice[],
  treasures?: TreasureItemSeed[],
  capitals: string[] = []
): boolean {
  let changed = !world.itemLibrary;
  const library: ItemLibrary = (world.itemLibrary ||= { version: 1, items: [], deletedIds: [] });
  const ids = new Set([...library.items.map(item => item.id), ...library.deletedIds]);
  const add = (id: string, create: () => WorldMagicItem) => {
    if (ids.has(id)) return;
    library.items.push(create());
    ids.add(id);
    changed = true;
  };
  if (treasures) {
    for (const treasure of treasures) {
      const id = `item:${treasure.id}`;
      add(id, () => {
        const unit = world.units.find(unit => unit.id === (treasure.settlementId || `country:${treasure.stateId}`));
        const reference = treasure.design && MAGIC_ITEM_BY_ID.get(treasure.design.referenceId);
        return {
          id,
          name: treasure.name,
          category: reference?.category || "wondrous",
          rarity: treasure.rarity,
          unique: treasure.unique,
          appearance: "",
          power: treasure.power,
          history: treasure.history,
          notes: treasure.notes,
          owner: unit ? { kind: "unit", id: unit.id, label: unit.name } : { kind: "none" },
          sourceTreasureId: treasure.id,
          ...(reference ? { referenceId: reference.id } : {}),
          ...(treasure.design?.variant ? { variant: treasure.design.variant } : {}),
          edited: false
        };
      });
    }
  } else {
    for (const unit of world.units.filter(
      unit => (unit.level === "country" && unit.stateId > 0) || capitals.includes(unit.id)
    )) {
      const id = `item:auto:${unit.id}`;
      add(id, () =>
        createWorldItem(
          world.seed,
          id,
          unit.name,
          { kind: "unit", id: unit.id, label: unit.name },
          unit.level === "country"
        )
      );
    }
  }
  for (const dungeon of dungeons) {
    // Pair the marker index with its cell so reused marker indices cannot silently relocate rewards.
    const id = `item:dungeon:${dungeon.markerId}:${dungeon.cell}`;
    add(id, () => ({
      ...createWorldItem(world.seed, id, dungeon.name),
      reward: { markerId: dungeon.markerId, cell: dungeon.cell, name: dungeon.name }
    }));
  }
  for (const item of library.items) if (synchronizeUniqueItemBonus(world.seed, item)) changed = true;
  return changed;
}

export function itemOwnerLabel(item: WorldMagicItem, world: CampaignWorld): string {
  const assignment = item.owner;
  if (assignment.kind === "none") return "소유주 없음";
  if (assignment.kind === "custom") return assignment.label;
  const owner =
    assignment.kind === "npc"
      ? world.npcs.find(npc => npc.id === assignment.id)
      : world.units.find(unit => unit.id === assignment.id);
  return owner?.name || `${assignment.label} (연결 대상 없음)`;
}

export function itemImagePrompt(item: WorldMagicItem): string {
  return [
    "다음 판타지 TRPG 매직 아이템의 고품질 아이템 일러스트를 생성해주세요.",
    `아이템 이름: ${item.name}`,
    `유형: ${MAGIC_ITEM_CATEGORIES[item.category]}`,
    `희귀도: ${ITEM_RARITY_LABELS[item.rarity]}${item.unique ? " · 서사적 유니크" : ""}`,
    `외형: ${item.appearance || "아이템의 유형에 어울리는 외형"}`,
    "아이템 단독 구도, 정교한 재질과 장식, 형태를 명확하게 보여주는 조명, 판타지 RPG 인벤토리용 콘셉트 아트.",
    "정사각형 구도, 여백을 두고 전체 실루엣을 보여주세요. 인물·손·텍스트·로고·워터마크는 넣지 마세요."
  ].join("\n");
}
