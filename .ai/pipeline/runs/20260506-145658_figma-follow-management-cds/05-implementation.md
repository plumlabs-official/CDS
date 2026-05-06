# 05 Implementation

## Figma Changes

- Updated target `CS2ZhrORl4E1szQfTe2UvO:28163:28618`.
- Kept `Top Bar` and `Navbar`; changed Navbar title characters to `팔로우 관리`
  and renamed the nested title text layer to `Title`.
- Replaced the prior local body with:
  - `Tab Bar` containing three CDS tab-tag instances named `TabsList Tag`.
  - `Content Header` sections for `팔로잉 친구 (82)`, `추천 친구`, and `인기 친구`.
  - `Follow List`, `Recommended List`, and `Popular List`, each with six visible
    `Invite Profile Card` instances.

## Data Preservation

All 18 existing profile records were migrated into CDS card instances:

- `김예인` / `팔로워 3`
- `이현승` / `팔로워 1.2K`
- `김재현` / `팔로워 1`
- `오은주` / `팔로워 4`
- `강성윤` / `팔로워 12`
- `안혜영` / `팔로워 12`
- `sara_nagase` / `팔로워 3K`
- `정도영` / `팔로워 15K`
- `조강우` / `팔로워 12`
- `이연우` / `팔로워 2.3K`
- `오영욱` / `팔로워 5`
- `강은주` / `팔로워 8`
- `최겸의 집밥 챌린지` / `팔로워 1.2K`
- `김주환의 내면소통` / `팔로워 1.2K`
- `강민경` / `팔로워 223K`
- `계란짐` / `팔로워 122K`
- `오은영의 마음 상담소` / `팔로워 353K`
- `김종국` / `팔로워 69K`

## Notes

The full-list `TabsList Tag` component regenerates nested item node ids when
overriding multiple labels in one plugin run. The implemented tab controls use
the stable CDS tab-tag trigger variants from the same tab-tag family and are
named `TabsList Tag` in the target screen. All three friend sections are visible
below the tabs.
