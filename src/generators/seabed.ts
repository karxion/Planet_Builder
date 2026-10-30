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
  const rng = Alea(`${seed.trim()}:geomorphology-v3`),
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
  // Harris et al. (2014): passive shelves are wider, active slopes narrower.
  // Cell widths express that tendency; the study's kilometre averages are not a world scale.
  const shelfWidth = (i: number) =>
    (active(i) ? 1.4 : 3.8) + Math.sin((i % w) * 0.08 + phase) * (active(i) ? 0.25 : 0.5);
  const slopeWidth = (i: number) => (active(i) ? 1.8 : 2.4);
  const terrain: SeabedTerrain[] = Array(size).fill(0);
  const depths = heights.map((_, i) => {
    if (!water[i]) return 0;
    const d = Number.isFinite(distance[i]) ? distance[i] : 20;
    const shelf = shelfWidth(i),
      slope = slopeWidth(i);
    if (d <= shelf) {
      terrain[i] = 1;
      return Math.round(35 + (d / shelf) * 160);
    }
    if (d <= shelf + slope) {
      terrain[i] = 2;
      return Math.round(200 + ((d - shelf) / slope) * 2400);
    }
    if (!active(i) && d < shelf + slope + 3.5) {
      terrain[i] = 7;
      return Math.round(2600 + ((d - shelf - slope) / 3.5) * 1400);
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
  // Harris & Whiteway (2011): canyons occur at BOTH margin types. Active systems
  // tend to be shorter, more closely spaced and more dendritic; these are design biases.
  for (const isActive of [true, false]) {
    const heads: number[] = [];
    const spacing = isActive ? 3 : 8;
    for (let c = 0; c < (isActive ? 4 : 3); c++) {
      const start = pick(
        i =>
          terrain[i] === 2 &&
          active(i) === isActive &&
          heads.every(j => Math.hypot((i % w) - (j % w), Math.floor(i / w) - Math.floor(j / w)) >= spacing)
      );
      if (start < 0) continue;
      const axis: number[] = [];
      let current = start;
      for (let step = 0; step < (isActive ? 4 : 8); step++) {
        axis.push(current);
        const next = neighbors(current).filter(
          n => water[n] && [2, 3, 7].includes(terrain[n]) && active(n) === isActive && distance[n] > distance[current]
        );
        if (!next.length || step === (isActive ? 3 : 7)) break;
        current = next.reduce((a, b) => (distance[a] > distance[b] ? a : b));
      }
      if (axis.length < 2) continue;
      heads.push(start);
      const incise = (i: number, amount: number) => {
        if (terrain[i] === 8) return;
        terrain[i] = 8;
        depths[i] = Math.min(5800, depths[i] + amount);
      };
      for (const [step, i] of axis.entries()) incise(i, 350 + step * 40);
      const g = gradient(start),
        join = axis[1];
      let tributaries = 0;
      for (const side of isActive ? [-1, 1] : c % 2 ? [1] : []) {
        const branchHead = at((start % w) - g.y * side * 2, Math.floor(start / w) + g.x * side * 2);
        if (branchHead < 0 || ![1, 2].includes(terrain[branchHead]) || active(branchHead) !== isActive) continue;
        const branch = [branchHead];
        const toJoin = (i: number) => Math.hypot((i % w) - (join % w), Math.floor(i / w) - Math.floor(join / w));
        while (branch.at(-1) !== join && branch.length < 7) {
          const i = branch.at(-1)!;
          const next = neighbors(i).filter(n => water[n] && [1, 2, 7, 8].includes(terrain[n]) && toJoin(n) < toJoin(i));
          if (!next.length) break;
          branch.push(next.reduce((a, b) => (toJoin(a) < toJoin(b) ? a : b)));
        }
        if (branch.at(-1) !== join || branch.length < 3) continue;
        for (const i of branch) incise(i, 300);
        tributaries++;
      }
      describe(8, start, { margin: isActive ? "active" : "passive", lengthCells: axis.length, tributaries });
      // A depositional lobe can occur at either type; passive-margin fans are broader here.
      {
        const g = gradient(current),
          cx = (current % w) + g.x * 1.5,
          cy = Math.floor(current / w) + g.y * 1.5,
          radius = isActive ? 1.5 : 3;
        for (let y = Math.floor(cy - radius); y <= cy + radius; y++)
          for (let x = Math.floor(cx - radius); x <= cx + radius; x++) {
            const i = at(x, y);
            if (i < 0 || !water[i] || ![3, 7].includes(terrain[i])) continue;
            const dx = x - cx,
              dy = y - cy;
            if (dx * dx + dy * dy <= radius * radius && dx * g.x + dy * g.y >= -1) {
              terrain[i] = 12;
              depths[i] = Math.max(2400, depths[i] - 120);
            }
          }
        const fan = at(cx, cy);
        if (fan >= 0 && terrain[fan] === 12) describe(12, fan);
      }
    }
  }
  // Broad volcanic ridges rise 2–4km above abyssal floor. Axial rifts are depressions between shoulders.
  for (let r = 0; r < 2; r++) {
    const start = pick(i => terrain[i] === 3 && distance[i] >= 9);
    if (start < 0) continue;
    const angle = rng() * Math.PI,
      length = Math.min(w, h) * 0.35,
      elevation = 2200 + rng() * 1000,
      spreading = r === 0 ? "slow" : "fast",
      riftWidth = spreading === "slow" ? 0.9 + rng() * 0.3 : 0.15 + rng() * 0.2;
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
      terrain[i] = across < riftWidth ? 9 : 5;
      if (terrain[i] === 9) {
        depths[i] += spreading === "slow" ? 650 : 160;
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
        summitDepth: depths[representative],
        spreading
      });
    if (rift >= 0) describe(9, rift, { spreading });
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
      if (i < 0 || !water[i] || !active(i) || distance[i] < 4 || distance[i] > 8 || [5, 8, 9, 12].includes(terrain[i]))
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
  // A separate shallow-shelf sediment motif, not a depth inferred from an icon.
  // Keep all v3 depths and existing features unchanged; only classify some remaining shelf cells.
  for (let i = 0; i < size; i++)
    if (
      terrain[i] === 1 &&
      depths[i] <= 200 &&
      Math.sin((i % w) * 0.19 + phase) * Math.cos(Math.floor(i / w) * 0.21 - phase) > 0.62
    )
      terrain[i] = 16;
  return { depths, terrain, features, water };
}
