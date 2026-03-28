---
name: tds-cross-verify
description: "TDS 라이브러리 ↔ 프로덕트 파일 교차 검증. 오탐 방지(componentKey 기반), 네이밍 위반 탐지, 통합/분리 후보 탐지. Use when user says '교차 검증', 'cross verify', '점검', '라이브러리 검증'."
---

# TDS Cross Verify

TDS 라이브러리와 프로덕트 파일을 교차 검증합니다.

**MANDATORY**: 모든 매칭은 **componentKey 기반**. 이름 기반 매칭 금지.

## SSOT

- TDS fileKey: `H36eNEd6o7ZTv4R7VcyLf2`
- 네이밍 규칙: `.claude/rules/naming-policy.md`
- QA 루브릭: `.claude/rules/qa-rubric.md`

## 핵심 원칙: 오탐 방지

| 방법 | 이유 |
|------|------|
| `mainComponent.remote === true` → TDS 소속 | 이름 불일치 무시 |
| `figma.root.findAll` 전체 트리 검색 | 중첩 프레임 안 컴포넌트 누락 방지 |
| `componentKey` 기반 매칭 | 이름 변경/오타에 강건 |

**금지:**
- 이름만으로 "TDS에 없음" 판단 금지
- `page.findAll`로 범위 제한 금지
- 증거 없는 "통합 필요" 판단 금지

## 도구 선택 + 20KB 대응

> 상세: `.claude/rules/figma-mcp-tool-guide.md`

- **읽기 우선**: 구조 파악은 `get_metadata`, 상세는 `get_design_context`. `use_figma`는 `componentProperties`/`boundVariables` 등 read 도구로 불가능한 조회에만 사용.
- **use_figma 사용 시 분할 필수**: TDS 90개+ 컴포넌트를 한번에 return하면 20KB 초과. **페이지별 분할** 또는 **카운트 → 상세 분리** 패턴 적용.

## Workflow

### Phase 1: TDS 라이브러리 인벤토리

```javascript
// 전체 컴포넌트 세트 + 단일 컴포넌트 수집
const allSets = figma.root.findAll(n => n.type === "COMPONENT_SET");
const allSingles = figma.root.findAll(n => n.type === "COMPONENT" && n.parent?.type !== "COMPONENT_SET");

// key → { name, page, id, props } 매핑
```

출력: `{ totalSets, totalSingles, keyMap }`

### Phase 2: 프로덕트 파일 사용처 스캔

```javascript
// 인스턴스의 mainComponent.remote 체크
const isRemote = inst.mainComponent.remote;
// remote === true → TDS 라이브러리 소속 (오탐 방지)
// remote === false → 로컬 컴포넌트 또는 다른 라이브러리
```

출력:
- TDS 인스턴스 사용 빈도 (componentKey 기반)
- 비-TDS 로컬 프레임/컴포넌트 목록
- 미사용 TDS 컴포넌트 목록

### Phase 3: 네이밍 위반 탐지

**3-1. 컴포넌트 세트명**

```javascript
// naming-policy.md 기준 검증
for (const set of allSets) {
  const name = set.name;
  // 체크 항목:
  // 1. Title Case 공백 여부 (kebab-case, camelCase 금지)
  // 2. 금지 접미사 (Container, Wrapper, Content, Box, View, Div)
  // 3. 특수문자 (: ↳ / 레이어명 내)
  // 4. 이중 공백
  // 5. 앞뒤 공백 (trim)
  // 6. private 접두어 (.) 규칙 준수
}
```

**3-2. Property 네이밍**

