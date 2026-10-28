import { HOLLOW_REFERENCE_DEPTH, isUndergroundMap, UNDERGROUND_DEPTHS, undergroundIndex } from "@/data/underground";
import { isUnderwaterMap, SEA_RELATIONS, seabedIndex } from "@/data/underwater";
import { SITE_KINDS, SPACE_IDS, type SpaceSite, TERRAIN_KINDS, type WorldSpacesData } from "@/types/world-spaces";
import { spaceCityName, synchronizeSpaceContent } from "@/generators/space-content";
import { isNpcProgression } from "@/data/campaign-validation";

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown, max = 4000): value is string => typeof value === "string" && value.length <= max;
const id = (value: unknown): value is string => text(value, 100) && /^[a-zA-Z0-9:_-]+$/.test(value);
const number = (value: unknown, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
const unique = (items: { id: string }[]) => new Set(items.map(item => item.id)).size === items.length;

export function emptyWorldSpaces(): WorldSpacesData {
  return { version: 1, activeSpace: "surface", sites: [], factions: [], links: [] };
}

export function isWorldSpaces(value: unknown): value is WorldSpacesData {
  if (
    !record(value) ||
    value.version !== 1 ||
    !SPACE_IDS.includes(value.activeSpace as never) ||
    !Array.isArray(value.sites) ||
    !Array.isArray(value.factions) ||
    !Array.isArray(value.links) ||
    value.sites.length > 5000 ||
    value.factions.length > 500 ||
    value.links.length > 10000
  )
    return false;
  if (value.underground !== undefined && !isUndergroundMap(value.underground)) return false;
  if (value.underwater !== undefined && !isUnderwaterMap(value.underwater)) return false;
  if (
    !Array.from(value.factions).every(
      f =>
        record(f) &&
        id(f.id) &&
        text(f.name, 120) &&
        f.name.trim() &&
        typeof f.color === "string" &&
        /^#[0-9a-f]{6}$/i.test(f.color) &&
        text(f.notes) &&
        (f.people === undefined || text(f.people, 500))
    )
  )
    return false;
  if (!unique(value.factions)) return false;
  const factions = new Set(value.factions.map(f => f.id));
  if (
    value.underwater &&
    !(value.underwater as import("@/types/underwater").UnderwaterMap).factionIds.every(id => factions.has(id))
  )
    return false;
  if (value.relations !== undefined) {
    if (!Array.isArray(value.relations) || value.relations.length > 10000) return false;
    const pairs = new Set<string>();
    for (const relation of Array.from(value.relations)) {
      if (
        !record(relation) ||
        !factions.has(relation.from) ||
        !factions.has(relation.to) ||
        relation.from === relation.to ||
        !SEA_RELATIONS.includes(relation.status as never)
      )
        return false;
      const pair = [relation.from, relation.to].sort().join("|");
      if (pairs.has(pair)) return false;
      pairs.add(pair);
    }
  }
  if (
    !Array.from(value.sites).every(
      s =>
        record(s) &&
        id(s.id) &&
        SPACE_IDS.includes(s.space as never) &&
        SITE_KINDS.includes(s.kind as never) &&
        text(s.name, 120) &&
        s.name.trim() &&
        number(s.x, 0, 1) &&
        number(s.y, 0, 1) &&
        number(s.depth, 0, 100000) &&
        (s.space !== "surface" || s.depth === 0) &&
        number(s.radius, 0.002, 0.25) &&
        TERRAIN_KINDS.includes(s.terrain as never) &&
        text(s.residents, 500) &&
        number(s.population, 0, 1e10) &&
        Number.isSafeInteger(s.population) &&
        (s.capital === undefined || typeof s.capital === "boolean") &&
        text(s.notes) &&
        (s.origin === undefined || s.origin === "underground" || s.origin === "underwater") &&
        (s.edited === undefined || typeof s.edited === "boolean") &&
        (s.factionId === undefined || factions.has(s.factionId))
    )
  )
    return false;
  if (!unique(value.sites)) return false;
  const sites = new Set(value.sites.map(s => s.id));
  const locations = new Map<string, SpaceSite>(value.sites.map(s => [s.id, s]));
  if (value.content !== undefined) {
    const content = value.content;
    if (
      !record(content) ||
      content.version !== 1 ||
      !Array.isArray(content.npcs) ||
      !Array.isArray(content.items) ||
      content.npcs.length > 20000 ||
      content.items.length > 15000
    )
      return false;
    const contentId = (value: unknown): value is string => text(value, 150) && /^[a-zA-Z0-9:_-]+$/.test(value);
    const home = (siteId: unknown) =>
      typeof siteId === "string" &&
      locations.get(siteId)?.kind === "city" &&
      locations.get(siteId)?.space !== "surface";
    if (
      !content.npcs.every(
        n =>
          record(n) &&
          contentId(n.id) &&
          home(n.siteId) &&
          text(n.name, 200) &&
          n.name.trim() &&
          text(n.role, 200) &&
          text(n.people, 500) &&
          ["trade", "quest", "lore"].includes(n.interaction as string) &&
          text(n.greeting, 2000) &&
          text(n.offer, 2000) &&
          text(n.notes) &&
          (n.progression === undefined || isNpcProgression(n.progression)) &&
          typeof n.edited === "boolean"
      ) ||
      !unique(content.npcs)
    )
      return false;
    const residents = new Map(content.npcs.map(n => [n.id, n]));
    if (
      !content.items.every(
        i =>
          record(i) &&
          contentId(i.id) &&
          home(i.siteId) &&
          residents.get(i.npcId)?.siteId === i.siteId &&
          text(i.name, 200) &&
          i.name.trim() &&
          text(i.category, 200) &&
          ["rare", "veryRare", "legendary"].includes(i.rarity as string) &&
          Array.isArray(i.effects) &&
          i.effects.length === ({ rare: 2, veryRare: 3, legendary: 4 } as Record<string, number>)[i.rarity as string] &&
          i.effects.every(effect => text(effect, 2000)) &&
          text(i.history) &&
          text(i.notes) &&
          typeof i.edited === "boolean"
      ) ||
      !unique(content.items)
    )
      return false;
  }
  return (
    Array.from(value.links).every(
      l =>
        record(l) &&
        id(l.id) &&
        text(l.name, 120) &&
        l.name.trim() &&
        id(l.from) &&
        id(l.to) &&
        sites.has(l.from) &&
        sites.has(l.to) &&
        l.from !== l.to &&
        (l.origin === undefined || l.origin === "underground" || l.origin === "underwater") &&
        (l.transport === undefined || l.transport === "land" || l.transport === "water") &&
        (l.path === undefined ||
          (Array.isArray(l.path) &&
            l.path.length >= 2 &&
            l.path.length <= 2048 &&
            Array.from(l.path).every(p => record(p) && number(p.x, 0, 1) && number(p.y, 0, 1)) &&
            Math.abs(l.path[0].x - locations.get(l.from)!.x) < 1e-6 &&
            Math.abs(l.path[0].y - locations.get(l.from)!.y) < 1e-6 &&
            Math.abs(l.path.at(-1).x - locations.get(l.to)!.x) < 1e-6 &&
            Math.abs(l.path.at(-1).y - locations.get(l.to)!.y) < 1e-6))
    ) && unique(value.links)
  );
}

/** Owns manual world records, independently of the land generator's cells and IDs. */
export class WorldSpaceStore {
  private data = emptyWorldSpaces();
  constructor(private changed: () => void = () => {}) {}
  snapshot(): WorldSpacesData {
    return structuredClone(this.data);
  }
  restore(value?: WorldSpacesData): void {
    if (value !== undefined && !isWorldSpaces(value)) throw new Error("Invalid world spaces");
    this.data = value ? structuredClone(value) : emptyWorldSpaces();
    const previousNames = this.data.sites.map(site => site.name);
    const previousNpcs = this.data.content?.npcs.length || 0,
      previousItems = this.data.content?.items.length || 0;
    synchronizeSpaceContent(this.data);
    if (
      value &&
      (previousNpcs !== (this.data.content?.npcs.length || 0) ||
        previousItems !== (this.data.content?.items.length || 0) ||
        this.data.sites.some((site, i) => site.name !== previousNames[i]))
    )
      this.changed();
  }
  update(change: (draft: WorldSpacesData) => void): void {
    const draft = this.snapshot();
    change(draft);
    synchronizeSpaceContent(draft);
    if (!isWorldSpaces(draft)) throw new Error("도시·세력·연결 정보를 확인해 주세요.");
    this.data = draft;
    this.changed();
  }
  removeSite(siteId: string): void {
    this.update(d => {
      d.sites = d.sites.filter(s => s.id !== siteId);
      d.links = d.links.filter(l => l.from !== siteId && l.to !== siteId);
    });
  }
  removeFaction(factionId: string): void {
    this.update(d => {
      d.factions = d.factions.filter(f => f.id !== factionId);
      d.relations = d.relations?.filter(r => r.from !== factionId && r.to !== factionId);
      if (d.underwater) {
        const oldIds = d.underwater.factionIds;
        d.underwater.factionIds = oldIds.filter(id => id !== factionId);
        d.underwater.owners = d.underwater.owners.map(owner =>
          owner ? d.underwater!.factionIds.indexOf(oldIds[owner - 1]) + 1 : 0
        );
      }
      d.sites.forEach(s => {
        if (s.factionId === factionId) delete s.factionId;
      });
    });
  }
  addSite(space: SpaceSite["space"], kind: SpaceSite["kind"], x: number, y: number): SpaceSite {
    if (
      space === "underground" &&
      kind === "city" &&
      this.data.underground?.mode === "hollow" &&
      ![1, 4, 5].includes(this.data.underground.levels[0].cells[undergroundIndex(this.data.underground, x, y)])
    )
      throw new Error("공동 세계의 도시는 내부 육지에 배치하세요.");
    const seaDepth = this.data.underwater?.depths[seabedIndex(this.data.underwater, x, y)];
    if (space === "underwater" && seaDepth === 0) throw new Error("수중 장소는 바다 위에 배치하세요.");
    const siteId = crypto.randomUUID();
    const site: SpaceSite = {
      id: siteId,
      space,
      kind,
      x,
      y,
      name:
        kind === "city"
          ? space === "surface"
            ? "새 도시"
            : spaceCityName(siteId, space)
          : kind === "territory"
            ? "새 영지"
            : kind === "gateway"
              ? "새 연결 지점"
              : "새 지형",
      depth:
        space === "surface"
          ? 0
          : space === "underwater"
            ? (seaDepth ?? 100)
            : this.data.underground
              ? this.data.underground.mode === "hollow"
                ? HOLLOW_REFERENCE_DEPTH
                : UNDERGROUND_DEPTHS[this.data.underground.activeLevel]
              : 1000,
      radius: 0.035,
      terrain: space === "underground" ? "cavern" : "plain",
      residents: "",
      population: 0,
      notes: ""
    };
    this.update(d => {
      d.sites.push(site);
    });
    return structuredClone(site);
  }
}
