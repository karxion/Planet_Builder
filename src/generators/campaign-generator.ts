import Alea from "alea";
import type { AdministrativeUnit, CampaignWorld, NpcTemplateId, WorldNpc } from "@/types/campaign-world";

export interface AdministrativeSnapshot {
  states: { id: number; name: string; x: number; y: number }[];
  fiefs: { id: number; stateId: number; name: string; x: number; y: number; neighbors: number[] }[];
  villages: {
    id: number;
    stateId: number;
    fiefId: number;
    name: string;
    x: number;
    y: number;
    capital: boolean;
    port: boolean;
  }[];
}

export function buildAdministration(input: AdministrativeSnapshot): AdministrativeUnit[] {
  const units: AdministrativeUnit[] = [];
  for (const state of [...input.states].sort((a, b) => a.id - b.id)) {
    const countryId = `country:${state.id}`;
    units.push({
      id: countryId,
      level: "country",
      sourceId: state.id,
      stateId: state.id,
      name: state.name,
      x: state.x,
      y: state.y
    });
    const villages = input.villages.filter(v => v.stateId === state.id);
    const fiefs = input.fiefs.filter(f => f.stateId === state.id).sort((a, b) => a.id - b.id);
    if (villages.some(v => !fiefs.some(f => f.id === v.fiefId))) {
      fiefs.push({ id: 0, stateId: state.id, name: `${state.name} 직할령`, x: state.x, y: state.y, neighbors: [] });
    }
    const remaining = new Map(fiefs.map(f => [f.id, f]));
    while (remaining.size) {
      const first = remaining.values().next().value!;
      const regionId = `region:${state.id}:${first.id}`;
      const queue = [first.id];
      const group: typeof fiefs = [];
      while (queue.length && group.length < 5) {
        const id = queue.shift()!;
        const fief = remaining.get(id);
        if (!fief) continue;
        remaining.delete(id);
        group.push(fief);
        queue.push(...[...fief.neighbors].sort((a, b) => a - b).filter(n => remaining.has(n)));
      }
      units.push({
        id: regionId,
        level: "region",
        sourceId: first.id,
        stateId: state.id,
        name: `${first.name.replace(/ 영지$/, "")} 지역`,
        parentId: countryId,
        x: first.x,
        y: first.y
      });
      for (const fief of group) {
        units.push({
          id: `fief:${state.id}:${fief.id}`,
          level: "fief",
          sourceId: fief.id,
          stateId: state.id,
          name: fief.name,
          parentId: regionId,
          x: fief.x,
          y: fief.y
        });
      }
    }
    for (const village of villages.sort((a, b) => a.id - b.id)) {
      const fiefId = fiefs.some(f => f.id === village.fiefId) ? village.fiefId : 0;
      units.push({
        id: `village:${village.id}`,
        level: "village",
        sourceId: village.id,
        stateId: state.id,
        parentId: `fief:${state.id}:${fiefId}`,
        name: village.name,
        x: village.x,
        y: village.y
      });
    }
  }
  return units;
}

const firstNames = ["아린", "세린", "로웬", "엘라", "카일", "미라", "테온", "유나", "다렌", "리브", "벨라", "오린"];
const lastNames = ["그레이", "리드", "스톤", "로언", "베일", "브룩", "애쉬", "워드", "페인", "윈터"];
const personalities = [
  "말수가 적고 약속을 엄격히 지킨다",
  "낯선 사람에게도 먼저 말을 건넨다",
  "모든 거래를 장부에 남긴다",
  "의심이 많지만 한번 얻은 신뢰는 오래간다",
  "어려운 질문에는 농담으로 답한다",
  "작은 불공정도 그냥 넘기지 못한다"
];
const appearances = [
  "빛바랜 녹색 외투와 은색 단추",
  "손등의 오래된 흉터와 단정한 차림",
  "붉은 목도리와 잉크 묻은 손끝",
  "짧은 회색 머리와 닳은 장화",
  "동그란 안경과 구리색 머리",
  "먼지 묻은 망토와 나무 지팡이"
];
const goals = [
  "끊긴 교역로를 다시 열고 싶다",
  "실종된 친구의 행방을 찾고 있다",
  "마을 회관을 수리할 자금을 모은다",
  "오래된 토지 문서의 진위를 확인하려 한다",
  "국경 분쟁을 평화롭게 끝내고 싶다",
  "새로운 수로를 개척할 동행을 구한다"
];
const secrets = [
  "폐허로 이어지는 지하 통로를 알고 있다",
  "익명의 편지를 매달 받고 있다",
  "빚을 갚기 위해 귀중한 물건을 숨겼다",
  "다른 이름으로 살았던 과거가 있다",
  "지역 관리의 장부에서 이상한 거래를 발견했다",
  "분실된 인장의 위치를 알고 있다"
];

export function generateVillageNpcs(
  worldSeed: string,
  village: AdministrativeSnapshot["villages"][number],
  generation = 0
): WorldNpc[] {
  const random = Alea(`${worldSeed}:npc-v1:${village.id}:${generation}`);
  const pick = <T>(values: T[]): T => values[Math.floor(random() * values.length)];
  const roles: [string, NpcTemplateId][] = [
    [village.capital ? "영주" : "마을 대표", village.capital ? "noble" : "commoner"],
    ["경비병", "guard"],
    [village.port ? "항구 상인" : "여관 주인", "commoner"],
    ["길잡이", "scout"]
  ];
  return roles.map(([role, templateId], index) => ({
    id: `npc:${village.id}:${generation}:${index}`,
    villageId: `village:${village.id}`,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    role,
    templateId,
    appearance: pick(appearances),
    personality: pick(personalities),
    goal: `${village.name}에서 ${pick(goals)}`,
    secret: pick(secrets),
    notes: "",
    edited: false
  }));
}

export function createCampaign(input: AdministrativeSnapshot, seed: string): CampaignWorld {
  return {
    version: 1,
    ruleset: "srd-5.2.1",
    seed,
    generation: 0,
    units: buildAdministration(input),
    npcs: input.villages.flatMap(v => generateVillageNpcs(seed, v))
  };
}

export function synchronizeNpcPlaceNames(
  npcs: WorldNpc[],
  previousUnits: AdministrativeUnit[],
  villages: AdministrativeSnapshot["villages"]
): WorldNpc[] {
  const previousNames = new Map(previousUnits.map(unit => [unit.id, unit.name]));
  const currentNames = new Map(villages.map(village => [`village:${village.id}`, village.name]));
  return npcs.map(npc => {
    if (npc.edited) return npc;
    const newName = currentNames.get(npc.villageId);
    const previousName = previousNames.get(npc.villageId);
    const prefix = npc.goal.match(/^(.*?)에서 /)?.[1];
    if (!newName || !prefix || prefix === newName) return npc;
    if (prefix !== previousName && !/[a-z]/i.test(prefix)) return npc;
    return { ...npc, goal: newName + npc.goal.slice(prefix.length) };
  });
}

export function belongsTo(villageId: string, ancestorId: string, units: AdministrativeUnit[]): boolean {
  const byId = new Map(units.map(unit => [unit.id, unit]));
  const visited = new Set<string>();
  let current: string | undefined = villageId;
  while (current && !visited.has(current)) {
    if (current === ancestorId) return true;
    visited.add(current);
    current = byId.get(current)?.parentId;
  }
  return false;
}
