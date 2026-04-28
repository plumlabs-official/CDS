---
name: cds-make-component
description: "참조 프레임 → CDS 컴포넌트 자동 생성. 기존 CDS 인스턴스 재사용, 텍스트 스타일/변수 바인딩 복사, 프로퍼티 자동 정의. Use when user says '/make-component', '컴포넌트 만들기', 'make component', '컴포넌트 생성'."
---

# CDS Make Component

프로덕트 파일의 참조 프레임을 분석하여 CDS 라이브러리에 정규 컴포넌트를 생성합니다.

**MANDATORY**: load `figma-use` before every `use_figma` call.
**Always pass `skillNames: "cds-make-component"` when calling `use_figma`.**

## Trigger

```
/make-component [Figma URL] [component name]
```

- **URL**: 프로덕트 파일의 참조 프레임 Figma URL
- **Name**: 생성할 컴포넌트명 (Title Case 공백, naming-policy.md 준수)

## SSOT

| 참조 | 용도 |
|------|------|
| `.claude/skills/figma-use/SKILL.md` | Plugin API 규칙 (필수 선행 로드) |
| `.claude/rules/naming-policy.md` | 컴포넌트/레이어 네이밍 |
| `.claude/rules/qa-rubric.md` | R4 프로퍼티 설계, R5 합성 구조 |
| `.claude/rules/figma-mcp-tool-guide.md` | MCP 도구 선택, 20KB 제한 대응 |

## Constants

| 항목 | 값 |
|------|---|
| CDS fileKey | `H36eNEd6o7ZTv4R7VcyLf2` |
| 필수 폰트 | IBM Plex Sans KR Regular, IBM Plex Sans KR SemiBold (최소) |
| use_figma return 상한 | 20KB |
| 호출당 노드 상한 | ≤50 노드 |

## Core Principles (NON-NEGOTIABLE)

1. **기존 CDS 인스턴스 재사용** — 절대 기본 도형으로 재생성하지 않는다. `importComponentByKeyAsync`로 가져온다.
2. **텍스트 스타일/변수 바인딩 정확 복사** — textStyleId, boundVariables, fills, fontName, fontSize, lineHeight, letterSpacing 모두 복사.
3. **아이콘 스왑 복사** — 참조 프레임의 icon swap 상태를 그대로 가져온다.
4. **숨겨진 노드 포함** — `visible=false` 노드도 반드시 포함.
5. **원본 레이아웃 보존** — auto-layout mode, gaps, padding을 정확히 재현.
6. **원본 보존** — 참조 프레임은 복제본으로 작업, 원본 훼손 금지.
7. **프로퍼티 네이밍 규칙 준수** (naming-policy.md):
   - Boolean: `Show [Name]` (Title Case 공백) — Figma 디자이너 가독성 우선
   - TEXT: 설명적 이름
   - INSTANCE_SWAP: 슬롯명

## Workflow

### Phase 1: Analysis (read-only)

프로덕트 파일(`fileKey` = URL에서 추출)에서 참조 노드를 스캔한다. `use_figma`로 실행.
> **주의**: Phase 1은 프로덕트 파일 대상, Phase 3는 CDS 파일(`H36eNEd6o7ZTv4R7VcyLf2`) 대상. fileKey를 혼동하지 않는다.

**수집 대상:**

| 노드 타입 | 수집 항목 |
|-----------|----------|
| INSTANCE | `componentKey`, `componentProperties`, fills (이미지 해시용) |
| TEXT | `characters`, `textStyleId`, `boundVariables`, `fills`, `fontName`, `fontSize`, `lineHeight`, `letterSpacing` |
| FRAME | `layoutMode`, `itemSpacing`, padding (`paddingTop/Right/Bottom/Left`), `fills`, `cornerRadius`, `layoutSizingHorizontal/Vertical` |

**필수 작업:**
1. 숨겨진 노드 포함한 전체 트리 순회
2. 각 INSTANCE의 `componentKey` → CDS 소속 여부 확인
3. CDS 파일에 동명 컴포넌트 존재 여부 검색
4. CDS Components 페이지에서 관련 컴포넌트 그룹의 node ID, parent path, sibling 컴포넌트 근거 파악 (배치용)
5. 관련 그룹이 없으면 임시 생성하지 않고 사용자에게 새 그룹 생성 또는 대체 그룹 결정을 요청

