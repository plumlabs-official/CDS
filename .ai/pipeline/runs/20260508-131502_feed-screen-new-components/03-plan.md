# 03 — Plan: Feed Screen 신규 CDS 컴포넌트 생성 계획

> Source: `01-team-analysis.md` (controller fallback 후 진행)
> Date: 2026-05-08
> Owner: Claude (controller)
> Component Contract: `.claude/rules/component-contract.md`
> QA Rubric: `.claude/rules/qa-rubric.md`

---

## 0. 개요

**대상**: 신규 CDS 컴포넌트 4종을 CDS 라이브러리 (`H36eNEd6o7ZTv4R7VcyLf2`)에 생성

| # | 컴포넌트 | 의존성 |
|---|----------|--------|
| 1 | **Reaction Bar** (primitive) | Lucide icons (heart, message-circle-more, share) |
| 2 | **Comment Item** (primitive) | Button (CDS), 옵션: Lucide heart |
| 3 | **Feed Addon Footer** (primitive) | Avatar Group (CDS) |
| 4 | **Feed Card** (composed) | Profile Card, Lounge Card, Reaction Bar(1), Feed Addon Footer(3), Comment Item(2) ×2 |

**작업 순서**: 1 → 2 → 3 → 4 (의존성 역순)

## 0.1 Group Placement (F1 해결)

**CDS 파일 read-only 확인 결과** (use_figma 호출):

```
Components PAGE
└─ Composed SECTION (20157:1250)
   ├─ Header / Navbar / Tabs / Card and Sheet / Field / ... (20개 FRAME)
   ├─ Lounge Cards FRAME (20726:2860)
   │   ├─ .Utility / Title (20726:2861)
   │   └─ Main content (20726:2867)
   └─ ⭐ [NEW] Feed Cards FRAME ← 본 run에서 신설
```

**결정**: 신규 FRAME `Feed Cards`를 `Composed` SECTION (`20157:1250`) 자식으로 신설 (Lounge Cards sibling). 4개 컴포넌트 모두 이 그룹 내부에 배치.

- **부모 nodeId**: `20157:1250` (Composed SECTION) — 확정
- **신규 wrapper FRAME**: name=`Feed Cards`, type=FRAME — `Composed` SECTION 자식 (Lounge Cards sibling)
  - **`feedCardsFrameNodeId`** = 5-1 runtime 캡처
- **신규 inner FRAME**: name=`Main content`, type=FRAME — `Feed Cards` 자식 (4 컴포넌트의 실제 append parent)
  - **`mainContentNodeId`** = 5-1 runtime 캡처
- **`componentGroupNodeId`** (모든 4 CreationDecision packet) = **`mainContentNodeId`** (실제 append parent)
- **componentGroupPath**: `Components > Composed > Feed Cards > Main content`
- 추가 sibling FRAME `.Utility / Title`도 `Feed Cards` 자식으로 둠 (Lounge Cards 패턴 따라, 도큐멘테이션 영역)

**근거**: 사용자 룰 "맥락을 공유하는 CDS 컴포넌트 그룹". Feed primitive 4종은 Feed 도메인 공유 — Lounge Cards와 분리해 별도 그룹이 자연. Lounge Cards 패턴(Main content 서브 그룹)을 동일 적용.

---

## 1. Component: Reaction Bar

### 1-1. Creation Gate Evidence

```ts
const creationDecisionReactionBar = {
  sourceUnitNodeId: "24112:14996", // Feed Screen / Feed Card #1 / Feed Contents / Reaction Bar
  candidateComponents: [
    "Lounge Card Addon Block (d9e7856b...) — REJECTED: 16x16 metadata pill, 다른 역할",
    "Messaging Reaction (c95538c2...) — REJECTED: emoji-based chat reaction, 다른 패턴",
  ],
  componentGroupNodeId: "<runtime 캡처: 5-1.5 단계 신설 Main content FRAME nodeId — = mainContentNodeId>",
  componentGroupParentNodeId: "20157:1250", // Composed SECTION (확정)
  componentGroupPath: "Components > Composed > Feed Cards > Main content",
  placementReason: "Feed 전용 primitive 그룹 신설. Lounge Cards와 분리해 향후 Feed primitive 확장 공간 확보 (사용자 룰: 맥락 공유 그룹).",
  decision: "createNew",
  decisionReason: "anatomy(375x38 horizontal action bar with 22x22 icons)와 역할(interactive feed action)이 기존 후보와 호환 X.",
  rejectedOptions: ["Lounge Card Addon Block", "Messaging Reaction"],
  variantExplosionRisk: "low", // Variant axis 없음, 모두 BOOLEAN/INSTANCE_SWAP
  exceptions: [],
};
```

### 1-2. Anatomy (F2 반영 — Liked overlay 모델 + F6 hit area)

> Heart 아이콘의 outline↔filled 전환은 BOOLEAN으로 `mainComponent` swap이 불가하므로 **두 아이콘 stack overlay** 패턴으로 구현. Heart Outline은 항상 visible, Heart Filled는 `Liked` BOOLEAN으로 visible 토글. `Liked=true` 시 filled가 outline 위에 덮어 시각적으로 fill 효과.

```
Reaction Bar [COMPONENT, 375×38]
└─ frame layoutMode=HORIZONTAL, justify-content=space-between, padding 16px x 8px
   ├─ Left [layoutMode=HORIZONTAL, gap=14, layoutSizing FILL]
   │   ├─ Like Action [layoutMode=HORIZONTAL, gap=3, items-center, min-w/h 44px hit area*]
   │   │   ├─ Heart Container [22×22, position relative]
   │   │   │   ├─ Heart Outline [INSTANCE 22×22, Lucide heart, always visible]
   │   │   │   └─ Heart Filled  [INSTANCE 22×22, Lucide heart filled (또는 가능한 변형), absolute overlay, visible bound to Liked]
   │   │   └─ Like Count [TEXT, "0", text-sm regular]
   │   └─ Reply Action [layoutMode=HORIZONTAL, gap=4, items-center, min-w/h 44px hit area*]
   │       ├─ Reply Icon [INSTANCE 22×22, Lucide message-circle-more (Phosphor 대체)]
   │       └─ Reply Count [TEXT, "0", text-sm regular]
   └─ Right [layoutMode=HORIZONTAL, hit area 44px*]
       └─ Share Icon [INSTANCE 22×22, Lucide share]
```

