import { Controllers } from "@/controllers";
import { Campaign } from "@/controllers/campaign-world";
import { initDungeonLocations } from "@/controllers/dungeon-locations";
import { initMapIconGroups } from "@/controllers/map-icon-groups";
import { initRpgMapAssets } from "@/controllers/rpg-map-assets";
import { renderCloudProjectRow } from "@/renderers/cloud-project-row";
import { Services } from "@/services";
import { getUiLanguage, initUiLanguage, t } from "@/services/ui-language";
import type { CloudProject, PlanetProject, PlanetSettings, PlanetViewMode } from "@/types/planet-project";
import { DEFAULT_PLANET_SETTINGS } from "@/types/planet-project";
import { ensureEl } from "@/utils";
import { ProjectConflictError, ProjectRepository } from "./bkend-repository";
import { assertPlanetProject, ProjectCodec } from "./project-codec";
import { ProjectSession } from "./project-session";
import { isPlanetSettings } from "./project-validation";

const UPSTREAM_COMMIT = "03a10502b0293b2afdb37b506f8b25178ce06c4f";
const SETTINGS_KEY = "fpb-planet-settings";
const AUTOSAVE_KEY = "lastPlanetProject";
const AUTOSAVE_DELAY = 10_000;
const CLOUD_AUTOSAVE_DELAY = 60_000;

const isFirstRun = !localStorage.getItem(SETTINGS_KEY);
let settings = loadSettings();
const session = new ProjectSession();
let autosaveTimer = 0;
let cloudAutosaveTimer = 0;
let textureUpdateTimer = 0;
let loadingProject = false;
let changeRevision = 0;
let viewMode: PlanetViewMode = "map";

async function init(): Promise<void> {
  if (document.getElementById("fpb-shell")) return;
  createShell();
  Campaign.init();
  initUiLanguage();
  initRpgMapAssets();
  initMapIconGroups();
  initDungeonLocations();
  bindEvents();
  document.body.classList.add("fpb-ready");
  fitMapToScreen();
  updateForm();
  setStatus("로컬 프로젝트", "local");
  if (isFirstRun) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    const createFirstPlanet = () => {
      applyPlanetSettingsToFmg(settings);
      setStatus("첫 행성 생성 중", "saving");
      regeneratePrompt();
    };
    if (mapHistory.length) window.setTimeout(createFirstPlanet, 0);
    else window.addEventListener("map:generated", () => window.setTimeout(createFirstPlanet, 0), { once: true });
  } else if (mapHistory.length) window.setTimeout(() => void restoreAutosave(), 0);
  else
    window.addEventListener("map:generated", () => window.setTimeout(() => void restoreAutosave(), 0), { once: true });
}

