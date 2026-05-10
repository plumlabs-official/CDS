# Desktop Stage: Publish CDS Feed Creation Components

The user explicitly approved this bounded publish/update stage.

## Goal

Publish the newly created CDS library components in Figma so they can be imported into the usage file.

## Target

- Figma app
- File tab: `CDS`
- File key: `H36eNEd6o7ZTv4R7VcyLf2`
- New group on canvas: `Feed Creation`
- New source components:
  - 27 generic recovery components under `Feed Creation`
  - 1 state-specific component `Feed Compose Option Row Tag People`

## Action

1. In Figma Desktop, open the `CDS` tab if it is not already active.
2. Open the Libraries / resources publish flow. The UI currently shows a blue dot on the Libraries icon, indicating unpublished changes.
3. Publish the new/changed library components from the current file.
4. If Figma asks for a publish description, use:
   `Recover Feed Creation candidate components into CDS source file`
5. Do not change unrelated files or components.

## Required Result

Write the result JSON to the path provided by the desktop actuator. Use:

```json
{"status":"done","summary":"Published CDS Feed Creation recovery components","updated_at":"<timestamp>","changed_files":[]}
```

If OS permissions, login, account prompts, or publish permissions block the action, write `needs_user_decision` with a short reason.
