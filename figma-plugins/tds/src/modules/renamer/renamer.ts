/**
 * TDS Renamer — naming-policy v1.1 기반 자동 리네이밍
 *
 * Mode 1: renameProductDesign — 프로덕트 디자인 화면 리네이밍
 * Mode 2: renameTDSLibrary — TDS 라이브러리 컴포넌트 리네이밍 + 프로퍼티 점검
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

    // TDS 인스턴스 내부는 skip
    if (isTDSInstance(node)) {
      skipped++;
      continue;
    }

    // 인스턴스의 자식도 skip (부모가 인스턴스면)
    if (isInsideTDSInstance(node)) {
      skipped++;
      continue;
    }

    var newName = computeProductName(node);
    if (newName && newName !== node.name) {
      entries.push({
        nodeId: node.id,
        before: node.name,
        after: newName,
        reason: getRenameReason(node.name, newName),
      });
    }

    // 1:1 래퍼 감지
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

  return { mode: 'product', entries, propertyIssues: [], wrapperWarnings: wrapperWarnings, skipped: skipped, total: total };
}

export async function applyProductRenames(entries: RenameEntry[]): Promise<number> {
  let applied = 0;
  for (const entry of entries) {
    const node = await figma.getNodeByIdAsync(entry.nodeId);
    if (node && 'name' in node) {
      (node as SceneNode).name = entry.after;
      applied++;
    }
  }
  return applied;
}

// ============================================
// Mode 2: TDS 라이브러리 리네이밍 + 프로퍼티 점검
// ============================================

export function analyzeTDSLibrary(): RenamerResult {
  const selection = figma.currentPage.selection;
  const entries: RenameEntry[] = [];
  const propertyIssues: PropertyIssue[] = [];
  let total = 0;

  for (const node of selection) {
    if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') {
      figma.notify('COMPONENT 또는 COMPONENT_SET을 선택하세요.', { error: true });
      continue;
    }

    total++;

    // 1. Display Name 매칭
    const shadcnMatch = findShadcnMatch(node.name);
    if (shadcnMatch && shadcnMatch !== node.name) {
      entries.push({
        nodeId: node.id,
        before: node.name,
        after: shadcnMatch,
        reason: `shadcn 공식명 매칭: ${shadcnMatch}`,
      });
    }

    // 2. 프로퍼티 점검
    propertyIssues.push(...checkComponentProperties(node));

    // 3. 내부 파트명 순서 점검
    propertyIssues.push(...checkPartNameOrder(node));

    // 4. 내부 레이어 리네이밍 (COMPONENT_SET의 children)
    if ('children' in node) {
      for (const child of walkTree(node.children as SceneNode[])) {
        total++;
        // 특수문자 제거
        if (SPECIAL_CHARS_IN_NAMES.test(child.name)) {
          const cleaned = child.name.replace(SPECIAL_CHARS_IN_NAMES, '').trim();
          entries.push({
            nodeId: child.id,
            before: child.name,
            after: cleaned,
            reason: '특수문자 제거',
          });
        }
      }
    }
  }

  return { mode: 'library', entries, propertyIssues, wrapperWarnings: [], skipped: 0, total };
}

/**
 * 1:1 래퍼 프레임 언래핑 — 자식을 부모로 이동 후 빈 래퍼 삭제
 */
export async function unwrapSingleChildWrappers(nodeIds: string[]): Promise<number> {
  var unwrapped = 0;
  // 역순 처리 — 인덱스 꼬임 방지
  var reversed = nodeIds.slice().reverse();
  for (var i = 0; i < reversed.length; i++) {
    var id = reversed[i];
    var node = await figma.getNodeByIdAsync(id);
    if (!node || node.type !== 'FRAME') continue;
    var frame = node as FrameNode;
    if (frame.children.length !== 1) continue;

    var parent = frame.parent;
    if (!parent || !('children' in parent)) continue;

    var child = frame.children[0];
    var parentChildren = (parent as FrameNode).children;
    var wrapperIndex = -1;
    for (var j = 0; j < parentChildren.length; j++) {
      if (parentChildren[j].id === frame.id) { wrapperIndex = j; break; }
    }
    if (wrapperIndex === -1) continue;

    // 자식 위치를 래퍼 기준으로 보정 (non-AL 부모에서만)
    var parentIsAL = 'layoutMode' in parent && (parent as FrameNode).layoutMode !== 'NONE';
    if (!parentIsAL) {
      child.x = child.x + frame.x;
      child.y = child.y + frame.y;
    }

    // 자식을 부모로 이동 (래퍼 자리에)
    (parent as FrameNode).insertChild(wrapperIndex, child);

    // 빈 래퍼 삭제
    frame.remove();
    unwrapped++;
  }
  return unwrapped;
}

// ============================================
// 내부 로직
// ============================================

/** 노드의 구조를 분석하여 시맨틱 역할 접미사 반환 */
function determineRole(node: SceneNode): string {
  if ('children' in node && allChildrenSameType(node)) return 'Group';
  if (hasOnlyLayoutProps(node)) return 'Area';
  return 'Content';
}

