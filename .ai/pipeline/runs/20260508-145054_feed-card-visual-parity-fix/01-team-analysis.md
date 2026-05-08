# 01 — Team Analysis: Feed Card Visual Parity Fix (Codex 인계)

> Date: 2026-05-08
> Source: 사용자 보고 "원본이랑 비교 시 아바타 이미지, 챌린지 정보 섹션 구성, 패딩값, A/L 오차가 큼"
> Status: **NEEDS_USER_DECISION** (옵션 A/B/C 중 사용자 결정 후 Codex 진행)

---

## 1. 현재 상태

이전 run `20260508-144125_feed-screen-use-site-replacement`에서 6 use site → Feed Card 인스턴스 교체 완료. Show Sub List/Date Info/Description/Timestamp=false 적용으로 Lounge Card height 196 → 100 (target 96과 4px diff).

| Card # | Source ID (archive) | New Instance ID |
|--------|---------------------|-----------------|
| 1 | `24112:14976` | `28452:1811` |
| 2 | `24112:15039` | `28452:2457` |
| 3 | `24112:15087` | `28452:2749` |
| 4 | `24112:15135` | `28452:3056` |
| 5 | `24112:15182` | `28452:3356` |
| 6 | `24112:15231` | `28452:3659` |

Source 6 frames는 `_Archive Feed Screen 2026-05-08` 페이지(`28452:1633`)에 보존.

---

## 2. 차이점 진단

### 2-1. Avatar 이미지 ✅ 정상 (사용자 첫 인식 정정)
- src Avatar image hash: `334ceb2c5821ca5afa25ae8cdc10f067831d5317`
- new Avatar image hash: 동일
- 사용자가 본 "plus 아이콘"은 Avatar가 아니라 **Profile Card Right Slot**의 default icon

### 2-2. Profile Card Right Slot icon ❌ default plus vs source ellipsis

**원본**:
- Profile Card Right Slot에 Button instance (`Type=Ghost, State=Enabled, Size=Icon-Small`, key `f8137bd3ca033557e1672a99bc11bb31442ec45b`)
- 그 안에 Lucide ellipsis (`d74338a5b0b1681a4952bd2a459ede3121094e61`)

**현 신규 인스턴스**:
- Profile Card의 default Right Slot 내용이 그대로 (default plus icon Button)
- Right Slot이 SLOT 타입이라 setProperties로 직접 swap 불가 — slot 내부 Button instance 교체 필요

**Profile Card Type=Default key**: `3c068b9521f95c956e38764212270c24cf133132`

**원본 Profile Card componentProperties** (참고):
```
↳ Right Slot#20646:62: SLOT (preferredValues: [])
↳ Show Right Slot#20646:56: BOOLEAN value=true
Show Profile#20199:15: BOOLEAN
↳ Show Icon Slot#86059:0: BOOLEAN value=false
Show Body#20199:5: BOOLEAN
↳ Icon Slot#20199:0: SLOT
Show Title#21600:0: BOOLEAN
↳ Body#15737:1: TEXT (date)
↳ Name#15737:0: TEXT (name)
Type: VARIANT (Default)
```

### 2-3. Lounge Card 구조 차이 ❌ (가장 큰 문제 — anatomy 근본 차이)

**원본 LOCAL Lounge Card (24112:14980, 375×96, HORIZONTAL)**:
```
Lounge Card [FRAME, padding 12, gap 12, items-center]
├─ Slot_Left (64×64) → Challenge Thumbnail (Size=2X-Large, Type=Image)
│       image hash: 3f9e7c727af862225db92384efe37b096bf6a0c0 (등불 사진)
├─ Body (231×48, fill, gap 4)
│   ├─ Badge (hidden)
│   ├─ Alert Title (TEXT) — "심으뜸의 작심 3주 다이어트"
│   └─ Attendee (231×20)
│       ├─ Avatar Group (Size=2X Small, 33×20)
│       │       Avatar 6개 with image hashes
│       └─ TEXT — "이연우, 김진형님 외 2K 참여"
└─ Button (32×32, Type=Ghost Icon-Small) → Lucide chevron-right
```

