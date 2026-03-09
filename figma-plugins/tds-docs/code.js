// TDS Docs Generator — 1회용 플러그인
// Typography 쇼케이스 + Color Chip 팔레트 + Effect Showcase 페이지 자동 생성

// ─── Utilities ───────────────────────────────────────────

// Accessible label color constants (WCAG AA 4.5:1+ on white)
var LABEL_COLOR = { r: 0.388, g: 0.388, b: 0.4 };       // #636366, 5.5:1
var TITLE_COLOR = { r: 0.035, g: 0.035, b: 0.043 };      // #09090B
var SUBTITLE_COLOR = { r: 0.388, g: 0.388, b: 0.4 };     // #636366

function getOrCreateDocPage(name) {
  for (var i = 0; i < figma.root.children.length; i++) {
    if (figma.root.children[i].name === name) {
      figma.root.children[i].remove();
      break;
    }
  }
  var page = figma.createPage();
  page.name = name;
  return page;
}

function makeALFrame(opts) {
  var f = figma.createFrame();
  f.name = opts.name || 'Frame';
  f.layoutMode = opts.layoutMode || 'VERTICAL';
  f.itemSpacing = opts.itemSpacing !== undefined ? opts.itemSpacing : 0;
  var pad = opts.padding !== undefined ? opts.padding : 0;
  f.paddingTop = pad; f.paddingBottom = pad;
  f.paddingLeft = pad; f.paddingRight = pad;
  f.primaryAxisSizingMode = opts.primarySizing || 'AUTO';
  f.counterAxisSizingMode = opts.counterSizing || 'AUTO';
  f.fills = opts.fills !== undefined ? opts.fills : [];
  if (opts.cornerRadius) f.cornerRadius = opts.cornerRadius;
  if (opts.width) f.resize(opts.width, f.height);
  return f;
}

// Sync — callers must pre-load Inter fonts before calling
function makeLabel(text, fontSize, color, fontStyle) {
  var style = fontStyle || 'Regular';
  var t = figma.createText();
  t.fontName = { family: 'Inter', style: style };
  t.fontSize = fontSize || 12;
  t.characters = text;
  t.fills = [{ type: 'SOLID', color: color || LABEL_COLOR }];
  return t;
}

async function preloadInterFonts() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
}

function toHex(n) {
  return ('0' + n.toString(16).toUpperCase()).slice(-2);
}

function rgbToHex(r, g, b) {
  return '#' + toHex(Math.round(r * 255)) + toHex(Math.round(g * 255)) + toHex(Math.round(b * 255));
}

