import type { UnderwaterMap } from "@/types/underwater";

export const SEABED_GEOLOGY_VERSION = 3;
export const SEA_RELATIONS = ["allied", "trade", "neutral", "rival", "war"] as const;
export const SEABED_TERRAINS = [
  { ko: "육지", en: "Land", color: "#373f3d", description: "해양 지형에서 제외하는 육지" },
  {
    ko: "대륙붕",
    en: "Continental shelf",
    color: "#4f9eac",
    description: "대체로 200m 이하의 연안 지형. 수동형 주변부에서 더 넓게 생성"
  },
  {
    ko: "대륙사면",
    en: "Continental slope",
    color: "#25627f",
    description: "대륙붕 끝에서 깊은 바다로 내려가는 경사면. 활동형 주변부에서 더 좁고 급하게 생성"
  },
  { ko: "심해평원", en: "Abyssal plain", color: "#12334f", description: "수심 3000~6000m의 낮은 기복을 가진 심해저" },
  {
    ko: "해구",
    en: "Ocean trench",
    color: "#080f2a",
    description: "활동성 대륙 주변부에 놓이는 6000m 이상의 좁고 깊은 골짜기"
  },
  {
    ko: "중앙해령",
    en: "Mid-ocean ridge",
    color: "#39788a",
    description: "주변 심해저보다 약 2000~4000m 솟은 대양 내부의 산맥"
  },
  { ko: "산호초", en: "Reef", color: "#59ad91", description: "얕은 연안의 산호초 군락" },
  {
    ko: "대륙대",
    en: "Continental rise",
    color: "#3b7087",
    description: "완만한 퇴적성 사면 기슭. 수동형 대륙 주변부에 배치"
  },
  {
    ko: "해저 협곡",
    en: "Submarine canyon",
    color: "#213c67",
    description: "양쪽 주변부에 생성하는 절개 유로. 활동형에서는 더 짧고 촘촘하게 가지침"
  },
  {
    ko: "해령 열곡",
    en: "Axial rift valley",
    color: "#244861",
    description: "해령 어깨보다 낮은 축부 골짜기. 느린 확장 모티프에서 더 크게 생성"
  },
  { ko: "해산", en: "Seamount", color: "#69877f", description: "주변 해저보다 1000m 이상 솟는 고립된 해저 산" },
  { ko: "평정해산", en: "Guyot", color: "#9aaa88", description: "정상부가 평평한 해산" },
  {
    ko: "해저 선상지",
    en: "Submarine fan",
    color: "#aa9479",
    description: "협곡 하단 바깥으로 부채꼴로 펼쳐지는 퇴적 지형"
  },
  { ko: "심해 구릉", en: "Abyssal hills", color: "#344f70", description: "심해저의 수백 미터 규모 낮은 기복" },
  { ko: "해연", en: "Trench deep", color: "#040817", description: "해구 내부에 국지적으로 더 깊게 패인 함몰부" },
  {
    ko: "해양 단열대",
    en: "Fracture zone",
    color: "#767398",
    description: "해령 바깥 심해저까지 이어지는 선형 단층 지형"
  }
] as const;
export const SEABED_COLORS = SEABED_TERRAINS.map(t => t.color);
export const SEABED_DETAILS_EN = [
  "Land excluded from the marine floor.",
  "A coastal platform, generally shallower than 200 m; generated wider at passive margins.",
  "The descent from the shelf edge; generated narrower and steeper at active margins.",
  "Low-relief deep-ocean floor at approximately 3000–6000 m depth.",
  "A narrow subduction-style depression deeper than 6000 m.",
  "An oceanic mountain system rising about 2000–4000 m above its surroundings.",
  "A shallow coastal reef complex.",
  "A gentle sedimentary apron at the foot of a passive continental slope.",
  "A seaward incision at either margin type; active-margin canyons are shorter, closer and more branched.",
  "An axial depression, generated larger for a slow-spreading ridge motif.",
  "An isolated submarine mountain with at least 1000 m of relief.",
  "A flat-topped seamount.",
  "A fan-shaped sediment body beyond a canyon mouth.",
  "Low abyssal relief of a few hundred metres.",
  "A local depression within a trench.",
  "A linear fault-related feature extending across the abyssal floor."
] as const;
export const SEA_PEOPLES = [
  {
    id: "merfolk",
    name: "진주조개 연맹",
    people: "멀포크",
    color: "#75d0b5",
    depth: 120,
    notes: "대륙붕의 거주지와 산호초 항구를 잇는 연맹. 해초 숲 보전과 연안 교역을 공동 의제로 삼는다."
  },
  {
    id: "sahuagin",
    name: "붉은이빨 군락",
    people: "사후아긴",
    color: "#e08778",
    depth: 1800,
    notes: "대륙사면의 요새 거주지들이 맺은 연합. 해저 자원과 이동로의 통제권을 둘러싸고 이웃 세력과 협상한다."
  },
  {
    id: "triton",
    name: "청동삼지창 수호령",
    people: "트리톤",
    color: "#83a9ef",
    depth: 3600,
    notes: "심해 항로를 감시하는 도시들의 협약. 해구에서 비롯되는 위협에 공동 대응하고 안전한 통행을 중재한다."
  },
  {
    id: "sea-elf",
    name: "별산호 동맹",
    people: "바다 엘프",
    color: "#ceaae7",
    depth: 160,
    notes: "산호초 거주지들이 구성한 동맹. 산호 정원과 유산을 보호하고 다른 연안 공동체와 교류한다."
  },
  {
    id: "locathah",
    name: "해초길 조합",
    people: "로카타",
    color: "#e9ce7b",
    depth: 400,
    notes: "교역항과 수중 대상단을 연결하는 조합. 대륙붕과 사면 사이의 물자 중계 및 통행 협정을 관리한다."
  },
  {
    id: "kuo-toa",
    name: "검은샘 신정회",
    people: "쿠오토아",
    color: "#dd9cbe",
    depth: 6500,
    notes: "깊은 수역의 사원 거주지와 침수 동굴 성지를 잇는 회합. 순례로와 성지 주변의 자원을 공동 관리한다."
  }
] as const;
export const seabedIndex = (map: UnderwaterMap, x: number, y: number) =>
  Math.min(map.rows - 1, Math.max(0, Math.floor(y * map.rows))) * map.columns +
  Math.min(map.columns - 1, Math.max(0, Math.floor(x * map.columns)));

