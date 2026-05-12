# Product Replacement Proof — Feed Detail Copies

Timestamp: 2026-05-12 07:04 KST

## Target Screens

- `28643:11`
- `28643:104`
- `28643:179`

## Remote Instance Verification

| Screen | Instance | Main Component | Remote | Key |
|---|---:|---|---|---|
| `28643:11` | `28643:347` | `Author=true` | true | `87a1871b74f9fbbb493c17b4adaf63c1a3a25579` |
| `28643:104` | `28643:458` | `Author=false` | true | `67aedad40680b0789405a9b051d74d4387733af1` |
| `28643:179` | `28643:516` | `Author=false` | true | `67aedad40680b0789405a9b051d74d4387733af1` |
| `28643:11` | `28644:107` | `Feed Detail Comment Composer` | true | `8aee4e2edacd16ea4cdd7a578161d394c0932121` |
| `28643:104` | `28644:183` | `Feed Detail Comment Composer` | true | `8aee4e2edacd16ea4cdd7a578161d394c0932121` |
| `28643:179` | `28644:256` | `Feed Detail Comment Composer` | true | `8aee4e2edacd16ea4cdd7a578161d394c0932121` |

## Property Overrides Preserved

- Action Rail:
  - `Like Count`: `32`
  - `Comment Count`: `2`
  - `Share Count`: `2`
  - `Author`: `true` on `28643:347`, `false` on `28643:458` and `28643:516`
- Comment Composer:
  - `Placeholder`: `격려와 축하의 말 한마디 부탁해요`

## Layout Contract

All six target instances retained their original x/y/width/height:

- Action Rail Author=true: `x=331`, `y=110`, `width=28`, `height=567`
- Action Rail Author=false: `x=331`, `y=110`, `width=28`, `height=570`
- Comment Composer: `x=0`, `y=752`, `width=375`, `height=34`

## Scope Guard

The swap script refused protected ancestors and only edited nodes under:

- `28643:11`
- `28643:104`
- `28643:179`

Current protected/source node existence check:

- `28587:15677`: exists
- `28587:15602`: exists
- `28587:15770`: exists
- `28582:15332`: not found by node lookup in this file context

No Lounge node was targeted.
