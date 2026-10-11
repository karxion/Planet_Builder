import { RETIRED_MAP_LAYERS, restoreLegacyTerrainIcon } from "@/data/map-layer-policy";
import {
  getRpgAsset,
  isRpgAsset,
  migrateMarkerIcon,
  RPG_MAP_ASSETS,
  type RpgAssetCategory,
  SETTLEMENT_ASSETS
} from "@/data/rpg-map-assets";
import { installRpgAssetDefinitions, rpgIconPreview } from "@/renderers/rpg-asset-renderer";
import { getUiLanguage } from "@/services/ui-language";
import { migrateResourceTokenLayout } from "@/utils/resourceTokenLayout";

declare global {
  var toggleAddMarker: (assetIcon?: string) => void;
  interface Window {
    selectRpgIcon: (icon: string, onSelect: (icon: string) => void) => void;
    rpgIconPreview: typeof rpgIconPreview;
  }
}

const categories: Array<[RpgAssetCategory, string, string]> = [
  ["settlements", "Settlements", "도시·마을"],
  ["landmarks", "Landmarks", "명소·표식"],
  ["resources", "Resources", "자원"]
];
const sizes: Record<string, number> = { capital: 10, city: 8, town: 6.5, village: 5.5, hamlet: 4.5, fort: 8, post: 7 };
let category: RpgAssetCategory = "settlements";
let selected = "#rpg-capital";
let callback: ((icon: string) => void) | undefined;
const text = (en: string, ko: string) => (getUiLanguage() === "ko" ? ko : en);
const changed = () => window.dispatchEvent(new Event("project:changed"));

function applyMapAssets(): void {
  installRpgAssetDefinitions();
  for (const [control, group] of RETIRED_MAP_LAYERS) {
    const button = document.getElementById(control);
    if (button) {
      button.hidden = true;
      button.classList.add("buttonoff");
      button.setAttribute("aria-hidden", "true");
    }
    const layer = document.getElementById(group);
    if (layer) {
      layer.replaceChildren();
      layer.style.display = "none";
    }
  }
  const obsolete = ["compass", "prec", "population", "ruler", "ice", "goodsCells", "goodsBurgs"];
  document.querySelectorAll<HTMLOptionElement>("#styleElementSelect option").forEach(option => {
    if (obsolete.includes(option.value)) {
      option.hidden = true;
      option.disabled = true;
    }
  });
  for (const id of [
    "regenerateIce",
    "addLinearRuler",
    "addOpisometer",
    "addRouteOpisometer",
    "addPlanimeter",
    "removeRulers"
  ]) {
    const element = document.getElementById(id);
    if (element) element.hidden = true;
  }
  if (!window.pack?.cells?.i?.length) return;

  const resourceIcons = document.getElementById("goodsIcons");
  if (resourceIcons) {
    const layout = migrateResourceTokenLayout(
      resourceIcons.dataset.size,
      resourceIcons.dataset.tokenVersion,
      resourceIcons.dataset.siteSpacing
    );
    resourceIcons.dataset.size = String(layout.size);
    resourceIcons.dataset.siteSpacing = String(layout.spacing);
    resourceIcons.dataset.tokenVersion = "2";
  }

  const styles = style.burgIcons;
  document.querySelectorAll<SVGGElement>("#burgIcons > g").forEach(group => {
    const icon = group.dataset.icon || "#icon-circle";
    if (!icon.startsWith("#icon-")) return;
    const type = SETTLEMENT_ASSETS[group.id] || "village";
    group.dataset.icon = `#rpg-${type}`;
    group.setAttribute("font-size", String(sizes[group.id] || 6));
    styles[group.id] = { ...styles[group.id], "data-icon": `#rpg-${type}`, "font-size": String(sizes[group.id] || 6) };
  });
  for (const [name, attributes] of Object.entries(styles)) {
    if (!String(attributes["data-icon"] || "#icon-circle").startsWith("#icon-")) continue;
    attributes["data-icon"] = `#rpg-${SETTLEMENT_ASSETS[name] || "village"}`;
    attributes["font-size"] = String(sizes[name] || 6);
  }
  const terrainLayer = document.getElementById("terrain");
  if (terrainLayer?.getAttribute("set") === "rpg") {
    terrainLayer.setAttribute("set", "simple");
    terrainLayer.querySelectorAll("use").forEach(icon => {
      const href = icon.getAttribute("href") || "";
      icon.setAttribute("href", restoreLegacyTerrainIcon(href));
    });
  }
  for (const marker of pack.markers || []) {
    const icon = migrateMarkerIcon(marker.type, marker.icon);
    if (icon !== marker.icon) {
      marker.icon = icon;
      marker.px = 26;
    }
  }
  if (layerIsOn("toggleBurgIcons")) drawBurgIcons();
  if (layerIsOn("toggleMarkers")) drawMarkers();
  if (layerIsOn("toggleGoods")) drawGoods();
}

