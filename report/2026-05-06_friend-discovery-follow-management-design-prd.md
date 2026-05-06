# 친구 찾기 / 팔로우 관리 — 디자인 PRD

> Version 0.1 | 2026-05-06 | 작성 보조: Codex  
> 상태: **[초안]** — Figma 구현 전 IA/디자인 요구사항 고정용  
> 근거: `meetings/2026-05-06_follow-management-recommendation-ia.md`, `meetings/2026-05-06_friend-recommendation-profile-list.md`, `meetings/2026-05-06_already-following-recommendation-source.md`, `.ai/pipeline/runs/20260506-160545_follow-management-recommendation-ia/`

---

## TL;DR

- **결정**: `친구 찾기`와 `팔로우 관리`를 분리한다.
- **내비게이션**: `팔로우 관리`에는 우측 상단 `UserPlus` / `사람 추가` 버튼을 두어 `친구 찾기`로 보낸다.
- **비대칭 원칙**: `친구 찾기`에는 반대로 `팔로우 관리` 버튼을 두지 않는다.
- **추천 화면 원칙**: `친구 찾기`는 팔로우/초대/연락처 연결에 집중한다. 팔로잉 친구 preview 리스트도 두지 않는다.
- **관리 화면 원칙**: `팔로우 관리`는 기존 관계의 검색, 숨기기, 끊기, 삭제를 위한 secondary utility다.
- **컴포넌트 선행 조건**: `친구 찾기` 구현 전 CDS `Recommendation Profile List` composed pattern을 만든다.
- **이번 문서 범위**: 디자인 PRD 작성. Figma mutation, 추천 알고리즘 구현, CDS 컴포넌트 생성은 포함하지 않는다.

---

## 1. 배경 및 문제 정의

### 1.1 문제

현재 제품 맥락에서 우선순위는 사용자가 피드와 라운지에서 볼 사람을 찾고, 팔로우하고, 초대하게 만드는 것이다. 즉 `친구 찾기`는 성장 루프의 입력과 행동을 만드는 primary flow다.

반면 `팔로우 관리`는 이미 형성된 관계를 정리하고 사용자의 통제감을 보장하는 guardrail이다. 필요한 기능이지만, 팔로우 추가보다 서비스 growth 측면의 권장 액션은 아니다.

따라서 추천 친구/인기 친구를 `팔로우 관리` 안에 동등한 탭으로 배치하면 두 가지 문제가 생긴다.

- 추천 화면의 primary action인 `팔로우`, `초대`, `연락처 연결`의 선명도가 약해진다.
- 관리 화면의 역할이 `정리`인지 `추가`인지 흐려진다.

### 1.2 기존 작업 상태

선행 Figma 작업에서 `팔로우 관리` target screen에 `팔로잉 / 추천 / 인기` 탭과 추천 카드들이 들어간 상태가 있었다. 후속 구현에서는 이 구조를 그대로 유지하지 않는다.

확정된 방향:

- `친구 찾기`는 별도 screen으로 만든다.
- 기존 `팔로우 관리` 화면을 단순 rename하지 않는다.
- 순수 `팔로우 관리`에서는 `추천 / 인기` 탭을 제거한다.
- `추천 / 인기` 카드 인스턴스를 그대로 옮기지 않고, 새 `Recommendation Profile List` pattern 기반으로 fresh build한다.

---

## 2. 목표

### 2.1 Product Goals

- 사용자가 피드/라운지에서 볼 사람을 빠르게 찾게 한다.
- 친구 추천의 이유를 명확히 보여 팔로우 결정 마찰을 줄인다.
- 친구 초대와 연락처 기반 추천을 성장 루프로 연결한다.
- 팔로우 관리 기능은 신뢰/통제감을 위해 유지하되, 추천 flow의 주의를 빼앗지 않게 한다.

### 2.2 Design Goals

