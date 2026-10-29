import type { Marker } from "@/generators/markers-generator";

export interface AnchoredObjectGroup {
  key: string;
  x: number;
  y: number;
  burgId?: number;
  markers: Marker[];
}

/** A cell association alone never snaps a manually moved place to a nearby city. */
export function anchoredMapObjects(
  markers: readonly Marker[],
  burgs: readonly { i: number; x: number; y: number; removed?: boolean }[],
  cellBurgs: ArrayLike<number>
): AnchoredObjectGroup[] {
  const result = new Map<string, AnchoredObjectGroup>();
  for (const marker of markers) {
    if (![marker.x, marker.y].every(Number.isFinite)) continue;
    const burg = burgs[cellBurgs[marker.cell]];
    const home = burg?.i && !burg.removed && Math.hypot(burg.x - marker.x, burg.y - marker.y) <= 0.5 ? burg : undefined;
    const key = home ? `burg:${home.i}` : `point:${marker.x}:${marker.y}`;
    const group = result.get(key) || {
      key,
      x: home?.x ?? marker.x,
      y: home?.y ?? marker.y,
      burgId: home?.i,
      markers: []
    };
    group.markers.push(marker);
    result.set(key, group);
  }
  return [...result.values()];
}
