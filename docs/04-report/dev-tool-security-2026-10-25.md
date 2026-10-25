# 보안 개선 2단계: 개발 도구 의존성 갱신

## 범위

- 2026-10-25 DOMPurify 패치 후 남은 개발 의존성 경고 10개 항목을 처리했다. 이는 패키지 감사 항목 수이며 앱에서 재현된 공격 경로 수가 아니다.
- 앱 기능, 월드 생성기, 지도 저장 형식, 기존 저장 데이터 및 DOMPurify 정화 정책은 변경하지 않았다. 직전 단계의 DOMPurify 3.4.17 패치와 6개 회귀 테스트를 유지했다.
- 앱 버전은 1.1.0으로 유지한다. 아직 커밋·태그·GitHub 업로드·공개 앱 재배포를 하지 않았다.

## 변경

| 의존성 | 작업 전 설치 버전 | 작업 후 설치 버전 |
| --- | --- | --- |
| Vite | 8.0.16 | 8.1.6 |
| Vitest / @vitest/browser / @vitest/browser-playwright / @vitest/mocker | 4.1.6 | 4.1.12 |
| postcss | 8.5.15 | 8.5.31 |
| nanoid | 3.3.12 | 3.3.20 |
| source-map-js | 1.2.1 | 1.2.2 |
| undici | 7.30.0 | 7.30.1 |
| ws | 8.20.1 | 8.22.0 |

- Vite와 직접 사용하는 Vitest 3개 패키지를 검증한 버전으로 정확히 고정했다. Vite는 동일 메이저 내 마이너 업데이트이며 패치 버전만 바꾼 작업이 아니다.
- `npm install --ignore-scripts --no-fund`로 동기화한 뒤 남은 `undici`·`ws`를 `npm update undici ws --ignore-scripts --no-fund`로 갱신했다.
- 잠금 파일에는 위 도구의 Rolldown·Lightning CSS·플랫폼별 선택적 바이너리 등 연관 하위 패키지 업데이트도 포함된다. 잠금 파일 기준 패키지 경로 추가·삭제는 없었다.
- 새 프로덕션 의존성, 강제 overrides, `npm audit fix --force`는 사용하지 않았다. 설치 스크립트는 실행하지 않았다.

## 검증

| 검사 | 결과 |
| --- | --- |
| 전체 npm 감사 | 10개(critical 3 / high 6 / moderate 1) → 0개 |
| 프로덕션 npm 감사 | 0개 유지 |
| 의존성 트리 | `npm ls` 대상 패키지 검사 통과, Vite·Vitest 계열 버전 일치 |
| 전체 단위 테스트 | Vitest 4.1.12, 54개 파일 / 692개 통과 (`--maxWorkers=2`) |
| TypeScript | `tsc --noEmit` 통과 |
| Biome | 기존 보안 회귀 테스트 검사 통과; package.json은 현 Biome 설정의 검사 대상이 아님 |
| 프로덕션 빌드 | Vite 8.1.6 통과, 기존 레거시 스크립트·대형 청크 경고 유지 |
| 개발 서버 / 실제 화면 | 기동 확인 명령이 실행 정책에 차단되어 검증하지 못함 |
| Playwright E2E / 모바일 / 클라우드 | 미실행, 저장소의 E2E 자동 실행 금지 지침 유지 |

실제 명령은 Windows의 Node 25.4.0에서 실행했다. CI·개발 컨테이너의 Node 24는 두 도구의 선언된 지원 범위에 포함되지만 이번 작업에서 Node 24로 별도 실행한 것은 아니다. macOS·Linux 선택적 바이너리와 GitHub CI도 직접 실행하지 않았다.

감사 0개는 조회 시점의 알려진 의존성 경고가 없다는 뜻이다. 앱 전체 보안이나 실제 공개 사이트에 패치가 적용됐다는 보증이 아니다. 기존 대형 에셋·레거시 구조·저장 복구 문제도 이번 의존성 갱신으로 해결된 것은 아니다.

## 다음 우선순위

편집 초안과 확정 데이터를 구분하고, 자동 저장 표시·프로젝트별 복구 기록을 정리한다. 클라우드 충돌의 완전한 해결은 서버 측 원자적 revision 갱신 지원 확인이 별도로 필요하다.

## 출처

- [Vite 8.1.6 공식 릴리스](https://github.com/vitejs/vite/releases/tag/v8.1.6)
- [Vitest 4.1.12 공식 릴리스](https://github.com/vitest-dev/vitest/releases/tag/v4.1.12)
- [Vitest 수동 mock 등록 보안 공지](https://github.com/advisories/GHSA-qxg6-89mg-rqv8)
- [Vite Windows 에디터 실행 경로 보안 공지](https://github.com/advisories/GHSA-587h-7wmj-h5pm)
- [undici 콘텐츠 인코딩 처리 공지](https://github.com/advisories/GHSA-xjj6-f33q-929c)
- [ws 메모리 고갈 공지](https://github.com/advisories/GHSA-96hv-2xvq-fx4p)
