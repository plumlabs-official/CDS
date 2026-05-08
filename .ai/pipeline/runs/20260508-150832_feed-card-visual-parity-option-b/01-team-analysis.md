# 01 - Team Analysis: Feed Card Visual Parity Option B

Date: 2026-05-08
Mode: `/goal -play -director`
Project: CDS

## Request

Proceed with Claude handoff option B for the Feed Card visual parity issue:
create a CDS `Feed Lounge Strip` component, make it the `Feed Card` lounge slot
default, and verify the correction against the archived source feed cards.

## Evidence First

Source product frame `CS2ZhrORl4E1szQfTe2UvO/24112:14976`:

- `24112:14980` `Lounge Card` is a `FRAME`, not an instance, `componentId=null`,
  size `375x96`.
- Anatomy: `Challenge Thumbnail` instance, title text, `Avatar Group` instance,
  attendee sentence text, and chevron button.
- `24112:14977` header uses a `Profile Card` instance whose right slot contains
  a ghost icon button with `Lucide Icons / ellipsis`.
- `24112:14994` `Feed Content Section` contains a vector image asset.

Current replacement instance `CS2ZhrORl4E1szQfTe2UvO/28452:1811`:

- Root is a remote `Feed Card` instance, component key
  `1a348920b824461793300098c74f832f20f758b7`.
- Internal `Lounge Card Slot` is remote `State=1Line` Lounge Card, component key
  `639e6b6568820f4ee3b3e1a18c6d1dcc65743090`, size `375x100`.
- It uses an `Avatar`, hidden Updates Badge anatomy, and `Lounge Card Addon Block`
  count display. This does not match the source challenge-promotion strip.
- The `100` vs source `96` height drift is a minor spacing contributor. The
  primary failure is the wrong anatomy, not the 4px height difference.
- Header right slot currently shows `Lucide Icons / plus`, not ellipsis.
- `Feed Content Section` is a gray placeholder.

## Problem

The failed parity is not primarily an image-copy bug. The main issue is component
selection: a Lounge Updates/announcement card was reused where the source screen
uses a feed-specific challenge-promotion strip. This violates the CDS rule that
only matching anatomy should be replaced by the same component.

## Options

Option A: Patch current product instances deeply inside slots.

- Pros: no new component.
- Cons: fragile overrides, still uses the wrong source component contract.

Option B: Create `Feed Lounge Strip` in CDS and use it as the Feed Card lounge
slot default.

- Pros: matches source anatomy, preserves a reusable CDS contract, aligns with
  the "same structure only" rule.
- Cons: requires CDS publish and product library update.

Option C: Rebuild `Feed Card` internal anatomy without a separate component.

- Pros: no standalone component.
- Cons: bigger Feed Card contract change and less reusable.

## Recommendation

Choose option B.

## Director Gates

| Gate | Pass Criteria | Failure State |
|---|---|---|
| G1 Component placement | `Feed Lounge Strip` exists under `Components > Composed > Feed Cards > Main content` | Component created on page/root or unrelated group |
| G2 Anatomy | Component has 375x96 horizontal structure with Challenge Thumbnail, title, Avatar Group attendee, attendee text, chevron right action | Avatar/Add-on-count Lounge Card anatomy remains |
| G3 Feed Card contract | CDS `Feed Card` lounge slot default points to `Feed Lounge Strip`, or contains a direct `Feed Lounge Strip` instance if INSTANCE_SWAP default mutation is blocked by Plugin API | Default still points to `Lounge Card State=1Line` |
| G4 Visual source fixes | Header right slot, lounge strip, and media placeholder issues are documented for product-side update after publish | User cannot tell what remains blocked by publish/update |
| G5 Recordability | Run artifacts, review record, SESSION/HANDOFF updates are present | No audit trail |

## Risks

- Product file cannot receive the changed remote component until the user publishes
  CDS and updates the library in `2026-05`.
- Figma `INSTANCE_SWAP` defaults have environment-specific quirks. Previous run
  found `mainComponent.id` more reliable than component key for default values.
- Existing six product instances may need library update or re-application after
  CDS publish.
