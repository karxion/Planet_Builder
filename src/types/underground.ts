export const UNDERGROUND_LEVELS = ["upper", "middle", "deep"] as const;
export type UndergroundLevelId = (typeof UNDERGROUND_LEVELS)[number];
/** 0 = solid rock, 1 = dry cavern/tunnel, 2 = water, 3 = lava. */
export type UndergroundCell = 0 | 1 | 2 | 3 | 4 | 5;
export type UndergroundMode = "tunnels" | "hollow";
export interface UndergroundSurface {
  columns: number;
  rows: number;
  heights: number[];
}
export interface UndergroundLayer {
  id: UndergroundLevelId;
  cells: UndergroundCell[];
  /** Height relative to the inner sea, derived from inverse surface relief. */
  elevations?: number[];
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
  /** Missing on legacy files, which retain the tunnel-network interpretation. */
  mode?: UndergroundMode;
  surfaceInverted?: boolean;
}
