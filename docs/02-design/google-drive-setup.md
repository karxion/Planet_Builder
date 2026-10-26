# Google Drive 행성 파일 저장

클라우드 창의 Google Drive 영역에서 연결 → 현재 행성 저장 → 저장 목록의 파일을 선택해 열기를 사용한다. 기존 로컬 파일 저장과 bkend 설정은 유지된다. 각 수동 저장은 내 Drive에 타임스탬프가 붙은 새 `.fpb` 사본을 만든다. 기존 사본 덮어쓰기·삭제·자동 동기화는 하지 않는다. 필요 없는 사본은 사용자가 Drive에서 정리한다.

## Google 설정

1. Google Cloud 프로젝트에서 Google Drive API를 활성화한다.
2. Google Auth Platform의 앱 대상과 동의 화면을 설정한다. 테스트 상태라면 사용할 계정을 테스트 사용자에 등록한다.
3. 웹 애플리케이션 OAuth 클라이언트를 만든다. 승인된 JavaScript 원본에 `https://fantasy-planet-builder.karxion.chatgpt.site`와 로컬 개발용 `http://localhost:5173`을 등록한다. 경로는 넣지 않는다.
4. `https://www.googleapis.com/auth/drive.file` 범위를 설정한다. Google Identity Services의 토큰 팝업 방식을 사용하므로 승인된 리디렉션 URI는 필요 없다.
5. 앱의 기본 공개 클라이언트 ID는 `1009720427725-89275bti276lai30d8vsj10hoqunmjgc.apps.googleusercontent.com`이다. 다른 배포에서는 빌드 환경의 `VITE_GOOGLE_DRIVE_CLIENT_ID`로 재정의한다. 보안 비밀은 프런트엔드에 넣지 않는다.
6. 변경된 앱을 빌드·배포한다. OAuth 콘솔 설정만으로 기존 배포에 새 기능이 생기지 않는다.

앱은 `drive.file` 최소 범위로 자신이 만든 파일 중 `appProperties.fpb=1`인 파일만 목록에 표시한다. Drive에 수동 업로드한 기존 FPB의 전체 검색/Picker 선택은 이 구현에 포함하지 않는다. 그런 파일은 기존 파일 열기로 불러온 뒤 앱에서 Drive에 저장한다. Picker API나 API 키는 현재 구현에 필요 없다.

토큰은 메모리에만 보관한다. 새로고침·만료 시 다시 연결한다. 연결 해제는 토큰 폐기를 요청하고 로컬 토큰을 즉시 지우지만 저장한 Drive 파일은 유지한다. 네트워크 장애로 폐기 요청이 전달되지 않았다면 Google 계정의 연결된 앱 화면에서 접근 권한을 해제할 수 있다. 로그인·다운로드가 취소되거나 실패해도 현재 프로젝트를 교체하지 않는다. 다운로드 중 편집한 프로젝트를 오래된 응답으로 교체하지 않도록 세션·편집 리비전을 검사한다. 다운로드 크기 제한과 기존 `.fpb` 구조 검증을 적용한다.

네트워크 정책/CSP를 별도로 운영한다면 Google Identity Services(`accounts.google.com`)와 Drive API(`www.googleapis.com`) 및 Google 인증 팝업에 필요한 공식 도메인을 허용한다. CSP의 정확한 허용 항목은 Google Identity Services의 현재 안내를 따른다.

## 검증

모의 OAuth/Drive 테스트는 권한 거부·팝업 취소·페이지네이션·사본 업로드·만료·계정 변경·크기 제한을 검증한다. 실제 사용자 Google 동의는 자동화하지 않는다. 공개 도메인에서 테스트 계정으로 연결하고 저장한 파일을 새 세션/다른 기기에서 열어 지도·NPC·아이템이 복원되는지 확인해야 한다. 일반 공개 전 Google 콘솔의 게시/검증 요구사항을 완료한다.

구현 검증 결과: Drive 단위 테스트 7개 통과, 타입 검사 및 프로덕션 빌드 통과. Chromium에서 Google OAuth/Drive 응답만 모의 처리하고 실제 생성한 지도 파일(약 2.4 MB)을 업로드·다운로드·디코딩·복원하는 왕복 검사를 통과했다. 전체 1003개 테스트 중 1002개 통과. 기존 `project-codec.test.ts`의 `accepts the inclusive byte limit` 1개는 변경 전 HEAD를 별도 임시 디렉터리에 추출해도 동일하게 실패했다. 실제 Google 계정 연결 및 공개 사이트 배포는 아직 수행하지 않았다.
