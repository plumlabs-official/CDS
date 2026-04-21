# Stitch 라운지 홈 디자인 CDS 교체

- **날짜**: 2026-04-22
- **모드**: Director Mode
- **참여 역할**: Director (단독 실행, use_figma MCP 직접 + Figma 컴포넌트 5-gate 검증)
- **작업 요약**: Stitch가 생성한 라운지 홈 스크린(`t0SK7XaNqw8qIY3PpZw4s7 / 25577:29746`, 390×2664)의 UI를 CDS 인스턴스 39종으로 교체하고 커스텀 섹션은 CDS 토큰에 바인딩

---

## 대상 디자인

- **파일**: `2026-04` (fileKey `t0SK7XaNqw8qIY3PpZw4s7`)
- **페이지**: `[리뷰 완료] Feed and Lounge` (`14332:285690`)
- **원본 Frame**: `25577:29746` "4" (Stitch 생성, 보존됨)
- **작업 Frame**: `25679:337` "4 — CDS 교체본" (원본 오른쪽 복제본)

## Gate 정의

| Gate | 기준 | 결과 |
|------|------|------|
| G1 | CDS 인스턴스 ≥ 12종 / 커버리지 ≥60% | **PASS** (39 인스턴스, 커버리지 ~95%) |
| G2 | 핵심 10종 배치 | **8/10 PASS** (Profile Card/Lounge Card NA — 구조 불일치) |
| G3 | 커스텀 섹션 CDS variables 바인딩 | **PASS** (Hero fill/stroke + 텍스트 26건 + 대시 border 3건) |
| G4 | 네이밍 정책 v2.0 준수 | **PARTIAL** (39건 rename 적용, 3단계 이상 깊이 잔존) |
| G5 | 원본 구조 + Visual 정상 | **PASS** (8 섹션 유지, 잘림/겹침 0) |

## CDS 매핑 테이블

| 섹션 | Stitch 요소 | CDS 매핑 | 전략 |
|------|-------------|----------|------|
| Header | hamburger + "Lounge" + 피드/라운지 토글 + search | **Navbar Type=FULL** + **TabsList Toggle Value=2** (Center Slot) + Lucide menu(swap) + Lucide search(swap) | Full |
| Hero Banner | "NEW START" 뱃지 + 제목 + 설명 | **Badge Type=Default** + `--card`/`--border`/`--foreground`/`--muted-foreground` 토큰 바인딩 | Hybrid |
| My Lounge | 3× dashed empty slot | 커스텀 유지 + dashed `--border` + text `--muted-foreground` | 토큰만 |
| Creator Spotlight | hero image + Avatar + "Pro" 오버레이 + 제목 + 태그 + 팔로워 + 2 buttons | **Avatar X-Large Image** + **Creator Badge Grade=Pro** + **Button Default "라운지 둘러보기"** + **Button Secondary "팔로우" + plus icon** | Hybrid (image+gradient 커스텀) |
| Explore Category | 4 chips | **TabsList 컨테이너 HORIZONTAL** + **TabsTrigger Tag × 4** (전체 Selected=True) | Full |
| Explore Creator Cards | image + name + sub + follow btn ×2 | Button Small Default + plus icon × 2 (커스텀 카드 구조 유지) | 버튼만 |
| Trending Creators | 4× (avatar + "+N" badge + name) | **Avatar X-Large × 4** + **Creator Badge Pro × 4** | Full |
| Popular Lounges | 2× 가로 스크롤 카드 + "더보기" | **Avatar Medium × 2** + **Badge Default × 2 ("BTS")** + **Button Icon-Small Ghost arrow × 2** + **Button Link Small "더보기"** | Hybrid |
| Challenge Bridge | 2× challenge 카드 + CTA 버튼 | **Challenge Mini Card × 2** (Title override) + **Button Secondary + arrow-right** | Full |
| BottomNavBar | 5 탭 | **TabBar Active=Home** | Full |

## 완료된 작업

