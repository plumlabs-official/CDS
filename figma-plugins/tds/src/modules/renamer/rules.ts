/**
 * TDS Naming Policy v1.1 — 코드화
 *
 * naming-policy.md의 규칙을 실행 가능한 상수/함수로 변환.
 * 기존 naming/helpers/constants.ts에서 필요한 상수만 이전.
 */

// ============================================
// TDS 식별
// ============================================

export const TDS_FILE_KEY = 'H36eNEd6o7ZTv4R7VcyLf2';

// ============================================
// 금지 어휘
// ============================================

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

export const TDS_ICON_MAP: Record<string, string> = {
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
