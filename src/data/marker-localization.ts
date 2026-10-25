type Language = "ko" | "en";

// Generated names use this vocabulary; unknown proper names and user prose stay untouched.
const terms = new Map<string, string>(
  [
    ["Statue", "석상"],
    ["Obelisk", "오벨리스크"],
    ["Monument", "기념비"],
    ["Column", "기념 기둥"],
    ["Monolith", "거석"],
    ["Pillar", "돌기둥"],
    ["Megalith", "거석 유적"],
    ["Stele", "비석"],
    ["Runestone", "룬석"],
    ["Sculpture", "조각상"],
    ["Effigy", "인물상"],
    ["Idol", "우상"],
    ["Mount", "산"],
    ["Volcano", "화산"],
    ["Dormant", "휴면 중인"],
    ["Active", "활동 중인"],
    ["Erupting", "분화 중인"],
    ["Hot Springs", "온천"],
    ["Healing Spring", "치유의 샘"],
    ["Purifying Well", "정화의 우물"],
    ["Enchanted Reservoir", "마법 저수지"],
    ["Creek of Luck", "행운의 개울"],
    ["Fountain of Youth", "젊음의 분수"],
    ["Wisdom Spring", "지혜의 샘"],
    ["Spring of Life", "생명의 샘"],
    ["Spring of Youth", "젊음의 샘"],
    ["Healing Stream", "치유의 시내"],
    ["Bridge", "다리"],
    ["Lighthouse", "등대"],
    ["Waterfall", "폭포"],
    ["Battlefield", "전장"],
    ["Dungeon", "던전"],
    ["Monster", "괴물"],
    ["Mountain", "산"],
    ["Forest", "숲"],
    ["Pinery", "소나무 숲"],
    ["Palm Grove", "야자수 숲"],
    ["Pirates", "해적"],
    ["Ruined", "폐허가 된"],
    ["City", "도시"],
    ["Town", "마을"],
    ["Settlement", "취락"],
    ["Pyramid", "피라미드"],
    ["Fort", "보루"],
    ["Stronghold", "요새"],
    ["Temple", "신전"],
    ["Sacred site", "성지"],
    ["Mausoleum", "영묘"],
    ["Outpost", "전초기지"],
    ["Fortification", "방어진지"],
    ["Fortress", "성채"],
    ["Castle", "성"],
    ["Library", "도서관"],
    ["Archive", "기록 보관소"],
    ["Collection", "장서관"],
    ["Travelling", "순회"],
    ["Circus", "서커스"],
    ["Joust", "마상시합"],
    ["Competition", "경연"],
    ["Melee", "난전"],
    ["Tournament", "무술대회"],
    ["Contest", "경기"],
    ["Fair", "장터"],
    ["Minor Jetty", "작은 나루터"],
    ["migration", "이동 무리"],
    ["gala", "축하연"],
    ["dance", "춤 축제"],
    ["performance", "공연"],
    ["ball", "무도회"],
    ["soiree", "저녁 연회"],
    ["jamboree", "대축제"],
    ["exhibition", "전시회"],
    ["carnival", "사육제"],
    ["festival", "축제"],
    ["jubilee", "기념제"],
    ["celebration", "경축 행사"],
    ["gathering", "모임"],
    ["fete", "잔치"],
    ["mirage", "신기루"],
    ["Cave", "동굴"],
    ["Cavern", "대동굴"],
    ["Chasm", "깊은 균열"],
    ["Ravine", "협곡"],
    ["Fracture", "지반 균열"],
    ["Grotto", "석굴"],
    ["Pit", "수직 굴"],
    ["Sinkhole", "함몰지"],
    ["Hole", "굴"],
    ["Glacial", "빙하"],
    ["Portal", "차원문"],
    ["Rift", "차원 균열"],
    ["Demonic", "악마의"],
    ["Interdimensional", "차원 간"],
    ["Abyssal", "심연의"],
    ["Cosmic", "우주의"],
    ["Cataclysmic", "재앙의"],
    ["Subterranean", "지하의"],
    ["Ancient", "고대의"],
    ["Disturbed Burial", "훼손된 무덤"],
    ["Necropolis", "죽음의 도시"],
    ["Crypt", "지하묘"],
    ["Tomb", "고분"],
    ["Graveyard", "묘지"],
    ["Cemetery", "공동묘지"],
    ["Sepulchre", "묘실"],
    ["salt", "소금"],
    ["gold", "금"],
    ["silver", "은"],
    ["copper", "구리"],
    ["iron", "철"],
    ["lead", "납"],
    ["tin", "주석"],
    ["mining town", "광산 마을"],
    ["stone", "석조"],
    ["wooden", "목조"],
    ["lengthy", "긴"],
    ["formidable", "견고한"],
    ["rickety", "흔들리는"],
    ["beaten", "낡은"],
    ["weathered", "풍화된"],
    ["river", "강"],
    ["creek", "개울"],
    ["stream", "시내"],
    ["brook", "실개천"],
    ["fork", "지류"],
    ["inn", "여관"],
    ["tavern", "선술집"],
    ["Dark", "어두운"],
    ["Light", "밝은"],
    ["Bright", "빛나는"],
    ["Golden", "황금"],
    ["White", "흰"],
    ["Black", "검은"],
    ["Red", "붉은"],
    ["Pink", "분홍"],
    ["Purple", "보랏빛"],
    ["Blue", "푸른"],
    ["Green", "초록"],
    ["Yellow", "노란"],
    ["Amber", "호박빛"],
    ["Orange", "주황"],
    ["Brown", "갈색"],
    ["Grey", "회색"],
    ["New", "새로운"],
    ["Good", "착한"],
    ["High", "높은"],
    ["Old", "오래된"],
    ["Great", "위대한"],
    ["Big", "큰"],
    ["Major", "으뜸"],
    ["Happy", "행복한"],
    ["Main", "중심"],
    ["Huge", "거대한"],
    ["Far", "먼"],
    ["Beautiful", "아름다운"],
    ["Prime", "태고의"],
    ["Proud", "긍지 높은"],
    ["Lucky", "행운의"],
    ["Fat", "통통한"],
    ["Honest", "정직한"],
    ["Giant", "거인"],
    ["Distant", "아득한"],
    ["Friendly", "다정한"],
    ["Loud", "떠들썩한"],
    ["Hungry", "배고픈"],
    ["Magical", "마법의"],
    ["Superior", "뛰어난"],
    ["Peaceful", "평화로운"],
    ["Frozen", "얼어붙은"],
    ["Divine", "신성한"],
    ["Favorable", "길한"],
    ["Brave", "용감한"],
    ["terrifying", "무시무시한"],
    ["horrifying", "끔찍한"],
    ["feared", "두려움의 대상인"],
    ["Sunny", "햇살 가득한"],
    ["Flying", "날아다니는"],
    ["Fantastical", "환상적인"],
    ["Wondrous", "경이로운"],
    ["Incomprehensible", "불가사의한"],
    ["Extraordinary", "비범한"],
    ["Unmissable", "놓칠 수 없는"],
    ["World-famous", "세계적인"],
    ["Breathtaking", "숨 막히는"],
    ["Entrancing", "매혹적인"],
    ["Diaphanous", "희미한"],
    ["Illusory", "환영의"],
    ["Peculiar", "기묘한"],
    ["Ogre", "오거"],
    ["Troll", "트롤"],
    ["Cyclops", "사이클롭스"],
    ["Beast", "야수"],
    ["Dragon", "드래곤"],
    ["Undead", "언데드"],
    ["Ghoul", "구울"],
    ["Vampire", "흡혈귀"],
    ["Hag", "해그"],
    ["Banshee", "밴시"],
    ["Bearded Devil", "수염 악마"],
    ["Roc", "로크"],
    ["Hydra", "히드라"],
    ["Warg", "와르그"],
    ["highlander", "고산지대"],
    ["desert", "사막"],
    ["mounted", "기마"],
    ["swamp", "늪지"],
    ["angry", "성난"],
    ["brigands", "산적"],
    ["bandits", "도적"],
    ["robbers", "강도"],
    ["highwaymen", "노상강도"],
    ["cunning", "책략"],
    ["might", "힘"],
    ["speed", "속도"],
    ["the greats", "실력"],
    ["acumen", "판단력"],
    ["brutality", "맹렬함"]
  ].map(([en, ko]) => [en.toLowerCase(), ko])
);

