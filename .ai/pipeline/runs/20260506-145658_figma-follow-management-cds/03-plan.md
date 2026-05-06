# 03 Plan

## Plan

1. Inspect and extract current `Follow Row` data from `28163:28618`.
2. Keep current `Top Bar` and `Navbar`; remove old `Body`.
3. Build a new `Body` with:
   - `Tab Bar` using three CDS tab-tag instances labeled `팔로잉`, `추천`, `인기`.
   - `Content Header` for the active group.
   - `Follow List` with visible `Invite Profile Card` instances for `팔로잉`.
   - Hidden `Recommended List` and `Popular List` groups backed by the same card
     instance pattern.
4. Map each card:
   - avatar image fill from the old row avatar
   - `Name#15737:0` from old name
   - `↳ Description#15737:1` from old follower text
   - follower metric text from old follower count
   - child button label from old action state
5. Verify with Figma queries:
   - profile card count is 18
   - visible custom rows/chips are 0
   - activity-energy text count is 0
   - expected names/counts exist
   - avatar image fills exist on cards

## Acceptance Criteria

- Visible main list uses CDS card instances only.
- Tabs use CDS tab-tag instances only.
- No visible `Follow Row` or `Filter Tabs` remains.
- All original data is preserved in card instances.
