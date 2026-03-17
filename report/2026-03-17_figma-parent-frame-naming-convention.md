# 리서치 리포트: Figma 부모 프레임 네이밍 컨벤션

> 생성일: 2026-03-17 | 신뢰도: 92% | 소스: 25개 | 라운드: 1/3

## Executive Summary

**계층 서술 방식(`Main Content Container`)은 업계 표준이 아니다.** shadcn/Radix, Material Design 3, 주요 디자인 시스템 모두 **`[컨텍스트] + [역할]` 2단어 플랫 네이밍**을 사용하며, 구조적 타입(Container/Wrapper)을 이름 끝에 붙이지 않는다. 계층은 이름이 아니라 **레이어 패널의 트리 구조(들여쓰기)**로 표현한다.

---

## 1. 질문에 대한 직접 답변

### "Main Content Container 같은 대→중→소 서술이 맞지 않나?"

맞는 직관이지만, **업계는 다른 방식을 선택했다.**

| 방식 | 예시 | 사용처 | 문제 |
|------|------|--------|------|
| 계층 서술 (대→중→소) | `Main Content Container` | 거의 없음 | 이름이 길어지고, "Container"가 정보를 추가하지 않음 |
| **컨텍스트+역할 (2단어)** | `Main Content` | **shadcn, Radix, M3** | 업계 표준 |
| 역할만 (1단어) | `Content` | 컴포넌트 내부 파트 | 스크린 레벨에선 모호 |

**핵심 논거:** Figma에서 모든 프레임은 이미 "컨테이너"다. React에서 모든 컴포넌트는 이미 뭔가를 "감싸고" 있다. **`Container`/`Wrapper`는 구조적 사실을 반복할 뿐, 새 정보를 주지 않는다.**

---

## 2. 업계가 실제로 쓰는 패턴

### shadcn/Radix — 플랫 `[Component][Part]`

```
Dialog
├── DialogContent        (≠ Dialog Content Container)
│   ├── DialogHeader     (≠ Dialog Header Container)
│   │   ├── DialogTitle
│   │   └── DialogDescription
│   └── DialogFooter
```

- **계층은 JSX 중첩(= Figma 레이어 트리)으로 표현**
- 이름 자체에 계층을 넣지 않음
- Container/Wrapper 접미사 **0건** (전체 컴포넌트 확인)

### Radix 표준 어휘 (래퍼 역할)

| 역할 | Part 이름 | "Container"를 쓰지 않는 대안 |
|------|-----------|---------------------------|
| 최상위 | **Root** | ~~ComponentContainer~~ |
| 메인 콘텐츠 영역 | **Content** | ~~ContentContainer~~ |
| 상단 묶음 | **Header** | ~~HeaderContainer~~ |
| 하단 묶음 | **Footer** | ~~FooterContainer~~ |
| 항목 그룹 | **Group** | ~~ItemsContainer~~ |
| 스크롤 영역 | **Viewport** | ~~ScrollContainer~~ |

### Material Design 3 — Anatomy 용어

```
Button
├── Container          ← M3에서 유일하게 "Container" 사용 (최외곽)
│   ├── State Layer
│   ├── Icon
│   └── Label Text
```

M3는 "Container"를 쓰지만, **컴포넌트의 최외곽 1개에만** 사용한다. `Main Content Container`처럼 쌓지 않는다.

---

## 3. 왜 구조적 접미사(Container/Wrapper)를 안 쓰는가

### 3-1. React 생태계에서 퇴출됨

Dan Abramov 본인이 Container/Presentational 패턴을 **철회**:
> "I don't suggest splitting your components like this anymore"

Hooks 이후 Container 접미사는 레거시로 분류됨.
> 소스: patterns.dev (A)

### 3-2. Tailwind `container` 클래스와 충돌

```jsx
// AI가 "Container Header" 레이어를 보면:
<div className="container header">  // ← max-width 유틸리티 적용됨!

// "Header"만 보면:
<header>  // ← 시맨틱 HTML 직매핑
```

> 소스: Figma MCP Server Guide (A)

### 3-3. AI 코드 생성에서 오역 리스크

Figma MCP는 레이어명을 **semantic hint**로 AI에 전달:
- `Header` → AI가 `<header>` 시맨틱 태그로 변환
- `Container Header` → AI가 `<div className="container-header">` 래퍼로 변환

> 소스: Figma MCP Tools & Prompts (A), Anima Docs (A)

### 3-4. 정보 중복

```
Figma 레이어 패널:
  ChallengeProgress Screen     ← 이미 트리가 계층을 보여줌
    └── Main Content            ← "이 안에 뭐가 있지?" → Content
        └── Feed Section        ← "어떤 콘텐츠?" → Feed

  vs.

    └── Main Content Container  ← "Container"가 말해주는 새 정보 = 0
```

