# Lessons Learned

> 버그 패턴 및 실수 방지 기록 (WHAT)
>
> Last updated: 2026-03-17 | v3.0.0
>
> **결정사항(WHY)은 `MEMORY.md` 참조**

---

## Figma Plugin 공통 버그 패턴

### 1. ES6+ 문법 호환성
**문제**: Figma 플러그인 런타임에서 일부 ES6+ 미지원

```typescript
// ❌ 사용 불가
const { a, ...rest } = obj;
obj?.prop?.value;

// ✅ 대체
const a = obj.a;
(obj && obj.prop && obj.prop.value);
```

**해결**: esbuild 타겟 `es6` 사용

### 2. children 배열 순회 중 삭제
**문제**: children 직접 순회 중 노드 삭제 시 에러

```typescript
// ❌ 직접 순회 - 삭제 시 에러
for (const child of node.children) { ... }

// ✅ 복사 후 순회
for (const child of [...node.children]) { ... }
```

### 3. 중첩 인스턴스 미처리
**문제**: `detachInstance()` 후 children 재귀 처리 누락

```typescript
// ✅ 올바른 코드
const frame = instance.detachInstance();
for (const child of frame.children) {
  if (child.type === 'INSTANCE') {
    processInstance(child);  // 재귀 처리
  }
}
```

### 4. getNodeById vs getNodeByIdAsync (dynamic-page 모드)
**문제**: `documentAccess: dynamic-page` 모드에서 `figma.getNodeById()` 사용 시 에러

```typescript
// ❌ 동기 API 사용
const nodeCheck = figma.getNodeById(chain.topNode.id);

// ✅ 비동기 API 사용
const nodeCheck = await figma.getNodeByIdAsync(chain.topNode.id);
```

### 5. 삭제된 노드의 속성 접근
**문제**: 노드 삭제 가능한 함수 호출 후 `.name` 등 접근 시 에러

```typescript
// ❌ 삭제 후 접근
const result = await processNode(chain.topNode);
flattenedNames.push(chain.topNode.name);  // 에러!

// ✅ 미리 저장
const chainName = chain.topNode.name;
const result = await processNode(chain.topNode);
flattenedNames.push(chainName);
```

---

## 디버깅 프로세스 (KPT 기반)

> 2026-01-16 세션 회고에서 도출

### Keep - 유지할 행동

| 행동 | 이유 |
|------|------|
| 플랜 모드로 설계 후 구현 | 복잡한 기능에서 엣지 케이스 미리 고려 |
| 안전 장치 우선 설계 | 의도치 않은 삭제 방지 |
| 스크린샷 기반 디버깅 | 실제 UI 상태 확인으로 문제 빠르게 파악 |
| 문제 해결 후 문서화 | lessons-learned.md에 패턴 기록 → 재발 방지 |

### Problem - 피해야 할 패턴

| 패턴 | 결과 | 대안 |
|------|------|------|
| 데이터 구조 가정 | 반복 수정 | console.log로 구조 먼저 출력 |
| 증상 기반 수정 | 불필요한 코드 변경 | 원인 분석 → 가설 → 검증 순서 |
| 디버그 로그 늦게 추가 | 원인 파악 지연 | **첫 시도부터** 반환값 로깅 |
| **원인 추측 후 검증 없이 수정** | 실제 원인 놓침 | 유저에게 **실제 값 확인 요청** 후 수정 |
| **빌드 적용 확인 누락** | 효과 확인 불가 | 빌드 후 플러그인 리로드 여부 확인 |

### Try - 다음에 시도할 것

1. **구조 먼저 출력**
   ```typescript
   console.log('[DEBUG] node:', JSON.stringify({
     type: node.type, name: node.name,
     childCount: 'children' in node ? node.children.length : 0
   }));
   ```

2. **가설 검증 흐름**: 문제 발생 → "왜?" 질문 → 가설 수립 → 로그로 검증 → 수정

3. **Figma 노드 타입 체크리스트**
   - [ ] 해당 타입이 children을 가지는가?
   - [ ] children의 의미는? (실제 콘텐츠 vs 구조용)
   - [ ] 좌표 시스템은? (절대 vs 상대)

---

## 체크리스트

> 작업 전 체크리스트는 `CLAUDE.md` 참조 (세션 시작 시 자동 로드)

