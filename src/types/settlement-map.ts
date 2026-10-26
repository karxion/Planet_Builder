import type { BattleMapSettings } from "./battle-map";
export interface SettlementRecord {
  version: 1;
  seed: string;
  history: string;
  battleMap?: BattleMapSettings;
}

export interface SettlementMapInput {
  seed: string;
  name: string;
  capital: boolean;
  port: boolean;
  walls: boolean;
  population: number;
  river: boolean;
}

export interface SettlementBuilding {
  id: number;
  polygon: [number, number][];
  center: [number, number];
  door: [number, number];
  kind: "house" | "keep" | "inn" | "guild";
  color: string;
}

export interface SettlementMap {
  version: 1;
  input: SettlementMapInput;
  width: 1200;
  height: 800;
  buildings: SettlementBuilding[];
  trees: [number, number, number][];
  district: { x: number; y: number; width: number; height: number };
}