**20KB 대응:**
- 필드 최소화: `{ id, name, type, componentKey, ...필요한것만 }`
- 노드 50개 초과 시 분할 스캔

### Phase 2: Design Proposal (승인 대기)

분석 결과를 아래 형식으로 출력한다.

```markdown
## Component Design: [Name]

### Structure
[컴포넌트 anatomy 트리 다이어그램]

### CDS Instances to Import
| Instance | Component Key | Properties |
|----------|--------------|------------|
| Button   | abc123...    | variant: primary, size: md |

### Properties
| Name | Type | Default | Connected To |
|------|------|---------|-------------|
| Show Badge | BOOLEAN | true | Badge.visible |
| Title | TEXT | "제목" | Title.characters |

### Placement
- Page: Components
- Group: [관련 컴포넌트 그룹명 + nodeId]
- Parent path: [Components > ... > 그룹명]
- Position: sibling of [관련 컴포넌트명]
- Placement reason: [도메인/맥락 근거]

### Naming Check
- Component name: [PASS/FAIL — naming-policy.md 기준]
- Layer names: [전체 PASS 여부]
- Property names: [Boolean 접두어, camelCase 등]
```

**MUST STOP** — 사용자 승인 없이 Phase 3 진행 금지.

### Phase 3: Creation (use_figma on CDS file)

**반드시 단계별 실행 (incremental). 한 번에 전부 만들지 않는다.**

#### Step 순서

| Step | 작업 | 검증 |
|------|------|------|
| a | 대상 그룹 frame/section 확인 + parent path 기록 | Phase 2 Placement와 일치 |
| b | 컴포넌트 프레임 생성 + auto-layout 설정 | `get_metadata`로 구조 확인 |
| c | CDS 인스턴스 import + 배치 (`importComponentByKeyAsync`) | return으로 ID 확인 |
| d | 인스턴스 componentProperties 설정 (참조에서 복사) | — |
| e | 텍스트 노드 생성 + textStyleId + boundVariables 바인딩 | — |
| f | 레이아웃 프레임 생성 + 설정 (중간 래퍼 등) | — |
| g | 컴포넌트 width, layoutSizing 설정 | — |
| h | 컴포넌트 프로퍼티 정의 추가 (TEXT, BOOLEAN, INSTANCE_SWAP) | — |
| i | componentPropertyReferences로 프로퍼티 ↔ 자식 노드 연결 | — |
| j | 생성된 모든 노드 ID 반환 | `get_screenshot` 시각 확인 |

#### Critical Rules (creation 시)

```
await figma.loadFontAsync()       — 텍스트 조작 전 필수
layoutSizingHorizontal = 'FILL'   — appendChild() 이후에 설정
resize() 호출 시 sizing 리셋됨    — resize() 먼저, layoutSizing 나중에
lineHeight/letterSpacing          — 반드시 {unit, value} 형식 ({unit:"PIXELS", value:24})
Colors in 0-1 range               — {r: 1, g: 0, b: 0}
return value < 20KB               — 초과 시 silent truncation
All async calls must be awaited   — fire-and-forget 금지
페이지 컨텍스트 리셋              — use_figma 호출마다 setCurrentPageAsync 필요
```

#### 폰트 로드 패턴

```js
// 최소 필수 폰트
await figma.loadFontAsync({ family: "IBM Plex Sans KR", style: "Regular" });
await figma.loadFontAsync({ family: "IBM Plex Sans KR", style: "SemiBold" });
// 참조 프레임에서 발견된 추가 폰트도 로드
```

#### 인스턴스 import 패턴

```js
const component = await figma.importComponentByKeyAsync("COMPONENT_KEY");
const instance = component.createInstance();
parentFrame.appendChild(instance);
// appendChild 이후에 sizing 설정
instance.layoutSizingHorizontal = 'FILL';
```

#### 프로퍼티 정의 패턴

