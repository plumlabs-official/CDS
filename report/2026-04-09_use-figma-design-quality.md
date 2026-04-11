# 리서치 리포트: use_figma Plugin API 디자인 퀄리티 향상 전략

> 생성일: 2026-04-09 | 신뢰도: 93% | 소스: 28개 (A급 20개) | 라운드: 1/3

## Executive Summary

**현재 접근(createFrame/createText로 처음부터 빌드)이 와이어프레임 수준에 머무른 근본 원인은 3가지:**
1. 기존 고품질 디자인을 clone하지 않고 빈 프레임부터 시작
2. 비주얼 폴리시(그라디언트, 섀도우, cornerSmoothing) 미적용
3. 디자인 토큰 하드코딩 (hex/px 직접 입력)

**해결 전략**: "Clone-First, Token-Bound, Polish-Layer" 3단계 접근.

---

## 1. 전략 비교: Clone vs Build from Scratch

| 전략 | 장점 | 단점 | 디자인 퀄리티 |
|------|------|------|-------------|
| **clone() → modify** | 모든 시각 속성 보존, 코드량 최소, 원본 퀄리티 유지 | 같은 파일 내만 가능, 원본 의존 | **프로덕션급** |
| **createFrame/createText** | 완전 제어, 외부 의존 없음 | 코드량 폭증, 시각 일관성 유지 어려움 | **와이어프레임급** |
| **importComponent → createInstance** | DS 연동, 자동 업데이트 | 컴포넌트 key 필요, 오버라이드 한계 | **컴포넌트 수준** |

### 의사결정 플로우
```
기존 파일에 고품질 디자인이 있는가?
├─ YES → 컴포넌트 인스턴스인가?
│   ├─ YES → createInstance() + setProperties()
│   └─ NO → clone() + modify
└─ NO → createFrame + 비주얼 폴리시 필수 적용
```

**우리 케이스**: 기존 크리에이터 페이월(24567:27277)이 이미 존재 → **clone→modify가 정답이었음.**

---

## 2. 비주얼 폴리시 코드 패턴

### 2-1. 그라디언트 배경 (다크 프리미엄 느낌)
```js
node.fills = [
  // 베이스 솔리드
  { type: 'SOLID', color: { r: 0.07, g: 0.07, b: 0.11 }, opacity: 1, visible: true, blendMode: 'NORMAL' },
  // 그라디언트 글로우
  { type: 'GRADIENT_RADIAL',
    gradientTransform: [[0.8, 0, 0.1], [0, 0.8, 0.1]],
    gradientStops: [
      { position: 0, color: { r: 0.4, g: 0.2, b: 0.8, a: 0.4 } },
      { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } }
    ],
    opacity: 0.6, visible: true, blendMode: 'SCREEN'
  }
]
```

### 2-2. 다중 섀도우 (깊이감)
```js
node.effects = [
  { type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.12 }, offset: {x:0,y:8}, radius: 24, spread: -4, visible: true, blendMode: 'NORMAL' },
  { type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.04 }, offset: {x:0,y:2}, radius: 6, spread: 0, visible: true, blendMode: 'NORMAL' },
  { type: 'INNER_SHADOW', color: { r:1,g:1,b:1,a:0.12 }, offset: {x:0,y:1}, radius: 0, spread: 0, visible: true, blendMode: 'NORMAL' }
]
```

### 2-3. iOS Squircle
```js
node.cornerRadius = 16;
node.cornerSmoothing = 0.6;  // iOS 7 superellipse
```

### 2-4. 글래스모피즘 카드
```js
node.fills = [{ type: 'SOLID', color: {r:1,g:1,b:1}, opacity: 0.08, blendMode: 'NORMAL', visible: true }];
node.effects = [{ type: 'BACKGROUND_BLUR', radius: 40, visible: true }];
node.strokes = [figma.util.solidPaint('#FFFFFF1A')];
node.strokeWeight = 1;
node.strokeAlign = 'INSIDE';
```

### 2-5. gradientTransform 방향 참조
| 방향 | 매트릭스 |
|------|----------|
| 좌→우 | `[[1,0,0],[0,1,0]]` |
| 상→하 | `[[0,1,0],[-1,0,1]]` |
| 대각 | `[[-0.5,0.5,0.5],[-0.5,-0.5,1]]` |

---