- `친구 찾기`와 `팔로우 관리`의 정보 향을 분리한다.
- 추천 row/card는 follower count보다 mutual/source context를 우선한다.
- CDS 컴포넌트 기반으로 구성하고 custom row를 만들지 않는다.
- 추천 화면 첫 viewport에서는 growth action만 보이게 한다.

### 2.3 Growth Goals

Growth Loop:

| 단계 | 정의 |
|---|---|
| Input | 연락처, 함께 아는 친구, 라운지/챌린지 맥락, 인기 친구/크리에이터 |
| Action | 팔로우, 초대, 연락처 연결 |
| Output | 피드/라운지 관계 밀도 증가, 관계 그래프 확장 |
| Reinvestment | 더 나은 추천, 초대 loop, social proof 강화 |

---

## 3. Non-goals

이번 PRD에서 다루지 않는다.

- Figma 직접 수정
- 추천 알고리즘 상세 설계
- 연락처 권한 법무/정책 copy 최종안
- `소식 숨긴 계정`, `교류가 적은 계정`, `라운지에서 덜 보기` 등 Follow Management v2 고급 기능
- CDS `Recommendation Profile List` 실제 생성 작업
- 서버 이벤트 스키마 구현

---

## 4. 타겟 사용자 및 진입 맥락

| 사용자 | 상황 | 기대 행동 |
|---|---|---|
| 신규/초기 유저 | 피드와 라운지에 볼 사람이 부족함 | 추천 친구 팔로우, 연락처 연결, 친구 초대 |
| 일반 활성 유저 | 새로 볼 친구/크리에이터를 찾고 싶음 | 추천/인기 친구 탐색 후 팔로우 |
| 연락처 동기화 유저 | 아는 사람이 서비스 안에 있는지 확인하고 싶음 | 연락처 기반 추천 확인 후 팔로우 |
| 관계 정리 유저 | 피드/라운지 노출을 정리하고 싶음 | 팔로우 끊기, 숨기기, 팔로워 삭제 |

### 주요 진입점

`친구 찾기` 진입:

- 피드 empty / low-density 상태
- 라운지 empty / low-density 상태
- 친구 초대 flow
- 프로필 또는 `팔로우 관리` 우측 상단 `사람 추가`
- 라운지 멤버/챌린지 참여자 맥락

`팔로우 관리` 진입:

- 프로필의 `팔로워 / 팔로잉` count
- 설정
- 프로필/피드/라운지 row overflow
- 특정 유저 profile action sheet

---

## 5. 정보 구조

```
친구 찾기
├── Top Bar: title "친구 찾기"
├── Search / Contacts affordance
├── Section 1. 연락처에서 찾은 친구
├── Section 2. 함께 아는 친구
├── Section 3. 추천 친구
├── Section 4. 인기 친구 / 추천 크리에이터
└── Section 5. 친구 초대

팔로우 관리
├── Top Bar: title "팔로우 관리" + UserPlus icon
├── Search
├── [Default] Flat List: 팔로잉 또는 현재 선택된 관계 목록
└── Row actions: 숨기기 / 팔로우 끊기 / 팔로워 삭제 / 차단
```

### 5.1 비대칭 내비게이션

적용할 결정은 `Option A + Option D`다.

- **Option A**: `팔로우 관리`에는 `친구 찾기`로 가는 `UserPlus` / `사람 추가` 버튼을 둔다.
- **Option D**: `친구 찾기`에는 `팔로우 관리` 버튼이나 팔로잉 preview 리스트를 두지 않는다.

이 구조는 의도적으로 비대칭이다. 관리 화면에서 성장 액션으로 빠져나가는 출구는 열어두되, 성장 화면에서 관리성 액션으로 주의를 빼앗지 않는다.

---

## 6. Screen Spec: 친구 찾기

### 6.1 화면 목적

사용자가 지금 팔로우하거나 초대할 사람을 발견하게 한다.

### 6.2 Top Bar

- Title: `친구 찾기`
- Back or close: 진입 맥락에 맞춤
- 우측 상단: optional discovery-supporting action만 허용
  - 허용: 연락처 연결, 초대, 검색
  - 금지: `팔로우 관리`, `관리`, `정리`

