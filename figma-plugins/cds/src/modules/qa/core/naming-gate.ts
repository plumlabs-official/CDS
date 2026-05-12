import {
  NAMING_POLICY_VERSION,
  collectNamingTargets,
  evaluateNamingTarget,
  type NamingTarget,
} from '../../renamer/rules';
import type { ContractException, ContractNode, NamingGateSummary, NamingGateViolation } from './types';

export interface NamingGateInput {
  targets?: NamingTarget[];
  root?: ContractNode;
  exceptions?: ContractException[];
  hardGate?: boolean;
  now?: Date | string;
}

export function runNamingGate(input: NamingGateInput): NamingGateSummary {
  const hardGate = input.hardGate !== false;
  const now = normalizeNow(input.now);
  const exceptions = input.exceptions || [];
  const targets = input.targets || (input.root ? contractNodeToNamingTargets(input.root) : []);
  const violations: NamingGateViolation[] = [];
  let activeExceptionCount = 0;
  let expiringExceptionCount = 0;

  for (const target of targets) {
    const rawViolations = evaluateNamingTarget(target);
    for (const violation of rawViolations) {
      const exception = findException(exceptions, violation.ruleId, violation.targetId);
      if (!exception) {
        violations.push({ ...toGateViolation(violation), status: violation.severity === 'error' ? 'fail' : 'warning' });
        continue;
      }

      const exceptionErrors = validateNamingException(exception, now);
      if (exceptionErrors.length > 0) {
        violations.push({
          ...toGateViolation(violation, exception),
          status: 'fail',
          message: `${violation.message} Exception invalid: ${exceptionErrors.join(', ')}`,
        });
        continue;
      }

      activeExceptionCount++;
      if (isExpiringSoon(exception, now)) expiringExceptionCount++;
      violations.push({ ...toGateViolation(violation, exception), status: 'excepted' });
    }
  }

  for (const exception of exceptions) {
    if (!exception.ruleId.startsWith('naming.')) continue;
    if (violations.some((violation) => violation.exceptionRef === exceptionRef(exception))) continue;
    const exceptionErrors = validateNamingException(exception, now);
    if (exceptionErrors.length > 0) {
      violations.push({
        ruleId: exception.ruleId,
        policySection: 'exception',
        target: exception.nodeName || exception.nodeId,
        targetId: exception.nodeId,
        targetName: exception.nodeName || exception.nodeId,
        targetKind: 'exception',
        currentName: exception.nodeName || exception.nodeId,
        autofixable: false,
        exceptionRef: exceptionRef(exception),
        status: 'fail',
        message: `Naming exception invalid: ${exceptionErrors.join(', ')}`,
        sourceReference: exception.sourceReference || '.claude/rules/component-contract.md#contractexception',
      });
    }
  }

  const blockingViolationCount = violations.filter((violation) => violation.status === 'fail').length;
  return {
    status: blockingViolationCount === 0 || !hardGate ? 'pass' : 'fail',
    hardGate,
    policyVersion: NAMING_POLICY_VERSION,
    metrics: {
      checked: targets.length,
      violationCount: violations.length,
      blockingViolationCount,
      autofixableCount: violations.filter((violation) => violation.autofixable).length,
      activeExceptionCount,
      expiringExceptionCount,
    },
    violations,
    exceptions,
  };
}

export function contractNodeToNamingTargets(root: ContractNode): NamingTarget[] {
  return collectNamingTargets(toNamingTargetTree(root));
}

function toNamingTargetTree(node: ContractNode): NamingTarget & { children?: Array<NamingTarget & { children?: any[] }> } {
  const kind = inferKind(node);
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    kind,
    path: node.name,
    isM3Anatomy: node.isM3Anatomy === true,
    isVariantPath: node.isVariantPath === true,
    hardcodedData: node.hardcodedData === true,
    isPublishExcluded: /^[._]/.test(node.name),
    children: (node.children || []).map(toNamingTargetTree),
  };
}

function inferKind(node: ContractNode): NamingTarget['kind'] {
  if (node.type === 'TEXT') return 'text';
  if (isIconLikeNode(node)) return 'icon';
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') return 'component';
  return 'layer';
}

function isIconLikeNode(node: ContractNode): boolean {
  if (!['INSTANCE', 'VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'ELLIPSE', 'POLYGON'].includes(node.type)) {
    return false;
  }
  if (/\bIcon\b/i.test(node.name)) return true;
  if (/^(Arrow Left|Arrow Right|Bell|Bookmark|Calendar|Camera|Check|Chevron Left|Chevron Right|Clock|Crown|Heart|Home|Image|Lock|Message Circle|Minus|Pencil|Play|Plus|Search|Settings|Share|Star|Trash 2|User|Users|X)$/i.test(node.name)) {
    return true;
  }
  return /^(Chevron|Arrow|Search|Home|Bell|Clock|Lock|User|Users|Plus|Minus|Check|X)[A-Z0-9]/.test(node.name);
}

function toGateViolation(
  violation: ReturnType<typeof evaluateNamingTarget>[number],
  exception?: ContractException,
): Omit<NamingGateViolation, 'status'> {
  return {
    ruleId: violation.ruleId,
    policySection: violation.policySection,
    target: violation.targetName,
    targetId: violation.targetId,
    targetName: violation.targetName,
    targetKind: violation.targetKind,
    currentName: violation.currentName,
    suggestedName: violation.suggestedName,
    autofixable: violation.autofixable,
    exceptionRef: exception ? exceptionRef(exception) : undefined,
    message: violation.message,
    sourceReference: violation.sourceReference,
  };
}

function findException(exceptions: ContractException[], ruleId: string, nodeId: string): ContractException | undefined {
  return exceptions.find((exception) => exception.ruleId === ruleId && exception.nodeId === nodeId);
}

function validateNamingException(exception: ContractException, now: Date): string[] {
  const errors: string[] = [];
  if (!exception.owner) errors.push('owner is required');
  if (!exception.approver) errors.push('approver is required');
  if (!exception.evidence) errors.push('evidence is required');
  if (!exception.revisit) errors.push('revisit is required');
  if (!exception.review_at) errors.push('review_at is required');
  if (!exception.expires_at) errors.push('expires_at is required');
  if (exception.review_at && !isIsoDate(exception.review_at)) errors.push('review_at must be YYYY-MM-DD');
  if (exception.expires_at && !isIsoDate(exception.expires_at)) errors.push('expires_at must be YYYY-MM-DD');
  if (exception.expires_at && isIsoDate(exception.expires_at) && parseIsoDate(exception.expires_at) < startOfDay(now)) {
    errors.push('expires_at is expired');
  }
  return errors;
}

function exceptionRef(exception: ContractException): string {
  return `${exception.ruleId}:${exception.nodeId}`;
}

function normalizeNow(now: Date | string | undefined): Date {
  if (!now) return new Date();
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

function isExpiringSoon(exception: ContractException, now: Date): boolean {
  if (!exception.expires_at || !isIsoDate(exception.expires_at)) return false;
  const days = (parseIsoDate(exception.expires_at).getTime() - startOfDay(now).getTime()) / 86400000;
  return days >= 0 && days <= 14;
}
