import type { CreatureType } from "@/types/adventure-site";
import type { DungeonDifficulty } from "@/types/dungeon-interior";

export interface DungeonText {
  ko: string;
  en: string;
}
export interface DungeonMechanic {
  id: string;
  name: DungeonText;
  trigger: DungeonText;
  effect: DungeonText;
  counter: DungeonText;
}
export const DUNGEON_DIFFICULTIES: Record<DungeonDifficulty, DungeonText> = {
  normal: { ko: "일반", en: "Normal" },
  challenging: { ko: "도전적", en: "Challenging" },
  hell: { ko: "헬조선", en: "Hell Joseon" }
};
export const CR_XP: Readonly<Record<string, number>> = {
  "0": 10,
  "0.125": 25,
  "0.25": 50,
  "0.5": 100,
  "1": 200,
  "2": 450,
  "3": 700,
  "4": 1100,
  "5": 1800,
  "6": 2300,
  "7": 2900,
  "8": 3900,
  "9": 5000,
  "10": 5900,
  "11": 7200,
  "12": 8400,
  "13": 10000,
  "14": 11500,
  "15": 13000,
  "16": 15000,
  "17": 18000,
  "18": 20000,
  "19": 22000,
  "20": 25000,
  "21": 33000,
  "22": 41000,
  "23": 50000,
  "24": 62000,
  "25": 75000,
  "26": 90000,
  "27": 105000,
  "28": 120000,
  "29": 135000,
  "30": 155000
};
export function numericCr(cr: string): number {
  const parts = cr.split("/").map(Number);
  return parts.length === 2 ? parts[0] / parts[1] : parts[0];
}
export const DUNGEON_TRAPS: readonly DungeonMechanic[] = [
  {
    id: "darts",
    name: { ko: "압력판 화살", en: "Pressure darts" },
    trigger: {
      ko: "바닥의 눌린 타일과 벽의 작은 구멍이 보인다. 타일을 밟으면 발동한다.",
      en: "Scuffed tiles and wall holes telegraph a pressure plate."
    },
    effect: {
      ko: "민첩 내성 실패 시 관통 피해. 성공 시 절반.",
      en: "Dexterity save: piercing damage, half on success."
    },
    counter: {
      ko: "지각 또는 조사로 발견. 도둑 도구 판정으로 해제하거나 타일을 우회한다.",
      en: "Perception/Investigation to detect; thieves' tools to disarm or bypass the tile."
    }
  },
  {
    id: "rune",
    name: { ko: "폭발 룬", en: "Explosive rune" },
    trigger: {
      ko: "푸른 빛의 룬이 박동한다. 룬을 건드리면 폭발한다.",
      en: "A pulsing blue rune detonates when touched."
    },
    effect: {
      ko: "10피트 반경의 민첩 내성. 실패 시 화염 피해, 성공 시 절반.",
      en: "Dexterity save within 10 feet: fire damage, half on success."
    },
    counter: {
      ko: "조사로 발견하고 비전 판정으로 룬 연결을 끊거나 안전 거리에서 원격 발동한다.",
      en: "Investigate, sever the circuit with Arcana, or trigger it remotely from safety."
    }
  },
  {
    id: "pit",
    name: { ko: "붕괴 함정", en: "Collapsing pit" },
    trigger: {
      ko: "균열 사이로 바람이 샌다. 발판에 무게가 실리면 무너진다.",
      en: "Drafts through cracks reveal a collapsing floor."
    },
    effect: {
      ko: "민첩 내성 실패 시 10피트 추락(1d6 타격 피해) 후 구덩이에 남는다.",
      en: "Failed Dexterity save: fall 10 feet (1d6 bludgeoning) and remain in the pit."
    },
    counter: {
      ko: "지각 또는 조사로 발견. 널판으로 건너거나 밧줄을 설치한다. 탈출은 운동 판정.",
      en: "Perception/Investigation to detect; bridge it or use a rope. Athletics to climb out."
    }
  }
];
export const DUNGEON_GIMMICKS: readonly DungeonMechanic[] = [
  {
    id: "alarm",
    name: { ko: "경보 장치", en: "Alarm network" },
    trigger: {
      ko: "붉은 선이 순찰 동선 위로 이어진다. 선을 끊으면 경보가 울린다.",
      en: "Red wires span the patrol route; breaking one sounds an alarm."
    },
    effect: {
      ko: "다음 방의 기존 경비가 2라운드 후 합류한다. 적을 새로 생성하지 않는다.",
      en: "Existing guards from the next room join after 2 rounds; no new enemies are spawned."
    },
    counter: {
      ko: "조사로 연결선을 찾고 도둑 도구로 차단한다. 소음을 감추거나 연결선을 우회할 수 있다.",
      en: "Investigate the circuit and disable with thieves' tools, mask the sound, or bypass it."
    }
  },
  {
    id: "ward",
    name: { ko: "수호 수정", en: "Ward crystal" },
    trigger: { ko: "보스와 수정 사이에 빛의 줄기가 맺힌다.", en: "A visible beam links the boss to a crystal." },
    effect: {
      ko: "수정이 살아 있는 동안 보스가 자기 턴 시작 시 목표 CR만큼 임시 HP를 얻는다. 중첩되지 않는다.",
      en: "While active, the boss gains temporary HP equal to target CR at the start of its turn; this does not stack."
    },
    counter: {
      ko: "수정 AC 12, HP 10 + 목표 CR × 2. 파괴하거나 비전 판정으로 비활성화한다.",
      en: "Crystal AC 12, HP 10 + target CR x 2. Destroy it or disable it with Arcana."
    }
  },
  {
    id: "flood",
    name: { ko: "차오르는 위험 지대", en: "Rising hazard" },
    trigger: {
      ko: "바닥 배수구가 울리며 1라운드 전 위험 타일이 빛난다.",
      en: "Drains rumble; hazardous tiles glow a round before activation."
    },
    effect: {
      ko: "매 3라운드 방 가장자리 5피트가 다음 라운드까지 험지가 된다. 그곳에서 턴을 마치면 민첩 내성, 실패 시 2d6 산성 피해. 성공 시 피해 없음.",
      en: "Every 3 rounds the outer 5 feet becomes difficult terrain until the next round. Ending there requires a Dexterity save or 2d6 acid damage; no damage on success."
    },
    counter: {
      ko: "안전한 중앙으로 이동하거나 조사 판정으로 배수 밸브를 찾아 잠근다.",
      en: "Move to the safe center or locate and close the valve with Investigation."
    }
  }
];
export const BOSS_SIGNATURES: Record<CreatureType, DungeonText> = {
  aberration: { ko: "정신 파동", en: "Mind pulse" },
  beast: { ko: "포식자의 돌진", en: "Predator rush" },
  celestial: { ko: "천상의 심판", en: "Celestial judgment" },
  construct: { ko: "회전 분쇄기", en: "Rotating crusher" },
  dragon: { ko: "예고된 브레스", en: "Telegraphed breath" },
  elemental: { ko: "원소 폭주", en: "Elemental surge" },
  fey: { ko: "환영의 사냥", en: "Illusory hunt" },
  fiend: { ko: "지옥의 낙인", en: "Infernal brand" },
  giant: { ko: "대지 분쇄", en: "Earthshatter" },
  humanoid: { ko: "지휘관의 포위", en: "Commander's encirclement" },
  monstrosity: { ko: "괴수의 광란", en: "Monstrous frenzy" },
  ooze: { ko: "부식의 범람", en: "Corrosive surge" },
  plant: { ko: "뿌리 감옥", en: "Root prison" },
  undead: { ko: "망자의 손아귀", en: "Grasp of the dead" }
};

