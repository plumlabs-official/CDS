# Team Analysis — CDS Probe Cleanup

Date: 2026-05-08
Request: `유사한 케이스 점검하고 정리해줘. -play`
Figma file: `H36eNEd6o7ZTv4R7VcyLf2` (CDS)

## Problem

The user found `[PROBE] Feed Addon Footer — long Actor Name + Status` in the CDS
component area and challenged whether it should exist as a visible sibling.

The structural answer is:

- The `Feed Addon Footer` data contract should live on the component properties.
- QA probe instances are useful during component creation, but they should not
  remain in the publish-facing component group unless there is an explicit,
  clearly separated QA/examples area.

## Current State

Read-only Figma scan found 10 actual `[PROBE]` instances, all under:

`Components / Main content (21721:6812)`

| Node | Name | Main component | Reason |
|---|---|---|---|
| `21723:2926` | `[PROBE] Reaction Bar — Is Liked=true` | `Reaction Bar` | QA state sample |
| `21723:2944` | `[PROBE] Reaction Bar — Show Share=false` | `Reaction Bar` | QA state sample |
| `21725:2947` | `[PROBE] Comment Item — long Description` | `Comment Item` | Long-text QA sample |
| `21725:2955` | `[PROBE] Comment Item — Show Name=false, Show Right Slot=false` | `Comment Item` | Boolean QA sample |
| `21726:3048` | `[PROBE] Feed Addon Footer — long Actor Name + Status` | `Feed Addon Footer` | Long-text QA sample |
| `21726:3110` | `[PROBE] Feed Addon Footer — default` | `Feed Addon Footer` | Default QA sample |
| `21732:3326` | `[PROBE] Feed Card — minimal` | `Feed Card` | Composed-state QA sample |
| `21732:3493` | `[PROBE] Feed Card — full` | `Feed Card` | Composed-state QA sample |
| `21736:3324` | `[PROBE] Comment Item — Right Slot default = 더보기 Ghost` | `Comment Item` | INSTANCE_SWAP default QA sample |
| `21737:3469` | `[PROBE] Feed Card — INSTANCE_SWAP added (default 더보기)` | `Feed Card` | INSTANCE_SWAP QA sample |

False positives from the broader scan:

- 19 matches on `↳ Icons` page contain `long` as part of icon names such as
  `arrow-right-long-line`. These are not QA artifacts and must not be touched.

## Component Contract Check

`Feed Addon Footer` itself is already correctly property-bound:

| Property | Type | Bound node |
|---|---|---|
| `Actor Name#21726:0` | TEXT | `Actor Name` text |
| `Attendee Count#21726:1` | TEXT | `Attendee Count` text |
| `Status#21726:2` | TEXT | `Status` text |
| `Show Avatars#21726:3` | BOOLEAN | `Attendee Slot.visible` |

So the issue is not missing component properties. The issue is leftover QA
instances in the same component group.

## Options

### Option A — Delete all `[PROBE]` instances from publish-facing component group

Pros:

- Cleanest CDS publish surface.
- Removes designer confusion.
- Keeps component properties as the single manipulation surface.
- Existing run artifacts already record the probe evidence.

Cons:

- Loses live visual examples in Figma.

### Option B — Move probes to a separate QA / Probes area

Pros:

- Keeps live test examples available.
- Avoids cluttering the component group.

Cons:

- Adds another area to maintain.
- Existing CDS component page does not currently present a clear probe gallery
  convention for this feed group.
- Probe instances can still be mistaken as deliverable assets if they remain in
  the publish file.

### Option C — Keep as-is

Pros:

- No mutation.

Cons:

- Leaves the user-reported confusion unresolved.
- Violates the expected distinction between component API and temporary QA
  evidence.

## Recommendation

Choose Option A.

Delete the 10 `[PROBE]` instances from `Components / Main content`. Do not change
the main components, component property definitions, nested property references,
or icon components.

## Scope

In scope:

- Delete only direct children whose names start with `[PROBE]` and whose
  immediate parent is `21721:6812` (`node.parent.id === "21721:6812"`). Do not
  recursively delete descendants inside component subtrees.
- Re-scan the file and confirm `Components` page has 0 `[PROBE]` nodes.
- Confirm Feed component property definitions remain intact:
  - `Reaction Bar`
  - `Comment Item`
  - `Feed Addon Footer`
  - `Feed Card`
  - `Feed Lounge Strip`

Out of scope:

- Adding new `Feed Card` top-level forwarded properties for nested
  `Feed Addon Footer` values. This may be a good future refinement, but it is a
  component API change and should be handled separately.
- Moving or deleting icon components whose names contain `long`.
- Product file `2026-05` updates.

## Risks

- Accidental deletion of actual components if the selector is too broad.
  Mitigation: match exact immediate parent `21721:6812` and name prefix
  `[PROBE]`; delete direct child instances only.
- Deleting probe nodes that have prototype reactions or unexpected references.
  Mitigation: inspect each target node before deletion and record
  `reactions.length`; abort if any target is not an `INSTANCE` or has
  unexpected non-empty reactions.
- Loss of QA evidence.
  Mitigation: record the deleted probe node list and property values in this run.
- Auto Layout shift inside `Main content`.
  Mitigation: these probe nodes are siblings after component definitions; after
  deletion, verify target components still exist and have expected dimensions.

## Acceptance Criteria

- `Components / Main content` has no child nodes whose name starts with
  `[PROBE]`.
- `Feed Addon Footer` still exposes `Actor Name`, `Attendee Count`, `Status`,
  and `Show Avatars`.
- `Feed Card` still exposes its 10 expected props, including
  `Addon Footer Slot`.
- `Feed Lounge Strip` still exposes `Title`, `Attendee`, `Show Right Slot`,
  `Thumbnail Slot`, `Attendee Slot`, and `Right Slot`.
- No non-probe icon/component nodes are changed.
- Record the cleanup in `05-implementation.md` and repo session artifacts.
