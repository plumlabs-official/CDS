---
name: tds-review
description: "TDS 화면 리뷰 — 네이밍 검사 + TDS 커버리지 + 반복 패턴 감지 + QA 간이 점수. URL 입력 시 자동 스캔 후 리포트 출력. Use when user says '/review', '리뷰', 'screen review', '화면 점검'."
---

# TDS Screen Review

네이밍 검사, TDS 커버리지, 반복 패턴 감지, QA 간이 점수를 통합한 화면 리뷰 도구입니다.

**MANDATORY**: load `figma-use` skill before every `use_figma` call.
**Always pass `skillNames: "tds-review"` when calling `use_figma`.**

## Trigger

- `/review [Figma URL]`
- `리뷰`, `screen review`, `화면 점검`

## SSOT

- 네이밍 규칙: `.claude/rules/naming-policy.md` v2.0
- QA 루브릭: `.claude/rules/qa-rubric.md` v1.1
- 리네임 데이터: `.claude/skills/tds-naming-enforcer/references/rename-pipeline.md` (BANNED_SUFFIXES, AUTO_GENERATED, KOREAN_LABEL_MAP)
- TDS fileKey: `H36eNEd6o7ZTv4R7VcyLf2`

## Input

Figma 디자인 URL (node-id 포함). URL에서 `fileKey`와 `nodeId` 추출.

```
https://www.figma.com/design/:fileKey/:fileName?node-id=:nodeId
```

`node-id`의 `-`를 `:`로 변환하여 사용.

## 오탐 방지 원칙

| 규칙 | 이유 |
|------|------|
| `mainComponent.remote === true` → TDS 소속, 내부 레이어 검사 제외 | 라이브러리 컴포넌트 내부를 프로덕트 파일에서 검사하면 오탐 |
| `figma.root.findAll` 전체 트리 검색 | 중첩 프레임 안 노드 누락 방지 |
| `componentKey` 기반 TDS 소속 판별 | 이름 변경/오타에 강건 |
| hidden 노드 포함 검사 (`visible === false`) | 숨겨도 빌드 대상일 수 있음, 리포트에 hidden 표시 |

---

## Phase 1: Auto Scan (read-only)

`get_design_context`로 대상 노드의 전체 트리 + 스크린샷 확보 후, `use_figma`로 3단계 스캔 실행.

**20KB 제한 대응**: 스캔은 순차 실행 (병렬 불가). 대형 화면은 섹션별 분할.

### 1-A. Naming Scan

**대상**: 모든 FRAME/TEXT/GROUP 노드. TDS INSTANCE 내부 레이어는 제외 (`mainComponent.remote === true`).

**hidden 노드**: `visible === false`인 노드도 검사 대상. 리포트에 `[hidden]` 태그 표시.

**검사 규칙** (naming-policy v2.0):

| 위반 | Severity | 감점 | 패턴 |
|------|----------|------|------|
| 금지 접미사 (Container/Wrapper/Content(래퍼)/Box/View/Div) | Major | -10 | BANNED_SUFFIXES |
| CTA 사용 | Minor | -5 | 마케팅 용어, AI 오역 리스크 |
| 접미사 중복 (Area Area, Group Group) | Major | -10 | 동일 접미사 반복 |
| 자동 생성명 (Frame *, Group *, Text) | Minor | -5 | AUTO_GENERATED_PATTERNS |
| 특수문자 (:, ↳, /) | Minor | -5 | SPECIAL_CHARS_IN_NAMES |
| 하드코딩 데이터 (고유명사, 숫자) | Minor | -3 | 실제 사용자명, 구체적 수치 등 |
| Title Case 공백 위반 | Minor | -5 | chatArea, ChatArea 등 |

**Return**: violations 배열 `{ nodeId, name, rule, severity, suggestion, hidden }`

### 1-B. TDS Coverage Scan

모든 노드를 분류:

| 분류 | 조건 | 처리 |
|------|------|------|
| **TDS Instance** | `INSTANCE` + `mainComponent.remote === true` | count만 (정상) |
| **Local Instance** | `INSTANCE` + `mainComponent.remote === false` | 리포트 대상 |
| **Custom Frame** | `FRAME` depth 2~5, 의미 있는 이름 | 리포트 대상 |

Custom Frame에 대해: 대체 가능한 기존 TDS 컴포넌트가 있는지 확인.

**TDS 교체 후보 판단 기준:**
- children 구조 매칭 (Avatar+Title → Profile Card, Thumbnail+Body+Button → Challenge Talk Card 등)
- Match Confidence: High(구조 동일) / Medium(유사) / Low(부분 매칭)
- 후보 발견 시 `possibleTdsReplacement` 필드에 컴포넌트명 + key 기록

**Return**: `{ tdsCount, localCount, customFrames: [{ nodeId, name, possibleTdsReplacement, matchConfidence }] }`

### 1-C. Repeated Pattern Detection

1. 동일 이름의 FRAME 노드가 2회 이상 등장하는 패턴 탐지
2. children signature 비교: 각 자식의 `name:type` 조합
3. signature 일치 → 컴포넌트화 후보
4. Variant explosion risk 평가: 고유 변형 수 x 예상 props 수

**최소 기준**: 3회 이상 반복되는 패턴만 후보로 리포트.

> **참고**: 단일 화면 내 반복만 감지합니다. 다른 화면에서도 동일 패턴이 반복되는 경우,
> 여러 화면 리뷰 결과를 종합하여 컴포넌트화를 판단하세요.

**Return**: `{ candidates: [{ pattern, count, signatureMatch, variantRisk, recommendation }] }`

### 1-D. Quick QA Score

