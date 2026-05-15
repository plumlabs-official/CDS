import type { CompletionEvidence, ContractException, CreationDecision } from './types';

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
  const failures = validateRequiredObject(value, COMPLETION_REQUIRED, 'completionEvidence');
  if (failures.length > 0 || !value || typeof value !== 'object' || Array.isArray(value)) {
    return failures;
  }

  failures.push(...validateCompletionEvidenceShape(value as Record<string, unknown>));
  return failures;
}

export function validateContractException(exception: ContractException, now: Date | string = new Date()): string[] {
  const errors: string[] = [];
  if (!exception.reason) errors.push('reason is required');
  if (!exception.evidence) errors.push('evidence is required');
  if (!exception.approver) errors.push('approver is required');
  if (!exception.sourceReference) errors.push('sourceReference is required');
  if (!exception.revisit) errors.push('revisit is required');
  if (exception.review_at && !isIsoDate(exception.review_at)) errors.push('review_at must be YYYY-MM-DD');
  if (exception.expires_at && !isIsoDate(exception.expires_at)) errors.push('expires_at must be YYYY-MM-DD');
  if (exception.expires_at && isIsoDate(exception.expires_at) && parseIsoDate(exception.expires_at) < startOfDay(normalizeNow(now))) {
    errors.push('expires_at is expired');
  }
  return errors;
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

function validateCompletionEvidenceShape(evidence: Record<string, unknown>): string[] {
  const failures: string[] = [];
  if (!['pass', 'fail', 'blocked'].includes(String(evidence.propertyIntegrity))) {
    failures.push('completionEvidence.propertyIntegrity must be pass, fail, or blocked');
  }

  const tokenBindingSummary = objectAt(evidence, 'tokenBindingSummary');
  if (tokenBindingSummary) {
    const status = tokenBindingSummary.status;
    const inferredPass = tokenBindingArraysPass(tokenBindingSummary);
    if (status !== 'pass' && status !== 'fail') {
      failures.push('completionEvidence.tokenBindingSummary.status must be pass or fail');
    }
    if (status === 'pass' && !inferredPass) {
      failures.push('completionEvidence.tokenBindingSummary.status cannot be pass while token binding issue arrays are non-empty');
    }
    if (status === 'fail' && evidence.propertyIntegrity === 'pass') {
      failures.push('completionEvidence.propertyIntegrity cannot be pass when tokenBindingSummary.status is fail');
    }
  }

  const structuralFidelity = objectAt(evidence, 'structuralFidelity');
  if (structuralFidelity?.status === 'fail' && evidence.propertyIntegrity === 'pass') {
    failures.push('completionEvidence.propertyIntegrity cannot be pass when structuralFidelity.status is fail');
  }

  const namingGate = objectAt(evidence, 'namingGate');
  if (namingGate?.status === 'fail' && evidence.propertyIntegrity === 'pass') {
    failures.push('completionEvidence.propertyIntegrity cannot be pass when namingGate.status is fail');
  }

  return failures;
}

function objectAt(parent: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = parent[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function tokenBindingArraysPass(summary: Record<string, unknown>): boolean {
  return [
    'missingTextStyle',
    'missingFillBinding',
    'missingStrokeBinding',
    'missingEffectBinding',
    'hardcodedTokenEligibleColors',
    'invalidTextStyle',
    'nonCdsColorBinding',
    'invalidExceptions',
  ].every((key) => arrayOfStrings(summary[key]).length === 0);
}

function normalizeNow(now: Date | string): Date {
  return now instanceof Date ? now : new Date(now);
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function startOfDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function validateCreateNewReuseGate(decision: Record<string, unknown>): string[] {
  const failures: string[] = [];
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
  } else if (reuseRejectionEvidence.length === 0) {
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

  if (exactFit === true || extendFit === true) {
    const candidateText = candidates.length > 0 ? ` Candidates: ${candidates.join(', ')}` : '';
    failures.push(`creationDecision.createNew blocked: existing CDS coverage is exactFit=${exactFit} extendFit=${extendFit}.${candidateText}`);
  }
  if (typeof expectedReuseCount === 'number' && expectedReuseCount < 3) {
    const localText = productLocalAllowed === true
      ? ' productLocalAllowed=true means keep this as a product-local composition instead of public CDS.'
      : '';
    failures.push(`creationDecision.createNew blocked: expectedReuseCount must be at least 3 for public CDS creation.${localText}`);
  }
  return failures;
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}