function createShell(): void {
  const shell = document.createElement("header");
  shell.id = "fpb-shell";
  shell.innerHTML = /* html */ `
    <div class="fpb-brand">
      <span class="fpb-brand-mark icon-globe-africa" aria-hidden="true"></span>
      <div><strong>판타지 행성 빌더</strong><small>Azgaar FMG 기반 · MIT</small></div>
    </div>
    <div class="fpb-view-switch" role="group" aria-label="보기 모드">
      <button id="fpb-map-view" class="active" type="button"><span class="icon-map-o"></span>2D 지도</button>
      <button id="fpb-globe-view" type="button"><span class="icon-globe"></span>3D 행성</button>
    </div>
    <div class="fpb-actions">
      <span id="fpb-save-status" class="fpb-status" data-state="local">로컬 프로젝트</span>
      <button id="fpb-editor-button" type="button" title="지도 도구" aria-label="지도 도구" aria-controls="options" aria-expanded="false"><span class="icon-book" aria-hidden="true"></span>지도 도구</button>
      <button id="fpb-settings-button" type="button" title="행성 설정"><span class="icon-cog"></span>행성 설정</button>
      <button id="fpb-save-button" type="button" title="FPB 프로젝트 저장"><span class="icon-download"></span>저장</button>
      <button id="fpb-load-button" type="button" title="FPB 또는 MAP 프로젝트 열기"><span class="icon-folder-open-empty"></span>열기</button>
      <button id="fpb-cloud-button" type="button" title="개인 클라우드"><span class="icon-cloud"></span>클라우드</button>
    </div>
    <label class="fpb-language-control"><span class="icon-globe" aria-hidden="true"></span><select id="fpb-language" data-fpb-language data-fpb-preference aria-label="언어 / Language" title="언어 / Language"><option value="ko">한국어</option><option value="en">English</option></select></label>`;

  const panel = document.createElement("aside");
  panel.id = "fpb-settings-panel";
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = /* html */ `
    <div class="fpb-panel-header"><div><small>세계 설정</small><h2>행성 설정</h2></div><button id="fpb-settings-close" class="fpb-icon-button icon-cancel" type="button" title="닫기" aria-label="닫기"></button></div>
    <form id="fpb-settings-form">
      <label>행성 이름<input id="fpb-name" name="name" type="text" maxlength="80" required></label>
      <div class="fpb-grid-2">
        <label>반지름 <span>km</span><input id="fpb-radius" name="radiusKm" type="number" min="500" max="50000" step="1"></label>
        <label>하루 <span>시간</span><input id="fpb-rotation" name="rotationHours" type="number" min="4" max="200" step="0.1"></label>
      </div>
      <label>자전축 기울기 <output id="fpb-tilt-output"></output><input id="fpb-tilt" name="axialTiltDeg" type="range" min="0" max="60" step="0.5"></label>
      <label>대륙 형태<select id="fpb-heightmap" name="heightmapPreset"><option value="pangea">초대륙</option><option value="continents">대륙</option><option value="archipelago">군도</option><option value="shattered">파편 세계</option></select></label>
      <label>해수면 기준 <output id="fpb-sea-output"></output><input id="fpb-sea" name="seaLevel" type="range" min="10" max="30" step="1"></label>
      <div class="fpb-section-title">기후</div>
      <div class="fpb-grid-3">
        <label>적도 °C<input id="fpb-equator" name="equatorC" type="number" min="-20" max="50"></label>
        <label>북극 °C<input id="fpb-north" name="northPoleC" type="number" min="-70" max="20"></label>
        <label>남극 °C<input id="fpb-south" name="southPoleC" type="number" min="-70" max="20"></label>
      </div>
      <label>강수량 <output id="fpb-precip-output"></output><input id="fpb-precip" name="precipitation" type="range" min="0" max="300" step="5"></label>
      <label>생성 시드<input id="fpb-seed" name="seed" type="number" min="1" max="999999999" placeholder="비우면 무작위"></label>
      <div class="fpb-panel-actions"><button id="fpb-apply-button" class="primary" type="submit"><span class="icon-globe"></span>행성 생성</button><button id="fpb-screenshot-button" type="button"><span class="icon-picture"></span>행성 캡처</button></div>
    </form>`;

  const cloudDialog = document.createElement("dialog");
  cloudDialog.id = "fpb-cloud-dialog";
  cloudDialog.innerHTML = /* html */ `
    <div class="fpb-dialog-header"><div><small>개인 클라우드</small><h2>내 행성 프로젝트</h2></div><select class="fpb-dialog-language" data-fpb-language data-fpb-preference aria-label="언어 / Language"><option value="ko">한국어</option><option value="en">English</option></select><button id="fpb-cloud-close" class="fpb-icon-button icon-cancel" type="button" title="닫기" aria-label="닫기"></button></div>
    <div id="fpb-cloud-content"></div>`;

  const fileInput = document.createElement("input");
  fileInput.id = "fpb-file-input";
  fileInput.type = "file";
  fileInput.accept = ".fpb,.map,.gz";
  fileInput.hidden = true;

  document.body.append(shell, panel, cloudDialog, fileInput);
}