> * **Hit area 보정 (F6)**: visible icon은 22×22 (CDS 표준 시각 크기)지만, 각 Action frame은 padding으로 최소 44×44 hit area를 확보. Reaction Bar 전체 height 38px 제약상 일부는 horizontal padding으로만 보정 — 자세한 contract exception은 §1-6.

### 1-3. componentPropertyDefinitions (F2/F6 반영 — naming policy 준수)

> Display name (Figma UI) — 이 표는 정책 표준. Figma API 내부 키는 `<DisplayName>#<auto-id>` 형식으로 자동 부여되며 사용처/code는 display name으로 매핑.

| Display Name | type | default | bound to | 비고 |
|--------------|------|---------|----------|------|
| `Is Liked` | BOOLEAN | false | `Heart Filled` instance `visible` | Boolean prefix `Is` (naming-policy v2.0) |
| `Like Count` | TEXT | "0" | `Like Count` text characters | |
| `Show Like Count` | BOOLEAN | true | `Like Count` text `visible` | 0 hide UX |
| `Reply Count` | TEXT | "0" | `Reply Count` text characters | |
| `Show Reply Count` | BOOLEAN | true | `Reply Count` text `visible` | 0 hide UX |
| `Show Share` | BOOLEAN | true | `Right` frame `visible` | Share 노출 |

> No VARIANT axis. Liked BOOLEAN은 `Heart Filled` instance의 `visible`만 토글 (mainComponent swap 아님).

### 1-4. Probes (Completion Gate)

```js
// instanceOverrideProbe
const probe = component.createInstance();
probe.setProperties({
  "Liked#1": true,
  "Like Count#2": "999",
  "Reply Count#4": "1.2K",
});
// verify like count text changed, heart icon swapped, reply count rendered
probe.remove();

// responsiveProbe: width 320 / 375 / 414
// longTextProbe: Like Count "9,999,999" 입력 시 ellipsis or natural width
// boundsCheck: 22px icons centered, 38px height fixed
```

### 1-5. Acceptance Criteria

- [ ] `componentPropertyDefinitions`의 모든 key가 child 노드에 매칭 (PropertyReferenceMatrix PASS)
- [ ] Like/Reply count TEXT prop 변경 시 노드 렌더 변경 (instanceOverrideProbe PASS)
- [ ] Liked=true에서 Heart Filled overlay 시각 표현 + Liked=false에서 Outline만 (probe 양쪽 PASS)
- [ ] Lucide icons만 사용 (R7 PASS)
- [ ] Auto Layout fill/hug 적정 (R3 PASS)
- [ ] Each Action(Like/Reply/Share) hit area ≥ 44px (또는 §1-6 exception 기록)
- [ ] Token binding: 텍스트 색상 / 아이콘 색상 → CDS variables (R6 PASS)

### 1-6. Component Contract Exceptions (F6)

```ts
const reactionBarExceptions = [
  {
    ruleId: "qa-rubric.R8.touch-target",
    nodeId: "<Like Action / Reply Action / Right>",
    nodeName: "각 Reaction Action frame",
    reason: "Visible icon은 22×22가 CDS Reaction Bar 표준. Reaction Bar 전체 height=38px 제약상 vertical 44px 확보 불가. Implementation 단계에서 invisible padding으로 hit area 44×44 보정.",
    evidence: "qa-rubric.md R8 / 디자인 height 38px",
    approver: "user (명시 승인 — 2026-05-08 Plan Review Round 3 F7: 사용자 'R8 hit area exception OK')",
    revisit: "Reaction Bar height를 44px+로 키우는 디자인 결정 시",
  },
];
```

---

## 2. Component: Comment Item

### 2-1. Creation Gate Evidence

```ts
const creationDecisionCommentItem = {
  sourceUnitNodeId: "24112:15017", // Feed Screen / Feed Card #1 / Feed Footer / Item
  candidateComponents: [
    "CDS Item ComponentSet (f5e11dd4...) — REJECTED: Default 383x58 vertical 2-line(Title above + Description below). Comment Item은 horizontal Name + Description side-by-side. Anatomy 호환 X. Variant 추가도 부자연스러움(Slot Left 32x32 vs Comment Item에는 Left 없음).",
  ],
  componentGroupNodeId: "<runtime 캡처: 5-1.5 단계 신설 Main content FRAME nodeId — = mainContentNodeId>",
  componentGroupParentNodeId: "20157:1250", // Composed SECTION (확정)
  componentGroupPath: "Components > Composed > Feed Cards > Main content",
  placementReason: "Feed primitive 그룹에 reply/comment 패턴 SSOT 배치. 향후 Lounge talk / Challenge talk reply에서도 reuse 가능.",
  decision: "createNew",
  decisionReason: "Item ComponentSet과 anatomy 근본 차이 (vertical vs horizontal layout). 별도 primitive로 분리.",
  rejectedOptions: ["CDS Item ComponentSet"],
  variantExplosionRisk: "low",
  exceptions: [],
};
```

### 2-2. Anatomy

```
Comment Item [COMPONENT, 343×32]
└─ frame layoutMode=HORIZONTAL, gap=10, items-center
   ├─ Name [TEXT, "김영재", text-sm semibold, hug-content]
   ├─ Item content [layoutSizing FILL, layoutMode=VERTICAL, justify-center]
   │   └─ Description Slot [layoutMode=HORIZONTAL]
   │       └─ Description [TEXT, ellipsis, layoutSizing FILL, text-sm regular]
   └─ Right Slot [INSTANCE_SWAP slot, hug-content]    ← F6: 특수문자 ↳ 제거
       └─ default: Button instance (32×32 icon-only or 62×32 text "더보기")
```

