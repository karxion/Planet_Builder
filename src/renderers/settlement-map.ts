import type { SettlementMap } from "@/types/settlement-map";

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const poly = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

export function renderSettlementMap(map: SettlementMap, battle = false, grid = true, district = "market"): string {
  const box = battle
    ? district === "gate"
      ? { x: 430, y: 65, width: 320, height: 220 }
      : district === "residential"
        ? { x: 300, y: 350, width: 320, height: 220 }
        : map.district
    : { x: 0, y: 0, width: 1200, height: 800 };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" width="${battle ? 1920 : 2400}" height="${battle ? 1320 : 1600}" role="img" aria-label="${esc(map.input.name)}"><defs>
  <pattern id="city-ground" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#9cba87"/><path d="M3,4h2m10,12h3m-6,5h2" stroke="#7f9e6d" stroke-width=".8"/></pattern>
  <pattern id="city-roof" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0,0h6M0,3h6M3,0v3M0,3v3" fill="none" stroke="#f6ddbd" stroke-opacity=".25" stroke-width=".6"/></pattern>
  <pattern id="city-stone" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="#c7c9c1"/><path d="M0,0h12M0,5h12M6,0v5M0,5v5" fill="none" stroke="#adb4ab" stroke-width=".5"/></pattern>
  <pattern id="city-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10,0H0V10" fill="none" stroke="#192f37" stroke-opacity=".35" stroke-width=".5"/></pattern></defs>
  <rect width="1200" height="800" fill="url(#city-ground)"/>
  ${map.input.port ? '<path d="M0,0H170Q120,180 185,370T160,800H0Z" fill="#55a9c3" stroke="#d1e4d5" stroke-width="8"/><path d="M125,300h105v20H125m10,110h100v20H135" fill="#98724e" stroke="#493e32" stroke-width="2"/>' : ""}
  ${map.input.river ? '<path d="M830,-20Q900,180 830,400T830,820" fill="none" stroke="#64b6cf" stroke-width="38"/><path d="M800,408h70" stroke="#a68b68" stroke-width="26"/>' : ""}
  <ellipse cx="620" cy="410" rx="465" ry="285" fill="${battle ? "#c7bca0" : "#c8bd9e"}" fill-opacity=".8"/>
  <path d="M620,75V735M165,410H1100" fill="none" stroke="#d1c5a6" stroke-width="27"/>
  ${map.input.river ? '<path d="M830,120Q900,180 830,400T825,690" fill="none" stroke="#64b6cf" stroke-width="36"/><path d="M801,408h69" stroke="#a68b68" stroke-width="26"/>' : ""}
  ${map.input.walls ? '<ellipse cx="620" cy="410" rx="460" ry="282" fill="none" stroke="#4e5e5c" stroke-width="15"/><ellipse cx="620" cy="410" rx="460" ry="282" fill="none" stroke="#b9c0b8" stroke-width="9" stroke-dasharray="10 4"/><path d="M620,115v28m0,534v28M148,410h27m890,0h27" stroke="#b69a70" stroke-width="24"/>' : ""}
  ${map.trees.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#436d53" stroke="#32503f" stroke-width="2"/><circle cx="${x - 2}" cy="${y - 2}" r="${r * 0.6}" fill="#648860"/>`).join("")}
  <ellipse cx="620" cy="410" rx="70" ry="58" fill="url(#city-stone)" stroke="#8b978c" stroke-width="2"/><circle cx="620" cy="410" r="13" fill="#65abc1" stroke="#e2e1d5" stroke-width="5"/>
  ${map.buildings
    .map(
      b => `<g data-building="${b.id}"><polygon points="${poly(b.polygon)}" transform="translate(3 5)" fill="#243634" opacity=".25"/><polygon points="${poly(b.polygon)}" fill="${battle ? "#e1d5b6" : b.kind === "keep" ? "#8b9ba4" : b.color}" stroke="#4f4b43" stroke-width="${battle ? 2 : 2.5}"/>
  ${battle ? `<path d="M${b.center[0] - 6},${b.center[1]}h12m-6,-6v12" stroke="#b8a989" stroke-width="1"/><rect x="${b.center[0] - 5}" y="${b.center[1] - 3}" width="10" height="6" fill="#a67a51" stroke="#674e38"/><circle cx="${b.center[0] + 9}" cy="${b.center[1]}" r="2" fill="#8b6b4d"/>` : `<path d="M${b.polygon[0][0]},${b.polygon[0][1]}L${b.center[0]},${b.center[1]}L${b.polygon[2][0]},${b.polygon[2][1]}" fill="none" stroke="#f2d9b3" stroke-opacity=".65" stroke-width="1.5"/>`}
  ${!battle ? `<polygon points="${poly(b.polygon)}" fill="url(#city-roof)"/>` : ""}<circle cx="${b.door[0]}" cy="${b.door[1]}" r="3.5" fill="#c6b696"/>${b.kind !== "house" && !battle ? `<circle cx="${b.center[0]}" cy="${b.center[1]}" r="10" fill="#f7efcd" stroke="#415958"/><text x="${b.center[0]}" y="${b.center[1] + 4}" text-anchor="middle" font-size="12" fill="#243b43">${b.kind === "keep" ? "1" : b.kind === "inn" ? "2" : "3"}</text>` : ""}</g>`
    )
    .join("")}
  ${battle && grid ? `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="url(#city-grid)" pointer-events="none"/>` : ""}
  </svg>`;
}

export function settlementImagePrompt(name: string, country: string, map: SettlementMap): string {
  return `Create a richly detailed fantasy city illustration for a tabletop RPG. City: ${name}. Country: ${country}. ${map.input.capital ? "A national capital with a prominent citadel." : "A lived-in settlement with a central market."} ${map.input.port ? "A working harbor with timber piers." : "Land routes connect surrounding settlements."} ${map.input.walls ? "Stone defensive walls and gatehouses." : "Open outskirts and farms."} ${map.input.river ? "A blue river and stone bridges." : ""} Elevated three-quarter bird's-eye view, readable districts, distinct streets, coherent geography, no text, no labels, no UI. Use the attached generated city plan as a layout reference. Do not include NPC secrets or GM notes.`;
}
