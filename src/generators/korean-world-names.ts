import Alea from "alea";

const beginnings = [
  "아",
  "에",
  "엘",
  "오",
  "이",
  "라",
  "레",
  "로",
  "루",
  "리",
  "마",
  "메",
  "모",
  "미",
  "바",
  "베",
  "벨",
  "보",
  "브",
  "사",
  "세",
  "소",
  "수",
  "시",
  "실",
  "아르",
  "알",
  "어",
  "에르",
  "올",
  "우",
  "유",
  "은",
  "자",
  "제",
  "조",
  "카",
  "케",
  "코",
  "크",
  "타",
  "테",
  "토",
  "투",
  "티",
  "파",
  "페",
  "포",
  "프",
  "하",
  "헤",
  "호",
  "휘",
  "다",
  "데",
  "도",
  "드",
  "나",
  "네",
  "노",
  "누",
  "니",
  "가",
  "게"
];
const middles = [
  "라",
  "레",
  "리",
  "루",
  "로",
  "나",
  "네",
  "니",
  "노",
  "다",
  "데",
  "디",
  "도",
  "마",
  "메",
  "미",
  "모",
  "바",
  "베",
  "비",
  "사",
  "세",
  "시",
  "소",
  "아",
  "에",
  "오",
  "유",
  "이",
  "테",
  "카",
  "하"
];
const endings = [
  "온",
  "안",
  "엔",
  "엘",
  "아",
  "오",
  "움",
  "인",
  "라",
  "론",
  "렌",
  "린",
  "르",
  "루",
  "리",
  "스",
  "스카",
  "시아",
  "리아",
  "리온",
  "미아",
  "니아",
  "노르",
  "도르",
  "디아",
  "토르",
  "카",
  "칸",
  "타",
  "테라",
  "하임",
  "델"
];

export function generateKoreanName(random: () => number = Math.random): string {
  const pick = (values: string[]) => values[Math.floor(random() * values.length)];
  return `${pick(beginnings)}${pick(middles)}${pick(endings)}`;
}

export const GOVERNMENT_NAMES: Record<string, string> = {
  Monarchy: "왕국",
  Duchy: "공국",
  "Grand Duchy": "대공국",
  Principality: "공국",
  Kingdom: "왕국",
  Empire: "제국",
  Republic: "공화국",
  "Most Serene Republic": "상업 공화국",
  Federation: "연방 공화국",
  "Trade Company": "상업국",
  Oligarchy: "과두 공화국",
  Tetrarchy: "사두정국",
  Triumvirate: "삼두정국",
  Diarchy: "양두정국",
  Junta: "군사정권국",
  Union: "연합국",
  League: "동맹국",
  Confederation: "연맹국",
  Confederacy: "연맹국",
  "United Kingdom": "연합왕국",
  "United Republic": "연합공화국",
  "United Provinces": "연방국",
  "United States": "연방국",
  Commonwealth: "연방국",
  Heptarchy: "칠왕국",
  Theocracy: "교국",
  Thearchy: "신정국",
  Brotherhood: "기사단국",
  See: "교국",
  "Holy State": "성국",
  Diocese: "교국",
  Bishopric: "교국",
  Eparchy: "교국",
  Exarchate: "교국",
  Patriarchate: "교국",
  Imamah: "교국",
  "Divine Duchy": "신성 공국",
  "Divine Grand Duchy": "신성 대공국",
  "Divine Principality": "신성 공국",
  "Divine Kingdom": "신성 왕국",
  "Divine Empire": "신성 제국",
  Caliphate: "칼리프국",
  Anarchy: "자치국",
  "Free Territory": "자유국",
  Council: "평의회국",
  Commune: "자치공화국",
  Community: "자치국",
  "Free City": "자유도시국",
  "City-state": "도시국가",
  Marches: "변경백국",
  Dominion: "자치령",
  Protectorate: "보호국",
  Khanate: "칸국",
  Khaganate: "카간국",
  Tsardom: "차르국",
  Shogunate: "막부국",
  Sultanate: "술탄국",
  Beylik: "공국",
  Emirate: "토후국",
  Despotate: "전제국",
  Ulus: "울루스국",
  Horde: "유목국",
  Satrapy: "총독국",
  Viceroyalty: "부왕국",
  Chancellery: "공화국",
  Conglomerate: "연합국",
  "United Hordes": "유목 연합국",
  "United Tribes": "부족 연합국",
  Tribes: "부족국"
};

export function koreanStateFullName(state: { name: string; formName?: string; form?: string }): string {
  const form = state.formName || state.form;
  if (!form) return state.name;
  const suffix = GOVERNMENT_NAMES[form] || form;
  return [state.name, suffix].filter(Boolean).join(" ");
}

interface NamedEntity {
  i: number;
  name?: string;
  removed?: boolean;
  lock?: boolean;
}
interface NamingWorld {
  burgs: NamedEntity[];
  states: (NamedEntity & { name: string; formName?: string; form?: string; fullName?: string })[];
  provinces: (NamedEntity & { formName?: string; fullName?: string })[];
  rivers: NamedEntity[];
  features: (NamedEntity & { type?: string })[];
}

// A dedicated seeded stream makes conversion independent of rendering and generation order.
export function koreanizeWorldNames(world: NamingWorld, seed: string): boolean {
  let changed = false;
  const translated = new Map<string, string>();
  const rename = (entity: NamedEntity, kind: string) => {
    if (entity.removed || entity.lock || !entity.name || !/[a-z]/i.test(entity.name)) return;
    const original = entity.name;
    const name =
      translated.get(original) || generateKoreanName(Alea(`${seed}:korean-names-v1:${kind}:${entity.i}:${original}`));
    translated.set(original, name);
    entity.name = name;
    changed = true;
  };
  for (const burg of world.burgs) if (burg.i) rename(burg, "burg");
  for (const state of world.states) {
    if (!state.i && state.name === "Neutrals") {
      state.name = "무소속";
      changed = true;
    }
    if (!state.i || state.removed || state.lock) continue;
    rename(state, "state");
    const fullName = koreanStateFullName(state);
    if (state.fullName !== fullName && (!state.fullName || /[a-z]/i.test(state.fullName))) {
      state.fullName = fullName;
      changed = true;
    }
  }
  for (const province of world.provinces) {
    if (!province?.i || province.removed || province.lock) continue;
    rename(province, "province");
    const fullName = `${province.name} 영지`;
    if (province.fullName !== fullName || province.formName !== "영지") {
      province.formName = "영지";
      province.fullName = fullName;
      changed = true;
    }
  }
  for (const river of world.rivers || []) rename(river, "river");
  for (const feature of world.features || []) if (feature.type === "lake") rename(feature, "lake");
  return changed;
}
