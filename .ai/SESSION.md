# Session Memory

> 세션 단기 기억 (compact 후 이어갈 내용)
>
> Last updated: 2026-03-15

---

## 온보딩 Figma 소스 (프로덕트 디자인)

| 플로우 | 파일 키 | 노드 ID | 설명 |
|--------|---------|---------|------|
| 초대링크 온보딩 | `rrnCjPKhK4e69ElSkzMpTp` | `14332-114564` | 초대받은 사람 플로우 |
| 일반 온보딩 | `rrnCjPKhK4e69ElSkzMpTp` | `18603-3277` | 초대하는 사람 플로우 |

---

## ⚠️ 크로스 동기화 점검 (필수)

### 문제 1: 크로스 프로젝트 커밋 누락 (2026-03-11)

TDS 컴포넌트 리뷰를 lenny 프로젝트에서 `/team`으로 실행하면, **lenny에만 커밋/푸시**되고 TDS SESSION.md 변경은 커밋 누락.

### 문제 2: 크로스 로컬 동기화 누락 (2026-03-13)

다른 로컬 머신에서 TDS Figma 작업 + claude-center에만 기록 → TDS SESSION.md 미반영 상태로 커밋/푸시. 이 로컬에서 `/tds` 재개 시 3-13 작업분 누락 발견.

### 세션 시작 시 점검 절차

1. `git pull` 후 **`claude-center/.ai/SESSION.md`도 확인** — TDS 관련 기록이 있으면 이쪽에 반영
2. `git log`와 SESSION.md `Last updated` 날짜 비교 — 날짜 갭이 있으면 다른 로컬 작업분 누락 의심
3. Figma 작업은 git에 안 남으므로, claude-center SESSION.md가 유일한 출처일 수 있음

### 세션 종료 시 필수

- TDS 작업을 했으면 **TDS SESSION.md 업데이트 + 커밋/푸시** (어떤 프로젝트에서 실행했든)
- claude-center에만 기록하고 끝내지 말 것

---

## 현재 세션 (2026-03-15)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| Content Header Slot에 Auto Layout 추가 | Hug/Hug 설정, Padding 0/Gap 0 |
| 챌린지 카드 하단 구조 결정 | Content Header 대신 카드 내부에서 서브타이틀+타이틀+버튼 직접 구성 (수직 구조이므로) |
| Challenge State Card 내 Content Header 사용 적절성 확인 | 수평 구조 일치, 패딩 24→12 오버라이드는 토큰 범위 내. 적절 |
| Lucide 아이콘 통일 보류 | 마지막에 일괄 처리 결정 |

### 다음 할 일

| 순서 | 작업 | 비고 |
|------|------|------|
| 1 | **하단 탭바** 컴포넌트 제작 | |
| 2 | **9:16 카드** 컴포넌트 제작 | |
| 3 | **챌린지 리스트 + 상세페이지** 컴포넌트 제작 | |
| 4 | **아코디언 + 리스트** 컴포넌트 제작 | |
| 5 | **챌린지 인증 카드** 컴포넌트 제작 | |
| 마지막 | Lucide 아이콘 일괄 통일 | |

---

