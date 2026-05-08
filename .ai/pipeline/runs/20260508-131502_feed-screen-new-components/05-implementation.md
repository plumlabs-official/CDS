# 05 — Implementation: Feed Screen 신규 CDS 컴포넌트

> Source: `03-plan.md` (controller fallback 후 진행)
> Date: 2026-05-08
> CDS file: `H36eNEd6o7ZTv4R7VcyLf2`

---

## Phase A — Creation Gate Evidence (Pre-Mutation)

### A-0. Read-only Verification (Step 5-1) ✅

| 항목 | 결과 | nodeId / key |
|------|------|--------------|
| CDS file 접근 | OK | `H36eNEd6o7ZTv4R7VcyLf2` |
| Composed SECTION | 확인 | `20157:1250` |
| Profile Card ComponentSet | 확인 | `21719:5940` / `43c74e269ea710c0f8f02a7a7eb63f09aa742b97` |
| Lounge Card ComponentSet | 확인 | `21719:6104` / `d0b2a310464d91f2e2729f8a41412bb389932c7e` |
| Avatar / Avatar Group / Button | 확인 | `21719:4755` / `20087:31019` / `20012:238` |
| Lucide heart / share / message-circle-more | 확인 | `20013:1683` / `20013:2597` / `20013:1985` |

### A-1. Group FRAME 생성 (Step 5-1.6) ✅

| 노드 | id | 위치 |
|------|----|----|
| Feed Cards (외부 wrapper) | `21721:6809` | Composed SECTION (`20157:1250`) 자식, Lounge Cards sibling |
| .Utility / Title (도큐멘테이션) | `21721:6810` | Feed Cards 자식 |
| **Main content (component append parent)** | `21721:6812` | Feed Cards 자식 |

> 모든 CreationDecision packet의 `componentGroupNodeId` = `21721:6812`

### A-2. Lounge Card 375 Preflight (Step 5-1.7) ✅ PASS

| 항목 | 값 |
|------|----|
| Probe id | `21721:8261` |
| Lounge Card 자연 크기 | 531×196 |
| Resize 결과 | 375×196 (height 유지) |
| layoutMode | VERTICAL |
| Verdict | **PASS** — Feed Card Lounge Card Slot default로 사용 가능 |

---

## Phase B — Component Creation & Probes (Steps 5-2 ~ 5-5) ✅

### B-1. Reaction Bar (Step 5-2) ✅

| 항목 | 값 |
|------|----|
| Component id | `21723:2908` |
| Component key | `1065b60af9b20c02d5c47a80e1e4b3475d368e5c` |
| Size | 375×38 |
| Anatomy | HORIZONTAL space-between, padding 16x 8y. Left(Like Action + Reply Action) / Right(Share). Like Action에 Heart Container(22×22) with Heart Outline + Heart Filled overlay 패턴 (R3 F2 반영) |
| Properties | 6개 (모두 정상 추가) |
| Probe — Liked=true, Like=999, Reply=1.2K | heartFilledVisible=**true** ✅, likeCountChars="999" ✅, replyCountChars="1.2K" ✅ |
| Probe — Show Share=false | rightVisible=**false** ✅ |

componentPropertyDefinitions:
- `Is Liked#21723:0` (BOOLEAN, default false) → Heart Filled visible
- `Like Count#21723:1` (TEXT, default "0") → Like Count Text characters
- `Show Like Count#21723:2` (BOOLEAN, default true) → Like Count frame visible
- `Reply Count#21723:3` (TEXT, default "0") → Reply Count Text characters
- `Show Reply Count#21723:4` (BOOLEAN, default true) → Reply Count frame visible
- `Show Share#21723:5` (BOOLEAN, default true) → Right frame visible

### B-2. Comment Item (Step 5-3) ✅ (with INSTANCE_SWAP 한계)

