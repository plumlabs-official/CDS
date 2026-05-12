/**
 * Style Migration — Fill/stroke variable replacement, effect style swap, text color binding, font binding
 *
 * Source: migrate-to-cds/code.js processNode() (lines 589-846)
 */

import {
  findCdsVariable,
  findNearestColor,
  serializeEffects,
  findCdsEffectStyle,
  findNearestCdsEffect,
  findNearestTextStyle,
} from '../../shared/matching';
import type { ColorMatchResult } from '../../shared/matching';
import type { TextMigrationContext } from './text-migration';
import { migrateTextStyle } from './text-migration';

/** Statistics tracking for the migration run */
export interface MigrationStats {
  effects: number;
  fills: number;
  strokes: number;
  textStyles: number;
  inferredStyles: number;
  colorTokens: number;
  fonts: number;
  skipped: number;
}

/** Nearest-match statistics */
export interface NearestStats {
  colorCount: number;
  colorTotalDist: number;
  effectCount: number;
  effectTotalDist: number;
  textCount: number;
}

/** Full migration context: all lookup maps needed by processNode */
export interface MigrationContext {
  modeCollection: VariableCollection;
  variableByFullName: Record<string, Variable>;
  variableByShortName: Record<string, Variable>;
  colorToVariable: Record<string, Variable>;
  nearestColorCache: Record<string, ColorMatchResult | null>;
  effectByName: Record<string, EffectStyle>;
  effectByShortName: Record<string, EffectStyle>;
  effectStyleByProps: Record<string, EffectStyle>;
  cdsEffectStyles: EffectStyle[];
  textCtx: TextMigrationContext;
  stats: MigrationStats;
  nearestStats: NearestStats;
}

interface PaintVariableMatch {
  variable: Variable;
  key: string;
  distance?: number;
}

/**
 * Process a single node: replace fills/strokes/effects/text styles with CDS equivalents.
 */
