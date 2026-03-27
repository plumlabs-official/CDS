# Session Memory

> 세션 단기 기억 (compact 후 이어갈 내용)
>
> Last updated: 2026-03-27

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

## 현재 세션 (2026-03-27)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| **Figma MCP Write 리서치** | /research — 3/24 MCP 서버 오픈 베타 조사. 3개 트랙(First Draft/Make/MCP+Skills) 분석. 18소스, 91% 신뢰도. 리포트: `report/2026-03-27_figma-design-system-ai-generation.md` |
| **Figma MCP Write + TDS Skills 플랜** | /director 플랜 모드 — 공식 Skills 래퍼 패턴 + TDS 커스텀 3개. /team 리뷰로 충돌 10건 식별 (HIGH 2, MED 5, LOW 3). 플랜: `~/.claude/plans/cuddly-honking-lantern.md` |
| **MCP 서버 교체** | `figma-developer-mcp` (third-party, API 키) → 공식 Figma MCP (`mcp.figma.com/mcp`, HTTP, OAuth). 백업 완료. **OAuth 인증 필요 (다음 세션 재시작 후)** |

### 다음 세션 TODO

**즉시 (Phase 1 잔여):**
1. 세션 재시작 → OAuth 인증 (브라우저)
2. 도구 검증 T1~T6 (get_design_context, get_variable_defs, search_design_system, create_new_file, use_figma, Skills 경로)
3. CLAUDE.md 도구명 업데이트 (get_figma_data → get_design_context)
4. MCP 서버 scope 결정 — 현재 TDS 프로젝트 로컬에만 추가됨. 글로벌로 변경 여부

**Phase 2 (Skills 작성):**
5. figma/mcp-server-guide 레포에서 공식 Skills 복사 (figma-use, figma-generate-design, figma-create-new-file 등)
6. tds-naming-enforcer 커스텀 Skill 작성 (rules.ts → rename-pipeline.md 자동 생성)
7. sync-figma-token Fork + TDS 변수 매핑
8. tds-property-optimizer, tds-qa-auditor 커스텀 Skill

**Phase 3 (검증):**
9. Draft 파일에서 통합 테스트 S1~S6

---

## 이전 세션 (2026-03-20)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| **Content Header 슬롯 전환** | 6개 variant 모두 Right Slot(SLOT) 적용 — Left 3개 + Center 3개. 교체 가능한 우측 요소는 variant 아닌 슬롯이 정석 |
| **Drawer Type=Select 삭제** | 사용처 0 (Screen 전환으로 불필요). Drawer는 White/Black 2개만 유지 — 껍데기(Handle+Status+Header+Slot+Footer) Boolean on/off 패턴 |
| **Challenge Invite Screen QA — 92/100 PASS** | 1차 80.4 CONDITIONAL → 수정 후 92 PASS. 불필요 래퍼 제거, 자동생성명 수정, 토큰 바인딩, 색상 통일 |
| **슬롯 vs variant 기준 정립** | 교체될 수 있는 자리 = 슬롯, 같은 것의 시각 변형 = variant |
| **1곳 전용 컴포넌트 불필요 원칙 확인** | Slogan Area, Ticket Item, Select Trigger, ToggleSwitch 등 — 재사용 없으면 로컬 프레임 유지 |
| **TDS 라이브러리 오타 발견** | `Ticek Item Illust` → `Ticket Item Illust` (원본 수정 필요) |
| **Onboarding_invite 섹션 배치 QA — 13/13 PASS** | 전체 PASS (97~100점). 공통 이슈: Actions absolute 5건 (Screen AL 마이그레이션 대상), 네이밍 Minor 7건. 리포트: `reviews/2026-03-20_qa-onboarding-invite-section.md` |
| **네이밍 Minor 수정 (사용자)** | CTA Group, Text InputName ×2, Friend List Gruop, 트레일링 스페이스 등 수정 완료. `TabsList Primary/ChallengeState` 위치 안내 (21555:20030, Chatting Screen) |

### 다음 세션 TODO (3/21)

