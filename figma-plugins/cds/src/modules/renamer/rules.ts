/**
 * CDS Naming Policy v2.0 — executable rule map
 *
 * Source of truth: .claude/rules/naming-policy.md sections 3-8.
 * Keep this file pure where possible so QA gates can reuse the same rules.
 */

// ============================================
// CDS 식별
// ============================================

export const CDS_FILE_KEY = 'H36eNEd6o7ZTv4R7VcyLf2';

export type NamingSeverity = 'error' | 'warning';
export type NamingPolicySection = '3' | '4' | '5' | '6' | '7' | '8';
export type NamingTargetKind =
  | 'layer'
  | 'component'
  | 'componentPart'
  | 'variantPath'
  | 'propertyKey'
  | 'propertyValue'
  | 'booleanProperty'
  | 'text'
  | 'image'
  | 'icon'
  | 'exception';

export interface NamingTarget {
  id: string;
  name: string;
  type?: string;
  kind?: NamingTargetKind;
  path?: string;
  isM3Anatomy?: boolean;
  isPublishExcluded?: boolean;
  isVariantPath?: boolean;
  hardcodedData?: boolean;
}

export interface NamingRule {
  id: string;
  policySection: NamingPolicySection;
  description: string;
  severity: NamingSeverity;
  autofixable: boolean;
  exceptionAllowed: boolean;
  appliesTo: NamingTargetKind[];
  check(target: NamingTarget): NamingViolation | null;
}

export interface NamingViolation {
  ruleId: string;
  policySection: NamingPolicySection;
  severity: NamingSeverity;
  targetId: string;
  targetName: string;
  targetKind: NamingTargetKind;
  currentName: string;
  suggestedName?: string;
  autofixable: boolean;
  message: string;
  sourceReference: string;
}

// ============================================
// 금지 어휘
// ============================================

export const NAMING_POLICY_VERSION = '2.0';

export const BANNED_SUFFIXES = ['Container', 'Wrapper', 'Content', 'Box', 'View', 'Div'];

export const AUTO_GENERATED_PATTERNS = [
  /^Text$/i,
  /^Frame\s*\d*$/i,
  /^Group\s*\d*$/i,
  /^Rectangle\s*\d*$/i,
  /^Ellipse\s*\d*$/i,
  /^Line\s*\d*$/i,
  /^Vector\s*\d*$/i,
  /^Component\s*\d*$/i,
  /^Instance\s*\d*$/i,
];

export const SPECIAL_CHARS_IN_NAMES = /[:\u2199\u2198\u2197\u2196↳↗↘↙]/;
export const LAYER_SLASH = /\//;
export const CTA_PATTERN = /\bCTA\b/i;

// ============================================
// 허용 어휘 (시맨틱 역할)
// ============================================

export const ALLOWED_ROLES = [
  'Screen', 'Body', 'Header', 'Footer', 'Section', 'Area',
  'Sidebar', 'Scroll Area', 'List', 'Grid', 'Navbar', 'Tab Bar',
  'Input', 'Form', 'Card', 'Group',
];

export const TEXT_ROLES = [
  'Title', 'Description', 'Label', 'Subtitle', 'Caption', 'Value',
];

export const IMAGE_TYPES = [
  'Image', 'Thumbnail', 'Avatar', 'Banner', 'Icon', 'Illustration',
];

export const LUCIDE_ICON_NAMES = [
  'Arrow Left', 'Arrow Right', 'Bell', 'Bookmark', 'Calendar', 'Camera',
  'Check', 'Chevron Left', 'Chevron Right', 'Clock', 'Crown', 'Heart',
  'Home', 'Image', 'Lock', 'Message Circle', 'Minus', 'Pencil', 'Play',
  'Plus', 'Search', 'Settings', 'Share', 'Star', 'Trash 2', 'User',
  'Users', 'X',
];

// ============================================
// shadcn/ui 컴포넌트 목록 (59개)
// ============================================

