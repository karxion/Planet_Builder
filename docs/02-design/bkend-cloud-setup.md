# bkend.ai Cloud Setup

판타지 행성 빌더는 클라우드 설정이 없어도 완전한 로컬 앱으로 동작한다. 개인 비공개 저장을 활성화할 때만 아래 리소스를 준비한다.

## 환경 변수

| Key | Value |
|---|---|
| `VITE_BKEND_API_URL` | bkend `get_context` 또는 콘솔에서 받은 Service API URL (`/v1` 포함) |
| `VITE_BKEND_PROJECT_ID` | 프로젝트 ID |
| `VITE_BKEND_ENV` | `dev`, `staging`, `prod` 중 하나 |

## projects 테이블

| Field | Type | Constraint |
|---|---|---|
| `name` | String | required |
| `fileId` | String | required |
| `thumbnailFileId` | String | optional |
| `schemaVersion` | Number | required |
| `sourceFmgVersion` | String | required |
| `revision` | Number | required, default 1 |
| `sizeBytes` | Number | required |

`id`, `createdBy`, `createdAt`, `updatedAt`은 bkend 시스템 필드를 사용한다. `createdBy + updatedAt` 복합 인덱스를 만들고, 권한은 `admin: CRUD`, `self: CRUD`, `user/guest: none`으로 설정한다.

## 스토리지

- category: `documents`
- visibility: `private`
- 최대 크기: 압축 후 20MB
- 순서: presigned URL 생성, PUT 업로드, 메타데이터 등록, 프로젝트 revision 갱신, 이전 파일 삭제

실제 프로젝트와 테이블 생성은 테넌트 권한이 필요한 외부 배포 작업이다. 이 저장소에는 해당 리소스를 사용하는 클라이언트와 안전한 미설정 상태만 포함한다.
