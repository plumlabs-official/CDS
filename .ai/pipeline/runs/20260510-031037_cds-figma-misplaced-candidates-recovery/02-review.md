# Peer Agent Review

| Field | Value |
|---|---|
| Target | claude |
| Mode | review |
| Project | CDS |
| Repo | /Users/zenkim_office/Project/CDS |
| Git repo | yes |
| Branch | main |
| Created | 2026-05-10 03:19:37 KST |
| Exit code | 0 |
| Timeout seconds | 2700 |

## Request

Play run: /Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery
Review the team analysis artifact for this play harness run.
Source artifact: /Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260510-031037_cds-figma-misplaced-candidates-recovery/01-team-analysis.md

## Artifact Content

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

Inventory from Figma Plugin API:

- Local `/ CANDIDATE` originals in product page: `27`
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

## Desktop Automation Status

Existing implementation is present:

- `scripts/play-desktop-actuator.sh`
- Supported actuators:
  - `codex_computer_use`
  - `claude_cowork_dispatch`
  - `custom`
- `goal-orchestrator.sh` can mark stages as `executor: "desktop_control"`.

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

- All 27 source component originals exist in CDS `20012:2`.
- Names no longer end in `/ CANDIDATE`; use `/ CDS Recovery` only if needed during migration.
- Each source is under a clear Composed group with placement rationale.
- A CDS-side inventory returns `27/27` migrated originals.

### G3 — Publish Gate

Pass when:

- CDS library publish completes through desktop control.
- Product file can import at least one newly migrated CDS component by key.
- If publish requires an irreversible confirmation, the explicit user request in this run is treated as approval for this bounded publish action.

### G4 — Product Replacement Gate

Pass when:

- All 29 product instances that previously pointed to local candidates are replaced.
- Each replacement instance has the same parent, x/y, width/height, rotation, and visibility as the old instance.
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
  - CDS-backed usage count: `29/29`
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

Now I have enough context to deliver the review.

---

### Peer Review Verdict
- **Result: PASS**
- **Confidence: medium**

### Findings

| Severity | File/Area | Issue | Recommendation |
|---|---|---|---|
| Minor | `01-team-analysis.md` §Desktop Automation Status | `scripts/play-desktop-actuator.sh` path is relative and ambiguous — the script lives in `claude-center` (`/Users/zenkim_office/Project/claude-center/scripts/play-desktop-actuator.sh`), not in the CDS project directory. Same for `goal-orchestrator.sh`. | Specify full path or note `claude-center/scripts/` explicitly so the implementing agent doesn't look in the wrong repo. |
| Minor | `01-team-analysis.md` §Evidence | Provenance gap — the artifact says "previous direct Codex work" created 27 misplaced candidates, but no HANDOFF entry in `.ai/HANDOFF.md` documents this specific Codex run. The most recent HANDOFF entries cover Feed Card visual parity, Profile Action Button, and probe cleanup — none mention creating `/CANDIDATE` originals in the product file. | Add a provenance note (approximate date, trigger, or commit) so the implementing agent knows the origin and can verify the candidates haven't already been partially cleaned up. |
| Minor | `01-team-analysis.md` §Evidence | Only 7 of 27 candidate originals are listed as examples. The full inventory is deferred to Phase 0 / G0. This is acceptable for analysis but means the exact count (27 originals, 29 instances) is unverified at this stage. | Acceptable as-is since G0 re-inventories, but note the numbers are preliminary. |
| Warning | `01-team-analysis.md` §Recommended Route | Step 6 "Rename from `/ CANDIDATE` to stable CDS names" (in plan) and G2 "use `/ CDS Recovery` only if needed during migration" — both need to conform to `naming-policy.md` Title Case space rules. `/ CANDIDATE` and `/ CDS Recovery` suffixes use slash in layer names, which is a `-5` QA penalty per `naming-policy.md` §6. | During implementation, ensure renamed components follow CDS naming policy (no slash in layer names; slash only for variant hierarchy). |
| Warning | `01-team-analysis.md` §Issues | I5 (publish requires desktop UI) and the Desktop Automation Status section claim Codex Computer Use has pending permissions, but this isn't verified in the artifact itself. The implementing agent will need to re-check at runtime. | Acceptable — G1 gate covers this. Just noting it's a runtime dependency. |
| Info | `01-team-analysis.md` | No assessment of whether the 27 candidate components meet CDS quality standards (QA rubric, component contract). If Codex created them directly in the product file, they may have naming, token binding, or property issues that should be fixed during migration, not after. | Consider adding a note that CDS QA audit (at minimum R2 naming + R6 token binding) should run on the migrated components before G2 is declared PASS. |

### Test and Acceptance Notes

- **G0 inventory**: The 27/29 counts are stated but unverified at analysis time. G0 re-inventory is correctly planned as the first gate.
- **Desktop actuator**: Script exists at `claude-center/scripts/play-desktop-actuator.sh` and is well-structured (result file contract, timeout, polling). The actuator infrastructure is real and not fabricated.
- **Plan alignment**: `03-plan.md` is consistent with the team analysis — same phase sequence, same gates, same stop conditions.
- **No live Figma verification** was done in this analysis. The candidate inventory numbers come from a prior run. Implementation should re-verify with fresh Figma MCP calls at Phase 0.
- **Pipeline scaffolding**: `02-review.md`, `04-plan-review.md`, `05-implementation.md`, `06-record.md` are all placeholder stubs — expected at this stage.

### Follow-Up For Requesting Agent

1. **Proceed with implementation** — the analysis is sound and the plan is viable.
2. **Fix the script path reference** in the analysis or plan before the implementing agent runs Phase 1 — it should point to `~/Project/claude-center/scripts/play-desktop-actuator.sh`.
3. **Add a QA checkpoint** to G2 — after migrating components to CDS, run at minimum naming and token binding checks before declaring G2 PASS.
4. **Re-verify candidate count** at Phase 0 with a fresh Figma MCP inventory call — don't assume the 27/29 numbers are still accurate.
5. **Clarify provenance** of the candidates if possible, so if some were already partially addressed by prior runs, the implementation doesn't duplicate work.