## 이전 세션 (2026-03-13)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| 바이브코딩 매핑 이슈 파악 (/team) | Figma→코드 3계층 매핑 문제 분석, 매니페스트 필요성 합의 |
| TDS Menubar 바이브코딩 적합성 리뷰 (/team) | rename→Tabs 매핑 가능, Menubar 베이스 부적합 판정 |
| Evidence-First 프로토콜 v2 (/director) | CLAUDE.md GATE 교체 + Memory 업데이트 |
| TabsList Tag 컴포넌트 TDS 편입 (사용자 직접) | Type=Fixed/Hug + TabsTrigger Tag + Tabs Addon Inline Icon |
| Alert 컴포넌트 생성 (사용자 직접) | 3 variant, 3-section, Description Boolean |
| Tabs 네이밍 정리 (사용자 직접) | Primary→Section, Secondary→Toggle, 신규 Tag 추가 |
| Button Group 삭제 (사용자 직접) | 사용처 없음 |
| Figma Slots 리서치 (/research) | 5th property type, single Slot=children 매핑 OK, multiple Slots=Code Connect 필요 |
| shadcn blocks 리서치 (/research) | blocks=페이지 수준 섹션 템플릿(27개, 4카테고리). AppBar/Modal Header는 Composed |
| TDS 컴포넌트 분류/네이밍 전수 점검 (/team) | shadcn 바이브코딩 매핑 관점 리뷰. 10개 리네이밍 + Card/Sheet 분리 |
| 섹션 리네이밍: Composes → Composed | shadcn 계층 용어 통일 |
| AppBar → Navbar 리네이밍 | shadcn/Tailwind 핏 (MUI 용어 탈피) |
| Modal Header → Header 프레임 통합 | Dialog Header + Content Header 2종 통합 |
| Card/Sheet 분리 | Card COMPONENT_SET 독립 + Sheet COMPONENT_SET 분리. Header→Content Header로 이동 |
| Card And Sheet Header/Footer → Header/Footer 중립화 | 바이브코딩 매핑 개선 |
| Status Component → Status 리네이밍 | "Component" 접미사 제거 |
| Field legend → Field Legend 케이싱 수정 | 대문자 통일 |
| Alert Type=Type4 → Detailed 네이밍 | 하단 Slot_Center 포함 변형 |
| Alert Detailed 적용 검증 | ConfirmJoin Sheet에서 Alert+Status 통합 확인 |
| Icon Scale 유틸리티 컴포넌트 (사용자 직접) | Figma-native 아이콘 사이즈+스트로크 프리셋 |
| Typography 유틸리티 컴포넌트 (사용자 직접) | Figma-native 텍스트 스타일 프리셋 (Disclaimer 패턴) |
| Status 컴포넌트 생성 (사용자 직접) | Coin/Streaks × Inline/Floating × Button/Info = 6v |
| Avatar Stack → Composed 이동 (사용자 직접) | 다중 Avatar 조합 = Composed |
| shadcn video player 리서치 | 공식 컴포넌트 없음. Challenge Hero = TDS 커스텀 확정 |
| Challenge Card 아키텍처 플래닝 (/team) | Video Container(Primitive) + Challenge Card(Composed, 3v) 구조 합의 → Boolean 컨트롤로 전환 |
| Composer 플러그인 모듈 신규 개발 | `modules/composer.ts` + code.ts 연결 + UI 버튼 3개. 코드리뷰/디자인리뷰 PASS (/director) |
| Challenge Card 사용자 직접 제작 (Figma) | TDS Button+Badge+Content Header 조합. 바이브코딩 핏 A급 (/team 리뷰) |
| Content Header에 Slot 추가 (사용자 직접) | Description Slot 확장 |
| /record 커맨드 개선 (/team) | 세션 기록 모드에서도 커밋+푸시 자동 실행. "커밋 없음" 설계 결함 수정 |
| 온보딩 화면 네이밍 리뷰 (/team) | 78→90점. Container/ 일관성 우수, 브랜드명/Text prefix 수정, 래퍼 구조 적용 |
| Figma 리서치 3건 (/team) | 네이밍 깊이(인스턴스 내부 안 함), 인스턴스 rename(안전), Group vs Frame(Frame 기본) |
| Figma 인스턴스 오버라이드 리서치 | underline=텍스트 스타일 포함(✓)→바인딩 깨짐. color=미포함(✕)→안전 |
| /research 커맨드 설계 (/coach) | 커맨드 방식 추천. Explore+WebFetch 검증 루프, 95% 신뢰도 Gate |
| Tooltip 컴포넌트 TDS 제작 (혼합) | 5 Style (Default/Primary/Inverted/Warning/Destructive) × 4 Caret (Top/Bottom/Right/Left) = 20v. 토큰 바인딩 완료 |
| Placeholder Logo 컴포넌트 TDS 추가 (사용자 직접) | Type=White/Black × Size=lg/md/sm = 6v |
| `primary-dark` (#01A54F) 변수 추가 | Theme → Mode alias 연결. 그래디언트 스탑용 |
| Gradient Background Color Style 생성 | primary(0%) → primary-dark(100%). 온보딩 배경용 |
| Docs Generator Figma 검증 PASS | Colors + Effects 재생성 정상 확인 |
| Library Publish 완료 | Tooltip + Placeholder Logo + primary-dark + Gradient Background |
| docs: 초대 바텀시트 컴포넌트화 결정 (/team) | 1회 사용 No-go. Bottom Sheet Container만 Phase 3에서 범용 컴포넌트로 |
| docs: Challenge State Card + Content Header 구조 평가 (/team) | Content Header 정당성 확인 (레이아웃 전환+Slot). 아이콘 4종→Lucide 통일 필요. 수정 평가 7/10 |

> 상위 항목 출처: claude-center SESSION.md (다른 로컬에서 작업, TDS SESSION 반영 누락)

### 컴포넌트 마이그레이션 현황

| 컴포넌트 | 상태 |
|----------|------|
| Tooltip | 완료 (20v: 5 Style × 4 Caret position) |
| Placeholder Logo | 완료 (6v: Type=White/Black × Size=lg/md/sm) |
| Alert | 완료 (3 variant, 3-section, Description Boolean) |
| TabsList Tag | 완료 (Type=Fixed/Hug + TabsTrigger Tag + Addon Inline Icon) |
| Tabs | 네이밍 정리 완료 (Primary→Section, Secondary→Toggle, Tag 추가) |
| Button Group | 삭제 (사용처 없음) |

### 다음 할 일

| Phase | 작업 | 비고 |
|-------|------|------|
| 3 | **Bottom Sheet** | 각오, 알림시간 설정 |
| 3 | **Status Alert Bar** | 챌린지 상태 알림 |
| 4 | **Challenge Card / Hero** | TDS 프리미티브 조합 제작 중. Boolean 컨트롤 적용 예정 |
| 4 | **인증 카드 (Auth Post)** | 커스텀 제작 |
| 4 | **Invite Banner** | 초대 배너 |
| 4 | **Day Calendar Row** | 일차별 표시 |
| 4 | **Feed Item / Post Card** | 인증 피드 |
| 5 | Accordion, Tab Bar, Time Picker, Badge | 시간 되면 |

---

## 이전 세션 (2026-03-11)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| 온보딩 UX 컴포넌트 플래닝 | Phase 0~5, 27개 컴포넌트 확정 (Team 리뷰 포함) |
| TDS Figma 파일 키 기록 | `H36eNEd6o7ZTv4R7VcyLf2` |
| Button Type=Inverted 추가 완료 | 6 State × 3 Size = 18 variant. 컬러 배경 위 흰 버튼 |
| Button font size 조정 결정 | TDS Text Style 기준 적용 (e.g. Large 20px→18px) |
| Button 기존(20046:203) vs TDS(20012:238) 비교 완료 | 빠진 것 없음 확인. h48 제거, Intent/Color → Inverted로 커버 |
| Input 3종 TDS 복사 완료 | Input Group + Input OTP + 서브 컴포넌트셋. Input 단독은 삭제 (Input Group이 상위 호환) |
| Input Group 구조 설계 (Team 회의) | Variant=Default/Bare 프로퍼티 추가 결정. Phone은 Addon 조합. Validation은 Addon Block |
| Remove Drop Shadow focus 버그 수정 | focus/ Effect Style 보존 로직 추가 (focus ring도 DROP_SHADOW 타입) |
| Figma MCP 글로벌 등록 | `~/.mcp.json` 생성. `figma-developer-mcp` + PAT 설정. 세션 재시작 후 활성화 |
| Figma MCP 사일런트 거부 진단 + 해결 | 원인: `figma-remote-mcp` OAuth 캐시 충돌. `~/.claude/mcp-needs-auth-cache.json` 삭제로 해결 |
| Figma MCP 해결 검증 완료 | 세션 재시작 후 TDS 파일 정상 조회 확인 (Director QA PASS) |
| Tabs 컴포넌트 추가 (사용자 직접) | Tabs (Type=Certification) + SubTab Addon Inline (Dot/Numb/Count) + TabsTrigger (Active/Inactive) |
| OS/Native 컴포넌트 추가 (사용자 직접) | Keyboard (Text/Number) + iOS/StatusBar (Light/Dark) + iOS/HomeIndicator (Light/Dark) |
| Mobile Header Bar → AppBar 리네이밍 (사용자 직접) | 내부 구조 동일. StatusComponent (Coin/Streaks) 정리 |
| 스크래치 프레임 추가 (사용자 직접) | Frame 1430107481 — Status/Streaks, Badge/Membership, Logo/NavBar, Toggle. 정리 필요 여부 미정 |
| feat: TDS Migrator 컴포넌트 인스턴스 스왑 | 외부 라이브러리 → TDS 로컬 컴포넌트 교체. Components + Icon Library 페이지 스캔. 멱등성 보장 |
| refactor: Swap Icon Sources 삭제 | Migrate에 통합 완료. 버튼 3개로 정리 (Migrate / Bind Icon Colors / Remove Drop Shadow) |
| fix: SF Pro 폰트 스킵 + 에러 로그 개선 | iOS 네이티브(OS/Native) 텍스트 스타일/폰트 바인딩 제외. 에러 상세 출력 추가 |
| Textarea 컴포넌트 검토 → **SKIP 확정** | TDS Input Group에 Type=Textarea 이미 존재 (7 variant). Shadcn Kit Textarea 별도 추가 불필요. /team 검수 효율성 98, 유사도 95 PASS |
| "참여 각오" 입력란 발견 | 온보딩 `18171:6664` (알림시간설정1). "한 마디" = 단일라인 Input으로 대체 가능 |
| Checkbox 컴포넌트 탐색 시작 → **Figma MCP 장애로 중단** | 온보딩 캐시에서 발견: `lets-icons:check-ring-round`, `Toggle` 컴포넌트셋, `초대 선택` 화면 |
| Figma MCP 재발 진단 | `figma-remote-mcp` HTTP 타입 OAuth 토큰 만료 추정. `mcp-needs-auth-cache.json` 이번엔 없음. 세션 재시작 필요 |
| meetings/reviews 파일 lenny에서 이동 | 산출물 분산 정책 — TDS meetings 13개 + reviews 1개 수신 |
| refactor: Migrator 소스 페이지 ID 기반 전환 + SF Pro 스킵 로그 | 페이지 이름 변경에 안전. /team 리뷰 PASS |
| Figma MCP 좀비 프로세스 정리 | 만료 토큰 구 프로세스 kill. 현재 세션 MCP CPU 100% 행 상태 → 세션 재시작 필요 |
| /record 커맨드 세션 기록 모드 추가 | 커밋 없어도 SESSION+HANDOFF 기록 가능. claude-center d8e4e43 |
| statusline effort 풀네임 표시 | E:H → High. macOS BSD sed 호환. claude-center ecb9927 |
| fix: Migrator compMap variant name 충돌 버그 수정 | Select→X버튼 오스왑 방지. 이중 방어 (빌드 + swap). /director PASS |
| Alert Dialog TDS 마이그레이션 (사용자 직접) | Shadcn Kit Alert Dialog 기반. width fill + max-width. Breakpoint 2 variant |
| Field, Select, Textarea, Card TDS 토큰 마이그레이션 (사용자 직접) | Shadcn Kit에서 가져와서 TDS 토큰 바인딩. Hi-Fi 스타일 미적용 |
| Input Group COMPONENT_SET 이름 원복 | InputGroup→Input Group 등. Migrator SET 매칭 정상화 |
| /team: Migrator 소스 페이지 탐색 전략 | 전체 스캔 + exclude 방식 결정. 페이지 분리 시 적용 예정 |
| 온보딩 Figma 소스 경로 기록 | 초대링크(`14332:114564`) + 일반(`18603:3277`) 온보딩 노드 SESSION에 기록 |
| 온보딩 Toast 사용처 전수조사 | 두 플로우 40+ 화면 시각 확인 → Toast 해당 노드 0건 |
| /team: Sonner(Toast) 정체성 재검토 | UX 행동(일시적 자동소멸)이 본질, 레이아웃 아님. Phase 2 보류 결정 |
| /team: TDS 퍼블리시 전략 | Progress+Page Indicator+Avatar 추가 후 즉시 퍼블리시. Molecule은 JIT 추가. RICE 270 |
| Figma: Progress 컴포넌트 TDS 마이그레이션 (사용자 직접) | 12 variant (0%~100%, 10% 단위), width fill, Shadcn Kit 기반 |
| Figma: Page Indicator 컴포넌트 TDS 제작 (사용자 직접) | Dots COMPONENT_SET (State=Active/Inactive × Background=White/Black/Green = 6v) + Page Indicator molecule (row, gap 4px) |
| Figma: Avatar 컴포넌트 TDS 마이그레이션 (혼합) | Shadcn Kit→TDS 복사 + Migrate + Rounded rectangle 삭제. 22v Circle only (Image/Fallback × 11 sizes) |
| Figma: Avatar Stack TDS 포함 (사용자 직접) | 4v (Default/Max Number/Unmasked/Vertical). Avatar Upload 패스 |
| Figma: Avatar Group TDS 포함 (사용자 직접) | 5v (2X Small~Large). 겹침 레이아웃 |
| Tabs Tailwind label mapping 체크 | foreground `#1A1A1A` vs TDS 토큰 `#09090B` 불일치 발견 → TDS 토큰이 Tryve 커스텀값으로 변경됨 확인 |
| TDS Color Docs 전체 점검 | 13개 토큰 중 11개 라벨 불일치 — Shadcn 기본값 텍스트, 실제 변수는 Tryve 값 |
| TDS Effect Docs 점검 | Preview 바인딩 엇갈림 + CSS 라벨 불일치 + EFFECT_ORDER 정렬 고장 |
| fix: Docs Generator 버그 5건 수정 (/director) | 1) 페이지 prefix 매칭 2) 원래 이름 보존 3) Light 모드 우선 탐색 4) Effect 정렬 baseName 기준 5) cross-collection alias resolve. Figma 검증 PASS |
| TDS Library Publish (사용자) | 17,505개 항목 포함. Primitives(244)/Theme(123) + .서브컴포넌트 5개 Hidden 정상 확인 |

