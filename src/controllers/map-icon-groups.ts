import { applyIndividualMapIcons, restoreIndividualMapIcons } from "@/renderers/individual-map-icons";
import { clearMapIconGroups } from "@/renderers/map-icon-groups";
import { applyMapLabelHalos } from "@/renderers/map-label-halo";
import { applyResourceIconSpacing, restoreResourceIconSpacing } from "@/renderers/resource-icon-spacing";

declare global {
  var editMarker: (id?: number) => void;
}

let observer: MutationObserver;
let timer = 0;

function refresh(): void {
  timer = 0;
  observer.disconnect();
  const map = document.getElementById("map");
  const view = map?.querySelector<SVGGElement>("#viewbox");
  if (map && view) {
    clearMapIconGroups(map);
    restoreResourceIconSpacing(view);
    applyMapLabelHalos(view);
    const burgDialog = document.getElementById("burgEditor")?.closest(".ui-dialog");
    const editingBurg = burgDialog && getComputedStyle(burgDialog).display !== "none";
    if (!customization && !elSelected?.node() && !editingBurg && view.style.cursor !== "crosshair") {
      applyIndividualMapIcons(view);
    } else restoreIndividualMapIcons(view);
    applyResourceIconSpacing(view);
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
  if (timer) window.clearTimeout(timer);
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
  refresh();
}
