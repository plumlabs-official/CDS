# Implementation

## Scope

- Source file for component originals: CDS (`H36eNEd6o7ZTv4R7VcyLf2`), page node `20012:2`.
- Usage file: 2026-05 (`CS2ZhrORl4E1szQfTe2UvO`), screen node `14332:285690`.
- Goal: move local `/ CANDIDATE` component originals into CDS and update the usage file to consume CDS instances.

## Evidence and Gates

- Candidate inventory found 27 local candidate component originals in the usage file.
- Instance map found 29 usages.
- Direct cross-file component import by local component key failed because product-local keys were not importable as published library components.
- Desktop copy path was attempted through the configured play desktop actuator paths:
  - Codex Computer Use was unavailable because permissions were still pending.
  - Claude cowork dispatch was submitted but produced no completion artifact.
  - Custom AppleScript actuator reported success, but Figma verification found 0 candidate nodes pasted into CDS.
- SVG structural import was rejected for this recovery run because the exported SVG set was too large for a reliable MCP write path (`total=79.9MB`, `max=51.3MB`).
- PNG recovery import was accepted because all exported PNGs were within asset limits (`total=6.65MB`, `max=1.99MB`).

## CDS Recovery Components

- Created CDS group `Feed Creation` (`21850:3069`).
- Created 27 image-backed CDS recovery components.
- Uploaded all 27 PNG snapshots into the component image fills.
- Verified in Figma:
  - 27 recovery components exist.
  - 27/27 have image fills.
  - 0 components are missing `ContractException` descriptions.
  - 0 component names contain `/`.

## Override Preservation Adjustment

- Compared all 29 usage instances against their local component defaults.
- Found 1 visible override risk:
  - `28502:43` (`Feed Compose Option Row / 사람 태그`) has text `사람 태그`, while the generic source default is `공개대상 / 전체공개`.
- Created an additional state-specific CDS source component:
  - `Feed Compose Option Row Tag People`
  - componentId `21880:7344`
  - componentKey `528cad1526637836c8f48d8a2b1bde18de4a0d64`
  - imageNodeId `21880:7345`
- This means the update path will use 28 CDS source components for 29 usage instances: 27 generic recovered sources plus 1 state-specific source for the overridden usage.

## Remaining Work

## Publish and Usage Update

- User completed the CDS publish gate.
- Verified published CDS component key import in the usage file:
  - Generic sample `Feed Compose Option Row`: PASS.
  - State-specific `Feed Compose Option Row Tag People`: PASS.
  - Full preflight: 28/28 CDS component keys import as remote components.
- Replaced all 29 usage instances in `CS2ZhrORl4E1szQfTe2UvO` target page `14332:285690`.
- Used the state-specific CDS source for `28502:43` (`Feed Compose Option Row / 사람 태그`) to preserve the visible label state.
- Postflight:
  - 29/29 instances point to expected remote CDS component keys.
  - 29/29 instances are inside target page `14332:285690`.
  - 0 target-page instances still point to the old local candidate component keys.
  - 27 unreferenced local candidate component originals from this run were removed.
  - Empty local frame `Codex CDS Candidates` (`28502:4`) was removed.
  - 8 remaining `/ CANDIDATE` nodes are on page `15236:199` (`[전체 플로우 최신화 예정]`), are referenced, and were outside this recovery scope.

## Slack Report Fix

- Confirmed local Slack secret file exists at `$HOME/.codex/secrets/play-slack.env`; direct `auth.test` and `conversations.info` both passed for channel `C08PCRWU34L` (`서비스-디자인`).
- Fixed `goal-orchestrator.sh` so a skipped Slack delivery no longer writes `.goal-slack-final-report-sent.json`.
- Fixed `play-slack-report.sh` so final reports use the `06-record.md` TL;DR for blocked/failed/stopped outcomes too, not only success outcomes.
- Added regression coverage: if Slack delivery is skipped because token/channel configuration is missing, the final report can be retried and is only marked sent after the report log outcome is `sent`.
- Verification: `bash scripts/tests/test-goal-orchestrator.sh` passed.
