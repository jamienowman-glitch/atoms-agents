# Workspace Changelog

Since this workspace is not a git repository, this log tracks the files modified/added during the Token Workbench implementation.

## Added Files
- `scripts/server.js`: Node.js server for recurring token persistence.
- `scripts/seed_catalog.js`: Script to seed the initial token catalog.
- `apps/workbench/src/client/api.ts`: API client for the token server.
- `apps/workbench/src/logic/DraftDiffManager.ts`: Core logic for managing local drafts.
- `apps/workbench/src/routes/TokenWorkbench.tsx`: Main UI for the Token Workbench.
- `docs/TOKEN_CATALOG.json`: Canonical token storage.
- `docs/TOKEN_CATALOG.tsv`: TSV export of the catalog.
- `docs/TOKEN_WORKBENCH_RECON.md`: Reconnaissance report.
- `docs/TOKEN_WORKBENCH_HOWTO.md`: User guide.
- `docs/TOKEN_DRAFT_DIFF_FORMAT.md`: Diff format spec.
- `docs/TOKEN_DIFF_HANDOFF.md`: Handoff guide.

## Modified Files
- `apps/workbench/package.json`: Added `concurrently`, `express`, `cors` dependencies and `server` script.
- `apps/workbench/src/App.tsx`: Added routing for `/workbench/tokens` and global font injection.
- `atoms/aitom_family/section_hero_banner/views/View.tsx`: Added in-canvas editing using `EditableText` component.
- `task.md`: Updated with progress.
