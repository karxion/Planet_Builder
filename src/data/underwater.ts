import type { UnderwaterMap } from "@/types/underwater";

export const SEA_RELATIONS = ["allied", "trade", "neutral", "rival", "war"] as const;
export const SEABED_COLORS = ["#373f3d", "#4f9eac", "#25627f", "#12334f", "#080f2a", "#39788a", "#59ad91"];
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
  if (![m.depths, m.terrain, m.owners].every(a => Array.isArray(a) && a.length === size)) return false;
  return Array.from(m.depths).every(
    (d, i) =>
      Number.isInteger(d) &&
      d >= 0 &&
      d <= 11000 &&
      Number.isInteger(m.terrain[i]) &&
      m.terrain[i] >= 0 &&
      m.terrain[i] <= 6 &&
      Number.isInteger(m.owners[i]) &&
      m.owners[i] >= 0 &&
      m.owners[i] <= m.factionIds.length &&
      (d === 0 ? m.terrain[i] === 0 && m.owners[i] === 0 : m.terrain[i] !== 0)
  );
}
