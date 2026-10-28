import type { UndergroundSurface } from "@/types/underground";

/** Surface mountains become low inner basins; surface oceans become inner uplands. */
export function inverseSurface(surface: UndergroundSurface, columns: number, rows: number): number[] {
  if (
    !Number.isInteger(surface.columns) ||
    !Number.isInteger(surface.rows) ||
    surface.columns < 1 ||
    surface.rows < 1 ||
    surface.columns > 512 ||
    surface.rows > 512 ||
    !Array.isArray(surface.heights) ||
    surface.heights.length !== surface.columns * surface.rows ||
    !Array.from(surface.heights).every(h => Number.isFinite(h) && h >= 0 && h <= 100)
  )
    throw new Error("지상 지형 표본을 확인하세요.");
  return Array.from({ length: columns * rows }, (_, i) => {
    const x = Math.min(surface.columns - 1, Math.floor((((i % columns) + 0.5) / columns) * surface.columns));
    const y = Math.min(surface.rows - 1, Math.floor(((Math.floor(i / columns) + 0.5) / rows) * surface.rows));
    const h = surface.heights[y * surface.columns + x];
    return h < 20 ? Math.round(((20 - h) / 20) * 3000) : -Math.max(1, Math.round(((h - 20) / 80) * 5000));
  });
}

/** Bounded A* routing. Tunnels prefer inverse lowlands; inner-world routes prefer dry land. */
export function undergroundRoute(
  columns: number,
  rows: number,
  start: number,
  end: number,
  cost: (index: number) => number
): number[] {
  interface Entry {
    index: number;
    distance: number;
    priority: number;
  }
  const heap: Entry[] = [],
    distances = new Float64Array(columns * rows).fill(Infinity),
    previous = new Int32Array(columns * rows).fill(-1);
  const push = (entry: Entry) => {
    let i = heap.length;
    heap.push(entry);
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent].priority <= entry.priority) break;
      heap[i] = heap[parent];
      i = parent;
    }
    heap[i] = entry;
  };
  const pop = () => {
    const head = heap[0],
      tail = heap.pop()!;
    if (heap.length) {
      let i = 0;
      while (i * 2 + 1 < heap.length) {
        let child = i * 2 + 1;
        if (child + 1 < heap.length && heap[child + 1].priority < heap[child].priority) child++;
        if (heap[child].priority >= tail.priority) break;
        heap[i] = heap[child];
        i = child;
      }
      heap[i] = tail;
    }
    return head;
  };
  const heuristic = (i: number) =>
    Math.abs((i % columns) - (end % columns)) + Math.abs(Math.floor(i / columns) - Math.floor(end / columns));
  distances[start] = 0;
  push({ index: start, distance: 0, priority: heuristic(start) });
  while (heap.length) {
    const entry = pop(),
      i = entry.index;
    if (entry.distance !== distances[i]) continue;
    if (i === end) break;
    const x = i % columns,
      y = Math.floor(i / columns);
    for (const n of [
      x ? i - 1 : -1,
      x < columns - 1 ? i + 1 : -1,
      y ? i - columns : -1,
      y < rows - 1 ? i + columns : -1
    ]) {
      if (n < 0) continue;
      const next = entry.distance + cost(n);
      if (next >= distances[n]) continue;
      distances[n] = next;
      previous[n] = i;
      push({ index: n, distance: next, priority: next + heuristic(n) });
    }
  }
  if (!Number.isFinite(distances[end])) return [];
  const route = [end];
  while (route.at(-1) !== start) route.push(previous[route.at(-1)!]);
  return route.reverse();
}
