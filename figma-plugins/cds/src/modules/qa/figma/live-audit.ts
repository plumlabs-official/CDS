import {
  collectLayoutContract,
  collectPropertyReferenceMatrix,
  collectStructuralFidelity,
  collectTokenBindingSummary,
  validateCompletionEvidence,
  withProbeCleanup,
  type CompletionEvidence,
  type ContractException,
  type ProbeSummary,
} from '../core';
import { buildTokenCatalog, sceneNodeToContractNode } from './scene-node';

export interface CompletionGateInput {
  componentNodeId: string;
  sourceNodeId?: string;
  componentGroupPath?: string;
  sourceScreenshot?: string;
  componentScreenshot?: string;
  visualDiffSummary?: string;
  useSiteReplacement?: 'pass' | 'fail' | 'blocked';
  intentionalDeltas?: string[];
  exceptions?: ContractException[];
}

export async function runCompletionGate(input: CompletionGateInput): Promise<CompletionEvidence> {
  const node = await figma.getNodeByIdAsync(input.componentNodeId);
  if (!node || !isSceneNode(node)) throw new Error(`component node not found: ${input.componentNodeId}`);

  const exceptions = input.exceptions || [];
  const tokenCatalog = await buildTokenCatalog();
  const contractNode = sceneNodeToContractNode(node, tokenCatalog);
  const propertyReferenceMatrix = collectPropertyReferenceMatrix(contractNode);
  const layoutContract = collectLayoutContract(contractNode, exceptions);
  const structuralFidelity = collectStructuralFidelity(contractNode, exceptions);
  const tokenBindingSummary = collectTokenBindingSummary(contractNode, exceptions);
  const propertyIntegrity = matrixPasses(propertyReferenceMatrix) && structuralFidelity.status === 'pass'
    ? 'pass'
    : 'fail';

  const evidence: CompletionEvidence = {
    sourceNodeId: input.sourceNodeId || '',
    componentNodeId: input.componentNodeId,
    componentGroupPath: input.componentGroupPath || '',
    sourceScreenshot: input.sourceScreenshot || '',
    componentScreenshot: input.componentScreenshot || '',
    visualDiffSummary: input.visualDiffSummary || '',
    propertyIntegrity,
    propertyReferenceMatrix,
    instanceOverrideProbe: skippedProbe('not-run'),
    useSiteReplacement: input.useSiteReplacement || 'blocked',
    intentionalDeltas: input.intentionalDeltas || [],
    layoutContract,
    structuralFidelity,
    tokenBindingSummary,
    responsiveProbe: skippedProbe('not-run'),
    longTextProbe: skippedProbe('not-run'),
    boundsCheck: skippedProbe('not-run'),
    exceptions,
  };

  const schemaErrors = validateCompletionEvidence(evidence);
  if (schemaErrors.length > 0) throw new Error(schemaErrors.join('; '));
  return evidence;
}

export async function assertNoContractProbeLeftovers(runId: string): Promise<number> {
  const leftovers = figma.root.findAll((node) => node.getPluginData('contract-probe') === runId);
  return leftovers.length;
}

export async function runCleanupProbe(componentNodeId: string): Promise<ProbeSummary> {
  const node = await figma.getNodeByIdAsync(componentNodeId);
  if (!node || node.type !== 'COMPONENT') {
    return { pass: false, failures: [`cleanup probe requires COMPONENT, got ${node?.type || 'null'}`] };
  }

  const runId = `contract-${Date.now()}-${Math.round(Math.random() * 100000)}`;
  const probe = node.createInstance();
  await withProbeCleanup(probe, async (tempProbe) => {
    tempProbe.setPluginData('contract-probe', runId);
    figma.currentPage.appendChild(tempProbe);
    throw new Error('intentional cleanup probe throw');
  }).catch(() => {
    // Intentional: cleanup behavior is the assertion target.
  });

  const leftoverCount = await assertNoContractProbeLeftovers(runId);
  return {
    pass: leftoverCount === 0,
    checked: 1,
    failures: leftoverCount === 0 ? [] : [`${leftoverCount} probe nodes left behind`],
  };
}

function isSceneNode(node: BaseNode): node is SceneNode {
  return 'visible' in node;
}

function matrixPasses(matrix: CompletionEvidence['propertyReferenceMatrix']): boolean {
  return matrix.unreferenced.length === 0
    && matrix.danglingRefs.length === 0
    && matrix.fieldMismatches.length === 0;
}

function skippedProbe(reason: string): ProbeSummary {
  return { pass: false, checked: 0, failures: [reason] };
}
