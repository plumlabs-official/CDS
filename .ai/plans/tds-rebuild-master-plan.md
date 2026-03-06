# TDS 재구축 마스터 플랜

> Created: 2026-03-06
> Source: Lenny Team Meeting

---

## 목표

- 기존 TDS 리셋
- shadcn Figma Kit (Shadcraft Pro) 기반으로 재구축
- 구조/네이밍 유지, 내용물(색상, 폰트)만 Tryve로 교체
- AI 바이브 코딩 최적화

---

## 타임라인

```
Day 1: Phase 0-1 (Inventory + Archive)
       ✓ 깨끗한 TDS 파일

Day 2: Phase 2 (Variables)
       ✓ Tryve 색상 토큰 완성

Day 3: Phase 3-4 (Typography + Effects)
       ✓ 전체 Foundation 완성

Day 4+: Phase 5 (Components)
       ✓ Button 완료 → 나머지 순차
```

---

## Phase 체크리스트

### Phase 0: Inventory (30분) ✅
- [x] 0.1 기존 자산 목록화
- [x] 0.2 참조 파일 확인
- [x] 0.3 Publish 상태 확인

### Phase 1: Archive & Reset (1시간) ✅
- [x] 1.1 기존 TDS 파일 정리 시도 (고아 변수 참조 문제)
- [x] 1.2 **새 TDS 파일 생성** (깨끗한 상태로 시작)
- [x] 1.3 Variables/Styles/Libraries 없는 clean 상태 확인

### Phase 2: Variables (2-3시간) 🔄 진행 중
- [x] 2.1 Shadcraft Pro Variables 분석
  - Primitives (357): 원본값 (colors, spacing, radius)
  - Theme (252): 테마 변형 (Soft Pop, Vintage Paper) → **불필요, 삭제 예정**
  - Mode (62): Light/Dark 시맨틱 토큰 → **필수**
  - Pro (19): 프리미엄 기능
- [x] 2.2 Export/Import 방법 발견
  - Collection 우클릭 → Export → .zip → .tokens.json
  - TDS Variables 패널에 드래그 드롭으로 Import
- [x] 2.3 Primitives Collection Import 완료 (357개)
- [x] 2.4 Theme Collection Import 완료 (252개) → 삭제 예정
- [ ] 2.5 Mode Collection Import
- [ ] 2.6 Theme 삭제 결정
- [ ] 2.7 Tryve 색상으로 Primitives 값 교체

### Phase 3: Typography (1-2시간)
- [ ] 3.1 Shadcraft Text Styles 분석
- [ ] 3.2 Tryve 폰트 결정
- [ ] 3.3 Text Styles 복제
- [ ] 3.4 Font Family 교체
- [ ] 3.5 Size/Weight 조정

### Phase 4: Effects (30분)
- [ ] 4.1 Shadow Styles 복제
- [ ] 4.2 값 조정

### Phase 5: Components
- [ ] 5.1 Button
- [ ] 5.2 Input
- [ ] 5.3 Card
- [ ] 5.4 Badge
- [ ] ...

### Phase 6: Publish & Test
- [ ] 6.1 TDS Library Publish
- [ ] 6.2 Hi-fi 테스트
- [ ] 6.3 AI 바이브 코딩 테스트

---

## 참고

- Shadcraft Pro Variable 구조: Primitives (357) → Theme (252) → Mode (62)
- 미팅 기록: `~/Project/lenny/meetings/2026-03-06_tds-rebuild-master-plan.md`

---

## 현재 상태 (2026-03-06 11:10)

### TDS 파일 상태
- **파일명:** TDS (새로 생성, 기존 파일 폐기)
- **Variables:**
  - Primitives (357) ✅ Import 완료
  - Theme (252) ✅ Import 완료 → **삭제 예정** (불필요)
  - Mode → Import 필요

### Variables Import 방법 (발견)
```
1. Shadcraft Pro > Variables 패널 > Collection 우클릭 > Export
2. .zip 파일 저장 → 압축 해제 → .tokens.json 파일
3. TDS > Variables 패널 열기 > 빈 영역에 .json 드래그 드롭
4. Collection 이름 변경 (필요시)
```

### Collection 분석 결과
| Collection | 개수 | 용도 | TDS에 필요? |
|------------|------|------|-------------|
| Primitives | 357 | 색상/간격 원본값 | ✅ 필수 |
| Theme | 252 | 테마 프리셋 (Soft Pop, Vintage Paper) | ❌ 불필요 |
| Mode | 62 | Light/Dark 시맨틱 토큰 | ✅ 필수 |
| Pro | 19 | 프리미엄 기능 | ❓ 선택 |

### 다음 단계
1. TDS에서 Theme Collection 삭제
2. Shadcraft Pro에서 Mode Collection Export
3. TDS에 Mode Import
4. Tryve 색상 팔레트 정리
5. Primitives > colors 그룹의 값을 Tryve 색상으로 교체