**우선:**
1. TDS 컴포넌트 슬롯 점검 — 슬롯 처리 가능성 높은 곳 체크 + 반영
2. TDS 라이브러리 섹션 재분류: Primitives < Components < Blocks
3. 재분류 기준에 맞춰 분리/통합 적용

**잔여:**
- 5개 스크롤 화면 Screen AL 마이그레이션 (Actions absolute → Body fill scroll-y + Actions hug)
- Renamer 리로드 → 테스트 (setBusy 수정 확인)
- `Ticek Item Illust` TDS 원본 오타 수정
- Onboarding Screen Slogan Area → AL hug 전환

**미션 (3/17 기록, 진행 중):**
1. 챌린지 현황 그룹 진행도 TDS 컴포넌트 제작
2. 친구 리스트 컴포넌트 + Marquee 커스텀
3. 초대권 상점 전체 컴포넌트
4. 아이콘/버튼/프로필이미지 전수 점검
5. 온보딩 전체 TDS 교체

---

## 이전 세션 (2026-03-17)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| **프리미티브 도형 스킵** | Vector/Line/Ellipse/Rectangle/Star/Polygon 타입 리네임 스킵 처리. Vector→Unnamed Section 버그 해소 |
| **qa-rubric.md v1.1** | v2.0 정책 반영 — Content 금지, CTA 감점, 접미사 중복 감점, Body 허용어휘, 래퍼 우선순위, Sheet→Drawer |
| **rules.ts v2.0 정합성 수정** | `BANNED_SUFFIXES`에 `Content` 추가 + `STRUCTURAL_LAYER_NAMES`에서 body/content→`Body` 변경. 빌드 25.2kb |
| **Step 7 과잉 수정** | `Actions`→`Actions Area` 버그 — Step 7(역할 접미사 추가)이 사용자 의도적 이름에도 발동. `bannedRemoved` 플래그 추가로 금지어 제거 후에만 Step 7 실행하도록 수정 |
| **naming-policy v2.0 클린 재작성** | 4회 개정 누적 모순 7건 해소. Content 완전 제거(Main Content→Body). CTA 금지. 복수형 제거. 역할명/Area/Group 3개만. ALLOWED_ROLES Content→Body |
| **naming-policy v1.2.1** (/director) | 피드백 5건: 복수형 제거 + 사용처 규칙 + 접미사 중복 금지 + §2/§3/§9 예시 정합성 + Sheet→Drawer + INSTANCE skip + isTDSInstance 방어 + toTitleCase |
| **naming-policy v1.2** (/director) | Content 래퍼 접미사 폐기→Area 통일. 래퍼 우선순위: 역할명>Area. toTitleCase 추가. determineRole Content 폴백 제거 |
| **Figma 구조 리뷰 (혼합)** | 챌린지 상세: Screen scroll→Body scroll 전환 + Top Bar 고정 + Navbar를 Body Content 안으로 이동. 컴포넌트화 기준 논의 — Title+Subtitle 반복 패턴은 Content Header 인스턴스 사용 권장 |
| **Dissolve 기능 시도 → 롤백** | Container 다중 자식 해체(Dissolve) 구현 → 테스트 중 AL 부모에서 StatusBar 고정 해제 문제 발견 → v1.2 전체 롤백. 최상위 scroll vs Body scroll 논의. toTitleCase(body→Body) 보류 |
| **Renamer 리팩토링** (/director) | 파이프라인 누적 변환 + 역할 중복 방지(Area Area 버그) + ES6 var 통일 + require→import + 레거시 제거. Gate 5/5 PASS |
| **Renamer v1.1** | 1:1 래퍼 감지+Unwrap UI + 시맨틱 역할(Area/Group/Content) 자동 할당 + PascalCase→Title Case Step 2.5 수정. Screen Onboarding QA 78.5→91.5 PASS |
| **Phase 2-4 완료: 문서 수정 + 레거시 삭제 + 빌드 검증** | 11문서 수정 + 16항목 삭제 + code.ts 1980→120줄 + 빌드 22.6kb (90%↓). 깨진 참조 0건 |
| **Renamer Phase 1 구현 완료** (/director) | renamer/ 4파일 + code.ts 핸들러. 빌드 성공 219.2kb. Phase 2~3 다음 세션 |
| **전체 정리 플랜 v4.0 확정** (/team Ralph 2R Amb 0) | 삭제 16건 + 수정 11건 + 신규 4건. 문서 의존성 체인 전수 추적. Phase 1~4 실행 순서 |
| **레거시 재판정: 유지 5→2개** (/team Ralph 2R) | Detach/DeleteHidden/Groups→Frames 삭제. Docs Generator+Migrator만 유지 |
| **자동 리네이밍 플러그인 설계** (/team) | renamer 모듈 구조. Mode 1 Product + Mode 2 TDS Library. 규칙 기반(AI 불필요) |
| **`/qa` 첫 테스트: Sheet Invite** | 96.8/100 PASS. R2 순서역전 1건 + R4 Boolean 접두어 4건 |
| **Figma 레이어 네이밍 리서치** (/research 5건 병렬) | Figma 공식, Container vs Wrapper, Title Case, shadcn 패턴, Figma-to-code 영향 |
| **네이밍 정책 v1.1 확정** (/team 2회) | Container 금지 + Content/Area/Group 대체 어휘. Title Case 공백. Property camelCase |
| **바이브코딩 QA 루브릭 v1.0 생성** (/director) | 8축 루브릭 + Figma Make 10건 피드백 + 네이밍 정책 반영 |
| **`/qa` 커맨드 생성** (/director) | Figma MCP 2단계 조회 + 8축 점수 + PASS/CONDITIONAL/FAIL |
| **QA 구현 플랜 최종 정리** (/director) | Phase 0 리서치 → Phase 1 루브릭 → Phase 2 검증 → Phase 3 실전 |
| **빌드 수행** | git pull 후 dist/code.js 없음 → `npm run build` 실행 (25.4kb) |
| **`/qa` Screen Onboarding Input Name — 97.5/100 PASS** | R1(100) R2(100) R3(80) R4(100) R5(100) R6(90) R7(100) R8(100). Major 3건: Screen/Body `mode:none`(absolute), Screen fill 토큰 미바인딩 |
| **모바일 Screen AL 패턴 확립 (혼합)** | Screen column AL + First on top 패턴. 온보딩+챌린지 진행 2화면 검증. Status Bar sticky 상단 고정, Body fill scroll-y, Actions hug/absolute. fixed→fill 사이징 전환 필수 |
| ├ 온보딩 Input Name AL 전환 (사용자) | Screen column → Top Bar sticky + Navbar fixed60 + Body fill(scroll) + Actions hug. Input Area justify:center로 중앙정렬 해결 |
| └ 챌린지 진행 AL 전환 (사용자) | ChallengeState Area fill scroll-y + Drawer absolute. First on top으로 Status Bar z-index 해결 |

