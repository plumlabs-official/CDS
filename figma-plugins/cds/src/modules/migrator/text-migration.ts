/**
 * Text Migration — Text style inference, font variable binding
 *
 * Source: migrate-to-cds/code.js (lines 478-584)
 * Builds text style lookup maps, discovers font variables, preloads Pretendard.
 */

import { STYLE_TO_WEIGHT, WEIGHT_NAME_MAP } from '../../shared/matching';
import {
  isCdsTypographyTokenStyleName,
  normalizeTypographyStyleName,
} from '../../shared/typography-utils';

/** Context object holding all text migration lookup maps and variables */
export interface TextMigrationContext {
  /** Map of "fontSize_lineHeight_fontWeight" → TextStyle */
  textStyleByProps: Record<string, TextStyle>;
  /** Map of text style name → TextStyle */
  textStyleByName: Record<string, TextStyle>;
  /** fontName.style → numeric weight */
  styleToWeight: Record<string, number>;
  /** font-sans variable (null if not found) */
  fontSans: Variable | null;
  /** Numeric weight → font-weight variable */
  fontWeightMap: Record<number, Variable>;
}

/**
 * Build the text migration context: text style maps, font variable discovery, Pretendard preload.
 */
export async function buildTextContext(): Promise<TextMigrationContext> {
  const textStyles = await figma.getLocalTextStylesAsync();
  const tokenTextStyles = textStyles.filter((style) => isCdsTypographyTokenStyleName(style.name));
  const variables = await figma.variables.getLocalVariablesAsync();

  const styleToWeight = STYLE_TO_WEIGHT;

  // Text style name map
  const textStyleByName: Record<string, TextStyle> = {};
  for (let t = 0; t < tokenTextStyles.length; t++) {
    textStyleByName[tokenTextStyles[t].name] = tokenTextStyles[t];
    textStyleByName[normalizeTypographyStyleName(tokenTextStyles[t].name)] = tokenTextStyles[t];
  }

  // 속성 기반 역방향 Lookup Map: (fontSize_lineHeight_fontWeight) → TextStyle
  const textStyleByProps: Record<string, TextStyle> = {};
  for (let tp = 0; tp < tokenTextStyles.length; tp++) {
    const tStyle = tokenTextStyles[tp];
    const tsFontSize = tStyle.fontSize;
    let tsLineHeight: number | null = null;
    if (tStyle.lineHeight && tStyle.lineHeight.unit === 'PIXELS') {
      tsLineHeight = tStyle.lineHeight.value;
    } else if (tStyle.lineHeight && tStyle.lineHeight.unit === 'PERCENT') {
      tsLineHeight = Math.round(tsFontSize * tStyle.lineHeight.value / 100);
    }
    // AUTO → null (매칭 제외)
    let tsFontWeight: number | null = (tStyle as any).fontWeight as number | null;
    if (!tsFontWeight && tStyle.fontName) {
      tsFontWeight = styleToWeight[(tStyle.fontName as FontName).style] || null;
    }
    if (tsFontSize && tsLineHeight && tsFontWeight) {
      const tsKey = tsFontSize + '_' + tsLineHeight + '_' + tsFontWeight;
      if (!textStyleByProps[tsKey]) {
        textStyleByProps[tsKey] = tStyle;
        console.log('Style map: ' + tsKey + ' → ' + tStyle.name);
      }
    }
  }
  console.log('Text Style props map: ' + Object.keys(textStyleByProps).length + ' entries');

  // font-sans 변수 + font-weight 변수 맵 구축
  let fontSans: Variable | null = null;
  const fontWeightMap: Record<number, Variable> = {};
  const weightNameMap = WEIGHT_NAME_MAP;

  for (let fv = 0; fv < variables.length; fv++) {
    const vName = variables[fv].name;
    if (vName.indexOf('font-sans') !== -1 && !fontSans) {
      fontSans = variables[fv];
    }
    // font-weight 변수 매칭 (예: font/weight/font-medium, font-medium 등)
    for (const w in weightNameMap) {
      const weight = parseInt(w);
      if (vName.indexOf(weightNameMap[weight]) !== -1 && !fontWeightMap[weight]) {
        fontWeightMap[weight] = variables[fv];
      }
    }
  }

  if (fontSans) {
    console.log('Found font-sans: ' + fontSans.name);
    console.log('Font weight vars: ' + Object.keys(fontWeightMap).join(', '));

    // Pretendard 폰트 로드
    const fontStyleNames = ['Thin', 'ExtraLight', 'Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black'];
    for (let fl = 0; fl < fontStyleNames.length; fl++) {
      try {
        await figma.loadFontAsync({ family: 'Pretendard', style: fontStyleNames[fl] });
      } catch (e) {
        // font not available — continue
      }
    }

    // 텍스트 스타일 전역 font-sans 바인딩
    for (let ts = 0; ts < textStyles.length; ts++) {
      try {
        await textStyles[ts].setBoundVariable('fontFamily', fontSans);
      } catch (err) {
        console.log('Style font bind error: ' + textStyles[ts].name + ': ' + (err as Error).message);
      }
    }
  }

  return {
    textStyleByProps,
    textStyleByName,
    styleToWeight,
    fontSans,
    fontWeightMap,
  };
}

