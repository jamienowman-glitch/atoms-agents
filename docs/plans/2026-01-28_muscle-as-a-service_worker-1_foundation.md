# 2026-01-28 — Operation Muscle-as-a-Service: Worker 1 (Foundation)

## Mission
Lay the foundation for Rescue & Monetize: database schema, deployment slicing, and doc standards.

## Scope (Allowed Paths)
- `atoms-core/sql/`
- `atoms-core/src/` (new domain directories only if needed)
- `atoms-muscle/scripts/`
- `docs/skills/skill-authoring/SKILL.md`
- `AGENTS.md`
- `atoms-muscle/AGENTS.md`

## Hard Laws (Do Not Break)
- **No northstar-engines imports** in any new code. It is deprecated.
- **No .env files**; use Vault loader + absolute paths. Do not add `os.environ.get` usage in atoms-core.
- **No deep nesting** inside `atoms-core/src/` (primary modules at top level).
- **Registry is DB-first**; do not recreate `atoms-registry`.

## Dependencies
- Must finish SQL patch before Worker 2+ can test `@require_snax`.

## Tasks (Atomic)
1. **Supabase SQL Patch**
   - Create a new SQL patch file in `atoms-core/sql/` (e.g., `014_snax_auth_patch.sql`).
   - Include: `tenants`, `tenant_members`, `snax_wallets`, `snax_ledger`, `api_keys`, `pricing`, `crypto_deposits`, `system_config`, triggers on `auth.users`, and RPCs for `snax_charge` + `validate_api_key`.
   - Add RLS policies that allow tenant read, service-role write.
   - Document how to apply it (Supabase SQL Editor) in the patch header.

2. **Rescue Doc Standard (Global SKILL.MD)**
   - Update `docs/skills/skill-authoring/SKILL.md` with the **2026 global standard**:
     - YAML frontmatter with `name` + `description` (required) and optional `metadata`, `license`, `compatibility`.
     - Body must include the **required sections**:
       - `# Tool Name`
       - `## Capability`
       - `## When to use`
       - `## Schema` (JSON I/O)
       - `## Cost` (Snax)
       - `## Brain/Brawn` (explicit local CLI note if required)
   - Note: keep SKILL.md concise; large refs go to `references/`.

3. **Update AGENTS Law**
   - Update `/Users/jaynowman/dev/AGENTS.md` and `/Users/jaynowman/dev/atoms-muscle/AGENTS.md`:
     - Add the Rescue rule: **no northstar-engines imports**.
     - Add SKILL.md standard requirements (frontmatter + required sections).
     - Add Cloud Run secret pattern: mount secrets as files and read via Vault loader (no env lookups in code).

4. **Butcher Script (prepare_deploy.py)**
   - Add `atoms-muscle/scripts/prepare_deploy.py`.
   - Input: path to `service.py` (muscle) + output dir `_build/<muscle_key>`.
   - Output:
     - Copies `service.py` + dependent `atoms-core/src/**` imports into `_build`.
     - Generates `requirements.txt` **only** for the slice.
     - Generates `Dockerfile` using `python:3.11-slim`.
   - Must **block** any import from `northstar-engines` (fail fast).

5. **Vault Guidance for Cloud Run**
   - Add doc snippet (AGENTS + SKILL authoring) clarifying:
     - Cloud Run gets secrets via **mounted files** (Secret Manager) to fixed absolute paths.
     - Vault loader reads those paths (no `.env`, no `os.environ.get`).

## Deliverables / Definition of Done
- SQL patch file exists and is syntactically valid.
- SKILL authoring doc updated with the global standard + required sections.
- AGENTS rules updated in root and atoms-muscle.
- `prepare_deploy.py` produces `_build` with Dockerfile + requirements and no northstar imports.
- No changes outside scope.

## Notes / Risks
- Avoid editing unrelated SQL schemas; keep patch additive.
- Do not introduce new runtime env reads in atoms-core; stay compliant with Vault law.