### 2-3. componentPropertyDefinitions (R4-F2 + F6 반영)

| Display Name | type | default | bound to | 비고 |
|--------------|------|---------|----------|------|
| `Name` | TEXT | "Name" | `Name` text characters | 댓글 작성자명 |
| `Show Name` | BOOLEAN | true | `Name` text `visible` | 익명/시스템 메시지 케이스 |
| `Description` | TEXT | "Description" | `Description` text characters | 댓글 본문 |
| `Right Slot` | INSTANCE_SWAP | CDS Button (`Type=Tertiary, Size=Small, Icon Only`) | `Right Slot` mainComponent | preferredValues: CDS `Button` ComponentSet |
| `Show Right Slot` | BOOLEAN | true | `Right Slot` `visible` | Right Slot 자체 노출 토글 |

> Right Slot은 INSTANCE_SWAP으로 결정 (variant explosion 회피). 사용처에서 Button instance를 swap해 텍스트("더보기") / 아이콘(heart) / 비표시 결정.

### 2-4. Probes

```js
const probe = component.createInstance();
probe.setProperties({
  "Name#1": "김영재",
  "Description#3": "오늘은 노랭이에요 그리고 매우 매우 긴 텍스트로 ellipsis 검증",
  "Show Right Slot#5": true,
});
// verify: Name truncates if needed, Description ellipsis, Right Slot remains
probe.remove();

// longTextProbe: Description 100자 → ellipsis "..." 처리
// responsiveProbe: width 280 / 343 / 414 → Name hug, Description fill, Slot Right hug
// boundsCheck: 32px height, vertical centering 유지
```

### 2-5. Acceptance Criteria

- [ ] Name/Description prop이 노드 변경 (instanceOverrideProbe PASS)
- [ ] Right Slot이 Button instance swap 가능 (CDS `Button` ComponentSet match)
- [ ] long Description ellipsis 처리 (longTextProbe PASS)
- [ ] 32px height 고정, Name hug + Description fill + Right Slot hug (R3 PASS)
- [ ] Right Slot Button (32×32) hit area ≥ 44px (또는 §2-6 exception 기록)

### 2-6. Component Contract Exceptions (F6)

```ts
const commentItemExceptions = [
  {
    ruleId: "qa-rubric.R8.touch-target",
    nodeId: "<↳ Slot Right>",
    nodeName: "Comment Item Right Slot Button",
    reason: "32×32 Button instance는 CDS Button ComponentSet의 표준 크기 (Size=Small Icon Only). Comment Item row height=32px 제약상 visible 32×32 유지. Implementation 단계에서 invisible padding 6px로 44×44 hit area 보정.",
    evidence: "qa-rubric.md R8 / CDS Button Size=Small 32x32 표준",
    approver: "user (명시 승인 — 2026-05-08 Plan Review Round 3 F7: 사용자 'R8 hit area exception OK')",
    revisit: "Comment Item row height를 44px+로 키우는 디자인 결정 시",
  },
];
```

---

## 3. Component: Feed Addon Footer

### 3-1. Creation Gate Evidence

```ts
const creationDecisionFeedAddonFooter = {
  sourceUnitNodeId: "24112:15009", // Feed Screen / Feed Card #1 / Feed Footer / Feed Addon Footer
  candidateComponents: [
    "CDS Lounge Card Addon Block (d9e7856b...) — REJECTED: 35x16 metadata pill, 다른 역할",
  ],
  componentGroupNodeId: "<runtime 캡처: 5-1.5 단계 신설 Main content FRAME nodeId — = mainContentNodeId>",
  componentGroupParentNodeId: "20157:1250", // Composed SECTION (확정)
  componentGroupPath: "Components > Composed > Feed Cards > Main content",
  placementReason: "Feed primitive 그룹에 activity description SSOT. 좋아요/참여/완료 등 activity 표현 재사용.",
  decision: "createNew",
  decisionReason: "anatomy(343x36 description row with Avatar Group + multi-text)와 역할(activity summary)이 기존 후보와 호환 X.",
  rejectedOptions: ["CDS Lounge Card Addon Block"],
  variantExplosionRisk: "low",
  exceptions: [],
};
```

### 3-2. Anatomy (F4 반영 — 별도 TEXT 노드 분리)

> Figma TEXT property는 `characters` 단일 필드만 bind 가능. SemiBold/Regular mixed text를 prop으로 다루려면 **각각 독립 TEXT 노드**여야 함. 이전 plan은 "span"으로 표현했으나 Figma anatomy 기준 부정확. 5개 TEXT 노드로 구체화.

```
Feed Addon Footer [COMPONENT, 343×36]
└─ frame layoutMode=VERTICAL, padding 8px y
   └─ Description [layoutMode=HORIZONTAL, gap=4, items-center, layoutSizing FILL]
      ├─ Attendee Slot [INSTANCE_SWAP slot, hug-content, visible bound]
      │   └─ default: Avatar Group instance (variable width by avatar count)
      ├─ Actor Name [TEXT node, "김재현", text-sm SemiBold, hug, characters bound]
      ├─ Suffix1 [TEXT node, "님 외 ", text-sm Regular, hug, fixed (prop 아님)]
      ├─ Attendee Count [TEXT node, "여러명", text-sm SemiBold, hug, characters bound]
      ├─ Suffix2 [TEXT node, "이 ", text-sm Regular, hug, fixed (prop 아님)]
      └─ Status [TEXT node, "좋아합니다.", text-sm Regular, layoutSizing FILL, ellipsis, characters bound]
```