## 3. 디자인 토큰 바인딩 패턴

### 하드코딩 금지 원칙
```js
// BAD
node.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.3, b: 0.9 } }]

// GOOD - 토큰 바인딩
const colorVar = await figma.variables.importVariableByKeyAsync("COLOR_KEY");
const paint = figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: {r:0,g:0,b:0} }, 'color', colorVar
);
node.fills = [paint];
```

### 스페이싱 바인딩
```js
const spacingVar = await figma.variables.importVariableByKeyAsync("SPACING_KEY");
node.setBoundVariable("paddingLeft", spacingVar);
node.setBoundVariable("paddingRight", spacingVar);
node.setBoundVariable("itemSpacing", spacingVar);
```

### 텍스트 스타일 적용
```js
const textStyle = await figma.importStyleByKeyAsync("TEXT_STYLE_KEY");
textNode.textStyleId = textStyle.id;
```

---

## 4. 컴포넌트 인스턴스 오버라이드 핵심

### setProperties 규칙
```js
// VARIANT: 이름만 (접미사 불필요)
// TEXT/BOOLEAN/INSTANCE_SWAP: 전체 키 필수 (PropertyName#0:1)
instance.setProperties({
  'Size': 'Large',                    // VARIANT
  'ButtonText#0:1': 'Login',          // TEXT
  'ImageVisible#0:0': false,          // BOOLEAN
  'Icon#0:2': otherIconComp.id,       // INSTANCE_SWAP
});
```

### swapComponent vs mainComponent
- `swapComponent()`: 오버라이드 보존 (텍스트, 색상 유지)
- `mainComponent = `: 오버라이드 전부 클리어

### SLOT 제약
- `setProperties()`로 SLOT 설정 불가 (`cannotSetSlotProperty` 에러)
- `appendChild()`도 인스턴스 내부에서 불가
- 우회: INSTANCE_SWAP 프로퍼티로 유사 슬롯 구현

---

## 5. AI + Figma MCP 최적 워크플로우

### Dual-Track 패턴 (공식 권장)
```
Track A: generate_figma_design → 픽셀 퍼펙트 캡처 (비주얼 레퍼런스)
Track B: use_figma → 디자인 시스템 컴포넌트 기반 빌드
→ B의 결과를 A의 레이아웃에 정렬 → A 삭제
```

### 섹션별 빌드 필수
- 1 use_figma 호출 = 1 섹션
- 각 섹션 후 get_screenshot 검증
- top-level 빌드 후 reparent 금지 (silent fail)

### 디스커버리 우선
```
1. search_design_system (컴포넌트, 변수, 스타일)
2. get_metadata (기존 화면 구조)
3. 기존 화면 인스턴스 분석 (가장 정확한 매핑)
```

---

## 6. 결론: 페이월 리빌드 전략

### 현재 산출물의 문제
- createFrame/createText로 빈 프레임부터 빌드 → 와이어프레임 수준
- 비주얼 폴리시 0 (그라디언트, 섀도우, cornerSmoothing 미적용)
- 디자인 토큰 미바인딩 (hex 하드코딩)
- TDS 컴포넌트 인스턴스 제한적 활용

### 권장 리빌드 접근

**Option A (최우선): 기존 페이월 clone → modify**
1. 기존 크리에이터 페이월(24567:27277) clone
2. 텍스트 내용만 새 결정사항 반영 (비교표, 티어 카드 등)
3. 필요한 섹션만 추가 빌드 (FAQ 아코디언 등)
4. 원본의 비주얼 퀄리티 100% 보존

**Option B: 처음부터 리빌드 (폴리시 적용)**
1. 래퍼 프레임 + 다크 그라디언트 배경
2. TDS 컴포넌트 인스턴스 최대 활용 + setProperties 오버라이드
3. 모든 색상/간격 토큰 바인딩
4. 카드에 글래스모피즘 + 다중 섀도우
5. cornerSmoothing 0.6 적용
6. 섹션별 get_screenshot 검증

**Option C: Dual-Track (웹 레퍼런스 있을 때)**
1. generate_figma_design으로 레퍼런스 캡처
2. use_figma로 DS 기반 빌드
3. 레이아웃 정렬 후 캡처 삭제

---

*Generated by /research — Deep Research Protocol*
*Confidence: 93% | Sources: 28 | Rounds: 1/3*
