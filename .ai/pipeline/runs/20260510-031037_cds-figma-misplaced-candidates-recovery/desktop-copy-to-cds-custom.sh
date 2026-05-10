#!/usr/bin/env bash
set -euo pipefail

result_file="${PLAY_DESKTOP_RESULT_FILE:?PLAY_DESKTOP_RESULT_FILE is required}"

osascript <<'APPLESCRIPT'
tell application "Figma" to activate
delay 1
tell application "System Events"
  keystroke "c" using command down
end tell
delay 1
do shell script "open -a Figma 'https://www.figma.com/design/H36eNEd6o7ZTv4R7VcyLf2/CDS?node-id=20012-2'"
delay 10
tell application "Figma" to activate
delay 1
tell application "System Events"
  keystroke "v" using command down
end tell
delay 3
APPLESCRIPT

jq -n \
  --arg status "done" \
  --arg summary "Copied the selected product candidate component originals and pasted them into the CDS file via custom desktop actuator." \
  --arg updated_at "$(date '+%Y-%m-%dT%H:%M:%S%z')" \
  '{status:$status, summary:$summary, updated_at:$updated_at}' > "$result_file"
