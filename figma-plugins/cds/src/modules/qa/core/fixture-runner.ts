import { collectLayoutContract } from './layout-contract';
import { collectPropertyReferenceMatrix } from './property-matrix';
import { collectStructuralFidelity } from './structural-fidelity';
import { collectTokenBindingSummary } from './token-binding';
import { runNamingGate } from './naming-gate';
import type { ComponentContractFixture, FixtureResult } from './types';

export function runSyntheticFixture(fixture: ComponentContractFixture): FixtureResult {
  const failures: string[] = [];
  if (fixture.mode !== 'synthetic') {
    return { name: fixture.name, pass: false, failures: ['fixture is not synthetic'] };
  }

  const input = materializeInput(fixture);
  const expected = fixture.expected || {};

  assertCount(failures, input, expected, 'propertyReferenceMatrix', 'unreferenced');
  assertCount(failures, input, expected, 'propertyReferenceMatrix', 'danglingRefs');
  assertCount(failures, input, expected, 'propertyReferenceMatrix', 'fieldMismatches');
  assertCount(failures, input, expected, 'layoutContract', 'issues', 'layoutIssues');
  assertCount(failures, input, expected, 'structuralFidelity', 'issues', 'structuralIssues');
  assertCount(failures, input, expected, 'tokenBindingSummary', 'missingTextStyle');
  assertCount(failures, input, expected, 'tokenBindingSummary', 'missingFillBinding');
  assertCount(failures, input, expected, 'tokenBindingSummary', 'missingStrokeBinding');
  assertCount(failures, input, expected, 'tokenBindingSummary', 'hardcodedTokenEligibleColors');
  assertCount(failures, input, expected, 'tokenBindingSummary', 'invalidTextStyle');
  assertCount(failures, input, expected, 'tokenBindingSummary', 'nonCdsColorBinding');
  assertCount(failures, input, expected, 'namingGate', 'violations', 'namingViolations');
  assertNumber(failures, input, expected, 'namingGate', ['metrics', 'blockingViolationCount'], 'namingBlockingViolations');
  assertNumber(failures, input, expected, 'namingGate', ['metrics', 'activeExceptionCount'], 'namingActiveExceptions');
  assertBoolean(failures, input, expected, 'structuralFidelity', 'imageBacked');
  assertStatus(failures, input, expected, 'namingGate', 'namingGateStatus');

  if ('pass' in expected) {
    const pass = inferPass(input);
    if (pass !== expected.pass) failures.push(`expected pass=${expected.pass}, got ${pass}`);
  }

  return { name: fixture.name, pass: failures.length === 0, failures };
}

function materializeInput(fixture: ComponentContractFixture): Record<string, unknown> {
  const input = fixture.input || {};
  const node = input.node;

  if (Array.isArray(input.namingTargets)) {
    return {
      ...input,
      namingGate: runNamingGate({
        targets: input.namingTargets as any,
        exceptions: fixture.exceptions || [],
        now: input.now as string | undefined,
      }),
    };
  }

  if (!node || typeof node !== 'object') return input;

  const contractNode = node as any;
  return {
    ...input,
    propertyReferenceMatrix: collectPropertyReferenceMatrix(contractNode),
    layoutContract: collectLayoutContract(contractNode, fixture.exceptions || []),
    structuralFidelity: collectStructuralFidelity(contractNode, fixture.exceptions || []),
    tokenBindingSummary: collectTokenBindingSummary(contractNode, fixture.exceptions || []),
    namingGate: runNamingGate({ root: contractNode, exceptions: fixture.exceptions || [], now: input.now as string | undefined }),
  };
}

export function runFixtureManifest(fixture: ComponentContractFixture): FixtureResult {
  if (fixture.mode === 'synthetic') return runSyntheticFixture(fixture);
  return {
    name: fixture.name,
    pass: false,
    failures: ['live fixture requires Figma runtime'],
  };
}

function assertCount(
  failures: string[],
  input: Record<string, unknown>,
  expected: Record<string, unknown>,
  section: string,
  field: string,
  expectedKey = field,
): void {
  if (!(expectedKey in expected)) return;
  const actual = countAt(input, section, field);
  if (actual !== expected[expectedKey]) {
    failures.push(`${expectedKey}: expected ${expected[expectedKey]}, got ${actual}`);
  }
}

function countAt(input: Record<string, unknown>, section: string, field: string): number {
  const sectionValue = input[section];
  if (!sectionValue || typeof sectionValue !== 'object') return 0;
  const value = (sectionValue as Record<string, unknown>)[field];
  return Array.isArray(value) ? value.length : 0;
}

function assertBoolean(
  failures: string[],
  input: Record<string, unknown>,
  expected: Record<string, unknown>,
  section: string,
  field: string,
): void {
  if (!(field in expected)) return;
  const sectionValue = input[section];
  const actual = Boolean(sectionValue && typeof sectionValue === 'object'
    && (sectionValue as Record<string, unknown>)[field]);
  if (actual !== expected[field]) {
    failures.push(`${field}: expected ${expected[field]}, got ${actual}`);
  }
}

function assertStatus(
  failures: string[],
  input: Record<string, unknown>,
  expected: Record<string, unknown>,
  section: string,
  expectedKey: string,
): void {
  if (!(expectedKey in expected)) return;
  const sectionValue = input[section];
  const actual = sectionValue && typeof sectionValue === 'object'
    ? (sectionValue as Record<string, unknown>).status
    : undefined;
  if (actual !== expected[expectedKey]) {
    failures.push(`${expectedKey}: expected ${expected[expectedKey]}, got ${actual}`);
  }
}

function assertNumber(
  failures: string[],
  input: Record<string, unknown>,
  expected: Record<string, unknown>,
  section: string,
  path: string[],
  expectedKey: string,
): void {
  if (!(expectedKey in expected)) return;
  let current: unknown = input[section];
  for (const part of path) {
    if (!current || typeof current !== 'object') {
      current = undefined;
      break;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (current !== expected[expectedKey]) {
    failures.push(`${expectedKey}: expected ${expected[expectedKey]}, got ${current}`);
  }
}

function inferPass(input: Record<string, unknown>): boolean {
  return countAt(input, 'propertyReferenceMatrix', 'unreferenced') === 0
    && countAt(input, 'propertyReferenceMatrix', 'danglingRefs') === 0
    && countAt(input, 'propertyReferenceMatrix', 'fieldMismatches') === 0
    && countAt(input, 'layoutContract', 'issues') === 0
    && countAt(input, 'structuralFidelity', 'issues') === 0
    && countAt(input, 'tokenBindingSummary', 'missingTextStyle') === 0
    && countAt(input, 'tokenBindingSummary', 'missingFillBinding') === 0
    && countAt(input, 'tokenBindingSummary', 'missingStrokeBinding') === 0
    && countAt(input, 'tokenBindingSummary', 'hardcodedTokenEligibleColors') === 0
    && countAt(input, 'tokenBindingSummary', 'invalidTextStyle') === 0
    && countAt(input, 'tokenBindingSummary', 'nonCdsColorBinding') === 0
    && namingGatePasses(input);
}

function namingGatePasses(input: Record<string, unknown>): boolean {
  const namingGate = input.namingGate;
  if (!namingGate || typeof namingGate !== 'object') return true;
  return (namingGate as Record<string, unknown>).status === 'pass';
}