const animals = [
  ["Antelope", "Antelopes", "영양"],
  ["Ape", "Apes", "유인원"],
  ["Badger", "Badgers", "오소리"],
  ["Bear", "Bears", "곰"],
  ["Beaver", "Beavers", "비버"],
  ["Bison", "Bisons", "들소"],
  ["Boar", "Boars", "멧돼지"],
  ["Buffalo", "Buffalo", "물소"],
  ["Cat", "Cats", "고양이"],
  ["Crane", "Cranes", "두루미"],
  ["Crocodile", "Crocodiles", "악어"],
  ["Crow", "Crows", "까마귀"],
  ["Deer", "Deer", "사슴"],
  ["Dog", "Dogs", "개"],
  ["Eagle", "Eagles", "독수리"],
  ["Elk", "Elk", "엘크"],
  ["Fox", "Foxes", "여우"],
  ["Goat", "Goats", "염소"],
  ["Goose", "Geese", "거위"],
  ["Hare", "Hares", "산토끼"],
  ["Hawk", "Hawks", "매"],
  ["Heron", "Herons", "왜가리"],
  ["Horse", "Horses", "말"],
  ["Hyena", "Hyenas", "하이에나"],
  ["Ibis", "Ibises", "따오기"],
  ["Jackal", "Jackals", "자칼"],
  ["Jaguar", "Jaguars", "재규어"],
  ["Lark", "Larks", "종달새"],
  ["Leopard", "Leopards", "표범"],
  ["Lion", "Lions", "사자"],
  ["Mantis", "Mantises", "사마귀"],
  ["Marten", "Martens", "담비"],
  ["Moose", "Mooses", "무스"],
  ["Mule", "Mules", "노새"],
  ["Narwhal", "Narwhals", "일각고래"],
  ["Owl", "Owls", "올빼미"],
  ["Panther", "Panthers", "흑표범"],
  ["Rat", "Rats", "쥐"],
  ["Raven", "Ravens", "큰까마귀"],
  ["Rook", "Rooks", "떼까마귀"],
  ["Scorpion", "Scorpions", "전갈"],
  ["Shark", "Sharks", "상어"],
  ["Sheep", "Sheep", "양"],
  ["Snake", "Snakes", "뱀"],
  ["Spider", "Spiders", "거미"],
  ["Swan", "Swans", "백조"],
  ["Tiger", "Tigers", "호랑이"],
  ["Turtle", "Turtles", "거북"],
  ["Wolf", "Wolves", "늑대"],
  ["Wolverine", "Wolverines", "울버린"],
  ["Camel", "Camels", "낙타"],
  ["Falcon", "Falcons", "송골매"],
  ["Hound", "Hounds", "사냥개"],
  ["Ox", "Oxen", "황소"]
];
for (const [singular, plural, ko] of animals) {
  terms.set(singular.toLowerCase(), ko);
  terms.set(plural.toLowerCase(), ko);
}
terms.set("wolfs", "늑대");
for (const [en, ko] of [
  ["boiled", "삶은"],
  ["grilled", "석쇠구이"],
  ["roasted", "구운"],
  ["spit-roasted", "꼬치구이"],
  ["stewed", "스튜"],
  ["stuffed", "속을 채운"],
  ["jugged", "단지찜"],
  ["mashed", "으깬"],
  ["baked", "오븐구이"],
  ["braised", "조림"],
  ["poached", "수란식"],
  ["marinated", "양념에 재운"],
  ["pickled", "절임"],
  ["smoked", "훈제"],
  ["dried", "말린"],
  ["dry-aged", "건조 숙성"],
  ["corned", "염장"],
  ["fried", "튀긴"],
  ["pan-fried", "팬구이"],
  ["deep-fried", "기름튀김"],
  ["dressed", "소스를 곁들인"],
  ["steamed", "찜"],
  ["cured", "숙성"],
  ["syrupped", "시럽절임"],
  ["flame-broiled", "직화구이"],
  ["beef", "소고기"],
  ["pork", "돼지고기"],
  ["bacon", "베이컨"],
  ["chicken", "닭고기"],
  ["lamb", "양고기"],
  ["chevon", "염소고기"],
  ["rabbit", "토끼고기"],
  ["hart", "수사슴"],
  ["antlers", "녹각"],
  ["turkey", "칠면조"],
  ["pheasant", "꿩"],
  ["duck", "오리"],
  ["teal", "쇠오리"],
  ["quail", "메추라기"],
  ["pigeon", "비둘기"],
  ["seal", "물범"],
  ["carp", "잉어"],
  ["bass", "농어"],
  ["pike", "강꼬치고기"],
  ["catfish", "메기"],
  ["sturgeon", "철갑상어"],
  ["escallop", "가리비"],
  ["pie", "파이"],
  ["cake", "케이크"],
  ["pottage", "걸쭉한 수프"],
  ["pudding", "푸딩"],
  ["onions", "양파"],
  ["carrot", "당근"],
  ["potato", "감자"],
  ["beet", "비트"],
  ["garlic", "마늘"],
  ["cabbage", "양배추"],
  ["eggplant", "가지"],
  ["eggs", "달걀"],
  ["broccoli", "브로콜리"],
  ["zucchini", "애호박"],
  ["pepper", "고추"],
  ["olives", "올리브"],
  ["pumpkin", "호박"],
  ["spinach", "시금치"],
  ["peas", "완두콩"],
  ["chickpea", "병아리콩"],
  ["beans", "콩"],
  ["rice", "쌀밥"],
  ["pasta", "파스타"],
  ["bread", "빵"],
  ["apples", "사과"],
  ["peaches", "복숭아"],
  ["pears", "배"],
  ["melon", "멜론"],
  ["oranges", "오렌지"],
  ["mango", "망고"],
  ["tomatoes", "토마토"],
  ["cheese", "치즈"],
  ["corn", "옥수수"],
  ["rat tails", "쥐꼬리"],
  ["pig ears", "돼지 귀"],
  ["hot", "뜨거운"],
  ["cold", "차가운"],
  ["fire", "불꽃"],
  ["ice", "얼음"],
  ["smoky", "훈연향"],
  ["misty", "안개빛"],
  ["shiny", "반짝이는"],
  ["sweet", "달콤한"],
  ["bitter", "쌉쌀한"],
  ["salty", "짭짤한"],
  ["sour", "새콤한"],
  ["sparkling", "탄산"],
  ["smelly", "향이 강한"],
  ["wine", "포도주"],
  ["brandy", "브랜디"],
  ["gin", "진"],
  ["whisky", "위스키"],
  ["rom", "럼"],
  ["beer", "맥주"],
  ["cider", "사과주"],
  ["mead", "벌꿀주"],
  ["liquor", "리큐어"],
  ["spirits", "증류주"],
  ["vodka", "보드카"],
  ["tequila", "테킬라"],
  ["absinthe", "압생트"],
  ["nectar", "감로주"],
  ["milk", "우유"],
  ["kvass", "크바스"],
  ["kumis", "마유주"],
  ["tea", "차"],
  ["water", "물"],
  ["juice", "과즙"],
  ["sap", "수액"]
])
  terms.set(en, ko);
