
# Feature Checklist (Living Gate)

## My Cases list & navigation

- Tabs: My Cases / Shared Cases render & switch
- Case cards: number, title, file count
- Icons: shared indicator, locked indicator, normal folder
- Search by keyword
- Show All toggle behavior [WEMS3.0 on-prem | Word]

## Case header & files

- Header shows ID/Title/Classification/Description
- Files smart table: columns, pagination, preview
- Prev/Next navigation, first/last disable, skip locked (bug guard) [ALL WEMS 3...QA Report | Excel]

## Case Notes

- List, add, edit, delete (single & bulk)
- Print single note; Print Case Report
- Count on Case Notes button, sorting, quick-search, pagination, empty state, loading overlay, error toasts [ALL WEMS 3...QA Report | Excel]

## Case actions

- Create / Edit / Delete case (+ validations & error paths)
- Lock / Unlock case + reason prompt + status & icon
- Case status dropdown disabled when locked; enabled when unlocked
- Change owner (validation & error) [ALL WEMS 3...QA Report | Excel]

## Sharing

- Share case to WEMS users (select users)
- Public link popup (copy)
- Options: Expiry, Password, Disable downloads, Comment
- Unshare (confirm/cancel), shared indicator & tooltip recipients
- Shared Cases tab lists & opens shared case [WEMS3.0 on-prem | Word], [ALL WEMS 3...QA Report | Excel]

## Case files operations

- Upload (valid, invalid, oversize)
- Update metadata (single/bulk) + required validations
- Download single & multi (ZIP) + failure paths
- Remove single & bulk (confirm/cancel/errors)
- Print evidence label preview
- Burn to ISO (+ guards: no selection, missing path, SFTP missing, size limit)
- Merge video: order, limits, mixed formats/resolution, post-merge record [ALL WEMS 3...QA Report | Excel]

## Permissions/RBAC

- Notes buttons hidden/disabled per permission
- Restricted access when opening locked case without permission
- All note actions visible for full-permission user [ALL WEMS 3...QA Report | Excel]