### 컴포넌트 마이그레이션 현황

| 컴포넌트 | 상태 |
|----------|------|
| Button | 완료 (7 Type: Default/Secondary/Destructive/Outline/Ghost/Link/Inverted × 6 State × 6 Size = 438 variant) |
| AppBar (구 Mobile Header Bar) | 완료 (3 Types + Boolean 토글). /team PASS (95/95). 아이콘 일괄 통일 후속 |
| Switch | 완료 (Toggle Atom 6v + Switch Molecule 16v). /team PASS (95/95) |
| Separator | 완료 (Horizontal/Vertical 2v). Alert Dialog 버튼 구분 + 섹션 구분 활용 |
| Modal/Header | 완료 (3 variant: Nav+Title+Action, Nav+Title, Title) |
| Tabs | 완료 (Tabs/Primary 3v + Tabs/Secondary 2v + TabsTrigger 2종 + Addon Inline 3v). /team PASS (95/95) |
| OS/Native | 추가됨 (Keyboard + iOS StatusBar + HomeIndicator) |
| Alert Dialog | 완료 (Breakpoint 2 variant, width fill + max-width, TDS Button Large pill) |
| Field | TDS 토큰 바인딩 완료 (Hi-Fi 미적용) |
| Select | TDS 토큰 바인딩 완료 (Hi-Fi 미적용) |
| Textarea | TDS 토큰 바인딩 완료 (Hi-Fi 미적용) |
| Card | TDS 토큰 바인딩 완료 (Hi-Fi 미적용) |
| Progress | 완료 (12v, 0%~100%, width fill, Shadcn Kit 기반) |
| Page Indicator | 완료 (Dots 6v + Page Indicator molecule) |
| Avatar | 완료 (22v Circle only: Image/Fallback × 11 sizes, Rounded rectangle 삭제) |
| Avatar Stack | 완료 (4v: Default/Max Number/Unmasked/Vertical) |
| Avatar Group | 완료 (5v: 2X Small~Large) |
| Tooltip | 완료 (20v: 5 Style × 4 Caret position) |
| Placeholder Logo | 완료 (6v: Type=White/Black × Size=lg/md/sm) |

