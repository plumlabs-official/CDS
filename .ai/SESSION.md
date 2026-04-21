# Session Memory

> 세션 단기 기억 (compact 후 이어갈 내용)
>
> Last updated: 2026-04-11

---

## 온보딩 Figma 소스 (프로덕트 디자인)

| 플로우 | 파일 키 | 노드 ID | 설명 |
|--------|---------|---------|------|
| 초대링크 온보딩 | `rrnCjPKhK4e69ElSkzMpTp` | `14332-114564` | 초대받은 사람 플로우 |
| 일반 온보딩 | `rrnCjPKhK4e69ElSkzMpTp` | `18603-3277` | 초대하는 사람 플로우 |

---

## 현재 세션 (2026-04-11)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| **Select vs Combobox vs Date Picker 분석** | TDS 컴포넌트 구조 비교. Date Picker = Combobox 인스턴스 확인. Select/Combobox 분리 유지 권장 (Coach A안) |
| **Creator Case 라운지 피드탭 17화면 스캔** | 전체 TDS 인스턴스 100%, 로컬 인스턴스 0건. 커스텀 프레임 5종 (Announcement Header, Lounge Card, Profile Card, Feed Card, Reply Card) |
| **Lounge Screen 리뷰** | 네이밍 위반 4건 (Updates Content + lets-icons 3건). Profile Card 4회·Challenge Talk Card 3회 반복 감지 |
| **Profile Card → TDS 인스턴스 교체** | 프로덕트 파일에서 커스텀 프레임 4개 → TDS Profile Card (Type=Vertical) 교체 완료 |
| **Challenge Talk Card 신규 컴포넌트 생성** | TDS 파일 Components 페이지에 생성. Challenge Thumbnail + Badge + Icon Scaler + Button TDS 인스턴스 활용. 프로퍼티 6개 (Title, Message Preview, Timestamp, Attendee Count, Show Badge, Show Attendee) |
| **Figma MCP 인증 복구** | `mcp__figma` REST API OAuth 인증 → `use_figma` 도구 복원 |
| **`/review` 스킬 생성** | tds-review — QA + 화면 리뷰 통합 (네이밍 + TDS 커버리지 + 반복 패턴 + QA 간이 점수) |
| **`/make-component` 스킬 생성** | tds-make-component — 참조 프레임 → TDS 컴포넌트 자동 생성 |
| **스킬 Director QA** | 7건 수정 적용 (skillNames, idempotency, 파일 타겟, Plugin API gotcha 등) |
| **`/review` Phase 3-B 추가** | Instance Replace 워크플로우 (복제→분석→승인→교체→검증) + 크로스 스크린 패턴 참고 문구 |
| **`/review` 실전 테스트** | Lounge Screen 스캔 — PASS (92점, TDS 27건, 위반 0건) |
| **Updates Card 크로스 스크린 패턴 분석** | Lounge Screen + Updates Screen에서 동일 구조 4회+ 반복 감지 → 컴포넌트화 결정 |
| **Updates Card TDS 컴포넌트 생성** | 4 variant (State=default/locked × Expanded=true/false). Thumbnail Slot + Content Slot 적용. 프로퍼티 8개 (4 TEXT + 2 BOOLEAN + 2 VARIANT). 혼합 작업 (Claude 구조 생성 + 사용자 슬롯 전환) |
| **[크로스] Team-Director Pipeline 구축** | claude-center + lenny 작업. 전 프로젝트 워크플로우 자동화 (Tier 0-3 분류, /team→/director→/ralph-loop). Execution/QA Layer 분리 + 헤드리스 QA 격리 (`claude -p` foreground). QA Reviewer 스킬 신규 생성. |
| **Pro Creator Card 분리** | Challenge List Card에서 독립 컴포넌트로 분리. Container + .Utility/Title + Main content 패턴 적용. 이름 변경 (Challenge List Card → Pro Creator Card) |
| **Lounge Cards 그룹 통합** | Lounge Card + Updates Card + Pro Creator Card → 하나의 "Lounge Cards" 컴포넌트 그룹으로 통합. .Utility/Title + Main content 패턴 |
| **Lounge Screen QA** | 8축 풀 QA — 98점 PASS (R5 중첩4 -20점만) |
| **Write Updates Screen 리뷰** | 84점 CONDITIONAL. 인풋 포맷 계열 점검 → Select/Input Group에 Label 부재 확인 |
| **인풋 포맷 계열 점검** | Date Picker/Combobox(Label 내장) vs Select/Input Group(Label 없음) 불일치 발견 |
| **Form Field 컴포넌트 생성 → 기존 Field 발견으로 삭제** | Label + Field Slot + Help text 래퍼 생성했으나, TDS에 이미 shadcn Field 컴포넌트(20083:18344) 존재 확인. 중복 삭제, 기존 Field 사용 결정 |
| **Date Picker/Combobox Label 기본값 변경** | Label Boolean default true→false. Description 업데이트 ("Form Field 래퍼와 함께 사용 권장") |
| **인풋 포맷 위계 정돈** | Team 논의: 모든 인풋은 Field 래퍼 사용 통일. Select/Input Group은 Field로 감싸기, Date Picker/Combobox는 자체 Label 비활성화 |
| **TDS 컴포넌트 분류 및 정리** | shadcn 공식 vs Kit 전용 vs 커스텀 분류. Section Heading, Rich Text Heading(2개), Rich Text Paragraph, Typography 6종(header-medium/small/xsmall, Description-Medium/small, Disclaimer) 삭제 |
| **Slot Holder 단순화** | Slot2~6 variant 삭제, Slot1 gap 16px/padding 16px/hug height로 수정. 사용자가 Component Set 해체하여 단일 AL 프레임으로 전환 |
| **Footer 정리** | Button cloud, Event slots, Pagination variant 3종 삭제. 버튼 6종 + Calendar/Alarm 3종 = 9개 variant 유지 |
| **프로토타입 연결 복구** | Drawer/Card Slot Holder 변경으로 깨진 프로토타입 연결을 사용자가 직접 복구 |
| **Content Header + Content Section Header 통합** | Content Section Header 삭제, Content Header로 통합. 프로덕트 파일 인스턴스 2건 사용자 직접 교체 |
| **Challenge Mission Card/Participant Card 하위 파트 내부화** | 6건 `.` 접두어 적용 (Host Info, Header, Addon Footer, Left Slot, Right Slot). Thumbnail은 독립 사용으로 유지 |
| **Purchase Button 통합 검토 → 분리 유지** | Price Area(코인+가격) 도메인 특화로 Button 통합 불필요 판정 |
| **Footer Kbd 유지** | 앱웹 베이스 가능성으로 Kbd 요소 유지 결정 |
| **Boolean property `Show Xxx` 포맷 통일** | 전체 50개 컴포넌트 스캔, 30건 네이밍 수정 (Show/Is/Has 접두어). ↳ 접두어 6건 적용 (Combobox, Date Picker, Profile Card, Invite Profile Card) |
| **Announcement Header 통합 확인** | Lounge Card 슬롯 개선으로 이미 흡수 완료 확인 |
| **Thumbnail/Challenge Talk Card/Updates Card Publish 확인** | 사용자 직접 Publish 완료 확인 |
| **Write Updates Screen 리뷰** | 91점 PASS (R1=82, R2=100). TDS 9건, 로컬 0건, 네이밍 위반 0건 |
| **Write Updates Screen 재리뷰** | 97점 PASS (R1=100, R2=96). Field 래퍼 적용으로 TDS 15건, Lounge Item 네이밍 Warning 2건 |
| **Calendar Drawer 리뷰** | 100점 PASS. Drawer + Calendar Block 슬롯 조합, 커스텀 0건 |
| **Lounge Setting Dropdown 리뷰 + 컴포넌트 교체** | 99점 PASS. Dropdown Menu → Select Menu 교체. 시맨틱 오류 해소 (action menu → selection listbox) |
| **Select Menu Item `State=Selected` 추가** | TDS 원본에 Selected variant 추가 — `--sidebar/primary` 배경 + 흰 텍스트 + 체크. 전체 variant 폰트 14→16px |
| **Select 트리거 높이 통일** | 36px → 48px (Date Picker Field와 동일) |
| **Select 컴포넌트 구조 개편** | flat → nested (root VERTICAL → Label → Field → Help text). Date Picker와 동일 아키텍처. 프로퍼티 9개 (Show Label/Help Text/Icon Left/Icon Right, Label, Help Text, Placeholder, ↳ Icon Left). min-width 160, max-width 512. description 업데이트 |
| **프로덕트 파일 반영 확인** | TDS 퍼블리시 + 프로덕트 인스턴스 업데이트 사용자 완료 확인 |
| **Slot → Instance Swap 전환 분석** | TDS 전체 26개 컴포넌트 50+ slot 스캔. ~25건 전환 후보 도출 (단일 인스턴스 패턴). 문서화 완료 (`report/2026-04-08_slot-instance-swap-analysis.md`) |
| **Icon Scaler 사용처 조사** | 20개 컴포넌트 ~150 인스턴스. Size 16이 90%, 28/32/36/Size6 미사용. 문서화 완료 |
| **Participant Card 구조 리뷰** | Authed 이미 분리 확인. 네이밍 5건 수정 (Container×2, Frame 3/4, 오타 Show Determinded, Authed 공백 트림). Participant Card 분리를 P0 TODO에 추가 |
| **Participant Left/Right Column Slot 검토** | masonry 레이아웃에서 복수 카드 자유 배치 용도 — Slot 유지 결정. Pinterest형 UX에서 비율은 서버 기반 랜덤이 표준, TDS의 Scale bucketing(1:1/4:5/9:16)은 실용적 접근 |
| **`product-designer` 스킬 생성** | `/design` 커맨드. 미팅 기록 → Figma 화면 디자인 워크플로우. Director QA (3역할 병렬: Design Director G3 62, AI Ops G1 58/G2 45, Product Leader G4 75) → 14건 피드백 반영. 6-Phase 구조 (요구사항 추출 + UCD Empathize → Design Director Checklist → 승인 → figma-generate-design 위임 → QA Decision Tree → 보고). DesignRequirements/ScreenPlan 중간 스키마, 잠금 패턴 4종 명시, 해석 분기점 [AMBIGUOUS] 감지, --dry-run 모드 |
| **구독 티어 유저 화면 목록 도출** | Team 모드 (Product Leader + Design Director). 04-07 미팅 D1-D7 분석 → 어드민 제외, 7플로우 19화면 + 보류 4건. P0: 크리에이터 페이월(5) + 슈퍼호스트 페이월(3) + 라운지 소식 잠금(3) + 공통 트리거 컴포넌트(1). D3 소식 잠금 A/B 양안 시안 권장 |
| **크리에이터 페이월 디자인 (Lite/Pro)** | Director 모드. dry-run 후 Lite/Pro 2개 화면 제작 → 베리에이션 → 라이트/프로 확정 → 사용자 직접 디자인. 미팅 결정 D1-D7 크로스체크 후 D2(쿠폰=프로 전용), D3(소식=프로 통합) 변경 확인 |
| **use_figma 디자인 퀄리티 리서치** | /research 5 에이전트 병렬. clone→modify 전략, 비주얼 폴리시 패턴(그라디언트, 섀도우, cornerSmoothing), 토큰 바인딩, 컴포넌트 오버라이드, AI+Figma MCP best practices. 리포트: report/2026-04-09_use-figma-design-quality.md |
| **Stitch 결과 → TDS 토큰 바인딩** | Super Creator Tier 카드를 Stitch에서 가져와 TDS 변수(sidebar/primary, primary-foreground, radius/rounded-xl 등)와 텍스트 스타일 바인딩. 그라디언트 fill은 Plugin API 제약으로 수동 유지 |
| **슈퍼호스트 페이월 (Host) v1** | Director 모드. 처음에 탭 구조 (호스트30/99) → 사용자 피드백 "탭 부적합, Freepik 패턴 차용" → 단일 화면 3카드 스택 구조로 재설계. 페르소나: 크로스핏 관장 (회원비 외 추가 결제 X). HOST 30 BEST VALUE 강조. UX 이슈: 토글 가격 중복 표기 → 다음 세션에서 A/B/C안 제작 예정 |
| **204 가격 확정값 확인** | 호스트 15 $7.99/$76.99(20% 할인), 호스트 30 $14.99/$143.99, 호스트 99 $24.99/$239.99. ₩ 환산: 10,500/19,500/32,500. 연간 할인 33% 아닌 **20%** (현재 디자인 수정 필요) |
| **Paywall Host — 안 A/B/C 토글 중복 해소** | A안(토글 가격 제거) + B안(2개월 무료 뱃지) + C안("부터" 가격) 3안 제작. 24773:1250 / 24794:1250 / 24794:1354 |
| **Paywall Host — 안 D 최종 (Team + Director)** | Team 1차 "tier-first vs billing-first" → D안(Tier-First Hybrid) 권고 → 사용자 수정본 리뷰 Team 2차 → Director 실행 → Plan Card 반복 수정(Mini chip→2개 차별점→1개→제거) → Hero subtitle로 차별점 통합. 최종 구조: Hero + Subtitle + TabsList Toggle + Tier Cards (₩/1인 표기 추가) + FAQ + CTA. 노드 24806:1250 |
| **정합성 이슈 발견 (204 단체 완주 인증서)** | 204 단독 주장 확인 (200/400/420/ADR/meetings/decisions 0건). 사용자 "기획 리뷰 전이라 Host Pro에서 빼는게 좋음" 결정. Plan Card 제거로 회피. 204 본문은 다음 세션에서 정리 예정 |
| **TDS → CDS 전면 리네이밍** | 프로젝트 디렉토리(~/Project/TDS→CDS), 플러그인 코드(85 files, 상수/함수명/UI), 스킬 6개+플러그인 4개 디렉토리, npm scope(@tryve→@challify), 외부 프로젝트 4개(claude-center/plumlabs/lenny/글로벌 메모리), GitHub 리포 리네임. Figma fileKey 보존. 과거 기록 보존. Team 모드로 범위/리스크 논의 후 실행. Director QA 5-Gate 전체 PASS |
| **Claude Design 출시 리서치** | /research 5에이전트 병렬. 2026-04-17 Research Preview 출시 분석. 핵심: 프롬프트→인터랙티브 HTML, 디자인 시스템 자동 추출, Claude Code 핸드오프 번들. Figma MCP와 보완적 풀루프. 리포트: report/2026-04-20_claude-design-launch-research.md |

