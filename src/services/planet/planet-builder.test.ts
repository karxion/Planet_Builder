// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from "vitest";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import type { RecoverySnapshot } from "./recovery-repository";

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  save: vi.fn(),
  legacy: vi.fn(),
  loadMap: vi.fn(),
  prepare: vi.fn(),
  decode: vi.fn(),
  confirm: vi.fn(() => true)
}));
vi.mock("@/controllers", () => ({
  Controllers: { View3d: { enterStandard: vi.fn(), open: vi.fn(), update: vi.fn() } }
}));
vi.mock("@/controllers/campaign-world", () => ({ Campaign: { init: vi.fn(), get: vi.fn(), restore: vi.fn() } }));
vi.mock("@/controllers/dungeon-locations", () => ({ initDungeonLocations: vi.fn() }));
vi.mock("@/controllers/map-icon-groups", () => ({ initMapIconGroups: vi.fn() }));
vi.mock("@/controllers/rpg-map-assets", () => ({ initRpgMapAssets: vi.fn() }));
vi.mock("@/services", () => ({
  Services: { Save: { prepareMapData: mocks.prepare }, Load: { loadMap: mocks.loadMap } }
}));
vi.mock("@/services/ui-language", async original => ({
  ...(await original<typeof import("@/services/ui-language")>()),
  initUiLanguage: vi.fn()
}));
vi.mock("./bkend-repository", () => ({
  ProjectConflictError: class extends Error {},
  ProjectRepository: { isAuthenticated: () => false }
}));
vi.mock("./recovery-repository", () => ({
  RecoveryRepository: class {
    list = mocks.list;
    save = mocks.save;
    legacy = mocks.legacy;
  }
}));
vi.mock("./project-codec", async original => {
  const actual = await original<typeof import("./project-codec")>();
  return {
    ...actual,
    ProjectCodec: {
      ...actual.ProjectCodec,
      encodePlanetProject: async () => new Blob(["snapshot"]),
      decodePlanetProject: mocks.decode
    }
  };
});

const mapPayload = `1.135.0|license|2026-7-12|123|960|540|1\r\nsettings\r\n{}\r\nbiomes\r\nnotes\r\n<svg id="map">${"x".repeat(120)}</svg>`;

