import { getDungeonUrl, isDungeonLocation } from "@/data/dungeon-locations";
import { clearMapIconGroups } from "@/renderers/map-icon-groups";
import { escapeAttribute, rpgIconPreview } from "@/renderers/rpg-asset-renderer";
import { getUiLanguage } from "@/services/ui-language";

const text = (en: string, ko: string) => (getUiLanguage() === "ko" ? ko : en);
let dialog: HTMLDialogElement;

function showLocations(): void {
  turnButtonOn("toggleMarkers");
  drawMarkers();
}

function render(): void {
  const dungeons = (window.pack?.markers || []).filter(isDungeonLocation);
  dialog.innerHTML = `<header><h2>${text("Dungeon Locations", "던전 위치")} <small>${dungeons.length}</small></h2>
    <button type="button" class="fpb-icon-button icon-cancel" data-close title="${text("Close", "닫기")}" aria-label="${text("Close", "닫기")}"></button></header>
    <div class="fpb-dungeon-toolbar"><button type="button" data-add><span class="icon-plus" aria-hidden="true"></span>${text("Place Dungeon", "던전 배치")}</button>
    <button type="button" data-show><span class="icon-eye" aria-hidden="true"></span>${text("Show on Map", "지도에 표시")}</button></div>
    <div class="fpb-dungeon-list">${
      dungeons.length
        ? dungeons
            .map(marker => {
              const note = notes.find(note => note.id === `marker${marker.i}`);
              const name = note?.name || text(`Dungeon ${marker.i + 1}`, `던전 ${marker.i + 1}`);
              const state = pack.states[Number(pack.cells.state[marker.cell])];
              return `<div class="fpb-dungeon-row">${rpgIconPreview("#rpg-dungeon")}<div><strong>${escapeAttribute(name)}</strong>
        <small>${escapeAttribute(state?.name || text("Wilderness", "미개척지"))} · ${marker.x}, ${marker.y}</small></div>
        <button type="button" class="fpb-icon-button icon-location" data-focus="${marker.i}" title="${text("Locate", "위치 보기")}" aria-label="${text("Locate", "위치 보기")}"></button>
        <button type="button" class="fpb-icon-button icon-pencil" data-edit="${marker.i}" title="${text("Edit", "편집")}" aria-label="${text("Edit", "편집")}"></button>
        <a class="fpb-dungeon-link icon-link-ext" href="${escapeAttribute(getDungeonUrl(String(seed), marker.cell))}" target="_blank" rel="noopener noreferrer" title="${text("Open Watabou Dungeon", "Watabou 던전 열기")}" aria-label="${text("Open Watabou Dungeon", "Watabou 던전 열기")}"></a></div>`;
            })
            .join("")
        : `<p class="fpb-dungeon-empty">${text("No dungeons", "등록된 던전 없음")}</p>`
    }</div>`;
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
  dialog.querySelectorAll<HTMLButtonElement>("[data-focus], [data-edit]").forEach(button => {
    button.onclick = () => {
      const id = Number(button.dataset.focus ?? button.dataset.edit);
      const marker = pack.markers.find(marker => marker.i === id);
      if (!marker) return;
      dialog.close();
      showLocations();
      zoomTo(marker.x, marker.y, 6, 600);
      if (button.dataset.edit !== undefined) {
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
  window.addEventListener("map:loaded", () => dialog.close());
  window.addEventListener("map:generated", () => dialog.close());
  translate();
}
