# Team Analysis

## Problem

User asked to create a CDS component from product Figma node:

- Product file: `CS2ZhrORl4E1szQfTe2UvO` (`2026-05`)
- Source node: `28237:38430`
- Source screen: `Follow Management Screen`
- Source node name: `Invite Profile Card`

The user then requested `-play` validation before proceeding.

## Evidence

Read-only Figma inspection found:

- `28237:38430` is a `FRAME`, not an `INSTANCE`.
- It has no `componentId`.
- Root size is `343 x 56`, horizontal Auto Layout, left content plus right action row.
- Immediate parent is `Recommended List (28237:37706)`.
- Ancestor screen is `Follow Management Screen (28237:37689)`.
- Same page has 29 nodes named `Invite Profile Card`.
- Of those, 24 are local `FRAME` rows in `Follow Management Screen` recommended lists.
- 5 are existing CDS `Invite Profile Card` instances in `Discover Lounge Screen`.

Existing CDS component scan found:

- `Invite Profile Card` exists at `Components > Composed > Invite Composed > Content`.
- It is a `COMPONENT_SET` with `Type=Vertical/Horizontal` and `Selected=True/False`.
- Its props are invite/selection oriented: `Show Follower`, `Show Button`, `Show Delete`, `Selected`.
- `Ranked Profile Item` exists as a standalone component at `Components > Composed > Lounge Cards > Main content`.
- Recommended placement for this new component is the same `Main content` group, beside `Ranked Profile Item`.

Source row semantics:

- Primary content: avatar + profile/lounge name.
- Secondary content: recommendation/social proof text, for example `친구 2명이 팔로우`, `당신을 위한 추천`, `연락처에서 추천`, `3.2K가 팔로우`.
- Optional secondary avatars appear before the text in some rows.
- Right actions: primary follow/follow-back button and optional dismiss button.

## Options

### Option A: Reuse existing `Invite Profile Card`

Rejected.

Reason: the existing component is invite and selection oriented. Adding follow recommendation behavior would make its responsibility ambiguous and would add props that are not invite-specific.

### Option B: Extend `Invite Profile Card` with a new variant

Rejected.

Reason: variant axis would mix two product domains: invite selection and follow recommendation. This increases variant and prop complexity in a component that was recently cleaned up.

### Option C: Create standalone `Follow Recommendation Item`

Recommended.

Reason: repeated 24 times, domain semantics differ from invite, and the source is already a compact row/list item pattern. It can still reuse CDS primitives internally.

## Creation Gate Evidence

```ts
const creationDecision = {
  sourceUnitNodeId: "28237:38430",
  candidateComponents: [
    "Invite Profile Card (20355:3353)",
    "Ranked Profile Item (21554:2)",
    "Avatar (20087:30952)",
    "Avatar Group (20087:31019)",
    "Button (20012:238)"
  ],
  componentGroupNodeId: "20726:2867",
  componentGroupPath: "Components > Composed > Lounge Cards > Main content",
  placementReason: "Follow recommendation is a reusable lounge/profile list item, closest to Ranked Profile Item and other lounge main-content composed components.",
  decision: "createNew",
  decisionReason: "The source pattern is repeated as local frames and has recommendation/follow semantics that should not expand Invite Profile Card.",
  rejectedOptions: [
    "reuseExisting Invite Profile Card: semantics mismatch",
    "extendExisting Invite Profile Card: variant/prop pollution risk"
  ],
  variantExplosionRisk: "low",
  exceptions: []
}
```

## Recommended Component

Name: `Follow Recommendation Item`

Structure:

```text
Follow Recommendation Item
  Left
    Avatar
    Text Area
      Name
      Recommendation
        Avatar Group
        Recommendation Text
  Right Slot
    Action Button
    Close Button
```

Core properties:

- `Name` text property.
- `Recommendation Text` text property.
- `Show Recommendation Avatars` boolean.
- `Show Action` boolean.
- `Show Close` boolean.
- Expose nested `Avatar`, `Avatar Group`, `Action Button`, and `Close Button` instances where possible.

## Risks

- Figma parent-level text props cannot always cleanly override nested Button internals. Guardrail: expose the nested Button instance if direct label reference is not reliable.
- Source rows include both people and lounge names. Guardrail: name component by behavior (`Follow Recommendation Item`), not by person-only object.
- Use-site replacement requires CDS publish and product library update. If import by new key is blocked before publish, record as `blocked`.

## Recommendation

Proceed with Option C: create `Follow Recommendation Item` as a standalone CDS component in `Components > Composed > Lounge Cards > Main content`, reusing existing CDS `Avatar`, `Avatar Group`, `Button`, and `Lucide Icons / x/cross` instances.
