import { SEA_RELATIONS, SEABED_COLORS, SEABED_DETAILS_EN, SEABED_TERRAINS } from "@/data/underwater";
import { generateUnderwater, type SeaSurface } from "@/generators/underwater";
import { scenePng } from "@/renderers/scene-assets";
import { EditorDrafts } from "@/services/editor-drafts";
import { getUiLanguage } from "@/services/ui-language";
import { WorldSpaces } from "@/services/world-spaces/state";
import type { SeaRelationStatus, UnderwaterMap } from "@/types/underwater";
import { findGridCell } from "@/utils/graphUtils";

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
  if (typeof grid === "undefined" || !grid.cells?.h?.length || typeof graphWidth === "undefined")
    throw new Error("지상 지도가 준비되지 않았습니다.");
  const columns = 160,
    rows = 96;
  const heights = Array.from({ length: columns * rows }, (_, i) => {
    const x = (((i % columns) + 0.5) / columns) * graphWidth,
      y = ((Math.floor(i / columns) + 0.5) / rows) * graphHeight;
    const cell = findGridCell(x, y, grid);
    return grid.features?.[grid.cells.f[cell]]?.type === "lake" ? 20 : Number(grid.cells.h[cell]);
  });
  return { columns, rows, heights };
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
      WorldSpaces.update(d => Object.assign(d, result));
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
        "현재 지상의 해안·높이에서 해저 지형을 생성합니다. 수심은 이 세계의 생성값입니다. 종족 구성과 외교 관계는 세계관 설정으로 편집할 수 있습니다.",
        "Bathymetry is generated from this world's coastline and heights. Depths are generated setting data. Peoples and diplomatic relations are editable."
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
    view.value = map.view;
    viewLabel.append(view);
    view.onchange = () => {
      WorldSpaces.update(d => {
        d.underwater!.view = view.value as UnderwaterMap["view"];
      });
      context.changed();
    };
    const legend = node("ul");
    legend.className = "fpb-sea-legend";
    for (const [code, feature] of SEABED_TERRAINS.entries()) {
      if (!map.terrain.includes(code as import("@/types/underwater").SeabedTerrain)) continue;
      const name = text(feature.ko, feature.en);
      const item = node("li"),
        swatch = node("span");
      swatch.style.background = SEABED_COLORS[code];
      swatch.setAttribute("aria-hidden", "true");
      item.title = text(feature.description, SEABED_DETAILS_EN[code]);
      item.append(swatch, name);
      legend.append(item);
    }
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
            blob = format === "PNG" ? await scenePng(markup) : new Blob([markup], { type: "image/svg+xml" });
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
    if (map.geologyVersion !== 2)
      geology.append(
        node(
          "p",
          text(
            "저장된 기존 지형을 유지하고 있습니다. 새 분류는 다시 생성하면 적용됩니다.",
            "The saved terrain is preserved. Regenerate to apply the expanded classification."
          )
        )
      );
    section.append(viewLabel, legend, geology, node("h4", text("수중 세력", "Aquatic realms")), list, exports);
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
