import { isUndergroundMap, UNDERGROUND_DEPTHS } from "@/data/underground";
import { SITE_KINDS, SPACE_IDS, type SpaceSite, TERRAIN_KINDS, type WorldSpacesData } from "@/types/world-spaces";

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
  if (
    !Array.from(value.factions).every(
      f =>
        record(f) &&
        id(f.id) &&
        text(f.name, 120) &&
        f.name.trim() &&
        typeof f.color === "string" &&
        /^#[0-9a-f]{6}$/i.test(f.color) &&
        text(f.notes)
    )
  )
    return false;
  if (!unique(value.factions)) return false;
  const factions = new Set(value.factions.map(f => f.id));
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
        text(s.notes) &&
        (s.origin === undefined || s.origin === "underground") &&
        (s.edited === undefined || typeof s.edited === "boolean") &&
        (s.factionId === undefined || factions.has(s.factionId))
    )
  )
    return false;
  if (!unique(value.sites)) return false;
  const sites = new Set(value.sites.map(s => s.id));
  return (
    Array.from(value.links).every(
      l =>
        record(l) &&
        id(l.id) &&
        text(l.name, 120) &&
        l.name.trim() &&
        sites.has(l.from) &&
        sites.has(l.to) &&
        l.from !== l.to &&
        (l.origin === undefined || l.origin === "underground")
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
  }
  update(change: (draft: WorldSpacesData) => void): void {
    const draft = this.snapshot();
    change(draft);
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
      d.sites.forEach(s => {
        if (s.factionId === factionId) delete s.factionId;
      });
    });
  }
  addSite(space: SpaceSite["space"], kind: SpaceSite["kind"], x: number, y: number): SpaceSite {
    const site: SpaceSite = {
      id: crypto.randomUUID(),
      space,
      kind,
      x,
      y,
      name:
        kind === "city"
          ? "새 도시"
          : kind === "territory"
            ? "새 영지"
            : kind === "gateway"
              ? "새 연결 지점"
              : "새 지형",
      depth:
        space === "surface"
          ? 0
          : space === "underwater"
            ? 100
            : this.data.underground
              ? UNDERGROUND_DEPTHS[this.data.underground.activeLevel]
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
