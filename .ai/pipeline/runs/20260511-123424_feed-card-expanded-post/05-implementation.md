# Implementation

Status: controller recovery completed at 2026-05-11T13:18:24+0900.

## Recovery path

- `-play` was started for this request, but the daemon stopped after the initial analysis placeholder state.
- The team-model recovery path reached tier1 allocation and worker dispatch, but `worker-01` had an empty `write_scope` and correctly made no changes.
- Because the controller had the Figma MCP write capability and the requested work was in the CDS Figma file, the controller completed the bounded implementation directly in the original play run.

## Figma changes

Target CDS file: `H36eNEd6o7ZTv4R7VcyLf2`.

Created structural CDS component set:

- Component set: `Comment Item`, node `21925:48`, key `e36235c0350014ebfe8f0e0354cc28d0e5708a1e`
- Variant `State=Collapsed`: node `21925:2`, key `dbfb040dda17156f4fd4ed16249ba43a9a691ae7`
- Variant `State=Expanded`: node `21925:28`, key `95cca91279662a275868a97257db089bb91cab30`

The original `Comment Item/Short` component (`21725:2939`) was preserved for backward compatibility.

The new component set is authored with Figma layers, text, auto-layout, component properties, and variants. It is not screenshot-backed and contains no raster/image-backed component layers.

## Behavior

- `State=Collapsed` keeps the first comment row compact and shows the `더보기` right action.
- `State=Expanded` hides the `더보기` right action and shows the full written post body in `Item Content More`.
- Expanded body text follows the reference screen structure: default name/summary row plus a separate detailed body section.
- Text properties are exposed for `Name`, `Description`, and `More Description`.
- The state is driven by the `State` variant, not by shared boolean visibility props. This prevents the collapsed and expanded variants from fighting over a single default visibility value.

## Feed Card wiring

Updated the CDS Feed Card source component (`21732:3062`):

- `Comment Slot 1` (`21732:3310`) now points to `Comment Item / State=Collapsed`.
- `Comment Slot 2` (`21732:3318`) now points to `Comment Item / State=Collapsed`.
- Feed Card instance-swap properties now prefer the new `Comment Item` component set while keeping the previous `Comment Item/Short` component as a backward-compatible preferred value.

## Verification

Figma MCP verification created temporary instances and removed them after inspection.

- Component set exists and has exactly two variants: PASS
- Collapsed source shows `더보기` and hides full body: PASS
- Expanded source hides `더보기` and shows full body: PASS
- Collapsed default instance shows `더보기` and hides full body: PASS
- Expanded default instance hides `더보기` and shows full body: PASS
- Custom `Name`, `Description`, and `More Description` property overrides work: PASS
- Long expanded body at 320px has no horizontal overflow: PASS
- Responsive widths 320, 375, and 430px have no horizontal overflow: PASS
- Feed Card comment slots point to the new `Comment Item` set: PASS
- Raster/image-backed component node count: 0, PASS

Verification summary: `checks.all=true`.

Formal completion evidence packet: `.ai/pipeline/runs/20260511-123424_feed-card-expanded-post/completion-evidence.json`.

Headless peer review: PASS (`.ai/peer-review/runs/20260511-131957-claude-review-33470.md`).

## Follow-up clipping fix

Added at 2026-05-11T13:47:51+0900 after user reported clipping at `21925:31`.

- Root cause: Expanded `Item content` (`21925:30`) had fixed `1px` height and `clipsContent=true`, pushing `Description Slot` (`21925:31`) to `y=-9.5`.
- Fix: Expanded `Item Content Default`, `Item content`, and `Description Slot` were moved to hug vertical sizing and clipping was removed from the affected row hierarchy.
- Result: `Description Slot` is now `y=0`, `height=20`, `clipsContent=false`; Expanded component height normalized from `580` to `500`.
- Figma MCP verification: source overflow PASS, default expanded instance overflow PASS, 320px expanded instance overflow PASS, collapsed still shows `더보기`, expanded still hides `더보기` and shows body. `checks.all=true`.

## Legacy cleanup follow-up

Added at 2026-05-11T13:54:22+0900 after `Comment Item/Short` deletion cleanup.

- Removed stale `Comment Item/Short` preferred values from Feed Card `Comment Slot 1` and `Comment Slot 2` instance-swap properties.
- Repaired `Comment Slot 1` instance naming/property references after Figma API cleanup temporarily left it named `Comment Item`.
- Final Feed Card slots:
  - `Comment Slot 1` -> `Comment Item / State=Collapsed`, refs `Show Comment 1#21732:2` and `Comment Slot 1#21737:4`.
  - `Comment Slot 2` -> `Comment Item / State=Collapsed`, refs `Show Comment 2#21732:3` and `Comment Slot 2#21737:5`.
- Legacy `Comment Item/Short` instance count: `0`; preferred stale reference count: `0`.
- Figma API still resolves `21725:2939` as an orphaned component object with `parent=null`, but it is no longer referenced from the Feed Card contract.

## Feed Card footer slot optimization

Added at 2026-05-11T14:37:03+0900 after the footer group was converted to a slot and CDS was published/updated.

- Removed parent-level legacy footer child properties from `Feed Card`:
  - `Show Addon Footer#21732:1`
  - `Show Comment 1#21732:2`
  - `Show Comment 2#21732:3`
  - `Addon Footer Slot#21737:3`
  - `Comment Slot 1#21737:4`
  - `Comment Slot 2#21737:5`
- Kept the group-level `Feed Footer Slot#21924:0`.
- Feed Card property surface reduced from `13` to `7`.
- Final kept parent properties:
  - `Show Lounge Card#21732:0`
  - `Header Slot#21737:0`
  - `Lounge Card Slot#21737:1`
  - `Reaction Bar Slot#21737:2`
  - `↳ Show Author Action#21791:0`
  - `↳ Author Action#21791:1`
  - `Feed Footer Slot#21924:0`
- Fixed a transient width regression from `100` back to `375` and reasserted fill sizing for `Header Slot`, `Lounge Card Slot`, `Reaction Bar Slot`, `Feed Footer Slot`, `Addon Footer Slot`, `Comment Slot 1`, and `Comment Slot 2`.
- Final Figma MCP verification:
  - source width `375`, instance width `375`
  - no legacy definitions, refs, or instance props
  - `Feed Footer Slot` retained as a SLOT
  - source and instance overflow `0`
  - comment items still use `Comment Item / State=Collapsed`
  - collapsed `더보기` visible and expanded body hidden
  - `checks.all=true`
- Product use-site check after publish/update:
  - `CS2ZhrORl4E1szQfTe2UvO/28587:18399` has `Feed Footer Slot#21924:0`
  - `CS2ZhrORl4E1szQfTe2UvO/28602:19583` has `Feed Footer Slot#21924:0`
  - both use-sites expose the new parent slot surface.

## Remaining note

Library-level site replacement is intentionally not performed here. Existing Feed Card source slots now use the new component set, but downstream consuming files will need the normal CDS library publish/update flow before remote instances can swap to the expanded state.