export const SHADCN_COMPONENTS = [
  'Accordion', 'Alert', 'Alert Dialog', 'Aspect Ratio', 'Avatar',
  'Badge', 'Breadcrumb', 'Button', 'Calendar', 'Card', 'Carousel',
  'Chart', 'Checkbox', 'Collapsible', 'Combobox', 'Command',
  'Context Menu', 'Data Table', 'Date Picker', 'Dialog', 'Drawer',
  'Dropdown Menu', 'Form', 'Hover Card', 'Input', 'Input OTP',
  'Label', 'Menubar', 'Navigation Menu', 'Pagination', 'Popover',
  'Progress', 'Radio Group', 'Resizable', 'Scroll Area', 'Select',
  'Separator', 'Drawer', 'Sidebar', 'Skeleton', 'Slider', 'Sonner',
  'Switch', 'Table', 'Tabs', 'Textarea', 'Toast', 'Toggle',
  'Toggle Group', 'Tooltip',
];

// ============================================
// 도메인 키워드 (constants.ts에서 이전)
// ============================================

export const DOMAIN_KEYWORDS = [
  'Challenge', 'Feed', 'Profile', 'Notification', 'Message',
  'Chat', 'User', 'Friend', 'Mission', 'Achievement',
  'Ranking', 'Shop', 'Settings', 'Home', 'Search',
  'Video', 'Photo', 'Image', 'Comment', 'Like',
  'Share', 'Bookmark', 'Calendar', 'Event', 'Badge',
  'Progress', 'Weekly', 'Daily', 'Auth', 'Invite',
  'Onboarding', 'Payment', 'Reward', 'Streak',
];

// ============================================
// 구조적 레이어 이름 매핑 (constants.ts에서 이전)
// ============================================

export const STRUCTURAL_LAYER_NAMES: Record<string, string> = {
  'header': 'Header', 'hdr': 'Header',
  'footer': 'Footer', 'ftr': 'Footer',
  'body': 'Body', 'content': 'Body',
  'list': 'List', 'grid': 'Grid',
  'nav': 'Navbar', 'navigation': 'Navbar',
  'sidebar': 'Sidebar',
  'section': 'Section', 'area': 'Area',
  'image': 'Image', 'img': 'Image',
  'icon': 'Icon', 'avatar': 'Avatar',
  'thumbnail': 'Thumbnail', 'thumb': 'Thumbnail',
  'title': 'Title', 'subtitle': 'Subtitle',
  'description': 'Description', 'desc': 'Description',
  'label': 'Label', 'caption': 'Caption',
  'button': 'Button', 'btn': 'Button',
  'input': 'Input', 'field': 'Field',
  'card': 'Card', 'badge': 'Badge',
  'tab': 'Tab', 'tabs': 'Tabs',
  'form': 'Form', 'action': 'Action',
  'actions': 'Actions', 'status': 'Status',
  'divider': 'Divider', 'separator': 'Separator',
  'overlay': 'Overlay', 'background': 'Background',
  'empty': 'Empty', 'placeholder': 'Placeholder',
  'progress': 'Progress', 'indicator': 'Indicator',
  'handle': 'Handle',
};

// ============================================
// 한글 레이블 → 영문 (constants.ts에서 이전)
// ============================================

// ============================================
// 레거시 컴포넌트명 → 현재 공식명 매핑
// ============================================

export const LEGACY_NAME_MAP: Record<string, string> = {
  'Sheet': 'Drawer',
};

export const KOREAN_LABEL_MAP: Record<string, string> = {
  '홈': 'Home', '라운지': 'Lounge', '마이페이지': 'My Page',
  '챌린지': 'Challenge', '피드': 'Feed', '검색': 'Search',
  '알림': 'Notification', '설정': 'Settings', '프로필': 'Profile',
  '친구': 'Friends', '미션': 'Mission', '상점': 'Shop',
  '랭킹': 'Ranking', '업적': 'Achievement', '더보기': 'More',
  '확인': 'Confirm', '취소': 'Cancel', '다음': 'Next',
  '이전': 'Previous', '완료': 'Done', '저장': 'Save',
  '삭제': 'Delete', '수정': 'Edit', '닫기': 'Close', '시작': 'Start',
};

// ============================================
// 아이콘 이름 매핑 (Lucide 기준)
// ============================================

