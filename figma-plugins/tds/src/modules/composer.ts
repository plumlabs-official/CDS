/**
 * Composer 모듈 — TDS 커스텀 컴포넌트 프로그래매틱 생성
 *
 * 생성 대상:
 * - Video Container (Primitive): 배경 이미지 + 중앙 play 버튼
 * - Challenge Card (Composed, 3 variants): 챌린지 히어로 카드
 */

// === Constants ===

const WHITE: RGB = { r: 1, g: 1, b: 1 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };
const DARK_PLACEHOLDER: RGB = { r: 0.12, g: 0.12, b: 0.14 };
const RED_BADGE: RGB = { r: 0.953, g: 0.224, b: 0.224 }; // #F33939

const CARD_WIDTH = 343;
const CARD_HEIGHT = 193;
const VIDEO_WIDTH = 375;
const VIDEO_HEIGHT = 211;
const CONTENT_HEIGHT = 74;
const PROGRESS_HEIGHT = 28;

// === Font Loading ===

async function loadRequiredFonts(): Promise<void> {
  await Promise.all([
    figma.loadFontAsync({ family: 'Pretendard', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'Pretendard', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Pretendard', style: 'Medium' }),
  ]);
}

// === Shared Builders ===

function createBgPlaceholder(width: number, height: number): RectangleNode {
  const bg = figma.createRectangle();
  bg.name = 'bg';
  bg.resize(width, height);
  bg.fills = [{ type: 'SOLID', color: DARK_PLACEHOLDER }];
  bg.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
  return bg;
}

function createGradientOverlay(width: number, height: number): RectangleNode {
  const overlay = figma.createRectangle();
  overlay.name = 'Gradient Overlay';
  overlay.resize(width, height);
  overlay.x = 0;
  overlay.y = 0;
  overlay.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [-1, 0, 1]], // top → bottom
    gradientStops: [
      { position: 0, color: { ...BLACK, a: 0 } },
      { position: 0.34, color: { ...BLACK, a: 0 } },
      { position: 0.93, color: { ...BLACK, a: 1 } },
      { position: 1, color: { ...BLACK, a: 1 } },
    ],
  }];
  return overlay;
}

function applyPillLayout(frame: FrameNode, w: number, h: number): void {
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisAlignItems = 'CENTER';
  frame.counterAxisAlignItems = 'CENTER';
  frame.itemSpacing = 4;
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(w, h);
  frame.cornerRadius = 100;
}

function createPlayPill(): FrameNode {
  const pill = figma.createFrame();
  pill.name = 'Play Pill';
  applyPillLayout(pill, 78, 30);
  pill.fills = [{ type: 'SOLID', color: BLACK, opacity: 0.4, visible: true }];
  pill.effects = [{
    type: 'DROP_SHADOW', visible: true, blendMode: 'NORMAL',
    color: { ...BLACK, a: 0.4 }, offset: { x: 0, y: 0 }, radius: 4, spread: 0,
  }];

  const icon = figma.createRectangle();
  icon.name = 'icon_sound';
  icon.resize(15, 13);
  icon.cornerRadius = 2;
  icon.fills = [{ type: 'SOLID', color: WHITE }];
  pill.appendChild(icon);

  const text = figma.createText();
  text.name = 'Duration';
  text.fontName = { family: 'Pretendard', style: 'SemiBold' };
  text.characters = '03:20';
  text.fontSize = 14;
  text.lineHeight = { value: 26, unit: 'PIXELS' };
  text.textAlignHorizontal = 'CENTER';
  text.textAlignVertical = 'CENTER';
  text.fills = [{ type: 'SOLID', color: WHITE }];
  pill.appendChild(text);

  return pill;
}

function createDeadlineBadge(): FrameNode {
  const badge = figma.createFrame();
  badge.name = 'Deadline Badge';
  badge.layoutMode = 'HORIZONTAL';
  badge.primaryAxisAlignItems = 'CENTER';
  badge.counterAxisAlignItems = 'CENTER';
  badge.paddingLeft = 7;
  badge.paddingRight = 7;
  badge.primaryAxisSizingMode = 'AUTO';
  badge.counterAxisSizingMode = 'FIXED';
  badge.resize(160, 30);
  badge.cornerRadius = 8;
  badge.fills = [{ type: 'SOLID', color: RED_BADGE }];

  const text = figma.createText();
  text.name = 'Deadline Text';
  text.fontName = { family: 'Pretendard', style: 'Regular' };
  text.characters = '⏱️ 8시간 후 인증 마감';
  text.fontSize = 15;
  text.letterSpacing = { value: -0.6, unit: 'PERCENT' };
  text.fills = [{ type: 'SOLID', color: WHITE }];
  badge.appendChild(text);

  return badge;
}

function createDecorativeVector(width: number): FrameNode {
  // Play-shaped decorative element (placeholder triangle frame)
  const container = figma.createFrame();
  container.name = 'Decorative Vector';
  container.resize(31, 40);
  container.fills = [];
  container.x = width / 2 - 15;
  container.y = 73;

  const triangle = figma.createPolygon();
  triangle.pointCount = 3;
  triangle.resize(31, 40);
  triangle.fills = [{ type: 'SOLID', color: WHITE }];
  triangle.opacity = 0.3;
  container.appendChild(triangle);

  return container;
}

