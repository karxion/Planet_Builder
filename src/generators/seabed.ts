import Alea from "alea";
import type { SeabedFeature, SeabedTerrain } from "@/types/underwater";

export interface SeaSurface {
  columns: number;
  rows: number;
  heights: number[];
}
/** Morphological synthesis in a fantasy world; measured bathymetry and plate dynamics are not inferred. */
export function generateSeabed(seed: string, surface: SeaSurface) {
  const { columns: w, rows: h, heights } = surface,
    size = w * h;
  if (
    !seed.trim() ||
    seed.length > 120 ||
    !Number.isInteger(w) ||
    !Number.isInteger(h) ||
    w < 24 ||
    h < 24 ||
    w > 192 ||
    h > 192 ||
    heights.length !== size ||
    !Array.from(heights).every(v => Number.isFinite(v) && v >= 0 && v <= 100)
  )
    throw new Error("수중 생성 시드와 지상 지형을 확인하세요.");
  const water = heights.map(v => v < 20);
  if (water.filter(Boolean).length < 24) throw new Error("수중 지도를 생성할 바다가 부족합니다.");
  const rng = Alea(`${seed.trim()}:geomorphology-v2`),
    phase = rng() * Math.PI * 2;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= w || y >= h ? -1 : Math.floor(y) * w + Math.floor(x));
  const neighbors = (i: number) =>
    [
      at((i % w) - 1, Math.floor(i / w)),
      at((i % w) + 1, Math.floor(i / w)),
      at(i % w, Math.floor(i / w) - 1),
      at(i % w, Math.floor(i / w) + 1)
    ].filter(n => n >= 0);
  const distance = Array<number>(size).fill(Infinity),
    queue: number[] = [];
  water.forEach((sea, i) => {
    if (!sea) {
      distance[i] = 0;
      queue.push(i);
    }
  });
  for (let p = 0; p < queue.length; p++)
    for (const n of neighbors(queue[p]))
      if (distance[n] > distance[queue[p]] + 1) {
        distance[n] = distance[queue[p]] + 1;
        queue.push(n);
      }
  const active = (i: number) => Math.sin((i % w) * 0.055 + Math.floor(i / w) * 0.07 + phase) > 0.35;
  const terrain: SeabedTerrain[] = Array(size).fill(0);
  const depths = heights.map((_, i) => {
    if (!water[i]) return 0;
    const d = Number.isFinite(distance[i]) ? distance[i] : 20;
    const shelf = 2 + 0.5 * Math.sin((i % w) * 0.08 + phase);
    if (d <= shelf) {
      terrain[i] = 1;
      return Math.round(35 + (d / shelf) * 160);
    }
    if (d <= shelf + 2.5) {
      terrain[i] = 2;
      return Math.round(200 + ((d - shelf) / 2.5) * 2400);
    }
    if (!active(i) && d < shelf + 6) {
      terrain[i] = 7;
      return Math.round(2600 + ((d - shelf - 2.5) / 3.5) * 1400);
    }
    terrain[i] = 3;
    return Math.round(4400 + 100 * Math.sin((i % w) * 0.07 + phase) + 80 * Math.cos(Math.floor(i / w) * 0.09));
  });
  const features: SeabedFeature[] = [];
  const describe = (kind: SeabedTerrain, i: number, extra: Partial<SeabedFeature> = {}) => {
    features.push({ kind, x: ((i % w) + 0.5) / w, y: (Math.floor(i / w) + 0.5) / h, ...extra });
  };
  const pick = (predicate: (i: number) => boolean) => {
    const candidates = depths.map((_, i) => i).filter(predicate);
    return candidates.length ? candidates[Math.floor(rng() * candidates.length)] : -1;
  };
  const gradient = (i: number) => {
    const x = i % w,
      y = Math.floor(i / w),
      d = (x: number, y: number) => {
        const n = at(x, y);
        return n < 0 || !Number.isFinite(distance[n]) ? distance[i] : distance[n];
      };
    const gx = d(x + 1, y) - d(x - 1, y),
      gy = d(x, y + 1) - d(x, y - 1),
      length = Math.hypot(gx, gy) || 1;
    return { x: gx / length, y: gy / length };
  };
  // Incisions follow the seaward gradient down the slope; sediment fans lie at their foot.
  for (let c = 0; c < 6; c++) {
    const start = pick(i => terrain[i] === 2 && distance[i] < 4 && !active(i));
    if (start < 0) continue;
    let current = start;
    const visited = new Set<number>();
    for (let step = 0; step < 9; step++) {
      visited.add(current);
      terrain[current] = 8;
      depths[current] = Math.min(5800, depths[current] + 350 + step * 40);
      const next = neighbors(current).filter(n => water[n] && !visited.has(n) && distance[n] > distance[current]);
      if (!next.length || distance[current] >= 7) break;
      current = next.reduce((a, b) => (distance[a] > distance[b] ? a : b));
    }
    describe(8, start);
    if (!active(current)) {
      const g = gradient(current),
        cx = (current % w) + g.x * 1.5,
        cy = Math.floor(current / w) + g.y * 1.5;
      for (let y = Math.floor(cy - 3); y <= cy + 3; y++)
        for (let x = Math.floor(cx - 3); x <= cx + 3; x++) {
          const i = at(x, y);
          if (i < 0 || !water[i] || ![3, 7].includes(terrain[i])) continue;
          const dx = x - cx,
            dy = y - cy;
          if (dx * dx + dy * dy <= 8 && dx * g.x + dy * g.y >= -1) {
            terrain[i] = 12;
            depths[i] = Math.max(2400, depths[i] - 120);
          }
        }
      const fan = at(cx, cy);
      if (fan >= 0 && terrain[fan] === 12) describe(12, fan);
    }
  }
  // Broad volcanic ridges rise 2–4km above abyssal floor. Axial rifts are depressions between shoulders.
  for (let r = 0; r < 2; r++) {
    const start = pick(i => terrain[i] === 3 && distance[i] >= 9);
    if (start < 0) continue;
    const angle = rng() * Math.PI,
      length = Math.min(w, h) * 0.35,
      elevation = 2200 + rng() * 1000;
    let representative = -1,
      representativeBase = 0,
      rift = -1;
    for (let i = 0; i < size; i++) {
      if (!water[i] || distance[i] < 7 || terrain[i] !== 3) continue;
      const dx = (i % w) - (start % w),
        dy = Math.floor(i / w) - Math.floor(start / w);
      const along = dx * Math.cos(angle) + dy * Math.sin(angle),
        across = Math.abs(-dx * Math.sin(angle) + dy * Math.cos(angle));
      if (Math.abs(along) > length / 2 || across > 3.5) continue;
      const base = depths[i];
      depths[i] = Math.round(Math.max(400, base - elevation * Math.min(1, (3.5 - across) / 2.4)));
      terrain[i] = across < 0.65 ? 9 : 5;
      if (terrain[i] === 9) {
        depths[i] += 650;
        rift = i;
      } else if (representative < 0 || depths[i] < depths[representative]) {
        representative = i;
        representativeBase = base;
      }
    }
    if (representative >= 0)
      describe(5, representative, {
        relief: representativeBase - depths[representative],
        baseDepth: representativeBase,
        summitDepth: depths[representative]
      });
    if (rift >= 0) describe(9, rift);
    // Fossil fracture-zone lineaments continue through the abyssal floor beside the ridge.
    for (let t = -length; t <= length; t += 0.5) {
      const i = at((start % w) - Math.sin(angle) * t, Math.floor(start / w) + Math.cos(angle) * t);
      if (i < 0 || terrain[i] !== 3 || distance[i] < 8) continue;
      terrain[i] = 15;
      depths[i] += t < 0 ? 180 : -180;
    }
  }
  // Trenches track active continental margins, rather than arbitrary axes in the open abyss.
  for (let t = 0; t < 3; t++) {
    const start = pick(
      i => water[i] && active(i) && distance[i] >= 5 && distance[i] <= 7 && [2, 3].includes(terrain[i])
    );
    if (start < 0) continue;
    const g = gradient(start),
      angle = Math.atan2(g.y, g.x) + Math.PI / 2,
      cells: number[] = [];
    for (let step = -12; step <= 12; step += 0.5) {
      let x = (start % w) + Math.cos(angle) * step,
        y = Math.floor(start / w) + Math.sin(angle) * step;
      for (let adjust = 0; adjust < 3; adjust++) {
        const i = at(x, y);
        if (i < 0) break;
        const n = gradient(i),
          offset = Math.max(-2, Math.min(2, distance[i] - 6));
        x -= n.x * offset;
        y -= n.y * offset;
      }
      const i = at(x, y);
      if (i < 0 || !water[i] || !active(i) || distance[i] < 4 || distance[i] > 8 || [5, 9].includes(terrain[i]))
        continue;
      terrain[i] = 4;
      depths[i] = Math.round(6700 + 1300 * (0.5 + 0.5 * Math.sin(step * 0.15 + phase)));
      cells.push(i);
    }
    if (cells.length) {
      describe(4, cells[Math.floor(cells.length / 2)]);
      const deep = cells[Math.floor(cells.length / 2)];
      terrain[deep] = 14;
      depths[deep] = Math.round(10000 + rng() * 900);
      describe(14, deep);
    }
  }
  // Isolated cones and wave-planed summits are distinct from ridges, with height stored separately from depth.
  for (let m = 0; m < 6; m++) {
    const center = pick(i => terrain[i] === 3 && distance[i] >= 9);
    if (center < 0) continue;
    const radius = 2.5 + rng() * 1.2,
      baseDepth = depths[center],
      relief = Math.round(1200 + rng() * 1600),
      summitDepth = baseDepth - relief,
      kind = m % 2 ? 11 : 10;
    for (let y = Math.floor(center / w - radius); y <= Math.floor(center / w) + radius; y++)
      for (let x = Math.floor((center % w) - radius); x <= (center % w) + radius; x++) {
        const i = at(x, y);
        if (i < 0 || terrain[i] !== 3 || distance[i] < 7) continue;
        const d = Math.hypot(x - (center % w), y - Math.floor(center / w)) / radius;
        if (d > 1) continue;
        const rise = kind === 11 ? Math.min(1, (1 - d) / 0.6) : 1 - d;
        terrain[i] = kind;
        depths[i] = Math.round(baseDepth - relief * rise);
      }
    describe(kind, center, { relief, baseDepth, summitDepth });
  }
  for (let field = 0; field < 3; field++) {
    const center = pick(i => terrain[i] === 3 && distance[i] > 8);
    if (center < 0) continue;
    for (let i = 0; i < size; i++) {
      if (terrain[i] !== 3 || Math.hypot((i % w) - (center % w), Math.floor(i / w) - Math.floor(center / w)) > 5)
        continue;
      const bump = Math.sin((i % w) * 0.8 + phase) * Math.cos(Math.floor(i / w) * 0.9);
      if (bump > 0.15) {
        terrain[i] = 13;
        depths[i] -= Math.round(100 + bump * 300);
      }
    }
    describe(13, center);
  }
  for (let i = 0; i < size; i++)
    if (terrain[i] === 1 && Math.sin((i % w) * 0.31 + phase) * Math.sin(Math.floor(i / w) * 0.23 - phase) > 0.5)
      terrain[i] = 6;
  return { depths, terrain, features, water };
}