const termPattern = new RegExp(`\\b(?:${[...terms.keys()].sort((a, b) => b.length - a.length).join("|")})\\b`, "gi");
export const markerTerms = (source: string): string =>
  source.replace(termPattern, word => terms.get(word.toLowerCase()) || word);

export const INSCRIPTION_DESCRIPTION = "The inscription has not yet been deciphered.";
const exact = new Map<string, string>([
  [INSCRIPTION_DESCRIPTION, "비문은 아직 해독되지 않았습니다."],
  ["An ancient inscription remains here.", "오래된 비문이 남아 있습니다."],
  [
    "A lighthouse to serve as a beacon for ships in the open sea.",
    "먼바다를 항해하는 선박의 길잡이가 되는 등대입니다."
  ],
  ["Pirate ships have been spotted in these waters.", "이 해역에서 해적선이 목격되었습니다."],
  [
    "A vast collection of knowledge, including many rare and ancient tomes.",
    "희귀한 고서와 고대 문헌을 비롯한 방대한 지식이 보관되어 있습니다."
  ],
  ["Undiscovered dungeon.", "아직 탐사되지 않은 던전입니다."],
  ["Watabou: One Page Dungeon", "Watabou: 한 장 던전 생성기"],
  [
    "An element of the magic portal system connecting major city. The portals were installed centuries ago, but still work fine.",
    "주요 도시를 연결하는 마법 차원문입니다. 수백 년 전에 설치되었지만 지금도 정상적으로 작동합니다."
  ],
  [
    "A burial site has been disturbed in this area, causing the dead to rise and attack the living.",
    "이 지역의 무덤이 훼손되어 죽은 자들이 일어나 산 자를 공격하고 있습니다."
  ],
  [
    "This legendary water source is whispered about in ancient tales and believed to possess mystical properties. The spring emanates crystal-clear water, shimmering with an otherworldly iridescence that sparkles even in the dimmest light.",
    "고대 전설에 전해지는 신비로운 수원입니다. 수정처럼 맑은 샘물은 어둠 속에서도 이세계의 무지갯빛으로 반짝입니다."
  ],
  ["A gorgeous waterfall flows here.", "이곳에는 아름다운 폭포가 흐릅니다."],
  ["The rapids of an exceptionally beautiful waterfall.", "유난히 아름다운 폭포의 급류가 흐릅니다."],
  ["An impressive waterfall has cut through the land.", "장대한 폭포가 대지를 가르며 쏟아집니다."],
  ["The cascades of a stunning waterfall.", "눈부신 계단식 폭포가 이어집니다."],
  [
    "A river drops down from a great height forming a wondrous waterfall.",
    "높은 절벽에서 강물이 떨어져 경이로운 폭포를 이룹니다."
  ],
  ["A breathtaking waterfall cuts through the landscape.", "숨 막힐 듯 장엄한 폭포가 풍경을 가로지릅니다."],
  [
    "A foreboding necropolis shrouded in perpetual darkness, where eerie whispers echo through the winding corridors and spectral guardians stand watch over the tombs of long-forgotten souls.",
    "영원한 어둠에 잠긴 불길한 죽음의 도시입니다. 구불구불한 복도에는 섬뜩한 속삭임이 울리고, 영체 수호자들이 잊힌 영혼들의 무덤을 지킵니다."
  ],
  [
    "A towering necropolis adorned with macabre sculptures and guarded by formidable undead sentinels. Its ancient halls house the remains of fallen heroes, entombed alongside their cherished relics.",
    "섬뜩한 조각상으로 장식된 거대한 죽음의 도시를 강력한 언데드 파수꾼들이 지킵니다. 고대 전당에는 쓰러진 영웅들이 소중한 유물과 함께 잠들어 있습니다."
  ],
  [
    "This ethereal necropolis seems suspended between the realms of the living and the dead. Wisps of mist dance around the tombstones, while haunting melodies linger in the air, commemorating the departed.",
    "삶과 죽음의 경계에 떠 있는 듯한 몽환적인 죽음의 도시입니다. 묘비 사이로 안개가 흐르고, 망자를 기리는 애잔한 선율이 맴돕니다."
  ],
  [
    "Rising from the desolate landscape, this sinister necropolis is a testament to necromantic power. Its skeletal spires cast ominous shadows, concealing forbidden knowledge and arcane secrets.",
    "황량한 땅 위에 솟은 사악한 죽음의 도시는 사령술의 힘을 드러냅니다. 앙상한 첨탑의 불길한 그림자 아래 금지된 지식과 비전의 비밀이 숨겨져 있습니다."
  ],
  [
    "An eerie necropolis where nature intertwines with death. Overgrown tombstones are entwined by thorny vines, and mournful spirits wander among the fading petals of once-vibrant flowers.",
    "자연과 죽음이 뒤얽힌 섬뜩한 죽음의 도시입니다. 잡초에 덮인 묘비를 가시덩굴이 감싸고, 시든 꽃잎 사이로 슬픈 영혼들이 떠돕니다."
  ],
  [
    "A labyrinthine necropolis where each step echoes with haunting murmurs. The walls are adorned with ancient runes, and restless spirits guide or hinder those who dare to delve into its depths.",
    "발걸음마다 기이한 속삭임이 울리는 미로 같은 죽음의 도시입니다. 벽에는 고대 룬이 새겨져 있고, 안식하지 못한 영혼들이 탐험가를 인도하거나 방해합니다."
  ],
  [
    "This cursed necropolis is veiled in perpetual twilight, perpetuating a sense of impending doom. Dark enchantments shroud the tombs, and the moans of anguished souls resound through its crumbling halls.",
    "영원한 황혼에 가려진 저주받은 죽음의 도시에는 파멸의 예감이 감돕니다. 어둠의 마법이 무덤을 덮고 무너지는 전당에는 고통받는 영혼의 신음이 울립니다."
  ],
  [
    "A sprawling necropolis built within a labyrinthine network of catacombs. Its halls are lined with countless alcoves, each housing the remains of the departed, while the distant sound of rattling bones fills the air.",
    "미로 같은 지하묘지 안에 펼쳐진 거대한 죽음의 도시입니다. 전당을 따라 수많은 감실에 유해가 안치되어 있고, 멀리서 뼈가 부딪치는 소리가 들려옵니다."
  ],
  [
    "A desolate necropolis where an eerie stillness reigns. Time seems frozen amidst the decaying mausoleums, and the silence is broken only by the whispers of the wind and the rustle of tattered banners.",
    "기묘한 정적이 지배하는 황폐한 죽음의 도시입니다. 허물어진 영묘 사이로 시간이 멈춘 듯하며, 바람 소리와 낡은 깃발의 펄럭임만 침묵을 깨뜨립니다."
  ],
  [
    "A foreboding necropolis perched atop a jagged cliff, overlooking a desolate wasteland. Its towering walls harbor restless spirits, and the imposing gates bear the marks of countless battles and ancient curses.",
    "메마른 황무지를 내려다보는 절벽 위의 불길한 죽음의 도시입니다. 높은 성벽 안에는 원혼들이 머물고, 거대한 문에는 수많은 전투와 고대 저주의 흔적이 남아 있습니다."
  ],
  ["이 지역에서 인물을 만났습니다.", "이 지역에서 인물을 만났습니다."]
]);

