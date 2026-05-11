# Team Analysis

## Request

Add CDS support for an expandable feed post/comment detail state. In the source
feed card instance `CS2ZhrORl4E1szQfTe2UvO/28587:18399`, clicking `더보기` on
the first written-post row should reveal the expanded structure shown in
`CS2ZhrORl4E1szQfTe2UvO/28587:16570`.

## Evidence

- Collapsed card `28587:18399` currently uses a one-line row:
  `Comment Slot 1` with name `김영재`, truncated description, and a visible
  `더보기` right action.
- Expanded footer `28587:16570` uses:
  `Item Content Section`
  - `Item Content Default`: name + one-line summary
  - `Item Content More`: full multi-paragraph body text
  - no `더보기` button in the expanded first item
- Live Figma read (`get_design_context`) confirmed the structure above.
- CDS section root is `H36eNEd6o7ZTv4R7VcyLf2/21721:6809`.
- CDS placement target is `Main content` node `21721:6812` under
  `Components > Composed > Feed Cards`.
- Existing related CDS source component:
  `Comment Item/Short` node `21725:2939`, key
  `f2d39007910743ce240c9f8591ab766d2a9dcec3`.

## Options

### Option A: Extend Existing Comment Item

Extend the existing feed comment item family by adding a collapsed/expanded
state, preserving the current one-line short row while adding the expanded
body structure as a sibling variant.

Pros:
- Reuses the existing `Comment Item/Short` semantics.
- Keeps Feed Card comment slots compatible with current usage.
- Lowest risk for duplicate component proliferation.

Cons:
- Requires careful component-set or sibling component construction so existing
  instances are not disrupted.

### Option B: Create Sibling Feed Comment Item Set

Create a new sibling `Comment Item` component set in the same Feed Cards group,
using `Comment Item/Short` as the collapsed source reference and leaving the
existing `21725:2939` component untouched for backwards compatibility.

Pros:
- Lower immediate risk to existing `Comment Item/Short` instances.
- Allows a clean `State=Collapsed | Expanded` variant axis.

Cons:
- Technically a `createNew` contract decision even though it extends the same
  semantic area.
- Requires stronger justification and migration guidance.
- Higher chance of future design-system drift.

### Option C: Add Expanded Boolean Directly To Feed Card

Bake expanded post detail into `Feed Card` via a boolean-controlled internal
section.

Pros:
- Easy for this one feed-card use case.

Cons:
- Couples comment detail behavior to Feed Card.
- Makes reuse outside Feed Card harder.
- Increases Feed Card property complexity.

## Creation Gate Pre-Analysis

```ts
const creationDecision = {
  sourceUnitNodeId: "CS2ZhrORl4E1szQfTe2UvO/28587:16570",
  candidateComponents: [
    "Comment Item/Short (21725:2939)",
    "Feed Card (21732:3062)",
    "new Feed Comment Item component set"
  ],
  componentGroupNodeId: "21721:6812",
  componentGroupPath: "Components > Composed > Feed Cards > Main content",
  placementReason: "The target behavior belongs to Feed Card footer comment/post items and must live with existing Feed Cards composed components.",
  decision: "createNew",
  decisionReason: "Create a sibling Comment Item component set because directly combining or moving existing Comment Item/Short (21725:2939) risks breaking existing instances and exposed properties. The new set still reuses the existing component as the collapsed structural reference.",
  rejectedOptions: [
    "reuseExisting unchanged: cannot show full multi-paragraph detail without structural change",
    "extendExisting by moving 21725:2939 into a component set: destructive to existing instances/property definitions",
    "Feed Card boolean-only: couples reusable comment detail structure to one parent component"
  ],
  variantExplosionRisk: "low",
  exceptions: []
};
```

## Recommendation

Create a sibling `Comment Item` component set in the existing Feed Cards group,
using `Comment Item/Short` as the collapsed reference while leaving the original
component intact:

- `Feed Comment Item / State=Collapsed`
  - same visual role as the current `Comment Item/Short`
  - name + one-line text + optional `더보기`
- `Feed Comment Item / State=Expanded`
  - same name + one-line summary structure as the reference
  - full detail body below in a separate `Item Content More` section
  - no `더보기` action

Update the Feed Card source component to include the new component instances in
its comment slots so future Feed Card instances can swap collapsed/expanded
states without bitmap work or detaching structure.

## Constraints

- Do not create bitmap snapshots for UI structure.
- Keep avatar/content images only where they are actual content.
- Preserve tokenized typography/color behavior from the Feed Cards token pass.
- Do not modify the provided source screen nodes.
- New or extended CDS components must pass Creation Gate and Completion Gate in
  `.claude/rules/component-contract.md`, including structural fidelity,
  property reference matrix, layout contract, token binding summary, and
  cleanup-safe probes.
