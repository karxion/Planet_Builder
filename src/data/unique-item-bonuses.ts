import type { UniqueItemBonus, UniqueItemSkill } from "@/types/world-item";
import type { MagicItemRarity } from "@/types/magic-item-reference";
import { UNIQUE_EFFECT_AXES, UNIQUE_EFFECT_BY_ID } from "./unique-item-effects";

export const UNIQUE_ITEM_BUDGETS: Record<MagicItemRarity, { check: number; dice: number; hp: number }> = {
  common: { check: 1, dice: 1, hp: 3 },
  uncommon: { check: 1, dice: 1, hp: 4 },
  rare: { check: 1, dice: 1, hp: 5 },
  veryRare: { check: 2, dice: 2, hp: 10 },
  legendary: { check: 3, dice: 3, hp: 15 },
  artifact: { check: 3, dice: 3, hp: 15 }
};

export const UNIQUE_ITEM_SKILLS: Record<UniqueItemSkill, string> = {
  athletics: "운동",
  stealth: "은신",
  perception: "지각",
  arcana: "비전학",
  insight: "통찰",
  persuasion: "설득",
  survival: "생존",
  medicine: "의학"
};

export const UNIQUE_ITEM_POLICY = "앱 창작 특성 · 공식 SRD 능력과 별도 · GM 승인 필요";
export const UNIQUE_ITEM_LIMITS =
  "동일 판정에 대한 유니크 보정은 가장 높은 값만 적용합니다. 저항은 해당 피해를 절반으로 줄이며 중첩되지 않습니다. 기본 명중·AC·주문 DC는 변경하지 않습니다.";
export const UNIQUE_ITEM_EQUIPMENT =
  "비소모품의 추가 효과는 기존 조율 슬롯을 사용하며, 조율 중 각 효과를 긴 휴식당 1회 사용할 수 있습니다. 행동과 지속시간은 각 설명을 따릅니다.";
export const UNIQUE_ITEM_CONSUMABLE =
  "물약·두루마리는 소모 시 추가 행동 없이 각 효과를 1회 발동합니다. 반응형 효과는 1시간 안에 조건을 만족할 때 발동하고, 미사용 시 사라집니다. 각 효과의 지속시간과 원래 소모 규칙을 유지합니다.";

export function uniqueItemBonusLines(
  bonus: UniqueItemBonus,
  tr: (value: string) => string,
  rarity: MagicItemRarity = "rare"
): string[] {
  if (bonus.version === 2) {
    const budget = UNIQUE_ITEM_BUDGETS[rarity];
    const values: Record<string, number> = {
      check: budget.check,
      dice: budget.dice,
      hp: budget.hp,
      dc: 12 + budget.check
    };
    return bonus.effects.map(entry => {
      const effect = UNIQUE_EFFECT_BY_ID.get(entry.id)!;
      const description = tr(effect.ko).replace(/\{(\w+)\}/g, (token, key: string) => String(values[key] ?? token));
      return `[${tr(UNIQUE_EFFECT_AXES[entry.axis])}] ${description}`;
    });
  }
  const effect =
    bonus.effect === "forceDamage"
      ? tr("공격 적중 시 역장 피해 {value}d6 추가 (선택한 적중 1회)").replace("{value}", String(bonus.magnitude))
      : bonus.effect === "healing"
        ? tr("섭취 시 HP {value}d6 추가 회복 (최대 HP 초과 불가)").replace("{value}", String(bonus.magnitude))
        : tr("추가 임시 HP {value} (1시간, 다른 임시 HP와 중첩 불가)").replace("{value}", String(bonus.magnitude));
  return [
    `${tr(UNIQUE_ITEM_SKILLS[bonus.skill])} ${tr("기술 판정")} +${bonus.checkBonus}`,
    effect,
    tr("정체를 알아보는 인물에게 소유주의 권위·전승을 증명하는 상징으로 인정됩니다. 자동 설득 성공은 아닙니다.")
  ];
}
