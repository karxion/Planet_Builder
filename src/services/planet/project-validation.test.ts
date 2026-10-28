import { describe, expect, it } from "vitest";
import { createCampaign } from "@/generators/campaign-generator";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { createPlanetProject } from "./project-codec";
import { isPlanetProject } from "./project-validation";

const createProject = () =>
  createPlanetProject({
    mapPayload: `1.135|test\r\n${"x".repeat(150)}`,
    settings: DEFAULT_PLANET_SETTINGS,
    fmgVersion: "1.135",
    upstreamCommit: "test"
  });

function withField(path: string, value: unknown) {
  const project = createProject();
  const fields = path.split(".");
  let target = project as unknown as Record<string, unknown>;
  for (const field of fields.slice(0, -1)) target = target[field] as Record<string, unknown>;
  target[fields[fields.length - 1]] = value;
  return project;
}

describe("PlanetProject validation", () => {
  it.each<[string, unknown]>([
    ["source", null],
    ["source", []],
    ["source.fmgVersion", 1],
    ["source.upstreamCommit", undefined],
    ["savedAt", null],
    ["schemaVersion", 2],
    ["planet", null],
    ["planet.name", 1],
    ["planet.showName", "false"],
    ["planet.nameGenerated", 1],
    ["planet.seed", 12],
    ["planet.climate", undefined],
    ["planet.climate", []],
    ["planet.projection", "mercator"],
    ["planet.heightmapPreset", "unknown"],
    ["planet.radiusKm", "6371"],
    ["planet.radiusKm", null],
    ["planet.radiusKm", NaN],
    ["planet.rotationHours", Infinity],
    ["planet.axialTiltDeg", -Infinity],
    ["planet.climate.winds", [1, 2]],
    ["planet.climate.winds", [0, 0, 0, 0, 0, "45"]],
    ["planet.climate.winds", new Array(6)],
    ["planet.climate.winds", [0, 0, 0, 0, 0, NaN]],
    ["planet.climate.winds", [0, 0, 0, 0, 0, 361]],
    ["planet.climate.winds", [0, 0, 0, 0, 0, -1]],
    ["mapPayload", "x".repeat(150)],
    ["mapPayload", "1.135|test\r\nshort"],
    ["view", undefined],
    ["view", []],
    ["view.mode", "3d"],
    ["view.activeLayers", "states"],
    ["view.activeLayers", ["states", null]],
    ["view.activeLayers", new Array(1)],
    ["view.camera", null],
    ["view.camera", []],
    ["view.camera", { px: 1, py: 2 }],
    ["view.camera", { px: 1, py: 2, pz: 3, tx: "0" }],
    ["view.camera", { px: 1, py: 2, pz: 3, ty: Infinity }],
    ["view.camera", { px: 1, py: 2, pz: 3, tz: NaN }]
  ])("rejects invalid %s = %j", (path, value) => {
    expect(isPlanetProject(withField(path, value))).toBe(false);
  });

  it.each([
    ["planet.radiusKm", 500, 50000],
    ["planet.rotationHours", 4, 200],
    ["planet.axialTiltDeg", 0, 60],
    ["planet.seaLevel", 10, 30],
    ["planet.climate.equatorC", -20, 50],
    ["planet.climate.northPoleC", -70, 20],
    ["planet.climate.southPoleC", -70, 20],
    ["planet.climate.precipitation", 0, 300]
  ] as const)("enforces inclusive %s bounds", (path, min, max) => {
    for (const value of [min, max]) expect(isPlanetProject(withField(path, value))).toBe(true);
    for (const value of [min - 1, max + 1, "0", null, undefined, NaN]) {
      expect(isPlanetProject(withField(path, value))).toBe(false);
    }
  });

  it.each([
    {},
    { px: 1, py: 2, pz: 3 },
    { px: 1, py: 2, pz: 3, tx: 0, ty: 0, tz: 0 }
  ])("accepts v1 empty and position-only cameras %j", camera => {
    expect(isPlanetProject(withField("view.camera", camera))).toBe(true);
  });

  const createCampaignProject = () => ({
    ...createProject(),
    campaign: createCampaign(
      {
        states: [{ id: 0, name: "Neutral", x: 0, y: 0 }],
        fiefs: [],
        villages: [{ id: 1, stateId: 0, fiefId: 0, name: "Village", x: 0, y: 0, capital: false, port: false }]
      },
      "seed"
    )
  });

  it("accepts v1 campaigns, zero source IDs and retained NPCs from removed villages", () => {
    const project = createCampaignProject();
    expect(isPlanetProject(project)).toBe(true);
    project.campaign.npcs[0].villageId = "village:99";
    project.campaign.npcs[0].edited = true;
    expect(isPlanetProject(project)).toBe(true);
  });

  it.each([null, false, "", 0, "planet"])("rejects a present invalid campaign mapLevel %j", mapLevel => {
    const project = createCampaignProject();
    Object.assign(project.campaign, { mapLevel });
    expect(isPlanetProject(project)).toBe(false);
  });

  it.each([
    { sourceId: -1 },
    { stateId: -1 },
    { id: "village:0" },
    { parentId: false },
    { parentId: 0 }
  ])("rejects malformed campaign units %j", fields => {
    const project = createCampaignProject();
    Object.assign(project.campaign.units[0], fields);
    expect(isPlanetProject(project)).toBe(false);
  });

  it.each(["", "country:0", "village:1:2", "missing"])("rejects invalid NPC village reference %j", villageId => {
    const project = createCampaignProject();
    project.campaign.npcs[0].villageId = villageId;
    expect(isPlanetProject(project)).toBe(false);
  });

  it("still rejects broken hierarchy and duplicate NPC IDs", () => {
    const project = createCampaignProject();
    project.campaign.units[1].parentId = "country:99";
    expect(isPlanetProject(project)).toBe(false);
    const duplicate = createCampaignProject();
    duplicate.campaign.npcs.push(duplicate.campaign.npcs[0]);
    expect(isPlanetProject(duplicate)).toBe(false);
  });
});
