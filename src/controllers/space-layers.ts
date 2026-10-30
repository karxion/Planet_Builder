import { SPACE_LAYER_IDS, spaceLayers, type SpaceLayerId, type SpaceLayerPreferences } from "@/data/space-layers";
import { WorldSpaces } from "@/services/world-spaces/state";
import { getUiLanguage } from "@/services/ui-language";

declare global {
  interface Window {
    worldSpaceLayerOrder?: () => boolean;
    worldSpaceLayerKey?: (event: KeyboardEvent) => boolean;
    getDefaultPresets?: () => Record<string, string[]>;
  }
}
const supported = (id: string): id is SpaceLayerId => SPACE_LAYER_IDS.includes(id as SpaceLayerId);
const presetIds = new Set(["political", "provinces", "biomes", "heightmap", "physical", "poi", "goods", "landmass"]);
const shared = (id: string) => ["toggleScaleBar", "toggleVignette"].includes(id);

/** Route the existing menu to the active world, keeping the surface's UI and preset state intact. */
export function initSpaceLayerControls(changed: () => void): () => void {
  let saved:
    | { nodes: { node: HTMLElement; attributes: [string, string][] }[]; order: Element[]; preset: string }
    | undefined;
  const menu = () => document.getElementById("mapLayers");
  const active = () => WorldSpaces.snapshot().activeSpace !== "surface";
  const update = (action: (prefs: SpaceLayerPreferences) => void) => {
    WorldSpaces.update(data => {
      if (data.activeSpace === "surface") return;
      data.layers ||= {};
      const prefs = (data.layers[data.activeSpace] ||= {});
      action(prefs);
    });
    changed();
  };
  const sync = () => {
    const list = menu(),
      select = document.querySelector<HTMLSelectElement>("#layersPreset");
    if (!list || !select) return;
    if (!active()) {
      if (!saved) return;
      for (const { node, attributes } of saved.nodes) {
        if (shared(node.id)) continue;
        for (const attr of [...node.attributes]) node.removeAttribute(attr.name);
        for (const [name, value] of attributes) node.setAttribute(name, value);
      }
      saved.order.forEach(node => list.append(node));
      select.value = saved.preset;
      saved = undefined;
      document.getElementById("fpb-space-layer-hint")?.remove();
      return;
    }
    const nodes = [
      ...list.querySelectorAll<HTMLElement>(":scope > li"),
      ...select.querySelectorAll<HTMLOptionElement>("option"),
      ...document.querySelectorAll<HTMLElement>("#savePresetButton,#removePresetButton")
    ];
    if (!saved)
      saved = {
        nodes: nodes.map(node => ({ node, attributes: [...node.attributes].map(a => [a.name, a.value]) })),
        order: [...list.children],
        preset: select.value
      };
    const data = WorldSpaces.snapshot(),
      visible = spaceLayers(data),
      ko = getUiLanguage() === "ko";
    for (const item of list.querySelectorAll<HTMLElement>(":scope > li")) {
      const available = supported(item.id) || shared(item.id);
      item.setAttribute("aria-disabled", String(!available));
      item.toggleAttribute("data-space-unavailable", !available);
      if (!available) {
        item.classList.add("buttonoff");
        item.setAttribute("aria-pressed", "false");
        item.title = ko ? "이 세계에는 해당 레이어 데이터가 없습니다." : "This world has no data for this layer.";
        item.dataset.tip = item.title;
      }
      if (supported(item.id)) {
        item.classList.toggle("buttonoff", !visible[item.id]);
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("aria-pressed", String(visible[item.id]));
        item.title = ko ? "현재 세계의 레이어 표시 전환" : "Toggle this layer in the current world";
        item.dataset.tip = item.title;
      }
    }
    for (const option of select.options) option.disabled = !presetIds.has(option.value) && option.value !== "custom";
    select.value = "custom";
    for (const button of document.querySelectorAll<HTMLButtonElement>("#savePresetButton,#removePresetButton")) {
      button.disabled = true;
      button.title = ko
        ? "공간 레이어 설정은 FPB 프로젝트에 저장됩니다."
        : "Space layer settings are saved in the FPB project.";
    }
    let hint = document.getElementById("fpb-space-layer-hint");
    if (!hint) {
      hint = document.createElement("p");
      hint.id = "fpb-space-layer-hint";
      hint.dataset.i18nSkip = "";
      document.getElementById("layersContent")?.prepend(hint);
    }
    hint.textContent = ko
      ? `${data.activeSpace === "underwater" ? "해저" : "지저"} 레이어 · 지상과 별도 저장 · 흐린 항목은 데이터 없음`
      : `${data.activeSpace === "underwater" ? "Underwater" : "Underground"} layers · Saved separately · Dimmed layers have no data`;
    for (const id of data.layers?.[data.activeSpace as "underwater" | "underground"]?.order || []) {
      const item = document.getElementById(id);
      if (item?.parentElement === list) list.append(item);
    }
  };
  const toggle = (event: Event) => {
    if (!active() || !(event.target instanceof Element)) return;
    const item = event.target.closest<HTMLElement>("#mapLayers > li");
    if (!item || shared(item.id)) return;
    if (event instanceof KeyboardEvent && !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (supported(item.id)) {
      const id = item.id,
        on = spaceLayers(WorldSpaces.snapshot())[id];
      update(prefs => {
        if (prefs) (prefs.visible ||= {})[id] = !on;
      });
    }
  };
  document.addEventListener("click", toggle, true);
  document.addEventListener("keydown", toggle, true);
  document.addEventListener(
    "change",
    event => {
      if (!active() || !(event.target instanceof HTMLSelectElement) || event.target.id !== "layersPreset") return;
      event.stopImmediatePropagation();
      const preset = event.target.value;
      const layers = window.getDefaultPresets?.()[preset];
      if (!presetIds.has(preset) || !layers) {
        sync();
        return;
      }
      const additions: Record<string, string[]> = {
        political: ["toggleRelief"],
        provinces: ["toggleRelief"],
        biomes: ["toggleRelief"],
        physical: ["toggleBiomes", "toggleRelief", "toggleBurgIcons", "toggleLabels", "toggleRoutes"],
        poi: ["toggleLabels", "toggleRelief"],
        goods: ["toggleLabels"]
      };
      update(prefs => {
        prefs.visible = Object.fromEntries(
          SPACE_LAYER_IDS.map(id => [id, layers.includes(id) || (additions[preset] || []).includes(id)])
        );
      });
    },
    true
  );
  window.worldSpaceLayerKey = event => {
    if (!active() || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return false;
    const shortcut = event.code === "Semicolon" ? "; (semicolon)" : event.code.replace(/^Key/, "");
    const item = [...(menu()?.querySelectorAll<HTMLElement>("li[data-shortcut]") || [])].find(
      node => node.dataset.shortcut === shortcut
    );
    if (!item || shared(item.id)) return false;
    if (supported(item.id)) {
      const id = item.id,
        on = spaceLayers(WorldSpaces.snapshot())[id];
      update(prefs => {
        (prefs.visible ||= {})[id] = !on;
      });
    }
    return true;
  };
  window.worldSpaceLayerOrder = () => {
    if (!active()) return false;
    const order = [...(menu()?.children || [])].map(n => n.id).filter(supported);
    update(prefs => {
      if (prefs) prefs.order = order;
    });
    return true;
  };
  return sync;
}
