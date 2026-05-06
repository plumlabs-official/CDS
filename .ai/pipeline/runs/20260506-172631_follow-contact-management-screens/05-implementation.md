# Implementation

## Completed

Created two new sibling Figma frames on page `[리뷰 완료] Feed and Lounge`, without mutating the source `팔로우 추천` frame `28237:37689`.

| Screen | Node ID | Size | Position |
|---|---|---:|---|
| Contact Friends Screen | `28252:14022` | 375 x 1152 | x 10945, y -8875 |
| Follow Management Screen - Pure Management | `28252:14125` | 375 x 1048 | x 11415, y -8875 |

## Contact Friends Screen

Designed the `연락처 친구` deeper screen for the current `팔로우 추천 > 연락처 친구 더보기` flow.

- Keeps the same mobile density, white background, 16px side margins, status bar, navbar, pill search input, profile row rhythm, and small pill CTAs as the current recommendation screen.
- Includes connected-contact state: `연락처 동기화됨` with `관리` CTA.
- Splits contact outcomes into two sections:
  - `팔로우할 수 있는 연락처`: existing Challify users with `팔로우` and dismiss actions.
  - `초대할 연락처`: non-users/saved contacts with `초대` and dismiss actions.
- Adds a bottom `링크로 친구 초대` notice with `공유` CTA for friends outside contacts.

## Follow Management Screen

Designed a separate `팔로우 관리` utility screen, intentionally not another recommendation feed.

- Includes title, search, `팔로잉/팔로워` tabs, and relationship rows.
- Rows expose management actions such as `소식 숨김`, `팔로잉`, and overflow `...`.
- Adds `빠른 정리` utility cards:
  - `소식을 덜 보고 싶은 계정`
  - `팔로워 관리`
- Does not include `추천`, `인기`, or infinite recommendation feed content.

## QA Fixes Applied

- Initial screenshot showed missing avatars on two follow-management rows.
- Patched `28252:14125` by replacing the problematic hidden avatar instances with visible initial avatars:
  - `28255:26` / `28255:27`
  - `28255:33` / `28255:34`

## Verification

- Metadata confirmed both frames exist, are sibling mobile frames, and preserve the source frame.
- Screenshot QA confirmed no visible overlap/clipping after avatar fix.
- Local QA screenshots:
  - `exports/2026-05-06_follow-contact-management-screens/contact-friends.png`
  - `exports/2026-05-06_follow-contact-management-screens/follow-management-final.png`
