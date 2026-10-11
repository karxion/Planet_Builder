import type { NpcStatBlock, NpcTemplateId } from "@/types/campaign-world";

export const SRD_URL = "https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf";
export const SRD_ATTRIBUTION =
  'This work includes material from the System Reference Document 5.2.1 ("SRD 5.2.1") by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.';

// SRD 5.2.1 stat blocks; Korean descriptions are adaptations, not PC class builds.
export const NPC_STAT_BLOCKS: Record<NpcTemplateId, NpcStatBlock> = {
  commoner: {
    name: "일반인 (Commoner)",
    page: 275,
    ac: 10,
    hp: 4,
    hitDice: "1d8",
    cr: "0",
    xp: 10,
    abilities: [10, 10, 10, 10, 10, 10],
    skills: "훈련: 조사 +2 (숙련 선택)",
    passivePerception: 10,
    languages: "공용어",
    gear: "곤봉",
    traits: ["훈련: 조사 판정에 숙련을 적용하며 이점을 받는다."],
    actions: ["곤봉: 근접 명중 +2, 사거리 5ft, 타격 피해 2 (1d4)."],
    reactions: []
  },
  guard: {
    name: "경비병 (Guard)",
    page: 296,
    ac: 16,
    hp: 11,
    hitDice: "2d8 + 2",
    cr: "1/8",
    xp: 25,
    abilities: [13, 12, 12, 10, 11, 10],
    skills: "지각 +2",
    passivePerception: 12,
    languages: "공용어",
    gear: "사슬 셔츠, 방패, 창",
    traits: [],
    actions: ["창: 근접/원거리 명중 +3, 사거리 5ft 또는 20/60ft, 관통 피해 4 (1d6 + 1)."],
    reactions: []
  },
  scout: {
    name: "정찰병 (Scout)",
    page: 322,
    ac: 13,
    hp: 16,
    hitDice: "3d8 + 3",
    cr: "1/2",
    xp: 100,
    abilities: [11, 14, 12, 11, 13, 11],
    skills: "자연 +4, 지각 +5, 은신 +6, 생존 +5",
    passivePerception: 15,
    languages: "공용어, 엘프어 (추가 언어 선택)",
    gear: "가죽 갑옷, 장궁, 소검",
    traits: [],
    actions: [
      "다중공격: 소검과 장궁을 조합하여 두 번 공격한다.",
      "소검: 근접 명중 +4, 사거리 5ft, 관통 피해 5 (1d6 + 2).",
      "장궁: 원거리 명중 +4, 사거리 150/600ft, 관통 피해 6 (1d8 + 2)."
    ],
    reactions: []
  },
  noble: {
    name: "귀족 (Noble)",
    page: 312,
    ac: 15,
    hp: 9,
    hitDice: "2d8",
    cr: "1/8",
    xp: 25,
    abilities: [11, 12, 11, 12, 14, 16],
    skills: "기만 +5, 통찰 +4, 설득 +5",
    passivePerception: 12,
    languages: "공용어, 드워프어, 엘프어 (추가 언어 선택)",
    gear: "흉갑, 레이피어",
    traits: [],
    actions: ["레이피어: 근접 명중 +3, 사거리 5ft, 관통 피해 5 (1d8 + 1)."],
    reactions: [
      "받아넘기기: 무기를 들고 있을 때 근접 공격에 명중당하면 그 공격에 대한 AC를 2 높인다. 이로 인해 공격이 빗나갈 수 있다."
    ]
  }
};

export const abilityModifier = (score: number): number => Math.floor((score - 10) / 2);
