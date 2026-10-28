import {
  ADVENTURE_MONSTER_BY_ID,
  ADVENTURE_THEME_BY_ID,
  adventureMonsterUrl,
  CREATURE_TYPES,
  isAdventureSite
} from "@/data/adventure-sites";
import { getDungeonUrl, isDungeonLocation } from "@/data/dungeon-locations";
import { populateAdventureMarkers } from "@/generators/adventure-site-markers";
import { defaultAdventureSettings, isAdventureSettings } from "@/generators/adventure-sites";
import { clearMapIconGroups } from "@/renderers/map-icon-groups";
import { escapeAttribute, rpgIconPreview } from "@/renderers/rpg-asset-renderer";
import { getUiLanguage, t } from "@/services/ui-language";
import { generatedText as gt } from "@/utils/generation-text";
import type { AdventureSettings } from "@/types/adventure-site";
import { initDungeonInterior, openDungeonInteriorMap } from "./dungeon-interior";

const text = (en: string, ko: string) => (getUiLanguage() === "ko" ? ko : en);
let dialog: HTMLDialogElement;
let settings: AdventureSettings;
let status = "";
let page = 0;

function showLocations(): void {
  turnButtonOn("toggleMarkers");
  drawMarkers();
}

function render(): void {
  settings ||= defaultAdventureSettings(graphWidth, graphHeight);
  const dungeons = (window.pack?.markers || []).filter(isDungeonLocation);
  page = Math.max(0, Math.min(page, Math.ceil(dungeons.length / 30) - 1));
  dialog.innerHTML = `<header><h2>${text("Dungeons & Hostile Sites", "던전·적대 거점")} <small>${dungeons.length}</small></h2>
    <button type="button" class="fpb-icon-button icon-cancel" data-close title="${text("Close", "닫기")}" aria-label="${text("Close", "닫기")}"></button></header>
    <form class="fpb-dungeon-settings"><label>${text("Settlement clearance (map units)", "정착지 간격 (지도 단위)")}<input name="settlementDistance" type="number" min="1" max="10000" step="1" required value="${settings.settlementDistance}"></label><label>${text("Site clearance", "거점 간격")}<input name="siteDistance" type="number" min="1" max="10000" step="1" required value="${settings.siteDistance}"></label><label>${text("Max per country", "국가당 최대")}<input name="maxPerCountry" type="number" min="1" max="20" step="1" required value="${settings.maxPerCountry}"></label><button type="submit"><span class="icon-plus" aria-hidden="true"></span>${text("Fill Wilderness", "공백지 자동 배치")}</button><button type="button" data-regenerate class="icon-cw" title="${text("Regenerate automatic sites", "자동 거점 재생성")}" aria-label="${text("Regenerate automatic sites", "자동 거점 재생성")}"></button></form>
    <p role="status">${escapeAttribute(status)}</p><div class="fpb-dungeon-toolbar"><button type="button" data-add><span class="icon-plus" aria-hidden="true"></span>${text("Place Dungeon", "던전 배치")}</button>
    <button type="button" data-show><span class="icon-eye" aria-hidden="true"></span>${text("Show on Map", "지도에 표시")}</button></div>
    <div class="fpb-dungeon-list">${
      dungeons.length
        ? dungeons
            .slice(page * 30, (page + 1) * 30)
            .map(marker => {
              const note = notes.find(note => note.id === `marker${marker.i}`);
              const name = note?.name || text(`Dungeon ${marker.i + 1}`, `던전 ${marker.i + 1}`);
              const state = pack.states[Number(pack.cells.state[marker.cell])];
              const site = isAdventureSite(marker.adventure) ? marker.adventure : undefined;
              const theme = site && ADVENTURE_THEME_BY_ID.get(site.themeId)!;
              const monster = site && ADVENTURE_MONSTER_BY_ID.get(site.monsterId)!;
              const description =
                site && monster && theme
                  ? `${gt(theme.name, getUiLanguage())} · ${t(CREATURE_TYPES[monster.type])} · ${gt(monster.name, getUiLanguage())} · CR ${monster.cr} · ${site.inhabitants}${text(" creatures (est.)", "개체 추정")} · ${site.cleared ? text("Cleared", "공략 완료") : text("Active", "활성")}`
                  : text("Legacy marker · no theme data", "기존 표식 · 테마 정보 없음");
              return `<div class="fpb-dungeon-row">${rpgIconPreview(marker.icon)}<div><strong>${escapeAttribute(name)}</strong>
        <small>${escapeAttribute(state?.name || text("Wilderness", "미개척지"))} · ${marker.x}, ${marker.y}</small><small>${escapeAttribute(description)}</small>${monster ? `<a href="${adventureMonsterUrl(monster)}" target="_blank" rel="noopener noreferrer">SRD ${monster.edition} · CR ${monster.cr} · p.${monster.page}</a>` : ""}${site ? `<label><input type="checkbox" data-cleared="${marker.i}" ${site.cleared ? "checked" : ""}>${text("Cleared", "공략 완료")}</label>` : ""}<label><input type="checkbox" data-lock="${marker.i}" ${marker.lock ? "checked" : ""}>${text("Preserve on regeneration", "재생성 시 보존")}</label></div>
        <button type="button" class="fpb-icon-button icon-location" data-focus="${marker.i}" title="${text("Locate", "위치 보기")}" aria-label="${text("Locate", "위치 보기")}"></button>
        <button type="button" class="fpb-icon-button icon-pencil" data-edit="${marker.i}" title="${text("Edit", "편집")}" aria-label="${text("Edit", "편집")}"></button>
        <button type="button" class="fpb-icon-button icon-map-o" data-interior="${marker.i}" title="${text("Open Dungeon Map", "던전 내부 지도")}" aria-label="${text("Open Dungeon Map", "던전 내부 지도")}"></button>
        <a class="fpb-dungeon-link icon-link-ext" href="${escapeAttribute(getDungeonUrl(String(seed), marker.cell))}" target="_blank" rel="noopener noreferrer" title="${text("Open Watabou Dungeon", "Watabou 던전 열기")}" aria-label="${text("Open Watabou Dungeon", "Watabou 던전 열기")}"></a></div>`;
            })
            .join("")
        : `<p class="fpb-dungeon-empty">${text("No dungeons", "등록된 던전 없음")}</p>`
    }</div><nav class="fpb-npc-pagination"><button type="button" data-prev class="icon-left-open" aria-label="${text("Previous page", "이전 페이지")}" ${page === 0 ? "disabled" : ""}></button><span>${page + 1} / ${Math.max(1, Math.ceil(dungeons.length / 30))}</span><button type="button" data-next class="icon-right-open" aria-label="${text("Next page", "다음 페이지")}" ${(page + 1) * 30 >= dungeons.length ? "disabled" : ""}></button></nav>`;
  dialog.querySelector<HTMLButtonElement>("[data-prev]")!.onclick = () => {
    page--;
    render();
  };
  dialog.querySelector<HTMLButtonElement>("[data-next]")!.onclick = () => {
    page++;
    render();
  };
  const form = dialog.querySelector<HTMLFormElement>(".fpb-dungeon-settings")!;
  const generate = (replace: boolean) => {
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const candidate = {
      settlementDistance: Number(data.get("settlementDistance")),
      siteDistance: Number(data.get("siteDistance")),
      maxPerCountry: Number(data.get("maxPerCountry"))
    };
    if (!isAdventureSettings(candidate)) return;
    if (
      replace &&
      !confirm(
        text(
          "Regenerate automatic sites? Manual, edited and locked markers are preserved.",
          "자동 거점을 재생성할까요? 수동·수정·잠금 표식은 보존됩니다."
        )
      )
    )
      return;
    settings = candidate;
    const maximum = pack.markers.reduce(
      (max, marker) => (isAdventureSite(marker.adventure) ? Math.max(max, marker.adventure.generation) : max),
      0
    );
    const generation = replace && maximum < Number.MAX_SAFE_INTEGER ? maximum + 1 : 0;
    const removed = new Set(
      replace
        ? pack.markers
            .filter(marker => isAdventureSite(marker.adventure) && !marker.adventure.edited && !marker.lock)
            .map(marker => `marker${marker.i}`)
        : []
    );
    const draftPack = { ...pack, markers: pack.markers.filter(marker => !removed.has(`marker${marker.i}`)) };
    const draftNotes = notes.filter(note => !removed.has(note.id));
    let result: ReturnType<typeof populateAdventureMarkers>;
    try {
      result = populateAdventureMarkers(
        draftPack,
        draftNotes,
        String(seed),
        { width: graphWidth, height: graphHeight },
        settings,
        generation
      );
    } catch {
      status = text(
        "Generation failed; existing sites and notes were preserved.",
        "생성 실패: 기존 거점과 노트를 보존했습니다."
      );
      render();
      return;
    }
    pack.markers = draftPack.markers;
    notes = draftNotes;
    const incomplete = result.countries.filter(country => country.missing > 0);
    status = `${text("Added", "추가")} ${result.placements.length} · ${text("Countries with insufficient space", "공간 부족 국가")} ${incomplete.length}${incomplete.length ? ` (${incomplete.map(country => pack.states[country.stateId]?.name || country.stateId).join(", ")})` : ""}`;
    page = 0;
    showLocations();
    window.dispatchEvent(new Event("project:changed"));
    render();
  };
  form.onsubmit = event => {
    event.preventDefault();
    generate(false);
  };
  dialog.querySelector<HTMLButtonElement>("[data-regenerate]")!.onclick = () => generate(true);
  dialog.querySelectorAll<HTMLInputElement>("[data-lock], [data-cleared]").forEach(input => {
    input.onchange = () => {
      const marker = pack.markers.find(marker => marker.i === Number(input.dataset.lock ?? input.dataset.cleared));
      if (!marker) return;
      if (input.dataset.lock !== undefined) marker.lock = input.checked;
      else if (isAdventureSite(marker.adventure)) {
        marker.adventure.cleared = input.checked;
        marker.adventure.edited = true;
        marker.lock = true;
      }
      window.dispatchEvent(new Event("project:changed"));
      render();
    };
  });
  dialog.querySelector<HTMLButtonElement>("[data-close]")!.onclick = () => dialog.close();
  dialog.querySelector<HTMLButtonElement>("[data-add]")!.onclick = () => {
    dialog.close();
    if (document.getElementById("addMarker")?.classList.contains("pressed")) toggleAddMarker();
    toggleAddMarker("#rpg-dungeon");
  };
  dialog.querySelector<HTMLButtonElement>("[data-show]")!.onclick = () => {
    showLocations();
    dialog.close();
  };
  dialog.querySelectorAll<HTMLButtonElement>("[data-interior]").forEach(button => {
    button.onclick = () => {
      dialog.close();
      openDungeonInteriorMap(Number(button.dataset.interior));
    };
  });
  dialog.querySelectorAll<HTMLButtonElement>("[data-focus], [data-edit]").forEach(button => {
    button.onclick = () => {
      const id = Number(button.dataset.focus ?? button.dataset.edit);
      const marker = pack.markers.find(marker => marker.i === id);
      if (!marker) return;
      dialog.close();
      showLocations();
      zoomTo(marker.x, marker.y, 6, 600);
      if (button.dataset.edit !== undefined) {
        marker.lock = true;
        if (isAdventureSite(marker.adventure)) marker.adventure.edited = true;
        window.dispatchEvent(new Event("project:changed"));
        clearMapIconGroups(document.getElementById("map")!);
        editMarker(id);
      }
    };
  });
}

export function initDungeonLocations(): void {
  if (document.getElementById("fpb-dungeons-dialog")) return;
  dialog = document.createElement("dialog");
  dialog.id = "fpb-dungeons-dialog";
  document.body.append(dialog);
  const button = document.createElement("button");
  button.id = "fpb-dungeons-button";
  button.type = "button";
  const translate = () => {
    button.innerHTML = `<span class="icon-location" aria-hidden="true"></span><span>${text("Dungeons", "던전 위치")}</span>`;
    dialog.setAttribute("aria-label", text("Dungeon Locations", "던전 위치"));
    if (dialog.open) render();
  };
  button.onclick = () => {
    render();
    dialog.showModal();
  };
  document.getElementById("toolsContent")!.prepend(button);
  window.addEventListener("ui:language-changed", translate);
  for (const event of ["map:loaded", "map:generated"])
    window.addEventListener(event, () => {
      dialog.close();
      settings = defaultAdventureSettings(graphWidth, graphHeight);
      status = "";
      page = 0;
    });
  translate();
  initDungeonInterior();
}