function bindEvents(): void {
  ensureEl("fpb-map-view").addEventListener("click", () => void setView("map"));
  ensureEl("fpb-globe-view").addEventListener("click", () => void setView("globe"));
  ensureEl("fpb-settings-button").addEventListener("click", toggleSettings);
  const editorButton = ensureEl("fpb-editor-button");
  editorButton.addEventListener("click", () => {
    const open = ensureEl("options").style.display !== "none";
    ensureEl(open ? "optionsHide" : "optionsTrigger").click();
    editorButton.setAttribute("aria-expanded", String(!open));
  });
  new MutationObserver(() =>
    editorButton.setAttribute("aria-expanded", String(ensureEl("options").style.display !== "none"))
  ).observe(ensureEl("options"), { attributes: true, attributeFilter: ["style"] });
  ensureEl("fpb-settings-close").addEventListener("click", closeSettings);
  ensureEl("fpb-save-button").addEventListener("click", () => void saveToMachine());
  ensureEl("fpb-load-button").addEventListener("click", () => ensureEl<HTMLInputElement>("fpb-file-input").click());
  ensureEl<HTMLInputElement>("fpb-file-input").addEventListener("change", event => void loadFile(event));
  ensureEl<HTMLFormElement>("fpb-settings-form").addEventListener("submit", event => void generatePlanet(event));
  ensureEl("fpb-screenshot-button").addEventListener("click", () => void saveGlobeScreenshot());
  ensureEl("fpb-cloud-button").addEventListener("click", () => void openCloud());
  ensureEl("fpb-cloud-close").addEventListener("click", () => ensureEl<HTMLDialogElement>("fpb-cloud-dialog").close());

  for (const id of ["fpb-tilt", "fpb-sea", "fpb-precip"]) {
    ensureEl<HTMLInputElement>(id).addEventListener("input", updateRangeOutputs);
  }

  window.addEventListener("map:generated", () => {
    beginDocument();
    mapName.value = settings.name;
    setStatus("저장되지 않은 변경", "dirty");
    scheduleAutosave();
  });
  window.addEventListener("map:loaded", () => {
    if (!loadingProject) {
      beginDocument();
      scheduleAutosave();
    }
  });
  window.addEventListener("planet:location-selected", event => {
    const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
    void setView("map").then(() => zoomTo(x, y, 4, 800));
  });
  document.addEventListener(
    "change",
    event => {
      if (!(event.target as Element).closest?.("[data-fpb-preference]")) scheduleAutosave();
    },
    true
  );
  window.addEventListener("project:changed", scheduleAutosave);
  document.addEventListener("pointerup", event => {
    if ((event.target as Element).closest?.("#map")) scheduleAutosave();
  });
}

async function setView(mode: PlanetViewMode): Promise<void> {
  viewMode = mode;
  ensureEl("fpb-map-view").classList.toggle("active", mode === "map");
  ensureEl("fpb-globe-view").classList.toggle("active", mode === "globe");
  if (mode === "globe") await Controllers.View3d.open("viewGlobe");
  else {
    fitMapToScreen();
    await Controllers.View3d.enterStandard();
  }
  if (mode === "globe") {
    window.setTimeout(() => {
      if (ensureEl("options3d").offsetParent) $("#options3d").dialog("close");
    }, 0);
  }
  scheduleAutosave();
}

function toggleSettings(): void {
  const panel = ensureEl("fpb-settings-panel");
  const open = !panel.classList.contains("open");
  panel.classList.toggle("open", open);
  panel.setAttribute("aria-hidden", String(!open));
}

function closeSettings(): void {
  ensureEl("fpb-settings-panel").classList.remove("open");
  ensureEl("fpb-settings-panel").setAttribute("aria-hidden", "true");
}

function updateForm(): void {
  setValue("fpb-name", settings.name);
  setValue("fpb-radius", settings.radiusKm);
  setValue("fpb-rotation", settings.rotationHours);
  setValue("fpb-tilt", settings.axialTiltDeg);
  setValue("fpb-heightmap", settings.heightmapPreset);
  setValue("fpb-sea", settings.seaLevel);
  setValue("fpb-equator", settings.climate.equatorC);
  setValue("fpb-north", settings.climate.northPoleC);
  setValue("fpb-south", settings.climate.southPoleC);
  setValue("fpb-precip", settings.climate.precipitation);
  setValue("fpb-seed", settings.seed);
  updateRangeOutputs();
}

function collectSettings(): PlanetSettings {
  return {
    name: getValue("fpb-name") || DEFAULT_PLANET_SETTINGS.name,
    seed: getValue("fpb-seed"),
    radiusKm: getNumber("fpb-radius"),
    axialTiltDeg: getNumber("fpb-tilt"),
    rotationHours: getNumber("fpb-rotation"),
    projection: "equirectangular",
    seaLevel: getNumber("fpb-sea"),
    heightmapPreset: getValue("fpb-heightmap") as PlanetSettings["heightmapPreset"],
    climate: {
      equatorC: getNumber("fpb-equator"),
      northPoleC: getNumber("fpb-north"),
      southPoleC: getNumber("fpb-south"),
      precipitation: getNumber("fpb-precip"),
      winds: [...settings.climate.winds]
    }
  };
}

