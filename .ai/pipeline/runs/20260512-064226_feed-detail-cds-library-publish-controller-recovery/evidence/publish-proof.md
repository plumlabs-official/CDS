# Publish Proof — Feed Detail CDS Library

Timestamp: 2026-05-12 07:04 KST

## Published Components

| Component | Library Node | Library Key | Product Import |
|---|---:|---|---|
| `Feed Detail Action Rail` | `21997:581` | `1c5a825311b9c5f6ab74129581c4a4285f70935c` | PASS, `remote: true` |
| `Feed Detail Comment Composer` | `21997:582` | `8aee4e2edacd16ea4cdd7a578161d394c0932121` | PASS, `remote: true` |

## Import Proof

Product file `CS2ZhrORl4E1szQfTe2UvO` successfully imported:

- Action Rail component set:
  - imported node `28661:12`
  - `remote: true`
  - variants:
    - `Author=true`, key `87a1871b74f9fbbb493c17b4adaf63c1a3a25579`
    - `Author=false`, key `67aedad40680b0789405a9b051d74d4387733af1`
- Comment Composer component:
  - imported node `28661:46`
  - `remote: true`
  - key `8aee4e2edacd16ea4cdd7a578161d394c0932121`

## Desktop Publish UI Evidence

- Before: `Review unpublished changes` showed `CDS 4 changes`.
- Modal listed `Accordion`, `Drawer`, `Feed Detail Action Rail`, `Feed Detail Comment Composer`.
- Actuator selected Feed Detail items, but Figma briefly reported `Changes (3 of 4)` during publish verification.
- After: `Review unpublished changes` showed `CDS 1 change`.
- Remaining unpublished change: `Drawer Modified`.

## Risk Note

`Accordion` may have been published with the Feed Detail components because Figma's modal selection state drifted from `2 of 4` to `3 of 4` while the publish flow was already assembling. `Drawer` remained unpublished. No Lounge component or product Lounge screen was touched.
