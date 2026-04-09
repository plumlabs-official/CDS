---
name: product-designer
description: "미팅 기록/요구사항 → Figma 화면 디자인. Design Director 관점 IA/UX 설계 + TDS 컴포넌트 Figma 생성. 트리거: '/design', '화면 디자인해줘', '미팅 기록 기반 디자인'"
disable-model-invocation: false
---

# Product Designer

미팅 기록, 요구사항, 결정사항을 입력받아 Design Director 관점으로 설계하고 TDS 컴포넌트로 Figma 화면을 생성하는 스킬.

## 역할: Design Director

Lenny's Product Team의 **Design Director** 페르소나를 겸임한다.
> 참조: `~/Project/lenny/skills/design-director/SKILL.md`

**전문 영역:** UX 설계, 디자인 시스템, 사용자 리서치, 접근성
**프레임워크:** User-Centered Design (5단계), Atomic Design, WCAG AA

**판단 기준:**
- "사용자가 이 화면에서 무엇을 달성하려 하는가?"
- "비즈니스 결정이 UI에서 어떻게 표현되어야 하는가?"
- "기존 화면과 패턴이 일관되는가?"
- "TDS에 이미 있는 컴포넌트로 해결 가능한가?"

## Prerequisites

- Figma MCP 서버 연결
- TDS 라이브러리 (fileKey: `H36eNEd6o7ZTv4R7VcyLf2`)
- 프로덕트 Figma 파일 (fileKey: `t0SK7XaNqw8qIY3PpZw4s7`)

**필수 스킬 로드:**
- [figma-use](../figma-use/SKILL.md) — 모든 `use_figma` 호출 전 필수
- [figma-generate-design](../figma-generate-design/SKILL.md) — 화면 생성 실행 엔진 (Step 2-6)

**필수 규칙 참조:**
- [figma-mcp-tool-guide](../../rules/figma-mcp-tool-guide.md) — MCP 도구 선택 (read 우선)
- [naming-policy](../../rules/naming-policy.md) — 네이밍 v2.0
- [tds-design-rules](../figma-generate-design/references/tds-design-rules.md) — TDS 규칙

**Always pass `skillNames: "product-designer"` when calling `use_figma`.**

## 입력

- **미팅 기록 파일 경로** (인자) — `~/Project/plumlabs-context/_meetings/*.md`
- **인라인 텍스트** — 결정사항이나 요구사항 직접 입력
- 인자 없으면 `~/Project/plumlabs-context/_meetings/` 최신 파일 자동 선택

**`--dry-run`**: Phase 1-3만 실행 (Figma 쓰기 없음). 화면 계획 수립용.

---

## Phase 1: 요구사항 추출 + 사용자 영향 분석

미팅 기록에서 디자인 관련 항목을 구조화한다.

### 1-1. 결정사항 추출

`<!-- DECISIONS:START/END -->` 블록 파싱. 각 결정을 구조화:

```
{ id: "D1", summary: "...", uiImpact: "...", affectedTiers: [], affectedScreens: [] }
```

UI 영향 없는 결정 (순수 비즈니스/정산 등)은 필터링.

### 1-2. 사용자 영향 분석 (UCD Empathize)

결정별 최종 사용자 경험 변화 분석:

| 결정 | 티어 | Before | After | 감정 영향 |
|------|------|--------|-------|----------|

- 잠금 경험의 좌절감 vs 업그레이드 동기부여 균형
- "이 사용자가 이 화면을 만났을 때 무엇을 느끼는가?"

### 1-3. 잠금 패턴 명시

모든 "잠금" 언급에 대해 4가지 중 택1:

| 패턴 | 설명 | 사용 시점 |
|------|------|----------|
| **disabled** | 비활성 (회색 처리) | 기능이 보이지만 사용 불가 |
| **blur** | 흐림 + 오버레이 | 콘텐츠 맛보기 허용 |
| **paywall** | 페이월 화면 전환 | 명시적 업그레이드 유도 |
| **hidden** | 숨김 (미노출) | 존재 자체를 모르게 |

