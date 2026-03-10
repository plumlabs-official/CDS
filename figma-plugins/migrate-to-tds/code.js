// Figma Plugin: TDS Migrator
// Style Migration / Icon / Cleanup

figma.showUI(__html__, { width: 280, height: 400 });

figma.ui.onmessage = async function(msg) {
  try {
    if (msg.type === 'migrate') {
      var result = await handleMigrate();
      figma.ui.postMessage({ type: 'result', text: result });
    } else if (msg.type === 'detach-effects') {
      var result = await handleDetachEffects();
      figma.ui.postMessage({ type: 'result', text: result });
    } else if (msg.type === 'bind-icon-colors') {
      var result = await handleBindIconColors();
      figma.ui.postMessage({ type: 'result', text: result });
    }
  } catch (error) {
    console.error('Plugin error:', error);
    figma.ui.postMessage({ type: 'result', text: 'Error: ' + error.message });
    figma.notify('Error: ' + error.message, { error: true });
  }
};

// === Detach Effect Styles ===

async function handleDetachEffects() {
  var targets = figma.currentPage.selection.length > 0
    ? figma.currentPage.selection
    : figma.currentPage.children;
  var scope = figma.currentPage.selection.length > 0 ? 'selection' : 'page';

  var count = 0;

  async function detachNode(node) {
    // 디버그: 노드의 effect 관련 속성 확인
    var hasEffectStyleId = 'effectStyleId' in node;
    var effectStyleId = hasEffectStyleId ? node.effectStyleId : 'N/A';
    var hasEffects = 'effects' in node && node.effects && node.effects.length > 0;
    if (hasEffects || effectStyleId) {
      console.log('[DEBUG] ' + node.name + ' | type: ' + node.type + ' | effectStyleId: ' + effectStyleId + ' | effects: ' + (hasEffects ? node.effects.length : 0));
    }

    // Ghost 타입 버튼은 스킵 (Focus ring effect 유지)
    if (node.name && node.name.indexOf('Type=Ghost') !== -1) {
      return;
    }

    // effectStyleId가 있는 경우 — async API로 해제
    if (hasEffectStyleId && node.effectStyleId && node.effectStyleId !== figma.mixed) {
      try {
        var currentStyle = await figma.getStyleByIdAsync(node.effectStyleId);
        var styleName = currentStyle ? currentStyle.name : node.effectStyleId;
        // focus/ 스타일은 보존 (focus ring도 DROP_SHADOW 타입이므로)
        if (styleName && styleName.indexOf('focus/') === 0) {
          console.log('Preserved focus style: ' + styleName + ' on ' + node.name);
        } else {
          await node.setEffectStyleIdAsync('');
          // DROP_SHADOW만 제거, 나머지 effect 유지
          var remaining = node.effects.filter(function(e) { return e.type !== 'DROP_SHADOW'; });
          node.effects = remaining;
          count++;
          console.log('Removed: ' + styleName + ' on ' + node.name);
        }
      } catch (err) {
        try {
          var remaining = node.effects.filter(function(e) { return e.type !== 'DROP_SHADOW'; });
          node.effects = remaining;
          count++;
          console.log('Removed (fallback): ' + node.name);
        } catch (err2) {
          console.log('Error on ' + node.name + ': ' + err.message);
        }
      }
    }
    // effectStyleId 없지만 effects 배열이 있는 경우
    else if (hasEffects) {
      var hadShadow = node.effects.some(function(e) { return e.type === 'DROP_SHADOW'; });
      if (hadShadow) {
        node.effects = node.effects.filter(function(e) { return e.type !== 'DROP_SHADOW'; });
        count++;
        console.log('Removed local drop shadows on ' + node.name);
      }
    }
    if ('children' in node) {
      for (var i = 0; i < node.children.length; i++) {
        await detachNode(node.children[i]);
      }
    }
  }

  for (var n = 0; n < targets.length; n++) {
    await detachNode(targets[n]);
  }

  var msg = 'Removed ' + count + ' effect(s) from ' + scope;
  figma.notify(msg);
  return msg;
}

// === Bind Icon Colors ===

