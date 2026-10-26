import type { WorldSpacesData } from "./world-spaces";
import type { CampaignWorld } from "./campaign-world";

export type PlanetViewMode = "map" | "globe";

export interface PlanetClimateSettings {
  equatorC: number;
  northPoleC: number;
  southPoleC: number;
  precipitation: number;
  winds: number[];
}

export interface PlanetSettings {
  name: string;
  seed: string;
  radiusKm: number;
  axialTiltDeg: number;
  rotationHours: number;
  projection: "equirectangular";
  seaLevel: number;
  heightmapPreset: "pangea" | "continents" | "archipelago" | "shattered";
  climate: PlanetClimateSettings;
}

export interface PlanetProject {
  format: "fantasy-planet-builder";
  schemaVersion: 1;
  source: { fmgVersion: string; upstreamCommit: string };
  planet: PlanetSettings;
  mapPayload: string;
  view: {
    mode: PlanetViewMode;
    activeLayers: string[];
    camera: Record<string, number>;
  };
  savedAt: string;
  campaign?: CampaignWorld;
  worldSpaces?: WorldSpacesData;
}

export interface CloudProject {
  id: string;
  name: string;
  fileId: string;
  thumbnailFileId?: string;
  schemaVersion: number;
  sourceFmgVersion: string;
  revision: number;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PLANET_SETTINGS: PlanetSettings = {
  name: "새로운 판타지 행성",
  seed: "",
  radiusKm: 6371,
  axialTiltDeg: 23.5,
  rotationHours: 24,
  projection: "equirectangular",
  seaLevel: 20,
  heightmapPreset: "continents",
  climate: {
    equatorC: 27,
    northPoleC: -30,
    southPoleC: -15,
    precipitation: 100,
    winds: [225, 45, 225, 315, 135, 315]
  }
};
