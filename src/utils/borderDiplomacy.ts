import { BORDER_RELATIONS } from "@/data/border-diplomacy";
import type { BorderAnchor, BorderGeometry, BorderRelation, DiplomaticState } from "@/types/border-diplomacy";

type Edge = [number, number];

export function sharedBorderAnchors(graph: BorderGeometry): BorderAnchor[] {
  const active = new Set(graph.states.filter(state => state.i && !state.removed).map(state => state.i));
  const pairs = new Map<string, { a: number; b: number; edges: Edge[] }>();
  const { cells, vertices } = graph;
  for (let start = 0; start < vertices.p.length; start++) {
    for (const end of vertices.v[start] || []) {
      if (end <= start || !vertices.p[end]) continue;
      const shared = (vertices.c[start] || []).filter(
        cell => cell >= 0 && cell < cells.h.length && cells.h[cell] >= 20 && (vertices.c[end] || []).includes(cell)
      );
      if (shared.length !== 2) continue;
      const [a, b] = shared.map(cell => cells.state[cell]).sort((a, b) => a - b);
      if (a === b || !active.has(a) || !active.has(b)) continue;
      const key = `${a}:${b}`;
      if (!pairs.has(key)) pairs.set(key, { a, b, edges: [] });
      pairs.get(key)!.edges.push([start, end]);
    }
  }
  const anchors: BorderAnchor[] = [];
  for (const { a, b, edges } of pairs.values()) {
    const adjacency = new Map<number, number[]>();
    edges.forEach(([u, v], index) => {
      for (const vertex of [u, v]) adjacency.set(vertex, [...(adjacency.get(vertex) || []), index]);
    });
    const visited = new Set<number>();
    let longest: number[] = [];
    let longestLength = 0;
    const trace = (start: number, first: number) => {
      const chain = [start];
      let current = start;
      let edge: number | undefined = first;
      let length = 0;
      while (edge !== undefined && !visited.has(edge)) {
        visited.add(edge);
        const [u, v] = edges[edge];
        const next = current === u ? v : u;
        length += Math.hypot(
          vertices.p[next][0] - vertices.p[current][0],
          vertices.p[next][1] - vertices.p[current][1]
        );
        chain.push(next);
        current = next;
        if (adjacency.get(current)!.length !== 2) break;
        edge = adjacency.get(current)!.find(index => !visited.has(index));
      }
      if (length > longestLength) {
        longestLength = length;
        longest = chain;
      }
    };
    // Open chains first; remaining unvisited edges belong to closed enclaves.
    for (const [vertex, indices] of adjacency)
      if (indices.length !== 2) for (const index of indices) trace(vertex, index);
    edges.forEach(([vertex], index) => {
      if (!visited.has(index)) trace(vertex, index);
    });
    if (!longestLength) continue;
    let remaining = longestLength / 2;
    for (let i = 1; i < longest.length; i++) {
      const from = vertices.p[longest[i - 1]],
        to = vertices.p[longest[i]];
      const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
      if (length > 0 && remaining <= length) {
        const ratio = remaining / length;
        anchors.push({
          a,
          b,
          x: from[0] + (to[0] - from[0]) * ratio,
          y: from[1] + (to[1] - from[1]) * ratio,
          length: longestLength
        });
        break;
      }
      remaining -= length;
    }
  }
  return anchors.sort((left, right) => left.a - right.a || left.b - right.b);
}

export function setBorderRelation(
  states: DiplomaticState[],
  a: number,
  b: number,
  kind: BorderRelation,
  dependent = a
): boolean {
  const first = states.find(state => state.i === a && !state.removed);
  const second = states.find(state => state.i === b && !state.removed);
  if (!a || !b || a === b || !first || !second || !Object.hasOwn(BORDER_RELATIONS, kind)) return false;
  if (kind === "vassal") {
    if (dependent !== a && dependent !== b) return false;
    const parent = dependent === a ? b : a;
    const seen = new Set<number>();
    let current: number | undefined = parent;
    while (current !== undefined && !seen.has(current)) {
      if (current === dependent) return false;
      seen.add(current);
      const state = states.find(value => value.i === current);
      const next: number | undefined = state?.diplomacy?.findIndex(status => status === "Vassal");
      current = next !== undefined && next > 0 ? next : undefined;
    }
    if (current !== undefined) return false;
    const child = dependent === a ? first : second;
    // A state has at most one overlord, as expected by the legacy diplomacy engine.
    child.diplomacy?.forEach((status, id) => {
      if (status !== "Vassal" || id === parent) return;
      child.diplomacy![id] = "Neutral";
      const old = states.find(state => state.i === id);
      if (old?.diplomacy) old.diplomacy[dependent] = "Neutral";
    });
    first.diplomacy ??= [];
    second.diplomacy ??= [];
    first.diplomacy[b] = dependent === a ? "Vassal" : "Suzerain";
    second.diplomacy[a] = dependent === a ? "Suzerain" : "Vassal";
  } else {
    first.diplomacy ??= [];
    second.diplomacy ??= [];
    first.diplomacy[b] = second.diplomacy[a] = BORDER_RELATIONS[kind].legacy;
  }
  return true;
}