async function generatePlanet(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (loadingProject) return;
  beginDocument();
  settings = collectSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applyPlanetSettingsToFmg(settings);
  closeSettings();
  setStatus("행성 생성 중", "saving");
  regeneratePrompt(settings.seed ? { seed: settings.seed } : undefined);
}

function applyPlanetSettingsToFmg(next: PlanetSettings): void {
  const width = Math.max(960, Math.floor(window.innerWidth / 2) * 2);
  setFmgInput("mapWidthInput", width);
  setFmgInput("mapHeightInput", Math.round(width / 2));
  setFmgInput("mapSizeInput", 100);
  setFmgInput("mapSizeOutput", 100);
  setFmgInput("latitudeInput", 50);
  setFmgInput("latitudeOutput", 50);
  setFmgInput("longitudeInput", 50);
  setFmgInput("longitudeOutput", 50);
  setFmgInput("temperatureEquatorInput", next.climate.equatorC);
  setFmgInput("temperatureEquatorOutput", next.climate.equatorC);
  setFmgInput("temperatureNorthPoleInput", next.climate.northPoleC);
  setFmgInput("temperatureNorthPoleOutput", next.climate.northPoleC);
  setFmgInput("temperatureSouthPoleInput", next.climate.southPoleC);
  setFmgInput("temperatureSouthPoleOutput", next.climate.southPoleC);
  setFmgInput("precInput", next.climate.precipitation);
  setFmgInput("precOutput", next.climate.precipitation);
  const heightmapPreset = next.seaLevel >= 25 ? "archipelago" : next.seaLevel <= 15 ? "pangea" : next.heightmapPreset;
  setFmgInput("templateInput", heightmapPreset);

  localStorage.setItem("template", heightmapPreset);
  localStorage.setItem("mapSize", "100");
  localStorage.setItem("latitude", "50");
  localStorage.setItem("longitude", "50");
  localStorage.setItem("temperatureEquator", String(next.climate.equatorC));
  localStorage.setItem("temperatureNorthPole", String(next.climate.northPoleC));
  localStorage.setItem("temperatureSouthPole", String(next.climate.southPoleC));
  localStorage.setItem("prec", String(next.climate.precipitation));

  options.temperatureEquator = next.climate.equatorC;
  options.temperatureNorthPole = next.climate.northPoleC;
  options.temperatureSouthPole = next.climate.southPoleC;
  options.winds = [...next.climate.winds];
  for (const option of [
    "mapSize",
    "latitude",
    "longitude",
    "temperatureEquator",
    "temperatureNorthPole",
    "temperatureSouthPole",
    "prec",
    "template"
  ]) {
    if (!locked(option)) lock(option);
  }
}

async function buildProject(): Promise<PlanetProject> {
  if (loadingProject) throw new Error("A project is already being opened");
  const generation = session.capture();
  const mapPayload = await Services.Save.prepareMapData();
  if (!session.isCurrent(generation)) throw new Error("Project changed during export");
  const activeLayers = Array.from(document.querySelectorAll("#map > #viewbox > g"))
    .filter(element => getComputedStyle(element).display !== "none")
    .map(element => element.id)
    .filter(Boolean);
  const project = ProjectCodec.createPlanetProject({
    mapPayload,
    settings,
    fmgVersion: VERSION,
    upstreamCommit: UPSTREAM_COMMIT,
    mode: viewMode,
    activeLayers
  });
  project.campaign = structuredClone(Campaign.get());
  if (project.view.mode === "globe") project.view.camera = await Controllers.View3d.getCameraState();
  if (!session.isCurrent(generation)) throw new Error("Project changed during export");
  return project;
}

async function saveToMachine(): Promise<void> {
  const generation = session.capture();
  const revision = changeRevision;
  try {
    setStatus("프로젝트 압축 중", "saving");
    const project = await buildProject();
    const blob = await ProjectCodec.encodePlanetProject(project);
    downloadBlob(blob, `${safeFilename(project.planet.name)}.fpb`);
    if (session.isCurrent(generation) && revision === changeRevision) setStatus("기기에 저장됨", "saved");
  } catch (error) {
    if (session.isCurrent(generation)) showError(error);
  }
}

