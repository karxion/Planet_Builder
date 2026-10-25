import {
  MAGIC_ITEM_BY_ID,
  MAGIC_ITEM_CATEGORIES,
  MAGIC_ITEM_SOURCES,
  referenceSourceUrl
} from "@/data/magic-item-references";
import { isNpcPortrait } from "@/data/npc-portrait";
import { UNIQUE_ITEM_POLICY, UNIQUE_ITEM_LIMITS, UNIQUE_ITEM_EQUIPMENT, UNIQUE_ITEM_CONSUMABLE, uniqueItemBonusLines } from "@/data/unique-item-bonuses";
import { createUniqueItemBonus } from "@/generators/unique-item-bonuses";
import {
  COUNTRY_ARCHETYPES,
  NPC_CLASSES,
  NPC_EPIC_MIN_LEVEL,
  NPC_RANKS,
  NPC_SCOPES,
  NPC_TIER_RANGES
} from "@/data/npc-progression";
import { NPC_STAT_BLOCKS, SRD_ATTRIBUTION, SRD_URL } from "@/data/npc-stat-blocks";
import { npcCombatProfile, npcCommonerProfile, npcTier } from "@/generators/npc-progression";
import { ITEM_RARITY_LABELS } from "@/generators/world-items";
import { translateText } from "@/services/ui-language";
import type { AdministrativeUnit } from "@/types/campaign-world";
import type {
  DataExportOptions,
  DataExportScope,
  WorldDataExport,
  WorldDataExportSource
} from "@/types/world-data-export";

const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
const ITEM_ATTRIBUTION = `This work includes material from the System Reference Document 5.1 and System Reference Document 5.2.1 by Wizards of the Coast LLC, available at ${MAGIC_ITEM_SOURCES["2014"].url} and ${MAGIC_ITEM_SOURCES["2024"].url}. The SRDs are licensed under CC BY 4.0: ${LICENSE_URL}`;

function unitChain(id: string, units: Map<string, AdministrativeUnit>): AdministrativeUnit[] {
  const result: AdministrativeUnit[] = [];
  const seen = new Set<string>();
  let unit = units.get(id);
  while (unit && !seen.has(unit.id)) {
    seen.add(unit.id);
    result.push(unit);
    unit = unit.parentId ? units.get(unit.parentId) : undefined;
  }
  return result;
}