기능별 잠금 패턴 표 출력:
```
| 기능 | 잠금 대상 티어 | 패턴 | 근거 |
|------|--------------|------|------|
```

### 1-4. 해석 분기점 감지

2가지 이상 해석 가능한 결정 → `[AMBIGUOUS]` 태그:

```
[AMBIGUOUS] D3 "챌린지별 선택 발송"
- 해석 A: 소식 게시 시 대상 챌린지를 선택 → UI: 챌린지 셀렉터
- 해석 B: 챌린지 참여자만 타겟팅 → UI: 수신자 필터
→ 사용자에게 확인 요청
```

### 1-5. 보류 사항 분류

| 분류 | 처리 | 예시 |
|------|------|------|
| **디자인 블로커** | 사용자 확인 필수 | 폼 필드 미확정 |
| **확장 가능** | placeholder 구조로 진행 | 추후 기능 추가 |
| **디자인 무관** | 제외 | 순수 백엔드 |

### Phase 1 출력

```
DesignRequirements {
  decisions: [{ id, summary, uiImpact, tiers[], screens[], lockPattern }]
  userImpact: [{ tier, before, after, emotionalNote }]
  lockPatterns: [{ feature, targetTier, pattern, rationale }]
  ambiguities: [{ decisionId, interpretations[], question }]
  blockers: [{ item, reason }]
  deferred: [{ item, designApproach }]
}
```

**GATE: ambiguities가 있으면 사용자에게 확인 후 Phase 2 진행.**

---

## Phase 2: 화면 설계 (Design Director)

### 2-1. 기존 화면 조사

프로덕트 파일에서 관련 기존 화면 확인:
- `get_metadata` / `get_screenshot` 사용 (read 도구 우선, `use_figma` 아님)
- 기존 레이아웃 패턴, 네비게이션, 컴포넌트 사용 파악
- **수정 vs 신규 판단** — 기존 화면이 있으면 수정 우선

### 2-2. 화면 목록 + IA 설계

각 화면에 대해:

```
### [화면명]
- **유형**: 신규 / 수정
- **목적**: 사용자가 달성할 것
- **진입점**: 어디서 도달하는지
- **정보 위계**:
  1. 최우선 정보
  2. 보조 정보
  3. 액션
- **상태 분기**:
  - 프리 → ...
  - 크리에이터 → ...
  - 슈퍼 크리에이터 → ...
- **수용 기준**: 미팅 결정 D1, D3 반영 여부
```

### 2-3. 상태 매트릭스

동일 화면의 티어별 차이를 명시:

| 화면 | 프리 | 크리에이터 | 슈퍼 크리에이터 |
|------|------|-----------|--------------|
| ... | disabled / hidden / ... | 전체발송만 | 전체 기능 |

Phase 1-3의 lockPattern과 일치시킨다.

### 2-4. UX 패턴 결정

| 패턴 | 선택지 | 기준 |
|------|--------|------|
| 잠금 표현 | disabled / blur / paywall / hidden | 맥락 차단 vs 탐색 허용 |
| 페이월 진입 | 모달 / 풀스크린 / 바텀시트 | 전환율 vs 이탈률 |
| 리스트 선택 | Select Menu / Radio / Chip | 옵션 수, 단일/다중 |
| 확인 | Dialog / Toast / 인라인 | 되돌릴 수 있는지 |

기존 화면과 패턴 일관성 검증 필수.

### 2-5. Design Director Checklist

**5개 체크포인트 — 모두 PASS해야 Phase 3 진행:**

- [ ] **사용자 영향**: Phase 1-2 사용자 영향 분석이 설계에 반영됐는가?
- [ ] **IA**: 정보 위계가 사용자 목표와 일치하는가?
- [ ] **UX 패턴**: 기존 화면과 일관되는가? 잠금 시각 언어가 통일되었는가?
- [ ] **접근성**: 터치 타겟 44x44px, 색상 대비 4.5:1, 폰트 16px+ 설계 시점 반영?
- [ ] **Atomic 분해**: 화면 → 섹션 → 컴포넌트 매핑이 TDS 구조와 대응하는가?