### 모바일 Screen AL 패턴 (확정)

```
Screen (column AL, First on top)
├── Status Bar (fill/fixed 44, sticky) — z-index 최상위
├── Navbar (fill/fixed 60)
├── Body (fill/fill, scroll-y, clip content)
│   └── 스크롤 콘텐츠
└── Actions (fill/hug) 또는 Drawer (absolute)
```

- `First on top` = 첫 번째 자식이 z-index 최상위 (스크롤 콘텐츠가 Status Bar 위로 덮는 문제 해결)
- 자식 사이징: `horizontal: fixed 375` → `fill`로 전환 필수
- 중앙정렬 필요 시: 래퍼 프레임 (fill/fill, justify:center)

### 잔여 + 다음 세션 TODO

**즉시:**
- Figma 리로드 → Renamer 테스트 (bannedRemoved + Content 금지 + body→Body 확인)
- `Header Area Area` 등 레거시 이름 수동 수정
- 나머지 화면에 모바일 Screen AL 패턴 적용 (사용자 진행 중)

**Renamer 한계 — 에이전트 네이밍 검토:**
- 사용자가 "에이전트가 스크린샷+구조 기반으로 네이밍 보정하면 좋겠다" 의견 제시
- 방향: Figma 플러그인 UI에서 Claude API 직접 호출 (로컬 서버 없이)
- 타이밍: naming-policy v2.0 안정화 후

