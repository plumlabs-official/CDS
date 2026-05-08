# Implementation — CDS Probe Cleanup

Date: 2026-05-08
Figma file: `H36eNEd6o7ZTv4R7VcyLf2`
Parent: `Components / Composed / Feed Cards / Main content` (`21721:6812`)
Status: PASS

## Summary

Deleted the leftover QA probe instances from the Feed Cards component group.
These were temporary verification instances, not component definitions.

The `Feed Addon Footer` data contract remains on component properties:

- `Actor Name#21726:0`
- `Attendee Count#21726:1`
- `Status#21726:2`
- `Show Avatars#21726:3`

## Deleted Nodes

The mutation script deleted exactly 10 direct child `INSTANCE` nodes whose names
started with `[PROBE]`.

| Node | Name | Main component | Reactions |
|---|---|---|---|
| `21723:2926` | `[PROBE] Reaction Bar — Is Liked=true` | `Reaction Bar` | 0 |
| `21723:2944` | `[PROBE] Reaction Bar — Show Share=false` | `Reaction Bar` | 0 |
| `21725:2947` | `[PROBE] Comment Item — long Description` | `Comment Item` | 0 |
| `21725:2955` | `[PROBE] Comment Item — Show Name=false, Show Right Slot=false` | `Comment Item` | 0 |
| `21726:3048` | `[PROBE] Feed Addon Footer — long Actor Name + Status` | `Feed Addon Footer` | 0 |
| `21726:3110` | `[PROBE] Feed Addon Footer — default` | `Feed Addon Footer` | 0 |
| `21732:3326` | `[PROBE] Feed Card — minimal` | `Feed Card` | 0 |
| `21732:3493` | `[PROBE] Feed Card — full` | `Feed Card` | 0 |
| `21736:3324` | `[PROBE] Comment Item — Right Slot default = 더보기 Ghost` | `Comment Item` | 0 |
| `21737:3469` | `[PROBE] Feed Card — INSTANCE_SWAP added (default 더보기)` | `Feed Card` | 0 |

## Guard Results

Preflight:

- Expected target IDs matched actual direct child `[PROBE]` instances: PASS
- Target count: 10
- Every target type was `INSTANCE`: PASS
- Every target immediate parent was `21721:6812`: PASS
- Every target `reactions.length` was 0: PASS

Postflight:

- Remaining direct child `[PROBE]` nodes under `21721:6812`: 0
- Remaining global `[PROBE]` nodes in CDS file: 0
- Icon page false positives with `long` were not touched.

## Component Integrity

All required component definitions still exist with required properties.

| Component | Node | Result |
|---|---|---|
| `Reaction Bar` | `21723:2908` | PASS — 375×38, 6 props intact |
| `Comment Item` | `21725:2939` | PASS — 343×32, 5 props intact |
| `Feed Addon Footer` | `21726:2953` | PASS — 343×36, 4 props intact |
| `Feed Card` | `21732:3062` | PASS — 375×790, 10 props intact |
| `Feed Lounge Strip` | `21743:9854` | PASS — 375×96, 6 props intact |

## Notes

This cleanup does not add top-level forwarded `Feed Card` properties for nested
`Feed Addon Footer` text values. That is a separate component API decision.
