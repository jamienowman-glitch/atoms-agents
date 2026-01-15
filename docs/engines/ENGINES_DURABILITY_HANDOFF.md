# Engines Durability Handoff (Cross-Repo)

## 1. What This Document Is (Read This First)
- Handoff for agents/UI/other engines to consume durability guarantees without guessing.
- Not an implementation guide, not a redesign, not a requirement rewrite.
- Authoritative details live in: `ENGINES_DURABILITY_IMPLEMENTATION_GUIDE.md` and `ENGINES_DURABILITY_TODO_BREAKDOWN.md`.

## 2. Canonical Sources of Truth
- `ENGINES_DURABILITY_IMPLEMENTATION_GUIDE.md` — what each domain must do (routing kind, guarantees, APIs, identity, warning vs blocking).
- `ENGINES_DURABILITY_TODO_BREAKDOWN.md` — atomic TODOs, files to touch, success checks, blockers/parallel tracks, readiness checklist.
- Read the guide to know the contract; read the TODO breakdown to know if it is delivered and how to verify.

## 3. What Other Repos May Assume (After These Docs Land)
- event_spine: Durable routed append-only; warning-first with rejection if route missing; no silent fallback.
- memory_store: Durable routed session memory; warning-first with rejection on missing route; no in-memory in saas/enterprise.
- blackboard_store: Durable routed run/project store; warning-first with rejection; no in-memory in saas/enterprise.
- analytics_store: Durable routed analytics with attribution; warning-first with rejection; no in-memory in saas/enterprise.
- seo_config_store: Durable routed SEO configs; warning-first with rejection; no in-memory.
- budget_store: Durable routed usage/ledger; warning-first with rejection; no in-memory in saas/enterprise.
- audit: Durable routed append-only audit; warning-first with rejection; no noop/in-memory.
- save semantics (flows/graphs/overlays/strategy locks): Durable routed tabular CRUD with versioning; warning-first with rejection; no local/FS authority.
- notes / maybes: Durable routed store; warning-first with rejection; no in-memory/FS in saas/enterprise.

## 4. What Other Repos Must NOT Assume
- No in-memory persistence in saas/enterprise.
- No filesystem durability in saas/enterprise.
- No automatic backend selection beyond routing (no env fallbacks).
- No implicit project/user/surface scoping; identity must be explicit and enforced.
- No existence of deferred systems (PII rehydration, Nexus/RAG, vectors, connectors).

## 5. How Agents Should Integrate
- Discover durability gaps via diagnostics (routing/status endpoints); if route missing → treat as warning + reject/stop.
- Handle warning-first by surfacing explicit errors to orchestration; do not proceed as if persisted.
- Refuse to proceed when required route absent; log and surface to user/context.
- Propagate identity (tenant/mode/project/user/run/surface as required) on every call; do not override server-derived values.

## 6. How UI Should Integrate
- Trust save semantics only when diagnostics show routed backends healthy.
- Reflect durability warnings in UI (block saves/loads instead of caching locally).
- Do not cache locally as source of truth; treat routed stores as canonical.
- When warning-first surfaces, block the action and present explicit “durability unavailable” messaging.

## 7. Change Control
- Update `ENGINES_DURABILITY_IMPLEMENTATION_GUIDE.md` when contract per domain changes (APIs, guarantees, routing kinds, warning vs blocking).
- Update `ENGINES_DURABILITY_TODO_BREAKDOWN.md` when TODOs are added/finished or success criteria change.
- This handoff changes only when assumptions for other repos change; not for code-level edits.

## 8. Final Contract Statement
- Engines is the system of record for durability; agents/UI must not reimplement persistence.
- Routing-first with warning-first enforcement is the only accepted pattern; deviations are bugs.
- Any silent fallback, in-memory/FS persistence in saas/enterprise, or skipped identity enforcement is noncompliant.
