export type BorderRelation = "war" | "hostile" | "neutral" | "friendly" | "alliance" | "blood" | "vassal";
export interface DiplomaticState {
  i: number;
  name: string;
  fullName?: string;
  removed?: boolean;
  diplomacy?: string[];
}
export interface BorderGeometry {
  cells: { h: ArrayLike<number>; state: ArrayLike<number> };
  vertices: { p: [number, number][]; v: number[][]; c: number[][] };
  states: DiplomaticState[];
}
export interface BorderAnchor {
  a: number;
  b: number;
  x: number;
  y: number;
  length: number;
}
