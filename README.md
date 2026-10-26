# 판타지 행성 빌더

TRPG GM과 세계관 작가를 위한 한국어 우선 웹 앱입니다. 시드 기반 2D 세계를 생성하고 편집한 뒤, 같은 결과를 회전 가능한 3D 행성으로 검토할 수 있습니다.

현재 앱 버전: **v1.1.0** (2026-10-18). [버전별 변경 내역](CHANGELOG.md)에서 새 기능·검증 결과·남은 제약을 확인할 수 있습니다. 저장 호환성에 사용하는 Azgaar 엔진 버전 `1.135.0`은 앱 버전과 별도로 유지합니다.

## v1 기능

- 행성 이름, 시드, 반지름, 해수면, 기후, 강수량, 대륙 유형 설정
- Azgaar FMG 기반 지형, 생물군계, 국가, 마을, 도로 생성 및 2D 편집
- 마을 → 영지 → 지역 → 국가 행정 체계, 지역·영지 경계 지도
- SRD 5.2.1 기반 마을별 NPC 자동 생성, 검색·편집·재생성·JSON 출력
- 앱 전용 NPC 5티어(1~4 / 5~8 / 9~12 / 13~16 / 17~20) 및 에픽(21+) 구분. 5티어·에픽은 수동 지정하며 기존 레벨·메모는 유지
- 국가별 공백지에 던전·적대 취락 자동 배치: 17개 테마, 14개 몬스터 유형, 대표 몬스터 CR·출처, 정착지 간격 조정, 공략 완료·잠금 보존
- 던전 클릭 시 시드 기반 내부 지도 생성: 방·통로·비밀방·함정·몬스터·보상 상자, 일반·도전적·헬조선 난이도, GM/플레이어 보기 및 SVG 출력
- SRD 5.1 (2014)·5.2.1 (2024) 마법 아이템 498개 항목·계열 색인 기반 국가 보물·도시 상징품 생성, 판본 선택 및 원본 규칙 확인
- 2D/3D 보기 전환, 3D 위치 선택과 2D 지도 동기화, 행성 스크린샷
- gzip JSON 기반 `.fpb` 저장/불러오기, 기존 `.map` 가져오기, IndexedDB 자동 복구
- 선택적 bkend.ai 이메일 인증 및 비공개 프로젝트 저장 어댑터
- 한국어·영어 UI 선택 및 언어 설정 유지, RPG 작업대 스타일
- 데스크톱·모바일 도구 모음과 PWA 설치 메타데이터

종교·문화·임의 구역의 셀 구획 데이터는 생성하지 않으며 기존 지도를 가져올 때도 제거합니다. 삭제된 구획 데이터는 새 저장 파일에서 복구되지 않습니다. 별도의 세계관 목록에는 종교·신격·총본산 및 보물을 기록합니다. NPC·세계관 목록과 행정 표시 상태는 `.fpb`에 저장되며, 레거시 `.map`은 이를 포함하지 않습니다.

보물 상세에서 2014·2024 원본과 하위형을 선택할 수 있습니다. 자동 생성은 국가 성격과 희귀도를 고려하고 하나의 원본 효과를 유지하며, 이름·상징성·RP 서사는 창작합니다. 수동 편집한 보물은 전체 판본 변경 시 유지됩니다. 상용 확장 규칙서 전체를 포함한 것은 아닙니다. 색인은 공식 CC BY 4.0 SRD에서 추출한 240개·258개 항목으로, 하위형은 별도 선택지입니다. 카탈로그 재생성 절차는 `docs/02-design/item-reference-generator.design.md`를 참고하세요.

