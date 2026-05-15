# CDS Vibe-Coding QA Rubric v1.1

> 바이브코딩(Tailwind+React+shadcn) 적합성 점검 루브릭
> 참조: naming-policy.md v2.0
> 컴포넌트 gate 실행 계약: component-contract.md

## 점수 체계

- **축 점수** = max(0, 100 - Σ감점)
- **총점** = Σ(축 점수 × 가중치)
- **감점 등급**: Critical(-20), Major(-10), Minor(-5), Warning(-2)

| 판정 | 조건 | 다음 액션 |
|------|------|----------|
| **PASS** | 총점 ≥85 + 모든 축 ≥60 | 완료 |
| **CONDITIONAL** | 총점 ≥75 + 축 <60 1개 이하 | 해당 축 수정 후 `/qa` 재실행 |
| **FAIL** | 총점 <75 또는 축 <60 2개+ | `/director` 에스컬레이션 |

---

## R1. CDS 인스턴스 커버리지 (20%)

UI 요소 중 CDS 컴포넌트 인스턴스 비율.

**자동 검사:**
- `node.type === "INSTANCE"` 카운트
- `componentId` → CDS fileKey(`H36eNEd6o7ZTv4R7VcyLf2`) 소속 확인
- detached instance = 비-CDS (로컬 프레임)

**점수:**
- 100%: CDS 인스턴스 100%, 로컬 프레임 0건
- 비-CDS 노드 1건당: -10 (비율 비례로 조정 가능)

---

## R2. 네이밍 시맨틱 (20%)

레이어명이 시맨틱 역할을 설명하는지. naming-policy.md v2.0 준수.

**감점 규칙:**

| 위반 | 등급 | 감점 | 예시 |
|------|------|------|------|
| 금지 접미사 (Container/Wrapper/Content/Box/View/Div) | Major | -10 | `Container Header`, `Chat Content` |
| CTA 사용 (마케팅 용어, AI 오역 리스크) | Minor | -5 | `CTA Area` |
| 접미사 중복 (`Area Area`, `Group Group`) | Major | -10 | `Header Area Area` |
| 자동 생성명 (Text, Frame *, Group *) | Minor | -5 | `Frame 1234` |
| 특수문자 (`:`, `↳`, 레이어명 내 `/`) | Minor | -5 | `Blur:mask-group` |
| 하드코딩 데이터 | Minor | -3 | `Sophie Tan`, `5명` |
| 역할 미설명 일반명 | Warning | -2 | `Box`, `Item` |

**허용 어휘 (시맨틱 역할):**
`Screen`, `Body`, `Header`, `Footer`, `Section`, `Area`, `Sidebar`, `Scroll Area`, `List`, `Grid`, `Navbar`, `Tab Bar`, `Input`, `Form`, `Card`, `Group`

**래퍼 프레임 우선순위:**
1순위: 역할명만 — `Header`, `Footer`, `Sidebar`, `Form`, `Body`
2순위: `[컨텍스트] Area` — `Input Area`, `Bottom Area`
예외: `[컨텍스트] Group` — `Card Group`, `Avatar Group` (동종 반복)

**텍스트 노드:** `Title`, `Description`, `Label`, `Subtitle`, `Caption`, `Value`
**이미지 노드:** `[컨텍스트] Image/Thumbnail/Avatar/Banner/Icon/Illustration`

**케이싱:** Title Case 공백 필수 (`Chat Area` O, `chatArea` X, `ChatArea` X)

**CDS 인스턴스 내부 레이어:** 검사 제외 (오버라이드 안 했으면 원본 구조)

---

## R3. 레이아웃 구조 (10%)

Auto Layout → Tailwind flex/grid 1:1 매핑 가능 여부.

| 위반 | 등급 | 감점 |
|------|------|------|
| absolute 포지셔닝 (정당하지 않은) | Major | -10/건 |
| 중첩 5단계+ | Major | -10 |
| 중첩 4단계 | Minor | -5 |
| 이미지 Fill mode 미사용 (absolute+overflow 대신) | Minor | -5/건 |
| 비표준 aspect-ratio | Warning | -2/건 |
| 레이어명에 슬래시 | Minor | -5/건 |
| State를 variant으로 분리 (Button/Primary/Hover) | Minor | -5/건 |
| 복잡 CSS 패턴 (mask-image, clip-path 등 50자+) | Warning | -2/건 |
| 반응형 고정 요소가 Right/Top 등 의도 constraint 없이 좌표 고정 | Major | -10/건 |
| 텍스트/콘텐츠 영역이 좌우 여백 유지 대상인데 Fixed width로 남음 | Major | -10/건 |
| 컴포넌트/variant root가 구조형 UI인데 `layoutMode=NONE` | Major | -10/variant |
| Header/Body/Info/Meta/Action/Description 같은 구조 영역이 Auto Layout wrapper가 아니라 absolute sibling 묶음 | Major | -10/영역 |
| 오른쪽 metadata/action을 Auto Layout row가 아니라 absolute x/y로 맞춤 | Major | -10/행 |
| 1행→2행 title 변경 시 아래 sibling을 밀거나 침범 | Critical | -20/건 |
| fixed-height 카드 본문/이름 text가 truncation 없이 다음 영역을 침범 | Major | -10/건 |

