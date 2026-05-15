import type { ContractNode, ContractPaint, ContractVariableBinding } from '../core';
import { findLightModeId, rgbToHex, resolveColorValue } from '../../../shared/color-utils';

interface TokenMeta {
  id: string;
  name: string;
  collectionId: string;
  collectionName: string;
  source: 'cds-mode' | 'other';
}

export interface TokenCatalog {
  colorHexes: Set<string>;
  variableMetaById: Record<string, TokenMeta>;
  colorMetaByHex: Record<string, TokenMeta>;
  textStyleNameById: Record<string, string>;
}

function isModeCollectionName(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return normalized === 'mode' || normalized === 'cds/mode';
}

function isCdsModeTokenName(name: string): boolean {
  return /^(primary|primary-foreground|secondary|secondary-foreground|accent|accent-foreground|background|foreground|card|card-foreground|popover|popover-foreground|muted|muted-foreground|destructive|destructive-foreground|success|success-foreground|success-ring|warning|warning-foreground|warning-ring|info|info-foreground|info-ring|border|input|ring|opacity-\d+|custom\/|chart\/chart-\d+|shadow\/|sidebar\/)/.test(name);
}

export async function buildTokenCatalog(): Promise<TokenCatalog> {
  const colorHexes = new Set<string>();
  const variableMetaById: Record<string, TokenMeta> = {};
  const colorMetaByHex: Record<string, TokenMeta> = {};
  const textStyleNameById: Record<string, string> = {};

  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const collectionById: Record<string, VariableCollection> = {};
    for (const collection of collections) {
      collectionById[collection.id] = collection;
    }

    const variables = await figma.variables.getLocalVariablesAsync();
    for (const variable of variables) {
      const collection = collectionById[variable.variableCollectionId];
      const collectionName = collection?.name ?? '';
      const isCdsMode = collection
        ? isModeCollectionName(collection.name)
        : Boolean((variable as { remote?: boolean }).remote && isCdsModeTokenName(variable.name));
      const meta: TokenMeta = {
        id: variable.id,
        name: variable.name,
        collectionId: variable.variableCollectionId,
        collectionName,
        source: isCdsMode ? 'cds-mode' : 'other',
      };
      variableMetaById[variable.id] = meta;

      if (variable.resolvedType !== 'COLOR' || !isCdsMode) {
        continue;
      }

      const modeId = collection && collection.modes.length > 0
        ? findLightModeId(collection)
        : Object.keys(variable.valuesByMode)[0];
      if (!modeId) continue;
      const color = await resolveColorValue(variable, modeId);
      if (color) {
        const hex = rgbToHex(color.r, color.g, color.b);
        colorHexes.add(hex);
        colorMetaByHex[hex] = meta;
      }
    }
  } catch (e) {
    // Variable APIs can be unavailable in older contexts; audit still returns style/binding counts.
  }

  try {
    const textStyles = await figma.getLocalTextStylesAsync();
    for (const style of textStyles) {
      textStyleNameById[style.id] = style.name;
    }
  } catch (e) {
    // Style APIs can be unavailable in some MCP contexts.
  }

  return { colorHexes, variableMetaById, colorMetaByHex, textStyleNameById };
}

export function sceneNodeToContractNode(node: SceneNode, tokenCatalog: TokenCatalog): ContractNode {
  const anyNode = node as any;
  const textStyleId = node.type === 'TEXT' ? readStyleId(safeRead(() => anyNode.textStyleId)) : null;
  const contract: ContractNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    layoutMode: safeRead(() => anyNode.layoutMode),
    layoutSizingHorizontal: safeRead(() => anyNode.layoutSizingHorizontal),
    layoutSizingVertical: safeRead(() => anyNode.layoutSizingVertical),
    layoutAlign: safeRead(() => anyNode.layoutAlign),
    primaryAxisAlignItems: safeRead(() => anyNode.primaryAxisAlignItems),
    counterAxisAlignItems: safeRead(() => anyNode.counterAxisAlignItems),
    textAlignHorizontal: node.type === 'TEXT' ? safeRead(() => anyNode.textAlignHorizontal) : undefined,
    textAlignVertical: node.type === 'TEXT' ? safeRead(() => anyNode.textAlignVertical) : undefined,
    textAutoResize: node.type === 'TEXT' ? safeRead(() => anyNode.textAutoResize) : undefined,
    textTruncation: node.type === 'TEXT' ? safeRead(() => anyNode.textTruncation) : undefined,
    textStyleId,
    textStyleName: textStyleId ? tokenCatalog.textStyleNameById[textStyleId] ?? null : null,
    gridStyleId: readStyleId(safeRead(() => anyNode.gridStyleId)),
    effectStyleId: readStyleId(safeRead(() => anyNode.effectStyleId)),
    boundVariables: safeRead(() => anyNode.boundVariables),
    variableBindings: readNodeVariableBindings(safeRead(() => anyNode.boundVariables), tokenCatalog),
    fills: readPaints(safeRead(() => anyNode.fills), tokenCatalog),
    strokes: readPaints(safeRead(() => anyNode.strokes), tokenCatalog),
    effects: readEffects(safeRead(() => anyNode.effects)),
    componentPropertyDefinitions: safeRead(() => anyNode.componentPropertyDefinitions),
    componentPropertyReferences: safeRead(() => anyNode.componentPropertyReferences),
    componentProperties: safeRead(() => anyNode.componentProperties),
    isExposedInstance: safeRead(() => anyNode.isExposedInstance),
    tokenEligible: node.type === 'TEXT',
  };

  if ('children' in node && node.type !== 'INSTANCE') {
    contract.children = node.children.map((child) => sceneNodeToContractNode(child, tokenCatalog));
  }

  return contract;
}