### 6.3 Search / Contacts Area

목적:

- 이름/아이디 검색
- 연락처 권한 연결 또는 연락처 추천 섹션으로 이동

상태:

- 연락처 미연결: `연락처에서 친구 찾기` CTA
- 연락처 연결됨: `연락처에서 찾은 친구` 섹션 노출
- 권한 거부: 연락처 기반 추천 대신 `함께 아는 친구`와 `초대 링크`를 우선 노출

### 6.4 Section: 연락처에서 찾은 친구

노출 조건:

- 연락처 권한 허용
- 연락처 기반 매칭 결과 존재

Row metadata:

- Primary: 이름, 아이디
- Reason: optional mutual context
- Source: `연락처에서 찾음`
- Action: `팔로우`
- Dismiss: 허용

Follower count:

- 기본 숨김

### 6.5 Section: 함께 아는 친구

노출 조건:

- mutual follow 또는 같은 라운지/챌린지 맥락 존재

Row metadata:

- Primary: 이름, 아이디
- Reason: `김예인님 외 3명이 팔로우`
- Source: `함께 아는 친구`
- Action: `팔로우`

Follower count:

- 숨김

### 6.6 Section: 추천 친구

노출 조건:

- 관심사, 라운지 활동, 챌린지 참여, 유사 팔로우 그래프 기반 추천 존재

Row metadata:

- Primary: 이름, 아이디
- Reason: `같은 챌린지 참여`, `내 관심사 기반`, `라운지에서 자주 보여요`
- Source: small label
- Action: `팔로우`

Follower count:

- 기본 숨김

### 6.7 Section: 인기 친구 / 추천 크리에이터

목적:

- social proof가 명확한 계정이나 크리에이터를 탐색하게 한다.

Row/card metadata:

- Primary: 이름, 아이디 또는 크리에이터명
- Reason: category or popularity context
- Follower count: 허용
- Action: `팔로우`

주의:

- 일반 친구 추천과 같은 hierarchy로 follower count를 과도하게 강조하지 않는다.
- 크리에이터/인기 맥락일 때만 follower count를 사용한다.

### 6.8 Section: 친구 초대

목적:

- 앱 밖 친구를 서비스 안으로 초대한다.

구성:

- Invite CTA
- 연락처 기반 invite 또는 링크 공유
- 초대 완료 후 feedback state

### 6.9 금지 요소

`친구 찾기` 화면에는 아래를 넣지 않는다.

- 우측 상단 `팔로우 관리`
- 팔로잉 친구 preview
- `팔로우 끊기`, `소식 숨기기`, `팔로워 삭제` 같은 관리 action
- follower count가 primary metadata인 일반 추천 row

---

## 7. Screen Spec: 팔로우 관리

### 7.1 화면 목적

사용자가 기존 관계를 검색하고 정리할 수 있게 한다. 이 화면은 add/growth flow가 아니라 control/management flow다.

### 7.2 Top Bar

- Title: `팔로우 관리`
- Right action: `UserPlus` / `사람 추가`
- Right action destination: `친구 찾기`
- Accessibility label: `친구 추가`

### 7.3 Search

- 이름/아이디 검색
- 리스트 filtering
- 검색 결과 없음 empty state 제공

### 7.4 List Structure

Default:

- `추천 / 인기` 탭 제거
- 단일 `팔로잉` 탭만 남기는 tab bar 금지
- 기본 구조는 search header + flat list

Optional future:

- `팔로잉`과 `팔로워`를 같은 화면에서 모두 관리해야 할 경우에만 two-tab `팔로잉 / 팔로워` 구조 허용

### 7.5 Row Actions

관계 유형에 따라 다르게 노출한다.

| 관계 | Primary Action | Secondary Action |
|---|---|---|
| 내가 팔로잉 | `소식 숨기기` 또는 overflow | `팔로우 끊기` |
| 나를 팔로우 | `팔로워 삭제` | `차단` |
| mutual | `메시지` 또는 profile 이동 | overflow |