---

## 현재 세션 (2026-04-20)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| **TDS → CDS 전면 리네이밍** | Team 모드 논의 → Plan 승인 → 6 Phase 실행. 85 files, 440+440 대칭 변경. Director QA 5-Gate PASS. GitHub 리포 리네임 완료 |
| **Claude Design 출시 리서치** | /research 5에이전트 병렬, 14소스, 96% 신뢰도. 리포트: `report/2026-04-20_claude-design-launch-research.md` |
| **프로젝트 구조 정리** | Team 2회 + Coach + Director QA 5-Gate PASS. research/, demo/, CONTRIBUTING, START-HERE, prd, shadcn-kit-comparison 삭제 (60 files, -7337줄). slot-analysis → report/로 이동. CONSTITUTION 트리 현실화 + 전체 데드 링크 정리. report/reviews/meetings는 audit trail 자산으로 유지 결정 |
| **Figma 라이브러리 CDS 리네이밍** | 사용자(재현) 직접 완료 |
| **Claude Design × CDS 활용 전략 논의** | 3단계 비전 (하이파이 프로토타입 → 컴포넌트 이관 → Figma 의존도 0). 현재 1단계만 가능, 2-3은 Claude Design 진화 필요. 핸드오프 메커니즘 리서치 (URL → CLI 번들 생성). slot은 바이브코딩에 문제 없음 확인 |
| **Claude Design 온보딩 시작** | CDS .fig 파일 업로드 + IBM Plex Sans KR 폰트 추가. 디자인 시스템 제너레이팅 진행 중 (결과 확인 대기) |
| **Claude Design 요금 메커니즘 리서치** | researcher 에이전트. 구독 한도 기반(API 크레딧 불필요), 채팅/Code와 별도 쿼터, 공식 7일 주기. Extra Usage로 API 종량제 즉시 재개 가능. 리포트: `report/2026-04-20_claude-design-pricing-mechanism.md`. Project memory 저장 |
| **Claude Design 파일 업로드 메커니즘 리서치** | researcher 에이전트. 추가 .fig 업로드 효과 제한적(공식 1급 입력 아님, multi-file 불안정). 이미지 레퍼런스 또는 Figma MCP 경로 권장. 리포트: `report/2026-04-20_claude-design-file-upload-mechanism.md` |
| **크리에이터 큐레이션 홈 디자인 PRD v0.3** | 2026-04-15 미팅 §9 기반 초안. 핵심 제약 2개(별도 랜딩 페이지 없음 + 챌린지 정보 카드 노출 금지). v0.1→v0.2(에디터 제거 과해석)→v0.3(별도 랜딩 페이지 없음으로 재정의) 리비전. CDS 신규 컴포넌트 후보 3종(Creator Hero Card, Creator Discover Card, Creator Tier Badge). 리포트: `report/2026-04-20_creator-curation-home-prd.md` |
| **Figma 레퍼런스 export 워크플로우** | REST API + Python 배치 스크립트(/tmp/figma_export.py). 40장 전체 → 10장 핵심 → 페이월 3장 + 할 일 1장 추가 = 최종 14장(라운지/피드/탐색 10, 페이월 3, 할 일 1). Claude Design 업로드 후 exports/ 정리 |
| **P0 1~2 완료 처리** | 방장 일정 미정 초대 플로우 삭제 + 챌린지별 라운지 소식 잠금 표기 (사용자 완료) |
| **Stitch/Pencil 대안 리서치** | Claude Design Max 20x 한도 소진 대응. Stitch는 .fig 업로드 불가(DESIGN.md만), Pencil은 복붙 1계층만 + CDS 인스턴스 바인딩 소실. 둘 다 "프롬프트→UI" 수준으로 CDS 대체 부적합. 리포트: `report/2026-04-20_stitch-pencil-alternatives.md` |
| **Pencil + CDS 이식 PoC 플랜 수립** | /team plan 모드. 실험 A(Figma 원본 복제) + B(PRD만으로 생성) 2종 설계. 7-Phase 자동 실행 플랜 + RESUME 재개 규약. 플랜 파일: `~/.claude/plans/wobbly-churning-kurzweil.md`. 산출물 폴더: `exports/2026-04-20_cds-migration/` (gitignore) |
| **Pencil PoC 사전 체크리스트 진행** | Figma MCP/CDS 라이브러리/폴더 생성 PASS. **Pencil 데스크톱 앱 WebSocket 연결 실패로 블로킹** (`get_editor_state` 3회 재시도 실패). 다음 세션에서 앱 MCP 세션 활성화 후 재개 |
| **Pencil MCP 연결 복구 + Figma import flatten 발견** | `/mcp` 재연결로 Pencil WebSocket 복구. 추가 발견: Pencil의 `File > Import > Figma...` 은 COMPONENT→FRAME flatten (variants/properties 유실). Claude Design과 동일 한계 확정. 메모리 저장: `project_pencil-figma-import-flattens.md` |
| **Pencil Button baseline 측정** | 1 reusable + 3 override 인스턴스 빌드. MCP 3분. Button의 Figma 228 variants 전체 재구축 수작업 추정 ~157h (50 컴포넌트) |
| **Claude Design × Pencil 대조군 리포트** | Claude Design이 토큰 정확 (`#00CC61` 등 + Brand/Semantic/Neutrals/Chart 그룹화) 확인. 둘 다 variant flatten 공통, Pencil은 .pen 네이티브 편집성 우위. 세 도구 역할 분리안 합의 |
| **[Director] CDS → Pencil 네이티브 이관 실행** | Hybrid 전략 (Theme + Structural reusables). 3 QA 사이클 PASS (87→92→94.6). 51 variables + 27 reusables (Buttons 5, Containers 4 w/ Dialog+Drawer, Controls 5 w/ Select+Dropdown, Domain 2: Challenge Mission Card + Participant Card) + 11 PNG export + Home Feed 390×844 합성. 산출: `exports/2026-04-20_cds-migration/`(.pen + MIGRATION-PLAN.md + QA-INBOX.md + screenshots/) + reviews/2026-04-20_cds-pencil-migration.md |
| **Rev. 4 — Visual Auto-Improve Loop** | 사용자 지적("피그마와 달라") 후 Figma↔Pencil 스크린샷 대조 → diff 식별 → `batch_design` 수정 + `G()` AI 이미지 주입 → 재검증. CMC 시각 일치 ~50→~90%, Badge 3→6, Alert 1→3, CDS Card 시맨틱 교체(Sheet Header Card 신규), Button 라벨 매칭. 총 27→**31 reusables**. 산출: `VISUAL-DIFF-REPORT.md` |
| **Rev. 5 — Padding Precision Fix** | 사용자 지적("버튼/뱃지 padding 너무 얇아") 후 Figma Plugin API로 원본 padding/height spec 직접 추출 → Pencil 교정. Button pad `[0,16]`→`[8,16]` gap `8`→`6`, Badge radius `pill(9999)`→`8` pad `[6,10]`→`[2,8]`. 교훈: Pencil `[a,b]` padding = `[V,H]`, `U()` 시 height/width 명시 필수 |
| **Rev. 6 — 전수 비교 점검** | 사용자 요청("토큰/컴포넌트 하나하나 비교")으로 Figma Plugin API 전수 스펙 추출 → 토큰 **51→73 variables** (+22: popover/success/warning/info/chart/sidebar/custom-focus, `--muted-foreground` 값 교정), 컴포넌트 10+ 속성 수정 (Input/Field/Select white bg+stroke, CMC 344w, Participant Card 168w, Card radius 16 등). Input의 fill/stroke 역할 혼동 근본 수정 |
| **Rev. 7-9 — 자동 루프 + 인스턴스 활용 + 누락 컴포넌트 추가** | Ralph MCP validator 우회 → 세션 내 직접 Figma↔Pencil diff 루프 실행. 31 iter 전수. Alert colored variants/Card Host Info/Meta Row 내부 reusable 승격. Challenge Thumbnail/Avatar Group/Featured Icon/Navbar/Dialog Header/Dots/Nudge/Notification Badge/Message R&S/Lounge Card 15종 추가. **27→51 reusables** |
| **Rev. 10 — NEW PLAN v2 Phase 0+1** | Team 재플래닝 후: Figma 102 컴포넌트 enumeration + Challify 240 usage 집계 → P0 18종 커버리지 감사 (55.6%→100%). P0 누락 9종 추가 (Icon Scaler/Kbd/TabsTrigger Tag/Section/Input Group Addon Inline/Coin/Messaging Reaction/iOS StatusBar+HomeIndicator). **51→60 reusables**. 산출: discovery.json, usage.json, COVERAGE-REPORT.md |
| **Rev. 11 — A/B/C 연쇄 Director** | Step A Phase 2 3-Layer Diff (91/100) 5 tickets (Kbd arrows, TabsTrigger Tag/Section, Messaging Reaction, Coin accepted) → Step B P1 15종 추가 (Status, Select Menu Item, TabBar Icon, Dropdown Menu Trigger, Select Menu Label, Navbar Addon Inline, Creator Badge, Fire, Lounge Card Addon Block, Challenge Day Progress, Circle Progress, Segmented Progress, Accordion Item, Fieldset, Page Indicator) → Step C Icon Pipeline (99 icons inventoried, 48 mappings). **60→76 reusables** |
| **Rev. 12 — P2 17종 추가** | Textarea, Tooltip, Breadcrumb + Breadcrumb Item, Combobox + Combobox Menu, Date Picker, Radio Group, Checkbox Group, Switch Toggle, TabsTrigger Toggle, Purchase Button, Content Header, Form Message, Profile Card, Invite Profile Card, TabBar (container w/ 5 tabs). **76→92 CDS reusables + 1 ancillary (Creator Card Compact) = 93 total**. CDS 커버리지 **90.2%** |
| **Rev. 13 — P2 Structural 26종 + P3 Illust 8종** | Input Group family 5종 (Group/Addon Block/Button/OTP/OTP Field), Participant family 3종 (Authed/Left/Right Column), TabsList container 3종 (Section/Tag/Toggle), Challenge Card family 3종 (List/Mini Card/Thumbnail Group), Container 5종 (Kbd Group/Keyboard/Accordion/Select Menu/Item), 단독 7종 (Bell Image/Calendar Block/Field Legend/Footer/Cover Pay Header/Checkbox Toggle/Pro Creator Card), Illust 8종 (Character/Contact/Gift/Lounge Badge/Ticket Item/Placeholder ×3). **93→127 reusables (126 CDS + 1 ancillary)**. **CDS 102종 전체 매칭 100%**. Illust 8종은 lucide placeholder, Keyboard는 platform native 권장. |
| **Rev. 14 — Visual Validation + Auto Fix** | Rev.13 34종 Figma↔Pencil 렌더 대조. **17 visual issues 수정** — 공통 원인: fit_content+fill_container 충돌(텍스트 세로 wrap), layout 미지정, 빈 image slot, masonry 높이 균일화. 수정 대상: Input Group family 4 / Participant family 3 / Item / Kbd Group / Accordion / Cover Pay Header / Footer / Field Legend / Calendar Block / Challenge Card family 3. G() AI 이미지 주입 3건, masonry height override 6건, width 고정 11건. 기존 92종 샘플 8개 점검 — 모두 정상. |
| **Rev. 14-2 — Size Structural Variants + Visual Polish** | 사용자 피드백 "Participant Card Authed 3 size 누락, 전수 조사" 대응. Coach 조언 Variant Mapping Strategy 적용 — Size Structural만 별도 reusable, State/Theme는 prop/variable. **신규 6 reusables**: Participant Card Authed 4:5/9:16 + Challenge Thumbnail Group XS/S/M/L. Visual polish 4건: Addon Block icon arrow-up, Thumbnail Group 6개, Mini Card width 고정, Cover Pay Header price 교정. State/theme variants(Input OTP, Checkbox Toggle, Footer 등)는 단일 reusable + variable 바인딩 결정 문서화. **127→133 reusables**. |
| **Rev. 15 — Illust PNG 업그레이드 + Detail Polish** | Illust 8종 lucide placeholder → Figma REST API single variant PNG 교체 (`images/illust/*_v2.png`). **주의점 학습**: component set ID로 export하면 모든 variants 겹침 → 첫 variant 개별 node ID 필수. Pencil 이미지 캐시로 overwrite 무효 → 파일명 버전(`_v2`) 교체 필요. Cover Pay Header: calculator icon 제거 + 주황 원형 zap + "전체 대신 결제" 버튼 라벨. Pro Creator Card: X close button + "Creator Name" + users icon "132K" + "+ 팔로우" + dotted purple border. Rev.12 이전 92종 검토 — Button 228v size/state/theme는 prop 처리 일관. **133 유지**. |
| **Rev. 16 — CDS 원본 그루핑 재편** | 사용자 피드백 "다 섞여있어서 보기 힘들어". CDS Figma 페이지 구조(`Primitives` 24 sub-group + `Composed` 20 sub-group) 그대로 Pencil에 복제. 각 sub-group frame = label header + reusable row. 133 reusables을 해당 sub-group으로 M() 이동 (6 batch). Dialog/Drawer → Card and Sheet, Footer → Navbar, Featured Icon → Asset 분류. **133 유지**. |
| **Rev. 17 — Structural Variants Audit (Director+Ralph)** | 빠진 컴포넌트 / 구조 차이로 분리 필요 variants 전수 점검. CDS 102 매핑 대조 누락 0. 10종 의심 multi-variant 중 Tooltip 20v(caret 방향 structural), Input Group 26v(Text/Textarea/Bare/Pill 높이 다름), Footer 9v(레이아웃 완전 다름), Dots 6v(Active/Inactive 크기 다름), Switch 16v(Default vs Card type) 분리 필요로 판정. Purchase Button/Dialog Header/Notification Badge/Lounge Card는 prop 유지. **15종 structural 분리 추가**: Tooltip 4방향 + Input Group 3타입 + Footer 5레이아웃 + Dots 2 + Switch Card 1. 해당 sub-group에 M() 재배치. **133→148 reusables**. |
| **Rev. 18 — Avatar/Avatar Group Structural 재편** | Rev.17 신규 15종 screenshot 전수 렌더 검증 PASS(blank 0). Avatar 추가 sizes 감사 — Avatar Group 기존 KwYkH CDS spec 불일치 발견(4 children gap -8 vs 원본 6 children gap -12, width fit_content vs 180). F6A53 "Avatar Large"(56) 실제 X Large 라벨 불일치도 교정. 신규 7종: Avatar 2X Small(20)/X Small(24)/Large(48) + Avatar Group 2X Small(85×20)/X Small(94×24)/Small(137×32)/Large(218×48). 각 6 avatars + "+3" indicator. Variant Mapping Strategy 일관(Avatar simple scale → prop, Avatar Group structural → 분리, Rev.14-2 Challenge Thumbnail Group 패턴과 동일). **148→155 reusables**. |
| **Layer 3 Visual Diff Agent PoC** | `layer3/PROTOCOL.md` + `mapping.sample.json` (10종) 작성. Tooltip Top Primary 1회 실행으로 2건 material diff catch — 라벨 convention 불일치(Pencil "Tooltip Top" caret-bottom vs Figma "Caret position=Top") + Style default 불일치(Pencil 검정 Inverted vs Figma Primary 초록). qa-tickets.md Step K 기록, Layer 3 ROI 입증. |
| **Segmented Progress + Progress 구조 재구성** | 사용자 지적 "디자인이 완전치 않아". CDS 원본 조회 후 Pencil 5c6L1 구조 자체 불일치 발견(5 단순 segments vs 원본 **3 Segmentation bars + 4 emotion point markers overlay**). 재구성: bar slot(3 segmentations + Surface fill) + point slot(4 emotion markers w/ frown/meh/smile/laugh lucide icons). Progress I7c2F Fill height 8→6 교정. |
| **[크로스] Team Meeting: CDS/Pencil 전수 정합성 조사 플래닝** | Strategy Session · 4역할 Simulation 2-Round. 누적 6 spec 불일치 사례 기반 Phase 1-5 Plan 도출: L1+L2 inspection 자동화 → 155 전수 → Triage(Atomic/Molecule/Organism × structural/dim/label) → Critical fix only → Re-verify + drift monitor. 총 7-10h. Round 2 QA PASS 86.7/100(보완 권고 2건 — Phase 4 건수 근거 + use-site mitigation). 파일: `meetings/2026-04-21_pencil-cds-spec-audit-planning.md` |
| **Rev. 19 — Phase 1-5 전수 정합성 조사 + Critical/Major Fix 완료** | Phase 1: inspect 인프라(`layer3/cds-components.json` 120 + `mapping.full.json` 155 + `inspect-protocol.md`). Phase 2: 11-batch 전수 inspection 100%(PASS ~80/MINOR ~40/MAJOR 12/CRITICAL 3/ACCEPTED ~10). Phase 3 Triage 매트릭스. **Phase 4 완료 — Critical 3/3 해결**: C1 Dialog Header(CDS VERTICAL wrapper 발견 → mapping note로 MINOR downgrade), C2 Content Header(mapping variant 정정 Left→Center로 MINOR downgrade), C3 Label(form primitive ACCEPTED) + M1 CT Thumbnail 신규 3종(XS/Medium/Large) + 라벨 변경 2(Medium/Large→2X Large/5X Large) + M2 CT Group 5 재구성(6 children + CDS gap spec) + M3~M6 ACCEPT 결정 명문화. **Phase 5**: CT Group+Thumbnail 재검증 screenshot ✓, `drift-monitor.md` 문서화(체크 cadence + 자동화 옵션, baseline 2026-04-21). 주요 발견: Pencil size scale 라벨이 CDS와 한 두 단계 offset — F6A53/CT Thumbnail/Featured Icon Square 공통 패턴. **155→158 reusables**. Step L 문서화. |
| **CDS-max 시안 Team 플래닝** (중단) | 2026-04-21 사용자 "PRD로 Figma 스크린 디자인" 요청. Team 모드 3역할(Design Director/Product Leader/AI Ops Expert) Simulation으로 CDS 커버리지 매핑 + 우선순위 + 기술 제약 논의. 결론: `25560:337` clone 후 §4.4 Profile Card Vertical + §4.6 Pro Creator Card CDS 전면 교체 방향. 사용자 타겟 변경 `t0SK7XaNqw8qIY3PpZw4s7 / 25577:23646 (Test 페이지)` + 이미지 맥락 매칭 전략 지시. 실행 착수 후 /record로 중단 (shell `25582:337` 생성까지만). 미팅 기록: `meetings/2026-04-21_lounge-cold-start-cds-max-planning.md` | 2026-04-21 |
| **Rev. 20 — Pencil ↔ Figma Roundtrip Test (Director Mode)** | PRD `cold-start-lounge-home-prd.md` v0.3 기반 라운지 탭 콜드 스타트 홈 합성. **Phase A 완료 (Pencil)**: Product Leader + Design Director agent 병렬 스폰으로 PRD 해석+섹션 매핑+우선순위. Pencil cds.pen Screen `3F9KM` — 6 섹션(§4.1 Hero/§4.2 My Lounge/§4.3 Spotlight/§4.4 Category/§4.6 Popular/§4.8 Bait) + StatusBar/Navbar/TabBar/HomeIndicator. clip:true + AI 이미지 주입 9개(G() 함수). §4.6 Pzopm("소식 카드" 타입) → iXk8R 3개 교체. 사용 reusables 20+ 종. Gate G1/G2/G3 PASS. **Phase B 진행 중 (Figma, ~70%)**: 프로덕트 파일 `t0SK7XaNqw8qIY3PpZw4s7` 새 페이지 `25511:337` + Screen `25511:379`. CDS instance 10종(StatusBar/HomeIndicator/Button×5variants/Badge×2/Creator Badge/Avatar/TabsTrigger Tag×7/TabBar). 커스텀 composition (Creator Card 6, Mini Preview 2, Segment Toggle, Prompt Slots). Unsplash createImageAsync Figma plugin 샌드박스 제약 — gradient/color placeholder fallback. 리뷰: `reviews/2026-04-21_pencil-figma-roundtrip-test.md`. 백업: `cds.pen.bak-rev20` |
| **Rev. 20 Phase B 이미지 업로드 (현재 세션)** | `figma.createImageAsync(url)`이 use_figma 환경 unsupported 확인 → 대체: `base64Decode` + `createImage(bytes)` 동기 API. magick `-strip -interlace none` clean JPEG로 생성(sips는 Photoshop IRB로 "Image type is unsupported" 오류). 단일 이미지 1건 업로드 성공(hash `cc5402bc...`) → **`use_figma` code 파라미터에 5KB 이상 base64 transport 시 truncation/Invalid base64 발생** 발견. 1개 hash를 9곳 placeholder에 배포하여 image plumbing만 검증. 원본 해상도 직접 전송 불가(660-950KB PNG, b64 900KB+), 50KB code 한계. |
| **Rev. 20 후속 1 — Figma 사본 CDS 교체** | 사용자가 `14332:285690` 페이지의 `25548:18524`로 사본 이동. 교체 2건: §0.1 Segment Toggle(custom frame) → **TabsList Toggle Value=2 인스턴스**(피드/라운지 trigger Title override + Show Red Dot=false) / §4.8 Mini Preview×2(custom frame) → **Challenge Mini Card 인스턴스×2**(Title=21일 명상 챌린지/아침 홈트 7일 + imageHash fill). CDS 인스턴스 **26→29 (19.8%→25.2%)** UI visible ~55→~65%. 유지(custom): Hero Banner/Prompt Slots/Spotlight overlay/Creator Card Compact×6(Pencil ancillary iXk8R, CDS 미편입). 리뷰 "Post-B CDS 교체" 섹션 추가. |
| **Rev. 20 후속 2 — Pencil 시안 standalone HTML** | 이미지 다양성 MCP 경로 한계 확인 후 방향 전환. Pencil `3F9KM` 시안 그대로를 standalone HTML 생성. CDS 51 variables → CSS custom properties 매핑(primary `#00cc61` / foreground `#1a1a1a` / secondary `#eff5fd` / input `#e5edf7` / radius 토큰). IBM Plex Sans KR(Google Fonts), Lucide-style inline SVG(외부 CDN 0). 9 원본 PNG 로컬 복사(`./images/spotlight.png`, `cat-{1..3}.png`, `pop-{1..3}.png`, `bait-{1..2}.png`). 섹션 10개 구현(StatusBar/Navbar/§4.1-§4.8/TabBar/HomeIndicator). 가로 스크롤은 `overflow-x: auto` + scrollbar hidden. Spotlight gradient overlay Pencil 사양 동일. 파일: `exports/2026-04-20_cds-migration/web-standalone/index.html` (gitignore 경로, 로컬 참조). |
| **exports 크로스 로컬 동기화 체계** | 사용자 "`.pen`도 다른 로컬에서 활용" 요구. `.gitignore` 수정 — `exports/` 전체 제외 → 대용량/백업만 제외로 전환. 34 files(~700KB) tracking: `cds.pen` 활성(409K), `layer3/` drift/mapping/diff 체계, 루트 문서 6종(COVERAGE-REPORT/MIGRATION-PLAN/qa-tickets/VISUAL-DIFF-REPORT/QA-INBOX/diff-protocol). 제외 유지: `.pen.bak-*` 8종(히스토리 부풂 방지), `images/` 1.5M, `images.bak-rev14-2/` 49M, `web-standalone/` 6.7M. `.pen` 409K 경량이라 **LFS 불필요** 판정. **주의: `.pen` 바이너리 양 로컬 동시 편집 시 merge 불가** — 한 번에 한 로컬에서만 작업. 커밋 92ad55d + push 완료. 다른 로컬에서 `git pull`로 즉시 재개 가능. |
| **CDS-max 스크린 Figma 구현 (Screen 25582:337)** | 이전 세션 Shell만 있던 `t0SK7XaNqw8qIY3PpZw4s7 / 25577:23646` 페이지의 `25582:337`에 §4.1–§4.8 전체 섹션 구현. 이미지 맥락 매핑(`14332:285690` 3 섹션 walk → 70 unique imageHash 수집, avatar/thumbnail/hero bucket 분류). 사용자 지적 반영 5건: (1) Lounge Top Bar 커스텀 frame → CDS Navbar Type=FULL + TabsList Toggle Value=2 + search icon 교체, (2) News 크리에이터 소식 → **empty state**(콜드 정합), (3) Navbar 라운지 탭 red dot 제거 + back arrow 숨김(Show Navigation=false), (4) Trending Avatar 2X-Large(64) → Medium(40)로 §4.4 Profile Card 내부 Avatar와 완전 통일(Badge crossover 방지), (5) Delta Badge overlay → 정보 영역 "user-plus icon + 숫자" 텍스트로 재구성. CDS 인스턴스: Navbar/TabsList Toggle/TabsTrigger Toggle/Content Header×5/Badge 2종/Creator Badge/Avatar 복수/Button 복수/TabsTrigger Tag 8/Profile Card Vertical 4/Pro Creator Card 6/Lounge Card→empty/Challenge Mini Card(부적합 판정)→커스텀 Mini Card 2. Nested instance phantom-safe iteration(try/catch + direct children) + setProperties Slot 제약(swapComponent로 우회) 등 학습. | 2026-04-21 |
| **Claude Design handoff 번들 수신** | 사용자 수동 제공 `Lounge Design-handoff.zip` + 두 번째 URL `7mt5j9x3k8ek0bNb_MuoNw` `curl -i`로 tar.gz 17MB 수신. README + `project/` (HTML/JSX/CSS/fonts/assets/uploads) + `chats/chat1.md` 구조 파악. 이전 URL `n2uMz-KOadOyOopqv1-XmA`는 **404**, 새 URL만 `200 application/gzip attachment`. chat transcript로 사용자 원 의도 재확인: **C0(순수 콜드) 단일 스크롤, Option β my_lounge(아바타 제거, prompt 3슬롯), §4.1–§4.8 전체, 실사 Unsplash 플레이스홀더, Cohort Tweaks**. 두 handoff `project/` 파일 동일, 차이는 chats/ 추가. | 2026-04-21 |
| **HTML 기반 raw 재구현 (Screen 25655:337, CDS 인스턴스 0)** | 사용자 "CDS 활용 없이 HTML 그대로" 요구. 동 파일 Test 페이지에 새 Phone `25655:337` 390×2020(전체 스크롤 펼침) 생성 — Phone bezel(radius 48 + notch 120×32) + 내부 Screen(370×2000, VERTICAL AL, clipsContent). §4.1–§4.8 + iOS StatusBar(signal/wifi/battery 커스텀) + LoungeTopBar(피드/라운지 segment + red dot + search) + TabBar(5 cell + green dot) + HomeIndicator 모두 raw frame/text/vector 구성. Section headers(Compass/TrendingUp/Megaphone/MapIcon)는 placeholder geometry. 이미지: `use_figma` 환경 `figma.createImageAsync` + `fetch()` 모두 **unsupported** 확인 → 파일 내 기존 imageHash 재활용(원본 Unsplash와 creator 얼굴 매칭 불가 한계). **Hug sizing 회귀 수정**: `resize(w,h)` 호출이 primary+counter 둘 다 FIXED 강제하는 Figma API 동작 발견 → Screen walk로 117개 AL 프레임 일괄 정규화(VERTICAL=primary AUTO, HORIZONTAL=counter AUTO). body 1755→1890, screen 824→2000, phone 2020. | 2026-04-21 |
| **Stitch 라운지 홈 → CDS 교체 (Director Mode)** | Stitch 생성 `25577:29746` (라운지 콜드 스타트 홈 390×2664) 복제 → `25679:337` "4 — CDS 교체본"에 CDS 인스턴스 **39종** 교체 + 토큰 바인딩. Phase 1~12: 원본 복제 / Navbar Type=FULL + TabsList Toggle Value=2(피드·라운지) + menu·search swap / Hero Badge "NEW START" + token bind(card/border) / Creator Spotlight Avatar XL + Creator Badge Pro + Button×2 / Explore TabsTrigger Tag×4(전체 Selected=True) + Follow Button×2 / Trending Avatar XL×4 + Creator Badge Pro×4 / Popular Avatar Medium×2 + Badge BTS×2 + Button Icon×2 + Link "더보기" / Challenge Bridge Challenge Mini Card×2 + Button Secondary → arrow-right / BottomNavBar → TabBar Active=Home. **토큰 바인딩 변수 4종**: card/foreground/muted-foreground/border (텍스트 26건 + fill·stroke 4건). **네이밍 정리**: 39 rename (Container/Background/Heading/Margin). QA Gates: G1/G3/G5 PASS, G2 8/10 PASS (Profile Card/Lounge Card NA — Stitch hero image 중심 구조 불일치), G4 PARTIAL. **주요 학습**: Navbar Center Slot 기본값 활용(Slot setProperties 불가 → variant+TabsTrigger Title 조정) / Navigation Button arrow-left → swapComponent(menuIcon) / variant 변경 후 자식 stale → re-query / Challenge Mini Card 기본 537×713 → FIXED+resize 필수 / chip 컨테이너 layoutMode=NONE → HORIZONTAL 변환. 리뷰: `reviews/2026-04-22_stitch-lounge-cds-migration.md` | 2026-04-22 |
| **Stitch 사본 `25548:18524` 이미지 맥락 교체** | Rev.20 후속 1에서 사용자가 만든 사본 "4"(`25548:18524`, 375×2019, `14332:285690` 페이지)의 13 이미지 노드 중 11건 교체. 초기 제안(Stitch "3"(`25577:23386`) + page pool 혼합) → 사용자 정정 "스티치 거 제외한 나머지 리소스 중에서". **Stitch 34 해시 화이트리스트 제외** 후 `14332:285690` SECTION 3종(Tab_feed / Consumer Use Case / Creator Case)만 스캔 → 109 unique non-Stitch 풀. **교체 결과**: §4.3 Spotlight `3f3317f1`(Consumer UC Header Background 375×302) / §4.4 Card 2·3 `024e1518`·`0ca588e2`(Consumer UC 167×221 Image) / §4.6 Card 1~4 `51d02539`·`97a9e89b`·`89bd8270`·`ed15a4f5` / §4.8 Challenge 1 `07cd6d68` / §4.8 Challenge 2 `63a728a2`(Tab_feed "Challenge Mission Card Thumbnail" — 이름 자체가 맥락 매칭) / §4.8 Avatar 1·2 `7439ea93`·`1967330d`(Tab_feed Profile Image 62×62). 중간 시도에서 Tab_feed Frame 2608560(`9997a553` 키보드)/Tab_feed 도시풍경(`7fac65e8`)/SUNO 제품(`8e497ea1`)/AI 테크(`789d0cee`) 등 컨텍스트 불일치 4건 재교정. 변경 후 §4.8 Challenge 2 노드 ID stale(`I25553:53407;20205:2144` 재사용 무효) → 이름+해시 재탐색 패턴 적용. 유지: §4.4 Card 1(`644b0532`) + §4.3 logo(`32f351b8`). Figma 상 직접 편집, 로컬 파일 변경 없음. | 2026-04-22 |