| 항목 | 값 |
|------|----|
| Component id | `21725:2939` |
| Component key | `f2d39007910743ce240c9f8591ab766d2a9dcec3` |
| Size | 343×32 |
| Anatomy | HORIZONTAL gap=10, items-center. Name (TEXT SemiBold) + Item content(FILL with Description Slot) + Right Slot (Button instance Type=Default, State=Enabled, Size=Icon-Small, 32×32) |
| Properties | 4개 (Name, Show Name, Description, Show Right Slot). **INSTANCE_SWAP "Right Slot" prop은 Figma plugin API 호환 이슈로 추가 실패** — Right Slot은 nested Button instance로 두고 use site에서 직접 swap |
| Probe — long Description | nameChars="김영재" ✅, descChars="오늘 노을 정말 멋졌어요…매우 긴 텍스트로 ellipsis 검증을 위한 추가 문장 입력" ✅ (textTruncation=ENDING) |
| Probe — Show Name=false, Show Right Slot=false | nameVisible=**false** ✅, rightSlotVisible=**false** ✅ |

componentPropertyDefinitions:
- `Name#21725:0` (TEXT, default "Name") → Name text characters
- `Show Name#21725:1` (BOOLEAN, default true) → Name visible
- `Description#21725:2` (TEXT, default "Description") → Description text characters
- `Show Right Slot#21725:3` (BOOLEAN, default true) → Right Slot visible

> **알려진 한계 (Implementation Note)**: INSTANCE_SWAP `Right Slot` property는 Figma plugin API의 `addComponentProperty(name, "INSTANCE_SWAP", key)` 호출이 "Property value is incompatible with component property type" 에러를 반환. 로컬 vs 라이브러리 키 호환 이슈로 추정. Right Slot은 component child Button 인스턴스로 유지되어 사용처에서 instance level swap (Figma UI: Right click → Swap component / 또는 plugin API: instance.swapComponent) 가능. 차후 별도 이슈로 INSTANCE_SWAP 가능 여부 재시도.

### B-3. Feed Addon Footer (Step 5-4) ✅

| 항목 | 값 |
|------|----|
| Component id | `21726:2953` |
| Component key | `3a4eb5a7dac4d1234cc5ee13e13aebcfd2e8d5a5` |
| Size | 343×36 |
| Anatomy | VERTICAL padding 8y. Description row(HORIZONTAL gap=4): Attendee Slot(Avatar Group instance) + Actor Name(SemiBold) + Suffix1("님 외 " Regular) + Attendee Count(SemiBold) + Suffix2("이 " Regular) + Status(Regular FILL ellipsis). 5개 별도 TEXT 노드 (R3 F2 반영) |
| Properties | 4개 |
| Probe — long Actor Name + Status, Avatar hidden | actorChars="김재현이라는매우긴이름" ✅, countChars="1,234명" ✅, statusChars="좋아하고 댓글도 남겼습니다 그리고 매우 긴 텍스트" ✅, attendeeVisible=**false** ✅ |

componentPropertyDefinitions:
- `Actor Name#21726:0` (TEXT, default "김재현") → Actor Name characters
- `Attendee Count#21726:1` (TEXT, default "여러명") → Attendee Count characters
- `Status#21726:2` (TEXT, default "좋아합니다.") → Status characters
- `Show Avatars#21726:3` (BOOLEAN, default true) → Attendee Slot visible

### B-4. Feed Card (Step 5-5) ✅ (with INSTANCE_SWAP 한계)

| 항목 | 값 |
|------|----|
| Component id | `21732:3062` |
| Component key | `1a348920b824461793300098c74f832f20f758b7` |
| Size | 375×858 |
| Anatomy | VERTICAL gap=8. Feed Header(Profile Card instance) + Feed Contents(Lounge Card instance + Feed Content Section 375×500 image fill placeholder + Reaction Bar instance) + Feed Footer(Feed Addon Footer instance + Comment Slot 1 + Comment Slot 2 hidden default) |
| Properties | 4개 (Show * BOOLEAN). **INSTANCE_SWAP slot props (Header / Lounge Card / Reaction Bar / Addon Footer / Comment 1/2)는 동일한 API 호환 이슈로 미추가** — nested instances를 use site에서 직접 swap |
| Probe — minimal (모두 hide) | loungeVis=**false** ✅, addonVis=**false** ✅, c1Vis=**false** ✅, c2Vis=**false** ✅ |
| Probe — full (모두 show) | loungeVis=**true** ✅, c2Vis=**true** ✅ |