> **타이포 트레이드오프**: 5개 TEXT 노드로 분리하면 Korean particle 자동 처리 어려움(예: "여러명이" vs "두 명이"). 현 디자인은 fixed Suffix 가정. 향후 다국어 또는 동적 particle 시 별도 ADR 필요.

### 3-3. componentPropertyDefinitions (R3-F2 + R4 + F6 반영)

| Display Name | type | default | bound to | 비고 |
|--------------|------|---------|----------|------|
| `Actor Name` | TEXT | "김재현" | Actor Name TEXT 노드 characters | 행위 주체 (SemiBold) |
| `Attendee Count` | TEXT | "여러명" | Attendee Count TEXT 노드 characters | 참여자 수 표현 (SemiBold) |
| `Status` | TEXT | "좋아합니다." | Status TEXT 노드 characters | 활동 동사구 |
| `Attendee Slot` | INSTANCE_SWAP | CDS `Avatar Group` (default 2 avatars 33×20) | `Attendee Slot` mainComponent | preferredValues: CDS `Avatar Group` |
| `Show Avatars` | BOOLEAN | true | `Attendee Slot` `visible` | Avatar 노출 토글 |

> Suffix1("님 외 ") / Suffix2("이 ")는 한국어 문법 고정 텍스트로 prop 아님. 향후 다국어 / 영어 변환 시 별도 ADR.

### 3-4. Probes

```js
const probe = component.createInstance();
probe.setProperties({
  "Actor Name#1": "김재현이라는매우긴이름",
  "Attendee Count#2": "1,234명",
  "Status#3": "좋아하고 댓글도 남겼습니다 그리고 매우 긴 텍스트",
  "Show Avatars#5": false,
});
// verify: Actor Name SemiBold rendering, Status ellipsis, Avatar Slot hidden
probe.remove();

// longTextProbe: Actor Name 30자 + Status 50자 → row 343 폭 내 ellipsis
// boundsCheck: 36px height, vertical centering
// instanceSwap: Attendee Slot에 Avatar Group 1/2/3 avatar variant 입력 → 자연 hug
```

### 3-5. Acceptance Criteria

- [ ] 5개 prop 모두 노드 변경 reflect (PropertyReferenceMatrix PASS)
- [ ] Actor Name span SemiBold + Suffix1 Regular 시각 구분 유지
- [ ] Attendee Slot이 Avatar Group instance swap 가능
- [ ] long Status ellipsis (longTextProbe PASS)

---

## 4. Component: Feed Card

### 4-1. Creation Gate Evidence

```ts
const creationDecisionFeedCard = {
  sourceUnitNodeId: "24112:14976", // Feed Screen / Body / Feed Card #1 (대표)
  candidateComponents: [
    "(없음 — Feed Card 패턴 자체에 직접 매칭되는 CDS 후보 없음. 분석 단계에서 사방 검색 완료)",
  ],
  componentGroupNodeId: "<runtime 캡처: 5-1.5 단계 신설 Main content FRAME nodeId — = mainContentNodeId>",
  componentGroupParentNodeId: "20157:1250", // Composed SECTION (확정)
  componentGroupPath: "Components > Composed > Feed Cards > Main content",
  placementReason: "Feed 메인 composed component. 본 run의 Reaction Bar / Comment Item / Feed Addon Footer를 모두 nested instance로 사용하므로 동일 그룹 내 sibling 배치가 자연.",
  decision: "createNew",
  decisionReason: "6 use site SSOT 필요. nested override가 아닌 INSTANCE_SWAP 슬롯 모델로 화면 단 props 일관성 확보.",
  rejectedOptions: [],
  variantExplosionRisk: "low",
  exceptions: [],
};
```

### 4-2. Anatomy (R4-F3 + F3 Media Slot 반영)

```
Feed Card [COMPONENT, 375×variable]
└─ frame layoutMode=VERTICAL, gap=8, layoutSizing FIXED 375 width
   ├─ Feed Header [layoutMode=VERTICAL, padding 16px x]
   │   └─ Header Slot [INSTANCE_SWAP, default: CDS Profile Card Variant=Horizontal Row]
   ├─ Feed Contents [layoutMode=VERTICAL, layoutSizing FILL]
   │   ├─ Lounge Card Slot [INSTANCE_SWAP, default: CDS Lounge Card State=1Line]
   │   │     visible bound to `Show Lounge Card`
   │   ├─ Media Slot [INSTANCE_SWAP, default: 신규 placeholder Media Frame component (375×500 image-fill)]
   │   │     사용처별 이미지/비디오 instance swap
   │   └─ Reaction Bar Slot [INSTANCE_SWAP, default: 본 run #1 Reaction Bar]
   └─ Feed Footer [layoutMode=VERTICAL, padding 16px x]
       ├─ Addon Footer Slot [INSTANCE_SWAP, default: 본 run #3 Feed Addon Footer]
       │     visible bound to `Show Addon Footer`
       ├─ Comment Slot 1 [INSTANCE_SWAP, default: 본 run #2 Comment Item]
       │     visible bound to `Show Comment 1`
       └─ Comment Slot 2 [INSTANCE_SWAP, default: 본 run #2 Comment Item]
             visible bound to `Show Comment 2`
```

> **Media Slot (F3 재결정)**: Feed Content Section을 **LOCAL frame inside Feed Card** (INSTANCE_SWAP slot 아님)으로 유지. 375×500 fixed-size frame with image fill (default Vector placeholder). **사용처에서 image fill instance override**로 사진/비디오 적용. Figma instance image fill override는 component 자체 변경 없이 작동.

> **scope 유지: 4 컴포넌트** (Feed Media Placeholder helper 추가 X — F3 reject path 채택). Media Slot은 sub-frame, prop 아님.

### 4-3. componentPropertyDefinitions (F3 reject path + F6 naming policy)

