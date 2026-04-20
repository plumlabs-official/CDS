# Google Stitch / Pencil(.dev) — CDS 기반 시안 생성 대안 평가

> 생성일: 2026-04-20 | 신뢰도: 78% | 소스: 10 | 상위: `2026-04-20_claude-design-file-upload-mechanism.md`
> 목적: Claude Design 주간 한도 도달 시 "CDS 기반 크리에이터 큐레이션 홈" 시안을 Stitch/Pencil로 대체 가능한지 실무 판정

## Executive Summary

> **판정**: 둘 다 **"CDS 대체재"로는 부적합**. Stitch는 `.fig` 업로드/임포트 자체를 지원하지 않으며, 디자인 시스템은 `DESIGN.md`(색/타이포/토큰 정도의 마크다운 요약)로만 수용. Pencil은 Figma에서 **복사→붙여넣기**로 일부 프레임을 가져올 수 있으나 **섹션/프레임 단위**로만 편집 가능하고 컴포넌트 **인스턴스 바인딩은 끊어짐**. CDS 라이브러리(44MB, 컴포넌트 계약 기반)가 기대하는 "인스턴스로 배치, 토큰 바인딩 유지, 한글 폰트 렌더" 중 **어느 것도 보장되지 않음**. **Claude Design 7일 대기가 실무상 가장 빠른 경로**. 대안은 상위 리포트의 **Figma MCP + Claude Code**(이미 세팅됨).

---

## Q1. Google Stitch (2026-03 업데이트 기준)

| 항목 | 지원 | 비고 |
|------|------|------|
| `.fig` 파일 업로드 | **X** | 공식 문서 및 리뷰 모두 언급 없음. 입력은 프롬프트/이미지/URL 한정 |
| Figma URL 임포트 | **X** | 방향성은 Stitch→Figma **단방향 export**만. "Copy to Figma" 붙여넣기 |
| 디자인 시스템 참조 | **△ DESIGN.md** | 색/타이포/스페이싱/컴포넌트 패턴을 **마크다운 문서**로 기술. 실제 컴포넌트 바이너리 아님 |
| 입력 형식 | 프롬프트, 이미지(와이어/스크린샷), URL(사이트 스크래핑) | Gemini 2.5/3 Pro 멀티모달 |
| 출력 | HTML 프로토타입, Figma 복붙(Auto Layout 보존) | Gemini 3 Pro 모드는 Figma 복붙 미지원 |
| 가격 | **무료(Google Labs 실험)** | Standard 350/월 (또는 daily credit, 2026-03 전환 중). Pro 200/월, Experimental 50/월 |
| MCP 서버 | **O** | Claude Code/Cursor 연결 가능 (공식 블로그 확인) |

**결론**: 입력은 프롬프트/이미지 중심. CDS `.fig`를 "올려서 인식" 자체가 불가. DESIGN.md로 **토큰 요약**은 줄 수 있으나 Claude Design의 "Design System representation"과 유사 수준이며, **컴포넌트 인스턴스 정보는 없음**.

## Q2. Pencil (pencil.dev, 공식)

> 사용자 질문의 "Pencil(.pen)"은 **Pencil.dev** (Plum Labs 아닌 별도 서비스, Shadcn 기반 AI 디자인 툴)로 확정. `.pen` = 순수 JSON 포맷.
> 참고: 이 로컬 환경에 **Pencil MCP 서버가 이미 연결**되어 있음 (`get_editor_state`, `batch_design` 등 사용 가능).

| 항목 | 지원 | 비고 |
|------|------|------|
| `.fig` 파일 업로드 | **X** | 바이너리 `.fig` 지원 없음 |
| Figma 프레임 가져오기 | **△ 클립보드 복붙** | Figma Desktop에서 프레임 Cmd+C → Pencil Cmd+V. 텍스트/도형/이미지 1계층까지 편집, 그 아래는 **이미지로 플래튼** |
| 디자인 시스템 | **O (내장 제한적)** | Shadcn UI, Halo, Lunaris, Nitro 내장. 외부 라이브러리는 **import 컴포넌트로 추가 가능**(작업 공간 내 코드 컴포넌트에서 역생성) |
| 디자인 토큰 | **O** | `globals.css` 변수 import/export 양방향 |
| 입력 형식 | 프롬프트, Figma 복붙, `.pen`, 코드 컴포넌트(워크스페이스 내) | Cmd+K 채팅 |
| 출력 | `.pen` (JSON), React/Next.js/Tailwind 코드 | Claude Code MCP로 코드 생성 |
| 가격 | **무료** (현재 전 플랜 무료, 추후 유료 예고) | 한도 비공개 |
| 한글 폰트 | **미검증** | 공식 문서/리뷰에 한글/CJK 폰트 언급 전무 |

**결론**: Figma 복붙 임포트가 되지만 **CDS 컴포넌트 인스턴스 계약은 소실**. CDS를 Pencil에서 쓰려면 CDS 코드 라이브러리(React+Tailwind)를 워크스페이스에 두고 "코드 컴포넌트 import"를 써야 하는데 — 현재 CDS는 `.fig` 라이브러리뿐이므로 **이 경로는 즉시 적용 불가**.

## Q3. CDS `.fig` 업로드 시 예상 효과

