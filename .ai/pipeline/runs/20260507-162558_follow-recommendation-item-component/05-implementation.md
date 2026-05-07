# Implementation

## Result

Created CDS standalone component:

- Name: `Follow Recommendation Item`
- CDS file: `H36eNEd6o7ZTv4R7VcyLf2`
- Node ID: `21626:6700`
- Key: `a074a8a48b2dff38272ec94fff3b29ab34df6d92`
- Placement: `Components > Composed > Lounge Cards > Main content`
- Parent node: `20726:2867`

## Structure

```text
Follow Recommendation Item
  Left
    Avatar
    Text Area
      Name
      Recommendation
        Recommendation Avatar Group
        Recommendation Text
  Right Slot
    Action Button
    Close Button
```

## Reused CDS Primitives

- `Avatar / Type=Image, Size=Large`
- `Avatar Group / Size=2X Small`
- `Button / Type=Default, State=Enabled, Size=Small`
- `Button / Type=Ghost, State=Enabled, Size=Icon-Small`
- Source-matching `Lucide Icons / cross` key `ba86196f08de61efb4d75e2b17975b76d04a6453`

## Properties

- `Name#21626:0` TEXT -> `Name.characters`
- `Recommendation Text#21626:1` TEXT -> `Recommendation Text.characters`
- `Show Recommendation Avatars#21626:2` BOOLEAN -> `Recommendation Avatar Group.visible`
- `Show Action#21626:3` BOOLEAN -> `Action Button.visible`
- `Show Close#21626:4` BOOLEAN -> `Close Button.visible`

Nested instances exposed:

- `Avatar`
- `Recommendation Avatar Group`
- `Action Button`
- `Close Button`

## Completion Evidence

```ts
const completionEvidence = {
  sourceNodeId: "28237:38430",
  componentNodeId: "21626:6700",
  componentGroupPath: "Components > Composed > Lounge Cards > Main content",
  sourceScreenshot: "Verified through get_design_context on CS2ZhrORl4E1szQfTe2UvO/28237:38430",
  componentScreenshot: "Verified through get_design_context on H36eNEd6o7ZTv4R7VcyLf2/21626:6700",
  visualDiffSummary: "Matches source row structure: 48 avatar, name, 2-avatar social proof, recommendation text, follow action, close X. Corrected close icon to source-matching key.",
  propertyIntegrity: "pass",
  propertyReferenceMatrix: {
    definitions: 5,
    unreferenced: 0,
    danglingRefs: 0,
    fieldMismatches: 0,
    pass: true
  },
  instanceOverrideProbe: {
    pass: true,
    checked: ["Name", "Recommendation Text"]
  },
  useSiteReplacement: "blocked",
  intentionalDeltas: [
    "Component defaults use placeholder CDS avatar images; product overrides can replace exposed Avatar/Avatar Group images.",
    "Action Button label is controlled through exposed nested Button instance rather than parent text prop to avoid brittle nested Button references."
  ],
  layoutContract: {
    rootAutoLayout: true,
    structuralAutoLayout: true,
    rightActionRow: true,
    pass: true
  },
  tokenBindingSummary: {
    checkedTextNodes: 2,
    missingTextStyle: 0,
    missingFillBinding: 0,
    pass: true
  },
  responsiveProbe: {
    widths: [320, 343, 430],
    rightActionInsideBounds: true,
    leftBeforeRight: true,
    pass: true
  },
  longTextProbe: {
    nameOverride: "very_long_profile_name_that_should_truncate_cleanly",
    recommendationOverride: "친구 12명이 팔로우중이며 연락처에서도 추천됩니다",
    overlap: false,
    pass: true
  },
  boundsCheck: {
    avatarInsideRow: true,
    rightSlotInsideRow: true,
    textWithinLeftArea: true,
    pass: true
  },
  exceptions: [
    {
      ruleId: "use-site-replacement",
      nodeId: "21626:6700",
      nodeName: "Follow Recommendation Item",
      reason: "Product file cannot import new CDS component key until CDS library publish/update.",
      evidence: "CS2ZhrORl4E1szQfTe2UvO importComponentByKeyAsync returned: Component with key not found.",
      sourceReference: "Figma library publish workflow",
      revisit: "After publishing CDS and updating the 2026-05 product file library."
    }
  ]
}
```

## Product Import Check

Product file `CS2ZhrORl4E1szQfTe2UvO` cannot import key `a074a8a48b2dff38272ec94fff3b29ab34df6d92` yet.

Status: `blocked` until CDS publish/library update.

## Local Files Changed

- `.ai/pipeline/runs/20260507-162558_follow-recommendation-item-component/01-team-analysis.md`
- `.ai/pipeline/runs/20260507-162558_follow-recommendation-item-component/02-review.md`
- `.ai/pipeline/runs/20260507-162558_follow-recommendation-item-component/03-plan.md`
- `.ai/pipeline/runs/20260507-162558_follow-recommendation-item-component/04-plan-review.md`
- `.ai/pipeline/runs/20260507-162558_follow-recommendation-item-component/05-implementation.md`
- `.ai/pipeline/runs/20260507-162558_follow-recommendation-item-component/06-record.md`
- `.ai/pipeline/runs/20260507-162558_follow-recommendation-item-component/run.json`
