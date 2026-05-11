# Implementation

## Scope Applied By Worker-01
- Filled run artifacts inside assigned write scope:
  - `target-screen-inventory.md`
  - `component-mapping.md`
  - `completion-evidence.json`
- Kept implementation bounded to controller-serial workflow requirements.

## Controller-Serial Required Steps (Not Executed In This Headless Worker)
1. Product backup creation for `22206:21655` before mutation.
2. Published `Lounge Update Item` probe in product file:
   - key `1dd4808f25b6577b8e6f9e3379295665175bb53c`
   - node `21708:253`, file `H36eNEd6o7ZTv4R7VcyLf2`
3. Four replacements in `Updates Card List` `25972:54733`:
   - source wrappers `25972:54734`, `25972:54739`, `25972:54744`, `25972:55344`.
4. Postflight evidence capture (layout/property/text/bounds/protected nodes).

## Current Status
- Status: `blocked`
- Reason: controller-side Figma probe found that the published CDS `Lounge Update Item` cannot safely replace the four active `Upadates Card` wrappers.
- No permanent Figma product mutation was performed. Temporary probe instances were removed.
- No repository source-code files outside run artifacts were modified.

## Controller Probe Results
- Target list: `Updates Card List` (`25972:54733`)
- Parent layout: `VERTICAL`, spacing `24`, padding L/R `16`.
- Candidate component: `Lounge Update Item`, key `1dd4808f25b6577b8e6f9e3379295665175bb53c`, imported product component id `28493:62910`.
- Candidate default size: `343x286`.
- Candidate root props were available, and nested `Lounge Card` property surface was reachable.
- Candidate does **not** include the source bottom action row (`좋아요`, `댓글 쓰기`).

### Bounds Probe
| Source card | Source size | Probe result |
|---|---:|---|
| `25972:54734` | `343x316` | FAIL — info slot/timestamp escapes root bounds |
| `25972:54739` | `343x220` | FAIL — item footer/reply preview extends beyond root |
| `25972:54744` | `343x190` | FAIL — nested Lounge Card height exceeds root; footer outside root |
| `25972:55344` | `343x148` | FAIL — nested Lounge Card, challenge sub list, footer escape root |

Additional compact toggle probe with `↳ Show Reply Preview=false` and `↳ Show Reaction Bar=false` still failed bounds for compact heights.

## Implementation Decision
- Active product replacement was stopped.
- The safe next step is CDS component work: create or extend an update-card component that owns compact heights and the bottom action bar, then publish/update before product use-site replacement.
- Evidence file: `figma-probe-results.json`.
