import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  collectLayoutContract,
  collectPropertyReferenceMatrix,
  collectStructuralFidelity,
  collectTokenBindingSummary,
  runNamingGate,
  runSyntheticFixture,
  validateCreationDecision,
  validateCompletionEvidence,
  withProbeCleanup,
  type ComponentContractFixture,
  type ContractNode,
} from './index';
import { collectStackIconFidelity } from '../figma/live-audit';
import { NAMING_RULES, evaluateNamingTarget, suggestNamingFix } from '../../renamer/rules';

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

  it('requires text styles to use CDS typography token naming', () => {
    const invalid: ContractNode = {
      id: 'body',
      name: 'Body',
      type: 'TEXT',
      textStyleId: 'S:body',
      textStyleName: 'Body/Regular',
      tokenEligible: true,
    };
    expect(collectTokenBindingSummary(invalid).invalidTextStyle).toEqual(['body']);

    const valid: ContractNode = {
      id: 'body',
      name: 'Body',
      type: 'TEXT',
      textStyleId: 'S:text-xs',
      textStyleName: 'text-xs/leading-normal',
      tokenEligible: true,
    };
    expect(collectTokenBindingSummary(valid).invalidTextStyle).toHaveLength(0);
  });

  it('requires token-eligible solid paints to be bound, not merely color-matched', () => {
    const root: ContractNode = {
      id: 'surface',
      name: 'Surface',
      type: 'FRAME',
      fills: [{
        type: 'SOLID',
        tokenEligible: true,
        color: { r: 1, g: 1, b: 1, a: 1 },
        matchedTokenName: 'colors/white',
        matchedTokenCollectionName: 'Mode',
      }],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.missingFillBinding).toEqual(['surface']);
    expect(summary.hardcodedTokenEligibleColors).toEqual(['surface']);
  });

  it('rejects non-CDS color bindings', () => {
    const root: ContractNode = {
      id: 'surface',
      name: 'Surface',
      type: 'FRAME',
      fills: [{
        type: 'SOLID',
        tokenEligible: true,
        boundVariables: { color: { type: 'VARIABLE_ALIAS', id: 'other' } },
        boundTokenName: 'white',
        boundTokenCollectionName: 'Primitives',
        isCdsModeBound: false,
      }],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.missingFillBinding).toHaveLength(0);
    expect(summary.nonCdsColorBinding).toEqual(['surface']);
  });

  it('passes CDS Mode-bound colors and CDS typography token styles', () => {
    const root: ContractNode = {
      id: 'body',
      name: 'Body',
      type: 'TEXT',
      textStyleId: 'S:text-xs',
      textStyleName: 'text-xs/leading-normal',
      tokenEligible: true,
      fills: [{
        type: 'SOLID',
        tokenEligible: true,
        boundVariables: { color: { type: 'VARIABLE_ALIAS', id: 'mode' } },
        boundTokenName: 'colors/white',
        boundTokenCollectionName: 'Mode',
        isCdsModeBound: true,
      }],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.missingTextStyle).toHaveLength(0);
    expect(summary.invalidTextStyle).toHaveLength(0);
    expect(summary.missingFillBinding).toHaveLength(0);
    expect(summary.nonCdsColorBinding).toHaveLength(0);
    expect(summary.status).toBe('pass');
  });

  it('does not allow invalid token exceptions to convert missing bindings to pass', () => {
    const root: ContractNode = {
      id: 'surface',
      name: 'Surface',
      type: 'FRAME',
      fills: [{
        type: 'SOLID',
        tokenEligible: true,
        color: { r: 1, g: 1, b: 1, a: 1 },
      }],
    };

    const summary = collectTokenBindingSummary(root, [{
      ruleId: 'token.missing-fill-binding',
      nodeId: 'surface',
      reason: 'Temporary exception without required evidence',
      evidence: '',
      revisit: '',
    }]);

    expect(summary.status).toBe('fail');
    expect(summary.missingFillBinding).toEqual(['surface']);
    expect(summary.invalidExceptions.join('\n')).toContain('approver is required');
    expect(summary.invalidExceptions.join('\n')).toContain('sourceReference is required');
    expect(summary.invalidExceptions.join('\n')).toContain('revisit is required');
  });

  it('treats arbitrary visible solid paints as token-eligible hardcoded colors', () => {
    const root: ContractNode = {
      id: 'tile',
      name: 'Certification Item',
      type: 'COMPONENT',
      fills: [{
        type: 'SOLID',
        visible: true,
        color: { r: 0.82, g: 0.84, b: 0.86, a: 1 },
      }],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.status).toBe('fail');
    expect(summary.missingFillBinding).toEqual(['tile']);
    expect(summary.hardcodedTokenEligibleColors).toEqual(['tile']);
  });

  it('fails partially bound multi-paint surfaces', () => {
    const root: ContractNode = {
      id: 'stack-icon',
      name: 'Stack Icon',
      type: 'VECTOR',
      fills: [
        {
          type: 'SOLID',
          visible: true,
          boundVariables: { color: { type: 'VARIABLE_ALIAS', id: 'mode-foreground' } },
          isCdsModeBound: true,
          color: { r: 1, g: 1, b: 1, a: 1 },
        },
        {
          type: 'SOLID',
          visible: true,
          color: { r: 1, g: 1, b: 1, a: 1 },
        },
      ],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.status).toBe('fail');
    expect(summary.missingFillBinding).toEqual(['stack-icon']);
  });

  it('ignores hidden or transparent solid paints', () => {
    const root: ContractNode = {
      id: 'play-root',
      name: 'Remix Icons / play-fill 1',
      type: 'FRAME',
      fills: [
        { type: 'SOLID', visible: false, color: { r: 1, g: 1, b: 1, a: 1 } },
        { type: 'SOLID', opacity: 0, color: { r: 1, g: 1, b: 1, a: 1 } },
      ],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.status).toBe('pass');
    expect(summary.missingFillBinding).toHaveLength(0);
  });

  it('passes field-level color bindings only when proven CDS Mode-bound', () => {
    const root: ContractNode = {
      id: 'field-fill',
      name: 'Field Fill',
      type: 'FRAME',
      boundVariables: { fills: [{ type: 'VARIABLE_ALIAS', id: 'mode-foreground' }] },
      variableBindings: {
        fills: [{ variableId: 'mode-foreground', boundTokenName: 'foreground', boundTokenCollectionName: 'Mode', isCdsModeBound: true }],
      },
      fills: [{ type: 'SOLID', visible: true, color: { r: 1, g: 1, b: 1, a: 1 } }],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.status).toBe('pass');
  });

  it('fails field-level color bindings unless CDS Mode binding is proven', () => {
    const root: ContractNode = {
      id: 'field-fill',
      name: 'Field Fill',
      type: 'FRAME',
      boundVariables: { fills: [{ type: 'VARIABLE_ALIAS', id: 'other-white' }] },
      variableBindings: {
        fills: [{ variableId: 'other-white', boundTokenName: 'White', boundTokenCollectionName: 'Legacy Colors', isCdsModeBound: false }],
      },
      fills: [{ type: 'SOLID', visible: true, color: { r: 1, g: 1, b: 1, a: 1 } }],
    };

    const summary = collectTokenBindingSummary(root);
    expect(summary.status).toBe('fail');
    expect(summary.missingFillBinding).toHaveLength(0);
    expect(summary.nonCdsColorBinding).toEqual(['field-fill']);
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

  it('fails stack icons built from two filled rectangles without vector or stroke structure', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Certification Item',
      type: 'COMPONENT',
      layoutMode: 'VERTICAL',
      children: [{
        id: 'stack-icon',
        name: 'tabler:squares-filled',
        type: 'FRAME',
        children: [
          { id: 'stack-back', name: 'Back Square', type: 'RECTANGLE', fills: [{ type: 'SOLID', visible: true, color: { r: 1, g: 1, b: 1 } }] },
          { id: 'stack-front', name: 'Front Square', type: 'RECTANGLE', fills: [{ type: 'SOLID', visible: true, color: { r: 1, g: 1, b: 1 } }] },
        ],
      }],
    };

    const summary = collectStackIconFidelity(root);
    expect(summary.pass).toBe(false);
    expect(summary.failures?.join('\n')).toContain('structural-fidelity.stack-icon-filled-primitives');
  });

  it('fails stack icons built from two filled vectors without stroke or approved icon instance structure', () => {
    const root: ContractNode = {
      id: 'root',
      name: 'Certification Item',
      type: 'COMPONENT',
      layoutMode: 'VERTICAL',
      children: [{
        id: 'stack-icon',
        name: 'Stack Icon',
        type: 'FRAME',
        children: [
          { id: 'stack-back', name: 'Vector', type: 'VECTOR', fills: [{ type: 'SOLID', visible: true, color: { r: 1, g: 1, b: 1 } }] },
          { id: 'stack-front', name: 'Vector', type: 'VECTOR', fills: [{ type: 'SOLID', visible: true, color: { r: 1, g: 1, b: 1 } }] },
        ],
      }],
    };

    const summary = collectStackIconFidelity(root);
    expect(summary.pass).toBe(false);
    expect(summary.failures?.join('\n')).toContain('structural-fidelity.stack-icon-filled-primitives');
  });
});