function createTitleText(title: string): TextNode {
  const t = figma.createText();
  t.name = 'Title';
  t.fontName = { family: 'Pretendard', style: 'SemiBold' };
  t.characters = title;
  t.fontSize = 22;
  t.lineHeight = { value: 32, unit: 'PIXELS' };
  t.fills = [{ type: 'SOLID', color: WHITE }];
  t.layoutSizingHorizontal = 'FILL';
  return t;
}

function createInfoSlot(width: number, index: number, total: number): FrameNode {
  const slot = figma.createFrame();
  slot.name = total === 1 ? 'Slot_Info' : `Slot_Info_${index + 1}`;
  slot.fills = [];
  slot.resize(width - 32, 17);
  slot.layoutSizingHorizontal = 'FILL';
  return slot;
}

function createContentSection(width: number, title: string, infoSlotCount: number): FrameNode {
  const content = figma.createFrame();
  content.name = 'Content';
  content.layoutMode = 'VERTICAL';
  content.itemSpacing = 4;
  content.paddingLeft = 16;
  content.paddingRight = 16;
  content.paddingTop = 14;
  content.paddingBottom = 14;
  content.primaryAxisSizingMode = 'FIXED';
  content.counterAxisSizingMode = 'FIXED';
  content.resize(width, CONTENT_HEIGHT);
  content.fills = [];

  content.appendChild(createTitleText(title));
  for (let i = 0; i < infoSlotCount; i++) {
    content.appendChild(createInfoSlot(width, i, infoSlotCount));
  }
  return content;
}

// === Video Container ===

function createPlayButton(): FrameNode {
  const btn = figma.createFrame();
  btn.name = 'Play Button';
  btn.resize(64, 64);
  btn.cornerRadius = 9999;
  btn.fills = [{ type: 'SOLID', color: WHITE }];
  btn.effects = [{
    type: 'DROP_SHADOW', visible: true, blendMode: 'NORMAL',
    color: { ...BLACK, a: 0.05 }, offset: { x: 0, y: 1 }, radius: 2, spread: 0,
  }];
  btn.layoutMode = 'HORIZONTAL';
  btn.primaryAxisAlignItems = 'CENTER';
  btn.counterAxisAlignItems = 'CENTER';

  const icon = figma.createPolygon();
  icon.name = 'Play Icon';
  icon.pointCount = 3;
  icon.resize(18, 18);
  icon.fills = [{ type: 'SOLID', color: { r: 0.035, g: 0.035, b: 0.043 } }];
  btn.appendChild(icon);

  return btn;
}

function buildVideoContainer(): ComponentNode {
  const component = figma.createComponent();
  component.name = 'Video Container';
  component.resize(VIDEO_WIDTH, VIDEO_HEIGHT);
  component.cornerRadius = 8;
  component.clipsContent = true;

  component.appendChild(createBgPlaceholder(VIDEO_WIDTH, VIDEO_HEIGHT));

  const playBtn = createPlayButton();
  playBtn.x = (VIDEO_WIDTH - 64) / 2;
  playBtn.y = (VIDEO_HEIGHT - 64) / 2;
  component.appendChild(playBtn);

  return component;
}

// === Challenge Card Variants ===

function createTopBar(withDeadline: boolean): FrameNode {
  const bar = figma.createFrame();
  bar.name = 'Top Bar';
  bar.layoutMode = 'HORIZONTAL';
  bar.primaryAxisAlignItems = 'MIN';
  bar.counterAxisAlignItems = 'CENTER';
  bar.primaryAxisSizingMode = 'FIXED';
  bar.counterAxisSizingMode = 'AUTO';
  bar.resize(CARD_WIDTH - 16, 30);
  bar.x = 8;
  bar.y = 9;
  bar.fills = [];

  if (withDeadline) {
    // space-between: pill left, badge right (레퍼런스 B 구조)
    bar.primaryAxisAlignItems = 'MIN';
    bar.itemSpacing = 0;
    bar.appendChild(createPlayPill());
    const spacer = figma.createFrame();
    spacer.name = '_spacer';
    spacer.fills = [];
    spacer.layoutSizingHorizontal = 'FILL';
    spacer.resize(10, 1);
    bar.appendChild(spacer);
    bar.appendChild(createDeadlineBadge());
  } else {
    bar.appendChild(createPlayPill());
  }

  return bar;
}

function initVariant(name: string, withGradient: boolean): ComponentNode {
  const c = figma.createComponent();
  c.name = name;
  c.resize(CARD_WIDTH, CARD_HEIGHT);
  c.clipsContent = true;
  c.appendChild(createBgPlaceholder(CARD_WIDTH, CARD_HEIGHT));
  if (withGradient) {
    c.appendChild(createGradientOverlay(CARD_WIDTH, CARD_HEIGHT));
  }
  c.appendChild(createDecorativeVector(CARD_WIDTH));
  return c;
}

