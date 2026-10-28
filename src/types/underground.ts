export const UNDERGROUND_LEVELS = ["upper", "middle", "deep"] as const;
export type UndergroundLevelId = (typeof UNDERGROUND_LEVELS)[number];
/** 0 = rock, 1 = dry ground, 2 = water, 3 = lava; hollow-only 4 = uplands, 5 = forest. */
export type UndergroundCell = 0 | 1 | 2 | 3 | 4 | 5;
export type UndergroundMode = "tunnels" | "hollow";
export type HollowIllumination = "luminous" | "dark";
export type HollowEntranceStyle = "settlements" | "polar";
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
  /** Fantasy lighting motif; not an astronomical or plant-growth simulation. */
  illumination?: HollowIllumination;
  entranceStyle?: HollowEntranceStyle;
}
