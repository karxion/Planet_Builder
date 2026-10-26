import { inlineSceneImages, scenePng } from "@/renderers/scene-assets";
import { battleMapControls } from "./battle-map-settings";
import { battlePreset, battleTravel } from "@/data/battle-map";
import {
  ADVENTURE_MONSTER_BY_ID,
  ADVENTURE_THEME_BY_ID,
  ADVENTURE_THEMES,
  isAdventureSite
} from "@/data/adventure-sites";
import { DUNGEON_DIFFICULTIES } from "@/data/dungeon-content";
import { isDungeonLocation } from "@/data/dungeon-locations";
import { isDungeonInterior } from "@/data/dungeon-validation";
import { generateDungeonInterior } from "@/generators/dungeon-interior";
import { renderDungeonMap, renderDungeonRoom, roomName as renderRoomName } from "@/renderers/dungeon-interior";
import { escapeAttribute as esc, rpgIconPreview } from "@/renderers/rpg-asset-renderer";
import { getUiLanguage } from "@/services/ui-language";
import type { DungeonDifficulty, DungeonInterior, DungeonRoom } from "@/types/dungeon-interior";

declare global {
  var openDungeonInterior: (markerId: number) => boolean;
}
const text = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);
let dialog: HTMLDialogElement;
let activeId: number | undefined;
let selectedRoom = 0;
let gm = true;
let tactical = false;
let zoom = 1;
let status = "";
const activeMarker = () => window.pack?.markers?.find(marker => marker.i === activeId);
const roomName = (dungeon: DungeonInterior, room: DungeonRoom, language: "ko" | "en") =>
  renderRoomName(dungeon, room, language, gm);

