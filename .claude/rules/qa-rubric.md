# CDS Vibe-Coding QA Rubric v1.1

> 바이브코딩(Tailwind+React+shadcn) 적합성 점검 루브릭
> 참조: naming-policy.md v2.0

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

**표준 aspect-ratio:** `1/1`, `4/3`, `3/2`, `16/9`, `9/16`, `3/4`, `2/3`
예외: 디바이스 해상도 비율 (375/812 등)

**Figma Fill mode:** `scaleMode=FILL` → OK. 수동 absolute 배치 → FAIL.

**Responsive probe:** 모바일 컴포넌트는 기본 폭 외에 최소 1개 좁은 폭과 1개 넓은 폭 임시 인스턴스로 검증한다. 닫기/액션 버튼처럼 가장자리에 붙는 absolute node는 `constraints.horizontal=MAX` 또는 `STRETCH` 등 의도된 constraint를 가져야 하며, Title/Description처럼 좌우 여백을 유지해야 하는 텍스트는 `layoutSizingHorizontal=FILL` 또는 `constraints.horizontal=STRETCH`로 L+R 구조를 확인한다.

---

## R4. 프로퍼티 설계 (10%)

Boolean/Variant → React props 직매핑 가능 여부.

| 위반 | 등급 | 감점 |
|------|------|------|
| prop 이름 충돌 (같은 이름 2개+) | Major | -10/건 |
| prop 20개 초과 | Major | -10 |
| prop 16-20개 | Minor | -5 |
| 정의됐지만 참조되지 않는 stale property | Major | -10/건 |
| 빈 문자열/임시값으로 남은 노출 property | Minor | -5/건 |
| 카드마다 바뀌는 nested instance property가 expose되지 않음 | Major | -10/건 |
| Boolean에 show/is/has 접두어 없음 | Minor | -5/건 |
| Property가 camelCase 아님 | Minor | -5/건 |
| Variant value가 Title Case/Pascal Case가 아님 | Warning | -2/건 |

**stale property 검사:**
- `componentPropertyDefinitions`의 각 key가 실제 하위 노드 `componentPropertyReferences`에 연결되어 있는지 확인한다.
- 연결되지 않은 TEXT/BOOLEAN/INSTANCE_SWAP property는 stale로 본다.
- Variant property와 Slot property는 정의 자체가 root contract일 수 있으므로 하위 참조가 없어도 허용한다.
- nested instance의 property는 상위 컴포넌트에 노출하지 않는 한 상위 contract로 세지 않는다.
- 카드마다 값이 바뀌는 nested instance property는 `isExposedInstance=true`로 노출하거나, 상위 property를 만들 경우 실제 하위 노드에 연결한다.

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

---

## R7. shadcn 매핑 정확도 (20%)

Figma 컴포넌트명 → shadcn import 직매핑 가능 여부.

| 위반 | 등급 | 감점 |
|------|------|------|
| shadcn 컴포넌트 존재하나 미사용 (커스텀 제작) | Major | -10/건 |
| 컴포넌트 Display Name ≠ shadcn 공식명 | Minor | -5/건 |
| 아이콘이 Lucide 인스턴스가 아님 (인라인 SVG) | Major | -10/건 |
| 아이콘 세트 혼용 (Lucide + Huge + Phosphor 등) | Major | -10 |

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

## Component Creation Decision Gate

CDS 컴포넌트 생성 요청을 받으면 제작 전에 아래 판단을 먼저 완료하고 기록해야 한다. 이 게이트를 통과하기 전에는 새 컴포넌트 생성, 기존 컴포넌트 수정, variant 추가를 시작하지 않는다.

| Gate | 확인 질문 | PASS 기준 | 실패 처리 |
|------|-----------|-----------|-----------|
| Source Scope | 원본에서 재사용 단위가 정확히 무엇인가? | 반복/재사용되는 최소 UI 단위와 포함 범위가 명시됨 | FAIL |
| Existing Match | CDS에 대체 가능한 기존 컴포넌트/variant가 있는가? | 후보 컴포넌트 ID, type, props, 시각 차이를 근거로 기록 | FAIL |
| Composition First | 기존 컴포넌트 조합으로 해결 가능한가? | Avatar/Button/Icon/Tag/Card 등 기존 primitive/composed 사용 여부 판단 | Major |
| Context Group Placement | 새/수정 컴포넌트가 CDS Components 페이지의 같은 도메인/맥락 그룹에 배치되는가? | 관련 그룹 frame/section node ID, parent path, sibling 컴포넌트 근거가 기록됨 | FAIL |
| Variant Safety | 기존 컴포넌트에 type/variant를 추가해도 variant explosion이 없는가? | variant 축 1개 추가 또는 기존 축 확장만 발생하고 조합 수 증가가 제한적 | FAIL |
| New Component Justification | 새 컴포넌트가 필요한 이유가 있는가? | 기존 컴포넌트와 역할/구조/props가 달라 새 이름이 더 명확함 | Major |
| Decision Record | 최종 선택과 배제한 선택을 기록했는가? | `reuseExisting`, `extendExisting`, `createNew` 중 하나로 결론 기록 | FAIL |