componentPropertyDefinitions:
- `Show Lounge Card#21732:0` (BOOLEAN, default true) → Lounge Card Slot visible
- `Show Addon Footer#21732:1` (BOOLEAN, default true) → Addon Footer Slot visible
- `Show Comment 1#21732:2` (BOOLEAN, default true) → Comment Slot 1 visible
- `Show Comment 2#21732:3` (BOOLEAN, default false) → Comment Slot 2 visible

> **알려진 한계 (Implementation Note)**: 6개 INSTANCE_SWAP slot props 미추가. nested instances는 직접 swap 가능 (Figma UI 또는 plugin API).

### B-5. Visual Evidence

- 그룹 스크린샷: `exports/2026-05-08_feed-cards-cds/feed-cards-group.png` (Feed Cards FRAME `21721:6809` 전체)

---

## Phase C — Use Site Replacement (Step 5-7) — BLOCKED

**상태**: `useSiteReplacement: blocked`

**원인**: 신규 4 컴포넌트는 CDS 파일(`H36eNEd6o7ZTv4R7VcyLf2`)에 LOCAL 컴포넌트로 생성됨. 제품 파일(`CS2ZhrORl4E1szQfTe2UvO`)에서 instance로 사용하려면:
1. **CDS 파일 publish** (사용자 액션 필요 — Figma plugin API에서 publish 트리거 불가)
2. **제품 파일 라이브러리 업데이트** (사용자 액션)
3. 그 후 6개 use site 교체 가능

**Unblock Trigger** (사용자 작업 필요):
1. CDS 파일에서 신규 4 컴포넌트 + 그룹 publish (Figma 우상단 Publish 버튼)
2. 제품 파일에서 라이브러리 업데이트 prompt 수락
3. 작업 재개 시 본 run의 Phase C 절차에 따라 6 use site preserve-source-overrides 실행

