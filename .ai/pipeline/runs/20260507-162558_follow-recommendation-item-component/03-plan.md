# Plan

## Objective

Create a new CDS standalone component named `Follow Recommendation Item` from product source node `CS2ZhrORl4E1szQfTe2UvO/28237:38430`.

## Target

- CDS file: `H36eNEd6o7ZTv4R7VcyLf2`
- Component name: `Follow Recommendation Item`
- Placement: `Components > Composed > Lounge Cards > Main content`
- Placement node: `20726:2867`
- Sibling reference: `Ranked Profile Item (21554:2)`

## Implementation Sequence

1. Re-read CDS placement group and dependency components.
2. Create a standalone `ComponentNode` under `Main content`, positioned next to existing sibling components.
3. Build Auto Layout structure:
   - Root horizontal row, `343 x 56`, hug vertical.
   - `Left` horizontal area with avatar and text area.
   - `Text Area` vertical group with `Name` and `Recommendation`.
   - `Recommendation` horizontal row with optional avatar group and text.
   - `Right Slot` horizontal row with action button and close button.
4. Reuse existing CDS instances:
   - `Avatar / Type=Image, Size=Large`
   - `Avatar Group` suitable 20px variant if available
   - `Button / Type=Default, State=Enabled, Size=Small`
   - `Button / Type=Ghost, State=Enabled, Size=Icon-Small`
5. Add component properties:
   - `Name` TEXT
   - `Recommendation Text` TEXT
   - `Show Recommendation Avatars` BOOLEAN
   - `Show Action` BOOLEAN
   - `Show Close` BOOLEAN
6. Set property references:
   - Name text `characters` -> `Name`
   - Recommendation text `characters` -> `Recommendation Text`
   - Recommendation avatar group `visible` -> `Show Recommendation Avatars`
   - Action button `visible` -> `Show Action`
   - Close button `visible` -> `Show Close`
7. Expose nested instances where useful:
   - Avatar
   - Recommendation Avatar Group
   - Action Button
   - Close Button
8. Validate:
   - component exists in correct parent path
   - root and structural frames use Auto Layout
   - property reference matrix has no stale/dangling TEXT/BOOLEAN props
   - instance override probe changes `Name` and `Recommendation Text`
   - responsive probes at 320/343/430 keep right actions inside bounds
   - long text probe does not overlap right actions
   - use-site replacement is attempted only if the new key is importable from product file; otherwise mark blocked pending publish

## Acceptance Criteria

- New CDS component is created at the target group.
- Source node remains unchanged.
- New component uses CDS primitives rather than hand-built avatar/button/icon shapes.
- Parent component has no unreferenced text/boolean properties.
- Component can create an instance and respond to override probes.
- Product file replacement status is explicitly recorded as pass/fail/blocked.

## Expected Blocker

Because new CDS components usually require library publish before product files can import the new key, use-site replacement may be blocked until the user publishes CDS and updates the product library.
