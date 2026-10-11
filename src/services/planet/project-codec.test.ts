import { describe, expect, it } from "vitest";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { createPlanetProject, decodePlanetProject, encodePlanetProject, legacyMapToProject } from "./project-codec";

const mapPayload = `1.135.0|license|2026-7-12|123|960|540|1\r\nsettings\r\n{}\r\nbiomes\r\nnotes\r\n<svg id="map">${"x".repeat(120)}</svg>`;

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
