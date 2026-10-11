import { LOCATION_TOKEN_IMAGES } from "./rpg-location-token-images.ts";
import { RESOURCE_TOKEN_IMAGES } from "./rpg-resource-token-images.ts";

export type RpgAssetCategory = "settlements" | "landmarks" | "resources";

export interface RpgMapAsset {
  id: string;
  category: RpgAssetCategory;
  en: string;
  ko: string;
  body: string;
  viewBox?: string;
}

const path = (d: string, fill = "none", extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="none"/>`;
const ground = ellipse(32, 54, 27, 5, "#263d3340");
const house = (x: number, y: number, s = 1, roof = "#a94d51") => `<g transform="translate(${x} ${y}) scale(${s})">
  ${path("M0 12 14 4 28 12 28 30 14 38 0 30Z", "#ddcba4")}
  ${path("M14 20 28 12 28 30 14 38Z", "#a88d70")}
  ${path("M-3 13 11 0 31 10 17 24Z", roof)}
  ${path("M11 0 17 24 31 10Z", "#713b46")}
  ${path("M4 24 9 27 9 34 4 31Z", "#493f3d")}
  ${path("M20 23 24 21 24 26 20 28Z", "#80c5d0")}</g>`;
const tower = (x: number, y: number, s = 1, roof = "#426d83") => `<g transform="translate(${x} ${y}) scale(${s})">
  ${path("M0 12 8 8 16 12 16 42 8 47 0 42Z", "#d2c5aa")}
  ${path("M8 17 16 12 16 42 8 47Z", "#9a9586")}
  ${path("M-3 13 8-1 19 13 8 19Z", roof)}
  ${path("M4 25 7 24 7 30 4 31Z", "#38424b")}</g>`;
const tree = (x: number, y: number, s = 1, pine = false) => `<g transform="translate(${x} ${y}) scale(${s})">
  ${path("M-2 18 3 18 3 31-2 33Z", "#8c634c")}
  ${pine ? path("M0-8-13 10-7 9-17 22 0 30 17 22 7 9 13 10Z", "#377366") + path("M0-8 0 30 17 22 7 9 13 10Z", "#245447") : path("M-14 11Q-19-1-8-6Q-4-18 6-10Q20-11 18 2Q27 12 15 20Q4 29-5 21Q-19 24-20 14Z", "#548654") + path("M4-7Q16-7 15 3Q23 12 12 17Q5 22 0 18", "#356643")}</g>`;
const rock = (x: number, y: number, s = 1, color = "#9da6a0") => `<g transform="translate(${x} ${y}) scale(${s})">
  ${path("M-15 7-8-9 4-13 16 0 13 13-2 18Z", color)}
  ${path("M-8-9 0 3 16 0M0 3-2 18", "none")}</g>`;
const crystal = (x: number, y: number, s = 1, color = "#69bbcc") => `<g transform="translate(${x} ${y}) scale(${s})">
  ${path("M0-20 10-8 8 15 0 22-9 14-10-8Z", color)}
  ${path("M0-20 0 22M-10-8 0-3 10-8", "none")}</g>`;
const crate =
  ground +
  path("M9 19 33 9 56 21 56 47 32 58 9 46Z", "#b88d56") +
  path("M9 19 32 31 56 21M32 31V58M14 28 27 49M27 35 14 40M38 35 51 45M51 29 38 51", "none");
const barrel = (x: number, y: number, color = "#b48a57") => `<g transform="translate(${x} ${y})">
  ${path("M-10-14Q-16 0-10 15Q0 23 10 15Q16 0 10-14Z", color)}
  ${ellipse(0, -14, 10, 5, "#d8b97a")}${path("M-12-7Q0 0 12-7M-12 8Q0 15 12 8", "none", 'stroke="#647a7b" stroke-width="3"')}</g>`;
const animal = (color = "#d8c3a0", mane = false) =>
  ground +
  path("M10 39 15 23 23 18 39 22 47 13 56 18 51 28 45 30 43 49 38 51 36 35 25 35 20 51 15 50 17 34Z", color) +
  path("M13 25 7 18 6 30M46 15 45 7 50 11M51 21H53", "none") +
  (mane ? path("M43 17 38 26 42 34 47 28Z", "#674e45") : "");
const water = path(
  "M5 46Q15 40 25 46T45 46T61 46M7 54Q17 48 27 54T47 54T59 54",
  "none",
  'stroke="#65a6bc" stroke-width="3"'
);
const weapon = `<g transform="translate(32 32) rotate(40)">${path("M-4-25 0-30 4-25 3 12-3 12Z", "#c4d6db")}${path("M-11 12H11M0 12V26", "none", 'stroke="#ad884b" stroke-width="5"')}</g>`;

const entries: Array<[RpgAssetCategory, string, string, string, string]> = [
  [
    "settlements",
    "capital",
    "Royal Castle",
    "왕성",
    ground +
      tower(10, 17, 0.75) +
      tower(38, 17, 0.75) +
      house(19, 13, 1, "#587f98") +
      tower(25, 4, 0.7) +
      path("M31 4V-1L43 3 31 7", "#b84e59")
  ],
  [
    "settlements",
    "city",
    "Walled City",
    "성곽 도시",
    ground +
      house(13, 13, 0.8) +
      house(30, 18, 0.7) +
      path("M7 31 30 43 56 30V47L31 60 7 47Z", "#b9baa7") +
      path("M26 57V47Q32 41 37 47V57", "#3f4d4c") +
      tower(4, 20, 0.55) +
      tower(49, 20, 0.55)
  ],
  [
    "settlements",
    "town",
    "Market Town",
    "장터 마을",
    ground + house(7, 16, 0.8) + house(28, 8, 0.9) + house(30, 31, 0.65) + path("M7 41 19 35 29 40 17 47Z", "#e8bc68")
  ],
  ["settlements", "village", "Village", "마을", ground + tree(47, 26, 0.6) + house(5, 23, 0.85) + house(26, 15, 0.8)],
  [
    "settlements",
    "hamlet",
    "Hamlet",
    "작은 마을",
    ground + tree(45, 26, 0.55) + house(13, 19, 1, "#b59762") + path("M8 49 20 54M9 44V52M15 47V55", "none")
  ],
  [
    "settlements",
    "fort",
    "Fortress",
    "요새",
    ground +
      path("M13 24 34 13 53 25V49L33 59 13 49Z", "#aeb3a8") +
      tower(5, 16, 0.7, "#76526b") +
      tower(43, 16, 0.7, "#76526b") +
      path("M26 56V43Q33 35 40 43V55", "#354749")
  ],
  [
    "settlements",
    "outpost",
    "Watch Post",
    "감시 초소",
    ground +
      tower(23, 8, 1, "#7b6658") +
      path("M25 38 13 58M28 46H20M30 40H23", "none") +
      path("M31 8V1L44 5 31 9", "#bca451")
  ],
  [
    "settlements",
    "harbor",
    "Harbor",
    "항구",
    water +
      house(8, 15, 0.8, "#4c8594") +
      path("M31 37 56 24V30L31 43Z", "#ae8b63") +
      path("M40 45 59 37 55 49 46 53Z", "#835b4d") +
      path("M50 39V17L61 32Z", "#e3d4ad")
  ],
  [
    "settlements",
    "caravan",
    "Caravanserai",
    "대상 숙영지",
    ground +
      path("M7 44 18 19 29 45Z", "#cdab73") +
      path("M25 48 40 13 58 47Z", "#b76c58") +
      path("M40 22 34 48 47 48Z", "#554b45")
  ],
  [
    "landmarks",
    "volcano",
    "Volcano",
    "화산",
    ground +
      path("M5 53 24 20 42 20 60 53 36 59Z", "#7a7b79") +
      path("M24 20 33 26 42 20 38 37 31 33 26 45 22 37Z", "#d4784b") +
      path("M29 16Q18 5 30 2Q44-1 43 10Q53 16 38 17", "#abb2a8")
  ],
  [
    "landmarks",
    "mine",
    "Mine",
    "광산",
    ground +
      rock(32, 34, 1.6) +
      path("M20 53V34Q32 20 45 34V53Z", "#364143") +
      path("M18 55V31H46V55M24 49 40 40M26 56 43 46", "none", 'stroke="#a78254" stroke-width="4"')
  ],
  [
    "landmarks",
    "bridge",
    "Stone Bridge",
    "석교",
    water +
      path("M5 35 48 12 59 20V38L51 43V29Q41 24 35 38V51L27 55V40Q18 35 13 48L5 52Z", "#b4b5a3") +
      path("M5 35 15 40 59 20M15 40V47", "none")
  ],
  [
    "landmarks",
    "inn",
    "Inn",
    "여관",
    ground +
      house(7, 15, 1.25) +
      path("M46 25V12H59V29H48", "none", 'stroke="#7e6548" stroke-width="3"') +
      path("M48 16H56V24H48Z", "#dfb85d")
  ],
  [
    "landmarks",
    "lighthouse",
    "Lighthouse",
    "등대",
    water +
      path("M21 52 25 17 39 17 45 52Z", "#e3d9bb") +
      path("M24 27H40L42 36H23Z", "#b76b5b") +
      path("M22 17V8H42V17ZM19 8 32 1 45 8Z", "#537a86") +
      path("M27 10H37V16H27Z", "#f5d97c")
  ],
  [
    "landmarks",
    "waterfall",
    "Waterfall",
    "폭포",
    ground +
      rock(17, 30, 1.2) +
      rock(48, 30, 1.2) +
      path("M23 15 39 13 42 49Q32 62 20 49Z", "#80bfca") +
      path("M28 18V48M35 19 36 50", "none", 'stroke="#e4f1eb" stroke-width="3"') +
      water
  ],
  [
    "landmarks",
    "battlefield",
    "Battlefield",
    "전장",
    `${ground + weapon}<g transform="translate(64 0) scale(-1 1)">${weapon}</g>${path("M20 40 32 35 44 40 42 52 32 59 22 52Z", "#a55e61")}`
  ],
  [
    "landmarks",
    "dungeon",
    "Dungeon",
    "던전",
    ground +
      path("M9 52V24L20 13H46L56 25V52Z", "#9a9e96") +
      path("M20 52V31Q32 17 45 31V52Z", "#303d42") +
      path("M21 53H45M24 47H42M27 41H39", "none", 'stroke="#b3a68c" stroke-width="3"')
  ],
  [
    "landmarks",
    "ruins",
    "Ancient Ruins",
    "고대 유적",
    ground +
      path("M9 51V17L17 12 22 19V49M34 48V9L40 14 44 7 50 17V50", "#aaa997") +
      path("M8 19 51 14 53 23 21 27M24 54 32 43 40 53Z", "#c5bda2") +
      tree(50, 40, 0.35)
  ],
  [
    "landmarks",
    "tower",
    "Wizard Tower",
    "마법사의 탑",
    ground + tower(22, 4, 1.2, "#776294") + path("M13 48 19 51M46 18 50 23 55 18 50 13Z", "#d8bc6a")
  ],
  [
    "landmarks",
    "camp",
    "Encampment",
    "야영지",
    ground +
      path("M6 49 22 16 39 49Z", "#bf8f61") +
      path("M22 24 17 49 29 49Z", "#594d40") +
      path("M39 50 47 38 55 50 46 54Z", "#de8650") +
      path("M38 56 55 52M40 52 53 57", "none", 'stroke="#765542" stroke-width="3"')
  ],
  [
    "landmarks",
    "portal",
    "Arcane Portal",
    "차원문",
    ground +
      path("M15 53V24Q15 3 32 3Q49 3 49 24V53H40V25Q40 13 32 13Q24 13 24 25V53Z", "#9b9eae") +
      path("M24 52V26Q24 14 32 14Q40 14 40 26V52Z", "#67afbb") +
      path("M28 44Q43 32 29 25M28 50Q37 48 36 42", "none", 'stroke="#e3d4f0" stroke-width="2.5"')
  ],
  [
    "landmarks",
    "spring",
    "Freshwater Spring",
    "샘",
    ground +
      ellipse(32, 47, 24, 10, "#7fb8bb") +
      rock(18, 35, 0.6) +
      rock(46, 35, 0.7) +
      path("M28 43Q20 22 30 16Q40 25 35 42M22 46Q32 51 42 46", "none", 'stroke="#d6eeeb" stroke-width="3"')
  ],
  [
    "landmarks",
    "market",
    "Market",
    "시장",
    ground +
      path("M10 27V50L32 59 53 48V27M10 43 32 52 53 41", "none", 'stroke="#846949" stroke-width="3"') +
      path("M5 28 15 12 43 12 59 28Z", "#d8b977") +
      path("M17 28 22 12H31L30 28M40 28 38 12", "none", 'stroke="#ae5259" stroke-width="7"')
  ],
  [
    "landmarks",
    "library",
    "Library",
    "도서관",
    ground +
      house(8, 11, 1.2, "#5f7b8f") +
      path("M18 42Q25 36 32 41Q40 36 47 41V55Q39 51 32 55Q25 51 18 55ZM32 41V55", "#e8dab6")
  ],
  [
    "landmarks",
    "tomb",
    "Ancient Tomb",
    "고분",
    ground +
      path("M7 50 19 22 44 17 59 48 39 57Z", "#88947d") +
      path("M23 54V31H43V53M20 31H46V24H20Z", "#b7b29b") +
      path("M28 52V35H38V52Z", "#3d4745")
  ],
  [
    "landmarks",
    "monster-lair",
    "Creature Lair",
    "괴수 소굴",
    ground +
      rock(32, 33, 1.65, "#7c8983") +
      path("M15 51Q18 27 32 28Q48 26 51 51Z", "#293c3b") +
      ellipse(27, 40, 3, 2, "#e6bd58") +
      ellipse(40, 40, 3, 2, "#e6bd58")
  ],
  [
    "landmarks",
    "shipwreck",
    "Shipwreck",
    "난파선",
    water +
      path("M5 35 27 42 54 29 45 49 31 55 15 48Z", "#93725a") +
      path("M29 42 26 7M17 11 43 8M27 11 42 31 30 27Z", "#dfd1ac") +
      path("M13 41 19 46M37 44 44 39", "none")
  ],
  [
    "landmarks",
    "monument",
    "Monument",
    "기념비",
    ground +
      path("M16 53V45L32 38 49 45V53L32 60Z", "#a8a798") +
      path("M25 42V12L32 3 39 12V42L32 47Z", "#c1c0ab") +
      path("M32 3V47", "none")
  ],
  [
    "resources",
    "wood",
    "Timber",
    "목재",
    ground +
      tree(17, 18, 0.8, true) +
      path("M21 50 45 35Q59 32 58 42L34 57Z", "#b18b5b") +
      ellipse(29, 51, 7, 8, "#d8bc83") +
      ellipse(29, 51, 3, 4, "#b48d59")
  ],
  ["resources", "stone", "Stone", "석재", ground + rock(19, 40, 0.9) + rock(42, 32, 1.1) + rock(41, 50, 0.6)],
  [
    "resources",
    "ore",
    "Metal Ore",
    "금속 광석",
    ground + rock(20, 41, 1.1) + rock(43, 30, 1) + crystal(40, 35, 0.55, "#b88461") + crystal(17, 38, 0.4, "#bdc6c0")
  ],
  [
    "resources",
    "gold",
    "Precious Metals",
    "귀금속",
    ground +
      path("M8 39 17 24 39 27 30 44ZM30 44 39 27 56 34 48 51 26 57Z", "#d1ae50") +
      path("M8 39 30 44 26 57 8 50Z", "#ae873d") +
      ellipse(45, 51, 8, 4, "#ebce76")
  ],
  [
    "resources",
    "grain",
    "Grain",
    "곡물",
    ground +
      path("M22 55 25 17M33 54 38 9M42 56 51 23", "none", 'stroke="#aa8644" stroke-width="3"') +
      path(
        "M25 34Q8 32 13 23Q25 25 25 34Q40 29 35 21Q25 25 25 34M36 30Q22 25 26 16Q38 19 36 30Q51 25 48 15Q38 18 36 30M47 40Q34 37 39 29Q49 31 47 40Q61 35 58 27Q49 29 47 40",
        "#ddbc67"
      )
  ],
  [
    "resources",
    "fish",
    "Fish",
    "어류",
    water +
      path("M9 30Q26 10 47 28L59 16V43L47 33Q27 53 9 30Z", "#82acb5") +
      path("M29 21 25 11 40 21M25 39 34 48 40 38", "#4e8795") +
      ellipse(18, 28, 2, 2, "#293b42")
  ],
  ["resources", "livestock", "Livestock", "가축", animal()],
  [
    "resources",
    "gems",
    "Gemstones",
    "보석",
    ground + crystal(21, 32, 0.9, "#7da4c6") + crystal(43, 37, 0.8, "#a284b1") + crystal(33, 48, 0.55, "#77b6a0")
  ],
  [
    "resources",
    "herbs",
    "Plants and Spices",
    "약초·향신료",
    ground +
      path("M31 54V19M31 40Q11 43 12 28Q28 23 31 40M31 30Q48 32 51 18Q34 12 31 30", "#6c955a") +
      path("M26 54 21 44H45L40 54Z", "#bd8e65") +
      ellipse(30, 14, 5, 6, "#b7799b")
  ],
  [
    "resources",
    "silk",
    "Textiles",
    "직물",
    ground +
      path("M10 17 42 8 54 16V47L24 57 10 48Z", "#bd8eaf") +
      path("M10 17 24 26 54 16M24 26V57M16 23V45M30 25V48M40 22V45", "none", 'stroke="#e1bed1" stroke-width="2"')
  ],
  [
    "resources",
    "salt",
    "Salt",
    "소금",
    ground +
      path("M6 51 24 24 35 38 45 29 59 52 35 58Z", "#dedfcd") +
      path("M24 24 27 48 35 58 6 51Z", "#f5efd8") +
      barrel(48, 39, "#9b9b80")
  ],
  ["resources", "crate", "Crafted Goods", "제작품", crate],
  ["resources", "horses", "Mounts", "탈것", animal("#a48062", true)],
  [
    "resources",
    "honey",
    "Honey and Wine",
    "꿀·포도주",
    ground +
      barrel(22, 33) +
      barrel(44, 43, "#9e7550") +
      path("M18 16Q23 10 28 16M20 21H26", "none", 'stroke="#e6bd55" stroke-width="3"')
  ],
  [
    "resources",
    "coal",
    "Coal",
    "석탄",
    ground + rock(20, 41, 1.1, "#566065") + rock(43, 31, 1, "#3e4d55") + rock(41, 50, 0.6, "#69747a")
  ],
  [
    "resources",
    "oil",
    "Oil and Tar",
    "석유·타르",
    ground + barrel(31, 35, "#686c65") + path("M31 20Q16 35 25 41Q36 48 39 37Q40 31 31 20Z", "#293b43")
  ]
];

export const RPG_MAP_ASSETS: readonly RpgMapAsset[] = entries.map(([category, id, en, ko, body]) => {
  const image = category === "resources" ? RESOURCE_TOKEN_IMAGES[id] : LOCATION_TOKEN_IMAGES[id];
  return {
    id: `rpg-${id}`,
    category,
    en,
    ko,
    viewBox: image ? "0 0 64 64" : "0 -2 64 66",
    // Embed once per symbol so exported maps and globe textures do not depend on asset URLs.
    body: image
      ? `<image href="${image}" width="64" height="64" preserveAspectRatio="xMidYMid meet"/>`
      : `<g stroke="#344548" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${body}</g>`
  };
});
const assetIds = new Set(RPG_MAP_ASSETS.map(asset => asset.id));
export const isRpgAsset = (icon: string): boolean => assetIds.has(icon.replace(/^#/, ""));
export const getRpgAsset = (icon: string): RpgMapAsset | undefined =>
  RPG_MAP_ASSETS.find(asset => asset.id === icon.replace(/^#/, ""));

export const SETTLEMENT_ASSETS: Record<string, string> = {
  capital: "capital",
  city: "city",
  town: "town",
  village: "village",
  hamlet: "hamlet",
  fort: "fort",
  monastery: "fort",
  caravanserai: "caravan",
  trading_post: "town",
  post: "outpost"
};

const markerAssets: Record<string, [string, string]> = {
  volcanoes: ["🌋", "volcano"],
  "hot-springs": ["♨️", "spring"],
  "water-sources": ["💧", "spring"],
  mines: ["⛏️", "mine"],
  bridges: ["🌉", "bridge"],
  inns: ["🍻", "inn"],
  lighthouses: ["🚨", "lighthouse"],
  waterfalls: ["⟱", "waterfall"],
  battlefields: ["⚔️", "battlefield"],
  dungeons: ["🗝️", "dungeon"],
  "lake-monsters": ["🐉", "monster-lair"],
  "sea-monsters": ["🦑", "monster-lair"],
  "hill-monsters": ["👹", "monster-lair"],
  brigands: ["💰", "camp"],
  pirates: ["🏴‍☠️", "shipwreck"],
  statues: ["🗿", "monument"],
  ruins: ["🏺", "ruins"],
  libraries: ["📚", "library"],
  circuses: ["🎪", "market"],
  jousts: ["🤺", "battlefield"],
  fairs: ["🎠", "market"],
  canoes: ["🛶", "harbor"],
  migration: ["🐗", "livestock"],
  dances: ["💃🏽", "market"],
  mirage: ["💦", "spring"],
  caves: ["🦇", "dungeon"],
  portals: ["🌀", "portal"],
  rifts: ["🎆", "portal"],
  "disturbed-burials": ["💀", "tomb"],
  necropolises: ["🪦", "tomb"],
  encounters: ["🧙", "tower"]
};
export function migrateMarkerIcon(type: string | undefined, icon: string): string {
  if (type === "dances" && icon === "#rpg-town") return "#rpg-market";
  const entry = markerAssets[type || ""];
  return entry && entry[0] === icon ? `#rpg-${entry[1]}` : icon;
}

