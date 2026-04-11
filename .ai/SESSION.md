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
| **Slot → Instance Swap 전환 분석** | TDS 전체 26개 컴포넌트 50+ slot 스캔. ~25건 전환 후보 도출 (단일 인스턴스 패턴). 문서화 완료 (`research/2026-04-08_slot-instance-swap-analysis.md`) |
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

---

## 다음 TODO

**P0 (프로덕트 디자인):**
1. 방장이 아직 일정을 정하지 않은 상태로 초대받는 경우 플로우 삭제
2. 라운지 소식 작성할 때, 챌린지별 소식은 잠금 상태(슈퍼 크리에이터 구독 유도) 표기

**P0 (TDS 컴포넌트):**
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

**모니터링:**
- Figma MCP 커스텀 폰트 지원 출시 시 → Pretendard 복원 검토
