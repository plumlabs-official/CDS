## QA Report: Challenge Invite Screen / Accepted

> 날짜: 2026-03-20 | 루브릭: v1.1 | 노드: 20381:3706 | 파일: TDS (H36eNEd6o7ZTv4R7VcyLf2)

### 총점: 80.4/100 — CONDITIONAL

| 축 | 점수 | 가중 | 이슈 수 |
|----|------|------|---------|
| R1 TDS 커버리지 | 80/100 | x0.20 | 2 |
| R2 네이밍 | 70/100 | x0.20 | 6 |
| R3 레이아웃 | 90/100 | x0.10 | 1 |
| R4 프로퍼티 | 100/100 | x0.10 | 0 |
| R5 합성 구조 | 50/100 | x0.10 | 3 |
| R6 토큰 | 80/100 | x0.05 | 2 |
| R7 shadcn 매핑 | 90/100 | x0.20 | 1 |
| R8 접근성 | 88/100 | x0.05 | 2 |

### Major 이슈

| # | 축 | 감점 | 내용 |
|---|------|------|------|
| 1 | R1 | -10 | `Select Trigger` (20383:5120) — shadcn Select 존재하나 커스텀 FRAME으로 제작 |
| 2 | R1 | -10 | `ToggleSwitch` (20383:5152) — 수량 카운터, TDS Badge/Counter 없이 로컬 FRAME |
| 3 | R5 | -10 | 중첩 깊이 5단계 (Body 기준) — 불필요 래퍼 제거 시 4단계로 개선 가능 |
| 4 | R6 | -10 | `style_6D4NH9` ("인 초대권" 텍스트) — 커스텀 텍스트 스타일, 토큰 미바인딩 |
| 5 | R6 | -10 | `#000000` (Slogan 텍스트) — 표준 텍스트 색상 `#1A1A1A`와 불일치 |
| 6 | R7 | -10 | `Select Trigger` — shadcn `Select` 컴포넌트 미사용 (R1과 동일 노드) |
| 7 | R8 | -10 | `Inapp Purchase Disclaimer` 흰색 텍스트(#FFF, 12px) on 그린 그래디언트 — 대비 ~2.3:1 (기준: 4.5:1) |

### Minor 이슈

| # | 축 | 감점 | 내용 |
|---|------|------|------|
| 1 | R2 | -5 | `Frame 1430106697` — 자동 생성명 |
| 2 | R2 | -5 | `Frame 1430107444` — 자동 생성명 |
| 3 | R2 | -5 | `Slogan area` — 케이싱 위반 (Slogan Area) |
| 4 | R2 | -5 | `Value Input ` — 트레일링 스페이스 |
| 5 | R2 | -5 | `Inapp Purchase Disclaimer ` — 트레일링 스페이스 |
| 6 | R2 | -5 | `ToggleSwitch` — PascalCase (Toggle Switch) |
| 7 | R5 | -5 | `Frame 1430106697` — 불필요 래퍼 (자식 1개, fills/padding 없음) |
| 8 | R5 | -5 | `Frame 1430107444` — 불필요 래퍼 (자식 1개, fills/padding 없음) |

### Warnings

| # | 축 | 감점 | 내용 |
|---|------|------|------|
| 1 | R8 | -2 | "인 초대권" 흰색 텍스트(20px bold) on 그린 그래디언트 — 대비 경계값 (~2.3-3.4:1, 기준: 3:1) |

### 참고 (TDS 라이브러리 이슈)

- `Ticek Item Illust` (20383:5295) — 컴포넌트명 오타 ("Ticek" → "Ticket"). 이 화면 감점 아님, TDS 원본 수정 필요.

---

CONDITIONAL 판정: R5(50) < 60. 불필요 래퍼 프레임 2건 제거 + 네이밍 수정 후 `/qa` 재실행 권장.
