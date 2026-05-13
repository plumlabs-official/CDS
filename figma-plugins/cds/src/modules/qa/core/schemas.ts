import type { CompletionEvidence, CreationDecision } from './types';

const CREATION_REQUIRED = [
  'sourceUnitNodeId',
  'candidateComponents',
  'componentGroupNodeId',
  'componentGroupPath',
  'placementReason',
  'decision',
  'decisionReason',
  'rejectedOptions',
  'variantExplosionRisk',
  'exceptions',
];

const COMPLETION_REQUIRED = [
  'sourceNodeId',
  'componentNodeId',
  'componentGroupPath',
  'sourceScreenshot',
  'componentScreenshot',
  'visualDiffSummary',
  'propertyIntegrity',
  'propertyReferenceMatrix',
  'instanceOverrideProbe',
  'useSiteReplacement',
  'intentionalDeltas',
  'layoutContract',
  'structuralFidelity',
  'tokenBindingSummary',
  'namingGate',
  'responsiveProbe',
  'longTextProbe',
  'boundsCheck',
  'exceptions',
];

export const creationDecisionSchema = {
  type: 'object',
  required: CREATION_REQUIRED,
} as const;

export const completionEvidenceSchema = {
  type: 'object',
  required: COMPLETION_REQUIRED,
} as const;

export function validateCreationDecision(value: unknown): string[] {
  const failures = validateRequiredObject(value, CREATION_REQUIRED, 'creationDecision');
  if (failures.length > 0 || !value || typeof value !== 'object' || Array.isArray(value)) {
    return failures;
  }

  const decision = value as Record<string, unknown>;
  failures.push(...validateCreationDecisionShape(decision));
  if (decision.decision === 'createNew') {
    failures.push(...validateCreateNewReuseGate(decision));
  }
  return failures;
}

export function validateCompletionEvidence(value: unknown): string[] {
  return validateRequiredObject(value, COMPLETION_REQUIRED, 'completionEvidence');
}

export function isCompletionEvidence(value: unknown): value is CompletionEvidence {
  return validateCompletionEvidence(value).length === 0;
}

export function isCreationDecision(value: unknown): value is CreationDecision {
  return validateCreationDecision(value).length === 0;
}

function validateRequiredObject(value: unknown, required: string[], label: string): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [`${label} must be an object`];
  }
  const obj = value as Record<string, unknown>;
  return required.filter((key) => !(key in obj)).map((key) => `${label}.${key} is required`);
}

function validateCreationDecisionShape(decision: Record<string, unknown>): string[] {
  const failures: string[] = [];
  if (!['reuseExisting', 'extendExisting', 'createNew'].includes(String(decision.decision))) {
    failures.push('creationDecision.decision must be reuseExisting, extendExisting, or createNew');
  }
  if (!['low', 'medium', 'high'].includes(String(decision.variantExplosionRisk))) {
    failures.push('creationDecision.variantExplosionRisk must be low, medium, or high');
  }
  for (const key of ['candidateComponents', 'rejectedOptions', 'exceptions']) {
    if (!Array.isArray(decision[key])) failures.push(`creationDecision.${key} must be an array`);
  }
  for (const key of ['sourceUnitNodeId', 'componentGroupNodeId', 'componentGroupPath', 'placementReason', 'decisionReason']) {
    if (typeof decision[key] !== 'string' || (decision[key] as string).trim().length === 0) {
      failures.push(`creationDecision.${key} must be a non-empty string`);
    }
  }
  return failures;
}

function validateCreateNewReuseGate(decision: Record<string, unknown>): string[] {
  const failures: string[] = [];
  const hasException = hasApprovedReuseException(decision.exceptions);
  const existingCandidates = arrayOfStrings(decision.existingCandidates);
  const candidateComponents = arrayOfStrings(decision.candidateComponents);
  const candidates = [...existingCandidates, ...candidateComponents];
  const exactFit = decision.exactFit;
  const extendFit = decision.extendFit;
  const reuseRejectionEvidence = arrayOfStrings(decision.reuseRejectionEvidence);
  const expectedReuseCount = decision.expectedReuseCount;
  const productLocalAllowed = decision.productLocalAllowed;

  if (typeof exactFit !== 'boolean') failures.push('creationDecision.exactFit is required for createNew');
  if (typeof extendFit !== 'boolean') failures.push('creationDecision.extendFit is required for createNew');
  if (!Array.isArray(decision.existingCandidates)) {
    failures.push('creationDecision.existingCandidates is required for createNew');
  }
  if (!Array.isArray(decision.reuseRejectionEvidence)) {
    failures.push('creationDecision.reuseRejectionEvidence is required for createNew');
  } else if (reuseRejectionEvidence.length === 0 && !hasException) {
    failures.push('creationDecision.reuseRejectionEvidence must list why existing candidates cannot cover the use case');
  }
  if (typeof decision.createNewJustification !== 'string' || decision.createNewJustification.trim().length === 0) {
    failures.push('creationDecision.createNewJustification is required for createNew');
  }
  if (typeof expectedReuseCount !== 'number' || !Number.isInteger(expectedReuseCount) || expectedReuseCount < 0) {
    failures.push('creationDecision.expectedReuseCount must be a non-negative integer for createNew');
  }
  if (typeof productLocalAllowed !== 'boolean') {
    failures.push('creationDecision.productLocalAllowed is required for createNew');
  }

  if ((exactFit === true || extendFit === true) && !hasException) {
    const candidateText = candidates.length > 0 ? ` Candidates: ${candidates.join(', ')}` : '';
    failures.push(`creationDecision.createNew blocked: existing CDS coverage is exactFit=${exactFit} extendFit=${extendFit}.${candidateText}`);
  }
  if (typeof expectedReuseCount === 'number' && expectedReuseCount < 3 && !hasException) {
    const localText = productLocalAllowed === true
      ? ' productLocalAllowed=true means keep this as a product-local composition instead of public CDS.'
      : '';
    failures.push(`creationDecision.createNew blocked: expectedReuseCount must be at least 3 for public CDS creation.${localText}`);
  }
  return failures;
}

function hasApprovedReuseException(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  return value.some((exception) => {
    if (!exception || typeof exception !== 'object') return false;
    const obj = exception as Record<string, unknown>;
    const ruleId = typeof obj.ruleId === 'string' ? obj.ruleId : '';
    const hasEvidence = typeof obj.evidence === 'string' && obj.evidence.trim().length > 0;
    const hasRevisit = typeof obj.revisit === 'string' && obj.revisit.trim().length > 0;
    const hasApprovalSource =
      (typeof obj.approver === 'string' && obj.approver.trim().length > 0)
      || (typeof obj.sourceReference === 'string' && obj.sourceReference.trim().length > 0);
    return ruleId.includes('reuse') && hasEvidence && hasRevisit && hasApprovalSource;
  });
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}
