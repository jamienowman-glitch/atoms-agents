
## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.

## Muscle Build Law (Global)
- **Location:** All new muscles must live in `atoms-muscle/src/{category}/{name}` (no `src/muscle` nesting).
- **MCP:** Every muscle must include a complete `mcp.py` wrapper (no stub `service.run(...)`).

## Muscle Architecture Law (Global)
- **Service vs Library:** `atoms-core` is the shared **library** (pure logic/models). `atoms-muscle` is the **runtime/service** (MCP wrappers, API routes, billing decorators).
- **Namespace Rule:** **Never** merge namespaces at runtime. `atoms-muscle` must import explicitly from `atoms-core` (e.g., `from atoms_core.src.audio.models import ...`).
- **Rescue Protocol:** Port dependency logic from `northstar-engines` into `atoms-core` first. `atoms-muscle` must never import `northstar-engines`.
