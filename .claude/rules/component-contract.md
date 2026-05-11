# CDS Component Contract

CDS 컴포넌트 생성/수정의 실행 계약입니다. `qa-rubric.md`는 점수와 감점만 관리하고, 이 문서는 gate 알고리즘, evidence schema, probe, 예외 형식을 관리합니다.

## Gate Model

| Gate | 실행 시점 | 실패 처리 |
|------|-----------|-----------|
| Creation Gate | Figma mutation 전 | 생성/수정 중단 |
| Completion Gate | 최종 보고 전 | handoff 중단 |

### Creation Gate Evidence

```ts
type CreationDecision = {
  sourceUnitNodeId: string;
  candidateComponents: string[];
  componentGroupNodeId: string;
  componentGroupPath: string;
  placementReason: string;
  decision: "reuseExisting" | "extendExisting" | "createNew";
  decisionReason: string;
  rejectedOptions: string[];
  variantExplosionRisk: "low" | "medium" | "high";
  exceptions: ContractException[];
};
```

### Completion Evidence

```ts
type CompletionEvidence = {
  sourceNodeId: string;
  componentNodeId: string;
  componentGroupPath: string;
  sourceScreenshot: string;
  componentScreenshot: string;
  visualDiffSummary: string;
  propertyIntegrity: "pass" | "fail";
  propertyReferenceMatrix: PropertyReferenceMatrixSummary;
  instanceOverrideProbe: ProbeSummary;
  useSiteReplacement: "pass" | "fail" | "blocked";
  intentionalDeltas: string[];
  layoutContract: LayoutContractSummary;
  structuralFidelity: StructuralFidelitySummary;
  tokenBindingSummary: TokenBindingSummary;
  responsiveProbe: ProbeSummary;
  longTextProbe: ProbeSummary;
  boundsCheck: ProbeSummary;
  exceptions: ContractException[];
};
```

Final Handoff means any final response after creating, modifying, or extending a CDS component. Final Handoff requires a full `CompletionEvidence` packet. Quick screen review may return a partial score, but must not mark component work complete without the packet.

## Structural Fidelity

Publishable CDS components must be authored component structure, not a screenshot or raster layer wrapped in a component.

| Rule | PASS 기준 |
|------|-----------|
| image-backed-component | component/variant root is not a single raster/image-backed layer or an all-image subtree |
| authored-structure | component contains meaningful TEXT, INSTANCE, VECTOR, layout, property, or token signal |
| exception-boundary | `ContractException` can document recovery or quarantine, but cannot turn image-backed structure into PASS |

Compact output:

```ts
type StructuralFidelitySummary = {
  status: "pass" | "fail";
  issues: string[];
  imageBacked: boolean;
  checked: number;
  rasterPaintCount: number;
  structuralNodeCount: number;
  tokenOrPropertySignalCount: number;
  exceptions: ContractException[];
  truncated?: boolean;
};
```

If `structuralFidelity.status === "fail"`, Completion Gate is FAIL regardless of visual parity or exceptions. Image-backed components may remain only as `recovery`, `reference`, or `quarantine/remediationRequired` artifacts.

Feed screen remediation note:
- Manual completed screen `CS2ZhrORl4E1szQfTe2UvO/28582:15332` is protected and must not be mutated by automated remediation.
- Remaining/original source screen section `CS2ZhrORl4E1szQfTe2UvO/28587:14830` may be used as source/reference evidence.

## Layout Contract

Card, row, list, and composed component roots must use Auto Layout unless an exception records why absolute/manual layout is intentional.

| Rule | PASS 기준 |
|------|-----------|
| root-auto-layout | component/variant root has `layoutMode !== NONE` |
| structural-auto-layout | Header/Body/Info/Meta/Action/Description role frames use Auto Layout |
| text-fill | Title/Description/name text uses `FILL` or L+R stretch |
| right-action-row | timestamp/detail/action uses an Auto Layout row, not absolute x/y |
| title-growth | 1행→2행 title grows upward in a fixed left/bottom title slot |
| bounded-text | fixed-height name/body text uses truncation or line clamp |

Known spacer nodes, such as `Hero Spacer`, require a fixture exception. They are not silently ignored.

## Property Reference Matrix

Variant properties are the only properties that may lack a child reference. TEXT, BOOLEAN, and INSTANCE_SWAP properties must resolve to target fields or matching exposed instance evidence.

| Property type | Expected target field |
|---------------|-----------------------|
| TEXT | `characters` |
| BOOLEAN | `visible` |
| INSTANCE_SWAP | `mainComponent` |

Nested instance children are scoped to their own component contract and must not be counted as dangling references for the parent component. The parent matrix inspects the instance node itself, then stops traversal at that instance subtree. `isExposedInstance=true` is valid evidence only when it can be matched to the root definition key and recorded in `exposedInstanceEvidence`.

PASS requires:
- `unreferenced.length === 0`
- `danglingRefs.length === 0`
- `fieldMismatches.length === 0`

## Token Binding Summary

Audit token-eligible authored nodes only. CDS nested instance internals are excluded unless the current component exposes or overrides them.

| Surface | PASS 기준 |
|---------|-----------|
| text style | TEXT nodes have `textStyleId` or an exception |
| text variables | token-eligible TEXT nodes have relevant `boundVariables` |
| fills/strokes/effects | token-eligible paints/effects are variable/style bound |
| hardcoded colors | `hardcodedTokenEligibleColors === 0` |

Token eligibility is derived per audit run from live Figma metadata: local variable collections, text/paint/effect styles, and source/reference `boundVariables`. Do not rely on a stale JSON token snapshot.

Compact output:

```ts
type TokenBindingSummary = {
  checked: number;
  missingTextStyle: string[];
  missingFillBinding: string[];
  missingStrokeBinding: string[];
  missingEffectBinding: string[];
  hardcodedTokenEligibleColors: string[];
  exceptions: ContractException[];
  truncated?: boolean;
};
```

## Probes

Mutation probes must be temporary and cleanup-safe.

```js
const runId = `contract-${Date.now()}`;
const probe = component.createInstance();
try {
  probe.setPluginData("contract-probe", runId);
  figma.currentPage.appendChild(probe);
  probe.setProperties({ [titleKey]: "Probe Title" });
  // verify target node value changed
} finally {
  probe.remove();
}
const leftovers = figma.root.findAll((n) => n.getPluginData("contract-probe") === runId);
if (leftovers.length > 0) throw new Error("contract probe cleanup failed");
```

Required probes:
- `instanceOverrideProbe`: representative exposed properties change target nodes.
- `responsiveProbe`: narrow/default/wide widths preserve edge controls and L+R content bounds.
- `longTextProbe`: 2-line title, long name, and long description do not overlap.
- `boundsCheck`: card/image/avatar/overlay/action rows remain inside expected bounds.

## Exceptions

```ts
type ContractException = {
  ruleId: string;
  nodeId: string;
  nodeName?: string;
  reason: string;
  evidence: string;
  approver?: string;
  sourceReference?: string;
  revisit: string;
};
```

Exceptions without `evidence` and either `approver` or `sourceReference` are FAIL. Exceptions must have a revisit condition.

## Output Budget

`use_figma` responses must stay compact.

- Return counts and node IDs, not full node JSON.
- Cap each violation category at 50 IDs.
- Set `truncated: true` when a category is capped.
- Store screenshots externally and return paths or Figma image refs, not base64.
