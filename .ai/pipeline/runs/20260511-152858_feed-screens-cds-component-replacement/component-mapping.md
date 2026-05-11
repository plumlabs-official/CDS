# Component Mapping

## CreationDecision
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

## Runtime Probe Decision

The initial `CreationDecision` selected `reuseExisting` because `Lounge Update Item` is the closest published CDS component. Controller-side Figma probes invalidated same-turn replacement:

- Published `Lounge Update Item` default size: `343x286`.
- Source card heights: `316`, `220`, `190`, `148`.
- `Updates Card List` is `layoutMode=VERTICAL`, so replacement must preserve child order and measured heights.
- `Lounge Update Item` has no bottom action bar equivalent to `좋아요` / `댓글 쓰기`.
- Resizing the component to source heights produced bounds failures:
  - `25972:54734`: info slot/timestamp escapes root width.
  - `25972:54739`: footer/reply preview extends beyond 220px root.
  - `25972:54744`: nested Lounge Card height 200 exceeds 190px root.
  - `25972:55344`: nested Lounge Card, challenge sub list, and footer exceed 148px root.

Updated decision:

```json
{
  "sourceUnitNodeId": "25972:54733",
  "decision": "blocked",
  "decisionReason": "Existing published Lounge Update Item cannot safely replace the active product update-card wrappers without clipping or height drift.",
  "rejectedOptions": [
    "same-turn reuseExisting replacement: bounds and action-bar ownership fail",
    "resize published Lounge Update Item to source heights: out-of-bounds children remain",
    "partial replacement leaving local wrapper: does not satisfy CDS component replacement requirement"
  ],
  "recommendedNext": "Create or extend a CDS update-card component that owns compact heights and bottom action bar, then publish/update before product replacement."
}
```

## Screen-Level Mapping (Current Run)
- `25972:54703` / `25972:54733`: `replacement-target`
  - Reason: contains 4 repeated local `Upadates Card` wrappers around remote CDS pieces.
- Other screens/sections under `22206:21655`: `verify-only`
  - Reason: already remote CDS-heavy and out of this bounded replacement batch.
- Exclusions: Splash/iOS push/OS-native mockups: `follow-up`

## Replacement Targets
- Source wrappers:
  - `25972:54734`
  - `25972:54739`
  - `25972:54744`
  - `25972:55344`
- Target component:
  - `CDS fileKey`: `H36eNEd6o7ZTv4R7VcyLf2`
  - `componentNodeId`: `21708:253`
  - `componentKey`: `1dd4808f25b6577b8e6f9e3379295665175bb53c`

## Worker Execution Note
- Mapping authored here; actual Figma mutation and proof capture are controller-serial tasks.

## Controller Execution Note
- Controller ran connected Figma probes and did not perform permanent product mutation because the published component failed the bounds/height fit gate.
- Evidence: `figma-probe-results.json`.