**대상 use sites** (제품 파일 `CS2ZhrORl4E1szQfTe2UvO`):
- `24112:14976` (Feed #1)
- `24112:15039` (Feed #2)
- `24112:15087` (Feed #3)
- `24112:15135` (Feed #4)
- `24112:15182` (Feed #5)
- `24112:15231` (Feed #6)

---

## Phase D — Final Completion Evidence

### D-1. Component Status Summary

| # | Component | Status | Probes | INSTANCE_SWAP |
|---|-----------|--------|--------|---------------|
| 1 | Reaction Bar | ✅ Created | PASS (Liked overlay + Show Share) | N/A |
| 2 | Comment Item | ✅ Created | PASS (Show Name/Description/Right Slot) | ⚠ skipped — API 호환 이슈 |
| 3 | Feed Addon Footer | ✅ Created | PASS (TEXT 5종 + Show Avatars) | N/A |
| 4 | Feed Card | ✅ Created | PASS (4 BOOLEAN show/hide) | ⚠ skipped — 동일 이슈 |

### D-2. CompletionEvidence Packet (component-contract.md schema)

```ts
const completionEvidence = {
  sourceNodeId: "24112:14976", // 대표 use site
  componentNodeId: "21732:3062",
  componentGroupPath: "Components > Composed > Feed Cards > Main content",
  sourceScreenshot: "exports/2026-05-08_feed-cards-cds/feed-cards-group.png",
  componentScreenshot: "(동일 파일)",
  visualDiffSummary: "신규 컴포넌트 그룹 생성. 사용처 비교는 Phase C unblock 후 작성.",
  propertyIntegrity: "pass", // Reaction Bar 6/6, Comment Item 4/4, Feed Addon Footer 4/4, Feed Card 4/4 properties 노드 매칭 정상
  propertyReferenceMatrix: {
    reactionBar: { pass: true, count: 6 },
    commentItem: { pass: true, count: 4, note: "INSTANCE_SWAP Right Slot 미추가 (API 한계)" },
    feedAddonFooter: { pass: true, count: 4 },
    feedCard: { pass: true, count: 4, note: "INSTANCE_SWAP slot props 미추가 (API 한계)" },
  },
  instanceOverrideProbe: {
    reactionBar: "PASS (Liked true/false, count override 4종 모두)",
    commentItem: "PASS (Name/Description/Show Name/Show Right Slot)",
    feedAddonFooter: "PASS (3 TEXT + Show Avatars)",
    feedCard: "PASS (4 BOOLEAN show/hide)",
  },
  useSiteReplacement: "blocked",
  useSiteReplacementBlockReason: "CDS publish + product file library update 사용자 액션 필요",
  intentionalDeltas: [
    "Phosphor `chat-centered-dots` → Lucide `message-circle-more` reply icon (R7 정합)",
    "Heart Filled overlay (red color) — Plan F2 Liked overlay 모델 구현",
    "Comment Item Right Slot은 nested instance (parent INSTANCE_SWAP prop 미추가)",
    "Feed Card slots 모두 nested instance (parent INSTANCE_SWAP prop 미추가)",
  ],
  layoutContract: {
    rootAutoLayout: true, // 모든 4 컴포넌트 root layoutMode set
    structuralAutoLayout: true,
    textFill: "Description / Status FILL with ellipsis 적용",
    rightActionRow: true, // Reaction Bar Right frame Auto Layout
  },
  tokenBindingSummary: {
    note: "디자인 토큰 (text 색상, font-family) 바인딩은 Phase E (별도 작업)에서 진행. 현재는 raw text 노드로 생성. R6 audit는 publish 후 별도 진행.",
  },
  responsiveProbe: "PASS (Reaction Bar/Feed Addon Footer FILL 적용, Feed Card 375 fixed)",
  longTextProbe: {
    commentItem: "PASS — Description ellipsis 처리 확인",
    feedAddonFooter: "PASS — Status ellipsis 처리 확인",
  },
  boundsCheck: "PASS (Reaction Bar 38px, Feed Addon Footer 36px, Comment Item 32px, Feed Card 858px auto height)",
  exceptions: [
    {
      ruleId: "qa-rubric.R8.touch-target",
      nodeId: "Reaction Bar Like/Reply/Right actions",
      reason: "Visible icon 22×22 + Reaction Bar height 38px 제약. Implementation 단계 invisible padding 보정.",
      approver: "user (명시 승인 2026-05-08 Plan Review Round 3)",
      revisit: "Reaction Bar height 44px+ 디자인 결정 시",
    },
    {
      ruleId: "qa-rubric.R8.touch-target",
      nodeId: "Comment Item Right Slot Button (32x32)",
      reason: "CDS Button Size=Icon-Small 표준 32×32 + Comment Item row height 32px. Implementation 단계 6px invisible padding으로 44 보정.",
      approver: "user (명시 승인 2026-05-08 Plan Review Round 3)",
      revisit: "Comment Item row height 44px+ 디자인 결정 시",
    },
    {
      ruleId: "component-contract.componentPropertyDefinitions.INSTANCE_SWAP",
      nodeId: "Comment Item Right Slot, Feed Card 6 slots",
      reason: "Figma plugin API addComponentProperty INSTANCE_SWAP 호출이 'Property value is incompatible with component property type' 에러로 미동작. nested instance level swap으로 대체.",
      approver: "PENDING USER REVIEW",
      revisit: "Figma plugin API 호환 issue 해결 또는 manual 적용 검토",
    },
  ],
  finalHandoffStatus: "PARTIAL — Components created with probes pass; useSiteReplacement BLOCKED pending user publish",
};
```

### D-3. Next Steps (사용자 액션)

1. **CDS 파일 publish** — 신규 Feed Cards 그룹 + 4 컴포넌트
2. **제품 파일 library update**
3. Phase C use site replacement 재개 (별도 run 또는 본 run continuation)
4. INSTANCE_SWAP API 호환 이슈 별도 조사 (현재는 nested instance level swap으로 운용 가능)
5. Lounge Update Item run의 Reaction Bar 충돌 정리 (사용자 결정)
