# TDS Figma Node Naming Policy v1.1

> 2026-03-17 /team 2차 토론 반영 (Container 대체 어휘 확정)
> v1.0: 초기 정책. v1.1: Container 금지 논거 재검증 + 대안 어휘 체계 추가

## 1. 스코프

| 대상 | 적용 |
|------|------|
| 프로덕트 디자인 화면의 프레임/레이어 | O |
| TDS 라이브러리 컴포넌트 Display Name | O |
| TDS 컴포넌트 내부 파트(anatomy) | O (M3 예외) |
| Figma Variables/Tokens | X (별도 정책) |

## 2. 케이싱 규칙

| 대상 | 케이싱 | 예시 |
|------|--------|------|
| 레이어명 (프레임, 그룹) | **Title Case 공백** | `Chat Content`, `Feed Section` |
| 컴포넌트 Display Name | **Title Case 공백** | `Alert Dialog`, `Profile Card` |
| Variant Property Key | **camelCase** | `size`, `variant`, `showIcon` |
| Variant Property Value | **lowercase** | `default`, `destructive`, `sm` |
| Boolean Property | **camelCase + show/is/has** | `showIcon`, `showBadge`, `isActive` |
| 컴포넌트 Variant (슬래시) | **Title Case** | `Button/Primary`, `Card/Outline` |

## 3. 네이밍 공식

### 레이어명 (프로덕트 디자인)

```
[컨텍스트] [시맨틱 역할]
```

- 컨텍스트: 도메인/섹션 (`Chat`, `Challenge`, `Auth`, `Feed`, `Profile`)
- 시맨틱 역할: HTML/React 역할 (`Content`, `Header`, `Footer`, `Section`, `Area`, `Grid`)
- 화면 내 동일 역할 1개면 역할만: `Header`, `Footer`, `Sidebar`
- 화면 내 동일 역할 2개+ 면 컨텍스트 추가: `Chat Header`, `Profile Header`

### 텍스트 노드

```
[역할명] — 부모 프레임이 컨텍스트 제공
```

허용: `Title`, `Description`, `Label`, `Subtitle`, `Caption`, `Value`
금지: `Text`, `Card Title Text` (과잉 서술)

### 이미지 노드

```
[컨텍스트] [이미지 유형]
```

유형: `Image`, `Thumbnail`, `Avatar`, `Banner`, `Icon`, `Illustration`
예: `Hero Image`, `Card Thumbnail`, `User Avatar`

### 컴포넌트명 (TDS 라이브러리)

```
shadcn 공식명 (있으면): Alert Dialog, Scroll Area, Toggle Group
TDS 커스텀 (없으면): Challenge Mission Card, Profile Card
```

## 4. 허용 어휘 (시맨틱 역할)

| 역할 | 허용 이름 | HTML 매핑 |
|------|----------|----------|
| 스크린 최상위 | `Xxx Screen` | 페이지 컴포넌트 |
| 메인 본문 | `Main Content` | `<main>` |
| 상단 | `Header`, `Xxx Header` | `<header>` |
| 하단 | `Footer`, `Xxx Footer` | `<footer>` |
| 섹션 | `Xxx Section` | `<section>` |
| 사이드 | `Sidebar`, `Xxx Aside` | `<aside>` |
| 스크롤 영역 | `Scroll Area` | `<ScrollArea>` |
| 목록 | `Xxx List` | `<ul>` / `<ol>` |
| 그리드 | `Xxx Grid` | CSS Grid |
| 네비게이션 | `Navbar`, `Tab Bar` | `<nav>` |
| 입력 영역 | `Xxx Input`, `Xxx Form` | `<form>` |
| 카드/그룹 | `Xxx Card`, `Xxx Group` | `<Card>` / div |

## 5. 금지 어휘

### 금지 접미사

| 접미사 | 이유 |
|--------|------|
| **Container** | Tailwind `container` 유틸리티 충돌 (Anima/bolt 1:1 매핑), AI 코드 생성 오역 리스크, shadcn 59개 컴포넌트 사용 0건 |
| **Wrapper** | 시맨틱 없음 ("감싼다"만 전달) |
| **Box** | CSS-in-JS(MUI) 전용 |
| **View** | React Native 전용 |
| **Div** | 구현 상세, 디자인 의도 아님 |