**표준 aspect-ratio:** `1/1`, `4/3`, `3/2`, `16/9`, `9/16`, `3/4`, `2/3`
예외: 디바이스 해상도 비율 (375/812 등)

**Figma Fill mode:** `scaleMode=FILL` → OK. 수동 absolute 배치 → FAIL.

**Responsive probe:** 모바일 컴포넌트는 기본 폭 외에 최소 1개 좁은 폭과 1개 넓은 폭 임시 인스턴스로 검증한다. 닫기/액션 버튼처럼 가장자리에 붙는 absolute node는 `constraints.horizontal=MAX` 또는 `STRETCH` 등 의도된 constraint를 가져야 하며, Title/Description처럼 좌우 여백을 유지해야 하는 텍스트는 `layoutSizingHorizontal=FILL` 또는 `constraints.horizontal=STRETCH`로 L+R 구조를 확인한다. 카드형 컴포넌트는 추가로 2행 title, 긴 name, 긴 description을 넣은 임시 probe를 만들고, title은 위로 늘어나며 아래 sibling 침범이 없어야 한다. 고정 높이 텍스트 슬롯은 `textAutoResize=TRUNCATE`와 `textTruncation=ENDING` 또는 동등한 line clamp 계약이 필요하다.

---

## R4. 프로퍼티 설계 (10%)

Boolean/Variant → React props 직매핑 가능 여부.

| 위반 | 등급 | 감점 |
|------|------|------|
| prop 이름 충돌 (같은 이름 2개+) | Major | -10/건 |
| prop 20개 초과 | Major | -10 |
| prop 16-20개 | Minor | -5 |
| 정의됐지만 참조되지 않는 stale property | Critical | -20/건 |
| `componentPropertyReferences`가 존재하지 않는 definition key를 가리킴 | Critical | -20/건 |
| property 타입과 연결 field가 불일치 (TEXT가 `characters` 외 field 등) | Major | -10/건 |
| 주요 content property가 instance override probe에서 실제 노드를 바꾸지 못함 | Critical | -20/건 |
| 빈 문자열/임시값으로 남은 노출 property | Minor | -5/건 |
| 카드마다 바뀌는 nested instance property가 expose되지 않음 | Major | -10/건 |
| Boolean에 show/is/has 접두어 없음 | Minor | -5/건 |
| Property가 camelCase 아님 | Minor | -5/건 |
| Variant value가 Title Case/Pascal Case가 아님 | Warning | -2/건 |

**stale property 검사:**
- 실행 알고리즘과 evidence schema는 `.claude/rules/component-contract.md#property-reference-matrix`를 따른다.

---

## R5. 합성 구조 (10%)

컴포넌트 분해가 React 컴포넌트 트리와 대응하는지.

| 조건 | 점수 |
|------|------|
| 중첩 깊이 ≤3 | 100 |
| 중첩 깊이 4 | 80 |
| 중첩 깊이 5 | 60 |
| 중첩 깊이 6+ | 40 |
| 모놀리식 (props 20+, 중첩 5+) | -20 추가 |
| 불필요 래퍼 프레임 (패딩/배경 추가 없음) | -5/건 |

---

## R6. 토큰 준수 (5%)

하드코딩 값 vs 디자인 토큰 바인딩.

| 위반 | 등급 | 감점 |
|------|------|------|
| 색상/타이포/이펙트에 토큰 미바인딩 | Major | -10/건 |
| 폰트 패밀리 CSS 비호환 (`Pretendard:SemiBold` 콜론) | Major | -10 |
| 부모 하드코딩 + 자식 토큰 (불필요 래퍼) | Warning | -2/건 |

바인딩됐지만 부적합한 토큰 선택 → R6에서 감점 안 함 (별도 플래그만)

**Completion Gate hard fail:**
- `tokenBindingSummary.status=fail`이면 최종 handoff는 FAIL이다.
- 보이는 SOLID fill/stroke는 기본적으로 token-eligible이다. 로컬 Mode 토큰 값과 일치하지 않는 임의 색상도 하드코딩 색상으로 잡아야 한다.
- `visible=false` 또는 `opacity=0` paint는 검사 제외한다. 숨긴 Remix icon root fill 같은 복구성 paint가 토큰 실패를 만들지 않도록 하기 위함이다.
- CDS 변수/스타일이 없어서 바인딩할 수 없는 표면은 `ContractException`으로 nodeId, 사유, evidence, approver, sourceReference, revisit를 남긴 경우에만 예외 처리한다.
- node-level `boundVariables.fills/strokes`는 CDS `Mode` 컬렉션 바인딩임이 live metadata로 확인될 때만 통과한다. 확인 불가/비-CDS 컬렉션 field-level 바인딩은 토큰 실패다.

