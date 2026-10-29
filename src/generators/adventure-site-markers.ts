import {
  ADVENTURE_MONSTER_BY_ID,
  ADVENTURE_THEME_BY_ID,
  adventureMonsterUrl,
  isAdventureSite
} from "@/data/adventure-sites";
import { getDungeonUrl } from "@/data/dungeon-locations";
import type { AdventureSettings, AdventureSnapshot } from "@/types/adventure-site";
import type { PackedGraph } from "@/types/PackedGraph";
import { generateAdventureSites } from "./adventure-sites";
import { generatedText as gt, generatedTemplate as gf } from "@/utils/generation-text";

interface SiteNote {
  id: string;
  name: string;
  legend: string;
}
interface AdventureMarkerInput extends Omit<PackedGraph, "cells"> {
  cells: Omit<PackedGraph["cells"], "i"> & { i: ArrayLike<number> };
}
export function populateAdventureMarkers(
  pack: AdventureMarkerInput,
  notes: SiteNote[],
  seed: string,
  dimensions: { width: number; height: number },
  settings?: AdventureSettings,
  generation = 0
) {
  const input: AdventureSnapshot = {
    ...dimensions,
    countries: pack.states
      .filter(state => state?.i && !state.removed)
      .map(state => ({ id: state.i, name: state.fullName || state.name })),
    cells: Array.from(pack.cells.i)
      .filter(cell => pack.cells.h[cell] >= 20 && !pack.cells.burg[cell])
      .map(cell => ({
        id: cell,
        stateId: pack.cells.state[cell],
        x: pack.cells.p[cell][0],
        y: pack.cells.p[cell][1],
        height: pack.cells.h[cell]
      })),
    settlements: pack.burgs
      .filter(burg => burg.i && !burg.removed)
      .map(burg => ({ x: burg.x, y: burg.y, city: Boolean(burg.capital) || (burg.population || 0) > 5 })),
    markers: pack.markers.map(marker => ({
      x: marker.x,
      y: marker.y,
      stateId: pack.cells.state[marker.cell],
      adventure: isAdventureSite(marker.adventure)
    }))
  };
  const result = generateAdventureSites(input, seed, settings, generation);
  let nextId = pack.markers.reduce((max, marker) => Math.max(max, marker.i), -1) + 1;
  if (!Number.isSafeInteger(nextId) || nextId > Number.MAX_SAFE_INTEGER - result.placements.length)
    throw new Error("Marker IDs exhausted");
  for (const placement of result.placements) {
    const theme = ADVENTURE_THEME_BY_ID.get(placement.adventure.themeId)!;
    const monster = ADVENTURE_MONSTER_BY_ID.get(placement.adventure.monsterId)!;
    const i = nextId++;
    pack.markers.push({
      i,
      cell: placement.cell,
      x: placement.x,
      y: placement.y,
      type: theme.kind === "dungeon" ? "dungeons" : "hostile-settlements",
      icon: theme.icon,
      px: 26,
      dx: 50,
      dy: 50,
      adventure: placement.adventure
    });
    notes.push({
      id: `marker${i}`,
      name: placement.name,
      legend: `<p>${gt(theme.hook)}</p><p>${gf("대표 개체: {monster} · CR {cr} · {count}개체 추정", "Representative creature: {monster} · CR {cr} · estimated population {count}", { monster: gt(monster.name), cr: monster.cr, count: placement.adventure.inhabitants })}</p><p>${gt("CR은 대표 몬스터 한 개체의 값이며 거점 전체 난이도가 아닙니다. 배치·개체 수·적대 행동은 앱의 창작 설정입니다.")}</p><p><a href="${adventureMonsterUrl(monster)}" target="_blank" rel="noopener noreferrer">SRD ${monster.edition} · p.${monster.page}</a> · <a href="${getDungeonUrl(seed, placement.cell)}" target="_blank" rel="noopener noreferrer">Watabou</a></p>`
    });
  }
  return result;
}
