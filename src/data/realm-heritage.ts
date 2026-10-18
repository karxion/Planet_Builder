import type { DeityRank, DndAlignment, ItemRarity } from "@/types/realm-heritage";

export const ITEM_RARITIES = { rare: "레어", veryRare: "베리 레어", legendary: "레젠더리" } satisfies Record<
  ItemRarity,
  string
>;
export const ALIGNMENTS = {
  LG: "질서 선",
  NG: "중립 선",
  CG: "혼돈 선",
  LN: "질서 중립",
  N: "참 중립",
  CN: "혼돈 중립",
  LE: "질서 악",
  NE: "중립 악",
  CE: "혼돈 악"
} satisfies Record<DndAlignment, string>;
export const DEITY_RANKS = { lesser: "소신격", intermediate: "중신격", greater: "대신격" } satisfies Record<
  DeityRank,
  string
>;

export const ALIGNMENT_TENETS: Record<DndAlignment, string> = {
  LG: "공동체의 법과 자비를 함께 지킨다",
  NG: "규칙보다 고통받는 이를 돕는 일을 우선한다",
  CG: "억압에 맞서 개인의 양심과 자유를 지킨다",
  LN: "선악보다 전통과 계약의 이행을 중시한다",
  N: "어느 편에도 치우치지 않고 균형을 추구한다",
  CN: "타인의 질서보다 신자의 선택과 자유를 중시한다",
  LE: "엄격한 위계와 계약으로 권력을 확장한다",
  NE: "필요하다면 타인의 희생으로 교단의 이익을 추구한다",
  CE: "기존 질서를 파괴하고 억제되지 않는 욕망과 힘을 숭배한다"
};
export const ITEM_POWER_SCOPE: Record<ItemRarity, string> = {
  rare: "주로 개인 또는 소규모 집단에 영향을 미치는 권능이다",
  veryRare: "의례를 통해 성채나 공동체에 큰 영향을 미치는 권능이다",
  legendary: "중대한 대가와 의례를 통해 국가의 운명에 영향을 미칠 수 있다"
};

export const TREASURE_MOTIFS = [
  {
    name: "첫 맹세의 왕관",
    power: "맹세의 진위를 드러내고 정신을 침범하는 마법에 저항한다",
    symbolism: "건국자의 맹세와 통치의 정통성",
    rp: "즉위식에서 인정받은 소지자만 통치 계승의 증인으로 받아들여진다"
  },
  {
    name: "새벽의 검",
    power: "어둠을 걷어내는 빛을 발하며 초자연적 적을 물리친다",
    symbolism: "도시를 구한 수호자의 용기",
    rp: "시민은 검을 지킨 인물을 수호자의 후계로 여기지만 남용하면 공개 재판을 요구한다"
  },
  {
    name: "별길의 구슬",
    power: "잊힌 길과 결계의 흔적을 보여주고 먼 곳의 위험을 감지한다",
    symbolism: "개척과 귀환의 약속",
    rp: "귀환 의례에서 구슬을 든 자는 길 잃은 이들의 보호를 약속해야 한다"
  },
  {
    name: "불멸의 인장",
    power: "약속의 흔적을 보존하고 위조된 권능을 밝혀낸다",
    symbolism: "여러 가문이 함께 세운 공동체",
    rp: "인장의 승인이 없는 조약은 전통을 중시하는 가문들에게 정통성을 인정받지 못한다"
  },
  {
    name: "겨울을 넘긴 성배",
    power: "생명을 회복시키고 오래된 저주를 정화한다",
    symbolism: "기근을 견딘 공동체의 연대",
    rp: "성배를 공개한 소지자에게 백성은 구호를 청하며 독점하려는 귀족을 비난한다"
  },
  {
    name: "메아리의 서",
    power: "선대의 기억을 불러내어 숨겨진 진실을 탐색한다",
    symbolism: "역사를 지키는 기록자의 책임",
    rp: "책을 지닌 자는 역사 논쟁의 중재자로 초대되지만 공개한 비밀의 책임도 져야 한다"
  }
];

export const TREASURE_EPITHETS = [
  "계승",
  "서약",
  "봉인",
  "영원",
  "태초",
  "승리",
  "추모",
  "수호",
  "희망",
  "귀환",
  "화합",
  "구원"
];

export const FAITH_MOTIFS = [
  {
    name: "새벽의 서약",
    symbol: "일곱 광선 사이에서 떠오르는 금빛 태양",
    doctrine: "약자를 지키고 거짓 맹세를 경계한다"
  },
  { name: "별의 기록", symbol: "펼친 책 위에 놓인 은빛 별", doctrine: "지식을 보존하고 신비의 대가를 잊지 않는다" },
  { name: "푸른 순환", symbol: "뿌리와 가지가 원을 이루는 나무", doctrine: "자연의 순환과 삶의 균형을 존중한다" },
  {
    name: "황혼의 문",
    symbol: "검은 문 안에 떠오른 흰 초승달",
    doctrine: "끝과 시작을 받아들이고 죽은 이의 약속을 지킨다"
  },
  {
    name: "철의 저울",
    symbol: "칼날 위에서 균형을 이룬 두 저울접시",
    doctrine: "질서와 책임을 중시하며 모든 계약의 대가를 묻는다"
  },
  {
    name: "자유의 불꽃",
    symbol: "끊어진 사슬 위에서 타오르는 붉은 불꽃",
    doctrine: "선택의 자유를 지키고 억압에 맞선다"
  },
  {
    name: "심연의 눈",
    symbol: "세 겹의 고리 속에서 뜬 자줏빛 눈",
    doctrine: "금지된 진실을 탐구하고 힘에 따르는 대가를 감당한다"
  },
  { name: "고요한 파도", symbol: "흰 조개를 감싼 세 줄의 푸른 파도", doctrine: "여행자를 보호하고 분쟁을 중재한다" }
];

export const DEITY_NAMES = [
  "아스테온",
  "루미엘",
  "세라니스",
  "오르디안",
  "벨리오스",
  "나이레아",
  "테르아스",
  "에르미라",
  "카르세온",
  "미르세라",
  "이오렌",
  "바르데아"
];
