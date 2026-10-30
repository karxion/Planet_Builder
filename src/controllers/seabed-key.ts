import { DEPTH_BANDS } from "@/data/seabed-relief";
import { spaceLayers } from "@/data/space-layers";
import { getUiLanguage } from "@/services/ui-language";
import type { WorldSpacesData } from "@/types/world-spaces";

/** A compact reading key; it changes no project data and can be collapsed over the map. */
export function refreshSeabedKey(data: WorldSpacesData, openLegend: () => void): void {
  let key = document.querySelector<HTMLDetailsElement>("#fpb-seabed-depth-key");
  if (data.activeSpace !== "underwater" || !data.underwater || !spaceLayers(data).toggleRelief) {
    key?.remove();
    return;
  }
  const ko = getUiLanguage() === "ko";
  if (!key) {
    key = document.createElement("details");
    key.id = "fpb-seabed-depth-key";
    key.dataset.i18nSkip = "";
    key.open = window.innerWidth > 760;
    document.body.append(key);
  }
  const summary = document.createElement("summary");
  summary.textContent = ko ? "수심 단계 · 1–4" : "Depth bands · 1–4";
  const list = document.createElement("ol");
  DEPTH_BANDS.forEach((band, n) => {
    const row = document.createElement("li"),
      number = document.createElement("b"),
      label = document.createElement("span");
    number.textContent = String(n + 1);
    number.style.backgroundColor = band.color;
    label.textContent = `${band[ko ? "ko" : "en"]} · ${band.range}`;
    row.append(number, label);
    list.append(row);
  });
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = ko ? "지형 아이콘 범례" : "Terrain icon legend";
  button.onclick = openLegend;
  key.replaceChildren(summary, list, button);
}
