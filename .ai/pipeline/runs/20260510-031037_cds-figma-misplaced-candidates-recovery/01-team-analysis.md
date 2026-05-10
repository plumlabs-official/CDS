# Team Analysis — CDS Figma Misplaced Candidate Recovery

## Goal

Fix the Figma recovery issue from the previous direct Codex work:

- CDS component originals must live in the CDS library file:
  `H36eNEd6o7ZTv4R7VcyLf2 / Components / 20012:2`.
- Product usage screens must live in the `2026-05` product file:
  `CS2ZhrORl4E1szQfTe2UvO / [리뷰 완료] Feed and Lounge / 14332:285690`.
- Product usage must use instances whose `mainComponent` comes from the CDS file, not local `/ CANDIDATE` component originals in the product file.
- The final work report must be posted to Slack as one compact `업무 리포트`.

## Evidence

### CDS target

- `H36eNEd6o7ZTv4R7VcyLf2 / 20012:2`
- Node type: `PAGE`
- Name: `Components`
- Relevant section: `Composed(20157:1250)`.

### Product target

- `CS2ZhrORl4E1szQfTe2UvO / 14332:285690`
- Node type: `PAGE`
- Name: `[리뷰 완료] Feed and Lounge`
- The previous work created local component originals and instances under this product page.

### Misplaced local component originals

Fresh inventory was re-run for this play run and saved under:

- `candidate-inventory.json`
- `candidate-instance-map.json`

Inventory result:

- Local candidate originals in product page: `27`
- Product instances referencing those local originals: `29`
- Example local originals:
  - `28502:5` — `Feed Compose Option Row / CANDIDATE`
  - `28504:49` — `Feed Compose Media Preview Card / CANDIDATE`
  - `28511:195` — `Post Action Sheet / Other User / CANDIDATE`
  - `28512:398` — `Comment Drawer / CANDIDATE`
  - `28536:213` — `Template Crop Canvas Expanded / CANDIDATE`
  - `28543:366` — `Album Picker Top Bar / CANDIDATE`
  - `28545:287` — `iOS Activity Scroll View / CANDIDATE`

### Import limitation

Tested direct CDS import of product-local candidate key:

- Source key: `d2fbf50568cf88ce86aa63645a8fb92908eb4dab`
- Result in CDS file: `Component with key ... not found`

Conclusion: unpublished product-local components cannot be imported into the CDS file by key. A correct recovery must either:

1. copy the component origins across files through the Figma desktop UI, preserving their structure, or
2. recreate the components structurally in the CDS file.

Screenshot-backed components are rejected as the default path because they would visually hide the problem while failing CDS component quality.

## Issues

| ID | Issue | Impact |
|---|---|---|
| I1 | Slack report did not send | Direct Figma MCP work bypassed `-play` goal Slack reporting. |
| I2 | Component originals were created in the product file | Product file now contains source-of-truth design-system objects. |
| I3 | Product usage instances reference local candidate originals | Publish/update workflow cannot propagate future CDS changes. |
| I4 | Cross-file import by local key fails | Automated API-only migration is not enough. |
| I5 | Publish/library update requires desktop UI | Figma Plugin API has no `publishLibraryAsync`; desktop-control bridge is required. |
| I6 | Cleanup is unsafe until replacement is verified | Deleting local candidates before remote replacement can detach or break usage screens. |

## Recommended Route

Use a controlled desktop-assisted migration:

1. Select the 27 product-local component originals through Figma MCP.
2. Use desktop control to copy them from the product file and paste them into the CDS file.
3. Arrange the pasted originals under a CDS Composed recovery group so the source of truth is in `20012:2`.
4. Publish the CDS file through the desktop UI.
5. In the product file, import the new CDS component keys and replace the 29 local instances.
6. Verify all product instances now resolve to CDS components.
7. Remove or archive the misplaced product-local component originals only after replacement passes.
8. Send exactly one Slack `업무 리포트`.

## Provenance Note

The exact prior direct Codex turn that created these candidate originals was not
durably recorded in CDS HANDOFF/SESSION. Treat the fresh Phase 0 inventory in
this run as the source of truth. Do not rely on remembered counts if the live
Figma inventory changes.

