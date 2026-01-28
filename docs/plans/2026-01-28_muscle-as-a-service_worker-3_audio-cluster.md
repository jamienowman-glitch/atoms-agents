# 2026-01-28 — Operation Muscle-as-a-Service: Worker 3 (Audio Cluster)

## Mission
Rescue and productionize audio_separation + audio_mastering (or closest available audio equivalents) into atoms-core, with real MCP wrappers and global SKILL.md standard.

## Scope (Allowed Paths)
- `atoms-core/src/` (new `audio` modules as needed)
- `atoms-muscle/src/audio/*` (only the targeted muscles)
- Tests under the above paths

## Hard Laws (Do Not Break)
- **No northstar-engines imports** in final code.
- **No .env** files; Vault loader only.
- Keep modules shallow inside `atoms-core/src/`.

## Tasks (Atomic)
1. **Un‑nest + Locate Closest Audio Targets**
   - Move any existing code from `atoms-muscle/src/muscle/...` into `atoms-muscle/src/{category}/{name}`.
   - If `audio_mastering` does not exist, select the nearest existing module (e.g., `audio_normalise`, `audio_fx_chain`, `audio_service`).
   - Record the exact target paths in this plan file before coding.

2. **Rescue Core Logic into atoms-core**
   - Move the needed logic from `northstar-engines/engines/audio*` into `atoms-core/src/audio/`.
   - Refactor to stateless utilities/classes.
   - Update imports to `from src.audio...`.

3. **Update atoms-muscle Services**
   - Replace any northstar import paths with `src.audio.*` (atoms-core).
   - Remove stubs; ensure real execution flow.

4. **MCP Wrapper (Non‑Stub)**
   - Implement `mcp.py` with real service calls.
   - Wrap with `@require_snax` and return clean JSON errors (no tracebacks).

5. **SKILL.md (Global Standard)**
   - Update SKILL.md with required frontmatter + required sections.
   - Explicitly include **Schema** and **Cost**.

6. **Butcher Validation**
   - Run `prepare_deploy.py` to ensure the audio slice builds with only atoms-core dependencies.

## Deliverables / Definition of Done
- Audio tool(s) run without northstar imports.
- MCP wrapper is real, snax‑gated, error‑safe.
- SKILL.md complies with global standard.
- Butcher slice builds.

## Notes / Risks
- If ffmpeg is required, ensure the dependency is declared for the slice (Worker 1 script should generate requirements).
- Do not alter unrelated audio modules.
