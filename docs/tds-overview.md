# TDS (Tryve Design System) Overview

## What is TDS

Tryve 앱의 디자인 시스템. shadcn/ui Figma Kit(Shadcraft Pro)를 베이스로 Tryve 브랜드 토큰을 입힌 구조.
바이브코딩(AI 코드 생성)에 최적화된 컴포넌트 네이밍과 프로퍼티 설계를 지향한다.

## Architecture

```
TDS
├── Foundation (Variables)
│   ├── Primitives Collection — 원시 값 (244개)
│   │   ├── Colors (primary, secondary, destructive, ...)
│   │   ├── Spacing (4px grid)
│   │   └── Radius (8px 기본)
│   └── Theme Collection — 시맨틱 alias (123개)
│       ├── Light mode (현재 사용)
│       └── Dark mode (예정)
│
├── Components
│   ├── Primitives — 단일 책임 컴포넌트 (atom~molecule)
│   │   ├── Button (7 Type × 6 State × 6 Size)
│   │   ├── Avatar (Image/Fallback × 11 sizes)
│   │   ├── Badge, Input Group, Select, Field
│   │   ├── Tabs (Section/Toggle/Tag)
│   │   ├── Switch, Separator, Progress, Tooltip
│   │   ├── Alert, Alert Dialog, Card
│   │   ├── Icon Scaler, Notification Badge
│   │   └── Profile Card, Page Indicator
│   │
│   └── Composed — 프리미티브 조합 컴포넌트 (organism)
│       ├── Navbar (AppBar: 3 Types + Status 배지)
│       ├── Content Header (Slot 확장)
│       ├── TabBar (5 variant: Home/Feed/Make/Task/Profile)
│       ├── ChallengeCard (State=Ready, 서브컴포넌트 4개)
│       ├── Challenge List Card (Boolean 6개)
│       ├── Challenge Mini Card (164×218, gradient)
│       ├── Participant Card (State × Self × Scale = 15v)
│       └── Avatar Stack, Avatar Group
│
├── Utilities — Figma 전용 헬퍼
│   ├── Icon Scale (아이콘 사이즈+스트로크 프리셋)
│   └── Typography (텍스트 스타일 프리셋)
│
└── OS/Native — 플랫폼 고정 요소
    ├── iOS StatusBar (Light/Dark)
    ├── iOS HomeIndicator (Light/Dark)
    └── Keyboard (Text/Number)
```

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #00CC61 | CTA 버튼, 강조, 성공 |
| `secondary` | #EFF5FD | 카드 배경, 탭 pill |
| `destructive` | #F33939 | 에러, 위험 |
| `warning` | #FF6600 | 경고 |
| `muted` | #D3D8DC | 배경, disabled |
| `muted-foreground` | #797979 | 서브 텍스트 |
| `foreground` | #1A1A1A | 소프트 블랙 (본문) |
| `background` | #FFFFFF | 페이지 배경 |
| `primary-dark` | #01A54F | 그래디언트 스탑용 |

### Typography

| Style | Font | Weight | Size | shadcn 매핑 |
|-------|------|--------|------|------------|
| text-xs | Pretendard | 400 | 12px | `text-xs` |
| text-sm | Pretendard | 400/600 | 14px | `text-sm` |
| text-base | Pretendard | 400/600 | 16px | `text-base` |
| text-lg | Pretendard | 600 | 18px | `text-lg` |
| text-xl | Pretendard | 600 | 20px | `text-xl` |
| text-2xl | Pretendard | 600 | 24px | `text-2xl` |

- 헤더/타이틀: SemiBold (600)
- 본문/설명: Regular (400)
- line-height 컨벤션: `leading-normal` (1.43), `leading-none` (1.0, 버튼 등 고정 높이)

### Effects

| Style | CSS |
|-------|-----|
| shadows/sm | `0px 1px 2px -1px rgba(0,33,153,0.2)` |
| shadows/md | ... |
| shadows/lg | ... |
| shadows/2xl | `0px 0px 20px 0px rgba(0,33,153,0.2)` |
| focus/default | focus ring |

## Key Components

### Button

