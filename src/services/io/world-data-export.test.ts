import { describe, expect, it } from "vitest";
import { buildWorldDataExport, exportCsv, exportFilename } from "@/services/io/world-data-export";
import { createWorldItem } from "@/generators/world-items";
import type { CampaignWorld, WorldNpc } from "@/types/campaign-world";
import type { DataExportOptions, WorldDataExportSource } from "@/types/world-data-export";

const options: DataExportOptions = { language: "ko", includePrivate: false, includeImages: false };
const npc = (id = "npc:1"): WorldNpc => ({
  id,
  villageId: "village:1",
  name: "기사 아린",
  role: "기사",
  templateId: "guard",
  appearance: "은빛 갑옷",
  personality: "신중함",
  goal: "왕국 수호",
  secret: "숨겨진 왕위",
  notes: "GM 전용 정보",
  edited: true,
  progression: { level: 12, classId: "fighter", rank: "noble", scope: "country", archetype: "military" }
});
const world = (): CampaignWorld => ({
  version: 1,
  ruleset: "srd-5.2.1",
  seed: "export",
  generation: 0,
  units: [
    { id: "country:1", name: "은빛 왕국", level: "country", sourceId: 1, stateId: 1, x: 0, y: 0 },
    { id: "village:1", parentId: "country:1", name: "새벽 도시", level: "village", sourceId: 1, stateId: 1, x: 1, y: 1 }
  ],
  npcs: [npc()]
});
function npcSource(value = world()): WorldDataExportSource {
  return { kind: "npcs", world: value, all: value.npcs, filtered: value.npcs, selected: [value.npcs[0]] };
}

