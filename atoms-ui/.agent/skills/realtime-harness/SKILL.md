---
name: realtime-harness
description: Builds or updates a Harness/Canvas to comply with the Realtime + Collaborative Canvas Contract (SSE truth, optional WS gestures, semantic state patches, media sidecars, no new routes).
version: 1.0.0
---

# Realtime Harness Skill

## Canonical Contract (Read First)
- `docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`

## When to use this skill
Use this skill when you are asked to:
- build a new Harness template (V2 standard or minimal)
- build a new Canvas cartridge that mounts inside an existing Harness
- wire a Canvas/Harness to realtime (SSE/WS) without inventing new routes
- add “vision/audio/video on-demand” behavior (sidecars) with strict agent permissioning

## Non‑negotiable rules
1. **Do not create new backend routes.** Use the canonical realtime endpoints owned by `atoms-core`.
2. **Do not stream browser DOM/HTML.** Stream the canonical state model (`token_patch` / `state_patch`).
3. **Media is sidecar-only.** Never inline base64; emit `snapshot_created` with `artifact_id` / `uri` refs only.
4. **SSE is downstream truth.** WS is optional and only for ephemeral presence/cursors/gestures.
5. **One Transport.** Reuse the shared `CanvasTransport` in `atoms-ui`. Do not copy/paste a new one.
6. **Canvas cannot own execution/persistence/logging.** Canvas renders + emits typed commands only.
7. **Permissioning is mandatory.** Default agents do not see sidecars; only explicitly allowed “director/visual” agents can request them.

## Lens naming (avoid confusion)
- **Runtime lenses** (policy/permissions) live with the agent runtime (“TokenLens”, “ContextLens”).
- **UI lens slots** live in the Harness (“ContextPanel”, “TokenPanel”).
- **CanvasLens** is the UI view selector (which canvas is active).

## Implementation checklist (DoD)
A Harness/Canvas change is “done” when:
- It mounts into an existing Harness without new routes.
- It uses the shared `CanvasTransport`.
- It only emits commands and reacts to SSE events.
- It emits/consumes `token_patch` / `state_patch` for cheap planning canvases.
- Vision sidecars are requested on-demand and are permission-gated.
- It does not introduce `.env*` files or local-only persistence.