**현 CDS Lounge Card State=1Line (375×100 with Show *=false)**:
```
Lounge Card Slot [INSTANCE, VERTICAL]
├─ Lounge Card frame (375×80)
│   ├─ ↳ Thumbnail Slot → Avatar (Type=Image, Size=2X-Large) ← Challenge Thumbnail X
│   │       default image hash: 9d6dcfc1fb8cd40116ca161e463af1ee400a729e (사람 사진)
│   ├─ Body
│   │   ├─ Title (Updates Badge "Type=Scheduled" + Title TEXT)
│   │   ├─ Subtitle (hidden via Show Description=false but anatomy retains)
│   │   ├─ Date Info (hidden via Show Date Info=false)
│   │   └─ ↳ Info Slot → Lounge Card Addon Block (Type=Attendee, Count="12")
│   │           ← Avatar Group + multi-text X
│   └─ Timestamp
└─ Challenge Sub List slot (hidden via Show Sub List=false)
```

**근본 차이**:
| 영역 | 원본 | CDS Lounge Card |
|------|------|-----------------|
| 목적 | Feed의 Challenge promotion strip | Lounge Updates/announcement card |
| Thumbnail | Challenge Thumbnail (`9a0b0d6737800bc30ecd9a15bddefebfec0b27f3`) | Avatar (Type=Image, Size=2X-Large) |
| Body title | Alert Title (TEXT only) | Title + Updates Badge variant |
| Attendee 표현 | Avatar Group (6 avatars) + multi-text "이연우, 김진형님 외 2K 참여" | Lounge Card Addon Block (Type=Attendee, count number only) |
| 폭/높이 | 375×96 | 375×100 (with show*=false) |

→ CDS Lounge Card 단순 reuse는 사용자 원칙 "동일 구조만 대체"에 어긋남. **컴포넌트 재선택 또는 신규 생성 필요**.

### 2-4. Feed Content Section ❌ 미디어 누락

원본 24112:14994:
- 375×500 frame with Vector child
- Vector(24112:14995) — image fill 보유 가능성 (재추출 필요)

현 신규:
- Feed Content Section frame (gray placeholder)
- 미디어 image fill 적용 안 됨

### 2-5. 패딩 / Auto Layout — minor
- Feed Card Lounge Card Slot 4px height drift (CDS padding 영향)
- Feed Header itemSpacing 0 vs source 10 (single child라 시각 영향 없음)

---

## 3. 수정 옵션

### A. Inner slot 교체 + Right Slot Button swap (현 인스턴스 패치)
- 6 cards 각각:
  1. Profile Card SLOT 내 Button 교체 (default plus → ellipsis Button)
  2. Lounge Card Slot의 Thumbnail Slot 내 Avatar instance 제거 + Challenge Thumbnail instance 삽입
  3. Lounge Card Slot의 Info Slot 내 Addon Block 제거 + Avatar Group(33×20) + 다중 attendee text 삽입
  4. Feed Content Section에 source image fill 적용

**장점**: 신규 컴포넌트 추가 X
**단점**: 
- Slot 깊은 override는 fragile — Lounge Card 자체 design 변경 시 깨짐
- CDS Lounge Card 의도(Updates/announcement용)에 어긋남
- 6 cards 모두 동일 작업, fail point 많음

### B. 신규 `Feed Lounge Strip` CDS 컴포넌트 신설 ⭐ (권장)