### 플랜 파일

`.claude/plans/iterative-tickling-sundae.md` — 온보딩 컴포넌트 전체 플랜

### Phase 1 컴포넌트 진행 현황

| 컴포넌트 | 상태 | 비고 |
|----------|------|------|
| Input / TextField | ✅ 완료 | Input Group + Input OTP + 서브 컴포넌트셋 |
| Textarea | ⏭️ SKIP | TDS Input Group의 Type=Textarea로 대체. /team PASS (98/95) |
| **Checkbox** | ✅ 완료 | Shadcn→TDS 마이그레이션 + 초대확인 테스트 적용. /team PASS (95/92) |
| Inline Link Text | ⏭️ SKIP | shadcn 별도 컴포넌트 없음. 약관 링크=`<a>` 스타일링, "자세히"=Button variant=link로 커버 |

### 다음 할 일 (온보딩 컴포넌트 Phase 1~5)

| Phase | 작업 | 비고 |
|-------|------|------|
| 1 | ~~Input / TextField~~ | ✅ 완료 |
| 1 | ~~Textarea~~ | ⏭️ SKIP |
| 1 | ~~Checkbox~~ | ✅ 완료 (/team PASS 95/92) |
| 1 | ~~Inline Link Text~~ | ⏭️ SKIP (shadcn 컴포넌트 없음, `<a>` + Button link로 커버) |
| 2 | ~~Dialog / Alert Dialog~~ | ✅ 완료 (TDS 토큰 바인딩, Hi-Fi 미적용) |
| 2 | ~~Toast (Sonner)~~ | ⏸️ 보류 — 온보딩 내 사용처 미디자인. UX 행동(일시적 자동소멸) 해당 노드 0건. /team PASS |
| 2 | ~~Progress~~ | ✅ 완료 (12v, Shadcn Kit 기반) |
| 2 | ~~Page Indicator~~ | ✅ 완료 (Dots 6v + molecule) |
| 3 | ~~SubTab / Segment~~ | ✅ PASS — Tabs/Secondary로 완료 (95/95) |
| 3 | **Bottom Sheet** | 각오, 알림시간 설정 |
| 3 | ~~Separator~~ | ✅ 완료 |
| 3 | ~~Fixed Button Area~~ | ⏭️ SKIP (Button Size=Large로 커버, 레이아웃 패턴) |
| 3 | **Status Alert Bar** | 챌린지 상태 알림 |
| 4 | ~~Avatar + Stack~~ | ✅ 완료 (Avatar 22v + Stack 4v + Group 5v). Upload 패스 |
| 4 | **Challenge Card / Hero** | 커스텀 제작 |
| 4 | **인증 카드 (Auth Post)** | 커스텀 제작 |
| 4 | **Invite Banner** | 초대 배너 |
| 4 | **Day Calendar Row** | 일차별 표시 |
| 4 | **Feed Item / Post Card** | 인증 피드 |
| 4 | ~~FAB~~ | ❌ 삭제 — 온보딩에 표준 FAB 없음 |
| 4 | ~~Success State~~ | ⏭️ SKIP — 정적 일러스트/에셋 |
| 5 | **Accordion, Tab Bar, Time Picker, Badge** | 시간 되면 |

---

## 이전 세션 (2026-03-09) — 4차

### 완료된 작업

| 작업 | 비고 |
|------|------|
| Figma MCP 토큰 교체 | 만료 토큰(`figd__p_RV...`) → 새 토큰(`figd_CNga...`)으로 교체. user scope 등록 (전역) |
| 토큰 영구 저장 | `~/.zshrc`에 `FIGMA_PERSONAL_ACCESS_TOKEN` 환경변수 추가 |
| Figma MCP 연결 확인 | 정상 작동 확인 (TDS, Shadcn Kit 파일 접근 가능) |
| 아이콘 출처 확인 | Shadcn Kit: Lucide Icons = 로컬 COMPONENT (외부 라이브러리 아님). TDS 복사본도 동일. Huge Icons는 보너스 리소스 |
| TDS Migrator 기능 확장 | QA 수정 3건 + Swap Icon Sources + Bind Icon Colors + fontFamily/fontWeight 바인딩 통합 |
| UI 카테고리 재구성 | Style Migration / Icon / Cleanup 그룹핑, 플러그인명 TDS Migrator로 변경 |
| replace-font-variable 삭제 | TDS Migrator에 통합 완료, 레거시 폴더+참조 제거 |
| 아이콘 독립화 전략 수정 | ~~Huge Icons Detach~~ 불필요 → 이미 독립된 Lucide 벡터 컴포넌트 |
| Figma 플러그인 경로 이슈 | Migrate to TDS 플러그인이 이전 경로(`WDS/`)를 참조 → `TDS/figma-plugins/migrate-to-tds/manifest.json`으로 재등록 필요 |
| Migrate to TDS 플러그인 UI 패널 추가 | Migrate / Remove Button Drop Shadow 버튼 분리. IIFE → UI 메시지 핸들러 구조 리팩토링 |
| Button Drop Shadow 제거 기능 | DROP_SHADOW만 제거, Ghost 타입 제외, 선택 없으면 페이지 전체 대상 |