type Rule = readonly [RegExp, (...parts: string[]) => string];
const rules: Rule[] = [
  [
    /^(Dormant|Active|Erupting) volcano\. Height: (.+)\.$/,
    (status, height) => `${markerTerms(status)} 화산입니다. 높이: ${height}.`
  ],
  [
    /^A geothermal springs with naturally heated water that provide relaxation and medicinal benefits\. Average temperature is (.+)\.$/,
    temp => `지열로 따뜻해진 물이 휴식과 치유를 제공하는 온천입니다. 평균 수온: ${temp}.`
  ],
  [
    /^(.+) is a mining town of (.+) people just nearby the (.+) mine\.$/,
    (name, population, resource) =>
      `${name}: 인구 ${population}명의 광산 마을입니다. 인근에 ${markerTerms(resource)} 광산이 있습니다.`
  ],
  [
    /^A (.+) bridge spans over the (.+) near (.+)\.$/,
    (adjective, river, burg) =>
      `${burg} 근처의 ${markerTerms(river)} 위로 ${markerTerms(adjective)} 다리가 놓여 있습니다.`
  ],
  [
    /^An old crossing of the (.+), rarely used since (.+)\.$/,
    (river, reason) =>
      `${markerTerms(river)}의 오래된 나루입니다. ${phrases.get(reason) || reason} 이후 거의 사용되지 않습니다.`
  ],
  [
    /^A big and famous roadside (inn|tavern)\. Delicious (.+) with (.+) is served here\.$/,
    (type, course, drink) =>
      `길가의 크고 유명한 ${markerTerms(type)}입니다. 특선 요리: ${markerTerms(course)}. 음료: ${markerTerms(drink)}.`
  ],
  [
    /^A historical battle of the (.+)\.\s*Date: (.+)\.$/,
    (campaign, date) => `${campaign}의 역사적인 전투가 벌어진 곳입니다. 날짜: ${date}.`
  ],
  [
    /^(.+) say a relic monster of (.+) long inhabits (.+) Lake\. Truth or lie, folks are afraid to fish in the lake\.$/,
    (_subject, length, lake) =>
      `${lake} 호수에 길이 ${length}의 고대 괴물이 산다는 이야기가 전해집니다. 진위는 알 수 없지만 주민들은 이곳에서 낚시하기를 두려워합니다.`
  ],
  [
    /^Old sailors tell stories of a gigantic sea monster inhabiting these dangerous waters\. Rumors say it can be (.+) long\.$/,
    length =>
      `늙은 선원들은 이 위험한 해역에 거대한 바다 괴물이 산다고 말합니다. 소문에 따르면 길이는 ${length}에 이릅니다.`
  ],
  [
    /^(.+) speak of a (.+) (Ogre|Troll|Cyclops|Giant|Monster|Beast|Dragon|Undead|Ghoul|Vampire|Hag|Banshee|Bearded Devil|Roc|Hydra|Warg) who inhabits (.+) hills and (.+)\.$/,
    (_subject, adjective, monster, place, action) =>
      `${place} 구릉에 ${markerTerms(adjective)} ${markerTerms(monster)}이 산다는 이야기가 전해집니다. ${phrases.get(action) || action}.`
  ],
  [/^A sacred mountain of (.+)\. Height: (.+)\.$/, (religion, height) => `${religion}의 성산입니다. 높이: ${height}.`],
  [
    /^A (forest|pinery|palm grove) sacred to local (.+)\.$/,
    (kind, religion) => `지역 신앙 ${religion}에서 신성하게 여기는 ${markerTerms(kind)}입니다.`
  ],
  [
    /^A gang of (.+) (brigands|bandits|robbers|highwaymen)\.$/,
    (locality, kind) => `${markerTerms(locality)} ${markerTerms(kind)} 무리가 활동합니다.`
  ],
  [
    /^An ancient (.+)\. It has an inscription, but no one can translate it:$/,
    kind => `고대의 ${markerTerms(kind)}입니다. 비문이 새겨져 있지만 아직 해독되지 않았습니다.`
  ],
  [
    /^An ancient (statue|obelisk|monument|column|monolith|pillar|megalith|stele|runestone|sculpture|effigy|idol)\.$/i,
    kind => `고대의 ${markerTerms(kind)}입니다.`
  ],
  [
    /^Ruins of an ancient (.+)\. Untold riches may lie within\.$/,
    kind => `고대 ${markerTerms(kind)}의 폐허입니다. 그 안에 막대한 보물이 잠들어 있을지도 모릅니다.`
  ],
  [
    /^Roll up, roll up, this (.+) circus is here for a limited time only\.$/,
    adjective => `${markerTerms(adjective)} 순회 서커스가 잠시 이곳에 머물고 있습니다.`
  ],
  [
    /^Warriors from around the land gather for a (.+) of (.+) in (.+), with fame, fortune and favour on offer to the victor\.$/,
    (type, virtue, place) =>
      `${place}에서 ${markerTerms(virtue)}을 겨루는 ${markerTerms(type)}에 각지의 전사들이 모였습니다. 승자에게 명예와 부, 후원이 주어집니다.`
  ],
  [
    /^A fair is being held in (.+), with all manner of local and foreign goods and services on offer\.$/,
    place => `${place}에서 장터가 열려 각종 현지·외지 상품과 서비스를 거래합니다.`
  ],
  [
    /^A small location along the (.+) to launch boats from sits here, along with a weary looking owner, willing to sell passage along the river\.$/,
    river => `${markerTerms(river)}에 작은 나루터가 있습니다. 지친 기색의 주인이 뱃삯을 받고 강을 건너 줍니다.`
  ],
  [
    /^A huge group of (.+) are migrating, whether part of their annual routine, or something more extraordinary\.$/,
    animal =>
      `대규모 ${markerTerms(animal)} 무리가 이동하고 있습니다. 매년 반복되는 이동인지 특별한 사건 때문인지는 알 수 없습니다.`
  ],
  [
    /^A (.+) has been organised at (.+) as a chance to gather the (.+) of the area together to be merry, make alliances and scheme around the crisis\.$/,
    (kind, place, people) =>
      `${place}에서 ${phrases.get(people) || people}을 모으는 ${markerTerms(kind)}이 열렸습니다. 참석자들은 즐거움을 나누고 동맹을 맺으며 위기에 대응할 계책을 논의합니다.`
  ],
  [
    /^This (.+) mirage has been luring travellers out of their way for eons\.$/,
    adjective => `${markerTerms(adjective)} 신기루가 오랫동안 여행자들을 길 밖으로 유혹해 왔습니다.`
  ],
  [
    /^The (.+)\. Locals claim that it is (.+)\.$/,
    (name, status) => `${markerTerms(name)}입니다. 주민들은 ${phrases.get(status) || status}고 전합니다.`
  ],
  [
    /^A rumoured (.+) rift in this area is causing (.+)\.$/,
    (kind, effect) => `소문에 따르면 이 지역의 ${markerTerms(kind)} 균열로 인해 ${phrases.get(effect) || effect}.`
  ]
];

