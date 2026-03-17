/**
 * TDS Tools
 *
 * Figma 플러그인 메인 엔트리
 * - Renamer: naming-policy v1.1 기반 자동 리네이밍
 */

// Renamer (naming-policy v1.1 기반)
import {
  analyzeProductDesign,
  applyProductRenames,
  analyzeTDSLibrary,
  unwrapSingleChildWrappers,
  RenamerResult,
} from './modules/renamer/renamer';

// 항상 UI 열기 (플로팅 패널)
figma.showUI(__html__, {
  width: 300,
  height: 400,
  themeColors: true,
  title: 'TDS Tools',
});

// UI에서 오는 메시지 처리
figma.ui.onmessage = handleUIMessage;

// 메뉴에서 직접 명령어 실행한 경우 처리
const command = figma.command;
if (command && command !== 'open-ui') {
  handleCommand(command);
}

/**
 * 명령어 처리
 */
function handleCommand(cmd: string) {
  switch (cmd) {
    case 'rename-product':
      handleRenameProduct();
      break;

    case 'rename-tds':
      handleRenameTDS();
      break;

    default:
      figma.notify('알 수 없는 명령입니다.', { error: true });
  }
}

/**
 * UI 메시지 핸들러
 */
function handleUIMessage(msg: { type: string; [key: string]: any }) {
  switch (msg.type) {
    case 'rename-product':
      handleRenameProduct();
      break;

    case 'rename-tds':
      handleRenameTDS();
      break;

    case 'apply-renames':
      if (msg.entries) {
        applyProductRenames(msg.entries).then(function(count) {
          figma.notify('✅ ' + count + '건 리네이밍 완료');
        });
      }
      break;

    case 'unwrap-wrappers':
      if (msg.nodeIds) {
        unwrapSingleChildWrappers(msg.nodeIds).then(function(count) {
          figma.notify('✅ ' + count + '건 래퍼 언래핑 완료');
        });
      }
      break;

    default:
      // 알 수 없는 메시지는 무시
      break;
  }
}

// ============================================
// Renamer 핸들러 (naming-policy v1.1)
// ============================================

function handleRenameProduct() {
  const result = analyzeProductDesign();
  if (result.entries.length === 0) {
    figma.notify('변경할 레이어가 없습니다.', { timeout: 2000 });
    return;
  }
  figma.ui.postMessage({
    type: 'rename-preview',
    mode: 'product',
    entries: result.entries,
    wrapperWarnings: result.wrapperWarnings,
    skipped: result.skipped,
    total: result.total,
  });
  var warnCount = result.wrapperWarnings.length;
  var msg = result.entries.length + '건 변경 제안 (' + result.skipped + '건 TDS skip)';
  if (warnCount > 0) msg += ' + ' + warnCount + '건 래퍼 경고';
  figma.notify(msg, { timeout: 3000 });
}

function handleRenameTDS() {
  const result = analyzeTDSLibrary();
  figma.ui.postMessage({
    type: 'rename-preview',
    mode: 'library',
    entries: result.entries,
    propertyIssues: result.propertyIssues,
    total: result.total,
  });
  const issueCount = result.entries.length + result.propertyIssues.length;
  if (issueCount === 0) {
    figma.notify('이슈 없음. 정책 준수 ✅', { timeout: 2000 });
  } else {
    figma.notify(`${issueCount}건 이슈 발견`, { timeout: 3000 });
  }
}
