# Peer Agent Review

| Field | Value |
|---|---|
| Target | codex |
| Mode | plan |
| Project | CDS |
| Repo | /Users/zenkim_office/Project/CDS |
| Git repo | yes |
| Branch | main |
| Created | 2026-05-08 14:04:46 KST |
| Exit code | 0 |
| Timeout seconds | 2700 |

## Request

Play run: /Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components
Review the implementation plan artifact for this play harness run.
Source artifact: /Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md

## Artifact Content

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
  componentGroupNodeId: "<runtime 캡처: 5-1 단계 신설 Feed Cards FRAME nodeId>",
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

### 1-3. componentPropertyDefinitions (F2 반영)

| key | type | default | bound to | 비고 |
|-----|------|---------|----------|------|
| `Liked#1` | BOOLEAN | false | `Heart Filled` instance `visible` | Heart Outline은 항상 visible, Filled는 토글로 overlay |
| `Like Count#2` | TEXT | "0" | `Like Count` text characters | 좋아요 수 |
| `Show Like Count#3` | BOOLEAN | true | `Like Count` text `visible` | 0 hide UX |
| `Reply Count#4` | TEXT | "0" | `Reply Count` text characters | 댓글 수 |
| `Show Reply Count#5` | BOOLEAN | true | `Reply Count` text `visible` | 0 hide UX |
| `Show Share#6` | BOOLEAN | true | `Right` frame `visible` | Share 노출 |

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
    approver: "user (사용자 결정 — 2026-05-08 Plan Review F6 Accept)",
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
  componentGroupNodeId: "<runtime 캡처: 5-1 단계 신설 Feed Cards FRAME nodeId>",
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
   └─ ↳ Slot Right [INSTANCE_SWAP slot, hug-content]
       └─ default: Button instance (32×32 icon-only or 62×32 text "더보기")
```

### 2-3. componentPropertyDefinitions (R4-F2 반영)

| key | type | default | bound to | 비고 |
|-----|------|---------|----------|------|
| `Name#1` | TEXT | "Name" | `Name` text characters | 댓글 작성자명 |
| `Show Name#2` | BOOLEAN | true | `Name` text `visible` | 익명/시스템 메시지 케이스 |
| `Description#3` | TEXT | "Description" | `Description` text characters | 댓글 본문 |
| `↳ Slot Right#4` | INSTANCE_SWAP | CDS Button (`Type=Tertiary, Size=Small, Icon Only`) | `↳ Slot Right` slot `mainComponent` | preferredValues: CDS `Button` ComponentSet |
| `Show Right Slot#5` | BOOLEAN | true | `↳ Slot Right` `visible` | Right Slot 자체 노출 토글 |

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
    approver: "user (사용자 결정 — 2026-05-08 Plan Review F6 Accept)",
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
  componentGroupNodeId: "<runtime 캡처: 5-1 단계 신설 Feed Cards FRAME nodeId>",
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

### 3-3. componentPropertyDefinitions (R3-F2 + R4 반영)

| key | type | default | bound to | 비고 |
|-----|------|---------|----------|------|
| `Actor Name#1` | TEXT | "김재현" | Actor Name span characters | 행위 주체 (SemiBold) |
| `Attendee Count#2` | TEXT | "여러명" | Attendee Count span characters | 참여자 수 표현 (SemiBold) |
| `Status#3` | TEXT | "좋아합니다." | Status text characters | 활동 동사구 |
| `Attendee Slot#4` | INSTANCE_SWAP | CDS `Avatar Group` (default 2 avatars 33×20) | `Attendee Slot` slot mainComponent | preferredValues: CDS `Avatar Group` |
| `Show Avatars#5` | BOOLEAN | true | `Attendee Slot` `visible` | Avatar 노출 토글 |

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
  componentGroupNodeId: "<runtime 캡처: 5-1 단계 신설 Feed Cards FRAME nodeId>",
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

> **Media Slot 추가 (F3)**: Feed Content Section을 단순 LOCAL frame이 아닌 INSTANCE_SWAP slot으로 변경. Default는 신규 placeholder `Feed Media Placeholder` (375×500, 이미지 fill 가능 frame component). 사용처에서 (a) 다른 image fill instance로 swap (b) Feed Media Placeholder의 image fill을 instance override로 변경 (c) video/multi-image variant component로 swap 가능.

