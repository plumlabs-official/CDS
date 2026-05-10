# Peer Agent Review

| Field | Value |
|---|---|
| Target | claude |
| Mode | plan |
| Project | CDS |
| Repo | /Users/zenkim_office/Project/CDS |
| Git repo | yes |
| Branch | main |
| Created | 2026-05-10 03:27:15 KST |
| Exit code | 0 |
| Timeout seconds | 2700 |

## Request

Play run: /Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery
Review the implementation plan artifact for this play harness run.
Source artifact: /Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery/03-plan.md

## Artifact Content

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

## Context

### Git Status

```
?? .ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery/
```

### Diff Stat

```
(no unstaged diff stat)
```

## Peer Result

I now have sufficient evidence to deliver the review. Let me trace each prior FAIL finding against the revised plan and evaluate for new issues.

---

### Peer Review Verdict
- **Result: PASS**
- **Confidence: medium**

### Findings

| Severity | File/Area | Issue | Recommendation |
|---|---|---|---|
| Minor | Phase 6 step 1 | **"Before" screenshot timing is ambiguous.** Step says "Capture product target screenshot before and after replacement" but Phase 6 runs AFTER Phase 4 (replacement) and Phase 5 (cleanup). The "before" screenshot must be captured before Phase 4 begins, not in Phase 6. | Add a pre-replacement screenshot step at the end of Phase 0 or beginning of Phase 4, and reference it in Phase 6 as already captured. |
| Minor | Phase 2 step 7 | **"Feed Creation" group name doesn't describe the full scope.** The 27 candidates span Template Editor, iOS Activity, Album Picker, Completion, Post Action Sheet, Comment Drawer, and Confirm Dialog — not just Feed Creation. | Use a broader group name like `Feed and Lounge Screens` or split into subgroups (e.g., `Feed Compose`, `Template Editor`, `Completion`, `iOS Activity`) matching the source screen domains. |
| Minor | candidate-inventory.json / Phase 2 step 8 | **Internal slashes in `cdsName` unaddressed.** Step 8 removes the `/ CANDIDATE` suffix, but 4 candidates retain internal slashes as standalone COMPONENTs (not COMPONENT_SETs): `Post Action Sheet / Other User`, `Post Action Sheet / Owner`, `Confirm Dialog / Stop Writing`, `Template Crop Canvas Text Editing`. Per `naming-policy.md` §6, slash is variant hierarchy only. If these are standalone COMPONENTs, the slashes are QA violations (-5 each). | Clarify whether these should become COMPONENT_SET variants during migration (in which case slashes are correct) or be renamed to non-slash names (e.g., `Post Action Sheet Other User`). |
| Minor | Phase 4 / Acceptance | **`replacement-diff.json` only created on failure.** Phase 4 step 6 writes to `replacement-diff.json` only when overrides are lost. But the acceptance criterion says "records no override-loss mismatches for completed replacements" — implying the file should exist with all comparisons recorded (pass and fail), not just failures. | Always write `replacement-diff.json` with per-instance pre/post comparison results, not just failure entries. An empty `mismatches` array is the PASS signal. |
| Warning | Phase 2 / Figma MCP | **20KB return limit not addressed.** Processing 27 components through `use_figma` for selection, arrangement, renaming, and evidence capture may hit the 20KB response truncation. The plan doesn't reference the field minimization or batch splitting patterns from `figma-mcp-tool-guide.md`. | Apply Pattern 2 (field minimization) and Pattern 3 (count → detail split) from `figma-mcp-tool-guide.md` for all use_figma operations involving the full 27-component set. |
| Warning | Phase 4 step 6 | **Rollback safety depends on Phase 5 sequencing (implicit).** The rollback works because old local components still exist until Phase 5 cleanup. This dependency is logically correct (Phase 5 step 4 blocks cleanup on partial/rollback) but the assumption is never explicitly stated. | Add one sentence to Phase 4: "Rollback is safe because product-local candidate originals are not removed until Phase 5 passes G5." |

### Prior FAIL Finding Resolution

All 9 findings from the previous FAIL review (`20260510-031957-claude-plan-32652.md`) are addressed:

| Prior Finding | Severity | Status | How Addressed |
|---|---|---|---|
| Override preservation | Critical | **Fixed** | Phase 4 steps 1/3/5/6: pre-swap capture, `swapComponent` preference, post-swap diff, rollback on loss |
| Component contract gates | Major | **Fixed** | Phase 2 steps 9-10, G2 gate, Contract Position section |
| Batch selection mechanism | Major | **Fixed** | Phase 2 steps 1-2: type + name query, count validation, fail-fast |
| Partial-completion rollback | Major | **Fixed** | Phase 4 step 4 (leave unchanged), Phase 5 step 4 (block cleanup on partial) |
| Prior review findings | Major | **Fixed** | Full script path, Phase 0 live source of truth, G2 QA checkpoint, dynamic counts in acceptance criteria |
| Slash naming | Minor | **Fixed** | Phase 2 step 8: "no slash suffix" with example |
| G3 single-key verification | Minor | **Fixed** | Phase 3 step 3: all keys or 5+ representative sample |
| Relative output paths | Minor | **Fixed** | Phase 0 step 2: full run directory paths |
| Provenance gap | Warning | **Fixed** | Phase 0 step 3: live result as source of truth, no hardcoded counts |

### Test and Acceptance Notes

- **Override preservation test is now present** — `swapComponent` + pre/post diff + rollback is the correct pattern, validated by the prior Feed Card use-site work (HANDOFF 2026-05-08 16:49:09) which required exactly this kind of override recovery.
- **G0 re-inventory correctly designated** as sole source of truth. Acceptance criteria now use dynamic "Phase 0 count" language, not hardcoded 27/29.
- **G2 QA checkpoint added** (R2 naming + R6 token audit + ContractException recording) — matches the prior review recommendation.
- **G3 strengthened** to verify all keys or 5+ representative sample with publish metadata fallback.
- **G4 rollback is sound** — Phase 5 cleanup is gated on full Phase 4 success, so old local components exist throughout Phase 4 for rollback.
- **G5/G6/G7 sequencing is correct** — cleanup only after replacement, visual verification after cleanup, Slack report last.
- **Desktop automation dependency** is the primary runtime risk. Both `codex_computer_use` and `claude_cowork_dispatch` actuators are documented. G1 gate validates availability before proceeding.

### Follow-Up For Requesting Agent

1. **Proceed to implementation** — all prior FAIL findings are addressed and the plan is viable.
2. **Address the 6 minor/warning findings** listed above before or during implementation:
   - Capture "before" screenshot before Phase 4, not in Phase 6.
   - Reconsider the "Feed Creation" group name for the CDS target.
   - Decide on internal-slash component names (variant sets vs standalone components).
   - Always write `replacement-diff.json` with full comparison data.
   - Apply 20KB field minimization for batch `use_figma` calls.
   - Add an explicit note that rollback safety depends on Phase 5 sequencing.
3. **None of the findings are blocking** — they can be incorporated during implementation without re-review.

