import { battleBox, battlePreset } from "@/data/battle-map";
import type { BattleMapSettings } from "@/types/battle-map";
import { sceneAsset, sceneAssetDefs } from "./scene-assets";
import type { SettlementMap } from "@/types/settlement-map";

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const poly = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

export function renderSettlementMap(
  map: SettlementMap,
  battle = false,
  grid = true,
  district = "market",
  settings: BattleMapSettings = battlePreset("small")
): string {
  const districtBox = battle
    ? district === "gate"
      ? { x: 430, y: 65, width: 320, height: 220 }
      : district === "residential"
        ? { x: 300, y: 350, width: 320, height: 220 }
        : map.district
    : { x: 0, y: 0, width: 1200, height: 800 };
  const box = battle
    ? battleBox(settings, { x: districtBox.x + districtBox.width / 2, y: districtBox.y + districtBox.height / 2 })
    : districtBox;
  return `<svg data-map-view="${battle ? "battle" : "overview"}" ${battle ? `data-columns="${settings.columns}" data-rows="${settings.rows}" data-cell-pixels="${settings.cellPixels}"` : ""} xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" width="${battle ? settings.columns * settings.cellPixels : 2400}" height="${battle ? settings.rows * settings.cellPixels : 1600}" role="img" aria-label="${esc(map.input.name)}"><defs>${sceneAssetDefs(battle ? "battle" : "overview", "city-scene")}
  <pattern id="city-ground" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#9cba87"/><path d="M3,4h2m10,12h3m-6,5h2" stroke="#7f9e6d" stroke-width=".8"/></pattern>
  <pattern id="city-roof" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0,0h6M0,3h6M3,0v3M0,3v3" fill="none" stroke="#f6ddbd" stroke-opacity=".25" stroke-width=".6"/></pattern>
  <pattern id="city-stone" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#aaa993"/>${sceneAsset("paving", 8, 8, 20, "city-scene")}</pattern>
  <pattern id="city-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10,0H0V10" fill="none" stroke="#192f37" stroke-opacity=".35" stroke-width=".5"/></pattern></defs>
  <rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="url(#city-ground)"/>
  ${map.input.port ? '<path d="M0,0H170Q120,180 185,370T160,800H0Z" fill="#55a9c3" stroke="#d1e4d5" stroke-width="8"/><path d="M125,300h105v20H125m10,110h100v20H135" fill="#98724e" stroke="#493e32" stroke-width="2"/>' : ""}
  ${map.input.river ? '<path d="M830,-20Q900,180 830,400T830,820" fill="none" stroke="#64b6cf" stroke-width="38"/><path d="M800,408h70" stroke="#a68b68" stroke-width="26"/>' : ""}
  <ellipse cx="620" cy="410" rx="465" ry="285" fill="${battle ? "#c7bca0" : "#c8bd9e"}" fill-opacity=".8"/>
  <path d="M620,75V735M165,410H1100" fill="none" stroke="url(#city-stone)" stroke-width="27"/>
  ${map.input.river ? '<path d="M830,120Q900,180 830,400T825,690" fill="none" stroke="#64b6cf" stroke-width="36"/><path d="M801,408h69" stroke="#a68b68" stroke-width="26"/>' : ""}
  ${
    map.input.walls
      ? Array.from({ length: 84 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 84;
          const x = 620 + 460 * Math.cos(angle),
            y = 410 + 282 * Math.sin(angle);
          const rotation = (Math.atan2(282 * Math.cos(angle), -460 * Math.sin(angle)) * 180) / Math.PI;
          return `<g transform="rotate(${rotation} ${x} ${y})">${sceneAsset("wall", x, y, 44, "city-scene", 24)}</g>`;
        }).join("") +
        [
          [620, 128],
          [620, 692],
          [160, 410],
          [1080, 410]
        ]
          .map(
            ([x, y], i) =>
              `<g transform="rotate(${i < 2 ? 0 : 90} ${x} ${y})">${sceneAsset("gate", x, y, 55, "city-scene", 40)}</g>`
          )
          .join("")
      : ""
  }
  ${map.trees.map(([x, y, r]) => sceneAsset("tree", x, y, r * 3, "city-scene")).join("")}
  <ellipse cx="620" cy="410" rx="70" ry="58" fill="url(#city-stone)" stroke="#8b978c" stroke-width="2"/>${sceneAsset("well", 620, 410, 14, "city-scene")}
  ${map.buildings
    .map(b => {
      const xs = b.polygon.map(p => p[0]),
        ys = b.polygon.map(p => p[1]);
      const width = Math.max(...xs) - Math.min(...xs),
        height = Math.max(...ys) - Math.min(...ys);
      const kind =
        b.kind === "keep"
          ? "keep"
          : b.kind === "house" &&
              (b.center[0] < 300 || b.center[0] > 980 || b.center[1] < 180 || b.center[1] > 650) &&
              b.id % 3 === 0
            ? "barn"
            : "house";
      return `<g data-building="${b.id}"><polygon points="${poly(b.polygon)}" fill="none" stroke="none"/>${sceneAsset(kind, b.center[0], b.center[1], width * 1.15, "city-scene", height * 1.15)}</g>`;
    })
    .join("")}
  ${battle && grid ? `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="url(#city-grid)" pointer-events="none"/>` : ""}
  </svg>`;
}

export function settlementImagePrompt(
  name: string,
  country: string,
  map: SettlementMap,
  battle = false,
  settings: BattleMapSettings = battlePreset("small")
): string {
  return `Create a richly detailed fantasy city illustration for a tabletop RPG. City: ${name}. Country: ${country}. ${map.input.capital ? "A national capital with a prominent citadel." : "A lived-in settlement with a central market."} ${map.input.port ? "A working harbor with timber piers." : "Land routes connect surrounding settlements."} ${map.input.walls ? "Stone defensive walls and gatehouses." : "Open outskirts and farms."} ${map.input.river ? "A blue river and stone bridges." : ""} ${battle ? `Strict orthographic top-down battle map, ${settings.columns} by ${settings.rows} square cells, 5 ft per cell, ${settings.columns * settings.cellPixels} by ${settings.rows * settings.cellPixels} pixels; preserve square cells and the selected crop, roofless interiors and top-down props, no perspective.` : "Elevated three-quarter bird's-eye view, readable districts, distinct streets, coherent geography, shaded roofs and tree canopies."} No text, no labels, no UI. Use the attached generated city plan as a layout reference. Do not include NPC secrets or GM notes.`;
}
