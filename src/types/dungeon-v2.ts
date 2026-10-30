import type { BattleMapSettings } from "./battle-map";
import type { DungeonDifficulty, DungeonFeature, DungeonPoint } from "./dungeon-interior";

export type DungeonStructure = "fortress" | "cavern" | "maze" | "tower" | "crypt";
export type DungeonEnvironment = "dry" | "flooded" | "lava";
export type DeviceState = "armed" | "telegraphed" | "triggered" | "cooldown" | "disabled" | "destroyed";
export type DeviceTemplateId =
  | "darts"
  | "pit"
  | "portcullis"
  | "rune"
  | "lightning"
  | "alarm"
  | "ward"
  | "crystal"
  | "seal"
  | "flood"
  | "bridge"
  | "lever";
export type DungeonAssetId = `D${string}`;
export interface DungeonFloorSettings {
  concept: string;
  structure: DungeonStructure;
  environment: DungeonEnvironment;
  width: number;
  height: number;
  roomCount: number;
  deviceDensity: number;
  themeId: string;
  monsterId: string;
  difficulty: DungeonDifficulty;
}
export interface DungeonEditFlags {
  locked: boolean;
  edited: boolean;
  origin: "generated" | "manual" | "migrated";
}
export interface DungeonV2Room extends DungeonEditFlags {
  id: string;
  legacyId?: number;
  revision?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  role: "entrance" | "guard" | "puzzle" | "reward" | "rest" | "objective";
  secret: boolean;
  revealed: boolean;
  note: string;
}
export interface DungeonEndpoint extends DungeonPoint {
  id: string;
  roomId: string;
  direction: 0 | 90 | 180 | 270;
  width: number;
  height: number;
  revealed: boolean;
}
export interface DungeonEntity extends DungeonPoint, DungeonEditFlags {
  id: string;
  roomId: string;
  assetId: DungeonAssetId;
  rotation: 0 | 90 | 180 | 270;
  width: number;
  height: number;
  revealed: boolean;
  blocksMovement: boolean;
  blocksSight: boolean;
  movementCost: number;
  kind: "prop" | "device" | "feature";
  grantsKey?: string;
  opened?: boolean;
  looted?: boolean;
  feature?: DungeonFeature;
  device?: {
    templateId: DeviceTemplateId;
    state: DeviceState;
    open: boolean;
    powered: boolean;
    cooldownUntil: number;
    lastEventId: string;
    targets: { floorId: string; entityId: string }[];
    guardIds?: string[];
    arrivedGuardIds?: string[];
    key?: string;
    counter: string;
    effectCells: DungeonPoint[];
  };
}
export interface DungeonFloor extends DungeonEditFlags {
  id: string;
  name: string;
  elevationFt: number;
  originX: number;
  originY: number;
  direction: 0 | 90 | 180 | 270;
  cellFeet: number;
  seed: string;
  layoutRevision: number;
  contentRevision: number;
  settings: DungeonFloorSettings;
  tiles: string;
  rooms: DungeonV2Room[];
  endpoints: DungeonEndpoint[];
  entities: DungeonEntity[];
  revealed: boolean;
  note: string;
}
export interface DungeonConnection {
  id: string;
  from: { floorId: string; endpointId: string };
  to: { floorId: string; endpointId: string };
  kind: "stairs" | "ladder" | "lift" | "shaft" | "drop" | "portal" | "swim";
  bidirectional: boolean;
  revealed: boolean;
  requiredKey?: string;
  requiredDevice?: { floorId: string; entityId: string };
}
export interface DungeonV2 {
  version: 2;
  generatorVersion: 1;
  id: string;
  name: string;
  seed: string;
  defaults: DungeonFloorSettings;
  floorOrder: string[];
  floors: DungeonFloor[];
  connections: DungeonConnection[];
  entrance: { floorId: string; roomId: string };
  objective: { floorId: string; roomId: string; kind: "boss" | "rescue" | "escape" | "relic" | "ritual" };
  battleMap: BattleMapSettings;
  progress: { round: number; keys: string[]; events: string[]; log: string[] };
}
