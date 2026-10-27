import Alea from "alea";
import { UNIQUE_EFFECT_COUNTS, UNIQUE_EFFECTS, type ItemHistory } from "@/data/unique-item-effects";
import type { CampaignWorld } from "@/types/campaign-world";
import type {
  ContextualUniqueItemBonus,
  ItemGeography,
  UniqueEffectAxis,
  UniqueItemOrigin,
  WorldMagicItem
} from "@/types/world-item";

export function itemCreationBackground(history: string): ItemHistory {
  if (/구원|구출|구호|치유|rescue|heal|salvation/i.test(history)) return "rescue";
  if (/전쟁|전투|전장|정복|war\b|battle|conquest/i.test(history)) return "war";
  if (/의식|제의|신전|봉인|ritual|temple|seal/i.test(history)) return "ritual";
  if (/여행|항해|탐험|순례|journey|voyage|explor|pilgrim/i.test(history)) return "journey";
  if (/맹세|서약|수호|oath|vow|guard/i.test(history)) return "oath";
  return "legacy";
}

export function itemOrigin(
  world: CampaignWorld,
  item: WorldMagicItem,
  geography: ItemGeography = "unknown"
): UniqueItemOrigin {
  if (item.origin) return item.origin;
  const source = world.heritage?.treasures.find(treasure => treasure.id === item.sourceTreasureId);
  if (source?.origin) return { ...source.origin };
  const owner = item.owner;
  const unitId =
    owner.kind === "npc"
      ? world.npcs.find(npc => npc.id === owner.id)?.villageId
      : owner.kind === "unit"
        ? owner.id
        : undefined;
  const stateId = source?.stateId ?? world.units.find(unit => unit.id === unitId)?.stateId;
  return {
    archetype: world.npcProfiles?.find(profile => profile.stateId === stateId)?.archetype || "balanced",
    geography
  };
}

export function geographyFromTerrain(height: number, biome: number, coastal: boolean): ItemGeography {
  if (height < 20 || coastal) return "coast";
  if (height >= 70) return "mountain";
  if (biome === 1 || biome === 2) return "desert";
  if (biome === 10 || biome === 11) return "tundra";
  if (biome === 12) return "swamp";
  if ([5, 6, 7, 8, 9].includes(biome)) return "forest";
  return "plains";
}

export function createUniqueItemBonus(seed: string, item: WorldMagicItem): ContextualUniqueItemBonus | undefined {
  if (!item.unique) return undefined;
  // Renaming, moving ownership and toggling uniqueness do not reroll powers.
  const random = Alea(`${seed}:${item.id}:unique-bonus-v2`);
  const origin = item.origin || { archetype: "balanced", geography: "unknown" };
  const themes: Record<UniqueEffectAxis, string> = {
    category: item.category,
    nation: origin.archetype,
    rarity: ["common", "uncommon"].includes(item.rarity)
      ? "rare"
      : item.rarity === "artifact"
        ? "legendary"
        : item.rarity,
    history: itemCreationBackground(item.history),
    geography: origin.geography
  };
  const axes: UniqueEffectAxis[] = ["nation", "history", "geography", "rarity"];
  // Unknown geography supplies no invented biome. Prefer contextual axes over the generic rarity power.
  const ranked = axes
    .filter(axis => axis !== "geography" || origin.geography !== "unknown")
    .map(axis => ({ axis, score: random() + (axis === "rarity" ? 0 : 0.4) }))
    .sort((a, b) => b.score - a.score);
  const chosen: UniqueEffectAxis[] = [
    "category",
    ...ranked.slice(0, UNIQUE_EFFECT_COUNTS[item.rarity] - 1).map(entry => entry.axis)
  ];
  return {
    version: 2,
    effects: chosen.map(axis => {
      const pool = UNIQUE_EFFECTS.filter(effect => effect.axis === axis && effect.theme === themes[axis]);
      return { id: pool[Math.floor(random() * pool.length)].id, axis };
    })
  };
}

export function synchronizeUniqueItemBonus(seed: string, item: WorldMagicItem): boolean {
  const bonus = createUniqueItemBonus(seed, item);
  if (JSON.stringify(item.uniqueBonus) === JSON.stringify(bonus)) return false;
  if (bonus) item.uniqueBonus = bonus;
  else delete item.uniqueBonus;
  return true;
}
