# Plan

## Objective
Analyze the `2026-05` Feed/Lounge target node and run the CDS component/use-site replacement workflow without touching protected manual work.

Target:
- Product file: `CS2ZhrORl4E1szQfTe2UvO`
- Target page node: `14332:285690` (`[리뷰 완료] Feed and Lounge`)
- Working section: `22206:21655` (`Consumer Use Case`)
- CDS file: `H36eNEd6o7ZTv4R7VcyLf2`

Protected:
- Do not mutate `CS2ZhrORl4E1szQfTe2UvO/28582:15332`.
- `28587:14830` may be used only as source/reference evidence.

## Current Figma Findings
1. The target working section has 26 direct screen-like children and 75 nested mobile frame candidates.
2. Product audit under `22206:21655` found `localInstanceCount=0` and `missingMainCount=0`; all existing instances already point to remote components.
3. Most repeated UI is already CDS remote:
   - `Message` component set, `Input Group`, `TabsList`, `Challenge List Card`, `Lounge Card`, `Ranked Profile Item`, `Dropdown Menu Item`, `Button`, `Avatar`, `Lounge Card Addon Block`.
4. The highest-confidence remaining custom wrapper is `Creator Lounge Updates Screen` (`25972:54703`) > `Updates Card List` (`25972:54733`):
   - Four repeated local frames named `Upadates Card`: `25972:54734`, `25972:54739`, `25972:54744`, `25972:55344`.
   - They contain remote CDS `Lounge Card`/addon/Button pieces but the wrapper itself is not a CDS instance.
   - Existing published CDS component `Lounge Update Item` is available in CDS with key `1dd4808f25b6577b8e6f9e3379295665175bb53c`.
5. Non-Lucide icon hotspots exist but are not the primary replacement target for this run:
   - `Phosphor Icons / chat-centered-dots` in `Creator Lounge Updates Screen`.
   - `Huge Icons`, `Tabler Icons`, etc. in several challenge/progress/dropdown areas.

## Scope Decision
This run should not attempt a blind replacement of all 75 nested mobile frames. The safe implementation batch is:

1. Create a product backup of `Consumer Use Case` before mutation.
2. Write screen/component inventory evidence into the run directory.
3. Replace the four repeated update card custom wrappers in `Creator Lounge Updates Screen` with the published CDS `Lounge Update Item` where it preserves content.
4. Preserve the existing bottom action buttons (`좋아요`, `댓글 쓰기`) as a sibling action row if the current published `Lounge Update Item` does not own that action bar yet.
5. Record the remaining screens as verify-only or follow-up candidates, not silently mutate them.

Rationale:
- Since all current instances are remote, broad "instance replacement" is not needed for existing instances.
- The repeated local wrapper is the actual componentization gap.
- New CDS draft component changes cannot be consumed by the product file until CDS is published and the product library is updated. Therefore this run may use already-published CDS components for same-turn product replacement and record any new CDS extension as blocked if required.

## Implementation Steps

### 1. Backup Gate
- In product file, duplicate `Consumer Use Case` (`22206:21655`) to an archive/backup location or page.
- Name backup with timestamp, for example `_Archive Consumer Use Case CDS Play 2026-05-11 15:xx`.
- Verify original `22206:21655` remains present and protected nodes are not touched.

### 2. Evidence Files
Create run-local evidence files:
- `target-screen-inventory.md`: direct 26 node inventory, 75 nested mobile frame count, local/remote instance audit.
- `component-mapping.md`: screen-level mapping:
  - Already-CDS remote: verify-only.
  - Custom wrapper candidates: replacement/blocked/follow-up.
  - Exclusions: Splash/iOS push/OS-native mockups.

### 3. Published Component Probe
- Import `Lounge Update Item` by component key `1dd4808f25b6577b8e6f9e3379295665175bb53c` in the product file.
- Create a temporary probe instance off-canvas.
- Inspect `Updates Card List` (`25972:54733`) before mutation:
  - `layoutMode`, `itemSpacing`, `padding*`, `clipsContent`.
  - child order and source card widths/heights from the actual source nodes.
  - `layoutAlign`, `layoutGrow`, `primaryAxisSizingMode`, `counterAxisSizingMode`.
- Branch insertion strategy:
  - If `layoutMode !== "NONE"`, insert replacement by matching child index order and parent Auto Layout constraints. Do not rely on x/y.
  - If `layoutMode === "NONE"`, use inspected source `x/y` plus width derived from the source card.
- Set representative root properties:
  - `Like Count#21708:0`
  - `Reply Count#21708:1`
  - `Reply Author 1#21708:2`
  - `Reply Text 1#21708:3`
  - `Reply Author 2#21708:4`
  - `Reply Text 2#21708:5`
  - `↳ Show Reply Preview#21708:6`
  - `↳ Show Reaction Bar#21708:7`
- Verify nested `Lounge Card` is reachable for source title/description/date overrides.
- Enumerate the published component's child structure and record `hasActionBar`:
  - `hasActionBar=true` only if the component includes the bottom actions equivalent to `좋아요` and `댓글 쓰기`.
  - If `false`, the existing source `Bottom Button Area` is preserved as a separate action row and logged as an intentional delta from the published component contract.
- Remove probe.

### 3.5 CreationDecision Gate
Before mutation, write a schema-compatible `CreationDecision` packet to `component-mapping.md`.

Shared decision for the four homogeneous update cards:

