import { isCdsTypographyTokenStyleName } from '../../../shared/typography-utils';
import { validateContractException } from './schemas';
import type { ContractException, ContractNode, ContractPaint, TokenBindingSummary } from './types';

const MAX_IDS = 50;

export function collectTokenBindingSummary(
  root: ContractNode,
  exceptions: ContractException[] = [],
): TokenBindingSummary {
  const summary: TokenBindingSummary = {
    status: 'pass',
    checked: 0,
    missingTextStyle: [],
    missingFillBinding: [],
    missingStrokeBinding: [],
    missingEffectBinding: [],
    hardcodedTokenEligibleColors: [],
    invalidTextStyle: [],
    nonCdsColorBinding: [],
    invalidExceptions: [],
    exceptions,
  };

  for (const exception of exceptions.filter((ex) => ex.ruleId.startsWith('token'))) {
    const errors = validateContractException(exception);
    if (errors.length > 0) {
      pushCapped(summary.invalidExceptions, `${exception.ruleId}:${exception.nodeId} ${errors.join(', ')}`);
    }
  }

  walkAuthoredNodes(root, (node) => {
    if (isExcepted(exceptions, node.id, 'token')) return;

    if (node.type === 'TEXT') {
      summary.checked++;
      if (!hasStyle(node.textStyleId)) pushCapped(summary.missingTextStyle, node.id);
      else if (!isCdsTypographyTokenStyleName(node.textStyleName)) pushCapped(summary.invalidTextStyle, node.id);
    }

    if (collectPaintIssues(node, 'fills', summary.missingFillBinding, summary.hardcodedTokenEligibleColors, summary.nonCdsColorBinding)) {
      summary.checked++;
    }
    if (collectPaintIssues(node, 'strokes', summary.missingStrokeBinding, summary.hardcodedTokenEligibleColors, summary.nonCdsColorBinding)) {
      summary.checked++;
    }

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
    summary.invalidExceptions,
  ].some((ids) => ids.length >= MAX_IDS);
  summary.status = tokenBindingPasses(summary) ? 'pass' : 'fail';

  return summary;
}

function collectPaintIssues(
  node: ContractNode,
  field: 'fills' | 'strokes',
  missingBinding: string[],
  hardcodedColors: string[],
  nonCdsBinding: string[],
): boolean {
  const paints = node[field];
  if (!Array.isArray(paints)) return false;
  const tokenEligiblePaints = paints.filter((paint) => isTokenEligiblePaint(paint));
  if (tokenEligiblePaints.length === 0) return false;

  const fieldBinding = getFieldBindingState(node, field);
  const everyPaintHasBinding = tokenEligiblePaints.every((paint) => hasBoundVariables(paint.boundVariables));
  const everyPaintHasCdsModeBinding = tokenEligiblePaints.every((paint) => paint.isCdsModeBound === true);
  if (fieldBinding === 'none' && !everyPaintHasBinding) {
    pushCapped(missingBinding, node.id);
    pushCapped(hardcodedColors, node.id);
    return true;
  }
  if (fieldBinding !== 'cds' && !everyPaintHasCdsModeBinding) {
    pushCapped(nonCdsBinding, node.id);
  }
  return true;
}

function isTokenEligiblePaint(paint: ContractPaint): boolean {
  if (paint.visible === false || paint.opacity === 0) return false;
  if (paint.type === 'SOLID' && paint.color) return true;
  return paint.tokenEligible === true || hasBoundVariables(paint.boundVariables);
}

function hasStyle(styleId: string | symbol | null | undefined): boolean {
  return typeof styleId === 'string' && styleId.length > 0;
}

function hasBoundVariables(boundVariables: Record<string, unknown> | undefined): boolean {
  return Boolean(boundVariables && Object.keys(boundVariables).length > 0);
}

function getFieldBindingState(node: ContractNode, field: 'fills' | 'strokes'): 'none' | 'cds' | 'non-cds' {
  if (!node.boundVariables || !(field in node.boundVariables)) return 'none';
  const bindings = node.variableBindings?.[field];
  if (!bindings || bindings.length === 0) return 'non-cds';
  return bindings.every((binding) => binding.isCdsModeBound === true) ? 'cds' : 'non-cds';
}

function isExcepted(exceptions: ContractException[], nodeId: string, prefix: string): boolean {
  return exceptions.some((ex) => ex.nodeId === nodeId
    && ex.ruleId.startsWith(prefix)
    && validateContractException(ex).length === 0);
}

function pushCapped(target: string[], id: string): void {
  if (target.length < MAX_IDS && !target.includes(id)) target.push(id);
}

function tokenBindingPasses(summary: TokenBindingSummary): boolean {
  return summary.missingTextStyle.length === 0
    && summary.missingFillBinding.length === 0
    && summary.missingStrokeBinding.length === 0
    && summary.missingEffectBinding.length === 0
    && summary.hardcodedTokenEligibleColors.length === 0
    && summary.invalidTextStyle.length === 0
    && summary.nonCdsColorBinding.length === 0
    && summary.invalidExceptions.length === 0;
}

function walkAuthoredNodes(node: ContractNode, visit: (node: ContractNode) => void): void {
  visit(node);
  if (node.type === 'INSTANCE') return;
  for (const child of node.children || []) walkAuthoredNodes(child, visit);
}
