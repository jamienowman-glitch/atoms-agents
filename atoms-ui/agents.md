# AGENTS.md — Atoms UI

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.

## UI Core Law
- `atoms-ui` is the **shared UI library** for canvases/harnesses.
- Do not import `northstar-engines`.
- No `.env` files.

## Website Printing Press (UI)
- `atoms-ui` must remain independent of standalone marketing sites.
- Sites are deployed from `/Users/jaynowman/dev/atoms-site-templates/` into separate repos.

## Reference
- Full UI constitution lives in `atoms-ui/agents.md` (lowercase) and remains authoritative.