const phrases = new Map<string, string>([
  ["its collapse during the flood", "홍수로 다리가 붕괴한 일"],
  ["being rumoured to attract trolls", "트롤이 나타난다는 소문"],
  ["the drying up of local trade", "지역 교역의 쇠퇴"],
  ["banditry infested the area", "도적의 창궐"],
  ["the old waypoints crumbled", "옛 길목의 붕괴"],
  ["steals cattle at night", "밤마다 가축을 훔칩니다"],
  ["prefers eating children", "아이들을 잡아먹는다고 합니다"],
  ["doesn't mind human flesh", "사람도 먹잇감으로 삼습니다"],
  ["keeps the region at bay", "온 지역을 위협합니다"],
  ["eats kids whole", "아이들을 통째로 삼킨다고 합니다"],
  ["abducts young women", "젊은 여성들을 납치합니다"],
  ["terrorizes the region", "지역을 공포에 빠뜨립니다"],
  ["harasses travelers in the area", "여행자들을 괴롭힙니다"],
  ["snatches people from homes", "집에서 사람들을 납치합니다"],
  ["attacks anyone who dares to approach its lair", "둥지에 접근하는 사람을 공격합니다"],
  ["attacks unsuspecting victims", "방심한 희생자들을 습격합니다"],
  ["great and the good", "지역의 유력 인사들"],
  ["nobility", "귀족들"],
  ["local elders", "지역의 원로들"],
  ["foreign dignitaries", "외국의 고위 사절들"],
  ["spiritual leaders", "종교 지도자들"],
  ["suspected revolutionaries", "혁명 세력으로 의심받는 인사들"],
  ["a good spot to hid treasure", "보물을 숨기기에 좋은 장소라"],
  ["the home of strange monsters", "기이한 괴물의 소굴이라"],
  ["totally empty", "완전히 비어 있다"],
  ["endlessly deep and unexplored", "아직 탐사되지 않은 끝없이 깊은 곳이라"],
  ["completely flooded", "완전히 물에 잠겼다"],
  ["slowly filling with lava", "용암이 서서히 차오른다"],
  ["all known nearby beings to flee in terror", "인근의 생명체들이 공포에 질려 달아나고 있습니다"],
  ["cracks in reality itself to form", "현실 자체에 균열이 생기고 있습니다"],
  ["swarms of foes to spill forth", "적들이 무리 지어 쏟아져 나오고 있습니다"],
  ["nearby plants to wither and decay", "주변 식물이 시들어 썩어가고 있습니다"],
  ["an emmissary to step through with an all-powerful relic", "강력한 유물을 지닌 사절이 나타났습니다"]
]);

