import { describe, expect, it } from "vitest";
import { isCampaignWorld } from "@/data/campaign-validation";
import { npcPortraitPrompt } from "@/generators/npc-portrait-prompt";
import { createPlanetProject, decodePlanetProject, encodePlanetProject } from "@/services/planet/project-codec";
import type { CampaignWorld, WorldNpc } from "@/types/campaign-world";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { isNpcPortrait, MAX_NPC_PORTRAIT_LENGTH } from "./npc-portrait";

const portrait = "data:image/jpeg;base64,/9j/2Q==";
const npc: WorldNpc = {
  id: "npc:1:0",
  villageId: "village:1",
  name: "리브",
  role: "기사",
  templateId: "noble",
  appearance: "녹색 외투",
  personality: "과묵함",
  goal: "비공개 목표",
  secret: "비공개 비밀",
  notes: "GM 전용 메모",
  edited: true,
  portrait,
  progression: { level: 7, classId: "fighter", rank: "noble", scope: "settlement", archetype: "military" }
};
const world: CampaignWorld = {
  version: 1,
  ruleset: "srd-5.2.1",
  seed: "portrait",
  generation: 0,
  units: [],
  npcs: [npc]
};

describe("NPC portraits", () => {
  it("accepts only bounded inline JPEG data, not URLs or executable markup", () => {
    expect(isNpcPortrait(portrait)).toBe(true);
    for (const value of [
      "https://example.com/a.jpg",
      "data:image/svg+xml,<svg onload=alert(1)>",
      "javascript:alert(1)",
      null,
      "data:image/jpeg;base64,abcd",
      "data:image/jpeg;base64,/9j/" + "A".repeat(MAX_NPC_PORTRAIT_LENGTH)
    ])
      expect(isNpcPortrait(value)).toBe(false);
  });
  it("keeps old worlds compatible and rejects malformed portrait fields", () => {
    expect(isCampaignWorld(world)).toBe(true);
    expect(isCampaignWorld({ ...world, npcs: [{ ...npc, portrait: undefined }] })).toBe(true);
    expect(isCampaignWorld({ ...world, npcs: [{ ...npc, portrait: "https://tracking.example/portrait" }] })).toBe(
      false
    );
  });
  it("uses public appearance and class information, excluding private narrative fields", () => {
    const prompt = npcPortraitPrompt(npc);
    expect(prompt).toContain("녹색 외투");
    expect(prompt).toContain("7");
    for (const text of [npc.secret, npc.notes, npc.goal, npc.personality, portrait]) expect(prompt).not.toContain(text);
  });
  it("preserves the portrait, notes and progression through compressed project round trips", async () => {
    const project = createPlanetProject({
      mapPayload: `1.135.0|license|seed\r\n<svg>${"x".repeat(120)}</svg>`,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135.0",
      upstreamCommit: "test"
    });
    project.campaign = world;
    const restored = await decodePlanetProject(await encodePlanetProject(project));
    expect(restored.campaign).toEqual(world);
  });
});
