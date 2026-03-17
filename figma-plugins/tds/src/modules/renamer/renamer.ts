/**
 * TDS Renamer — naming-policy v1.1 기반 자동 리네이밍
 *
 * Mode 1: analyzeProductDesign — 프로덕트 디자인 화면 리네이밍
 * Mode 2: analyzeTDSLibrary — TDS 라이브러리 컴포넌트 리네이밍 + 프로퍼티 점검
 */

import {
  BANNED_SUFFIXES,
  AUTO_GENERATED_PATTERNS,
  SPECIAL_CHARS_IN_NAMES,
  ALLOWED_ROLES,
  TEXT_ROLES,
  IMAGE_TYPES,
  STRUCTURAL_LAYER_NAMES,
  KOREAN_LABEL_MAP,
  LEGACY_NAME_MAP,
  SHADCN_COMPONENTS,
} from './rules';

import {
  isTDSInstance,
  walkTree,
  getTargetNodes,
  inferContext,
  pascalToTitleCase,
  allChildrenSameType,
  hasOnlyLayoutProps,
  isSingleChildWrapper,
} from './utils';

import {
  checkComponentProperties,
  checkPartNameOrder,
  PropertyIssue,
} from './property-checker';

// ============================================
// 타입
// ============================================

export interface RenameEntry {
  nodeId: string;
  before: string;
  after: string;
  reason: string;
}

export interface WrapperWarning {
  nodeId: string;
  nodeName: string;
  childName: string;
  reason: string;
}

export interface RenamerResult {
  mode: 'product' | 'library';
  entries: RenameEntry[];
  propertyIssues: PropertyIssue[];
  wrapperWarnings: WrapperWarning[];
  skipped: number;
  total: number;
}

// ============================================
// 역할 판정 (공용)
// ============================================

/** 모든 역할 키워드 (ALLOWED_ROLES + TEXT_ROLES + IMAGE_TYPES) */
var ALL_ROLE_NAMES = ALLOWED_ROLES.concat(TEXT_ROLES).concat(IMAGE_TYPES);

/** 이름의 마지막 단어가 역할 키워드인지 */
function endsWithRole(name: string): boolean {
  var words = name.split(/\s+/);
  var last = words[words.length - 1] || '';
  for (var i = 0; i < ALL_ROLE_NAMES.length; i++) {
    if (ALL_ROLE_NAMES[i].toLowerCase() === last.toLowerCase()) return true;
  }
  return false;
}

/** 노드 구조 분석 → 시맨틱 역할 접미사 */
function determineRole(node: SceneNode): string {
  if ('children' in node && allChildrenSameType(node)) return 'Group';
  return 'Area';
}

// ============================================
// Mode 1: 프로덕트 디자인 리네이밍
// ============================================

export function analyzeProductDesign(): RenamerResult {
  var targets = getTargetNodes();
  var entries: RenameEntry[] = [];
  var wrapperWarnings: WrapperWarning[] = [];
  var skipped = 0;
  var total = 0;

  for (var node of walkTree(targets)) {
    total++;

    // 모든 인스턴스 skip (TDS든 아니든 — 인스턴스 이름은 건드리지 않음)
    if (node.type === 'INSTANCE') { skipped++; continue; }
    if (isInsideTDSInstance(node)) { skipped++; continue; }

    var newName = computeProductName(node);
    if (newName && newName !== node.name) {
      entries.push({
        nodeId: node.id,
        before: node.name,
        after: newName,
        reason: getRenameReason(node.name, newName),
      });
    }

    if (isSingleChildWrapper(node)) {
      var child = (node as FrameNode).children[0];
      wrapperWarnings.push({
        nodeId: node.id,
        nodeName: node.name,
        childName: child.name,
        reason: '1:1 래퍼 — ' + child.name + '을 직접 배치 가능',
      });
    }
  }

  return {
    mode: 'product', entries: entries, propertyIssues: [],
    wrapperWarnings: wrapperWarnings, skipped: skipped, total: total,
  };
}

export async function applyProductRenames(entries: RenameEntry[]): Promise<number> {
  var applied = 0;
  for (var i = 0; i < entries.length; i++) {
    var node = await figma.getNodeByIdAsync(entries[i].nodeId);
    if (node && 'name' in node) {
      (node as SceneNode).name = entries[i].after;
      applied++;
    }
  }
  return applied;
}

// ============================================
// Mode 2: TDS 라이브러리 리네이밍 + 프로퍼티 점검
// ============================================

