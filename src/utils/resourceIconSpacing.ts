import { boundsOverlap, type IconBounds } from "./mapIconGroups";

export interface ResourceLayoutItem extends IconBounds {
  key: number;
}

export interface ResourcePlacement extends ResourceLayoutItem {
  sourceX: number;
  sourceY: number;
  unresolved: boolean;
}

export class BoundsIndex<T extends IconBounds> {
  private buckets = new Map<string, T[]>();
  constructor(private size = 32) {}

  private keys(box: IconBounds, gap = 0): string[] {
    const keys: string[] = [];
    for (let x = Math.floor((box.x - gap) / this.size); x <= Math.floor((box.x + box.width + gap) / this.size); x++) {
      for (
        let y = Math.floor((box.y - gap) / this.size);
        y <= Math.floor((box.y + box.height + gap) / this.size);
        y++
      ) {
        keys.push(`${x}:${y}`);
      }
    }
    return keys;
  }

  add(box: T): void {
    for (const key of this.keys(box)) {
      const bucket = this.buckets.get(key) || [];
      bucket.push(box);
      this.buckets.set(key, bucket);
    }
  }

  overlaps(box: IconBounds, gap: number): T[] {
    const matches = new Set<T>();
    for (const key of this.keys(box, gap)) {
      for (const item of this.buckets.get(key) || []) if (boundsOverlap(box, item, gap)) matches.add(item);
    }
    return [...matches];
  }
}

export function spaceResourceIcons(
  items: readonly ResourceLayoutItem[],
  obstacles: readonly IconBounds[],
  terrain: readonly IconBounds[],
  gap: number,
  isAllowed: (item: ResourceLayoutItem, candidate: IconBounds) => boolean = () => true,
  options: { reserveSources?: boolean } = {}
): ResourcePlacement[] {
  const occupied = new BoundsIndex();
  const relief = new BoundsIndex();
  const sources = new BoundsIndex<ResourceLayoutItem>();
  if (options.reserveSources) for (const item of items) sources.add(item);
  for (const box of obstacles) occupied.add(box);
  for (const box of terrain) relief.add(box);
  const placements: ResourcePlacement[] = [];
  for (const item of [...items].sort((a, b) => a.key - b.key)) {
    const step = Math.max(2, Math.min(item.width, item.height) / 2);
    const maximum = Math.max(item.width, item.height) * 6 + gap;
    let best: IconBounds | undefined;
    let bestScore = Infinity;
    for (let ring = 0; ring <= Math.ceil(maximum / step); ring++) {
      for (let dx = -ring; dx <= ring; dx++) {
        for (let dy = -ring; dy <= ring; dy++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
          const distance = Math.hypot(dx * step, dy * step);
          if (distance > maximum) continue;
          const candidate = { ...item, x: item.x + dx * step, y: item.y + dy * step };
          if (sources.overlaps(candidate, gap).some(source => source.key !== item.key)) continue;
          if (occupied.overlaps(candidate, gap).length || !isAllowed(item, candidate)) continue;
          const score = relief.overlaps(candidate, gap).length * step * 4 + distance;
          if (score >= bestScore) continue;
          best = candidate;
          bestScore = score;
        }
      }
      if (ring * step > bestScore) break;
    }
    const placement = { ...item, ...best, sourceX: item.x, sourceY: item.y, unresolved: !best };
    occupied.add(placement);
    placements.push(placement);
  }
  return placements;
}
