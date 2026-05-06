# Plan

- Date: 2026-05-06
- Target: `report/2026-05-06_friend-discovery-follow-management-design-prd.md`
- Mode: Director + Play
- Scope: Design PRD authoring only; no Figma mutation

## Decision To Encode

Use `Option A + Option D` (A: `팔로우 관리` -> `친구 찾기` link via `UserPlus`; D: `친구 찾기` does not link back to `팔로우 관리`), expanded:

- Option A: `팔로우 관리` has a top-right `UserPlus` / `사람 추가` icon that opens `친구 찾기`.
- Option D: `친구 찾기` does not expose `팔로우 관리` as a button or list preview.

## Work Allocation

| Role | Responsibility | Deliverable |
|---|---|---|
| Product Leader | Define problem, goals/non-goals, IA ownership, roadmap | PRD sections 1-5, 14 |
| Growth Expert | Encode growth loop, primary actions, metric names | PRD sections 2, 10, 12 contributor |
| Design Director | Define screen specs, states, CDS usage, Figma QA checklist | PRD sections 6-9, 11, 13 |
| Data Scientist | Lead measurement methodology, baselines, experiment variants, guardrails | PRD section 12 lead |
| Director/Controller | Merge into one PRD, verify gates, run Claude QA | Final PRD + review record |

## PRD Outline

Note: Expanded from the team analysis 12-section recommendation to include TL;DR, explicit roadmap, and open questions.

1. TL;DR
2. Background and Problem
3. Goals
4. Non-goals
5. Target Users and Entry Points
6. Information Architecture
7. Screen Spec: Friend Discovery (`친구 찾기`)
8. Screen Spec: Follow Management (`팔로우 관리`)
9. CDS Component Requirements
10. Recommendation Metadata and Content Rules
11. States, Edge Cases, and Accessibility
12. Metrics and Experiment Plan
13. Figma Implementation Notes and QA Checklist
14. Now / Next / Later
15. Open Questions

## Required Content

### Friend Discovery

Must specify:

- Canonical display name: `친구 찾기`
- Separate screen, not renamed `팔로우 관리`
- Entry points: feed/lounge empty states, invite flows, profile/follow management `사람 추가`, lounge/member contexts
- Sections: contacts, mutual/social, recommended friends, popular friends/creators, invite
- Primary actions: follow, invite, contact connect, dismiss recommendation
- No top-right `팔로우 관리`
- No following preview module

### Follow Management

Must specify:

- Secondary utility for relationship control
- Entry points: profile follower/following counts, settings, row overflow
- Top-right `UserPlus` / `사람 추가` -> `친구 찾기`
- Remove `추천/인기` tabs from pure management screen
- Do not leave a single-tab tab bar. Default replacement: search header + flat list; optional future structure: two-tab `팔로잉/팔로워` only if both lists are implemented in the same screen.
- Follow Management v2 advanced sections are deferred

### Recommendation Profile List

Must specify:

- Blocking prerequisite before Friend Discovery screen implementation
- Composed pattern based on CDS `Profile Card` / `Invite Profile Card` anatomy where possible
- Metadata hierarchy: avatar/name -> mutual reason -> source -> action
- Hide follower count by default
- Popular/creator contexts may show follower count
- Already-followed users show only `팔로잉`; source labels suppressed

## Acceptance Criteria

| Gate | Acceptance Criteria |
|---|---|
| G1 Scope | PRD clearly separates `친구 찾기`, `팔로우 관리`, and `Recommendation Profile List` |
| G2 IA | Asymmetric navigation is stated and symmetric management access is rejected |
| G3 Design Detail | PRD includes screen sections, primary actions, metadata hierarchy, states, and accessibility |
| G4 CDS | PRD names CDS reuse strategy and the blocking prerequisite pattern |
| G5 Metrics | PRD includes primary metrics, guardrails, counter metrics, and baseline timing |
| G6 QA | PRD includes Figma QA checklist with source-label suppression and no single-tab tab bar |
| G7 Scope Control | PRD explicitly says this artifact does not mutate Figma |

## Verification Plan

1. Write the PRD markdown.
2. Run a local content checklist:
   - Required headings exist
   - Must-have phrases/rules are present
   - No Figma mutation performed
3. Save Director QA inbox artifact summarizing gates and changed files.
4. Run Claude peer review against the PRD.
5. Address PASS low/medium findings if practical; rerun if FAIL or high/medium unresolved.
6. Save Director review record.
7. Update CHANGELOG/SESSION/HANDOFF and commit/push.

## Out Of Scope

- Figma edits
- Recommendation algorithm implementation
- Contacts permission legal copy finalization
- Follow Management v2 details such as `교류가 적은 계정`, `소식 숨긴 계정`, `라운지에서 덜 보기`
- CDS component creation itself
