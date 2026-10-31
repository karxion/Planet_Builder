import {
  ADVENTURE_MONSTER_BY_ID,
  ADVENTURE_THEME_BY_ID,
  ADVENTURE_THEMES,
  isAdventureSite
} from "@/data/adventure-sites";
import { battlePreset } from "@/data/battle-map";
import { DUNGEON_ASSETS, dungeonAssetUrl } from "@/data/dungeon-assets";
import { DUNGEON_DEVICE_BY_ID, DUNGEON_DEVICE_TEMPLATES } from "@/data/dungeon-devices";
import { diagnoseDungeonV2, isDungeonV2 } from "@/data/dungeon-v2-validation";
import { isDungeonInteriorV1 } from "@/data/dungeon-validation";
import { advanceDungeonRound, operateDungeonDevice, syncDungeonDevice } from "@/generators/dungeon-devices";
import {
  addDungeonEntity,
  addDungeonRegion,
  deleteDungeonFloor,
  duplicateDungeon,
  regenerateDungeonRoom
} from "@/generators/dungeon-edit";
import {
  createDungeonV2,
  DEFAULT_DUNGEON_SETTINGS,
  insertDungeonFloor,
  makeDungeonConnection,
  regenerateDungeonFloor
} from "@/generators/dungeon-layout";
import type { Marker } from "@/generators/markers-generator";
import { publicDungeonV2, renderDungeonSection, renderDungeonV2 } from "@/renderers/dungeon-v2";
import { escapeAttribute as esc } from "@/renderers/rpg-asset-renderer";
import { inlineSceneImages, scenePng } from "@/renderers/scene-assets";
import { EditorDrafts } from "@/services/editor-drafts";
import { migrateDungeonV1 } from "@/services/planet/dungeon-migration";
import { recoverDungeonV2 } from "@/services/planet/dungeon-recovery";
import { getUiLanguage } from "@/services/ui-language";
import type {
  DeviceTemplateId,
  DungeonAssetId,
  DungeonConnection,
  DungeonFloor,
  DungeonFloorSettings,
  DungeonV2
} from "@/types/dungeon-v2";
import { generatedText } from "@/utils/generation-text";
import { battleMapControls } from "./battle-map-settings";

const l = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);
let dialog: HTMLDialogElement,
  markerId: number,
  floorId = "",
  roomId = "",
  entityId = "",
  gm = true,
  tactical = false,
  overview = false,
  grid = true,
  section = false,
  status = "",
  zoom = 1;
let pending: { d: DungeonV2; label: string; newMarker: boolean; warnings: string[] } | undefined;
let undo: { markerId: number; d: DungeonV2 }[] = [];
let viewportObserver: ResizeObserver | undefined;
let viewportFrame = 0;
let viewportSize: { map: SVGSVGElement; width: number; height: number } | undefined;

/** Resize the existing SVG without replacing forms, focus or the current scroll position. */
function fitDungeonViewport(): void {
  viewportFrame = 0;
  const viewport = dialog?.querySelector<HTMLElement>(".fpb-interior-scroll");
  const content = viewport?.firstElementChild as HTMLElement | null;
  const map = content?.querySelector<SVGSVGElement>("svg.fpb-dungeon-map");
  if (!viewport || !content || !map || !viewport.clientWidth) return;
  const width = Number(map.getAttribute("width")),
    height = Number(map.getAttribute("height"));
  const maximumHeight = Number.parseFloat(getComputedStyle(viewport).maxHeight) || innerHeight * 0.6;
  if (!(width > 0 && height > 0 && maximumHeight > 0)) return;
  const oldWidth = content.getBoundingClientRect().width;
  const oldHeight = content.getBoundingClientRect().height;
  const previousWidth = viewportSize?.map === map ? viewportSize.width : viewport.clientWidth;
  const previousHeight = viewportSize?.map === map ? viewportSize.height : viewport.clientHeight;
  const centerX = oldWidth
    ? (viewport.scrollLeft + previousWidth / 2 - Math.max(0, (previousWidth - oldWidth) / 2)) / oldWidth
    : 0.5;
  const centerY = oldHeight ? (viewport.scrollTop + previousHeight / 2) / oldHeight : 0.5;
  const nextWidth = Math.min(viewport.clientWidth, (maximumHeight * width) / height) * zoom;
  content.style.minWidth = "0";
  content.style.margin = "0 auto";
  content.style.width = `${nextWidth}px`;
  viewport.scrollLeft = zoom === 1 ? 0 : centerX * nextWidth - viewport.clientWidth / 2;
  viewport.scrollTop = zoom === 1 ? 0 : (centerY * nextWidth * height) / width - viewport.clientHeight / 2;
  viewportSize = { map, width: viewport.clientWidth, height: viewport.clientHeight };
}
function scheduleDungeonViewport(): void {
  if (!dialog?.isConnected || !dialog.open || viewportFrame) return;
  if (typeof requestAnimationFrame !== "function") {
    fitDungeonViewport();
    return;
  }
  viewportFrame = requestAnimationFrame(fitDungeonViewport);
}
function setDungeonZoom(value: number): void {
  zoom = Math.max(1, Math.min(6, value));
  fitDungeonViewport();
  const output = dialog.querySelector(".fpb-dv2-zoom output");
  if (output) output.textContent = `${Math.round(zoom * 100)}%`;
  dialog.querySelector<HTMLButtonElement>("[data-zoom-out]")!.disabled = zoom <= 1;
  dialog.querySelector<HTMLButtonElement>("[data-zoom-in]")!.disabled = zoom >= 6;
}
function setDungeonTab(tab: string): void {
  dialog.dataset.tab = tab;
  for (const button of dialog.querySelectorAll<HTMLElement>("[data-tab]"))
    button.setAttribute("aria-pressed", String(button.dataset.tab === tab));
  scheduleDungeonViewport();
}
const marker = () => window.pack?.markers.find(m => m.i === markerId);
const saved = () => {
  const value = marker()?.interior;
  return isDungeonV2(value) ? value : undefined;
};
const current = () => pending?.d || saved();
const uid = () => crypto.randomUUID();
const changed = () => {
  window.dispatchEvent(new Event("project:changed"));
  window.dispatchEvent(new Event("dungeons:changed"));
};
const bindElement = (element: HTMLElement | null, action: () => void) =>
  element?.addEventListener("click", () => {
    try {
      action();
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      render();
    }
  });
