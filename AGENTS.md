
## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.

## Muscle Build Law (Global)
- **Location:** All new muscles must live in `atoms-muscle/src/{category}/{name}` (no `src/muscle` nesting).
- **MCP:** Every muscle must include a complete `mcp.py` wrapper (no stub `service.run(...)`).
