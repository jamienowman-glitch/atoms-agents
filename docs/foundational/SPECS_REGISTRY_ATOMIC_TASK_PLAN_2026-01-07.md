# Specs Registry Atomic Task Plan — 2026-01-07

## P0 task list (what must land to unblock UI inspection + token-safe edits)
- **P0‑1:** Harden Engines’ `/registry/specs` data path so the component_registry Tabular store holds a Builder atom spec + GraphLens lens spec, enforces `schema|defaults|controls|token_surface`, keeps deterministic ordering, and keeps the `component_registry.cursor_invalid`/`component_registry.missing_route` envelopes.
- **P0‑2:** Ship a UI-facing registry client that can read `/registry/specs` pages, honor the returned `next_cursor`/`ETag`, and apply the `controls`+`token_surface` metadata to the multi-canvas inspector layer when the remote flag is enabled.
- **P0‑3:** Extend the Agents boundary client to fetch `GET /registry/specs?kind=...` (and optionally `/registry/specs/{id}`) so Agent workflows that mirror the UI can reuse the same canonical payloads without touching the static cards.

## /northstar-engines
### Task NE-1: Stabilize component_registry specs persistence
- **Files:** `engines/registry/service.py`, `engines/registry/repository.py`, `engines/registry/tests/test_registry_specs.py` (plus new fixture data if needed)
- **Endpoints:** `GET /registry/specs`, `GET /registry/specs/{id}`
- **Resource kind/routing:** `component_registry` routed via `engines.storage.routing_service.TabularStoreService`; missing route must raise `component_registry.missing_route`.
- **Tests to add:** Extend `engines/registry/tests/test_registry_specs.py` with:
  * explicit builder atom + GraphLens lens fixtures persisted via `ComponentRegistryService.save_spec` to prove `controls`/`token_surface` non-null.
  * cursor pagination coverage (page boundary, valid `next_cursor`, invalid offset) and restart persistence.
  * canonical 304 semantics for both list and detail (`If-None-Match` returns 304, `ETag` stable even when `next_cursor` present).
- **Acceptance criteria:** Restart-safe Tabular store persists spec records; list response sorted by `id`; `next_cursor` base64 offset increments in page-sized steps; invalid cursor returns HTTP 410/canonical envelope; `ETag` set on list/detail and 304 path works; spec detail returns `component_registry.spec_not_found` (404) when missing.

## /ui
### Task UI-1: Add transport-level registry client
- **Files:** `packages/transport/src/registry_client.ts`, `packages/transport/src/registry_client.test.ts`, `packages/transport/src/index.ts` (export), `packages/transport/src/envelope.ts` (if helper needed)
- **Endpoints:** `/registry/specs?kind=...&cursor=...`, `/registry/specs/{id}` (GET)
- **Resource kind/routing:** still `component_registry`; client must include identity headers (reuse `buildIdentityHeaders`) and treat missing-route/invalid cursor envelopes via `TransportEnvelopeError`.
- **Tests:** Cover ticket-case (Authorization and token flows), envelope propagation for 503/410, 304 handling with `If-None-Match`, parsing `specs` payload (controls, token_surface), and `next_cursor` handling.
- **Acceptance criteria:** UI transport exposes functions to page specs with cursor, returns `next_cursor` and `etag`, surfaces deterministic `TransportEnvelopeError` with codes `component_registry.missing_route`/`component_registry.cursor_invalid`, no caching beyond localStorage hint.

### Task UI-2: Wire builder/registry consumers to specs
- **Files:** `packages/builder-registry/src/service.ts`, `apps/*` later hooking to inspector (note: document whichever app/world uses spec data)
- **Endpoints:** `GET /registry/specs?kind=...` (per thread/canvas context)
- **Resource kind/routing:** The client uses `TransportConfig.httpHost` + identity headers; still `component_registry`.
- **Tests:** Extend `packages/builder-registry/src/service.test.ts` (if present) or add new tests verifying remote flag toggles, spec payload parsing, and adhesives for token surfaces.
- **Acceptance criteria:** With `NORTHSTAR_REMOTE_REGISTRY` enabled, the builder service fetches `/registry/specs`, respects `next_cursor` until `null`, merges `mods`/`token_surface` into inspector metadata, and falls back to local `SCHEMAS` when the contract is unavailable. Remote fetch surfaces 503/410 envelopes as errors.

## /northstar-agents
### Task AG-1: Expand engines_boundary contract for specs
- **Files:** `src/northstar/engines_boundary/client.py`, `tests/engines_boundary/test_registry_specs.py` (new)
- **Endpoints:** `GET registry/specs?kind=...&cursor=...`, `GET registry/specs/{id}`
- **Resource kind/routing:** calls target `/registry` under `component_registry`; missing-route/invalid cursor must bubble `SafetyBlocked` via existing error helpers.
- **Tests:** New tests for `get_registry_specs` verifying success, missing route (503), invalid cursor (410), `If-None-Match` 304 behavior; mirror for `/registry/specs/{id}` acknowledging `component_registry.spec_not_found`.
- **Acceptance criteria:** Agents can page specs with cursor, `TransportEnvelopeError` (or `SafetyBlocked`) exposes canonical codes; no reference to `northstar/registry/cards`/`schemas` is added, keeping agent registry read-only.