function readNodeVariableBindings(
  boundVariables: Record<string, unknown> | undefined,
  tokenCatalog: TokenCatalog,
): ContractNode['variableBindings'] | undefined {
  if (!boundVariables) return undefined;
  const result: ContractNode['variableBindings'] = {};
  for (const field of ['fills', 'strokes'] as const) {
    const bindings = readVariableBindingList(boundVariables[field], tokenCatalog);
    if (bindings.length > 0) result[field] = bindings;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function readVariableBindingList(value: unknown, tokenCatalog: TokenCatalog): ContractVariableBinding[] {
  const aliases = Array.isArray(value) ? value : value ? [value] : [];
  return aliases.map((alias) => {
    const variableId = readVariableAliasId(alias);
    const meta = variableId ? tokenCatalog.variableMetaById[variableId] : undefined;
    return {
      variableId: variableId ?? undefined,
      boundTokenName: meta?.name ?? null,
      boundTokenCollectionName: meta?.collectionName ?? null,
      isCdsModeBound: meta?.source === 'cds-mode',
    };
  });
}

function safeRead<T>(read: () => T): T | undefined {
  try {
    return read();
  } catch (e) {
    return undefined;
  }
}

function readStyleId(styleId: unknown): string | null {
  return typeof styleId === 'string' ? styleId : null;
}

function readPaints(value: unknown, tokenCatalog: TokenCatalog): ContractPaint[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((paint) => {
    const anyPaint = paint as any;
    const contract: ContractPaint = {
      type: anyPaint.type,
      boundVariables: anyPaint.boundVariables,
      visible: anyPaint.visible !== false,
      opacity: typeof anyPaint.opacity === 'number' ? anyPaint.opacity : undefined,
      color: anyPaint.color,
    };

    if (anyPaint.type === 'SOLID' && isRgb(anyPaint.color)) {
      const boundColorId = readBoundColorId(anyPaint.boundVariables);
      const boundMeta = boundColorId ? tokenCatalog.variableMetaById[boundColorId] : undefined;
      const matchedMeta = tokenCatalog.colorMetaByHex[rgbToHex(anyPaint.color.r, anyPaint.color.g, anyPaint.color.b)];
      contract.tokenEligible = anyPaint.visible !== false && anyPaint.opacity !== 0;
      contract.boundTokenName = boundMeta?.name ?? null;
      contract.boundTokenCollectionName = boundMeta?.collectionName ?? null;
      contract.isCdsModeBound = boundMeta?.source === 'cds-mode';
      contract.matchedTokenName = matchedMeta?.name ?? null;
      contract.matchedTokenCollectionName = matchedMeta?.collectionName ?? null;
    } else {
      contract.tokenEligible = hasPaintBinding(anyPaint);
    }

    return contract;
  });
}

function readEffects(value: unknown): Array<{ boundVariables?: Record<string, unknown>; tokenEligible?: boolean }> | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((effect) => {
    const anyEffect = effect as any;
    return {
      boundVariables: anyEffect.boundVariables,
      tokenEligible: Boolean(anyEffect.boundVariables && Object.keys(anyEffect.boundVariables).length > 0),
    };
  });
}

function hasPaintBinding(paint: any): boolean {
  return Boolean(paint.boundVariables && Object.keys(paint.boundVariables).length > 0);
}

function readBoundColorId(boundVariables: Record<string, unknown> | undefined): string | null {
  const color = boundVariables?.color as { id?: unknown } | undefined;
  return typeof color?.id === 'string' ? color.id : null;
}

function readVariableAliasId(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;
  const obj = value as Record<string, unknown>;
  if (typeof obj.id === 'string') return obj.id;
  if (obj.type === 'VARIABLE_ALIAS' && typeof obj.id === 'string') return obj.id;
  return null;
}

function isRgb(value: unknown): value is RGB {
  return Boolean(value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value);
}