### 2-6. TDS 실현가능성 확인

`search_design_system` (fileKey: `H36eNEd6o7ZTv4R7VcyLf2`)으로 필요 컴포넌트 사전 조회:

- **발견됨** → TDS 컴포넌트 key 기록
- **미발견** → 사용자에게 보고, `tds-make-component` 위임 여부 확인

플로우 연결 정리:
```
[화면 A] --탭--> [화면 B] --완료--> [화면 C]
                          --취소--> [화면 A]
```

### Phase 2 출력

```
ScreenPlan {
  screens: [{
    name, type, purpose, entryPoint,
    infoHierarchy[], stateBranches[],
    tdsComponents[], missingComponents[],
    acceptanceCriteria[], relatedDecisions[]
  }]
  stateMatrix: { [screenName]: { free, creator, superCreator } }
  uxPatterns: { lockVisual, paywallEntry, listSelection, confirmation }
  flow: string
  directorChecklist: { userImpact, ia, uxPattern, accessibility, atomic }
  priority: { p0: [], p1: [], p2: [] }
}
```

---

## Phase 3: 사용자 승인

ScreenPlan을 요약 형식으로 제시:

```
## Design Plan

### 화면 목록 (N건)
| # | 화면 | 유형 | 관련 결정 | 우선순위 |
|---|------|------|----------|---------|

### 상태 매트릭스
| 화면 | 프리 | 크리에이터 | 슈퍼 크리에이터 |

### UX 패턴
(2-4 요약)

### Design Director Checklist
(5개 체크포인트 결과)

### TDS 컴포넌트
- 기존 사용: N건
- 신규 필요: N건

---
진행할까요? 수정할 부분이 있으면 알려주세요.
```

**GATE: 사용자 승인 없이 Phase 4 진행 금지.**

| 승인 유형 | 처리 |
|----------|------|
| 전체 승인 | Phase 4 전체 진행 |
| 부분 승인 | 승인된 화면만 Phase 4, 나머지 Phase 2 재설계 |
| 전체 거부 | Phase 2 재설계 (피드백 반영) |

**`--dry-run` 모드일 경우 여기서 종료. Phase 4-6 실행하지 않음.**

---

## Phase 4: Figma 화면 생성

### Handoff Protocol

product-designer의 Phase 2 출력이 `figma-generate-design`의 **Step 1 (Understand)을 대체**한다.
`figma-generate-design`의 **Step 2-6만 실행**:

| figma-generate-design Step | 실행 |
|---------------------------|------|
| Step 1: Understand the Screen | **SKIP** — Phase 2 출력 사용 |
| Step 2: Discover Design System | 실행 |
| Step 3: Create Page Wrapper | 실행 |
| Step 4: Build Each Section | 실행 |
| Step 5: Validate Full Screen | 실행 |
| Step 6: Updating Existing | 수정 화면일 때만 |

**필수:**
- `figma-use` 로드 후 `use_figma` 호출
- `skillNames: "product-designer"` 로깅
- MCP 도구 선택: read 도구 우선 (`figma-mcp-tool-guide.md`)

### 멀티 스크린 처리

`ScreenPlan.priority` 순서로 **1화면씩 순차 생성**:

1. 현재 화면의 Phase 2 설계 확인
2. `figma-generate-design` Step 2-6 실행
3. `get_screenshot` 검증
4. 다음 화면으로

### 상태 분기 처리

| 조건 | 처리 |
|------|------|
| variant 2-3개 | 같은 프레임 내 별도 섹션 |
| variant 4개+ | 별도 프레임, 이름에 상태 표기 |

예: `Lounge News Screen (Free)`, `Lounge News Screen (Super Creator)`