export function analyzeTDSLibrary(): RenamerResult {
  var selection = figma.currentPage.selection;
  var entries: RenameEntry[] = [];
  var propertyIssues: PropertyIssue[] = [];
  var total = 0;

  for (var i = 0; i < selection.length; i++) {
    var node = selection[i];
    if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
      figma.notify('COMPONENT 또는 COMPONENT_SET을 선택하세요.', { error: true });
      continue;
    }

    total++;

    var shadcnMatch = findShadcnMatch(node.name);
    if (shadcnMatch && shadcnMatch !== node.name) {
      entries.push({
        nodeId: node.id, before: node.name,
        after: shadcnMatch, reason: 'shadcn 공식명 매칭: ' + shadcnMatch,
      });
    }

    var propIssues = checkComponentProperties(node);
    for (var p = 0; p < propIssues.length; p++) propertyIssues.push(propIssues[p]);

    var partIssues = checkPartNameOrder(node);
    for (var q = 0; q < partIssues.length; q++) propertyIssues.push(partIssues[q]);

    if ('children' in node) {
      for (var child of walkTree(node.children as SceneNode[])) {
        total++;
        if (SPECIAL_CHARS_IN_NAMES.test(child.name)) {
          entries.push({
            nodeId: child.id, before: child.name,
            after: child.name.replace(SPECIAL_CHARS_IN_NAMES, '').trim(),
            reason: '특수문자 제거',
          });
        }
      }
    }
  }

  return {
    mode: 'library', entries: entries, propertyIssues: propertyIssues,
    wrapperWarnings: [], skipped: 0, total: total,
  };
}

// ============================================
// 언래핑
// ============================================

export async function unwrapSingleChildWrappers(nodeIds: string[]): Promise<number> {
  var unwrapped = 0;
  var reversed = nodeIds.slice().reverse();

  for (var i = 0; i < reversed.length; i++) {
    var node = await figma.getNodeByIdAsync(reversed[i]);
    if (!node || node.type !== 'FRAME') continue;
    var frame = node as FrameNode;
    if (frame.children.length !== 1) continue;

    var parent = frame.parent;
    if (!parent || !('children' in parent)) continue;

    var child = frame.children[0];

    // 래퍼 인덱스 찾기
    var parentChildren = (parent as FrameNode).children;
    var wrapperIndex = -1;
    for (var j = 0; j < parentChildren.length; j++) {
      if (parentChildren[j].id === frame.id) { wrapperIndex = j; break; }
    }
    if (wrapperIndex === -1) continue;

    // non-AL 부모에서만 좌표 보정
    var parentIsAL = 'layoutMode' in parent && (parent as FrameNode).layoutMode !== 'NONE';
    if (!parentIsAL) {
      child.x = child.x + frame.x;
      child.y = child.y + frame.y;
    }

    (parent as FrameNode).insertChild(wrapperIndex, child);
    frame.remove();
    unwrapped++;
  }
  return unwrapped;
}

// ============================================
// 내부 로직
// ============================================

/**
 * 프로덕트 디자인 이름 변환 (파이프라인 — 모든 변환 누적 적용)
 */
function computeProductName(node: SceneNode): string | null {
  var original = node.name;
  var name = original;

  // Step 1: 한글 → 영문
  var koreanMatch = KOREAN_LABEL_MAP[name.trim()];
  if (koreanMatch) name = koreanMatch;

  // Step 1.5: 레거시 컴포넌트명 → 현재 공식명 (단어 단위 치환)
  var nameWords = name.split(/[\s/]+/);
  var legacyChanged = false;
  for (var lw = 0; lw < nameWords.length; lw++) {
    var legacyMatch = LEGACY_NAME_MAP[nameWords[lw]];
    if (legacyMatch) {
      nameWords[lw] = legacyMatch;
      legacyChanged = true;
    }
  }
  if (legacyChanged) name = nameWords.join(' ');

  // Step 2: 자동 생성명 → 완전 새 이름 (early return)
  if (isAutoGenerated(name)) {
    return inferName(node);
  }

  // Step 3: 금지 접미사 대체
  var bannedResult = replaceBannedSuffix(node, name);
  if (bannedResult) name = bannedResult;

  // Step 4: 슬래시 → 공백
  if (name.indexOf('/') !== -1 && node.type !== 'INSTANCE') {
    name = name.replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Step 5: PascalCase → Title Case + 각 단어 첫 글자 대문자
  name = pascalToTitleCase(name);
  name = toTitleCase(name);

  // Step 6: 특수문자 제거
  if (SPECIAL_CHARS_IN_NAMES.test(name)) {
    name = name.replace(SPECIAL_CHARS_IN_NAMES, '').trim();
  }

  // Step 7: 시맨틱 역할 접미사 (단어 1개 FRAME + 역할 아님)
  if (node.type === 'FRAME'
    && name.split(/\s+/).length === 1
    && !endsWithRole(name)) {
    name = name + ' ' + determineRole(node);
  }

  return name !== original ? name : null;
}

/** 각 단어 첫 글자 대문자 (Title Case 보정) */
function toTitleCase(name: string): string {
  var words = name.split(/\s+/);
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
  }
  return words.join(' ');
}

