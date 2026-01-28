---
title: HAZE Nexus Explorer — UI/Harness Track Atomic Task Plan
date: 2026-01-28
owner: ui-core-agent
status: draft
scope: atoms-ui + atoms-core
---

# Goal
Create the HAZE Nexus Explorer canvas in `atoms-ui`, wire it into the harness, and lift required UI components from `agentflow` **without deleting or modifying originals**. Build the registry plumbing in `atoms-core` as needed.

# Non‑Negotiables (repo laws)
- **Do not delete** or edit originals inside `agentflow` — copy only.
- **Do not** create new nesting outside `atoms-ui/canvases`.
- Harness must remain **canvas‑agnostic** (ToolHarness/ToolPop pattern).
- No `.env`; use Vault and canonical `atoms-core` gateway.

# Required Reads (before any edits)
1. `/Users/jaynowman/dev/atoms-ui/agents.md`
2. `/Users/jaynowman/dev/atoms-ui/docs/TECH_SPEC_MULTI21_MIGRATION.md`
3. `/Users/jaynowman/dev/atoms-ui/canvases/multi21/contract.json`
4. `/Users/jaynowman/dev/atoms-core/AGENTS.md` (Supabase registry + Vault rules)

# Production Definition (non‑negotiable)
- **No dev‑only fallbacks** in production code paths. Any fallback must be production‑grade and explicitly documented.
- **Tenant compute first.** Interactive rendering must use **client device CPU/GPU**; server render only for explicit export/offline flows.
- **Registry writes must hit staging and production** via the canonical `atoms-core` flow.
- **Inputs are validated** and controller ranges are clamped for mobile safety.

# Atomic Tasks

## A. Lift Required UI Components (copy‑only)
1. Locate `DualMagnifier` in `agentflow/components/workbench/DualMagnifier.tsx`.
2. Copy it into `atoms-ui/components/workbench/DualMagnifier.tsx`.
3. Verify `atoms-ui/muscles/ToolPop/DualMagnifier.tsx` resolves the new path.
4. Confirm no changes were made in `agentflow` (copy only).
5. Re‑read `/Users/jaynowman/dev/atoms-ui/agents.md` before continuing to section B.

## B. Create HAZE Canvas (atoms-ui)
1. Create `atoms-ui/canvases/haze/` with:
   - `index.ts`
   - `HazeCanvas.tsx`
   - `blocks/ConnectedHaze.tsx`
   - `blocks/molecules/HazeWorld.tsx`
   - `blocks/atoms/HazeNode.tsx`
2. Draft `contract.json` for HAZE with:
   - `tool_pop.magnifiers.left/right` mapped to movement/rotation.
   - slider keys: `nav.forward`, `nav.turn`, `nav.speed`, `nav.zoom` (or similar).
3. Ensure HAZE uses `ToolControlProvider` (`useToolState`) for inputs.
4. Clamp controller ranges for mobile to avoid runaway movement (production safety).
5. Re‑read `/Users/jaynowman/dev/atoms-ui/agents.md` before section C.
6. Implement HAZE render path to use device GPU/CPU (WebGL/WebGPU) with no server render dependency in interactive mode.

## C. ToolPop Controller Mapping
1. Add a HAZE tool registry definition (similar to `multi21/tool-registry.ts`).
2. Map DualMagnifier outputs to new tool IDs:
   - left wheel → `nav.forward`
   - right wheel → `nav.turn`
3. Provide default values and touch‑safe range handling.
4. Add input validation for missing/unknown tool IDs.

## D. Harness Integration
1. Wire HAZE into a harness route in `atoms-ui` demo (if any exists).
2. Ensure `ToolHarness` renders full‑screen with HAZE canvas in Layer 0.
3. Verify ToolPop appears above ChatRail and the magnifiers are visible on mobile.
4. Re‑read `/Users/jaynowman/dev/atoms-core/AGENTS.md` before section E.

## E. Data/Registry Integration (atoms-core)
1. Register HAZE canvas in DB registry (Supabase) using canonical flow.
2. Ensure the HAZE contract is saved to DB (no file‑only contract use).
3. Confirm the harness reads from registry via `atoms-core` gateway (no new routes).
4. Repeat registry write for **staging and production** endpoints (vault‑driven).

## F. Validation
1. Run a local smoke test:
   - Canvas renders full screen.
   - ToolPop and DualMagnifier are visible and responsive.
   - `useToolState` updates can be logged in `ConnectedHaze`.
2. Confirm there are **no** changes inside `agentflow`.
3. Add a minimal UI regression check to ensure ToolPop still renders in existing canvases.

# Done Definition
- HAZE canvas exists under `atoms-ui/canvases/haze` with contract + tool registry.
- DualMagnifier is copied into `atoms-ui/components/workbench` and used by ToolPop.
- Harness renders HAZE without breaking existing canvases.
- Canvas contract saved in Supabase registry for **staging and production**, wired through `atoms-core`.
