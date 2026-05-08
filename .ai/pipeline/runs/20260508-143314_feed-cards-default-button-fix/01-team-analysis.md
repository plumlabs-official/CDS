# 01 — Team Analysis: Feed Cards 기본값 보정 + INSTANCE_SWAP 재시도

> Source: 사용자 피드백 (2026-05-08)
> Prior run: `20260508-131502_feed-screen-new-components`

## 1. 사용자 피드백

1. **시각 차이**: Comment Item Right Slot default가 icon-only Button(32×32)인데, 원본 Feed Screen 첫 카드(`24112:14976`)는 Button text **"더보기"** (62×32). 가장 눈에 띄는 차이.
2. **컴포넌트 수 점검**: 4개 컴포넌트 중 기존 CDS로 대체 가능한 것은 활용하고, 커스텀 필요 시 양쪽(원본·수정본) variant 폭발 회피.

## 2. 컴포넌트 재평가 (사용자 원칙: 동일 구조만 대체, 강제 통합 X)

| 컴포넌트 | CDS 후보 | 동일 구조? | 결정 |
|----------|----------|------------|------|
| Reaction Bar | (없음) | - | **유지** |
| Comment Item | CDS `Item` Type=Default(2-line) / Type=Info(22px) | **X** — Item은 vertical 2-line + Slot Left, Comment Item은 horizontal Name+Desc 32px no Slot Left. 구조 다름. extend 시 Item ComponentSet 6→9 variant 폭발 위험 | **유지 (별도 컴포넌트)** |
| Feed Addon Footer | (없음) | - | **유지 (재사용 잠재성)** |
| Feed Card | (없음) | - | **유지** |

→ **4 컴포넌트 모두 유지** (사용자 원칙 적용 시 강제 통합 부적절).

## 3. 액션 플랜

### 3-1. Comment Item Right Slot default 변경 (피드백 1 해결)
- 현재: Type=Default Size=Icon-Small (32×32 icon-only) — 원본 첫 카드 시각 차이
- 변경: **Type=Ghost Size=Small (104×32, label hug → 약 62×32 with "더보기")** 
- 사유: 원본 metadata 기준 첫 카드/네 번째 카드 = 텍스트 "더보기", 다른 카드 = heart icon. text가 더 일반적이며 첫 인상 default로 적합

### 3-2. INSTANCE_SWAP property 재시도
- 직전 run에서 `addComponentProperty(name, "INSTANCE_SWAP", key, ...)` 호출이 "Property value is incompatible with component property type" 에러로 실패.
- 5가지 default value 형식 테스트:

| 테스트 | 결과 |
|--------|------|
| `variant.key` | FAIL |
| `instance.mainComponent.key` | FAIL |
| empty default + preferredValues | FAIL |
| `componentSet.key` | FAIL |
| **`instance.mainComponent.id`** | **PASS** ✅ |

→ Figma plugin API 문서 표기는 "key"이지만 실제로는 **node id**가 작동.
→ Comment Item Right Slot + Feed Card 6 slot props에 INSTANCE_SWAP 적용 가능.

## 4. 산출

- Comment Item: Right Slot default = Ghost Size=Small "더보기" + INSTANCE_SWAP `Right Slot` property 추가 → 5 props
- Feed Card: 6개 INSTANCE_SWAP slot props 추가 (Header / Lounge Card / Reaction Bar / Addon Footer / Comment 1 / Comment 2) → 10 props (4 BOOLEAN + 6 INSTANCE_SWAP)
- Reaction Bar / Feed Addon Footer: 변경 없음 (probe pass 그대로)

## 5. Risks / 검증

- INSTANCE_SWAP `id` 기반 default가 publish 후 라이브러리 호환되는지 검증 필요 (id는 file local, key는 cross-file 일반적). 만약 publish 후 동작 깨지면 fallback 으로 nested instance level swap 운용 유지.

## 6. Out of Scope (이번 run)

- Use site replacement 6건 (CDS publish 사용자 액션 후 별도 run)
- Cross-run lounge-update-item Reaction Bar 분기 정리
