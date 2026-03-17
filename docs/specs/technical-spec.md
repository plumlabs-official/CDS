# Technical Specification

> 시스템 아키텍처 및 기술 정책
>
> Last updated: 2026-03-17 | v3.0.0

---

## Architecture

```
┌─────────────────────┐
│   Figma Plugin      │
│   (code.ts)         │
└─────────┬───────────┘
          │ postMessage
┌─────────▼───────────┐
│   UI (ui.html)      │
│   (sandbox iframe)  │
└─────────────────────┘
```

### 플러그인 구조
- Figma 플러그인은 `code.ts` (메인 스레드)와 `ui.html` (UI iframe) 간 `postMessage`로 통신
- 외부 네트워크 접근 없음 (로컬 전용)

---

## Figma Plugin Modules

### TDS Tools (`figma-plugins/tds/`)

| 모듈 | 역할 |
|------|------|
| `modules/renamer/` | 네이밍 정책 기반 자동 리네이밍 |
| `modules/docs-generator/` | 문서 생성 |

### Renamer 데이터 흐름

```
UI 버튼 클릭
  → code.ts: 선택 노드 수집
  → renamer.analyzeProductDesign() 또는 analyzeTDSLibrary()
  → UI: rename 목록 표시 (before → after)
  → 사용자 확인
  → code.ts: node.name = newName 일괄 적용
```

---

## Figma Plugin API 주의사항

### detachInstance() 크기 복원
```typescript
// 원래 크기 저장 → detach → 복원
const originalWidth = node.width;
const originalHeight = node.height;
const detached = node.detachInstance();

if (Math.abs(detached.width - originalWidth) > 1) {
  detached.resize(originalWidth, originalHeight);
}
```

### children 배열 순회
```typescript
// 직접 순회 - 삭제 시 에러
for (const child of node.children) { ... }

// 복사 후 순회
for (const child of [...node.children]) { ... }
```

### 좌표 계산
```typescript
// 절대 좌표 = 부모 좌표 + 상대 좌표
const absoluteX = parent.x + child.x;
const absoluteY = parent.y + child.y;
```

---

## 기술 제약

| 제약 | 해결 |
|------|------|
| ES6+ 일부 미지원 | esbuild 타겟 es6 |
| dynamic-page 모드 | `getNodeByIdAsync` 사용 필수 |

---

## 관련 문서

| 문서 | 역할 |
|------|------|
| [../architecture/prd.md](../architecture/prd.md) | 제품 요구사항 |
| [../architecture/lessons-learned.md](../architecture/lessons-learned.md) | 버그 패턴 |
| [../../.claude/rules/naming-policy.md](../../.claude/rules/naming-policy.md) | 네이밍 정책 |