async function handleBindIconColors() {
  var targets = figma.currentPage.selection.length > 0
    ? figma.currentPage.selection
    : figma.currentPage.children;
  var scope = figma.currentPage.selection.length > 0 ? 'selection' : 'page';

  // Mode Collection에서 foreground 변수 찾기
  var variables = await figma.variables.getLocalVariablesAsync();
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  var modeCollection = null;
  for (var c = 0; c < collections.length; c++) {
    if (collections[c].name === 'Mode') {
      modeCollection = collections[c];
      break;
    }
  }
  if (!modeCollection) {
    figma.notify('Mode Collection not found.');
    return 'Mode Collection not found';
  }

  var foregroundVar = null;
  for (var v = 0; v < variables.length; v++) {
    if (variables[v].variableCollectionId === modeCollection.id && variables[v].name === 'foreground') {
      foregroundVar = variables[v];
      break;
    }
  }
  if (!foregroundVar) {
    figma.notify('foreground variable not found in Mode Collection.');
    return 'foreground variable not found';
  }
  console.log('Found foreground variable: ' + foregroundVar.id);

  var count = 0;

  async function bindNode(node) {
    // Lucide Icons 컴포넌트 내부의 stroke 바인딩
    var isLucideIcon = node.name && node.name.indexOf('Lucide Icons /') === 0;

    if (isLucideIcon) {
      // 아이콘 자식 노드의 stroke를 foreground로 바인딩
      await bindChildStrokes(node);
    }

    if ('children' in node) {
      for (var i = 0; i < node.children.length; i++) {
        await bindNode(node.children[i]);
      }
    }
  }

  async function bindChildStrokes(node) {
    if ('strokes' in node && node.strokes && node.strokes !== figma.mixed && node.strokes.length > 0) {
      var newStrokes = [];
      var changed = false;
      for (var si = 0; si < node.strokes.length; si++) {
        var stroke = JSON.parse(JSON.stringify(node.strokes[si]));
        // 이미 바인딩되어 있으면 스킵
        var alreadyBound = node.boundVariables && node.boundVariables.strokes && node.boundVariables.strokes[si];
        if (!alreadyBound && stroke.type === 'SOLID') {
          try {
            stroke = figma.variables.setBoundVariableForPaint(stroke, 'color', foregroundVar);
            changed = true;
            count++;
            console.log('Bound stroke to foreground on ' + node.name);
          } catch (err) {
            console.log('Stroke bind error on ' + node.name + ': ' + err.message);
          }
        }
        newStrokes.push(stroke);
      }
      if (changed) node.strokes = newStrokes;
    }

    // fills도 확인 (일부 아이콘은 fill로 색상 적용)
    if ('fills' in node && node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
      var newFills = [];
      var fillChanged = false;
      for (var fi = 0; fi < node.fills.length; fi++) {
        var fill = JSON.parse(JSON.stringify(node.fills[fi]));
        var alreadyBound = node.boundVariables && node.boundVariables.fills && node.boundVariables.fills[fi];
        if (!alreadyBound && fill.type === 'SOLID') {
          // 배경색(#FFFFFF)은 스킵, 전경색만 바인딩
          var r = fill.color.r, g = fill.color.g, b = fill.color.b;
          var isWhite = r > 0.95 && g > 0.95 && b > 0.95;
          if (!isWhite) {
            try {
              fill = figma.variables.setBoundVariableForPaint(fill, 'color', foregroundVar);
              fillChanged = true;
              count++;
              console.log('Bound fill to foreground on ' + node.name);
            } catch (err) {
              console.log('Fill bind error on ' + node.name + ': ' + err.message);
            }
          }
        }
        newFills.push(fill);
      }
      if (fillChanged) node.fills = newFills;
    }

    if ('children' in node) {
      for (var i = 0; i < node.children.length; i++) {
        await bindChildStrokes(node.children[i]);
      }
    }
  }

  for (var n = 0; n < targets.length; n++) {
    await bindNode(targets[n]);
  }

  var msg = 'Bound ' + count + ' color(s) to foreground (' + scope + ')';
  figma.notify(msg);
  return msg;
}

// === Migrate ===