export const BOSS_TACTICS: Record<CreatureType, DungeonText> = {
  aberration: {
    ko: "정신 지배 대상과 전열을 분리하려 한다. 시야를 끊고 집중을 방해한다. 지배·집중 능력이 원본에 있을 때만 적용한다.",
    en: "Separate controlled targets from the front line. Break sight and disrupt concentration; use control abilities only if present in the source."
  },
  beast: {
    ko: "고립된 대상을 추격하고 통로로 물러난다. 전열 유지와 병목 차단으로 대응한다. 추가 이동·공격은 부여하지 않는다.",
    en: "Pursue isolated targets and retreat into passages. Maintain formation and block chokepoints; grant no extra movement or attacks."
  },
  celestial: {
    ko: "원거리 위협을 우선 견제한다. 원본에 비행이 있으면 수직 공간을 활용한다. 엄폐와 집중 사격으로 대응한다.",
    en: "Prioritize ranged threats and use vertical space only with source flight. Counter with cover and focused fire."
  },
  construct: {
    ko: "보스 방의 좁은 접근로를 지킨다. 여러 출입구로 경로를 분산하거나 우회해 고정된 방어 위치를 무력화한다.",
    en: "Guard narrow approaches to the boss chamber. Split approaches across entrances or bypass its fixed defensive position."
  },
  dragon: {
    ko: "목과 날개의 움직임으로 브레스 방향을 예고한다. 재충전 대기에는 엄폐한다. 산개한 뒤 재충전 공백에 접근한다.",
    en: "Telegraph breath direction with neck and wing movement. Take cover during recharge; spread out and close during the recharge window."
  },
  elemental: {
    ko: "원본의 저항·면역과 맞는 위험 지대 쪽으로 유인한다. 안전 타일과 다른 피해 유형을 선택해 대응한다.",
    en: "Lure targets toward hazards matching source resistances or immunities. Counter with safe ground and alternative damage types."
  },
  fey: {
    ko: "엄폐 사이를 오가며 고립된 대상을 노린다. 환영은 원본 능력에 있을 때만 사용한다. 서로의 시야를 유지하고 퇴로를 확인한다.",
    en: "Move between cover and isolate targets; use illusions only if present in the source. Maintain mutual sight and verify exits."
  },
  fiend: {
    ko: "원본 공격이 닿는 위치에서 퇴로를 압박한다. 위험 지대가 있으면 먼저 해제하고 안전한 퇴로를 확보해 포위 전술을 약화한다.",
    en: "Pressure retreat routes from source attack range. Disable hazards when present and preserve a safe retreat to undermine encirclement."
  },
  giant: {
    ko: "큰 체구로 통로를 막는다. 투척 공격은 원본에 있을 때만 사용한다. 넓은 방으로 유도하고 모퉁이로 시야를 끊는다.",
    en: "Block approaches with its bulk; use ranged attacks only from the source. Lure it into open rooms and break sight around corners."
  },
  humanoid: {
    ko: "주문 사용자는 엄폐·집중 유지, 전투원은 기존 경비와 전열 교대를 우선한다. 집중을 방해하고 경보가 있으면 차단하며 퇴로를 분리한다.",
    en: "Casters prioritize cover and concentration; fighters rotate with existing guards. Disrupt concentration, disable any alarms and split escape routes."
  },
  monstrosity: {
    ko: "원본 다중 공격을 가까운 위협에 집중한다. 위험 타일 예고 때 위치를 바꾸도록 유도해 공격 범위를 벗어난다.",
    en: "Focus existing multiattacks on nearby threats. Bait it out of position when hazard tiles are telegraphed."
  },
  ooze: {
    ko: "좁은 길을 천천히 점유한다. 분열 조건은 원본에 있을 때만 예고한다. 거리를 유지하고 분열을 유발하지 않는 공격을 선택한다.",
    en: "Slowly occupy chokepoints. Telegraph split triggers only if present in the source; keep distance and avoid split-triggering attacks."
  },
  plant: {
    ko: "원본의 긴 사거리로 접근로를 지킨다. 느린 이동을 이용해 거리·엄폐를 바꾸고 위험 장치가 있으면 별도의 해제 담당을 둔다.",
    en: "Guard approaches with source reach. Exploit slow movement, vary distance and cover, and assign a separate operator for any hazard devices."
  },
  undead: {
    ko: "휴식 공간과 퇴로를 압박한다. 공포·재생 조건은 원본에 있을 때만 예고한다. 해당 조건을 조사하고 안전한 퇴로를 확보한다.",
    en: "Pressure rest areas and retreat routes. Telegraph fear or regeneration only from the source; investigate conditions and preserve an exit."
  }
};