describe('creation reuse gate', () => {
  const baseDecision = {
    sourceUnitNodeId: 'streak-home-indicator-source',
    candidateComponents: ['iOS HomeIndicator'],
    existingCandidates: ['iOS HomeIndicator'],
    componentGroupNodeId: 'group:mobile-system',
    componentGroupPath: 'CDS / Mobile / System',
    placementReason: 'Screen contains a bottom home indicator region',
    decision: 'createNew',
    decisionReason: 'Source shape looked visually unique',
    rejectedOptions: [],
    exactFit: false,
    extendFit: false,
    reuseRejectionEvidence: ['Compared geometry, visibility, and token usage against candidates'],
    createNewJustification: 'Reusable mobile system primitive with repeated product demand',
    expectedReuseCount: 3,
    productLocalAllowed: false,
    variantExplosionRisk: 'low',
    exceptions: [],
  } as const;

  it('requires createNew reuse evidence fields', () => {
    const failures = validateCreationDecision({
      sourceUnitNodeId: 'streak-top-bar-source',
      candidateComponents: ['Navbar / Type=L'],
      componentGroupNodeId: 'group:navigation',
      componentGroupPath: 'CDS / Navigation',
      placementReason: 'Top bar region',
      decision: 'createNew',
      decisionReason: 'Create Streak Top Bar',
      rejectedOptions: [],
      variantExplosionRisk: 'low',
      exceptions: [],
    });

    expect(failures.join('\n')).toContain('creationDecision.existingCandidates is required for createNew');
    expect(failures.join('\n')).toContain('creationDecision.exactFit is required for createNew');
    expect(failures.join('\n')).toContain('creationDecision.reuseRejectionEvidence is required for createNew');
    expect(failures.join('\n')).toContain('creationDecision.expectedReuseCount must be a non-negative integer');
  });

  it('blocks createNew when an existing CDS component is an exact fit', () => {
    const failures = validateCreationDecision({
      ...baseDecision,
      exactFit: true,
      decisionReason: 'Create Streak Home Indicator',
      createNewJustification: 'Keep source screen naming',
      expectedReuseCount: 3,
    });

    expect(failures.join('\n')).toContain('createNew blocked');
    expect(failures.join('\n')).toContain('iOS HomeIndicator');
  });

  it('blocks createNew when an existing CDS component can be extended', () => {
    const failures = validateCreationDecision({
      ...baseDecision,
      sourceUnitNodeId: 'streak-calendar-source',
      candidateComponents: ['Calendar Block', 'Calendar Day Button'],
      existingCandidates: ['Calendar Block', 'Calendar Day Button'],
      componentGroupNodeId: 'group:calendar',
      componentGroupPath: 'CDS / Calendar',
      placementReason: 'Calendar-like streak grid',
      decisionReason: 'Create Streak Calendar',
      exactFit: false,
      extendFit: true,
      reuseRejectionEvidence: ['Calendar needs a streak state'],
      createNewJustification: 'Create separate streak calendar family',
      expectedReuseCount: 3,
    });

    expect(failures.join('\n')).toContain('createNew blocked');
    expect(failures.join('\n')).toContain('Calendar Block');
  });

  it('blocks low-reuse public CDS creation and routes product-local compositions away from CDS', () => {
    const failures = validateCreationDecision({
      ...baseDecision,
      sourceUnitNodeId: 'streak-summary-hero',
      candidateComponents: [],
      existingCandidates: [],
      exactFit: false,
      extendFit: false,
      reuseRejectionEvidence: ['No reusable component family found after search'],
      createNewJustification: 'One-off streak summary composition',
      expectedReuseCount: 1,
      productLocalAllowed: true,
    });

    expect(failures.join('\n')).toContain('expectedReuseCount must be at least 3');
    expect(failures.join('\n')).toContain('product-local composition');
  });

  it('allows extendExisting without the createNew-only reuse fields', () => {
    const failures = validateCreationDecision({
      sourceUnitNodeId: 'streak-calendar-source',
      candidateComponents: ['Calendar Block', 'Calendar Day Button'],
      componentGroupNodeId: 'group:calendar',
      componentGroupPath: 'CDS / Calendar',
      placementReason: 'Calendar family owns date grid behavior',
      decision: 'extendExisting',
      decisionReason: 'Add a Streak state variant to Calendar Day Button first',
      rejectedOptions: ['createNew Streak Calendar'],
      variantExplosionRisk: 'medium',
      exceptions: [],
    });

    expect(failures).toEqual([]);
  });

  it('blocks createNew prerequisites even when reuse exception evidence is present', () => {
    const failures = validateCreationDecision({
      ...baseDecision,
      exactFit: true,
      extendFit: false,
      reuseRejectionEvidence: [],
      expectedReuseCount: 1,
      exceptions: [{
        ruleId: 'creation.reuse-exception',
        nodeId: 'streak-specialized-primitive',
        reason: 'Existing HomeIndicator cannot support required animated safe-area state',
        evidence: 'Prototype evidence shows a required state not present in iOS HomeIndicator',
        approver: 'design-system-owner',
        revisit: 'Remove exception after HomeIndicator receives the animated safe-area state',
      }],
    });

    expect(failures.join('\n')).toContain('reuseRejectionEvidence must list why existing candidates cannot cover the use case');
    expect(failures.join('\n')).toContain('createNew blocked: existing CDS coverage');
    expect(failures.join('\n')).toContain('expectedReuseCount must be at least 3');
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

  it('blocks completion evidence that marks token failures as property pass', () => {
    const failures = validateCompletionEvidence({
      sourceNodeId: 'source',
      componentNodeId: 'component',
      componentGroupPath: 'Components / Composed',
      sourceScreenshot: 'source.png',
      componentScreenshot: 'component.png',
      visualDiffSummary: 'matches',
      propertyIntegrity: 'pass',
      propertyReferenceMatrix: { definitionCount: 0, nonVariantDefinitionCount: 0, referencedNonVariantCount: 0, matrix: [], unreferenced: [], danglingRefs: [], fieldMismatches: [] },
      instanceOverrideProbe: { pass: true },
      useSiteReplacement: 'blocked',
      intentionalDeltas: [],
      layoutContract: { issues: [], checked: 1, exceptions: [] },
      structuralFidelity: { status: 'pass', issues: [], imageBacked: false, checked: 1, rasterPaintCount: 0, structuralNodeCount: 1, tokenOrPropertySignalCount: 1, exceptions: [] },
      tokenBindingSummary: {
        status: 'fail',
        checked: 1,
        missingTextStyle: [],
        missingFillBinding: ['component'],
        missingStrokeBinding: [],
        missingEffectBinding: [],
        hardcodedTokenEligibleColors: ['component'],
        invalidTextStyle: [],
        nonCdsColorBinding: [],
        invalidExceptions: [],
        exceptions: [],
      },
      namingGate: {
        status: 'pass',
        hardGate: true,
        policyVersion: '2.0',
        metrics: { checked: 1, violationCount: 0, blockingViolationCount: 0, autofixableCount: 0, activeExceptionCount: 0, expiringExceptionCount: 0 },
        violations: [],
        exceptions: [],
      },
      responsiveProbe: { pass: true },
      longTextProbe: { pass: true },
      boundsCheck: { pass: true },
      exceptions: [],
    });

    expect(failures.join('\n')).toContain('propertyIntegrity cannot be pass when tokenBindingSummary.status is fail');
  });

  it('runs synthetic fixture manifests from qa core fixtures', () => {
    const fixtureDir = join(process.cwd(), 'src', 'modules', 'qa', 'core', '__fixtures__');
    const fixtures = readdirSync(fixtureDir)
      .filter((name) => name.endsWith('.json'))
      .map((name) => JSON.parse(readFileSync(join(fixtureDir, name), 'utf8')) as ComponentContractFixture)
      .filter((fixture) => fixture.mode === 'synthetic');

    expect(fixtures.length).toBeGreaterThan(0);
    for (const fixture of fixtures) {
      expect(runSyntheticFixture(fixture), fixture.name).toMatchObject({ pass: true });
    }
  });

  it('removes probes even when the probe body throws', async () => {
    const probe = { removed: false, remove() { this.removed = true; } };
    await expect(withProbeCleanup(probe, () => {
      throw new Error('boom');
    })).rejects.toThrow('boom');
    expect(probe.removed).toBe(true);
  });
});

describe('naming policy gate', () => {
  it('maps naming-policy v2.0 sections 3-8 into executable rules', () => {
    const sections = new Set(NAMING_RULES.map((rule) => rule.policySection));
    expect([...sections].sort()).toEqual(['3', '4', '5', '6', '7', '8']);
    expect(NAMING_RULES.every((rule) => rule.id.startsWith('naming.'))).toBe(true);
  });

  it('blocks layer slashes while allowing variant slash hierarchy', () => {
    const layerGate = runNamingGate({
      targets: [{ id: 'layer', name: 'Header/Nav', kind: 'layer', type: 'FRAME' }],
    });
    expect(layerGate.status).toBe('fail');
    expect(layerGate.violations.map((violation) => violation.ruleId)).toContain('naming.section6.layer-slash');

    const variantGate = runNamingGate({
      targets: [{ id: 'variant', name: 'Button/Primary', kind: 'variantPath', isVariantPath: true }],
    });
    expect(variantGate.status).toBe('pass');
  });

  it('requires explicit M3 anatomy evidence before allowing Container suffix', () => {
    const arbitraryContainer = runNamingGate({
      root: { id: 'frame', name: 'Dialog Container', type: 'FRAME' },
    });
    expect(arbitraryContainer.status).toBe('fail');
    expect(arbitraryContainer.violations.map((violation) => violation.ruleId)).toContain('naming.section5.banned-suffix');

    const m3Container = runNamingGate({
      root: { id: 'm3', name: 'Container', type: 'FRAME', isM3Anatomy: true },
    });
    expect(m3Container.status).toBe('pass');
  });

  it('blocks icon-like vectors that are not Lucide instances', () => {
    const gate = runNamingGate({
      root: { id: 'icon-vector', name: 'Chevron Right', type: 'VECTOR' },
    });
    expect(gate.status).toBe('fail');
    expect(gate.violations.map((violation) => violation.ruleId)).toContain('naming.section7.lucide-icon');
  });

  it('separates owner from approver for temporary naming exceptions', () => {
    const invalid = runNamingGate({
      now: '2026-05-12T00:00:00Z',
      targets: [{ id: 'layer', name: 'Header/Nav', kind: 'layer', type: 'FRAME' }],
      exceptions: [{
        ruleId: 'naming.section6.layer-slash',
        nodeId: 'layer',
        reason: 'Migration hold',
        evidence: 'Tracked in harness run',
        approver: 'design-lead',
        revisit: 'Rename before publish',
      }],
    });
    expect(invalid.status).toBe('fail');
    expect(invalid.violations[0].message).toContain('owner is required');

    const valid = runNamingGate({
      now: '2026-05-12T00:00:00Z',
      targets: [{ id: 'layer', name: 'Header/Nav', kind: 'layer', type: 'FRAME' }],
      exceptions: [{
        ruleId: 'naming.section6.layer-slash',
        nodeId: 'layer',
        reason: 'Migration hold',
        evidence: 'Tracked in harness run',
        owner: 'component-owner',
        approver: 'design-lead',
        review_at: '2026-05-19',
        expires_at: '2026-05-26',
        revisit: 'Rename before publish',
      }],
    });
    expect(valid.status).toBe('pass');
    expect(valid.metrics.activeExceptionCount).toBe(1);
  });

  it('requires evidence and revisit on temporary naming exceptions at runtime', () => {
    const invalid = runNamingGate({
      now: '2026-05-12T00:00:00Z',
      targets: [{ id: 'layer', name: 'Header/Nav', kind: 'layer', type: 'FRAME' }],
      exceptions: [{
        ruleId: 'naming.section6.layer-slash',
        nodeId: 'layer',
        reason: 'Migration hold',
        owner: 'component-owner',
        approver: 'design-lead',
        review_at: '2026-05-19',
        expires_at: '2026-05-26',
      } as any],
    });
    expect(invalid.status).toBe('fail');
    expect(invalid.violations[0].message).toContain('evidence is required');
    expect(invalid.violations[0].message).toContain('revisit is required');
  });

  it('exposes autofix suggestions for policy violations', () => {
    expect(suggestNamingFix({ id: 'a', name: 'Main Content', kind: 'layer', type: 'FRAME' })).toBe('Body');
    expect(evaluateNamingTarget({ id: 'b', name: 'Container CTA', kind: 'layer', type: 'FRAME' })
      .map((violation) => violation.ruleId)).toContain('naming.section5.cta');
  });
});
