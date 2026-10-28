/** Original setting material, not official SRD item/spell rules. */
export const SPACE_CONTENT = {
  underwater: {
    prefixes: [
      ["진주", "Pearl"],
      ["산호", "Coral"],
      ["조류", "Tide"],
      ["해연", "Deep"],
      ["푸른", "Azure"],
      ["달빛", "Moon"]
    ],
    people: [
      ["트리톤", "Triton"],
      ["바다 엘프", "Sea elf"],
      ["멀포크", "Merfolk"],
      ["심해 드워프", "Deep-sea dwarf"]
    ],
    roles: [
      ["진주 교역상", "Pearl merchant"],
      ["해류 길잡이", "Current guide"],
      ["침몰 유적 탐사자", "Sunken-ruin explorer"],
      ["산호 서고의 기록관", "Coral archivist"]
    ],
    offers: [
      [
        "빛나는 진주를 대가로 심해 유물과 잠수 장비를 교환한다.",
        "Trades deep-sea relics and diving gear for luminous pearls."
      ],
      [
        "끊어진 해류 항로를 조사해 주면 안전한 해구 통행로를 알려준다.",
        "Offers safe trench routes in return for investigating a broken current passage."
      ],
      [
        "가라앉은 성소의 기억석을 찾아 달라고 의뢰한다.",
        "Asks for the recovery of a memory stone from a sunken shrine."
      ],
      [
        "산호 서고에 보존된 옛 왕국과 조류의 기록을 나눈다.",
        "Shares records of ancient realms and currents kept in the coral archive."
      ]
    ],
    greeting: ["낯선 물결을 타고 왔군요. 무엇을 찾고 있나요?", "You arrive on unfamiliar currents. What do you seek?"],
    categories: [
      ["해류 나침반", "Current compass"],
      ["진주 부적", "Pearl charm"],
      ["산호 창", "Coral spear"],
      ["잠수 망토", "Diving mantle"],
      ["심해 등불", "Abyssal lantern"]
    ],
    effects: [
      ["냉기 피해에 대한 내성을 부여한다.", "Grants resistance to cold damage."],
      ["하루 한 번 10분 동안 수중에서 자유롭게 호흡한다.", "Once per day, breathe underwater for 10 minutes."],
      ["수영 관련 운동 판정에 +2 보너스를 받는다.", "Gain +2 to Athletics checks involving swimming."],
      [
        "하루 한 번 10분 동안 아군 한 명과 수중에서 30m까지 메시지를 주고받는다.",
        "Once per day, exchange messages underwater with one ally within 30m for 10 minutes."
      ],
      [
        "반경 6m의 물속을 은은하게 밝히며 색을 바꿔 신호를 보낸다.",
        "Sheds dim light through water within 6m and changes color to signal."
      ],
      [
        "하루 한 번 안개 구름을 만들어 수중에서 먹물 장막처럼 사용한다.",
        "Once per day, create a fog cloud that forms an ink-like screen underwater."
      ],
      [
        "해저 지형과 해류를 읽는 생존 판정에 +2 보너스를 받는다.",
        "Gain +2 to Survival checks to read seabed terrain and currents."
      ],
      [
        "독성 해양 생물의 독에 대한 내성 굴림에 이점을 받는다.",
        "Gain advantage on saving throws against venom from marine creatures."
      ]
    ],
    origin: [
      "산호 공방에서 제작해 심해 교역로를 지키던 유물.",
      "A relic crafted in a coral workshop to protect deep-sea trade routes."
    ]
  },
  underground: {
    prefixes: [
      ["흑요", "Obsidian"],
      ["수정", "Crystal"],
      ["균림", "Mycelial"],
      ["깊은샘", "Deepwell"],
      ["은맥", "Silvervein"],
      ["잿빛", "Ashen"]
    ],
    people: [
      ["지저 드워프", "Deep dwarf"],
      ["지저 엘프", "Deep elf"],
      ["동굴 노움", "Cave gnome"],
      ["균류인", "Myconid"]
    ],
    roles: [
      ["광맥 교역상", "Vein merchant"],
      ["심연 길잡이", "Abyss guide"],
      ["균류 약제사", "Fungal apothecary"],
      ["수정 기록관", "Crystal keeper"]
    ],
    offers: [
      [
        "정제 광석과 균류 약재를 받고 지저 장비와 마정석을 교환한다.",
        "Trades subterranean gear and crystals for refined ore and fungal herbs."
      ],
      [
        "무너진 터널의 표식을 되찾아 주면 심층으로 향하는 길을 안내한다.",
        "Offers passage to the deep layers in return for recovering markers from a collapsed tunnel."
      ],
      [
        "독성 포자가 번진 샘을 조사할 모험가를 구한다.",
        "Seeks adventurers to investigate a spring contaminated with toxic spores."
      ],
      [
        "발광 수정에 기록된 옛 도시의 기억과 세력의 소문을 전한다.",
        "Shares memories of lost cities recorded in luminous crystal and rumors of local factions."
      ]
    ],
    greeting: [
      "발걸음의 울림이 낯설군요. 등불을 낮추고 이야기를 나눕시다.",
      "Your footsteps echo strangely. Lower your lantern and let us talk."
    ],
    categories: [
      ["수정 등불", "Crystal lantern"],
      ["균사 망토", "Mycelial cloak"],
      ["흑요 단검", "Obsidian dagger"],
      ["심층 곡괭이", "Deep pick"],
      ["깊은샘 반지", "Deepwell ring"]
    ],
    effects: [
      ["독 피해에 대한 내성을 부여한다.", "Grants resistance to poison damage."],
      ["하루 한 번 10분 동안 18m 암시야를 얻는다.", "Once per day, gain darkvision within 18m for 10 minutes."],
      ["동굴에서 길을 찾는 생존 판정에 +2 보너스를 받는다.", "Gain +2 to Survival checks for navigation in caverns."],
      [
        "하루 한 번 10분 동안 자신이 밟는 돌에 발자국 소리를 남기지 않는다.",
        "Once per day, leave no footstep sounds on stone for 10 minutes."
      ],
      [
        "반경 6m의 포자와 광물 가루를 발광시켜 흔적을 드러낸다.",
        "Illuminates spores and mineral dust within 6m to reveal tracks."
      ],
      ["하루 한 번 거미 등반 효과를 1분 동안 얻는다.", "Once per day, gain a spider-climb effect for 1 minute."],
      [
        "붕괴 위험과 함정을 살피는 조사 판정에 +2 보너스를 받는다.",
        "Gain +2 to Investigation checks to examine cave-ins and traps."
      ],
      [
        "마법이 아닌 짙은 포자로 인한 실명에 대한 내성 굴림에 이점을 받는다.",
        "Gain advantage on saving throws against blindness from nonmagical dense spores."
      ]
    ],
    origin: [
      "깊은 공동의 장인이 광맥과 균류의 힘을 결합해 제작한 유물.",
      "A relic crafted in deep caverns by combining the power of mineral veins and fungi."
    ]
  }
} as const;