async function loadFile(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const generation = session.capture();

  try {
    setStatus("프로젝트 여는 중", "saving");
    const project = file.name.toLowerCase().endsWith(".fpb")
      ? await ProjectCodec.decodePlanetProject(file)
      : await ProjectCodec.decodeLegacyMap(file, { fmgVersion: VERSION, upstreamCommit: UPSTREAM_COMMIT }, settings);
    if (!session.isCurrent(generation)) return;
    await loadProject(project);
    setStatus("프로젝트 열림", "saved");
  } catch (error) {
    showError(error);
  } finally {
    input.value = "";
  }
}

async function loadProject(project: PlanetProject): Promise<void> {
  assertPlanetProject(project);
  if (loadingProject) throw new Error("A project is already being opened");
  loadingProject = true;
  beginDocument();
  const generation = session.capture();
  let restored = false;
  try {
    await setView("map");
    await Services.Load.loadMap(new Blob([project.mapPayload], { type: "text/plain" }));
    if (!session.isCurrent(generation)) throw new Error("Project changed during loading");
    settings = structuredClone(project.planet);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    updateForm();
    Campaign.restore(project.campaign);
    await setView(project.view.mode);
    if (project.view.mode === "globe") await Controllers.View3d.setCameraState(project.view.camera);
    restored = true;
  } finally {
    loadingProject = false;
    if (restored) scheduleAutosave();
  }
}

function beginDocument(): void {
  session.reset();
  window.clearTimeout(autosaveTimer);
  window.clearTimeout(cloudAutosaveTimer);
  window.clearTimeout(textureUpdateTimer);
}

function scheduleAutosave(): void {
  if (loadingProject) return;
  changeRevision++;
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => void autosave(), AUTOSAVE_DELAY);
  scheduleCloudSync();
  if (document.body.classList.contains("fpb-ready")) setStatus("저장되지 않은 변경", "dirty");
  window.clearTimeout(textureUpdateTimer);
  if (options.threeD.isOn) {
    textureUpdateTimer = window.setTimeout(() => {
      if (options.threeD.isOn) void Controllers.View3d.update();
    }, 350);
  }
}

function scheduleCloudSync(): void {
  window.clearTimeout(cloudAutosaveTimer);
  if (!ProjectRepository.isAuthenticated() || !session.cloudProject) return;
  cloudAutosaveTimer = window.setTimeout(() => void autoSyncCloud(), CLOUD_AUTOSAVE_DELAY);
}

async function restoreAutosave(): Promise<void> {
  const generation = session.capture();
  const revision = changeRevision;
  try {
    const blob = await ldb.get(AUTOSAVE_KEY);
    if (!(blob instanceof Blob) || !blob.size) return;
    const project = await ProjectCodec.decodePlanetProject(blob);
    if (!session.isCurrent(generation) || revision !== changeRevision) return;
    await loadProject(project);
    setStatus("자동 저장 복구됨", "saved");
  } catch (error) {
    ERROR && console.error(error);
    setStatus("자동 저장 복구 실패", "error");
  }
}

async function autosave(): Promise<void> {
  if (customization || loadingProject) return;
  const generation = session.capture();
  const revision = changeRevision;
  try {
    await session.run("local", generation, async () => {
      const blob = await ProjectCodec.encodePlanetProject(await buildProject());
      if (!session.isCurrent(generation)) return;
      await ldb.set(AUTOSAVE_KEY, blob);
      if (session.isCurrent(generation) && revision === changeRevision) setStatus("자동 저장됨", "saved");
    });
  } catch (error) {
    if (!session.isCurrent(generation)) return;
    ERROR && console.error(error);
    setStatus("자동 저장 실패", "error");
  }
}

async function saveGlobeScreenshot(): Promise<void> {
  if (viewMode !== "globe") await setView("globe");
  await Controllers.View3d.saveScreenshot();
}

async function openCloud(): Promise<void> {
  const dialog = ensureEl<HTMLDialogElement>("fpb-cloud-dialog");
  dialog.showModal();
  await renderCloudContent();
}