/**
 * Migrate a single text node's style (infer from properties if unstyled).
 * Returns the count of changes made (0 or 1).
 */
export async function migrateTextStyle(
  node: TextNode,
  ctx: TextMigrationContext,
  findNearestTextStyleFn: (fontSize: number, lineHeight: number | null, fontWeight: number) => TextStyle | null,
): Promise<number> {
  let changes = 0;
  let needsTokenInference = false;

  // 4. Text Style 교체 (named style → local CDS style)
  if (node.textStyleId && typeof node.textStyleId === 'string') {
    try {
      const currentTextStyle = await figma.getStyleByIdAsync(node.textStyleId);
      if (currentTextStyle && isCdsTypographyTokenStyleName(currentTextStyle.name) && !(currentTextStyle as TextStyle).remote) {
        return changes;
      }
      if (currentTextStyle) {
        const cdsTextStyle =
          ctx.textStyleByName[currentTextStyle.name] ||
          ctx.textStyleByName[normalizeTypographyStyleName(currentTextStyle.name)];
        if (cdsTextStyle && cdsTextStyle.id !== node.textStyleId) {
          await node.setTextStyleIdAsync(cdsTextStyle.id);
          changes++;
          console.log('Text Style: ' + currentTextStyle.name + ' -> CDS');
          return changes;
        }
        needsTokenInference = true;
      }
    } catch (err) {
      console.log('Text Style error: ' + (err as Error).message);
      needsTokenInference = true;
    }
  }

  // 4.5 Text Style 유추 (미스타일 텍스트 → 속성 기반 매칭)
  const fontFamily = (node.fontName && node.fontName !== figma.mixed) ? (node.fontName as FontName).family : '';
  if (fontFamily.indexOf('SF Pro') === 0) {
    console.log('Skipped SF Pro: ' + node.name + ' (' + fontFamily + ')');
  } else if (!node.textStyleId || node.textStyleId === '' || needsTokenInference) {
    const canInfer = node.fontSize !== figma.mixed
      && node.lineHeight !== figma.mixed;

    if (canInfer) {
      let nodeLH: number | null = null;
      const lh = node.lineHeight as LineHeight;
      if (lh && lh.unit === 'PIXELS') {
        nodeLH = lh.value;
      } else if (lh && lh.unit === 'PERCENT') {
        nodeLH = Math.round((node.fontSize as number) * lh.value / 100);
      }
      // AUTO → null (근사 매칭에서 lineHeight 무시하고 fontSize+weight만 비교)

      let nodeWeight: number | null = null;
      if (node.fontWeight && node.fontWeight !== figma.mixed) {
        nodeWeight = node.fontWeight as number;
      } else if (node.fontName && node.fontName !== figma.mixed) {
        nodeWeight = ctx.styleToWeight[(node.fontName as FontName).style] || null;
      }

      if (nodeWeight) {
        const propKey = (node.fontSize as number) + '_' + (nodeLH || 'auto') + '_' + nodeWeight;
        let inferredStyle: TextStyle | null = nodeLH
          ? ctx.textStyleByProps[(node.fontSize as number) + '_' + nodeLH + '_' + nodeWeight] || null
          : null;

        // 정확 매칭 실패 시 근사 매칭 fallback
        if (!inferredStyle) {
          inferredStyle = findNearestTextStyleFn(node.fontSize as number, nodeLH, nodeWeight);
        }

        if (inferredStyle) {
          try {
            if (node.fontName && node.fontName !== figma.mixed) {
              await figma.loadFontAsync(node.fontName as FontName);
            }
            await node.setTextStyleIdAsync(inferredStyle.id);
            changes++;
            console.log('Inferred: ' + inferredStyle.name + ' ← ' + node.name + ' (' + propKey + ')');
          } catch (err) {
            console.log('Infer error on ' + node.name + ': ' + err + ' | styleId=' + (inferredStyle ? inferredStyle.id : 'null'));
          }
        } else {
          console.log('No match: ' + node.name + ' (' + propKey + ')');
        }
      }
    }
  }

  return changes;
}
