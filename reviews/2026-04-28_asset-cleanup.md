# Asset Section Cleanup — Wave 0~4

> 2026-04-28 | Plan: `~/.claude/plans/codex-plan-imperative-flame.md` v3 | Codex peer review: 2 rounds

## Wave 0 Canary 결과

| 항목 | 결과 |
|---|---|
| 0.1 swapComponent reactions 보존 | inst root + parent wrapper ✓, instance descendant는 자식 이름 변동 시 path 미스매치 |
| 0.2 variant value rename 자동 재매핑 | ✓ 인스턴스 mainComponent.id 동일, name + componentProperties.value 자동 갱신 |
| 결정 | Wave 3은 swap이 아닌 rename으로 처리 → reactions 위험 0, manualRestore=false |

## Wave 1 결과

| 작업 | 결과 |
|---|---|
| `Container Asset` (`20197:1531`) → `Asset Set` rename | ✓ |
| Creator Badge → `Container Badge` (`20144:1140`) 이동 | ✓ |
| Circle Progress → `Container Progress` (`20085:30053`) 이동 | ✓ |
| Gift Illust → Gift Illustration | ✓ |
| Ticket Item Illust → Ticket Item Illustration | ✓ |
| 11개 컴포넌트 publish key 보존 | ✓ keyDiffs 0건 |
| CDS 내부 nested 사용처 카운트 | 233 → 233 (delta 0) |

## Wave 2 결과

| 삭제 | 사용처 (재검증) | 결과 |
|---|---|---|
| Bell Image (`20324:2514`) | 0 | ✓ removed |
| Fire / Scale=16 (`20199:7033`) | 0 | ✓ removed |
| Contact Illustration / Type=Size220 (`20358:7657`) | 0 | ✓ removed |
| 사용처 카운트 | 233 → 233 (delta 0) | ✓ |

## Wave 3.1 결과 — Character Illustration

- Variant `Context=certifications` → `Context=Certifications` rename
- Component key 보존 (`2b0693fdf6efc24924a12cd5b42b8771ccc59fe4`)
- CDS 내부 사용 0건 (자동 재매핑 해당 X)
- 프로덕트 파일 사용 3건 — Wave 4 publish 후 자동 갱신 예정

## Wave 3.2 — Circle Progress (진행 중)

### Component Creation Decision Gate

| 항목 | 값 |
|---|---|
| sourceUnitNodeId | `20348:2520` (Percentage=35%), `20348:2522` (Percentage=100%) |
| candidateComponents | 동일 set `Circle Progress` (`20348:2521`) 내부 variant 확장 |
| decision | `extendExisting` |
| decisionReason | 기존 시각 패턴(stroke ring + gradient arc) 동일. 단일 axis(Percentage) 확장. variant explosion 위험 낮음 |
| rejectedOptions | `createNew`(별도 컴포넌트는 사용처 swap 부담), `reuseExisting`(0/25/50/75 step 부재) |
| variantExplosionRisk | 낮음 (단일 axis, 4 추가 → 2→6) |

### 변경 사항
- `Percentage=35%` → `Percentage=35` rename
- `Percentage=100%` → `Percentage=100` rename
- 신규 variant 4종: `Percentage=0`, `=25`, `=50`, `=75`
- 시각: 100% 패턴 base, `endingAngle = 0.697 + (percentage / 100) × 2π`

## Wave 3.3 — Ticket Item Illustration (대기)

### Component Creation Decision Gate

| 항목 | 값 |
|---|---|
| sourceUnitNodeId | `20383:5285`, `20383:5289`, `20383:5295` (1, 5 More, 10 More) |
| candidateComponents | 동일 set `Ticket Item Illustration` |
| decision | `extendExisting` |
| decisionReason | 기존 일러스트 보간 형태 추가. axis 변동 X |
| rejectedOptions | 없음 |
| variantExplosionRisk | 낮음 (3 → 4) |

### 변경 사항
- `Quantity=5 More` → `Quantity=5`
- `Quantity=10 More` → `Quantity=10`
- `Quantity=1` 보존
- 신규 `Quantity=3` (1↔5 보간 SVG)

## Wave 4 — Publish 대기

CDS publish + Challify library update 사용자 수동 작업 필요 (Plugin API에 publishLibraryAsync 부재).