**신규 컴포넌트 spec**:
- Name: `Feed Lounge Strip` (또는 사용자 더 좋은 이름)
- Placement: `Components > Composed > Feed Cards > Main content` (sibling to Reaction Bar/Comment Item/Feed Card)
- Size: 375×96, HORIZONTAL, padding 12, gap 12, items-center
- Anatomy:
  ```
  Feed Lounge Strip [COMPONENT, 375×96]
  ├─ Slot_Left (64×64)
  │   └─ Challenge Thumbnail INSTANCE (Size=2X-Large, Type=Image)
  ├─ Body (FILL, VERTICAL, gap 4)
  │   ├─ Title TEXT (text-base SemiBold)
  │   └─ Attendee (HORIZONTAL, gap 4, items-center)
  │       ├─ Avatar Group INSTANCE (Size=2X Small)
  │       └─ Attendee TEXT (text-xs Regular, ellipsis)
  └─ Right Slot INSTANCE_SWAP (default: Button Type=Ghost Size=Icon-Small with chevron-right)
  ```
- componentPropertyDefinitions:
  - `Title` TEXT (default "Title")
  - `Attendee` TEXT (default "이연우, 김진형님 외 2K 참여")  
  - `Thumbnail Slot` INSTANCE_SWAP (default Challenge Thumbnail variant, preferredValues Challenge Thumbnail set)
  - `Attendee Slot` INSTANCE_SWAP (default Avatar Group, preferredValues Avatar Group set)
  - `Right Slot` INSTANCE_SWAP (default chevron-right Button, preferredValues Button set)
  - `Show Right Slot` BOOLEAN (default true)

**연계 작업**:
1. Feed Lounge Strip 컴포넌트 생성 + probes
2. Feed Card의 `Lounge Card Slot` INSTANCE_SWAP default를 Feed Lounge Strip으로 변경
3. 사용자 publish + 라이브러리 업데이트
4. 6 use site 다시 source 데이터 적용 (Title / Attendee text / Avatar Group fills / Challenge Thumbnail fill)

**병행 fix (모든 옵션 공통)**:
5. Profile Card Right Slot Button을 ellipsis로 교체 (6 cards × Header Slot의 SLOT 내부 Button 변경)
6. Feed Content Section image fill 추출 + 적용 (6 cards)

**장점**: 사용자 원칙 정합. anatomy 정확 매칭. SSOT.
**단점**: 컴포넌트 1개 추가, publish/library update 필요.

### C. Feed Card 내부 anatomy를 Local frame으로 변경 (가장 큰 변경)
- Feed Card master에서 Lounge Card Slot INSTANCE_SWAP을 LOCAL frame anatomy(Challenge Thumbnail + Body + Button)로 변경
- Feed Card 자체 재빌드 + 사용자 publish/update
- Feed Card prop 수 변경 (Lounge Card Slot prop 제거 또는 inner swap props 추가)

**장점**: 컴포넌트 추가 X
**단점**: Feed Card 재빌드, 다른 화면에서 Feed Card 재사용 시 Lounge Card 자체 swap 불가능 (옵션성 손실)

---

## 4. 권장 — 옵션 B (정공법)

사용자 원칙 "동일 구조만 대체, 변형 폭발 X" 정합. Feed Lounge Strip은 Feed-specific anatomy의 SSOT가 됨.

---

## 5. Codex 인계 — 작업 순서 (옵션 B 채택 시)

### Phase 1: Feed Lounge Strip 컴포넌트 생성 (CDS file `H36eNEd6o7ZTv4R7VcyLf2`)
- Placement: `Components > Composed > Feed Cards > Main content` (mainContentNodeId `21721:6812`)
- Anatomy: §3-B 기준
- Dependencies (importComponentByKeyAsync로 import):
  - Challenge Thumbnail set: `9a0b0d6737800bc30ecd9a15bddefebfec0b27f3`
  - Avatar Group set: `2e51c2f65048f8ed5cfb7f6a7c4519f2b7896109`
  - Button set: `40aeea83d711664085b19b9470c0718c2ebe10ed`
  - Lucide chevron-right: `9a8fc04c04d6ff98b275787ee5dbd1f6dbf8abe8`
