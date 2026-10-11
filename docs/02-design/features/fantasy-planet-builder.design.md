# 판타지 행성 빌더 Design

> Status: Approved
> Date: 2026-07-12

## Context Anchor

| Key | Value |
|---|---|
| WHY | 지역 지도에서 행성 전체 세계관으로 작업 단위를 확장한다. |
| WHO | TRPG GM과 세계관 작가 |
| RISK | 평면 토폴로지, 대용량 저장, 기존 전역 상태 |
| SUCCESS | 2D/3D 동기화, `.fpb` 왕복, 자동 저장, 빌드와 테스트 통과 |
| SCOPE | 2D 편집 원본 + 3D 투영, 로컬 우선, 선택적 bkend 저장 |

## Architecture

선택안은 Pragmatic Balance다. 기존 FMG 월드 데이터와 렌더러를 원본으로 유지하고 새 기능을 독립 서비스로 추가한다.

```text
Korean Shell -> PlanetBuilder -> FMG world data -> SVG / Globe renderer
                           |-> ProjectCodec -> IndexedDB / .fpb
                           |-> ProjectRepository -> bkend.ai
```

## Components

| Component | Responsibility |
|---|---|
| PlanetProject | 행성 설정, FMG 페이로드, 뷰 상태 계약 |
| ProjectCodec | gzip `.fpb` 인코딩·검증과 `.map` 래핑 |
| PlanetBuilder | 작업 셸, 생성 프리셋, 자동 저장, 2D/3D 전환 |
| ProjectRepository | bkend 인증, private 파일, 프로젝트 CRUD와 revision 충돌 |
| View3d | 행성 렌더링, 캡처, globe 위치 선택 이벤트 |

## Test Plan

- Codec 압축 왕복과 legacy `.map` 래핑 단위 테스트
- TypeScript 빌드와 Vitest 전체 실행
- Playwright에서 생성 완료, 2D/3D 전환, 설정 패널, 캔버스 픽셀 확인
- 클라우드 API는 환경 변수가 없을 때 안전한 비활성 상태를 검증
