import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  collectLayoutContract,
  collectPropertyReferenceMatrix,
  collectStructuralFidelity,
  collectTokenBindingSummary,
  runSyntheticFixture,
  validateCompletionEvidence,
  withProbeCleanup,
  type ComponentContractFixture,
  type ContractNode,
} from './index';

describe('property reference matrix', () => {
  it('passes when every non-variant property is connected to the expected field', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Card',
      type: 'COMPONENT',
      componentPropertyDefinitions: {
        'Title#1': { type: 'TEXT', name: 'Title' },
        Type: { type: 'VARIANT', name: 'Type' },
      },
      children: [
        {
          id: 'title',
          name: 'Title',
          type: 'TEXT',
          componentPropertyReferences: { characters: 'Title#1' },
        },
      ],
    };

    const matrix = collectPropertyReferenceMatrix(root);
    expect(matrix.unreferenced).toHaveLength(0);
    expect(matrix.danglingRefs).toHaveLength(0);
    expect(matrix.fieldMismatches).toHaveLength(0);
  });

  it('detects stale definitions, dangling refs, and field mismatches', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Card',
      type: 'COMPONENT',
      componentPropertyDefinitions: {
        'Title#1': { type: 'TEXT', name: 'Title' },
        'Show Badge#2': { type: 'BOOLEAN', name: 'Show Badge' },
      },
      children: [
        {
          id: 'title',
          name: 'Title',
          type: 'TEXT',
          componentPropertyReferences: {
            visible: 'Title#1',
            characters: 'Missing#9',
          },
        },
      ],
    };

    const matrix = collectPropertyReferenceMatrix(root);
    expect(matrix.unreferenced.map((row) => row.key)).toEqual(['Show Badge#2']);
    expect(matrix.danglingRefs).toEqual(['Missing#9']);
    expect(matrix.fieldMismatches.map((row) => row.key)).toEqual(['Title#1']);
  });

  it('does not treat nested instance internals as parent refs', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Card',
      type: 'COMPONENT',
      componentPropertyDefinitions: {},
      children: [
        {
          id: 'metric',
          name: 'Metric',
          type: 'INSTANCE',
          children: [
            {
              id: 'internal',
              name: 'Label',
              type: 'TEXT',
              componentPropertyReferences: { characters: 'Nested Label#1' },
            },
          ],
        },
      ],
    };

    expect(collectPropertyReferenceMatrix(root).danglingRefs).toHaveLength(0);
  });
});

describe('layout and token summaries', () => {
  it('detects title growth and right-action layout issues', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Card',
      type: 'COMPONENT',
      layoutMode: 'VERTICAL',
      children: [
        {
          id: 'slot',
          name: 'Title Slot',
          type: 'FRAME',
          layoutMode: 'VERTICAL',
          primaryAxisAlignItems: 'MIN',
          children: [{ id: 'title', name: 'Title', type: 'TEXT', textAlignVertical: 'TOP' }],
        },
        {
          id: 'plain',
          name: 'Plain',
          type: 'FRAME',
          children: [{ id: 'timestamp', name: 'Timestamp', type: 'TEXT' }],
        },
      ],
    };

    const issues = collectLayoutContract(root).issues.join(',');
    expect(issues).toContain('title-growth');
    expect(issues).toContain('right-action-row');
  });

  it('detects missing text style on token-eligible text', () => {
    const root: ContractNode = { id: 'title', name: 'Title', type: 'TEXT', tokenEligible: true };
    const summary = collectTokenBindingSummary(root);
    expect(summary.missingTextStyle).toEqual(['title']);
  });
});

describe('structural fidelity', () => {
  it('fails image-backed components even when an exception is present', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Feed Creation Row',
      type: 'COMPONENT',
      children: [
        {
          id: 'image',
          name: 'Feed Creation Row Image',
          type: 'RECTANGLE',
          fills: [{ type: 'IMAGE' }],
        },
      ],
    };

    const summary = collectStructuralFidelity(root, [{
      ruleId: 'manual-recovery',
      nodeId: 'root',
      reason: 'Recovered from source screenshot',
      evidence: 'single image fill',
      sourceReference: 'CS2ZhrORl4E1szQfTe2UvO/28587:14830',
      revisit: 'replace with authored CDS structure before publish',
    }]);

    expect(summary.status).toBe('fail');
    expect(summary.imageBacked).toBe(true);
    expect(summary.issues[0]).toContain('structural-fidelity.image-backed-component');
  });

  it('passes authored components with text and instance structure', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Feed Creation Row',
      type: 'COMPONENT',
      layoutMode: 'HORIZONTAL',
      children: [
        { id: 'icon', name: 'Icon', type: 'INSTANCE' },
        { id: 'label', name: 'Label', type: 'TEXT' },
      ],
    };

    const summary = collectStructuralFidelity(root);
    expect(summary.status).toBe('pass');
    expect(summary.imageBacked).toBe(false);
  });
});

describe('fixtures, schemas, and cleanup', () => {
  it('runs synthetic negative fixtures', () => {
    const fixture: ComponentContractFixture = {
      name: 'unreferenced-property',
      mode: 'synthetic',
      input: { propertyReferenceMatrix: { unreferenced: ['Title#1'], danglingRefs: [], fieldMismatches: [] } },
      expected: { pass: false, unreferenced: 1 },
    };
    expect(runSyntheticFixture(fixture).pass).toBe(true);
  });

  it('runs synthetic fixture manifests from .claude/fixtures', () => {
    const fixtureDir = join(process.cwd(), '..', '..', '.claude', 'fixtures', 'component-contract');
    const fixtures = readdirSync(fixtureDir)
      .filter((name) => name.endsWith('.json'))
      .map((name) => JSON.parse(readFileSync(join(fixtureDir, name), 'utf8')) as ComponentContractFixture)
      .filter((fixture) => fixture.mode === 'synthetic');

    expect(fixtures.length).toBeGreaterThan(0);
    for (const fixture of fixtures) {
      expect(runSyntheticFixture(fixture), fixture.name).toMatchObject({ pass: true });
    }
  });

  it('validates required completion evidence fields', () => {
    expect(validateCompletionEvidence({ componentNodeId: '1:2' })).toContain('completionEvidence.sourceNodeId is required');
  });

  it('removes probes even when the probe body throws', async () => {
    const probe = { removed: false, remove() { this.removed = true; } };
    await expect(withProbeCleanup(probe, () => {
      throw new Error('boom');
    })).rejects.toThrow('boom');
    expect(probe.removed).toBe(true);
  });
});
