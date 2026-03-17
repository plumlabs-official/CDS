/**
 * Renamer 공통 유틸리티
 */

import { TDS_FILE_KEY } from './rules';

/**
 * TDS 라이브러리 인스턴스인지 확인
 * componentId가 있고, 해당 컴포넌트가 TDS 파일 소속이면 true
 *
 * 참고: Figma Plugin API에서는 instance.mainComponent로 원본 접근 가능하지만,
 * 외부 라이브러리 컴포넌트는 mainComponent가 null일 수 있음.
 * 이 경우 componentProperties의 존재로 TDS 여부를 추정.
 */
export function isTDSInstance(node: SceneNode): boolean {
  if (node.type !== 'INSTANCE') return false;
  const instance = node as InstanceNode;

  // mainComponent 접근 가능하면 key로 확인
  try {
    const main = instance.mainComponent;
    if (main) {
      // 같은 파일 내 컴포넌트면 TDS
      // 외부 라이브러리면 main.key 존재
      return true; // 현재 파일의 컴포넌트 = TDS
    }
  } catch {
    // 외부 라이브러리 접근 실패 — 인스턴스지만 원본 미확인
  }

  // componentProperties가 있으면 구조화된 컴포넌트 (TDS일 가능성 높음)
  return instance.componentProperties !== undefined
    && Object.keys(instance.componentProperties).length > 0;
}

/**
 * 노드 트리 순회 (depth-first)
 * 선택된 노드부터 시작, 자식까지 재귀
 */
export function* walkTree(nodes: readonly SceneNode[]): Generator<SceneNode> {
  for (const node of nodes) {
    yield node;
    if ('children' in node) {
      yield* walkTree(node.children);
    }
  }
}

/**
 * 선택된 노드 또는 페이지 top-level 프레임 반환
 */
export function getTargetNodes(): readonly SceneNode[] {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) return selection;

  // 선택 없으면 페이지의 top-level 프레임
  return figma.currentPage.children.filter(
    (n) => n.type === 'FRAME' || n.type === 'COMPONENT' || n.type === 'COMPONENT_SET'
  );
}

/**
 * 부모/자식에서 도메인 컨텍스트 추론
 */
export function inferContext(node: SceneNode): string {
  // 1. 부모 이름에서 도메인 추출
  const parent = node.parent;
  if (parent && 'name' in parent) {
    const parentContext = extractDomainFromName(parent.name);
    if (parentContext) return parentContext;
  }

  // 2. 자식 이름에서 도메인 추출
  if ('children' in node) {
    for (const child of (node as FrameNode).children) {
      const childContext = extractDomainFromName(child.name);
      if (childContext) return childContext;
    }
  }

  return '';
}

function extractDomainFromName(name: string): string {
  const { DOMAIN_KEYWORDS } = require('./rules');
  const words = name.split(/[\s/]+/);
  for (const word of words) {
    const match = (DOMAIN_KEYWORDS as string[]).find(
      (kw) => kw.toLowerCase() === word.toLowerCase()
    );
    if (match) return match;
  }
  return '';
}

/**
 * PascalCase → Title Case 공백 변환
 * "ChatContent" → "Chat Content"
 * "AlertDialog" → "Alert Dialog"
 */
export function pascalToTitleCase(name: string): string {
  // 이미 공백이 있으면 그대로
  if (name.includes(' ')) return name;

  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase 경계
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');  // 연속 대문자
}

/**
 * 동종 자식인지 확인 (Group 판정용)
 */
export function allChildrenSameType(node: SceneNode): boolean {
  if (!('children' in node)) return false;
  const children = (node as FrameNode).children;
  if (children.length < 2) return false;

  const firstType = children[0].type;
  const firstName = children[0].name.split(/[\s/]/)[0];
  return children.every(
    (c) => c.type === firstType && c.name.split(/[\s/]/)[0] === firstName
  );
}

/**
 * 레이아웃 전용 프레임인지 (패딩/정렬만, 콘텐츠 자체는 아님)
 */
export function hasOnlyLayoutProps(node: SceneNode): boolean {
  if (node.type !== 'FRAME') return false;
  const frame = node as FrameNode;
  // 배경색 없고, 이펙트 없고, children이 있으면 레이아웃 래퍼일 가능성
  const noFills = frame.fills === figma.mixed || (frame.fills as Paint[]).length === 0;
  const noEffects = frame.effects.length === 0;
  const hasChildren = frame.children.length > 0;
  return noFills && noEffects && hasChildren;
}

/**
 * 1:1 래퍼 감지: 자식 1개, 패딩/배경/오프셋 없는 프레임
 * 삭제 가능한 불필요 래퍼인지 판정
 */
export function isSingleChildWrapper(node: SceneNode): boolean {
  if (node.type !== 'FRAME') return false;
  var frame = node as FrameNode;

  // 자식 1개 필수
  if (frame.children.length !== 1) return false;

  // 배경 없음
  var fills = frame.fills;
  var hasFills = fills !== figma.mixed
    && (fills as Paint[]).length > 0
    && (fills as Paint[]).some(function(f: Paint) { return f.visible !== false; });
  if (hasFills) return false;

  // 이펙트 없음
  if (frame.effects.length > 0) return false;

  // 스트로크 없음
  if (frame.strokes.length > 0) return false;

  // 패딩 없음 (Auto Layout인 경우)
  if (frame.layoutMode !== 'NONE') {
    if (frame.paddingTop > 0 || frame.paddingRight > 0
      || frame.paddingBottom > 0 || frame.paddingLeft > 0) {
      return false;
    }
  }

  // 자식 위치 오프셋 없음
  var child = frame.children[0];
  if (child.x > 2 || child.y > 2) return false;

  // 자식이 부모와 동일 사이즈 (±2px 허용)
  var sameWidth = Math.abs(frame.width - child.width) <= 2;
  var sameHeight = Math.abs(frame.height - child.height) <= 2;
  if (!sameWidth || !sameHeight) return false;

  return true;
}
