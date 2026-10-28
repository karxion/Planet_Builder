import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import {
  assertPlanetProject,
  createPlanetProject,
  decodeLegacyMap,
  decodePlanetProject,
  encodePlanetProject,
  InvalidPlanetProjectError,
  legacyMapToProject,
  MAX_PROJECT_BYTES
} from "./project-codec";

const mapPayload = `1.135.0|license|2026-7-12|123|960|540|1\r\nsettings\r\n{}\r\nbiomes\r\nnotes\r\n<svg id="map">${"x".repeat(120)}</svg>`;
const createProject = () =>
  createPlanetProject({
    mapPayload,
    settings: DEFAULT_PLANET_SETTINGS,
    fmgVersion: "1.135.0",
    upstreamCommit: "03a1050"
  });

async function gzipProject(project = createProject()): Promise<Blob> {
  const stream = new Blob([JSON.stringify(project)]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Blob([await new Response(stream).arrayBuffer()]);
}

afterEach(() => vi.unstubAllGlobals());

describe("ProjectCodec", () => {
  it("round-trips a compressed .fpb project", async () => {
    const project = createPlanetProject({
      mapPayload,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135.0",
      upstreamCommit: "03a1050"
    });
    project.view.mode = "globe";
    project.view.camera = { px: 1, py: 2, pz: 3, tx: 0, ty: 0, tz: 0 };

    const decoded = await decodePlanetProject(await encodePlanetProject(project));
    expect(decoded.planet.name).toBe(DEFAULT_PLANET_SETTINGS.name);
    expect(decoded.mapPayload).toBe(mapPayload);
    expect(decoded.source.fmgVersion).toBe("1.135.0");
    expect(decoded.view.camera).toEqual(project.view.camera);
  });

  it("wraps a legacy .map payload", () => {
    const project = legacyMapToProject(mapPayload, { fmgVersion: "1.135.0", upstreamCommit: "03a1050" });
    expect(project.format).toBe("fantasy-planet-builder");
    expect(project.planet.projection).toBe("equirectangular");
    expect(project.mapPayload).toBe(mapPayload);
  });

  it("imports a legacy map's own realm name instead of the currently open planet name", () => {
    const fields = Array.from({ length: 21 }, () => "");
    fields[20] = "저장된 렐름";
    const payload = mapPayload.replace("\r\nsettings\r\n", `\r\n${fields.join("|")}\r\n`);
    const project = legacyMapToProject(payload, { fmgVersion: "1.135.0", upstreamCommit: "test" });
    expect(project.planet.name).toBe("저장된 렐름");
    expect(project.planet.nameGenerated).toBe(false);
    expect(project.mapPayload).toBe(payload);
  });

  it("round-trips a hidden generated realm name and preserves older files without display settings", async () => {
    const project = createProject();
    project.planet = { ...project.planet, name: "세레니아", showName: false, nameGenerated: true };
    expect((await decodePlanetProject(await encodePlanetProject(project))).planet).toEqual(project.planet);
    expect((await decodePlanetProject(await encodePlanetProject(createProject()))).planet.showName).toBeUndefined();
  });

  it.each(["plain", "gzip", "base64"])("imports a %s legacy map without changing its payload", async encoding => {
    const payload = `${mapPayload}\r\n한글 지도`;
    const source = { fmgVersion: "1.135.0", upstreamCommit: "03a1050" };
    let file = new Blob([encoding === "base64" ? btoa(encodeURIComponent(payload)) : payload]);
    if (encoding === "gzip") {
      file = new Blob([await new Response(file.stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer()]);
    }
    expect((await decodeLegacyMap(file, source)).mapPayload).toBe(payload);
  });

  it("rejects a corrupt compressed legacy map", async () => {
    await expect(
      decodeLegacyMap(new Blob([new Uint8Array([0x1f, 0x8b, 0, 0])]), {
        fmgVersion: "1.135.0",
        upstreamCommit: "03a1050"
      })
    ).rejects.toBeInstanceOf(InvalidPlanetProjectError);
  });

  it("round-trips uncompressed v1 files when compression is unavailable", async () => {
    vi.stubGlobal("CompressionStream", undefined);
    const project = createProject();
    const blob = await encodePlanetProject(project);
    expect(JSON.parse(await blob.text())).toEqual(project);
    expect(await decodePlanetProject(blob)).toEqual(project);
  });

  it("keeps legacy division data opaque for the loader to discard", async () => {
    const payload = `${mapPayload}\r\n${JSON.stringify({ cultures: [{ i: 1 }], religions: [{ i: 1 }] })}`;
    const project = legacyMapToProject(payload, { fmgVersion: "1.135.0", upstreamCommit: "test" });
    expect((await decodePlanetProject(await encodePlanetProject(project))).mapPayload).toBe(payload);
  });

  it("validates projects at creation and encoding, not only decoding", async () => {
    expect(() =>
      createPlanetProject({
        mapPayload,
        settings: { ...DEFAULT_PLANET_SETTINGS, radiusKm: NaN },
        fmgVersion: "1.135.0",
        upstreamCommit: "test"
      })
    ).toThrow(InvalidPlanetProjectError);
    const project = createProject();
    project.view.camera = { px: 1, py: 2, pz: 3, tx: Infinity };
    await expect(encodePlanetProject(project)).rejects.toBeInstanceOf(InvalidPlanetProjectError);
  });

  it.each([null, [], "bad", 42, { format: "fantasy-planet-builder" }])("rejects invalid root %j", async value => {
    expect(() => assertPlanetProject(value)).toThrow(InvalidPlanetProjectError);
    await expect(decodePlanetProject(new Blob([JSON.stringify(value)]))).rejects.toBeInstanceOf(
      InvalidPlanetProjectError
    );
  });

  it.each([
    new Uint8Array([0x1f, 0x8b]),
    new Uint8Array([0x1f, 0x8b, 0, 0, 0, 0])
  ])("normalizes corrupt and truncated gzip errors", async bytes => {
    await expect(decodePlanetProject(new Blob([bytes]))).rejects.toBeInstanceOf(InvalidPlanetProjectError);
  });

  it("rejects a truncated gzip trailer", async () => {
    const bytes = new Uint8Array(await (await gzipProject()).arrayBuffer());
    await expect(decodePlanetProject(new Blob([bytes.subarray(0, -4)]))).rejects.toBeInstanceOf(
      InvalidPlanetProjectError
    );
  });

  it("rejects gzip with a corrupt checksum", async () => {
    const bytes = new Uint8Array(await (await gzipProject()).arrayBuffer());
    bytes[bytes.length - 8] ^= 0xff;
    await expect(decodePlanetProject(new Blob([bytes]))).rejects.toBeInstanceOf(InvalidPlanetProjectError);
  });

  it("reports unsupported gzip without affecting plain JSON", async () => {
    const project = createProject();
    const blob = await gzipProject(project);
    vi.stubGlobal("DecompressionStream", undefined);
    await expect(decodePlanetProject(blob)).rejects.toThrow("압축 프로젝트");
    expect(await decodePlanetProject(new Blob([JSON.stringify(project)]))).toEqual(project);
  });

  it("rejects malformed UTF-8 instead of silently replacing saved names", async () => {
    const json = JSON.stringify(createProject()).replace(DEFAULT_PLANET_SETTINGS.name, "INVALID_UTF8");
    const bytes = new TextEncoder().encode(json);
    bytes[json.indexOf("INVALID_UTF8")] = 0xff;
    await expect(decodePlanetProject(new Blob([bytes]))).rejects.toBeInstanceOf(InvalidPlanetProjectError);
  });

  it("rejects oversized files before reading their contents", async () => {
    const blob = new Blob(["small"]);
    Object.defineProperty(blob, "size", { value: MAX_PROJECT_BYTES + 1 });
    const slice = vi.spyOn(blob, "slice");
    await expect(decodePlanetProject(blob)).rejects.toThrow("128 MiB");
    expect(slice).not.toHaveBeenCalled();
  });

  it.each([false, true])("bounds cumulative stream bytes and cancels on overflow (gzip=%s)", async gzip => {
    // Synthetic byte lengths exercise the production limit without allocating a 128 MiB fixture.
    const chunk = new TextEncoder().encode(" ");
    Object.defineProperty(chunk, "byteLength", { value: MAX_PROJECT_BYTES / 2 + 1 });
    const cancel = vi.fn();
    const readable = new ReadableStream<Uint8Array<ArrayBuffer>>({
      start(controller) {
        controller.enqueue(chunk);
        controller.enqueue(chunk);
      },
      cancel
    });
    const blob = new Blob([gzip ? new Uint8Array([0x1f, 0x8b]) : "plain"]);
    if (gzip) {
      vi.stubGlobal(
        "DecompressionStream",
        class {
          readable = readable;
          writable = new WritableStream();
        }
      );
    } else {
      vi.spyOn(blob, "stream").mockReturnValue(readable);
    }
    await expect(decodePlanetProject(blob)).rejects.toThrow("128 MiB");
    expect(cancel).toHaveBeenCalledOnce();
    expect(readable.locked).toBe(false);
  });

  it("accepts the inclusive byte limit", async () => {
    const project = createProject();
    const chunk = new TextEncoder().encode(JSON.stringify(project));
    Object.defineProperty(chunk, "byteLength", { value: MAX_PROJECT_BYTES });
    const blob = new Blob(["plain"]);
    vi.spyOn(blob, "stream").mockReturnValue(
      new ReadableStream({
        start(controller) {
          controller.enqueue(chunk);
          controller.close();
        }
      })
    );
    expect(await decodePlanetProject(blob)).toEqual(project);
  });

  it("decodes UTF-8 characters split across stream chunks", async () => {
    const project = createProject();
    const bytes = new TextEncoder().encode(JSON.stringify(project));
    const blob = new Blob(["plain"]);
    vi.spyOn(blob, "stream").mockReturnValue(
      new ReadableStream({
        start(controller) {
          for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
          controller.close();
        }
      })
    );
    expect(await decodePlanetProject(blob)).toEqual(project);
  });

  it("preserves Korean names and political suffixes in the saved world payload", async () => {
    const koreanPayload = `${mapPayload}\r\n${JSON.stringify({ states: [{ name: "세레온", formName: "Kingdom", fullName: "세레온 왕국" }], provinces: [{ name: "루미아", fullName: "루미아 영지" }], burgs: [{ name: "달빛마을" }] })}`;
    const project = createPlanetProject({
      mapPayload: koreanPayload,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135.0",
      upstreamCommit: "03a1050"
    });
    const decoded = await decodePlanetProject(await encodePlanetProject(project));
    expect(decoded.mapPayload).toBe(koreanPayload);
  });
});
