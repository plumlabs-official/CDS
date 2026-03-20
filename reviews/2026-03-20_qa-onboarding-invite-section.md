## QA Report: Onboarding_invite Section (Batch)

> 날짜: 2026-03-20 | 루브릭: v1.1 | 섹션: 14332:1201 | 파일: 2026-03 (DxrzwmdzqAi4m4F0pp83gd)
> 기 완료 제외: Challenge Invite / Accepted (92 PASS), Determination Drawer (100 PASS)

---

### 총괄 요약

| # | 화면 | 총점 | 판정 | 핵심 이슈 |
|---|------|------|------|----------|
| 1 | Onboarding Screen | 98 | PASS | CTA Group 금지어, Slogan Area AL 없음 |
| 2 | Onboarding Input Code Screen | 99 | PASS | 화면명 트레일링 스페이스 |
| 3 | Onboarding Input Name Screen | 100 | PASS | - |
| 4 | Onboarding Input Phone Number Screen | 99 | PASS | `Text InputName` 오명 |
| 5 | Onboarding Input Auth Code Screen | 99 | PASS | `Text InputName` 오명 |
| 6 | Success Join Screen | 100 | PASS | - |
| 7 | Acceptance Screen | 100 | PASS | - |
| 8 | Acceptance Progress Screen | 100 | PASS | - |
| 9 | Challenge Progress Screen | 99 | PASS | Actions absolute |
| 10 | Challenge Progress Screen Ready | 99 | PASS | Actions absolute |
| 11 | Challenge Invite Screen / Denied | 98 | PASS | Actions absolute, `Gruop` 오타 |
| 12 | Todo Screen | 99 | PASS | Actions absolute |
| 13 | Challenge Chatting Screen | 97 | PASS | Actions absolute, 슬래시 레이어명, List Message 순서 |

**전체 PASS** (13/13)

---

### 공통 패턴 이슈 (5개 화면에 반복)

#### Actions absolute 포지셔닝 (#9, #10, #11, #12, #13)

스크롤 화면에서 Actions가 `position: absolute`로 고정됨. Screen AL 패턴(Body scroll-y fill + Actions hug)으로 마이그레이션 필요.

해당 화면:
- Challenge Progress Screen (21469:6612) — y:1386
- Challenge Progress Screen Ready (21555:16671) — y:1386
- Challenge Invite Screen / Denied (21554:11735) — y:1613
- Todo Screen (21555:19977) — y:1394
- Challenge Chatting Screen (21555:20021) — y:893

> SESSION.md TODO에 이미 기록됨: "나머지 화면에 모바일 Screen AL 패턴 적용"

---

### 개별 이슈 목록

#### Major (R3, -10/건)

| # | 화면 | 노드 | 내용 |
|---|------|------|------|
| 1 | Onboarding Screen | Slogan Area | mode:none, 고정 236x80. 내부 TEXT 266px overflow. AL hug 전환 필요 |
| 2-6 | 5개 화면 | Actions | absolute 포지셔닝 (위 공통 패턴 참조) |

#### Minor (R2, -5/건)

| # | 화면 | 노드 | 수정 |
|---|------|------|------|
| 1 | Onboarding Screen | `CTA Group` | `Button Group` (CTA 금지어) |
| 2 | Input Code Screen | 화면명 | `Onboarding Input Code Screen` (트레일링 스페이스 제거) |
| 3 | Input Phone Number | `Text InputName` | `Phone Input Area` |
| 4 | Input Auth Code | `Text InputName` | `Auth Code Input Area` |
| 5 | Invite / Denied | `Friend List Gruop` | `Friend List Group` (오타) |
| 6 | Chatting Screen | `TabsList Primary/ChallengeState` | `TabsList Section` (슬래시 금지) |
| 7 | Chatting Screen | `List Message` | `Message List` ([컨텍스트] [역할] 순서) |

---

### 수정 우선순위

**Phase 1 — 네이밍 (7건, 즉시):**
Renamer 또는 수동으로 위 Minor 7건 수정

**Phase 2 — Screen AL 마이그레이션 (5건):**
5개 스크롤 화면 Actions absolute → Body fill scroll-y + Actions hug 전환

**Phase 3 — Slogan Area AL 전환 (1건):**
Onboarding Screen의 Slogan Area를 AL hug로 전환

---

*검사 범위: 섹션 내 고유 화면 13개 (중복 variant 및 Drawer 제외). 소형 카드(알림 동의, OS Alert, Push Alert, iOS Message) 미검사.*