| TDS Migrator Phase 2 | 컬러 토큰 바인딩 + Effect Style 근사 매칭 + Text Style 근사 매칭 |
| TDS Docs Generator: Effect Showcase + Quick Wins | effectToCSS, makeLabel 최적화, 라벨 접근성 개선 |
| fix: Migrator focus/ Effect 보존 + Docs Generator TDS 변수 바인딩 | Migrator 실행 시 focus/default 유지, Docs 출력물 전체 토큰화 |
| alias resolve 버그 수정 | VARIABLE_ALIAS 시맨틱 토큰(foreground 등) colorToVariable 맵 등록 |
| alpha 채널 구분 | rgba 5% ≠ 100% 정확 구분, custom/ 변수 맵 제외 |
| lineHeight AUTO 처리 | Auto일 때도 fontSize+weight로 Text Style 근사 매칭 |

| Mobile Header Bar 컴포넌트 TDS 변환 시작 | 2026-03-09 |
| ├ Shadcn Kit → TDS 복사 완료 | |
| ├ TDS Migrator 실행 (토큰 바인딩 완료) | |
| ├ Variant 정리: 6개 → 4개 | |
| ├ 리네이밍: Nav / Nav+Label / Nav+Label+Actions / Screen+Actions | |
| ├ 사이즈: 375×60, padding 0 16px | |
| └ Title 스타일: text-lg/leading-normal/semibold (18/28) | |

| 아이콘 사이즈 전략 결정 | 라이브러리 원본 24×24 유지, Button Size=Icon 원본 수정 (36×36, padding 4, 아이콘 fill) |
| resize-icons 플러그인 제작 → 불필요로 삭제 | 컴포넌트 레벨 제어가 정답 |
| Mobile Header Bar 구조 리뷰 (Team Mode) | 아이콘 Lucide 통일, Subtitle 정리, Boolean 프로퍼티 추가 권장 |
| Button Size=Icon 원본 수정 | padding 8→4, 아이콘 fill, 36×36 |
| Status/Streaks 독립 컴포넌트 + Boolean 연결 | Screen+Actions variant에 적용 |
| Modal/Header 컴포넌트 생성 | 3 variant: Nav+Title+Action, Nav+Title (중앙 정렬), Title |
| └ Nav+Title: Title ignore auto layout + Center constraints | 텍스트 길이 자동 조절 |
| Button Size=Large 사양 결정 | h56, padding 12/24, borderRadius 28(pill), fontSize 20, fontWeight 600 |
| └ XL 미추가 결정 | shadcn `lg` 매핑 유지 위해 Large를 CTA 사이즈로 승격 |

### 컴포넌트 마이그레이션 현황

| 컴포넌트 | 상태 |
|----------|------|
| Button | 완료 (Size=Icon 36×36 + Size=Large CTA 56px pill 결정) |
| Mobile Header Bar | 완료 (4 variant + Status/Streaks 배지) |
| Modal/Header | 완료 (3 variant: Nav+Title+Action, Nav+Title, Title) |

### Button Size 매핑 (현재 → 변경)

| Size | Height | Padding | Radius | Font | shadcn 매핑 |
|------|--------|---------|--------|------|------------|
| Small | 32px | 8/12 | 8px | 14/400 | `sm` |
| Default | 36px | 8/16 | 8px | 14/400 | `default` |
| **Large** | **56px** | **12/24** | **28px (pill)** | **20/600** | **`lg`** |
| Icon | 36×36 | 4 | 8px | - | `icon` |
| Icon Small | 28×28 | - | 8px | - | - |
| Icon Large | 44×44 | - | 8px | - | - |

> XL variant 미추가 이유: shadcn buttonVariants에 `xl` 없으면 바이브코딩 AI가 매핑 못 함. Large를 CTA용으로 승격하면 `lg` 매핑 유지.

### Figma 인스턴스 운용 규칙

- **인스턴스 레이어명은 원본 유지** — `Button`을 `Button/SendAuth`로 바꾸지 않음
- **맥락은 부모 프레임 이름으로** — `CTA Section > Button` 구조
- **의미 단위로 부모 프레임 생성** — Auto Layout + gap으로 간격 제어
- **불필요한 래퍼 프레임 금지** — 의미 없는 중첩 = 개발 시 불필요한 div
- **Text Style**: 버튼 등 height 고정 + vertical center인 경우 `leading-none` (line-height: 1) 사용

### 잔여 정리 (완료된 컴포넌트)

| 항목 | 대상 |
|------|------|
| 아이콘 Lucide 통일 | Header Bar + Modal Header의 Huge Icons → Lucide 교체 |
| Subtitle default=false | Header Bar Nav+Label, Nav+Label+Actions |
| Action Boolean 프로퍼티 | Header Bar Right 영역 Action 1/2/3 토글 |

### 다음 할 일

| 순서 | 작업 | 비고 |
|------|------|------|
| 0 | **Button Size=Large 36개 variant 수정** | h56, pill, 20/600 — Figma 작업 |
| 1 | **프로필 컴포넌트** | 다음 마이그레이션 대상 |
| 2 | **나머지 컴포넌트 마이그레이션** | Input, Card, Badge, Field, Separator, Command 등 |
| 3 | **비-TEXT 노드 컬러 바인딩** | Phase 3 — FRAME/RECTANGLE fill 토큰화 |
| 4 | **Library Publish** | TDS 라이브러리 배포 + 참조 테스트 |

---

## 이전 (2026-03-09 — 1차)

### 완료된 작업

