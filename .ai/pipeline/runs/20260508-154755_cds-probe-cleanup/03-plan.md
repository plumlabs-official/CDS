# Plan — CDS Probe Cleanup

Date: 2026-05-08
Run: `.ai/pipeline/runs/20260508-154755_cds-probe-cleanup/`

## Objective

Remove leftover QA probe instances from the CDS publish-facing component group
without changing any component definitions or product files.

## Decision

Use Option A from analysis: delete all `[PROBE]` direct child instances under
`Components / Composed / Feed Cards / Main content` (`21721:6812`).

Do not move probes into a new page. Existing pipeline artifacts preserve the QA
evidence; live probe instances in the component group create confusion.

## Deletion Target

Expected direct children to delete:

| Node | Name |
|---|---|
| `21723:2926` | `[PROBE] Reaction Bar — Is Liked=true` |
| `21723:2944` | `[PROBE] Reaction Bar — Show Share=false` |
| `21725:2947` | `[PROBE] Comment Item — long Description` |
| `21725:2955` | `[PROBE] Comment Item — Show Name=false, Show Right Slot=false` |
| `21726:3048` | `[PROBE] Feed Addon Footer — long Actor Name + Status` |
| `21726:3110` | `[PROBE] Feed Addon Footer — default` |
| `21732:3326` | `[PROBE] Feed Card — minimal` |
| `21732:3493` | `[PROBE] Feed Card — full` |
| `21736:3324` | `[PROBE] Comment Item — Right Slot default = 더보기 Ghost` |
| `21737:3469` | `[PROBE] Feed Card — INSTANCE_SWAP added (default 더보기)` |

## Guardrails

Before deletion:

- Find direct children of `21721:6812` only.
- Select targets by `node.name.startsWith("[PROBE]")`.
- Assert target IDs exactly equal the 10 expected IDs above.
- Assert every target is an `INSTANCE`.
- Record each target's:
  - id
  - name
  - type
  - size
  - main component id/name/key
  - component property values
  - `reactions.length`
- Abort if any target has unexpected type, unexpected parent, missing node,
  unexpected target set, or `reactions.length > 0`.

Deletion:

- Remove only the verified target instances.
- Do not walk into component subtrees.
- Do not touch any icon page nodes matched by `long`.

After deletion:

- Re-scan the whole file with `node.name.startsWith("[PROBE]")`.
- Confirm the `Components` page has 0 `[PROBE]` nodes.
- Confirm broader false positives remain only icon names, not probe artifacts.

## Integrity Checks

Verify these component definitions still exist and preserve their expected
properties:

| Component | Node | Required props |
|---|---|---|
| `Reaction Bar` | `21723:2908` | `Is Liked`, `Like Count`, `Show Like Count`, `Reply Count`, `Show Reply Count`, `Show Share` |
| `Comment Item` | `21725:2939` | `Name`, `Show Name`, `Description`, `Show Right Slot`, `Right Slot` |
| `Feed Addon Footer` | `21726:2953` | `Actor Name`, `Attendee Count`, `Status`, `Show Avatars` |
| `Feed Card` | `21732:3062` | 10 props, including `Header Slot`, `Lounge Card Slot`, `Reaction Bar Slot`, `Addon Footer Slot`, `Comment Slot 1`, `Comment Slot 2` |
| `Feed Lounge Strip` | `21743:9854` | `Title`, `Attendee`, `Show Right Slot`, `Thumbnail Slot`, `Attendee Slot`, `Right Slot` |

## Implementation Steps

1. Run Figma preflight script:
   - collect expected targets
   - collect component property snapshots
   - abort on mismatch
2. Run Figma mutation:
   - delete verified target nodes
3. Run Figma postflight script:
   - count remaining `[PROBE]` nodes
   - verify component property snapshots
   - verify actual components remain direct children in `21721:6812`
4. Update `05-implementation.md` with:
   - deleted node list
   - target count
   - postflight result
   - component integrity result
5. Update session/changelog/record artifacts if needed.

## Acceptance Criteria

- Deleted count is exactly 10.
- Remaining `[PROBE]` nodes in CDS file: 0.
- Remaining `[PROBE]` nodes under `21721:6812`: 0.
- Required Feed component property definitions remain present.
- No icon page nodes or product file nodes are modified.
- Repo records include this cleanup run.
