export interface MapFitTransform {
  x: number;
  y: number;
  k: number;
}

export function getMapFitTransform(
  mapWidth: number,
  mapHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  mode: "cover" | "contain" = "cover"
): MapFitTransform {
  const k = (mode === "contain" ? Math.min : Math.max)(viewportWidth / mapWidth, viewportHeight / mapHeight);
  return { k, x: (viewportWidth - mapWidth * k) / 2, y: (viewportHeight - mapHeight * k) / 2 };
}

/** Browser chrome/keyboard may reduce the visible area without changing layout size. */
export function getMapViewport(
  width: number,
  height: number,
  headerHeight: number,
  visual?: { width: number; height: number; scale: number } | null
): { width: number; height: number } {
  const visible = visual?.scale === 1 ? visual : { width, height };
  return {
    width: Math.max(1, Math.floor(Math.min(width, visible.width))),
    height: Math.max(1, Math.floor(Math.min(height, visible.height) - headerHeight))
  };
}
