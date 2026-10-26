# bkend.ai Cloud Setup

판타지 행성 빌더는 클라우드 설정이 없어도 완전한 로컬 앱으로 동작한다. 개인 비공개 저장을 활성화할 때만 아래 리소스를 준비한다.

## 환경 변수

| Key | Value |
|---|---|
| `VITE_BKEND_API_URL` | bkend `get_context` 또는 콘솔에서 받은 Service API URL (`/v1` 포함) |
| `VITE_BKEND_PROJECT_ID` | 프로젝트 ID |
| `VITE_BKEND_ENV` | `dev`, `staging`, `prod` 중 하나 |

## 충돌 방지 프로토콜: immutable-v1

기존 `projects` 레코드를 PATCH로 덮어쓰는 방식은 사용하지 않는다. 저장·이름 변경·삭제 모두 `project_revisions`에 새 리비전을 POST한다. 실제 백엔드는 아직 생성하지 않았다. 아래 제약을 설정하고 실계정 테스트한 뒤에만 `VITE_BKEND_CONCURRENCY=immutable-v1`을 설정한다. 미설정 상태의 쓰기는 업로드 전에 차단한다.

현재 공식 문서 기준 REST API에는 `X-API-Key`로 **publishable** 키가 필요하다. `VITE_BKEND_PUBLISHABLE_KEY`에 설정하며 secret/admin 키는 프런트엔드·VITE 변수에 절대로 넣지 않는다. 기존 project/environment 헤더도 호환을 위해 유지한다. 실제 인증·파일 API 계약은 프로젝트 생성 시 콘솔의 현재 API 스키마로 다시 검증한다.

## project_revisions 테이블

| Field | Type | Constraint |
|---|---|---|
| `projectId` | String | required, 논리적 프로젝트 UUID |
| `revisionKey` | String | required, `JSON.stringify([projectId, revision])` |
| `projectCreatedAt` | String | required, 최초 프로젝트 생성 시각 |
| `deleted` | Boolean | required, default false |
| `name` | String | required |
| `fileId` | String | required |
| `thumbnailFileId` | String | optional |
| `schemaVersion` | Number | required |
| `sourceFmgVersion` | String | required |
| `revision` | Number | required, default 1 |
| `sizeBytes` | Number | required |

`id`, `createdBy`, `createdAt`, `updatedAt`은 bkend 시스템 필드를 사용하며 요청으로 덮어쓰지 않는다.

필수 인덱스:

- **UNIQUE `(createdBy, revisionKey)`**. 동일 사용자의 동일 프로젝트/리비전 POST가 정확히 한 번만 성공해야 한다. 다른 사용자의 가짜 projectId가 원 소유자의 저장을 막지 않도록 소유자도 고유 키에 포함한다.
- 조회 `(createdBy, projectId, revision desc)`.
- 목록 `(createdBy, createdAt desc)`.

필수 권한:

- 로그인 사용자가 자신의 레코드를 생성하고 자신의 레코드만 읽도록 한다. guest 및 타 사용자 읽기는 금지한다.
- 클라이언트의 기존 리비전 **UPDATE/DELETE는 모두 금지**한다. 레코드 불변성이 전제다. 관리자 정리 기능은 서버 운영 작업으로 분리한다.
- 권한 UI의 user/self 구체 설정은 현재 콘솔 규약에 맞춘다. 문서의 역할 이름만 복사하지 말고 두 실계정으로 생성·읽기·수정·삭제를 확인한다.

같은 r을 읽은 두 PC가 모두 r+1을 POST해도 UNIQUE가 하나를 409로 거부한다. 프런트엔드 revision 사전 조회는 빠른 안내일 뿐 최종 방어가 아니다. 409는 `ProjectConflictError`가 되며 기존 별도 복사 보존 UI로 연결된다. 이름 변경/삭제도 같은 슬롯을 경쟁하고, 삭제는 파일 파괴가 아닌 새 tombstone 리비전이다. 최신 숫자 revision을 선택해 삭제된 프로젝트가 과거 목록에서 되살아나지 않게 한다.

기존 `projects` 테이블이 있다면 자동으로 덮어쓰거나 삭제하지 않는다. 소유자별로 FPB를 백업하고 검증된 관리자 마이그레이션으로 새 테이블에 최초 리비전을 넣거나 앱에서 별도 프로젝트로 다시 저장한다. 이번 공개판에는 설정된 클라우드가 없으므로 실데이터 마이그레이션은 수행하지 않았다.

## 스토리지

- category: `documents`
- visibility: `private`
- 최대 크기: 압축 후 20MB
- 순서: 새 presigned URL 생성, PUT 업로드, private 파일 등록, 불변 리비전 POST
- 경쟁에서 진 저장의 새 파일만 정리한다. 네트워크 단절·5xx·408·잘못된 성공 응답처럼 커밋 여부가 불명확하면 파일을 삭제하지 않는다.
- 이전 파일은 과거 리비전과 진행 중 다운로드가 참조할 수 있으므로 즉시 삭제하지 않는다. 삭제 프로젝트도 숨김 처리이며 저장 용량을 반환하는 영구 삭제가 아니다. 서버 보존 기간·참조 검사·관리자 GC는 추후 별도 구현해야 한다.

## 활성화 전 체크리스트

1. dev에서 동일 소유자의 동일 revisionKey POST 2개 중 하나만 201, 다른 하나는 409인지 확인한다.
2. user A가 B의 리비전·목록·private 파일·다운로드 URL을 읽거나 변경할 수 없는지 확인한다.
3. 같은 사용자 두 PC로 저장 대 저장, 이름 변경 대 저장, 삭제 대 저장을 경합시킨다. 정확히 하나만 성공해야 한다.
4. 응답 유실 뒤 재접속 시 최신본을 다시 읽고 이전 파일과 새 커밋 파일이 남아 있는지 확인한다.
5. 토큰 갱신·만료된 업로드 URL·용량 초과·페이지네이션을 검증한다.
6. staging에서 반복 후 prod를 설정하고 `VITE_BKEND_CONCURRENCY=immutable-v1`로 새 빌드를 만든다. 이 변수는 서버 제약을 설치하는 스위치가 아니다.

코드 회귀 테스트의 모의 서버는 UNIQUE를 강제한다. 이 테스트가 실제 bkend RLS·인덱스 설정을 대신하지 않는다.

공식 근거: [고유 인덱스](https://github.com/ww-w-ai/bkend-docs/blob/main/ko/console/09-index-management.md), [중복 생성 409](https://github.com/ww-w-ai/bkend-docs/blob/main/ko/database/03-insert.md), [필터링](https://github.com/ww-w-ai/bkend-docs/blob/main/ko/database/08-filtering.md), [정렬/페이지네이션](https://github.com/ww-w-ai/bkend-docs/blob/main/ko/database/09-sorting-pagination.md).

실제 프로젝트와 테이블 생성은 테넌트 권한이 필요한 외부 배포 작업이다. 이 저장소에는 해당 리소스를 사용하는 클라이언트와 안전한 미설정 상태만 포함한다.