| 작업 | 커밋 |
|------|------|
| refactor: WDS→TDS 플러그인 리네이밍 (manifest, 코드 내 함수/변수/주석) | `a15d1df` |
| refactor: packages/figma-plugin/ → figma-plugins/tds/ 폴더 이동 | `a15d1df` |
| refactor: @wellwe → @tryve npm scope 전체 전환 (13개 파일) | `32b17eb` |
| docs: Skill/커맨드 우선 규칙 → CLAUDE.md에 추가 | - |

### 주요 결정

**아이콘 독립화 전략 (Lenny Team 회의):**
- Shadcn Kit의 아이콘은 Huge Icons 라이브러리 인스턴스
- TDS 구조: Icons 페이지(Huge Icons 인스턴스) → 컴포넌트가 Icons 페이지 참조 (2단계 참조)
- **결정: Icons 페이지에서 Huge Icons Detach → TDS 로컬 컴포넌트로 등록**
  - 컴포넌트는 Icons 페이지를 참조하므로 자동 전환
  - 이름은 Lucide 규칙으로 매핑 (프론트엔드 lucide-react와 1:1)
- 미팅 기록: `~/Project/lenny/meetings/2026-03-09_tds-icon-strategy.md`

### 프로젝트 구조 (현재)

```
TDS/
├── packages/
│   ├── common/          (@tryve/common)
│   └── agent-server/    (@tryve/agent-server)
├── figma-plugins/
│   ├── tds/             (@tryve/figma-plugin, 메인 플러그인)
│   └── migrate-to-tds/
└── package.json         (tds, workspaces)
```

### 다음 할 일

1. **Icons 페이지 독립화** — Huge Icons Detach → TDS 컴포넌트 등록 → Lucide 이름 매핑
2. **아이콘 색상 통일** — currentColor / TDS foreground 변수
3. **Button 컴포넌트 마이그레이션 계속** — TDS 토큰 적용
4. **나머지 컴포넌트** — Input, Card, Badge 등
5. **Library Publish**

### 남은 레거시

- 파일명 3개: `wellwe-simplification-schedule.*`, WDS PDF — 과거 산출물 (선택 정리)
- 히스토리 파일 (HANDOFF, SESSION, CHANGELOG) — 의도적 보존

---

## 이전 세션 (2026-03-06)

### 진행 중: TDS 재구축 Phase 5 - Components

**목표:** Shadcraft Kit 컴포넌트 → TDS 토큰으로 마이그레이션

**Phase 체크리스트:**
- [x] Phase 0: Inventory ✅
- [x] Phase 1: Archive & Reset ✅
- [x] Phase 2: Variables ✅
- [x] Phase 3: Typography ✅
- [x] Phase 4: Effects ✅ (Import 완료)
- [ ] **Phase 5: Components** ← 진행 중
- [ ] Phase 6: Publish & Test

### 완료된 작업

**1. Migrate to TDS 플러그인 개발 ✅**

경로: `figma-plugins/migrate-to-tds/`

