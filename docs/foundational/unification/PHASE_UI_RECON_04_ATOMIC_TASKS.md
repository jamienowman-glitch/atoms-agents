# UI Atomic Tasks

**Recommended execution order:**  
1) UI-ENG-ENVELOPE-01  
2) UI-IDENTITY-04  
3) UI-CAN-REPLAY-02  
4) UI-SAFETY-07  
5) UI-CFG-TOGGLE-03 (after engine config contract confirmed)  
6) UI-REGISTRY-06 (after registry contract confirmed)  
7) UI-TRACKING-09 (after AtomSpec tracking tokens exist)  
8) UI-TOKENSURFACE-08 (after registry/schema is in place)  
9) UI-WS-AUTH-05 (after WS auth mechanism confirmed)

- **Task ID:** UI-ENG-ENVELOPE-01  
  **Type:** BLOCKER  
  **Files/Locations:** `packages/transport/src/index.ts`, `packages/builder-core/src/index.ts`, `apps/studio/src/App.tsx`  
  **Preconditions:** Canonical error envelope already live in Engines.  
  **Acceptance:** All HTTP/SSE/WS responses parse `{error.code,message,http_status,details,gate}`; 503/410/403 mapped to typed errors; UI surfaces gate info; no generic `res.ok` branches.  
  **Unblocks:** Safety UX, retry/resnapshot flows, agent-visible gate codes.

- **Task ID:** UI-CAN-REPLAY-02  
  **Type:** BLOCKER  
  **Files/Locations:** `packages/transport/src/index.ts`, `packages/builder-core/src/index.ts`, `packages/canvas-kernel`  
  **Preconditions:** Engines snapshot/replay/410 semantics.  
  **Acceptance:** On 410 invalid cursor, client re-fetches snapshot then replay gap; Last-Event-ID cache treated as hint only; SSE reconnect uses server cursor; tests cover restart + 410; optimistic ops rebased after recovery_ops.  
  **Unblocks:** Durable canvas, SSE resume correctness.

- **Task ID:** UI-CFG-TOGGLE-03  
  **Type:** INTEGRATION  
  **Files/Locations:** `packages/transport` (config client), `apps/studio`, `packages/builder-core`  
  **Preconditions:** MISSING DEPENDENCY — Engines/config_store endpoint contract; require path + envelope shape.  
  **Acceptance:** Builder fetches `tool_canvas_mode` (and related toggles) with identity headers; missing route returns 503 envelope surfaced; no hardcoded defaults in SaaS/Enterprise.  
  **Unblocks:** Tool-canvas mode parity, env-less configuration.

- **Task ID:** UI-IDENTITY-04  
  **Type:** SECURITY  
  **Files/Locations:** `packages/transport/src/identity_headers.ts`, `packages/builder-core/src/index.ts`, `apps/studio/src/main.tsx`  
  **Preconditions:** Clarify allowed modes (saas|enterprise|lab only) and server-derived identity fields.  
  **Acceptance:** SaaS/Enterprise: tenant_id + project_id + mode required, fail fast if missing; no synthesized tenant/project/user/actor. Lab: optional dev fallback allowed only behind explicit LAB gate (cannot leak to saas/enterprise). Session_id must be stable and propagated (transport + analytics); request_id remains per-call.  
  **Unblocks:** Boundary alignment, audit correctness.

- **Task ID:** UI-WS-AUTH-05  
  **Type:** SECURITY  
  **Files/Locations:** `packages/transport/src/index.ts`  
  **Preconditions:** MISSING DEPENDENCY — define browser WS auth mechanism (cookie or ticket endpoint or accepted hello auth).  
  **Acceptance:** WS auth matches chosen browser-compatible mechanism (cookie session OR HTTPS ticket passed in URL/hello as server requires); reconnect preserves the same auth/ticket; tests cover auth failure -> blocked; no impossible “Authorization header” requirement.  
  **Unblocks:** Reliable realtime in SaaS/Enterprise.

- **Task ID:** UI-REGISTRY-06  
  **Type:** INTEGRATION  
  **Files/Locations:** `packages/builder-registry`, `packages/builder-core`  
  **Preconditions:** MISSING DEPENDENCY — confirm owner (Engines vs Agents boundary) and endpoint/path (`/registry/components`?) + envelope shape.  
  **Acceptance:** RegistryService handles envelopes and missing-route 503; caches versioned registry; use remote registry as source of truth (local schemas only in lab) with NA enforcement.  
  **Unblocks:** AtomSpec-driven palettes/inspectors.

- **Task ID:** UI-SAFETY-07  
  **Type:** QUALITY  
  **Files/Locations:** `packages/projections/src/index.tsx`, `packages/builder-core/src/index.ts`, `packages/ui-atoms`  
  **Preconditions:** Envelope parsing from UI-ENG-ENVELOPE-01.  
  **Acceptance:** Optimistic applyLocal allowed; on BLOCK (403 gate) reconcile without corruption (resnapshot + replay + rebase pending ops) and surface gate code/reason; canvas must not desync; no PII in logs; tests cover firearms.missing_grant and strategy_lock.required.  
  **Unblocks:** Compliance with gatechain UX requirements.

- **Task ID:** UI-TOKENSURFACE-08  
  **Type:** DX  
  **Files/Locations:** `packages/builder-inspector`, `packages/builder-core`, `packages/projections`  
  **Preconditions:** AtomSpec schema from atoms_factory registry.  
  **Acceptance:** Inspector/agents operate on token paths (TokenSurface allowlist) instead of freeform props; JSON Patch edits forwarded to CanvasTransport; pending ops visible in CanvasView.  
  **Unblocks:** Agent-based editing, visible typing parity.

- **Task ID:** UI-TRACKING-09  
  **Type:** QUALITY  
  **Files/Locations:** `packages/analytics`, `apps/studio/src/hooks/analytics.ts`, `packages/builder-copy`  
  **Preconditions:** Tracking tokens defined in AtomSpec registry.  
  **Acceptance:** Clickable atoms emit tracking events (analytics_event_name, conversion_goal_id, utm_template) using envelope-aware client; SSR/email-safe defaults honored; missing tokens flagged.  
  **Unblocks:** Measurement parity for web/email/dm.
