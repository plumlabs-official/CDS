# QA Inbox: Friend Discovery / Follow Management Design PRD

- Date: 2026-05-06
- Mode: Director QA
- Artifact: `report/2026-05-06_friend-discovery-follow-management-design-prd.md`

## Gate Criteria

| Gate | Pass Criteria | Fail State |
|---|---|---|
| G1 Scope | PRD clearly separates `친구 찾기`, `팔로우 관리`, and `Recommendation Profile List` | Recommendation and management are mixed as one primary screen |
| G2 IA | Asymmetric navigation is explicit: management links to discovery, discovery does not link back to management | Friend Discovery exposes management button or following preview |
| G3 Design Detail | PRD includes screen sections, primary actions, metadata hierarchy, states, and accessibility | Figma designer cannot build from the spec |
| G4 CDS | PRD names CDS reuse strategy and blocking prerequisite pattern | PRD permits custom rows or old follower-count card reuse |
| G5 Metrics | PRD includes primary, secondary, guardrail/counter metrics, and baseline timing | Metrics cover only positive growth outputs |
| G6 QA | PRD includes Figma QA checklist with source-label suppression and no single-tab tab bar | Prior decisions cannot be verified in Figma QA |
| G7 Scope Control | PRD explicitly states this artifact does not mutate Figma | PRD authoring step includes Figma changes |

## Deliverables

- `report/2026-05-06_friend-discovery-follow-management-design-prd.md`
- `.ai/pipeline/runs/20260506-162343_friend-discovery-design-prd/01-team-analysis.md`
- `.ai/pipeline/runs/20260506-162343_friend-discovery-design-prd/03-plan.md`

## Local Verification

- `git diff --check`: PASS
- Required headings/rules scan: PASS
- Figma mutation: none

## Review Request

Review the PRD as a design/product QA reviewer. Prioritize:

1. Missing decisions that would block Figma implementation
2. Contradictions with the prior IA decision
3. Scope creep into Figma mutation, recommendation algorithm, or Follow Management v2
4. Missing CDS component requirements
5. Missing measurement or QA criteria