**판단 순서:**
1. 원본 노드에서 반복되는 최소 단위를 찾는다.
2. CDS에서 이름/역할/구조가 가까운 컴포넌트를 검색한다.
3. 기존 컴포넌트 인스턴스 조합으로 만들 수 있으면 새 컴포넌트를 만들지 않는다.
4. CDS Components 페이지에서 같은 도메인/맥락 그룹을 찾고 group node ID, parent path, sibling 컴포넌트를 기록한다.
5. 관련 그룹이 없으면 임시로 current page/root/무관 그룹에 만들지 말고 사용자에게 새 그룹 생성 또는 대체 그룹 결정을 요청한다.
6. 기존 컴포넌트의 의미와 props가 맞고 variant 축이 폭발하지 않으면 기존 컴포넌트를 확장한다.
7. 기존 컴포넌트가 의미상 다르거나 props가 불필요하게 오염되면 새 composed 컴포넌트를 만든다.

**variant explosion 기준:**
- 기존 variant 축에 값 1개 추가: 대체로 허용.
- 독립 축을 새로 추가해 전체 조합이 곱셈으로 증가: 기본 FAIL.
- 새 variant 때문에 무관한 props/slots가 다수 생김: 새 컴포넌트 우선.
- 실제 사용처가 한 화면의 특수 레이아웃뿐이면 기존 공용 컴포넌트 확장보다 composed wrapper 우선.

**필수 산출물:**
- `sourceUnitNodeId`
- `candidateComponents`
- `componentGroupNodeId`
- `componentGroupPath`
- `placementReason`
- `decision`
- `decisionReason`
- `rejectedOptions`
- `variantExplosionRisk`

---

## Component Completion Gate

CDS 컴포넌트 생성/수정 완료 전에는 점수와 별도로 아래 게이트를 통과해야 한다.

| Gate | 조건 | 실패 처리 |
|------|------|-----------|
| Source Evidence | 원본 노드 ID와 완성 컴포넌트 노드 ID를 QA 리포트에 기록 | FAIL |
| Context Group Placement | 완성 컴포넌트의 parent path가 Creation Gate에서 선택한 같은 도메인/맥락 그룹과 일치하고, 관련 CDS 컴포넌트의 sibling임 | FAIL |
| Screenshot Pair | `get_screenshot`으로 원본 노드와 완성 컴포넌트 각각 캡처 | FAIL |
| Visual Diff | 두 스크린샷을 나란히 비교하고 주요 차이를 기록 | Major |
| Responsive Probe | 기본 폭 + 좁은 폭 + 넓은 폭 임시 인스턴스에서 edge-pinned controls와 L+R text/content bounds 확인 | FAIL |
| Bounds Check | 카드/이미지/Avatar/overlay/slot/action row의 잘림·가림·겹침 없음 | FAIL |
| Property Integrity | 노출 property가 실제 노드에 연결되어 있고 stale/empty property가 없음 | FAIL |
| Nested Exposure | 카드 사용자가 바꿔야 하는 nested instance props가 expose되어 있음 | Major |
| Use-site Replacement | 원본 사용처 리소스가 신규/수정 컴포넌트의 인스턴스로 교체됨 | Major |
| Intentional Delta | 원본과 다른 부분은 CDS화 목적(토큰, 인스턴스, slot, prop)으로 설명 가능 | Major |

**비교 기준:**
- 원본과 완성본의 전체 크기, radius, shadow, padding, gap, 이미지 crop, overlay 위치를 비교한다.
- 컴포넌트가 리사이즈될 수 있으면 임시 인스턴스를 320/기본/430px 등으로 만들어 `Close Button` 같은 edge-pinned control의 right/top offset과 Title/Description의 좌우 여백이 유지되는지 확인한다.
- 새 컴포넌트는 같은 도메인/맥락 컴포넌트 그룹의 sibling으로 배치한다. 작업 중 임시로 다른 page/root에 만들었다면 완료 전 이동하고 parent path를 QA 리포트에 기록한다.
- Avatar처럼 부모 bounds를 넘는 요소는 z-order와 clipping을 함께 확인한다.
- 태그/칩/리스트처럼 개수가 늘 수 있는 영역은 고정 텍스트 1:1 복제보다 slot 또는 exposed instance 설계가 우선이다.
- 컴포넌트 수정 후 `componentPropertyDefinitions`와 `componentPropertyReferences`를 대조해 stale property를 제거한다.
- 새 컴포넌트를 만들거나 기존 컴포넌트를 수정/확장했다면, 원본 사용처의 로컬 리소스를 해당 컴포넌트 인스턴스로 교체하고 교체 결과를 검증한다.
- publish 전이라 교체가 불가능하면 “교체 대기”가 아니라 명시적 blocker로 기록하고 사용자에게 publish/update 필요성을 알린다.
- 시각 차이가 의도된 CDS 정규화인지, 제작 실수인지 리포트에 구분해서 남긴다.
- 원본 노드가 없거나 접근 불가하면 스크린샷 비교를 생략하지 말고 “원본 비교 불가”로 FAIL 처리한다.

**필수 산출물:**
- `sourceNodeId`
- `componentNodeId`
- `componentGroupPath`
- `sourceScreenshot`
- `componentScreenshot`
- `visualDiffSummary`
- `propertyIntegrity`
- `useSiteReplacement`
- `intentionalDeltas`

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

### 수정 가이드 (--fix)
| Phase | 작업 | 건수 |
```
