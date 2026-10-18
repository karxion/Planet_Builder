import { ADVENTURE_MONSTER_BY_ID, adventureMonsterUrl } from "@/data/adventure-sites";
import {
  BOSS_SIGNATURES,
  BOSS_TACTICS,
  DUNGEON_GIMMICKS,
  DUNGEON_TRAPS,
  type DungeonText
} from "@/data/dungeon-content";
import { MAGIC_ITEM_BY_ID, MAGIC_ITEM_SOURCES } from "@/data/magic-item-references";
import type { DungeonFeature, DungeonInterior, DungeonRoom } from "@/types/dungeon-interior";
import { dungeonRoomCenter, hiddenDungeonTiles } from "@/utils/dungeon-grid";
import { escapeAttribute as esc } from "./rpg-asset-renderer";

export type DungeonLanguage = "ko" | "en";
const text = (language: DungeonLanguage, ko: string, en: string) => (language === "ko" ? ko : en);
const local = (language: DungeonLanguage, value: DungeonText) => esc(value[language]);
export const roomName = (dungeon: DungeonInterior, room: DungeonRoom, language: DungeonLanguage, gm = true): string =>
  `${room.id + 1}. ${room.id === dungeon.entranceRoomId ? text(language, "입구", "Entrance") : gm && room.id === dungeon.bossRoomId ? text(language, "보스 방", "Boss chamber") : gm && room.secret ? text(language, "비밀방", "Secret room") : text(language, "방", "Room")}`;

const glyph = (feature: DungeonFeature) => {
  if (feature.kind === "monster")
    return feature.boss
      ? '<path d="M-6,4 -7,-5 -3,-1 0,-7 3,-1 7,-5 6,4Z" fill="#efbe55" stroke="#271f18" stroke-width="1.3"/>'
      : '<path d="M-5,-5 -2,-3 2,-3 5,-5 6,2 3,6 -3,6 -6,2Z" fill="#b64e4e" stroke="#301f22"/><circle cx="-2" cy="0" r="1" fill="white"/><circle cx="2" cy="0" r="1" fill="white"/>';
  if (feature.kind === "chest")
    return '<rect x="-6" y="-4" width="12" height="10" rx="1" fill="#a96733" stroke="#e6c76c"/><path d="M-6,0H6 M0,-4V6" stroke="#e6c76c" stroke-width="1.5"/>';
  if (feature.kind === "trap")
    return '<path d="M0,-7 7,6H-7Z" fill="#f3d36b" stroke="#372d22"/><path d="M0,-3V1" stroke="#372d22" stroke-width="2"/><circle cy="3.5" r="1" fill="#372d22"/>';
  return '<path d="M0,-7 5,0 0,7 -5,0Z" fill="#8dcdda" stroke="#235965"/><path d="M0,-7V7 M-5,0H5" stroke="#ebfaff"/>';
};