| 축 | Claude Design (기준) | Stitch | Pencil |
|----|---------------------|--------|--------|
| 컴포넌트 인식 | "외형 모사" (토큰/요약) | **업로드 불가** (DESIGN.md 수기 기술만) | 복붙 시 **1계층만 편집 가능**, 나머지 플래튼 |
| 실제 인스턴스 배치 | X | X | X |
| 토큰 바인딩 보존 | △ (추출 저장) | △ (DESIGN.md에 명시한 것만) | O (CSS 변수 양방향 — 단 CSS로 export된 경우) |
| 한글 폰트 (Plex KR/Pretendard) | 이미지 업로드 시 렌더 신뢰 가능 | 웹폰트 가능하나 **한글 바인딩 미검증** | **미검증** |
| CDS 44MB `.fig` 직접 소화 | 암묵 지원, multi-file 불안정 | **불가** | **불가** |

**핵심**: Figma MCP 외 경로에서는 "CDS 인스턴스가 실제 배치된 시안"을 만들 수 없음. Stitch/Pencil 모두 **프롬프트→UI 생성기**에 가까우며, 디자인 시스템은 **토큰 수준의 스타일 가이드**로만 수용.

## Q4. 실무 판정 — Claude Design 한도 대기 중 무엇을 할 것인가

### 권장 순위

1. **[최우선] Figma MCP + Claude Code**: 이미 이 로컬에 Figma MCP가 붙어있고 CDS 라이브러리(`H36eNEd6o7ZTv4R7VcyLf2`) 및 프로덕트 파일(`t0SK7XaNqw8qIY3PpZw4s7`) 모두 읽기 가능. `get_design_context`로 인스턴스 실제 배치 + 토큰/Plex KR 바인딩 유지. **상위 리포트 결론과 동일**.
2. **[보조] Pencil MCP + Claude Code**: 로컬에 Pencil MCP가 연결됨. 빠른 **레이아웃 프로토타이핑**(Shadcn 기반)에 유용. 단 CDS 라이브러리 계약은 재현되지 않으므로 "러프 와이어프레임" 단계에 한정. `.pen`은 JSON이라 Claude가 구조 추론/수정 용이.
3. **[제한 사용] Stitch**: 크리에이터 큐레이션 홈의 **완전히 새로운 방향 탐색**(CDS와 무관한 외부 영감 단계)에 한정. 결과물을 Figma로 복붙 후 CDS 인스턴스로 재교체하는 **2단계 워크플로**면 활용 가치 있음. 하지만 "CDS 기반 시안"이 목표라면 투자 대비 낮음.
4. **[비추천] Stitch/Pencil에 CDS `.fig` 올리기**: 둘 다 `.fig` 바이너리 임포트를 지원하지 않음.

### 경계선 판단

"Claude Design 한도 대기 7일 동안 뭔가 진행해야 한다"면 **Figma MCP 루트로 즉시 전환**이 답. Stitch/Pencil은 CDS 계약을 모르므로, 나온 결과를 Figma에 붙여도 **인스턴스 교체 수작업 발생** → 결국 Figma MCP 루트보다 느림.

---

## 미검증 / 추가 필요

- Stitch `DESIGN.md`에 IBM Plex Sans KR / Pretendard 지정 시 실제 렌더 품질 (한글 웹폰트 URL 지정 가능성은 있으나 공식 예시 없음)
- Pencil의 복붙 임포트에서 Figma Variable(토큰) 바인딩이 `.pen`의 variable로 이식되는지 여부 (공식 문서는 CSS 변수 경로만 명시)
- Pencil 한글/CJK 폰트 지원 — 공식/비공식 전거 모두 없음. 한국 사용자 리뷰 부재
- Stitch 2026-03 업데이트의 "Figma import(역방향)" 루머 — 일부 매체 언급 있으나 공식 확인 안 됨

## Sources

| # | URL | 유형 | 신뢰도 | WebFetch |
|---|-----|------|--------|----------|
| 1 | [developers.googleblog.com/stitch-a-new-way-to-design-uis](https://developers.googleblog.com/stitch-a-new-way-to-design-uis/) | 공식 블로그 | A | O |
| 2 | [nxcode.io/google-stitch-complete-guide-vibe-design-2026](https://www.nxcode.io/resources/news/google-stitch-complete-guide-vibe-design-2026) | 매체 | B | O |
| 3 | [stitch.withgoogle.com/pricing](https://stitch.withgoogle.com/pricing) | 공식 | A | 미방문 |
| 4 | [medium.com/@0xmega/google-stitch-tutorial-2026](https://medium.com/@0xmega/google-stitch-tutorial-2026-the-tool-that-made-figmas-stock-drop-10-in-a-day-7a051b77a591) | 개인 블로그 | C | O |
| 5 | [the-ai-corner.com/google-stitch-ai-design-tool-guide-2026](https://www.the-ai-corner.com/p/google-stitch-ai-design-tool-guide-2026) | 매체 | B | O (페이월) |
| 6 | [pencil.dev/pricing](https://www.pencil.dev/pricing) | 공식 | A | O |
| 7 | [docs.pencil.dev/design-and-code/design-to-code](https://docs.pencil.dev/design-and-code/design-to-code) | 공식 문서 | A | O |
| 8 | [trypencil.com/blog/features/figma-integration](https://trypencil.com/blog/features/figma-integration) | 공식 블로그 | A | O |
| 9 | [banani.co/blog/pencil-dev-review](https://www.banani.co/blog/pencil-dev-review) | 리뷰 매체 | B | O |
| 10 | [atalupadhyay.wordpress.com/pencil-dev-claude-code-workflow](https://atalupadhyay.wordpress.com/2026/02/25/pencil-dev-claude-code-workflow-from-design-to-production-code-in-minutes/) | 개인 블로그 | C | O |

---
*Generated by /research — Claude Design 대안 평가 (Stitch/Pencil)*
</content>
</invoke>