function buildVariantDefault(): ComponentNode {
  const component = initVariant('Type=Default', true);
  component.appendChild(createTopBar(true));

  const content = createContentSection(CARD_WIDTH, '오늘의 할 일', 1);
  content.x = 0;
  content.y = CARD_HEIGHT - 74;
  component.appendChild(content);

  return component;
}

function createProgressBar(): FrameNode {
  const container = figma.createFrame();
  container.name = 'Progress Container';
  container.layoutMode = 'HORIZONTAL';
  container.counterAxisAlignItems = 'CENTER';
  container.paddingLeft = 16;
  container.paddingRight = 16;
  container.primaryAxisSizingMode = 'FIXED';
  container.counterAxisSizingMode = 'AUTO';
  container.resize(CARD_WIDTH, 28);
  container.fills = [];

  const track = figma.createFrame();
  track.name = 'Progress Track';
  track.resize(CARD_WIDTH - 32, 6);
  track.cornerRadius = 3;
  track.fills = [{ type: 'SOLID', color: WHITE, opacity: 0.3 }];
  track.layoutSizingHorizontal = 'FILL';
  track.clipsContent = true;

  const fill = figma.createRectangle();
  fill.name = 'Progress Fill';
  fill.resize((CARD_WIDTH - 32) * 0.6, 6);
  fill.cornerRadius = 3;
  fill.fills = [{ type: 'SOLID', color: WHITE }];
  track.appendChild(fill);

  container.appendChild(track);
  return container;
}

function buildVariantProgress(): ComponentNode {
  const component = initVariant('Type=Progress', true);
  component.appendChild(createTopBar(false));

  const content = createContentSection(CARD_WIDTH, '오늘의 할 일', 1);
  content.x = 0;
  content.y = CARD_HEIGHT - CONTENT_HEIGHT - PROGRESS_HEIGHT;
  component.appendChild(content);

  const progress = createProgressBar();
  progress.x = 0;
  progress.y = CARD_HEIGHT - PROGRESS_HEIGHT;
  component.appendChild(progress);

  return component;
}

function buildVariantMinimal(): ComponentNode {
  const component = initVariant('Type=Minimal', false);
  component.appendChild(createTopBar(false));

  const content = createContentSection(CARD_WIDTH, '2주간 매일 30분 산책하기', 2);
  content.x = 0;
  content.y = CARD_HEIGHT - CONTENT_HEIGHT;
  component.appendChild(content);

  return component;
}

function buildChallengeCard(): ComponentSetNode {
  const variant1 = buildVariantDefault();
  const variant2 = buildVariantProgress();
  const variant3 = buildVariantMinimal();

  const componentSet = figma.combineAsVariants(
    [variant1, variant2, variant3],
    figma.currentPage,
  );
  componentSet.name = 'Challenge Card';

  return componentSet;
}

// === Public API ===

export async function composeVideoContainer(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await loadRequiredFonts();
    const component = buildVideoContainer();

    // Position at viewport center
    const viewport = figma.viewport.center;
    component.x = Math.round(viewport.x - VIDEO_WIDTH / 2);
    component.y = Math.round(viewport.y - VIDEO_HEIGHT / 2);

    figma.currentPage.selection = [component];
    figma.viewport.scrollAndZoomIntoView([component]);

    return {
      success: true,
      message: `Video Container 생성 완료 (${VIDEO_WIDTH}×${VIDEO_HEIGHT})`,
    };
  } catch (e) {
    return { success: false, message: `오류: ${e}` };
  }
}

export async function composeChallengeCard(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await loadRequiredFonts();
    const componentSet = buildChallengeCard();

    const viewport = figma.viewport.center;
    componentSet.x = Math.round(viewport.x - componentSet.width / 2);
    componentSet.y = Math.round(viewport.y - componentSet.height / 2);

    figma.currentPage.selection = [componentSet];
    figma.viewport.scrollAndZoomIntoView([componentSet]);

    return {
      success: true,
      message: `Challenge Card 생성 완료 (3 variants: Default, Progress, Minimal)`,
    };
  } catch (e) {
    return { success: false, message: `오류: ${e}` };
  }
}

export async function composeAll(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await loadRequiredFonts();

    const video = buildVideoContainer();
    const challenge = buildChallengeCard();

    // Position side by side at viewport
    const viewport = figma.viewport.center;
    const totalWidth = VIDEO_WIDTH + 100 + challenge.width;
    video.x = Math.round(viewport.x - totalWidth / 2);
    video.y = Math.round(viewport.y - VIDEO_HEIGHT / 2);
    challenge.x = video.x + VIDEO_WIDTH + 100;
    challenge.y = video.y;

    figma.currentPage.selection = [video, challenge];
    figma.viewport.scrollAndZoomIntoView([video, challenge]);

    return {
      success: true,
      message: `Video Container + Challenge Card (3 variants) 생성 완료`,
    };
  } catch (e) {
    return { success: false, message: `오류: ${e}` };
  }
}