| Property | Values |
|----------|--------|
| Type | Default, Secondary, Destructive, Outline, Ghost, Link, Inverted |
| State | Enabled, Hover, Pressed, Focused, Disabled, Loading |
| Size | Small(32), Default(36), Large(56 pill), Icon(36), Icon Small(28), Icon Large(44) |

```tsx
<Button type="default" size="lg">자세히 보기</Button>
```

### Avatar

| Property | Values |
|----------|--------|
| Type | Image, Fallback |
| Size | 2X Small(20) ~ 2X Large(96), 11단계 |

### Tabs

| Variant | Usage |
|---------|-------|
| Section (구 Primary) | 페이지 상단 탭 |
| Toggle (구 Secondary) | 인라인 토글 |
| Tag | 필터 태그 |

## Naming Conventions

### shadcn 1:1 매핑 원칙

TDS 컴포넌트 이름은 shadcn/ui와 1:1로 매핑되어야 한다.
바이브코딩 AI가 `<Button>`, `<Avatar>`, `<Card>` 등으로 코드를 생성할 때 정확히 매칭되도록.

### Figma 레이어 네이밍

- **인스턴스 레이어명은 원본 유지** — `Button`을 `Button/SendAuth`로 바꾸지 않음
- **맥락은 부모 프레임 이름으로** — `CTA Section > Button`
- **Text, Layout, Content 같은 제네릭 이름 금지** — 역할을 나타내는 이름 사용
- **콜론(:) 금지** — 코드 파서에서 프로퍼티 구분자와 충돌
- **Boolean prop에 Show 접두사 권장** — `Show Video Button`, `Show Rating`

### 아이콘

- **Lucide Icons 표준** — lucide-react와 1:1 매핑
- Huge Icons, Phosphor, Remix 등은 Lucide 대응 아이콘으로 교체 대상

## Figma Structure

### Pages

| Page | Content |
|------|---------|
| Components | Primitives + Composed 컴포넌트 원본 |
| Icons | Lucide Icons 로컬 컴포넌트 |
| Docs | Color/Typography/Effect 쇼케이스 (자동 생성) |
| OS/Native | iOS StatusBar, HomeIndicator, Keyboard |

### Figma Files

| File | Key | Role |
|------|-----|------|
| TDS (Library) | `H36eNEd6o7ZTv4R7VcyLf2` | 디자인 시스템 원본 |
| App (Product) | `DxrzwmdzqAi4m4F0pp83gd` | 프로덕트 디자인 |
| Shadcn Kit (Source) | `aqyiOYPHsMCrWKPhkehP0g` | 마이그레이션 소스 |

## Vibe Coding Mapping

TDS는 shadcn/ui 기반이므로, AI가 코드를 생성할 때 다음 매핑을 따른다:

```
Figma Component    →  React Component    →  shadcn/ui
─────────────────────────────────────────────────────
Button             →  <Button>           →  components/ui/button
Avatar             →  <Avatar>           →  components/ui/avatar
Card               →  <Card>             →  components/ui/card
Tabs (Section)     →  <Tabs>             →  components/ui/tabs
Input Group        →  <Input>            →  components/ui/input
Badge              →  <Badge>            →  components/ui/badge
Tooltip            →  <Tooltip>          →  components/ui/tooltip
Alert Dialog       →  <AlertDialog>      →  components/ui/alert-dialog
Progress           →  <Progress>         →  components/ui/progress
Switch             →  <Switch>           →  components/ui/switch
Separator          →  <Separator>        →  components/ui/separator
```

### Variant → Props 매핑

```
Figma Variant Property  →  React Prop
────────────────────────────────────
Type=Default            →  variant="default"
State=Enabled           →  (default, no prop)
Size=Large              →  size="lg"
Boolean: Show Rating    →  showRating={true}
Text: Title             →  title="..."
Instance Swap: Icon     →  icon={<LucideIcon />}
```

## Current Status

- Phase 5 (Components) 진행 중
- Library Published (17,505 items)
- 챌린지 카드 4종 바이브코딩 수정 33건 대기 중
- Dark mode 미적용 (향후 일괄)