async function renderCloudContent(): Promise<void> {
  const content = ensureEl("fpb-cloud-content");
  if (!ProjectRepository.isConfigured()) {
    content.innerHTML = `<div class="fpb-empty"><span class="icon-cloud"></span><strong>클라우드 연결 대기 중</strong><p>배포 환경의 bkend.ai 설정이 완료되면 개인 프로젝트 저장소가 활성화됩니다.</p></div>`;
    return;
  }
  if (!ProjectRepository.isAuthenticated()) {
    content.innerHTML = /* html */ `<form id="fpb-auth-form" class="fpb-auth-form"><label>이메일<input name="email" type="email" autocomplete="email" required></label><label>비밀번호<input name="password" type="password" autocomplete="current-password" minlength="8" required></label><div class="fpb-dialog-actions"><button class="primary" name="action" value="signin" type="submit">로그인</button><button name="action" value="signup" type="submit">회원가입</button></div></form>`;
    ensureEl<HTMLFormElement>("fpb-auth-form").addEventListener("submit", event => void authenticate(event));
    return;
  }

  content.innerHTML = `<div class="fpb-cloud-toolbar"><span>${escapeHtml(ProjectRepository.getEmail())}</span><div><button id="fpb-cloud-save" class="primary" type="button"><span class="icon-upload-cloud"></span>현재 행성 저장</button><button id="fpb-cloud-signout" type="button">로그아웃</button></div></div><div id="fpb-cloud-list" class="fpb-cloud-list"><div class="fpb-loading">프로젝트를 불러오는 중...</div></div>`;
  ensureEl("fpb-cloud-save").addEventListener("click", () => void saveToCloud());
  ensureEl("fpb-cloud-signout").addEventListener("click", () => void signOut());
  await refreshCloudList();
}

async function authenticate(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  try {
    const action = (event.submitter as HTMLButtonElement | null)?.value;
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    if (action === "signup") await ProjectRepository.signUp(email, password);
    else await ProjectRepository.signIn(email, password);
    await renderCloudContent();
  } catch (error) {
    showError(error);
  }
}

async function saveToCloud(): Promise<void> {
  const generation = session.capture();
  try {
    setStatus("클라우드 저장 중", "saving");
    await persistCloud(generation, false, "클라우드에 저장됨");
    if (!session.isCurrent(generation)) return;
    await refreshCloudList();
  } catch (error) {
    if (!session.isCurrent(generation)) return;
    if (error instanceof ProjectConflictError && session.cloudProject) {
      const preserveBoth = window.confirm(
        t(
          "클라우드에 더 새로운 버전이 있습니다. 로컬 작업을 별도 프로젝트로 보존할까요? 취소하면 로컬 파일은 유지되고 목록에서 클라우드본을 열 수 있습니다."
        )
      );
      if (preserveBoth) {
        try {
          await persistCloud(generation, true, "로컬 작업을 별도 보존함");
          await refreshCloudList();
          return;
        } catch (preserveError) {
          showError(preserveError);
        }
      }
    }
    setStatus("클라우드 저장 실패", "error");
    showError(error);
  }
}

async function autoSyncCloud(): Promise<void> {
  if (!session.cloudProject) return;
  const generation = session.capture();
  try {
    await persistCloud(generation, false, "클라우드 자동 동기화됨");
  } catch (error) {
    if (!session.isCurrent(generation)) return;
    setStatus(error instanceof ProjectConflictError ? "클라우드 충돌 확인 필요" : "클라우드 자동 동기화 실패", "error");
    showError(error);
  }
}

async function persistCloud(generation: number, createCopy: boolean, status: string): Promise<void> {
  await session.run("cloud", generation, async () => {
    const revision = changeRevision;
    const project = await buildProject();
    const blob = await ProjectCodec.encodePlanetProject(project);
    if (!session.isCurrent(generation)) return;
    const saved = await ProjectRepository.save(project, blob, createCopy ? undefined : session.cloudProject);
    if (!session.isCurrent(generation)) return;
    session.cloudProject = saved;
    if (revision === changeRevision) setStatus(status, "cloud");
    else scheduleCloudSync();
  });
}

async function refreshCloudList(): Promise<void> {
  const listElement = document.getElementById("fpb-cloud-list");
  if (!listElement) return;
  try {
    const projects = await ProjectRepository.list();
    listElement.innerHTML = projects.length
      ? projects.map(project => renderCloudProjectRow(project, getUiLanguage())).join("")
      : `<div class="fpb-empty compact"><strong>저장된 행성이 없습니다</strong><p>현재 행성을 클라우드에 저장해 보세요.</p></div>`;
    listElement.querySelectorAll<HTMLElement>("[data-action]").forEach(button => {
      button.addEventListener("click", () => void handleCloudAction(button, projects));
    });
  } catch (error) {
    listElement.innerHTML = `<div class="fpb-empty compact"><strong>프로젝트를 불러오지 못했습니다</strong></div>`;
    showError(error);
  }
}

