# 리서치 리포트: Figma Organization Plan Shared Fonts + MCP use_figma Pretendard 사용 가능성

> 생성일: 2026-03-27 | 신뢰도: 94% | 소스: 19개 | 라운드: 1/3

## Executive Summary

> **Organization Plan으로 업그레이드하고 Pretendard를 Shared Font로 등록해도, MCP `use_figma`에서는 사용할 수 없다.** Figma 공식 문서에 "Custom fonts aren't supported yet"이 명시적 제한사항으로 기재되어 있다. Figma는 Plugin API parity 로드맵에 커스텀 폰트 지원을 포함시켰지만, 출시 시기는 미공개. 현재 실행 가능한 워크어라운드는 Inter/Noto Sans KR로 생성 후 수동 또는 플러그인으로 Pretendard 전환.

## 1. 배경/맥락

TDS 프로젝트에서 Figma MCP `use_figma` 도구로 Login Screen을 생성하는 Phase 3 S1 테스트 중, `appendChild` 시 Pretendard 폰트가 로드되지 않아 FAIL. 원격 MCP 클라우드 샌드박스에 Pretendard가 없는 것이 원인. 이전 세션에서 Desktop MCP가 해결책으로 제안되었으나, Desktop MCP는 읽기 전용(`use_figma` 미제공)으로 확인됨. 이에 Organization Plan 업그레이드 + Team Shared Font 활용이 대안이 될 수 있는지 조사.

## 2. 핵심 발견

