export type ContractStatus = 'pass' | 'fail' | 'blocked';

export interface ContractException {
  ruleId: string;
  nodeId: string;
  nodeName?: string;
  reason: string;
  evidence: string;
  approver?: string;
  sourceReference?: string;
  revisit: string;
}

export interface ContractPaint {
  type?: string;
  boundVariables?: Record<string, unknown>;
  tokenEligible?: boolean;
  color?: unknown;
}

export interface ContractNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  layoutMode?: string;
  layoutSizingHorizontal?: string;
  layoutSizingVertical?: string;
  layoutAlign?: string;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  textAlignHorizontal?: string;
  textAlignVertical?: string;
  textAutoResize?: string;
  textTruncation?: string;
  textStyleId?: string | symbol | null;
  gridStyleId?: string | symbol | null;
  effectStyleId?: string | symbol | null;
  boundVariables?: Record<string, unknown>;
  fills?: ContractPaint[] | symbol;
  strokes?: ContractPaint[] | symbol;
  effects?: Array<{ boundVariables?: Record<string, unknown>; tokenEligible?: boolean }> | symbol;
  componentPropertyDefinitions?: Record<string, ContractPropertyDefinition>;
  componentPropertyReferences?: Record<string, string>;
  componentProperties?: Record<string, unknown>;
  isExposedInstance?: boolean;
  tokenEligible?: boolean;
  children?: ContractNode[];
}

export interface ContractPropertyDefinition {
  name?: string;
  type: string;
  defaultValue?: unknown;
  variantOptions?: string[];
}

export interface PropertyReferenceTarget {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  field: string;
}

export interface ExposedInstanceEvidence {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  evidence: 'isExposedInstance';
}

export interface PropertyReferenceMatrixRow {
  key: string;
  name?: string;
  type: string;
  targets: PropertyReferenceTarget[];
  exposedInstanceEvidence: ExposedInstanceEvidence[];
}

export interface PropertyFieldMismatch extends PropertyReferenceTarget {
  key: string;
  type: string;
  expectedField: string;
}

export interface PropertyReferenceMatrixSummary {
  definitionCount: number;
  nonVariantDefinitionCount: number;
  referencedNonVariantCount: number;
  matrix: PropertyReferenceMatrixRow[];
  unreferenced: PropertyReferenceMatrixRow[];
  danglingRefs: string[];
  fieldMismatches: PropertyFieldMismatch[];
  truncated?: boolean;
}

export interface TokenBindingSummary {
  checked: number;
  missingTextStyle: string[];
  missingFillBinding: string[];
  missingStrokeBinding: string[];
  missingEffectBinding: string[];
  hardcodedTokenEligibleColors: string[];
  exceptions: ContractException[];
  truncated?: boolean;
}

export interface LayoutContractSummary {
  issues: string[];
  checked: number;
  exceptions: ContractException[];
  truncated?: boolean;
}

export interface StructuralFidelitySummary {
  status: 'pass' | 'fail';
  issues: string[];
  imageBacked: boolean;
  checked: number;
  rasterPaintCount: number;
  structuralNodeCount: number;
  tokenOrPropertySignalCount: number;
  exceptions: ContractException[];
  truncated?: boolean;
}

export interface ProbeSummary {
  pass: boolean;
  checked?: number;
  failures?: string[];
  truncated?: boolean;
}

export interface CompletionEvidence {
  sourceNodeId: string;
  componentNodeId: string;
  componentGroupPath: string;
  sourceScreenshot: string;
  componentScreenshot: string;
  visualDiffSummary: string;
  propertyIntegrity: ContractStatus;
  propertyReferenceMatrix: PropertyReferenceMatrixSummary;
  instanceOverrideProbe: ProbeSummary;
  useSiteReplacement: ContractStatus;
  intentionalDeltas: string[];
  layoutContract: LayoutContractSummary;
  structuralFidelity: StructuralFidelitySummary;
  tokenBindingSummary: TokenBindingSummary;
  responsiveProbe: ProbeSummary;
  longTextProbe: ProbeSummary;
  boundsCheck: ProbeSummary;
  exceptions: ContractException[];
}

export interface CreationDecision {
  sourceUnitNodeId: string;
  candidateComponents: string[];
  componentGroupNodeId: string;
  componentGroupPath: string;
  placementReason: string;
  decision: 'reuseExisting' | 'extendExisting' | 'createNew';
  decisionReason: string;
  rejectedOptions: string[];
  variantExplosionRisk: 'low' | 'medium' | 'high';
  exceptions: ContractException[];
}

export interface ComponentContractFixture {
  name: string;
  mode: 'live' | 'synthetic';
  fileKey?: string;
  sourceNodeId?: string;
  componentNodeId?: string;
  componentSetNodeId?: string;
  input?: Record<string, unknown>;
  expected: Record<string, unknown>;
  exceptions?: ContractException[];
}

export interface FixtureResult {
  name: string;
  pass: boolean;
  failures: string[];
}
