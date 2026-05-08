# 05 — Implementation: Feed Screen Use Site Replacement

> Date: 2026-05-08
> Product file: `CS2ZhrORl4E1szQfTe2UvO` (2026-05)
> Run: `20260508-144125_feed-screen-use-site-replacement`

## A. Pre-flight

| 항목 | 결과 |
|------|------|
| Feed Card 컴포넌트 publish | ✅ 사용자 확인 |
| 제품 파일에서 Feed Card import | ✅ `28449:1622` (10 props 정상 노출) |
| Source state | ✅ 6 frames 그대로, archive page 미존재 (clean) |

## B. Archive Page

신규 PAGE 생성: `_Archive Feed Screen 2026-05-08` — id `28452:1633`

## C. Replacement 결과 — 6/6 PASS

| # | Source ID | New Instance ID | Profile name | Lounge title | Like / Reply | Comments | Errors |
|---|-----------|-----------------|--------------|--------------|--------------|----------|--------|
| 1 | `24112:14976` | `28452:1811` | 김영재 / 7시간 전 | 심으뜸의 작심 3주 다이어트 | 2 / 12 | 김영재(text 더보기) + 김예인(icon heart) | 0 |
| 2 | `24112:15039` | `28452:2457` | 김영재 / 7시간 전 | 매일 30분 존투 러닝 | 2 / 12 | 이연우(icon heart) | 0 |
| 3 | `24112:15087` | `28452:2749` | 김지연 / 2026년 3월 31일 | 매일 30분 존투 러닝 | 2 / 12 | 김지영(icon heart) | 0 |
| 4 | `24112:15135` | `28452:3056` | 김주환 / 2026년 3월 31일 | 매일 30분 내부감각 훈련 | 2 / 12 | 김주환(text 더보기) | 0 |
| 5 | `24112:15182` | `28452:3356` | 강민경 / 2026년 3월 31일 | 강민경과 3주 키토 다이어트 | 2 / 12 | 강민경(icon heart) | 0 |
| 6 | `24112:15231` | `28452:3659` | sara_nagase / 2026년 3월 31일 | 비비드키친과 4주 저당 샐러드 아침 | 2 / 12 | sara_nagase(icon heart) | 0 |

> 모든 source는 `_Archive Feed Screen 2026-05-08` 페이지로 이동 (Auto Layout escape 안전).

## D. Preserve-Source-Overrides 적용 항목

각 use site에 적용한 nested override:

### Header Slot (Profile Card 인스턴스)
- Avatar `fills` 직접 적용 (image hash + transform 보존)
- Name TEXT characters 적용
- Date TEXT characters 적용

### Lounge Card Slot (CDS Lounge Card State=1Line 인스턴스)
- `Title#...` componentProperty 적용
- Challenge Thumbnail `fills` 직접 적용 (image hash + transform 보존)

### Reaction Bar Slot (신규 Reaction Bar 인스턴스)
- `Like Count#...` 적용
- `Reply Count#...` 적용

### Addon Footer Slot (신규 Feed Addon Footer 인스턴스)
- `Actor Name#...` (source prefix "...님 외"에서 suffix strip하여 추출)
- `Attendee Count#...` (source "...이"에서 suffix strip하여 추출)
- `Status#...` 적용

### Comment Slot 1 / Comment Slot 2 (신규 Comment Item 인스턴스)
- `Show Comment 2`: data.items.length >= 2 시 true
- `Name#...` 적용
- `Description#...` 적용
- Right Slot Type=Ghost Size=Icon-Small (icon heart)인 경우:
  - Right Slot INSTANCE_SWAP을 icon-small variant로 swap
  - Inner `Icon-Only#...` prop을 Lucide heart로 swap

## E. Visual Evidence

- Before: 이전 run `feed-cards-group.png` (CDS 컴포넌트 그룹), 제품 파일은 직전 상태와 동일
- After: `exports/2026-05-08_feed-cards-cds/feed-screen-after-replacement.png` (Feed Screen 24112:14935 전체)

## F. CompletionEvidence Packet

```ts
{
  sourceNodeId: "<6 use sites>",
  componentNodeId: "1a348920b824461793300098c74f832f20f758b7",
  componentGroupPath: "Components > Composed > Feed Cards > Main content",
  useSiteReplacement: "pass", // 6/6
  intentionalDeltas: [
    "Phosphor `chat-centered-dots` → Lucide `message-circle-more` (Reaction Bar default)",
    "Heart Filled overlay (red color)",
    "Item 1 더보기 Right Slot 그대로, Item 2 icon heart는 INSTANCE_SWAP swap"
  ],
  archivePageId: "28452:1633",
  preservedOverrides: ["Avatar image fills", "Challenge Thumbnail image fills", "Profile Name/Date", "Lounge Title", "Reaction Like/Reply count", "Addon Actor/Count/Status", "Comment Name/Description"],
  blockedItems: [],
  exceptions: [
    "Archive page contains 6 source frames for visual diff reference (not deleted)",
    "Lounge Card 자연 height 196 vs 원본 Local frame 96 — visual delta 가능 (height drift). 사용자 확인 필요"
  ],
}
```

## G. 주의사항

1. **Lounge Card height drift 가능성**: 원본 LOCAL frame Lounge Card는 96px이었으나 CDS Lounge Card State=1Line은 자연 196px. Feed Card 내부 Lounge Card Slot resize 또는 Lounge Card 자체 width contract 보강이 필요할 수 있음. 시각 검증 필요.
2. **Addon Footer suffix strip 휴리스틱**: source "김재현님 외"에서 "김재현"을 추출하기 위해 정규식으로 suffix 제거. 일부 use site는 다른 형태("232K가" / "여러명이") 가질 수 있음 — visual diff에서 어색한 결과 시 후속 수정 필요.
3. **Archive page**: source 6 frames 보존되어 있으므로 사용자 검토 후 삭제 가능.
