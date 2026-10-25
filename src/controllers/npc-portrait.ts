import { npcPortraitPrompt } from "@/generators/npc-portrait-prompt";
import type { WorldNpc } from "@/types/campaign-world";
import { mountImageHandoff } from "./image-handoff";

export function mountNpcPortrait(options: {
  form: HTMLFormElement;
  npc: WorldNpc;
  getDraft: () => WorldNpc | undefined;
  onChange: (portrait: string | undefined) => boolean;
}): void {
  mountImageHandoff({
    form: options.form,
    image: options.npc.portrait,
    getPrompt: () => npcPortraitPrompt(options.getDraft() || options.npc),
    onChange: options.onChange,
    idPrefix: "fpb-npc-portrait",
    subject: "NPC 초상화",
    deleteQuestion: "등록된 NPC 이미지를 삭제할까요?"
  });
}