```json
{
  "sourceUnitNodeId": "25972:54733",
  "candidateComponents": [
    "Lounge Update Item / key 1dd4808f25b6577b8e6f9e3379295665175bb53c",
    "Lounge Card",
    "createNew Lounge Update Card With Actions"
  ],
  "componentGroupNodeId": "21708:253",
  "componentGroupPath": "CDS > Components > Composed > Lounge Cards > Main content > Lounge Update Item",
  "placementReason": "Four repeated update-card wrappers share the Lounge Update Item information model: Lounge Card + reaction counts + reply preview.",
  "decision": "reuseExisting",
  "decisionReason": "Published CDS Lounge Update Item already owns the authored card/reaction/reply-preview structure, while the product wrappers are local frames around remote CDS parts.",
  "rejectedOptions": [
    "createNew: duplicates an existing published Lounge Update Item and increases CDS surface",
    "extend Lounge Card directly: mixes update-feed reaction/reply-preview behavior into generic Lounge Card",
    "extend unpublished Lounge Update Item action bar then replace same-turn: blocked because product file cannot consume unpublished CDS library changes"
  ],
  "variantExplosionRisk": "low",
  "exceptions": []
}
```

### 4. Product Replacement Batch
For each source card `25972:54734`, `25972:54739`, `25972:54744`, `25972:55344`:
- Read source text and nested instance data.
- Create a `Lounge Update Item` instance at the source card's x/y.
- Set width from inspected source card width. Current read-only evidence shows all four source cards are `343px` wide, but implementation must derive the value from each source node rather than hardcode it.
- Copy root counts/reply preview properties from source.
- Copy nested `Lounge Card` title, description, date, badge/addon properties.
- Property fallback:
  - If title, description, or date cannot be mapped, block that card and restore it from backup.
  - If a non-critical property cannot be mapped, log it as `intentionalDeltas`/`ContractException` and continue.
- If `hasActionBar=false`, move the existing `Bottom Button Area` out of the original wrapper and keep it immediately after the replacement instance in the active list, renamed `Updates Action Area`.
- Move original custom wrappers to the backup section created in Step 1. Do not hide originals. Do not delete originals until a later cleanup pass after full postflight PASS.
- Normalize misspelling `Upadates` -> `Updates` in new wrapper names.

Rollback:
- Treat the 4-card replacement as one batch.
- If any critical mapping or postflight check fails, restore all four cards from the backup section and remove partial replacement instances/action areas before retrying.

### 5. Postflight
- Verify `Creator Lounge Updates Screen` contains four `Lounge Update Item` instances.
- Verify no `Upadates Card` custom frames remain in the active list, or if an action-row wrapper remains, it is explicitly named `Updates Action Area` and contains only remote Button instances.
- Verify source text values are preserved for all four cards.
- Verify target section still has no local component instances and no missing main components.
- Verify protected node `28582:15332` was not mutated.
- Verify reference node `28587:14830` was not mutated and was used only as read/reference evidence if accessed.
- Verify each replacement instance traces to CDS component key `1dd4808f25b6577b8e6f9e3379295665175bb53c`.
- Run `git diff --check` for repo artifacts.

### 5.5 CompletionEvidence Gate
Write `completion-evidence.json` for this batch. Since this run reuses a published CDS component instead of creating/modifying a CDS component, scope `CompletionEvidence` to **use-site replacement evidence** and record the contract rationale explicitly.

Required fields:
- `sourceNodeId`: `25972:54733` plus individual source card IDs.
- `componentNodeId`: published CDS `Lounge Update Item` `21708:253` / key `1dd4808f25b6577b8e6f9e3379295665175bb53c`.
- `componentGroupPath`: `CDS > Components > Composed > Lounge Cards > Main content`.
- `sourceScreenshot` / `componentScreenshot`: store as Figma node IDs or generated export paths if export is available; otherwise record "Figma MCP screenshot tool unavailable" with node IDs and visual diff summary.
- `visualDiffSummary`: per-card text/structure/size preservation summary, including any intentional delta for the bottom action row.
- `propertyIntegrity`: `pass` only if all setProperties calls land on target nodes.
- `propertyReferenceMatrix`: root properties set and nested `Lounge Card` overrides verified.
- `instanceOverrideProbe`: temporary instance property override check on `Lounge Update Item`.
- `layoutContract`: parent layoutMode branch, child order, width derivation, action-row ownership.
- `structuralFidelity`: `pass`, because the component is a published authored CDS component, not image-backed.
- `tokenBindingSummary`: inherited from published component; product action row remote Buttons only.
- `responsiveProbe`: set representative instance to narrow/default/wide widths and check bounds if the component allows resizing; otherwise record fixed-width mobile component rationale.
- `longTextProbe`: representative long title/description override does not overlap or escape bounds.
- `boundsCheck`: replacement card/action area remains within `Updates Card List`.
- `exceptions`: intentional deltas and any unavailable screenshot/export limitation.

## Acceptance Criteria
- Analysis review: PASS.
- Plan review: PASS.
- Backup exists before product mutation.
- Active `Creator Lounge Updates Screen` uses published CDS `Lounge Update Item` instances for the four repeated update cards.
- No screenshot/bitmap-backed CDS component is created.
- Any screen not changed in this batch is explicitly classified in evidence, not ignored.
- `05-implementation.md` includes changed Figma node IDs and postflight checks.
- `06-record.md` states whether same-turn product replacement completed or whether publish/update blocked any remaining CDS-side extension.
