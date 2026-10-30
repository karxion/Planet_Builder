import type { DeviceTemplateId } from "@/types/dungeon-v2";

interface DeviceTemplate {
  id: DeviceTemplateId;
  name: { ko: string; en: string };
  assetId: `D${string}`;
  tell: string;
  trigger: string;
  effect: string;
  counter: string;
  blocksMovement: boolean;
  blocksSight: boolean;
  cooldown: number;
}
const rows: [
  DeviceTemplateId,
  string,
  string,
  `D${string}`,
  string,
  string,
  string,
  string,
  boolean,
  boolean,
  number
][] = [
  [
    "darts",
    "압력판 화살",
    "Pressure darts",
    "D17",
    "바닥판의 틈과 벽의 작은 구멍",
    "진입/접촉",
    "지정 칸에 화살 피해 지시; GM이 판정",
    "압력판 고정·발사구 차단·우회",
    false,
    false,
    1
  ],
  [
    "pit",
    "붕괴 구덩이",
    "Collapsing pit",
    "D20",
    "갈라진 바닥과 낙석 소리",
    "진입/하중",
    "구덩이 개방; 낙하와 착지 판정은 GM",
    "판자로 보강·도약·다른 길",
    true,
    false,
    0
  ],
  [
    "portcullis",
    "낙하문",
    "Portcullis",
    "D07",
    "천장의 쇠살과 마모된 홈",
    "연결 장치",
    "문 개폐 및 통행 차단",
    "레버·문 고정·들어 올리기",
    true,
    false,
    0
  ],
  [
    "rune",
    "폭발 룬",
    "Explosive rune",
    "D23",
    "바닥 홈의 미세한 발광",
    "접촉/진입",
    "영향 칸에 마법 피해 지시; GM이 판정",
    "룬 연결 해제·원격 발동·우회",
    false,
    false,
    2
  ],
  [
    "lightning",
    "전격 통로",
    "Lightning passage",
    "D23",
    "금속 끝의 푸른 방전",
    "진입/라운드",
    "영향 칸에 전격 위험 지시",
    "동력 차단·절연·안전 칸",
    false,
    false,
    1
  ],
  [
    "alarm",
    "경보 룬",
    "Alarm rune",
    "D23",
    "가늘게 울리는 공명",
    "진입/상호작용",
    "기존 경비에 경보 전달; 새 경비를 생성하지 않음",
    "룬 해제·연결 차단·소음 유도",
    false,
    false,
    1
  ],
  [
    "ward",
    "통행 결계",
    "Passage ward",
    "D26",
    "공기의 굴절과 낮은 진동",
    "연결 장치/상호작용",
    "동력 유지 중 통행 차단",
    "수정 비활성·레버·열쇠·우회",
    true,
    false,
    0
  ],
  [
    "crystal",
    "수호 수정",
    "Warding crystal",
    "D24",
    "수정에서 뻗는 가는 빛",
    "상호작용/파괴",
    "연결 결계의 동력 해제",
    "수정 분리·조작·파괴",
    false,
    false,
    0
  ],
  [
    "seal",
    "봉인문",
    "Sealed door",
    "D06",
    "문틀의 맞물린 문양",
    "열쇠/연결 장치",
    "열쇠 획득 뒤 개방 유지; 열쇠 미소모",
    "열쇠·문양 해독·연결 장치",
    true,
    true,
    0
  ],
  [
    "flood",
    "상승 위험 지대",
    "Rising hazard",
    "D29",
    "젖은 벽의 수위선",
    "상호작용/라운드",
    "영향 칸의 이동 비용 증가; 수위는 GM 관리",
    "밸브·배수·안전 칸",
    false,
    false,
    1
  ],
  [
    "bridge",
    "불안정 다리",
    "Unstable bridge",
    "D32",
    "휘어진 지지대와 떨어지는 먼지",
    "진입/하중",
    "붕괴 뒤 영향 칸 통행 차단",
    "지지대 보수·줄·대체 경로",
    false,
    false,
    0
  ],
  [
    "lever",
    "레버-문 연동",
    "Lever and door",
    "D12",
    "손잡이에서 이어진 동력선",
    "상호작용",
    "연결된 문/결계 개방; 단조 진행",
    "레버 조작·기계 연결 절단",
    false,
    false,
    0
  ]
];
export const DUNGEON_DEVICE_TEMPLATES: DeviceTemplate[] = rows.map(
  ([id, ko, en, assetId, tell, trigger, effect, counter, blocksMovement, blocksSight, cooldown]) => ({
    id,
    name: { ko, en },
    assetId,
    tell,
    trigger,
    effect,
    counter,
    blocksMovement,
    blocksSight,
    cooldown
  })
);
export const DUNGEON_DEVICE_BY_ID = new Map(DUNGEON_DEVICE_TEMPLATES.map(template => [template.id, template]));
export const DUNGEON_LIMITS = { floors: 100, cells: 262144, rooms: 200, entities: 1000 } as const;
