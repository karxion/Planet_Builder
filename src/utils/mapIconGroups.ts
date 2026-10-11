export interface IconBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IconGroup<T extends IconBounds> extends IconBounds {
  items: T[];
}

export const ICON_GROUP_WIDTH = 42;
export const ICON_GROUP_HEIGHT = 26;

export function boundsOverlap(a: IconBounds, b: IconBounds, gap = 1): boolean {
  return (
    a.x < b.x + b.width + gap && a.x + a.width + gap > b.x && a.y < b.y + b.height + gap && a.y + a.height + gap > b.y
  );
}

export function groupMapIcons<T extends IconBounds>(items: T[], fixedObstacles: IconBounds[] = []): IconGroup<T>[] {
  const valid = items
    .filter(item => Number.isFinite(item.x + item.y + item.width + item.height) && item.width > 0 && item.height > 0)
    .sort((a, b) => a.x - b.x || a.y - b.y);
  const groups = valid.map(item => ({ x: item.x, y: item.y, width: item.width, height: item.height, items: [item] }));
  const parents = groups.map((_, index) => index);
  const counts = groups.map(() => 1);
  const extents = groups.map(group => ({ ...group }));
  const root = (index: number): number => {
    while (parents[index] !== index) {
      parents[index] = parents[parents[index]];
      index = parents[index];
    }
    return index;
  };
  const buckets = new Map<string, number[]>();
  groups.forEach((group, index) => {
    const checked = new Set<number>();
    for (let x = Math.floor((group.x - 4) / 64); x <= Math.floor((group.x + group.width + 4) / 64); x++) {
      for (let y = Math.floor((group.y - 4) / 64); y <= Math.floor((group.y + group.height + 4) / 64); y++) {
        const key = `${x},${y}`;
        const bucket = buckets.get(key) || [];
        for (const other of bucket) {
          if (checked.has(other)) continue;
          checked.add(other);
          if (!boundsOverlap(group, groups[other])) continue;
          const a = root(index),
            b = root(other);
          if (a !== b) {
            const x = Math.min(extents[a].x, extents[b].x);
            const y = Math.min(extents[a].y, extents[b].y);
            const right = Math.max(extents[a].x + extents[a].width, extents[b].x + extents[b].width);
            const bottom = Math.max(extents[a].y + extents[a].height, extents[b].y + extents[b].height);
            // A chain of adjacent sites must not turn an entire continent into one group.
            if ((right - x > 80 || bottom - y > 80) && counts[a] + counts[b] > 2) continue;
            parents[a] = b;
            counts[b] += counts[a];
            extents[b] = { x, y, width: right - x, height: bottom - y, items: [] };
          }
        }
        bucket.push(index);
        buckets.set(key, bucket);
      }
    }
  });
  const components = new Map<number, T[]>();
  groups.forEach((group, index) => {
    const key = root(index);
    const members = components.get(key) || [];
    members.push(...group.items);
    components.set(key, members);
  });
  const result = Array.from(components.values(), members => {
    if (members.length === 1) return { ...members[0], items: members };
    const x = members.reduce((sum, item) => sum + item.x + item.width / 2, 0) / members.length;
    const y = members.reduce((sum, item) => sum + item.y + item.height / 2, 0) / members.length;
    return {
      x: x - ICON_GROUP_WIDTH / 2,
      y: y - ICON_GROUP_HEIGHT / 2,
      width: ICON_GROUP_WIDTH,
      height: ICON_GROUP_HEIGHT,
      items: members
    };
  });
  // Keep original single sites in place; move only grouped badges to the nearest free position.
  const occupied: IconBounds[] = result.filter(group => group.items.length === 1);
  for (const group of result.filter(group => group.items.length > 1)) {
    const originalX = group.x,
      originalY = group.y;
    let found = false;
    for (let ring = 0; !found; ring++) {
      for (let dx = -ring; dx <= ring && !found; dx++) {
        for (let dy = -ring; dy <= ring; dy++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
          group.x = originalX + dx * 12;
          group.y = originalY + dy * 12;
          if (occupied.some(other => boundsOverlap(group, other))) continue;
          if (fixedObstacles.some(other => boundsOverlap(group, other, 6))) continue;
          found = true;
          break;
        }
      }
    }
    occupied.push(group);
  }
  return result;
}
