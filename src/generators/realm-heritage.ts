import Alea from "alea";
import { TREASURE_FORMS } from "@/data/magic-item-references";
import {
  ALIGNMENT_TENETS,
  ALIGNMENTS,
  DEITY_NAMES,
  DEITY_RANKS,
  FAITH_MOTIFS,
  TREASURE_EPITHETS,
  TREASURE_MOTIFS
} from "@/data/realm-heritage";
import type { CampaignWorld, CountryArchetype } from "@/types/campaign-world";
import type { ItemReferenceEdition } from "@/types/magic-item-reference";
import type { DeityRank, DndAlignment, RealmHeritage, RealmReligion, RealmTreasure } from "@/types/realm-heritage";
import type { AdministrativeSnapshot } from "./campaign-generator";
import { applyItemReference, chooseItemReference } from "./magic-item-generator";
import { inferCountryArchetype, isNpcCity } from "./npc-progression";

export const nationalTreasureCount = (territoryShare: number, ageYears: number): number =>
  Math.min(12, 1 + Math.floor(Math.max(0, Math.min(1, territoryShare)) * 8) + Math.floor(Math.max(0, ageYears) / 400));

function createTreasure(
  seed: string,
  stateId: number,
  slot: number,
  placeName: string,
  edition: ItemReferenceEdition,
  archetype: CountryArchetype,
  settlementId?: string
): RealmTreasure {
  const ownerType = settlementId ? "city" : "country";
  const id = `treasure:${ownerType}:${settlementId?.split(":")[1] || stateId}:${slot}`;
  const random = Alea(`${seed}:${id}:v1`);
  const motif = TREASURE_MOTIFS[Math.floor(random() * TREASURE_MOTIFS.length)];
  const rarity = random() < 0.2 ? "legendary" : ownerType === "city" && random() < 0.65 ? "rare" : "veryRare";
  const reference = chooseItemReference(seed, id, rarity, edition, archetype);
  const treasure: RealmTreasure = {
    id,
    stateId,
    ownerType,
    ...(settlementId ? { settlementId } : {}),
    name: `${placeName}의 ${TREASURE_EPITHETS[slot]} · ${TREASURE_FORMS[reference.reference.category]}`,
    rarity,
    unique: true,
    power: "",
    symbolism: motif.symbolism,
    rpEffect: `이 보물을 공식적으로 위탁받은 자는 '${motif.symbolism}'의 계승자로 인정받으며 공개 행사와 외교에서 그 전통을 지킬 책임을 진다`,
    history: {
      military: ["국경 전쟁에서 병사들을 지킨 대장장이의 유작이다", "수호의 맹세를 새겨 전열에 수여한 보물이다"],
      arcane: ["고대 마력 봉인 의식을 위해 제작한 실험작이다", "먼 차원의 탐험에서 돌아온 마법사가 남긴 보물이다"],
      theocratic: ["신전의 제의에서 축복을 받아 탄생한 보물이다", "재난의 희생자를 구호한 성직자를 기려 제작했다"],
      nature: ["숲을 지키겠다는 맹세를 담아 만든 보물이다", "위험한 순례 여정에서 길잡이가 남긴 상징품이다"],
      mercantile: ["먼바다 항해의 성공을 기념해 제작한 보물이다", "교역로의 구호 활동을 도운 상단의 기념품이다"],
      balanced: ["국가가 선대의 맹세를 기리며 보존해 온 보물이다", "장인의 가문이 선대의 기술을 계승해 만든 상징품이다"]
    }[archetype][Math.floor(random() * 2)],
    notes: "",
    edited: false
  };
  applyItemReference(treasure, reference);
  return treasure;
}

function createReligion(
  seed: string,
  stateId: number,
  slot: number,
  headquartersId: string,
  countryName: string
): RealmReligion {
  const id = `faith:${stateId}:${slot}`;
  const random = Alea(`${seed}:${id}:v1`);
  const motif =
    FAITH_MOTIFS[
      (Math.floor(Alea(`${seed}:faith-theme:${stateId}`)() * FAITH_MOTIFS.length) + slot) % FAITH_MOTIFS.length
    ];
  const alignments = Object.keys(ALIGNMENTS) as DndAlignment[];
  const ranks = Object.keys(DEITY_RANKS) as DeityRank[];
  const alignment = alignments[Math.floor(random() * alignments.length)];
  return {
    id,
    stateId,
    name: `${countryName} ${motif.name} 교단`,
    symbol: motif.symbol,
    alignment,
    deityName: `${DEITY_NAMES[Math.floor(random() * DEITY_NAMES.length)]}, ${motif.name}의 신`,
    deityRank: ranks[Math.floor(random() * ranks.length)],
    doctrine: `${motif.name}의 신성함을 기리며 ${ALIGNMENT_TENETS[alignment]}.`,
    headquartersId,
    notes: "",
    edited: false
  };
}

