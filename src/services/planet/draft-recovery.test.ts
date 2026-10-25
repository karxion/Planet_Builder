import { describe, expect, it } from "vitest";
import { createCampaign } from "@/generators/campaign-generator";
import type { EditorDraftSnapshot } from "@/types/editor-draft";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { createDraftRecovery, readDraftRecovery } from "./draft-recovery";
import { createPlanetProject } from "./project-codec";

const owner = { id: "snapshot-one", projectId: "project-one" };
const project = createPlanetProject({
  mapPayload: `1.135.0|license|2026-7-12|123|960|540|1\r\nsettings\r\n{}\r\nbiomes\r\nnotes\r\n<svg id="map">${"x".repeat(120)}</svg>`,
  settings: DEFAULT_PLANET_SETTINGS,
  fmgVersion: "1.135.0",
  upstreamCommit: "test"
});
project.campaign = createCampaign(
  {
    states: [{ id: 1, name: "나라", x: 1, y: 1 }],
    fiefs: [],
    villages: [{ id: 1, stateId: 1, fiefId: 0, name: "마을", x: 1, y: 1, capital: true, port: false, population: 10 }]
  },
  "draft-world"
);
const settings: EditorDraftSnapshot = {
  key: "planet-settings",
  baseline: { name: "원래 행성", radiusKm: "6371", heightmapPreset: "continents" },
  values: { name: "수정 중인 행성", radiusKm: "", heightmapPreset: "archipelago" }
};

describe("Draft recovery boundary", () => {
  it("round-trips raw form values without applying them to project data", () => {
    const before = structuredClone(project);
    const { drafts, draftBytes } = createDraftRecovery([settings], owner);
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries: [settings], rejected: false });
    expect(draftBytes).toBeGreaterThan(0);
    expect(project).toEqual(before);
  });

  it.each(["projectId", "snapshotId"] as const)("rejects drafts paired with a different %s", key => {
    const { drafts } = createDraftRecovery([settings], owner);
    drafts[key] = "another";
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries: [], rejected: true });
  });

  it("accepts older recovery snapshots without a draft section", () => {
    expect(readDraftRecovery(undefined, owner, project)).toEqual({ entries: [], rejected: false });
  });

  it("restores NPC, item, religion and history drafts only for existing entities", () => {
    const npc = project.campaign!.npcs[0];
    const treasure = project.campaign!.heritage!.treasures[0];
    const religion = project.campaign!.heritage!.religions[0];
    const entries: EditorDraftSnapshot[] = [
      {
        key: `npc:${npc.id}`,
        baseline: { name: npc.name, templateId: npc.templateId },
        values: { name: "초안 NPC", templateId: "noble", classId: "wizard", level: "" }
      },
      {
        key: `heritage:${treasure.id}`,
        baseline: { name: treasure.name, rarity: treasure.rarity },
        values: { name: "초안 보물", rarity: "legendary" }
      },
      {
        key: `heritage:${religion.id}`,
        baseline: { name: religion.name },
        values: { name: "초안 종교", alignment: "LG", deityRank: "greater" }
      },
      { key: "history:1", baseline: { age: "100" }, values: { age: "" } }
    ];
    const { drafts } = createDraftRecovery(entries, owner);
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries, rejected: false });
    const withoutEntities = { ...project, campaign: undefined };
    expect(readDraftRecovery(drafts, owner, withoutEntities)).toEqual({ entries: [], rejected: true });
  });

  it("filters bad entries without losing valid drafts or executing markup", () => {
    const good = { ...settings, values: { ...settings.values, name: '<img src=x onerror="bad()">' } };
    const { drafts } = createDraftRecovery([good, { ...settings, key: "auth" }], owner);
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries: [good], rejected: true });
  });

  it.each(["password", "__proto__", "constructor"])("rejects unapproved field %s", field => {
    const { drafts } = createDraftRecovery([settings], owner);
    Object.defineProperty(drafts.entries[0].values, field, { value: "untrusted", enumerable: true });
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries: [], rejected: true });
  });

  it("rejects unsupported schemas, malformed values, duplicate keys and invalid option identifiers", () => {
    const { drafts } = createDraftRecovery([settings], owner);
    expect(readDraftRecovery({ ...drafts, schemaVersion: 2 }, owner, project).rejected).toBe(true);
    expect(readDraftRecovery({ ...drafts, entries: [{ ...settings, values: null }] }, owner, project).rejected).toBe(
      true
    );
    expect(readDraftRecovery({ ...drafts, entries: [settings, settings] }, owner, project)).toEqual({
      entries: [settings],
      rejected: true
    });
    drafts.entries[0].values.heightmapPreset = "__proto__";
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries: [], rejected: true });
  });

  it("rejects invalid NPC templates before they can reach a renderer", () => {
    const key = `npc:${project.campaign!.npcs[0].id}`;
    const { drafts } = createDraftRecovery(
      [{ key, baseline: { name: "old", templateId: "commoner" }, values: { name: "new", templateId: "constructor" } }],
      owner
    );
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries: [], rejected: true });
  });

  it("bounds snapshot count, field lengths and serialized size", () => {
    expect(() =>
      createDraftRecovery(
        Array.from({ length: 257 }, () => settings),
        owner
      )
    ).toThrow("size limit");
    const oversized = { ...settings, values: { name: "x".repeat(3 * 1024 * 1024) } };
    expect(() => createDraftRecovery([oversized], owner)).toThrow("size limit");
    const { drafts } = createDraftRecovery([{ ...settings, values: { name: "x".repeat(4001) } }], owner);
    expect(readDraftRecovery(drafts, owner, project)).toEqual({ entries: [], rejected: true });
  });

  it("does not alias the live editor objects", () => {
    const source = structuredClone(settings);
    const { drafts } = createDraftRecovery([source], owner);
    source.values.name = "changed later";
    const restored = readDraftRecovery(drafts, owner, project);
    restored.entries[0].values.name = "changed after read";
    expect(drafts.entries[0].values.name).toBe(settings.values.name);
  });
});
