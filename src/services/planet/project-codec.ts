import type { PlanetProject, PlanetSettings, PlanetViewMode } from "@/types/planet-project";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { isPlanetProject } from "./project-validation";

const MIME_TYPE = "application/x-fantasy-planet-builder";
const GZIP_MAGIC = [0x1f, 0x8b] as const;
// Bound both stored files and expanded JSON, including gzip bombs.
export const MAX_PROJECT_BYTES = 128 * 1024 * 1024;

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
  const project: PlanetProject = {
    format: "fantasy-planet-builder",
    schemaVersion: 1,
    source: { fmgVersion: input.fmgVersion, upstreamCommit: input.upstreamCommit },
    planet: input.settings,
    mapPayload: input.mapPayload,
    view: {
      mode: input.mode ?? "map",
      activeLayers: input.activeLayers ?? [],
      camera: {}
    },
    savedAt: new Date().toISOString()
  };
  assertPlanetProject(project);
  project.planet = structuredClone(project.planet);
  project.view.activeLayers = [...project.view.activeLayers];
  return project;
}

export function legacyMapToProject(
  mapPayload: string,
  source: { fmgVersion: string; upstreamCommit: string },
  settings: PlanetSettings = DEFAULT_PLANET_SETTINGS
): PlanetProject {
  if (typeof mapPayload !== "string") throw new InvalidPlanetProjectError();
  assertSize(new Blob([mapPayload]).size);
  const firstLine = mapPayload.split(/\r?\n/, 1)[0] ?? "";
  if (!firstLine.includes("|") || !mapPayload.includes("<svg")) {
    throw new InvalidPlanetProjectError("Azgaar .map 데이터 형식을 확인할 수 없습니다");
  }

  return createPlanetProject({ mapPayload, settings, ...source });
}

export async function encodePlanetProject(project: PlanetProject): Promise<Blob> {
  assertPlanetProject(project);
  const json = new Blob([JSON.stringify(project)], { type: MIME_TYPE });
  assertSize(json.size);

  if (typeof CompressionStream === "undefined") {
    return json;
  }

  const compressed = json.stream().pipeThrough(new CompressionStream("gzip"));
  const result = new Blob([await new Response(compressed).arrayBuffer()], { type: MIME_TYPE });
  assertSize(result.size);
  return result;
}

export async function decodePlanetProject(blob: Blob): Promise<PlanetProject> {
  try {
    const project: unknown = JSON.parse(await readBlobContent(blob));
    assertPlanetProject(project);
    return project;
  } catch (error) {
    if (error instanceof InvalidPlanetProjectError) throw error;
    throw new InvalidPlanetProjectError("프로젝트 파일을 해석할 수 없습니다");
  }
}

export async function decodeLegacyMap(
  blob: Blob,
  source: { fmgVersion: string; upstreamCommit: string },
  settings: PlanetSettings = DEFAULT_PLANET_SETTINGS
): Promise<PlanetProject> {
  try {
    let content = await readBlobContent(blob);
    if (!content.split(/\r?\n/, 1)[0].includes("|")) content = decodeURIComponent(atob(content.trim()));
    return legacyMapToProject(content, source, settings);
  } catch (error) {
    if (error instanceof InvalidPlanetProjectError) throw error;
    throw new InvalidPlanetProjectError("Azgaar .map 데이터 형식을 확인할 수 없습니다");
  }
}

async function readBlobContent(blob: Blob): Promise<string> {
  assertSize(blob.size);
  const header = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
  let stream = blob.stream();
  if (header[0] === GZIP_MAGIC[0] && header[1] === GZIP_MAGIC[1]) {
    if (typeof DecompressionStream === "undefined") {
      throw new InvalidPlanetProjectError("이 브라우저는 압축 프로젝트 파일을 지원하지 않습니다");
    }
    stream = stream.pipeThrough(new DecompressionStream("gzip"));
  }
  return readContent(stream);
}

export function assertPlanetProject(project: unknown): asserts project is PlanetProject {
  if (!isPlanetProject(project)) throw new InvalidPlanetProjectError();
  assertSize(new Blob([project.mapPayload]).size);
}

function assertSize(size: number): void {
  if (size > MAX_PROJECT_BYTES) {
    throw new InvalidPlanetProjectError("프로젝트 파일은 압축 해제 후에도 128 MiB 이하여야 합니다");
  }
}

async function readContent(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  const chunks: string[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      assertSize(size);
      chunks.push(decoder.decode(value, { stream: true }));
    }
    chunks.push(decoder.decode());
    return chunks.join("");
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
}

export const ProjectCodec = {
  createPlanetProject,
  legacyMapToProject,
  decodeLegacyMap,
  encodePlanetProject,
  decodePlanetProject
};
