export type SeabedTerrain = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type SeaRelationStatus = "allied" | "trade" | "neutral" | "rival" | "war";
export interface SeaRelation {
  from: string;
  to: string;
  status: SeaRelationStatus;
}
export interface UnderwaterMap {
  version: 1;
  seed: string;
  generation: number;
  columns: number;
  rows: number;
  /** Metres below sea level. Zero denotes land. */
  depths: number[];
  /** Land / shelf / slope / abyss / trench / ridge / reef. */
  terrain: SeabedTerrain[];
  /** Zero = unclaimed; otherwise 1-based index into factionIds. */
  owners: number[];
  factionIds: string[];
  view: "combined" | "terrain" | "political";
}
