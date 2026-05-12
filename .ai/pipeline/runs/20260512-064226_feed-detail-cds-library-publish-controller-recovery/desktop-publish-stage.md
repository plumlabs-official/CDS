# Desktop Publish Stage — Feed Detail CDS Library

This is one bounded desktop-control stage for the CDS Feed Detail library publish recovery.

## User-Approved Scope

The user asked to continue the `-play` context and complete the CDS library publish work. Autonomous confirmation is preapproved only for the bounded Figma library publish/update actions below.

## Target

- App: Figma Desktop
- CDS library file key: `H36eNEd6o7ZTv4R7VcyLf2`
- Library file URL: `https://www.figma.com/design/H36eNEd6o7ZTv4R7VcyLf2`
- Components to publish/update:
  - `Feed Detail Action Rail`
    - component set key already observed in library: `1c5a825311b9c5f6ab74129581c4a4285f70935c`
    - location: `Components / Composed / Feed Cards / Main content / Feed Detail Action Rail`
  - `Feed Detail Comment Composer`
    - component key already observed in library: `8aee4e2edacd16ea4cdd7a578161d394c0932121`
    - location: `Components / Composed / Feed Cards / Main content / Feed Detail Comment Composer`

## Required Action

1. Open or focus Figma Desktop.
2. Open the CDS library file `H36eNEd6o7ZTv4R7VcyLf2`.
3. Use Figma's library publish/update flow to publish the latest changes for the two Feed Detail components above.
4. If Figma asks to confirm publishing updates for this library, confirm it. This confirmation is within the explicitly preapproved scope.
5. Do not delete, rename, detach, or redesign anything.
6. Do not touch the product file `CS2ZhrORl4E1szQfTe2UvO` in this desktop stage.
7. Do not make any payment, account permission, credential, 2FA, or destructive delete/cancel action. Return `needs_user_decision` if any such request appears.

## Evidence To Return

Write the required JSON result file with:

- `status`: `done`, `failed`, or `needs_user_decision`
- `summary`: concise publish outcome
- `published_components`: array with component names if publish/update succeeded
- `ui_evidence`: what Figma UI showed before and after publish/update
- `changed_files`: empty array unless repo files were written

If publish/update is unavailable because there are no pending library changes, return `done` only if the UI clearly indicates the library is up to date or already published; otherwise return `needs_user_decision`.
