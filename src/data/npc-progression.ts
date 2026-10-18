import type { CommonerCr, CountryArchetype, NpcClassId, NpcRank, NpcScope } from "@/types/campaign-world";

// Fractional CR variants are FPB presets, not official Commoner stat blocks or PC levels.
export const COMMONER_CR_PROFILES: Record<
  CommonerCr,
  {
    weight: number;
    ac: number;
    hp: number;
    attackBonus: number;
    damage: number;
    xp: number;
  }
> = {
  "0": { weight: 70, ac: 10, hp: 4, attackBonus: 2, damage: 2, xp: 10 },
  "1/8": { weight: 20, ac: 11, hp: 11, attackBonus: 3, damage: 4, xp: 25 },
  "1/4": { weight: 8, ac: 12, hp: 18, attackBonus: 3, damage: 5, xp: 50 },
  "1/2": { weight: 2, ac: 13, hp: 27, attackBonus: 4, damage: 6, xp: 100 }
};

export const NPC_CLASSES = {
  none: "비모험가",
  fighter: "전사",
  paladin: "팔라딘",
  wizard: "마법사",
  sorcerer: "소서러",
  warlock: "워락",
  cleric: "클레릭",
  druid: "드루이드",
  ranger: "레인저",
  rogue: "로그",
  bard: "바드",
  barbarian: "바바리안",
  monk: "몽크"
} satisfies Record<NpcClassId, string>;

export const COUNTRY_ARCHETYPES = {
  balanced: "균형 국가",
  military: "군사 국가",
  arcane: "마법 국가",
  theocratic: "신정 국가",
  nature: "자연 국가",
  mercantile: "상업 국가"
} satisfies Record<CountryArchetype, string>;

export const NPC_PROFESSIONS: Record<NpcClassId, string> = {
  none: "평민",
  fighter: "기사",
  paladin: "성기사",
  wizard: "마법사",
  sorcerer: "마력 계승자",
  warlock: "계약술사",
  cleric: "성직자",
  druid: "자연의 수호자",
  ranger: "순찰대장",
  rogue: "첩보원",
  bard: "외교관",
  barbarian: "전투 지휘관",
  monk: "수도사"
};

export const MAJOR_NPC_GOALS = {
  country: [
    "왕위 계승 분쟁의 배후를 밝히려 한다",
    "국경을 위협하는 침공에 맞설 동맹을 모은다",
    "왕실의 금지된 유물이 사라진 사건을 조사한다",
    "국가의 운명을 바꿀 조약을 성사시키려 한다"
  ],
  continent: [
    "대륙 전역에 봉인된 고대의 위협을 추적한다",
    "여러 국가의 전쟁을 끝낼 연합을 이끈다",
    "대륙의 마력 균형이 무너지는 원인을 찾는다",
    "잊힌 시대의 재앙이 돌아오는 것을 막으려 한다"
  ]
};

export const NPC_RANKS = {
  common: "평민",
  trained: "숙련 인물",
  notable: "주요 인물",
  noble: "귀족",
  elite: "국가 핵심 인재",
  legendary: "전설적 인물"
} satisfies Record<NpcRank, string>;

export const NPC_SCOPES = { settlement: "정착지", country: "국가", continent: "대륙" } satisfies Record<
  NpcScope,
  string
>;

export const NPC_TIER_RANGES = [
  [1, 4],
  [5, 8],
  [9, 12],
  [13, 16],
  [17, 20]
] as const;
export const NPC_EPIC_MIN_LEVEL = 21;
export const NPC_PROFILE_MAX_LEVEL = 20;
export type ClassWeights = Partial<Record<Exclude<NpcClassId, "none">, number>>;
export const COUNTRY_CLASS_WEIGHTS: Record<CountryArchetype, ClassWeights> = {
  balanced: { fighter: 4, paladin: 2, wizard: 3, cleric: 2, druid: 2, ranger: 2, rogue: 2, bard: 2, monk: 1 },
  military: { fighter: 12, paladin: 8, ranger: 3, barbarian: 3, monk: 2, wizard: 1, cleric: 1 },
  arcane: { wizard: 14, sorcerer: 7, warlock: 4, bard: 2, fighter: 1, cleric: 1 },
  theocratic: { cleric: 14, paladin: 10, monk: 3, fighter: 2, wizard: 1, druid: 1 },
  nature: { druid: 14, ranger: 9, barbarian: 3, monk: 2, cleric: 1, fighter: 1 },
  mercantile: { bard: 9, rogue: 9, wizard: 4, fighter: 3, ranger: 2, cleric: 1 }
};

export const CLASS_PROFILES: Record<
  Exclude<NpcClassId, "none">,
  {
    hitDie: number;
    primary: number;
    armor: number;
    casting?: number;
  }
> = {
  fighter: { hitDie: 10, primary: 0, armor: 18 },
  paladin: { hitDie: 10, primary: 0, armor: 18, casting: 5 },
  wizard: { hitDie: 6, primary: 3, armor: 12, casting: 3 },
  sorcerer: { hitDie: 6, primary: 5, armor: 12, casting: 5 },
  warlock: { hitDie: 8, primary: 5, armor: 13, casting: 5 },
  cleric: { hitDie: 8, primary: 4, armor: 16, casting: 4 },
  druid: { hitDie: 8, primary: 4, armor: 14, casting: 4 },
  ranger: { hitDie: 10, primary: 1, armor: 15, casting: 4 },
  rogue: { hitDie: 8, primary: 1, armor: 14 },
  bard: { hitDie: 8, primary: 5, armor: 13, casting: 5 },
  barbarian: { hitDie: 12, primary: 0, armor: 14 },
  monk: { hitDie: 8, primary: 1, armor: 15 }
};
