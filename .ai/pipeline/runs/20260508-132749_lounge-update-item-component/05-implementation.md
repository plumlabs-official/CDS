# Implementation

## Summary

Created CDS composed component `Lounge Update Item` in the CDS Figma library.

## Figma Changes

| Item | Value |
|---|---|
| CDS file | `H36eNEd6o7ZTv4R7VcyLf2` |
| Component | `Lounge Update Item` |
| Component node | `21708:253` |
| Component key | `1dd4808f25b6577b8e6f9e3379295665175bb53c` |
| Parent group | `20726:2867` (`Components > Composed > Lounge Cards > Main content`) |
| Size | `343×294` |
| Base Lounge Card | Nested exposed instance `21708:254`, main variant `21141:4026` (`State=2Line`) |
| Inline Reaction Bar | `.Reaction Bar` `21708:299` |
| Reply Preview | `21708:311` |

## CreationDecision

```json
{
  "sourceUnitNodeId": "28047:38198",
  "candidateComponents": ["Lounge Card", "Feed Card", "Reaction Bar", "Reply Preview"],
  "componentGroupNodeId": "20726:2867",
  "componentGroupPath": "Components > Composed > Lounge Cards > Main content",
  "placementReason": "Lounge Update Item reuses Lounge Card and represents a feed/news item within the Lounge Cards context group.",
  "decision": "createNew",
  "decisionReason": "Reply preview and reaction bar are feed-item behavior, not a base Lounge Card density variant.",
  "rejectedOptions": ["extendExisting:Lounge Card variant", "create standalone Reaction Bar in this run"],
  "variantExplosionRisk": "low",
  "exceptions": []
}
```

## CompletionEvidence

| Field | Result |
|---|---|
| sourceNodeId | `CS2ZhrORl4E1szQfTe2UvO/28047:38198` |
| componentNodeId | `H36eNEd6o7ZTv4R7VcyLf2/21708:253` |
| componentGroupPath | `Components > Composed > Lounge Cards > Main content` |
| sourceScreenshot | `https://www.figma.com/api/mcp/asset/289bb6f2-3438-4dc5-ad42-3927a50267b6` |
| componentScreenshot | `https://www.figma.com/api/mcp/asset/5823b510-0ec1-4377-8db7-1ad97d37104e` |
| visualDiffSummary | Component is 343×294 vs source 343×302. Intentional delta: existing CDS `Lounge Card` instance owns its internal spacing; wrapper avoids double top/bottom padding. |
| propertyIntegrity | PASS |
| propertyReferenceMatrix | PASS — definitions 9, refs 9, unreferenced 0, dangling 0, field mismatches 0 |
| instanceOverrideProbe | PASS — Like/Reply counts, reply author/text, and `Show Second Reply=false` changed expected targets |
| layoutContract | PASS — root/sections/rows Auto Layout, bounds issues 0 |
| tokenBindingSummary | PASS — checked 6 authored text nodes, missing text style 0 |
| responsiveProbe | PASS — 320/343/430 widths: Lounge Card, `.Reaction Bar`, `Reply Preview` fill width |
| longTextProbe | PASS — long reply text remains single-line truncated; long author is clamped to 48×16 |
| boundsCheck | PASS — reply rows 20px, children ≤20px |
| useSiteReplacement | BLOCKED — product import failed because component key is not published/available yet |
| exceptions | `R2-naming-item` — see contract exception below |

### Contract Exceptions

```json
[
  {
    "ruleId": "R2-naming-item",
    "nodeId": "21708:253",
    "nodeName": "Lounge Update Item",
    "reason": "Item is semantically correct for a feed-level update entry; the component is more than a visual card.",
    "evidence": "The component wraps a Lounge Card, inline reaction counts, and reply-preview rows for the news/feed item role.",
    "sourceReference": "Team decision record 2026-05-08_lounge-updates-reply-preview-component-decision.md",
    "revisit": "If the component is reused outside feed/news contexts, rename to a more specific role or split the wrapper."
  }
]
```

## Product Replacement Attempt

Product file `CS2ZhrORl4E1szQfTe2UvO`, target node `28047:38198`:

```text
status: blocked
reason: importComponentByKeyAsync failed
error: Component with key "1dd4808f25b6577b8e6f9e3379295665175bb53c" not found
unblock: Publish CDS library, then update library in product file and retry replacement.
```

## Intentional Deltas

- `.Reaction Bar` is inline authored in this component, not a standalone CDS component. The feed-screen run remains SSOT owner for a future shared `Reaction Bar`; replace node `21708:299` when that component exists.
- No share icon: source lounge update node `28047:38238` has only like/reply counts. Feed Screen Reaction Bar may include share separately.
- Component name keeps `Item` because this is a feed-level update entry, not only a visual card. Revisit if reused outside feed/news context.

## Gate Results

| Gate | Result |
|---|---|
| G1 Base card boundary | PASS — `Lounge Card` component set remains 2 variants |
| G2 Context placement | PASS — parent is `20726:2867` |
| G3 Reuse | PASS — nested existing `Lounge Card`, Avatar, Lucide icons |
| G4 Icon policy | PASS — Phosphor count 0 |
| G5 Contract sanity | PASS |
| G6 Product path | BLOCKED by library publish/update only |