---

## R7. shadcn 매핑 정확도 (20%)

Figma 컴포넌트명 → shadcn import 직매핑 가능 여부.

| 위반 | 등급 | 감점 |
|------|------|------|
| shadcn 컴포넌트 존재하나 미사용 (커스텀 제작) | Major | -10/건 |
| 컴포넌트 Display Name ≠ shadcn 공식명 | Minor | -5/건 |
| 아이콘이 Lucide 인스턴스가 아님 (인라인 SVG) | Major | -10/건 |
| 아이콘 세트 혼용 (Lucide + Huge + Phosphor 등) | Major | -10 |
| stack icon을 fill/stroke 구분 없는 filled rectangle/vector primitive 2개로 구성 | Major | -10/건 |

**shadcn 공식명 = Title Case 공백:** `Alert Dialog`, `Scroll Area`, `Toggle Group`, `Drawer`
**레거시명 자동 매핑:** `Sheet` → `Drawer`
**아이콘 = Lucide 공식명 Title Case:** `Chevron Right`, `Arrow Left`, `Plus`

---

## R8. 접근성 (5%)

WCAG 2.1 AA 기준.

| 위반 | 등급 | 감점 |
|------|------|------|
| 터치 타겟 < 44×44px | Major | -10/건 |
| 텍스트 대비 < 4.5:1 (일반) / < 3:1 (큰 텍스트) | Major | -10/건 |
| 포커스 상태 미정의 | Warning | -2/건 |

자동 검사: 노드 크기 체크, fills 색상값 추출 → 대비 계산 (단색 배경 한정)
수동 판단: 반투명/그래디언트 배경, Tab 순서

---

## Component Gates

CDS 컴포넌트 생성/수정은 점수와 별도로 `.claude/rules/component-contract.md`의 Creation Gate와 Completion Gate를 통과해야 한다.

| Gate | 실행 시점 | 실패 처리 |
|------|-----------|-----------|
| Creation Gate | Figma mutation 전 | FAIL이면 생성/수정 중단 |
| Completion Gate | 최종 handoff 전 | FAIL이면 완료 보고 금지 |

Completion Gate는 `structuralFidelity.status=pass`를 포함해야 한다. 단일 raster/image-backed 레이어로 만든 CDS 컴포넌트는 Critical FAIL이며, `ContractException`은 복구/격리 근거만 남길 수 있고 완료 PASS로 승격할 수 없다.

CDS/Figma 컴포넌트 또는 라이브러리 작업의 최종 리포트와 `06-record.md`에는
`.claude/rules/component-contract.md`의 `PublishDecisionDisclosure` 섹션을
반드시 포함한다. Publish를 시도하지 않았거나 실패/blocked 된 경우에도
`publish_attempted`, `why_not_published`, `blocker_and_evidence`,
`next_condition_to_publish`를 모두 채운다. 순수 코드/하네스 작업처럼 publish가
무관한 경우에는 `publish_attempted: N/A`와 무관 사유를 기록한다.

---

## 리포트 템플릿

```
## QA Report: [화면명]

> 날짜: YYYY-MM-DD | 루브릭: v1.1 | 노드: [node-id]
> Source: [source-node-id] | Component: [component-node-id]

### 총점: XX/100 — [PASS/CONDITIONAL/FAIL]

| 축 | 점수 | 가중 | 이슈 수 |
|----|------|------|---------|
| R1 CDS 커버리지 | /100 | ×0.20 | |
| R2 네이밍 | /100 | ×0.20 | |
| R3 레이아웃 | /100 | ×0.10 | |
| R4 프로퍼티 | /100 | ×0.10 | |
| R5 합성 구조 | /100 | ×0.10 | |
| R6 토큰 | /100 | ×0.05 | |
| R7 shadcn 매핑 | /100 | ×0.20 | |
| R8 접근성 | /100 | ×0.05 | |

### Critical 이슈
### Major 이슈
### Minor 이슈
### Warnings

### Publish Decision
| 항목 | 결과 |
|------|------|
| publish_attempted | yes / no / N/A |
| why_not_published | |
| blocker_and_evidence | |
| next_condition_to_publish | |

### Component Creation Decision Gate
| 항목 | 결과 |
|------|------|
| Source unit | |
| Candidate components | |
| Component group | |
| Placement reason | |
| Decision | |
| Decision reason | |
| Rejected options | |
| Variant explosion risk | |

### Component Completion Gate
| 항목 | 결과 |
|------|------|
| Source screenshot | |
| Component screenshot | |
| Visual diff summary | |
| Intentional deltas | |
| Structural fidelity | |

### 수정 가이드 (--fix)
| Phase | 작업 | 건수 |
```
