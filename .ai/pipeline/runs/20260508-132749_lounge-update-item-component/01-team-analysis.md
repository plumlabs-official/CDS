# Team Analysis

## Request

Create a CDS composed component for lounge update/news feed items with reaction
counts and latest reply preview. Reuse the existing `Lounge Card`; do not add a
new variant directly to the base `Lounge Card` unless evidence shows it is the
correct component boundary.

## Evidence

- Product file: `CS2ZhrORl4E1szQfTe2UvO`.
- Existing use-site node `25945:38066` is a remote CDS `INSTANCE` of
  `Lounge Card`.
- Proposed node `28047:38198` is a hand-built `FRAME`, not a CDS instance.
- Existing CDS `Lounge Card` component set in CDS file
  `H36eNEd6o7ZTv4R7VcyLf2` is `20710:2996`, under
  `Components > Composed > Lounge Cards > Main content` (`20726:2867`).
- Existing `Lounge Card` variants are `State=1Line` and `State=2Line`; the
  `State` axis is content-density, not reply-notification state.
- Proposed frame adds two new zones: `Reaction Bar` and `Reply Preview`.
- Proposed frame uses `Phosphor Icons / chat-centered-dots`; CDS icon policy
  requires Lucide.

## Options

### A. Add a new `Lounge Card` variant

Pros:
- Maximum visual reuse.
- Product designers choose one component only.

Cons:
- Mixes density state with feed activity state.
- Expands an already broad `Lounge Card` property surface.
- Forces comment-preview data into every base card use case.
- Higher variant/property drift risk.

### B. Create a new composed wrapper component

Pros:
- Preserves base `Lounge Card` responsibility.
- Maps cleanly to implementation: `LoungeCard + ReactionBar + ReplyPreview`.
- Lets reply preview evolve independently.
- Reuses existing CDS instances while avoiding base component bloat.

Cons:
- One additional component to document and publish.

## Recommendation

Proceed with option B: create a new composed component named
`Lounge Update Item` under `Lounge Cards > Main content`.

## Scope

- Create CDS component `Lounge Update Item`.
- Nest existing `Lounge Card` instance.
- Add authored lower sections: `Reaction Bar` and `Reply Preview`.
- Use CDS `Avatar`, `Button`, `Challenge Thumbnail`, `Updates Badge`, and Lucide
  icons where applicable.
- Replace or avoid the Phosphor icon.
- Prepare/validate product-file replacement for `28047:38198`.

## Risks

- Newly-created CDS component cannot be imported in product file until the CDS
  library is published and product library is updated.
- Figma Plugin API cannot force library publish; product replacement may be
  blocked at import time.
- Existing untracked pipeline run in repo makes automatic `/record` unsafe.