describe("World data export", () => {
  it("exports unique numerical traits and homebrew provenance in JSON, CSV and print cards", () => {
    const value = world();
    const item = { ...createWorldItem("export", "item:unique", "보물"), category: "weapon" as const, rarity: "legendary" as const };
    const source: WorldDataExportSource = { kind: "items", world: value, all: [item], filtered: [item], selected: [item] };
    const before = structuredClone(item);
    const output = buildWorldDataExport(source, "all", options);
    expect(output.payload).toMatchObject({ items: [{ uniqueBonus: { effect: "forceDamage", magnitude: 3 }, uniqueBonusPolicy: "fpb-homebrew-not-official-srd" }] });
    expect(exportCsv(output)).toContain("역장 피해 3d6");
    expect(JSON.stringify(output.cards)).toContain("GM 승인 필요");
    expect(item).toEqual(before);
    const english = buildWorldDataExport(source, "all", { ...options, language: "en" });
    expect(english.rows[0].uniqueBonus).toContain("3d6 force damage");
    expect(english.rows[0].uniqueBonus).not.toMatch(/[가-힣]/);
    item.unique = false;
    expect(buildWorldDataExport(source, "all", options).rows[0].uniqueBonus).toBe("");
  });
  it("exports all filtered pages, selected or all records independently", () => {
    const value = world();
    value.npcs = Array.from({ length: 65 }, (_, i) => npc(`npc:${i}`));
    const source = { ...npcSource(value), filtered: value.npcs.slice(0, 45) } as WorldDataExportSource;
    expect(buildWorldDataExport(source, "filtered", options).rows).toHaveLength(45);
    expect(buildWorldDataExport(source, "all", options).rows).toHaveLength(65);
    expect(buildWorldDataExport(source, "selected", options).rows).toHaveLength(1);
  });
  it("omits secrets, notes and images by default without mutating committed data", () => {
    const source = npcSource();
    const before = JSON.stringify(source);
    const output = buildWorldDataExport(source, "all", options);
    expect(JSON.stringify(output)).not.toContain("숨겨진 왕위");
    expect(JSON.stringify(output)).not.toContain("GM 전용 정보");
    expect(JSON.stringify(source)).toBe(before);
    const privateOutput = buildWorldDataExport(source, "all", { ...options, includePrivate: true });
    expect(JSON.stringify(privateOutput.payload)).toContain("숨겨진 왕위");
    expect(exportCsv(privateOutput)).toContain("GM 전용 정보");
  });
  it("includes affiliations, tier scheme and computed combat profile distinct from SRD reference", () => {
    const output = buildWorldDataExport(npcSource(), "all", options);
    expect(output.rows[0]).toMatchObject({
      country: "은빛 왕국",
      village: "새벽 도시",
      level: "12",
      tier: "T3",
      cr: ""
    });
    expect(output.payload).toMatchObject({
      tierScheme: { epicMinLevel: 21 },
      npcs: [
        {
          narrativeTier: 3,
          combatProfile: { kind: "fpb-simplified-level-profile", level: 12 },
          statBlockUsage: "srd-base-reference-not-level-scaled"
        }
      ]
    });
  });
  it("keeps fractional Commoner CR separate from levels and does not invent Epic combat stats", () => {
    const value = world();
    value.npcs[0].progression = { ...value.npcs[0].progression!, level: 0, classId: "none", commonerCr: "1/8" };
    const commoner = buildWorldDataExport(npcSource(value), "all", options);
    expect(commoner.rows[0]).toMatchObject({ level: "", tier: "", cr: "CR 1/8" });
    value.npcs[0].progression = { ...value.npcs[0].progression!, level: 25, classId: "wizard" };
    const epic = buildWorldDataExport(npcSource(value), "all", options);
    expect(epic.rows[0]).toMatchObject({ level: "25", tier: "에픽", ac: "", hp: "", abilities: "" });
    expect(epic.payload).toMatchObject({ npcs: [{ narrativeTier: "epic", combatProfile: undefined }] });
  });
  it("handles cyclic or missing affiliations safely", () => {
    const value = world();
    value.units[0].parentId = "village:1";
    expect(buildWorldDataExport(npcSource(value), "all", options).rows[0].country).toBe("은빛 왕국");
    value.npcs[0].villageId = "missing";
    expect(buildWorldDataExport(npcSource(value), "all", options).rows[0].village).toBe("소속 마을 없음");
  });
  it("exports item owners independently of dungeon origins and only minimal NPC references", () => {
    const value = world();
    const item = createWorldItem("export", "item:1", "왕국");
    item.owner = { kind: "npc", id: value.npcs[0].id, label: "이전 이름" };
    item.reward = { markerId: 7, cell: 12, name: "잿빛 탑" };
    item.notes = "아이템 GM 비밀";
    const source: WorldDataExportSource = {
      kind: "items",
      world: value,
      all: [item],
      filtered: [item],
      selected: [item]
    };
    const output = buildWorldDataExport(source, "all", options);
    expect(output.rows[0]).toMatchObject({
      owner: "기사 아린",
      ownerId: "npc:1",
      dungeon: "잿빛 탑",
      markerId: "7",
      cell: "12"
    });
    expect(JSON.stringify(output.payload)).not.toContain("아이템 GM 비밀");
    expect(JSON.stringify(output.payload)).not.toContain("숨겨진 왕위");
    expect(output.payload).toMatchObject({ owners: [{ id: "npc:1", name: "기사 아린" }] });
    item.owner = { kind: "npc", id: "missing", label: "사라진 기사" };
    expect(buildWorldDataExport(source, "all", options).rows[0].owner).toContain("사라진 기사 (연결 대상 없음)");
  });
  it("includes only validated images when requested", () => {
    const value = world();
    value.npcs[0].portrait = "https://attacker.invalid/image.svg";
    expect(
      buildWorldDataExport(npcSource(value), "all", { ...options, includeImages: true }).cards[0].image
    ).toBeUndefined();
    value.npcs[0].portrait = "data:image/jpeg;base64,/9j/2Q==";
    const output = buildWorldDataExport(npcSource(value), "all", { ...options, includeImages: true });
    expect(output.cards[0].image).toBe(value.npcs[0].portrait);
    expect(JSON.stringify(output.payload)).toContain("data:image/jpeg");
  });
  it("uses BOM, escaped quotes and formula-safe cells for spreadsheets", () => {
    const output = buildWorldDataExport(npcSource(), "all", options);
    output.rows[0].name = '=HYPERLINK("https://example.invalid")';
    output.rows[0].role = '기사,"영주"\n두 번째 줄';
    const csv = exportCsv(output);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"\'=HYPERLINK(""https://example.invalid"")"');
    expect(csv).toContain('"기사,""영주""\n두 번째 줄"');
    for (const name of ["+SUM(1,2)", "-1+2", " @cmd", "\tunsafe", "\runsafe"]) {
      output.rows[0].name = name;
      expect(exportCsv(output)).toContain(`"'${name}"`);
    }
  });
  it("localizes headers without changing user-authored names or content", () => {
    const output = buildWorldDataExport(npcSource(), "all", { ...options, language: "en" });
    expect(output.title).toBe("Export NPC Data");
    expect(output.columns).toContainEqual(["name", "Name"]);
    expect(output.rows[0].name).toBe("기사 아린");
    expect(output.columns.map(([, label]) => label).filter(label => /[가-힣]/.test(label))).toEqual([]);
    const item = createWorldItem("export", "item:1", "왕국");
    const items = buildWorldDataExport(
      { kind: "items", world: world(), all: [item], filtered: [item], selected: [item] },
      "all",
      { ...options, language: "en" }
    );
    expect(items.columns.map(([, label]) => label).filter(label => /[가-힣]/.test(label))).toEqual([]);
    expect(exportFilename("items", "selected", "csv")).toBe("world-items-selected.csv");
  });
});
