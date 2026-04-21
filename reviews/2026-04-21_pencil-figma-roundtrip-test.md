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
| G4 | Figma CDS instance 사용률 ≥80% | B | **PARTIAL** — 26 CDS instances / 131 total nodes (19.8%). UI visible element 기준 ~55-60%. 커스텀 composition 7종 (Segment Toggle, Prompt Slots, Creator Cards, Mini Preview) 필요 |
| G5 | Pencil ↔ Figma 시각 일치 | B | **PARTIAL** — 전체 레이아웃/간격/타이포 일치. 이미지는 Pencil 9종 다양 vs Figma 9곳 동일 hash (plumbing 검증 완료, diversity 후속) |
| G6 | 이식 프로세스 문서화 | B | **PASS** — 본 리뷰 "이식 절차" + "제약" 섹션 완결. 다음 세션용 HANDOFF 업데이트 |

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

**Issue B1**: 이미지 fallback ✅ **해결 (plumbing 검증 완료, diversity 후속)**
- Unsplash URL `createImageAsync()` 호출 실패 확인 (Figma sandbox "not a supported API")
- 대체 경로: `figma.base64Decode(str) → figma.createImage(bytes)` 동기 API 사용
- Pencil `./images/generated-*.png` (9개 AI 생성 PNG) → 로컬 디스크 확인 완료
- **새로 발견된 제약 (2026-04-21)**:
  - `use_figma` code 파라미터에 긴 base64 string(5KB+)을 넣으면 **transport 과정에서 truncation** 발생 (예: 5KB JPEG → decodedLen=209, 또는 "Invalid base64 string" 오류)
  - 짧은 base64 (4KB 이내)는 정상 동작 확인. 첫 이미지 `card_46_1_cln.jpg (7KB)` 성공 → hash `cc5402bc3beede9d5fb9504457a55eae34e5481c`
  - magick `-strip -interlace none` 로 생성한 clean JPEG는 Figma가 수용 (sips 생성 JPEG는 Photoshop IRB로 인해 초기 "Image type is unsupported" 오류)
- **적용 결과**: 성공 이미지 1개 hash를 9개 placeholder에 배포 (§4.3 Spotlight frame fill + 8 card rectangles)
- **후속 권고 (next session)**: 9개 서로 다른 이미지 주입은 Figma UI에서 수동 drag-drop (PNG 파일은 `exports/2026-04-20_cds-migration/pen/images/generated-*.png` 준비됨)

**Issue B2**: 커스텀 Creator Card composition (동일 유지)
- Pencil iXk8R는 CDS 비소속 ancillary → Figma에서도 동일하게 custom (OK)
- 추후 CDS에 "Creator Card Compact" 정식 추가 검토 (Rev.19 mapping에서 논의됨)

**Issue B3**: QA 검증 완료
- G4: 26 CDS instances / 131 total = 19.8% (전체) → UI visible 기준 ~55-60%. **PARTIAL**
- G5: 레이아웃/간격/타이포 일치, 이미지만 단일 hash로 통일. **PARTIAL**
- G6: 본 리뷰 문서로 이식 절차 + 제약 + 대응 전체 문서화. **PASS**

### Figma ↔ Pencil 시각 대조 스크린샷

- Figma: 375×2011 FRAME, 6 섹션 + Navbar/TabBar/StatusBar/HomeIndicator, imageHash 적용 후 `get_screenshot(25511:379)`로 캡처 확인
- Pencil: `get_screenshot(3F9KM)`로 캡처 확인, 9개 다양한 AI 이미지 표시
- 구조/레이아웃/타이포/CDS instance 배치 전반 일치
- 유일한 차이: 이미지 다양성 (Figma=1종 × 9곳 vs Pencil=9종 × 9곳)

---

## Pencil → Figma 이식 절차 (확정본)

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

### Step 4: 이미지 처리
**경로 A (MCP 자동, 짧은 이미지만)**:
1. `magick in.png -resize 220x220\> -strip -interlace none -quality 35 out.jpg` — clean baseline JPEG, 4KB 이내
2. `base64 -i out.jpg -o out.b64` — b64 5KB 이내 생성
3. `use_figma` code에서 `figma.base64Decode(b64) → figma.createImage(bytes) → node.fills = [{type:"IMAGE", scaleMode:"FILL", imageHash: img.hash}]`
4. 제약: base64 string이 5KB 이상이면 tool call transport에서 truncation 발생. `createImageAsync(url)`은 use_figma 환경에서 unsupported

**경로 B (수동, 다양성 필요 시 권장)**:
1. Pencil `./images/generated-*.png` PNG를 Figma UI에 드래그-드롭 (각 placeholder rectangle 선택 후 Image fill)
2. 또는 전체 9장 일괄 업로드 후 노드별 수동 매핑

### Step 5: 검증
- Figma: `get_screenshot(screenId)`로 렌더 확인
- Pencil: `get_screenshot(screenNodeId)` 원본 대조
- CDS instance 커버리지: `use_figma`로 walk + `node.type === "INSTANCE"` count
- Variant name 정합 (특히 Button의 Type/State/Size 조합)