주의:

- 고급 기능인 `교류가 적은 계정`, `소식 숨긴 계정`, `라운지에서 덜 보기`는 v2 검증 전까지 기본 scope에 넣지 않는다.

---

## 8. CDS Component Requirements

### 8.1 원칙

- 기존 CDS component를 우선 사용한다.
- custom row/frame을 만들지 않는다.
- 신규 생성이 필요하면 `Recommendation Profile List`를 composed pattern으로 정의한다.
- 생성된 component는 CDS QA rubric을 통과해야 screen composition에 사용할 수 있다.

### 8.2 Recommendation Profile List

Blocking prerequisite:

- `친구 찾기` screen 구현 전 생성 필요

Base anatomy:

- CDS `Profile Card` 또는 `Invite Profile Card` anatomy를 최대한 활용
- recommendation-specific metadata slot 추가
- follower count는 default hidden

Recommended row hierarchy:

1. Avatar
2. Name / ID
3. Mutual reason: `김예인님 외 3명이 팔로우`
4. Source: `연락처에서 찾음`, `함께 아는 친구`, `같은 챌린지 참여`, `내 관심사 기반`
5. Action: `팔로우`, `팔로잉`, `초대`
6. Dismiss

Suggested props:

| Prop | Type | Required | Notes |
|---|---|---:|---|
| Name | text | Yes | display name |
| Description / ID | text | No | id or secondary identity |
| Reason | text | No | mutual/social proof |
| Source | text | No | recommendation source |
| Show Source | boolean | Yes | false when already followed |
| State | variant | Yes | `Not Followed`, `Following`, `Invited` |
| Show Follower Count | boolean | Yes | default false |
| Type | variant | Yes | `Contact`, `Mutual`, `Recommended`, `Popular`, `Creator` |
| Show Dismiss | boolean | Yes | default true for recommendations |

### 8.3 Existing Components

| UI | Preferred CDS Component | Note |
|---|---|---|
| Avatar | `Avatar` | preserve profile image |
| Friend/recommendation row | `Recommendation Profile List` | new composed pattern |
| Follow button | `Button` | state-specific labels |
| Dismiss | icon button | minimum 44px touch target |
| Top bar action | `Navigation Button` / icon button | `UserPlus` |
| Tabs | `TabsList` only if 2+ meaningful tabs | single-tab usage forbidden |
| Search | existing Search/Input pattern | CDS tokenized |

---

## 9. Recommendation Metadata and Content Rules

### 9.1 Metadata Priority

Default recommendation rows:

1. Identity: avatar, name, id
2. Mutual/social proof
3. Source
4. Action

Follower count:

- 일반 추천에서는 숨김
- `인기 친구` / `추천 크리에이터`에서는 허용
- 허용하더라도 reason/source보다 primary가 되지 않게 한다

### 9.2 Source Label Rules

| User State | Display Rule |
|---|---|
| Not followed | source label 표시 |
| Already following in recommendation result | source label 숨김, `팔로잉` state만 표시 |
| Following management | recommendation source 숨김 |
| Contact/privacy management context | 필요 시 `연락처 친구` 같은 약한 badge만 검토 |

### 9.3 Copy Examples

Mutual:

- `김예인님 외 3명이 팔로우`
- `함께 아는 친구 4명`

Source:

- `연락처에서 찾음`
- `같은 챌린지 참여`
- `내 관심사 기반`
- `라운지에서 자주 보여요`

Permission denied:

- `연락처 권한이 꺼져 있어요`
- `링크로 친구를 초대할 수 있어요`

Empty:

- `아직 추천할 친구가 없어요`
- `관심사와 라운지 활동이 쌓이면 더 잘 추천해드릴게요`

---

## 10. States, Edge Cases, and Accessibility

### 10.1 Friend Discovery States