---

## 다음 TODO

**P0 (프로덕트 디자인):** ✅ 완료 (2026-04-20)
1. ~~방장이 아직 일정을 정하지 않은 상태로 초대받는 경우 플로우 삭제~~ ✅
2. ~~라운지 소식 작성할 때, 챌린지별 소식은 잠금 상태(슈퍼 크리에이터 구독 유도) 표기~~ ✅

**P0 (CDS 컴포넌트):**
3. Slot → Instance Swap 전환 (~25건, 단일 인스턴스 패턴)
4. Participant Card 분리 — `Participant Card`(미인증 12 variant) + `Participant Card Authed`(인증 3 variant). 프로퍼티 완전 분리

**스크린 리뷰 (Creator Case 잔여):**
6. Creator Lounge Updates Screen 리뷰
7. Creator Lounge Chatting List/Screen 리뷰
8. Feed Screen 리뷰
9. 나머지 화면 네이밍 수정 (Updates Content, lets-icons 교체)

**스킬 테스트:**
11. `/review` 스킬 실전 테스트
12. `/make-component` 스킬 실전 테스트

**폰트 전환 잔여:**
13. 프로덕트 파일 인스턴스 오버라이드 잔여분 정리
14. Mixed font 텍스트 수동 정리

**Claude Design PoC:**
15. Claude Design 디자인 시스템 생성 결과 확인 — CDS 컴포넌트 인식 수준 평가
16. 인식 결과 기반 CDS 활용 전략 구체화

**Pencil 이관 다음 세션 재개 지점 (Rev.13 이후):**
17. **렌더 검증** — 34종 신규 reusable PNG export (Pencil 앱 재시작 후 버그 우회)
18. **Illust 업그레이드** — lucide placeholder 8종 → Figma REST API PNG export → Pencil image fill 교체
19. **Layer 3 자동화** — rendered PNG diff 이미지 비교 에이전트 구축
20. **Drift Monitoring** — discovery.json 스냅샷 diff 알림 메커니즘
21. **Pencil MCP Ralph 호환** — subprocess MCP 허용 탐색
22. **재개 키 파일**: `exports/2026-04-20_cds-migration/pen/cds.pen` (활성 편집, 127 reusables), `COVERAGE-REPORT.md`, `qa-tickets.md`, `discovery.json`, `diff-protocol.md`

**모니터링:**
- Figma MCP 커스텀 폰트 지원 출시 시 → Pretendard 복원 검토
- Claude Design Research Preview → GA 전환 시 CDS 연동 PoC 검토