### 발견 1: MCP use_figma에서 커스텀 폰트는 명시적으로 미지원
Figma 공식 개발자 문서(Write to canvas)와 MCP FAQ 모두 **"Custom fonts aren't supported yet"**을 제한사항으로 기재. Organization에 업로드한 커스텀 폰트(Pretendard 등)를 `use_figma` 도구를 통해 텍스트에 적용할 수 없다.
> 소스: [Write to canvas - Developer Docs](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/) (신뢰도: A) ✅ WebFetch 검증
> 소스: [Figma MCP server FAQs](https://help.figma.com/hc/en-us/articles/39252411778583-Figma-MCP-server-FAQs) (신뢰도: A) ✅ WebFetch 검증

### 발견 2: Figma Make에서도 동일 문제 발생
Figma Make(AI 생성 기능)에서도 Organization 커스텀 폰트가 fallback으로 대체되는 현상이 포럼에서 보고됨. MCP와 같은 서버사이드 실행 환경에서 커스텀 폰트 접근이 근본적으로 제한된 상태.
> 소스: [Figma Make and custom fonts - Forum](https://forum.figma.com/ask-the-community-7/figma-make-and-custom-fonts-41339) (신뢰도: C) ✅ WebFetch 검증

### 발견 3: 일반 Plugin API에서는 Org 폰트 접근 가능
로컬에서 실행되는 일반 Figma 플러그인에서는 Organization 업로드 폰트가 `listAvailableFontsAsync()`에 포함되고, `loadFontAsync()`로 로드 가능. 이는 **로컬 실행** 환경에만 해당.
> 소스: [loadFontAsync - Developer Docs](https://developers.figma.com/docs/plugins/api/properties/figma-loadfontasync/) (신뢰도: A) ✅ WebFetch 검증
> 소스: [Plugin API - figma object](https://developers.figma.com/docs/plugins/api/figma/) (신뢰도: A) ✅ WebFetch 검증

### 발견 4: Shared Fonts는 Organization/Enterprise 플랜 전용
커스텀 폰트 업로드/공유 기능은 Organization($55/월) 및 Enterprise 플랜에서만 제공. Professional($15/월)에서는 불가. TTF/OTF 포맷만 지원.
> 소스: [Upload custom fonts to an organization - Help Center](https://help.figma.com/hc/en-us/articles/360039956774-Upload-custom-fonts-to-an-organization) (신뢰도: A) ✅ WebFetch 검증

### 발견 5: Figma가 커스텀 폰트 지원을 로드맵에 포함
공식 블로그 및 다수 소스에서 "Figma is working toward parity with the Plugin API, starting with image support and custom fonts" 확인. 계획은 있으나 구체적 출시 시기 미공개.
> 소스: [Figma AI Agents Canvas MCP - Aihola](https://aihola.com/article/figma-ai-agents-canvas-mcp) (신뢰도: B) ✅ WebFetch 검증

### 발견 6: Pretendard는 Google Fonts에 미등록
Google Fonts 한국어 카탈로그와 GitHub 리포 모두에서 미확인. 자체 CDN(jsDelivr, cdnjs)으로 배포. SIL OFL 1.1 라이선스(Figma 업로드 가능). TTF/OTF 형식 제공.
> 소스: [GitHub - orioncactus/pretendard](https://github.com/orioncactus/pretendard) (신뢰도: A) ✅ WebFetch 검증
> 소스: [Google Fonts Korean subset](https://fonts.google.com/?subset=korean) (신뢰도: A) ✅ WebFetch 검증

## 3. 관점별 분석

| 관점 | 주요 주장 | 소스 | 신뢰도 |
|------|----------|------|--------|
| Figma 공식 문서 | MCP use_figma에서 커스텀 폰트 미지원 (명시적) | Developer Docs, FAQ | A |
| Figma 포럼 (사용자) | Figma Make에서도 커스텀 폰트 fallback 발생 | Forum #41339 | C |
| Figma 공식 로드맵 | Plugin API parity 목표, 커스텀 폰트 포함 | 공식 블로그 | A-B |
| Plugin API 문서 | 로컬 플러그인에서 Org 폰트 접근 가능 | Developer Docs | A |
| 가격 비교 | Org $55/월 vs Pro $15/월 (연간 기준) | Help Center | A |

## 4. 모순점/논쟁

- **Plugin API vs MCP 접근 범위 차이**: 일반 Plugin API 문서에는 Organization 폰트가 `loadFontAsync()`로 접근 가능하다고 명시하지만, MCP 문서에서는 "Custom fonts aren't supported yet"이라고 명시. 이는 모순이 아니라 **실행 환경의 차이** — 로컬 플러그인은 Figma 에디터 컨텍스트에서, MCP는 클라우드 샌드박스에서 실행.
- **주요 소스 간 실질적 모순 없음** — 모든 A급 소스가 동일한 결론을 지지.

## 5. 미검증 영역

| 영역 | 사유 |
|------|------|
| MCP 커스텀 폰트 지원 출시 시기 | 공식 미공개. "working toward parity" 방향만 확인 |
| use_figma에서 Google Fonts/Apple Fonts 정확한 가용 범위 | 공식 문서 미언급. 자체 테스트로 Inter, Noto Sans KR 사용 가능 확인 (7,658개) |
| 커스텀 폰트 미지원 시 구체적 fallback 폰트 | 포럼에서 "fallback" 보고만 있고 어떤 폰트로 대체되는지 미확인 |
| Figma Desktop MCP에 향후 use_figma 추가 가능성 | Desktop MCP 로드맵 미공개 |

## 6. 결론 및 권장사항

### 핵심 결론

**Organization Plan 업그레이드 + Shared Font 등록은 MCP `use_figma`에서 Pretendard 문제를 해결하지 못한다.** 이는 플랜이나 폰트 업로드의 문제가 아니라, MCP 클라우드 샌드박스의 아키텍처적 제한이다. Figma가 Plugin API parity를 달성할 때까지 기다려야 한다.

### 실행 가능한 워크어라운드

| 방법 | 실현성 | 비용 | 자동화 | 추천 |
|------|--------|------|--------|------|
| **A. Inter로 MCP 생성 → Pretendard'em All 플러그인으로 일괄 전환** | 높음 | $0 | 반자동 | **1순위** |
| **B. Inter로 MCP 생성 → TDS Tools에 Font Replace 기능 추가** | 높음 | 개발 시간 | 자동 | 2순위 |
| **C. MCP로 구조만 생성(텍스트 제외) → 수동 텍스트 추가** | 중간 | $0 | 수동 | 3순위 |
| **D. Figma MCP 커스텀 폰트 지원 대기** | 미정 | $0 | - | 대기 |
| **E. Organization Plan 업그레이드 (다른 이유로)** | 높음 | +$40/월/seat | - | MCP 폰트와 무관 |

### Organization Plan 업그레이드 별도 가치

MCP 폰트 해결과 무관하게, Organization Plan은 다음 기능을 제공:
- Code Connect, Branching/Merging, Design System Analytics
- SSO, Centralized Administration, Activity Logs
- Plugin/Widget Management, Domain Capture
- **Shared Fonts** (일반 에디터/플러그인에서는 유용)

폰트만을 위한 업그레이드는 비용 대비 비효율적이지만, 팀 규모 확장 시 종합적으로 검토할 가치 있음.

## Sources

| # | URL | 유형 | 신뢰도 | 검증 |
|---|-----|------|--------|------|
| 1 | [Write to canvas - Developer Docs](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/) | 공식문서 | A | ✅ WebFetch |
| 2 | [Figma MCP server FAQs](https://help.figma.com/hc/en-us/articles/39252411778583-Figma-MCP-server-FAQs) | 공식문서 | A | ✅ WebFetch |
| 3 | [loadFontAsync - Developer Docs](https://developers.figma.com/docs/plugins/api/properties/figma-loadfontasync/) | 공식문서 | A | ✅ WebFetch |
| 4 | [Plugin API - figma object](https://developers.figma.com/docs/plugins/api/figma/) | 공식문서 | A | ✅ WebFetch |
| 5 | [Upload custom fonts to an organization - Help Center](https://help.figma.com/hc/en-us/articles/360039956774-Upload-custom-fonts-to-an-organization) | 공식문서 | A | ✅ WebFetch |
| 6 | [Access shared resources in an organization - Help Center](https://help.figma.com/hc/en-us/articles/360052679454-Access-shared-resources-in-an-organization) | 공식문서 | A | ✅ WebFetch |
| 7 | [Figma plans and features - Help Center](https://help.figma.com/hc/en-us/articles/360040328273-Figma-plans-and-features) | 공식문서 | A | ✅ WebFetch |
| 8 | [Updates to Figma's pricing - Help Center](https://help.figma.com/hc/en-us/articles/27468498501527-Updates-to-Figma-s-pricing-seats-and-billing-experience) | 공식문서 | A | ✅ WebFetch |
| 9 | [How Plugins Run - Developer Docs](https://developers.figma.com/docs/plugins/how-plugins-run/) | 공식문서 | A | ✅ WebFetch |
| 10 | [Working with Text - Developer Docs](https://developers.figma.com/docs/plugins/working-with-text/) | 공식문서 | A | ✅ WebFetch |
| 11 | [Add a font to Figma - Help Center](https://help.figma.com/hc/en-us/articles/360039956894-Add-a-font-to-Figma-Design) | 공식문서 | A | ✅ WebFetch |
| 12 | [Guide to the Figma MCP server - Help Center](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) | 공식문서 | A | ✅ WebFetch |
| 13 | [GitHub - orioncactus/pretendard](https://github.com/orioncactus/pretendard) | 공식리포 | A | ✅ WebFetch |
| 14 | [Google Fonts Korean subset](https://fonts.google.com/?subset=korean) | 공식서비스 | A | ✅ WebFetch |
| 15 | [GitHub - figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | 공식가이드 | A | ✅ WebFetch |
| 16 | [Figma AI Agents Canvas MCP - Aihola](https://aihola.com/article/figma-ai-agents-canvas-mcp) | 테크미디어 | B | ✅ WebFetch |
| 17 | [Figma Make and custom fonts - Forum](https://forum.figma.com/ask-the-community-7/figma-make-and-custom-fonts-41339) | 포럼 | C | ✅ WebFetch |
| 18 | [Shared fonts Organization plan - Forum](https://forum.figma.com/t/shared-fonts-with-team-only-available-in-organization-plan/74569) | 포럼 | C | ✅ WebFetch |
| 19 | [Font provider API - Forum](https://forum.figma.com/ask-the-community-7/does-figma-api-allow-us-to-know-font-provider-36629) | 포럼 | C | ✅ WebFetch |

---
*Generated by /research — Deep Research Protocol*
*Confidence: 94% | Sources: 19 | Rounds: 1/3*