/** 시맨틱 역할 접미사가 필요한지 판정 */
function needsRoleSuffix(name: string, node: SceneNode): boolean {
  // FRAME 타입만 (TEXT, INSTANCE는 역할 접미사 불필요)
  if (node.type !== 'FRAME') return false;

  // 단어 1개뿐인 경우만
  if (name.split(/\s+/).length !== 1) return false;

  // 이미 유효한 역할명이면 skip
  var lowerName = name.toLowerCase();
  var allRoles = ALLOWED_ROLES.concat(TEXT_ROLES).concat(IMAGE_TYPES);
  for (var i = 0; i < allRoles.length; i++) {
    if (allRoles[i].toLowerCase() === lowerName) return false;
  }

  return true;
}

function computeProductName(node: SceneNode): string | null {
  var name = node.name;

  // Step 1: 한글 → 영문
  var koreanMatch = KOREAN_LABEL_MAP[name.trim()];
  if (koreanMatch) return koreanMatch;

  // Step 2: 자동 생성명 추론
  if (isAutoGenerated(name)) {
    return inferName(node);
  }

  // Step 2.5: 시맨틱 역할 부족 — 단어 1개 + 역할 아님 → 역할 접미사 추가
  if (needsRoleSuffix(name, node)) {
    var role = determineRole(node);
    return pascalToTitleCase(name) + ' ' + role;
  }

  // Step 3: 금지 접미사 대체
  var bannedResult = replaceBannedSuffix(node, name);
  if (bannedResult) return bannedResult;

  // Step 4: 슬래시 → 공백
  if (name.includes('/') && node.type !== 'INSTANCE') {
    return name.replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Step 5: PascalCase → Title Case
  var titleCased = pascalToTitleCase(name);
  if (titleCased !== name) return titleCased;

  // Step 6: 특수문자 제거
  if (SPECIAL_CHARS_IN_NAMES.test(name)) {
    return name.replace(SPECIAL_CHARS_IN_NAMES, '').trim();
  }

  return null; // 변경 불필요
}

function isAutoGenerated(name: string): boolean {
  return AUTO_GENERATED_PATTERNS.some((p) => p.test(name));
}

function inferName(node: SceneNode): string {
  const context = inferContext(node);
  const prefix = context || 'Unnamed';

  // 자식 기반 추론
  if ('children' in node) {
    const children = (node as FrameNode).children;

    // 자식 1개 → 자식 기반
    if (children.length === 1) {
      const childName = children[0].name.split(/[\s/]/)[0];
      const role = STRUCTURAL_LAYER_NAMES[childName.toLowerCase()];
      if (role) return `${prefix} ${role}`;
      return `${childName} Area`;
    }

    // 자식 n개 → 부모 컨텍스트 + 역할
    if (children.length > 1) {
      return prefix + ' ' + determineRole(node);
    }
  }

  // 루트 레벨
  if (node.parent === figma.currentPage) {
    return `${prefix} Screen`;
  }

  // 폴백
  return `${prefix} Section`;
}

function replaceBannedSuffix(node: SceneNode, name: string): string | null {
  const words = name.split(/\s+/);

  for (const banned of BANNED_SUFFIXES) {
    const idx = words.findIndex((w) => w.toLowerCase() === banned.toLowerCase());
    if (idx === -1) continue;

    // "Container X" → 컨텍스트 추출
    const remaining = words.filter((_, i) => i !== idx).join(' ').trim();
    const context = remaining || inferContext(node) || 'Main';

    // 대체 어휘 선택
    return context + ' ' + determineRole(node);
  }

  return null;
}

function findShadcnMatch(name: string): string | null {
  const normalized = name.split('/')[0].trim();
  return SHADCN_COMPONENTS.find(
    (sc) => sc.toLowerCase() === normalized.toLowerCase()
      || sc.replace(/\s/g, '').toLowerCase() === normalized.replace(/\s/g, '').toLowerCase()
  ) || null;
}

function isInsideTDSInstance(node: SceneNode): boolean {
  let current = node.parent;
  while (current && current.type !== 'PAGE') {
    if (current.type === 'INSTANCE') {
      return isTDSInstance(current as InstanceNode);
    }
    current = current.parent;
  }
  return false;
}

function getRenameReason(before: string, after: string): string {
  if (isAutoGenerated(before)) return '자동 생성명 → 시맨틱 추론';
  for (const banned of BANNED_SUFFIXES) {
    if (before.toLowerCase().includes(banned.toLowerCase())) return `금지어 ${banned} → 대체`;
  }
  if (before.includes('/')) return '슬래시 → 공백 변환';
  if (before !== pascalToTitleCase(before)) return 'PascalCase → Title Case';
  if (SPECIAL_CHARS_IN_NAMES.test(before)) return '특수문자 제거';
  if (KOREAN_LABEL_MAP[before.trim()]) return '한글 → 영문';
  return '네이밍 정책 적용';
}
