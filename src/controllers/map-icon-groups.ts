import { applyIndividualMapIcons, restoreIndividualMapIcons } from "@/renderers/individual-map-icons";
import { clearMapIconGroups } from "@/renderers/map-icon-groups";
import { applyMapLabelHalos } from "@/renderers/map-label-halo";
import { restoreResourceIconSpacing } from "@/renderers/resource-icon-spacing";
import { clearAnchoredMapObjects, drawAnchoredMapObjects } from "@/renderers/anchored-map-objects";
import { localizedMapNote } from "@/services/marker-notes";
import { getUiLanguage } from "@/services/ui-language";
import type { Marker } from "@/generators/markers-generator";
import type { AnchoredObjectGroup } from "@/utils/anchoredMapObjects";

declare global {
  var editMarker: (id?: number) => void;
}

let observer: MutationObserver;
let timer = 0;
const text = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);
const markerName = (marker: Marker): string => {
  const note = typeof notes === "undefined" ? undefined : notes.find(note => note.id === `marker${marker.i}`);
  return note ? localizedMapNote(note).name : marker.type || text("오브젝트", "Object");
};
function openObjects(group: AnchoredObjectGroup): void {
  document.getElementById("fpb-object-dialog")?.remove();
  const dialog = document.createElement("dialog");
  dialog.id = "fpb-object-dialog";
  dialog.dataset.i18nSkip = "";
  dialog.setAttribute("aria-labelledby", "fpb-object-heading");
  dialog.innerHTML = `<header><h2 id="fpb-object-heading"></h2><button type="button" data-close></button></header><p data-home></p><ul></ul>`;
  dialog.querySelector("h2")!.textContent = text("장소 오브젝트", "Location objects");
  const close = dialog.querySelector<HTMLButtonElement>("[data-close]")!;
  close.textContent = text("닫기", "Close");
  close.onclick = () => dialog.close();
  dialog.querySelector("[data-home]")!.textContent = group.burgId
    ? `${text("소재 도시", "City")}: ${pack.burgs[group.burgId].name} · ${group.markers.length}`
    : `${text("독립 장소", "Independent location")} · (${group.x}, ${group.y})`;
  for (const marker of group.markers) {
    const row = document.createElement("li");
    const label = document.createElement("strong");
    label.textContent = markerName(marker);
    const preview = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    preview.setAttribute("viewBox", "0 0 30 30");
    preview.setAttribute("aria-hidden", "true");
    preview.innerHTML = renderMarkerGlyph(marker);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text("상세·편집", "Details / edit");
    button.onclick = () => {
      dialog.close();
      const view = document.querySelector<SVGGElement>("#map #viewbox");
      if (view) clearAnchoredMapObjects(view);
      editMarker(marker.i);
    };
    row.append(preview, label, button);
    dialog.querySelector("ul")!.append(row);
  }
  document.body.append(dialog);
  dialog.showModal();
}

function refresh(): void {
  timer = 0;
  observer.disconnect();
  const map = document.getElementById("map");
  const view = map?.querySelector<SVGGElement>("#viewbox");
  if (map && view) {
    clearMapIconGroups(map);
    clearAnchoredMapObjects(view);
    restoreResourceIconSpacing(view);
    applyMapLabelHalos(view);
    const burgDialog = document.getElementById("burgEditor")?.closest(".ui-dialog");
    const editingBurg = burgDialog && getComputedStyle(burgDialog).display !== "none";
    if (!customization && !elSelected?.node() && !editingBurg && view.style.cursor !== "crosshair") {
      applyIndividualMapIcons(view);
      drawAnchoredMapObjects(
        view,
        group =>
          `${group.burgId ? pack.burgs[group.burgId].name + " · " : ""}${text("오브젝트", "Objects")} ${group.markers.length}: ${group.markers.map(markerName).join(", ")}`,
        openObjects
      );
    } else restoreIndividualMapIcons(view);
    window.dispatchEvent(new Event("map:icons-laid-out"));
    observer.observe(view, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "transform",
        "x",
        "y",
        "width",
        "height",
        "href",
        "style",
        "class",
        "display",
        "data-size",
        "fill",
        "font-size",
        "font-family"
      ]
    });
  }
}

function schedule(): void {
  if (timer) return;
  timer = window.setTimeout(refresh, 120);
}

// Keep the existing entry point for app-shell and saved-project compatibility.
export function initMapIconGroups(): void {
  if (observer) return;
  document.getElementById("fpb-icon-group-popup")?.remove();
  observer = new MutationObserver(schedule);
  window.addEventListener("resize", schedule);
  for (const event of ["map:loaded", "map:generated", "project:changed", "ui:language-changed"]) {
    window.addEventListener(event, schedule);
  }
  for (const event of ["map:loaded", "map:generated", "world-spaces:restored"]) {
    window.addEventListener(event, () => document.querySelector<HTMLDialogElement>("#fpb-object-dialog")?.close());
  }
  refresh();
}
