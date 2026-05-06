# 02 Review

## Controller Review

Peer review via the full `-play` harness was not used because this is a Figma
MCP mutation task and the critical validation is structural inspection of the
target node after mutation.

## Findings

- The prior approach failed the user's clarified component intent because it used
  local rows and button-chip tabs.
- The correct card primitive is available as CDS `Invite Profile Card`, matching
  the linked Invite Friends reference.
- The correct tab primitive must be CDS tab-tag instances, not button chips.

## Required Gates

- `Invite Profile Card` or `Profile Card` instances must represent profile items.
- `TabsList Tag` instances must represent tabs.
- Existing profile images, names, follower counts, and `팔로잉`/`팔로우` states must
  be preserved.
- Activity-energy remnants must be absent.
