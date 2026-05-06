# Team Analysis

- Date: 2026-05-06
- Mode: Director + Play
- Request: 팔로우 관리/친구 찾기 IA 결정 내용을 바탕으로 디자인 PRD 작성
- Target artifact: `report/2026-05-06_friend-discovery-follow-management-design-prd.md`
- Roles applied: Product Leader, Growth Expert, Design Director, Data Scientist

## Problem

현재 Figma 논의는 `팔로우 관리`와 `친구 찾기/추천 친구`가 한 화면 안에서 섞이며 생기는 목적 충돌을 정리하는 단계까지 진행됐다. 다음 단계는 디자인/제품팀이 실제 화면 설계와 CDS 컴포넌트 생성을 진행할 수 있도록 PRD로 고정하는 것이다.

핵심 문제:

- `친구 찾기`는 피드/라운지의 볼 사람을 찾고 팔로우/초대하게 만드는 growth action이다.
- `팔로우 관리`는 이미 형성된 관계를 정리하고 통제감을 주는 guardrail이다.
- 두 기능을 같은 탭/동일 레벨로 섞으면 추천 화면의 primary action이 흐려진다.
- 이미 CDS 기반 `팔로우 관리` 스크린에 `팔로잉/추천/인기` 탭을 넣은 선행 Figma 작업이 있어, 후속 구현에서 이를 정리해야 한다.

## Source Decisions

Confirmed from prior Team/Play artifacts:

- `Option A + Option D` 채택
- `팔로우 관리` -> top-right `UserPlus` / `사람 추가` -> `친구 찾기`
- `친구 찾기` -> no `팔로우 관리` top-right button
- `친구 찾기` -> no 팔로잉 친구 preview list
- `친구 찾기` canonical display name: `친구 찾기`
- `친구 찾기`는 별도 screen으로 생성, 기존 화면 rename 금지
- `Recommendation Profile List` composed pattern 생성을 Friend Discovery 구현의 blocking prerequisite로 둠
- 이미 팔로우 중인 추천 카드는 `팔로잉` 상태만 보여주고 source label을 숨김
- 추천 카드 metadata hierarchy: mutual/social proof -> source -> follower count
- follower count는 인기 친구/크리에이터 맥락에서만 허용

## Director Gates

| Gate | Pass Criteria | Fail State |
|---|---|---|
| G1 Scope | PRD가 `친구 찾기`, `팔로우 관리`, `Recommendation Profile List`의 범위를 구분한다 | 추천과 관리가 한 화면/동일 primary flow로 섞임 |
| G2 IA | 비대칭 내비게이션 A+D가 명시된다 | 추천 화면에서 관리 버튼이나 팔로잉 preview가 primary UI로 노출됨 |
| G3 Design Detail | 화면 구조, 섹션, row/card metadata, 상태/empty/degraded states가 포함된다 | Figma 작업자가 화면을 만들기엔 스펙이 추상적임 |
| G4 CDS | 기존 CDS 활용과 신규 composed pattern prerequisite가 구분된다 | custom row 생성 또는 기존 follower-count card 재사용만 지시 |
| G5 Metrics | primary, secondary, guardrail/counter metrics와 baseline 필요조건이 포함된다 | 성공 기준이 follow/add/invite output만 있고 guardrail이 없음 |
| G6 QA | Figma QA checklist와 exclusion criteria가 포함된다 | 이미 팔로우 중 source label suppression 등 이전 결정이 검증 불가능함 |
| G7 Scope Control | Figma mutation이 이번 run 범위 밖임을 명시한다 | PRD 작성 중 실제 Figma 수정까지 섞임 |

## Role Analysis

### Product Leader

Product Strategy 프레임워크 기준으로 PRD는 문제/해결/진입/범위/비범위를 분리해야 한다.

필수 포함:

- 문제: 초기 피드/라운지의 관계 밀도 부족
- 해결: `친구 찾기`를 discovery/add/invite 전용 화면으로 분리
- 비범위: follow management v2 고급 기능, 추천 알고리즘 세부 구현, Figma mutation
- 로드맵: Now/Next/Later로 CDS pattern, screen build, measurement, management v2를 분리

### Growth Expert

Growth Loop 기준으로 PRD는 friend discovery를 loop input/action으로 정의해야 한다.

- Input: 연락처, mutual follow, 라운지/챌린지 맥락, 인기/크리에이터
- Action: 팔로우, 초대, 연락처 연결
- Output: feed/lounge density, relationship graph
- Reinvestment: better recommendations and invite loop

추천 화면에 관리 버튼을 두는 것은 Action 단계의 주의를 분산시키므로 default에서 제외해야 한다.

### Design Director

User-centered design 기준으로 PRD는 화면의 정보 향과 컴포넌트 계층을 명확히 해야 한다.

필수 포함:

- `친구 찾기`: 누구를 팔로우할지, 왜 추천됐는지, 지금 어떤 action을 할지
- `팔로우 관리`: 누가 연결되어 있는지, 숨길지/끊을지/삭제할지
- row hierarchy: avatar/name -> reason -> source -> action
- accessibility: touch target 44px 이상, button/action label, source label의 의미 명확화
- single-tab tab bar 금지

### Data Scientist

Metric Definition 기준으로 PRD는 launch 전에 측정 가능한 primary/guardrail을 정의해야 한다.

필수 포함:

- Primary: follow completion, invite completion, first follow time, feed/lounge first meaningful interaction
- Guardrail: management discoverability, hide/unfollow/block completion time, recommendation dismiss rate, bounce rate
- Experiment variants: B/C는 future experiment only
- Baseline capture before A/B test

## Recommendation

PRD는 단일 문서로 작성하되 구조는 다음과 같이 둔다.

1. TL;DR and confirmed decisions
2. Background/problem
3. Goals/non-goals
4. Target users and entry points
5. IA and navigation
6. Screen specs: Friend Discovery, Follow Management
7. CDS component requirements: Recommendation Profile List
8. Content and metadata rules
9. States and edge cases
10. Metrics and experiment plan
11. Figma implementation plan and QA checklist
12. Open questions and deferred decisions

## Risks

- PRD가 너무 넓어지면 Follow Management v2까지 범위가 커질 수 있다.
- `Recommendation Profile List`를 구현 전에 만들지 않으면 이전 follower-count-heavy card가 재사용될 수 있다.
- 추천 알고리즘/연락처 권한 정책의 세부 copy가 아직 부족할 수 있다.
- 이미 변경된 Figma 화면의 `추천/인기` 탭 disposition을 명확히 적지 않으면 구현자가 기존 구조를 유지할 수 있다.