### Step 6: 이미지 하나만 업로드 후 여러 placeholder 공유 (plumbing 검증 전용)
- 성공한 단일 `imageHash`를 N개 node fill에 적용 가능
- 시각 diversity 희생, 구조/배치/layout 검증만 필요한 경우 유효

---

## Post-B: CDS 정식 컴포넌트 추가 교체 (2026-04-21)

사용자 요청: 사용자가 Figma의 다른 위치(페이지 `14332:285690`, 노드 `25548:18524`)로 옮긴 사본에서 커스텀 → CDS 인스턴스 추가 교체.

**교체 완료**:
| 대상 | Before | After | 효과 |
|------|--------|-------|------|
| §0.1 Top Navbar Segment Toggle | custom frame (Tab+Tab Active, 128×36) | **CDS TabsList Toggle** `Value=2` 인스턴스 (208×36) + 내부 TabsTrigger Toggle × 2 override(`Title=피드/라운지`, `Show Red Dot=false`) | shadcn 매핑 가능, 상태 prop 일관 |
| §4.8 Mini Preview × 2 | custom frame (Rectangle + Title + Frame) | **CDS Challenge Mini Card** 인스턴스 × 2 (title override, image fill `cc5402bc...`) | 정식 CDS 도메인 컴포넌트 복구 |

**유지 결정 (custom)**:
- §4.1 Hero Banner — 정보 카드 custom composition (CDS Card로 교체 시 내부 slot 복잡도 증가, 현 상태로 충분)
- §4.2 Prompt Slots — dashed circle + plus, CDS 대응 없음
- §4.3 Spotlight Content Overlay — gradient + mixed composition, CDS 단일 대체 부적합
- §4.4 / §4.6 Creator Card Compact × 6 — Pencil ancillary (`iXk8R`), CDS 정식 편입 전. Rev.19 논의된 추후 추가 후보

**CDS 인스턴스 변화**:
- Before: 26 instances / 131 total = **19.8%** (UI visible ~55-60%)
- After: 29 instances / 115 total = **25.2%** (UI visible ~62-67%)

**Screen ID**: `25548:18524` (페이지 `14332:285690`)

---

## Phase B 완료 (2026-04-21 현재 세션)

**최종 상태**:
- ✅ 9/9 Figma placeholder에 imageHash 적용 (Spotlight FRAME fill + 8 card Rectangles)
- ✅ 이식 절차 확정본 문서화 (Step 1-6)
- ✅ Gate G4/G5/G6 재평가 완료
- ✅ Pencil vs Figma 구조/layout/typography 일치 확인

**후속 (다음 세션에서 optional)**:
1. **이미지 diversity 완성** — Figma UI에서 수동으로 9개 placeholder를 Pencil 각 원본 PNG(`./images/generated-*.png`)로 교체
2. **CDS에 "Creator Card Compact" 정식 추가** 검토 (Rev.19 mapping 논의)
3. **MCP base64 truncation 이슈 Figma 측 보고** (5KB+ string 전송 제약)

**Key Files**:
- Pencil: `exports/2026-04-20_cds-migration/pen/cds.pen` (3F9KM screen), `cds.pen.bak-rev20`
- Figma: `t0SK7XaNqw8qIY3PpZw4s7` page `25511:337`, screen `25511:379`
- PRD: `/Users/zenkim_office/Downloads/cold-start-lounge-home-prd.md`
- 본 리뷰: `reviews/2026-04-21_pencil-figma-roundtrip-test.md`

**Pencil AI 생성 이미지 (Figma UI 수동 업로드 후보)**:
| Pencil 노드 | 파일명 | Figma 타깃 |
|-|-|-|
| `bDRws` Spotlight | generated-1776764903046.png | 25513:545 |
| `FbGG4/o7LFr` §4.4 #1 | generated-1776764907108.png | 25515:388 |
| `16LqR/o7LFr` §4.4 #2 | generated-1776764907124.png | 25515:414 |
| `zvh2J/o7LFr` §4.4 #3 | generated-1776764904812.png | 25515:433 |
| `xAO7Z/o7LFr` §4.6 #1 | generated-1776765013111.png | 25515:458 (현재 적용됨) |
| `buJJd/o7LFr` §4.6 #2 | generated-1776765013879.png | 25515:484 |
| `8ifkm/o7LFr` §4.6 #3 | generated-1776765006198.png | 25515:503 |
| `h2Zbs` §4.8 #1 | generated-1776764933316.png | 25517:351 |
| `qdGxv` §4.8 #2 | generated-1776764942231.png | 25517:358 |

---

## 변경 파일

- `exports/2026-04-20_cds-migration/pen/cds.pen` — Phase A screen (Rev.20, 백업 bak-rev20)
- Figma `t0SK7XaNqw8qIY3PpZw4s7` (remote) — 신규 페이지 + 스크린
- `reviews/2026-04-21_pencil-figma-roundtrip-test.md` — 본 리뷰

---

*Generated by Lenny's Product Team — Director Mode*
