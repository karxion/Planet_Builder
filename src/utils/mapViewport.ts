export interface MapFitTransform {
  x: number;
  y: number;
  k: number;
}

export function getMapFitTransform(
  mapWidth: number,
  mapHeight: number,
  viewportWidth: number,
  viewportHeight: number
): MapFitTransform {
  const k = Math.max(viewportWidth / mapWidth, viewportHeight / mapHeight);
  return { k, x: (viewportWidth - mapWidth * k) / 2, y: (viewportHeight - mapHeight * k) / 2 };
}
