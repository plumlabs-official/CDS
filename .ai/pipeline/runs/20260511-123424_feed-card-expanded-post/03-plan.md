# Plan

## Scope

Figma-only CDS update in `H36eNEd6o7ZTv4R7VcyLf2`, node `21721:6809`.

## Steps

1. Inspect existing CDS Feed Cards source components:
   - `Feed Card` node `21732:3062`
   - actual existing `Comment Item/Short` node `21725:2939`
   - surrounding text styles and color variables
2. Create a sibling `Comment Item` component set in the same `Main content`
   group (`21721:6812`). This is a `createNew` contract decision with existing
   component reuse as source evidence: do not combine/move the existing
   `21725:2939` source component because it already has live instances and
   exposed properties.
3. Create `Comment Item` component set with two variants:
   - `State=Collapsed`: cloned from `Comment Item/Short`, keeping the same
     one-line row, right `더보기`, and exposed properties.
   - `State=Expanded`: authored structure matching reference `28587:16570`:
     `Item Content Section`
     - `Item Content Default`: `Name` + `Item content > Description Slot`
     - `Item Content More`: full detail body
     - `Right Slot` node exists but is hidden by default so the shared property
       matrix remains valid; the `더보기` action is not visible in expanded
       default state
4. Property schema for the new component set:
   - Variant: `State = Collapsed | Expanded`
   - Text: `Name`
   - Text: `Description`
   - Text: `More Description`
   - Boolean: `Show Name`
   - Boolean: `Show More Description`
   - Boolean: `Show Right Slot` (references `Right Slot.visible` in both
     variants; Expanded default false)
   - Instance swap: `Right Slot` (references `Right Slot.mainComponent` in both
     variants)
5. Update `Feed Card` source component comment slot instances:
   - swap `Comment Slot 1` (`21732:3310`) to the new `Comment Item`
     `State=Collapsed` variant while preserving `visible` reference
     `Show Comment 1#21732:2` and `mainComponent` reference
     `Comment Slot 1#21737:4`.
   - swap `Comment Slot 2` (`21732:3318`) to the same collapsed variant while
     preserving `Show Comment 2#21732:3` and `Comment Slot 2#21737:5`.
   - update Feed Card preferred values for comment slots if Figma exposes the
     field; otherwise verify the slot instances still expose instance swap.
6. Keep text styles and fills bound to CDS tokens:
   - `text-sm/leading-normal/semibold`
   - `text-sm/leading-normal/normal`
   - `foreground`
7. Run Completion Gate checks:
   - no bitmap/image snapshot nodes created for UI structure
   - expanded variant has no `더보기`
   - expanded variant includes full detail structure
   - collapsed variant still has a `더보기` action
   - all new text nodes have text style and foreground token bindings
   - component roots and structural frames use Auto Layout
   - Property Reference Matrix: every text/boolean/instance-swap property maps
     to a target field or justified variant-only exception
   - instance override probe: `Name`, `Description`, and `More Description`
     update their target text nodes
   - responsive probe: 320/375/430 widths keep names, body text, and right slot
     inside bounds without overlap
   - longText probe: long name, long one-line description, and long body text
     preserve truncation/wrapping rules
   - bounds check: default row, body section, and hidden/right action remain
     inside component bounds
   - no detached raster wrapper or all-image subtree
   - useSiteReplacement is `blocked` until CDS publish/library update is
     available for the product file
8. Interaction scope:
   - CDS provides state variants only; it does not wire a prototype click.
   - Product/prototype interaction should swap from `State=Collapsed` to
     `State=Expanded` on `더보기` click.
9. Migration note:
   - Keep original `Comment Item/Short` (`21725:2939`) for backwards
     compatibility.
   - New Feed Card work should prefer the new `Comment Item` component set.

## Acceptance Criteria

- CDS has a reusable feed comment/post item that supports collapsed and expanded
  states.
- The expanded state visually and structurally matches the reference footer
  pattern from `28587:16570`.
- Existing Feed Card remains compatible with slot-based composition.
- Completion Gate PASS criteria are satisfied: property matrix, structural
  fidelity, layout contract, token binding, instance override, responsive,
  long-text, and bounds probes.