export function isUnderwaterMap(value: unknown): value is UnderwaterMap {
  if (!value || typeof value !== "object") return false;
  const m = value as UnderwaterMap;
  if (
    m.version !== 1 ||
    typeof m.seed !== "string" ||
    !m.seed.trim() ||
    m.seed.length > 120 ||
    !Number.isSafeInteger(m.generation) ||
    m.generation < 1 ||
    !Number.isInteger(m.columns) ||
    m.columns < 24 ||
    m.columns > 192 ||
    !Number.isInteger(m.rows) ||
    m.rows < 24 ||
    m.rows > 192 ||
    !["combined", "terrain", "political"].includes(m.view) ||
    !Array.isArray(m.factionIds) ||
    m.factionIds.length > 500 ||
    !Array.from(m.factionIds).every(id => typeof id === "string") ||
    new Set(m.factionIds).size !== m.factionIds.length
  )
    return false;
  const size = m.columns * m.rows;
  if (m.geologyVersion !== undefined && m.geologyVersion !== 2 && m.geologyVersion !== 3) return false;
  if (m.features !== undefined && m.geologyVersion === undefined) return false;
  if (
    m.features !== undefined &&
    (!Array.isArray(m.features) ||
      m.features.length > 200 ||
      !Array.from(m.features).every(
        f =>
          f &&
          Number.isInteger(f.kind) &&
          f.kind > 0 &&
          f.kind < SEABED_TERRAINS.length &&
          Number.isFinite(f.x) &&
          f.x >= 0 &&
          f.x <= 1 &&
          Number.isFinite(f.y) &&
          f.y >= 0 &&
          f.y <= 1 &&
          (f.margin === undefined || (f.kind === 8 && ["active", "passive"].includes(f.margin))) &&
          (f.lengthCells === undefined ||
            (f.kind === 8 && Number.isInteger(f.lengthCells) && f.lengthCells >= 2 && f.lengthCells <= 192)) &&
          (f.tributaries === undefined ||
            (f.kind === 8 && Number.isInteger(f.tributaries) && f.tributaries >= 0 && f.tributaries <= 4)) &&
          (f.spreading === undefined || ([5, 9].includes(f.kind) && ["slow", "fast"].includes(f.spreading))) &&
          [f.relief, f.baseDepth, f.summitDepth].every(
            v => v === undefined || (Number.isFinite(v) && v >= 0 && v <= 11000)
          )
      ))
  )
    return false;
  if (![m.depths, m.terrain, m.owners].every(a => Array.isArray(a) && a.length === size)) return false;
  return Array.from(m.depths).every(
    (d, i) =>
      Number.isInteger(d) &&
      d >= 0 &&
      d <= 11000 &&
      Number.isInteger(m.terrain[i]) &&
      m.terrain[i] >= 0 &&
      m.terrain[i] < (m.geologyVersion ? SEABED_TERRAINS.length : 7) &&
      Number.isInteger(m.owners[i]) &&
      m.owners[i] >= 0 &&
      m.owners[i] <= m.factionIds.length &&
      (d === 0 ? m.terrain[i] === 0 && m.owners[i] === 0 : m.terrain[i] !== 0)
  );
}