| Display Name | type | default | bound to | 비고 |
|--------------|------|---------|----------|------|
| `Header Slot` | INSTANCE_SWAP | CDS Profile Card Horizontal Row | `Header Slot` mainComponent | 작성자 영역 |
| `Lounge Card Slot` | INSTANCE_SWAP | CDS Lounge Card 1Line | `Lounge Card Slot` mainComponent | Challenge context |
| `Show Lounge Card` | BOOLEAN | true | `Lounge Card Slot` `visible` | |
| `Reaction Bar Slot` | INSTANCE_SWAP | 본 run Reaction Bar | `Reaction Bar Slot` mainComponent | |
| `Addon Footer Slot` | INSTANCE_SWAP | 본 run Feed Addon Footer | `Addon Footer Slot` mainComponent | |
| `Show Addon Footer` | BOOLEAN | true | `Addon Footer Slot` `visible` | |
| `Comment Slot 1` | INSTANCE_SWAP | 본 run Comment Item | `Comment Slot 1` mainComponent | |
| `Show Comment 1` | BOOLEAN | true | `Comment Slot 1` `visible` | |
| `Comment Slot 2` | INSTANCE_SWAP | 본 run Comment Item | `Comment Slot 2` mainComponent | |
| `Show Comment 2` | BOOLEAN | false | `Comment Slot 2` `visible` | default off, 6 use site 댓글 0~2 |

> **Total props**: 10. Feed Content Section (375×500 image fill frame)은 sub-frame이며 prop 아님. 사용처에서 image fill override로 미디어 적용.

> **Nested Override Policy (R4-F3)**: Feed Card는 **structural shell**이다. 사용처가 Header/Lounge Card/Reaction Bar/Addon Footer/Comment 1·2 각 slot의 instance를 swap해 nested 컴포넌트의 props를 직접 override한다. Feed Card 자체에 자식 텍스트 prop을 expose하지 않음. 사유:
> 1. 5개 nested instance × 각 5~10 prop = 30~50 prop expose 시 props 폭발 → 사용성 ↓ (cds-make-component SKILL.md 가이드와 일치)
> 2. INSTANCE_SWAP slot 모델은 Figma override가 instance level에서 자연 작동
> 3. 사용처 React 매핑도 `<FeedCard><FeedCard.Header><ProfileCard ...props/></FeedCard.Header>...</FeedCard>` 또는 props slot 패턴으로 구현 가능

### 4-4. Probes

```js
// instanceOverrideProbe
const probe = component.createInstance();
probe.setProperties({
  "Show Lounge Card#3": false,
  "Show Addon Footer#6": false,
  "Show Comment 1#8": false,
  "Show Comment 2#10": false,
});
// verify: minimal feed card (Header + media + Reaction only)
probe.setProperties({
  "Show Lounge Card#3": true,
  "Show Comment 1#8": true,
  "Show Comment 2#10": true,
});
// verify: full feed card with all slots visible
probe.remove();

// nested probe: instance.findOne(node => node.name === "Header Slot").mainComponent
//   를 다른 Profile Card variant(Vertical)로 setProperties 시도 → swap 정상 반영 확인
```

### 4-5. Acceptance Criteria

- [ ] 10개 prop 모두 PropertyReferenceMatrix PASS (F8 — Media Slot 제거 후 정확한 카운트)
- [ ] Show * BOOLEAN 토글이 visible 변경
- [ ] INSTANCE_SWAP slot이 nested swap 가능
- [ ] 6 use site 노드(24112:14976, 15039, 15087, 15135, 15182, 15231) 모두 본 컴포넌트 instance로 교체 가능

### 4-6. Use Site Replacement Procedure (F4 반영 — preserve-source-overrides)

> Codex 지적 합당: 6 use site의 모든 source value를 plan time에 추출해 표로 적는 것은 비효율 + 정확도 낮음. **대신 preserve-source-overrides procedure를 정의**해 5-7 단계에서 자동으로 source override를 신규 instance로 이전.

**Per-slot extraction schema (F5 — concrete, validated, block-on-fail)**:

```ts
type ExtractionSchema = {
  // 각 slot에 대한 path resolver + required/optional 표시
  headerProfileCard: { selectorPath: ["Feed Header", "Profile Card"], required: true,
    extract: (node) => ({
      avatarFills: getInstanceFills(node.findOne(c => c.name === "Avatar")),
      nameText: getText(node, ["Title", "Name", /^[가-힣A-Za-z]/]),  // first text in Name frame
      dateText: getText(node, ["Title"], textIndex: 1),               // second text under Title
      rightSlotInstances: node.findOne(c => c.name === "↳ Right Slot")?.children?.map(getInstanceRef),
    }),
  },
  loungeCardOverrides: { selectorPath: ["Feed Contents", "Lounge Card"], required: true,
    extract: (node) => ({
      title: getText(node, ["Body", "Alert Title"]),
      attendeeAvatarFills: getInstanceFills(node.findOne(c => c.name === "Avatar Group")),
      attendeeText: getText(node, ["Body", "Attendee", /참여/]),
      thumbnailFills: getInstanceFills(node.findOne(c => c.name === "Challenge Thumbnail")),
    }),
  },
  reactionBarCounts: { selectorPath: ["Feed Contents", "Reaction Bar"], required: true,
    extract: (node) => ({
      likeCount: getText(node, ["Left", "Like", "Like Count"]),
      replyCount: getText(node, ["Left", "Reply", "Like Count"]),
    }),
  },
  feedAddonFooter: { selectorPath: ["Feed Footer", "Feed Addon Footer"], required: false,
    extract: (node) => ({
      avatarGroupFills: getInstanceFills(node.findOne(c => c.name === "Avatar Group")),
      actorName: getText(node, ["Description", "Count", "Prefix"], { firstSpan: true }),
      attendeeCount: getText(node, ["Description", "Count", "Attendee Count"], { firstSpan: true }),
      status: getText(node, ["Description", "Status"]),
    }),
  },
  commentItems: { selectorPath: ["Feed Footer", "Item*"], required: false, // 0~2 Item 노드
    extract: (items) => items.map(item => ({
      name: getText(item, [/^.+$/], textOnly: true),  // 첫 TEXT child
      description: getText(item, ["Item content", "Description Slot"]),
      rightSlotKind: detectRightSlotKind(item.findOne(c => c.name === "↳ Slot Right")),  // "iconHeart" | "textMore" | "none"
    })),
  },
  mediaFill: { selectorPath: ["Feed Contents", "Feed Content Section"], required: false,
    extract: (node) => ({ imageFills: getImageFills(node) }),
  },
};

// Apply: 신규 Feed Card instance에 적용
function applyToNewInstance(newInstance, sourceData) {
  // Header Slot prop의 nested instance에 setProperties로 prop 적용
  // Lounge Card Slot prop의 nested instance에 prop 적용
  // Reaction Bar Slot의 Like Count / Reply Count prop 적용
  // Feed Addon Footer Slot의 Actor Name / Attendee Count / Status prop 적용
  // Comment Slot 1 / Comment Slot 2 prop 적용 + Show Comment 1/2 BOOLEAN
  // Feed Content Section sub-frame에 image fill override
  // Show Lounge Card / Show Addon Footer / Show Comment 2 BOOLEAN 적용
}

// Block-on-fail: required 슬롯 매칭 실패 시 해당 use site replacement 중단
//   → useSiteReplacement: { card_id: "blocked", reason: "<missing slot>" }
```

