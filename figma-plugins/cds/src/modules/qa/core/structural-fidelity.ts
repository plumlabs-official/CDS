import type { ContractException, ContractNode, ContractPaint, StructuralFidelitySummary } from './types';

const IMAGE_BACKED_RULE = 'structural-fidelity.image-backed-component';
const STRUCTURAL_NODE_TYPES = new Set([
  'BOOLEAN_OPERATION',
  'COMPONENT',
  'COMPONENT_SET',
  'FRAME',
  'GROUP',
  'INSTANCE',
  'SECTION',
  'TEXT',
  'VECTOR',
]);

export function collectStructuralFidelity(
  root: ContractNode,
  exceptions: ContractException[] = [],
): StructuralFidelitySummary {
  const descendants = collectVisibleDescendants(root);
  const visibleDirectChildren = visibleChildren(root);
  const nodesToCheck = [root, ...descendants];
  const rasterPaintCount = nodesToCheck.filter(hasImagePaint).length;
  const tokenOrPropertySignalCount = countTokenOrPropertySignals(root, descendants);
  const structuralNodeCount = descendants.filter(isAuthoredStructuralNode).length;
  const imageBacked = isImageBackedComponent(root, visibleDirectChildren, structuralNodeCount, tokenOrPropertySignalCount);
  const issues = imageBacked
    ? [`${IMAGE_BACKED_RULE}: component is backed by raster/image content instead of authored CDS structure`]
    : [];

  return {
    status: issues.length === 0 ? 'pass' : 'fail',
    issues,
    imageBacked,
    checked: nodesToCheck.length,
    rasterPaintCount,
    structuralNodeCount,
    tokenOrPropertySignalCount,
    exceptions,
  };
}

function collectVisibleDescendants(root: ContractNode): ContractNode[] {
  const result: ContractNode[] = [];
  const visit = (node: ContractNode): void => {
    for (const child of visibleChildren(node)) {
      result.push(child);
      visit(child);
    }
  };
  visit(root);
  return result;
}

function visibleChildren(node: ContractNode): ContractNode[] {
  return (node.children || []).filter((child) => child.visible !== false);
}

function hasImagePaint(node: ContractNode): boolean {
  return paintArrayHasType(node.fills, 'IMAGE');
}

function paintArrayHasType(value: ContractNode['fills'], type: string): boolean {
  return Array.isArray(value) && value.some((paint) => isPaintType(paint, type));
}

function isPaintType(paint: ContractPaint, type: string): boolean {
  return paint.type === type;
}

function isImageBackedComponent(
  root: ContractNode,
  visibleDirectChildren: ContractNode[],
  structuralNodeCount: number,
  tokenOrPropertySignalCount: number,
): boolean {
  if (root.type !== 'COMPONENT' && root.type !== 'COMPONENT_SET') return false;
  if (visibleDirectChildren.length === 0) return hasImagePaint(root) && structuralNodeCount === 0;
  if (visibleDirectChildren.length === 1 && isRasterOnlySubtree(visibleDirectChildren[0])) return true;

  return visibleDirectChildren.every(isRasterOnlySubtree)
    && structuralNodeCount === 0
    && tokenOrPropertySignalCount === 0;
}

function isRasterOnlySubtree(node: ContractNode): boolean {
  const descendants = collectVisibleDescendants(node);
  const subtree = [node, ...descendants];
  const hasRaster = subtree.some(hasImagePaint);
  const hasAuthoredSignal = subtree.some((candidate) => candidate.type === 'TEXT' || candidate.type === 'INSTANCE');
  return hasRaster && !hasAuthoredSignal;
}

function isAuthoredStructuralNode(node: ContractNode): boolean {
  if (hasImagePaint(node)) return false;
  if (!STRUCTURAL_NODE_TYPES.has(node.type)) return false;
  return !looksLikeImageWrapper(node);
}

function looksLikeImageWrapper(node: ContractNode): boolean {
  return /\bimage\b/i.test(node.name) && visibleChildren(node).length <= 1;
}

function countTokenOrPropertySignals(root: ContractNode, descendants: ContractNode[]): number {
  const nonVariantProperties = Object.values(root.componentPropertyDefinitions || {})
    .filter((definition) => definition.type !== 'VARIANT').length;
  const boundVariableNodes = [root, ...descendants].filter((node) => {
    return Boolean(node.boundVariables && Object.keys(node.boundVariables).length > 0);
  }).length;
  return nonVariantProperties + boundVariableNodes;
}
