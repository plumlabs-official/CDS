/**
 * Renamer 공통 유틸리티
 */

import { DOMAIN_KEYWORDS } from './rules';

/**
 * TDS 라이브러리 인스턴스인지 확인
 * INSTANCE 타입이고 mainComponent 접근 가능하거나 componentProperties가 있으면 true
 */
export function isTDSInstance(node: SceneNode): boolean {
  if (node.type !== 'INSTANCE') return false;
  var instance = node as InstanceNode;

  try {
    if (instance.mainComponent) return true;
  } catch (e) {
    // 외부 라이브러리 접근 실패 또는 컴포넌트 에러
  }

  try {
    return instance.componentProperties !== undefined
      && Object.keys(instance.componentProperties).length > 0;
  } catch (e) {
    // componentProperties 접근 실패 (컴포넌트 에러 있는 노드)
    return true; // 안전하게 TDS로 간주 (skip)
  }
}

/**
 * 노드 트리 순회 (depth-first)
 */
export function* walkTree(nodes: readonly SceneNode[]): Generator<SceneNode> {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    yield node;
    if ('children' in node) {
      yield* walkTree((node as FrameNode).children);
    }
  }
}

/**
 * 선택된 노드 또는 페이지 top-level 프레임 반환
 */
export function getTargetNodes(): readonly SceneNode[] {
  var selection = figma.currentPage.selection;
  if (selection.length > 0) return selection;

  var result: SceneNode[] = [];
  var children = figma.currentPage.children;
  for (var i = 0; i < children.length; i++) {
    var n = children[i];
    if (n.type === 'FRAME' || n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') {
      result.push(n);
    }
  }
  return result;
}

/**
 * 부모/자식에서 도메인 컨텍스트 추론
 */
export function inferContext(node: SceneNode): string {
  var parent = node.parent;
  if (parent && 'name' in parent) {
    var parentContext = extractDomainFromName(parent.name);
    if (parentContext) return parentContext;
  }

  if ('children' in node) {
    var children = (node as FrameNode).children;
    for (var i = 0; i < children.length; i++) {
      var childContext = extractDomainFromName(children[i].name);
      if (childContext) return childContext;
    }
  }

  return '';
}

function extractDomainFromName(name: string): string {
  var words = name.split(/[\s/]+/);
  for (var i = 0; i < words.length; i++) {
    for (var j = 0; j < DOMAIN_KEYWORDS.length; j++) {
      if (DOMAIN_KEYWORDS[j].toLowerCase() === words[i].toLowerCase()) {
        return DOMAIN_KEYWORDS[j];
      }
    }
  }
  return '';
}

/**
 * PascalCase → Title Case 공백 변환
 * "ChatContent" → "Chat Content"
 * "AlertDialog" → "Alert Dialog"
 */
export function pascalToTitleCase(name: string): string {
  if (name.includes(' ')) return name;

  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

/**
 * 동종 자식인지 확인 (Group 판정용)
 */
export function allChildrenSameType(node: SceneNode): boolean {
  if (!('children' in node)) return false;
  var children = (node as FrameNode).children;
  if (children.length < 2) return false;

  var firstType = children[0].type;
  var firstName = children[0].name.split(/[\s/]/)[0];
  for (var i = 1; i < children.length; i++) {
    if (children[i].type !== firstType) return false;
    if (children[i].name.split(/[\s/]/)[0] !== firstName) return false;
  }
  return true;
}

/**
 * 레이아웃 전용 프레임인지 (배경/이펙트/스트로크 없고, children이 있음)
 */
export function hasOnlyLayoutProps(node: SceneNode): boolean {
  if (node.type !== 'FRAME') return false;
  var frame = node as FrameNode;

  var fills = frame.fills;
  var hasFills = fills !== figma.mixed
    && (fills as Paint[]).length > 0
    && (fills as Paint[]).some(function(f: Paint) { return f.visible !== false; });
  if (hasFills) return false;

  if (frame.effects.length > 0) return false;
  if (frame.strokes.length > 0) return false;
  if (frame.children.length === 0) return false;

  return true;
}

/**
 * 1:1 래퍼 감지: 자식 1개, 시각 스타일 없는 동일 사이즈 프레임
 */
export function isSingleChildWrapper(node: SceneNode): boolean {
  if (node.type !== 'FRAME') return false;
  var frame = node as FrameNode;

  if (frame.children.length !== 1) return false;

  // 시각 스타일 체크 (hasOnlyLayoutProps 재활용)
  if (!hasOnlyLayoutProps(node)) return false;

  // 패딩 없음 (Auto Layout)
  if (frame.layoutMode !== 'NONE') {
    if (frame.paddingTop > 0 || frame.paddingRight > 0
      || frame.paddingBottom > 0 || frame.paddingLeft > 0) {
      return false;
    }
  }

  // 자식 위치 오프셋 없음
  var child = frame.children[0];
  if (child.x > 2 || child.y > 2) return false;

  // 동일 사이즈 (±2px)
  if (Math.abs(frame.width - child.width) > 2) return false;
  if (Math.abs(frame.height - child.height) > 2) return false;

  return true;
}
