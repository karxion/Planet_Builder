import type { CountryArchetype } from "@/types/campaign-world";
import type { MagicItemCategory, MagicItemRarity } from "@/types/magic-item-reference";
import type { ItemGeography, UniqueEffectAxis, UniqueItemOrigin } from "@/types/world-item";

export type ItemHistory = "oath" | "war" | "ritual" | "rescue" | "journey" | "legacy";
export interface UniqueEffectDefinition {
  id: string;
  axis: UniqueEffectAxis;
  theme: string;
  ko: string;
  en: string;
}
// These are original FPB powers, not imported spell rules. Each entry is one mechanical effect.
const effect = (axis: UniqueEffectAxis, theme: string, id: string, ko: string, en: string): UniqueEffectDefinition => ({
  axis,
  theme,
  id,
  ko,
  en
});
export const UNIQUE_EFFECTS: readonly UniqueEffectDefinition[] = [
  effect(
    "category",
    "weapon",
    "weapon-strike",
    "룬 타격: 공격 적중 1회에 역장 피해 {dice}d6을 추가합니다.",
    "Runic strike: add {dice}d6 force damage to one attack hit."
  ),
  effect(
    "category",
    "weapon",
    "weapon-aim",
    "룬의 겨냥: 보너스 행동으로 이번 턴의 다음 무기 공격 1회에 유리점을 얻습니다.",
    "Runic aim: as a bonus action, gain advantage on your next weapon attack this turn."
  ),
  effect(
    "category",
    "armor",
    "armor-guard",
    "충격 분산: 피해를 받을 때 반응행동으로 그 피해를 {dice}d6만큼 줄입니다 (최소 0).",
    "Impact guard: use a reaction when damaged to reduce that damage by {dice}d6 (minimum 0)."
  ),
  effect(
    "category",
    "armor",
    "armor-anchor",
    "닻의 자세: 보너스 행동으로 1분간 강제 이동과 넘어짐을 막는 내성 굴림에 +{check}를 받습니다.",
    "Anchored stance: as a bonus action, gain +{check} to saves against forced movement and being knocked prone for 1 minute."
  ),
  effect(
    "category",
    "potion",
    "potion-purge",
    "정화의 한 모금: 섭취 시 자신에게 걸린 중독 상태 하나를 끝냅니다. 독 피해를 되돌리지는 않습니다.",
    "Purifying draught: end one poisoned condition affecting you on consumption. Does not undo poison damage."
  ),
  effect(
    "category",
    "potion",
    "potion-mend",
    "회복의 잔향: 섭취 시 HP {dice}d6을 회복합니다 (최대 HP 초과 불가).",
    "Restorative echo: regain {dice}d6 HP on consumption (cannot exceed maximum HP)."
  ),
  effect(
    "category",
    "ring",
    "ring-step",
    "틈새 걸음: 보너스 행동으로 보이는 빈 공간으로 최대 15ft 순간이동합니다.",
    "Rift step: as a bonus action, teleport up to 15 ft to an unoccupied space you can see."
  ),
  effect(
    "category",
    "ring",
    "ring-veil",
    "흐릿한 윤곽: 보너스 행동으로 다음 자기 턴 시작 전 자신을 향한 첫 공격 굴림에 불리점을 줍니다.",
    "Blurred outline: as a bonus action, impose disadvantage on the first attack roll against you before your next turn starts."
  ),
  effect(
    "category",
    "rod",
    "rod-command",
    "지휘의 신호: 보너스 행동으로 30ft 내 들을 수 있는 아군 하나가 반응행동으로 기회공격 없이 10ft 이동하게 합니다.",
    "Command signal: as a bonus action, let one ally within 30 ft who can hear you use a reaction to move 10 ft without opportunity attacks."
  ),
  effect(
    "category",
    "rod",
    "rod-binding",
    "구속의 문양: 행동으로 30ft 내 보이는 적 하나에게 근력 DC {dc} 내성을 요구합니다. 실패하면 다음 자기 턴 시작까지 속도가 0이 됩니다.",
    "Binding sigil: as an action, one visible enemy within 30 ft makes a DC {dc} Strength save. On failure, its speed becomes 0 until your next turn starts."
  ),
  effect(
    "category",
    "staff",
    "staff-root",
    "뿌리 다리: 행동으로 30ft 내 10ft 정사각형의 비마법적 험지를 10분간 일반 지형으로 바꿉니다.",
    "Root bridge: as an action, make a 10-ft square of nonmagical difficult terrain within 30 ft normal terrain for 10 minutes."
  ),
  effect(
    "category",
    "staff",
    "staff-pulse",
    "비전 파동: 행동으로 30ft 내 보이는 대상 하나에게 민첩 DC {dc} 내성을 요구합니다. 실패하면 역장 피해 {dice}d6을 줍니다 (성공 시 0).",
    "Arcane pulse: as an action, one visible target within 30 ft makes a DC {dc} Dexterity save, taking {dice}d6 force damage on failure (0 on success)."
  ),
  effect(
    "category",
    "wand",
    "wand-trace",
    "마력 흔적 감지: 행동으로 10분간 30ft 내 보이는 마법 물체에 희미한 빛을 봅니다. 학파·정체·저주는 식별하지 못합니다.",
    "Sense magic traces: as an action, see a faint glow on visible magical objects within 30 ft for 10 minutes. Does not identify schools, properties or curses."
  ),
  effect(
    "category",
    "wand",
    "wand-light",
    "길잡이 빛: 행동으로 60ft 내 빛 구체를 만듭니다. 20ft 밝은 빛과 추가 20ft 희미한 빛을 1시간 제공하며 보너스 행동으로 30ft 옮깁니다.",
    "Guiding light: as an action, create a light orb within 60 ft for 1 hour, shedding 20 ft of bright and 20 ft of dim light. Move it 30 ft as a bonus action."
  ),
  effect(
    "category",
    "scroll",
    "scroll-memory",
    "기억의 각인: 소모 시 보이는 문서 한 쪽의 내용을 24시간 정확히 기억합니다. 모르는 언어는 번역하지 못합니다.",
    "Memory imprint: on consumption, recall one visible page exactly for 24 hours. Does not translate unknown languages."
  ),
  effect(
    "category",
    "scroll",
    "scroll-ward",
    "문자 방벽: 소모 시 1시간 동안 다음 자신을 향한 주문 피해 1회를 {dice}d6만큼 줄입니다 (최소 0).",
    "Written ward: for 1 hour after consumption, reduce the next instance of spell damage you take by {dice}d6 (minimum 0)."
  ),
  effect(
    "category",
    "wondrous",
    "wondrous-feather",
    "깃털의 약속: 자신 또는 30ft 내 보이는 아군이 추락할 때 반응행동으로 낙하를 늦춰 그 추락의 피해를 0으로 만듭니다.",
    "Feather promise: use a reaction when you or a visible ally within 30 ft falls to slow that fall and prevent its falling damage."
  ),
  effect(
    "category",
    "wondrous",
    "wondrous-shelter",
    "여행자의 쉼터: 행동으로 비와 바람을 막는 반경 10ft의 천막을 8시간 만듭니다. 공격이나 생물의 이동을 막지 않습니다.",
    "Traveler shelter: as an action, create a 10-ft-radius canopy against rain and wind for 8 hours. It blocks neither attacks nor creatures."
  ),
  effect(
    "nation",
    "military",
    "military-drill",
    "전열의 훈련: 보너스 행동으로 1시간 동안 운동 판정에 +{check}를 받습니다.",
    "Battle drill: as a bonus action, gain +{check} to Athletics checks for 1 hour."
  ),
  effect(
    "nation",
    "military",
    "military-courage",
    "군기의 용기: 공포 상태를 막거나 끝내는 내성 1회에 반응행동으로 +{check}를 더합니다. 굴림 후 결과 확정 전에 사용합니다.",
    "Banner courage: use a reaction after rolling but before the outcome to add +{check} to one save against becoming or remaining frightened."
  ),
  effect(
    "nation",
    "arcane",
    "arcane-study",
    "학파의 지식: 보너스 행동으로 1시간 동안 비전학 판정에 +{check}를 받습니다.",
    "Academy lore: as a bonus action, gain +{check} to Arcana checks for 1 hour."
  ),
  effect(
    "nation",
    "arcane",
    "arcane-mind",
    "정신의 봉인: 매혹 상태를 막거나 끝내는 내성 1회에 반응행동으로 +{check}를 더합니다. 굴림 후 결과 확정 전에 사용합니다.",
    "Mind seal: use a reaction after rolling but before the outcome to add +{check} to one save against becoming or remaining charmed."
  ),
  effect(
    "nation",
    "theocratic",
    "sacred-mercy",
    "성소의 자비: 행동으로 접촉한 생물 하나의 HP를 {dice}d6 회복합니다 (최대 HP 초과 불가).",
    "Sanctuary mercy: as an action, restore {dice}d6 HP to one creature you touch (cannot exceed maximum HP)."
  ),
  effect(
    "nation",
    "theocratic",
    "sacred-radiance",
    "성화의 수호: 보너스 행동으로 1분 동안 사령 피해에 저항을 얻습니다.",
    "Sacred ward: as a bonus action, gain resistance to necrotic damage for 1 minute."
  ),
  effect(
    "nation",
    "nature",
    "nature-trail",
    "숲의 지혜: 보너스 행동으로 1시간 동안 생존 판정에 +{check}를 받습니다.",
    "Wild wisdom: as a bonus action, gain +{check} to Survival checks for 1 hour."
  ),
  effect(
    "nation",
    "nature",
    "nature-speech",
    "야수의 말: 행동으로 10분 동안 야수와 단순한 의사를 주고받습니다. 복종을 강제하지 않습니다.",
    "Beast speech: as an action, communicate simple ideas with beasts for 10 minutes. Does not compel obedience."
  ),
  effect(
    "nation",
    "mercantile",
    "merchant-eye",
    "교역자의 눈: 보너스 행동으로 1시간 동안 거래 상대의 거짓말을 가려내는 통찰 판정에 +{check}를 받습니다.",
    "Merchant eye: as a bonus action, gain +{check} to Insight checks to detect a trading partner's lies for 1 hour."
  ),
  effect(
    "nation",
    "mercantile",
    "merchant-tongue",
    "사절의 언변: 보너스 행동으로 1시간 동안 설득 판정에 +{check}를 받습니다. 자동 성공은 아닙니다.",
    "Envoy voice: as a bonus action, gain +{check} to Persuasion checks for 1 hour. Does not guarantee success."
  ),
  effect(
    "nation",
    "balanced",
    "balanced-insight",
    "중재자의 통찰: 보너스 행동으로 1시간 동안 통찰 판정에 +{check}를 받습니다.",
    "Mediator insight: as a bonus action, gain +{check} to Insight checks for 1 hour."
  ),
  effect(
    "nation",
    "balanced",
    "balanced-watch",
    "경계의 전통: 보너스 행동으로 1시간 동안 지각 판정에 +{check}를 받습니다.",
    "Watchful tradition: as a bonus action, gain +{check} to Perception checks for 1 hour."
  ),
  effect(
    "history",
    "oath",
    "oath-guard",
    "맹세의 방패: 30ft 내 보이는 아군이 피해를 받을 때 반응행동으로 그 피해를 {dice}d6만큼 줄입니다 (최소 0).",
    "Oath shield: use a reaction when a visible ally within 30 ft takes damage to reduce it by {dice}d6 (minimum 0)."
  ),
  effect(
    "history",
    "war",
    "war-rally",
    "전장의 재기: 보너스 행동으로 임시 HP {hp}를 얻습니다. 1시간 지속되며 다른 임시 HP와 중첩되지 않습니다.",
    "Battle rally: as a bonus action, gain {hp} temporary HP for 1 hour. Does not stack with other temporary HP."
  ),
  effect(
    "history",
    "ritual",
    "ritual-message",
    "의식의 메아리: 행동으로 120ft 내 보이는 생물 하나에게 25단어 이하의 정신 메시지를 보내고 같은 길이의 답을 받습니다. 공통 언어가 필요합니다.",
    "Ritual echo: as an action, send a mental message of up to 25 words to one visible creature within 120 ft and receive a reply of the same length. Requires a shared language."
  ),
  effect(
    "history",
    "rescue",
    "rescue-breath",
    "구원의 숨결: 행동으로 접촉한 의식 없는 생물 하나를 안정화하고 HP 1을 회복시킵니다. 죽은 생물에는 효과가 없습니다.",
    "Rescuing breath: as an action, stabilize one unconscious creature you touch and restore 1 HP. Has no effect on the dead."
  ),
  effect(
    "history",
    "journey",
    "journey-compass",
    "귀향의 나침반: 행동으로 지금 서 있는 장소를 기억합니다. 24시간 동안 같은 차원에서 그 장소의 방향을 압니다. 경로나 거리는 알 수 없습니다.",
    "Homeward compass: as an action, mark your current location. For 24 hours on the same plane, know its direction, but not a route or distance."
  ),
  effect(
    "history",
    "legacy",
    "legacy-memory",
    "선대의 기억: 보너스 행동으로 1시간 동안 역사 판정에 +{check}를 받습니다.",
    "Ancestral memory: as a bonus action, gain +{check} to History checks for 1 hour."
  ),
  effect(
    "geography",
    "coast",
    "coast-breath",
    "바다의 숨: 보너스 행동으로 1시간 동안 수중 호흡을 얻습니다. 수영 속도는 바뀌지 않습니다.",
    "Sea breath: as a bonus action, breathe underwater for 1 hour. Does not change swimming speed."
  ),
  effect(
    "geography",
    "coast",
    "coast-walk",
    "파도 걸음: 보너스 행동으로 10분 동안 잔잔한 물 표면을 지면처럼 걷습니다. 용암에는 적용되지 않습니다.",
    "Wave walk: as a bonus action, walk on calm water as solid ground for 10 minutes. Does not apply to lava."
  ),
  effect(
    "geography",
    "forest",
    "forest-hide",
    "수풀의 장막: 보너스 행동으로 1시간 동안 초목 사이에 숨는 은신 판정에 +{check}를 받습니다.",
    "Thicket veil: as a bonus action, gain +{check} to Stealth checks to hide among vegetation for 1 hour."
  ),
  effect(
    "geography",
    "mountain",
    "mountain-grip",
    "암벽의 손아귀: 보너스 행동으로 10분 동안 20ft 등반 속도를 얻습니다. 손을 쓸 수 있어야 합니다.",
    "Mountain grip: as a bonus action, gain a 20-ft climbing speed for 10 minutes. Requires free use of your hands."
  ),
  effect(
    "geography",
    "desert",
    "desert-cool",
    "사막의 냉기: 보너스 행동으로 1분 동안 화염 피해에 저항을 얻습니다.",
    "Desert cool: as a bonus action, gain resistance to fire damage for 1 minute."
  ),
  effect(
    "geography",
    "tundra",
    "tundra-warmth",
    "설원의 온기: 보너스 행동으로 1분 동안 냉기 피해에 저항을 얻습니다.",
    "Tundra warmth: as a bonus action, gain resistance to cold damage for 1 minute."
  ),
  effect(
    "geography",
    "swamp",
    "swamp-ward",
    "늪지의 해독: 보너스 행동으로 1분 동안 독 피해에 저항을 얻습니다.",
    "Marsh ward: as a bonus action, gain resistance to poison damage for 1 minute."
  ),
  effect(
    "geography",
    "plains",
    "plains-stride",
    "평원의 보폭: 보너스 행동으로 1분 동안 보행 속도가 10ft 증가합니다.",
    "Plains stride: as a bonus action, increase your walking speed by 10 ft for 1 minute."
  ),
  effect(
    "geography",
    "underground",
    "deep-sight",
    "심층의 시야: 보너스 행동으로 1시간 동안 60ft 암시야를 얻습니다. 기존 암시야 거리에 더하지 않습니다.",
    "Deep sight: as a bonus action, gain darkvision to 60 ft for 1 hour. Does not add to existing darkvision range."
  ),
  effect(
    "rarity",
    "rare",
    "rare-focus",
    "희귀한 집중: 집중 유지 내성 1회에 반응행동으로 +{check}를 더합니다. 굴림 후 결과 확정 전에 사용합니다.",
    "Rare focus: use a reaction after rolling but before the outcome to add +{check} to one save to maintain concentration."
  ),
  effect(
    "rarity",
    "veryRare",
    "greater-luck",
    "운명의 수정: 실패한 능력 판정 하나를 즉시 다시 굴립니다. 새 결과를 사용합니다.",
    "Fortune shift: immediately reroll one failed ability check. Use the new result."
  ),
  effect(
    "rarity",
    "legendary",
    "legendary-refusal",
    "전설의 거부: 내성에 실패한 직후 반응행동으로 다시 굴립니다. 새 결과를 사용합니다.",
    "Legendary refusal: use a reaction immediately after failing a saving throw to reroll it. Use the new result."
  )
];
export const UNIQUE_EFFECT_BY_ID = new Map(UNIQUE_EFFECTS.map(effect => [effect.id, effect]));
export const UNIQUE_EFFECT_COUNTS: Record<MagicItemRarity, number> = {
  common: 1,
  uncommon: 1,
  rare: 2,
  veryRare: 3,
  legendary: 4,
  artifact: 4
};
export const UNIQUE_EFFECT_AXES: Record<UniqueEffectAxis, string> = {
  category: "카테고리",
  nation: "국가 성향",
  rarity: "등급",
  history: "제작 배경",
  geography: "지리적 배경"
};
export const ITEM_GEOGRAPHIES: readonly ItemGeography[] = [
  "unknown",
  "coast",
  "forest",
  "mountain",
  "desert",
  "tundra",
  "swamp",
  "plains",
  "underground"
];
export const ITEM_ARCHETYPES: readonly CountryArchetype[] = [
  "balanced",
  "military",
  "arcane",
  "theocratic",
  "nature",
  "mercantile"
];
export function isUniqueItemOrigin(value: unknown): value is UniqueItemOrigin {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const origin = value as Record<string, unknown>;
  return (
    ITEM_ARCHETYPES.some(archetype => archetype === origin.archetype) &&
    ITEM_GEOGRAPHIES.some(geography => geography === origin.geography)
  );
}
export const ITEM_CATEGORIES: readonly MagicItemCategory[] = [
  "weapon",
  "armor",
  "potion",
  "ring",
  "rod",
  "staff",
  "wand",
  "scroll",
  "wondrous"
];
export const UNIQUE_EFFECT_TRANSLATIONS: readonly (readonly [string, string])[] = [
  ...UNIQUE_EFFECTS.map(effect => [effect.en, effect.ko] as const),
  ["Category", "카테고리"],
  ["National archetype", "국가 성향"],
  ["Power tier", "등급"],
  ["Creation background", "제작 배경"],
  ["Geographical background", "지리적 배경"],
  [
    "Each additional power of non-consumables can be used once per long rest while attuned, using the item's existing attunement slot. Follow each power's action and duration.",
    "비소모품의 추가 효과는 기존 조율 슬롯을 사용하며, 조율 중 각 효과를 긴 휴식당 1회 사용할 수 있습니다. 행동과 지속시간은 각 설명을 따릅니다."
  ],
  [
    "Potions and scrolls activate all additional powers once when consumed, without extra actions. Reactive powers instead wait for their trigger within 1 hour, then expire. Keep each listed duration and the original consumption rules.",
    "물약·두루마리는 소모 시 추가 행동 없이 각 효과를 1회 발동합니다. 반응형 효과는 1시간 안에 조건을 만족할 때 발동하고, 미사용 시 사라집니다. 각 효과의 지속시간과 원래 소모 규칙을 유지합니다."
  ],
  [
    "Bonuses to the same check do not stack across unique items; use the highest. Resistance halves the matching damage and does not stack. Base attack bonus, AC and spell DC are unchanged.",
    "동일 판정에 대한 유니크 보정은 가장 높은 값만 적용합니다. 저항은 해당 피해를 절반으로 줄이며 중첩되지 않습니다. 기본 명중·AC·주문 DC는 변경하지 않습니다."
  ]
];
