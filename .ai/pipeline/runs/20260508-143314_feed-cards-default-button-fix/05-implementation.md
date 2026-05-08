# 05 — Implementation: Feed Cards 기본값 보정 + INSTANCE_SWAP 재시도

> Date: 2026-05-08

## A. INSTANCE_SWAP API discovery

5가지 default value 형식 테스트 (test component `21735:2` 임시 생성 후 cleanup):

| Test | Default 형식 | 결과 |
|------|-------------|------|
| 1 | `variant.key` (`9f23df9c12d85221a7c4d4b8ced58287b17f164a`) | FAIL — incompatible |
| 2 | `instance.mainComponent.key` (`cb7264d3a22e5836f305f22f81fd9ccfeed5b298`) | FAIL — incompatible |
| 3 | empty `""` + preferredValues | FAIL — incompatible |
| 4 | `componentSet.key` (`40aeea83d711664085b19b9470c0718c2ebe10ed`) | FAIL — incompatible |
| 5 | **`instance.mainComponent.id`** (`21721:7471`) | **PASS** ✅ |

→ Figma plugin API 문서는 "key"라 표기하지만 실제로는 **node id**가 작동. 이번 run의 fixes 적용에 활용.

## B. Comment Item 변경 (`21725:2939`)

| 항목 | Before | After |
|------|--------|-------|
| Right Slot default | Type=Default Size=Icon-Small 32×32 icon button | **Type=Ghost Size=Small Label="더보기"** (~104×32 hug) |
| Right Slot Button mainComponent | `9f23df9c12...` (Default Icon-Small) | `cb7264d3a2...` (Ghost Small) — local instance id `21721:7471` |
| Properties | 4 (Name, Show Name, Description, Show Right Slot) | **5** (+ `Right Slot` INSTANCE_SWAP) |
| componentPropertyDefinitions | `Name#... / Show Name#... / Description#... / Show Right Slot#...` | + `Right Slot#21736:0` (INSTANCE_SWAP, preferredValues=Button ComponentSet) |

Probe `21737:3469` (Comment Item instance) → c1 Right Slot mainComponent name = "Type=Ghost, State=Enabled, Size=Small" ✅

## C. Feed Card 변경 (`21732:3062`)

6개 INSTANCE_SWAP slot props 추가 (모두 PASS):

| Slot | nested instance | mainComponent | preferredValues type/key |
|------|-----------------|---------------|--------------------------|
| Header Slot | `21732:3064` | `21732:3020` (Profile Card variant Type=Default) | COMPONENT_SET `43c74e269ea710c0...` |
| Lounge Card Slot | `21732:3101` | `21721:8219` (Lounge Card State=1Line) | COMPONENT_SET `d0b2a310464d...` |
| Reaction Bar Slot | `21732:3166` | `21723:2908` (Reaction Bar) | COMPONENT `1065b60af9b...` |
| Addon Footer Slot | `21732:3185` | `21726:2953` (Feed Addon Footer) | COMPONENT `3a4eb5a7da...` |
| Comment Slot 1 | `21732:3310` | `21725:2939` (Comment Item) | COMPONENT `f2d39007910...` |
| Comment Slot 2 | `21732:3318` | `21725:2939` (Comment Item) | COMPONENT `f2d39007910...` |

componentPropertyDefinitions (10 total):
- `Show Lounge Card#21732:0` BOOLEAN (existing)
- `Show Addon Footer#21732:1` BOOLEAN (existing)
- `Show Comment 1#21732:2` BOOLEAN (existing)
- `Show Comment 2#21732:3` BOOLEAN (existing)
- **`Header Slot#21737:0` INSTANCE_SWAP** (new)
- **`Lounge Card Slot#21737:1` INSTANCE_SWAP** (new)
- **`Reaction Bar Slot#21737:2` INSTANCE_SWAP** (new)
- **`Addon Footer Slot#21737:3` INSTANCE_SWAP** (new)
- **`Comment Slot 1#21737:4` INSTANCE_SWAP** (new)
- **`Comment Slot 2#21737:5` INSTANCE_SWAP** (new)

각 nested instance에 `componentPropertyReferences = { mainComponent: <new prop key>, visible: <existing show key> }` 재바인딩 완료.

Probe `21737:3469` (Feed Card instance) → c1 Right Slot inherited Comment Item's new "더보기" Ghost button ✅

## D. Reaction Bar / Feed Addon Footer

변경 없음 (이전 run에서 정상 동작 확인).

## E. Visual Evidence

- Before: `exports/2026-05-08_feed-cards-cds/feed-cards-group.png` (icon-only default)
- After: `exports/2026-05-08_feed-cards-cds/feed-cards-group-after-fix.png` ("더보기" Ghost default + 6 INSTANCE_SWAP visible in Feed Card properties)

## F. Status

| 한계 (이전 run에 documented) | 해소 여부 |
|------------------------------|-----------|
| INSTANCE_SWAP API 호환 이슈 | **해소** — `mainComponent.id` 사용 |
| Right Slot default 시각 차이 | **해소** — Ghost Small "더보기" |
| Use site replacement BLOCKED | unchanged — CDS publish 후 별도 run |
| Cross-run lounge-update Reaction Bar 분기 | unchanged — 사용자 결정 대기 |

Phase B (Component Creation Probes) 모두 PASS, INSTANCE_SWAP 추가 후 Feed Card probe에서 nested swap 정상 동작 확인.
