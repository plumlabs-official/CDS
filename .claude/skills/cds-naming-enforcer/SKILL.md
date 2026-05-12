---
name: cds-naming-enforcer
description: "Enforces CDS naming-policy v2.0 on Figma layers. Detects banned suffixes, auto-generated names, wrong casing, and suggests fixes. Use when user says '네이밍 점검', '이름 수정', 'rename', 'naming fix'. For property issues use cds-property-optimizer, for full QA use cds-qa-auditor."
---

# CDS Naming Enforcer

Figma 레이어명을 CDS naming-policy v2.0 기준으로 점검하고 수정합니다.

**MANDATORY**: load `figma-use` before every `use_figma` call.
**Always pass `skillNames: "cds-naming-enforcer"` when calling `use_figma`.**

## SSOT

- 규칙 원본: `.claude/rules/naming-policy.md` v2.0
- 데이터 원본: `figma-plugins/cds/src/modules/renamer/rules.ts`
- QA 게이트: `figma-plugins/cds/src/modules/qa/core/naming-gate.ts`
- 상세 파이프라인: `references/rename-pipeline.md`

## 오탐 방지 원칙

| 규칙 | 이유 |
|------|------|
| `mainComponent.remote === true` → CDS 소속, 내부 레이어 검사 제외 | 라이브러리 컴포넌트 내부를 프로덕트 파일에서 검사하면 오탐 |
| `figma.root.findAll` 전체 트리 검색 | 중첩 프레임 안 컴포넌트 누락 방지 |
| `componentKey` 기반 CDS 소속 판별 | 이름 변경/오타에 강건 |
| 컴포넌트 Property 검사 시 CDS 원본에서 확인 | 프로덕트 파일의 인스턴스 오버라이드와 원본 구분 |

## Workflow

### Step 1: 대상 트리 읽기

`get_design_context`로 대상 노드의 레이어 트리를 가져옵니다.
- CDS 인스턴스 내부 레이어는 검사 제외 (오버라이드 안 했으면 원본 구조)
- INSTANCE 타입 노드 자체는 skip

### Step 2: 7단계 파이프라인 위반 감지

각 레이어명에 대해 순서대로 검사:

1. **한글 → 영문** — KOREAN_LABEL_MAP 25개 항목 매핑
2. **금지 접미사 제거** — `Container`, `Wrapper`, `Content`(래퍼), `Box`, `View`, `Div`
3. **슬래시 → 공백** — 레이어명의 `/`를 공백으로 (Variant 슬래시는 예외)
4. **PascalCase → Title Case** — `ChatArea` → `Chat Area`
5. **toTitleCase** — `body` → `Body`, `chat area` → `Chat Area`
6. **특수문자 제거** — `:`, `↳`, `↗`, `↘`, `↙`
7. **역할 접미사 추가** — 금지어 제거 시(bannedRemoved=true)만 발동, `Area`/`Group` 중 적절한 것 추가

### Step 3: Before/After 리포트

```
## Naming Enforcer Report

| # | 노드 ID | Before | After | 위반 |
|---|---------|--------|-------|------|
| 1 | 20199:6244 | Container Header | Header | 금지 접미사 |
| 2 | 20199:6245 | Frame 1234 | ... | 자동 생성명 |
```

감점 기준 (qa-rubric R2):
- 금지 접미사: Major -10
- 접미사 중복 (`Area Area`): Major -10
- 자동 생성명: Minor -5
- 특수문자: Minor -5
- 하드코딩 데이터: Minor -3
- CTA: Minor -5

### Step 4: 사용자 승인

**MUST STOP** — 리포트 출력 후 사용자 승인 대기.
승인 없이 `use_figma` write 금지.

### Step 5: 적용

승인 후 `use_figma`로 `node.name` 변경:

```js
const node = await figma.getNodeByIdAsync("NODE_ID");
node.name = "New Name";
return { success: true, nodeId: node.id, oldName: "Old", newName: "New" };
```

한 번에 하나의 `use_figma` 호출로 여러 노드 변경 가능하나, 50개 이하로 제한.

### Step 6: 검증

변경 후 `get_design_context`로 재확인. 2회 연속 실행 시 변경 0건 = 멱등성 확인.

## 금지 접미사 상세

| 접미사 | 대체 | 이유 |
|--------|------|------|
| Container | 역할명 또는 Area | Tailwind `container` 충돌 |
| Wrapper | 역할명 또는 Area | 시맨틱 없음 |
| Content (래퍼) | Body | 역할 불명확 |
| Box | 역할명 또는 Area | CSS-in-JS 전용 |
| View | 역할명 또는 Area | React Native 전용 |
| Div | 역할명 또는 Area | 구현 상세 |

## 허용 역할 어휘

`Screen`, `Body`, `Header`, `Footer`, `Section`, `Area`, `Sidebar`, `Scroll Area`, `List`, `Grid`, `Navbar`, `Tab Bar`, `Input`, `Form`, `Card`, `Group`

## shadcn 매핑

레거시명 자동 변환: `Sheet` → `Drawer`

## 예외

- M3 "Container": CDS 컴포넌트 anatomy 내부 최외곽 파트는 허용
- 단, M3 예외는 evidence에서 `isM3Anatomy=true`일 때만 허용. 이름이 `Container`라는 이유만으로 통과시키지 않음
- `.` `_` 접두어: 퍼블리시 제외 (Figma 공식)
- CDS 인스턴스 내부: 검사 제외
