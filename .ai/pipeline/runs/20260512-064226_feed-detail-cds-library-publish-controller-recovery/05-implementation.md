# Implementation — Feed Detail CDS Library Publish Controller Recovery

Timestamp: 2026-05-12 07:04 KST

## Scope Executed

- CDS library file: `H36eNEd6o7ZTv4R7VcyLf2`
- Product file: `CS2ZhrORl4E1szQfTe2UvO`
- Product section: `28587:15601`
- Copied Feed Detail screens updated:
  - `28643:11`
  - `28643:104`
  - `28643:179`
- Original/protected targets intentionally not edited:
  - `28587:15677`
  - `28587:15602`
  - `28587:15770`
  - `28582:15332`
  - Lounge scope

## Library State

The CDS library already contained authored structural components, not bitmap-only components:

- `Feed Detail Action Rail`
  - node: `21997:581`
  - key: `1c5a825311b9c5f6ab74129581c4a4285f70935c`
  - type: `COMPONENT_SET`
  - variants:
    - `Author=true`, key `87a1871b74f9fbbb493c17b4adaf63c1a3a25579`
    - `Author=false`, key `67aedad40680b0789405a9b051d74d4387733af1`
  - properties:
    - `Like Count`
    - `Comment Count`
    - `Share Count`
    - `Author`
- `Feed Detail Comment Composer`
  - node: `21997:582`
  - key: `8aee4e2edacd16ea4cdd7a578161d394c0932121`
  - type: `COMPONENT`
  - property:
    - `Placeholder`

## Publish Recovery

Desktop actuator opened Figma Desktop and used the library publish flow.

Observed UI:

- before publish: `CDS 4 changes`
- publish modal listed:
  - `Accordion`
  - `Drawer`
  - `Feed Detail Action Rail`
  - `Feed Detail Comment Composer`
- actuator selected Feed Detail items, but Figma briefly showed `Changes (3 of 4)` during publish verification
- after publish: `CDS 1 change`
- remaining unpublished change: `Drawer Modified`

Result:

- Feed Detail Action Rail and Feed Detail Comment Composer are publish/importable.
- Product file import by key succeeded with `remote: true`.
- `Drawer Modified` was left unpublished.
- Possible out-of-scope publish risk: `Accordion` may have been included by Figma UI selection drift; recorded in evidence for follow-up audit.

## Product Replacement

The six local product instances in copied screens were swapped to published remote CDS library instances only:

| Screen | Node | Before | After |
|---|---:|---|---|
| `28643:11` | `28643:347` | local Action Rail Author=true | remote `Author=true` key `87a1871b74f9fbbb493c17b4adaf63c1a3a25579` |
| `28643:104` | `28643:458` | local Action Rail Author=false | remote `Author=false` key `67aedad40680b0789405a9b051d74d4387733af1` |
| `28643:179` | `28643:516` | local Action Rail Author=false | remote `Author=false` key `67aedad40680b0789405a9b051d74d4387733af1` |
| `28643:11` | `28644:107` | local Comment Composer | remote Comment Composer key `8aee4e2edacd16ea4cdd7a578161d394c0932121` |
| `28643:104` | `28644:183` | local Comment Composer | remote Comment Composer key `8aee4e2edacd16ea4cdd7a578161d394c0932121` |
| `28643:179` | `28644:256` | local Comment Composer | remote Comment Composer key `8aee4e2edacd16ea4cdd7a578161d394c0932121` |

Preserved:

- x/y/width/height on all six instances
- `Like Count=32`
- `Comment Count=2`
- `Share Count=2`
- Composer placeholder `격려와 축하의 말 한마디 부탁해요`

## Verification

- Product import probe: PASS
- Target instance remote reference check: PASS
- Copied-screen Feed Detail local-reference check: PASS
- Library token/typography/property audit:
  - text nodes use IBM Plex Sans KR text style IDs and variable bindings
  - color/size/font/line-height/font-weight variable aliases present
  - component property references present for count and placeholder text
  - no bitmap-only component structure observed

Design-system search still did not surface the new Feed Detail components immediately after publish. Import-by-key and remote instance verification passed, so this is treated as search index lag rather than publish failure.
