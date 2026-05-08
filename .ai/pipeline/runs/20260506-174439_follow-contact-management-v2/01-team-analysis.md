# Team Analysis

## Trigger

User asked to restart planning and implementation with `-lennyteam -play` after three valid critiques:

1. Contact invite list needs Korean alphabetical sorting (`ㄱ`, `ㄴ`, `ㄷ`...).
2. The previous implementation did not reuse existing CDS components or similar instances.
3. Section labels such as `팔로우할 수 있는 연락처` and `초대할 연락처` were not intuitive.

`-lennyteam` is not a registered hyphen command in the current command inventory, so this run applies Lenny Team Mode via `team-orchestrator` + `team-mode` and then executes the canonical `-play` flow.

## Current State

- Source Figma frame: `CS2ZhrORl4E1szQfTe2UvO/28237:37689` (`Follow Management Screen`, visually current `팔로우 추천`).
- Previous generated frames:
  - `28252:14022` `Contact Friends Screen`
  - `28252:14125` `Follow Management Screen - Pure Management`
- Figma audit found reusable CDS/similar instances:
  - `iOS StatusBar`: `28237:37690`
  - `Navbar`: `28237:37691`
  - `Input Group`: `28237:38156`
  - `Content Header`: `28237:38293`
  - `Avatar`: `28237:38432`
  - `Button`: `28237:38439`, `28237:43331`
  - `Invite Profile Card`: `25963:51271`
  - `TabsList Toggle` / `TabsList Tag`: page instances around `24112:24402`, `25963:51268`

## Lenny Team Discussion

### Product Leader

Framework: Product Strategy - start from the user problem, not the component.

The user is not trying to understand system eligibility (`팔로우할 수 있는 연락처`) or data source taxonomy (`초대할 연락처`). The task is:

- "연락처에서 이미 앱을 쓰는 사람을 찾고 팔로우한다."
- "아직 앱에 없는 연락처에는 초대한다."

Therefore the section labels should name the person group, not the action logic:

- Use `Challify에 있는 친구`
- Use `아직 가입하지 않은 연락처`

The label `초대할 친구` is shorter, but it hides why they are invite targets. The second label above is more self-explanatory in a contact-list context.

### Design Director

Framework: User-Centered Design + Design System Thinking.

The contact invite portion should follow the mental model of a phone contact list. A flat feed-style list is wrong here because the user expects scanning by name. The screen needs:

- Korean initial group headers (`ㄱ`, `ㄴ`, `ㅁ`, `ㅈ`, `A`)
- Optional right-side index rail for fast scan
- Search placeholder that matches contacts: `이름 또는 전화번호 검색`
- CDS reuse at the visible layer: status bar, navbar, search input, section headers, avatar/button instances, and profile-card/list-row instances where possible

The previous v1 looked visually okay but failed the design-system quality bar because it recreated common controls locally.

### Growth Expert

Framework: Growth Loop - contact discovery is an invite loop, not just a management utility.

The invite path should reduce hesitation:

- Existing app users: primary CTA `팔로우`
- Non-users: primary CTA `초대`
- Link invite: secondary persistent CTA `링크로 초대`

However, growth should not overwhelm the screen. The invite list must look like a controlled contact utility, not a spammy referral page. Sorting and clear labels make the invite action feel legitimate.

### QA Reviewer

The previous claim that the direction had been debated was not strong enough. For v2, gates must explicitly check the three user critiques:

- Contact sorting is visible.
- Reusable instances are present and not replaced by only local frames.
- Labels are understandable without explaining the backend state.

## Agreements

- Replace the existing two generated frames in place rather than adding more sibling frames.
- Contact screen IA:
  - `연락처 친구`
  - Search: `이름 또는 전화번호 검색`
  - Sync status: `연락처 연결됨`
  - Section: `Challify에 있는 친구`
  - Section: `아직 가입하지 않은 연락처`
  - Invite section grouped by initials and supported by a compact index rail
  - Bottom utility: `링크로 초대`
- Follow-management IA:
  - It remains a management utility, not a recommendation feed.
  - Keep `팔로잉/팔로워` tabs because both tabs represent management scopes.
  - Use clearer titles such as `내가 팔로우 중인 사람` and quick actions `피드에 덜 보기`, `팔로워 정리`.
- Component reuse is a hard gate, not a nice-to-have.

## Conflicts

- Product prefers `아직 가입하지 않은 연락처` for clarity.
- Growth would accept `초대할 친구` for CTA immediacy.
- Decision: use `아직 가입하지 않은 연락처` as the section label and keep `초대` as the row CTA. This separates audience naming from action wording.

## Recommendation

Rebuild the two existing frames in place as v2:

- Keep node IDs `28252:14022` and `28252:14125` as stable review links.
- Clear their previous local children and rebuild using cloned CDS/similar instances where available.
- Use local containers only as layout wrappers for composed rows/sections; visible controls must be CDS instances or cloned existing screen instances.

## Acceptance Gates

| Gate | Pass Criteria |
|---|---|
| G1 Contact sorting | Invite list visibly grouped by Korean initials and includes a compact index rail |
| G2 Clear labels | No `팔로우할 수 있는 연락처` / `초대할 연락처`; labels read as person groups |
| G3 CDS reuse | Screens contain cloned/reused instances of Navbar, Input Group, Content Header, Avatar, Button, and profile/list-row pattern where possible |
| G4 Follow management purity | No `추천/인기` feed in management screen |
| G5 Visual QA | Final screenshots show no clipping, hidden avatars, or overlap |