function isAutoGenerated(name: string): boolean {
  for (var i = 0; i < AUTO_GENERATED_PATTERNS.length; i++) {
    if (AUTO_GENERATED_PATTERNS[i].test(name)) return true;
  }
  return false;
}

function inferName(node: SceneNode): string {
  var context = inferContext(node);
  var prefix = context || 'Unnamed';

  if ('children' in node) {
    var children = (node as FrameNode).children;

    if (children.length === 1) {
      var childName = children[0].name.split(/[\s/]/)[0];
      var role = STRUCTURAL_LAYER_NAMES[childName.toLowerCase()];
      if (role) return prefix + ' ' + role;
      return childName + ' Area';
    }

    if (children.length > 1) {
      return prefix + ' ' + determineRole(node);
    }
  }

  if (node.parent === figma.currentPage) {
    return prefix + ' Screen';
  }

  return prefix + ' Section';
}

/**
 * 금지 접미사(Container 등) 제거 + 역할 할당
 *
 * 역할 추가 조건:
 * - remaining이 1단어 AND 마지막 단어가 역할이 아닌 경우만
 * - 2단어 이상이면 이미 충분히 설명적 → 역할 안 붙임
 * - 이미 역할로 끝나면 → 역할 안 붙임
 */
function replaceBannedSuffix(node: SceneNode, name: string): string | null {
  var words = name.split(/\s+/);

  for (var b = 0; b < BANNED_SUFFIXES.length; b++) {
    var idx = -1;
    for (var w = 0; w < words.length; w++) {
      if (words[w].toLowerCase() === BANNED_SUFFIXES[b].toLowerCase()) { idx = w; break; }
    }
    if (idx === -1) continue;

    // 금지어 제거
    var parts: string[] = [];
    for (var k = 0; k < words.length; k++) {
      if (k !== idx) parts.push(words[k]);
    }
    var context = parts.join(' ').trim() || inferContext(node) || 'Main';

    // 역할 추가 판정
    if (endsWithRole(context)) return context;
    if (context.split(/\s+/).length >= 2) return context;
    return context + ' ' + determineRole(node);
  }

  return null;
}

function findShadcnMatch(name: string): string | null {
  var normalized = name.split('/')[0].trim();
  for (var i = 0; i < SHADCN_COMPONENTS.length; i++) {
    var sc = SHADCN_COMPONENTS[i];
    if (sc.toLowerCase() === normalized.toLowerCase()) return sc;
    if (sc.replace(/\s/g, '').toLowerCase() === normalized.replace(/\s/g, '').toLowerCase()) return sc;
  }
  return null;
}

function isInsideTDSInstance(node: SceneNode): boolean {
  var current = node.parent;
  while (current && current.type !== 'PAGE') {
    if (current.type === 'INSTANCE') {
      return isTDSInstance(current as InstanceNode);
    }
    current = current.parent;
  }
  return false;
}

function getRenameReason(before: string, after: string): string {
  var reasons: string[] = [];

  if (KOREAN_LABEL_MAP[before.trim()]) reasons.push('한글 → 영문');

  for (var i = 0; i < BANNED_SUFFIXES.length; i++) {
    if (before.toLowerCase().indexOf(BANNED_SUFFIXES[i].toLowerCase()) !== -1) {
      reasons.push(BANNED_SUFFIXES[i] + ' 제거');
      break;
    }
  }

  if (before.indexOf('/') !== -1 && after.indexOf('/') === -1) reasons.push('슬래시 → 공백');
  if (before !== pascalToTitleCase(before) && after === pascalToTitleCase(after)) reasons.push('Title Case 변환');
  if (SPECIAL_CHARS_IN_NAMES.test(before) && !SPECIAL_CHARS_IN_NAMES.test(after)) reasons.push('특수문자 제거');

  var afterWords = after.split(/\s+/);
  var lastWord = afterWords[afterWords.length - 1];
  if (endsWithRole(after) && !endsWithRole(before)) reasons.push(lastWord + ' 역할 추가');

  return reasons.length > 0 ? reasons.join(' + ') : '네이밍 정책 적용';
}