```javascript
for (const [key, def] of Object.entries(set.componentPropertyDefinitions)) {
  const propName = key.split("#")[0]; // Figma가 #id를 붙임

  // Boolean: Title Case 공백 + Show/Is/Has 접두어
  //   OK: "Show Badge", "Is Active", "Show Icon"
  //   NG: "showBadge", "badge", "ShowBadge"

  // Variant key: 첫 글자 대문자
  //   OK: "Type", "Size", "State"
  //   NG: "type", "size"

  // Variant value: lowercase
  //   OK: "default", "destructive", "sm"
  //   NG: "Default", "Destructive"

  // Instance Swap: "↳ " 접두어 허용 (Figma 관례)
  // Text: 내용 설명적
  // Slot: "↳ " 접두어 허용
}
```

**3-3. 일관성 검사**

```javascript
// 같은 의미의 property가 다른 이름으로 사용되는지
// 예: "Show Reddot" vs "Show Red Dot" vs "Show RedDot"
// 예: "Selected" (variant) vs "Is Selected" (boolean)
```

### Phase 4: 통합/분리 후보 탐지

**4-1. 통합 후보 (유사 컴포넌트)**

탐지 기준:
- 이름이 유사 (Levenshtein distance ≤ 3 또는 공통 접두어)
- Property 구조가 70%+ 동일
- 동일 페이지에 위치

```javascript
// 예: Content Header + Content Section Header → 통합 검토
// 예: Challenge Thumbnail + Challenge Mission Card Thumbnail → 중복?
```

**4-2. 분리 후보 (과대 컴포넌트)**

탐지 기준:
- Variant 수 > 50
- Property 수 > 15
- 도메인 특화 + 범용 variant 혼재

**4-3. 페이지 이동 후보**

| 기준 | 이동 대상 |
|------|----------|
| `.` 접두어 (private) + 독립 사용 0건 | Primitives |
| 다른 컴포넌트 내부에서만 사용 | Primitives |
| 도메인 특화 (Challenge, Participant 등) | Composed/Blocks |
| 유틸리티 (Icon Scaler, Kbd) | Primitives |

### Phase 5: 리포트 생성

```markdown
## TDS Cross Verification Report

> Date: YYYY-MM-DD | TDS: [commit] | Product: [fileKey]

### 1. 인벤토리
| 항목 | TDS | 프로덕트 사용 |
|------|-----|-------------|

### 2. 네이밍 위반 (Critical/Major/Minor)
| 컴포넌트 | 위반 항목 | 현재 | 수정안 |
|---------|---------|------|--------|

### 3. Property 위반
| 컴포넌트 | Property | 위반 | 수정안 |
|---------|----------|------|--------|

### 4. 일관성 위반
| 패턴 A | 패턴 B | 사용처 | 추천 |
|--------|--------|--------|------|

### 5. 통합/분리 후보
| 대상 | 유형 | 근거 | 영향도 |
|------|------|------|--------|

### 6. 페이지 이동 후보
| 컴포넌트 | 현재 | 이동 대상 | 이유 |
|---------|------|---------|------|
```

## 실행 명령

```
/cross-verify                    # TDS 라이브러리 단독 검증
/cross-verify [product-node-id]  # 프로덕트 파일 교차 검증
/cross-verify --fix              # 자동 수정 가능 항목 실행
```

## 자동 수정 가능 항목 (--fix)

| 항목 | 방법 | 리스크 |
|------|------|--------|
| 컴포넌트명 trim (앞뒤 공백) | `set.name = set.name.trim()` | 없음 |
| 이중 공백 제거 | `set.name = set.name.replace(/  +/g, " ")` | 없음 |
| Boolean property Show/Is/Has 접두어 추가 | `editComponentProperty` | 중간 — 사용처 확인 필요 |

## 자동 수정 불가 항목 (수동)

| 항목 | 이유 |
|------|------|
| 컴포넌트명 변경 (Title Case) | Publish 후 사용처 참조 깨짐 가능 |
| Variant value 대소문자 변경 | 인스턴스 오버라이드 깨짐 |
| 컴포넌트 통합/분리 | 설계 판단 필요 |
| 페이지 이동 | Publish 후 사용처 확인 필요 |