export async function processNode(node: SceneNode, ctx: MigrationContext): Promise<void> {
  if (node.name && (node.name.indexOf('Icon/') === 0 || node.name === 'Icon')) {
    ctx.stats.skipped++;
    return;
  }

  // 1. Effect Style 교체 (shadows/ 계열만 — focus/ 등 비-shadow 스타일 보존)
  if ('effectStyleId' in node && (node as any).effectStyleId && (node as any).effectStyleId !== figma.mixed) {
    try {
      const currentEffectStyle = await figma.getStyleByIdAsync((node as any).effectStyleId);
      if (currentEffectStyle && currentEffectStyle.name.indexOf('focus/') !== 0) {
        if ((currentEffectStyle as EffectStyle).remote) {
          let cdsEffectStyle = findCdsEffectStyle(currentEffectStyle.name, ctx.effectByName, ctx.effectByShortName);

          if (!cdsEffectStyle || cdsEffectStyle.id === (node as any).effectStyleId) {
            const nodeEffectKey = serializeEffects((currentEffectStyle as EffectStyle).effects);
            if (nodeEffectKey && ctx.effectStyleByProps[nodeEffectKey]) {
              cdsEffectStyle = ctx.effectStyleByProps[nodeEffectKey];
            }
          }
          if (!cdsEffectStyle || cdsEffectStyle.id === (node as any).effectStyleId) {
            const nearest = findNearestCdsEffect((currentEffectStyle as EffectStyle).effects, ctx.cdsEffectStyles);
            if (nearest) {
              cdsEffectStyle = nearest;
              ctx.nearestStats.effectCount++;
            }
          }

          if (cdsEffectStyle && cdsEffectStyle.id !== (node as any).effectStyleId) {
            await (node as any).setEffectStyleIdAsync(cdsEffectStyle.id);
            ctx.stats.effects++;
            console.log('Effect: ' + currentEffectStyle.name + ' -> CDS ' + cdsEffectStyle.name);
          }
        }
      }
    } catch (err) {
      console.log('Effect error: ' + (err as Error).message);
    }
  }

  // 2. Fill 변수 교체: 기존 바인딩뿐 아니라 하드코딩 SOLID 색도 Mode 토큰으로 바인딩한다.
  if ('fills' in node) {
    const fillNode = node as MinimalFillsMixin & SceneNode;
    const fills = fillNode.fills;
    if (fills && fills !== figma.mixed && (fills as readonly Paint[]).length > 0) {
      const fillsArr = fills as readonly Paint[];
      const newFills: Paint[] = [];
      let fillChanged = false;

      for (let fi = 0; fi < fillsArr.length; fi++) {
        let fill = JSON.parse(JSON.stringify(fillsArr[fi])) as Paint;
        if (fill.type === 'SOLID') {
          const currentFillVar = await getCurrentPaintVariable((node as any).boundVariables, 'fills', fi, fill);
          const match = resolveModePaintMatch(fill as SolidPaint, currentFillVar, ctx);
          if (match && (!currentFillVar || match.variable.id !== currentFillVar.id)) {
            try {
              fill = figma.variables.setBoundVariableForPaint(fill as SolidPaint, 'color', match.variable);
              fillChanged = true;
              ctx.stats.fills++;
              recordNearestColor(ctx, match);
              console.log('Fill: ' + (currentFillVar ? currentFillVar.name : match.key) + ' -> CDS ' + match.variable.name);
            } catch (err) {
              console.log('Fill bind error: ' + (err as Error).message);
            }
          }
        }
        newFills.push(fill);
      }

      if (fillChanged) fillNode.fills = newFills;
    }
  }

  // 3. Stroke 변수 교체: fill과 동일하게 Mode 컬렉션 기준으로 정규화한다.
  if ('strokes' in node) {
    const strokeNode = node as MinimalStrokesMixin & SceneNode;
    const strokes = strokeNode.strokes;
    if (strokes && strokes !== (figma.mixed as any) && strokes.length > 0) {
      const newStrokes: Paint[] = [];
      let strokeChanged = false;

      for (let si = 0; si < strokes.length; si++) {
        let stroke = JSON.parse(JSON.stringify(strokes[si])) as Paint;
        if (stroke.type === 'SOLID') {
          const currentStrokeVar = await getCurrentPaintVariable((node as any).boundVariables, 'strokes', si, stroke);
          const match = resolveModePaintMatch(stroke as SolidPaint, currentStrokeVar, ctx);
          if (match && (!currentStrokeVar || match.variable.id !== currentStrokeVar.id)) {
            try {
              stroke = figma.variables.setBoundVariableForPaint(stroke as SolidPaint, 'color', match.variable);
              strokeChanged = true;
              ctx.stats.strokes++;
              recordNearestColor(ctx, match);
              console.log('Stroke: ' + (currentStrokeVar ? currentStrokeVar.name : match.key) + ' -> CDS ' + match.variable.name);
            } catch (err) {
              console.log('Stroke bind error: ' + (err as Error).message);
            }
          }
        }
        newStrokes.push(stroke);
      }

      if (strokeChanged) strokeNode.strokes = newStrokes;
    }
  }

  // 4. Text Style + Inferred Style + Text Color + Font Binding
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;

    const textChanges = await migrateTextStyle(
      textNode,
      ctx.textCtx,
      (fontSize, lineHeight, fontWeight) => {
        const result = findNearestTextStyle(fontSize, lineHeight, fontWeight, ctx.textCtx.textStyleByProps);
        if (result) {
          ctx.nearestStats.textCount = (ctx.nearestStats.textCount || 0) + 1;
        }
        return result;
      },
    );
    if (textChanges > 0) {
      ctx.stats.textStyles += textChanges;
    }

    // 4.6: 텍스트 Fill 컬러 → CDS Mode 변수 바인딩
    if ('fills' in textNode && textNode.fills && textNode.fills !== figma.mixed) {
      const textFills = textNode.fills as readonly Paint[];
      const newTextFills: Paint[] = [];
      let textFillChanged = false;

      for (let tfi = 0; tfi < textFills.length; tfi++) {
        let textFill = JSON.parse(JSON.stringify(textFills[tfi])) as Paint;
        if (textFill.type === 'SOLID') {
          const currentTextVar = await getCurrentPaintVariable((textNode as any).boundVariables, 'fills', tfi, textFill);
          const match = resolveModePaintMatch(textFill as SolidPaint, currentTextVar, ctx);
          if (match && (!currentTextVar || match.variable.id !== currentTextVar.id)) {
            try {
              textFill = figma.variables.setBoundVariableForPaint(textFill as SolidPaint, 'color', match.variable);
              textFillChanged = true;
              ctx.stats.colorTokens++;
              recordNearestColor(ctx, match);
              console.log('Text color: ' + (currentTextVar ? currentTextVar.name : match.key) + ' -> CDS ' + match.variable.name + ' on ' + textNode.name);
            } catch (err) {
              console.log('Text color bind error: ' + (err as Error).message);
            }
          }
        }
        newTextFills.push(textFill);
      }

      if (textFillChanged) textNode.fills = newTextFills;
    }

    // 5. fontFamily + fontWeight 바인딩 (유추 실패한 미스타일 텍스트만, SF Pro 제외)
    const fontFamily = (textNode.fontName && textNode.fontName !== figma.mixed)
      ? (textNode.fontName as FontName).family : '';
    if (ctx.textCtx.fontSans && (!textNode.textStyleId || textNode.textStyleId === '') && fontFamily.indexOf('SF Pro') !== 0) {
      try {
        if (textNode.fontName && textNode.fontName !== figma.mixed) {
          await figma.loadFontAsync(textNode.fontName as FontName);
          try {
            await figma.loadFontAsync({ family: 'Pretendard', style: (textNode.fontName as FontName).style });
          } catch (e) {
            // font style not available
          }
        }
        await textNode.setBoundVariable('fontFamily', ctx.textCtx.fontSans!);
        if (textNode.fontWeight && textNode.fontWeight !== figma.mixed && ctx.textCtx.fontWeightMap[textNode.fontWeight as number]) {
          await textNode.setBoundVariable('fontWeight', ctx.textCtx.fontWeightMap[textNode.fontWeight as number]);
          console.log('Font weight bound: ' + textNode.fontWeight + ' on ' + textNode.name);
        }
        ctx.stats.fonts++;
      } catch (err) {
        console.log('Font bind error on ' + textNode.name + ': ' + err + ' | fontName=' + JSON.stringify(textNode.fontName) + ' | styleId=' + (textNode.textStyleId || 'none'));
      }
    }
  }

  if ('children' in node) {
    for (let ci = 0; ci < (node as ChildrenMixin).children.length; ci++) {
      await processNode((node as ChildrenMixin).children[ci], ctx);
    }
  }
}

