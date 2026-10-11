# 판타지 행성 빌더 Plan

> Status: Approved
> Date: 2026-07-12

## Executive Summary

| Perspective | Content |
|---|---|
| Problem | 평면 지도 생성 결과를 행성 단위로 제작·검토·보관하기 어렵다. |
| Solution | Azgaar FMG를 포크해 2D 편집 원본, 3D 행성 투영, `.fpb` 프로젝트, 개인 클라우드 저장을 제공한다. |
| Function/UX Effect | 생성, 편집, 행성 검토, 저장을 하나의 한국어 작업 셸에서 수행한다. |
| Core Value | TRPG GM과 세계관 작가가 빠르게 일관된 행성을 만든다. |

## Context Anchor

| Key | Value |
|---|---|
| WHY | 지역 지도에서 행성 전체 세계관으로 작업 단위를 확장한다. |
| WHO | TRPG GM과 세계관 작가 |
| RISK | 평면 토폴로지, 대용량 저장, 기존 전역 상태 |
| SUCCESS | 2D/3D 동기화, `.fpb` 왕복, 자동 저장, 빌드와 테스트 통과 |
| SCOPE | 2D 편집 원본 + 3D 투영, 로컬 우선, 선택적 bkend 저장 |

## Requirements

- 10K 셀 FMG 생성·편집 기능을 유지한다.
- 2:1 세계 지도와 Three.js globe를 연결한다.
- 버전이 있는 gzip JSON `.fpb`를 저장·불러온다.
- 기존 `.map`을 가져온다.
- IndexedDB 자동 저장과 선택적 bkend 비공개 저장을 제공한다.
- 핵심 작업 셸을 한국어로 제공하고 MIT 고지를 유지한다.