async function handleCloudAction(button: HTMLElement, projects: CloudProject[]): Promise<void> {
  const project = projects.find(item => item.id === button.dataset.id);
  if (!project) return;
  try {
    if (button.dataset.action === "open") {
      const generation = session.capture();
      const decoded = await ProjectCodec.decodePlanetProject(await ProjectRepository.load(project));
      if (!session.isCurrent(generation)) return;
      decoded.planet.name = project.name;
      const pending = loadProject(decoded);
      const openedGeneration = session.capture();
      await pending;
      if (!session.isCurrent(openedGeneration)) return;
      session.cloudProject = project;
      scheduleCloudSync();
      ensureEl<HTMLDialogElement>("fpb-cloud-dialog").close();
      setStatus("클라우드 프로젝트", "cloud");
    }
    if (button.dataset.action === "rename") {
      const name = window.prompt(t("새 프로젝트 이름"), project.name)?.trim();
      if (name) {
        const generation = session.capture();
        await session.run("cloud", generation, async () => {
          const current = session.cloudProject?.id === project.id;
          const renamed = await ProjectRepository.rename(current ? session.cloudProject! : project, name);
          if (session.isCurrent(generation) && current && session.cloudProject?.id === project.id) {
            session.cloudProject = renamed;
            settings.name = name;
            mapName.value = name;
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            updateForm();
            scheduleAutosave();
          }
        });
      }
    }
    if (
      button.dataset.action === "delete" &&
      window.confirm(t("'{name}' 프로젝트를 삭제할까요?", { name: project.name }))
    ) {
      if (session.cloudProject?.id === project.id) {
        session.reset();
        window.clearTimeout(cloudAutosaveTimer);
      }
      await session.run("cloud", session.capture(), () => ProjectRepository.remove(project));
    }
    await refreshCloudList();
  } catch (error) {
    showError(error);
  }
}

async function signOut(): Promise<void> {
  session.reset();
  window.clearTimeout(cloudAutosaveTimer);
  try {
    await ProjectRepository.signOut();
  } catch (error) {
    showError(error);
  } finally {
    setStatus("로컬 프로젝트", "local");
    await renderCloudContent();
  }
}

function updateRangeOutputs(): void {
  ensureEl<HTMLOutputElement>("fpb-tilt-output").value = `${getValue("fpb-tilt")}°`;
  ensureEl<HTMLOutputElement>("fpb-sea-output").value = getValue("fpb-sea");
  ensureEl<HTMLOutputElement>("fpb-precip-output").value = `${getValue("fpb-precip")}%`;
}

function setStatus(text: string, state: string): void {
  const status = document.getElementById("fpb-save-status");
  if (!status) return;
  status.textContent = t(text);
  status.title = t(text);
  status.dataset.state = state;
}

function setFmgInput(id: string, value: string | number): void {
  const input = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  if (input) input.value = String(value);
}

function getValue(id: string): string {
  return ensureEl<HTMLInputElement | HTMLSelectElement>(id).value;
}

function getNumber(id: string): number {
  return Number(getValue(id));
}

function setValue(id: string, value: string | number): void {
  ensureEl<HTMLInputElement | HTMLSelectElement>(id).value = String(value);
}

function loadSettings(): PlanetSettings {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null") as Partial<PlanetSettings> | null;
    if (!stored) return structuredClone(DEFAULT_PLANET_SETTINGS);
    const merged = {
      ...structuredClone(DEFAULT_PLANET_SETTINGS),
      ...stored,
      climate: { ...DEFAULT_PLANET_SETTINGS.climate, ...stored.climate }
    };
    return isPlanetSettings(merged) ? merged : structuredClone(DEFAULT_PLANET_SETTINGS);
  } catch {
    return structuredClone(DEFAULT_PLANET_SETTINGS);
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function safeFilename(value: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: File names must reject C0 control characters.
  return value.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "fantasy-planet";
}

function escapeHtml(value: string): string {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function showError(error: unknown): void {
  const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
  tip(t(message), true, "error", 5000);
}

export const PlanetBuilder = { init, buildProject, loadProject, saveToMachine, setView };
