# TDS (Tryve Design System)

> 바이브코딩(Tailwind+React+shadcn) 최적화 Figma 디자인 시스템 도구 모음

## Quick Start

### 1. 설치

```bash
npm install
```

### 2. 빌드

```bash
npm run build
```

### 3. 실행

```bash
# Figma에서 플러그인 로드
# Plugins > Development > Import plugin from manifest
# figma-plugins/tds/manifest.json 선택
```

## 프로젝트 구조

```
/
├── figma-plugins/
│   ├── tds/               # TDS Tools (Renamer)
│   ├── tds-docs/          # 문서 생성기
│   └── migrate-to-tds/    # TDS 마이그레이션
├── docs/                  # 문서
│   ├── specs/             # 규칙/사양 (SSOT)
│   ├── how-to/            # 작업별 가이드
│   └── architecture/      # 아키텍처/ADR
├── .claude/
│   └── rules/             # 네이밍 정책, QA 루브릭
└── .ai/                   # AI 협업용 메모리
```

## 주요 기능

- **Renamer**: 네이밍 정책 v1.1 기반 자동 리네이밍 (2모드: Product + Library)
- **Docs Generator**: TDS 라이브러리 문서 자동 생성
- **Migrator**: 기존 디자인 → TDS 컴포넌트 마이그레이션
- **QA Agent**: `/qa` 커맨드로 바이브코딩 적합성 8축 자동 점검

## 문서

| 문서 | 설명 |
|------|------|
| [.claude/rules/naming-policy.md](.claude/rules/naming-policy.md) | 네이밍 정책 v1.1 |
| [.claude/rules/qa-rubric.md](.claude/rules/qa-rubric.md) | QA 루브릭 v1.0 |
| [docs/specs/](docs/specs/) | 기술 사양 |
| [docs/architecture/](docs/architecture/) | 아키텍처 및 의사결정 |

## 개발

```bash
# 플러그인 watch 모드
npm run watch

# 타입 체크
npm run typecheck
```

## 라이선스

MIT
