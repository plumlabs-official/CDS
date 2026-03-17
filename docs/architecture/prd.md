# Project Overview

> Tryve Design System
>
> Last updated: 2026-03-17 | v3.0.0

---

> **Note**: 이 문서는 **SSOT가 아닙니다** (배경/맥락 설명용).
> 현재 범위/제약/규칙은 [`docs/specs/`](../specs/)를 참조하세요.

---

> **기술 사양**: [`docs/specs/technical-spec.md`](../specs/technical-spec.md) 참조

---

## Summary

Figma 디자인 파일을 바이브코딩(Tailwind+React+shadcn)에 최적화하는 디자인 시스템 도구 모음.

### Target User
- 디자이너: Figma 파일 정리, 네이밍 표준화
- 개발자: 바이브코딩 시 1:1 매핑 가능한 디자인 시스템

### Mission
> TDS 적용 + QA 검증된 Figma 화면 → AI가 즉시 코드로 변환 가능

---

## Core Features

### 1. Renamer (TDS Tools 플러그인)
네이밍 정책 v1.1 기반 자동 리네이밍

- **Mode 1 — Product Design**: 사용처 화면의 프레임/레이어 리네이밍
- **Mode 2 — TDS Library**: 컴포넌트 Display Name + 프로퍼티 점검

### 2. Docs Generator (TDS Docs 플러그인)
TDS 라이브러리 문서 자동 생성

### 3. Migrator (Migrate to TDS 플러그인)
기존 디자인 → TDS 컴포넌트 마이그레이션

### 4. QA Agent (`/qa` 커맨드)
8축 루브릭 기반 바이브코딩 적합성 자동 점검

---

## Tech Stack

| 영역 | 기술 |
|------|------|
| Figma Plugins | TypeScript, esbuild |
| QA | Claude Code `/qa` 커맨드 + Figma MCP |

---

## Constraints

### 네이밍 규칙
- `.claude/rules/naming-policy.md` 참조
- Container/Wrapper/Box/View/Div 금지
- Title Case 공백 필수

### 기술 제약
- Figma 플러그인은 외부 API 직접 호출 불가
- ES6+ 일부 문법 미지원 (esbuild 타겟 es6)

---

## 관련 문서

| 문서 | 역할 |
|------|------|
| [../specs/technical-spec.md](../specs/technical-spec.md) | 기술 사양 |
| [../../.claude/rules/naming-policy.md](../../.claude/rules/naming-policy.md) | 네이밍 정책 |
| [../../.claude/rules/qa-rubric.md](../../.claude/rules/qa-rubric.md) | QA 루브릭 |