> **신규 의존 컴포넌트 추가**: `Feed Media Placeholder` (375×500 frame with image fill, single component, 본 run에서 함께 생성). Tier 1 컴포넌트 4종에 더해 작은 helper component로 추가. 또는 단순한 frame이라 추가 컴포넌트 만들지 않고 Media Slot의 default를 비워두고 사용처에서 image fill을 직접 적용하는 방식도 가능. **결정**: 기존 4 컴포넌트 + Media Slot은 INSTANCE_SWAP slot으로만 두고 default는 빈 placeholder frame component (`Feed Media Placeholder`) 1개 추가 → 총 5 컴포넌트.

### 4-3. componentPropertyDefinitions (F3 Media Slot 추가)

| key | type | default | bound to | 비고 |
|-----|------|---------|----------|------|
| `Header Slot#1` | INSTANCE_SWAP | CDS Profile Card Horizontal Row | `Header Slot` mainComponent | 작성자 영역 |
| `Lounge Card Slot#2` | INSTANCE_SWAP | CDS Lounge Card 1Line | `Lounge Card Slot` mainComponent | Challenge context |
| `Show Lounge Card#3` | BOOLEAN | true | `Lounge Card Slot` `visible` | |
| `Media Slot#4` | INSTANCE_SWAP | 신규 `Feed Media Placeholder` 375×500 | `Media Slot` mainComponent | 미디어 영역, 사용처 swap |
| `Reaction Bar Slot#5` | INSTANCE_SWAP | 본 run Reaction Bar | `Reaction Bar Slot` mainComponent | |
| `Addon Footer Slot#6` | INSTANCE_SWAP | 본 run Feed Addon Footer | `Addon Footer Slot` mainComponent | |
| `Show Addon Footer#7` | BOOLEAN | true | `Addon Footer Slot` `visible` | |
| `Comment Slot 1#8` | INSTANCE_SWAP | 본 run Comment Item | `Comment Slot 1` mainComponent | |
| `Show Comment 1#9` | BOOLEAN | true | `Comment Slot 1` `visible` | |
| `Comment Slot 2#10` | INSTANCE_SWAP | 본 run Comment Item | `Comment Slot 2` mainComponent | |
| `Show Comment 2#11` | BOOLEAN | false | `Comment Slot 2` `visible` | default off, 6 use site 댓글 0~2 |

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

- [ ] 10개 prop 모두 PropertyReferenceMatrix PASS
- [ ] Show * BOOLEAN 토글이 visible 변경
- [ ] INSTANCE_SWAP slot이 nested swap 가능
- [ ] 6 use site 노드(24112:14976, 15039, 15087, 15135, 15182, 15231) 모두 본 컴포넌트 instance로 교체 가능

### 4-6. Use Site Replacement Procedure (F4 반영 — preserve-source-overrides)

> Codex 지적 합당: 6 use site의 모든 source value를 plan time에 추출해 표로 적는 것은 비효율 + 정확도 낮음. **대신 preserve-source-overrides procedure를 정의**해 5-7 단계에서 자동으로 source override를 신규 instance로 이전.

**Procedure (use_figma 5-7 단계 실행 시 각 use site에 대해)**:

