# Plan

## Gates

| Gate | PASS Criteria | FAIL State |
|------|---------------|------------|
| G1 Base card boundary | `Lounge Card` component set remains 2 variants (`1Line`, `2Line`) | New reply-preview variant is added to base `Lounge Card` |
| G2 Context placement | New component parent is `20726:2867` (`Lounge Cards > Main content`) | Component is left at page root/current selection/random group |
| G3 Reuse | New component nests existing `Lounge Card` and uses CDS primitives where possible | Rebuilds the full top card from raw frames |
| G4 Icon policy | No Phosphor icon remains in the new component | Reply icon remains `Phosphor Icons / chat-centered-dots` |
| G5 Contract sanity | Root Auto Layout, property references, long text, and bounds checks are acceptable | Root manual layout, stale properties, or obvious overlap |
| G6 Product path | Product node `28047:38198` is replaced or blocker is recorded with exact reason | Silent partial replacement |

## Sequence

1. Inspect CDS `Lounge Card`, group placement, and related primitives, then
   record a `CreationDecision` evidence packet before any Figma mutation.
2. Create `Lounge Update Item` in CDS file under `20726:2867`.
3. Use existing `Lounge Card` `State=2Line` instance as the top section.
   `2Line` is fixed for this wrapper because the update-item use case always
   needs title, date, and description before the reply-preview context. Do not
   expose `State` at the parent level in this first version.
4. Add `.Reaction Bar` as an inline authored section inside
   `Lounge Update Item`, not as a standalone CDS component in this run. The
   separate feed-screen run remains the SSOT owner for a future shared
   `Reaction Bar` component. This run will record the inline section node ID in
   `CompletionEvidence.intentionalDeltas` so the feed-screen run can later
   replace it with the standalone component. Use Lucide `heart` and `reply`
   icons only.
   - Source product node `28047:38238` has no share icon, so share is an
     intentional delta from the Feed Screen `Reaction Bar` anatomy.
5. Add `Reply Preview` with two default rows using `Avatar` instances and
   truncate-safe text.
   Anatomy:
   - `Reply Preview`: VERTICAL Auto Layout column, gap 6, horizontal fill.
   - Reply row: HORIZONTAL Auto Layout, height 20, gap 10.
   - Row children: `Avatar` 20x20 instance + author TEXT hug + reply text TEXT
     fill.
   - Reply text: single-line ellipsis / `textTruncation=ENDING`.
   - No divider in v1, matching source node `28047:38248`.
6. Add practical wrapper properties:
   - `Like Count`
   - `Reply Count`
   - `Reply Author 1`
   - `Reply Text 1`
   - `Reply Author 2`
   - `Reply Text 2`
   - `Show Reply Preview`
   - `Show Reaction Bar`
   - `Show Second Reply`
   Public Figma property names use existing CDS Title Case conventions for
   TEXT and `Show ...` Boolean conventions. This is an explicit local exception
   to the older R4 camelCase line, matching current components such as
   `Follow Recommendation Item` (`Name`, `Recommendation Text`,
   `Show Close Button`).
   Reply states:
   - 0 replies: `Show Reply Preview=false`
   - 1 reply: `Show Reply Preview=true`, `Show Second Reply=false`
   - 2 replies: both booleans true
   Nested `Lounge Card` exposure table:
   | Nested property | Parent exposure | Rationale |
   |---|---|---|
   | `Title` | expose as `Title` | changes per update item |
   | `↳ Description` | expose as `Description` | changes per update item |
   | `↳ Date` | expose as `Date` | changes per update item |
   | `Challenge Sub List` | expose as slot | varies by challenge association |
   | `Instance` / badge | expose as nested instance | updates may be Challenge/Follower/All |
   | `Show Button` | fixed true | overflow action always available in this use case |
   | `Show Thumbnail` | fixed false | source node hides thumbnail |
   | `Show Info Slot` | fixed false | reactions move to wrapper `.Reaction Bar` |
   | `Show Date Info` | fixed true | source node shows date |
   | `Show Description` | fixed true | source node shows description |
   | `Show Sub List` | fixed true | source node shows challenge sub list |
   | `Show Timestamp` | fixed false | source node hides timestamp |
7. Run full `CompletionEvidence` per `.claude/rules/component-contract.md`,
   including:
   - `propertyReferenceMatrix`
   - `instanceOverrideProbe`
   - `layoutContract`
   - `tokenBindingSummary`
   - `responsiveProbe` at narrow / 343 default / wide widths
   - `longTextProbe`
   - `boundsCheck`
   - `useSiteReplacement: pass | blocked`
   - `intentionalDeltas`
   - `exceptions`
8. Attempt product-file import/replacement for `28047:38198`; if blocked by
   unpublished library, record blocker and exact component key plus unblock
   trigger: publish CDS library and update the product file library.
9. Save implementation/review artifacts. Do not run `/record` if unrelated
   untracked files would be swept into `git add -A`.

## Acceptance Criteria

- New CDS component exists with a stable key and is named
  `Lounge Update Item`. The name is specific to the feed/news item role; it is
  not the generic layer name `Item`.
- Existing `Lounge Card` component set variant count is unchanged.
- New component is in the correct context group.
- New component can be instantiated and resized to product width 343.
- Product replacement either succeeds or is blocked only by publish/library
  update.
- Full `CompletionEvidence` packet is produced per component-contract.md,
  including intentional deltas and exceptions.
