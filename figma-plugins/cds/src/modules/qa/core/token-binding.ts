import { isCdsTypographyTokenStyleName } from '../../../shared/typography-utils';
import type { ContractException, ContractNode, ContractPaint, TokenBindingSummary } from './types';

const MAX_IDS = 50;

export function collectTokenBindingSummary(
  root: ContractNode,
  exceptions: ContractException[] = [],
): TokenBindingSummary {
  const summary: TokenBindingSummary = {
    checked: 0,
    missingTextStyle: [],
    missingFillBinding: [],
    missingStrokeBinding: [],
    missingEffectBinding: [],
    hardcodedTokenEligibleColors: [],
    invalidTextStyle: [],
    nonCdsColorBinding: [],
    exceptions,
  };

  walkAuthoredNodes(root, (node) => {
    if (isExcepted(exceptions, node.id, 'token')) return;

    if (node.type === 'TEXT') {
      summary.checked++;
      if (!hasStyle(node.textStyleId)) pushCapped(summary.missingTextStyle, node.id);
      else if (!isCdsTypographyTokenStyleName(node.textStyleName)) pushCapped(summary.invalidTextStyle, node.id);
    }

    collectPaintIssues(node, 'fills', summary.missingFillBinding, summary.hardcodedTokenEligibleColors, summary.nonCdsColorBinding);
    collectPaintIssues(node, 'strokes', summary.missingStrokeBinding, summary.hardcodedTokenEligibleColors, summary.nonCdsColorBinding);

    if (Array.isArray(node.effects) && node.effects.some((effect) => effect.tokenEligible)) {
      summary.checked++;
      const hasBinding = node.effects.some((effect) => hasBoundVariables(effect.boundVariables))
        || hasStyle(node.effectStyleId);
      if (!hasBinding) pushCapped(summary.missingEffectBinding, node.id);
    }
  });

  summary.truncated = [
    summary.missingTextStyle,
    summary.missingFillBinding,
    summary.missingStrokeBinding,
    summary.missingEffectBinding,
    summary.hardcodedTokenEligibleColors,
    summary.invalidTextStyle,
    summary.nonCdsColorBinding,
  ].some((ids) => ids.length >= MAX_IDS);

  return summary;
}

function collectPaintIssues(
  node: ContractNode,
  field: 'fills' | 'strokes',
  missingBinding: string[],
  hardcodedColors: string[],
  nonCdsBinding: string[],
): void {
  const paints = node[field];
  if (!Array.isArray(paints)) return;
  const tokenEligiblePaints = paints.filter((paint) => isTokenEligiblePaint(paint));
  if (tokenEligiblePaints.length === 0) return;

  const hasBinding = tokenEligiblePaints.some((paint) => hasBoundVariables(paint.boundVariables))
    || hasFieldBinding(node.boundVariables, field);
  const hasCdsModeBinding = tokenEligiblePaints.some((paint) => paint.isCdsModeBound === true);
  if (!hasBinding) {
    pushCapped(missingBinding, node.id);
    pushCapped(hardcodedColors, node.id);
    return;
  }
  if (!hasCdsModeBinding) {
    pushCapped(nonCdsBinding, node.id);
  }
}

function isTokenEligiblePaint(paint: ContractPaint): boolean {
  return paint.tokenEligible === true || hasBoundVariables(paint.boundVariables);
}

function hasStyle(styleId: string | symbol | null | undefined): boolean {
  return typeof styleId === 'string' && styleId.length > 0;
}

function hasBoundVariables(boundVariables: Record<string, unknown> | undefined): boolean {
  return Boolean(boundVariables && Object.keys(boundVariables).length > 0);
}

function hasFieldBinding(boundVariables: Record<string, unknown> | undefined, field: 'fills' | 'strokes'): boolean {
  if (!boundVariables) return false;
  const key = field === 'fills' ? 'fills' : 'strokes';
  return key in boundVariables;
}

function isExcepted(exceptions: ContractException[], nodeId: string, prefix: string): boolean {
  return exceptions.some((ex) => ex.nodeId === nodeId && ex.ruleId.startsWith(prefix));
}

function pushCapped(target: string[], id: string): void {
  if (target.length < MAX_IDS && !target.includes(id)) target.push(id);
}

function walkAuthoredNodes(node: ContractNode, visit: (node: ContractNode) => void): void {
  visit(node);
  if (node.type === 'INSTANCE') return;
  for (const child of node.children || []) walkAuthoredNodes(child, visit);
}
