# 리서치 리포트: Figma 디자인 시스템 기반 AI 디자인 생성 업데이트

> 생성일: 2026-03-27 | 신뢰도: 91% | 소스: 18개 | 라운드: 1/3

## Executive Summary

Figma가 2026-03-24 **MCP 서버 오픈 베타**를 발표하여, AI 에이전트가 Figma 캔버스에 직접 디자인을 생성/수정할 수 있게 되었다. 핵심은 **Skills 시스템** — 마크다운으로 작성된 워크플로우 지침이 에이전트에게 "팀의 디자인 시스템을 source of truth로 사용하여 빌드하라"고 지시한다. 이는 기존 First Draft(커스텀 DS 미지원)의 한계를 MCP+Skills로 우회한 접근이며, TDS 프로젝트에 직접적 영향을 줄 수 있는 업데이트다.

---

## 1. Figma AI 디자인 생성의 3개 트랙

| 트랙 | 제품 | 커스텀 DS 지원 | 상태 |
|------|------|---------------|------|
| **A. First Draft** | Figma Design 내장 AI | **미지원** (Figma 내장 라이브러리만) | GA |
| **B. Figma Make** | 독립 prompt-to-app 도구 | **부분** (npm React 패키지 + 스타일 CSS) | 베타 |
| **C. MCP 서버 + Skills** | AI 에이전트 → 캔버스 쓰기 | **완전 지원** (변수/컴포넌트/토큰 직접 접근) | 오픈 베타 (3/24) |

> 소스: [Figma Help Center](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) (A) ✅ WebFetch

**핵심 판단:** "디자인 시스템 활용 디자인 생성"의 진짜 업데이트는 **트랙 C (MCP+Skills)**. 나머지 두 트랙은 커스텀 DS 통합이 제한적.

---

## 2. 핵심 발견

### 발견 1: MCP 서버 — AI 에이전트가 캔버스에 직접 쓰기 (3/24 오픈 베타)

Figma MCP(Model Context Protocol) 서버를 통해 AI 에이전트가 캔버스에 직접 디자인 에셋을 생성/수정할 수 있다. 핵심 도구명은 `use_figma`.

**에이전트가 할 수 있는 것:**
- 디자인 시스템의 컴포넌트, 변수(variables), 토큰을 **읽기**
- 하드코딩 대신 변수를 적용하여 프레임/컴포넌트/오토 레이아웃을 **생성**
- 올바른 variant와 레이어 네이밍으로 컴포넌트 세트를 구축
- 실행 중인 웹 앱 UI를 캡처하여 Figma에 편집 가능한 프레임으로 **푸시** (Code-to-Canvas)

**지원 클라이언트 (14개+):** Claude Code, Codex, Cursor, VS Code, GitHub Copilot, Warp, Factory, Firebender, Augment, Android Studio 등

**가격:** 오픈 베타 기간 무료. 향후 사용량 기반 유료 전환 예정.
- Full 시트: 캔버스 쓰기 가능
- Dev 시트: Drafts에서만 사용 가능