**Procedure 실행 (각 use site에 대해)**:

```js
// 1. Source data extraction with schema
const sourceData = extractWithSchema(sourceNode, ExtractionSchema);
if (sourceData.errors.length > 0) {
  recordBlocked(sourceNode.id, sourceData.errors);
  return; // 다음 use site로 진행
}

// 2. Before screenshot (sourceNode 위치 그대로)
const beforeShot = await captureScreenshot(sourceNode);

// 3. 신규 Feed Card instance 생성
const newInstance = feedCardComponent.createInstance();
const sourceParent = sourceNode.parent;
const sourceIndex = sourceParent.children.indexOf(sourceNode);

// 4. Source 노드를 archive page로 이동 (Auto Layout escape — F4)
const archivePage = figma.root.children.find(p => p.name === "_Archive Feed Screen 2026-05-08");
archivePage.appendChild(sourceNode);

// 5. Source 자리에 새 instance 삽입
sourceParent.insertChild(sourceIndex, newInstance);

// 6. Source data 적용
applyToNewInstance(newInstance, sourceData);

// 7. After screenshot + visual diff
const afterShot = await captureScreenshot(newInstance);
const diff = diffSummary(beforeShot, afterShot);
recordResult(sourceNode.id, { newInstanceId: newInstance.id, beforeShot, afterShot, diff });
```

**6 Use Site target nodes (source IDs from Feed Screen)**:

| # | source nodeId | metadata 노트 |
|---|---------------|----------------|
| 1 | `24112:14976` | Feed #1, Header Right Slot=ellipsis only, Comment 2건 (text "더보기" + heart) |
| 2 | `24112:15039` | Feed #2, Header Right Slot=Button text 62 + ellipsis 32, Comment 1건 (heart) |
| 3 | `24112:15087` | Feed #3, 동일 패턴, Comment 1건 (heart) |
| 4 | `24112:15135` | Feed #4, Comment 1건 (Button text "더보기" 62) |
| 5 | `24112:15182` | Feed #5, Comment 1건 (heart) |
| 6 | `24112:15231` | Feed #6, Comment 1건 (heart, 작성자명 83폭 sara_nagase) |

> **각 use site 처리 결과**: 5-7 단계 종료 시 6개 카드 각각 (a) sourceData 추출 결과 (b) newInstance applyOverrides 결과 (c) before/after screenshot (d) visual diff summary (e) intentional deltas list 를 `05-implementation.md` Phase B에 기록. 표 사전 채우기 대신 procedure-driven 보존으로 정확도 확보.

**Intentional deltas (모든 6 use site 공통)**:
- Phosphor `chat-centered-dots` → Lucide `message-circle-more` reply icon (R7 정합)
- Reaction Bar Like/Reply count default 동작 표준화
- 그 외 visual 차이는 per-card 기록

---

## 5. 작업 순서 (Implementation Sequence — F1/F4 반영, mutation 순서 안전화)

