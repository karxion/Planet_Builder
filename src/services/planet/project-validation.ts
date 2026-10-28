import { isWorldSpaces } from "@/services/world-spaces/model";
import { isCampaignWorld } from "@/data/campaign-validation";
import type { CampaignWorld } from "@/types/campaign-world";
import type { PlanetProject, PlanetSettings } from "@/types/planet-project";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function inRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

export function isPlanetSettings(value: unknown): value is PlanetSettings {
  if (!isRecord(value) || !isRecord(value.climate)) return false;
  const climate = value.climate;
  return (
    value.projection === "equirectangular" &&
    typeof value.name === "string" &&
    (value.nameGenerated === undefined || typeof value.nameGenerated === "boolean") &&
    (value.showName === undefined || typeof value.showName === "boolean") &&
    typeof value.seed === "string" &&
    inRange(value.radiusKm, 500, 50000) &&
    inRange(value.axialTiltDeg, 0, 60) &&
    inRange(value.rotationHours, 4, 200) &&
    inRange(value.seaLevel, 10, 30) &&
    ["pangea", "continents", "archipelago", "shattered"].includes(value.heightmapPreset as string) &&
    inRange(climate.equatorC, -20, 50) &&
    inRange(climate.northPoleC, -70, 20) &&
    inRange(climate.southPoleC, -70, 20) &&
    inRange(climate.precipitation, 0, 300) &&
    Array.isArray(climate.winds) &&
    climate.winds.length === 6 &&
    Array.from(climate.winds).every(wind => inRange(wind, 0, 360))
  );
}

function isProjectView(value: unknown): value is PlanetProject["view"] {
  if (!isRecord(value) || !isRecord(value.camera)) return false;
  const camera = value.camera;
  const hasPosition = ["px", "py", "pz"].some(key => key in camera);
  return (
    (value.mode === "map" || value.mode === "globe") &&
    Array.isArray(value.activeLayers) &&
    Array.from(value.activeLayers).every(layer => typeof layer === "string") &&
    Object.values(camera).every(coordinate => typeof coordinate === "number" && Number.isFinite(coordinate)) &&
    (!hasPosition || ["px", "py", "pz"].every(key => typeof camera[key] === "number"))
  );
}

function isProjectCampaign(value: unknown): value is CampaignWorld {
  if (!isCampaignWorld(value)) return false;
  if (value.mapLevel !== undefined && !["village", "fief", "region", "country"].includes(value.mapLevel)) return false;
  return (
    value.units.every(
      unit =>
        unit.id.startsWith(`${unit.level}:`) &&
        unit.sourceId >= 0 &&
        unit.stateId >= 0 &&
        (unit.parentId === undefined || typeof unit.parentId === "string")
    ) &&
    // Deleted villages can retain edited NPCs; validate the reference shape, not its existence.
    value.npcs.every(npc => /^village:[0-9]+$/.test(npc.villageId))
  );
}

export function isPlanetProject(value: unknown): value is PlanetProject {
  return (
    isRecord(value) &&
    value.format === "fantasy-planet-builder" &&
    value.schemaVersion === 1 &&
    isRecord(value.source) &&
    typeof value.source.fmgVersion === "string" &&
    typeof value.source.upstreamCommit === "string" &&
    typeof value.savedAt === "string" &&
    isPlanetSettings(value.planet) &&
    typeof value.mapPayload === "string" &&
    value.mapPayload.length > 100 &&
    value.mapPayload.includes("\r\n") &&
    value.mapPayload.split("\r\n", 1)[0].includes("|") &&
    isProjectView(value.view) &&
    (value.campaign === undefined || isProjectCampaign(value.campaign)) &&
    (value.worldSpaces === undefined || isWorldSpaces(value.worldSpaces))
  );
}