async function handleMigrate() {
  var targets = figma.currentPage.selection.length > 0
    ? figma.currentPage.selection
    : figma.currentPage.children;
  var scope = figma.currentPage.selection.length > 0 ? 'selection' : 'page';

  // TDS 리소스 로드
  var variables = await figma.variables.getLocalVariablesAsync();
  var effectStyles = await figma.getLocalEffectStylesAsync();
  var textStyles = await figma.getLocalTextStylesAsync();

  console.log('Variables: ' + variables.length + ', Effects: ' + effectStyles.length + ', Text Styles: ' + textStyles.length);

  // Mode Collection 변수만 필터
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  var modeCollection = null;
  for (var c = 0; c < collections.length; c++) {
    if (collections[c].name === 'Mode') {
      modeCollection = collections[c];
      break;
    }
  }

  if (!modeCollection) {
    figma.notify('Mode Collection not found.');
    return 'Mode Collection not found';
  }

  var modeVariables = [];
  for (var v = 0; v < variables.length; v++) {
    if (variables[v].variableCollectionId === modeCollection.id) {
      modeVariables.push(variables[v]);
    }
  }
  console.log('Mode Collection variables: ' + modeVariables.length);

  // 이름으로 검색 맵 (루트 레벨 우선)
  var variableByFullName = {};
  var variableByShortName = {};

  for (var i = 0; i < modeVariables.length; i++) {
    var v = modeVariables[i];
    var fullName = v.name;
    var parts = fullName.split('/');
    var shortName = parts[parts.length - 1];
    var isRootLevel = parts.length === 1;

    variableByFullName[fullName] = v;

    if (isRootLevel) {
      variableByShortName[shortName] = v;
    } else if (!variableByShortName[shortName]) {
      variableByShortName[shortName] = v;
    }
  }

  // alias 체인 resolve 함수
  var defaultModeId = modeCollection.modes[0].modeId;

  async function resolveColorValue(varObj) {
    var val = varObj.valuesByMode[defaultModeId];
    if (val === undefined) {
      var modes = Object.keys(varObj.valuesByMode);
      if (modes.length > 0) val = varObj.valuesByMode[modes[0]];
    }
    var depth = 0;
    while (val && val.type === 'VARIABLE_ALIAS' && depth < 10) {
      var aliasVar = await figma.variables.getVariableByIdAsync(val.id);
      if (!aliasVar) return null;
      var aliasVal = aliasVar.valuesByMode[defaultModeId];
      if (aliasVal === undefined) {
        var aliasModes = Object.keys(aliasVar.valuesByMode);
        aliasVal = aliasVar.valuesByMode[aliasModes[0]];
      }
      val = aliasVal;
      depth++;
    }
    if (val && typeof val === 'object' && val.type !== 'VARIABLE_ALIAS' && 'r' in val) {
      return val;
    }
    return null;
  }

  // COLOR 변수의 resolved value → 변수 역방향 맵 (alias resolve 포함, alpha 포함)
  var colorToVariable = {};
  for (var cv = 0; cv < modeVariables.length; cv++) {
    var mVar = modeVariables[cv];
    if (mVar.resolvedType !== 'COLOR') continue;
    // custom/ 변수는 제외 (기존 fill 스왑 로직과 일관)
    if (mVar.name.indexOf('custom/') === 0) continue;
    var colorVal = await resolveColorValue(mVar);
    if (!colorVal) continue;
    var r = Math.round(colorVal.r * 255);
    var g = Math.round(colorVal.g * 255);
    var b = Math.round(colorVal.b * 255);
    var a = Math.round((colorVal.a !== undefined ? colorVal.a : 1) * 100);
    var colorKey = r + '_' + g + '_' + b + '_' + a;
    if (!colorToVariable[colorKey]) {
      colorToVariable[colorKey] = mVar;
      console.log('Color map: ' + colorKey + ' → ' + mVar.name);
    }
  }
  console.log('Color map: ' + Object.keys(colorToVariable).length + ' entries');

  // 근사 컬러 매칭: RGB 유클리드 거리 기반 (캐시 포함)
  var MAX_COLOR_DISTANCE = 30;
  var nearestColorCache = {};

  function findNearestColor(r, g, b, a) {
    var cacheKey = r + '_' + g + '_' + b + '_' + a;
    if (nearestColorCache[cacheKey] !== undefined) return nearestColorCache[cacheKey];
    var bestVar = null;
    var bestDist = Infinity;
    for (var key in colorToVariable) {
      var parts = key.split('_');
      var cr = parseInt(parts[0]), cg = parseInt(parts[1]), cb = parseInt(parts[2]);
      var ca = parseInt(parts[3]);
      // alpha 차이도 거리에 포함 (가중치: alpha 1% = RGB 2.55)
      var dist = Math.sqrt(
        (r - cr) * (r - cr) + (g - cg) * (g - cg) + (b - cb) * (b - cb)
        + Math.pow((a - ca) * 2.55, 2)
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestVar = colorToVariable[key];
      }
    }
    var result = null;
    if (bestVar && bestDist <= MAX_COLOR_DISTANCE) {
      result = { variable: bestVar, distance: Math.round(bestDist) };
    }
    nearestColorCache[cacheKey] = result;
    return result;
  }

  function findTdsVariable(originalName) {
    var parts = originalName.split('/');
    var shortName = parts[parts.length - 1];
    if (variableByFullName[originalName]) return variableByFullName[originalName];
    if (variableByShortName[shortName]) return variableByShortName[shortName];
    return null;
  }

  var effectByName = {};
  var effectByShortName = {};
  for (var e = 0; e < effectStyles.length; e++) {
    var effectName = effectStyles[e].name;
    effectByName[effectName] = effectStyles[e];
    var effectParts = effectName.split('/');
    if (effectParts.length > 1) {
      effectByShortName[effectParts[effectParts.length - 1]] = effectStyles[e];
    }
  }

  function findTdsEffectStyle(originalName) {
    if (effectByName[originalName]) return effectByName[originalName];
    if (effectByName['shadows/' + originalName]) return effectByName['shadows/' + originalName];
    var parts = originalName.split('/');
    var shortName = parts[parts.length - 1];
    if (effectByShortName[shortName]) return effectByShortName[shortName];
    return null;
  }

  // TDS Effect Style만 필터 (shadows/ prefix)
  var tdsEffectStyles = [];
  for (var es = 0; es < effectStyles.length; es++) {
    if (effectStyles[es].name.indexOf('shadows/') === 0) {
      tdsEffectStyles.push(effectStyles[es]);
    }
  }
  console.log('TDS Effect Styles: ' + tdsEffectStyles.length);

  // Effect Style 속성 기반 맵 (TDS만)
  var effectStyleByProps = {};

  function serializeEffects(effects) {
    if (!effects || effects.length === 0) return null;
    var parts = [];
    for (var i = 0; i < effects.length; i++) {
      var e = effects[i];
      if (!e.visible) continue;
      var part = e.type + '_'
        + Math.round((e.offset ? e.offset.x : 0)) + '_'
        + Math.round((e.offset ? e.offset.y : 0)) + '_'
        + Math.round(e.radius || 0) + '_'
        + Math.round(e.spread || 0);
      parts.push(part);
    }
    parts.sort();
    return parts.join('|');
  }

  for (var es = 0; es < tdsEffectStyles.length; es++) {
    var eStyle = tdsEffectStyles[es];
    var eKey = serializeEffects(eStyle.effects);
    if (eKey && !effectStyleByProps[eKey]) {
      effectStyleByProps[eKey] = eStyle;
      console.log('Effect map: ' + eKey + ' → ' + eStyle.name);
    }
  }
  console.log('Effect Style props map: ' + Object.keys(effectStyleByProps).length + ' entries');

  // Effect 근사 매칭: 유클리드 거리 기반
  var MAX_EFFECT_DISTANCE = 50;

  function extractEffectVector(effects) {
    if (!effects) return null;
    for (var i = 0; i < effects.length; i++) {
      var e = effects[i];
      if (e.visible && e.type === 'DROP_SHADOW') {
        return {
          x: e.offset ? e.offset.x : 0,
          y: e.offset ? e.offset.y : 0,
          radius: e.radius || 0,
          spread: e.spread || 0
        };
      }
    }
    return null;
  }

  function findNearestTdsEffect(effects) {
    var srcVec = extractEffectVector(effects);
    if (!srcVec) return null;
    var bestStyle = null;
    var bestDist = Infinity;
    for (var i = 0; i < tdsEffectStyles.length; i++) {
      var tgtVec = extractEffectVector(tdsEffectStyles[i].effects);
      if (!tgtVec) continue;
      var dist = Math.sqrt(
        Math.pow(srcVec.x - tgtVec.x, 2) +
        Math.pow(srcVec.y - tgtVec.y, 2) +
        Math.pow(srcVec.radius - tgtVec.radius, 2) +
        Math.pow(srcVec.spread - tgtVec.spread, 2)
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestStyle = tdsEffectStyles[i];
      }
    }
    if (bestStyle && bestDist <= MAX_EFFECT_DISTANCE) {
      console.log('Nearest effect: dist=' + Math.round(bestDist) + ' → ' + bestStyle.name);
      nearestStats.effectCount++;
      nearestStats.effectTotalDist += bestDist;
      return bestStyle;
    }
    return null;
  }

  var textStyleByName = {};
  for (var t = 0; t < textStyles.length; t++) {
    textStyleByName[textStyles[t].name] = textStyles[t];
  }

  // fontName.style → weight 매핑 (fontWeight 직접 접근 불가 시 fallback)
  var styleToWeight = {
    'Thin': 100, 'ExtraLight': 200, 'Light': 300,
    'Regular': 400, 'Medium': 500, 'SemiBold': 600,
    'Bold': 700, 'ExtraBold': 800, 'Black': 900
  };

  // 속성 기반 역방향 Lookup Map: (fontSize_lineHeight_fontWeight) → TextStyle
  var textStyleByProps = {};
  for (var tp = 0; tp < textStyles.length; tp++) {
    var tStyle = textStyles[tp];
    var tsFontSize = tStyle.fontSize;
    var tsLineHeight = null;
    if (tStyle.lineHeight && tStyle.lineHeight.unit === 'PIXELS') {
      tsLineHeight = tStyle.lineHeight.value;
    } else if (tStyle.lineHeight && tStyle.lineHeight.unit === 'PERCENT') {
      tsLineHeight = Math.round(tsFontSize * tStyle.lineHeight.value / 100);
    }
    // AUTO → null (매칭 제외)
    var tsFontWeight = tStyle.fontWeight;
    if (!tsFontWeight && tStyle.fontName) {
      tsFontWeight = styleToWeight[tStyle.fontName.style] || null;
    }
    if (tsFontSize && tsLineHeight && tsFontWeight) {
      var tsKey = tsFontSize + '_' + tsLineHeight + '_' + tsFontWeight;
      if (!textStyleByProps[tsKey]) {
        textStyleByProps[tsKey] = tStyle;
        console.log('Style map: ' + tsKey + ' → ' + tStyle.name);
      }
    }
  }
  console.log('Text Style props map: ' + Object.keys(textStyleByProps).length + ' entries');

  // Text Style 근사 매칭: fontSize + fontWeight 기반 최근접
  var MAX_FONTSIZE_DISTANCE = 4; // px 허용 오차

  var MAX_WEIGHT_DISTANCE = 100; // weight ±100 허용 (e.g. 600→500 or 600→700)

  function findNearestTextStyle(fontSize, lineHeight, fontWeight) {
    var bestStyle = null;
    var bestDist = Infinity;
    for (var key in textStyleByProps) {
      var kParts = key.split('_');
      var tfs = parseInt(kParts[0]), tlh = parseInt(kParts[1]), tfw = parseInt(kParts[2]);
      var fsDist = Math.abs(fontSize - tfs);
      if (fsDist > MAX_FONTSIZE_DISTANCE) continue;
      var fwDist = Math.abs(fontWeight - tfw);
      if (fwDist > MAX_WEIGHT_DISTANCE) continue;
      var lhDist = lineHeight ? Math.abs(lineHeight - tlh) : 0;
      // 복합 거리: fontSize(가중치 3) + weight(가중치 2, 100단위→1단위) + lineHeight
      var combinedDist = fsDist * 3 + (fwDist / 100) * 2 + lhDist;
      if (combinedDist < bestDist) {
        bestDist = combinedDist;
        bestStyle = textStyleByProps[key];
      }
    }
    if (bestStyle) {
      console.log('Nearest text style: dist=' + Math.round(bestDist) + ' → ' + bestStyle.name);
      nearestStats.textCount = (nearestStats.textCount || 0) + 1;
    }
    return bestStyle;
  }

  // font-sans 변수 + font-weight 변수 맵 구축
  var fontSans = null;
  var fontWeightMap = {}; // { 100: var, 200: var, ... 900: var }
  var weightNameMap = {
    100: 'font-thin', 200: 'font-extralight', 300: 'font-light',
    400: 'font-normal', 500: 'font-medium', 600: 'font-semibold',
    700: 'font-bold', 800: 'font-extrabold', 900: 'font-black'
  };
  for (var fv = 0; fv < variables.length; fv++) {
    var vName = variables[fv].name;
    if (vName.indexOf('font-sans') !== -1 && !fontSans) {
      fontSans = variables[fv];
    }
    // font-weight 변수 매칭 (예: font/weight/font-medium, font-medium 등)
    for (var w in weightNameMap) {
      if (vName.indexOf(weightNameMap[w]) !== -1 && !fontWeightMap[w]) {
        fontWeightMap[w] = variables[fv];
      }
    }
  }
  if (fontSans) {
    console.log('Found font-sans: ' + fontSans.name);
    console.log('Font weight vars: ' + Object.keys(fontWeightMap).join(', '));
    // Pretendard 폰트 로드
    var fontStyleNames = ['Thin', 'ExtraLight', 'Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black'];
    for (var fl = 0; fl < fontStyleNames.length; fl++) {
      try {
        await figma.loadFontAsync({ family: 'Pretendard', style: fontStyleNames[fl] });
      } catch (e) {}
    }
    // 텍스트 스타일 전역 font-sans 바인딩
    for (var ts = 0; ts < textStyles.length; ts++) {
      try {
        await textStyles[ts].setBoundVariable('fontFamily', fontSans);
      } catch (err) {
        console.log('Style font bind error: ' + textStyles[ts].name + ': ' + err.message);
      }
    }
  }

  var stats = { effects: 0, fills: 0, strokes: 0, textStyles: 0, inferredStyles: 0, colorTokens: 0, fonts: 0, skipped: 0 };
  var nearestStats = { colorCount: 0, colorTotalDist: 0, effectCount: 0, effectTotalDist: 0 };

  async function processNode(node) {
    if (node.name && (node.name.indexOf('Icon/') === 0 || node.name === 'Icon')) {
      stats.skipped++;
      return;
    }

    // 1. Effect Style 교체 (shadows/ 계열만 — focus/ 등 비-shadow 스타일 보존)
    if ('effectStyleId' in node && node.effectStyleId && node.effectStyleId !== figma.mixed) {
      try {
        var currentEffectStyle = await figma.getStyleByIdAsync(node.effectStyleId);
        if (currentEffectStyle && currentEffectStyle.name.indexOf('focus/') !== 0) {
          // 이미 TDS 로컬 Effect Style이면 스킵
          if (currentEffectStyle.remote) {
            var tdsEffectStyle = findTdsEffectStyle(currentEffectStyle.name);

            // 이름 매칭 실패 → 속성 정확 매칭 → 근사 매칭 fallback
            if (!tdsEffectStyle || tdsEffectStyle.id === node.effectStyleId) {
              var nodeEffectKey = serializeEffects(currentEffectStyle.effects);
              if (nodeEffectKey && effectStyleByProps[nodeEffectKey]) {
                tdsEffectStyle = effectStyleByProps[nodeEffectKey];
              }
            }
            if (!tdsEffectStyle || tdsEffectStyle.id === node.effectStyleId) {
              tdsEffectStyle = findNearestTdsEffect(currentEffectStyle.effects);
            }

            if (tdsEffectStyle && tdsEffectStyle.id !== node.effectStyleId) {
              await node.setEffectStyleIdAsync(tdsEffectStyle.id);
              stats.effects++;
              console.log('Effect: ' + currentEffectStyle.name + ' -> TDS ' + tdsEffectStyle.name);
            }
          }
        }
      } catch (err) {
        console.log('Effect error: ' + err.message);
      }
    }

    // 2. Fill 변수 교체
    if ('fills' in node && node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
      var newFills = [];
      var fillChanged = false;
      for (var fi = 0; fi < node.fills.length; fi++) {
        var fill = JSON.parse(JSON.stringify(node.fills[fi]));
        if (node.boundVariables && node.boundVariables.fills && node.boundVariables.fills[fi]) {
          var fillBinding = node.boundVariables.fills[fi];
          try {
            var currentFillVar = await figma.variables.getVariableByIdAsync(fillBinding.id);
            if (currentFillVar) {
              // 이미 TDS(Mode Collection) 변수면 스킵
              if (currentFillVar.variableCollectionId === modeCollection.id) {
                newFills.push(fill);
                continue;
              }
              if (currentFillVar.name.indexOf('custom/') === 0) {
                newFills.push(fill);
                continue;
              }
              var tdsFillVar = findTdsVariable(currentFillVar.name);
              if (tdsFillVar && tdsFillVar.id !== currentFillVar.id) {
                fill = figma.variables.setBoundVariableForPaint(fill, 'color', tdsFillVar);
                fillChanged = true;
                stats.fills++;
                console.log('Fill: ' + currentFillVar.name + ' -> TDS ' + tdsFillVar.name);
              }
            }
          } catch (err) {
            console.log('Fill bind error: ' + err.message);
          }
        }
        newFills.push(fill);
      }
      if (fillChanged) node.fills = newFills;
    }

    // 3. Stroke 변수 교체
    if ('strokes' in node && node.strokes && node.strokes !== figma.mixed && node.strokes.length > 0) {
      var newStrokes = [];
      var strokeChanged = false;
      for (var si = 0; si < node.strokes.length; si++) {
        var stroke = JSON.parse(JSON.stringify(node.strokes[si]));
        if (node.boundVariables && node.boundVariables.strokes && node.boundVariables.strokes[si]) {
          var strokeBinding = node.boundVariables.strokes[si];
          try {
            var currentStrokeVar = await figma.variables.getVariableByIdAsync(strokeBinding.id);
            if (currentStrokeVar) {
              // 이미 TDS(Mode Collection) 변수면 스킵
              if (currentStrokeVar.variableCollectionId === modeCollection.id) {
                newStrokes.push(stroke);
                continue;
              }
              if (currentStrokeVar.name.indexOf('custom/') === 0) {
                newStrokes.push(stroke);
                continue;
              }
              var tdsStrokeVar = findTdsVariable(currentStrokeVar.name);
              if (tdsStrokeVar && tdsStrokeVar.id !== currentStrokeVar.id) {
                stroke = figma.variables.setBoundVariableForPaint(stroke, 'color', tdsStrokeVar);
                strokeChanged = true;
                stats.strokes++;
                console.log('Stroke: ' + currentStrokeVar.name + ' -> TDS ' + tdsStrokeVar.name);
              }
            }
          } catch (err) {
            console.log('Stroke bind error: ' + err.message);
          }
        }
        newStrokes.push(stroke);
      }
      if (strokeChanged) node.strokes = newStrokes;
    }

    // 4. Text Style 교체
    if (node.type === 'TEXT') {
      if (node.textStyleId && typeof node.textStyleId === 'string') {
        try {
          var currentTextStyle = await figma.getStyleByIdAsync(node.textStyleId);
          if (currentTextStyle && currentTextStyle.remote) {
            var tdsTextStyle = textStyleByName[currentTextStyle.name];
            if (tdsTextStyle && tdsTextStyle.id !== node.textStyleId) {
              await node.setTextStyleIdAsync(tdsTextStyle.id);
              stats.textStyles++;
              console.log('Text Style: ' + currentTextStyle.name + ' -> TDS');
            }
          }
        } catch (err) {
          console.log('Text Style error: ' + err.message);
        }
      }

      // 4.5 Text Style 유추 (미스타일 텍스트 → 속성 기반 매칭)
      // SF Pro (iOS native) 폰트는 스킵 — 의도적으로 사용하는 시스템 폰트
      var fontFamily = (node.fontName && node.fontName !== figma.mixed) ? node.fontName.family : '';
      if (fontFamily.indexOf('SF Pro') === 0) {
        // SF Pro 텍스트는 스타일/폰트 바인딩 전체 스킵
      } else if (!node.textStyleId || node.textStyleId === '') {
        var canInfer = node.fontSize !== figma.mixed
          && node.lineHeight !== figma.mixed;

        if (canInfer) {
          var nodeLH = null;
          if (node.lineHeight && node.lineHeight.unit === 'PIXELS') {
            nodeLH = node.lineHeight.value;
          } else if (node.lineHeight && node.lineHeight.unit === 'PERCENT') {
            nodeLH = Math.round(node.fontSize * node.lineHeight.value / 100);
          }
          // AUTO → null (근사 매칭에서 lineHeight 무시하고 fontSize+weight만 비교)

          var nodeWeight = null;
          if (node.fontWeight && node.fontWeight !== figma.mixed) {
            nodeWeight = node.fontWeight;
          } else if (node.fontName && node.fontName !== figma.mixed) {
            nodeWeight = styleToWeight[node.fontName.style] || null;
          }

          if (nodeWeight) {
            var propKey = node.fontSize + '_' + (nodeLH || 'auto') + '_' + nodeWeight;
            var inferredStyle = nodeLH ? textStyleByProps[node.fontSize + '_' + nodeLH + '_' + nodeWeight] : null;

            // 정확 매칭 실패 시 근사 매칭 fallback
            if (!inferredStyle) {
              inferredStyle = findNearestTextStyle(node.fontSize, nodeLH, nodeWeight);
            }

            if (inferredStyle) {
              try {
                if (node.fontName && node.fontName !== figma.mixed) {
                  await figma.loadFontAsync(node.fontName);
                }
                await node.setTextStyleIdAsync(inferredStyle.id);
                stats.inferredStyles++;
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

      // 4.6: 텍스트 Fill 컬러 → TDS 변수 바인딩 (바인딩 안 된 하드코딩 색상만)
      if ('fills' in node && node.fills && node.fills !== figma.mixed) {
        var newTextFills = [];
        var textFillChanged = false;
        for (var tfi = 0; tfi < node.fills.length; tfi++) {
          var textFill = JSON.parse(JSON.stringify(node.fills[tfi]));
          var alreadyBound = node.boundVariables && node.boundVariables.fills
            && node.boundVariables.fills[tfi];
          if (!alreadyBound && textFill.type === 'SOLID') {
            var tr = Math.round(textFill.color.r * 255);
            var tg = Math.round(textFill.color.g * 255);
            var tb = Math.round(textFill.color.b * 255);
            var ta = Math.round((textFill.opacity !== undefined ? textFill.opacity : 1) * 100);
            var textColorKey = tr + '_' + tg + '_' + tb + '_' + ta;
            var matchedVar = colorToVariable[textColorKey];
            if (matchedVar) {
              try {
                textFill = figma.variables.setBoundVariableForPaint(textFill, 'color', matchedVar);
                textFillChanged = true;
                stats.colorTokens++;
                console.log('Text color: ' + textColorKey + ' → ' + matchedVar.name + ' on ' + node.name);
              } catch (err) {
                console.log('Text color bind error: ' + err.message);
              }
            } else {
              // 근사 매칭 fallback
              var nearest = findNearestColor(tr, tg, tb, ta);
              if (nearest) {
                try {
                  textFill = figma.variables.setBoundVariableForPaint(textFill, 'color', nearest.variable);
                  textFillChanged = true;
                  stats.colorTokens++;
                  nearestStats.colorCount++;
                  nearestStats.colorTotalDist += nearest.distance;
                  console.log('Text color: ' + textColorKey + ' ~> ' + nearest.variable.name + ' (dist: ' + nearest.distance + ') on ' + node.name);
                } catch (err) {
                  console.log('Text color bind error: ' + err.message);
                }
              }
            }
          }
          newTextFills.push(textFill);
        }
        if (textFillChanged) node.fills = newTextFills;
      }

      // 5. fontFamily + fontWeight 바인딩 (유추 실패한 미스타일 텍스트만, SF Pro 제외)
      if (fontSans && (!node.textStyleId || node.textStyleId === '') && fontFamily.indexOf('SF Pro') !== 0) {
        try {
          // 현재 폰트 로드 (수정 전 필수)
          if (node.fontName && node.fontName !== figma.mixed) {
            await figma.loadFontAsync(node.fontName);
            try {
              await figma.loadFontAsync({ family: 'Pretendard', style: node.fontName.style });
            } catch (e) {}
          }
          // fontFamily 바인딩
          await node.setBoundVariable('fontFamily', fontSans);
          // fontWeight 바인딩 (현재 weight에 매칭되는 TDS 토큰)
          if (node.fontWeight && node.fontWeight !== figma.mixed && fontWeightMap[node.fontWeight]) {
            await node.setBoundVariable('fontWeight', fontWeightMap[node.fontWeight]);
            console.log('Font weight bound: ' + node.fontWeight + ' on ' + node.name);
          }
          stats.fonts++;
        } catch (err) {
          console.log('Font bind error on ' + node.name + ': ' + err + ' | fontName=' + JSON.stringify(node.fontName) + ' | styleId=' + (node.textStyleId || 'none'));
        }
      }
    }

    if ('children' in node) {
      for (var ci = 0; ci < node.children.length; ci++) {
        await processNode(node.children[ci]);
      }
    }
  }

  for (var n = 0; n < targets.length; n++) {
    await processNode(targets[n]);
  }

  // === Component Instance Swap (통합) ===
  var compSwapResult = await swapComponentInstances(targets, scope);

  var total = stats.effects + stats.fills + stats.strokes + stats.textStyles + stats.inferredStyles + stats.colorTokens + stats.fonts;
  var msg = 'Effect ' + stats.effects + ', Fill ' + stats.fills + ', Stroke ' + stats.strokes + ', Text ' + stats.textStyles + ', Inferred ' + stats.inferredStyles + ', Color ' + stats.colorTokens + ', Font ' + stats.fonts + ', Comp ' + compSwapResult.swapped + ' (' + scope + ', skip: ' + stats.skipped + ')';
  figma.notify('Done: ' + msg);
  console.log('Stats:', stats);
  console.log('Component swap:', compSwapResult);
  // 근사 매칭 요약
  if (nearestStats.colorCount > 0) {
    console.log('[SUMMARY] Nearest color matches: ' + nearestStats.colorCount + ' (avg dist: ' + Math.round(nearestStats.colorTotalDist / nearestStats.colorCount) + ')');
  }
  if (nearestStats.effectCount > 0) {
    console.log('[SUMMARY] Nearest effect matches: ' + nearestStats.effectCount + ' (avg dist: ' + Math.round(nearestStats.effectTotalDist / nearestStats.effectCount) + ')');
  }
  if (nearestStats.textCount) {
    console.log('[SUMMARY] Nearest text style matches: ' + nearestStats.textCount);
  }
  return msg;
}

// === Swap Components (내부 함수 — handleMigrate에서 호출) ===

async function swapComponentInstances(targets, scope) {
  // 1. 소스 페이지 로드 (Components + Icon Library)
  var sourcePages = [];
  for (var p = 0; p < figma.root.children.length; p++) {
    var pageName = figma.root.children[p].name;
    if (pageName === 'Components' || pageName === 'Icon Library') {
      sourcePages.push(figma.root.children[p]);
    }
  }
  if (sourcePages.length === 0) {
    console.log('Components/Icon Library pages not found — skipping component swap');
    return { swapped: 0, skipped: 0 };
  }

  var compMap = {};
  for (var sp = 0; sp < sourcePages.length; sp++) {
    await sourcePages[sp].loadAsync();

    // 2. 각 페이지에서 모든 COMPONENT 수집 (COMPONENT_SET 내부 포함)
    var allComps = sourcePages[sp].findAll(function(n) {
      return n.type === 'COMPONENT';
    });
    for (var i = 0; i < allComps.length; i++) {
      var comp = allComps[i];
      if (comp.name) {
        compMap[comp.name] = comp;
      }
    }
  }

  // COMPONENT_SET도 수집 (variant 매칭용)
  for (var sp2 = 0; sp2 < sourcePages.length; sp2++) {
    var allSets = sourcePages[sp2].findAll(function(n) {
      return n.type === 'COMPONENT_SET';
    });
    for (var i = 0; i < allSets.length; i++) {
      var cs = allSets[i];
      if (cs.name) {
        compMap['__SET__' + cs.name] = cs;
      }
    }
  }

  var compCount = Object.keys(compMap).length;
  var setNames = [];
  for (var k in compMap) {
    if (k.indexOf('__SET__') === 0) setNames.push(k.replace('__SET__', ''));
  }
  console.log('TDS components: ' + (compCount - setNames.length) + ', SETs: ' + setNames.length);

  if (compCount === 0) {
    return { swapped: 0, skipped: 0 };
  }

  var swapCount = 0;
  var skipCount = 0;
  var missCount = 0;

  // SET에서 variant 매칭 헬퍼
  function findVariantInSet(localSet, compName, node) {
    // 1. 정확한 variant 이름 매칭
    for (var c = 0; c < localSet.children.length; c++) {
      if (localSet.children[c].name === compName) return localSet.children[c];
    }
    // 2. variant 프로퍼티 값 비교
    var variantProps = {};
    try {
      var props = node.componentProperties;
      for (var key in props) {
        if (props[key].type === 'VARIANT') {
          variantProps[key] = props[key].value;
        }
      }
    } catch (e) {}
    var propKeys = Object.keys(variantProps);
    if (propKeys.length > 0) {
      for (var c = 0; c < localSet.children.length; c++) {
        var candidate = localSet.children[c];
        var candidateProps = {};
        try {
          var cpArr = candidate.name.split(', ');
          for (var cp = 0; cp < cpArr.length; cp++) {
            var parts = cpArr[cp].split('=');
            if (parts.length === 2) candidateProps[parts[0].trim()] = parts[1].trim();
          }
        } catch (e) {}
        var matchAll = true;
        var matchCount = 0;
        for (var vk = 0; vk < propKeys.length; vk++) {
          var k = propKeys[vk];
          if (candidateProps[k] !== undefined) {
            if (candidateProps[k] !== variantProps[k]) { matchAll = false; break; }
            matchCount++;
          }
        }
        if (matchAll && matchCount > 0) return candidate;
      }
    }
    // 3. fallback: default variant (첫 번째)
    return localSet.children.length > 0 ? localSet.children[0] : null;
  }

  async function traverseAndSwap(node) {
    if (node.type === 'INSTANCE') {
      try {
        var mainComp = await node.getMainComponentAsync();

        if (mainComp && mainComp.remote) {
          var compName = mainComp.name;
          var swapped = false;

          // 1차: variant 이름으로 정확 매칭
          if (compMap[compName]) {
            node.swapComponent(compMap[compName]);
            swapCount++;
            swapped = true;
            console.log('Swapped: ' + node.name + ' → ' + compName);
          }

          // 2차: mainComp.parent COMPONENT_SET으로 매칭
          if (!swapped && mainComp.parent && mainComp.parent.type === 'COMPONENT_SET') {
            var localSet = compMap['__SET__' + mainComp.parent.name];
            if (localSet && localSet.type === 'COMPONENT_SET') {
              var match = findVariantInSet(localSet, compName, node);
              if (match) {
                node.swapComponent(match);
                swapCount++;
                swapped = true;
                console.log('Swapped (via parent set): ' + node.name + ' → ' + match.name);
              }
            }
          }

          // 3차: node.name으로 COMPONENT_SET 매칭
          if (!swapped) {
            var localSet = compMap['__SET__' + node.name];
            if (localSet && localSet.type === 'COMPONENT_SET') {
              var match = findVariantInSet(localSet, compName, node);
              if (match) {
                node.swapComponent(match);
                swapCount++;
                swapped = true;
                console.log('Swapped (by node.name): ' + node.name + ' → ' + match.name);
              }
            }
          }

          if (!swapped) {
            missCount++;
            console.log('[MISS] remote: node.name=' + node.name + ', mainComp.name=' + compName + ', parent=' + (mainComp.parent ? mainComp.parent.name : 'null'));
          }
        } else if (mainComp) {
          skipCount++;
        }
        // 로컬/원격 모두 children 순회 계속 (중첩 원격 인스턴스 탐지)
      } catch (err) {
        console.log('Swap error on ' + node.name + ': ' + err.message);
      }
    }
    if ('children' in node) {
      for (var i = 0; i < node.children.length; i++) {
        await traverseAndSwap(node.children[i]);
      }
    }
  }

  for (var n = 0; n < targets.length; n++) {
    await traverseAndSwap(targets[n]);
  }

  console.log('Component swap: ' + swapCount + ' swapped, ' + skipCount + ' local, ' + missCount + ' missed (' + scope + ')');
  return { swapped: swapCount, skipped: skipCount, missed: missCount };
}



