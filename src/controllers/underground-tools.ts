import { undergroundLabel, undergroundModeLabel } from "@/data/underground";
import { hollowPolarEntrances } from "@/generators/hollow-world";
import { generateUnderground, type UndergroundEntrance } from "@/generators/underground";
import { scenePng } from "@/renderers/scene-assets";
import { EditorDrafts } from "@/services/editor-drafts";
import { getUiLanguage } from "@/services/ui-language";
import { WorldSpaces } from "@/services/world-spaces/state";
import {
  type HollowEntranceStyle,
  type HollowIllumination,
  UNDERGROUND_LEVELS,
  type UndergroundCell,
  type UndergroundLevelId,
  type UndergroundMode
} from "@/types/underground";
import { sampleSurfaceGrid } from "./surface-snapshot";

const text = (ko: string, en: string) => (getUiLanguage() === "ko" ? ko : en);
const node = <K extends keyof HTMLElementTagNameMap>(tag: K, value = "") => {
  const element = document.createElement(tag);
  element.textContent = value;
  return element;
};
interface ToolContext {
  changed: () => void;
  paint: (terrain: UndergroundCell, radius: number) => void;
  error: (error: unknown) => void;
}

function surfaceEntrances(): UndergroundEntrance[] {
  if (typeof pack === "undefined" || typeof graphWidth === "undefined") return [];
  return pack.burgs
    .filter(b => b.i && !b.removed)
    .sort((a, b) => Number(b.capital) - Number(a.capital) || (b.population || 0) - (a.population || 0))
    .map(b => ({
      name: b.name || text("이름 없는 도시", "Unnamed settlement"),
      x: b.x / graphWidth,
      y: b.y / graphHeight
    }));
}

