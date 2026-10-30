export type SeabedTerrain = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export interface SeabedFeature {
  kind: SeabedTerrain;
  x: number;
  y: number;
  /** Relief above the surrounding floor; not depth below sea level. */
  relief?: number;
  baseDepth?: number;
  summitDepth?: number;
  margin?: "active" | "passive";
  /** Main canyon axis length in sampling cells, not kilometres. */
  lengthCells?: number;
  tributaries?: number;
  spreading?: "slow" | "fast";
}
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
  /** Primary display class: legacy 0–6, geomorphology 7–15, v4 sand waves 16. */
  terrain: SeabedTerrain[];
  /** Zero = unclaimed; otherwise 1-based index into factionIds. */
  owners: number[];
  factionIds: string[];
  view: "combined" | "terrain" | "political";
  geologyVersion?: 2 | 3 | 4;
  features?: SeabedFeature[];
}
