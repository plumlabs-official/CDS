# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]





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