async function getCurrentPaintVariable(
  boundVariables: Record<string, unknown> | undefined,
  field: 'fills' | 'strokes',
  index: number,
  paint: Paint,
): Promise<Variable | null> {
  const variableId = readPaintBindingId(boundVariables, field, index, paint);
  if (!variableId) return null;
  try {
    return await figma.variables.getVariableByIdAsync(variableId);
  } catch (err) {
    return null;
  }
}

function readPaintBindingId(
  boundVariables: Record<string, unknown> | undefined,
  field: 'fills' | 'strokes',
  index: number,
  paint: Paint,
): string | null {
  const paintColor = (paint as any).boundVariables?.color as { id?: unknown } | undefined;
  if (typeof paintColor?.id === 'string') return paintColor.id;

  const fieldBindings = boundVariables?.[field] as Array<{ id?: unknown }> | undefined;
  const fieldBinding = Array.isArray(fieldBindings) ? fieldBindings[index] : undefined;
  return typeof fieldBinding?.id === 'string' ? fieldBinding.id : null;
}

function resolveModePaintMatch(
  paint: SolidPaint,
  currentVariable: Variable | null,
  ctx: MigrationContext,
): PaintVariableMatch | null {
  const key = paintColorKey(paint);

  if (currentVariable) {
    if (currentVariable.variableCollectionId === ctx.modeCollection.id) return null;
    if (currentVariable.name.indexOf('custom/') === 0) return null;
    const byName = findCdsVariable(currentVariable.name, ctx.variableByFullName, ctx.variableByShortName);
    if (byName) return { variable: byName, key };
  }

  const exact = ctx.colorToVariable[key];
  if (exact) return { variable: exact, key };

  const rgb = paintToRgbaBytes(paint);
  const nearest = findNearestColor(rgb.r, rgb.g, rgb.b, rgb.a, ctx.colorToVariable, ctx.nearestColorCache);
  return nearest ? { variable: nearest.variable, key, distance: nearest.distance } : null;
}

function paintColorKey(paint: SolidPaint): string {
  const rgb = paintToRgbaBytes(paint);
  return rgb.r + '_' + rgb.g + '_' + rgb.b + '_' + rgb.a;
}

function paintToRgbaBytes(paint: SolidPaint): { r: number; g: number; b: number; a: number } {
  return {
    r: Math.round(paint.color.r * 255),
    g: Math.round(paint.color.g * 255),
    b: Math.round(paint.color.b * 255),
    a: Math.round((paint.opacity !== undefined ? paint.opacity : 1) * 100),
  };
}

function recordNearestColor(ctx: MigrationContext, match: PaintVariableMatch): void {
  if (match.distance === undefined) return;
  ctx.nearestStats.colorCount++;
  ctx.nearestStats.colorTotalDist += match.distance;
}
