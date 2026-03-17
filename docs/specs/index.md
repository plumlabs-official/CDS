# Specs Index (SSOT)

> Single Source of Truth - 모든 규칙/사양의 정답 위치
>
> Last updated: 2026-03-17

---

## SSOT 원칙

- **규칙/사양이 바뀌면 이 폴더만 수정**
- `.ai/`, `prompts/`에는 본문 복사 금지 (링크/요약만)
- 중요 변경은 [ADR](../architecture/ADRs/)로 기록

---

## 문서 목록

### Naming & QA
| 문서 | 설명 |
|------|------|
| [naming-policy.md](../../.claude/rules/naming-policy.md) | 네이밍 정책 v1.1 (SSOT) |
| [qa-rubric.md](../../.claude/rules/qa-rubric.md) | 바이브코딩 QA 루브릭 v1.0 |

### Design Tokens
| 문서 | 설명 |
|------|------|
| [token-structure.md](token-structure.md) | 디자인 토큰 구조 |

### Technical
| 문서 | 설명 |
|------|------|
| [technical-spec.md](technical-spec.md) | 기술 사양 (플러그인 아키텍처) |

### Figma/MCP
| 문서 | 설명 |
|------|------|
| [figma-mcp-rules.md](figma-mcp-rules.md) | Figma MCP 사용 규칙 |
| [accessibility-rules.md](accessibility-rules.md) | 접근성 규칙 |

---

## Quick Reference

```bash
# SSOT 위치
docs/specs/          # 기술 사양
.claude/rules/       # 네이밍 정책, QA 루브릭

# 규칙 변경 시
1. 해당 SSOT 파일 수정
2. (필요시) ADR 작성: docs/architecture/ADRs/ADR-xxxx-*.md
```
