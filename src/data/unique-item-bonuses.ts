import type { UniqueItemBonus, UniqueItemSkill } from "@/types/world-item";
import type { MagicItemRarity } from "@/types/magic-item-reference";

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
  "기술 보정은 다른 유니크 아이템과 중첩되지 않으며 가장 높은 값만 적용합니다. 기본 명중·AC·주문 DC는 변경하지 않습니다.";
export const UNIQUE_ITEM_EQUIPMENT =
  "비소모품은 조율 중에만 추가 특성이 활성화됩니다. 기존 조율과 같은 슬롯을 사용하며, 추가 효과는 긴 휴식당 1회입니다. 임시 HP는 보너스 행동으로 획득합니다.";
export const UNIQUE_ITEM_CONSUMABLE =
  "물약·두루마리는 소모할 때 추가 효과가 1회 발동하고 기술 보정은 1시간 지속됩니다. 소모품의 원래 소모 규칙은 유지됩니다.";

export function uniqueItemBonusLines(bonus: UniqueItemBonus, tr: (value: string) => string): string[] {
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