> 소스: [Figma Developer Docs](https://developers.figma.com/docs/figma-mcp-server/) (A) ✅ WebFetch
> 소스: [Figma Blog - Agents Meet Canvas](https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/) (A) 스니펫 확인
> 소스: [Bitovi Blog - First Look](https://www.bitovi.com/blog/figma-just-opened-the-canvas-to-agents.-heres-what-actually-happens) (B) ✅ WebFetch

### 발견 2: Skills 시스템 — 디자인 시스템 규칙을 에이전트에게 전달하는 마크다운 명세

Skills는 `SKILL.md` 형식의 마크다운 파일로, AI 에이전트가 디자인 시스템을 준수하며 작업하는 방법을 정의한다.

**핵심 워크플로우 4가지:**
1. 레거시 값을 Variables로 마이그레이션
2. 컴포넌트 세트를 variant/property 규칙에 맞게 표준화
3. 기존 라이브러리 컴포넌트로 스크린 생성 후 검증
4. 디자인 에셋-코드 동기화 업데이트

**스킬이 에이전트에게 지시하는 것:**
- "라이브러리를 먼저 검색하라"
- "변수 네이밍 규칙을 따르라"
- "실제 컴포넌트로 구축하라"
- Claude Code에서는 `.claude/skills/<skill-name>/SKILL.md` 경로에 생성

> 소스: [Figma Developer Docs - Create Skills](https://developers.figma.com/docs/figma-mcp-server/create-skills/) (A) ✅ WebFetch
> 소스: [Figma Blog - DS and AI: MCP Unlock](https://www.figma.com/blog/design-systems-ai-mcp/) (A) 스니펫 확인

### 발견 3: First Draft — 커스텀 DS 미지원, Figma 내장 라이브러리만 사용

First Draft는 프롬프트 → 와이어프레임/디자인 자동 생성 기능이나, **사용자의 커스텀 디자인 시스템은 사용 불가**.

> "It's not possible to generate designs using your own design system, although we hope to make that functionality available soon"
> — Figma 공식 도움말

- Figma 내장 라이브러리(Simple Design System 372개 컴포넌트, Material 3 등) 중 선택
- Amazon Titan 확산 모델로 이미지 생성
- 단일 화면만 생성 (멀티스크린 플로우 불가)
- 500자 프롬프트 제한
- 1회 생성당 20 AI 크레딧

**배경:** 2024년 7월 "Make Designs"로 출시 → Apple Weather 앱 복사 논란으로 즉시 중단 → "First Draft"로 리브랜딩 재출시

> 소스: [Figma Help - First Draft](https://help.figma.com/hc/en-us/articles/23955143044247-Use-First-Draft-with-Figma-AI) (A) ✅ WebFetch
> 소스: [DesignerUp Blog](https://designerup.co/blog/figma-ai-first-draft-feature-rerelease/) (B) ✅ WebFetch

### 발견 4: Figma Make — npm 패키지 기반 부분적 DS 연동

Figma Make는 독립적인 prompt-to-app 도구로 기능적 프로토타입/웹 앱을 생성.

- **npm에 퍼블리시된 React 컴포넌트 라이브러리**를 "Make kit"으로 가져와 사용 가능
- Figma Design 라이브러리에서 스타일 컨텍스트를 `styles.css`로 추출
- **한계:** 디자인 토큰이 변수 구문(variable syntax)을 보존하지 않고 **원시 값(raw values)으로 평탄화**
- 현재 React만 지원
- 복잡도에 따라 30~100+ AI 크레딧

> 소스: [Figma Help - Make DS Package](https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Figma-Make) (A) ✅ WebFetch
> 소스: [Figma Help - Make FAQs](https://help.figma.com/hc/en-us/articles/31722591905559-Figma-Make-FAQs) (A) ✅ WebFetch

### 발견 5: 커뮤니티 반응 — 속도 vs 품질 격차

- **91%** 디자이너가 AI로 속도 향상 체감
- **15%만** 작업 품질에 자신감 향상
- **32%만** AI 결과물을 신뢰
- "Race to the Middle" — 표준 SaaS 대시보드 손쉽게 생성하면서 디자인 평준화 우려
- Figma Sites는 Config 2025 직후 **210+ WCAG 위반** 발견되어 접근성 비판

MCP+Skills에 대해서는:
- Bitovi 블로그: "명시적 디자인 시스템 지시 없이는 일관성 없는 결과" → Skills 정교 작성이 핵심
- 14개+ MCP 클라이언트 지원으로 생태계 확장에 대한 긍정적 반응

> 소스: [Forrester - Config 2025](https://www.forrester.com/blogs/figma-config-2025-in-an-ai-world-design-matters-more-than-ever/) (A) ✅ WebFetch
> 소스: [doc.cc - Craft Crisis](https://www.doc.cc/articles/craft-crisis) (B) ✅ WebFetch

---

## 3. 관점별 분석

| 관점 | 주요 주장 | 소스 | 신뢰도 |
|------|----------|------|--------|
| Figma 공식 | MCP+Skills로 DS 기반 에이전트 빌드 가능. "Design systems are the unlock" | 공식 블로그/문서 | A |
| 실무 개발자 (Bitovi) | 스킬 없이 에이전트 실행하면 일관성 없음. 스킬 작성이 핵심 | Bitovi Blog | B |
| 산업 애널리스트 (Forrester) | 12개월 후 재평가 권고. 접근성 표준 준수 전 Sites 사용 지양 | Forrester | A |
| 디자인 비평 | AI 평준화 우려. "good enough" 문화 조장 | doc.cc, The Cursor Mag | B-C |

---

## 4. 모순점/논쟁

주요 소스 간 **사실적 모순은 없음**. 다만 평가의 온도 차이가 존재:
- Figma 공식: "Design systems are the unlock for AI" (긍정적)
- Bitovi 실무 테스트: "Without explicit DS instructions, results are inconsistent" (조건부)
- Forrester: "Wait 12 months before adopting Sites" (신중)

---

## 5. 미검증 영역

| 영역 | 사유 |
|------|------|
| First Draft 커스텀 DS 지원 출시 시점 | "soon"만 언급. 구체적 날짜 미공개 |
| Schema 2025 "AI Design System Guidelines" 상세 | 블로그 JS 렌더링으로 본문 확인 불가 |
| MCP 서버가 전달하는 DS 데이터의 정확한 JSON 스키마 | 공식 문서에서 개괄만 서술 |
| Figma Make의 React 외 프레임워크 지원 계획 | 미발표 |

---

## 6. TDS 프로젝트 영향도 및 권장사항

### 직접적 영향

| 영역 | 영향 | 우선순위 |
|------|------|---------|
| **MCP Skills 도입** | TDS 네이밍 정책, 토큰 규칙, 컴포넌트 구조를 SKILL.md로 작성하면 에이전트가 TDS 준수 화면을 자동 생성 가능 | 높음 |
| **Code-to-Canvas** | wellness-challenge-platform 코드를 Figma로 역으로 푸시하여 디자인-코드 동기화 가능 | 중간 |
| **First Draft 커스텀 DS** | 출시되면 TDS 라이브러리를 First Draft에서 직접 활용 가능. 현재는 미지원 | 대기 |
| **Figma Make + TDS** | React 컴포넌트를 npm 퍼블리시하면 Make에서 TDS 기반 프로토타입 생성 가능. 단 토큰 평탄화 한계 | 낮음 |

### 권장 액션

1. **MCP Skills 작성 검토** — TDS naming-policy, qa-rubric을 기반으로 `SKILL.md` 형식의 Figma MCP 스킬 작성
2. **현재 Figma MCP 서버 설정 확인** — 이미 사용 중인 `mcp__figma__get_figma_data`와의 관계 파악
3. **First Draft 커스텀 DS 지원 출시 모니터링** — 출시 시 TDS 라이브러리 즉시 연결

---

## Sources

| # | URL | 유형 | 신뢰도 | 검증 |
|---|-----|------|--------|------|
| 1 | [Figma MCP Server - Developer Docs](https://developers.figma.com/docs/figma-mcp-server/) | 공식 개발자 문서 | A | ✅ WebFetch |
| 2 | [Create Skills - Developer Docs](https://developers.figma.com/docs/figma-mcp-server/create-skills/) | 공식 개발자 문서 | A | ✅ WebFetch |
| 3 | [Guide to Figma MCP Server - Help Center](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) | 공식 도움말 | A | ✅ WebFetch |
| 4 | [Use First Draft - Help Center](https://help.figma.com/hc/en-us/articles/23955143044247-Use-First-Draft-with-Figma-AI) | 공식 도움말 | A | ✅ WebFetch |
| 5 | [Use DS Package in Make - Help Center](https://help.figma.com/hc/en-us/articles/35946832653975-Use-your-design-system-package-in-Figma-Make) | 공식 도움말 | A | ✅ WebFetch |
| 6 | [Figma Make FAQs - Help Center](https://help.figma.com/hc/en-us/articles/31722591905559-Figma-Make-FAQs) | 공식 도움말 | A | ✅ WebFetch |
| 7 | [AI Credits - Help Center](https://help.figma.com/hc/en-us/articles/33459875669015-How-AI-credits-work) | 공식 도움말 | A | ✅ WebFetch |
| 8 | [Agents Meet Canvas - Figma Blog](https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/) | 공식 블로그 | A | 스니펫 |
| 9 | [DS and AI: MCP Unlock - Figma Blog](https://www.figma.com/blog/design-systems-ai-mcp/) | 공식 블로그 | A | 스니펫 |
| 10 | [Claude Code to Figma - Figma Blog](https://www.figma.com/blog/introducing-claude-code-to-figma/) | 공식 블로그 | A | 스니펫 |
| 11 | [Bitovi - Figma MCP First Look](https://www.bitovi.com/blog/figma-just-opened-the-canvas-to-agents.-heres-what-actually-happens) | 전문 블로그 | B | ✅ WebFetch |
| 12 | [DesignerUp - First Draft](https://designerup.co/blog/figma-ai-first-draft-feature-rerelease/) | 디자인 교육 | B | ✅ WebFetch |
| 13 | [Forrester - Config 2025](https://www.forrester.com/blogs/figma-config-2025-in-an-ai-world-design-matters-more-than-ever/) | 산업 애널리스트 | A | ✅ WebFetch |
| 14 | [doc.cc - Craft Crisis](https://www.doc.cc/articles/craft-crisis) | 디자인 미디어 | B | ✅ WebFetch |
| 15 | [The Cursor Mag - Fall of Figma](https://thecursormag.substack.com/p/the-fall-of-figma) | 뉴스레터 | C | ✅ WebFetch |
| 16 | [Figma AI Limitations - GitHub Gist](https://gist.github.com/eonist/f5131d1ce5bfe5ea1130f6e2c4e27a7a) | 개인 정리 | C | ✅ WebFetch |
| 17 | [Releasebot - Figma](https://releasebot.io/updates/figma) | 릴리즈 트래커 | B | ✅ WebFetch |
| 18 | [Figma Blog - Make Designs Retrospective](https://www.figma.com/blog/inside-figma-a-retrospective-on-make-designs/) | 공식 블로그 | A | 스니펫 |

---
*Generated by /research — Deep Research Protocol*
*Confidence: 91% | Sources: 18 | Rounds: 1/3*