export const CDS_ICON_MAP: Record<string, string> = {
  'search': 'Search', 'home': 'Home', 'user': 'User',
  'users': 'Users', 'play': 'Play', 'pause': 'Pause',
  'chat': 'Message Circle', 'message': 'Message Circle',
  'bell': 'Bell', 'check': 'Check', 'close': 'X',
  'add': 'Plus', 'plus': 'Plus', 'minus': 'Minus',
  'edit': 'Pencil', 'delete': 'Trash 2', 'share': 'Share',
  'heart': 'Heart', 'star': 'Star', 'bookmark': 'Bookmark',
  'arrow': 'Arrow Right', 'chevron': 'Chevron Right',
  'settings': 'Settings', 'calendar': 'Calendar',
  'clock': 'Clock', 'lock': 'Lock', 'crown': 'Crown',
  'camera': 'Camera', 'image': 'Image',
};

function source(section: NamingPolicySection): string {
  return `.claude/rules/naming-policy.md#section-${section}`;
}

function kindOf(target: NamingTarget): NamingTargetKind {
  return target.kind || 'layer';
}

function isPublishExcluded(target: NamingTarget): boolean {
  return target.isPublishExcluded === true || /^[._]/.test(target.name);
}

function isTitleCaseWords(name: string): boolean {
  if (!name || name.trim() !== name) return false;
  var parts = name.split(/\s+/);
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (!part) return false;
    if (/^\d+$/.test(part)) continue;
    if (!/^[A-Z][a-z0-9]*$/.test(part) && !/^[A-Z0-9]{2,}$/.test(part)) return false;
  }
  return true;
}

