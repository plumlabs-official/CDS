# CDS Figma Node Naming Policy v2.0

> 2026-03-17 | 클린 재작성

## 1. 스코프

| 대상 | 적용 |
|------|------|
| 프로덕트 디자인 화면의 프레임/레이어 | O |
| CDS 라이브러리 컴포넌트 Display Name | O |
| CDS 컴포넌트 내부 파트(anatomy) | O (M3 예외) |
| Figma Variables/Tokens | X (별도 정책) |

## 2. 케이싱

| 대상 | 케이싱 | 예시 |
|------|--------|------|
| 레이어명 | **Title Case 공백** | `Chat Area`, `Feed Section` |
| 컴포넌트 Display Name | **Title Case 공백** | `Alert Dialog`, `Profile Card` |
| Variant Property Key | **camelCase** | `size`, `variant`, `showIcon` |
| Variant Property Value | **Title Case / Pascal Case** | `Default`, `Destructive`, `Small`, `Challenge` |
| Boolean Property | **Title Case 공백 + Show/Is/Has** | `Show Icon`, `Is Active`, `Show Badge` |
| Variant 슬래시 | **Title Case** | `Button/Primary`, `Card/Outline` |

### Figma ↔ 코드 매핑 규칙

> Figma property 네이밍은 디자이너 가독성 우선. 코드 변환은 MCP/AI가 처리.

| Figma (디자이너) | 코드 (React prop) | 변환 규칙 |
|-----------------|-------------------|----------|
| `Show Badge` | `showBadge` | Title Case 공백 → camelCase |
| `Is Active` | `isActive` | 동일 |
| `Size` | `size` | lowercase 유지 |
| `Type` | `type` (또는 `variant`) | lowercase 유지 |
| `Type=Challenge` | `type: "challenge"` | value는 코드 변환 시 lowercase/enum normalize |

## 3. 네이밍 공식

### 프레임/레이어

```
[컨텍스트] [역할]
```

- **컨텍스트**: 도메인/목적 (`Chat`, `Challenge`, `Invite`, `Login`, `Edit Profile`)
- **역할**: HTML/React 시맨틱 (`Header`, `Footer`, `Body`, `Section`, `Form`)
- 동일 역할 1개 → 역할만: `Header`, `Footer`
- 동일 역할 2개+ → 컨텍스트 추가: `Chat Header`, `Profile Header`
- 인스턴스를 감싸는 프레임: `Invite Drawer`, `Confirm Join Card`

### 래퍼 프레임 (역할명으로 안 될 때)

```
1순위: 역할명만 — Header, Footer, Sidebar, Form, Body
2순위: [컨텍스트] Area — Input Area, Bottom Area, Challenge Info Area
예외:  [컨텍스트] Group — Card Group, Avatar Group (동종 반복)
```

### 텍스트 노드

허용: `Title`, `Description`, `Label`, `Subtitle`, `Caption`, `Value`
금지: `Text`, `Card Title Text`

### 이미지 노드

`[컨텍스트] [유형]` — `Hero Image`, `User Avatar`, `Card Thumbnail`
유형: `Image`, `Thumbnail`, `Avatar`, `Banner`, `Icon`, `Illustration`

### 컴포넌트명 (CDS 라이브러리)

```
shadcn 공식명: Alert Dialog, Scroll Area, Toggle Group, Drawer
CDS 커스텀:   Challenge Mission Card, Profile Card
```

## 4. 허용 어휘

| 역할 | 이름 | HTML |
|------|------|------|
| 스크린 최상위 | `Xxx Screen` | 페이지 컴포넌트 |
| 본문 | `Body` | `<main>` |
| 상단 | `Header`, `Xxx Header` | `<header>` |
| 하단 | `Footer`, `Xxx Footer` | `<footer>` |
| 섹션 | `Xxx Section` | `<section>` |
| 사이드 | `Sidebar` | `<aside>` |
| 스크롤 | `Scroll Area` | `<ScrollArea>` |
| 목록 | `Xxx List` | `<ul>` |
| 그리드 | `Xxx Grid` | CSS Grid |
| 네비게이션 | `Navbar`, `Tab Bar` | `<nav>` |
| 입력 | `Xxx Form`, `Xxx Input` | `<form>` |
| 카드 | `Xxx Card` | `<Card>` |
| 래퍼 | `Xxx Area` | `<div>` |
| 동종 묶음 | `Xxx Group` | `<div>` |

## 5. 금지

### 금지 접미사

| 접미사 | 이유 |
|--------|------|
| **Container** | Tailwind `container` 충돌, AI 오역 |
| **Wrapper** | 시맨틱 없음 |
| **Content** (래퍼) | 역할 불명확. `Body`로 대체 |
| **Box** | CSS-in-JS 전용 |
| **View** | React Native 전용 |
| **Div** | 구현 상세 |

### 금지 패턴

| 패턴 | QA 감점 |
|------|---------|
| 자동 생성명 (`Frame 1234`, `Group 1`) | -5 |
| 특수문자 (`:`, `↳`) | -5 |
| 하드코딩 데이터 (`Sophie Tan`) | -3 |
| 레이어명 슬래시 (`Header/Nav`) | -5 |
| 금지 접미사 | -10 |
| 접미사 중복 (`Area Area`) | -10 |
| CTA (마케팅 용어, AI가 hero 섹션으로 오역) | -5 |

## 6. 슬래시

```
슬래시 = Variant 계층 전용

O  Button/Primary
X  Header/Nav        ← 레이어명에 슬래시 금지
```

State는 property로 관리:
```
O  Button/Primary + state: hover
X  Button/Primary/Hover
```

## 7. 아이콘

```
Lucide 컴포넌트 인스턴스 필수
이름 = Lucide 공식명 Title Case (Chevron Right, Arrow Left)

X  인라인 SVG
X  아이콘 세트 혼용 (Lucide 외)
```

## 8. 예외

| 예외 | 조건 |
|------|------|
| M3 "Container" | CDS 컴포넌트 anatomy 내부 최외곽 파트 |
| `.` `_` 접두어 | 퍼블리시 제외 (Figma 공식) |

## 9. Before → After

| Before | After | 이유 |
|--------|-------|------|
| `Container Header` | `Header` | 역할명 (1순위) |
| `Container Chat` | `Chat Area` | Area (2순위) |
| `Container Navbar` | `Navbar` | 래퍼 불필요 |
| `Container CTA` | `Button Area` | CTA 금지 + Area |
| `Chat Content` (래퍼) | `Chat Area` | Content 래퍼 금지 |
| `Main Content` | `Body` | Content 제거, Body = `<main>` |
| `List Message` | `Message List` | [컨텍스트] [역할] 순서 |
| `AlertDialog` | `Alert Dialog` | Title Case 공백 |
| `Sheet` | `Drawer` | shadcn 공식명 |
| `Show Icon` (property) | `showIcon` | camelCase |

---
*CDS Figma Node Naming Policy v2.0*
