# 2026-01-28 — Operation Muscle-as-a-Service: Worker 2 (CAD Cluster)

## Mission
Rescue CAD ingest + BoQ quantities from **atoms-muscle (source of truth)** into atoms-core, wire real MCP wrappers, and make the slice buildable.

## Scope (Allowed Paths)
- `atoms-core/src/` (new `cad` modules as needed)
- `atoms-muscle/src/cad/cad_ingest/*`
- `atoms-muscle/src/construction/boq_quantities/*`
- `atoms-muscle/src/cad/cad_semantics/*` (only if required by BoQ)
- Tests under the above paths

## Hard Laws (Do Not Break)
- **Do not use northstar-engines** as a source. It is deprecated and not the source of truth.
- **No northstar-engines imports** anywhere in final code.
- Keep `mcp.py` as the entrypoint (required by `atoms-muscle/AGENTS.md`).
- **No .env** and no `os.environ.get` in atoms-core.
- No deep nesting inside `atoms-core/src/`.

## Dependencies
- Worker 1 must finish SQL patch (tenants/wallets/ledger) before billing can be tested.

## Tasks (Atomic)
1. **Un‑nest + Rescue CAD Ingest Core**
   - Move any existing code from `atoms-muscle/src/...` into `atoms-muscle/src/{category}/{name}`.
   - Use **atoms-muscle cad_ingest** as the source of truth and move that logic into `atoms-core/src/cad/`.
   - Keep module layout shallow (e.g., `atoms-core/src/cad/ingest.py`, `models.py`, `dxf_adapter.py`, `ifc_lite_adapter.py`, `topology_heal.py`).
   - Update imports inside rescued code to `from src.cad...` only.

2. **Resolve Dependencies for BoQ**
   - `boq_quantities` depends on `cad_semantics` models.
   - Move the minimum `cad_semantics` models/utilities from atoms-muscle into `atoms-core/src/cad/` if needed.
   - Remove any northstar import paths.

3. **Update atoms-muscle Services**
   - `atoms-muscle/src/cad/cad_ingest/service.py` should import from `src.cad.*` (atoms-core).
   - `atoms-muscle/src/construction/boq_quantities/service.py` should import from `src.cad.*` or `src.boq.*` as appropriate.
   - Remove stubs and ensure real execution paths exist.

4. **MCP Wrapper (Non‑Stub)**
   - Replace stub logic in `mcp.py` with real service calls.
   - Wrap tool execution with `@require_snax` (use the canonical decorator location once Worker 1 defines it).
   - Catch all exceptions and return clean JSON error shape (no stack traces).

5. **SKILL.md (Global Standard)**
   - Update SKILL.md for `cad_ingest` and `boq_quantities`:
     - YAML frontmatter (name/description required)
     - Required body sections (Capability, When to use, Schema, Cost, Brain/Brawn).

6. **Butcher Validation**
   - Run `atoms-muscle/scripts/prepare_deploy.py` against `cad_ingest` and `boq_quantities`.
   - Confirm the slice includes required `atoms-core/src/cad` modules and no northstar imports.

## Deliverables / Definition of Done
- CAD ingest + BoQ quantities run without northstar import paths.
- MCP wrappers are real (no `Cache.run` stubs), snax‑gated, and error‑safe.
- SKILL.md compliant with global standard.
- Butcher build succeeds for the CAD slice.

## Notes / Risks
- If `require_snax` is not yet implemented, coordinate with Worker 1 for its canonical location; do not create duplicate decorators.
- If a dependency is missing, rescue it into atoms-core from atoms-muscle, not northstar.
