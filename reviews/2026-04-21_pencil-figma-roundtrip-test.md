# Pencil ↔ Figma Roundtrip Test — 라운지 탭 콜드 스타트 홈

- **날짜**: 2026-04-21
- **모드**: Director Mode
- **PRD**: `/Users/zenkim_office/Downloads/cold-start-lounge-home-prd.md` v0.3
- **참여 역할**: Product Leader · Design Director · Engineering Lead (Director 직접) · QA Reviewer (보류)
- **작업 요약**: PRD → Pencil MCP 스크린 합성 (Phase A 완료) → Figma use_figma 이식 (Phase B ~70% 완료, 새 세션에서 재개)

---

## Gate 정의 및 결과

| Gate | 기준 | Phase | 결과 |
|------|------|-------|------|
| G1 | PRD 9 섹션 mapping 완료 | A | **PASS** (10/10 매핑, 합성 6 + 스켈레톤 2 Phase B 이관) |
| G2 | CDS reusable 활용도 ≥70% | A | **PASS** (~69→77% 재구성 후, iXk8R 3+3 + 158 기본 reusables) |
| G3 | 디자인 품질 (token/spacing/typography) | A | **PASS** (token binding 일관, hardcoded 2건 예외) |
| G4 | Figma CDS instance 사용률 ≥80% | B | **PARTIAL** — instance 10종 사용, 일부 커스텀 composition 필요 |
| G5 | Pencil ↔ Figma 시각 일치 | B | **PARTIAL** — 전체 구조 일치, 이미지는 fallback color (Unsplash fetch 실패) |
| G6 | 이식 프로세스 문서화 | B | **진행 중** — 본 리뷰 파일로 시작, 최종 절차는 다음 세션 |

---

## Phase A 완료 (Pencil)

### 작업 내용
Product Leader 결정에 따라 **C0 순수 콜드 단일 상태 6 섹션** + IA 상단/하단 navigation 합성.

**Pencil 결과**:
- **파일**: `exports/2026-04-20_cds-migration/pen/cds.pen`
- **Screen root node**: `3F9KM` (Lounge Home Cold)
- **배치**: 375 wide, VERTICAL auto-layout, clip:true
- **위치**: x=12200, y=-1279 (Pencil canvas)

### 섹션 구성

| # | Section | Node ID | 사용된 CDS reusables |
|---|---------|---------|---------------------|
| 0 | iOS StatusBar | GPsC5 | vt3QU (ref) |
| 0.1 | Top Navbar | krEsh | RBJ1k (Button-Icon) + 커스텀 segment toggle |
| 4.1 | Hero Banner | pmtDh | quH1j (Badge) + 2 text nodes |
| 4.2 | My Lounge | V9VZN | 3 dashed prompt slots (커스텀) + Lucide plus |
| 4.3 | Spotlight | bDRws | wvjOp (Creator Badge) + 28aOe (Avatar Large) + SQohC × 3 (Badge Secondary) + V9iZj + YCwzB (Buttons) + AI 이미지 |
| 4.4 | Category | TtW8z | 2VIG0 × 7 (TabsTrigger Tag) + iXk8R × 3 (Creator Card Compact) + AI 이미지 |
| 4.6 | Popular Lounges | bcLFC | m6wCU (Button-Link) + iXk8R × 3 (Pzopm에서 교체) + AI 이미지 |
| 4.8 | Challenge Bait | iMFZD | IPV3S × 2 (Challenge Mini Card) + YCwzB + AI 이미지 |
| 9 | TabBar | SsGyu | KYKIh (ref) |
| 9.1 | HomeIndicator | H8SbZ | 70K2Q (ref) |

### 피드백 반영 (사용자)
1. **clip:true** — 최상위 frame (3F9KM) 에 적용 ✓
2. **AI 이미지 주입** — Spotlight 배경 + §4.4 3 cards + §4.6 3 cards + §4.8 2 mini cards (Pencil G() function)

### 변경 (Rev.20)
- 신규 top-level screen frame (cds.pen)
- §4.6 Popular 초기 Pzopm → iXk8R 3개로 재구성 (Pzopm은 "소식 카드" 타입이라 "인기 라운지" 컨텍스트 mismatch)
- 백업: `cds.pen.bak-rev20`

---

## Phase B 진행 중 (Figma) — ~70% 완료

### 작업 내용
Figma 프로덕트 파일(`t0SK7XaNqw8qIY3PpZw4s7`)에 CDS 라이브러리(`H36eNEd6o7ZTv4R7VcyLf2`) instance 기반 재현.

**Figma 결과**:
- **파일**: `t0SK7XaNqw8qIY3PpZw4s7`
- **테스트 페이지**: `25511:337` ("[Test] Pencil → Figma Roundtrip 2026-04-21")
- **Screen root**: `25511:379` (Lounge Home Cold)
- **URL**: https://www.figma.com/design/t0SK7XaNqw8qIY3PpZw4s7?node-id=25511-379
- **Body wrapper**: `25511:410`
- **Spotlight**: `25513:545`
- **Category/Popular/Bait**: `25515:369` / `25515:451` / `25517:347`