export function buildWorldDataExport(
  source: WorldDataExportSource,
  scope: DataExportScope,
  options: DataExportOptions
): WorldDataExport {
  const tr = (text: string) => translateText(text, options.language);
  const units = new Map(source.world.units.map(unit => [unit.id, unit]));
  const npcs = new Map(source.world.npcs.map(npc => [npc.id, npc]));
  const includedUnits = new Map<string, AdministrativeUnit>();
  const relatedUnits = (id: string) => {
    const chain = unitChain(id, units);
    for (const unit of chain) includedUnits.set(unit.id, unit);
    return chain;
  };
  const attribution = source.kind === "npcs" ? SRD_ATTRIBUTION : ITEM_ATTRIBUTION;
  const result: WorldDataExport = {
    kind: source.kind,
    title: tr(source.kind === "npcs" ? "NPC 데이터 출력" : "아이템 데이터 출력"),
    payload: {},
    columns: [],
    rows: [],
    cards: [],
    attribution
  };
  const metadata = {
    schemaVersion: 1,
    kind: source.kind,
    seed: source.world.seed,
    scope,
    language: options.language,
    includePrivate: options.includePrivate,
    includeImages: options.includeImages,
    attribution,
    license: LICENSE_URL
  };
  if (source.kind === "npcs") {
    const keys = [
      "id",
      "name",
      "role",
      "country",
      "region",
      "fief",
      "village",
      "class",
      "level",
      "tier",
      "rank",
      "scope",
      "archetype",
      "ac",
      "hp",
      "cr",
      "abilities",
      "proficiency",
      "attack",
      "spellDc",
      "profile",
      "appearance",
      "personality",
      "goal",
      ...(options.includePrivate ? ["secret", "notes"] : []),
      "source",
      "license"
    ];
    const labels = [
      "ID",
      "이름",
      "역할",
      "국가",
      "지역",
      "영지",
      "마을",
      "직업",
      "레벨",
      "티어",
      "지위",
      "활동 범위",
      "국가 성향",
      "AC",
      "HP",
      "CR",
      "능력치",
      "숙련",
      "명중",
      "주문 DC",
      "능력치 유형",
      "외형",
      "성격",
      "목표",
      ...(options.includePrivate ? ["비밀", "GM 메모"] : []),
      "출처",
      "라이선스"
    ];
    result.columns = keys.map((key, index) => [key, tr(labels[index])]);
    const records = source[scope].map(npc => {
      const { secret, notes, portrait, ...publicNpc } = structuredClone(npc);
      const progression = npc.progression;
      const adventurer = progression && progression.classId !== "none";
      const epic = adventurer && progression.level >= NPC_EPIC_MIN_LEVEL;
      const combat = npcCombatProfile(npc) || npcCommonerProfile(npc);
      const base = NPC_STAT_BLOCKS[npc.templateId];
      const chain = relatedUnits(npc.villageId);
      const place = (level: AdministrativeUnit["level"]) => chain.find(unit => unit.level === level)?.name || "";
      const profile = epic
        ? tr("에픽 · 서사 레벨만 기록 · 21레벨 이상 간이 전투 수치 미제공")
        : combat?.kind === "fpb-simplified-level-profile"
          ? tr("레벨 기반 간이 프로필")
          : combat?.kind === "fpb-commoner-variant"
            ? tr("앱 변형 커머너 · 지정 CR은 추정치")
            : tr("SRD 기본 참고 능력치 (레벨 미반영)");
      const row: Record<string, string> = {
        id: npc.id,
        name: npc.name,
        role: npc.role,
        country: place("country"),
        region: place("region"),
        fief: place("fief"),
        village: place("village") || tr("소속 마을 없음"),
        class: progression ? tr(NPC_CLASSES[progression.classId]) : tr(base.name),
        level: adventurer ? String(progression.level) : "",
        tier: adventurer ? (epic ? tr("에픽") : `T${npcTier(progression.level)}`) : "",
        rank: progression ? tr(NPC_RANKS[progression.rank]) : "",
        scope: progression ? tr(NPC_SCOPES[progression.scope]) : "",
        archetype: progression ? tr(COUNTRY_ARCHETYPES[progression.archetype]) : "",
        ac: epic ? "" : String(combat?.ac ?? base.ac),
        hp: epic ? "" : String(combat?.hp ?? base.hp),
        cr: adventurer ? "" : `CR ${combat && "cr" in combat ? combat.cr : base.cr}`,
        abilities: epic
          ? ""
          : (combat && "abilities" in combat ? combat.abilities : base.abilities)
              .map((score, index) => `${tr(["근력", "민첩", "건강", "지능", "지혜", "매력"][index])} ${score}`)
              .join(" / "),
        proficiency: combat ? String(combat.proficiency) : "",
        attack: combat ? String(combat.attackBonus) : "",
        spellDc: combat && "spellSaveDc" in combat ? String(combat.spellSaveDc ?? "") : "",
        profile,
        appearance: npc.appearance,
        personality: npc.personality,
        goal: npc.goal,
        ...(options.includePrivate ? { secret, notes } : {}),
        source: `${SRD_URL}#page=${base.page}`,
        license: LICENSE_URL
      };
      const image = options.includeImages && isNpcPortrait(portrait) ? portrait : undefined;
      result.rows.push(row);
      result.cards.push({
        name: npc.name,
        image,
        fields: result.columns
          .filter(([key]) => key !== "name" && key !== "license")
          .map(([key, label]) => [label, row[key]])
      });
      return {
        ...publicNpc,
        ...(options.includePrivate ? { secret, notes } : {}),
        ...(image ? { portrait: image } : {}),
        narrativeTier: adventurer ? npcTier(progression.level) : undefined,
        combatProfile: combat,
        statBlock: structuredClone(base),
        statBlockUsage: "srd-base-reference-not-level-scaled",
        affiliation: Object.fromEntries(chain.map(unit => [unit.level, { id: unit.id, name: unit.name }]))
      };
    });
    result.payload = {
      ...metadata,
      ruleset: source.world.ruleset,
      count: records.length,
      units: [...includedUnits.values()],
      tierScheme: { id: "fpb-five-tier-v1", ranges: NPC_TIER_RANGES, epicMinLevel: NPC_EPIC_MIN_LEVEL },
      npcs: records,
      source: SRD_URL
    };
  } else {
    const keys = [
      "id",
      "name",
      "category",
      "rarity",
      "unique",
      "uniqueBonus",
      "ownerKind",
      "owner",
      "ownerId",
      "dungeon",
      "markerId",
      "cell",
      "appearance",
      "power",
      "history",
      ...(options.includePrivate ? ["notes"] : []),
      "reference",
      "edition",
      "variant",
      "source",
      "license"
    ];
    const koLabels = [
      "ID",
      "아이템 이름",
      "아이템 유형",
      "희귀도",
      "유니크",
      "유니크 추가 특성",
      "소유주 유형",
      "소유주",
      "소유주 ID",
      "던전 보상 출처",
      "표식 ID",
      "셀 ID",
      "외형",
      "효능 개요",
      "유래",
      ...(options.includePrivate ? ["GM 메모"] : []),
      "원본 레퍼런스",
      "판본",
      "하위형",
      "출처",
      "라이선스"
    ];
    result.columns = keys.map((key, index) => [key, tr(koLabels[index])]);
    const owners = new Map<string, { id: string; name: string; role: string; villageId: string }>();
    const records = source[scope].map(item => {
      const { notes, image, ...publicItem } = structuredClone(item);
      const uniqueBonus = createUniqueItemBonus(source.world.seed, item);
      const reference = item.referenceId ? MAGIC_ITEM_BY_ID.get(item.referenceId) : undefined;
      const owner = item.owner;
      const target =
        owner.kind === "npc" ? npcs.get(owner.id) : owner.kind === "unit" ? units.get(owner.id) : undefined;
      if (owner.kind === "unit") relatedUnits(owner.id);
      if (owner.kind === "npc") {
        const npc = npcs.get(owner.id);
        if (npc) {
          owners.set(npc.id, { id: npc.id, name: npc.name, role: npc.role, villageId: npc.villageId });
          relatedUnits(npc.villageId);
        }
      }
      const row: Record<string, string> = {
        id: item.id,
        name: item.name,
        category: tr(MAGIC_ITEM_CATEGORIES[item.category]),
        rarity: tr(ITEM_RARITY_LABELS[item.rarity]),
        unique: tr(item.unique ? "예" : "아니요"),
        uniqueBonus: uniqueBonus ? [
          tr(UNIQUE_ITEM_POLICY), ...uniqueItemBonusLines(uniqueBonus, tr),
          tr(item.category === "potion" || item.category === "scroll" ? UNIQUE_ITEM_CONSUMABLE : UNIQUE_ITEM_EQUIPMENT),
          tr(UNIQUE_ITEM_LIMITS)
        ].join("\n") : "",
        ownerKind: tr(
          owner.kind === "npc"
            ? "NPC"
            : owner.kind === "unit"
              ? "국가·지역·영지·마을"
              : owner.kind === "custom"
                ? "직접 입력"
                : "소유주 없음"
        ),
        owner:
          owner.kind === "none"
            ? tr("소유주 없음")
            : target?.name || (owner.kind === "custom" ? owner.label : `${owner.label} (${tr("연결 대상 없음")})`),
        ownerId: owner.kind === "npc" || owner.kind === "unit" ? owner.id : "",
        dungeon: item.reward?.name || "",
        markerId: item.reward ? String(item.reward.markerId) : "",
        cell: item.reward ? String(item.reward.cell) : "",
        appearance: item.appearance,
        power: item.power,
        history: item.history,
        ...(options.includePrivate ? { notes } : {}),
        reference: reference?.name || item.referenceId || "",
        edition: reference?.edition || "",
        variant: item.variant || "",
        source: reference ? referenceSourceUrl(reference) : "",
        license: reference ? LICENSE_URL : ""
      };
      const portrait = options.includeImages && isNpcPortrait(image) ? image : undefined;
      result.rows.push(row);
      result.cards.push({
        name: item.name,
        image: portrait,
        fields: result.columns
          .filter(([key]) => key !== "name" && key !== "license")
          .map(([key, label]) => [label, row[key]])
      });
      return {
        ...publicItem,
        uniqueBonus,
        ...(uniqueBonus ? { uniqueBonusPolicy: "fpb-homebrew-not-official-srd", uniqueBonusRules: row.uniqueBonus } : {}),
        ...(options.includePrivate ? { notes } : {}),
        ...(portrait ? { image: portrait } : {}),
        ownerName: row.owner,
        source: row.source
      };
    });
    result.payload = {
      ...metadata,
      version: 1,
      count: records.length,
      items: records,
      units: [...includedUnits.values()],
      owners: [...owners.values()],
      sources: MAGIC_ITEM_SOURCES
    };
  }
  return result;
}

export function exportCsv(document: WorldDataExport): string {
  const cell = (value: string) => {
    // Quoting alone does not prevent spreadsheet formula execution.
    const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return (
    "\uFEFF" +
    [
      document.columns.map(([, label]) => cell(label)).join(","),
      ...document.rows.map(row => document.columns.map(([key]) => cell(row[key] || "")).join(","))
    ].join("\r\n")
  );
}

export function exportFilename(kind: "npcs" | "items", scope: DataExportScope, format: "json" | "csv"): string {
  return `world-${kind}-${scope}.${format}`;
}
