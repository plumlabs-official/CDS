# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Stitch 라운지 홈 → CDS 교체 (Director Mode)** — Stitch가 생성한 `t0SK7XaNqw8qIY3PpZw4s7 / 25577:29746` (390×2664 라운지 콜드 스타트 홈) 복제본 `25679:337` "4 — CDS 교체본" 생성 후 CDS 인스턴스 39종 교체. **Phase 1~12 완료**: 원본 복제 / Navbar Type=FULL + TabsList Toggle Value=2(피드·라운지) + menu·search icons swap / Hero Badge "NEW START" + card·border·foreground·muted-foreground 토큰 바인딩 / Creator Spotlight Avatar XL + Creator Badge Pro + Button×2(Default "라운지 둘러보기" + Secondary "팔로우" with plus) / Explore TabsTrigger Tag×4(전체 Selected=True) + Button Small Default×2 / Trending Avatar XL×4 + Creator Badge Pro×4 / Popular Avatar Medium×2 + Badge "BTS"×2 + Button Icon-Small Ghost arrow×2 + Button Link "더보기" / Challenge Bridge Challenge Mini Card×2 + Button Secondary + arrow-right / BottomNavBar → TabBar Active=Home. **토큰 바인딩**: Hero fill→`card`, stroke→`border`, 14 dark text→`foreground`, 12 muted text→`muted-foreground`, 3 dashed stroke→`border`. **네이밍 정리**: 39 rename (Container/Background/Heading/Margin). **QA Gate 결과**: G1/G3/G5 PASS, G2 8/10 PASS (Profile Card/Lounge Card는 Stitch hero image 중심 구조 불일치로 NA 판정), G4 PARTIAL (3단계 깊이 잔존). **주요 학습**: Navbar Center Slot 기본값에 TabsList Toggle 포함 → Slot setProperties 불가(`Slot component property values cannot be edited`) → variant+TabsTrigger 내부 Title만 조정 / Navigation Button arrow-left → `swapComponent(menuIcon)` / variant 변경 후 자식 노드 재생성되므로 re-query 필수 / Challenge Mini Card 기본 537×713 → layoutSizingHorizontal/Vertical=FIXED + resize 필수 / chip 컨테이너 layoutMode=NONE → HORIZONTAL+gap 변환으로 정렬 복원. 리뷰: `reviews/2026-04-22_stitch-lounge-cds-migration.md`
- exports 문서+활성 .pen tracking (크로스 로컬 동기화)
- **Pencil ↔ Figma Roundtrip Test (Director Mode)** — PRD `cold-start-lounge-home-prd.md` v0.3 기반 라운지 탭 콜드 스타트 홈 합성 테스트. **Phase A 완료**: Pencil cds.pen에 Screen `3F9KM` (Lounge Home Cold) — 6 섹션(§4.1 Hero/§4.2 My Lounge/§4.3 Spotlight/§4.4 Category/§4.6 Popular/§4.8 Bait) + StatusBar + Navbar + TabBar + HomeIndicator. clip:true + AI 이미지 주입(9개) + Pzopm→iXk8R 교체(§4.6). 사용 reusables 20+ 종. **Phase B ~70% 완료** (이어서 새 세션): Figma `t0SK7XaNqw8qIY3PpZw4s7` 새 페이지 `25511:337` + Screen `25511:379` — CDS instance 10종 활용 + 커스텀 composition (Creator Card 6, Mini Preview 2). Unsplash createImageAsync 샌드박스 제약으로 이미지 gradient/color fallback. 다음 세션 재개: Pencil PNG 파일을 Figma 업로드 → imageHash 교체. 리뷰: `reviews/2026-04-21_pencil-figma-roundtrip-test.md`. 백업: `cds.pen.bak-rev20`
- CDS → Pencil **Rev.19 Phase 1-5 전수 정합성 조사 + Critical/Major Fix 완료** — Phase 1 inspect 인프라(cds-components.json 120 + mapping.full.json 155 + inspect-protocol.md). Phase 2 11-batch L1+L2 전수 inspection 100%(PASS ~80, MINOR ~40, MAJOR 12, CRITICAL 3, ACCEPTED ~10). Phase 3 Triage(매트릭스 분류) → triage-report.md. Phase 4: **Critical 3/3 해결** (C1 Dialog Header/C2 Content Header mapping fix로 downgrade, C3 Label ACCEPTED), M1 CT Thumbnail 신규 3종(XS 24/Medium 40/Large 48) + 라벨 변경 2(64→2X Large/128→5X Large), M2 CT Group 5종 재구성(Avatar Group Rev.18 패턴). M3 Tooltip caret/M4 Switch row+label/M5 Drawer/M6 Footer Calendar+Featured Icon Square Medium ACCEPT 명문화. Phase 5 드리프트 모니터 메커니즘 `drift-monitor.md` 문서화(체크 cadence + 자동화 옵션). **155→158 reusables**. Step L 문서화(qa-tickets.md).
- **Team Meeting** CDS/Pencil 전수 정합성 조사 플래닝 (Strategy Session, Simulation 2-Round). Product Leader·Design Director·AI Ops Expert·QA Reviewer 4역할. 누적 6 spec 불일치 사례(Avatar Group/F6A53 라벨/Tooltip 스타일·convention/Segmented Progress 구조/Progress height) 기반 Phase 1-5 Plan 도출: L1+L2 inspection 자동화 → 155 전수 → Triage(Atomic/Molecule/Organism × structural/dim/label) → Critical fix only → Re-verify + drift monitor. 총 7-10h. Round 2 QA PASS 86.7/100(만장일치 95+ 미달, 보완 권고 2건). 기록: `meetings/2026-04-21_pencil-cds-spec-audit-planning.md`, `.ai/qa-inbox/2026-04-21_pencil-cds-spec-audit.md`
- CDS → Pencil **Rev.18 Avatar/Avatar Group Structural 재편** — Rev.17 신규 15종 screenshot 전수 렌더 검증 PASS. KwYkH CDS spec 불일치 발견(4→6 children, gap -8→-12, width→180). F6A53 라벨 교정(Large 56 → X Large). 신규 Avatar 3종(2XS 20/XS 24/Large 48) + Avatar Group 4종(2XS 85×20 gap -7 / XS 94×24 gap -10 / Small 137×32 gap -11 / Large 218×48 gap -14), 각 6 avatars + "+3" indicator. Variant Mapping Strategy 일관(Rev.14-2 패턴). Layer 3 PoC 실행으로 Tooltip 2 diff catch(라벨 convention + style default). Segmented Progress 5c6L1 CDS spec 매칭 재구성(5 단순→3 Segmentation + 4 emotion markers). Progress Fill height 6 교정. **148→155 reusables**.
- CDS → Pencil **Rev.17 Structural Variants Audit (Director+Ralph)** — 빠진 컴포넌트/분리 필요 variants 전수 점검. CDS 102 매핑 누락 0. 10종 multi-variant 분석 후 5종 structural 분리 + 15종 신규 reusable 추가: Tooltip 4방향(caret pointer) + Input Group 3타입(Textarea/Bare/Pill) + Footer 5레이아웃(Two/Full/Stacked/Alarm/Calendar) + Dots 2(Active/Inactive) + Switch Card. Purchase Button/Dialog Header/Notification Badge/Lounge Card는 prop 유지. **133→148 reusables**.
- CDS → Pencil **Rev.16 CDS 원본 그루핑 재편** — 사용자 피드백 "컴포넌트 그루핑 CDS 원본과 동일하게 맞춰줘"에 대응. CDS Figma Components 페이지 구조(Primitives 24 sub-group + Composed 20 sub-group) 그대로 Pencil에 복제. 2 section frame + 44 sub-group frame(label + reusable row) 생성. 133 reusables을 M() 6 batch로 해당 sub-group 이동. Dialog/Drawer→Card and Sheet, Footer→Navbar, Featured Icon→Asset 분류. **133 유지, 시각 구조화 완료**.
- CDS → Pencil **Rev.15 Illust PNG 업그레이드 + Detail Polish** — Illust 8종 lucide placeholder → Figma REST API single-variant PNG 교체(`images/illust/*_v2.png`). Cover Pay Header: calculator icon 제거 + 주황 zap coin + "전체 대신 결제" button. Pro Creator Card: X close + "Creator Name" + users icon "132K" + "+팔로우" + dotted purple border. Rev.12 이전 92종 검토 — Button 228v 등 size/state/theme는 prop 처리 일관성 확인 추가 불필요. **133 유지**.
- CDS → Pencil **Rev.14-2 Size Structural Variants + Visual Polish** — 사용자 피드백 "Participant Card Authed 3 size 누락"에 Coach Variant Mapping Strategy 적용. Size Structural만 별도 reusable, State/Theme는 prop/variable 결정. 신규 6 reusables (Participant Card Authed 4:5/9:16 + Challenge Thumbnail Group XS/S/M/L). Visual polish 4건(arrow-up icon, 6-thumbnail overlap, Mini Card width, Cover Pay Header price). COVERAGE-REPORT에 Variant Mapping Strategy 문서화. **127→133 reusables**.
- CDS → Pencil **Rev.14 Visual Validation + Auto Fix** — Rev.13 추가 34종 Figma↔Pencil 렌더 대조 후 17 visual issues 자동 수정. 공통 원인: fit_content+fill_container 텍스트 세로 wrap, layout 미지정, 빈 image slot, masonry 동일 높이. G() AI 이미지 3, masonry height override 6, width 고정 11, layout 명시 다수. 기존 92종 샘플 8개 정상 확인. **127 reusables 유지, 시각 검증 완료**.
- CDS → Pencil **Rev.13 P2 Structural 26종 + P3 Illust 8종 추가** — Input Group family 5, Participant family 3, TabsList 3, Challenge Card 3, Container 5, 단독 7, Illust 8. **Pencil reusable 93 → 127** (126 CDS + 1 ancillary). **CDS 102종 전체 매칭 100%**. Illust 8종은 lucide placeholder(PNG export 버그 우회), Keyboard는 iOS native 권장.
- CDS → Pencil Rev.12 P2 17종 추가 (Textarea, Tooltip, Breadcrumb, Combobox, Date Picker, Radio Group, Checkbox Group, Content Header, Form Message, Profile Card, Invite Profile Card, Purchase Button, TabBar, TabsTrigger Toggle, Switch Toggle, Breadcrumb Item, Combobox Menu) — Pencil reusable 76 → 92, CDS 커버리지 90.2%
- CDS → Pencil Rev.11 A/B/C 연쇄 Director PASS — Phase 2 3-Layer Diff + P1 15종 추가 + Icon Pipeline (51→76 reusables)
- CDS → Pencil Rev.10 NEW PLAN v2 Phase 0+1 — Discovery (102 CDS, 240 Challify usage) + Coverage Audit + P0 누락 9종 추가 (51→60)
- CDS → Pencil 네이티브 이관 Director 3사이클 PASS (94.6/100) — 27 reusables + 51 variables + 11 screenshots + Home Feed 합성 데모
- 구독 티어 유저 화면 목록 도출 — Team 모드 (Product Leader + Design Director), 7플로우 19화면
- TDS 컴포넌트 정리 — shadcn Kit 잔여물 삭제(Section Heading, Rich Text Heading/Paragraph, Typography 6종) + Slot Holder 단순화(Slot2~6 삭제, Slot1 gap/padding 수정) + Footer 불필요 variant 3종 삭제(Button cloud, Event slots, Pagination)






