import { getUiLanguage } from "@/services/ui-language";
import {
  UNDERGROUND_LEVELS,
  type UndergroundCell,
  type UndergroundLevelId,
  type UndergroundMap
} from "@/types/underground";
import type { SpaceSite, WorldSpacesData } from "@/types/world-spaces";

export const UNDERGROUND_DEPTHS: Record<UndergroundLevelId, number> = { upper: 300, middle: 1500, deep: 4000 };
export const undergroundLevel = (depth: number): UndergroundLevelId =>
  depth < 750 ? "upper" : depth < 2500 ? "middle" : "deep";
export const undergroundLabel = (id: UndergroundLevelId): string =>
  (getUiLanguage() === "ko"
    ? { upper: "얕은 지저", middle: "중층 지저", deep: "심층 지저" }
    : { upper: "Upper caverns", middle: "Middle caverns", deep: "Deep caverns" })[id];
export const siteInActiveLevel = (site: SpaceSite, data: WorldSpacesData): boolean =>
  site.space === data.activeSpace &&
  (site.space !== "underground" || !data.underground || undergroundLevel(site.depth) === data.underground.activeLevel);

export function isUndergroundMap(value: unknown): value is UndergroundMap {
  if (!value || typeof value !== "object") return false;
  const m = value as UndergroundMap;
  return (
    m.version === 1 &&
    typeof m.seed === "string" &&
    m.seed.trim().length > 0 &&
    m.seed.length <= 120 &&
    Number.isSafeInteger(m.generation) &&
    m.generation >= 1 &&
    Number.isInteger(m.columns) &&
    m.columns >= 24 &&
    m.columns <= 128 &&
    Number.isInteger(m.rows) &&
    m.rows >= 24 &&
    m.rows <= 128 &&
    Number.isInteger(m.chambers) &&
    m.chambers >= 12 &&
    m.chambers <= 36 &&
    UNDERGROUND_LEVELS.includes(m.activeLevel) &&
    Array.isArray(m.levels) &&
    m.levels.length === 3 &&
    new Set(m.levels.map(l => l?.id)).size === 3 &&
    Array.from(m.levels).every(
      l =>
        l &&
        UNDERGROUND_LEVELS.includes(l.id) &&
        Array.isArray(l.cells) &&
        l.cells.length === m.columns * m.rows &&
        Array.from(l.cells).every(c => Number.isInteger(c) && c >= 0 && c <= 3)
    )
  );
}

/** Applies one terrain brush dab to the active depth; callers persist the transaction. */
export function paintUnderground(
  map: UndergroundMap,
  x: number,
  y: number,
  radius: number,
  terrain: UndergroundCell
): void {
  if (
    ![x, y, radius].every(Number.isFinite) ||
    x < 0 ||
    x > 1 ||
    y < 0 ||
    y > 1 ||
    radius < 1 ||
    radius > 8 ||
    !Number.isInteger(radius) ||
    ![0, 1, 2, 3].includes(terrain)
  )
    throw new Error("Invalid underground brush");
  const cells = map.levels.find(level => level.id === map.activeLevel)!.cells;
  const cx = Math.min(map.columns - 1, Math.floor(x * map.columns));
  const cy = Math.min(map.rows - 1, Math.floor(y * map.rows));
  for (let row = Math.max(0, cy - radius); row <= Math.min(map.rows - 1, cy + radius); row++)
    for (let column = Math.max(0, cx - radius); column <= Math.min(map.columns - 1, cx + radius); column++)
      if ((column - cx) ** 2 + (row - cy) ** 2 <= radius ** 2) cells[row * map.columns + column] = terrain;
}