### Container 대체 어휘 (레이아웃 래퍼가 필요할 때)

| 순위 | 어휘 | 사용 조건 | 예시 |
|------|------|----------|------|
| 1순위 | **[컨텍스트] Content** | 프레임 안의 것들이 "내용물"일 때 (대부분) | `Main Content`, `Chat Content` |
| 2순위 | **[컨텍스트] Area** | 순수 배치/정렬 목적 (콘텐츠라 부르기 어색) | `Action Area`, `Input Area` |
| 3순위 | **[컨텍스트] Group** | 동종 요소 반복 묶음 | `Button Group`, `Card Group` |

판단 기준:
1. "안의 것들이 내용물인가?" → Content
2. "순수 레이아웃 래퍼인가?" → Area
3. "같은 종류 반복인가?" → Group
4. "이 프레임이 정말 필요한가?" → 필요 없으면 삭제

### 금지 패턴

| 패턴 | 이유 | QA 감점 |
|------|------|---------|
| 자동 생성명 (`Text`, `Frame 1234`, `Group 1`) | 시맨틱 없음 | -5/건 |
| 특수문자 (`:`, `↳`) | 코드 파서 충돌 | -5/건 |
| 하드코딩 데이터 (`Sophie Tan`, `5명`) | 재사용 불가 | -3/건 |
| 레이어명에 슬래시 (`Container/Header`) | Variant 구분자 혼동 | -5/건 |
| 금지 접미사 사용 | 위 사유 | -10/건 |

## 6. 슬래시(/) 규칙

```
슬래시 = 컴포넌트 Variant 계층 전용

O  Button/Primary        → Assets에서 Button > Primary
O  Card/Outline           → Assets에서 Card > Outline
X  Container/Header       → 레이어명에 슬래시 금지
X  Main/Content/Area      → 레이어명에 슬래시 금지
```

State(Hover/Focus/Active)는 variant이 아닌 **property**로 관리:
```
O  Button/Primary + state property: hover
X  Button/Primary/Hover (슬래시로 state 분리)
```

## 7. 아이콘 규칙

```
아이콘 = Lucide 컴포넌트 인스턴스 필수
이름 = Lucide 공식명 Title Case (Chevron Right, Arrow Left, Plus)

X  인라인 SVG → 코드 변환 시 해시화
X  Huge Icons / Phosphor / Remix → 혼용 금지
O  Lucide COMPONENT 인스턴스 → <ChevronRight /> 직매핑
```

## 8. 예외

| 예외 | 조건 |
|------|------|
| M3 "Container" | TDS 컴포넌트 anatomy 내부 최외곽 파트에 한해 허용 |
| `.` 또는 `_` 접두어 | 퍼블리시 제외 대상 (Figma 공식 기능) |
| 숨김 서브컴포넌트 | `.내부이름` 패턴 |

## 9. Before → After

| Before (기존) | After (새 정책) | 이유 |
|--------------|-----------------|------|
| `Container Chat` | `Chat Content` | Container→Content (내용물을 담는 영역) |
| `Container Chat Input` | `Chat Input` | Container 불필요 (Input이 역할) |
| `Container Navbar` | `Navbar` | 래퍼 불필요 (인스턴스 직접 배치) |
| `Container Challenge Info` | `Challenge Info` | Container 불필요 (2단어로 충분) |
| `Container Header` (레이아웃 래퍼) | `Header Area` | 순수 레이아웃 래퍼 → Area |
| `List Message` | `Message List` | [컨텍스트] [역할] 순서 |
| `AlertDialog` | `Alert Dialog` | Title Case 공백 |
| `Show Icon` (property) | `showIcon` | camelCase property |
| `Button/Primary/Hover` | `Button/Primary` + state property | State는 property |

## Appendix: Migration from Container-prefix

기존 TDS 화면에서 `Container` 접두어 제거:
1. `Container X` → `X` (접두어 제거만으로 충분한 경우)
2. `Container X` → `X Content` 또는 `X Section` (역할 명시 필요 시)
3. Figma Rename 기능으로 일괄 변환 가능

---
*Established by Lenny's Product Team — Team Mode + Ralph Loop 2R*