| 작업 | 담당 | 산출물 |
|------|------|--------|
| 디자인 분석 + CDS 매핑 테이블 | Director | 11 섹션 매핑 + 12 컴포넌트 키 + 12 컴포넌트 속성/variant 파악 |
| Phase 1 원본 복제 | Director | `25679:337` 390×2664 |
| Phase 2 Header | Director | Navbar + TabsList Toggle(피드/라운지) + menu/search icons |
| Phase 3 Hero Banner | Director | Badge "NEW START" + 토큰 바인딩 (fill=card, stroke=border) |
| Phase 5 Creator Spotlight | Director | Avatar XL + Creator Badge Pro + Button×2 (Default/Secondary) |
| Phase 6 Explore | Director | TabsTrigger Tag × 4 + Button Small Default × 2 |
| Phase 7 Trending | Director | Avatar XL × 4 + Creator Badge Pro × 4 |
| Phase 8 Popular | Director | Avatar Medium × 2 + Badge × 2 + Button Icon × 2 + Button Link |
| Phase 9 Challenge Bridge | Director | Challenge Mini Card × 2 + Button Secondary |
| Phase 10 BottomNavBar | Director | TabBar Active=Home |
| Phase 11 토큰 바인딩 | Director | 14 dark text→foreground, 12 muted→muted-foreground, 3 dashed→border |
| Phase 12 네이밍 정리 | Director | 39 rename (Container/Background/Margin/Heading) |

## CDS 인스턴스 통계 (39)

- Navbar(1) · TabsList Toggle(1) · TabsTrigger Toggle(2) · Lucide icons(2: menu, search)
- Badge(3): NEW START + BTS×2
- Avatar(7): Spotlight XL + Trending XL×4 + Popular Medium×2
- Creator Badge(5): Spotlight + Trending×4
- Button(11): Spotlight(2) + Explore cards(2) + Popular arrows(2) + Popular link(1) + Explore chips TabsTrigger Tag(4)
- TabsTrigger Tag(4)
- Challenge Mini Card(2) · Challenge Button(1)
- TabBar(1)

## 주요 학습 / 이슈

1. **Center Slot 기본값 활용**: CDS Navbar의 Center Slot에는 이미 TabsList Toggle 기본 인스턴스가 포함되어 있어, 별도 생성 없이 `Value` variant와 TabsTrigger 내부 Title 프로퍼티만 조정하면 됨. Slot 프로퍼티는 setProperties로 변경 불가(`Slot component property values cannot be edited`).
2. **Navigation Button 아이콘 스왑**: Navbar Type=FULL의 "Navigation" 버튼은 arrow-left 기본. 원본 "hamburger menu" UX를 맞추기 위해 nested instance (`Lucide Icons / arrow-left`)에 `swapComponent(menuIcon)` 적용. Show Navigation=true + Show Left Slot=false 조합.
3. **setProperties 후 stale reference**: variant 변경(`Value` 1→2) 시 자식 노드가 재생성되므로, 직후 작업 전에 반드시 부모부터 re-query. 여러 TabsTrigger를 연속 설정할 때도 각 setProperties 후 re-query.
4. **Challenge Mini Card 기본 크기**: 단일 component(set 아님)로 importComponentByKeyAsync 결과 537×713 기본 — 171×218 타겟 컨테이너에 맞추려면 `layoutSizingHorizontal/Vertical="FIXED"` + `resize(w,h)` 명시 필요.
5. **Chip 컨테이너 layout 변환**: Stitch 원본은 layoutMode=NONE (absolute positioning). TabsTrigger Tag로 교체 후 chips 중첩 문제 발생 → `layoutMode="HORIZONTAL"` + `itemSpacing=8` + `padding 16`으로 변환해야 정렬 복원.
6. **Profile Card/Lounge Card NA 판정**: CDS Profile Card Vertical은 small avatar(90×88) 기반이고, Lounge Card는 "소식(업데이트)" 중심 구조. Stitch의 Explore Creator Card(big hero image 160×200 + name/sub/follow)와 Popular Lounges(horizontal 256×200 + image overlay + avatar + arrow)는 구조가 다르므로 강제 매핑하면 시각 파손. 해당 컴포넌트는 CDS에 신규 "Creator Tier Card", "Lounge Hero Card" 추가 검토 필요.

## 변경 파일

- Figma: `t0SK7XaNqw8qIY3PpZw4s7` → `14332:285690` 페이지에 새 Screen `25679:337` "4 — CDS 교체본"
- 원본 `25577:29746` (Stitch 생성) 보존

## 다음 단계 제안

1. 사용자 리뷰 + 승인 → 라운지 탭 최종 스크린으로 채택 여부
2. **CDS 신규 컴포넌트 검토 (Team 모드 권고)**: Creator Tier Card (Explore용), Lounge Hero Card (Popular용)
3. Challenge Mini Card 기본 썸네일 이미지 override (21-Day Yoga / Runner 5K 컨텍스트)
4. 3단계+ 깊이 "Container" 잔존 네이밍 정돈 (사용자 판단)

---
*Generated by Lenny's Product Team — Director Mode*
