# General Achievement Badge Frame Reference

> 일반 업적 배지 프레임/아트웍 제작 전략과 현재 레퍼런스 상태.

## Status

**REDESIGN REQUIRED - no canonical normal achievement frame pack is active.**

The previous frame directions are intentionally not canonical:

- `assets/references/achievement-badges/general-achievement-badge-frames.png`: superseded because the 1-3단계 simple circular frames were horizontally distorted.
- The jewel/faceted/laurel direction discussed on 2026-05-16 is paused because it reads too much like an RPG medal for the intended product tone.
- `assets/Badge/Normal-1.png` through `Normal-6.png` are not present in the current asset folder and must not be referenced as available production assets.

Next canonical work should start from a new non-RPG frame system before mask packs, composition automation, or batch badge generation.

## Current Assets

`assets/Badge/` currently stores reference material, not a final normal frame system.

### Artwork Output

- `assets/Badge/Artwork/sagittarius-inner-artwork-source.png`
- `assets/Badge/Artwork/sagittarius-inner-artwork.png`

### Badge + Artwork Composition Samples

- `assets/Badge/Sample/book.png`
- `assets/Badge/Sample/homegym.png`
- `assets/Badge/Sample/meditation.png`

### Casual 3D Artwork Style Samples

- `assets/Badge/Sample/character sample.png`
- `assets/Badge/Sample/icon sample.jpg`
- `assets/Badge/Sample/icon sample2.png`
- `assets/Badge/Sample/icon sample3.png`

### Human Or People-Related References

- `assets/Badge/Sample/human.jpg`
- `assets/Badge/Sample/people.png`
- `assets/Badge/Sample/d5d22ace-a841-4977-901a-cc4c8225de03.png`

### Archive

- `assets/Badge/Archive/ChatGPT Image 2026년 5월 16일 오전 11_32_44.png`

## Direction For The Next Frame System

- Avoid RPG medal cues: large gemstones, faceted crystal rings, laurel wreaths, crown-like ornaments, and high-fantasy shine.
- Move toward a soft app badge / casual 3D token language: simpler silhouette, lower rim height, friendlier materials, and product-native icon composition.
- Keep the frame/mask structure stable once the new direction is approved, even if visual styling changes later.
- Build each tier as a technical pack: locked frame, inner mask, foreground occlusion mask, overflow mask, palette, and one best integrated composition reference.

## Image Generation Routing

- Default for quick visual drafts and one-off badge exploration: Codex built-in `image_gen`.
- Use API `gpt-image-2` only when the work requires model evidence, repeatable/batch generation, manifest/hash/request-id logging, delivery review, or client-facing audit records.
- For transparent PNG output, run post-processing and alpha verification after generation.