function render(): void {
  const oldScroll = dialog.querySelector<HTMLElement>(".fpb-interior-scroll");
  const scroll = { x: oldScroll?.scrollLeft || 0, y: oldScroll?.scrollTop || 0 };
  const activeControl = document.activeElement;
  const roomFocus = activeControl?.getAttribute("data-room");
  const focusSelector =
    roomFocus && /^\d+$/.test(roomFocus)
      ? `[data-room="${roomFocus}"]`
      : [
          "[data-difficulty]",
          "[data-gm]",
          "[data-room-select]",
          "[data-zoom-in]",
          "[data-zoom-out]",
          "[data-fit]"
        ].find(selector => activeControl?.matches(selector));
  const marker = activeMarker();
  if (!marker) {
    dialog.close();
    return;
  }
  const dungeon = isDungeonInterior(marker.interior) ? marker.interior : undefined;
  const battleSettings = dungeon?.battleMap || battlePreset("small");
  const renderBattle = tactical ? { ...battleSettings, focusRoomId: selectedRoom } : undefined;
  const travel = battleTravel(battleSettings);
  const visibleRooms = dungeon?.rooms.filter(room => gm || !room.secret) || [];
  dialog.setAttribute("aria-label", text("던전 내부", "Dungeon interior"));
  const site = isAdventureSite(marker.adventure) ? marker.adventure : undefined;
  const themeId = dungeon?.themeId || site?.themeId || "goblin-stockade";
  const theme = ADVENTURE_THEME_BY_ID.get(themeId)!;
  const name = notes.find(note => note.id === `marker${marker.i}`)?.name || text("던전", "Dungeon");
  dialog.innerHTML = `<header>${rpgIconPreview(theme.icon)}<div><small>${text("던전 내부", "Dungeon interior")}</small><h2>${esc(name)}</h2></div><button type="button" data-close class="fpb-icon-button icon-cancel" title="${text("닫기", "Close")}" aria-label="${text("닫기", "Close")}"></button></header>
    <div class="fpb-interior-controls"><button type="button" data-plan-view aria-pressed="${!tactical}">${text("전체도", "Full plan")}</button><button type="button" data-battle-view aria-pressed="${tactical}">${text("방 전투지도", "Room battle map")}</button><label>${text("난이도", "Difficulty")}<select data-difficulty>${Object.entries(
      DUNGEON_DIFFICULTIES
    )
      .map(
        ([id, label]) =>
          `<option value="${id}" ${dungeon?.difficulty === id ? "selected" : ""}>${esc(label[getUiLanguage()])}</option>`
      )
      .join("")}</select></label>${
      !site
        ? `<label>${text("테마", "Theme")}<select data-theme>${ADVENTURE_THEMES.map(option => `<option value="${option.id}" ${theme.id === option.id ? "selected" : ""}>${esc(option.name)}</option>`).join("")}</select></label><label>${text("대표 몬스터", "Representative monster")}<select data-monster>${theme.monsters
            .map(id => {
              const monster = ADVENTURE_MONSTER_BY_ID.get(id)!;
              return `<option value="${id}" ${dungeon?.monsterId === id ? "selected" : ""}>${esc(monster.name)} · CR ${monster.cr}</option>`;
            })
            .join("")}</select></label>`
        : ""
    }
    <label class="fpb-interior-toggle"><input data-gm type="checkbox" ${gm ? "checked" : ""}>${text("GM 보기", "GM view")}</label><button data-regenerate type="button" class="icon-cw" title="${text("내부 지도 재생성", "Regenerate floor plan")}" aria-label="${text("내부 지도 재생성", "Regenerate floor plan")}"></button><button data-export type="button" class="icon-download" title="${text("현재 보기 SVG 출력", "Export current view as SVG")}" aria-label="${text("현재 보기 SVG 출력", "Export current view as SVG")}" ${dungeon ? "" : "disabled"}></button><button data-export-png type="button" aria-label="PNG" ${dungeon ? "" : "disabled"}>PNG</button><button data-edit-marker type="button" class="icon-pencil" title="${text("세계 지도 표식 편집", "Edit world marker")}" aria-label="${text("세계 지도 표식 편집", "Edit world marker")}"></button></div>
    <div data-battle-sizing></div>
    <div class="fpb-interior-summary">${dungeon ? `<span>${tactical ? `${battleSettings.columns} × ${battleSettings.rows} · ${text("일반 이동", "Walk")} ${travel.walk} / ${text("전력 질주", "Dash")} ${travel.dash} ${text("턴 (30ft, 양 끝 칸 중심 기준)", "turns (30ft speed, end-square centers)")}` : ""}</span><span>${text("원본 CR", "Source CR")} ${dungeon.baseCr} → ${text("목표 CR", "Target CR")} ${dungeon.targetCr}</span><span>${visibleRooms.length} ${text("방", "rooms")} · ${text("한 칸", "Square")} 5 ft</span>${gm ? `<span>${text("함정", "Traps")} ${dungeon.features.filter(feature => feature.kind === "trap").length} · ${text("비밀방", "Secret rooms")} ${dungeon.rooms.filter(room => room.secret).length}</span>` : `<span>${text("플레이어 보기", "Player view")}</span>`}<span>${text("창작 조우 · GM 조정 필요", "Homebrew encounter · GM tuning required")}${dungeon.baseCr === 30 && dungeon.difficulty !== "normal" ? text(" · CR 상한 30", " · CR cap 30") : ""}</span>` : ""}</div>
    <p class="fpb-interior-status" role="status">${esc(status)}</p>
    ${
      dungeon
        ? `<div class="fpb-interior-workspace"><section class="fpb-interior-canvas"><div class="fpb-interior-zoom"><button data-zoom-out type="button" class="icon-minus" title="${text("축소", "Zoom out")}" aria-label="${text("축소", "Zoom out")}"></button><output>${Math.round(zoom * 100)}%</output><button data-zoom-in type="button" class="icon-plus" title="${text("확대", "Zoom in")}" aria-label="${text("확대", "Zoom in")}"></button><button data-fit type="button" class="icon-resize-full" title="${text("화면 맞춤", "Fit")}" aria-label="${text("화면 맞춤", "Fit")}"></button></div><div class="fpb-interior-scroll"><div style="width:${zoom * 100}%;min-width:100%">${renderDungeonMap(dungeon, getUiLanguage(), gm, selectedRoom, renderBattle)}</div></div><div class="fpb-interior-legend">${gm ? text("왕관: 보스 · 붉은 표식: 몬스터 · 삼각형: 함정 · 상자: 보상 · 수정: 기믹 · S: 비밀방", "Crown: boss · Red: monsters · Triangle: trap · Chest: reward · Crystal: gimmick · S: secret") : text("화살표: 입구", "Arrow: entrance")}</div></section><aside><label>${text("방", "Room")}<select data-room-select>${dungeon.rooms
            .filter(room => gm || !room.secret)
            .map(
              room =>
                `<option value="${room.id}" ${selectedRoom === room.id ? "selected" : ""}>${esc(roomName(dungeon, room, getUiLanguage()))}</option>`
            )
            .join(
              ""
            )}</select></label><div class="fpb-interior-detail">${renderDungeonRoom(dungeon, selectedRoom, getUiLanguage(), gm)}</div></aside></div>`
        : `<div class="fpb-interior-empty">${text("내부 지도를 생성하지 못했습니다. 재생성으로 다시 시도할 수 있습니다.", "The floor plan could not be generated. Retry with regenerate.")}</div>`
    }`;
  const sizing = dialog.querySelector<HTMLElement>("[data-battle-sizing]")!;
  sizing.hidden = !tactical;
  sizing.append(
    battleMapControls(battleSettings, next => {
      if (!dungeon) return;
      dungeon.battleMap = { ...next };
      marker.lock = true;
      window.dispatchEvent(new Event("project:changed"));
      render();
    })
  );
  dialog.querySelector<HTMLButtonElement>("[data-plan-view]")!.onclick = () => {
    tactical = false;
    render();
  };
  dialog.querySelector<HTMLButtonElement>("[data-battle-view]")!.onclick = () => {
    tactical = true;
    render();
  };
  dialog.querySelector<HTMLButtonElement>("[data-close]")!.onclick = () => dialog.close();
  dialog.querySelector<HTMLButtonElement>("[data-regenerate]")!.onclick = () => {
    if (
      dungeon &&
      !confirm(text("내부 지도와 배치를 새로 생성할까요?", "Regenerate this floor plan and its contents?"))
    )
      return;
    const generation = dungeon ? dungeon.generation + 1 : 0;
    regenerate(generation);
  };
  dialog.querySelector<HTMLSelectElement>("[data-difficulty]")!.onchange = () => regenerate(dungeon?.generation || 0);
  dialog.querySelector<HTMLSelectElement>("[data-theme]")?.addEventListener("change", event => {
    const next = ADVENTURE_THEME_BY_ID.get((event.target as HTMLSelectElement).value)!;
    commit(next.id, next.monsters[0], dungeon?.difficulty || "normal", dungeon?.generation || 0);
  });
  dialog
    .querySelector<HTMLSelectElement>("[data-monster]")
    ?.addEventListener("change", () => regenerate(dungeon?.generation || 0));
  dialog.querySelector<HTMLInputElement>("[data-gm]")!.onchange = event => {
    gm = (event.target as HTMLInputElement).checked;
    if (!gm && dungeon?.rooms.find(room => room.id === selectedRoom)?.secret) selectedRoom = dungeon.entranceRoomId;
    render();
  };
  dialog.querySelector<HTMLButtonElement>("[data-edit-marker]")!.onclick = () => {
    dialog.close();
    editMarker(marker.i);
  };
  dialog.querySelector<HTMLButtonElement>("[data-export]")!.onclick = async event => {
    if (!dungeon) return;
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true;
    const exportedGm = gm;
    try {
      const markup = await inlineSceneImages(renderDungeonMap(dungeon, getUiLanguage(), exportedGm, -1, renderBattle));
      const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `dungeon-${marker.i}-${exportedGm ? "gm" : "player"}.svg`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      status = text("이미지 내보내기 실패", "Image export failed");
      render();
    } finally {
      button.disabled = false;
    }
  };
  dialog.querySelector<HTMLButtonElement>("[data-export-png]")!.onclick = async event => {
    if (!dungeon) return;
    const button = event.currentTarget as HTMLButtonElement;
    const exportedGm = gm;
    button.disabled = true;
    try {
      const markup = renderDungeonMap(dungeon, getUiLanguage(), exportedGm, -1, renderBattle);
      const url = URL.createObjectURL(await scenePng(markup));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `dungeon-${marker.i}-${exportedGm ? "gm" : "player"}.png`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      status = text("이미지 내보내기 실패", "Image export failed");
      render();
    } finally {
      button.disabled = false;
    }
  };
  const selectRoom = (id: number) => {
    selectedRoom = id;
    render();
  };
  dialog
    .querySelector<HTMLSelectElement>("[data-room-select]")
    ?.addEventListener("change", event => selectRoom(Number((event.target as HTMLSelectElement).value)));
  dialog.querySelectorAll<SVGElement>("[data-room]").forEach(element => {
    element.onclick = () => selectRoom(Number(element.dataset.room));
    element.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRoom(Number(element.dataset.room));
      }
    };
  });
  for (const [selector, next] of [
    ["[data-zoom-out]", Math.max(1, zoom - 0.5)],
    ["[data-zoom-in]", Math.min(4, zoom + 0.5)],
    ["[data-fit]", 1]
  ] as const)
    dialog.querySelector<HTMLButtonElement>(selector)?.addEventListener("click", () => {
      zoom = next;
      render();
    });
  const zoomOut = dialog.querySelector<HTMLButtonElement>("[data-zoom-out]");
  const zoomIn = dialog.querySelector<HTMLButtonElement>("[data-zoom-in]");
  if (zoomOut) zoomOut.disabled = zoom <= 1;
  if (zoomIn) zoomIn.disabled = zoom >= 4;
  const newScroll = dialog.querySelector<HTMLElement>(".fpb-interior-scroll");
  if (newScroll) {
    newScroll.scrollLeft = scroll.x;
    newScroll.scrollTop = scroll.y;
  }
  if (focusSelector) dialog.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
}
function commit(themeId: string, monsterId: string, difficulty: DungeonDifficulty, generation: number): void {
  const marker = activeMarker();
  if (!marker) return;
  try {
    const interiorSeed = isDungeonInterior(marker.interior)
      ? marker.interior.seed
      : `${String(seed).slice(0, 400)}:marker:${marker.i}:cell:${marker.cell}`;
    const draft = generateDungeonInterior(interiorSeed, themeId, monsterId, difficulty, generation);
    if (isDungeonInterior(marker.interior) && marker.interior.battleMap)
      draft.battleMap = { ...marker.interior.battleMap };
    if (!isDungeonInterior(draft)) throw new Error("Invalid generated dungeon");
    marker.interior = draft;
    marker.lock = true;
    selectedRoom = draft.entranceRoomId;
    status = "";
    window.dispatchEvent(new Event("project:changed"));
  } catch {
    status = text(
      "생성에 실패했습니다. 기존 내부 지도는 보존됩니다.",
      "Generation failed. The existing floor plan was preserved."
    );
  }
  render();
}
function regenerate(generation: number): void {
  const marker = activeMarker();
  if (!marker) return;
  const site = isAdventureSite(marker.adventure) ? marker.adventure : undefined;
  const themeId = site?.themeId || dialog.querySelector<HTMLSelectElement>("[data-theme]")!.value;
  const monsterId = site?.monsterId || dialog.querySelector<HTMLSelectElement>("[data-monster]")!.value;
  const difficulty = dialog.querySelector<HTMLSelectElement>("[data-difficulty]")!.value as DungeonDifficulty;
  commit(themeId, monsterId, difficulty, generation);
}
export function openDungeonInteriorMap(markerId: number): boolean {
  const marker = window.pack?.markers?.find(marker => marker.i === markerId);
  if (!marker || !isDungeonLocation(marker)) return false;
  initDungeonInterior();
  activeId = markerId;
  gm = true;
  tactical = false;
  zoom = 1;
  status = "";
  if (!isDungeonInterior(marker.interior)) {
    const site = isAdventureSite(marker.adventure) ? marker.adventure : undefined;
    commit(site?.themeId || "goblin-stockade", site?.monsterId || "goblin-2014", "normal", 0);
  } else {
    selectedRoom = marker.interior.entranceRoomId;
    render();
  }
  if (!dialog.open) dialog.showModal();
  return true;
}
export function initDungeonInterior(): void {
  if (document.getElementById("fpb-dungeon-interior")) return;
  dialog = document.createElement("dialog");
  dialog.id = "fpb-dungeon-interior";
  dialog.setAttribute("aria-label", text("던전 내부", "Dungeon interior"));
  document.body.append(dialog);
  window.openDungeonInterior = openDungeonInteriorMap;
  dialog.addEventListener("close", () => {
    if (!dialog.open) {
      dialog.replaceChildren();
      activeId = undefined;
    }
  });
  window.addEventListener("ui:language-changed", () => {
    if (dialog.open) render();
  });
  for (const event of ["map:loaded", "map:generated"])
    window.addEventListener(event, () => {
      dialog.close();
      activeId = undefined;
    });
}
