# 지저·해저 오브젝트 선택과 지역 안내 수정

자연물·자원 PNG 그룹이 pointer-events:none으로 표시돼 선택되지 않았고, legacy 지도 mousemove가 지상 pack의 지역명과 노트만 조회했다.

전용 PNG에 클릭/탭·Enter/Space 선택과 투명 hit 영역을 연결했다. 영토 채움 위·도시/관문 아래로 배치하고 키보드 초점을 표시한다. 선택하면 공간 편집의 오브젝트 탭에 이름과 소재 지역·세력·지형이 열린다. 도시는 기존 편집과 해당 도시 NPC·아이템 버튼을 유지한다. 선택 자체는 세계 데이터와 FPB 기록을 변경하지 않는다.

공간별 위치 조회를 추가했다. 해저는 실제 셀 소유권과 수심·지형을, 지저는 활성 깊이 층의 영토·지역 및 지형을 사용한다. 공동 세계 내해와 암반에는 육지 영토를 표시하지 않는다. 지저·해저의 마우스 안내는 지상 셀·지역·노트 조회 전에 반환하고, 지상에서는 기존 경로를 사용한다. 저장 이름을 HTML 이스케이프한다. legacy JS와 CSS의 캐시 키도 갱신했다.

검증: 관련 Vitest 10개 파일 98개 통과. 후속 공간 전환 및 지상 복귀 경로를 포함한 2개 파일 7개 재검사 통과. TypeScript·Vite 빌드 통과. 독립 localhost에서 해저 광물·지저 석교 클릭, 소재 정보, 지저 영토 안내, 도시 클릭 후 이름·NPC/아이템 편집 진입을 확인했다. Playwright E2E와 전체 lint는 실행하지 않았다.

화면: 작업 폴더 `.codex/figma-world-npc/underwater-object-click.png`, `underground-object-click.png`, `underground-region-hover.png`. 기존 FPB·편집 초안·복구 구조와 공개 사이트 범위를 보존하며 main 고정 커밋을 Sites에 게시한다.