### Changed
- session record — Lounge Cards 통합, QA, Form Field 생성, 인풋 포맷 점검
- session record — Pro Creator Card 분리 + Team-Director Pipeline 크로스 작업 기록
### Added
- Updates Card TDS 컴포넌트 — 4 variant(State×Expanded) + Thumbnail/Content 슬롯
- /review Phase 3-B Instance Replace + 크로스 스크린 패턴 참고
- /review + /make-component TDS 스킬 생성 — 화면 리뷰 통합 + 컴포넌트 자동 생성
### Changed
- session record — 라운지 리뷰 회의 결정 Figma 반영 플랜
- 프로젝트 비효율 정리 — 106파일 삭제, 문서 누적 제거
### Fixed
- auto-changelog 중복 엔트리 버그 2건 수정
### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
### Added
- Figma MCP 도구 선택 가이드 (`.claude/rules/figma-mcp-tool-guide.md`) — Decision Tree, 20KB 제한 대응 패턴, rate limit 정리
- figma-use Rule 16: use_figma output 20KB 제한 명시 + Pre-flight 체크 추가
- tds-cross-verify 도구 선택 + 분할 스캔 패턴 섹션 추가
- TDS 폰트 IBM Plex Sans KR 전환 — `font/family/font-sans` 변수 Pretendard → IBM Plex Sans KR. MCP use_figma 완전 호환
- 프로덕트 파일 토큰 바인딩 — `setBoundVariable("fontFamily")` 활용, 미바인딩 텍스트 일괄 처리
- 프로덕트 파일 텍스트 스타일 적용 — fontSize 매핑(13→12, 15→14, 17→16, 21→18) + `text-xx/leading-normal` 스타일
- 폰트 마이그레이션 최종 플랜 미팅 기록 (Ralph Loop 3 iterations, 전원 96+)
- Figma MCP Skills — 공식 5개 + 커뮤니티 1개 + TDS 커스텀 3개
### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
- session record — Org Plan 폰트 리서치 + /team Inter전면전환 No-go 결정
- MCP Pretendard 폰트 리서치 (19소스, 94%) + /team 전략 결정: Inter 전면전환 No-go, Pretendard 유지 + Noto Sans KR 중간체
- session record — Phase 3 S1 테스트 + Pretendard 폰트 블로커 + Desktop MCP 추가
- update Figma MCP tool name get_figma_data → get_design_context
- naming-policy v1.2.1 — 피드백 5건 반영: 복수형 제거 + 사용처 [목적]+[타입] 규칙 + 접미사 중복 금지 + 예시 정합성 + Sheet→Drawer + isTDSInstance 에러 방어
- naming-policy v1.2 — Content 래퍼 접미사 폐기 + Area 통일 + 래퍼 우선순위(역할명>Area) + toTitleCase 추가
- Renamer 리팩토링 — 파이프라인 누적 변환 + 역할 중복 방지(Area Area) + ES6 var 통일 + require→import + 레거시 제거
- Renamer v1.1 — 1:1 래퍼 감지+언래핑 + 시맨틱 역할 자동 할당 + PascalCase 변환 수정
- feat: TDS Renamer 모듈 Phase 1 — naming-policy v1.1 기반 자동 리네이밍 (Product Mode + TDS Library Mode). 빌드 성공
- Figma: Tooltip 컴포넌트 TDS 제작 (5 Style × 4 Caret = 20v, 토큰 바인딩 완료)
- Figma: Placeholder Logo 컴포넌트 TDS 추가 (Type=White/Black × Size=lg/md/sm = 6v)
- Figma: `primary-dark` (#01A54F) 변수 추가 (Theme → Mode alias)
- Figma: Gradient Background Color Style 생성 (primary → primary-dark)

### Fixed
- TDS Docs Generator: 버그 5건 수정 — 페이지 prefix 매칭, 이름 보존, Light 모드 우선 탐색, Effect 정렬 baseName 기준, cross-collection alias resolve
- TDS Migrator: compMap variant name 충돌 버그 수정 (Select→X버튼 오스왑 방지, 이중 방어)

### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
- session record — Org Plan 폰트 리서치 + /team Inter전면전환 No-go 결정
- session record — Phase 3 S1 테스트 + Pretendard 폰트 블로커 + Desktop MCP 추가
- update Figma MCP tool name get_figma_data → get_design_context
- docs: TDS 자동 리네이밍 플러그인 설계 — naming-policy v1.1 기반 2모드(Product+Library) + renamer 모듈 구조 확정
- docs: TDS 바이브코딩 QA 시스템 — 네이밍 정책 v1.1 + 루브릭 v1.0 + `/qa` 커맨드 생성
- docs: TDS 채팅 화면 컴포넌트화 플래닝 — shadcn Kit Message 편입 + Phase 0-5 작업 순서 확정 (/team)
- docs: TDS Breadcrumb + Profile Card Challenge variant 매핑 결정 (/team)
- docs: TDS Accordion Slot 패턴 설계 — Slot 1개 vertical AL 채택, Slot2 삭제, hug height (/team)
- docs: 챌린지 진행 화면 TDS 종합 리뷰 (/director) — 디자인 시스템 B, 바이브코딩 B-. P0 3건 (borderRadius 혼용, 터치영역, 색상 대비)
- docs: 챌린지 카드 4종 바이브코딩 적합성 분석 (/team) — 수정 33건 확정 (네이밍 13 + Description 충돌 5 + 프로퍼티 7 + 아이콘 8)
- docs: 챌린지 리스트 카드 구조 결정 — 별개 컴포넌트 분리 + Challenge 패밀리 네이밍 (/team)
- docs: 챌린지 리스트 카드 제작 플랜 리뷰 PASS (/team × 3R, 96/96/96)
- Bottom Tab Bar 구조 리뷰 (/team) — 네이밍 3건 수정 권고 (Tabbar→Tab Bar, variant값 단축, Component prefix 제거) + Badge 통합 방향 확정
- Challenge State Card + Content Header 구조 평가 — Content Header 정당성 확인, 아이콘 Lucide 통일 필요 (/team)
- 초대 바텀시트 컴포넌트화 결정 — 1회 사용이라 No-go, Bottom Sheet Container만 Phase 3에서 범용 컴포넌트로 (/team)
- Toast(Sonner) Phase 2 보류 결정 — 온보딩 내 사용처 미디자인, UX 행동(일시적 자동소멸) 해당 노드 0건 (/team PASS)
- TDS 퍼블리시 전략 확정 — Atom 3개(Progress/Page Indicator/Avatar) 추가 후 조기 퍼블리시, Molecule은 JIT 추가 (/team PASS)
- TDS Migrator: compMap 빌드 시 variant children 제외 + 충돌 경고 로그 추가
- TDS Migrator: traverseAndSwap에서 variant 컴포넌트는 1차 bare name 매칭 스킵, SET 매칭 우선
- Figma: Alert Dialog 컴포넌트 TDS 마이그레이션 (width fill + max-width, Breakpoint 2 variant)
- Figma: Field, Select, Textarea, Card 컴포넌트 TDS 토큰 마이그레이션 (Hi-Fi 미적용)
- TDS Migrator: 소스 페이지 탐색을 문자열 비교에서 페이지 ID 상수 기반으로 전환 (페이지 이름 변경에 안전)
- TDS Migrator: SF Pro 스킵 시 콘솔 로그 추가 (디버깅 사각지대 해소)
- meetings/reviews 파일 lenny에서 TDS로 이동 (산출물 분산 정책)

### Added
- Figma MCP 도구 선택 가이드 + 20KB 제한 대응 체계화
- add Figma MCP Skills — 공식 5개 + 커뮤니티 1개 + TDS 커스텀 3개
- TDS Migrator: 컴포넌트 인스턴스 스왑 기능 (외부 라이브러리 → TDS 로컬 컴포넌트, Components + Icons 페이지 스캔)
- TDS Migrator: 멱등성 보장 (이미 TDS 바인딩된 Effect/Fill/Stroke/Text Style 재처리 방지)
- TDS Migrator: SF Pro 폰트 스킵 (iOS 네이티브 컴포넌트 텍스트 스타일/폰트 바인딩 제외)
- TDS Migrator: 에러 로그 개선 (Infer/Font bind 에러에 styleId, fontName 상세 출력)

### Removed
- TDS Migrator: Swap Icon Sources 버튼 삭제 (Migrate에 통합, 중복 제거)

### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
- session record — Org Plan 폰트 리서치 + /team Inter전면전환 No-go 결정
- session record — Phase 3 S1 테스트 + Pretendard 폰트 블로커 + Desktop MCP 추가
- update Figma MCP tool name get_figma_data → get_design_context
- 온보딩 UX 컴포넌트 플래닝 완료 (Phase 0~5, 27개 컴포넌트)
- TDS Figma 파일 키 SESSION.md에 기록 (H36eNEd6o7ZTv4R7VcyLf2)
- Button Type=Inverted variant 추가 결정 (컬러 배경 위 흰 버튼)

### Fixed
- Figma MCP 사일런트 거부 해결 (figma-remote-mcp OAuth 캐시 충돌 → mcp-needs-auth-cache.json 삭제)
- TDS Migrator: Remove Drop Shadow에서 focus/ Effect Style 보존 (focus ring도 DROP_SHADOW 타입이므로 styleName 체크 추가)
- TDS Migrator: focus/ Effect Style 보존 (focus/default 등 비-shadow 스타일 교체 방지)
- TDS Docs Generator: 모든 fill/stroke에 TDS 변수 바인딩 (Migrator 불필요하도록)
- TDS Docs Generator: Effect 프리뷰 rect stroke 제거 (이펙트에 포함된 것으로 착각 방지)

### Added
- Figma MCP 도구 선택 가이드 + 20KB 제한 대응 체계화
- add Figma MCP Skills — 공식 5개 + 커뮤니티 1개 + TDS 커스텀 3개
- TDS Docs Generator: Effect Showcase 페이지 생성 (effectToCSS 자동 변환, Tailwind 크기순 정렬)
- TDS Docs Generator: Typography + Color + Effects 3개 페이지 완성
- TDS Docs Generator: makeLabel 폰트 사전 로드 최적화 (preloadInterFonts 공통화)
- TDS Docs Generator: 라벨 색상 접근성 개선 (#878789 → #636366, WCAG AA 5.5:1)
- Migrate to TDS 플러그인 UI 패널 (Migrate / Remove Button Drop Shadow 버튼 분리)
- Button Drop Shadow 제거 기능 (DROP_SHADOW만 제거, Ghost 타입 제외)
- 선택 없으면 현재 페이지 전체 대상으로 동작
- TDS Migrator: Swap Icon Sources 기능 (외부 라이브러리 → Icon Library 정식 소스 교체)
- TDS Migrator: Bind Icon Colors 기능 (stroke/fill → foreground 변수 바인딩)
- TDS Migrator: Migrate에 fontFamily(font-sans) + fontWeight 변수 바인딩 통합
- TDS Migrator Phase 2: 텍스트 Fill 컬러 토큰 바인딩 (하드코딩 색상 → Mode Collection 변수)
- TDS Migrator Phase 2: Effect Style 근사 매칭 (non-TDS 스타일 → TDS shadow 자동 교체)
- TDS Migrator Phase 2: Text Style 근사 매칭 (fontSize/weight 기반 최근접 TDS 스타일 유추)
- TDS Migrator Phase 2: 근사 매칭 요약 로그 ([SUMMARY] color/effect/text 건수 + 평균 거리)

### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
- session record — Org Plan 폰트 리서치 + /team Inter전면전환 No-go 결정
- session record — Phase 3 S1 테스트 + Pretendard 폰트 블로커 + Desktop MCP 추가
- update Figma MCP tool name get_figma_data → get_design_context
- 플러그인 이름 변경: Migrate to TDS → TDS Migrator
- UI 카테고리 재구성: Style Migration / Icon / Cleanup

### Fixed
- colorToVariable 맵: VARIABLE_ALIAS resolve 추가 (시맨틱 토큰 foreground 등 맵 등록)
- colorToVariable 맵: alpha 채널 포함 (rgba 5% ≠ 100% 구분, custom/ 변수 제외)
- Text Style 근사 매칭: lineHeight AUTO 처리 (null이어도 fontSize+weight로 매칭 시도)
- Text Style 근사 매칭: fontWeight ±100 허용 (SemiBold↔Medium 유연 매칭)
- replace-font-variable 플러그인 삭제 (TDS Migrator에 통합)

### Fixed
- bindChildStrokes에 try/catch 추가 (setBoundVariableForPaint 에러 안전 처리)
- effectStyleId에 figma.mixed 체크 추가 (handleDetachEffects, handleMigrate)
- processNode에 node.name null guard 추가
- 아이콘 출처 확인: Lucide Icons = Shadcn Kit 로컬 컴포넌트 (Huge Icons Detach 불필요)
- 아이콘 독립화 전략 수정 (Huge Icons Detach → 불필요, 색상 바인딩만 필요)
- @wellwe → @tryve npm scope 전체 전환 (package.json, import, 주석)
- WDS → TDS 플러그인 리네이밍 + 폴더 이동 (`packages/figma-plugin/` → `figma-plugins/tds/`)
- WDS → TDS 리브랜딩: WellWe → Tryve 전환 (CONSTITUTION, README, CONTRIBUTING, docs)
- Button Color Variant 슬롯 공식화 (`Button/Intent/Shape/[Color]/Size[/State][/Icon]`)
  - `White`: 컬러/어두운 배경 위 버튼 (brightness < 180)
  - 부모 배경색 감지 로직 추가 (`parentBgColor`)
- Intent에서 Success 제거 — 초록색(브랜드)을 Primary로 통합
- Intent 구분 원칙 강화 (Primary=핵심 전환, Secondary=보조/안내)
- UI: "간격 표준화" 버튼을 전처리 섹션 마지막으로 이동

### Added
- Figma MCP 도구 선택 가이드 + 20KB 제한 대응 체계화
- add Figma MCP Skills — 공식 5개 + 커뮤니티 1개 + TDS 커스텀 3개
- WellWe 프로덕트 디자인 간소화 TF 일정표 생성 (TSV + Apps Script)
  - 140개 항목 MECE 분류 (12개 대분류)
  - 4회 워크샵 일정 (2/27, 3/13, 3/27, 4/10)
  - 워크샵 필요 여부 구분 (정책 결정 vs 실무 완성도)

### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
- session record — Org Plan 폰트 리서치 + /team Inter전면전환 No-go 결정
- session record — Phase 3 S1 테스트 + Pretendard 폰트 블로커 + Desktop MCP 추가
- update Figma MCP tool name get_figma_data → get_design_context
- AGENTS.md → CONSTITUTION.md rename (Codex 전용 AGENTS.md와 혼동 방지)
- WellWe TF 간트차트 일정 수정
  - 타임라인 → 간트차트 형태로 변경
  - 워크샵 일정: 2/25, 3/11, 3/25, 4/8 (2주 간격 수요일)
  - 1차: 온보딩 리뷰 + 원데이 정리
  - 2~4차: 전주 디벨롭 리뷰 + 새 주제 워크샵
- WellWe TF 일정표 2차 리뷰 반영
  - 상태 오류 수정: "오늘의 할 일 표시", "오늘 미션 목록" → 완료
  - 누락 항목 4개 추가 (간소화 주제 e, f, h)
  - 비고 보강: 라운지 입장 조건에 유료 챌린지 전용 명시

### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
- session record — Org Plan 폰트 리서치 + /team Inter전면전환 No-go 결정
- session record — Phase 3 S1 테스트 + Pretendard 폰트 블로커 + Desktop MCP 추가
- update Figma MCP tool name get_figma_data → get_design_context
- `.ai/prompts/` 문서 간소화 - 상세 규칙은 `docs/specs/` 링크로 SSOT 통합 (중복 제거)

### Added
- Figma MCP 도구 선택 가이드 + 20KB 제한 대응 체계화
- add Figma MCP Skills — 공식 5개 + 커뮤니티 1개 + TDS 커스텀 3개
- **네이밍 충돌 안정화 Phase A** (SSOT 정책)
  - 충돌 후보 전부 보류 (자동 suffix `_2`, `/id` 금지)
  - 적용 성공 노드만 패턴 저장
  - 중복 제안 1차 감지 → 전부 보류 (P1 보완)
  - 충돌 배지 UI + 콘솔 로그
- AI Auto Layout 반응형 모드 전환 (Fill 적극 사용, 70% 기준)
- Truncation 지원 (Title/SubTitle 텍스트 자동 적용)
- 배경 요소 자동 감지 및 프레임 fills로 변환
- **후처리 안전 규칙** (v3.1): 작은요소/Vector/Icon 보호, 오버레이/플로팅 감지
- **ABSOLUTE 요소 반응형 constraints**: STRETCH/MIN/MAX 자동 설정
- layoutSizingHorizontal = FILL 자동 적용
- **재귀적 FILL 적용** (v3.2): 내부 자식까지 반응형 확장
- **Safe Zone 패턴**: Feed/Grid/Card 내부는 고정 크기 유지
- **위치 기반 constraints**: Button CENTER, ActionButtons MAX, Icon MIN/MAX
- **Top-level 강제 STRETCH**: AI가 INHERIT 반환해도 80% 이상 요소는 강제 STRETCH

### Changed
- CHANGELOG 중복 엔트리 정리 (hook 누적분)
- session record — Org Plan 폰트 리서치 + /team Inter전면전환 No-go 결정
- session record — Phase 3 S1 테스트 + Pretendard 폰트 블로커 + Desktop MCP 추가
- update Figma MCP tool name get_figma_data → get_design_context
- `naming-patterns.json` 로컬 전용 (git 추적 해제, PR 노이즈 제거)
- Content → Body 슬롯 네이밍 변경 (SSOT 준수)
- autolayout-rules.md v3.1.0 (후처리 안전 규칙 추가)
- AI 프롬프트 개선: 절대 위치 판단 금지, 전체 너비 요소 STRETCH 강조

### Fixed
- 인덱스 매핑 버그 수정 (AI 응답 인덱스 ↔ 재정렬 후 노드 불일치)
### Added
- Figma MCP 도구 선택 가이드 + 20KB 제한 대응 체계화
- add Figma MCP Skills — 공식 5개 + 커뮤니티 1개 + TDS 커스텀 3개
- 컴포넌트 속성 확장 (cornerRadius, effects, strokeWidth) - Avatar/Card/Input/Toggle 힌트
- 버튼 속성 자동 감지 (Intent/Shape/State/Icon)
- 패턴 매칭 정확도 개선 (parentName, vectorPathHash, textFingerprint)

### Fixed
- Cleanup 노드 이동 시 layoutPositioning 버그 수정 (Ignore auto-layout 방지)
- 패턴 매칭 점수 계산 수정 (null==null → 1.0)
- 패턴 DB 저장 순서 변경 + 초기화 버튼 추가

## [2.5.0] - 2026-01-17

### Added
- 패턴 라이브러리 Backend API (`/patterns`, `/patterns/match`)
- 구조 기반 유사 패턴 매칭 (score 0-1)

## [2.4.0] - 2026-01-17

### Added
- zod 런타임 검증 (LLM 응답 스키마 체크)
- 부분 데이터 fallback (검증 실패 시 유효 항목만 사용)

## [2.3.0] - 2026-01-17

### Changed
- `modules/naming.ts` → `naming/helpers/` 분리 (5개 파일)
- 순환참조 방지 import 정책 적용

## [2.2.0] - 2026-01-17

### Changed
- `code.ts` → `naming/` 모듈 분리 (30% 라인 감소)
- handler, direct, helpers 책임 분리

## [2.1.0] - 2026-01-17

### Changed
- 문서 구조 Diátaxis 방식 적용
- SSOT 정책 도입 (`docs/specs/` = 유일한 규칙 원천)
- API 중복 제거 (api-contract.md가 API SSOT)

## [2.0.0] - 2026-01-16

### Added
- Human in the Loop + AI 검증 병합 워크플로우
- Auto Layout 부모 내 병합 시 레이아웃 보존 로직
- `isEmptyAutoLayoutWrapper` 함수로 무의미한 래퍼 감지
- 자동 리마인드 체계 (CLAUDE.md 체크리스트)
- cleanup.ts 인라인 주석 (체크리스트, 경고)

### Fixed
- 다중 선택 시 캐시 손실 (`chainCache.clear()` 위치 수정)
- dynamic-page 모드 에러 (`getNodeByIdAsync` 사용)
- 병합 후 노드 접근 에러 (병합 전 `chainName` 저장)

### Changed
- 네이밍 스키마: Purpose/Variant → Intent/Shape/Size 구조
- 문서 SSOT 적용 (naming-rules.md가 단일 진실 원천)
- Cross-Reference + Auto Reference Rules 추가

## [1.0.0] - 2026-01-14

### Added
- 초기 릴리즈
- AI Naming 기능
- AI Auto Layout 기능
- Cleanup (래퍼 제거, 중첩 병합)
- Componentize (컴포넌트 브레이크)
- Agent Server (Claude API 연동)