async function resolveColorValue(varObj, defaultModeId) {
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

// ─── Typography ──────────────────────────────────────────

var BUCKETS = ['4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'];
var WEIGHT_ORDER = [
  'font-thin', 'font-extralight', 'font-light',
  'font-normal', 'font-medium', 'font-semibold',
  'font-bold', 'font-extrabold', 'font-black'
];

var EXAMPLE_TEXTS = {
  'xs':   'The quick brown fox jumps over the lazy dog',
  'sm':   'The quick brown fox jumps over the lazy dog',
  'base': 'The quick brown fox jumps over the lazy dog',
  'lg':   'Designing systems that scale beautifully',
  'xl':   'Building with design tokens',
  '2xl':  'TDS Component Library',
  '3xl':  'Design Systems',
  '4xl':  'Typography',
};

function getBucket(styleName) {
  for (var i = 0; i < BUCKETS.length; i++) {
    if (styleName.indexOf('text-' + BUCKETS[i]) === 0) return BUCKETS[i];
  }
  return null;
}

function getWeightOrder(styleName) {
  for (var i = 0; i < WEIGHT_ORDER.length; i++) {
    if (styleName.indexOf(WEIGHT_ORDER[i]) !== -1) return i;
  }
  return 99;
}

// Figma font style name from TDS style name
function figmaFontStyle(styleName) {
  if (styleName.indexOf('font-black') !== -1) return 'Black';
  if (styleName.indexOf('font-extrabold') !== -1) return 'ExtraBold';
  if (styleName.indexOf('font-bold') !== -1) return 'Bold';
  if (styleName.indexOf('font-semibold') !== -1) return 'SemiBold';
  if (styleName.indexOf('font-medium') !== -1) return 'Medium';
  if (styleName.indexOf('font-light') !== -1) return 'Light';
  if (styleName.indexOf('font-extralight') !== -1) return 'ExtraLight';
  if (styleName.indexOf('font-thin') !== -1) return 'Thin';
  return 'Regular';
}

async function handleGenTypography() {
  figma.notify('Generating typography page...');

  var textStyles = await figma.getLocalTextStylesAsync();
  if (textStyles.length === 0) {
    figma.notify('No text styles found', { error: true });
    return;
  }

  // Group by bucket
  var bucketMap = {};
  for (var i = 0; i < textStyles.length; i++) {
    var s = textStyles[i];
    var bucket = getBucket(s.name);
    if (!bucket) continue;
    if (!bucketMap[bucket]) bucketMap[bucket] = [];
    bucketMap[bucket].push(s);
  }

  // Sort each bucket by weight
  for (var key in bucketMap) {
    bucketMap[key].sort(function(a, b) {
      return getWeightOrder(a.name) - getWeightOrder(b.name);
    });
  }

  // Create page
  var page = getOrCreateDocPage('Typography');
  figma.currentPage = page;

  // Pre-load fonts
  await preloadInterFonts();

  // Try loading Pretendard variants
  var pretendardStyles = ['Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black', 'Light', 'ExtraLight', 'Thin'];
  for (var pi = 0; pi < pretendardStyles.length; pi++) {
    try { await figma.loadFontAsync({ family: 'Pretendard', style: pretendardStyles[pi] }); } catch(e) {}
  }

  // Root frame
  var root = makeALFrame({
    name: 'Typography Showcase',
    layoutMode: 'VERTICAL',
    itemSpacing: 48,
    padding: 64,
    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
    counterSizing: 'FIXED',
    width: 1200
  });

  // Title
  var title = makeLabel('Typography', 36, TITLE_COLOR, 'Semi Bold');
  root.appendChild(title);

  var subtitle = makeLabel('TDS Text Styles — Pretendard', 16, SUBTITLE_COLOR);
  root.appendChild(subtitle);

  var totalCount = 0;

  // Render each bucket
  for (var bi = 0; bi < BUCKETS.length; bi++) {
    var bk = BUCKETS[bi];
    var styles = bucketMap[bk];
    if (!styles || styles.length === 0) continue;

    var section = makeALFrame({
      name: 'Section: text-' + bk,
      layoutMode: 'VERTICAL',
      itemSpacing: 16
    });

    // Section header
    var sizeInfo = styles[0].fontSize ? ' — ' + styles[0].fontSize + 'px' : '';
    var header = makeLabel('text-' + bk + sizeInfo, 14, SUBTITLE_COLOR, 'Medium');
    section.appendChild(header);

    // Each style row
    for (var si = 0; si < styles.length; si++) {
      var style = styles[si];

      var row = makeALFrame({
        name: style.name,
        layoutMode: 'HORIZONTAL',
        itemSpacing: 32
      });
      row.counterAxisAlignItems = 'CENTER';

      // Left: style name label
      var nameLabel = makeLabel(style.name, 12, LABEL_COLOR);
      nameLabel.resize(280, nameLabel.height);
      nameLabel.textAutoResize = 'HEIGHT';
      row.appendChild(nameLabel);
      nameLabel.layoutSizingHorizontal = 'FIXED';

      // Right: example text with style applied
      var fStyle = figmaFontStyle(style.name);
      try {
        await figma.loadFontAsync({ family: 'Pretendard', style: fStyle });
      } catch(e) {
        try { await figma.loadFontAsync({ family: 'Pretendard', style: 'Regular' }); } catch(e2) {}
      }

      var example = figma.createText();
      example.fontName = { family: 'Pretendard', style: fStyle };
      example.characters = EXAMPLE_TEXTS[bk] || 'The quick brown fox';
      example.fills = [{ type: 'SOLID', color: TITLE_COLOR }];

      // Apply TDS text style
      try {
        await example.setTextStyleIdAsync(style.id);
      } catch(e) {
        console.log('Failed to apply style: ' + style.name + ' - ' + e.message);
      }

      row.appendChild(example);
      example.layoutSizingHorizontal = 'FILL';

      section.appendChild(row);
      row.layoutSizingHorizontal = 'FILL';
      totalCount++;
    }

    root.appendChild(section);
    section.layoutSizingHorizontal = 'FILL';

    // Divider (except last)
    if (bi < BUCKETS.length - 1 && bucketMap[BUCKETS[bi + 1]]) {
      var divider = figma.createLine();
      divider.name = 'Divider';
      divider.resize(1072, 0);
      divider.strokes = [{ type: 'SOLID', color: { r: 0.89, g: 0.89, b: 0.91 } }];
      divider.strokeWeight = 1;
      root.appendChild(divider);
      divider.layoutSizingHorizontal = 'FILL';
    }
  }

  // Position and zoom
  root.x = 100;
  root.y = 100;
  figma.viewport.scrollAndZoomIntoView([root]);

  figma.notify('Typography page created: ' + totalCount + ' styles');
}

// ─── Colors ──────────────────────────────────────────────

var COLOR_GROUPS = [
  { key: 'background',  label: 'Background' },
  { key: 'foreground',  label: 'Foreground' },
  { key: 'primary',     label: 'Primary' },
  { key: 'secondary',   label: 'Secondary' },
  { key: 'destructive', label: 'Destructive' },
  { key: 'muted',       label: 'Muted' },
  { key: 'accent',      label: 'Accent' },
  { key: 'card',        label: 'Card' },
  { key: 'popover',     label: 'Popover' },
  { key: 'border',      label: 'Border' },
  { key: 'input',       label: 'Input' },
  { key: 'ring',        label: 'Ring' },
  { key: 'sidebar',     label: 'Sidebar' },
  { key: 'chart',       label: 'Chart' },
];

function groupColorVars(vars) {
  var groups = {};
  var ungrouped = [];

  for (var i = 0; i < vars.length; i++) {
    var v = vars[i];
    var matched = false;
    for (var g = 0; g < COLOR_GROUPS.length; g++) {
      var key = COLOR_GROUPS[g].key;
      if (v.name === key || v.name.indexOf(key + '-') === 0 || v.name.indexOf(key + '/') !== -1) {
        if (!groups[key]) groups[key] = [];
        groups[key].push(v);
        matched = true;
        break;
      }
    }
    if (!matched) ungrouped.push(v);
  }
  return { groups: groups, ungrouped: ungrouped };
}

async function createColorSwatch(colorVar, resolvedRGB, ringVar) {
  var wrapper = makeALFrame({
    name: colorVar.name,
    layoutMode: 'VERTICAL',
    itemSpacing: 6
  });

  // Color rectangle
  var rect = figma.createRectangle();
  rect.name = 'Swatch';
  rect.resize(88, 56);
  rect.cornerRadius = 8;

  // Bind variable to fill
  var paint = { type: 'SOLID', color: { r: resolvedRGB.r, g: resolvedRGB.g, b: resolvedRGB.b } };
  if (resolvedRGB.a !== undefined && resolvedRGB.a < 1) {
    paint.opacity = resolvedRGB.a;
  }
  try {
    paint = figma.variables.setBoundVariableForPaint(paint, 'color', colorVar);
  } catch(e) {
    console.log('Bind failed: ' + colorVar.name + ' - ' + e.message);
  }
  rect.fills = [paint];

  // Add 1px border with ring variable
  if (ringVar) {
    var strokePaint = { type: 'SOLID', color: { r: 0.89, g: 0.89, b: 0.91 } };
    try {
      strokePaint = figma.variables.setBoundVariableForPaint(strokePaint, 'color', ringVar);
    } catch(e) {
      console.log('Ring bind failed: ' + e.message);
    }
    rect.strokes = [strokePaint];
    rect.strokeWeight = 1;
  }

  wrapper.appendChild(rect);

  // Variable name label
  var nameLabel = makeLabel(colorVar.name, 11, { r: 0.13, g: 0.13, b: 0.15 }, 'Medium');
  wrapper.appendChild(nameLabel);
  nameLabel.layoutSizingHorizontal = 'FIXED';
  nameLabel.resize(88, nameLabel.height);
  nameLabel.textAutoResize = 'HEIGHT';

  // Hex label
  var hex = rgbToHex(resolvedRGB.r, resolvedRGB.g, resolvedRGB.b);
  if (resolvedRGB.a !== undefined && resolvedRGB.a < 1) {
    hex += ' ' + Math.round(resolvedRGB.a * 100) + '%';
  }
  var hexLabel = makeLabel(hex, 10, LABEL_COLOR);
  wrapper.appendChild(hexLabel);

  return wrapper;
}

async function handleGenColors() {
  figma.notify('Generating color page...');

  // Find Mode collection
  var collections = await figma.variables.getLocalVariableCollectionsAsync();
  var modeCollection = null;
  for (var c = 0; c < collections.length; c++) {
    if (collections[c].name === 'Mode') {
      modeCollection = collections[c];
      break;
    }
  }
  if (!modeCollection) {
    figma.notify('Mode collection not found', { error: true });
    return;
  }

  var defaultModeId = modeCollection.modes[0].modeId;

  // Load all variables in Mode collection
  var allVars = await figma.variables.getLocalVariablesAsync();
  var modeVars = [];
  for (var v = 0; v < allVars.length; v++) {
    if (allVars[v].variableCollectionId === modeCollection.id && allVars[v].resolvedType === 'COLOR') {
      if (allVars[v].name.indexOf('custom/') !== 0) {
        modeVars.push(allVars[v]);
      }
    }
  }

  if (modeVars.length === 0) {
    figma.notify('No color variables found in Mode collection', { error: true });
    return;
  }

  // Find ring variable for swatch borders
  var ringVar = null;
  for (var rv0 = 0; rv0 < modeVars.length; rv0++) {
    if (modeVars[rv0].name === 'ring') {
      ringVar = modeVars[rv0];
      break;
    }
  }

  // Resolve all colors
  var resolvedMap = {};
  for (var rv = 0; rv < modeVars.length; rv++) {
    var resolved = await resolveColorValue(modeVars[rv], defaultModeId);
    if (resolved) {
      resolvedMap[modeVars[rv].id] = resolved;
    }
  }

  // Group
  var grouped = groupColorVars(modeVars);

  // Create page
  var page = getOrCreateDocPage('Colors');
  figma.currentPage = page;

  // Pre-load fonts
  await preloadInterFonts();

  // Root frame
  var root = makeALFrame({
    name: 'Color Showcase',
    layoutMode: 'VERTICAL',
    itemSpacing: 48,
    padding: 64,
    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
    counterSizing: 'FIXED',
    width: 1200
  });

  // Title
  var title = makeLabel('Colors', 36, TITLE_COLOR, 'Semi Bold');
  root.appendChild(title);

  var subtitle = makeLabel('TDS Mode Collection — Semantic Color Tokens', 16, SUBTITLE_COLOR);
  root.appendChild(subtitle);

  var totalCount = 0;

  // Render grouped colors
  for (var gi = 0; gi < COLOR_GROUPS.length; gi++) {
    var groupKey = COLOR_GROUPS[gi].key;
    var groupLabel = COLOR_GROUPS[gi].label;
    var groupVars = grouped.groups[groupKey];
    if (!groupVars || groupVars.length === 0) continue;

    var section = makeALFrame({
      name: 'Group: ' + groupLabel,
      layoutMode: 'VERTICAL',
      itemSpacing: 16
    });

    // Group header
    var groupHeader = makeLabel(groupLabel.toUpperCase(), 12, SUBTITLE_COLOR, 'Medium');
    section.appendChild(groupHeader);

    // Swatch row
    var swatchRow = makeALFrame({
      name: 'Swatches: ' + groupLabel,
      layoutMode: 'HORIZONTAL',
      itemSpacing: 16
    });
    swatchRow.layoutWrap = 'WRAP';

    for (var sv = 0; sv < groupVars.length; sv++) {
      var colorVar = groupVars[sv];
      var rgb = resolvedMap[colorVar.id];
      if (!rgb) continue;

      var swatch = await createColorSwatch(colorVar, rgb, ringVar);
      swatchRow.appendChild(swatch);
      totalCount++;
    }

    section.appendChild(swatchRow);
    swatchRow.layoutSizingHorizontal = 'FILL';
    root.appendChild(section);
    section.layoutSizingHorizontal = 'FILL';
  }

  // Ungrouped
  if (grouped.ungrouped.length > 0) {
    var otherSection = makeALFrame({
      name: 'Group: Other',
      layoutMode: 'VERTICAL',
      itemSpacing: 16
    });

    var otherHeader = makeLabel('OTHER', 12, SUBTITLE_COLOR, 'Medium');
    otherSection.appendChild(otherHeader);

    var otherRow = makeALFrame({
      name: 'Swatches: Other',
      layoutMode: 'HORIZONTAL',
      itemSpacing: 16
    });
    otherRow.layoutWrap = 'WRAP';

    for (var ov = 0; ov < grouped.ungrouped.length; ov++) {
      var uVar = grouped.ungrouped[ov];
      var uRgb = resolvedMap[uVar.id];
      if (!uRgb) continue;

      var uSwatch = await createColorSwatch(uVar, uRgb, ringVar);
      otherRow.appendChild(uSwatch);
      totalCount++;
    }

    otherSection.appendChild(otherRow);
    otherRow.layoutSizingHorizontal = 'FILL';
    root.appendChild(otherSection);
    otherSection.layoutSizingHorizontal = 'FILL';
  }

  // Position and zoom
  root.x = 100;
  root.y = 100;
  figma.viewport.scrollAndZoomIntoView([root]);

  figma.notify('Color page created: ' + totalCount + ' swatches');
}

// ─── Effects ─────────────────────────────────────────────

// Tailwind shadow size order
var EFFECT_ORDER = ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none'];

function getEffectOrder(name) {
  for (var i = 0; i < EFFECT_ORDER.length; i++) {
    if (name === EFFECT_ORDER[i]) return i;
  }
  return 99;
}

function effectToCSS(effects) {
  var parts = [];
  for (var i = 0; i < effects.length; i++) {
    var e = effects[i];
    if (e.type !== 'DROP_SHADOW' && e.type !== 'INNER_SHADOW') continue;
    var prefix = e.type === 'INNER_SHADOW' ? 'inset ' : '';
    var c = e.color || { r: 0, g: 0, b: 0, a: 1 };
    var x = e.offset ? e.offset.x : 0;
    var y = e.offset ? e.offset.y : 0;
    var blur = e.radius || 0;
    var spread = e.spread || 0;
    var alpha = c.a !== undefined ? c.a : 1;
    parts.push(
      prefix + x + 'px ' + y + 'px ' + blur + 'px ' + spread + 'px ' +
      'rgba(' + Math.round(c.r * 255) + ', ' + Math.round(c.g * 255) + ', ' + Math.round(c.b * 255) + ', ' + alpha.toFixed(2) + ')'
    );
  }
  return parts.length > 0 ? 'box-shadow: ' + parts.join(',\n             ') : 'none';
}

async function handleGenEffects() {
  figma.notify('Generating effects page...');

  var effectStyles = await figma.getLocalEffectStylesAsync();
  if (effectStyles.length === 0) {
    figma.notify('No effect styles found', { error: true });
    return;
  }

  // Filter shadows/ prefix (TDS styles)
  var shadowStyles = [];
  for (var i = 0; i < effectStyles.length; i++) {
    var s = effectStyles[i];
    // Accept both "shadows/shadow-md" and "shadow-md" patterns
    var baseName = s.name.indexOf('shadows/') === 0 ? s.name.substring(8) : s.name;
    shadowStyles.push({ style: s, baseName: baseName });
  }

  if (shadowStyles.length === 0) {
    figma.notify('No shadow effect styles found', { error: true });
    return;
  }

  // Sort by Tailwind size order
  shadowStyles.sort(function(a, b) {
    return getEffectOrder(a.baseName) - getEffectOrder(b.baseName);
  });

  // Create page
  var page = getOrCreateDocPage('Effects');
  figma.currentPage = page;

  // Pre-load fonts
  await preloadInterFonts();

  // Root frame
  var root = makeALFrame({
    name: 'Effects Showcase',
    layoutMode: 'VERTICAL',
    itemSpacing: 40,
    padding: 64,
    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
    counterSizing: 'FIXED',
    width: 1200
  });

  // Title
  var title = makeLabel('Effects', 36, TITLE_COLOR, 'Semi Bold');
  root.appendChild(title);

  var subtitle = makeLabel('TDS Effect Styles — Box Shadows', 16, SUBTITLE_COLOR);
  root.appendChild(subtitle);

  var totalCount = 0;

  for (var si = 0; si < shadowStyles.length; si++) {
    var item = shadowStyles[si];
    var style = item.style;
    var baseName = item.baseName;

    // Row frame
    var row = makeALFrame({
      name: baseName,
      layoutMode: 'HORIZONTAL',
      itemSpacing: 32
    });
    row.counterAxisAlignItems = 'CENTER';

    // Left: 96x96 white rect with effect style applied
    var rect = figma.createRectangle();
    rect.name = 'Preview';
    rect.resize(96, 96);
    rect.cornerRadius = 8;
    rect.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    rect.strokes = [{ type: 'SOLID', color: { r: 0.89, g: 0.89, b: 0.91 } }];
    rect.strokeWeight = 1;

    // Apply effect style
    try {
      await rect.setEffectStyleIdAsync(style.id);
    } catch(e) {
      console.log('Failed to apply effect style: ' + style.name + ' - ' + e.message);
    }

    row.appendChild(rect);

    // Middle: style name
    var nameLabel = makeLabel(baseName, 14, TITLE_COLOR, 'Medium');
    nameLabel.resize(160, nameLabel.height);
    nameLabel.textAutoResize = 'HEIGHT';
    row.appendChild(nameLabel);
    nameLabel.layoutSizingHorizontal = 'FIXED';

    // Right: CSS properties
    var cssText = effectToCSS(style.effects);
    var cssLabel = makeLabel(cssText, 12, LABEL_COLOR);
    row.appendChild(cssLabel);
    cssLabel.layoutSizingHorizontal = 'FILL';

    root.appendChild(row);
    row.layoutSizingHorizontal = 'FILL';
    totalCount++;
  }

  // Position and zoom
  root.x = 100;
  root.y = 100;
  figma.viewport.scrollAndZoomIntoView([root]);

  figma.notify('Effects page created: ' + totalCount + ' styles');
}

// ─── Entry Point ─────────────────────────────────────────

(async function() {
  try {
    var command = figma.command;
    console.log('TDS Docs Generator: command = ' + command);
    if (command === 'gen-typography') {
      await handleGenTypography();
    } else if (command === 'gen-colors') {
      await handleGenColors();
    } else if (command === 'gen-effects') {
      await handleGenEffects();
    } else {
      figma.notify('Unknown command: ' + command, { error: true });
    }
  } catch(err) {
    console.error('TDS Docs Generator error:', err);
    figma.notify('Error: ' + err.message, { error: true });
  }
  figma.closePlugin();
})();
