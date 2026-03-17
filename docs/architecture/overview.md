# 시스템 아키텍처

> Tryve Design System 전체 구조
>
> Last updated: 2026-03-17 | v3.0.0

## 개요

```
┌─────────────────────────────────────┐
│         Figma Plugins               │
│                                     │
│  ┌───────────┐  ┌───────────────┐   │
│  │ TDS Tools │  │ TDS Docs      │   │
│  │ (Renamer) │  │ (Doc Gen)     │   │
│  └───────────┘  └───────────────┘   │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Migrate to TDS                │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 컴포넌트

### TDS Tools (`figma-plugins/tds/`)

- **역할**: Figma UI와 상호작용, 노드 조작
- **기술**: TypeScript, Figma Plugin API, esbuild
- **주요 모듈**:
  - `modules/renamer/` — 네이밍 정책 기반 자동 리네이밍 (2모드)

### TDS Docs (`figma-plugins/tds-docs/`)

- **역할**: TDS 라이브러리 문서 자동 생성

### Migrate to TDS (`figma-plugins/migrate-to-tds/`)

- **역할**: 기존 디자인 → TDS 컴포넌트 마이그레이션

## 데이터 흐름

### Renamer 파이프라인

```
1. [선택된 노드 / 페이지 전체]
      ↓
2. [walkTree 순회]
      ├── TDS 인스턴스 → skip
      └── 비-TDS 노드 → 분석
            ↓
3. [규칙 기반 이름 추론]
   (컨텍스트 + 시맨틱 역할)
            ↓
4. [before → after 목록 표시]
            ↓
5. [사용자 확인 → 일괄 적용]
```

## 의사결정 기록

- [ADR-0001: 네이밍 스키마](ADRs/ADR-0001-naming-schema.md)

## 관련 문서

- [네이밍 정책](../../.claude/rules/naming-policy.md)
- [QA 루브릭](../../.claude/rules/qa-rubric.md)
- [기술 사양](../specs/technical-spec.md)
