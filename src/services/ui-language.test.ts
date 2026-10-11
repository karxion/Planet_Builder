import { describe, expect, it } from "vitest";
import { NPC_STAT_BLOCKS } from "@/data/npc-stat-blocks";
import { UI_TRANSLATIONS } from "@/data/ui-translations";
import { translateText } from "./ui-language";

describe("UI language catalog", () => {
  it("translates English legacy labels and Korean app labels in both directions", () => {
    expect(translateText("Layers", "ko")).toBe("레이어");
    expect(translateText("레이어", "en")).toBe("Layers");
    expect(translateText("판타지 행성 빌더", "en")).toBe("Fantasy Planet Builder");
    expect(translateText("행성 설정", "ko")).toBe("행성 설정");
  });

  it("preserves surrounding whitespace and colons", () => {
    expect(translateText("\n  Layers preset:  ", "ko")).toBe("\n  레이어 프리셋:  ");
    expect(translateText("이름:", "en")).toBe("Name:");
  });

  it("interpolates counts and user names without translating the user value", () => {
    expect(translateText("{count}명", "en", { count: 42 })).toBe("42 NPCs");
    expect(translateText("전체 {unit}", "en", { unit: "Country" })).toBe("All Country");
    expect(translateText("{name} NPC를 삭제할까요?", "en", { name: "Guard" })).toBe("Delete NPC Guard?");
    expect(translateText("규칙 원문 p.{page}", "en", { page: 296 })).toBe("Source rules p.296");
  });

  it("keeps unknown content unchanged and missing interpolation visible", () => {
    expect(translateText("  Arin\n  the Cartographer  ", "ko")).toBe("  Arin\n  the Cartographer  ");
    expect(translateText("Unknown interface label", "en")).toBe("Unknown interface label");
    expect(translateText("{count}명", "en")).toBe("{count} NPCs");
  });

  it("translates compositional legacy layer and editor tooltips", () => {
    expect(
      translateText("Rivers: click to toggle, drag to raise or lower the layer. Ctrl + click to edit layer style", "ko")
    ).toBe("강: 클릭하여 표시 전환, 드래그하여 순서 변경. Ctrl + 클릭으로 스타일 편집");
    expect(translateText("Click to open Biomes Editor", "ko")).toBe("생물군계 편집기 열기");
  });

  it("covers the NPC rules without changing their numbers or saved template identifiers", () => {
    for (const block of Object.values(NPC_STAT_BLOCKS)) {
      for (const text of [
        block.name,
        block.skills,
        block.languages,
        block.gear,
        ...block.traits,
        ...block.actions,
        ...block.reactions
      ]) {
        expect(translateText(text, "en")).not.toMatch(/[가-힣]/);
      }
    }
  });

  it("has no conflicting English source keys", () => {
    const seen = new Map<string, string>();
    for (const [en, ko] of UI_TRANSLATIONS) {
      const old = seen.get(en);
      if (old) expect(ko, en).toBe(old);
      seen.set(en, ko);
    }
  });
});