```js
// Step 1: source 노드의 모든 text characters와 instance overrides 추출
const sourceNode = figma.getNodeById(sourceUseSiteId);
const sourceData = {
  // Header(Profile Card) text & instance overrides
  headerProfileCardOverrides: extractOverrides(sourceNode.findOne(n => n.name === "Profile Card" && n.parent.name === "Feed Header")),
  // Lounge Card text overrides
  loungeCardOverrides: extractOverrides(sourceNode.findOne(n => n.name === "Lounge Card")),
  // Reaction Bar Like/Reply count text 추출
  likeCount: sourceNode.findOne(n => n.name === "2" && n.parent.name === "Like Count" && /Like$/.test(n.parent.parent.name))?.characters,
  replyCount: sourceNode.findOne(n => n.name === "12" && n.parent.name === "Like Count" && /Reply$/.test(n.parent.parent.name))?.characters,
  // Addon Footer text 추출 (Actor, Count, Status)
  addonFooter: extractAddonFooterText(sourceNode.findOne(n => n.name === "Feed Addon Footer")),
  // Comment 1 / Comment 2 (Item nodes) 추출
  comments: sourceNode.findAll(n => n.name === "Item" && n.parent.name === "Feed Footer")
                     .map(item => ({
                       name: item.findOne(c => c.type === "TEXT" && c.parent.name === "Item")?.characters,
                       description: item.findOne(c => c.parent.name === "Description Slot")?.characters,
                       rightSlotInstance: item.findOne(c => c.name === "↳ Slot Right")?.children?.[0],
                     })),
  // Feed Content Section media (image fills 추출)
  mediaFills: extractImageFills(sourceNode.findOne(n => n.name === "Feed Content Section")),
};

// Step 2: 신규 Feed Card instance 생성 후 sourceNode 자리에 삽입
const newInstance = feedCardComponent.createInstance();
sourceNode.parent.insertChild(sourceNode.parent.children.indexOf(sourceNode), newInstance);

// Step 3: source overrides 적용
applyOverrides(newInstance, sourceData);

// Step 4: source 노드 archive (즉시 삭제 X — 일단 비교용 보관)
sourceNode.x += 500; // visual diff용 옆으로 이동
// 또는 별도 archive 페이지로 이동

// Step 5: screenshot before/after 캡처 + visual diff
// Step 6: intentional deltas 기록 (Phosphor→Lucide reply icon, height 변화 등)
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

## 5. 작업 순서 (Implementation Sequence — F1/F2/F5 반영)

| Step | 작업 | 산출 |
|------|------|------|
| **5-1** | CDS file `H36eNEd6o7ZTv4R7VcyLf2` write 권한 확인. Composed SECTION (`20157:1250`) 자식으로 신규 FRAME `Feed Cards` 생성 (Lounge Cards sibling), 내부에 `.Utility / Title` + `Main content` 서브 frame 배치 | `feedCardsFrameNodeId` + `mainContentNodeId` 확정 |
| **5-1.5** | **Creation Gate Evidence finalize (F1)** — 4 컴포넌트(+Media Placeholder) 각각의 `CreationDecision` packet에 5-1 캡처 nodeId(`componentGroupNodeId = mainContentNodeId`) 채워 넣고 `05-implementation.md` Phase A에 작성. **이 단계 통과 전에는 어떤 컴포넌트도 생성하지 않는다**. | Creation Gate Evidence 5종 |
| **5-1.7** | **Lounge Card 375 preflight gate (F5)** — CDS Lounge Card (`d0b2a310...`) State=1Line 인스턴스를 Feed Cards group 임시 위치에 instantiate, `width=375` 설정 후 visual probe. PASS시 Lounge Card Slot default로 사용. FAIL시 (a) default 변경 또는 (b) 별도 작업 분리하고 Feed Card 진행 중단 | preflight 결과 (PASS/blocked) |
| **5-2** | **Feed Media Placeholder** 컴포넌트 생성 (5번, single component, 375×500 frame with image fill) — 단일 노드, 의존성 없음 | Feed Media Placeholder component node + key |
| **5-3** | **Reaction Bar** 컴포넌트 생성 (1번) — anatomy 빌드 (Heart Outline + Heart Filled overlay), 6 prop 정의, instanceOverrideProbe(Liked true/false 양쪽) / responsiveProbe / longTextProbe / boundsCheck 4종 실행 | Reaction Bar component + key + probe evidence |
| **5-4** | **Comment Item** 컴포넌트 생성 (2번) — anatomy 빌드, 5 prop 정의, 4종 probe 실행 | Comment Item component + key + probe evidence |
| **5-5** | **Feed Addon Footer** 컴포넌트 생성 (3번) — 5 TEXT 노드 anatomy 빌드, 5 prop 정의, 4종 probe 실행 | Feed Addon Footer component + key + probe evidence |
| **5-6** | **Feed Card** 컴포넌트 생성 (4번) — anatomy 빌드 + 5-3/5-4/5-5/5-2 nested instance 배치, 11 prop 정의, 4종 probe 실행 (nested INSTANCE_SWAP swap probe 포함) | Feed Card component + key + probe evidence |
| **5-7** | **Use Site Replacement (preserve-source-overrides procedure)** — Feed Screen 6 Feed Card use site에 §4-6 procedure 적용. CDS publish + 제품 파일 library update 필요 시 사용자 unblock 요청. 막히면 `useSiteReplacement: blocked` + unblock 트리거 기록 | 6 use site per-card source extraction + replacement + before/after screenshot |
| **5-8** | **Final Completion Evidence Packet** — useSiteReplacement 결과 포함 full CompletionEvidence 패킷 작성: sourceScreenshot, componentScreenshot, visualDiffSummary, propertyIntegrity, propertyReferenceMatrix, instanceOverrideProbe, useSiteReplacement(pass/fail/blocked), intentionalDeltas, layoutContract, tokenBindingSummary, responsiveProbe, longTextProbe, boundsCheck, exceptions(R8 hit area) | `05-implementation.md` Phase B 섹션 |

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

## 8.1 Plan Review Round 2 Findings 반영 요약

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

## Context

### Git Status

```
?? .ai/pipeline/runs/20260508-131502_feed-screen-new-components/
?? .ai/pipeline/runs/20260508-132749_lounge-update-item-component/
?? meetings/2026-05-08_lounge-updates-reply-preview-component-decision.md
?? reviews/2026-05-08_lounge-update-item-component-director.md
```

### Diff Stat

```
(no unstaged diff stat)
```

## Peer Result

### Peer Review Verdict
- Result: FAIL
- Confidence: high

### Findings
| Severity | File/Area | Issue | Recommendation |
|---|---|---|---|
| High | [03-plan.md:496](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:496), [component-contract.md:7](/Users/zenkim_office/Project/CDS/.claude/rules/component-contract.md:7) | Step 5-1 creates Figma frames before Creation Gate finalization, but the contract requires Creation Gate before Figma mutation. | Make 5-1 read-only only. Finalize gate evidence before any frame/component creation, or add an explicit gated decision for group-frame creation. |
| High | [03-plan.md:64](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:64) | `componentGroupNodeId` placeholders still say “Feed Cards FRAME nodeId,” while §0.1 says it must be `mainContentNodeId`. | Update all CreationDecision packets to use `mainContentNodeId` consistently. |
| High | [03-plan.md:13](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:13), [03-plan.md:373](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:373) | Plan expands scope from 4 to 5 components with `Feed Media Placeholder`, but it lacks its own CreationDecision, anatomy acceptance, probes, and completion evidence. | Either remove the helper component or add full gate/evidence/test coverage for it. |
| High | [03-plan.md:457](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:457) | Use-site replacement leaves the original source node in place and moves `x += 500`; in Auto Layout this can duplicate cards or corrupt product layout. | Capture before screenshots first, insert/test replacement in a safe temp context, then replace or archive source outside the product layout before final evidence. |
| High | [03-plan.md:431](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:431) | Preserve-source-overrides procedure is too brittle: hardcoded count names (`"2"`, `"12"`), local Lounge Card handling, comment selectors, and media fill transfer are underspecified. | Define a concrete extraction/apply schema per slot and block replacement when required fields cannot be matched. |
| Medium | [03-plan.md:102](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:102), [qa-rubric.md:115](/Users/zenkim_office/Project/CDS/.claude/rules/qa-rubric.md:115), [naming-policy.md:108](/Users/zenkim_office/Project/CDS/.claude/rules/naming-policy.md:108) | Property/layer names include internal `#` suffixes, `Liked` lacks `Show/Is/Has`, and `↳ Slot Right` uses a prohibited special character. | Separate intended display names from runtime Figma API keys; rename to policy-safe names like `Is Liked`, `Right Slot`, `Show Right Slot`. |
| Medium | [03-plan.md:141](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:141), [03-plan.md:544](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:544) | R8 exceptions claim `user` approval while the open questions still say approval is needed; 38px/32px rows also cannot truly provide 44px vertical hit geometry without changing layout. | Do not mark approver until granted. Get a user decision or change the component heights/hit-target model. |
| Medium | [03-plan.md:422](/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260508-131502_feed-screen-new-components/03-plan.md:422) | Feed Card acceptance says “10 props” but the table defines 11. | Fix the acceptance count and require all 11 properties in the PropertyReferenceMatrix. |

### Test And Acceptance Notes
- Read-only review only. Inspected `03-plan.md`, `01-team-analysis.md`, `component-contract.md`, `qa-rubric.md`, `naming-policy.md`, and `git status`.
- No implementation tests or Figma mutations were run.
- Missing before implementation: Creation Gate before any mutation, Media Placeholder gate coverage, PropertyReferenceMatrix, cleanup-safe probes, token binding audit, Lounge Card 375 preflight, and per-use-site before/after screenshots with no duplicate source nodes.

### Follow-Up For Requesting Agent
- Do not implement this plan yet.
- Revise `03-plan.md` to address the High findings first, especially gate sequencing, Media Placeholder evidence, group node consistency, and use-site replacement safety.
- Get the explicit user decision for R8 touch-target exceptions before marking those exceptions approved, then rerun plan review.