function renderLibrary(): void {
  const dialog = document.getElementById("fpb-assets-dialog")!;
  dialog.innerHTML = `<header class="fpb-assets-header"><span class="icon-brush" aria-hidden="true"></span>
    <h2>${text("Map Assets", "지도 에셋")}</h2><span class="fpb-asset-count">${RPG_MAP_ASSETS.length}</span>
    <select data-fpb-language data-fpb-preference aria-label="언어 / Language"><option value="ko">한국어</option><option value="en">English</option></select>
    <button type="button" class="fpb-icon-button icon-cancel" data-close title="${text("Close", "닫기")}" aria-label="${text("Close", "닫기")}"></button></header>
    <nav class="fpb-asset-tabs" role="tablist">${categories
      .map(
        ([id, en, ko]) =>
          `<button type="button" role="tab" data-category="${id}" aria-selected="${category === id}">${text(en, ko)}</button>`
      )
      .join("")}</nav>
    <div class="fpb-asset-grid" data-asset-category="${category}" role="tabpanel">${RPG_MAP_ASSETS.filter(
      asset => asset.category === category
    )
      .map(
        asset =>
          `<button type="button" class="fpb-asset-tile" data-asset="#${asset.id}" aria-pressed="${selected === `#${asset.id}`}" title="${text(asset.en, asset.ko)}">
      ${rpgIconPreview(asset.id)}<span>${text(asset.en, asset.ko)}</span></button>`
      )
      .join("")}</div>
    <footer class="fpb-assets-footer"><div class="fpb-asset-selected">${rpgIconPreview(selected)}<strong>${text(getRpgAsset(selected)!.en, getRpgAsset(selected)!.ko)}</strong></div>
    ${category === "resources" && !callback ? `<button type="button" data-resources><span class="icon-eye" aria-hidden="true"></span>${text("Show All Resources", "자원 모두 표시")}</button>` : ""}
    <button type="button" data-legacy class="fpb-asset-legacy">${text("Custom Icon", "사용자 지정")}</button>
    <button type="button" class="primary" data-place><span class="${callback ? "icon-check" : "icon-location"}" aria-hidden="true"></span>${callback ? text("Select", "선택") : text("Place on Map", "지도에 배치")}</button></footer>`;
  const languageSelect = dialog.querySelector<HTMLSelectElement>("[data-fpb-language]")!;
  languageSelect.value = getUiLanguage();
  dialog.querySelector<HTMLElement>("[data-close]")!.onclick = () => (dialog as HTMLDialogElement).close();
  dialog.querySelectorAll<HTMLButtonElement>("[data-category]").forEach(button => {
    button.onclick = () => {
      category = button.dataset.category as RpgAssetCategory;
      renderLibrary();
    };
  });
  dialog.querySelectorAll<HTMLButtonElement>("[data-asset]").forEach(button => {
    button.onclick = () => {
      selected = button.dataset.asset!;
      renderLibrary();
    };
  });
  dialog.querySelector<HTMLElement>("[data-place]")!.onclick = () => {
    (dialog as HTMLDialogElement).close();
    if (callback) {
      callback(selected);
      callback = undefined;
      changed();
    } else {
      if (document.getElementById("addMarker")?.classList.contains("pressed")) toggleAddMarker();
      toggleAddMarker(selected);
    }
  };
  dialog.querySelector<HTMLElement>("[data-legacy]")!.onclick = () => {
    (dialog as HTMLDialogElement).close();
    const onSelect = callback;
    callback = undefined;
    selectIcon(selected.startsWith("#rpg-") ? "" : selected, value => {
      if (onSelect) {
        onSelect(value);
        changed();
      } else {
        if (document.getElementById("addMarker")?.classList.contains("pressed")) toggleAddMarker();
        toggleAddMarker(value);
      }
    });
  };
  const resources = dialog.querySelector<HTMLElement>("[data-resources]");
  if (resources)
    resources.onclick = () => {
      for (const good of pack.goods) good.visible = true;
      turnButtonOn("toggleGoods");
      drawGoods();
      changed();
      (dialog as HTMLDialogElement).close();
    };
}

function openLibrary(icon?: string, onSelect?: (icon: string) => void): void {
  callback = onSelect;
  if (icon && isRpgAsset(icon)) {
    selected = icon;
    category = getRpgAsset(icon)!.category;
  }
  renderLibrary();
  (document.getElementById("fpb-assets-dialog") as HTMLDialogElement).showModal();
}

function installEditorChoices(): void {
  const settlementSelect = document.getElementById("styleBurgIconsIcon") as HTMLSelectElement;
  for (const asset of RPG_MAP_ASSETS.filter(asset => asset.category === "settlements")) {
    settlementSelect.add(new Option(text(asset.en, asset.ko), `#${asset.id}`), 0);
  }
}

export function initRpgMapAssets(): void {
  if (document.getElementById("fpb-assets-dialog")) return;
  const dialog = document.createElement("dialog");
  dialog.id = "fpb-assets-dialog";
  dialog.setAttribute("aria-label", "Map Assets");
  document.body.append(dialog);
  const button = document.createElement("button");
  button.type = "button";
  button.id = "fpb-assets-button";
  button.innerHTML = `<span class="icon-brush" aria-hidden="true"></span><span>Map Assets</span>`;
  button.onclick = event => {
    event.stopPropagation();
    openLibrary();
  };
  document.getElementById("toolsContent")!.prepend(button);
  installEditorChoices();
  window.selectRpgIcon = openLibrary;
  window.rpgIconPreview = rpgIconPreview;
  window.addEventListener("map:generated", applyMapAssets);
  window.addEventListener("map:loaded", applyMapAssets);
  window.addEventListener("ui:language-changed", () => {
    button.lastElementChild!.textContent = text("Map Assets", "지도 에셋");
    settlementOptionsLanguage();
    if (dialog.open) renderLibrary();
  });
  dialog.addEventListener("close", () => {
    dialog.querySelectorAll("button").forEach(button => {
      button.blur();
    });
  });
  applyMapAssets();
  button.lastElementChild!.textContent = text("Map Assets", "지도 에셋");
}

function settlementOptionsLanguage(): void {
  document.querySelectorAll<HTMLOptionElement>("#styleBurgIconsIcon option").forEach(option => {
    const asset = getRpgAsset(option.value);
    if (asset) option.textContent = text(asset.en, asset.ko);
  });
}
