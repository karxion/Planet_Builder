import { SEA_RELATIONS, SEABED_DETAILS_EN, SEABED_GEOLOGY_VERSION, SEABED_TERRAINS } from "@/data/underwater";
import { generateUnderwater, type SeaSurface } from "@/generators/underwater";
import { scenePng, inlineSceneImages } from "@/renderers/scene-assets";
import { seabedReliefId } from "@/data/seabed-relief";
import { seabedGlyphPreview } from "@/renderers/seabed-glyphs";
import { EditorDrafts } from "@/services/editor-drafts";
import { getUiLanguage } from "@/services/ui-language";
import { WorldSpaces } from "@/services/world-spaces/state";
import type { SeaRelationStatus, UnderwaterMap } from "@/types/underwater";
import { sampleSurfaceGrid } from "./surface-snapshot";
import { spaceLayers } from "@/data/space-layers";
import { prepareSpaceDungeons } from "./space-dungeons";

const text = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);
const node = <K extends keyof HTMLElementTagNameMap>(tag: K, value = "") => {
  const n = document.createElement(tag);
  n.textContent = value;
  return n;
};
interface SeaContext {
  changed: () => void;
  error: (error: unknown) => void;
  faction: (id: string) => void;
}
export function sampleSeaSurface(): SeaSurface {
  return sampleSurfaceGrid(160, 96, true);
}
export function mountUnderwaterTools(host: HTMLElement, context: SeaContext): void {
  const data = WorldSpaces.snapshot(),
    map = data.underwater;
  const section = node("section");
  section.className = "fpb-underwater-tools";
  section.append(node("h4", text("해저 지형·수중 세력", "Seabed and aquatic realms")));
  const form = node("form");
  form.dataset.seaGenerate = "";
  const label = node("label", text("생성 시드", "Generation seed")),
    input = node("input");
  input.name = "seed";
  input.maxLength = 120;
  input.required = true;
  input.value = map?.seed || `${typeof seed === "undefined" ? "world" : seed}:sea`.slice(0, 120);
  label.append(input);
  form.append(label);
  const generate = node(
    "button",
    text(
      map ? "해저·세력 다시 생성" : "해저·세력 생성",
      map ? "Regenerate seabed / realms" : "Generate seabed / realms"
    )
  );
  generate.type = "submit";
  form.append(generate);
  form.onsubmit = event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (
      map &&
      !confirm(
        text(
          "해저 지형·자동 거주지·세력권·교역로를 다시 생성할까요? 수동·직접 수정한 장소와 세력·외교 관계는 유지합니다.",
          "Regenerate bathymetry, automatic settlements, territories and routes? Manual/edited places, factions and diplomacy are retained."
        )
      )
    )
      return;
    try {
      const existing = WorldSpaces.snapshot(),
        drafts = new Set(EditorDrafts.snapshot().map(d => d.key));
      for (const site of existing.sites)
        if (site.origin === "underwater" && drafts.has(`space-site:${site.id}`)) site.edited = true;
      const result = generateUnderwater(existing, input.value.trim(), sampleSeaSurface());
      const commitDungeons = prepareSpaceDungeons(result);
      WorldSpaces.update(d => Object.assign(d, result));
      commitDungeons();
      context.changed();
    } catch (error) {
      context.error(error);
    }
  };
  section.append(
    form,
    node(
      "p",
      text(
        "현재 지상의 해안·높이에서 해저 지형을 생성합니다. 자동 도시는 지도 사방 8%의 가장자리를 제외한 바닷속에 배치합니다. 기존 지도에는 다시 생성하면 적용되며, 수동·직접 편집한 장소는 보존됩니다.",
        "Bathymetry follows this world's coastline and heights. Automatic cities use water inside an 8% margin on all sides. Regenerate an existing map to apply; manual and edited places are retained."
      )
    )
  );
  if (map) {
    const viewLabel = node("label", text("지도 보기", "Map view")),
      view = node("select");
    view.dataset.seaView = "";
    for (const [value, name] of [
      ["combined", text("지형 + 세력권", "Terrain + politics")],
      ["terrain", text("해저 지형", "Bathymetry")],
      ["political", text("세력권", "Political")]
    ])
      view.add(new Option(name, value));
    const visible = spaceLayers(data);
    view.value = visible.toggleStates ? (visible.toggleBiomes ? "combined" : "political") : "terrain";
    viewLabel.append(view);
    view.onchange = () => {
      WorldSpaces.update(d => {
        d.underwater!.view = view.value as UnderwaterMap["view"];
        d.layers ||= {};
        const prefs = (d.layers.underwater ||= {});
        Object.assign((prefs.visible ||= {}), {
          toggleStates: view.value !== "terrain",
          toggleBiomes: view.value !== "political",
          toggleHeight: view.value !== "political"
        });
      });
      context.changed();
    };
    const legend = node("ul");
    legend.className = "fpb-sea-legend";
    for (const [code, feature] of SEABED_TERRAINS.entries()) {
      if (!code) continue;
      const name = text(feature.ko, feature.en);
      const item = node("li"),
        image = seabedGlyphPreview(seabedReliefId(code)),
        caption = node("span"),
        title = node("strong", name);
      item.className = "fpb-seabed-relief-row";
      const depths = map.depths.filter((_, i) => map.terrain[i] === code);
      const range = node(
        "small",
        depths.length
          ? `${text("현재 지도", "This map")} · ${Math.min(...depths).toLocaleString()}–${Math.max(...depths).toLocaleString()} m`
          : text("현재 지도에 없음", "Not present on this map")
      );
      caption.append(title, range);
      item.title = text(feature.description, SEABED_DETAILS_EN[code]);
      item.append(image, caption);
      legend.append(item);
    }
    const depthGuide = node(
      "p",
      text(
        "지상의 산·숲처럼 작은 지형 기호를 해당 지역에 반복해서 표시합니다. 기호의 모양으로 해저 지형을 구분하고, 선택하면 해당 위치의 정확한 수심을 확인할 수 있습니다.",
        "Small relief symbols repeat across their own terrain, like mountains and forests on the surface map. Their shapes identify landforms; select a symbol to inspect its exact depth."
      )
    );
    const list = node("ul");
    list.className = "fpb-sea-factions";
    for (const id of map.factionIds) {
      const faction = data.factions.find(f => f.id === id)!;
      const item = node("li"),
        button = node("button", `${faction.name} · ${faction.people || text("혼합 주민", "Mixed peoples")}`);
      button.type = "button";
      button.style.borderLeft = `5px solid ${faction.color}`;
      button.dataset.seaFaction = id;
      button.onclick = () => context.faction(id);
      item.append(button);
      list.append(item);
    }
    const exports = node("div");
    exports.className = "fpb-space-add";
    for (const format of ["SVG", "PNG"] as const) {
      const button = node("button", `${format} ${text("내보내기", "export")}`);
      button.type = "button";
      button.dataset.seaExport = format;
      button.onclick = async () => {
        button.disabled = true;
        try {
          const source = document.querySelector("#fpb-world-spaces");
          if (!source) throw new Error("Map unavailable");
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            factor = 3000 / Math.max(graphWidth, graphHeight);
          svg.setAttribute("width", String(Math.round(graphWidth * factor)));
          svg.setAttribute("height", String(Math.round(graphHeight * factor)));
          svg.setAttribute("viewBox", `0 0 ${graphWidth} ${graphHeight}`);
          svg.setAttribute("font-family", "Arial, sans-serif");
          svg.append(source.cloneNode(true));
          for (const el of svg.querySelectorAll('[mask="url(#land)"]')) el.remove();
          const markup = new XMLSerializer().serializeToString(svg),
            blob =
              format === "PNG"
                ? await scenePng(markup)
                : new Blob([await inlineSceneImages(markup)], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob),
            link = node("a");
          link.href = url;
          link.download = `underwater-${map.view}.${format.toLowerCase()}`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (error) {
          context.error(error);
        } finally {
          button.disabled = false;
        }
      };
      exports.append(button);
    }
    const geology = node("details");
    geology.className = "fpb-seabed-guide";
    const summary = node("summary", text("해저 지형 분류·생성 기준", "Seafloor classification / generation"));
    geology.append(summary);
    for (const [code, feature] of SEABED_TERRAINS.entries())
      if (code)
        geology.append(
          node("p", `${text(feature.ko, feature.en)}: ${text(feature.description, SEABED_DETAILS_EN[code])}`)
        );
    if (map.geologyVersion !== SEABED_GEOLOGY_VERSION)
      geology.append(
        node(
          "p",
          text(
            "저장된 기존 지형을 유지하고 있습니다. 아이콘과 수심 표시는 재생성 없이 적용됩니다. 해저 사구 등 새 지형 생성 규칙은 다시 생성하면 적용됩니다.",
            "Saved terrain is preserved. Icons and depth indicators work without regeneration. Regenerate only to apply new terrain-generation rules, including sand waves."
          )
        )
      );
    section.append(
      viewLabel,
      node("h4", text("해저 지형 기호", "Seafloor relief symbols")),
      depthGuide,
      legend,
      geology,
      node("h4", text("수중 세력", "Aquatic realms")),
      list,
      exports
    );
  }
  host.append(section);
}
export function mountSeaDiplomacy(host: HTMLElement, factionId: string, changed: () => void): void {
  const data = WorldSpaces.snapshot();
  if (!data.underwater) return;
  const section = node("section");
  section.className = "fpb-sea-diplomacy";
  section.append(node("h4", text("외교 관계", "Diplomacy")));
  const names: Record<SeaRelationStatus, string> = {
    allied: text("동맹", "Alliance"),
    trade: text("교역", "Trade"),
    neutral: text("중립", "Neutral"),
    rival: text("경쟁", "Rivalry"),
    war: text("전쟁", "War")
  };
  for (const id of data.underwater.factionIds.filter(id => id !== factionId)) {
    const faction = data.factions.find(f => f.id === id)!,
      label = node("label", faction.name),
      select = node("select");
    select.dataset.seaRelation = id;
    for (const status of SEA_RELATIONS) select.add(new Option(names[status], status));
    const match = (r: { from: string; to: string }) =>
      (r.from === id && r.to === factionId) || (r.from === factionId && r.to === id);
    select.value = data.relations?.find(match)?.status || "neutral";
    select.onchange = () => {
      WorldSpaces.update(d => {
        d.relations ||= [];
        const existing = d.relations.find(match);
        if (existing) existing.status = select.value as SeaRelationStatus;
        else d.relations.push({ from: factionId, to: id, status: select.value as SeaRelationStatus });
      });
      changed();
    };
    label.append(select);
    section.append(label);
  }
  host.append(section);
}
