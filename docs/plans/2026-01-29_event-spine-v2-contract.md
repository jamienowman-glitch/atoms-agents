---
title: Event Spine V2 Contract (Supabase‑first) + PII Rehydration
date: 2026-01-29
owner: atoms-core
scope: atoms-core, atoms-app, atoms-ui, atoms-tuning
status: draft
---

# Event Spine V2 Contract (Supabase‑first)

This contract defines the **single event spine** for debugging, audit, tuning, KPI tracking, and agent behavior introspection. It is **append‑only**, **Supabase‑first**, and **PII‑safe** by default.  
**Cosmos is not used** (blocked). **No `.env` files.** **No `northstar-engines` imports.**

## 0) Vocabulary (use these terms precisely)

- **Event Spine**: Append‑only event log of run‑scoped and system events.
- **Run**: One flow execution across multiple canvases.
- **Whiteboard**: Shared run context (global to a flow).
- **Blackboard**: Edge‑scoped node context only.
- **Artifact**: Data blob or file reference (stored in S3; referenced by URI).
- **PII Token**: Placeholder that stands in for sensitive data in events.
- **Rehydration**: Server‑side restore of PII for tenant UI only.

## 1) Non‑Negotiables

- **Append‑only**: No updates or deletes to event rows; only new events.
- **Supabase Postgres**: The canonical store (no Cosmos).
- **PII‑safe**: Redact before persistence; rehydrate only for tenant UI.
- **No DOM streaming**: Only structured events (token_patch/state_patch).
- **No new transport routes**: Reuse existing realtime transport.
- **No framework/provider exposure by default in SaaS**.

## 2) Event Classes (minimum)

### 2.1 Developer & Ops
- `DEV_LOG`
- `SECURITY_EVENT`
- `SYSTEM_ERROR`

### 2.2 Agent Behavior
- `AGENT_ACTION`
- `AGENT_THOUGHT` (internal trace, system‑only)
- `AGENT_DECISION`
- `AGENT_CONTEXT_READ` (whiteboard/blackboard read)
- `AGENT_CONTEXT_WRITE` (whiteboard/blackboard write)

### 2.3 Tokens / Spend
- `TOKEN_USAGE` (model, reasoning, provider, framework, framework_mode)

### 2.4 KPI / Outcomes
- `KPI_SNAPSHOT` (per run)
- `KPI_OUTCOME` (post‑run outcomes tied to artifacts)

### 2.5 Safety / Audit
- `STRATEGY_LOCK_EVENT`
- `APPROVAL_EVENT`
- `SAFETY_GATE_EVENT`
- `TRIAGE_3WISE` (three‑LLM risk panel)

### 2.6 Tuning
- `TUNING_FEEDBACK` (RL/RLHA)
- `TUNING_SESSION_START`
- `TUNING_SESSION_END`

## 3) Required Routing Keys

Every event MUST include:
- `tenant_id`
- `mode` (e.g., `saas`, `enterprise`, `system`)
- `project_id`
- `surface_id`
- `space_id`
- `run_id`
- `canvas_id` (nullable for non‑canvas events)
- `node_id` (nullable)
- `agent_id` (nullable)
- `created_at` (server time)

## 4) PII Redaction + Rehydration Rules

### 4.1 Redaction (before persistence)
- **Always** redact PII in event payloads before writing to the spine.
- Store a **PII token map** in a secure store (Supabase table).
- Events only store placeholders.

### 4.2 Rehydration (tenant UI only)
- Rehydration is **default ON** for tenant UI.
- Rehydration is **NEVER** performed for LLM calls.
- Rehydration can be toggled OFF per tenant (config flag).
- System and enterprise views can still see raw trace if authorized.

## 5) Visibility Tiers

### 5.1 SaaS (default)
- **Hide** framework/provider names (display branded names).
- **Show** model family/version only if required.
- **No agent thought traces** unless system role.

### 5.2 Enterprise (locked by us)
- Can enable framework/provider visibility.
- Can enable detailed traces per org policy.

### 5.3 System
- Full traces, internal agent thoughts, raw event metadata.

## 6) Storage Contract (Supabase)

### 6.1 Tables (append‑only)
- `event_spine_v2_events`
- `event_spine_v2_payloads`
- `event_spine_v2_pii_tokens`
- `event_spine_v2_artifacts`
- `event_spine_v2_visibility_rules`

**All writes** go to `event_spine_v2_events` (normalized, indexed), with payloads in `event_spine_v2_payloads` for larger data.

## 7) Data Flow

1) Runtime emits event →  
2) Redaction →  
3) Append to spine →  
4) Optional realtime stream →  
5) UI render (rehydrate only for tenant UI) →  
6) Tuning ingest consumes events in batches.