const bind = (selector: string, action: () => void) => bindElement(dialog.querySelector<HTMLElement>(selector), action);
function preview(d: DungeonV2, label: string, newMarker = false, allowWarnings = false): void {
  if (!isDungeonV2(d))
    throw new Error(l("초안 데이터가 유효하지 않습니다. 원본은 보존됩니다.", "Invalid draft; source preserved."));
  const warnings = diagnoseDungeonV2(d);
  if (warnings.length && !allowWarnings) throw new Error(warnings.join(" · "));
  pending = { d, label, newMarker, warnings };
  status = "";
  render();
}
function apply(): void {
  if (!pending) return;
  const old = marker();
  if (!old) return;
  const { d, newMarker } = pending;
  if (!isDungeonV2(d)) throw new Error(l("초안 검증 실패: 원본을 보존했습니다.", "Invalid draft: source preserved."));
  const previous = saved();
  if (previous) {
    EditorDrafts.clear(`dungeon:${markerId}:${previous.id}:floor:${floorId}`);
    EditorDrafts.clear(`dungeon:${markerId}:${previous.id}:room:${roomId}`);
  }
  if (newMarker) {
    const i = Math.max(0, ...pack.markers.map(m => m.i)) + 1;
    const next: Marker = { ...structuredClone(old), i, interior: structuredClone(d), lock: true };
    pack.markers.push(next);
    notes.push({ id: `marker${i}`, name: d.name, legend: "" });
    markerId = i;
    if (typeof drawMarkers === "function") drawMarkers();
  } else {
    const original = saved();
    if (original) {
      undo = [...undo, { markerId, d: structuredClone(original) }].slice(-10);
      while (undo.length && JSON.stringify(undo).length > 6 * 1024 * 1024) undo.shift();
    }
    old.interior = structuredClone(d);
    old.lock = true;
  }
  pending = undefined;
  changed();
  status = l("적용했습니다.", "Applied.");
  render();
}
function settings(): DungeonFloorSettings {
  const f = dialog.querySelector<HTMLFormElement>("[data-floor-settings]")!,
    form = new FormData(f),
    base = current()!.floors.find(f => f.id === floorId)!.settings;
  return {
    ...base,
    concept: String(form.get("concept")),
    structure: String(form.get("structure")) as DungeonFloorSettings["structure"],
    environment: String(form.get("environment")) as DungeonFloorSettings["environment"],
    width: Number(form.get("width")),
    height: Number(form.get("height")),
    roomCount: Number(form.get("roomCount")),
    deviceDensity: Number(form.get("deviceDensity")),
    themeId: String(form.get("themeId")),
    monsterId: String(form.get("monsterId")),
    difficulty: String(form.get("difficulty")) as DungeonFloorSettings["difficulty"]
  };
}
function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function exportFloors(format: "svg" | "png", all = false): Promise<void> {
  const d = current();
  if (!d) return;
  const snapshot = structuredClone(d),
    asGm = gm,
    ids = all ? snapshot.floorOrder.filter(id => asGm || snapshot.floors.find(f => f.id === id)!.revealed) : [floorId];
  const view = { gm: asGm, tactical: all ? false : tactical, overview, grid, roomId, language: getUiLanguage() };
  const manifest: { floorId: string; name: string; file: string }[] = [];
  try {
    for (const id of ids) {
      const markup = renderDungeonV2(snapshot, id, view);
      if (!markup) continue;
      const file = `dungeon-${snapshot.id.slice(0, 36)}-${snapshot.floorOrder.indexOf(id) + 1}-${asGm ? "gm" : "player"}.${format}`;
      const blob =
        format === "svg"
          ? new Blob([await inlineSceneImages(markup)], { type: "image/svg+xml" })
          : await scenePng(markup);
      download(blob, file);
      manifest.push({ floorId: id, name: snapshot.floors.find(f => f.id === id)!.name, file });
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    if (all)
      download(
        new Blob(
          [
            JSON.stringify(
              { kind: "dungeon-floor-exports", audience: asGm ? "gm" : "player", files: manifest },
              null,
              2
            )
          ],
          { type: "application/json" }
        ),
        "dungeon-floors.json"
      );
  } catch (error) {
    status = l("이미지 출력 실패: ", "Image export failed: ") + String(error);
    render();
  }
}
function settingsMarkup(f: DungeonFloor): string {
  const s = f.settings;
  const select = (name: string, values: [string, string][]) =>
    `<select name="${name}">${values.map(([id, label]) => `<option value="${id}" ${String(s[name as keyof typeof s]) === id ? "selected" : ""}>${esc(label)}</option>`).join("")}</select>`;
  return `<form data-floor-settings class="fpb-dv2-form"><label>${l("층 이름", "Floor name")}<input name="floorName" value="${esc(f.name)}" maxlength="200"></label><label>${l("컨셉", "Concept")}<input name="concept" value="${esc(s.concept)}" maxlength="500"></label>
    <label>${l("구조", "Structure")}${select("structure", [
      ["fortress", l("요새", "Fortress")],
      ["cavern", l("동굴", "Cavern")],
      ["maze", l("미로", "Maze")],
      ["tower", l("탑", "Tower")],
      ["crypt", l("묘역", "Crypt")]
    ])}</label>
    <label>${l("환경", "Environment")}${select("environment", [
      ["dry", l("건조", "Dry")],
      ["flooded", l("침수", "Flooded")],
      ["lava", l("용암", "Lava")]
    ])}</label>
    <div class="fpb-dv2-presets">${(["small", "medium", "large"] as const).map((p, i) => `<button type="button" data-floor-size="${p}">${[l("소형", "Small"), l("중형", "Medium"), l("대형", "Large")][i]}</button>`).join("")}</div>
    ${(
      [
        ["width", l("가로 칸", "Columns"), 8, 256, s.width],
        ["height", l("세로 칸", "Rows"), 8, 256, s.height],
        ["roomCount", l("요청 방 수", "Requested rooms"), 1, 200, s.roomCount],
        ["deviceDensity", l("장치 수", "Devices"), 0, 12, s.deviceDensity],
        ["elevationFt", l("고도 (ft)", "Elevation (ft)"), -100000, 100000, f.elevationFt]
      ] as const
    )
      .map(
        ([name, label, min, max, value]) =>
          `<label>${label}<input name="${name}" type="number" min="${min}" max="${max}" value="${value}" step="${name === "elevationFt" ? "any" : "1"}" required></label>`
      )
      .join("")}
    <label>${l("주민 테마", "Inhabitant theme")}${select(
      "themeId",
      ADVENTURE_THEMES.map(t => [t.id, generatedText(t.name, getUiLanguage())])
    )}</label>
    <label>${l("대표 몬스터", "Representative monster")}${select(
      "monsterId",
      ADVENTURE_THEME_BY_ID.get(s.themeId)!.monsters.map(id => [
        id,
        generatedText(ADVENTURE_MONSTER_BY_ID.get(id)!.name, getUiLanguage())
      ])
    )}</label>
    <label>${l("난이도", "Difficulty")}${select("difficulty", [
      ["normal", l("일반", "Normal")],
      ["challenging", l("도전", "Challenging")],
      ["hell", l("지옥", "Hell")]
    ])}</label>
    <label>${l("층 메모 (GM)", "Floor notes (GM)")}<textarea name="note" maxlength="10000">${esc(f.note)}</textarea></label>
    <button type="button" data-floor-regenerate>${l("설정·층 지형 재생성 미리보기", "Preview floor regeneration")}</button><button type="button" data-floor-metadata>${l("이름·고도·메모만 적용", "Name / elevation / notes only")}</button>
    <button type="button" data-contents>${l("배치만 재생성", "Regenerate contents")}</button><button type="button" data-defaults>${l("새 층의 기본값으로 저장", "Set defaults for new floors")}</button></form>`;
}
function render(): void {
  if (!dialog) return;
  viewportObserver?.disconnect();
  const d = current(),
    raw = marker()?.interior;
  if (!d) {
    const recovery = recoverDungeonV2(raw);
    dialog.innerHTML = `<header><h2>${l("지원하지 않는/손상된 던전", "Unsupported / damaged dungeon")}</h2><button data-close>×</button></header><p>${l("원본을 변경하지 않았습니다. 원본 JSON을 보관한 뒤 복구하세요.", "Source preserved. Export the original JSON before repair.")}</p><button data-raw>${l("원본 JSON 내보내기", "Export original JSON")}</button>${recovery ? `<button data-recover>${l("유효 층 격리 복구 미리보기", "Preview recovery of valid floors")} (${recovery.d.floors.length})</button>` : ""}`;
    bind("[data-close]", () => dialog.close());
    bind("[data-recover]", () => {
      if (recovery)
        preview(
          recovery.d,
          `${l("손상 층/참조 제외", "Exclude damaged floors / references")}: ${recovery.removed.join(", ")}`,
          false,
          true
        );
    });
    bind("[data-raw]", () =>
      download(
        new Blob([JSON.stringify(raw, null, 2)], { type: "application/json" }),
        `dungeon-original-${markerId}.json`
      )
    );
    return;
  }
  const publicIds = new Set(publicDungeonV2(d).floorOrder),
    ids = d.floorOrder.filter(id => gm || publicIds.has(id));
  if (!ids.includes(floorId)) floorId = ids[0] || "";
  const f = d.floors.find(f => f.id === floorId),
    rooms = f?.rooms.filter(r => gm || r.revealed) || [];
  if (!rooms.some(r => r.id === roomId)) roomId = rooms[0]?.id || "";
  const room = rooms.find(r => r.id === roomId),
    entity = f?.entities.find(e => e.id === entityId);
  const issues = gm ? diagnoseDungeonV2(d) : [],
    old = saved();
  dialog.dataset.tab = dialog.dataset.tab || "map";
  dialog.innerHTML = `<header><h2>${esc(d.name)} <small>Dungeon v2</small></h2><button data-close aria-label="${l("닫기", "Close")}">×</button></header>
    <nav class="fpb-dv2-toolbar"><label><input data-gm type="checkbox" ${gm ? "checked" : ""}>GM</label><button data-view>${tactical ? l("전체도", "Full plan") : l("전투지도", "Battle frame")}</button><button data-perspective>${overview ? l("탑다운으로", "Top down") : l("조감도로", "Bird's-eye")}</button><label><input data-grid type="checkbox" ${grid ? "checked" : ""}>${l("격자", "Grid")}</label><button data-section>${l("층 연결도", "Floor diagram")}</button><details class="fpb-dv2-export"><summary>${l("내보내기", "Export")}</summary><div><button data-export-svg>SVG</button><button data-export-png>PNG ≤3000px</button><button data-export-all>${l("모든 층 PNG", "All floors PNG")}</button><button data-player-json>${l("플레이어 데이터", "Player data")}</button></div></details>${gm ? `<button data-undo ${!undo.some(u => u.markerId === markerId) || pending ? "disabled" : ""}>${l("되돌리기", "Undo")}</button><button data-round ${pending ? "disabled" : ""}>${l("다음 라운드", "Next round")} (${d.progress.round})</button>` : ""}</nav>
    ${gm && pending ? `<section class="fpb-dv2-preview" role="status"><strong>${esc(pending.label)}</strong>${marker()?.interior?.version !== 2 ? `<p>${l("v2 저장 파일은 구버전 앱에서 지원하지 않습니다.", "Older app versions cannot read v2 dungeons.")}</p>` : ""}<p>${old ? `${old.floors.length} → ` : ""}${d.floors.length} ${l("층", "floors")} · ${d.floors.reduce((n, f) => n + f.rooms.length, 0)} ${l("방", "rooms")} · ${d.connections.length} ${l("층간 연결", "connections")}${old ? ` · ${l("변경 층", "Changed floors")}: ${d.floors.filter(f => JSON.stringify(f) !== JSON.stringify(old.floors.find(o => o.id === f.id))).length}` : ""}</p>${pending.warnings.length ? `<p>${esc(pending.warnings.join(" · "))}</p>` : ""}<button data-apply>${pending.warnings.length ? l("경고를 포함해 편집 적용", "Apply with warnings") : l("적용", "Apply")}</button><button data-cancel>${l("취소·원본 유지", "Cancel / keep source")}</button></section>` : ""}
    <p role="status">${gm ? esc(status) : l("플레이어 보기", "Player view")}</p>${issues.length ? `<details class="fpb-dv2-warning"><summary>${l("경로/참조 경고", "Path / reference warnings")} (${issues.length})</summary>${issues.map(e => `<p>${esc(e)}</p>`).join("")}</details>` : ""}
    <nav class="fpb-dv2-mobile-tabs">${["floors", "map", "properties"].map((tab, i) => `<button data-tab="${tab}" aria-pressed="${dialog.dataset.tab === tab}">${[l("층 목록", "Floors"), l("지도", "Map"), l("속성", "Properties")][i]}</button>`).join("")}</nav>

    <div class="fpb-dv2-workspace"><aside class="fpb-dv2-floors">${gm ? `<details class="fpb-dv2-global-tools"><summary>${l("신규 생성·복제", "Create / duplicate")}</summary><fieldset class="fpb-dv2-global" ${pending ? "disabled" : ""}><label>${l("층 수 (신규 생성)", "Floors (new dungeon)")}<input data-count type="number" min="1" max="100" value="3"></label>${[1, 3, 5, 10].map(n => `<button data-count-preset="${n}">${n}</button>`).join("")}<button data-new>${l("새 거점에 신규 던전", "New dungeon at new marker")}</button><label><input data-include-progress type="checkbox">${l("복제 시 진행 포함", "Copy progress")}</label><button data-clone>${l("복제해서 새 던전", "Duplicate to new marker")}</button></fieldset></details>` : ""}<select data-floor-select aria-label="${l("층 선택", "Select floor")}">${ids
      .map(id => {
        const floor = d.floors.find(f => f.id === id)!;
        return `<option value="${esc(id)}" ${id === floorId ? "selected" : ""}>${esc(floor.name)} · ${floor.elevationFt}ft${gm && floor.locked ? " 🔒" : ""}</option>`;
      })
      .join("")}</select><ol>${ids
      .map(id => {
        const floor = d.floors.find(f => f.id === id)!;
        return `<li><button data-floor="${esc(id)}" aria-current="${id === floorId}">${esc(floor.name)}</button>${gm ? `<small>${floor.settings.width}×${floor.settings.height} · ${esc(floor.settings.concept)}</small>` : ""}</li>`;
      })
      .join("")}</ol>
    ${gm && f ? `<fieldset ${pending ? "disabled" : ""}><button data-insert>${l("선택 층 아래 삽입", "Insert below")}</button><button data-branch>${l("분기 층 추가", "Add branch")}</button><button data-up>↑ ${l("순서 위로", "Move up")}</button><button data-down>↓ ${l("순서 아래로", "Move down")}</button><button data-lock>${f.locked ? l("층 잠금 해제", "Unlock floor") : l("층 잠금", "Lock floor")}</button><button data-reveal-floor>${f.revealed ? l("층 비공개", "Hide floor") : l("층 공개", "Reveal floor")}</button><button data-delete-floor>${l("층 삭제 미리보기", "Preview deletion")}</button><button data-all-regenerate>${l("전체 재생성 (잠김 제외)", "Regenerate all unlocked")}</button></fieldset>` : ""}</aside>
    <main class="fpb-dv2-map"><div class="fpb-dv2-zoom"><button data-zoom-out aria-label="${l("축소", "Zoom out")}">−</button><output>${Math.round(zoom * 100)}%</output><button data-zoom-in aria-label="${l("확대", "Zoom in")}">+</button><button data-fit>${l("맞춤", "Fit")}</button></div><div class="fpb-interior-scroll"><div style="width:${zoom * 100}%;min-width:100%">${section ? renderDungeonSection(d, gm) : f ? renderDungeonV2(d, f.id, { gm, roomId, tactical, overview, grid, language: getUiLanguage() }) : l("공개된 층이 없습니다.", "No revealed floors.")}</div></div><div data-battle-sizing></div><small>${l("한 칸 5ft · 층 지형 크기와 전투 출력 프레임은 별개입니다.", "5ft squares. Floor geometry and battle export frame are independent.")}</small></main>
    <aside class="fpb-dv2-properties">${
      gm && f
        ? `<fieldset ${pending ? "disabled" : ""}><details><summary>${l("층 설정", "Floor settings")}</summary>${settingsMarkup(f)}</details><label>${l("방", "Room")}<select data-room-select>${rooms.map((r, i) => `<option value="${esc(r.id)}" ${r.id === roomId ? "selected" : ""}>${i + 1} · ${r.role}</option>`).join("")}</select></label>
      ${room ? `<form data-room-properties><label><input name="roomEdited" type="checkbox" ${room.edited ? "checked" : ""}>${l("수동 편집 보호", "Protect manual edits")}</label><label>${l("GM 방 메모", "GM room notes")}<textarea name="roomNote" maxlength="10000">${esc(room.note)}</textarea></label><label><input name="roomLocked" type="checkbox" ${room.locked ? "checked" : ""}>${l("방 잠금", "Lock room")}</label><label><input name="roomRevealed" type="checkbox" ${room.revealed ? "checked" : ""}>${l("방 공개", "Reveal room")}</label><label><input name="roomSecret" type="checkbox" ${room.secret ? "checked" : ""}>${l("비밀방", "Secret room")}</label><button type="button" data-room-apply>${l("방 속성 적용 미리보기", "Preview room properties")}</button><button type="button" data-room-regenerate>${l("방 내부 지형 재생성", "Regenerate room interior")}</button><button type="button" data-entrance>${l("던전 입구로", "Set entrance")}</button><select data-objective-kind>${["boss", "rescue", "escape", "relic", "ritual"].map(kind => `<option ${d.objective.kind === kind ? "selected" : ""}>${kind}</option>`).join("")}</select><button type="button" data-objective>${l("던전 목표로", "Set objective")}</button></form>` : ""}
      <label>${l("부품·장치 선택", "Select component / device")}<select data-entity-select><option value="">${l("선택하세요", "Select")}</option>${f.entities
        .filter(e => e.roomId === roomId)
        .map(
          (e, i) =>
            `<option value="${esc(e.id)}" ${e.id === entityId ? "selected" : ""}>${i + 1}. ${esc(e.assetId)} · ${esc(e.device ? DUNGEON_DEVICE_BY_ID.get(e.device.templateId)!.name[getUiLanguage()] : e.feature?.kind || l("부품", "Component"))}</option>`
        )
        .join("")}</select></label>${entity ? entityMarkup(d, f, entity.id) : ""}
      <details><summary>${l("32종 개별 에셋 배치", "Place individual assets (32)")}</summary><div class="fpb-dv2-palette">${DUNGEON_ASSETS.map(a => `<button data-palette="${a.id}" title="${esc(a.name)}"><img src="${dungeonAssetUrl(a.id)}" alt="" loading="lazy"><span>${a.id} ${esc(a.name)}</span></button>`).join("")}</div>
      <form data-placement><select name="assetId">${DUNGEON_ASSETS.map(a => `<option value="${a.id}">${a.id} · ${esc(a.name)}</option>`).join("")}</select><label>X<input name="x" type="number" min="1" value="${room?.x || 1}"></label><label>Y<input name="y" type="number" min="1" value="${room?.y || 1}"></label><label>${l("회전", "Rotation")}<select name="rotation"><option>0</option><option>90</option><option>180</option><option>270</option></select></label><button type="button" data-place>${l("배치 미리보기", "Preview placement")}</button><label>${l("기믹으로 전환", "Device template")}<select name="templateId"><option value="">${l("장식", "Prop")}</option>${DUNGEON_DEVICE_TEMPLATES.map(t => `<option value="${t.id}">${esc(t.name[getUiLanguage()])}</option>`).join("")}</select></label></form></details>
      <details><summary>${l("빈 구역 추가", "Add empty region")}</summary><form data-region>${["x", "y", "width", "height"].map(n => `<label>${n}<input name="${n}" type="number" min="1" value="${n === "width" || n === "height" ? 5 : 1}"></label>`).join("")}<button type="button" data-add-region>${l("현재 방에서 연결해 추가", "Add and connect to this room")}</button></form></details>
      <details><summary>${l("층간 연결 편집", "Edit floor connections")}</summary>${connectionMarkup(d, f)}</details><details><summary>${l("운영 기록 (최근 100건)", "Operation log")}</summary>${d.progress.log.map(v => `<p>${esc(v)}</p>`).join("")}</details></fieldset>`
        : room
          ? `<p>${l("방", "Room")} ${rooms.indexOf(room) + 1} · ${room.width * 5}×${room.height * 5} ft</p>`
          : ""
    }</aside></div>`;
  bind("[data-close]", () => dialog.close());
  bind("[data-apply]", apply);
  bind("[data-cancel]", () => {
    pending = undefined;
    if (saved()) render();
    else dialog.close();
  });
  dialog.querySelector<HTMLInputElement>("[data-gm]")!.onchange = e => {
    gm = (e.target as HTMLInputElement).checked;
    entityId = "";
    render();
  };
  bind("[data-view]", () => {
    tactical = !tactical;
    render();
  });
  bind("[data-perspective]", () => {
    overview = !overview;
    render();
  });
  bind("[data-section]", () => {
    section = !section;
    render();
  });
  dialog.querySelector<HTMLInputElement>("[data-grid]")!.onchange = e => {
    grid = (e.target as HTMLInputElement).checked;
    render();
  };
  const sizing = dialog.querySelector<HTMLElement>("[data-battle-sizing]")!;
  sizing.hidden = !tactical;
  if (tactical)
    sizing.append(
      battleMapControls(d.battleMap, next => {
        const draft = structuredClone(d);
        draft.battleMap = next;
        preview(draft, l("전투 프레임 변경", "Battle frame changed"), false, true);
      })
    );
  bind("[data-zoom-in]", () => setDungeonZoom(zoom + 0.5));
  bind("[data-zoom-out]", () => setDungeonZoom(zoom - 0.5));
  bind("[data-fit]", () => setDungeonZoom(1));
  bind("[data-export-svg]", () => {
    void exportFloors("svg");
  });
  bind("[data-export-png]", () => {
    void exportFloors("png");
  });
  bind("[data-export-all]", () => {
    void exportFloors("png", true);
  });
  bind("[data-player-json]", () =>
    download(
      new Blob([JSON.stringify(publicDungeonV2(d), null, 2)], { type: "application/json" }),
      "dungeon-player.json"
    )
  );
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-tab]")) b.onclick = () => setDungeonTab(b.dataset.tab!);
  const selectFloor = (id: string) => {
    floorId = id;
    roomId = "";
    entityId = "";
    zoom = 1;
    render();
  };
  dialog.querySelector<HTMLSelectElement>("[data-floor-select]")!.onchange = e =>
    selectFloor((e.target as HTMLSelectElement).value);
  const roomSelect = dialog.querySelector<HTMLSelectElement>("[data-room-select]");
  if (roomSelect)
    roomSelect.onchange = event => {
      roomId = (event.target as HTMLSelectElement).value;
      entityId = "";
      render();
    };
  const entitySelect = dialog.querySelector<HTMLSelectElement>("[data-entity-select]");
  if (entitySelect)
    entitySelect.onchange = () => {
      entityId = entitySelect.value;
      dialog.dataset.tab = "properties";
      render();
    };
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-floor]")) b.onclick = () => selectFloor(b.dataset.floor!);
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-dv2-room]")) {
    const select = () => {
      roomId = b.dataset.dv2Room!;
      entityId = "";
      dialog.dataset.tab = "properties";
      render();
    };
    b.onclick = select;
    b.onkeydown = e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    };
  }
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-dv2-entity]")) {
    const select = () => {
      entityId = b.dataset.dv2Entity!;
      roomId = f!.entities.find(e => e.id === entityId)!.roomId;
      dialog.dataset.tab = "properties";
      render();
    };
    b.onclick = select;
    b.onkeydown = e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    };
  }
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-dv2-endpoint]"))
    b.onclick = () => {
      const c = d.connections.find(
        c =>
          (c.from.floorId === floorId && c.from.endpointId === b.dataset.dv2Endpoint) ||
          (c.bidirectional && c.to.floorId === floorId && c.to.endpointId === b.dataset.dv2Endpoint)
      );
      if (c) selectFloor(c.from.floorId === floorId ? c.to.floorId : c.from.floorId);
    };
  const mapPane = dialog.querySelector(".fpb-dv2-map");
  if (mapPane) viewportObserver?.observe(mapPane);
  scheduleDungeonViewport();
  if (!gm || !f) return;
  wireEditing(d, f);
}
function entityMarkup(d: DungeonV2, f: DungeonFloor, id: string): string {
  const e = f.entities.find(e => e.id === id)!,
    template = e.device && DUNGEON_DEVICE_BY_ID.get(e.device.templateId);
  const cells = e.device?.effectCells || [];
  const bounds = cells.reduce<{ x: number; y: number; ex: number; ey: number }>(
    (b, p) => ({ x: Math.min(b.x, p.x), y: Math.min(b.y, p.y), ex: Math.max(b.ex, p.x), ey: Math.max(b.ey, p.y) }),
    { x: Infinity, y: Infinity, ex: -Infinity, ey: -Infinity }
  );
  const area = cells.length
    ? [bounds.x, bounds.y, bounds.ex - bounds.x + 1, bounds.ey - bounds.y + 1]
    : [e.x, e.y, e.width, e.height];
  return `<section class="fpb-dv2-entity"><h3>${esc(e.assetId)} ${template ? esc(template.name[getUiLanguage()]) : l("부품", "Component")}</h3>
    ${e.feature ? `<p>${esc(e.feature.kind)}${e.feature.kind === "trap" ? ` · DC ${e.feature.dc} · ${e.feature.damageDice}d6 (GM)` : e.feature.kind === "gimmick" ? ` · DC ${e.feature.dc}` : e.feature.kind === "chest" ? ` · ${e.feature.gold} GP` : ""}${e.feature.kind === "monster" ? ` · ${esc(e.feature.monsterId)} ×${e.feature.count} · HP×${e.feature.hpMultiplier} · ${l("피해", "Damage")}×${e.feature.damageMultiplier}` : ""}</p>` : ""}
    <form data-entity-properties><label><input name="edited" type="checkbox" ${e.edited ? "checked" : ""}>${l("수동 편집 보호", "Protect manual edits")}</label><label><input name="revealed" type="checkbox" ${e.revealed ? "checked" : ""}>${l("플레이어 공개", "Reveal to players")}</label><label><input name="locked" type="checkbox" ${e.locked ? "checked" : ""}>${l("재생성 보호", "Protect on regeneration")}</label><label>X<input name="x" type="number" value="${e.x}"></label><label>Y<input name="y" type="number" value="${e.y}"></label><label>${l("회전", "Rotation")}<select name="rotation">${[0, 90, 180, 270].map(n => `<option ${n === e.rotation ? "selected" : ""}>${n}</option>`).join("")}</select></label>${["D06", "D07", "D11", "D28"].includes(e.assetId) ? `<label><input name="opened" type="checkbox" ${(e.device ? e.device.open : e.opened) ? "checked" : ""}>${l("열림", "Open")}</label>` : ""}${e.assetId === "D11" ? `<label><input name="looted" type="checkbox" ${e.looted ? "checked" : ""}>${l("보상 수령", "Loot collected")}</label>` : ""}<label>${l("획득 열쇠 ID (소모 없음)", "Grants reusable key ID")}<input name="grantsKey" value="${esc(e.grantsKey || "")}" maxlength="200"></label>
    <button type="button" data-collect-key>${l("이 열쇠 획득 처리", "Collect this key")}</button><button type="button" data-entity-apply>${l("부품 편집 미리보기", "Preview component edit")}</button><button type="button" data-remove-entity>${l("부품 삭제 미리보기", "Preview component removal")}</button>
    ${
      e.device
        ? `<p>${esc(e.device.state)} · ${l("통행 차단", "Blocks movement")}: ${e.blocksMovement} · ${l("시야 차단", "Blocks sight")}: ${e.blocksSight}</p><p>${esc(template!.tell)} / ${esc(template!.trigger)}</p><p>${esc(template!.effect)}</p><label>${l("대응/우회", "Counter / bypass")}<textarea name="counter" maxlength="5000">${esc(e.device.counter)}</textarea></label><fieldset><legend>${l("영향 범위 (격자 좌표)", "Effect area (grid coordinates)")}</legend>${(["areaX", "areaY", "areaWidth", "areaHeight"] as const).map((key, i) => `<label>${["X", "Y", l("가로", "Width"), l("세로", "Height")][i]}<input name="${key}" type="number" value="${area[i]}" min="${i < 2 ? 0 : 1}"></label>`).join("")}</fieldset><label>${l("필요 열쇠 ID", "Required key ID")}<input name="key" maxlength="200" value="${esc(e.device.key || "")}"></label>${
            e.device!.templateId === "alarm"
              ? `<label>${l("호출할 기존 경비", "Existing guards to call")}<select name="guards" multiple>${f.entities
                  .filter(g => g.feature?.kind === "monster")
                  .map(
                    g =>
                      `<option value="${esc(g.id)}" ${e.device!.guardIds?.includes(g.id) ? "selected" : ""}>${esc(g.feature?.kind === "monster" ? g.feature.monsterId : g.id)}</option>`
                  )
                  .join(
                    ""
                  )}</select></label><p>${l("도착한 경비", "Arrived guards")}: ${e.device!.arrivedGuardIds?.length || 0}</p>`
              : ""
          }<label>${l("연결 장치 (여러 개 선택)", "Linked devices (multiple)")}<select name="targets" multiple>${d.floors.flatMap(floor => floor.entities.filter(t => t.device && t.id !== id).map(t => `<option value="${esc(floor.id)}|${esc(t.id)}" ${e.device!.targets.some(r => r.floorId === floor.id && r.entityId === t.id) ? "selected" : ""}>${esc(floor.name)} / ${esc(t.assetId)} / ${esc(t.device!.templateId)}</option>`)).join("")}</select></label>${["reveal", "telegraph", "trigger", "disable", "destroy", "reset"].map((a, i) => `<button type="button" data-device-action="${a}">${[l("발견", "Reveal"), l("징후 표시", "Telegraph"), l("발동", "Trigger"), l("해제", "Disable"), l("파괴", "Destroy"), l("초기화", "Reset")][i]}</button>`).join("")}`
        : ""
    }</form></section>`;
}
function connectionMarkup(d: DungeonV2, f: DungeonFloor): string {
  const endpoints = d.floors
    .flatMap(floor =>
      floor.endpoints.map(
        e =>
          `<option value="${esc(floor.id)}|${esc(e.id)}">${esc(floor.name)} / ${esc(e.id.split(":").at(-1)!)}</option>`
      )
    )
    .join("");
  return `<form data-connection><label>${l("출발 접속구", "From endpoint")}<select name="from">${endpoints}</select></label><label>${l("도착 접속구", "To endpoint")}<select name="to">${endpoints}</select></label><label>${l("연결 종류", "Connection type")}<select name="kind">${["stairs", "ladder", "lift", "shaft", "drop", "portal", "swim"].map(k => `<option>${k}</option>`).join("")}</select></label><label><input name="bidirectional" type="checkbox" checked>${l("왕복", "Bidirectional")}</label><label><input name="revealed" type="checkbox" checked>${l("공개", "Revealed")}</label><label>${l("필요 열쇠", "Required key")}<input name="key" maxlength="200"></label><button type="button" data-add-connection>${l("연결 추가 미리보기", "Preview connection")}</button></form>
    ${d.connections
      .filter(c => c.from.floorId === f.id || c.to.floorId === f.id)
      .map(
        c =>
          `<p>${esc(c.kind)} ${c.bidirectional ? "↔" : "→"} ${esc(d.floors.find(f => f.id === (c.from.floorId === f.id ? c.to.floorId : c.from.floorId))?.name || "?")}<button data-remove-connection="${esc(c.id)}">${l("삭제", "Remove")}</button></p>`
      )
      .join("")}`;
}
function wireEditing(d: DungeonV2, f: DungeonFloor): void {
  const mutate = (label: string, fn: (draft: DungeonV2) => void, allowWarnings = true) => {
    const draft = structuredClone(d);
    fn(draft);
    preview(draft, label, false, allowWarnings);
  };
  const floor = (draft: DungeonV2) => draft.floors.find(v => v.id === floorId)!;
  const form = dialog.querySelector<HTMLFormElement>("[data-floor-settings]")!;
  form.onsubmit = e => e.preventDefault();
  EditorDrafts.bind(form, `dungeon:${markerId}:${d.id}:floor:${f.id}`, render, !pending);
  const roomForm = dialog.querySelector<HTMLFormElement>("[data-room-properties]");
  if (roomForm) {
    roomForm.onsubmit = e => e.preventDefault();
    EditorDrafts.bind(roomForm, `dungeon:${markerId}:${d.id}:room:${roomId}`, render, !pending);
  }
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-floor-size]"))
    b.onclick = () => {
      const size = battlePreset(b.dataset.floorSize as "small" | "medium" | "large");
      (form.elements.namedItem("width") as HTMLInputElement).value = String(size.columns);
      (form.elements.namedItem("height") as HTMLInputElement).value = String(size.rows);
      form.dispatchEvent(new Event("input", { bubbles: true }));
    };
  form.querySelector<HTMLSelectElement>('[name="themeId"]')!.onchange = e => {
    const theme = ADVENTURE_THEME_BY_ID.get((e.target as HTMLSelectElement).value)!;
    form.querySelector<HTMLSelectElement>('[name="monsterId"]')!.innerHTML = theme.monsters
      .map(
        id =>
          `<option value="${id}">${esc(generatedText(ADVENTURE_MONSTER_BY_ID.get(id)!.name, getUiLanguage()))}</option>`
      )
      .join("");
  };
  bind("[data-floor-regenerate]", () => {
    if (!form.reportValidity()) return;
    const next = regenerateDungeonFloor(d, floorId, settings());
    const target = floor(next);
    target.name = (form.elements.namedItem("floorName") as HTMLInputElement).value;
    target.elevationFt = Number((form.elements.namedItem("elevationFt") as HTMLInputElement).value);
    target.note = (form.elements.namedItem("note") as HTMLTextAreaElement).value;
    preview(
      next,
      l(
        "선택 층 지형 재생성 (접속구·수동 항목 보존)",
        "Regenerate selected floor; preserve landings and manual entries"
      )
    );
  });
  bind("[data-floor-metadata]", () =>
    mutate(l("층 메타데이터 변경", "Floor metadata"), next => {
      const target = floor(next);
      target.name = (form.elements.namedItem("floorName") as HTMLInputElement).value;
      target.elevationFt = Number((form.elements.namedItem("elevationFt") as HTMLInputElement).value);
      target.note = (form.elements.namedItem("note") as HTMLTextAreaElement).value;
    })
  );
  bind("[data-defaults]", () =>
    mutate(l("새 층 기본값 변경 (기존 층 유지)", "New-floor defaults; existing floors preserved"), next => {
      next.defaults = settings();
      next.name = next.defaults.concept;
    })
  );
  bind("[data-contents]", () =>
    preview(regenerateDungeonFloor(d, floorId, f.settings, true), l("배치만 재생성", "Regenerate contents"))
  );
  bind("[data-insert]", () =>
    preview(
      insertDungeonFloor(d, floorId, uid(), d.defaults),
      l("새 층 삽입·일반 계단 재연결", "Insert floor and reconnect stairs")
    )
  );
  bind("[data-branch]", () => {
    const next = insertDungeonFloor(d, d.floorOrder.at(-1)!, uid(), d.defaults),
      added = next.floors.at(-1)!;
    next.connections = next.connections.filter(c => c.from.floorId !== added.id && c.to.floorId !== added.id);
    next.connections.push(makeDungeonConnection(next.floors.find(v => v.id === floorId)!, added, uid()));
    preview(next, l("현재 층에서 분기 층 추가", "Branch from current floor"));
  });
  for (const [selector, delta] of [
    ["[data-up]", -1],
    ["[data-down]", 1]
  ] as const)
    bind(selector, () =>
      mutate(l("층 순서 변경 (고도·연결 유지)", "Reorder floors; elevations and links preserved"), next => {
        const at = next.floorOrder.indexOf(floorId),
          to = at + delta;
        if (to < 0 || to >= next.floorOrder.length) return;
        [next.floorOrder[at], next.floorOrder[to]] = [next.floorOrder[to], next.floorOrder[at]];
      })
    );
  bind("[data-lock]", () =>
    mutate(l("층 잠금 변경", "Floor lock"), next => {
      floor(next).locked = !floor(next).locked;
    })
  );
  bind("[data-reveal-floor]", () =>
    mutate(l("층 공개 변경", "Floor visibility"), next => {
      floor(next).revealed = !floor(next).revealed;
    })
  );
  bind("[data-delete-floor]", () => {
    const next = deleteDungeonFloor(d, floorId),
      index = d.floorOrder.indexOf(floorId),
      prev = next.floors.find(v => v.id === d.floorOrder[index - 1]),
      after = next.floors.find(v => v.id === d.floorOrder[index + 1]);
    if (prev && after) next.connections.push(makeDungeonConnection(prev, after, uid()));
    preview(next, l("선택 층 삭제·일반 계단 재연결", "Delete selected floor and reconnect stairs"));
  });
  bind("[data-all-regenerate]", () => {
    let next = structuredClone(d);
    for (const target of d.floors.filter(f => !f.locked))
      next = regenerateDungeonFloor(next, target.id, target.settings);
    preview(next, l("전체 재생성 (잠긴 층 유지)", "Regenerate unlocked floors"));
  });
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-count-preset]"))
    b.onclick = () => {
      dialog.querySelector<HTMLInputElement>("[data-count]")!.value = b.dataset.countPreset!;
    };
  bind("[data-new]", () =>
    preview(
      createDungeonV2(
        `${d.seed.slice(0, 380)}:${uid()}`,
        uid(),
        Number(dialog.querySelector<HTMLInputElement>("[data-count]")!.value),
        d.defaults
      ),
      l("새 거점에 신규 던전 (원본 유지)", "New marker and dungeon; source kept"),
      true
    )
  );
  bind("[data-clone]", () =>
    preview(
      duplicateDungeon(
        d,
        uid(),
        `${d.seed.slice(0, 380)}:${uid()}`,
        dialog.querySelector<HTMLInputElement>("[data-include-progress]")!.checked
      ),
      l("새 거점에 복제 (원본 유지)", "Duplicate to a new marker; source kept"),
      true,
      true
    )
  );
  bind("[data-undo]", () => {
    const index = undo.findLastIndex(u => u.markerId === markerId);
    if (index < 0) return;
    marker()!.interior = undo[index].d;
    undo.splice(index, 1);
    pending = undefined;
    changed();
    render();
  });
  bind("[data-round]", () => preview(advanceDungeonRound(d), l("라운드 진행", "Advance round"), false, true));
  const room = f.rooms.find(r => r.id === roomId)!;
  bind("[data-room-apply]", () =>
    mutate(l("방 속성 변경", "Room properties"), next => {
      const values = new FormData(roomForm!),
        target = floor(next).rooms.find(r => r.id === roomId)!;
      target.note = String(values.get("roomNote"));
      target.locked = values.get("roomLocked") === "on";
      target.revealed = values.get("roomRevealed") === "on";
      target.secret = values.get("roomSecret") === "on";
      target.edited = values.get("roomEdited") === "on" || target.note !== room.note || target.secret !== room.secret;
    })
  );
  bind("[data-room-regenerate]", () =>
    preview(
      regenerateDungeonRoom(d, floorId, roomId),
      l("방 경계·출입구·배치 보존 재생성", "Regenerate room; preserve boundary, doors and entities")
    )
  );
  bind("[data-entrance]", () =>
    mutate(l("입구 방 변경", "Entrance room"), next => {
      next.entrance = { floorId, roomId };
    })
  );
  bind("[data-objective]", () =>
    mutate(l("목표 방 변경", "Objective room"), next => {
      next.objective = {
        floorId,
        roomId,
        kind: dialog.querySelector<HTMLSelectElement>("[data-objective-kind]")!.value as DungeonV2["objective"]["kind"]
      };
    })
  );
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-palette]"))
    b.onclick = () => {
      dialog.querySelector<HTMLSelectElement>('[data-placement] [name="assetId"]')!.value = b.dataset.palette!;
    };
  bind("[data-place]", () => {
    const values = new FormData(dialog.querySelector<HTMLFormElement>("[data-placement]")!),
      id = uid();
    const next = addDungeonEntity(
      d,
      floorId,
      roomId,
      String(values.get("assetId")) as DungeonAssetId,
      Number(values.get("x")),
      Number(values.get("y")),
      Number(values.get("rotation")) as 0 | 90 | 180 | 270,
      id
    );
    const template = DUNGEON_DEVICE_BY_ID.get(String(values.get("templateId")) as DeviceTemplateId),
      entity = floor(next).entities.find(e => e.id === id)!;
    if (template) {
      entity.kind = "device";
      entity.device = {
        templateId: template.id,
        state: "armed",
        open: false,
        powered: true,
        cooldownUntil: 0,
        lastEventId: "",
        targets: [],
        counter: template.counter,
        effectCells: []
      };
      entity.revealed = false;
      syncDungeonDevice(entity);
    }
    preview(next, l("개별 에셋 배치 (전체 점유 검사)", "Place component; validate complete footprint"), false, true);
  });
  bind("[data-add-region]", () => {
    const values = new FormData(dialog.querySelector<HTMLFormElement>("[data-region]")!);
    preview(
      addDungeonRegion(
        d,
        floorId,
        roomId,
        Number(values.get("x")),
        Number(values.get("y")),
        Number(values.get("width")),
        Number(values.get("height")),
        uid()
      ),
      l("빈 구역 추가·선택 방 연결", "Add region and connect to selected room")
    );
  });
  bind("[data-collect-key]", () =>
    mutate(l("열쇠 획득 (미소모)", "Collect reusable key"), next => {
      const e = floor(next).entities.find(e => e.id === entityId)!;
      if (e.grantsKey && !next.progress.keys.includes(e.grantsKey)) next.progress.keys.push(e.grantsKey);
    })
  );
  bind("[data-entity-apply]", () =>
    mutate(l("부품 속성 편집", "Component properties"), next => {
      const e = floor(next).entities.find(e => e.id === entityId)!,
        values = new FormData(dialog.querySelector<HTMLFormElement>("[data-entity-properties]")!);
      if (e.locked && values.get("locked") === "on")
        throw new Error(l("먼저 부품 보호를 해제하세요.", "Unlock component first."));
      const rotation = Number(values.get("rotation")) as 0 | 90 | 180 | 270;
      if (rotation % 180 !== e.rotation % 180) [e.width, e.height] = [e.height, e.width];
      e.rotation = rotation;
      e.x = Number(values.get("x"));
      e.y = Number(values.get("y"));
      e.revealed = values.get("revealed") === "on";
      e.locked = values.get("locked") === "on";
      const previousEntity = f.entities.find(v => v.id === e.id)!;
      if (["D06", "D07", "D11", "D28"].includes(e.assetId)) {
        const opened = values.get("opened") === "on";
        if (e.device) {
          e.device.open = opened;
          syncDungeonDevice(e);
        } else {
          e.opened = opened;
          if (["D06", "D07"].includes(e.assetId)) {
            e.blocksMovement = !opened;
            e.blocksSight = e.assetId === "D06" && !opened;
          }
        }
      }
      if (e.assetId === "D11") e.looted = values.get("looted") === "on";
      e.edited =
        values.get("edited") === "on" ||
        e.x !== previousEntity.x ||
        e.y !== previousEntity.y ||
        e.rotation !== previousEntity.rotation;
      const key = String(values.get("grantsKey") || "");
      if (key) e.grantsKey = key;
      else delete e.grantsKey;
      if (e.device) {
        e.device.counter = String(values.get("counter") || "");
        if (e.device.templateId === "alarm") {
          e.device.guardIds = values.getAll("guards").map(String);
          e.device.arrivedGuardIds = e.device.arrivedGuardIds?.filter(id => e.device!.guardIds!.includes(id));
        }
        const ax = Number(values.get("areaX")),
          ay = Number(values.get("areaY")),
          aw = Number(values.get("areaWidth")),
          ah = Number(values.get("areaHeight"));
        if (
          ![ax, ay, aw, ah].every(Number.isSafeInteger) ||
          ax < 0 ||
          ay < 0 ||
          aw < 1 ||
          ah < 1 ||
          ax + aw > f.settings.width ||
          ay + ah > f.settings.height
        )
          throw new Error(
            l("영향 범위는 층 안의 정수 칸으로 입력하세요.", "Effect area must use whole squares within the floor.")
          );
        e.device.effectCells = Array.from({ length: aw * ah }, (_, i) => ({
          x: ax + (i % aw),
          y: ay + Math.floor(i / aw)
        }));
        const key = String(values.get("key") || "");
        if (key) e.device.key = key;
        else delete e.device.key;
        e.device.targets = values.getAll("targets").map(v => {
          const [floorId, entityId] = String(v).split("|");
          return { floorId, entityId };
        });
      }
      if (
        JSON.stringify(e.device) !== JSON.stringify(previousEntity.device) ||
        e.grantsKey !== previousEntity.grantsKey ||
        e.opened !== previousEntity.opened ||
        e.looted !== previousEntity.looted
      )
        e.edited = true;
    })
  );
  bind("[data-remove-entity]", () =>
    mutate(l("부품 삭제", "Remove component"), next => {
      const e = floor(next).entities.find(e => e.id === entityId)!;
      if (e.locked) throw new Error(l("부품이 잠겨 있습니다.", "Component locked."));
      if (next.floors.some(f => f.entities.some(e => e.device?.targets.some(t => t.entityId === entityId))))
        throw new Error(l("연동 참조를 먼저 제거하세요.", "Remove linked references first."));
      floor(next).entities = floor(next).entities.filter(e => e.id !== entityId);
    })
  );
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-device-action]"))
    bind(`[data-device-action="${b.dataset.deviceAction}"]`, () =>
      preview(
        operateDungeonDevice(
          d,
          floorId,
          entityId,
          b.dataset.deviceAction as Parameters<typeof operateDungeonDevice>[3],
          uid()
        ),
        l("GM 기믹 상태 조작", "GM device operation"),
        false,
        true
      )
    );
  bind("[data-add-connection]", () =>
    mutate(l("층간 연결 추가", "Add floor connection"), next => {
      const values = new FormData(dialog.querySelector<HTMLFormElement>("[data-connection]")!),
        [fromFloor, fromEndpoint] = String(values.get("from")).split("|"),
        [toFloor, toEndpoint] = String(values.get("to")).split("|");
      if (fromFloor === toFloor && fromEndpoint === toEndpoint)
        throw new Error(l("서로 다른 접속구를 선택하세요.", "Choose different endpoints."));
      next.connections.push({
        id: uid(),
        from: { floorId: fromFloor, endpointId: fromEndpoint },
        to: { floorId: toFloor, endpointId: toEndpoint },
        kind: String(values.get("kind")) as DungeonConnection["kind"],
        bidirectional: values.get("bidirectional") === "on",
        revealed: values.get("revealed") === "on",
        ...(values.get("key") ? { requiredKey: String(values.get("key")) } : {})
      });
    })
  );
  for (const b of dialog.querySelectorAll<HTMLElement>("[data-remove-connection]"))
    bindElement(b, () =>
      mutate(l("층간 연결 삭제", "Remove connection"), next => {
        next.connections = next.connections.filter(c => c.id !== b.dataset.removeConnection);
      })
    );
  if (!room) status = l("방을 선택하세요.", "Select a room.");
}
export function openDungeonV2(markerIndex: number): boolean {
  const source = window.pack?.markers.find(m => m.i === markerIndex);
  if (!source) return false;
  initDungeonV2();
  markerId = markerIndex;
  pending = undefined;
  floorId = "";
  roomId = "";
  entityId = "";
  status = "";
  gm = true;
  section = false;
  zoom = 1;
  if (isDungeonInteriorV1(source.interior)) {
    const d = migrateDungeonV1(
      source.interior,
      uid(),
      notes.find(n => n.id === `marker${markerIndex}`)?.name || l("던전", "Dungeon")
    );
    pending = {
      d,
      label: l(
        "v1 → v2 보존 변환 (지형·방·보스 수치 유지)",
        "v1 → v2 conversion; preserve geometry, rooms and boss stats"
      ),
      newMarker: false,
      warnings: diagnoseDungeonV2(d)
    };
  } else if (!source.interior) {
    const settings = {
      ...DEFAULT_DUNGEON_SETTINGS,
      ...(source.space === "underwater" ? { environment: "flooded" as const } : {}),
      ...(isAdventureSite(source.adventure)
        ? { themeId: source.adventure.themeId, monsterId: source.adventure.monsterId }
        : {})
    };
    const d = createDungeonV2(`${String(seed).slice(0, 400)}:marker:${markerIndex}`, uid(), 3, settings);
    pending = {
      d,
      label: l("3층 신규 던전 미리보기", "New three-floor dungeon preview"),
      newMarker: false,
      warnings: diagnoseDungeonV2(d)
    };
  }
  render();
  if (!dialog.open) dialog.showModal();
  scheduleDungeonViewport();
  return true;
}
export function initDungeonV2(): void {
  if (document.getElementById("fpb-dungeon-v2")) return;
  dialog = document.createElement("dialog");
  dialog.id = "fpb-dungeon-v2";
  dialog.dataset.i18nSkip = "";
  dialog.setAttribute("aria-label", "Dungeon v2");
  document.body.append(dialog);
  if (typeof ResizeObserver !== "undefined") viewportObserver = new ResizeObserver(scheduleDungeonViewport);
  window.addEventListener("resize", scheduleDungeonViewport);
  window.visualViewport?.addEventListener("resize", scheduleDungeonViewport);
  dialog.addEventListener("focusin", event => {
    const target = event.target as Element;
    if (target.closest(".fpb-dv2-properties")) setDungeonTab("properties");
    else if (target.closest(".fpb-dv2-floors")) setDungeonTab("floors");
    else if (target.closest(".fpb-dv2-map")) setDungeonTab("map");
  });
  dialog.addEventListener("close", () => {
    viewportObserver?.disconnect();
    if (viewportFrame) cancelAnimationFrame(viewportFrame);
    viewportFrame = 0;
    viewportSize = undefined;
    pending = undefined;
    dialog.replaceChildren();
  });
  for (const event of ["map:loaded", "map:generated"])
    window.addEventListener(event, () => {
      dialog.close();
      pending = undefined;
      undo = [];
    });
  window.addEventListener("ui:language-changed", () => {
    if (dialog.open) render();
  });
}