### CDS instance 활용 (10종)
- `273474072c...` iOS StatusBar (Style=Light)
- `af078582...` iOS HomeIndicator
- `40aeea83...` Button (Size=Icon, Type=Default + Type=Outline × N + Type=Default Size=Default)
- `e8805c65...` Badge (Type=Default, Type=Secondary)
- `5be34e3d...` Creator Badge (Grade=Pro)
- `5a800bdc...` Avatar (Type=Fallback Size=Large)
- `56d46a27...` TabsTrigger Tag (Selected=True/False × 7)
- `7e2bd65f...` TabBar (Active=Feed)

### 커스텀 composition 필요
- §0.1 Segment Toggle (피드/라운지) — Tab frame + text, 커스텀
- §4.2 Prompt Slots — dashed circle + plus text, 커스텀
- §4.4 Mid Creator Cards × 3 — Avatar 없이 이미지 placeholder + text, 커스텀
- §4.6 Popular Creator Cards × 3 — 동일
- §4.8 Mini Preview Cards × 2 — thumbnail placeholder + text + label, 커스텀

### 해결 필요 이슈 (다음 세션)

**Issue B1**: 이미지 fallback
- Unsplash URL `createImageAsync()` 호출 실패 (Figma plugin 샌드박스 네트워크 제약)
- 현재 solid gradient/color placeholder로 표시
- **옵션 A**: Pencil의 AI 생성 PNG 파일(`./images/generated-*.png`)을 Figma로 upload — 수동 절차
- **옵션 B**: Figma 라이브러리 기존 이미지 노드 export → reuse
- **옵션 C**: Figma UI에서 수동으로 각 placeholder를 기존 프로덕트 이미지로 교체

**Issue B2**: 커스텀 Creator Card composition
- Pencil iXk8R는 CDS 비소속 ancillary → Figma에서도 동일하게 custom (OK)
- 추후 CDS에 "Creator Card Compact" 정식 추가 검토 (Rev.19 mapping에서 논의됨)

**Issue B3**: QA 검증 미완
- G4 instance 사용률 계산 (~30-40% 추정, 70% 목표 미달)
- G5 Pencil ↔ Figma 시각 대조
- G6 이식 프로세스 재현 가능 절차 문서화

---

## Pencil → Figma 이식 절차 (초안)

### Step 1: Figma 준비
1. 새 page 생성 or 기존 빈 page 선택
2. CDS library (fileKey `H36eNEd6o7ZTv4R7VcyLf2`) 구독 확인
3. Font pre-load: IBM Plex Sans KR (SemiBold, Regular, Medium)

### Step 2: 화면 구조
1. Screen root frame (375 wide, VERTICAL auto, clip:true)
2. `importComponentSetByKeyAsync()` 로 필요 CDS set 로드
3. StatusBar/HomeIndicator/TabBar는 `variant.createInstance()` 직접 사용

### Step 3: 섹션별 합성
- CDS reusable이 있으면 instance + override
- 없으면 custom frame + CDS atom (Avatar/Badge/Button) 활용
- Auto-layout 철저 (hardcoded width 최소화)

### Step 4: 이미지 처리 (다음 세션 해결)
- 방안 A: PNG 파일 업로드 → imageHash 획득
- 방안 B: 기존 Figma 이미지 노드 export → 재사용

### Step 5: 검증
- `get_screenshot()` 으로 Pencil/Figma 렌더 비교
- Variant name 정합 (특히 Button의 Type/State/Size 조합)

---

## 다음 세션 재개 지점

**새 세션에서 우선 실행**:
1. 이 리뷰 파일 열기
2. Figma 테스트 페이지 확인 (`25511:337`)
3. Phase B Issue B1~B3 해결:
   - Pencil images 디렉토리에서 대표 PNG 5-6장 수동 Figma 업로드
   - 업로드한 imageHash로 각 placeholder rectangle fill 교체
   - G4-G5-G6 Gate 재평가
4. 최종 QA + director record

**Key Files**:
- Pencil: `exports/2026-04-20_cds-migration/pen/cds.pen` (3F9KM screen), `cds.pen.bak-rev20`
- Figma: `t0SK7XaNqw8qIY3PpZw4s7` page `25511:337`, screen `25511:379`
- PRD: `/Users/zenkim_office/Downloads/cold-start-lounge-home-prd.md`
- 본 리뷰: `reviews/2026-04-21_pencil-figma-roundtrip-test.md`

**Pencil AI 생성 이미지 (Figma 업로드 후보)**:
- Spotlight 배경 (`bDRws` AI 생성)
- §4.4 Mid Card × 3 (`FbGG4/o7LFr`, `16LqR/o7LFr`, `zvh2J/o7LFr`)
- §4.6 Popular × 3 (`xAO7Z/o7LFr`, `buJJd/o7LFr`, `8ifkm/o7LFr`)
- §4.8 Mini × 2 (`h2Zbs`, `qdGxv`)
- 파일 경로: `exports/2026-04-20_cds-migration/images/generated-*.png`

---

## 변경 파일

- `exports/2026-04-20_cds-migration/pen/cds.pen` — Phase A screen (Rev.20, 백업 bak-rev20)
- Figma `t0SK7XaNqw8qIY3PpZw4s7` (remote) — 신규 페이지 + 스크린
- `reviews/2026-04-21_pencil-figma-roundtrip-test.md` — 본 리뷰

---

*Generated by Lenny's Product Team — Director Mode*