## 8) Audit & Retention (defaults)

- **SaaS default retention**: 12 months (configurable).
- **Enterprise default retention**: 24 months (configurable).
- **System default retention**: 36 months (configurable).
- **PII token map** retention mirrors event retention.
- **GDPR**: support deletion of PII token map on request; event payloads remain but stay redacted.

## 9) Realtime Bridge (optional)

Event spine can emit realtime `StreamEvent` for:
- `DEV_LOG`, `AGENT_ACTION`, `TOKEN_USAGE`, `KPI_SNAPSHOT`, `TUNING_FEEDBACK`

No new routes; use existing SSE/WS.

## 10) Contract‑Safe Naming

All events include both:
- `display_name` (tenant view)
- `raw_name` (system view)

This enables SaaS branding without losing traceability.

---

# Atomic Task List (Event Spine V2)

## ATOMS‑ES‑00 — Contract + Schema
- Create this contract doc (you are here).
- Add schema migration `015_event_spine_v2.sql` to `atoms-core/sql/`.

## ATOMS‑ES‑01 — Event Spine Core Module
- Create `atoms-core/src/event_spine/` with:
  - `models.py`, `repository.py`, `service.py`, `routes.py`, `pii.py`
- Repository uses Supabase (no filesystem, no Cosmos).

## ATOMS‑ES‑02 — PII Redaction + Rehydration
- Implement redaction in `pii.py`.
- Store tokens in Supabase table.
- Add rehydrate hook for tenant UI only.

## ATOMS‑ES‑03 — Emit + Replay API
- `POST /event-spine/append`
- `GET /event-spine/replay`
- Ensure append‑only.

## ATOMS‑ES‑04 — Visibility Rules
- Implement visibility rules by `mode`:
  - SaaS / Enterprise / System
- SaaS hides framework/provider by default.

## ATOMS‑ES‑05 — Realtime Bridge
- Optional: publish `StreamEvent` to timeline/SSE.

---

# Kickoff Prompt — Core Event Spine + PII (Worker A)

**Role**: Senior backend engineer (FastAPI + Supabase) focused on audit/event systems.  
**Work root**: `/Users/jaynowman/dev`

**Read first**  
- `/Users/jaynowman/dev/AGENTS.md`  
- `/Users/jaynowman/dev/docs/plans/2026-01-29_event-spine-v2-contract.md` (this file)

**Hard guardrails**  
- No `.env` files  
- No `northstar-engines` imports  
- **No Cosmos** (Supabase Postgres only)

**Deliverables**  
1) New module: `/Users/jaynowman/dev/atoms-core/src/event_spine/`  
   - `models.py`, `repository.py`, `service.py`, `routes.py`, `pii.py`  
2) Supabase migration:  
   - `/Users/jaynowman/dev/atoms-core/sql/015_event_spine_v2.sql`  
3) PII pipeline: redact before persistence, rehydrate only for tenant UI.  
4) Identity precedence enforcement (tenant/mode/project/surface/space/run).

**Proof**  
- Append + replay works (append‑only)  
- Redaction occurs before persistence  
- Rehydration only for tenant UI (never LLMs)

---

# Kickoff Prompt — Tuning Pipeline (Worker B)

**Role**: Applied ML engineer focused on data pipelines + RL/RLHA schemas.  
**Work root**: `/Users/jaynowman/dev`

**Read first**  
- `/Users/jaynowman/dev/AGENTS.md`  
- `/Users/jaynowman/dev/docs/plans/2026-01-29_event-spine-v2-contract.md`

**Hard guardrails**  
- No Cosmos  
- Tenant‑only default, global opt‑in required

**Deliverables**  
1) Ingestion script that reads Event Spine V2 events  
2) Tuning schema (RL/RLHA feedback + KPI outcomes)  
3) Tables/migrations in `/Users/jaynowman/dev/atoms-tuning/` (or centralized Supabase migration if requested)

**Proof**  
- One run produces a tuning session + KPI outcome record

---

# Kickoff Prompt — UI Logging Lens + Visibility (Worker C)

**Role**: Product UX engineer focused on logging observability + privacy tiers.  
**Work root**: `/Users/jaynowman/dev`

**Read first**  
- `/Users/jaynowman/dev/AGENTS.md`  
- `/Users/jaynowman/dev/docs/plans/2026-01-29_event-spine-v2-contract.md`

**Hard guardrails**  
- No new transport routes  
- SaaS hides framework/provider by default  
- PII rehydration only for tenant UI

**Deliverables**  
1) Logging lens UI (per run, per canvas)  
2) Visibility tier config UI  
3) Tenant UI rehydration rendering

**Proof**  
- SaaS view shows branded names  
- Enterprise shows optional framework name  
- System view shows raw trace
