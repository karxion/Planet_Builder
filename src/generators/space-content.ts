import Alea from "alea";
import { SPACE_CONTENT } from "@/data/space-content";
import { getGenerationLanguage } from "@/services/generation-language";
import type { SpaceItem, SpaceNpc, SpaceSite, WorldSpacesData } from "@/types/world-spaces";
import { generateRealmName } from "./realm-name";
import { generateNpcProgression } from "./npc-progression";

export function spaceCityName(seed: string, space: "underwater" | "underground"): string {
  const rng = Alea(`space-city:${space}:${seed}`),
    locale = getGenerationLanguage();
  const prefixes = SPACE_CONTENT[space].prefixes;
  const prefix = prefixes[Math.floor(rng() * prefixes.length)][locale === "ko" ? 0 : 1];
  return `${prefix}${locale === "ko" ? "" : " "}${generateRealmName(`${space}:${seed}`, locale)}`;
}

/** Keep an edited resident's home when the surrounding generated geography is replaced. */
export function protectSpaceContent(data: WorldSpacesData): void {
  const edited = new Set([
    ...(data.content?.npcs.filter(n => n.edited).map(n => n.siteId) || []),
    ...(data.content?.items.filter(i => i.edited).map(i => i.siteId) || [])
  ]);
  data.sites.forEach(site => {
    if (edited.has(site.id) && site.origin) site.edited = true;
  });
}

/** Fill only absent records; manual data, stored language and existing IDs are never regenerated. */
export function synchronizeSpaceContent(data: WorldSpacesData): void {
  const cities = data.sites.filter(
    (site): site is SpaceSite & { space: "underwater" | "underground" } =>
      site.kind === "city" && site.space !== "surface"
  );
  if (!cities.length && !data.content) return;
  const live = new Set(cities.map(city => city.id));
  data.content ||= { version: 1, npcs: [], items: [] };
  data.content.npcs = data.content.npcs.filter(n => live.has(n.siteId));
  data.content.items = data.content.items.filter(i => live.has(i.siteId));
  const ko = getGenerationLanguage() === "ko",
    index = ko ? 0 : 1;
  const choose = (items: readonly (readonly [string, string])[], rng: () => number): readonly [string, string] =>
    items[Math.floor(rng() * items.length)];
  for (const city of cities) {
    const seed = `${city.space}:${city.id}:${city.x}:${city.y}`;
    if (
      city.origin &&
      !city.edited &&
      (/^(회색|푸른|흑요) 거주지 \d+$|^내부 거주지 \d+$|^(Gray|Blue|Obsidian) Settlement \d+$|^Inner settlement \d+$/.test(
        city.name
      ) ||
        (city.space === "underwater" && / (중심도시|교역항|Capital|Trading port)$/.test(city.name)))
    )
      city.name = spaceCityName(seed, city.space);
    const source = SPACE_CONTENT[city.space],
      rng = Alea(`space-content:${seed}`);
    const existingNpc = new Set(data.content.npcs.map(n => n.id));
    for (let n = 0; n < 4; n++) {
      const id = `${city.id}:npc:${n}`;
      const npc: SpaceNpc = {
        id,
        siteId: city.id,
        name: generateRealmName(`${seed}:npc:${n}`),
        role: source.roles[n][index],
        people: choose(source.people, rng)[index],
        interaction: n === 0 ? "trade" : n === 3 ? "lore" : "quest",
        greeting: source.greeting[index],
        offer: source.offers[n][index],
        notes: "",
        edited: false
      };
      for (
        let attempt = 1;
        data.content.npcs.some(other => other.siteId === city.id && other.id !== id && other.name === npc.name);
        attempt++
      )
        npc.name = generateRealmName(`${seed}:npc:${n}:${attempt}`);
      npc.progression = generateNpcProgression(
        seed,
        id,
        {
          id: n + 1,
          stateId: 0,
          fiefId: 0,
          name: city.name,
          x: city.x,
          y: city.y,
          capital: false,
          port: city.space === "underwater",
          population: Math.max(6, city.population)
        },
        n === 0 ? 2 : 3,
        {
          archetype: n === 0 ? "mercantile" : n === 2 ? "nature" : "arcane",
          nationalSeat: false,
          continentalSeat: false
        }
      );
      if (!existingNpc.has(id)) data.content.npcs.push(npc);
    }
    const existingItems = new Set(data.content.items.map(item => item.id));
    for (let n = 0; n < 3; n++) {
      const id = `${city.id}:item:${n}`,
        roll = rng(),
        rarity: SpaceItem["rarity"] = roll < 0.55 ? "rare" : roll < 0.9 ? "veryRare" : "legendary";
      const count = rarity === "rare" ? 2 : rarity === "veryRare" ? 3 : 4;
      const effects = [...source.effects];
      const selected: string[] = [];
      while (selected.length < count) selected.push(effects.splice(Math.floor(rng() * effects.length), 1)[0][index]);
      const category = choose(source.categories, rng)[index];
      const item: SpaceItem = {
        id,
        siteId: city.id,
        npcId: `${city.id}:npc:0`,
        name: ko
          ? `${generateRealmName(`${seed}:item:${n}`)}의 ${category}`
          : `${category} of ${generateRealmName(`${seed}:item:${n}`)}`,
        category,
        rarity,
        effects: selected,
        history: `${city.name} · ${source.origin[index]}`,
        notes: "",
        edited: false
      };
      if (!existingItems.has(id)) data.content.items.push(item);
    }
  }
}