R1, R2 간이 점수 산출:

- **R1 TDS Coverage**: `tdsCount / (tdsCount + localCount + significantCustomFrames) * 100`
- **R2 Naming**: `max(0, 100 - sum(violations deductions))`
- **총점**: `R1 * 0.5 + R2 * 0.5` (간이 2축 점수)

나머지 6축(R3~R8)은 간이 리뷰에서 생략 → 상세 8축 평가가 필요하면 `/qa` 추천.

**판정 기준** (간이):

| 판정 | 조건 |
|------|------|
| **PASS** | 총점 >= 85 + 두 축 모두 >= 60 |
| **CONDITIONAL** | 총점 >= 75 |
| **FAIL** | 총점 < 75 또는 축 < 60 |

---

## Phase 2: Report Output

```markdown
## Screen Review: [screenName]
> Date: YYYY-MM-DD | Node: [node-id] | Score: XX — [PASS/CONDITIONAL/FAIL]

### Summary
| Item | Result |
|------|--------|
| TDS Instances | N |
| Local Instances | N |
| Custom Frames | N |
| Naming Violations | N (Major N / Minor N) |
| Component Candidates | N |

### Naming Issues
| Node ID | Current Name | Violation | Severity | Suggested |
|---------|-------------|-----------|----------|-----------|
| ... | ... | ... | ... | ... |

### Non-TDS Custom Frames
| Node ID | Name | Replaceable TDS Component | Confidence | Note |
|---------|------|--------------------------|------------|------|
| ... | ... | ... | High/Med/Low | ... |

### Component Candidates
| Pattern | Count | Structure Match | Variant Risk | Recommendation |
|---------|-------|----------------|--------------|----------------|
| ... | ... | ... | ... | ... |

### Next Actions
- [ ] Fix naming: `/review --fix`
- [ ] Replace instances: `/review --replace`
- [ ] New component: `/make-component [pattern]`
- [ ] Full QA: `/qa [node-id]`
```

---

## Phase 3: Fix (--fix flag or user approval)

**네이밍 수정만** 수행. 구조/컴포넌트 변경은 별도 Skill로.

### Fix Workflow

1. **Read**: Phase 1 스캔 결과의 violations 목록 확인
2. **Approve**: 사용자에게 Before/After 리포트 출력 → 승인 대기
3. **Write**: `use_figma`로 `node.name` 변경 (한 번에 50개 이하)
4. **Validate**: `get_design_context`로 idempotency 체크 (2회 연속 실행 = 변경 0건 확인). 시각 변화 우려 시 `get_screenshot` 병행.

**MUST STOP**: 리포트 출력 후 사용자 승인 없이 write 금지.

### Fix 적용 규칙

- naming-policy v2.0의 7단계 파이프라인 적용:
  1. 한글 → 영문 (KOREAN_LABEL_MAP)
  2. 금지 접미사 제거 (BANNED_SUFFIXES) → bannedRemoved = true
  3. 슬래시 → 공백 (레이어명 전용)
  4. PascalCase → Title Case
  5. toTitleCase
  6. 특수문자 제거
  7. 역할 접미사 추가 (bannedRemoved=true일 때만)
- 멱등성 보장: 2회 연속 실행 시 변경 0건

---

## Phase 3-B: Instance Replace (--replace flag or user approval)

Phase 1-B에서 `possibleTdsReplacement`가 감지된 커스텀 프레임을 기존 TDS 인스턴스로 교체.

### Replace Workflow

1. **Duplicate**: 대상 화면을 빈 공간에 복제 (원본 보존 필수)
2. **Analyze**: 교체 대상 프레임의 프로퍼티 수집
   - INSTANCE 자식: componentKey, componentProperties, fills (이미지 해시)
   - TEXT 자식: characters
   - FRAME 자식: layoutMode, fills, cornerRadius
3. **Approve**: Before/After 구조 비교 출력 → 승인 대기
4. **Replace**: 복제본에서 `use_figma` 실행
   - `importComponentByKeyAsync`로 TDS 컴포넌트 가져오기
   - 인스턴스 생성 → 부모에 같은 index로 삽입
   - 원본 프로퍼티/이미지 fills/텍스트 복사
   - 원본 프레임 삭제
5. **Validate**: `get_screenshot`으로 시각 비교

**MUST STOP**: Replace 전 반드시 사용자 승인.
**원본 보존**: 복제본에서만 작업. 원본 화면 유지.

---

## Skill Chaining

| 상황 | 다음 Skill |
|------|-----------|
| 네이밍 위반 (단순) | `/review --fix` (자체 수정) |
| 네이밍 위반 (복잡/대량) | `/tds-naming-enforcer` |
| TDS 교체 후보 (기존 컴포넌트 존재) | `/review --replace` (자체 교체) |
| 컴포넌트화 후보 (신규 필요) | `/make-component` |
| 상세 8축 QA | `/qa` (tds-qa-auditor) |

---

## Constraints

| 제약 | 이유 |
|------|------|
| `use_figma` return 20KB 제한 | 대형 화면은 섹션별 분할 스캔 |
| 사용자 승인 없이 auto-fix 금지 | 의도치 않은 변경 방지 |
| TDS INSTANCE 내부 레이어 네이밍 검사 제외 | 오버라이드 안 했으면 원본 구조 |
| Component Candidates 최소 3회 반복 | 2회는 우연 가능, 3회부터 패턴 |
| hidden 노드 검사 포함, 리포트에 표시 | 숨겨도 코드 대상일 수 있음 |
| 스캔~Fix 사이 삭제된 노드는 skip | 삭제 노드에 rename 시도하면 에러 → skip 후 리포트에 기록 |
