# Product Replacement Verification

Verified at `2026-05-08 14:21:35 KST`.

## Scope

Objective: replace and verify the Creator "my updates with new replies" product
use-site in `CS2ZhrORl4E1szQfTe2UvO` using the new CDS `Lounge Update Item`
component.

The replacement scope is the Creator Case `Creator Lounge Updates Screen`
(`24112:14112`) that originated from the existing `Lounge Card` node
`25945:38066` and proposal source node `28047:38198`.

## Evidence

| Check | Result |
|---|---|
| Component import by key | PASS — `importComponentByKeyAsync("1dd4808f25b6577b8e6f9e3379295665175bb53c")` returned remote component `28430:1505` |
| Proposal source node | PASS — `28047:38198` is absent after replacement |
| Original existing Lounge Card node | PASS — `25945:38066` is absent after replacement |
| Replacement instance 1 | PASS — `28428:27223` is `Lounge Update Item`, key `1dd4808f25b6577b8e6f9e3379295665175bb53c`, under `Upadates Card` `25945:37950` |
| Replacement instance 2 | PASS — `28428:29052` is `Lounge Update Item`, key `1dd4808f25b6577b8e6f9e3379295665175bb53c`, under `Upadates Card` `25945:38065` |
| Replacement instance 3 | PASS — `28439:29132` is `Lounge Update Item`, key `1dd4808f25b6577b8e6f9e3379295665175bb53c`, under `Upadates Card` `28439:29131`; reaction/reply preview hidden for no-reply state |
| Card structure | PASS — reply-preview cards contain `Lounge Update Item` at `y=0` and `Bottom Button Area` at `y=288`; no-reply card contains `Lounge Update Item` at `y=0` and `Bottom Button Area` at `y=206` |
| Creator manual candidates | PASS — no non-instance 343px reply-preview/reaction-bar manual candidates remain inside `Creator Lounge Updates Screen` |
| Remaining normal Lounge Card | ACCEPTED — `25945:39579` remains a plain no-reply update card and is not a reply-preview use-site |
| CDS icon policy | PASS — CDS `Lounge Update Item` Phosphor count `0`; reply icon is `Lucide Icons / message-square-text` |
| Product icon policy | PASS — Creator `Lounge Update Item` instances Phosphor count `0`; nested reply icons override to remote `Lucide Icons / message-square-text` |

## Screenshots

- Replaced instance `28428:29052`: `https://www.figma.com/api/mcp/asset/c4ab3818-1bf7-42a6-a06f-48c9e9d1a13f`
- Creator screen `24112:14112`: `https://www.figma.com/api/mcp/asset/686c5b95-53dd-4160-b999-765b20afaeb6`

## Out Of Scope

`Consumer Use Case > Creator Lounge Updates Screen` still has a manual
Lounge-update-like frame (`28040:37949`) with a reaction bar and feed footer.
That screen is not the "my updates / new replies" Creator Case use-site from
this request. Treat it as a separate cleanup candidate if the same component
should be rolled out beyond the requested use-site.