| Step | 작업 | 산출 | mutation? |
|------|------|------|-----------|
| **5-1** | **Read-only**: CDS file `H36eNEd6o7ZTv4R7VcyLf2` write 권한 확인 (read-only metadata 호출), Composed SECTION (`20157:1250`) 자식 구조 재확인. 본 run의 모든 사용 CDS 컴포넌트(Profile Card, Lounge Card, Avatar Group, Button, Lucide heart/share/message-circle-more) 존재 검증 + componentKey 캡처 | 읽기 전용 검증 결과 | NO |
| **5-1.5** | **Creation Gate Evidence finalize (F1)** — 4 CreationDecision packet 작성 (`componentGroupNodeId`는 5-1.6에서 캡처될 `mainContentNodeId`로 placeholder, 작성 즉시 `05-implementation.md` Phase A 기록). **이 단계 통과 전 어떤 mutation도 금지** | Creation Gate Evidence 4종 | NO |
| **5-1.6** | **Group FRAME 생성 (mutation #1)** — Composed SECTION에 `Feed Cards` FRAME 신설 + 내부 `Main content` + `.Utility / Title` FRAME 추가. `feedCardsFrameNodeId` + `mainContentNodeId` 캡처. Phase A의 placeholder를 캡처값으로 갱신 | 두 nodeId 확정 | YES |
| **5-1.7** | **Lounge Card 375 preflight (F5)** — CDS Lounge Card State=1Line 인스턴스를 임시 위치에 instantiate, `layoutSizingHorizontal=FILL` 또는 `resize(375, ...)`로 width 적용 후 visual probe. PASS시 Feed Card Lounge Card Slot default로 사용. FAIL시 사용자 unblock 요청 + Feed Card 진행 보류 | preflight verdict | YES (probe 후 cleanup) |
| **5-2** | **Reaction Bar 컴포넌트 생성** — Heart Outline + Heart Filled overlay anatomy, 6 prop, 4종 probe (Is Liked true/false 양쪽 검증 포함) | Reaction Bar + key + evidence | YES |
| **5-3** | **Comment Item 컴포넌트 생성** — anatomy, 5 prop, 4종 probe | Comment Item + key + evidence | YES |
| **5-4** | **Feed Addon Footer 컴포넌트 생성** — 5 TEXT 노드 anatomy, 5 prop, 4종 probe | Feed Addon Footer + key + evidence | YES |
| **5-5** | **Feed Card 컴포넌트 생성** — anatomy + 5-2/5-3/5-4 nested instance + Media Slot LOCAL frame with image fill, 10 prop, 4종 probe + nested swap probe | Feed Card + key + evidence | YES |
| **5-6** | **Source Archive Page 준비 (F4)** — 제품 파일에 신규 PAGE `_Archive Feed Screen 2026-05-08` 생성. 5-7에서 source 노드 6개 이동 destination | archive page nodeId | YES |
| **5-7** | **Use Site Replacement (preserve-source-overrides + F4 archive)** — 각 use site에 대해 (a) §4-6 schema로 source data 추출 (b) sourceNode parent에 신규 Feed Card instance를 sourceNode 위치에 insertChild (c) sourceData를 신규 instance에 적용 (d) sourceNode를 archive page로 `appendChild` (Auto Layout escape 안전) (e) before/after screenshot 캡처. 매칭 실패 시 해당 use site는 `replacement: blocked` + 사용자 결정 요청 | 6 use site replacement + screenshots | YES |
| **5-8** | **Final Completion Evidence Packet** — useSiteReplacement 결과(per use site pass/blocked) 포함 full CompletionEvidence 패킷, intentionalDeltas (Phosphor→Lucide reply icon), exceptions(R8 hit area, user approved 2026-05-08), token binding audit, layout contract verification | `05-implementation.md` Phase B | NO (writeup) |

---

## 6. Risks & Mitigation

| 리스크 | 영향 | 완화책 |
|--------|------|--------|
| CDS 파일 write 권한 미확보 | 작업 자체 차단 | 5-1에서 우선 read-only 접근 검증, 막히면 사용자 unblock 요청 |
| use_figma 20KB output 제한 | Plan execution 차단 | 컴포넌트 생성 시 return = id/key/name만, 검증 데이터는 별도 호출로 분리 |
| Lucide `message-circle-more` 컴포넌트 부재 | Reaction Bar 생성 막힘 | 5-2 첫 단계에서 search_design_system으로 Lucide 후보 확인 (`message-circle`, `message-circle-more`, `message-square` 등). 없으면 가장 가까운 것 사용, intentional delta 기록 |
| Component Contract probe 실패 | 컴포넌트 생성 후 정합성 미달 | 5-2~5-5 각 단계 마무리에서 probe 즉시 실행, 실패 시 해당 컴포넌트만 rollback |
| Use site 교체 시 height 변화 | 제품 파일 시각 drift | Feed Card fixed width 375 + auto height. height 차이는 visual diff에 intentional delta로 기록 |
| Lounge Card 1Line variant width 531 vs 사용처 375 | use site swap 시 디자인 깨짐 | layoutSizingHorizontal=FILL 가정. 깨지면 Lounge Card 자체에 width contract 추가 별도 작업 |
| lounge-update-item run 동시 진행 | Reaction Bar 중복 위험 | §8.1 owner 선언 + 5-2 완료 후 lounge run에 cross-reference. lounge run owner가 본 컴포넌트 publish 후 reuse 결정 |

---

## 7. Cross-Run Coordination (F6 — 명시적 입장)

`.ai/pipeline/runs/20260508-132749_lounge-update-item-component/03-plan.md`는 별도 untracked run이며 lounge update item 컴포넌트 안에 inline Reaction Bar를 author하는 안을 가지고 있다.

**본 run의 입장 (재차 명시)**:
- 본 run은 **Reaction Bar SSOT owner**임을 §8.1 분석에서 선언했다.
- 본 run scope에서는 lounge run의 03-plan을 **수정하지 않는다** (cross-run scope creep 회피).
- lounge run이 inline authored Reaction Bar를 진행하면 다음 분기 발생:
  - (a) 본 run이 먼저 publish → lounge run author가 5-2 publish 후 자체 plan을 swap하도록 책임
  - (b) lounge run이 먼저 publish → 본 run publish 후 lounge author가 deprecate 또는 본 컴포넌트로 swap
  - (c) 동시 publish → CDS에 두 Reaction Bar 분기 존재. 사용자 ADR로 정리 별도 작업
- 본 run의 5-2 (Reaction Bar 생성) 완료 시점에 lounge run author에게 cross-reference 알림 (작업 자체는 별도 channel/owner)

**Hard rule**: 본 run의 Director 단계 5-7 use site replacement는 Feed Screen 6 노드만 대상이며 lounge update item 노드는 침범하지 않는다.

**사용자 결정 권장**: lounge run을 일시 중단하고 본 run의 Reaction Bar publish 후 reuse 방향으로 통합하는 것이 분기 위험 최소화. 다만 사용자 분리 운영 결정 시 본 run은 그대로 진행.

---

## 8. Approval & Open Questions

1. ~~**그룹 신설 위치**~~ → **결정 (F5)**: `Composed` SECTION 자식 `Feed Cards` FRAME 신설, 내부 `Main content` FRAME에 5 컴포넌트 배치.
2. **Lucide reply icon 정확한 이름**: `message-circle-more` 존재 가정. 5-3 첫 단계 search_design_system 결과로 확정. 가장 가까운 Lucide 변형 사용 + intentional delta 기록.
3. **Feed Card width contract**: 375 fixed (모바일 단일 폭). 향후 태블릿/web 대응 시 FILL 전환 ADR 별도.
4. **R8 hit area exception**: §1-6, §2-6 exception entries 사용자 승인 필요 (현재 plan에 user approval 표시 — 사용자 결정으로 진행).

---

## 8.1 Plan Review Round 3 Findings 반영 요약 + Controller Fallback

**Verdict 회차 3**: FAIL (8 findings). 사용자 결정으로 8 findings 모두 plan에 반영 후 controller fallback으로 Director 단계 진입 (회차 4 review skip — 사용자 페이션스 + 7회 누적 review 사이클).

### Round 3 (회차 3)

| Finding | Severity | 결정 | 반영 위치 |
|---------|----------|------|-----------|
| F1: 5-1 frame 생성 = mutation, Creation Gate 전 | High | **Accept** | §5 — 5-1 read-only로, 5-1.5 Gate finalize, 5-1.6 frame 생성 |
| F2: componentGroupNodeId placeholder 모순 | High | **Accept** | replace_all로 mainContentNodeId로 통일 |
| F3: Feed Media Placeholder 컴포넌트 evidence 부재 | High | **Accept (제거)** | §4-2 — Media Slot은 LOCAL frame with image fill, helper 컴포넌트 추가 X. scope 4 컴포넌트 유지 |
| F4: source 노드 x+=500은 Auto Layout 망가짐 | High | **Accept** | §5 — 5-6 archive page 신설, 5-7에서 sourceNode를 archive page로 appendChild |
| F5: preserve-source-overrides procedure brittle | High | **Accept** | §4-6 — concrete ExtractionSchema (slot별 path/required/extract func), block-on-fail 명시 |
| F6: prop naming policy 위반 (`Liked#1`, `↳ Slot Right` 등) | Medium | **Accept** | 모든 prop table을 Display Name으로, Boolean prefix `Is/Show/Has`, 특수문자 `↳` 제거 |
| F7: R8 exception approver=user 미승인 | Medium | **Accept (now approved)** | §1-6, §2-6 approver 갱신 ("명시 승인 2026-05-08") |
| F8: Feed Card "10 props"인데 표는 11 | Medium | **Accept** | §4-3 — Media Slot prop 제거 후 정확히 10 props |

## 8.2 Plan Review Round 2 Findings 반영 요약

### Round 2 (회차 2)

| Finding | Severity | 결정 | 반영 위치 |
|---------|----------|------|-----------|
| R2-F1: Creation Gate가 mutation 전에 와야 함 | High | **Accept** | §5 — 5-1.5 단계 신설, Creation Evidence finalize 후 컴포넌트 생성 시작 |
| R2-F2: Liked BOOLEAN은 mainComponent swap 불가 | High | **Accept** | §1-2/1-3 — Heart Outline + Heart Filled overlay 모델, Liked는 Filled visible 토글만 |
| R2-F3: Feed Card Media slot 미정의 | High | **Accept** | §4-2/4-3 — Media Slot INSTANCE_SWAP 추가, Feed Media Placeholder 컴포넌트 신설 (총 5 컴포넌트) |
| R2-F4: Use site matrix 행 2-6 placeholder | High | **Accept** | §4-6 — Override matrix 제거, preserve-source-overrides procedure로 대체 (use_figma 자동 추출 + 적용) |
| R2-F5: Group nodeId 모순 | Medium | **Accept** | §0.1 — feedCardsFrameNodeId / mainContentNodeId 분리, componentGroupNodeId = mainContentNodeId |
| R2-F6: R8 touch target 22×22 / 32×32 | Medium | **Accept** | §1-6, §2-6 — Component Contract Exceptions 기록 (사용자 approver) |

### Round 1 (회차 1)

| Finding | Severity | 결정 | 반영 위치 |
|---------|----------|------|-----------|
| F1: componentGroupNodeId "tbd" | High | **Accept** | §0.1 신설 — Composed SECTION (`20157:1250`) 자식 신규 FRAME `Feed Cards`. nodeId는 5-1 runtime 캡처. 모든 CreationDecision packet의 `componentGroupParentNodeId` 추가 |
| F2: Step 5-6 Completion Evidence 작성이 5-7 use site replacement 전 | High | **Accept** | §5 — 5-6을 Phase A(Per-Component Creation Evidence)로 변경, 5-7 use site replacement 후 5-8에서 Final Completion Evidence 작성 |
| F3: Feed Card use site override matrix 누락 | High | **Accept** | §4-6 신설 — 6-row override matrix |
| F4: Feed Addon Footer "spans" → 노드 매칭 문제 | Medium | **Accept** | §3-2 anatomy 재작성 — 5개 별도 TEXT 노드 (Actor Name / Suffix1 / Attendee Count / Suffix2 / Status). 각각 characters bind |
| F5: Lounge Card 531→375 resize 미검증 | Medium | **Accept** | §5 — 5-1.5 preflight gate 추가 |
| F6: Cross-run lounge inline Reaction Bar | Medium | **Debate** (3회 연속 영역) — 본 run 입장 재명시, lounge plan 침범 X | §7 재작성 — 명시적 hard rule + 사용자 결정 권장 |

## 9. Next Steps

1. → **04-plan-review.md**: peer review (Codex) — Creation Gate Evidence + componentPropertyDefinitions 적정성 검증
2. → **05-implementation.md**: 5-1 ~ 5-7 순차 실행, Completion Gate Evidence 패킷 작성
3. → **06-record.md**: SESSION/HANDOFF/CHANGELOG 업데이트, 커밋/푸시
