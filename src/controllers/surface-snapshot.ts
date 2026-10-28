import type { UndergroundSurface } from "@/types/underground";
import { findGridCell } from "@/utils/graphUtils";

/** Read the current surface without changing it; all spaces share normalized coordinates. */
export function sampleSurfaceGrid(columns: number, rows: number, marineOnly = false): UndergroundSurface {
  if (typeof grid === "undefined" || !grid.cells?.h?.length || typeof graphWidth === "undefined")
    throw new Error("지상 지도가 준비되지 않았습니다.");
  const heights = Array.from({ length: columns * rows }, (_, i) => {
    const cell = findGridCell(
      (((i % columns) + 0.5) / columns) * graphWidth,
      ((Math.floor(i / columns) + 0.5) / rows) * graphHeight,
      grid
    );
    return marineOnly && grid.features?.[grid.cells.f[cell]]?.type === "lake" ? 20 : Number(grid.cells.h[cell]);
  });
  return { columns, rows, heights };
}