describe("Planet persistence integration", () => {
  let builder: typeof import("./planet-builder").PlanetBuilder;
  let drafts: typeof import("@/services/editor-drafts").EditorDrafts;
  let windowEvents: MockInstance<typeof window.addEventListener>;
  let documentEvents: MockInstance<typeof document.addEventListener>;
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers();
    windowEvents = vi.spyOn(window, "addEventListener");
    documentEvents = vi.spyOn(document, "addEventListener");
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value)
    });
    localStorage.setItem("fpb-planet-settings", JSON.stringify(DEFAULT_PLANET_SETTINGS));
    document.body.innerHTML =
      '<div id="options" style="display:none"></div><button id="optionsHide"></button><button id="optionsTrigger"></button>';
    document.body.className = "";
    vi.stubGlobal("options", { threeD: { isOn: false } });
    vi.stubGlobal("mapHistory", [{}]);
    vi.stubGlobal("mapName", document.createElement("input"));
    vi.stubGlobal("customization", 0);
    vi.stubGlobal("VERSION", "1.135.0");
    vi.stubGlobal("ERROR", false);
    vi.stubGlobal("tip", vi.fn());
    vi.stubGlobal("fitMapToScreen", vi.fn());
    vi.stubGlobal("regenerateMap", vi.fn());
    vi.stubGlobal("locked", () => true);
    vi.stubGlobal("confirm", mocks.confirm);
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
    mocks.list.mockResolvedValue([]);
    mocks.legacy.mockResolvedValue(undefined);
    mocks.save.mockResolvedValue(undefined);
    mocks.prepare.mockResolvedValue(mapPayload);
    mocks.loadMap.mockResolvedValue(undefined);
    ({ PlanetBuilder: builder } = await import("./planet-builder"));
    ({ EditorDrafts: drafts } = await import("@/services/editor-drafts"));
    await builder.init();
    await vi.advanceTimersByTimeAsync(0);
  });
  afterEach(() => {
    for (const [type, listener, options] of windowEvents.mock.calls)
      window.removeEventListener(type, listener, options);
    for (const [type, listener, options] of documentEvents.mock.calls)
      document.removeEventListener(type, listener, options);
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const changed = () => window.dispatchEvent(new Event("project:changed"));
  it("generates and synchronizes a Korean realm name for a newly generated map", async () => {
    window.dispatchEvent(new CustomEvent("map:generated", { detail: { seed: "realm-one" } }));
    const first = (await builder.buildProject()).planet;
    expect(first.name).toMatch(/^[가-힣]+$/);
    expect(first.name).not.toBe(DEFAULT_PLANET_SETTINGS.name);
    expect(first.nameGenerated).toBe(true);
    expect(mapName.value).toBe(first.name);
    expect(document.querySelector<HTMLInputElement>("#fpb-name")!.value).toBe(first.name);
    expect(document.querySelector("#fpb-planet-name")!.textContent).toBe(first.name);
    window.dispatchEvent(new CustomEvent("map:generated", { detail: { seed: "realm-two" } }));
    expect((await builder.buildProject()).planet.name).not.toBe(first.name);
  });

  it("commits a name-only edit without regenerating terrain or discarding unrelated settings drafts", async () => {
    const radius = document.querySelector<HTMLInputElement>("#fpb-radius")!;
    radius.value = "8000";
    radius.dispatchEvent(new Event("input", { bubbles: true }));
    const name = document.querySelector<HTMLInputElement>("#fpb-name")!;
    name.value = "나의 렐름";
    name.dispatchEvent(new Event("input", { bubbles: true }));
    document.getElementById("fpb-name-apply")!.click();
    const project = await builder.buildProject();
    expect(project.planet.name).toBe("나의 렐름");
    expect(project.planet.radiusKm).toBe(DEFAULT_PLANET_SETTINGS.radiusKm);
    expect(drafts.read("planet-settings")!.radiusKm).toBe("8000");
    expect(mapName.value).toBe("나의 렐름");
    expect(document.getElementById("fpb-planet-name")!.textContent).toBe("나의 렐름");
    expect(regenerateMap).not.toHaveBeenCalled();
    window.dispatchEvent(new CustomEvent("map:generated", { detail: { seed: "another" } }));
    expect((await builder.buildProject()).planet.name).toBe("나의 렐름");
  });

  it("updates planet name from legacy map-name edits, including safe text rendering", async () => {
    mapName.value = "별빛의 ";
    mapName.dispatchEvent(new Event("input"));
    expect(mapName.value).toBe("별빛의 ");
    mapName.value = "<img src=x onerror=alert(1)>";
    mapName.dispatchEvent(new Event("change"));
    expect((await builder.buildProject()).planet.name).toBe(mapName.value);
    expect(document.getElementById("fpb-planet-name")!.querySelector("img")).toBeNull();
    expect(document.getElementById("fpb-planet-name")!.textContent).toBe(mapName.value);
  });

  it("toggles the map heading immediately and restores name and visibility from a saved project", async () => {
    const show = document.querySelector<HTMLInputElement>("#fpb-show-name")!;
    show.checked = false;
    show.dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.getElementById("fpb-planet-name")!.hidden).toBe(true);
    expect((await builder.buildProject()).planet.showName).toBe(false);
    const project = await builder.buildProject();
    project.planet.name = "복원된 렐름";
    await builder.loadProject(project);
    expect(mapName.value).toBe("복원된 렐름");
    expect(document.getElementById("fpb-planet-name")!.hidden).toBe(true);
    show.checked = true;
    show.dispatchEvent(new Event("change", { bubbles: true }));
    expect(document.getElementById("fpb-planet-name")!.hidden).toBe(false);
    expect(document.getElementById("fpb-planet-name")!.textContent).toBe("복원된 렐름");
  });

  it("can reroll just the realm name without replacing terrain", async () => {
    document.getElementById("fpb-name-randomize")!.click();
    const project = await builder.buildProject();
    expect(project.planet.nameGenerated).toBe(true);
    expect(project.planet.name).not.toBe(DEFAULT_PLANET_SETTINGS.name);
    expect(mapName.value).toBe(project.planet.name);
    expect(regenerateMap).not.toHaveBeenCalled();
  });
  const settingsDraft = (value = "Pending planet") => {
    const name = document.getElementById("fpb-name") as HTMLInputElement;
    name.value = value;
    name.dispatchEvent(new Event("input", { bubbles: true }));
    name.dispatchEvent(new Event("change", { bubbles: true }));
  };

  it("preserves uncommitted settings separately from the committed project", async () => {
    settingsDraft();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(drafts.count).toBe(1);
    expect(mocks.save).toHaveBeenCalledOnce();
    expect(mocks.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: DEFAULT_PLANET_SETTINGS.name,
        drafts: expect.objectContaining({
          entries: [
            expect.objectContaining({
              key: "planet-settings",
              values: expect.objectContaining({ name: "Pending planet" })
            })
          ]
        })
      })
    );
    expect(document.getElementById("fpb-save-status")!.textContent).toContain("적용 전 초안 1개");
  });

  it("saves committed data while continuing to report outstanding drafts", async () => {
    settingsDraft();
    changed();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(mocks.save).toHaveBeenCalledWith(expect.objectContaining({ name: DEFAULT_PLANET_SETTINGS.name }));
    expect(document.getElementById("fpb-save-status")!.textContent).toContain("적용 전 초안");
    expect(document.getElementById("fpb-storage-summary")!.textContent).toContain("로컬 복구본 최신");
    expect(document.getElementById("fpb-storage-summary")!.textContent).toContain("클라우드 미연결");
    const closing = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(closing);
    expect(closing.defaultPrevented).toBe(false);
  });

  it("does not call a failed local write saved or clear the unload warning", async () => {
    mocks.save.mockRejectedValueOnce(new DOMException("Full", "QuotaExceededError"));
    changed();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(document.getElementById("fpb-save-status")!.dataset.state).toBe("error");
    expect(document.getElementById("fpb-storage-summary")!.textContent).toContain("로컬 복구본 미반영");
    const closing = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(closing);
    expect(closing.defaultPrevented).toBe(true);
  });

  it("does not mark newer changes saved when an older write finishes", async () => {
    let finish!: () => void;
    mocks.save.mockImplementationOnce(
      () =>
        new Promise<void>(resolve => {
          finish = resolve;
        })
    );
    changed();
    await vi.advanceTimersByTimeAsync(10_000);
    changed();
    finish();
    await vi.advanceTimersByTimeAsync(0);
    expect(document.getElementById("fpb-storage-summary")!.textContent).toContain("로컬 복구본 미반영");
    await vi.advanceTimersByTimeAsync(10_000);
    expect(document.getElementById("fpb-storage-summary")!.textContent).toContain("로컬 복구본 최신");
  });

  it("warns before exporting without drafts and cancels the export when declined", async () => {
    settingsDraft();
    mocks.confirm.mockReturnValueOnce(false);
    await builder.saveToMachine();
    expect(mocks.confirm).toHaveBeenCalledWith(expect.stringContaining("적용 전 초안"));
    expect(mocks.prepare).not.toHaveBeenCalled();
    expect(drafts.count).toBe(1);
  });

  it("clears the unload warning only when the current revision has a local recovery", async () => {
    changed();
    await vi.advanceTimersByTimeAsync(10_000);
    const closing = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(closing);
    expect(closing.defaultPrevented).toBe(false);
  });

  const recoveryRecord = () => ({
    id: "saved:1",
    projectId: "saved-project",
    name: "복구 행성",
    savedAt: new Date().toISOString(),
    blob: new Blob(["encoded project"])
  });
  const openRecovery = async () => {
    mocks.list.mockResolvedValue([recoveryRecord()]);
    document.getElementById("fpb-recovery-button")!.click();
    await vi.advanceTimersByTimeAsync(0);
    return document.querySelector<HTMLButtonElement>(".fpb-recovery-row")!;
  };

  it("keeps current drafts and world untouched when a recovery file is corrupt", async () => {
    settingsDraft();
    mocks.decode.mockRejectedValueOnce(new Error("Corrupt project"));
    (await openRecovery()).click();
    await vi.advanceTimersByTimeAsync(0);
    expect(mocks.loadMap).not.toHaveBeenCalled();
    expect(drafts.count).toBe(1);
    expect(document.getElementById("fpb-save-status")!.dataset.state).toBe("error");
    expect(document.querySelector<HTMLInputElement>("#fpb-name")!.value).toBe("Pending planet");
  });

  it("does not replace a project if new draft input arrives during recovery decoding", async () => {
    const { createPlanetProject } = await import("./project-codec");
    const project = createPlanetProject({
      mapPayload,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135.0",
      upstreamCommit: "test"
    });
    let finish!: (project: unknown) => void;
    mocks.decode.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          finish = resolve;
        })
    );
    (await openRecovery()).click();
    settingsDraft();
    finish(project);
    await vi.advanceTimersByTimeAsync(0);
    expect(mocks.loadMap).not.toHaveBeenCalled();
    expect(drafts.count).toBe(1);
  });

  it("makes a restored historical version the next local recovery in the same project", async () => {
    const { createPlanetProject } = await import("./project-codec");
    mocks.decode.mockResolvedValueOnce(
      createPlanetProject({
        mapPayload,
        settings: DEFAULT_PLANET_SETTINGS,
        fmgVersion: "1.135.0",
        upstreamCommit: "test"
      })
    );
    (await openRecovery()).click();
    await vi.advanceTimersByTimeAsync(0);
    expect(mocks.loadMap).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(mocks.save).toHaveBeenCalledWith(expect.objectContaining({ projectId: "saved-project" }));
  });

  it("attempts to preserve committed changes when the page becomes hidden", async () => {
    changed();
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(0);
    expect(mocks.save).toHaveBeenCalledOnce();
  });

  it("does not apply or discard settings when planet replacement is canceled", () => {
    settingsDraft();
    mocks.confirm.mockReturnValueOnce(false);
    document.getElementById("fpb-settings-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(regenerateMap).not.toHaveBeenCalled();
    expect(drafts.count).toBe(1);
    expect(document.querySelector<HTMLInputElement>("#fpb-name")!.value).toBe("Pending planet");
  });

  it("uses a single confirmation and applies settings only for an accepted regeneration", () => {
    settingsDraft();
    document.getElementById("fpb-settings-form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(mocks.confirm).toHaveBeenCalledOnce();
    expect(regenerateMap).toHaveBeenCalledOnce();
    expect(drafts.count).toBe(0);
  });

  const projectFixture = async () => {
    const { createPlanetProject } = await import("./project-codec");
    return createPlanetProject({
      mapPayload,
      settings: DEFAULT_PLANET_SETTINGS,
      fmgVersion: "1.135.0",
      upstreamCommit: "test"
    });
  };
  const restart = async (records: RecoverySnapshot[]) => {
    const project = await projectFixture();
    for (const [type, listener, options] of windowEvents.mock.calls)
      window.removeEventListener(type, listener, options);
    for (const [type, listener, options] of documentEvents.mock.calls)
      document.removeEventListener(type, listener, options);
    windowEvents.mockClear();
    documentEvents.mockClear();
    vi.clearAllTimers();
    vi.resetModules();
    document.body.innerHTML =
      '<div id="options" style="display:none"></div><button id="optionsHide"></button><button id="optionsTrigger"></button>';
    mocks.list.mockResolvedValue(records);
    mocks.decode.mockResolvedValue(project);
    ({ PlanetBuilder: builder } = await import("./planet-builder"));
    ({ EditorDrafts: drafts } = await import("@/services/editor-drafts"));
    await builder.init();
    await vi.advanceTimersByTimeAsync(0);
  };
  const lastSaved = () => mocks.save.mock.calls.at(-1)![0] as RecoverySnapshot;

  it("restores saved raw settings drafts into a fresh app session without applying them", async () => {
    settingsDraft();
    const radius = document.getElementById("fpb-radius") as HTMLInputElement;
    radius.value = "";
    radius.dispatchEvent(new Event("input", { bubbles: true }));
    await vi.advanceTimersByTimeAsync(750);
    const saved = lastSaved();
    await restart([saved]);
    expect(drafts.count).toBe(1);
    expect(document.querySelector<HTMLInputElement>("#fpb-name")!.value).toBe("Pending planet");
    expect(document.querySelector<HTMLInputElement>("#fpb-radius")!.value).toBe("");
    expect((await builder.buildProject()).planet.name).toBe(DEFAULT_PLANET_SETTINGS.name);
    expect(document.getElementById("fpb-storage-summary")!.textContent).toContain("초안 로컬 보존 최신");
  });

  it("reuses one world blob and one recovery head while only draft values change", async () => {
    settingsDraft("draft one");
    await vi.advanceTimersByTimeAsync(750);
    const first = lastSaved();
    settingsDraft("draft two");
    await vi.advanceTimersByTimeAsync(750);
    const second = lastSaved();
    expect(second.id).toBe(first.id);
    expect(second.blob).toBe(first.blob);
    expect(second.drafts!.entries[0].values.name).toBe("draft two");
    expect(first.drafts!.entries[0].values.name).toBe("draft one");
    expect(mocks.prepare).toHaveBeenCalledOnce();
  });

  it("bounds draft save delay during continuous typing", async () => {
    for (let index = 0; index < 5; index++) {
      settingsDraft(`draft ${index}`);
      await vi.advanceTimersByTimeAsync(600);
    }
    expect(mocks.save).toHaveBeenCalledOnce();
    expect(lastSaved().drafts!.entries[0].values.name).toBe("draft 4");
  });

  it("warns about pending drafts until their transaction completes", async () => {
    changed();
    await vi.advanceTimersByTimeAsync(10_000);
    settingsDraft();
    const pending = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(pending);
    expect(pending.defaultPrevented).toBe(true);
    await vi.advanceTimersByTimeAsync(750);
    const saved = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(saved);
    expect(saved.defaultPrevented).toBe(false);
  });

  it("keeps a failed draft save pending and leaves the previous snapshot untouched", async () => {
    changed();
    await vi.advanceTimersByTimeAsync(10_000);
    const previous = lastSaved();
    mocks.save.mockRejectedValueOnce(new DOMException("Full", "QuotaExceededError"));
    settingsDraft();
    await vi.advanceTimersByTimeAsync(750);
    expect(previous.drafts!.entries).toEqual([]);
    expect(document.getElementById("fpb-storage-summary")!.textContent).toContain("초안 보존 실패");
    expect(drafts.count).toBe(1);
    const closing = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(closing);
    expect(closing.defaultPrevented).toBe(true);
  });

  it("persists draft deletion after an older in-flight write and does not resurrect it on restart", async () => {
    let finish!: () => void;
    mocks.save.mockImplementationOnce(
      () =>
        new Promise<void>(resolve => {
          finish = resolve;
        })
    );
    settingsDraft();
    await vi.advanceTimersByTimeAsync(750);
    document.querySelector<HTMLButtonElement>("#fpb-settings-form .fpb-draft-notice button")!.click();
    finish();
    await vi.advanceTimersByTimeAsync(750);
    expect(lastSaved().drafts!.entries).toEqual([]);
    const saved = lastSaved();
    await restart([saved]);
    expect(drafts.count).toBe(0);
    expect(document.querySelector<HTMLInputElement>("#fpb-name")!.value).toBe(DEFAULT_PLANET_SETTINGS.name);
  });

  it("records applied changes without retaining the previously pending draft", async () => {
    settingsDraft();
    await vi.advanceTimersByTimeAsync(750);
    const old = lastSaved();
    drafts.clear("planet-settings");
    changed();
    await vi.advanceTimersByTimeAsync(750);
    const applied = lastSaved();
    expect(applied.id).not.toBe(old.id);
    expect(applied.drafts!.entries).toEqual([]);
    await restart([applied, old]);
    expect(drafts.count).toBe(0);
  });

  it("does not attach a draft copied from a different project or snapshot", async () => {
    settingsDraft();
    await vi.advanceTimersByTimeAsync(750);
    const copied = { ...lastSaved(), id: "other-snapshot", projectId: "other-project" };
    await restart([copied]);
    expect(drafts.count).toBe(0);
    expect(document.querySelector<HTMLInputElement>("#fpb-name")!.value).toBe(DEFAULT_PLANET_SETTINGS.name);
    expect(tip).toHaveBeenCalledWith(expect.stringContaining("복구에서 제외"), true, "warn", 7000);
  });

  it("forks a new head after restart instead of changing a historical or other-tab record", async () => {
    settingsDraft();
    await vi.advanceTimersByTimeAsync(750);
    const historical = lastSaved();
    await restart([historical]);
    settingsDraft("continued draft");
    await vi.advanceTimersByTimeAsync(750);
    const continued = lastSaved();
    expect(continued.id).not.toBe(historical.id);
    expect(continued.projectId).toBe(historical.projectId);
    expect(continued.drafts!.snapshotId).toBe(continued.id);
    expect(historical.drafts!.entries[0].values.name).toBe("Pending planet");
  });

  it("does not mix local-only drafts into file or cloud project payloads", async () => {
    settingsDraft();
    await vi.advanceTimersByTimeAsync(750);
    const exported = await builder.buildProject();
    expect(exported).not.toHaveProperty("drafts");
    expect(exported.planet.name).toBe(DEFAULT_PLANET_SETTINGS.name);
    expect(lastSaved().drafts!.entries).toHaveLength(1);
  });

  it("rebuilds the world after a legacy editor interaction instead of reusing its cached blob", async () => {
    settingsDraft();
    await vi.advanceTimersByTimeAsync(750);
    const legacy = document.createElement("button");
    document.body.append(legacy);
    legacy.dispatchEvent(new Event("pointerup", { bubbles: true }));
    settingsDraft("continued after legacy edit");
    await vi.advanceTimersByTimeAsync(750);
    expect(mocks.prepare).toHaveBeenCalledTimes(2);
  });
});