function toPolicyTitleCase(name: string): string {
  var spaced = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!spaced) return spaced;
  return spaced.split(' ').map(function (word) {
    if (/^\d+$/.test(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function targetViolation(
  rule: Omit<NamingRule, 'check'>,
  target: NamingTarget,
  message: string,
  suggestedName?: string,
): NamingViolation {
  return {
    ruleId: rule.id,
    policySection: rule.policySection,
    severity: rule.severity,
    targetId: target.id,
    targetName: target.name,
    targetKind: kindOf(target),
    currentName: target.name,
    suggestedName,
    autofixable: rule.autofixable,
    message,
    sourceReference: source(rule.policySection),
  };
}

function simpleRule(
  rule: Omit<NamingRule, 'check'>,
  check: (target: NamingTarget, rule: Omit<NamingRule, 'check'>) => NamingViolation | null,
): NamingRule {
  return {
    ...rule,
    check(target: NamingTarget) {
      if (isPublishExcluded(target)) return null;
      if (rule.appliesTo.indexOf(kindOf(target)) === -1) return null;
      return check(target, rule);
    },
  };
}

export const NAMING_RULES: NamingRule[] = [
  simpleRule({
    id: 'naming.section3.title-case',
    policySection: '3',
    description: 'Layer and component names use Title Case with spaces.',
    severity: 'error',
    autofixable: true,
    exceptionAllowed: true,
    appliesTo: ['layer', 'component', 'componentPart', 'text', 'image', 'icon'],
  }, function (target, rule) {
    if (LAYER_SLASH.test(target.name)) return null;
    if (isTitleCaseWords(target.name)) return null;
    return targetViolation(rule, target, 'Name must be Title Case with spaces.', toPolicyTitleCase(target.name));
  }),
  simpleRule({
    id: 'naming.section3.text-role',
    policySection: '3',
    description: 'Text nodes use role names such as Title, Description, Label, Subtitle, Caption, or Value.',
    severity: 'error',
    autofixable: true,
    exceptionAllowed: true,
    appliesTo: ['text'],
  }, function (target, rule) {
    if (TEXT_ROLES.indexOf(target.name) !== -1) return null;
    if (/\bText\b/i.test(target.name)) {
      var suggested = toPolicyTitleCase(target.name.replace(/\bText\b/ig, '').trim() || 'Label');
      return targetViolation(rule, target, 'Text node names must not use generic Text suffixes.', suggested);
    }
    return null;
  }),
  simpleRule({
    id: 'naming.section4.allowed-role',
    policySection: '4',
    description: 'Frame/layer names should end in an allowed semantic role when a role is present.',
    severity: 'warning',
    autofixable: false,
    exceptionAllowed: true,
    appliesTo: ['layer', 'componentPart'],
  }, function (target, rule) {
    if (LAYER_SLASH.test(target.name)) return null;
    var words = target.name.split(/\s+/);
    var lastTwo = words.slice(-2).join(' ');
    var last = words[words.length - 1];
    if (ALLOWED_ROLES.indexOf(lastTwo) !== -1 || ALLOWED_ROLES.indexOf(last) !== -1) return null;
    if (target.type === 'FRAME' || target.type === 'GROUP') {
      return targetViolation(rule, target, 'Structural layers should end with an allowed semantic role.');
    }
    return null;
  }),
  simpleRule({
    id: 'naming.section5.auto-generated',
    policySection: '5',
    description: 'Auto-generated Figma names are forbidden.',
    severity: 'error',
    autofixable: false,
    exceptionAllowed: true,
    appliesTo: ['layer', 'component', 'componentPart', 'text', 'image', 'icon'],
  }, function (target, rule) {
    for (var i = 0; i < AUTO_GENERATED_PATTERNS.length; i++) {
      if (AUTO_GENERATED_PATTERNS[i].test(target.name)) {
        return targetViolation(rule, target, 'Auto-generated Figma node name is forbidden.');
      }
    }
    return null;
  }),
  simpleRule({
    id: 'naming.section5.special-char',
    policySection: '5',
    description: 'Special characters such as colon and arrows are forbidden in node names.',
    severity: 'error',
    autofixable: true,
    exceptionAllowed: true,
    appliesTo: ['layer', 'component', 'componentPart', 'text', 'image', 'icon'],
  }, function (target, rule) {
    if (!SPECIAL_CHARS_IN_NAMES.test(target.name)) return null;
    return targetViolation(rule, target, 'Special characters are forbidden in names.', target.name.replace(SPECIAL_CHARS_IN_NAMES, '').trim());
  }),
  simpleRule({
    id: 'naming.section5.banned-suffix',
    policySection: '5',
    description: 'Container, Wrapper, wrapper Content, Box, View, and Div are forbidden suffixes.',
    severity: 'error',
    autofixable: true,
    exceptionAllowed: true,
    appliesTo: ['layer', 'component', 'componentPart'],
  }, function (target, rule) {
    if (target.isM3Anatomy && /\bContainer$/i.test(target.name)) return null;
    for (var i = 0; i < BANNED_SUFFIXES.length; i++) {
      var banned = BANNED_SUFFIXES[i];
      if (new RegExp('\\b' + banned + '$', 'i').test(target.name)) {
        return targetViolation(rule, target, `${banned} suffix is forbidden.`, suggestBannedSuffixFix(target.name, banned));
      }
    }
    return null;
  }),
  simpleRule({
    id: 'naming.section5.duplicate-suffix',
    policySection: '5',
    description: 'Repeated semantic suffixes such as Area Area are forbidden.',
    severity: 'error',
    autofixable: true,
    exceptionAllowed: true,
    appliesTo: ['layer', 'component', 'componentPart'],
  }, function (target, rule) {
    var fixed = target.name.replace(/\b(Screen|Body|Header|Footer|Section|Area|Sidebar|List|Grid|Navbar|Form|Input|Card|Group)\s+\1\b/ig, '$1');
    if (fixed === target.name) return null;
    return targetViolation(rule, target, 'Duplicate semantic suffix is forbidden.', fixed);
  }),
  simpleRule({
    id: 'naming.section5.cta',
    policySection: '5',
    description: 'CTA is forbidden because AI frequently misreads it as a marketing hero section.',
    severity: 'error',
    autofixable: false,
    exceptionAllowed: true,
    appliesTo: ['layer', 'component', 'componentPart'],
  }, function (target, rule) {
    if (!CTA_PATTERN.test(target.name)) return null;
    return targetViolation(rule, target, 'CTA is forbidden in CDS node names.', target.name.replace(CTA_PATTERN, 'Button').replace(/\s+/g, ' ').trim());
  }),
  simpleRule({
    id: 'naming.section5.hardcoded-data',
    policySection: '5',
    description: 'Hard-coded sample data should not be used as a layer name.',
    severity: 'error',
    autofixable: false,
    exceptionAllowed: true,
    appliesTo: ['layer', 'text'],
  }, function (target, rule) {
    if (!target.hardcodedData) return null;
    return targetViolation(rule, target, 'Hard-coded sample data is forbidden as a layer name.');
  }),
  simpleRule({
    id: 'naming.section6.layer-slash',
    policySection: '6',
    description: 'Slash is reserved for variant hierarchy only.',
    severity: 'error',
    autofixable: true,
    exceptionAllowed: true,
    appliesTo: ['layer', 'component', 'componentPart', 'text', 'image', 'icon'],
  }, function (target, rule) {
    if (!LAYER_SLASH.test(target.name) || target.isVariantPath) return null;
    return targetViolation(rule, target, 'Slash is only allowed for variant hierarchy.', target.name.replace(/\//g, ' ').replace(/\s+/g, ' ').trim());
  }),
  simpleRule({
    id: 'naming.section6.variant-title-case',
    policySection: '6',
    description: 'Variant paths use slash hierarchy with Title Case segments.',
    severity: 'error',
    autofixable: true,
    exceptionAllowed: true,
    appliesTo: ['variantPath', 'propertyValue'],
  }, function (target, rule) {
    var parts = target.name.split('/');
    if (parts.length < 2 && kindOf(target) === 'variantPath') return null;
    for (var i = 0; i < parts.length; i++) {
      if (!isTitleCaseWords(parts[i].trim())) {
        return targetViolation(rule, target, 'Variant path/value segments must be Title Case.', parts.map(toPolicyTitleCase).join('/'));
      }
    }
    return null;
  }),
  simpleRule({
    id: 'naming.section7.lucide-icon',
    policySection: '7',
    description: 'Icons must be Lucide component instances named with the official Lucide Title Case name.',
    severity: 'error',
    autofixable: false,
    exceptionAllowed: true,
    appliesTo: ['icon'],
  }, function (target, rule) {
    if (LUCIDE_ICON_NAMES.indexOf(target.name) !== -1 && (!target.type || target.type === 'INSTANCE' || target.type === 'COMPONENT')) {
      return null;
    }
    return targetViolation(rule, target, 'Icons must be Lucide component instances named with the official Lucide Title Case name.');
  }),
  simpleRule({
    id: 'naming.section8.publish-prefix',
    policySection: '8',
    description: 'Dot/underscore publish-exclusion prefixes are allowed and bypass node naming checks.',
    severity: 'warning',
    autofixable: false,
    exceptionAllowed: false,
    appliesTo: ['layer', 'component', 'componentPart', 'text', 'image', 'icon'],
  }, function () {
    return null;
  }),
];

export function evaluateNamingTarget(target: NamingTarget): NamingViolation[] {
  var violations: NamingViolation[] = [];
  for (var i = 0; i < NAMING_RULES.length; i++) {
    var violation = NAMING_RULES[i].check(target);
    if (violation) violations.push(violation);
  }
  return violations;
}

export function suggestNamingFix(target: NamingTarget): string | null {
  var name = target.name;
  var violations = evaluateNamingTarget(target);
  for (var i = 0; i < violations.length; i++) {
    if (violations[i].autofixable && violations[i].suggestedName) {
      name = violations[i].suggestedName as string;
    }
  }
  return name !== target.name ? name : null;
}

export function collectNamingTargets(root: NamingTarget & { children?: Array<NamingTarget & { children?: any[] }> }): NamingTarget[] {
  var targets: NamingTarget[] = [];
  function visit(node: NamingTarget & { children?: Array<NamingTarget & { children?: any[] }> }) {
    targets.push(node);
    if (!node.children) return;
    for (var i = 0; i < node.children.length; i++) visit(node.children[i]);
  }
  visit(root);
  return targets;
}

function suggestBannedSuffixFix(name: string, banned: string): string {
  var base = name.replace(new RegExp('\\s*\\b' + banned + '$', 'i'), '').trim();
  if (!base) return 'Area';
  if (/^Main$/i.test(base) && /^Content$/i.test(banned)) return 'Body';
  if (/^Container\s+/i.test(name)) return toPolicyTitleCase(base);
  if (/\b(Content|Wrapper|Box|View|Div)$/i.test(name)) return toPolicyTitleCase(base + ' Area');
  return toPolicyTitleCase(base);
}
