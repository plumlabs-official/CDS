import { collectLayoutContract } from './layout-contract';
import { collectPropertyReferenceMatrix } from './property-matrix';
import { collectStructuralFidelity } from './structural-fidelity';
import { collectTokenBindingSummary } from './token-binding';
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
  assertCount(failures, input, expected, 'tokenBindingSummary', 'hardcodedTokenEligibleColors');
  assertBoolean(failures, input, expected, 'structuralFidelity', 'imageBacked');

  if ('pass' in expected) {
    const pass = inferPass(input);
    if (pass !== expected.pass) failures.push(`expected pass=${expected.pass}, got ${pass}`);
  }

  return { name: fixture.name, pass: failures.length === 0, failures };
}

function materializeInput(fixture: ComponentContractFixture): Record<string, unknown> {
  const input = fixture.input || {};
  const node = input.node;
  if (!node || typeof node !== 'object') return input;

  const contractNode = node as any;
  return {
    ...input,
    propertyReferenceMatrix: collectPropertyReferenceMatrix(contractNode),
    layoutContract: collectLayoutContract(contractNode, fixture.exceptions || []),
    structuralFidelity: collectStructuralFidelity(contractNode, fixture.exceptions || []),
    tokenBindingSummary: collectTokenBindingSummary(contractNode, fixture.exceptions || []),
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

function inferPass(input: Record<string, unknown>): boolean {
  return countAt(input, 'propertyReferenceMatrix', 'unreferenced') === 0
    && countAt(input, 'propertyReferenceMatrix', 'danglingRefs') === 0
    && countAt(input, 'propertyReferenceMatrix', 'fieldMismatches') === 0
    && countAt(input, 'layoutContract', 'issues') === 0
    && countAt(input, 'structuralFidelity', 'issues') === 0
    && countAt(input, 'tokenBindingSummary', 'missingTextStyle') === 0
    && countAt(input, 'tokenBindingSummary', 'missingFillBinding') === 0
    && countAt(input, 'tokenBindingSummary', 'hardcodedTokenEligibleColors') === 0;
}