export function translateMarkerText(source: string, language: Language): string {
  if (language === "en")
    return source === "이 지역에서 인물을 만났습니다." ? "You encounter someone in this area." : source;
  const text = source.trim();
  const fixed = exact.get(text);
  if (fixed) return source.replace(text, fixed);
  for (const [pattern, format] of rules) {
    const match = text.match(pattern);
    if (match) return source.replace(text, format(...match.slice(1)));
  }
  return source;
}

export function translateMarkerName(source: string, language: Language): string {
  if (language === "en") return source === "인물 조우" ? "Local Encounter" : source;
  return markerTerms(source.replace(/^The /, "").replace(/^Hot Springs of (.+)$/, "$1 Hot Springs"));
}

// Legacy generators split supplementary Unicode code points into lone surrogates.
// Replace only that exact generated block, leaving hand-written HTML and notes intact.
export function readableInscription(legend: string): string {
  return legend.replace(
    /^(An ancient (?:statue|obelisk|monument|column|monolith|pillar|megalith|stele|runestone|sculpture|effigy|idol))\. It has an inscription, but no one can translate it:\s*<div style="font-size: 1\.8em; line-break: anywhere;">[^<]*<\/div>\s*$/i,
    `$1.<p>${INSCRIPTION_DESCRIPTION}</p>`
  );
}