**QA/검증:**
- `/qa` 검증 2건 남음 (채팅/챌린지진행) + 감점 캘리브레이션
- 기존 화면 Container→Area 마이그레이션 (Renamer 일괄 실행)

**리서치:**
- Phase A (RS1/RS2/RS3) 미실행
- Phase B (RS4/RS5/RS6) 미실행

---

## 이전 세션 (2026-03-16)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| 챌린지 카드 4종 바이브코딩 적합성 분석 (/team) | 수정 33건 확정. meetings/ 기록 |
| 4계층 구조 평가 (/team) + GPT 컨설팅 | Primitives/Composed/Domain Blocks/Layout 4단계 분류 제안 |
| **Phase 0~3 수정 실행 — 31/33건 완료 (혼합)** | Claude 검토 + 사용자 Figma 수정 |
| ├ Phase 0 네이밍 13건 ✅ | Text→역할명, Blur:mask-group→Gradient Overlay, Sophie Tan→Name 등 |
| ├ Phase 1 Description 충돌 5건 ✅ | Thumbnail: Description→Subtitle, Header: Description→Timer Label |
| ├ Phase 2 프로퍼티 명확화 7건 ✅ | Mission Title→Title, Show 접두어 4건 |
| ├ Phase 3 아이콘 6/8건 ✅ | Huge/Phosphor→Lucide 교체. play-fill, pencil-plus 패스 |
| └ ChallengeCard → Challenge Mission Card 리네이밍 (사용자) | 전체 서브컴포넌트 포함 |
| Icon Unifier 플러그인 플래닝 (/director) | 펜딩. plans/ 파일 보존 |
| tds-overview.md 작성 | GPT 컨텍스트용 TDS 개요 문서 |
| **챌린지 진행 화면 TDS 종합 리뷰 (/director)** | 디자인 시스템 B+, 바이브코딩 B-. borderRadius P0 철회(토큰 확인) |
| **챌린지 상세페이지 컴포넌트 탐색** | Shadcn Kit 매핑 완료. Accordion 1순위, List/Item 참고, 활동 일정 커스텀 |
| 일감 정리 | Migrator(✅), Variable 2개(패스), 인스턴스 테스트(✅) |
| **Accordion Slot 패턴 설계 (/team)** | Slot 1개 vertical AL 채택. Slot2 삭제, hug height, Show Boolean 추가 |
| **Breadcrumb + Profile Card 매핑 (/team)** | Category→Breadcrumb 사용, User Container→Profile Card Type=Challenge variant 추가 |
| Accordion 스크롤 수정 | TabsList Tag Fill width + Clip content로 해결 |
| Disclaimer 별도 컴포넌트 결정 (/coach) | Accordion Type으로 통합 부적합 — 정적 텍스트, 접기 불필요 |
| Profile Card Type=Challenge Detail 네이밍 (/coach) | 다른 챌린지 컴포넌트에서도 프로필 사용 → Detail 구분 필요 |
| **Block 컴포넌트화 불필요 결정 (/team)** | Breadcrumb+ProfileCard+Period 묶기 → 1회 사용, 기준 미달 |
| **Item Type=Info 추가 (사용자)** | 기간/가격 등 icon+label+value 패턴. Item COMPONENT_SET에 Type=Info variant 추가 |
| **Profile Card Type=Flip (사용자)** | Challenge Detail → Flip 리네이밍. 이름 작게+제목 크게 역전 패턴 |
| **챌린지 상세페이지 전체 체크** | 모든 TDS 컴포넌트 적용 확인. Frame 이름 정리(→Container Challenge Info), Disclaimer body 안으로 이동 |
| **채팅 화면 TDS 컴포넌트화 플래닝 (/team)** | shadcn Kit Message 편입 Phase 0-5 확정. meetings/ 기록 |
| **Message 컴포넌트 TDS 편입 완료 (사용자)** | Kit에서 복사 → 6 variants (Received/Sent text/attachment + Announcement + Date Separator). TDS Avatar 교체, Pretendard, radius/color 커스텀, Boolean 프로퍼티(Show Reactions, Show Button) 추가 |
| **채팅 화면 바이브코딩 핏 리뷰 (/team) — PASS 90/100** | TDS 인스턴스 100%, 네이밍 시맨틱 완료. Container Chat Input absolute 레이아웃 -10점 |

