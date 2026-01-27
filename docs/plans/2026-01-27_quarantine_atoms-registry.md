# Plan: Quarantine `atoms-registry` (Legacy File Registries)

## Goal
Prevent agents from creating/maintaining configuration in the legacy file-based registry while the system moves to DB-first registries (Supabase).

## Checks (What still referenced it?)
- **CI/Docker**: No workflows/Dockerfiles reference `atoms-registry` directly.
- **Runtime** (`northstar-engines`): External YAML registry is only used if `NORTHSTAR_REGISTRY_PATH` is set; no in-repo configs set it.
- **Scripts/Docs**: Several migration-era scripts/docs referenced `atoms-registry` for seeding/harvesting.

## Actions
1. Move `atoms-registry/` to `_quarantine/atoms-registry/`.
2. Add `_quarantine/atoms-registry/README.md` explaining deprecation.
3. Update the most agent-visible docs (`atoms-core/AGENTS.md`, `atoms-ui/agents.md`, key specs) to state DB-first registry and discourage recreating the folder.
4. Update legacy scripts so they write/read the quarantined path instead of recreating `atoms-registry/` at repo root.

## Follow-ups (Optional)
- Remove remaining references in historical docs, or move them into a dedicated "historical" section.
- If desired, delete (or quarantine) legacy harvest/seed scripts once DB workflows fully replace them.

