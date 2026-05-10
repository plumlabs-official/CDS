# Plan — CDS Figma Misplaced Candidate Recovery

## Scope

Fix the wrong-file component source issue and Slack reporting for this recovery run.

Do not create screenshot-only CDS components unless desktop copy/paste and structural recreation both fail for a specific component and the fallback is explicitly recorded as a temporary visual artifact.

## Sequence

### Phase 0 — Snapshot and Mapping

1. Re-run product inventory for `/ CANDIDATE` component originals under `14332:285690`.
2. Save mapping to:
   - `.ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery/candidate-inventory.json`
   - `.ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery/candidate-instance-map.json`
3. Treat the live Phase 0 result as the source of truth. Do not hardcode stale remembered counts.
4. Gate: G0.

### Phase 1 — Desktop Automation Check

1. Confirm `/Users/zenkim_office/Project/claude-center/scripts/play-desktop-actuator.sh` is executable.
2. Confirm Codex Computer Use status.
3. If Codex Computer Use is permission-blocked, use Claude Cowork Dispatch.
4. Gate: G1.

### Phase 2 — CDS Source Migration

Primary path:

1. Query the product target page for nodes where:
   - `node.type === "COMPONENT"` or `node.type === "COMPONENT_SET"`, and
   - `node.name` matches the live candidate pattern from Phase 0.
2. Validate selected count equals the Phase 0 candidate count. Fail fast if it differs.
3. Use Figma MCP to set `figma.currentPage.selection` to those exact node IDs.
4. Use desktop control to copy the selection.
5. Open CDS file `H36eNEd6o7ZTv4R7VcyLf2`, page `20012:2`.
6. Paste the copied component originals.
7. Use Figma MCP in CDS to arrange the pasted originals under a Composed group named `Feed Creation`.
8. Rename copied originals to stable Title Case names with no slash suffix. Example: `Feed Compose Option Row`, not `Feed Compose Option Row / CDS Recovery`.
9. Write batch `CreationDecision` evidence for all migrated components.
10. Run a G2 QA checkpoint:
    - R2 naming: no slash suffix, no raw `/ CANDIDATE`, no auto-generated outer names.
    - R6 token audit: record pass/fail per component.
    - Contract exceptions: record `ContractException` for any component intentionally migrated for recovery fidelity despite incomplete full CDS contract quality.

Fallback path:

- If desktop copy/paste fails or pasted nodes are not `COMPONENT`/`COMPONENT_SET`, recreate the affected subset structurally in CDS and record the subset in `05-implementation.md`.

Gate: G2.

### Phase 3 — Publish

1. Use desktop-control actuator to publish the CDS file.
2. If Codex Computer Use permission is still blocked, use Claude Cowork Dispatch.
3. Verify the product file can import all Phase 2 migrated CDS keys. If all-key verification is rate-limited, verify at least 5 representative keys across source groups, then continue only if publish metadata shows the remaining keys in the CDS file.

Gate: G3.

### Phase 4 — Product Use-Site Replacement

1. For each mapped product instance, capture pre-swap evidence:
   - `id`, `name`, parent/index, x/y, width/height, rotation, visibility,
   - `componentProperties`,
   - visible text node characters,
   - visible image/vector fill hashes where available,
   - nested instance component IDs where available.
2. Import the corresponding CDS component by key.
3. Prefer `oldInstance.swapComponent(cdsComponent)` instead of deleting and creating a new instance. This maximizes preservation of text, image, nested instance, and exposed-property overrides.
4. If `swapComponent` is unavailable or fails for one instance:
   - leave that instance unchanged,
   - record the failure,
   - continue only for independent instances,
   - mark Phase 4 as partial.
5. Capture post-swap evidence and compare against pre-swap evidence.
6. If an instance loses visible text, image fills, component properties, or nested component swaps:
   - rollback that instance by swapping back to the old local component while it still exists,
   - record the mismatch in `replacement-diff.json`,
   - do not proceed to Phase 5 cleanup.
7. Run postflight inventory.

Gate: G4.

### Phase 5 — Cleanup

1. Confirm zero product instances reference old local candidate originals.
2. Remove product-local `/ CANDIDATE` sources from live canvas.
3. If deletion is unsafe, move them to hidden `.Archive / Misplaced Candidate Sources / 2026-05-10` and record why.
4. Do not run cleanup if Phase 4 is partial or any rollback occurred.

Gate: G5.

### Phase 6 — Visual and Record

1. Capture product target screenshot before and after replacement and record both paths/URLs.
2. Write verification evidence.
3. Update `05-implementation.md` and `06-record.md`.
4. Send one Slack `업무 리포트`.

Gates: G6, G7.

## Acceptance Criteria

- `candidate-inventory.json` records the live Phase 0 local candidate original count.
- `candidate-instance-map.json` records the live Phase 0 usage instance count.
- CDS source inventory finds the same number of migrated originals under `H36eNEd6o7ZTv4R7VcyLf2 / 20012:2`.
- Product usage inventory finds all Phase 0 usage instances backed by CDS components.
- Product live `/ CANDIDATE` source count is 0.
- `replacement-diff.json` records no override-loss mismatches for completed replacements.
- Slack final report is logged once.

## Stop Conditions

Stop and ask for user decision if:

- Figma requires login, 2FA, or account permission changes.
- Desktop copy/paste cannot preserve components and structural recreation would materially change design semantics.
- Publish/update UI presents an unexpected irreversible action outside this bounded CDS publish request.
