// Read-only diagnostic reproduction. No real cloud requests or application writes.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "../..");

function loadTs(relative, extra = {}) {
  const source = fs.readFileSync(path.join(root, relative), "utf8").replaceAll("import.meta.env", "auditEnv");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, module: { exports }, Blob, Response, TextDecoder, Uint8Array, ArrayBuffer,
    CompressionStream, DecompressionStream, structuredClone, console,
    require: name => {
      if (name === "@/types/planet-project") return loadTs("src/types/planet-project.ts");
      throw new Error(`Unexpected dependency: ${name}`);
    },
    ...extra
  }, { filename: relative });
  return exports;
}

async function main() {
  const codec = loadTs("src/services/planet/project-codec.ts");
  const { DEFAULT_PLANET_SETTINGS } = loadTs("src/types/planet-project.ts");
  const map = fs.readFileSync(path.join(root, "tests/fixtures/demo.map"), "utf8");
  const project = codec.legacyMapToProject(map, { fmgVersion: "audit", upstreamCommit: "audit" });
  const encoded = await codec.encodePlanetProject(project);
  const restored = await codec.decodePlanetProject(encoded);
  assert.equal(restored.mapPayload, map);
  const malformed = {
    format: "fantasy-planet-builder", schemaVersion: 1,
    planet: { name: "Incomplete", projection: "equirectangular" },
    mapPayload: "x".repeat(101)
  };
  let malformedAccepted = false;
  try { await codec.decodePlanetProject(new Blob([JSON.stringify(malformed)])); malformedAccepted = true; } catch {}
  let invalidRadiusAccepted = false;
  try {
    await codec.decodePlanetProject(new Blob([JSON.stringify({
      ...project, planet: { ...DEFAULT_PLANET_SETTINGS, radiusKm: -1 }
    })]));
    invalidRadiusAccepted = true;
  } catch {}
  let lfMapAccepted = false;
  try { codec.legacyMapToProject(map.replaceAll("\r\n", "\n"), project.source); lfMapAccepted = true; } catch {}

  let remote = { id: "audit-project", name: "Original", revision: 1, fileId: "old" };
  const initial = { ...remote };
  let uploads = 0;
  const patches = [];
  const session = new Map();
  const json = data => new Response(JSON.stringify({ data }), { status: 200 });
  const mockFetch = async (url, init = {}) => {
    const method = init.method || "GET";
    if (url.startsWith("https://upload.invalid/")) return new Response(null, { status: 200 });
    const pathname = new URL(url).pathname;
    if (pathname === "/data/projects/audit-project" && method === "GET") return json({ ...remote });
    if (pathname === "/files/presigned-url") {
      const fileId = `file-${++uploads}`;
      return json({ fileId, url: `https://upload.invalid/${fileId}` });
    }
    if (pathname === "/files" || method === "DELETE") return json({});
    if (pathname === "/data/projects/audit-project" && method === "PATCH") {
      const body = JSON.parse(init.body);
      patches.push({ body, headers: init.headers });
      remote = { ...remote, ...body };
      return json(remote);
    }
    throw new Error(`Unexpected mock request: ${method} ${url}`);
  };
  const { ProjectRepository } = loadTs("src/services/planet/bkend-repository.ts", {
    auditEnv: { VITE_BKEND_API_URL: "https://cloud.invalid", VITE_BKEND_PROJECT_ID: "audit" },
    sessionStorage: {
      getItem: key => session.get(key) ?? null,
      setItem: (key, value) => session.set(key, value),
      removeItem: key => session.delete(key)
    },
    fetch: mockFetch
  });
  const concurrent = await Promise.allSettled([
    ProjectRepository.save({ ...project, planet: { ...project.planet, name: "Client A" } }, encoded, initial),
    ProjectRepository.save({ ...project, planet: { ...project.planet, name: "Client B" } }, encoded, initial)
  ]);
  const concurrencyResult = {
    results: concurrent.map(result => result.status),
    initialRevision: initial.revision,
    finalRevision: remote.revision,
    finalFile: remote.fileId,
    uploadedFiles: uploads,
    conditionalPatchPresent: patches.some(p => p.headers["If-Match"] || "expectedRevision" in p.body)
  };
  const beforeRename = { ...remote };
  await ProjectRepository.rename(beforeRename, "Renamed");
  const renamed = remote.name;
  await ProjectRepository.save({ ...project, planet: { ...project.planet, name: beforeRename.name } }, encoded, beforeRename);
  console.log(JSON.stringify({
    fixtureRoundTrip: "pass", gzipBytes: encoded.size,
    malformedMissingClimateAndViewAccepted: malformedAccepted,
    negativeRadiusAccepted: invalidRadiusAccepted,
    lfOnlyLegacyMapAccepted: lfMapAccepted,
    mockConcurrentCloudSave: concurrencyResult,
    mockRenameThenSave: { renamed, afterSave: remote.name },
    scope: "Mock transport demonstrates client behavior only; not bkend API or RLS verification."
  }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
