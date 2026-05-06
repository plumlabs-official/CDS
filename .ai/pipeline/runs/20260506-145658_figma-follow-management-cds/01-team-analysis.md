# 01 Team Analysis

## Problem

Target Figma screen `28163:28618` was previously rebuilt with local `Follow Row`
frames and button-chip tabs. The user clarified that this should be based on CDS
component instances: `Profile Card` or the Invite Friends `Invite Profile Card`
for list items, and `TabsList Tag` for tabs.

## Current State

- Existing screen still contains 18 preserved profile records in `Follow Row`
  frames.
- The user-provided CDS source node `H36eNEd6o7ZTv4R7VcyLf2:20355:3398`
  is `Invite Profile Card / Type=Horizontal, Selected=False`.
- CDS `TabsList Tag` exists, but its full-list instance is unstable when editing
  nested item labels through direct text overrides. Its stable per-tab trigger
  variants expose `Label#2767:117`.

## Recommendation

Use CDS `Invite Profile Card` instances for every profile row. Use CDS tab-tag
trigger variants from the `TabsList Tag` family for the visible tab controls,
renamed as `TabsList Tag` instances in the target frame.

## Scope

- Remove visible local `Follow Row` and `Filter Tabs` structures.
- Preserve all 18 profile images, names, follower counts, and follow states.
- Default visible tab: `팔로잉`; keep `추천` and `인기` groups hidden but data-backed.
- Remove activity-energy text and UI.

## Risks

- Full `TabsList Tag` list component contains nine internal items and regenerates
  nested node ids when editing item labels. Use per-tab CDS trigger variants to
  avoid brittle instance mutation.