---

## 4. TDS 적용 권장 패턴

### 네이밍 공식

```
[컨텍스트] + [시맨틱 역할]
```

- **컨텍스트**: 어떤 도메인/섹션인지 (Main, Challenge, Feed, Auth...)
- **시맨틱 역할**: HTML/React에서 어떤 역할인지 (Content, Header, Footer, Section, Area...)

### 허용 어휘 (shadcn + Radix + M3 교집합)

| 역할 | 허용 이름 | 비허용 | 매핑 |
|------|----------|--------|------|
| 스크린 최상위 | `Xxx Screen` | | 페이지 컴포넌트 |
| 메인 본문 | `Main Content` | ~~Main Container~~ | `<main>` |
| 상단 영역 | `Header` / `Xxx Header` | ~~Header Container~~ | `<header>` |
| 하단 영역 | `Footer` / `Xxx Footer` | ~~Footer Wrapper~~ | `<footer>` |
| 콘텐츠 섹션 | `Xxx Section` | ~~Section Container~~ | `<section>` |
| 사이드 영역 | `Sidebar` / `Xxx Aside` | ~~Side Container~~ | `<aside>` |
| 스크롤 영역 | `Scroll Area` | ~~Scroll Container~~ | `ScrollArea` |
| 카드/서랍 묶음 | `Feed Area` / `Card Grid` | ~~Cards Container~~ | layout div |
| 오버레이 | `Drawer` / `Dialog` | ~~Drawer Container~~ | shadcn 컴포넌트 |

### 금지 접미사

| 접미사 | 이유 |
|--------|------|
| **Container** | Tailwind 충돌 + 레거시 패턴 + 정보 중복 |
| **Wrapper** | 시맨틱 없음 ("감싼다"만 말함) |
| **Box** | CSS-in-JS(MUI) 전용, Tailwind 생태계와 무관 |
| **View** | React Native 전용 |

---

## 5. 모순점

| 항목 | 내용 |
|------|------|
| M3의 "Container" 사용 | M3는 최외곽 프레임에 Container를 쓰지만, shadcn/Radix는 쓰지 않음. **TDS는 shadcn 생태계이므로 Radix 어휘를 따르는 것이 정합적.** |

## 6. 미검증 영역

- M3/Carbon/Ant Design Figma 파일의 **실제 레이어 패널** 직접 확인은 미수행 (스펙 문서 기반 추론)
- "Container Header" vs "Header" 입력 시 AI 코드 생성 차이의 A/B 실증 테스트 미수행

## Sources

| # | URL | 유형 | 신뢰도 | 검증 |
|---|-----|------|--------|------|
| 1 | [Figma - Name and organize components](https://help.figma.com/hc/en-us/articles/360038663994) | 공식문서 | A | WebFetch |
| 2 | [Figma MCP Server Guide](https://github.com/figma/mcp-server-guide) | 공식문서 | A | WebFetch |
| 3 | [Figma Code Connect - React](https://developers.figma.com/docs/code-connect/react/) | 공식문서 | A | WebFetch |
| 4 | [Dialog - Radix Primitives](https://www.radix-ui.com/primitives/docs/components/dialog) | 공식문서 | A | WebFetch |
| 5 | [Card - shadcn/ui](https://ui.shadcn.com/docs/components/radix/card) | 공식문서 | A | WebFetch |
| 6 | [Sheet - shadcn/ui](https://ui.shadcn.com/docs/components/radix/sheet) | 공식문서 | A | WebFetch |
| 7 | [Material Web - Buttons](https://material-web.dev/components/button/) | 공식문서 | A | WebFetch |
| 8 | [patterns.dev - Container/Presentational](https://www.patterns.dev/react/presentational-container-pattern/) | 전문레퍼런스 | A | WebFetch |
| 9 | [Nord Design System - Naming](https://nordhealth.design/naming/) | 공식문서 | A | WebFetch |
| 10 | [Anima - Figma Best Practices](https://support.animaapp.com/en/articles/6300035) | 공식문서 | A | WebFetch |
| 11 | [Design for Ducks - Layer Naming](https://designforducks.com/how-to-name-layers-in-figma/) | 전문블로그 | B | WebFetch |
| 12 | [Rootstrap - Figma Naming](https://www.rootstrap.com/blog/mastering-figma-components-best-naming-practices) | 전문블로그 | B | WebFetch |
| 13 | [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react) | 공식가이드 | A | WebFetch |
| 14 | [LogRocket - Wrapper vs Container](https://blog.logrocket.com/wrapper-vs-container-classes-css/) | 전문블로그 | B | WebFetch |

---
*Generated by /research — Deep Research Protocol*
*Confidence: 92% | Sources: 25 | Rounds: 1/3*