- componentPropertyDefinitions: `Title` TEXT, `Attendee` TEXT, `Thumbnail Slot` INSTANCE_SWAP, `Attendee Slot` INSTANCE_SWAP, `Right Slot` INSTANCE_SWAP, `Show Right Slot` BOOLEAN
- INSTANCE_SWAP default 설정 시 **`mainComponent.id` 사용** (key가 아닌 node id — 직전 run에서 발견된 호환 이슈 우회)
- Probes: long Title (50자) / long Attendee (60자, ellipsis) / 다양한 Avatar Group sizes / Right Slot swap

### Phase 2: Feed Card master에서 Lounge Card Slot default 변경
- Feed Card (`21732:3062`) 내 Lounge Card Slot 자식 인스턴스를 신규 Feed Lounge Strip 인스턴스로 교체
- `Lounge Card Slot` INSTANCE_SWAP property의 default value를 신규 Feed Lounge Strip의 `mainComponent.id`로 갱신 (또는 prop 재생성)
- 또는 prop name을 `Lounge Strip Slot` 등으로 rename (선택)

### Phase 3: Profile Card Right Slot ellipsis 적용 (6 cards 공통)
- 각 use site의 Header Slot (Profile Card instance) 내부에서:
  - `↳ Right Slot` SLOT 노드를 찾고
  - 그 SLOT의 자식(default plus Button)을 제거
  - source의 Button(`f8137bd3ca033557e1672a99bc11bb31442ec45b` Type=Ghost Icon-Small) instance 삽입
  - 그 Button의 `Icon-Only` prop을 Lucide ellipsis(`d74338a5b0b1681a4952bd2a459ede3121094e61`)로 swap
- **참고**: SLOT 내부 children 직접 조작 (slot.appendChild / slot.children[0].remove())

### Phase 4: Feed Content Section image fill 적용 (6 cards)
- Source의 Feed Content Section (24112:14994 등) 내부 Vector(24112:14995 등)의 fills 추출
- 각 신규 instance의 Feed Content Section frame에 fills 적용 (또는 image fill rectangle 삽입)
- **선결**: source Vector의 image fill 존재 여부 재확인 (이전 dump에서는 imageHashes 없었으나 screenshot에서는 보임 — 다른 표현일 수 있음)

### Phase 5: 사용자 publish + library update + use site 재적용
- 사용자 액션 필요
- 그 후 6 use site에 Feed Lounge Strip 인스턴스를 통해 Title / Attendee text / Thumbnail image fill / Avatar Group avatars 적용

### Phase 6: Visual diff 검증
- before/after 스크린샷 6 cards
- 각 card별 height, padding, content 일치 확인

### 산출물
- 신규 component spec: `~/.ai/pipeline/runs/20260508-145054_feed-card-visual-parity-fix/05-implementation.md`
- Before screenshot: `exports/2026-05-08_feed-cards-cds/source-card-1.png`
- After fix screenshot (현재 미흡한 상태): `exports/2026-05-08_feed-cards-cds/new-card-1-after-fix.png`

---

## 6. Source 데이터 참조 (Codex가 use site 적용 시 활용)

각 source feed card의 데이터는 archive page `28452:1633`에 보존된 6 frames:
- `24112:14976` (Feed #1) — 이전 run extracted data 참고
- `24112:15039` (Feed #2)
- `24112:15087` (Feed #3)
- `24112:15135` (Feed #4)
- `24112:15182` (Feed #5)
- `24112:15231` (Feed #6)

각각:
- Profile Card: name / date / avatar fills / Right Slot Button (ellipsis or follow+ellipsis)
- Lounge Card: Title / Attendee text / Avatar Group avatars (image hashes 보존) / Challenge Thumbnail fills
- Reaction Bar: Like Count / Reply Count
- Feed Addon Footer: Actor / Count / Status text
- Comment Items: Name / Description / Right Slot Button kind (text 더보기 vs icon heart)
- Feed Content Section: Vector fills (재추출 필요)

---

## 7. 사용자 결정 대기

본 분석 + 옵션 제시 후 사용자가 옵션 A/B/C 선택. 기본 권장 **B**.

선택 후 Codex가 Phase 1~6 진행.
