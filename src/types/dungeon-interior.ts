import type { BattleMapSettings } from "./battle-map";
export type DungeonDifficulty = "normal" | "challenging" | "hell";
export interface DungeonPoint {
  x: number;
  y: number;
}
export interface DungeonRoom {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  secret: boolean;
  doors: DungeonPoint[];
}
interface DungeonFeatureBase extends DungeonPoint {
  id: number;
  roomId: number;
}
export type DungeonFeature =
  | (DungeonFeatureBase & {
      kind: "monster";
      monsterId: string;
      count: number;
      boss: boolean;
      hpMultiplier: number;
      damageMultiplier: number;
    })
  | (DungeonFeatureBase & { kind: "trap"; trapId: string; dc: number; damageDice: number })
  | (DungeonFeatureBase & { kind: "chest"; gold: number; itemId?: string; variant?: string })
  | (DungeonFeatureBase & { kind: "gimmick"; gimmickId: string; dc: number });
export interface DungeonInterior {
  version: 1;
  seed: string;
  generation: number;
  themeId: string;
  monsterId: string;
  difficulty: DungeonDifficulty;
  baseCr: number;
  targetCr: number;
  width: number;
  height: number;
  tiles: string;
  entranceRoomId: number;
  bossRoomId: number;
  rooms: DungeonRoom[];
  features: DungeonFeature[];
  battleMap?: BattleMapSettings;
}
