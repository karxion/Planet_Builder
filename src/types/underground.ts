export const UNDERGROUND_LEVELS = ["upper", "middle", "deep"] as const;
export type UndergroundLevelId = (typeof UNDERGROUND_LEVELS)[number];
/** 0 = solid rock, 1 = dry cavern/tunnel, 2 = water, 3 = lava. */
export type UndergroundCell = 0 | 1 | 2 | 3;
export interface UndergroundLayer {
  id: UndergroundLevelId;
  cells: UndergroundCell[];
}
export interface UndergroundMap {
  version: 1;
  seed: string;
  generation: number;
  activeLevel: UndergroundLevelId;
  columns: number;
  rows: number;
  chambers: number;
  levels: UndergroundLayer[];
}
