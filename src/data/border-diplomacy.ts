import type { BorderRelation, DiplomaticState } from "@/types/border-diplomacy";

export const BORDER_RELATIONS: Record<BorderRelation, { label: string; color: string; legacy: string }> = {
  war: { label: "전쟁 중", color: "#db433e", legacy: "Enemy" },
  hostile: { label: "적대 관계", color: "#df973d", legacy: "Rival" },
  neutral: { label: "중립 관계", color: "#c8cbd0", legacy: "Neutral" },
  friendly: { label: "우호 관계", color: "#57a16b", legacy: "Friendly" },
  alliance: { label: "동맹 관계", color: "#4788c3", legacy: "Ally" },
  blood: { label: "혈맹 관계", color: "#af6fcd", legacy: "BloodAlly" },
  vassal: { label: "종속 관계", color: "#ddb83e", legacy: "Vassal" }
};
export const relationAsset = (kind: BorderRelation): string =>
  `${import.meta.env.BASE_URL}images/diplomacy/${kind}.png`;

export function borderRelation(a: DiplomaticState, b: DiplomaticState): BorderRelation {
  const statuses = [a.diplomacy?.[b.i], b.diplomacy?.[a.i]];
  if (statuses.includes("Enemy")) return "war";
  if (statuses.includes("Vassal") || statuses.includes("Suzerain")) return "vassal";
  if (statuses.includes("Rival") || statuses.includes("Suspicion")) return "hostile";
  if (statuses.includes("BloodAlly")) return "blood";
  if (statuses.includes("Ally")) return "alliance";
  if (statuses.includes("Friendly")) return "friendly";
  return "neutral";
}

export function vassalState(a: DiplomaticState, b: DiplomaticState): number | undefined {
  if (a.diplomacy?.[b.i] === "Vassal" || b.diplomacy?.[a.i] === "Suzerain") return a.i;
  if (b.diplomacy?.[a.i] === "Vassal" || a.diplomacy?.[b.i] === "Suzerain") return b.i;
}
