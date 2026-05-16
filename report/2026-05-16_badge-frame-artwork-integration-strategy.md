# Badge Frame Artwork Integration Strategy

> Date: 2026-05-16
> Context: CDS achievement badge production strategy
> Trigger: `-director -research`

## Executive Summary

Do not ask the image model to regenerate the whole badge frame every time.

The best production strategy is a **frame-locked sandwich workflow**:

1. Keep the canonical frame as a locked pixel asset.
2. Generate artwork against a compositing preview that includes the frame.
3. Split the final badge into deterministic layers:
   - back/inside artwork layer
   - locked frame layer
   - optional foreground overlap layer
   - deterministic shadow/contact layer
4. Use GPT Image 2 only for the parts that need style adaptation and subject generation, not for the canonical frame pixels.

This preserves frame details while allowing the artwork to feel integrated, masked, partially hidden, and slightly protruding.

## Why The Current Two Extremes Fail

### One-shot frame + artwork generation

Pros:
- Strong global tone matching.
- Natural interaction between subject and frame.
- Easy protrusions and masking.

Cons:
- Frame thickness, jewelry, bevels, rim geometry, and tier-specific details drift between generations.
- QA becomes expensive because every badge can subtly mutate the design system.

### Separate artwork + fixed frame compositing

Pros:
- Frame stays stable.
- Tier hierarchy is protected.
- Easy to audit with hashes.

Cons:
- Artwork can look pasted on.
- Lighting and material often mismatch.
- Protrusions and occlusion require explicit layering, not flat paste.

## Recommended Workflow

### 1. Canonical Frame Pack

Each tier needs a small technical pack:

- `frame_full.png`: final locked frame with transparent outside if available.
- `frame_backplate.png`: inner colored base/backplate.
- `frame_foreground.png`: rim/jewels/laurel pieces that should occlude artwork.
- `inner_mask.png`: safe visible area inside frame.
- `overflow_mask.png`: allowed protrusion area outside the inner circle but inside final badge crop.
- `depth_map.png` or `occlusion_mask.png`: zones where artwork goes behind the rim/jewels.
- `palette.json`: dominant colors, highlight colors, shadow colors, material notes.

The important split is `frame_foreground.png`. Without it, protruding/masked artwork will always feel pasted.

### 2. Generate With Frame Context, But Do Not Trust Frame Pixels

Use GPT Image 2 with a preview image that includes the locked frame, but treat its output as a **concept layer**, not the final frame.

Prompt structure:

```text
Use the provided badge frame only as an immutable composition reference.
Create the subject artwork so it visually belongs to this frame's palette,
material, lighting, and depth.
The final production frame will be composited separately, so do not invent
new rim details, jewels, text, dates, or frame ornaments.
Design the subject with clear behind-frame and in-front-of-frame regions:
- behind rim: ...
- protrudes above rim: ...
- contact shadow direction: ...
```

Then extract or recreate only the subject/interaction layer. The model output should guide style and interaction, not replace the canonical frame.

### 3. Deterministic Final Composite

Final badge assembly should be deterministic:

```text
canvas
  background/backplate
  artwork_back clipped by inner_mask
  contact_shadow clipped by inner_mask or rim-contact mask
  locked frame_full or frame_mid
  artwork_front clipped by overflow_mask
  frame_foreground/jewels/laurel occlusion layer
  final highlights/shadows if needed
```

This gives the same freedom as one-shot generation while keeping the frame hash stable.

### 4. QA Gates

Minimum gates:

- Frame pixel hash equals canonical hash for all locked frame pixels.
- No new jewels/rim ornaments outside approved masks.
- Artwork palette delta is within tier palette range.
- Subject has at least one intentional frame interaction:
  - clipped behind rim
  - foreground protrusion
  - contact shadow on inner base
  - overlap with laurel/jewel occlusion
- Final PNG is expected size/mode.
- Figma node readback or screenshot is saved.

## Role Of GPT Image 2

Use GPT Image 2 for:

- subject ideation
- style transfer to a tier palette
- full-scene preview showing how artwork should interact with frame
- generating candidate foreground/background subject layers when masks are available

Do not use GPT Image 2 as the final authority for:

- rim thickness
- gemstone count/position
- exact frame bevels
- canonical tier hierarchy
- transparent background guarantees without post-processing

## Practical Recommendation For CDS

The user's proposed method is directionally right, but needs one correction:

> Do not ask GPT Image 2 to output the final whole badge with the frame preserved.

Instead:

1. Export each completed Figma frame as a locked reference.
2. Build masks from that frame once.
3. Ask GPT Image 2 for a full integrated preview using the frame reference.
4. Ask for or extract artwork layers from the preview.
5. Composite those layers under/over the locked frame deterministically.
6. Validate frame hash and screenshot.

## Sources

- OpenAI GPT Image 2 model docs: https://developers.openai.com/api/docs/models/gpt-image-2
- OpenAI image generation guide: https://platform.openai.com/docs/guides/image-generation
- Figma reference inspected:
  - `CS2ZhrORl4E1szQfTe2UvO`, node `29134:51590`
  - `H36eNEd6o7ZTv4R7VcyLf2`, node `22290:3398`