| State | Requirement |
|---|---|
| Loading | section-level skeleton |
| Empty all | invite CTA와 인기/크리에이터 fallback |
| Contacts denied | 연락처 source 섹션 숨김, invite/share CTA 제공 |
| Already followed | `팔로잉` state only, source label suppressed |
| Dismissed | row 제거 또는 다음 추천으로 대체 |
| Follow success | 버튼 `팔로잉` 전환, 화면 전환 없음 |
| Invite success | invited state 또는 toast |

### 10.2 Follow Management States

| State | Requirement |
|---|---|
| 0 following | `친구 찾기` CTA 제공 |
| 0 followers | quiet empty state |
| Search no results | 검색어 유지 + no result copy |
| Action confirm | destructive action은 confirm 또는 undo 제공 |
| Blocked/reported | list에서 제거 또는 blocked state |

### 10.3 Accessibility

- Interactive touch target: minimum 44x44px
- Icon-only buttons need accessible labels
- `UserPlus` label: `친구 추가`
- Dismiss label: `추천에서 숨기기`
- Follow button states must be text-readable, not color-only
- Source labels should not rely on color alone
- Row action order must be consistent across sections

---

## 11. Metrics and Experiment Plan

### 11.1 Primary Metrics

| Metric | Definition |
|---|---|
| Friend Discovery -> follow completion rate | `친구 찾기` 진입 후 팔로우 완료 비율 |
| Friend Discovery -> invite completion rate | `친구 찾기` 진입 후 초대 완료 비율 |
| Time to first follow | `친구 찾기` 진입부터 첫 팔로우까지 걸린 시간 |
| Feed/lounge first meaningful interaction | 팔로우 후 피드/라운지에서 의미 있는 첫 상호작용 도달률 |

### 11.2 Secondary Metrics

- 연락처 권한 허용률
- 추천 row dismiss rate
- 섹션별 follow conversion
- 인기/크리에이터 section CTR
- 초대 링크 공유율

### 11.3 Guardrail / Counter Metrics

| Guardrail | Why |
|---|---|
| Follow Management discoverability | 관리 기능을 너무 숨기지 않았는지 확인 |
| Hide/unfollow/block completion time | control task가 악화되지 않았는지 확인 |
| Friend Discovery bounce rate | 추천 화면이 너무 복잡하거나 신뢰를 잃지 않았는지 확인 |
| Recommendation dismiss rate | 추천 품질/설명 품질 확인 |
| Report/block rate | 부적절 추천 증가 여부 확인 |

### 11.4 Baseline Requirements

A/B test 전 현재 baseline을 수집한다.

- follow completion rate
- invite completion rate
- recommendation dismiss rate
- management entry usage
- management task completion time

### 11.5 Experiment Candidates

Default:

- A+D: `팔로우 관리 -> 친구 찾기`만 제공, `친구 찾기 -> 팔로우 관리` 없음

Future variants:

- Variant B: `친구 찾기` 우측 상단에 `팔로우 관리` 노출
- Variant C: `친구 찾기`에 팔로잉 preview module 노출

Default를 유지하고, B/C는 follow/invite conversion을 해치지 않는다는 데이터가 있을 때만 검토한다.

---

## 12. Figma Implementation Notes

이번 PRD는 Figma를 수정하지 않는다. Figma 적용 시 다음 순서를 따른다.

1. CDS `Recommendation Profile List` composed pattern 생성
2. 별도 `친구 찾기` screen 생성
3. `친구 찾기`에 contacts/mutual/recommended/popular/invite sections 구성
4. `팔로우 관리`에서 `추천 / 인기` 탭 제거
5. 단일 tab bar가 남지 않게 search header + flat list 또는 two-tab `팔로잉 / 팔로워`로 정리
6. `팔로우 관리` 우측 상단에 `UserPlus` / `사람 추가` 추가
7. `친구 찾기`에 management button과 following preview가 없는지 QA

### 12.1 Prior Figma Dependency

선행 run `20260506-145658_figma-follow-management-cds`에서 target screen에 `팔로잉 / 추천 / 인기` tab structure가 만들어졌다. 후속 Figma implementation에서는 이 구조를 그대로 유지하지 않는다.

