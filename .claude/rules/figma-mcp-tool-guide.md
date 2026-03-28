# Figma MCP 도구 선택 가이드

> Figma MCP 작업 시 도구 선택 규칙. 20KB 제한/rate limit 대응 포함.

## Decision Tree

```
Figma 작업 요청 받음
  │
  ├─ 읽기만 하면 되나?
  │   ├─ 구조/메타데이터만 필요 → get_metadata
  │   ├─ 코드+스크린샷+힌트 필요 → get_design_context
  │   ├─ DS 컴포넌트/변수/스타일 검색 → search_design_system
  │   ├─ 시각 검증만 → get_screenshot
  │   └─ 위 도구로 안 되는 읽기 (boundVariables, componentProperties 등)
  │       → use_figma (return 최소화 필수)
  │
  └─ 쓰기(생성/수정/삭제) 필요
      → use_figma
```

**원칙: read 도구로 할 수 있으면 use_figma 쓰지 않는다.**

## 도구별 제약

| 도구 | Rate Limit | Output 제한 | 용도 |
|------|-----------|-------------|------|
| `use_figma` | **면제** | **return 20KB** | JS 실행 (쓰기 + 특수 읽기) |
| `get_design_context` | 적용 (200/day) | 클라이언트 토큰 제한 | 노드 코드/스크린샷/힌트 |
| `get_metadata` | 적용 | 가벼움 | 구조/계층/카운트 |
| `search_design_system` | 적용 | 가벼움 | 키워드 기반 DS 검색 |
| `get_screenshot` | 적용 | 이미지 | 시각 검증 |

## use_figma 20KB 대응 패턴

`use_figma`의 `return` 값이 20KB 초과 시 **잘림** (silent truncation). 대량 데이터 조회 시 반드시 아래 패턴 적용:

### 패턴 1: 페이지별 분할

```
❌ 전체 페이지 한번에 스캔
✅ 호출 1: Primitives 페이지 → return
   호출 2: Composed 페이지 → return
   호출 3: 결과 종합
```

### 패턴 2: 필드 최소화

```
❌ return nodes.map(n => ({ ...전체속성 }))
✅ return nodes.map(n => ({ id: n.id, name: n.name, type: n.type }))
```

### 패턴 3: 카운트 → 상세 분리

```
호출 1: return { total: 90, violations: 5, violationIds: [...] }
호출 2: violationIds로 개별 상세 조회
```

## Rate Limit 메모

- Read 도구: Org 기준 200/day, 20/min (leaky bucket)
- Write 도구 (`use_figma`): 면제
- 초과 시 HTTP 429 + Retry-After
- 현재 일반 작업에서 병목 발생한 적 없음. 대량 배치 스캔 시에만 주의.
