# 2026-01-28 — Operation Muscle-as-a-Service: Worker 4 (Visuals Cluster)

## Mission
Rescue video_render + animation_kernel into atoms-core and enforce Brain/Brawn split (no server rendering).

## Scope (Allowed Paths)
- `atoms-core/src/` (new `video` modules as needed)
- `atoms-muscle/src/video/video_render/*`
- `atoms-muscle/src/alara/animation_kernel/*` (or closest animation module)
- Tests under the above paths

## Hard Laws (Do Not Break)
- **No northstar-engines imports**.
- **No .env**; Vault loader only.
- **No server-side rendering**; return CLI instructions only.

## Tasks (Atomic)
1. **Un‑nest + Rescue Core Logic**
   - Move any existing code from `atoms-muscle/src/muscle/...` into `atoms-muscle/src/{category}/{name}`.
   - Move required logic from `northstar-engines/engines/video*` and `engines/animation_kernel` into `atoms-core/src/video/`.
   - Refactor to stateless helpers.

2. **Brain vs Brawn Refactor**
   - For render services, return a **CLI command plan** (ffmpeg/blender/etc).
   - Do not invoke GPU rendering on the server.

3. **Update atoms-muscle Services**
   - Replace imports with `src.video.*`.
   - Ensure service methods return structured plans (command string + args + notes).

4. **MCP Wrapper (Non‑Stub)**
   - Implement `mcp.py` with `@require_snax`.
   - Catch all exceptions; return JSON error envelope.

5. **SKILL.md (Global Standard)**
   - Must include Brain/Brawn section explicitly stating: "I generate the render plan; you run the command locally."

6. **Butcher Validation**
   - Run `prepare_deploy.py` to confirm the slice is isolated and builds.

## Deliverables / Definition of Done
- Visual tools run without northstar imports.
- Render service returns CLI plan instead of pixels.
- MCP wrapper is snax‑gated + error‑safe.
- SKILL.md compliant with global standard.

## Notes / Risks
- If animation_kernel is missing, choose the nearest `alara` module and document the choice.
