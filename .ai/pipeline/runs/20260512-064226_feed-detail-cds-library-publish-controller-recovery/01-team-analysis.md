# Team Analysis — Feed Detail CDS Library Publish (Controller Recovery)

## Claude Activity Check (Session Start)
- 실행 명령: `bash $HOME/.codex/scripts/check-claude-activity.sh`
- 결과: 실행 성공(코드 0), 현재 `CDS` 워크트리 변경 존재, 진행 차단 이슈 없음.

## Problem
Feed Detail 화면이 복사본 기반(`28643:11`, `28643:104`, `28643:179`)으로 유지되어 CDS 라이브러리 단일 소스와 분리되어 있다.
목표는 실제 저작 컴포넌트(`Action Rail`, `Comment Composer`)를 라이브러리(`H36eNEd6o7ZTv4R7VcyLf2`)에 publish/update하고, 대상 화면을 라이브러리 인스턴스로 치환하면서 원본/보호 화면은 보존하는 것이다.

## Current State
- 이전 recovery run 존재: `/Users/zenkim_office/Project/CDS/.ai/pipeline/runs/20260512-060949_feed-detail-cds-library-publish-recovery-text`
- 이번 범위 고정:
  - Library: `H36eNEd6o7ZTv4R7VcyLf2`
  - Product section: `CS2ZhrORl4E1szQfTe2UvO` / node `28587:15601`
- 치환 대상: `28643:11`, `28643:104`, `28643:179`
- 보존 대상: `28587:15677`, `28587:15602`, `28587:15770`, `28582:15332`, Lounge
- 제약: bitmap-only 금지, token/typography/property/evidence/peer gate 필요

## Options
1. **In-place Publish + Immediate Screen Swap**
- 장점: 가장 빠름, 중간 드리프트 최소
- 단점: publish 품질 이슈 시 화면 3개 동시 리스크

2. **Staged Publish (컴포넌트 확정 후 일괄 치환)**
- 장점: `Action Rail`/`Comment Composer` 검증 후 적용 가능, 회귀 추적 용이
- 단점: 단계 1회 추가로 시간 증가

3. **Screen-by-Screen Replacement**
- 장점: 화면별 차이 대응에 유연
- 단점: 동일 작업 반복, 불일치/누락 가능성 증가

## Recommendation
**Option 2 (Staged Publish)** 권장.
먼저 라이브러리 컴포넌트 2종을 “실저작 + token/typography/property 바인딩 완료” 상태로 확정하고 evidence를 남긴 뒤, 3개 화면을 동일 버전 인스턴스로 일괄 치환한다. 품질 게이트를 통과한 단일 기준으로 교체해 재작업 가능성을 낮춘다.

## Scope
- 포함:
  - `Feed Detail Action Rail` publish/update
  - `Feed Detail Comment Composer` publish/update
  - 대상 3개 화면 인스턴스 치환
  - 증거(노드/컴포넌트/바인딩/치환 전후) 기록
- 제외:
  - 보존 지정된 원본/보호/Lounge 구조 변경
  - bitmap 기반 임시 컴포넌트 생성
  - 범위 외 Feed 화면 리디자인

## Risks
- 컴포넌트가 local copy로 남아 instance 치환이 불완전할 수 있음
- token 미바인딩/텍스트 스타일 하드코딩으로 CDS 정책 위반 가능
- variant/property 스키마 불안정 시 화면별 override 깨짐
- 보존 노드 오탐 수정(원본 훼손) 위험
- evidence 불충분 시 peer gate 실패 가능

## Gates
1. **Component Integrity Gate**
- `Action Rail`, `Comment Composer`가 라이브러리 publish 상태
- bitmap-only 요소 없음
- token/typography/property 바인딩 확인

2. **Replacement Gate**
- `28643:11`, `28643:104`, `28643:179`가 published instance 참조
- local detached/copy 잔존 없음

3. **Preservation Gate**
- `28587:15677`, `28587:15602`, `28587:15770`, `28582:15332`, Lounge 무변경 확인

4. **Evidence Gate**
- 컴포넌트 키/노드 ID/바인딩/치환 결과 스냅샷 또는 동등 증거 기록

5. **Peer Gate**
- 리뷰 기준 PASS(또는 사용자 결정이 필요한 이슈만 잔존) before close