export function synchronizeHeritage(world: CampaignWorld, input: AdministrativeSnapshot): boolean {
  let changed = !world.heritage;
  world.heritage ||= {
    version: 1,
    nations: [],
    treasures: [],
    religions: [],
    showHeadquarters: true
  };
  const heritage: RealmHeritage = world.heritage;
  // Add provenance once, including to legacy edited records, without replacing their text or identity.
  const attachOrigin = (item: RealmTreasure) => {
    if (item.origin) return;
    const state = input.states.find(state => state.id === item.stateId);
    const village = item.settlementId
      ? input.villages.find(village => `village:${village.id}` === item.settlementId)
      : undefined;
    item.origin = {
      archetype:
        world.npcProfiles?.find(profile => profile.stateId === item.stateId)?.archetype ||
        inferCountryArchetype(state?.government || ""),
      geography: village?.geography || state?.geography || "unknown"
    };
    changed = true;
  };
  for (const item of heritage.treasures) attachOrigin(item);
  const references = heritage.itemReferenceEdition || "mixed";
  for (const item of heritage.treasures) {
    if (item.design || item.edited) continue;
    const state = input.states.find(state => state.id === item.stateId);
    const archetype =
      world.npcProfiles?.find(profile => profile.stateId === item.stateId)?.archetype ||
      inferCountryArchetype(state?.government || "");
    applyItemReference(item, chooseItemReference(world.seed, item.id, item.rarity, references, archetype));
    changed = true;
  }
  const totalArea = input.states.filter(s => s.id > 0).reduce((sum, s) => sum + Math.max(0, s.area || 0), 0);
  const treasureIds = new Set(heritage.treasures.map(item => item.id));
  const religionIds = new Set(heritage.religions.map(religion => religion.id));
  for (const state of [...input.states].filter(s => s.id > 0).sort((a, b) => a.id - b.id)) {
    let nation = heritage.nations.find(nation => nation.stateId === state.id);
    if (!nation) {
      nation = { stateId: state.id, ageYears: 50 + Math.floor(Alea(`${world.seed}:history:${state.id}`)() * 1751) };
      heritage.nations.push(nation);
      changed = true;
    }
    const share = totalArea ? Math.max(0, state.area || 0) / totalArea : 0;
    const archetype =
      world.npcProfiles?.find(profile => profile.stateId === state.id)?.archetype ||
      inferCountryArchetype(state.government || "");
    for (let slot = 0; slot < nationalTreasureCount(share, nation.ageYears); slot++) {
      const id = `treasure:country:${state.id}:${slot}`;
      if (treasureIds.has(id)) continue;
      const treasure = createTreasure(world.seed, state.id, slot, state.name, references, archetype);
      attachOrigin(treasure);
      heritage.treasures.push(treasure);
      treasureIds.add(id);
      changed = true;
    }
    const settlements = input.villages
      .filter(village => village.stateId === state.id)
      .sort(
        (a, b) => Number(b.capital) - Number(a.capital) || (b.population || 0) - (a.population || 0) || a.id - b.id
      );
    for (const village of settlements.filter(isNpcCity)) {
      if (!village.capital && Alea(`${world.seed}:city-symbol:${village.id}`)() >= 0.25) continue;
      const id = `treasure:city:${village.id}:0`;
      if (treasureIds.has(id)) continue;
      const treasure = createTreasure(
        world.seed,
        state.id,
        0,
        village.name,
        references,
        archetype,
        `village:${village.id}`
      );
      attachOrigin(treasure);
      heritage.treasures.push(treasure);
      treasureIds.add(id);
      changed = true;
    }
    const religionCount = Math.min(3, 1 + Number(nation.ageYears >= 800) + Number(share >= 0.2));
    for (let slot = 0; slot < religionCount; slot++) {
      if (religionIds.has(`faith:${state.id}:${slot}`)) continue;
      heritage.religions.push(
        createReligion(
          world.seed,
          state.id,
          slot,
          settlements.length ? `village:${settlements[slot % settlements.length].id}` : `country:${state.id}`,
          state.name
        )
      );
      religionIds.add(`faith:${state.id}:${slot}`);
      changed = true;
    }
  }
  return changed;
}