/** Controls for generation, depth selection and map export. All state goes through WorldSpaces. */
export function mountUndergroundTools(host: HTMLElement, context: ToolContext): void {
  const data = WorldSpaces.snapshot();
  const map = data.underground;
  const section = node("section");
  section.className = "fpb-underground-tools";
  const title = node(
    "h4",
    map
      ? `${undergroundModeLabel(map.mode || "tunnels")} · ${text("지저 지형", "Underground terrain")}`
      : text("지저 지형", "Underground terrain")
  );
  const generation = node("form");
  generation.dataset.undergroundGenerate = "";
  const modeLabel = node("label", text("지저 세계 구조", "Underground world structure"));
  const mode = node("select");
  mode.name = "mode";
  mode.dataset.undergroundMode = "";
  mode.add(new Option(text("거대 터널형 · 언더다크 모티프", "Continental tunnels · Underdark motif"), "tunnels"));
  mode.add(new Option(text("공동 세계형 · 아가르타 모티프", "Hollow world · Agartha motif"), "hollow"));
  mode.value = map?.mode || "tunnels";
  modeLabel.append(mode);
  const hollowSettings = node("fieldset");
  hollowSettings.dataset.hollowSettings = "";
  hollowSettings.append(node("legend", text("공동 세계 설정", "Hollow-world settings")));
  const lightLabel = node("label", text("내부 광원", "Inner illumination")),
    light = node("select");
  light.name = "illumination";
  light.add(new Option(text("특이광원·발광대기", "Unusual light / luminous atmosphere"), "luminous"));
  light.add(new Option(text("어두운 내부 세계", "Dark inner world"), "dark"));
  light.value = map?.illumination || "luminous";
  lightLabel.append(light);
  const entranceLabel = node("label", text("출입구 배치", "Entrance placement")),
    entranceStyle = node("select");
  entranceStyle.name = "entranceStyle";
  entranceStyle.add(new Option(text("도시 밖 독립 출입구", "Separate gateways outside settlements"), "settlements"));
  const polarOption = new Option(text("극지권 관문", "Polar gateways"), "polar");
  const latitudeBounds =
    typeof mapCoordinates !== "undefined" &&
    typeof mapCoordinates.latN === "number" &&
    typeof mapCoordinates.latS === "number"
      ? { north: mapCoordinates.latN, south: mapCoordinates.latS }
      : undefined;
  polarOption.disabled = !hollowPolarEntrances(latitudeBounds).length;
  entranceStyle.add(polarOption);
  entranceStyle.value = map?.entranceStyle === "polar" && !polarOption.disabled ? "polar" : "settlements";
  entranceLabel.append(entranceStyle);
  hollowSettings.append(
    lightLabel,
    entranceLabel,
    node(
      "p",
      text(
        "출입구는 도시와 떨어진 별도 위치에 생성됩니다. 극지 관문은 현재 지도에 북위 85° 또는 남위 85°가 포함될 때 선택할 수 있습니다. 기존 지도에는 다시 생성하면 적용됩니다.",
        "Gateways are generated at separate sites outside settlements. Polar gateways require 85° N or 85° S within this map. Regenerate an existing map to apply."
      )
    )
  );
  const description = node("p");
  description.dataset.undergroundDescription = "";
  const describe = () => {
    hollowSettings.hidden = hollowSettings.disabled = mode.value !== "hollow";
    description.textContent =
      mode.value === "hollow"
        ? text(
            "지상의 육지·산지는 내부의 내해·저지대로, 바다·분지는 내부의 대륙·고지대로 뒤집습니다. 넓은 내부 공간을 육로와 내해 항로로 연결하며 광원·출입구 모티프를 선택할 수 있습니다.",
            "Surface land becomes inner seas, and surface seas become inner continents and uplands. Roads and sea routes connect this landscape; choose its lighting and entrance motifs."
          )
        : text(
            "암반 사이의 공동과 좁은 터널이 반전된 저지대를 따라 이어집니다. 자연광이 거의 없는 얕은 지저·중층·심층을 층간 통로로 잇고 지하호수·균류 거주지를 배치할 수 있습니다.",
            "Caverns and narrow passages thread solid rock along inverse lowlands. Naturally dark upper, middle and deep layers connect through descents, with room for underground lakes and fungal settlements."
          );
  };
  mode.onchange = describe;
  describe();
  const seedLabel = node("label", text("생성 시드", "Generation seed"));
  const seedInput = node("input");
  seedInput.name = "seed";
  seedInput.required = true;
  seedInput.maxLength = 120;
  seedInput.value = map?.seed || (typeof seed === "undefined" ? "underground" : `${seed}:underground`).slice(0, 120);
  seedLabel.append(seedInput);
  const densityLabel = node("label", text("배치 밀도", "Placement density"));
  const density = node("select");
  density.name = "chambers";
  for (const [value, name] of [
    [12, text("낮음", "Low")],
    [24, text("보통", "Normal")],
    [36, text("높음", "High")]
  ] as const)
    density.add(new Option(name, String(value)));
  density.value = String(map?.chambers || 24);
  densityLabel.append(density);
  const generate = node(
    "button",
    text(map ? "지저 다시 생성" : "지저 지도 생성", map ? "Regenerate underground" : "Generate underground")
  );
  generate.type = "submit";
  generation.append(modeLabel, hollowSettings, seedLabel, densityLabel, generate);
  generation.onsubmit = event => {
    event.preventDefault();
    if (!generation.reportValidity()) return;
    if (
      map &&
      !confirm(
        text(
          "지저 지형과 자동 생성 장소·통로를 다시 만듭니다. 지형 붓 작업은 초기화되며, 수동 장소와 직접 수정한 장소·세력은 유지됩니다. 계속할까요?",
          "Rebuild underground terrain and generated places/passages? Terrain brush edits reset; manual places, edited places and existing factions are retained."
        )
      )
    )
      return;
    try {
      const existing = WorldSpaces.snapshot();
      const drafts = new Set(EditorDrafts.snapshot().map(draft => draft.key));
      for (const site of existing.sites)
        if (site.origin === "underground" && drafts.has(`space-site:${site.id}`)) site.edited = true;
      const result = generateUnderground(
        existing,
        {
          seed: seedInput.value.trim(),
          chambers: Number(density.value),
          mode: mode.value as UndergroundMode,
          ...(mode.value === "hollow"
            ? {
                illumination: light.value as HollowIllumination,
                entranceStyle: entranceStyle.value as HollowEntranceStyle,
                latitudeBounds
              }
            : {}),
          surface: sampleSurfaceGrid(128, 80)
        },
        surfaceEntrances()
      );
      WorldSpaces.update(draft => Object.assign(draft, result));
      context.changed();
      document.querySelector<HTMLSelectElement>("#fpb-space-panel select[data-underground-level]")?.focus();
    } catch (error) {
      context.error(error);
    }
  };
  section.append(title, generation, description);
  if (map) {
    const levelLabel = node("label", text("깊이 층", "Depth layer"));
    const levels = node("select");
    levels.dataset.undergroundLevel = "";
    for (const level of UNDERGROUND_LEVELS) levels.add(new Option(undergroundLabel(level), level));
    levels.value = map.activeLevel;
    levels.onchange = () => {
      WorldSpaces.update(d => {
        d.underground!.activeLevel = levels.value as UndergroundLevelId;
      });
      context.changed();
      document.querySelector<HTMLSelectElement>("#fpb-space-panel select[data-underground-level]")?.focus();
    };
    levelLabel.append(levels);
    if (map.mode === "hollow") levelLabel.hidden = true;
    const ranges = { upper: "0–749 m", middle: "750–2499 m", deep: "2500–100000 m" };
    const legend = node(
      "p",
      map.mode === "hollow"
        ? text(
            "공동 세계 · 초록: 평원·숲 / 황토: 산지 / 파랑: 내해 / 실선: 육로 / 점선: 항로",
            "Hollow world · Green: plains / forests · Ochre: uplands · Blue: inner seas · Solid: roads · Dashed: sea routes"
          )
        : `${ranges[map.activeLevel]} · ${text("공동·터널 / 파랑: 호수 / 주황: 용암 / 색 영역: 세력권", "Caverns/tunnels / Blue: water / Orange: lava / Tints: territories")}`
    );
    const brush = node("form");
    if (map.mode === "hollow")
      legend.append(
        node(
          "span",
          map.illumination === "dark"
            ? text(" · 광원: 어두운 내부", " · Light: dark interior")
            : text(" · 광원: 특이광원·발광대기", " · Light: luminous interior")
        )
      );
    brush.dataset.undergroundBrush = "";
    const terrainLabel = node("label", text("지형 붓", "Terrain brush"));
    const terrain = node("select");
    terrain.name = "terrain";
    for (const [value, name] of [
      [1, text("공동·터널", "Cavern / tunnel")],
      [0, text("암반", "Rock")],
      [2, text("지하호수", "Water")],
      [3, text("용암", "Lava")]
    ] as const)
      terrain.add(new Option(name, String(value)));
    terrainLabel.append(terrain);
    if (map.mode === "hollow") {
      terrain.options[1].text = text("암반·벽", "Rock / wall");
      terrain.options[0].text = text("평원", "Plain");
      terrain.options[2].text = text("내해", "Inner sea");
      terrain.add(new Option(text("산지", "Uplands"), "4"));
      terrain.add(new Option(text("숲", "Forest"), "5"));
    }
    const radiusLabel = node("label", text("붓 반경", "Brush radius"));
    const radius = node("input");
    radius.name = "radius";
    radius.type = "number";
    radius.min = "1";
    radius.max = "8";
    radius.step = "1";
    radius.value = "3";
    radius.required = true;
    radiusLabel.append(radius);
    const paint = node("button", text("지형 칠하기", "Paint terrain"));
    paint.type = "submit";
    brush.append(terrainLabel, radiusLabel, paint);
    brush.onsubmit = event => {
      event.preventDefault();
      if (brush.reportValidity()) context.paint(Number(terrain.value) as UndergroundCell, Number(radius.value));
    };
    const exports = node("div");
    exports.className = "fpb-space-add";
    for (const format of ["SVG", "PNG"] as const) {
      const button = node("button", `${format} ${text("내보내기", "export")}`);
      button.type = "button";
      button.dataset.undergroundExport = format;
      button.onclick = async () => {
        button.disabled = true;
        try {
          // Capture the selected layer before awaiting image conversion.
          const root = document.querySelector<SVGGElement>("#fpb-world-spaces");
          if (!root || typeof graphWidth === "undefined") throw new Error("Underground view unavailable");
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          const scale = 3000 / Math.max(graphWidth, graphHeight);
          svg.setAttribute("width", String(Math.floor(graphWidth * scale)));
          svg.setAttribute("height", String(Math.floor(graphHeight * scale)));
          svg.setAttribute("viewBox", `0 0 ${graphWidth} ${graphHeight}`);
          svg.setAttribute("font-family", "Arial, sans-serif");
          svg.append(root.cloneNode(true));
          // The surface mask belongs to the legacy map; omit it from standalone exports.
          for (const element of svg.querySelectorAll('[mask="url(#land)"]')) element.remove();
          const markup = new XMLSerializer().serializeToString(svg);
          const blob = format === "PNG" ? await scenePng(markup) : new Blob([markup], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);
          const a = node("a");
          a.href = url;
          a.download = `underground-${map.mode || "tunnels"}-${map.activeLevel}.${format.toLowerCase()}`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (error) {
          context.error(error);
        } finally {
          button.disabled = false;
        }
      };
      exports.append(button);
    }
    section.append(levelLabel, legend, brush, exports);
  } else
    section.append(
      node(
        "p",
        text(
          "시드로 3개 깊이 층의 공동·터널·거주지와 출입구를 만듭니다. 기존 수동 장소는 유지됩니다.",
          "Generate three depth layers with caverns, tunnels, settlements and gateways. Existing manual places are retained."
        )
      )
    );
  host.append(section);
}