export function renderDungeonMap(
  dungeon: DungeonInterior,
  language: DungeonLanguage,
  gm: boolean,
  selectedRoom: number
): string {
  const unit = 18;
  const hidden = gm ? new Set<number>() : hiddenDungeonTiles(dungeon.rooms, dungeon.width);
  const floor = (x: number, y: number) =>
    x >= 0 &&
    y >= 0 &&
    x < dungeon.width &&
    y < dungeon.height &&
    dungeon.tiles[y * dungeon.width + x] === "0" &&
    !hidden.has(y * dungeon.width + x);
  let tiles = "";
  let walls = "";
  for (let y = 0; y < dungeon.height; y++)
    for (let x = 0; x < dungeon.width; x++) {
      if (!floor(x, y)) continue;
      tiles += `M${x * unit},${y * unit}h${unit}v${unit}h-${unit}Z`;
      for (const [dx, dy, sx, sy, ex, ey] of [
        [-1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1],
        [0, -1, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1]
      ])
        if (!floor(x + dx, y + dy))
          walls += `M${(x + sx) * unit},${(y + sy) * unit}L${(x + ex) * unit},${(y + ey) * unit}`;
    }
  const rooms = dungeon.rooms.filter(room => gm || !room.secret);
  const entrance = dungeonRoomCenter(dungeon.rooms.find(room => room.id === dungeon.entranceRoomId)!);
  const doors = new Set<string>();
  const doorShapes = rooms
    .flatMap(room =>
      room.doors.map(door => {
        const key = `${door.x},${door.y}`;
        if (doors.has(key) || hidden.has(door.y * dungeon.width + door.x)) return "";
        doors.add(key);
        return `<rect x="${door.x * unit + 4}" y="${door.y * unit + 4}" width="10" height="10" fill="${room.secret ? "#88c4c4" : "#a18862"}" stroke="#342e29"/>`;
      })
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fpb-dungeon-map" viewBox="0 0 ${dungeon.width * unit} ${dungeon.height * unit}" role="img" aria-label="${text(language, "던전 내부 지도", "Dungeon floor plan")}">
    <defs><pattern id="fpb-dungeon-stone" width="${unit}" height="${unit}" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#c8cfd0"/><path d="M18,0H0V18" fill="none" stroke="#a9b5b8" stroke-width="0.7"/></pattern></defs>
    <rect width="100%" height="100%" fill="#182125"/><path d="${tiles}" fill="url(#fpb-dungeon-stone)"/><path d="${walls}" fill="none" stroke="#6b777e" stroke-width="5" stroke-linecap="square"/>
    ${rooms.map(room => `<rect data-room="${room.id}" role="button" tabindex="0" aria-label="${esc(roomName(dungeon, room, language, gm))}" x="${room.x * unit + 2}" y="${room.y * unit + 2}" width="${room.width * unit - 4}" height="${room.height * unit - 4}" rx="2" fill="${room.id === selectedRoom ? "#438fa633" : room.secret ? "#418c8c22" : "transparent"}" stroke="${room.id === selectedRoom ? "#16586e" : room.secret ? "#32777b" : "none"}" stroke-width="2" ${room.secret ? 'stroke-dasharray="5 3"' : ""}/>`).join("")}
    <g pointer-events="none">${doorShapes}<path d="M${entrance.x * unit + 3},${entrance.y * unit + 9}h12m-5,-5 5,5 -5,5" fill="none" stroke="#216344" stroke-width="3"/>
    ${rooms.map(room => `<text x="${room.x * unit + 8}" y="${room.y * unit + 17}" font-family="sans-serif" font-size="12" font-weight="bold" fill="#18252b" stroke="#fff" stroke-width="2" paint-order="stroke">${room.id + 1}${room.secret ? " S" : ""}</text>`).join("")}
    ${gm ? dungeon.features.map(feature => `<g data-feature="${feature.kind}" transform="translate(${feature.x * unit + 9} ${feature.y * unit + 9})">${glyph(feature)}</g>`).join("") : ""}</g></svg>`;
}

function renderFeature(dungeon: DungeonInterior, feature: DungeonFeature, language: DungeonLanguage): string {
  if (feature.kind === "monster") {
    const monster = ADVENTURE_MONSTER_BY_ID.get(feature.monsterId)!;
    const elite = feature.hpMultiplier > 1;
    return `<section><h4>${feature.boss ? text(language, "보스", "Boss") : text(language, "몬스터", "Monsters")} · ${esc(monster.name)} × ${feature.count}</h4><p>CR ${monster.cr} · ${monster.edition} <a href="${adventureMonsterUrl(monster)}" target="_blank" rel="noopener noreferrer">SRD p.${monster.page}</a></p>${elite ? `<p>${text(language, "비공식 정예 보정", "Homebrew elite adjustment")}: HP ×${feature.hpMultiplier}, ${text(language, "피해", "damage")} ×${feature.damageMultiplier}. ${text(language, "최종 HP·평균 피해를 반올림하고 나머지 원본 규칙은 유지합니다. 목표 CR은 검증된 공식 CR이 아닙니다.", "Round final HP and average damage; retain other source rules. Target CR is not a certified official CR.")}</p>` : ""}${feature.boss ? renderBossPatterns(dungeon, language) : ""}</section>`;
  }
  if (feature.kind === "chest") {
    const item = feature.itemId && MAGIC_ITEM_BY_ID.get(feature.itemId);
    return `<section><h4>${text(language, "보상 상자", "Reward chest")}</h4><p>${feature.gold.toLocaleString(language)} GP</p>${item ? `<p><a href="${MAGIC_ITEM_SOURCES[item.edition].url}#page=${item.page}" target="_blank" rel="noopener noreferrer">${esc(item.name)}${feature.variant ? ` · ${esc(feature.variant)}` : ""}</a> · ${item.edition}</p><details><summary>${text(language, "아이템 원본 규칙", "Original item rules")}</summary><p class="fpb-dungeon-rules">${esc(item.rules)}</p></details>` : ""}</section>`;
  }
  const mechanic =
    feature.kind === "trap"
      ? DUNGEON_TRAPS.find(trap => trap.id === feature.trapId)!
      : DUNGEON_GIMMICKS.find(gimmick => gimmick.id === feature.gimmickId)!;
  return `<section><h4>${local(language, mechanic.name)} · DC ${feature.dc}</h4><p><b>${text(language, "징후·발동", "Tell / trigger")}</b> ${local(language, mechanic.trigger)}</p><p>${local(language, mechanic.effect)}${feature.kind === "trap" && feature.trapId !== "pit" ? ` ${feature.damageDice}d6.` : ""}</p><p><b>${text(language, "대응", "Counter")}</b> ${local(language, mechanic.counter)}</p></section>`;
}

function renderBossPatterns(dungeon: DungeonInterior, language: DungeonLanguage): string {
  const phases = renderBossPhases(dungeon, language);
  if (dungeon.difficulty === "normal") return phases;
  const monster = ADVENTURE_MONSTER_BY_ID.get(dungeon.monsterId)!;
  return `${phases}<p>${local(language, BOSS_TACTICS[monster.type])}</p>`;
}

function renderBossPhases(dungeon: DungeonInterior, language: DungeonLanguage): string {
  const monster = ADVENTURE_MONSTER_BY_ID.get(dungeon.monsterId)!;
  const advanced = dungeon.difficulty !== "normal";
  const hell = dungeon.difficulty === "hell";
  return `<h4>${text(language, "보스 전술", "Boss tactics")}</h4><p>${text(language, "일반: 원본 능력·행동·재충전 규칙을 사용합니다. 추가 행동을 자동 부여하지 않습니다.", "Use source abilities, actions and recharge rules; no free extra actions.")}</p>${advanced ? `<p><b>${local(language, BOSS_SIGNATURES[monster.type])}</b>: ${text(language, "기존 광역기 또는 강력한 공격을 쓰기 전 대상·방향을 예고합니다. 엄폐·산개·거리 벌리기로 대응합니다. 원본에 광역기가 없으면 단일 공격의 대상만 예고합니다.", "Telegraph the target or direction of an existing powerful attack. Use cover, spread out or disengage; without a source area attack, telegraph a single target only.")}</p><p>${text(language, "HP 50% 이하: 퇴로를 지키며 가까운 위협에 집중합니다. 능력 재충전·행동 횟수는 원본 그대로입니다.", "Below 50% HP: guard the escape route and focus nearby threats; source recharge and action economy remain unchanged.")}</p>` : ""}${hell ? `<p><b>${text(language, "3라운드 주기", "3-round cycle")}</b>: ${text(language, "1라운드 수정 수호 → 2라운드 위험 타일 예고 → 3라운드 위험 지대 활성화. 수정 파괴·밸브 차단·안전 타일 이동으로 대응합니다. 각 기믹의 DC와 효과는 배치된 방의 상세를 따릅니다.", "Round 1: ward; round 2: telegraph hazards; round 3: activate hazards. Destroy the crystal, close the valve or move to safe tiles. Use the placed room's DC and effects.")}</p>` : ""}`;
}

export function renderDungeonRoom(
  dungeon: DungeonInterior,
  roomId: number,
  language: DungeonLanguage,
  gm: boolean
): string {
  const room = dungeon.rooms.find(room => room.id === roomId && (gm || !room.secret));
  if (!room) return "";
  const features = dungeon.features.filter(feature => feature.roomId === room.id);
  return `<h3>${esc(roomName(dungeon, room, language, gm))}</h3><p>${room.width * 5} × ${room.height * 5} ft · ${text(language, "출입구", "Doors")} ${room.doors.length}</p>${room.secret && gm ? `<p>${text(language, "숨겨진 문: 지각·조사 DC", "Secret door: Perception/Investigation DC")} ${Math.min(22, 10 + Math.floor(dungeon.targetCr / 3))}. ${text(language, "발견 후 잠금 없이 열 수 있습니다.", "Once found, opens without a lock.")}</p>` : ""}${gm ? features.map(feature => renderFeature(dungeon, feature, language)).join("") || `<p>${text(language, "비어 있는 방", "Empty chamber")}</p>` : ""}`;
}
