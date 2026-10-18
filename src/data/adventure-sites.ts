import type { AdventureSite, CreatureType } from "@/types/adventure-site";

export const CREATURE_TYPES: Record<CreatureType, string> = {
  aberration: "이형체",
  beast: "야수",
  celestial: "천상체",
  construct: "구조물",
  dragon: "드래곤",
  elemental: "정령",
  fey: "페이",
  fiend: "악마",
  giant: "거인",
  humanoid: "휴머노이드",
  monstrosity: "괴수",
  ooze: "점액체",
  plant: "식물",
  undead: "언데드"
};
export interface AdventureMonster {
  id: string;
  name: string;
  type: CreatureType;
  cr: string;
  edition: "2014" | "2024";
  page: number;
}
// Names, types and individual CRs verified in the pinned official SRD PDFs. No stat blocks are copied here.
const rows: readonly (readonly [string, string, CreatureType, string, number])[] = [
  ["aboleth", "아볼레스", "aberration", "10", 258],
  ["giant-spider", "거대 거미", "beast", "1", 353],
  ["giant-scorpion", "거대 전갈", "beast", "3", 353],
  ["deva", "데바", "celestial", "10", 279],
  ["solar", "솔라", "celestial", "21", 326],
  ["animated-armor", "움직이는 갑옷", "construct", "1", 259],
  ["iron-golem", "철 골렘", "construct", "16", 302],
  ["shield-guardian", "방패 수호자", "construct", "7", 323],
  ["red-wyrmling", "레드 드래곤 새끼", "dragon", "4", 318],
  ["young-red-dragon", "어린 레드 드래곤", "dragon", "10", 318],
  ["adult-red-dragon", "성체 레드 드래곤", "dragon", "17", 318],
  ["air-elemental", "공기 정령", "elemental", "5", 258],
  ["fire-elemental", "화염 정령", "elemental", "5", 284],
  ["dryad", "드라이어드", "fey", "1", 282],
  ["satyr", "사티로스", "fey", "1/2", 321],
  ["dretch", "드레치", "fiend", "1/4", 281],
  ["pit-fiend", "핏 핀드", "fiend", "20", 314],
  ["ogre", "오우거", "giant", "2", 312],
  ["frost-giant", "서리 거인", "giant", "8", 285],
  ["mage", "마법사", "humanoid", "6", 305],
  ["archmage", "대마법사", "humanoid", "12", 305],
  ["chimera", "키메라", "monstrosity", "6", 273],
  ["tarrasque", "타라스크", "monstrosity", "30", 331],
  ["gelatinous-cube", "젤라틴 큐브", "ooze", "2", 286],
  ["black-pudding", "블랙 푸딩", "ooze", "4", 265],
  ["shambling-mound", "섐블링 마운드", "plant", "5", 323],
  ["treant", "트리앤트", "plant", "9", 333],
  ["skeleton", "스켈레톤", "undead", "1/4", 325],
  ["lich", "리치", "undead", "21", 304]
];
export const ADVENTURE_MONSTERS: readonly AdventureMonster[] = [
  ...rows.map(([id, name, type, cr, page]) => ({ id, name, type, cr, page, edition: "2024" as const })),
  { id: "goblin-2014", name: "고블린", type: "humanoid", cr: "1/4", page: 315, edition: "2014" },
  { id: "orc-2014", name: "오크", type: "humanoid", cr: "1/2", page: 339, edition: "2014" }
];
export const ADVENTURE_MONSTER_BY_ID = new Map(ADVENTURE_MONSTERS.map(monster => [monster.id, monster]));
export interface AdventureTheme {
  id: string;
  name: string;
  kind: "dungeon" | "hostileSettlement";
  icon: string;
  monsters: readonly string[];
  hook: string;
}
export const ADVENTURE_THEMES: readonly AdventureTheme[] = [
  {
    id: "alien-ruin",
    name: "심해의 정신 유적",
    kind: "dungeon",
    icon: "#rpg-ruins",
    monsters: ["aboleth"],
    hook: "지하 수로에서 들려오는 목소리가 탐사자들의 기억을 바꾼다."
  },
  {
    id: "beast-den",
    name: "포식자의 동굴",
    kind: "dungeon",
    icon: "#rpg-dungeon",
    monsters: ["giant-spider", "giant-scorpion"],
    hook: "실종된 대상의 흔적이 알과 독으로 가득한 굴로 이어진다."
  },
  {
    id: "sealed-sanctum",
    name: "봉인된 천공 성소",
    kind: "dungeon",
    icon: "#rpg-ruins",
    monsters: ["deva", "solar"],
    hook: "성소의 수호자는 봉인에 접근하는 침입자를 가리지 않고 저지한다."
  },
  {
    id: "construct-vault",
    name: "자동기계 금고",
    kind: "dungeon",
    icon: "#rpg-dungeon",
    monsters: ["animated-armor", "iron-golem", "shield-guardian"],
    hook: "주인을 잃은 경비 장치가 수백 년 전의 명령을 집행한다."
  },
  {
    id: "dragon-lair",
    name: "잿빛 용의 둥지",
    kind: "dungeon",
    icon: "#rpg-dungeon",
    monsters: ["red-wyrmling", "young-red-dragon", "adult-red-dragon"],
    hook: "사라진 공물과 녹아내린 무기가 산속 보물고의 위치를 드러낸다."
  },
  {
    id: "elemental-rift",
    name: "정령 균열",
    kind: "dungeon",
    icon: "#rpg-portal",
    monsters: ["air-elemental", "fire-elemental"],
    hook: "불안정한 원소의 틈이 주변 땅을 조금씩 잠식한다."
  },
  {
    id: "twisted-grove",
    name: "뒤틀린 요정 숲",
    kind: "dungeon",
    icon: "#rpg-ruins",
    monsters: ["dryad", "satyr"],
    hook: "깨진 협약 때문에 숲의 주민들이 외부인의 통행을 막는다."
  },
  {
    id: "fiend-gate",
    name: "악마의 소환문",
    kind: "dungeon",
    icon: "#rpg-portal",
    monsters: ["dretch", "pit-fiend"],
    hook: "버려진 소환진이 다시 켜지며 이계의 군세가 모여든다."
  },
  {
    id: "giant-hold",
    name: "거인의 옛 요새",
    kind: "dungeon",
    icon: "#rpg-ruins",
    monsters: ["ogre", "frost-giant"],
    hook: "고갯길을 점거한 거인 세력이 주변 교역로를 위협한다."
  },
  {
    id: "wizard-tower",
    name: "미쳐버린 마법사의 탑",
    kind: "dungeon",
    icon: "#rpg-tower",
    monsters: ["mage", "archmage", "shield-guardian"],
    hook: "금지된 실험으로 공간이 뒤틀린 탑에서 피조물과 마법 사고가 쏟아진다."
  },
  {
    id: "monster-labyrinth",
    name: "괴수의 미궁",
    kind: "dungeon",
    icon: "#rpg-dungeon",
    monsters: ["chimera", "tarrasque"],
    hook: "지하의 거대한 잠든 존재를 둘러싼 봉인이 무너지기 시작했다."
  },
  {
    id: "ooze-cistern",
    name: "부식의 지하 저수조",
    kind: "dungeon",
    icon: "#rpg-dungeon",
    monsters: ["gelatinous-cube", "black-pudding"],
    hook: "유출된 연금 폐기물이 통로와 장비를 삼키는 생태계를 만들었다."
  },
  {
    id: "living-garden",
    name: "굶주린 정원",
    kind: "dungeon",
    icon: "#rpg-ruins",
    monsters: ["shambling-mound", "treant"],
    hook: "오염된 수목과 뿌리가 옛 정원을 지키며 탐사자를 가둔다."
  },
  {
    id: "necropolis",
    name: "망자의 납골성",
    kind: "dungeon",
    icon: "#rpg-ruins",
    monsters: ["skeleton", "lich"],
    hook: "망자의 군세가 잊힌 왕조의 맹세를 다시 집행하려 한다."
  },
  {
    id: "underworld-passage",
    name: "언더월드 통로",
    kind: "dungeon",
    icon: "#rpg-portal",
    monsters: ["dretch", "aboleth", "chimera", "black-pudding"],
    hook: "깊은 지하세계와 이어진 입구에서 여러 무리가 연이어 출몰한다."
  },
  {
    id: "orc-raiders",
    name: "오크 약탈단 거점",
    kind: "hostileSettlement",
    icon: "#rpg-camp",
    monsters: ["orc-2014"],
    hook: "이 지역의 약탈단이 원정대를 꾸려 이웃 정착지와 교역로를 습격한다."
  },
  {
    id: "goblin-stockade",
    name: "고블린 적대 취락",
    kind: "hostileSettlement",
    icon: "#rpg-camp",
    monsters: ["goblin-2014"],
    hook: "함정과 망루로 둘러싸인 취락이 납치한 포로와 물자를 숨기고 있다."
  }
];
export const ADVENTURE_THEME_BY_ID = new Map(ADVENTURE_THEMES.map(theme => [theme.id, theme]));
export function isAdventureSite(value: unknown): value is AdventureSite {
  if (!value || typeof value !== "object") return false;
  const site = value as AdventureSite;
  return (
    site.version === 1 &&
    typeof site.themeId === "string" &&
    typeof site.monsterId === "string" &&
    Boolean(ADVENTURE_THEME_BY_ID.get(site.themeId)?.monsters.includes(site.monsterId)) &&
    Number.isSafeInteger(site.inhabitants) &&
    site.inhabitants >= 1 &&
    site.inhabitants <= 1000 &&
    typeof site.cleared === "boolean" &&
    typeof site.edited === "boolean" &&
    Number.isSafeInteger(site.generation) &&
    site.generation >= 0
  );
}
export function adventureMonsterUrl(monster: AdventureMonster): string {
  return `${monster.edition === "2014" ? "https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf" : "https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf"}#page=${monster.page}`;
}
