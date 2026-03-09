// Figma Plugin: Migrate to TDS v4
// UI 패널 + Migrate / Detach Effect Styles

figma.showUI(__html__, { width: 280, height: 240 });

figma.ui.onmessage = async function(msg) {
  try {
    if (msg.type === 'migrate') {
      var result = await handleMigrate();
      figma.ui.postMessage({ type: 'result', text: result });
    } else if (msg.type === 'detach-effects') {
      var result = await handleDetachEffects();
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
    if (hasEffectStyleId && node.effectStyleId) {
      try {
        var currentStyle = await figma.getStyleByIdAsync(node.effectStyleId);
        var styleName = currentStyle ? currentStyle.name : node.effectStyleId;
        await node.setEffectStyleIdAsync('');
        // DROP_SHADOW만 제거, 나머지 effect 유지
        var remaining = node.effects.filter(function(e) { return e.type !== 'DROP_SHADOW'; });
        node.effects = remaining;
        count++;
        console.log('Removed: ' + styleName + ' on ' + node.name);
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

  var textStyleByName = {};
  for (var t = 0; t < textStyles.length; t++) {
    textStyleByName[textStyles[t].name] = textStyles[t];
  }

  var stats = { effects: 0, fills: 0, strokes: 0, textStyles: 0, skipped: 0 };

  async function processNode(node) {
    if (node.name.indexOf('Icon/') === 0 || node.name === 'Icon') {
      stats.skipped++;
      return;
    }

    // 1. Effect Style 교체
    if ('effectStyleId' in node && node.effectStyleId) {
      try {
        var currentEffectStyle = await figma.getStyleByIdAsync(node.effectStyleId);
        if (currentEffectStyle) {
          var tdsEffectStyle = findTdsEffectStyle(currentEffectStyle.name);
          if (tdsEffectStyle && tdsEffectStyle.id !== node.effectStyleId) {
            await node.setEffectStyleIdAsync(tdsEffectStyle.id);
            stats.effects++;
            console.log('Effect: ' + currentEffectStyle.name + ' -> TDS ' + tdsEffectStyle.name);
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
          if (currentTextStyle) {
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

  var total = stats.effects + stats.fills + stats.strokes + stats.textStyles;
  var msg = 'Effect ' + stats.effects + ', Fill ' + stats.fills + ', Stroke ' + stats.strokes + ', Text ' + stats.textStyles + ' (' + scope + ', skip: ' + stats.skipped + ')';
  figma.notify('Done: ' + msg);
  console.log('Stats:', stats);
  return msg;
}