### 잔여

- 더블 스페이스 오타 3곳: Host Info, Header, Addon Footer
- Icon Unifier 플러그인 구현 (펜딩)
- Phase 3 패스 2건: play-fill, pencil-plus (Lucide 대안 불만족)
- **검증 필요**: Icon 터치영역 44px 검증, 비활성 텍스트 대비 검증
- **챌린지 상세페이지**: Breadcrumb(✅) + Profile Card Flip(✅) + Item Info(✅) + Frame 이름(✅) + Disclaimer 위치(✅) — 완료
- **채팅 화면 다음 단계**: 프로덕트 디자인 화면에 Message 인스턴스 적용 + Chat Input 조합 + 오늘 인증 현황 섹션
- 사용자 제안: TDS `20199-6244`(List/Item 패턴) + `20145-10532` & `20159-2721`(활동 그리드) 활용

### 내일 미션 (2026-03-17)

| # | 작업 | Figma 참조 |
|---|------|-----------|
| 1 | 챌린지 현황 그룹 진행도 TDS 컴포넌트 제작 | `DxrzwmdzqAi4m4F0pp83gd` `18324-4876` |
| 2 | 친구 리스트 컴포넌트 제작 + Marquee 커스텀 | `DxrzwmdzqAi4m4F0pp83gd` `18603-3310` |
| 3 | 초대권 상점 전체 컴포넌트 제작 | `DxrzwmdzqAi4m4F0pp83gd` `18171-6479` |
| 4 | 아이콘/버튼/프로필이미지 전수 점검 — Slot(다양한 포맷) vs Icon Scaler vs 프로필 이미지 단독 판정 | |
| 5 | 온보딩 전체 TDS로 교체 | |

---

