import type { PlanetProject, PlanetSettings, PlanetViewMode } from "@/types/planet-project";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { isCampaignWorld } from "@/data/campaign-validation";

const MIME_TYPE = "application/x-fantasy-planet-builder";
const GZIP_MAGIC = [0x1f, 0x8b] as const;

export class InvalidPlanetProjectError extends Error {
  constructor(message = "유효한 판타지 행성 프로젝트 파일이 아닙니다") {
    super(message);
    this.name = "InvalidPlanetProjectError";
  }
}

export function createPlanetProject(input: {
  mapPayload: string;
  settings: PlanetSettings;
  fmgVersion: string;
  upstreamCommit: string;
  mode?: PlanetViewMode;
  activeLayers?: string[];
}): PlanetProject {
  if (!input.mapPayload.includes("\r\n")) throw new InvalidPlanetProjectError("FMG 지도 데이터가 비어 있습니다");

  return {
    format: "fantasy-planet-builder",
    schemaVersion: 1,
    source: { fmgVersion: input.fmgVersion, upstreamCommit: input.upstreamCommit },
    planet: structuredClone(input.settings),
    mapPayload: input.mapPayload,
    view: {
      mode: input.mode ?? "map",
      activeLayers: input.activeLayers ?? [],
      camera: {}
    },
    savedAt: new Date().toISOString()
  };
}

export function legacyMapToProject(
  mapPayload: string,
  source: { fmgVersion: string; upstreamCommit: string },
  settings: PlanetSettings = DEFAULT_PLANET_SETTINGS
): PlanetProject {
  const firstLine = mapPayload.split(/\r?\n/, 1)[0] ?? "";
  if (!firstLine.includes("|") || !mapPayload.includes("<svg")) {
    throw new InvalidPlanetProjectError("Azgaar .map 데이터 형식을 확인할 수 없습니다");
  }

  return createPlanetProject({ mapPayload, settings, ...source });
}

export async function encodePlanetProject(project: PlanetProject): Promise<Blob> {
  assertPlanetProject(project);
  const json = JSON.stringify(project);

  if (typeof CompressionStream === "undefined") {
    return new Blob([json], { type: MIME_TYPE });
  }

  const compressed = new Blob([json]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Blob([await new Response(compressed).arrayBuffer()], { type: MIME_TYPE });
}

export async function decodePlanetProject(blob: Blob): Promise<PlanetProject> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const isGzip = bytes[0] === GZIP_MAGIC[0] && bytes[1] === GZIP_MAGIC[1];
  const content = isGzip ? await decompress(bytes) : bytes;

  try {
    const project = JSON.parse(new TextDecoder().decode(content)) as PlanetProject;
    assertPlanetProject(project);
    return project;
  } catch (error) {
    if (error instanceof InvalidPlanetProjectError) throw error;
    throw new InvalidPlanetProjectError("프로젝트 파일을 해석할 수 없습니다");
  }
}

export function assertPlanetProject(project: PlanetProject): void {
  const valid =
    project?.format === "fantasy-planet-builder" &&
    project.schemaVersion === 1 &&
    project.planet?.projection === "equirectangular" &&
    typeof project.planet?.name === "string" &&
    typeof project.mapPayload === "string" &&
    project.mapPayload.length > 100 &&
    (project.campaign === undefined || isCampaignWorld(project.campaign));

  if (!valid) throw new InvalidPlanetProjectError();
}

async function decompress(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") {
    throw new InvalidPlanetProjectError("이 브라우저는 압축 프로젝트 파일을 지원하지 않습니다");
  }

  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export const ProjectCodec = {
  createPlanetProject,
  legacyMapToProject,
  encodePlanetProject,
  decodePlanetProject
};
