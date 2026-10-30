import images from "./seabed-relief-images.json";
import { SEABED_DETAILS_EN, SEABED_TERRAINS } from "./underwater";
import { getUiLanguage } from "@/services/ui-language";
import type { UnderwaterMap } from "@/types/underwater";

export type SeabedReliefId = keyof typeof images;
export const SEABED_RELIEF_IDS = Object.keys(images) as SeabedReliefId[];
export const DEPTH_BANDS = [
  { max: 200, ko: "얕음", en: "Shallow", range: "1–200 m", color: "#b6eee1" },
  { max: 2000, ko: "중간", en: "Intermediate", range: "201–2,000 m", color: "#70c9dc" },
  { max: 6000, ko: "깊음", en: "Deep", range: "2,001–6,000 m", color: "#7298dc" },
  { max: 11000, ko: "초심해", en: "Very deep", range: "6,001 m+", color: "#b1a0e8" }
] as const;
export function depthBand(depth: number): number {
  if (!Number.isFinite(depth) || depth <= 0 || depth > 11000) throw new Error("Invalid sea-floor depth");
  return DEPTH_BANDS.findIndex(band => depth <= band.max) + 1;
}
export function seabedReliefId(kind: number): SeabedReliefId {
  const id = SEABED_RELIEF_IDS.find(id => images[id].kind === kind);
  if (!id) throw new Error("Unknown sea-floor relief");
  return id;
}
export function seabedReliefUrl(id: SeabedReliefId): string {
  const asset = images[id];
  return `${import.meta.env.BASE_URL || "/"}assets/seabed-relief/${asset.mapFile}?v=${asset.mapSha256.slice(0, 12)}`;
}
export function seabedReliefName(map: UnderwaterMap, cell: number): string {
  const terrain = SEABED_TERRAINS[map.terrain[cell]],
    ko = getUiLanguage() === "ko";
  return `${terrain[ko ? "ko" : "en"]} · ${ko ? "수심" : "Depth"} ${map.depths[cell].toLocaleString(ko ? "ko-KR" : "en-US")} m`;
}
export function seabedReliefDetails(map: UnderwaterMap, cell: number): string {
  const ko = getUiLanguage() === "ko",
    band = depthBand(map.depths[cell]),
    profile = DEPTH_BANDS[band - 1];
  return `${seabedReliefName(map, cell)} · ${ko ? "수심 단계" : "Depth band"} ${band} (${profile.range}) · ${ko ? SEABED_TERRAINS[map.terrain[cell]].description : SEABED_DETAILS_EN[map.terrain[cell]]}`;
}