Disposition:

- 기존 `추천 / 인기` card instances를 새 screen으로 단순 이동하지 않는다.
- 새 `친구 찾기`는 `Recommendation Profile List` 기준으로 fresh build한다.
- 기존 `팔로우 관리`는 pure management screen으로 정리한다.

---

## 13. QA Checklist

### 13.1 IA QA

- [ ] `친구 찾기` screen이 별도로 존재한다.
- [ ] `친구 찾기` title이 canonical display name과 일치한다.
- [ ] `친구 찾기` 우측 상단에 `팔로우 관리` 버튼이 없다.
- [ ] `친구 찾기`에 팔로잉 친구 preview module이 없다.
- [ ] `팔로우 관리` 우측 상단 `UserPlus` / `사람 추가`가 `친구 찾기`로 연결된다.
- [ ] `팔로우 관리`에서 `추천 / 인기` 탭이 제거되어 있다.
- [ ] 단일 `팔로잉` tab bar가 남아 있지 않다.

### 13.2 Component QA

- [ ] 추천 rows/cards가 CDS component 또는 composed pattern instance다.
- [ ] custom row/frame이 없다.
- [ ] `Recommendation Profile List`가 CDS QA rubric을 통과했다.
- [ ] follower count는 일반 추천 row에서 숨김 처리되어 있다.
- [ ] 인기/크리에이터 row에서만 follower count가 허용된다.

### 13.3 Metadata QA

- [ ] not-followed recommendation에 reason/source가 보인다.
- [ ] already-followed row에는 `팔로잉` state만 보인다.
- [ ] already-followed row에는 recommendation source label이 숨겨져 있다.
- [ ] source label copy가 의미상 추천 이유와 충돌하지 않는다.

### 13.4 Accessibility QA

- [ ] icon-only buttons에 accessible label이 있다.
- [ ] interactive target이 44x44px 이상이다.
- [ ] follow/following state가 color-only가 아니다.
- [ ] dismiss action label이 `추천에서 숨기기`처럼 명확하다.
- [ ] destructive actions에 confirm 또는 undo가 있다.

---

## 14. Now / Next / Later

### Now

- CDS `Recommendation Profile List` spec 확정
- `친구 찾기` screen fresh build
- `팔로우 관리` pure management screen 정리
- Figma QA checklist 기반 검수

### Next

- 연락처 권한 denied / empty state visual design
- 추천 section ordering 실험
- 친구 초대 flow와 연결 copy 정리
- baseline analytics event map 작성

### Later

- Follow Management v2: `교류가 적은 계정`, `소식 숨긴 계정`, `라운지에서 덜 보기`
- `친구 찾기 -> 팔로우 관리` 노출 실험
- 팔로잉 preview module 실험
- 추천 ranking model 개선

---

## 15. Open Questions

1. `친구 찾기` 첫 viewport에서 연락처 CTA와 추천 list 중 무엇을 우선할 것인가?
2. 연락처 권한 denied copy는 정책/법무 검토가 필요한가?
3. `인기 친구`와 `추천 크리에이터`를 같은 section으로 둘지 분리할지?
4. `팔로우 관리` 기본 list는 `팔로잉` 중심 flat list로 충분한가, 아니면 `팔로잉 / 팔로워` two-tab이 v1부터 필요한가?
5. recommendation source taxonomy를 어디까지 노출할 것인가?

---

## 16. Reference Artifacts

- `meetings/2026-05-06_follow-management-recommendation-ia.md`
- `meetings/2026-05-06_friend-recommendation-profile-list.md`
- `meetings/2026-05-06_already-following-recommendation-source.md`
- `.ai/pipeline/runs/20260506-160545_follow-management-recommendation-ia/03-plan.md`
- `.ai/pipeline/runs/20260506-145658_figma-follow-management-cds/`
- `.ai/pipeline/runs/20260506-145658_figma-follow-management-cds/05-implementation.md`
