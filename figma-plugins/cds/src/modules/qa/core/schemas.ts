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
  return validateRequiredObject(value, CREATION_REQUIRED, 'creationDecision');
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
