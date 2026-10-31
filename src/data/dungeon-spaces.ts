import type { Marker } from "@/generators/markers-generator";
import type { WorldSpacesData } from "@/types/world-spaces";
import { undergroundLabel } from "./underground";
import { getUiLanguage } from "@/services/ui-language";

export const markerSpace = (marker: Pick<Marker, "space">) => marker.space || "surface";
export function dungeonInSpace(marker: Pick<Marker, "space" | "levelId">, data: WorldSpacesData): boolean {
  return (
    markerSpace(marker) === data.activeSpace &&
    (data.activeSpace !== "underground" || marker.levelId === (data.underground?.activeLevel || "upper"))
  );
}
export function dungeonSpaceLabel(data: WorldSpacesData): string {
  const ko = getUiLanguage() === "ko";
  return data.activeSpace === "surface"
    ? ko
      ? "지상"
      : "Surface"
    : data.activeSpace === "underwater"
      ? ko
        ? "해저"
        : "Underwater"
      : data.underground?.mode === "hollow"
        ? ko
          ? "공동 세계"
          : "Hollow world"
        : undergroundLabel(data.underground?.activeLevel || "upper");
}
/** Returns the local floor cell, never a surface country/cell lookup. */
export function dungeonFloorCell(data: WorldSpacesData, x: number, y: number): number | undefined {
  if (![x, y].every(Number.isFinite) || x < 0.08 || x > 0.92 || y < 0.08 || y > 0.92) return;
  const map = data.activeSpace === "underwater" ? data.underwater : data.underground;
  if (!map || data.activeSpace === "surface") return;
  const i =
    Math.min(map.rows - 1, Math.floor(y * map.rows)) * map.columns +
    Math.min(map.columns - 1, Math.floor(x * map.columns));
  if ("depths" in map) return map.depths[i] > 0 ? i : undefined;
  const cell = map.levels.find(l => l.id === map.activeLevel)?.cells[i];
  return cell !== undefined && [1, 4, 5].includes(cell) ? i : undefined;
}
