# Plan

- Date: 2026-05-06
- Decision: Adopt asymmetric navigation between `팔로우 관리` and `친구 찾기`
- Basis: Team analysis PASS from Claude peer review, with low-severity refinements incorporated

## Recommended Product Direction

Use `Option A + Option D`.

1. `팔로우 관리` 화면에는 우측 상단 `사람 추가` 아이콘을 둔다.
2. 해당 아이콘은 `친구 찾기` 화면으로 이동한다.
3. `친구 찾기` 화면에는 `팔로우 관리` 버튼을 두지 않는다.
4. `친구 찾기` 화면에는 팔로잉 친구 preview 리스트도 두지 않는다.
5. 이미 팔로우 중인 친구 정보는 추천 카드 내부 social proof로만 활용한다.
6. `팔로우 관리`는 프로필 팔로워/팔로잉 수, 설정, row overflow에서 접근하게 한다.

## UX Specification

### Friend Discovery Screen

Canonical display name:

- `친구 찾기`

Purpose:

- 사용자가 피드와 라운지에서 볼 사람을 찾고 팔로우/초대하게 한다.

Primary actions:

- 팔로우
- 초대
- 연락처 연결
- dismiss/hide recommendation

Navigation:

- No top-right `팔로우 관리` button.
- No `팔로잉 친구` preview section.
- Optional top-right actions must support discovery only, such as invite, contacts, or search.

Recommended sections:

- 연락처에서 찾은 친구
- 함께 아는 친구
- 추천 친구
- 인기 친구 / 추천 크리에이터
- 친구 초대

Metadata hierarchy:

1. Mutual/social proof: `김예인님 외 3명이 팔로우`
2. Source: `연락처에서 찾음`, `같은 챌린지 참여`
3. Follower count only for popular/creator contexts

### Follow Management Screen

Purpose:

- 사용자가 기존 관계를 검색, 정리, 숨기기, 끊기, 삭제할 수 있게 한다.

Primary actions:

- 소식 숨기기
- 팔로우 끊기
- 팔로워 삭제
- 차단/신고

Navigation:

- Top-right `UserPlus` / `사람 추가` icon -> `친구 찾기`
- Accessibility label: `친구 추가`

Entry points to verify:

- Profile follower/following counts
- Settings
- Row overflow menu

Proposed additions needing separate validation:

- `소식 숨긴 계정`
- `교류가 적은 계정`
- `라운지에서 덜 보기`

Disposition:

- Deferred to a separate IA run before Follow Management v2 implementation begins. Not in scope for the first Figma implementation until validated.

## Implementation Scope

This run is a product/IA decision run. No Figma mutation is performed in this stage unless explicitly requested next.

If applying to Figma later:

1. Create a separate `친구 찾기` screen. Do not merely rename the existing `팔로우 관리` screen.
2. Remove `추천 친구` and `인기 친구` sections from the pure `팔로우 관리` screen.
3. Add a top-right `사람 추가` icon to `팔로우 관리`.
4. Ensure `친구 찾기` does not show `팔로우 관리` as a top-right button.
5. Use CDS profile/recommendation list components; avoid custom row/chip implementations.
6. Prior run dependency: the `20260506-145658` Figma rebuild currently placed `팔로잉/추천/인기` tabs into the target screen. Figma implementation must remove `추천/인기` from the pure `팔로우 관리` screen.
7. Card disposition from the prior run: do not move old `추천/인기` card instances directly into `친구 찾기`. Build the new `친구 찾기` screen fresh from the `Recommendation Profile List` pattern because metadata rules change from follower count-heavy to mutual/source-first.
8. Create CDS `Recommendation Profile List` as a blocking prerequisite before Friend Discovery screen implementation. This follows the 2026-05-06 friend recommendation profile list meeting decision.
9. Tab treatment: after removing `추천/인기`, do not leave a single-tab `Tab Bar`. Either remove the tab bar entirely for a single-list management screen, or replace it with a two-tab `팔로잉/팔로워` control if both lists are in scope.

## Acceptance Criteria

- Friend Discovery first viewport contains only discovery/growth actions.
- Friend Discovery does not include a management button or following preview module.
- Follow Management includes a light path to Friend Discovery via top-right icon.
- Follow Management remains discoverable within 2 screen transitions from profile count, settings, or row overflow.
- Recommendation cards prioritize mutual/source context over follower count, except creator/popular contexts.
- Recommendation cards for already-followed users show only the `팔로잉` state; recommendation source labels are suppressed.
- Friend Discovery has explicit degradation states for no recommendations and contacts permission denied.
- Follow Management has explicit empty states for 0 followers and 0 following.
- Empty/degradation state visual design is out of scope for this IA run and should be specified during Figma implementation.
- Figma QA must include a manual checklist item verifying that source labels are suppressed for already-followed users.
- `Recommendation Profile List` must pass the CDS QA rubric before use in screen composition.

## Measurement Plan

Primary metrics:

- Friend Discovery -> follow completion rate
- Friend Discovery -> invite completion rate
- Time from Friend Discovery entry to first follow
- Feed/lounge first meaningful interaction rate

Guardrails:

- Follow management discovery failure in usability tests
- Hide/unfollow/block completion time
- Recommendation dismiss rate
- Friend Discovery bounce rate

Experiment candidates:

- Variant B: expose `팔로우 관리` button in Friend Discovery
- Variant C: show following preview module in Friend Discovery

Default should remain `A + D` until data proves B or C improves outcomes without harming follow/invite conversion.

Baseline requirements:

- Capture current follow completion rate, invite completion rate, recommendation dismiss rate, and management entry usage before launching an A/B test.
