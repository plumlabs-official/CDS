# Session Memory

> 세션 단기 기억 (compact 후 이어갈 내용)
>
> Last updated: 2026-04-03

---

## 온보딩 Figma 소스 (프로덕트 디자인)

| 플로우 | 파일 키 | 노드 ID | 설명 |
|--------|---------|---------|------|
| 초대링크 온보딩 | `rrnCjPKhK4e69ElSkzMpTp` | `14332-114564` | 초대받은 사람 플로우 |
| 일반 온보딩 | `rrnCjPKhK4e69ElSkzMpTp` | `18603-3277` | 초대하는 사람 플로우 |

---

## 현재 세션 (2026-04-03)

### 완료된 작업

| 작업 | 비고 |
|------|------|
| **Select vs Combobox vs Date Picker 분석** | TDS 컴포넌트 구조 비교. Date Picker = Combobox 인스턴스 확인. Select/Combobox 분리 유지 권장 (Coach A안) |
| **Creator Case 라운지 피드탭 17화면 스캔** | 전체 TDS 인스턴스 100%, 로컬 인스턴스 0건. 커스텀 프레임 5종 (Announcement Header, Lounge Card, Profile Card, Feed Card, Reply Card) |
| **Lounge Screen 리뷰** | 네이밍 위반 4건 (Updates Content + lets-icons 3건). Profile Card 4회·Challenge Talk Card 3회 반복 감지 |
| **Profile Card → TDS 인스턴스 교체** | 프로덕트 파일에서 커스텀 프레임 4개 → TDS Profile Card (Type=Vertical) 교체 완료 |
| **Challenge Talk Card 신규 컴포넌트 생성** | TDS 파일 Components 페이지에 생성. Challenge Thumbnail + Badge + Icon Scaler + Button TDS 인스턴스 활용. 프로퍼티 6개 (Title, Message Preview, Timestamp, Attendee Count, Show Badge, Show Attendee) |
| **Figma MCP 인증 복구** | `mcp__figma` REST API OAuth 인증 → `use_figma` 도구 복원 |
| **`/review` 스킬 생성** | tds-review — QA + 화면 리뷰 통합 (네이밍 + TDS 커버리지 + 반복 패턴 + QA 간이 점수) |
| **`/make-component` 스킬 생성** | tds-make-component — 참조 프레임 → TDS 컴포넌트 자동 생성 |
| **스킬 Director QA** | 7건 수정 적용 (skillNames, idempotency, 파일 타겟, Plugin API gotcha 등) |
| **`/review` Phase 3-B 추가** | Instance Replace 워크플로우 (복제→분석→승인→교체→검증) + 크로스 스크린 패턴 참고 문구 |
| **`/review` 실전 테스트** | Lounge Screen 스캔 — PASS (92점, TDS 27건, 위반 0건) |
| **Updates Card 크로스 스크린 패턴 분석** | Lounge Screen + Updates Screen에서 동일 구조 4회+ 반복 감지 → 컴포넌트화 결정 |
| **Updates Card TDS 컴포넌트 생성** | 4 variant (State=default/locked × Expanded=true/false). Thumbnail Slot + Content Slot 적용. 프로퍼티 8개 (4 TEXT + 2 BOOLEAN + 2 VARIANT). 혼합 작업 (Claude 구조 생성 + 사용자 슬롯 전환) |

---

## 다음 TODO

**TDS 컴포넌트:**
1. Thumbnail 컴포넌트 Publish + 프로덕트 파일에서 라운지 카드에 적용
2. Lounge Card 컴포넌트 TDS화 검토
3. 기존 TDS 컴포넌트 Boolean property `Show Xxx` 포맷 통일
4. Challenge Talk Card Publish
5. Updates Card Publish
6. Announcement Header 컴포넌트화 검토 (3화면 공통)

**스크린 리뷰 (Creator Case 잔여):**
6. Creator Lounge Updates Screen 리뷰
7. Creator Lounge Chatting List/Screen 리뷰
8. Feed Screen 리뷰
9. 소식 작성 플로우 리뷰
10. 나머지 화면 네이밍 수정 (Updates Content, lets-icons 교체)

**스킬 테스트:**
11. `/review` 스킬 실전 테스트
12. `/make-component` 스킬 실전 테스트

**폰트 전환 잔여:**
13. 프로덕트 파일 인스턴스 오버라이드 잔여분 정리
14. Mixed font 텍스트 수동 정리

**모니터링:**
- Figma MCP 커스텀 폰트 지원 출시 시 → Pretendard 복원 검토
