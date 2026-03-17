# TDS Vibe-Coding QA Rubric v1.0

> 바이브코딩(Tailwind+React+shadcn) 적합성 점검 루브릭
> 참조: naming-policy.md v1.1

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

## R1. TDS 인스턴스 커버리지 (20%)

UI 요소 중 TDS 컴포넌트 인스턴스 비율.

**자동 검사:**
- `node.type === "INSTANCE"` 카운트
- `componentId` → TDS fileKey(`H36eNEd6o7ZTv4R7VcyLf2`) 소속 확인
- detached instance = 비-TDS (로컬 프레임)

**점수:**
- 100%: TDS 인스턴스 100%, 로컬 프레임 0건
- 비-TDS 노드 1건당: -10 (비율 비례로 조정 가능)

---

## R2. 네이밍 시맨틱 (20%)

레이어명이 시맨틱 역할을 설명하는지. naming-policy.md v1.1 준수.

**감점 규칙:**

| 위반 | 등급 | 감점 | 예시 |
|------|------|------|------|
| 금지 접미사 (Container/Wrapper/Box/View/Div) | Major | -10 | `Container Header` |
| 자동 생성명 (Text, Frame *, Group *) | Minor | -5 | `Frame 1234` |
| 특수문자 (`:`, `↳`, 레이어명 내 `/`) | Minor | -5 | `Blur:mask-group` |
| 하드코딩 데이터 | Minor | -3 | `Sophie Tan`, `5명` |
| 역할 미설명 일반명 (Wrapper 외) | Warning | -2 | `Box`, `Item` |

**허용 어휘 (시맨틱 역할):**
`Screen`, `Content`, `Header`, `Footer`, `Section`, `Area`, `Sidebar`, `Scroll Area`, `List`, `Grid`, `Navbar`, `Tab Bar`, `Input`, `Form`, `Card`, `Group`

**텍스트 노드:** `Title`, `Description`, `Label`, `Subtitle`, `Caption`, `Value`
**이미지 노드:** `[컨텍스트] Image/Thumbnail/Avatar/Banner/Icon/Illustration`

**케이싱:** Title Case 공백 필수 (`Chat Content` O, `chatContent` X, `ChatContent` X)

**TDS 인스턴스 내부 레이어:** 검사 제외 (오버라이드 안 했으면 원본 구조)

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

**표준 aspect-ratio:** `1/1`, `4/3`, `3/2`, `16/9`, `9/16`, `3/4`, `2/3`
예외: 디바이스 해상도 비율 (375/812 등)

**Figma Fill mode:** `scaleMode=FILL` → OK. 수동 absolute 배치 → FAIL.

---

## R4. 프로퍼티 설계 (10%)

Boolean/Variant → React props 직매핑 가능 여부.

| 위반 | 등급 | 감점 |
|------|------|------|
| prop 이름 충돌 (같은 이름 2개+) | Major | -10/건 |
| prop 20개 초과 | Major | -10 |
| prop 16-20개 | Minor | -5 |
| Boolean에 show/is/has 접두어 없음 | Minor | -5/건 |
| Property가 camelCase 아님 | Minor | -5/건 |
| Variant value가 lowercase 아님 | Warning | -2/건 |

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

**shadcn 공식명 = Title Case 공백:** `Alert Dialog`, `Scroll Area`, `Toggle Group`
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

## 리포트 템플릿

```
## QA Report: [화면명]

> 날짜: YYYY-MM-DD | 루브릭: v1.0 | 노드: [node-id]

### 총점: XX/100 — [PASS/CONDITIONAL/FAIL]

| 축 | 점수 | 가중 | 이슈 수 |
|----|------|------|---------|
| R1 TDS 커버리지 | /100 | ×0.20 | |
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

### 수정 가이드 (--fix)
| Phase | 작업 | 건수 |
```