## Desktop Automation Status

Existing implementation is present:

- `/Users/zenkim_office/Project/claude-center/scripts/play-desktop-actuator.sh`
- Supported actuators:
  - `codex_computer_use`
  - `claude_cowork_dispatch`
  - `custom`
- `/Users/zenkim_office/Project/claude-center/scripts/goal-orchestrator.sh`
  can mark stages as `executor: "desktop_control"`.

Current local constraint:

- Codex Computer Use currently reports pending Accessibility/Screen Recording permissions.
- Therefore the fallback path is Claude Cowork Dispatch unless permissions become available during the run.

## Pass Gates

### G0 — Inventory Gate

Pass when:

- Product page candidate original count is captured.
- Product local-candidate instance count is captured.
- Full `{oldComponentId, oldName, oldKey, instanceIds[]}` mapping is saved.

### G1 — Automation Gate

Pass when:

- Desktop-control bridge is executable.
- At least one actuator is available:
  - `codex_computer_use`, or
  - `claude_cowork_dispatch`.
- If Codex Computer Use remains permission-blocked, the run records the fallback to Claude dispatch.

### G2 — CDS Source Gate

Pass when:

- The Phase 0 candidate count worth of source component originals exists in CDS `20012:2`.
- Names no longer end in `/ CANDIDATE`; no slash-based migration suffix is used.
- Each source is under a clear Composed group with placement rationale.
- A CDS-side inventory returns the same count as Phase 0.
- Batch `CreationDecision` and `CompletionEvidence` are written, or a formal
  `ContractException` is recorded for any component whose full CDS contract
  remediation is deferred.

### G3 — Publish Gate

Pass when:

- CDS library publish completes through desktop control.
- Product file can import all migrated CDS component keys, or a documented
  representative sample plus publish metadata if Figma API rate limits block
  full verification.
- If publish requires an irreversible confirmation, the explicit user request in this run is treated as approval for this bounded publish action.

### G4 — Product Replacement Gate

Pass when:

- The Phase 0 usage count worth of product instances that previously pointed to local candidates is replaced.
- Each replacement instance has the same parent, x/y, width/height, rotation, and visibility as the old instance.
- Text, image fill, component property, and nested component-swap overrides are
  preserved, or the instance is rolled back and recorded as partial.
- Each replacement instance resolves to a CDS component key.

### G5 — Cleanup Gate

Pass when:

- No live product usage instance references the old local candidate originals.
- Misplaced product-local component originals are removed from live canvas or moved to a clearly hidden archive only if deletion would be risky.
- Product page live `/ CANDIDATE` source count is `0`.

### G6 — Visual/Structural Gate

Pass when:

- Target product page screenshots are captured after replacement.
- Figma inventory confirms:
  - local-candidate live source count: `0`
  - local-candidate usage count: `0`
- CDS-backed usage count matches the Phase 0 usage count.
- Any intentional visual delta is listed.

### G7 — Slack Gate

Pass when:

- `06-record.md` includes a Korean TL;DR explaining goal, split work, agents/tools, method, and result.
- Slack script logs exactly one final report event.
- Slack message title is `업무 리포트`.

## Risks

- Figma desktop copy/paste may preserve structure better than API recreation, but it depends on local UI state.
- Publish/update UI can still require account/session state. If it blocks on login, permissions, or unexpected confirmation, stop with `needs_user_decision`.
- If copied components become detached frames instead of components, stop before product replacement and switch to structural recreation for the affected subset.

## Contract Position

Migrating the 27 originals into CDS is component creation from the CDS contract
perspective. This run therefore requires batch evidence:

- `CreationDecision`: why each component is being placed in CDS, its source
  product node, its placement group, and whether an existing CDS component could
  be reused instead.
- `CompletionEvidence`: component type, final name, placement, basic R2 naming
  audit, R6 token audit, usage replacement result, and any exception.

When a component is copied for recovery fidelity but does not yet meet full
CDS token/property quality, record a `ContractException` instead of silently
passing the contract. Exceptions must include `ruleId`, evidence, reason, and a
revisit action.
