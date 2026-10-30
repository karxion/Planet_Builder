import type { DungeonAssetId } from "@/types/dungeon-v2";
import imageManifest from "./dungeon-asset-manifest.json";

export interface DungeonAssetDefinition {
  id: DungeonAssetId;
  name: string;
  view: "T" | "D";
  width: number;
  height: number;
  blocksMovement: boolean;
  blocksSight: boolean;
  family: "structure" | "furniture" | "physical" | "magic" | "environment";
  rotations: readonly number[];
  environments: readonly string[];
  connectors: readonly string[];
  layer: "terrain" | "structure" | "object" | "effect";
  hinge?: readonly number[];
}
const rows: [string, "T" | "D", number, number, boolean, boolean][] = [
  ["석조 바닥", "T", 1, 1, false, false],
  ["동굴 바닥", "T", 1, 1, false, false],
  ["직선 석벽", "D", 1, 3, true, true],
  ["안쪽 벽 모서리", "D", 2, 2, true, true],
  ["바깥쪽 벽 모서리", "D", 2, 2, true, true],
  ["경첩 문", "D", 1, 1, true, true],
  ["쇠살 낙하문", "D", 2, 1, true, false],
  ["석조 기둥", "D", 1, 1, true, true],
  ["상승 계단", "D", 2, 4, false, false],
  ["하강 계단", "D", 2, 4, false, false],
  ["보상 상자", "D", 1, 1, false, false],
  ["레버", "D", 1, 1, false, false],
  ["밸브", "D", 1, 1, false, false],
  ["석관", "D", 1, 2, true, true],
  ["책장", "D", 1, 2, true, true],
  ["화로", "D", 1, 1, true, false],
  ["압력판", "T", 1, 1, false, false],
  ["화살 발사구", "D", 1, 1, false, false],
  ["돌출 창살", "T", 1, 2, false, false],
  ["구덩이", "T", 2, 2, true, false],
  ["진자 칼날", "D", 1, 2, false, false],
  ["가스 분출구", "D", 1, 1, false, false],
  ["룬판", "T", 1, 1, false, false],
  ["수호 수정", "D", 1, 1, true, false],
  ["마법진 구간", "T", 1, 1, false, false],
  ["결계막", "T", 1, 3, true, false],
  ["문양 입력대", "D", 1, 1, true, false],
  ["포털 프레임", "D", 2, 2, false, false],
  ["침수 경계", "T", 1, 1, false, false],
  ["용암 경계", "T", 1, 1, false, false],
  ["파손 지지대", "D", 1, 2, true, false],
  ["교량 구간", "D", 2, 4, false, false]
];
export const DUNGEON_ASSETS: DungeonAssetDefinition[] = rows.map(
  ([name, view, width, height, blocksMovement, blocksSight], i) => ({
    id: `D${String(i + 1).padStart(2, "0")}`,
    name,
    view,
    width,
    height,
    blocksMovement,
    blocksSight,
    family: i < 10 ? "structure" : i < 16 ? "furniture" : i < 22 ? "physical" : i < 28 ? "magic" : "environment",
    rotations: [0, 90, 180, 270],
    environments: i === 15 ? ["dry"] : i === 28 ? ["flooded"] : i === 29 ? ["lava"] : ["dry", "flooded", "lava"],
    connectors: [0, 1, 24, 28, 29].includes(i)
      ? ["north", "east", "south", "west"]
      : [2, 8, 9, 25, 31].includes(i)
        ? ["north", "south"]
        : [3, 4].includes(i)
          ? ["north", "east"]
          : [5, 6, 27].includes(i)
            ? ["east", "west"]
            : [],
    layer:
      i < 2 || [16, 18, 19, 22, 24, 28, 29].includes(i)
        ? "terrain"
        : i === 25
          ? "effect"
          : i < 10
            ? "structure"
            : "object",
    ...(i === 5 ? { hinge: [0, 0.5] } : {})
  })
);
export const DUNGEON_ASSET_BY_ID = new Map(DUNGEON_ASSETS.map(a => [a.id, a]));
export interface DungeonImageMetadata {
  width: number;
  height: number;
  sha256: string;
  original: { path: string; width: number; height: number; sha256: string };
  views: { battle: { crop: number[]; anchor: number[] }; overview: { crop: number[]; anchor: number[] } };
}
export const DUNGEON_IMAGE_MANIFEST = imageManifest as Record<string, DungeonImageMetadata>;
export const dungeonAssetUrl = (id: DungeonAssetId) => {
  const meta = DUNGEON_IMAGE_MANIFEST[id];
  if (!meta) throw new Error(`Missing dungeon asset ${id}`);
  return `${import.meta.env.BASE_URL || "/"}assets/dungeon/${id.toLowerCase()}.png?v=${meta.sha256.slice(0, 12)}`;
};
