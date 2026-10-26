# 단일 소스 배포

GitHub `karxion/Planet_Builder`의 main에 포함된 고정 커밋이 유일한 앱 소스다. Sites 체크아웃은 호스팅 운반용이며 코드 수정 장소가 아니다. 이전처럼 파일을 개별 복사하지 않는다.

## 릴리스 순서

1. GitHub 작업본에서 테스트·타입 검사·빌드를 통과시키고 커밋을 main에 push한다.
2. 공식 Sites 도구로 기존 Site를 열고, 깨끗한 호스팅 체크아웃을 확인한다. 프로젝트 ID는 `.openai/hosting.json`으로 동일성을 확인한다.
3. `node scripts/release-source.ts <Site-checkout-절대경로> <40자리-GitHub-커밋>`을 실행한다. origin 주소와 main 포함 여부를 확인하고 해당 커밋의 Git archive에서 앱 전체를 추출한다. 미커밋 작업·환경 변수·개인 지도·분석 스크린샷은 포함하지 않는다. 의존성 런타임은 복사하지 않는다.
4. package-lock이 바뀌었다면 호스팅 체크아웃에서 공식 설치 도구 또는 `npm ci`로 의존성을 설치한다.
5. 공식 Site workflow helper로 빌드·커밋/push·패키징한다. 앱 코드 수정 없이 완료해야 한다. 빌드 전 `.openai/release.json`의 소스 해시를 검사하며, 다르면 실패한다. 호스팅용 base `/`는 동일 Vite 설정에서 자동 선택한다.
6. helper가 반환한 **Site 소스 커밋**과 그 아카이브로 버전을 저장·배포한다. Site 커밋과 GitHub 커밋은 서로 다른 저장소의 커밋이므로 같아야 하는 것은 아니다.
7. 공개 `/build-info.json`의 `commit`이 선택한 **GitHub 커밋**, `sourceHash`가 release 명세와 일치하는지 확인한다. 정보 탭에도 앱 버전·GitHub 커밋·스키마 버전을 표시한다.

## 보호 장치

- 대상이 독립된 Git 루트가 아니거나 미커밋 변경이 있거나 Site ID가 다르면 중단한다.
- 교체 대상은 `RELEASE_PATHS`의 앱 소스·설정·라이선스뿐이다. Git·호스팅 manifest·로컬 환경 변수는 보존한다. 생성 결과 dist는 빌드에서 갱신한다.
- 재귀 교체/정리 대상의 절대경로와 symlink를 검사한다. 새 소스의 symlink는 허용하지 않는다.
- source hash는 실행 소스와 lockfile을 포함하며, Windows/Linux에서 같도록 해당 경로의 LF를 고정한다.
- 이전 Site 버전은 기존 아카이브로 롤백한다. GitHub에서는 각 기능 커밋을 별도로 되돌릴 수 있다.
- GitHub Actions는 main에서 같은 단위 테스트와 빌드를 수행한다. 실제 게시에는 Sites의 현재 인증·빌드 업로드가 필요하며, 자동 게시 파이프라인까지 새로 연결한 것은 아니다.

테스트: 커밋 외 수정이 유출되지 않음, dirty 대상 거부, 소스 해시 변경 감지, 환경 파일 보존, 동일 저장소 오지정 거부.
