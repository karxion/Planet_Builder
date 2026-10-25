import type { CampaignWorld, WorldNpc } from "./campaign-world";
import type { WorldMagicItem } from "./world-item";

export type DataExportScope = "filtered" | "selected" | "all";
export interface DataExportOptions {
  language: "ko" | "en";
  includePrivate: boolean;
  includeImages: boolean;
}
export interface ExportCard {
  name: string;
  image?: string;
  fields: [string, string][];
}
export interface WorldDataExport {
  kind: "npcs" | "items";
  title: string;
  payload: object;
  columns: [string, string][];
  rows: Record<string, string>[];
  cards: ExportCard[];
  attribution: string;
}
export type WorldDataExportSource = {
  world: CampaignWorld;
  hasDrafts?: boolean;
} & (
  | { kind: "npcs"; all: WorldNpc[]; filtered: WorldNpc[]; selected: WorldNpc[] }
  | { kind: "items"; all: WorldMagicItem[]; filtered: WorldMagicItem[]; selected: WorldMagicItem[] }
);
