import { undergroundLabel } from "@/data/underground";
import { generateUnderground, type UndergroundEntrance } from "@/generators/underground";
import { scenePng } from "@/renderers/scene-assets";
import { EditorDrafts } from "@/services/editor-drafts";
import { getUiLanguage } from "@/services/ui-language";
import { WorldSpaces } from "@/services/world-spaces/state";
import { UNDERGROUND_LEVELS, type UndergroundCell, type UndergroundLevelId } from "@/types/underground";

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
  const title = node("h4", text("지저 지형", "Underground terrain"));
  const generation = node("form");
  generation.dataset.undergroundGenerate = "";
  const seedLabel = node("label", text("생성 시드", "Generation seed"));
  const seedInput = node("input");
  seedInput.name = "seed";
  seedInput.required = true;
  seedInput.maxLength = 120;
  seedInput.value = map?.seed || (typeof seed === "undefined" ? "underground" : `${seed}:underground`).slice(0, 120);
  seedLabel.append(seedInput);
  const densityLabel = node("label", text("공동 밀도", "Cavern density"));
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
  generation.append(seedLabel, densityLabel, generate);
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
        { seed: seedInput.value.trim(), chambers: Number(density.value) },
        surfaceEntrances()
      );
      WorldSpaces.update(draft => Object.assign(draft, result));
      context.changed();
      document.querySelector<HTMLSelectElement>("#fpb-space-panel select[data-underground-level]")?.focus();
    } catch (error) {
      context.error(error);
    }
  };
  section.append(title, generation);
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
    const ranges = { upper: "0–749 m", middle: "750–2499 m", deep: "2500–100000 m" };
    const legend = node(
      "p",
      `${ranges[map.activeLevel]} · ${text("공동·터널 / 파랑: 호수 / 주황: 용암 / 색 영역: 세력권", "Caverns/tunnels / Blue: water / Orange: lava / Tints: territories")}`
    );
    const brush = node("form");
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
          a.download = `underground-${map.activeLevel}.${format.toLowerCase()}`;
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
