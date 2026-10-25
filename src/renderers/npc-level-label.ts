import { NPC_CLASSES } from "@/data/npc-progression";
import { NPC_STAT_BLOCKS } from "@/data/npc-stat-blocks";
import { npcTier } from "@/generators/npc-progression";
import { t } from "@/services/ui-language";
import type { WorldNpc } from "@/types/campaign-world";

export function npcLevelLabel(npc: WorldNpc): string {
  const p = npc.progression;
  if (!p) return `CR ${NPC_STAT_BLOCKS[npc.templateId].cr}`;
  if (p.classId === "none") return `${t("비모험가")} · CR ${p.commonerCr || "0"}`;
  const tier = npcTier(p.level);
  return `${t(NPC_CLASSES[p.classId])} Lv.${p.level} · ${tier === "epic" ? t("에픽") : `T${tier}`}`;
}
