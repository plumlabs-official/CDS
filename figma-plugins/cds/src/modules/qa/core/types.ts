export type ContractStatus = 'pass' | 'fail' | 'blocked';

export interface ContractException {
  ruleId: string;
  nodeId: string;
  nodeName?: string;
  reason: string;
  evidence: string;
  /** Remediation owner. For naming gates this is mandatory and distinct from approver. */
  owner?: string;
  /** Person who approved the temporary exception. Distinct from owner. */
  approver?: string;
  sourceReference?: string;
  /** ISO date (YYYY-MM-DD) for the next review. Required by naming gates. */
  review_at?: string;
  /** ISO date (YYYY-MM-DD) when the exception stops being valid. Required by naming gates. */
  expires_at?: string;
  revisit: string;
}

export interface ContractPaint {
  type?: string;
  boundVariables?: Record<string, unknown>;
  tokenEligible?: boolean;
  color?: unknown;
  boundTokenName?: string | null;
  boundTokenCollectionName?: string | null;
  isCdsModeBound?: boolean;
  matchedTokenName?: string | null;
  matchedTokenCollectionName?: string | null;
}

export interface ContractNode {
  id: string;
  name: string;
  type: string;
  isM3Anatomy?: boolean;
  isVariantPath?: boolean;
  hardcodedData?: boolean;
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
  textStyleName?: string | null;
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
  invalidTextStyle: string[];
  nonCdsColorBinding: string[];
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

export interface NamingGateViolation {
  ruleId: string;
  policySection: string;
  target: string;
  targetId: string;
  targetName: string;
  targetKind: string;
  currentName: string;
  suggestedName?: string;
  autofixable: boolean;
  exceptionRef?: string;
  status: 'fail' | 'warning' | 'excepted';
  message: string;
  sourceReference: string;
}

export interface NamingGateMetrics {
  checked: number;
  violationCount: number;
  blockingViolationCount: number;
  autofixableCount: number;
  activeExceptionCount: number;
  expiringExceptionCount: number;
}

export interface NamingGateSummary {
  status: ContractStatus;
  hardGate: boolean;
  policyVersion: string;
  metrics: NamingGateMetrics;
  violations: NamingGateViolation[];
  exceptions: ContractException[];
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
  namingGate: NamingGateSummary;
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