캐릭터·아이템·주문 조사 출처로 [2014 Wikidot](https://dnd5e.wikidot.com/)와 해당 사이트가 안내하는 [2024 Wikidot](https://dnd2024.wikidot.com/)를 사용합니다. NPC·보물 상세의 외부 참고에서 판본별 직업·특기·주문·아이템 목록을 열 수 있습니다. 외부 참고 선택은 생성 수치를 변경하지 않으며, 위키 전체 데이터 가져오기나 완전한 PC·주문 엔진을 의미하지 않습니다. UA·홈브루 및 배포 권한은 별도로 확인합니다. 적용 원칙은 `docs/02-design/rules-reference-sources.design.md`에 기록했습니다.

새 지도는 정착지와 간격을 둔 국가별 던전·적대 거점을 생성합니다. 기존 지도는 지도 도구 → 던전 위치 → 공백지 자동 배치에서 보완합니다. CR은 대표 몬스터 한 개체의 값이며 거점 전체 전투 난이도가 아닙니다. 공간이 부족하면 강제로 겹치지 않고 결과에 표시합니다. 던전 메타데이터는 기존 표식에 저장되어 `.map`과 `.fpb`에서 보존됩니다. 세부 정책은 `docs/02-design/adventure-sites.design.md`를 참고하세요.

던전 표식 또는 던전 위치 목록의 지도 버튼을 누르면 내부 지도가 열립니다. 일반은 원본 몬스터를 사용하고, 도전적은 CR +1~2의 XP 값을 목표로 보스 HP·피해를 정예 보정합니다(분수 CR은 다음 정수 CR 1 또는 2, 상한 30). 헬조선은 동일한 목표 CR에 함정·경보·수호 수정·위험 지대 및 유형별 보스 전술을 추가합니다. 정예 보정은 검증된 공식 CR이나 파티 조우 난이도가 아닌 창작 휴리스틱입니다. 원본 스탯·행동·저항·재충전 규칙은 별도 SRD 링크에서 확인하며, 파티 인원·레벨·장비에 맞춘 GM 조정이 필요합니다. 생성된 내부 지도는 자동으로 잠금 보존되고 저장 파일에 포함됩니다. 기존 수동 던전은 테마·대표 몬스터를 선택할 수 있습니다. `docs/02-design/dungeon-interior.design.md`에 생성·검증 규칙과 제약을 기록했습니다.

상단 및 프로젝트·NPC 창의 언어 선택에서 한국어와 영어를 전환할 수 있습니다. 언어는 프로젝트와 별도로 브라우저에 저장하며, 지도 지명·NPC 이름·역할·GM 메모 등 세계 데이터는 번역하거나 변경하지 않습니다. 원본 고급 기능의 미등록 문구는 영어로 표시됩니다.

## 로컬 실행

Node.js 24 이상이 필요합니다. 다른 PC에서는 다음 명령으로 시작합니다.

```bash
git clone https://github.com/karxion/Planet_Builder.git
cd Planet_Builder
npm ci
npm run dev
```

개발 주소는 `http://localhost:5173/Fantasy-Planet-Builder/`입니다. 다른 PC로 이동하기 전에 변경을 커밋하고 push한 뒤, 이동한 PC에서 `git pull --ff-only`로 최신 코드를 받습니다. 여러 PC의 변경을 동시에 작업했다면 충돌을 해결한 후 커밋하며 강제 push하지 않습니다.

## 브라우저 개발 및 기기 이동

GitHub 저장소의 **Code → Codespaces → Create codespace on main**에서 개발 환경을 만들 수 있습니다. [공식 Node.js 개발 컨테이너](https://github.com/devcontainers/images/tree/main/src/javascript-node)를 사용하는 `.devcontainer/devcontainer.json`이 Node.js 24와 의존성 설치를 설정합니다. 컨테이너가 준비되면 다음 명령을 실행하고 **Ports**의 5173 포트를 브라우저로 엽니다.

```bash
npm run dev -- --host 0.0.0.0
```

열린 미리보기 URL에 `/Fantasy-Planet-Builder/` 경로를 붙입니다. 포트는 기본 비공개 상태로 유지합니다. Codespaces 사용량과 과금 정책은 GitHub 계정에서 확인하고 사용하지 않을 때는 환경을 중지합니다. Codespaces 실제 생성과 컨테이너 실행은 이 저장소의 로컬 검증에 포함하지 않았습니다.

앱 사용 주소: [판타지 행성 빌더](https://fantasy-planet-builder.karxion.chatgpt.site). 모바일에서도 접속할 수 있으나 정밀 지도 편집과 모바일 개발 UI의 사용성은 아직 최적화·검증되지 않았습니다.

GitHub는 앱 코드를 동기화하며, 만든 지도와 브라우저 자동 저장은 동기화하지 않습니다. 기존 지도는 `.fpb`로 저장해 다른 기기 또는 공개 사이트에서 엽니다. bkend 클라우드 저장은 별도 환경 설정이 필요합니다. GitHub push만으로 현재 Sites 공개 사이트가 자동 갱신되지는 않습니다.

## 수중·지저 세계관 지도

상단 **지상 지도 / 수중 지도 / 지저 지도**로 전환하고 **공간 편집**에서 도시·영지·지형·연결 지점을 수동 배치합니다. 세력과 소속, 깊이·주민·메모를 편집하고 공간 사이 통로로 이동할 수 있습니다. 3D 행성은 **추가 보기**에 있습니다.

공간 기록은 `.fpb`와 Drive 저장에 포함되며, 기존 지상 재생성에서는 유지됩니다. 레거시 `.map` 저장에는 포함되지 않습니다. 첫 버전은 수동 작도이며 해저·지저 자동 생성과 NPC/규칙 데이터 확장은 포함하지 않습니다. [사용법과 저장 호환성](docs/02-design/world-spaces.design.md)을 참고하세요.

## 조감도·전투지도 크기

도시의 **조감도·전투 지도**에서 소형 25×14, 중형 48×27, 대형 72×41칸을 선택하거나 가로·세로·비율·한 칸 해상도를 직접 설정합니다. 던전 내부의 **방 전투지도**에도 같은 설정을 사용할 수 있습니다. 기본 한 칸은 5ft이며 개별 생성 PNG 에셋을 조립해 지도를 만듭니다. [크기 기준과 에셋 안내](docs/02-design/battle-map-scale.md)를 참고하세요.

## 환경 설정

Windows에서 프로젝트 경로에 `&`가 포함되어 npm 래퍼가 실패하면 아래처럼 Vite를 직접 실행할 수 있습니다.

```bash
node node_modules/vite/bin/vite.js --host 127.0.0.1
```

클라우드 기능은 [`.env.example`](.env.example)의 값을 실제 bkend.ai 프로젝트에 맞게 설정한 경우에만 활성화됩니다. 클라우드를 구성하지 않아도 생성, 편집, 로컬 자동 저장, 파일 입출력은 모두 사용할 수 있습니다.

공개 배포는 [단일 소스 릴리스 절차](docs/02-design/single-source-release.md)에 따라 GitHub의 고정 커밋에서 생성합니다. 정보 탭과 `/build-info.json`에서 실제 실행 커밋을 확인할 수 있습니다. 아이템 미적용 초안은 로컬 복구 기록에 자동 보존하며, FPB/클라우드 파일에는 적용 전까지 포함하지 않습니다.

클라우드 쓰기는 [불변 리비전 설정](docs/02-design/bkend-cloud-setup.md)의 소유자 RLS·복합 고유 인덱스를 실제로 검증한 뒤 `VITE_BKEND_CONCURRENCY=immutable-v1`을 설정해야 합니다. 프로젝트 삭제는 목록 숨김 리비전이며 과거 파일의 영구 삭제/용량 회수는 별도 운영 작업입니다.

## 검증

```bash
node node_modules/typescript/bin/tsc
node node_modules/vitest/vitest.mjs --run
node node_modules/vite/bin/vite.js build
```

기능 회귀 테스트: `node node_modules/@playwright/test/cli.js test tests/e2e/planet-campaign.spec.ts --project=chromium --workers=1`. Playwright 번들 브라우저가 없으면 설치된 Chrome을 사용하도록 `FPB_BROWSER_CHANNEL=chrome` 환경변수를 지정할 수 있습니다.

## 원본 프로젝트 및 라이선스

이 프로젝트는 MIT 라이선스의 [Azgaar Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator)를 기반으로 하며, 기준 커밋은 `03a10502b0293b2afdb37b506f8b25178ce06c4f`입니다. 원저작권과 허가문은 [LICENSE](LICENSE)에 유지됩니다.

NPC 능력치와 아이템의 SRD 5.1·5.2.1 출처, CC BY 4.0 고지 및 번역·창작 범위는 [규칙 라이선스](public/legal/srd.html)에 기재되어 있습니다.

가져온 SVG와 노트 HTML의 정화에는 [DOMPurify](https://github.com/cure53/DOMPurify)를 사용합니다. 배포물에 [DOMPurify 라이선스](public/legal/DOMPurify-LICENSE.txt)를 포함합니다.

---

## Upstream README

# Fantasy Map Generator

Azgaar's _Fantasy Map Generator_ is a free web application that helps fantasy writers, game masters, and cartographers create and edit fantasy maps.

Link: [azgaar.github.io/Fantasy-Map-Generator](https://azgaar.github.io/Fantasy-Map-Generator).

Refer to the [project wiki](https://github.com/Azgaar/Fantasy-Map-Generator/wiki) for guidance. The current progress is tracked in [Trello](https://trello.com/b/7x832DG4/fantasy-map-generator). Some details are covered in my old blog [_Fantasy Maps for fun and glory_](https://azgaar.wordpress.com).

[![preview](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/9502eae9-92e0-4d0d-9f17-a2ba4a565c01)](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/11a42446-4bd5-4526-9cb1-3ef97c868992)

[![preview](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/e751a9e5-7986-4638-b8a9-362395ef7583)](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/e751a9e5-7986-4638-b8a9-362395ef7583)

[![preview](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/b0d0efde-a0d1-4e80-8818-ea3dd83c2323)](https://github.com/Azgaar/Fantasy-Map-Generator/assets/26469650/b0d0efde-a0d1-4e80-8818-ea3dd83c2323)

Join our [Discord server](https://discordapp.com/invite/X7E84HU) and [Reddit community](https://www.reddit.com/r/FantasyMapGenerator) to share your creations, discuss the Generator, suggest ideas and get the most recent updates.

Contact me via [email](mailto:azgaar.fmg@yandex.com) if you have non-public suggestions. For bug reports please use [GitHub issues](https://github.com/Azgaar/Fantasy-Map-Generator/issues) or _#fmg-bugs_ channel on Discord. If you are facing performance issues, please read [the tips](https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Tips#performance-tips).

You can support the project on [Patreon](https://www.patreon.com/azgaar).

_Inspiration:_

- Martin O'Leary's [_Generating fantasy maps_](https://mewo2.com/notes/terrain)

- Amit Patel's [_Polygonal Map Generation for Games_](http://www-cs-students.stanford.edu/~amitp/game-programming/polygon-map-generation)

- Scott Turner's [_Here Dragons Abound_](https://heredragonsabound.blogspot.com)

## Contribution

Pull requests are highly welcomed. The codebase is messy and I will appreciate if you start with minor changes. Check out the [data model](https://github.com/Azgaar/Fantasy-Map-Generator/wiki/Data-model) before contributing.

The codebase is gradually transitioning from **vanilla JavaScript to TypeScript** while maintaining compatibility with the existing generation pipeline and old `.map` user files.

The expected **future** architecture is based on a separation between **world data**, **procedural generation**, **interactive editing**, and **rendering**. The application is conceptually divided into four main layers: world data and styles (state), generators (model), editors (controllers), renderers (view).

Flow:
settings → generators → world data → renderer
UI → editors → world data → renderer.

The data layer must contain no logic and no rendering code. Generators implement the procedural world simulation. Editors implement interactive editing tools used by the user. They perform controlled mutations of the world state. Editors can be viewed as interactive generators. The renderer converts the world state into SVG or WebGl graphics. Renderer must be pure visualization step and not modify world data.
