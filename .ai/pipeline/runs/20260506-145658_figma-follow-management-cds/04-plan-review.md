# 04 Plan Review

## Plan Review

Decision: PASS with guardrails.

## Guardrails

- Do not retry the full `TabsList Tag` nested-label mutation path; it invalidates
  nested node ids during a single plugin run.
- Do not use custom chip/Button tabs as a fallback.
- Do not use local `Follow Row` frames for list items.
- If card variant properties reject a combination, use known-good reference
  instances and limit overrides to text, avatar fill, and child button label.

## QA Checklist

- `TabsList Tag` instance count is at least 3.
- `Invite Profile Card` or `Profile Card` instance count is 18.
- `Follow Row` and `Filter Tabs` visible count is 0.
- Text search for `활동에너지`, `에너지`, and `activity` returns 0.
- Preserved data matches the old screen record set.