## 이전 세션 (2026-03-15)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| Content Header Slot에 Auto Layout 추가 | Hug/Hug 설정, Padding 0/Gap 0 |
| 챌린지 카드 하단 구조 결정 | Content Header 대신 카드 내부에서 서브타이틀+타이틀+버튼 직접 구성 (수직 구조이므로) |
| Challenge State Card 내 Content Header 사용 적절성 확인 | 수평 구조 일치, 패딩 24→12 오버라이드는 토큰 범위 내. 적절 |
| Lucide 아이콘 통일 보류 | 마지막에 일괄 처리 결정 |
| Composed 완전분해 /director QA — PASS | Tabs 인스턴스 리네임(Primary→Section, Secondary→Toggle), Content Header 통일, Card wrapper명, Sheet 슬래시명 수정 확인 |
| **Participant Card 설계 + 1:1 빌드** | 아래 상세 |
| ├ Tooltip Left Slot 확장 (혼합) | Kbd→Slot 교체, 20 variant 전체. Label Boolean 추가 |
| ├ Shadcn Product Card + Profile Card → TDS 복사+Migrate | 베이스 구조 확보 |
| ├ State variant 구조 결정 | State(Not Authed/Authed/Empty) × Self(Self/Other) × Scale(1:1/4:5/9:16) |
| ├ Determined variant 제거 → Determination Boolean | Tooltip 인스턴스 내부에서 상태 제어 |
| ├ Pending State 제거 → Empty로 통합 | Avatar Type 스왑으로 처리 (Invite Enabled/Disabled/Fallback/Anonymous) |
| ├ Avatar Type 확장 (사용자) | +Invite Enabled, Invite Disabled, Anonymous = 55v (5 Type × 11 Size) |
| ├ Profile Card에 Icon Slot Boolean 추가 (사용자) | 호스트 뱃지 표시 제어 |
| ├ 1:1 variant 5개 완성 (사용자) | Not Authed Self/Other, Authed Self/Other, Empty Other |
| ├ /director QA — CONDITIONAL PASS → PASS | borderRadius 8→12 수정 진행 중 |
| └ 프로덕트 디자인에 적용 테스트 | 4개 인스턴스 정상 작동 확인 |
| **Participant Card Scale 복제 완료 (사용자)** | 1:1 → 4:5 + 9:16. 15 variant 전부 존재 |
| **Participant Card Left/Right Slot 제작 (사용자)** | 2컬럼 masonry 배치 패턴. Left: 9:16→1:1→4:5, Right: 1:1→9:16→4:5 |
| **Participant Card 프로덕트 디자인 최종 체크** | 너비 불일치(168 vs 167.5) 발견 → 사용자 패스 |
| **Bottom Tab Bar 제작 진행 중 (혼합)** | 아래 상세 |
| ├ 프로덕트 디자인에서 복사 → TDS Container Navbar에 배치 | |
| ├ 아이콘 5탭 네이밍 정리 | 홈, 피드&라운지, 챌린지만들기, 할 일, 마이페이지 |
| ├ 아이콘 에셋 10개 COMPONENT 등록 (사용자) | On(Filled)/Off(Stroke) × 5탭. Component Tabbar Icon COMPONENT_SET |
| ├ Tab Bar COMPONENT_SET 5 variant 완성 (사용자) | Active=Home/Feed/Make/Task/Profile |
| ├ Badge 작업 중 → Notification Badge 정합성 이슈 발견 | 공용 컴포넌트에 stroke 추가 시 영향도 미확인 |
| └ 정합성 미확인 패턴 lessons-learned + CLAUDE.md 규칙 추가 | /team 논의 후 재발방지 기록 |
| **Bottom Tab Bar 구조 리뷰 (/team)** | 네이밍 3건 + Badge 통합 방향 확정 |
| **Tab Bar 완성 (사용자)** | 네이밍 수정 (TabBar/TabBar Icon/variant값 단축) + Reddot Stroke Boolean + Badge Boolean + Migrator 완료 |
| **버튼과 뱃지 아이콘 크기 최적화 (사용자)** | 완료 |
| **챌린지 리스트 카드 구조 결정 (/team)** | 별개 컴포넌트 분리 + Challenge 패밀리 네이밍. Challenge List Card(Composed) + Challenge Mini Card(Primitive). Grid는 레이아웃 패턴 |
| **챌린지 리스트 카드 제작 플랜 리뷰 (/team × 3R)** | R1(82)→R2(92)→R3(96) PASS. Product Category 베이스(Mini) + 신규제작(List). 토큰 2개 신규(Theme), WCAG 4.77:1 AA, Boolean 3/16 유효조합 |
| **Challenge Mini Card 제작 (혼합)** | Product Category Type=Text 베이스 → 164×218, r:8, padding:8, text-sm semibold, shadows/sm. Primitives→Composed로 이동 |
| **Challenge List Card 제작 (혼합)** | Team Card Default detach → Card Body로 활용. Creator Row(Avatar+Name) + Card Body(image fill, gradient, justify-end) + Content(Title+Stats Row+Price Tag). Boolean 6개(Creator Row, Attendee, Rating, Price Tag, Video Duration, Video Button) + Text 5개 |
| **Challenge List Card responsiveness 수정** | 최상위 H:hug, Card Body W/H:fill로 변경. Creator Row off 시 높이 늘어남 버그 수정 |
| **바이브코딩 적합성 QA (/director × 5R)** | 3개 카드 전체 검증. Challenge List Card 39.6, ChallengeCard 27.4, Participant Card 56.4. Critical 8건 + Warnings 10건. FAIL — 네이밍 남용(Text/Description), Blur:mask-group 콜론, prop 설계 결함 |
| **QA Fix Plan v3.1 (/team × 4R)** | DD:97/EL:96/PL:96 PASS. 76건 변경(Rename 43+Remove 2+Structural 10+Property 15+Variant 3+Avatar 3). Phase 0~3 실행 순서 + 이중 Gate(director 85+, team 95+) + 롤백 전략 확정 |
| **챌린지 카드 4종 바이브코딩 분석 (/team)** | 프로덕트 디자인 4개 카드 Figma 직접 조회. 수정 33건 확정: Phase 0 네이밍 13 + Phase 1 Description 5 + Phase 2 프로퍼티 7 + Phase 3 아이콘 8. 아이콘 5종 혼용(Lucide+Huge+Phosphor+Remix+Tabler) 발견 |
| **디자인 시스템 4계층 구조 평가 (/team)** | Foundation→Components→Blocks→Patterns 구조 리뷰. 현재 Primitives/Composed 유지, Blocks는 향후 점진 도입 결정 |
| **GPT 컨설팅: TDS 분류 체계 리뷰** | GPT에 tds-overview.md 전달. Composed가 Block화 위험 지적, Navbar/TabBar=Layout 분리 필요, "독립성" 기준 느슨함 피드백. 4단계 제안: Primitives / Composed / Domain Blocks / Layout |

