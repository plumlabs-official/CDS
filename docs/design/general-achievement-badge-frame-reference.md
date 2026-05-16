# General Achievement Badge Frame Reference

> 일반 업적 배지 생성 시 참조 후보로 저장한 6단계 프레임 세트.

## Status

**HOLD - do not use as the canonical frame set yet.**

User review found that the 1-3단계 simple circular frames are slightly distorted horizontally. This reference must not be used for future 일반 업적 배지 generation until a corrected version preserves true circular geometry for all six frames.

## Stored Asset

- Image: `assets/references/achievement-badges/general-achievement-badge-frames.png`
- SHA-256: `cc44fb24d32d926e94ab0db04a984892865e2687c65924617adfa7167a0b2dee`
- Dimensions: `1448 x 1086`
- Source: extracted six-tier frame reference from the 2026-05 category badge work.

## Usage

- Do not use this frame set for future **일반 업적 배지** image generation until the 1-3단계 distortion is corrected.
- Preserve the six-step frame hierarchy:
  - 1단계: mint simple circular frame
  - 2단계: lavender simple circular frame
  - 3단계: gold simple circular frame
  - 4단계: pink faceted jewel frame
  - 5단계: blue faceted jewel frame
  - 6단계: silver/opal faceted jewel frame
- In the corrected version, generate the subject/icon inside the empty center while keeping the frame geometry, material, lighting, and layout consistent.
- Assign one of the six frames according to the achievement tier or randomly when the request explicitly asks for random placement.
- Do not replace this reference with a newly generated frame unless the user explicitly approves a new default.

## Image Generation Routing

- Default for quick visual drafts and one-off badge generation: Codex built-in `image_gen`.
- Use API `gpt-image-2` only when the work requires model evidence, repeatable/batch generation, manifest/hash/request-id logging, delivery review, or client-facing audit records.
- For transparent PNG output, run a post-processing and alpha verification step after generation.
