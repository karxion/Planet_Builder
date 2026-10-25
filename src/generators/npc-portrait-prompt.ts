import { NPC_CLASSES, NPC_RANKS } from "@/data/npc-progression";
import type { WorldNpc } from "@/types/campaign-world";

export function npcPortraitPrompt(npc: WorldNpc): string {
  const progression = npc.progression;
  return [
    "다음 설정의 판타지 TRPG NPC 캐릭터 초상화를 생성해주세요.",
    `이름: ${npc.name}`,
    `역할: ${npc.role}`,
    progression ? `직업: ${NPC_CLASSES[progression.classId]} · 지위: ${NPC_RANKS[progression.rank]}` : "",
    progression && progression.classId !== "none" ? `서사상 레벨: ${progression.level}` : "",
    `외형: ${npc.appearance || "역할에 어울리는 외형"}`,
    "상반신 중심의 단독 인물, 세밀한 의상과 소품, 자연스러운 조명, 완성도 높은 판타지 RPG 콘셉트 아트.",
    "세로 3:4 구도, 얼굴을 명확하게 표현하고 배경은 인물을 방해하지 않도록 구성해주세요.",
    "설정에 없는 나이·성별·종족은 임의의 필수 조건으로 간주하지 마세요. 텍스트·로고·워터마크는 넣지 마세요."
  ]
    .filter(Boolean)
    .join("\n");
}