---

## Claude Code 커맨드 버그 패턴

### 1. Unknown skill 에러 (frontmatter 누락)

**날짜**: 2026-01-17

**원인**: YAML frontmatter 없이 파일 생성

```markdown
// ❌ 잘못된 예
# /record Command  ← 바로 시작

// ✅ 올바른 예
---
description: 커맨드 설명
allowed-tools: [Read, Edit, Bash]
---
# /record Command
```

### 2. Unknown skill 에러 (홈 디렉토리 미복사)

**원인**: 프로젝트 `.claude/commands/`에만 생성, 홈 `~/.claude/commands/`에 없음

**해결**: 두 곳 모두에 파일 생성

---

## TDS 컴포넌트 정합성 미확인 패턴

### 1. 공용 컴포넌트 수정 시 영향도 미확인 (2026-03-15)

**상황**: Tab Bar Badge 작업 중 공용 TDS 컴포넌트에 영향도 확인 없이 수정 동의

**재발방지**:
1. 수정 제안/동의 전 **사용처 확인** (이 컴포넌트가 공용인가?)
2. **원본 vs 인스턴스 구분** 명시 (원본 수정 = 전파, 오버라이드 = 깨짐)
3. **기존 존재 여부 확인** (`get_design_context` 결과 먼저 읽기)
4. **"좋습니다" 전에 영향도 1문장이라도 출력**

---

## Archive (삭제된 모듈)

> 아래 패턴들은 삭제된 모듈(Cleanup, AI Agent Server, Naming, Figma 속성 추출)에서 발생했던 버그입니다.
> 모듈 삭제(2026-03-17)로 더 이상 활성 코드가 아니지만, 유사 패턴 참고용으로 보관합니다.

### Cleanup 버그 패턴 (모듈 삭제됨)

- 좌표 계산 버그: 래퍼 제거 시 절대/상대 좌표 혼동
- 삭제된 노드 접근: children 배열 복사 필요
- 오프셋 래퍼 보존: 자식이 원점(0,0)에 없으면 래퍼로 판단 안 함
- GROUP 자식 래퍼 보존: GROUP은 FRAME과 좌표 시스템이 다름
- Auto Layout 내부 빈 요소 보존: AL은 자식 변경 시 자동 재배치
- 의도적 프레임 이름 보존: 자동생성 이름 패턴만 래퍼 후보
- detachInstance 후 크기 변경: 원래 크기 저장+복원 필요
- BOOLEAN_OPERATION 자식 탐색 오판: 마스킹 구조는 즉시 false
- 캐시 clear는 진입점 함수에서만 (반복 함수 내부 금지)

### AI Agent 버그 패턴 (모듈 삭제됨)

- max_tokens 부족: 100+ 노드 시 32768 필요
- SDK 타임아웃: 스트리밍 필수
- 후처리 원래/제안 이름 혼동: 변환 후 데이터 기준으로 비교
- 스킵 조건 분산: 디버그 로그로 추적
- 빌드 누락: 통합 빌드 스크립트 사용

### Figma 속성 추출 버그 패턴 (모듈 삭제됨)

- fillColor 미전달: 버튼 구조가 FRAME > GROUP > RECTANGLE, 재귀 탐색 필요

### Naming 버그 패턴 (모듈 삭제됨, naming-policy.md로 대체)

- Layout 타입 금지
- Purpose 누락
- Container에 Size 적용 금지

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-03-17 | v3.0.0 — 삭제 모듈 패턴 Archive 이동, 활성 패턴 정리 |
| 2026-03-15 | TDS 컴포넌트 정합성 미확인 패턴 추가 |
| 2026-01-17 | Claude Code 커맨드 버그 패턴 추가 |
| 2026-01-16 | KPT 디버깅 프로세스, Cleanup/AI Agent 다수 패턴 추가 |
| 2026-01-15 | Cleanup, Component Break, 빌드 위치 패턴 추가 |

---

## 관련 문서

| 문서 | 역할 |
|------|------|
| [../../.claude/rules/naming-policy.md](../../.claude/rules/naming-policy.md) | 네이밍 정책 (SSOT) |
| [../../.claude/rules/qa-rubric.md](../../.claude/rules/qa-rubric.md) | QA 루브릭 |
