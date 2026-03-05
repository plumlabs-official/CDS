# Naming Rules - 네이밍 규칙 가이드

> 이 문서는 AI 네이밍 에이전트와 개발자가 **반드시 준수해야 하는** 네이밍 규칙을 정의합니다.
>
> Last updated: 2026-03-04 | v3.0.0
>
> **2026-03-04 개편**: Figma 컴포넌트 시맨틱 동기화 (Shape 계층 제거, Intent 단순화)

---

## 네이밍 형식

### 일반 컴포넌트
```
Type/Context[/State][/Icon]
```

### 버튼 (상세 구조)
```
Button/Intent/Scale/Color[/State][/Icon]
```

---

## 버튼 네이밍 상세

### 속성 정의

| 속성 | 필수 | 값 | 설명 |
|------|------|-----|------|
| Intent | ✅ | Primary, Secondary, Ghost | 의미/중요도 |
| Scale | ✅ | 32, 44, 48, 56 | 높이 (px) |
| Color | ❌ | Green, White, Transparent | 기본값 Green. Ghost는 Transparent 고정 |
| State | ❌ | Disabled, Loading | 기본(Normal)이면 생략 |
| Icon | ❌ | IconLeft, IconRight | 아이콘 있을 때만 |

### 예시
```
Button/Primary/56/Green               # 주요 CTA (초록 배경)
Button/Primary/48/White               # 주요 행동 (흰 배경, 컬러 배경 위)
Button/Secondary/56/White             # 보조 행동 (테두리)
Button/Ghost/32/Transparent           # 텍스트 링크
Button/Primary/56/Green/Disabled      # 비활성
Button/Primary/48/Green/Loading       # 로딩 중
Button/Secondary/44/White/IconLeft    # 왼쪽 아이콘
Button/Primary/56/White/IconRight     # 오른쪽 아이콘
```

### Intent 판단 기준

| Intent | 의미 | 시각적 특징 | 사용 예 |
|--------|------|------------|--------|
| Primary | 주요 행동 | 배경색 채워짐 (Green/White) | 확인, 저장, 시작하기 |
| Secondary | 보조 행동 | 테두리만 (Outlined) | 취소, 뒤로, 옵셔널 |
| Ghost | 텍스트 링크 | 배경/테두리 없음, 밑줄 | 기존 회원 안내, 부가 링크 |

### Color 판단 기준

| Color | 시각적 특징 | 사용 조건 |
|-------|------------|----------|
| Green | 초록 배경, 흰 텍스트 | 밝은 배경 위 Primary (기본값) |
| White | 흰 배경, 검정 텍스트 또는 테두리 | 컬러 배경 위 버튼 |
| Transparent | 배경 없음 | **Ghost 전용 (자동 적용)** |

**규칙:** Ghost Intent 선택 시 Color는 Transparent로 고정됨 (명시 불필요)

### Scale 판단 기준

| Scale | 높이 | 사용 |
|-------|------|------|
| 32 | 32px | 작은 버튼, 인라인 |
| 44 | 44px | 일반 버튼 |
| 48 | 48px | 중요 버튼 |
| 56 | 56px | 큰 CTA 버튼 |

---

## 일반 컴포넌트 네이밍

### 허용된 컴포넌트 타입

| 카테고리 | 타입 |
|---------|------|
| 최상위 | Screen |
| 구조 | TopBar, TabBar, Section, Container |
| UI | Card, Input, Avatar, Icon, Image, ListItem, TabItem, Badge, Tag, Header |
| 피드백 | Toast, Modal, Snackbar, Overlay |
| 로딩 | Skeleton, Spinner |
| 기타 | Toggle, Checkbox, ProgressBar, Timer, HomeIndicator, Frame |

### Context 예시

| 타입 | Context 예시 |
|------|-------------|
| Card/Section | Profile, Product, Feed, Challenge, Stats, Banner |
| Container | ButtonArea, IconGroup, ActionBar, InfoSection |
| Image | Avatar, Banner, Product, Thumbnail, Background, Logo |
| Icon | Close, Back, Share, Like, More, Search, Settings |
| ListItem | Challenge, Feed, Product, User, Setting, Rank |

### 예시
```
Card/Profile
Section/Challenge
Container/ButtonArea
Icon/Search
ListItem/Feed
Image/Avatar
Screen/Home
TopBar/Main
TabBar/Main
```

---

## State (상태) 규칙

### 허용된 UI 상태
| State | 설명 | 적용 컴포넌트 |
|-------|------|--------------|
| Disabled | 비활성 | Button, Input, Toggle |
| Loading | 로딩 중 | Button, Card, Section |
| Focus | 포커스 | Input, Button |
| Pressed | 눌린 상태 | Button, TabItem |
| Hover | 마우스 오버 | Button, Card |

### 금지된 비즈니스 상태
```
Authenticated ❌
Unauthenticated ❌
Empty ❌
Active ❌
Success ❌ (비즈니스 상태)
```

---

## 절대 금지 사항 🚫

### 1. Layout 타입 금지
```
Layout/Main ❌ → TopBar/Main 또는 Section/Main ✅
Layout/BottomBar ❌ → TabBar/Main ✅
```

### 2. Content 사용 금지
```
Content ❌ → Container/[역할] ✅
Content/Main ❌ → Section/Main ✅
```

### 3. 모호한 이름 금지
```
Inner ❌
Item ❌
Wrapper ❌
Box ❌
```

### 4. 넘버링 금지
```
Content_1 ❌
Frame_123 ❌
Item_3 ❌
```

### 5. (폐기) ~~Purpose 필수~~
- 기존: `Button/CTA/Primary` 형식의 Purpose 필수
- 변경: Button은 Intent/Shape/Size 구조 사용
- 일반 컴포넌트는 Type/Context 형식

---

## Section vs Card vs ListItem

| 타입 | 역할 | 사용 시점 |
|------|------|----------|
| **Section** | 여러 아이템 **그룹화** | 목록 전체를 감싸는 영역 |
| **Card** | **독립적인 정보 단위** | 개별 카드 아이템 |
| **ListItem** | **리스트 내 개별 행** | 리스트형 항목 |

```
Section/Challenge (컨테이너)
├── Card/Challenge (개별 1)
├── Card/Challenge (개별 2)
└── Card/Challenge (개별 3)
```

---

## 검증 체크리스트

### 버튼
- [ ] Intent가 유효한 값인가? (Primary, Secondary, Ghost)
- [ ] Scale이 유효한 값인가? (32, 44, 48, 56)
- [ ] Color가 유효한 값인가? (Green, White, Transparent)
- [ ] State가 UI 상태인가? (Disabled, Loading)

### 일반 컴포넌트
- [ ] Type이 허용된 값인가?
- [ ] Context가 구체적인가? (Inner, Item 등 금지)
- [ ] Layout, Content 사용 안 했는가?

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2025-01-15 | 초기 작성 |
| 2026-01-15 | 구조 개편: Intent/Shape/Size 분리 |
| 2026-01-15 | Purpose/Variant 구조 폐기 |
| 2026-01-15 | 버튼 전용 상세 규칙 추가 |
| 2026-01-15 | Focus 상태 추가, Ghost Shape 추가 |
| 2026-03-04 | **v3.0**: Figma 컴포넌트 동기화 — Shape 계층 제거, Ghost→Intent 승격, Color 필수화 |

---

## 관련 문서

| 문서 | 역할 |
|------|------|
| [../MEMORY.md](../MEMORY.md) | 규칙 결정 배경 (WHY) |
| [../lessons_learned.md](../lessons_learned.md) | 네이밍 버그 패턴 |