const resourceFamilies: Record<string, string[]> = {
  wood: ["wood", "tropicalTimber"],
  stone: ["stone", "marble", "clay", "sand"],
  ore: ["iron", "copper", "tin", "bronze"],
  gold: ["gold", "silver", "coins", "jewelry"],
  grain: ["grain", "sugar", "dates", "olives"],
  fish: ["fish", "whales", "salted-fish"],
  livestock: ["cattle", "game", "sheep", "furs", "leather"],
  gems: ["gemstones", "pearls", "amber"],
  herbs: ["spices", "tea", "tobacco", "incense", "dyes"],
  silk: ["silk", "cloth", "garments", "hemp", "sails"],
  salt: ["salt", "saltpeter"],
  horses: ["horses", "camels", "elephants"],
  honey: ["honey", "wine", "barrels"],
  coal: ["coal"],
  oil: ["oil", "tar"],
  crate: [
    "slaves",
    "ceramics",
    "glass",
    "ropes",
    "paper",
    "ink",
    "books",
    "ships",
    "boots",
    "harnesses",
    "tools",
    "arms",
    "gunpowder",
    "artillery"
  ]
};
const resourceAssets = new Map<string, string>(
  Object.entries(resourceFamilies).flatMap(([asset, names]) =>
    names.map(name => [`good-${name}`, `#rpg-${asset}`] as const)
  )
);
export function getRpgResourceIcon(icon: string): string {
  return resourceAssets.get(icon.replace(/^#/, "")) || (icon.startsWith("#") ? icon : `#${icon}`);
}

export interface ResourceSite {
  cell: number;
  good: number;
  x: number;
  y: number;
}

export function selectResourceSites(sites: readonly ResourceSite[], spacing: number): ResourceSite[] {
  if (spacing <= 0) return [...sites];
  const frequency = new Map<number, number>();
  for (const site of sites) frequency.set(site.good, (frequency.get(site.good) || 0) + 1);
  const sorted = [...sites].sort((a, b) => frequency.get(a.good)! - frequency.get(b.good)! || a.cell - b.cell);
  const buckets = new Map<string, ResourceSite[]>();
  const selected: ResourceSite[] = [];
  for (const site of sorted) {
    const bx = Math.floor(site.x / spacing);
    const by = Math.floor(site.y / spacing);
    let blocked = false;
    for (let dx = -1; dx <= 1 && !blocked; dx++) {
      for (let dy = -1; dy <= 1 && !blocked; dy++) {
        blocked = (buckets.get(`${bx + dx},${by + dy}`) || []).some(
          other => (other.x - site.x) ** 2 + (other.y - site.y) ** 2 < spacing ** 2
        );
      }
    }
    if (blocked) continue;
    const key = `${bx},${by}`;
    buckets.set(key, [...(buckets.get(key) || []), site]);
    selected.push(site);
  }
  return selected.sort((a, b) => a.cell - b.cell);
}
