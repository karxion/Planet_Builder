import { type CloudProject, DEFAULT_PLANET_SETTINGS, type PlanetProject } from "@/types/planet-project";

export const BKEND_SESSION_KEY = "fpb-bkend-session";
export const BKEND_API = "https://bkend.example.test";
export const BKEND_UPLOAD = "https://storage.example.test/upload?signature=private";

export function createBkendStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    key: index => [...values.keys()][index] ?? null,
    removeItem: key => {
      values.delete(key);
    },
    setItem: (key, value) => {
      values.set(key, value);
    }
  };
}

export function bkendDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

export function bkendResponse(body: unknown = {}, status = 200): Response {
  return new Response(status === 204 ? null : JSON.stringify(body), { status });
}

export function bkendCloudProject(overrides: Partial<CloudProject> = {}): CloudProject {
  return {
    id: "project/one?#%",
    name: "Test planet",
    fileId: "file/old?#%",
    revision: 3,
    schemaVersion: 1,
    sourceFmgVersion: "test",
    sizeBytes: 10,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides
  };
}

export function bkendPlanetProject(): PlanetProject {
  return {
    format: "fantasy-planet-builder",
    schemaVersion: 1,
    source: { fmgVersion: "test", upstreamCommit: "test" },
    planet: { ...DEFAULT_PLANET_SETTINGS, name: " Test/planet? " },
    mapPayload: "mock map",
    view: { mode: "map", activeLayers: [], camera: {} },
    savedAt: "2026-01-01T00:00:00Z"
  };
}

export function bkendRevision(project: CloudProject = bkendCloudProject()) {
  return { ...project, id: `record:${project.revision}`, projectId: project.id,
    revisionKey: JSON.stringify([project.id, project.revision]), projectCreatedAt: project.createdAt, deleted: false };
}