```js
// Boolean property
component.addComponentProperty("showBadge", "BOOLEAN", true);

// Text property
component.addComponentProperty("title", "TEXT", "제목");

// Instance swap property
component.addComponentProperty("icon", "INSTANCE_SWAP", "PREFERRED_VALUE_ID");
```

#### 프로퍼티 연결 패턴

```js
// 자식 노드의 프로퍼티를 컴포넌트 프로퍼티에 연결
childNode.componentPropertyReferences = {
  visible: "showBadge",       // BOOLEAN
  characters: "title",        // TEXT
  mainComponent: "icon"       // INSTANCE_SWAP
};
```

### Phase 4: Validation

1. **배치 검증** — 새/수정 컴포넌트 parent path가 Phase 2의 관련 컴포넌트 그룹과 일치하고, 관련 CDS 컴포넌트의 sibling인지 확인. 무관 page/root 배치 금지.
2. **시각 검증** — `get_screenshot`으로 새 컴포넌트 캡처, 참조 프레임 스크린샷과 비교
3. **네이밍 검증** — naming-policy.md 기준:
   - 컴포넌트명: Title Case 공백
   - 레이어명: 허용 어휘, 금지 접미사 없음
   - 자동 생성명 없음
4. **프로퍼티 검증** — qa-rubric R4 기준:
   - Boolean: `Show`/`Is`/`Has` 접두어 (Figma display name은 Title Case 공백)
   - Variant key: camelCase
   - Variant value: lowercase
   - 프로퍼티 20개 이하
5. **구조 검증** — qa-rubric R5 기준:
   - 중첩 깊이 ≤3 권장
   - 불필요 래퍼 프레임 없음
6. **불일치 리포트** — 차이점 발견 시 목록으로 보고

## Error Handling

| 상황 | 대응 |
|------|------|
| `use_figma` 실패 | STOP → 에러 메시지 읽기 → 수정 → 재시도 (스크립트는 atomic) |
| CDS에 동명 컴포넌트 존재 | 사용자에게 경고 → 업데이트 or 스킵 선택 요청 |
| 참조 노드 미발견 | 사용자에게 URL 확인 요청 |
| 20KB return 초과 | 분할 호출 패턴 적용 (카운트 → 상세) |
| 폰트 로드 실패 | 에러에서 font family/style 확인 → 정확한 이름으로 재시도 |

## Anti-Patterns (금지)

| 금지 | 이유 | 대안 |
|------|------|------|
| CDS 인스턴스를 기본 도형으로 재생성 | 스타일/바인딩/프로퍼티 유실 | `importComponentByKeyAsync` 사용 |
| 한 번의 use_figma에 전체 생성 | 디버깅 불가, 20KB 초과 | 단계별 incremental 생성 |
| appendChild 전에 layoutSizing 설정 | Figma API 에러 | appendChild 후 설정 |
| 텍스트 조작 전 폰트 미로드 | 에러 발생 | `loadFontAsync` 선행 |
| 승인 없이 Phase 3 진행 | 사용자 의도와 불일치 위험 | Phase 2에서 반드시 STOP |
| 참조 원본 직접 수정 | 원본 훼손 | 복제본으로 작업 |
| current page/root에 임시 생성 후 방치 | 맥락 없는 CDS 배치로 탐색성과 재사용성이 깨짐 | 관련 컴포넌트 그룹의 sibling으로 이동 후 parent path 검증 |

## Related Skills

| Skill | 연계 시점 |
|-------|----------|
| `cds-naming-enforcer` | Phase 4 네이밍 위반 발견 시 |
| `cds-property-optimizer` | Phase 4 프로퍼티 위반 발견 시 |
| `cds-qa-auditor` | 생성 완료 후 전체 QA 실행 시 |
| `cds-cross-verify` | 프로덕트 파일에서 새 컴포넌트 사용 후 교차 검증 시 |
| `cds-review` | 컴포넌트화 후보 발견 → 이 스킬로 생성 (발견 경로) |

> **Post-workflow**: 생성 완료 후 CDS 라이브러리에서 **Publish** 필요. Publish는 Figma UI에서 수동 실행.
