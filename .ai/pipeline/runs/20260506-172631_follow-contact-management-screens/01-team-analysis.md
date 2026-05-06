# Team Analysis

- **Date**: 2026-05-06
- **Mode**: `-play` controller analysis + `-director` gates
- **Request**: Design two Figma screens from the current `팔로우 추천` screen:
  1. `연락처 친구` more/detail screen
  2. `팔로우 관리` screen
- **Target Figma**: `CS2ZhrORl4E1szQfTe2UvO/28237:37689`
- **Current baseline**: frame name `Follow Management Screen`, visual title `팔로우 추천`, first section `당신을 위한 추천`.

## Current State

The latest product direction differs from the older PRD wording:

- `팔로우 추천` is the canonical discovery screen.
- `연락처 친구` is a top-level section inside `팔로우 추천`.
- `연락처 친구 > 더보기` should expose a deeper contact context: followable contacts, inviteable contacts, and contact-sync state.
- `팔로우 관리` remains a separate utility screen for existing relationships.
- Component production is explicitly deferred until design direction is fixed.

## Roles

### Product Leader

Use the user-problem framework:

- `연락처 친구 더보기`: solve "which people from my contacts can I follow or invite?"
- `팔로우 관리`: solve "which existing relationships should I review, mute, unfollow, or remove?"

Keep the jobs separate. Do not turn contact detail into relationship management, and do not turn management into a recommendation feed.

### Design Director

Use design quality/accessibility criteria:

- Reuse existing screen density, typography, navbar, search, avatar, and button language.
- Use list rows, not decorative cards.
- Make destructive/management actions visually quieter than follow actions.
- Keep touch target intent clear even when visual buttons are 32px.

### Growth Expert

Use growth loop framing:

- Contact detail should preserve growth actions: follow and invite.
- Management should preserve trust and control but not compete with discovery.
- Do not add bulk follow in this iteration; it changes the behavioral surface.

### Data Scientist

Use metric definition:

- Contact detail primary metrics: contact sync rate, contact follow rate, invite send rate.
- Management primary metrics: search success, hide/unfollow/remove completion time.
- Guardrails: accidental unfollow/remove, post-follow immediate unfollow, recommendation dismiss rate.

## Recommendation

Build two screens next to the current `팔로우 추천` screen:

1. `Contact Friends Screen`
   - Title: `연락처 친구`
   - Search placeholder: `연락처 친구를 검색해보세요`
   - Top notice/CTA: contacts connected state with privacy reassurance.
   - Section 1: `팔로우할 수 있는 연락처`
   - Section 2: `초대할 연락처`
   - Optional bottom CTA: `초대 링크 공유`

2. `Follow Management Screen`
   - Title: `팔로우 관리`
   - Right action: `UserPlus` / `사람 추가`
   - Search placeholder: `이름으로 검색`
   - Two tabs allowed only because both relationship lists are meaningful: `팔로잉`, `팔로워`
   - Default selected: `팔로잉`
   - Rows: existing relationships with quiet management action (`소식 숨김`, `팔로우 끊기`, `삭제`, overflow).

## Scope

In scope:

- Figma screen creation.
- Use existing Figma patterns and primitives from the current frame.
- Add review/run records.

Out of scope:

- Creating CDS composed components.
- Publishing library updates.
- Implementing prototype links.
- Updating app code.

## Risks

- Figma local frames may not be canonical CDS instances yet.
- Previous PRD uses `친구 찾기`; this run intentionally follows the later `팔로우 추천` decision.
- Visual-only 32px icon/action buttons require implementation-level 44px hit targets later.
