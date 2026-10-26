import type { BattleMapPreset, BattleMapRatio, BattleMapSettings } from "@/types/battle-map";

export const BATTLE_PRESETS: Record<BattleMapPreset, number> = { small: 25, medium: 48, large: 72 };
export const BATTLE_GRID_UNIT = 10;
export const MAX_BATTLE_AXIS = 256;
export const MAX_BATTLE_PIXELS = 32 * 1024 * 1024;
export function battleRows(columns: number, ratio: Exclude<BattleMapRatio, "custom"> = "16:9"): number {
  const [x, y] = ratio.split(":").map(Number);
  return Math.max(1, Math.round((columns * y) / x));
}
export function battlePreset(preset: BattleMapPreset): BattleMapSettings {
  return { columns: BATTLE_PRESETS[preset], rows: battleRows(BATTLE_PRESETS[preset]), cellPixels: 64 };
}
export function isBattleMapSettings(value: unknown): value is BattleMapSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  const integer = (n: unknown, min: number, max: number): n is number =>
    typeof n === "number" && Number.isSafeInteger(n) && n >= min && n <= max;
  return (
    integer(v.columns, 8, MAX_BATTLE_AXIS) &&
    integer(v.rows, 8, MAX_BATTLE_AXIS) &&
    integer(v.cellPixels, 16, 128) &&
    v.columns * v.cellPixels <= 8192 &&
    v.rows * v.cellPixels <= 8192 &&
    v.columns * v.rows * v.cellPixels ** 2 <= MAX_BATTLE_PIXELS
  );
}
export function assertBattleMapSettings(value: BattleMapSettings): void {
  if (!isBattleMapSettings(value))
    throw new Error(
      "전투지도는 가로·세로 8~256칸, 한 칸 16~128px입니다. 출력은 한 변 8192px·총 32Mpx 이하로 설정하세요. 큰 지도는 칸 해상도를 낮춰 주세요."
    );
}
export function battleTravel(settings: BattleMapSettings): { feet: number; walk: number; dash: number } {
  const feet = (settings.columns - 1) * 5;
  return { feet, walk: Math.ceil(feet / 30), dash: Math.ceil(feet / 60) };
}
/** Center on an encounter, aligning the crop and the grid to complete squares. */
export function battleBox(settings: BattleMapSettings, center: { x: number; y: number }, unit = BATTLE_GRID_UNIT) {
  assertBattleMapSettings(settings);
  const width = settings.columns * unit,
    height = settings.rows * unit;
  return {
    x: Math.round((center.x - width / 2) / unit) * unit,
    y: Math.round((center.y - height / 2) / unit) * unit,
    width,
    height
  };
}