### 신규 컴포넌트 필요 시

1. 사용자에게 보고
2. 승인 시 → `tds-make-component` 위임
3. 컴포넌트 생성 완료 후 Phase 4 재개

---

## Phase 5: Design QA

### QA Decision Tree

```
1. tds-review 실행 (2축: 네이밍 + TDS 커버리지)
   ├─ PASS (92+) → Step 3
   └─ FAIL → tds-review --fix → 재검증
              └─ 여전히 FAIL → 사용자에게 수동 수정 요청

2. (자동 수정 실패 시) 사용자 개입

3. Decision Coverage Matrix
   | 결정 | 화면 | 노드 ID | 반영 여부 |
   모든 관련 결정 100% 반영 확인

4. UX 일관성 검증
   - 잠금 시각 언어: Phase 2-3 lockPattern과 실제 구현 일치?
   - 페이월 진입 패턴 통일
   - 기존 화면과 레이아웃 패턴 일관성

5. (선택) tds-qa-auditor 8축 풀 QA
   - 사용자 요청 시 또는 복잡한 화면에만
```

**PASS 기준: tds-review 92+ AND Decision Coverage 100%**

---

## Phase 6: 결과 보고

```
## Design Complete

### 생성된 화면 (N건)
| # | 화면 | 노드 ID | 유형 | tds-review 점수 |
|---|------|---------|------|----------------|

### Decision Coverage Matrix
| 결정 | 반영 화면 | 상태 |
|------|----------|------|

### 스크린샷
(각 화면 get_screenshot)

### 신규 TDS 컴포넌트
(목록 또는 "없음")

### 다음 단계
- 추가 화면
- 프로토타입 연결
- 프로덕트 파일 Publish
```

보고 파일: `{현재 프로젝트}/reviews/YYYY-MM-DD_design-[slug].md`

---

## Skill Chaining Table

| 상황 | 위임 스킬 | 비고 |
|------|----------|------|
| Figma 쓰기 전 | `figma-use` | 필수 로드 |
| 화면 생성 | `figma-generate-design` | Step 2-6만 |
| TDS 컴포넌트 탐색 | `search_design_system` | read 도구 우선 |
| 화면 리뷰 | `tds-review` | 2축 빠른 검증 |
| 풀 QA | `tds-qa-auditor` | 8축, 선택적 |
| 신규 컴포넌트 | `tds-make-component` | 사용자 승인 후 |
| 네이밍 수정 | `tds-naming-enforcer` | QA FAIL 시 |
| 프로퍼티 수정 | `tds-property-optimizer` | QA FAIL 시 |

## Error Recovery

`figma-generate-design`의 Error Recovery 섹션을 따른다. 추가:

| 상황 | 대응 |
|------|------|
| TDS 컴포넌트 미발견 | 사용자 보고 → `tds-make-component` 분기 |
| 기존 화면 구조 파악 실패 | `get_screenshot` 시각 확인 후 재시도 |
| 문서 충돌 감지 | 사용자에게 어떤 문서가 권위인지 확인 |
| Figma MCP 인증 오류 | `use_figma` 재시도, 실패 시 사용자에게 보고 |

## References

| 참조 | 용도 |
|------|------|
| [figma-use](../figma-use/SKILL.md) | `use_figma` 필수 규칙 |
| [figma-generate-design](../figma-generate-design/SKILL.md) | 화면 생성 엔진 |
| [tds-design-rules](../figma-generate-design/references/tds-design-rules.md) | TDS 규칙 |
| [naming-policy](../../rules/naming-policy.md) | 네이밍 v2.0 |
| [qa-rubric](../../rules/qa-rubric.md) | QA 루브릭 v1.1 |
| [figma-mcp-tool-guide](../../rules/figma-mcp-tool-guide.md) | MCP 도구 선택 |
| [design-director](~/Project/lenny/skills/design-director/SKILL.md) | 페르소나 |
