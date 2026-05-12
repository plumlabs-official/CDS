/**
 * CDS Mode Collection Variable Loading & Cache
 *
 * Source: cds-docs/code.js loadCdsVars() (lines 14-33)
 * D2: ensureVarsLoaded() pattern for race condition safety
 */

/** Cached CDS COLOR variables from Mode Collection, keyed by variable name */
let cdsVarCache: Record<string, Variable> = {};
let modeCollectionCache: VariableCollection | null = null;
let varsPromise: Promise<VariableCollection | null> | null = null;

function isModeCollectionName(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return normalized === 'mode' || normalized === 'cds/mode';
}

/** Internal loader */
async function doLoadCdsVars(): Promise<VariableCollection | null> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  modeCollectionCache = collections.find(c => isModeCollectionName(c.name)) ?? null;
  if (!modeCollectionCache) return null;

  cdsVarCache = {};
  const allVars = await figma.variables.getLocalVariablesAsync();
  for (const v of allVars) {
    if (v.variableCollectionId === modeCollectionCache.id && v.resolvedType === 'COLOR') {
      cdsVarCache[v.name] = v;
    }
  }
  console.log('CDS vars loaded: ' + Object.keys(cdsVarCache).length);
  return modeCollectionCache;
}

/** Start pre-loading (called once on plugin startup). Safe to call multiple times. */
export function loadCdsVars(): Promise<VariableCollection | null> {
  if (!varsPromise) varsPromise = doLoadCdsVars();
  return varsPromise;
}

/** Ensure vars are loaded before proceeding. Resolves instantly if already done. */
export async function ensureVarsLoaded(): Promise<void> {
  await loadCdsVars();
}

/** Get the cached CDS variable map (read-only after loading) */
export function getCdsVars(): Record<string, Variable> {
  return cdsVarCache;
}

/** Get the cached Mode Collection */
export function getModeCollection(): VariableCollection | null {
  return modeCollectionCache;
}

/** Get all Mode Collection variables (COLOR + non-COLOR). Requires separate load. */
export async function getAllModeVariables(): Promise<Variable[]> {
  await ensureVarsLoaded();
  if (!modeCollectionCache) return [];
  const allVars = await figma.variables.getLocalVariablesAsync();
  return allVars.filter(v => v.variableCollectionId === modeCollectionCache!.id);
}
