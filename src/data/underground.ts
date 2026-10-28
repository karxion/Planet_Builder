import { getUiLanguage } from "@/services/ui-language";
import {
  UNDERGROUND_LEVELS,
  type UndergroundCell,
  type UndergroundLevelId,
  type UndergroundMap
} from "@/types/underground";
import type { SpaceSite, WorldSpacesData } from "@/types/world-spaces";

export const UNDERGROUND_DEPTHS: Record<UndergroundLevelId, number> = { upper: 300, middle: 1500, deep: 4000 };
export const HOLLOW_REFERENCE_DEPTH = 40000;
export const undergroundIndex = (map: UndergroundMap, x: number, y: number) =>
  Math.min(map.rows - 1, Math.max(0, Math.floor(y * map.rows))) * map.columns +
  Math.min(map.columns - 1, Math.max(0, Math.floor(x * map.columns)));
export const undergroundModeLabel = (mode: "tunnels" | "hollow") =>
  getUiLanguage() === "ko"
    ? mode === "hollow"
      ? "공동 세계형"
      : "거대 터널형"
    : mode === "hollow"
      ? "Hollow world"
      : "Continental tunnels";
export const undergroundLevel = (depth: number): UndergroundLevelId =>
  depth < 750 ? "upper" : depth < 2500 ? "middle" : "deep";
export const undergroundLabel = (id: UndergroundLevelId): string =>
  (getUiLanguage() === "ko"
    ? { upper: "얕은 지저", middle: "중층 지저", deep: "심층 지저" }
    : { upper: "Upper caverns", middle: "Middle caverns", deep: "Deep caverns" })[id];
export const siteInActiveLevel = (site: SpaceSite, data: WorldSpacesData): boolean =>
  site.space === data.activeSpace &&
  (site.space !== "underground" ||
    !data.underground ||
    data.underground.mode === "hollow" ||
    undergroundLevel(site.depth) === data.underground.activeLevel);

export function isUndergroundMap(value: unknown): value is UndergroundMap {
  if (!value || typeof value !== "object") return false;
  const m = value as UndergroundMap;
  if (m.mode !== undefined && !["tunnels", "hollow"].includes(m.mode)) return false;
  if (m.surfaceInverted !== undefined && typeof m.surfaceInverted !== "boolean") return false;
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
    m.levels.length === (m.mode === "hollow" ? 1 : 3) &&
    new Set(m.levels.map(l => l?.id)).size === m.levels.length &&
    (m.mode !== "hollow" || (m.activeLevel === "upper" && m.levels[0]?.id === "upper")) &&
    Array.from(m.levels).every(
      l =>
        l &&
        UNDERGROUND_LEVELS.includes(l.id) &&
        Array.isArray(l.cells) &&
        l.cells.length === m.columns * m.rows &&
        Array.from(l.cells).every(c => Number.isInteger(c) && c >= 0 && c <= (m.mode === "hollow" ? 5 : 3)) &&
        (l.elevations === undefined ||
          (Array.isArray(l.elevations) &&
            l.elevations.length === m.columns * m.rows &&
            Array.from(l.elevations).every(e => Number.isInteger(e) && e >= -10000 && e <= 10000)))
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
    ![0, 1, 2, 3, ...(map.mode === "hollow" ? [4, 5] : [])].includes(terrain)
  )
    throw new Error("Invalid underground brush");
  const cells = map.levels.find(level => level.id === map.activeLevel)!.cells;
  const elevations = map.levels.find(level => level.id === map.activeLevel)!.elevations;
  const cx = Math.min(map.columns - 1, Math.floor(x * map.columns));
  const cy = Math.min(map.rows - 1, Math.floor(y * map.rows));
  for (let row = Math.max(0, cy - radius); row <= Math.min(map.rows - 1, cy + radius); row++)
    for (let column = Math.max(0, cx - radius); column <= Math.min(map.columns - 1, cx + radius); column++)
      if ((column - cx) ** 2 + (row - cy) ** 2 <= radius ** 2) {
        const i = row * map.columns + column;
        cells[i] = terrain;
        if (map.mode === "hollow" && elevations && terrain !== 0)
          elevations[i] = ({ 1: 200, 2: -500, 3: 100, 4: 2200, 5: 600 } as Record<number, number>)[terrain];
      }
}