### Bottom Tab Bar 완성 구조

```
TabBar (COMPONENT_SET) — Container Navbar 내
├── Active=Home/Feed/Make/Task/Profile (5 variant)
└── 각 탭 내부: TabBar Icon 인스턴스 (Reddot Boolean 제어)

TabBar Icon (COMPONENT_SET) — 에셋
├── On: Home, Feed, Make, Task, Profile (Filled)
├── Off: Home, Feed, Make, Task, Profile (Stroke)
└── Reddot Boolean → Notification Badge (Reddot Stroke Boolean) 인스턴스
```

### /director QA 결과 (바이브코딩 적합성)

| 컴포넌트 | R1 네이밍 | R2 레이아웃 | R3 프로퍼티 | R4 합성 | R5 종합 | 평균 |
|----------|:-:|:-:|:-:|:-:|:-:|:-:|
| Challenge List Card | 42 | 45 | 35 | 38 | 38 | 39.6 |
| ChallengeCard (Mission) | 35 | 32 | 20 | 28 | 22 | 27.4 |
| Participant Card | 52 | 65 | 48 | 62 | 55 | 56.4 |

**Critical 8건**: Text 이름 남용, Description 3중 충돌, Blur:mask-group 콜론, 서브컴포넌트 prop 미명시, Video Duration/Button 분리, ID 이름 충돌, Avatar 사이즈 혼재, ChallengeCard 과복잡

### 다음 할 일

| 순서 | 작업 | 비고 |
|------|------|------|
| 0 | **Critical 8건 수정** | 3개 카드 네이밍/프로퍼티/구조 정비 → 재QA |
| 1 | **Migrator 실행** | Challenge List Card + Mini Card 토큰 바인딩 |
| 2 | **신규 Variable 2개** | color.surface.challenge, color.surface.overlay (Theme) |
| 3 | **프로덕트 디자인 인스턴스 테스트** | 성공기준 4개 (피드/그리드/Boolean/토큰) |
| 4 | **챌린지 상세페이지** 컴포넌트 제작 | |
| 5 | **아코디언 + 리스트** 컴포넌트 제작 | |
| 6 | **캘린더** 컴포넌트 제작 | |
| 마지막 | Lucide 아이콘 일괄 통일 (Avatar의 Huge Icons 포함) | |

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
├── figma-plugins/
│   ├── tds/               TDS Tools (Renamer)
│   ├── tds-docs/          문서 생성기
│   └── migrate-to-tds/    TDS 마이그레이션
├── .claude/rules/         네이밍 정책 + QA 루브릭
└── package.json           (v3.0.0)
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
npm run build    # Figma 플러그인 빌드
npm run watch    # watch 모드
```

### 플랜 파일

`.claude/plans/gentle-exploring-quill.md`