| 대상 | 동작 |
|------|------|
| Fill | Mode Collection 변수로 교체 (루트 레벨 우선) |
| Stroke | Mode Collection 변수로 교체 |
| Effect Style | 동일 이름 TDS Effect Style로 교체 (setEffectStyleIdAsync) |
| Text Style | 동일 이름 TDS Text Style로 교체 (setTextStyleIdAsync) |
| custom/* | 스킵 |
| Icon/, Icon | 스킵 (Size=Icon 버튼은 스킵 안 함) |

**2. Button 컴포넌트 테스트 통과 ✅**
- Shadcraft Button Frame → TDS Components 페이지에 복사
- Migrate to TDS 플러그인 실행 → Fill, Effect, Text Style 교체 확인

**3. Lucide Icons 추가 ✅**
- Shadcn-Kit (aqyiOYPHsMCrWKPhkehP0g) 에서 Lucide Icons 복사
- TDS에 붙여넣기 완료
- 아이콘 색상 확인/수정 필요할 수 있음

### 다음 할 일

1. **Button 컴포넌트 전체 마이그레이션** — 플러그인으로 전체 버튼에 TDS 토큰 적용
2. **아이콘 독립화 결정** — 현재 Instance 상태 (Shadcn-Kit → TDS). 옵션:
   - A: Shadcn-Kit 라이브러리 연결해서 사용
   - B: Detach → Component 재생성 (TDS 완전 독립)
3. **아이콘 색상 확인** — currentColor 또는 TDS 변수로 바인딩 필요 여부
4. **나머지 컴포넌트** — Input, Card, Badge 등
5. **Library Publish** — TDS 라이브러리 배포

### 플러그인 사용법

```
1. TDS 파일에서 컴포넌트 선택
2. Plugins > Development > Migrate to TDS 실행
3. 콘솔에서 교체 결과 확인
```

---

### 이전: TDS 재구축 Phase 2-3 완료

**Tryve 색상 매핑 (적용 완료):**
| 변수 | 값 | 용도 |
|------|-----|------|
| primary | #00CC61 | CTA 버튼, 강조 |
| secondary | #EFF5FD | 카드 배경, 탭 pill |
| destructive | #F33939 | 에러, 위험 |
| success | #00CC61 | 성공 (= primary) |
| warning | #FF6600 | 경고 (주황) |
| muted | #D3D8DC | 배경, disabled |
| muted-foreground | #797979 | 서브 description |
| foreground | #1A1A1A | 소프트 블랙 |

**Typography:**
- font-sans: Pretendard (tds) | Geist (shadcn)
- 헤더/타이틀: SemiBold (600)
- 본문/설명: Regular (400)

**다음 할 일:**
1. Phase 4: Effects (선택)
2. Phase 5: Components (Button 등)
3. Dark 모드 색상 (나중에 일괄)
4. Library Publish

---

## 이전 세션 (2026-03-05)

### 완료: shadcn/ui Figma Kit 비교 분석 + 최종 결정
- Tryve 디자인 시스템 도입을 위한 Kit 비교
- 8개 Kit 전체 비교 완료 (무료 5개, 유료 3개)
- 비교표 저장: `docs/shadcn-figma-kit-comparison.md`
- **최종 결정:** Shadcraft Pro $299 구매 + RAVN 보조 활용
- 선택 이유: Tryve 적합 템플릿 다수, Lucide Icons 통합
- Agent: Claude

### 완료: Tryve 디자인 시스템 추천 (Team Mode)
- Design Director, Engineering Lead, Product Leader 참여
- 추천: shadcndesign Basic ($119)
- 미팅 기록: lenny/meetings/2026-03-05_tryve-design-system-recommendation.md
- Agent: Claude

---

## 이전 세션 (2026-03-04)

### 완료: Button 시맨틱 Figma 동기화 + 코드 리뷰
- Figma 버튼 컴포넌트 시맨틱을 React/네이밍 스키마에 반영
- Shape 계층 제거, Ghost를 Intent로 승격
- Button.tsx: Figma 시맨틱 API로 재작성
- naming-schema.md v3.0: Intent/Scale/Color 구조
- AI 프롬프트 업데이트 (naming-single.md, naming-context.md)
- 코드 리뷰 후 a11y 개선 (type="button", aria-busy)
- 리뷰 기록: lenny/reviews/2026-03-04_wds-button-review.md
- Agent: Claude

### 환경 설정 (집 데스크탑)
- `wds` → `WDS` 폴더명 변경 (macOS 대소문자)
- npm install + 빌드 완료
- Agent server 실행 + ANTHROPIC_API_KEY 설정 (~/.zshrc)
- Figma MCP 추가
- Agent: Claude

---

## 이전 세션 (2026-02-23)

### 완료: Button Color Variant + Intent 정비
- Color Variant 슬롯 공식화 (White — 컬러 배경 위 버튼)
- 부모 배경색 감지 로직 추가 (handler.ts → parentBgColor)
- Intent에서 Success 제거, 초록색을 Primary로 통합
- Primary vs Secondary 구분 원칙 스키마/프롬프트에 반영
- UI: "간격 표준화" 버튼 전처리 섹션으로 이동
- Agent: Claude

---

## 이전 세션 (2026-02-15)

### 완료: AGENTS.md → CONSTITUTION.md rename
- Codex 전용 `~/AGENTS.md`와 혼동 방지
- CLAUDE.md, CONSTITUTION.md 내 참조 업데이트
- Agent: Claude

---

## 이전 세션 (2026-02-13)

### 완료: WellWe TF 간트차트 일정 수정

- 타임라인 → 간트차트 형태로 변경
- 워크샵 일정: 2/25, 3/11, 3/25, 4/8 (2주 간격 수요일)
- 1차: 온보딩 리뷰 + 원데이 정리
- 2~4차: 전주 디벨롭 리뷰 + 새 주제 워크샵

---

## 이전 세션 (2026-02-12)

### 완료: WellWe TF 일정표 2차 리뷰

**Lenny Director 모드** 사용 (Design Director + Product Leader + WellWe Domain Expert)

**수정 내역:**
- 상태 오류 2건 수정 (미완료/부분완료 → 완료)
- 누락 항목 4건 추가 (간소화 주제 e, f, h)
- 비고 보강 1건 (유료 챌린지 전용 라운지)

**회고 도출 개선점 (추후):**
- 4차 세션 부하 분산 (21개 항목)
- 상태 표기 세분화
- 비고 컬럼 정형화

---

### 완료: WellWe 프로덕트 디자인 간소화 TF 일정표

**Lenny Director 모드** 사용 (Design Director + Product Leader + WellWe Domain Expert)

**산출물:**
- `wellwe-simplification-schedule.tsv` - 구글 시트 복붙용
- `wellwe-simplification-schedule.gs` - Apps Script 자동화

**일정:**
| 세션 | 날짜 | 워크샵 항목 |
|------|------|-----------|
| 1차 | 2026-02-27 | 10개 (온보딩/진입) |
| 2차 | 2026-03-13 | 11개 (피드/소셜) |
| 3차 | 2026-03-27 | 9개 (결제/수익화) |
| 4차 | 2026-04-10 | 22개 (마무리/QA) |

---

## 이전 세션 (2026-02-11)

### 완료: 문서 SSOT 통합

`.ai/prompts/auto-layout-responsive.md` 간소화 (112줄 → 23줄)
- 상세 규칙은 `docs/specs/autolayout-rules.md` 링크로 대체
- 체크리스트만 유지

---

## 이전 세션 (2026-02-06)

### 완료: Agent Teams 병렬 작업 테스트

**커밋:** `557665f`

**방법:** Design Director + Engineering Lead가 **동시에** 파일 생성

| Agent | 산출물 |
|-------|--------|
| Design Director | `src/styles/variables.css` (70+ CSS 변수) |
| Engineering Lead | `src/modules/cleanup/utils.ts` (6개 함수) |

---

### 완료: Quick Wins 리팩토링 (Lenny Agent Teams)

**커밋:** `fc611be`

**방법:** Lenny's Product Team Agent Teams 모드로 Design Director + Engineering Lead 병렬 분석

**변경 요약:**
- deprecated `modules/naming.ts` shim 삭제
- `BaseResponse<T>` common으로 통합 (SSOT)
- `SHAPE_TYPES` 상수 통합 (`constants.ts` 신규)
- tsconfig.json ES2022로 통일
- `AGENT_SERVER_URL` 환경변수화 (`config/env.ts` 신규)

**남은 리팩토링 (Medium effort):**
- cleanup.ts 분리 (37,000+ 토큰)
- code.ts 핸들러 분리 (1,800+ 줄)
- CSS Variables 토큰 시스템 (Design)

---

## 이전 세션 (2026-02-05)

### 완료: 네이밍 충돌 안정화 Phase A

**커밋:**
- `fe9fde6` feat: 네이밍 충돌 안정화 - SSOT 정책 적용
- `633c444` fix: P1 충돌 안정화 보완

**핵심 정책:**
1. 충돌 후보 전부 보류 (자동 suffix 금지)
2. 실제 적용 성공 노드만 패턴 저장
3. `naming-patterns.json` 로컬 전용 (git 추적 해제)

**변경 요약:**
- handler.ts: 3개 핸들러 충돌 로직 통일 + 중복 제안 1차 감지
- normalize.ts: `/id` fallback 함수 제거
- ui.html: 충돌 배지 + 패턴 저장 가드 + 상태 초기화
- naming.ts: Content → Body 슬롯 변경 (Codex 기여)

### Phase B (다음)

| 항목 | 설명 | 우선순위 |
|------|------|----------|
| 동시 적용 가능성 개선 | 이름 교환 케이스 과보류 문제 | P1 |
| AI 프롬프트 형제 컨텍스트 | `siblings[]` 필드 추가 | P1 |
| 금지 패턴 저장 가드 | Content, Layout, _ 재검증 | P2 |
| `naming-patterns.seed.json` | 고정 시드 파일 관리 | P2 |

---

## Figma 파일

| 항목 | 값 |
|------|-----|
| **TDS (디자인 시스템)** | https://www.figma.com/design/H36eNEd6o7ZTv4R7VcyLf2/TDS |
| TDS fileKey | `H36eNEd6o7ZTv4R7VcyLf2` |
| **App (앱 디자인)** | https://www.figma.com/design/s4GdImD87fQsWwnRYQVbWV/App?node-id=14451-4060 |
| App fileKey | `s4GdImD87fQsWwnRYQVbWV` |
| **Shadcn Kit (소스)** | `aqyiOYPHsMCrWKPhkehP0g` |
| **온보딩 디자인** | `rrnCjPKhK4e69ElSkzMpTp` |

---

## 완료된 작업 (요약)

| Phase | 버전 | ADR/문서 | 주요 커밋 |
|-------|------|----------|----------|
| 1: 문서 구조 | v2.1.x | [ADR-0002](../docs/architecture/ADRs/ADR-0002-documentation-structure.md) | `edb0cea`, `7003185` |
| 2: 코드 분리 | v2.2-2.3 | [ADR-0003](../docs/architecture/ADRs/ADR-0003-naming-module-split.md) | `3a0735a`, `17f69de` |
| 3: zod 검증 | v2.4.0 | - | `c4c1b5c` |
| 4: 패턴 API | v2.5.0 | - | `ffd41da` |
| 문서화 | - | ADR-0002, ADR-0003 생성 | `4448cc9` |
| /record 커맨드 | - | [record.md](../.claude/commands/record.md) | `3118488` |
| 패턴 HITL 통합 | - | - | `cf3c868` |
| 패턴 저장 순서 변경 | - | - | `4a85087` |
| 버튼 속성 자동 감지 | - | - | `83d86a5` |
| 컴포넌트 속성 확장 | - | - | `7ccf624` |
| 네이밍 테스트 완료 | - | - | `729d8ff` |
| Auto Layout 반응형 전환 | - | autolayout-rules v3.0 | `14c8428` |
| Auto Layout 후처리 + constraints | - | autolayout-rules v3.1 | `fd66107` |

상세: [CHANGELOG.md](../CHANGELOG.md)

---

## 현재 세션 (2026-01-25)

### 환경 변경
- 프로젝트 경로 통합: `~/figma-design-system-automator` 삭제 → iCloud 경로만 사용
- `/wds` 커맨드 경로 업데이트: `~/.claude/commands/wds.md`
- 새 경로: `~/Library/Mobile Documents/com~apple~CloudDocs/Projects/WDS`

---

## 이전 세션 (2026-01-19)

### 완료 (재귀적 반응형 적용 v3.2)

#### 1. 인덱스 매핑 버그 수정
- AI 응답의 인덱스가 재정렬 후 잘못된 노드에 적용되는 버그
- `originalIndexToNode` 매핑으로 해결

#### 2. 재귀적 FILL 적용 (`applyRecursiveFill`)
- Auto Layout 있는 부모 → `layoutSizingHorizontal = 'FILL'`
- Auto Layout 없는 부모 → `constraints.horizontal = 'STRETCH'`
- 최대 깊이 5까지 재귀

#### 3. Safe Zone 패턴 (카드 고정)
- Feed, Grid, Masonry, List 패턴 내부는 STRETCH 안 함
- Card/, Section/Image 패턴은 완전 스킵
- 모바일 퍼스트: 카드는 고정 크기 유지

#### 4. 위치 기반 constraints
- **Button/** → CENTER (가운데 고정)
- **Container/ActionButtons** → MAX (우측)
- **Icon/** 좌측 (x < 30%) → MIN
- **Icon/** 우측 (x > 70%) → MAX
- 위치 기반 체크: 20%/50%/80% 기준

#### 5. Top-level 강제 STRETCH
- AI가 INHERIT 반환해도 80% 이상 전체너비 요소는 강제 STRETCH
- 후처리 안전망 역할

#### 6. AI 프롬프트 개선
- "절대 위치 배치 판단 금지" 명시
- "전체 너비 요소 = 무조건 STRETCH" 강조
- 파일: `packages/agent-server/prompts/autolayout.md`

### 테스트 결과
- ✅ Header/TabBar/SubTab 반응형 동작
- ✅ 피드 카드 고정 크기 (Safe Zone)
- ✅ Button CENTER 정렬
- ⚠️ 일부 내부 요소 정렬 미세 조정 필요

### 참고 샘플
- `14365:1706` - 수동 반응형 샘플 (justify-between 패턴)

### 다음 작업
- [ ] Header 내부 좌우 정렬 미세 조정
- [ ] SubTab 탭 균등 분배 개선
- [ ] 실제 Figma에서 375px → 600px 테스트

---

## 이전 세션 (2026-01-18) - 완료

### 완료
- [x] 레이어 네이밍 타입별 테스트 ✅
- [x] AI Auto Layout 반응형 모드로 교체
- [x] 후처리 안전 규칙 v3.1
- [x] ABSOLUTE 요소 constraints

---

## 이전 세션 (2026-01-17 #3) - 완료

**Phase 4 UI 통합 완료:**

### 완료 항목
- [x] HITL 모달 (적용/AI분석/모두자동적용)
- [x] AI 네이밍 ↔ 패턴 매칭 자동 통합
- [x] 패턴 DB 자동 저장 + 초기화 버튼
- [x] 컴포넌트 속성 확장 (cornerRadius, effects, strokeWidth)
- [x] 버튼 속성 자동 감지 (Intent/Shape/State/Icon)
- [x] layoutPositioning 버그 수정 (Ignore auto-layout 방지)

---

## 비활성화된 기능

- **Deep Flatten** - 구조적 재설계 필요
- **AL 언래핑** - Alignment 속성 손실 문제

---

## 참고

### 빌드 명령어

```bash
npm run build:all    # 통합 빌드
npm run server       # Agent Server (localhost:3001)
```

### 플랜 파일

`.claude/plans/gentle-exploring-quill.md`
