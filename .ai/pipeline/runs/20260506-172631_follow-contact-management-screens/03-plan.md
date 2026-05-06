# Plan

## Gates

| Gate | Pass Criteria | Fail State |
|---|---|---|
| G1 Screen creation | Two new frames exist next to `28237:37689` with 375px mobile width | Missing frame, wrong page, or overwritten source |
| G2 Contact screen IA | Includes title, search, contacts connected state, followable contacts, inviteable contacts, and invite link CTA | Only duplicates current recommendation list or lacks invite branch |
| G3 Follow management IA | Includes title, search, meaningful `팔로잉/팔로워` tabs, current relationship rows, and management actions | Includes `추천/인기` feed or lacks management actions |
| G4 Visual consistency | Reuses current screen density, typography, avatar/button language, white background, 16px side margins | Drifts into card-heavy/marketing layout |
| G5 QA verification | Figma metadata and screenshots confirm no obvious overlap/clipping | Text clipped, rows overlap, or screen cannot render |

## Implementation Sequence

1. Inspect current frame and sibling placement.
2. Write Figma script that creates two new 375px screens to the right of the current `팔로우 추천` screen.
3. Use existing visual language:
   - iOS status bar approximation
   - navbar row with back icon and title
   - pill search input
   - simple profile rows with avatar, title, subtitle, action, optional secondary action
   - section headers with optional `더보기`
4. Create `Contact Friends Screen`.
5. Create `Follow Management Screen`.
6. Validate with metadata and screenshots.
7. Patch if QA finds layout/text issues.
8. Record implementation and review artifacts.

## Acceptance Notes

- Do not mutate the existing `팔로우 추천` frame.
- Do not create CDS reusable components in this run.
- It is acceptable for rows to be local design frames because the user explicitly deferred component production until design fix.
