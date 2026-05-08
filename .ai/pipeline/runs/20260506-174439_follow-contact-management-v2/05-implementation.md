# Implementation

## Completed

Rebuilt the two previously generated Figma frames in place as V2.

| Screen | Node ID | Final Name | Size |
|---|---|---|---:|
| Contact friends detail | `28252:14022` | `Contact Friends Screen V2 - Sorted + CDS Reuse` | 375 x 1350 |
| Follow management | `28252:14125` | `Follow Management Screen V2 - CDS Reuse` | 375 x 1080 |

## User Critiques Addressed

1. Contact invite sorting:
   - Added visible group headers: `ㄱ`, `ㄴ`, `ㅁ`, `ㅈ`, `A`.
   - Added compact right-side index rail: `ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅎ A`.
2. CDS/similar instance reuse:
   - Rebuilt visible controls using cloned existing instances:
     - `iOS StatusBar`
     - `Navbar`
     - `Input Group`
     - `Content Header`
     - `Avatar`
     - `Button`
     - `TabsList Toggle`
     - `Lucide Icons`
   - Final instance counts:
     - Contact screen: 146 instances
     - Follow management screen: 96 instances
3. Label clarity:
   - Removed unclear v1 labels:
     - `팔로우할 수 있는 연락처`
     - `초대할 연락처`
   - Replaced with:
     - `Challify에 있는 친구`
     - `아직 가입하지 않은 연락처`
     - `내가 팔로우 중인 사람`
     - `피드에 덜 보기`
     - `팔로워 정리`

## QA Fixes

Initial screenshot QA found two copied-component side effects:

- `TabsList Toggle` inherited red notification dots.
- The first three follow-management avatars repeated the same image.

Patched:

- Hid inherited notification badge nodes.
- Converted all follow-management row avatars to CDS `Avatar / Type=Fallback` with initials.
- Changed top-right management icon from user/settings style to plus.

## Verification

Figma compact QA:

- Old labels remaining: 0
- Contact sorting text gate: PASS
- Follow management text gate: PASS
- Hidden visible-risk nodes: 0
- Source `팔로우 추천` frame `28237:37689` not edited.

Screenshot QA exports:

- `exports/2026-05-06_follow-contact-management-v2/contact-v2.png`
- `exports/2026-05-06_follow-contact-management-v2/follow-management-v2-final.png`
