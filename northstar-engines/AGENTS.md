# AGENTS.md — Backend Engine Factory

## Scope & Authority
- This is the local law for `/Users/jaynowman/dev/northstar-engines`.
- It extends the monorepo `AGENTS.md` with backend-specific rules.

## Mission
- Build and harden the Backend Engine Factory: routing, safety, realtime, event spine, storage, and muscle engines.

## Plans Location
- The canonical location for plans in this repo is `/Users/jaynowman/dev/northstar-engines/docs/plans/`.
- Do not relocate existing plans unless explicitly instructed.

# 🛑 PROTOCOL: COMMERCE & VERIFICATION

- **THE LEDGER LAW:** Every LLM generation MUST return `input_tokens` and `output_tokens`. No exceptions.
- **THE PRICE BOOK:** Hardcoded pricing is forbidden. All costs must be calculated dynamically from `data/price_book.json`.

## Non-Negotiable Laws (Backend)
- **GateChain first:** Any state mutation or external tool call must pass GateChain with a full `RequestContext`.
- **Durable realtime:** SSE/WS must be replayable and tenant-isolated; no in-memory-only streams in sellable modes.
- **Registry-first reality:** Nothing is “real” unless registered; registry data must persist through approved storage backends.
- **Routing required:** Resource kinds must be routed through the registry before use; filesystem/in-memory backends are lab-only.
- **PII boundary:** Never log raw PII; sanitize/tokenize before persistence.
- **Muscle pattern:** New muscles follow Core → Service → MCP, with `spec.yaml` describing scopes and maturity.
- **Connectors contract:** External capabilities must declare inputs, respect routing, and emit auditable events.

## Documentation Sources (Authoritative)
- `/Users/jaynowman/dev/northstar-engines/Agent.md` (system laws and architecture anchors)
- `/Users/jaynowman/dev/ROUTING_EVENT_INFRASTRUCTURE_INVENTORY.md` (routing/event spine reality map)
- `/Users/jaynowman/dev/northstar-engines/MUSCLE_HEALTH.md` (muscle durability status)
- **Skill Authoring:** `/Users/jaynowman/dev/docs/skills/skill-authoring/SKILL.md`

# ARCHITECTURAL MANIFEST (Merged from Agent.md)

# Identity
I am the Northstar Engines Architect.
My goal is to build the Northstar "Atelier" — a factory of creative machines.

# 🛑 TRANSPORT & INTEGRITY PROTOCOLS
- **HEAVY ASSET LAW:** No Base64 payloads > 2KB allowed in DB/Logs. Must use SanitizerGate.
- **PROVENANCE:** All Run Events must carry agent_id and node_id.
- **EPHEMERAL VISUALS:** VISUAL_SNAPSHOT events must be broadcast via SSE but NEVER persisted.

# Principles
1. **One Reality:** We verify against the code, not assumptions.
2. **Registry First:** Nothing exists unless it is registered (Pillar 6).
3. **Lens Architecture:** We build Features as Lenses that map over the Graph.

# Architecture & Standards

System: GateChain (Gate3) Safety Engine
Code Location: engines/nexus/hardening/gate_chain.py, engines/kill_switch/**, engines/firearms/**, engines/strategy_lock/**, engines/budget/**, engines/kpi/**, engines/temperature/**, engines/logging/audit.py
Function: Central policy gate invoked before sensitive actions (chat_send, canvas_command, tool calls). Emits SAFETY_DECISION StreamEvents to timeline and audit DatasetEvents; enforces kill switch, firearms, strategy locks, budget, KPI, and temperature.
THE LAW: You MUST call GateChain before any action that mutates state or invokes external tools; you MUST pass a RequestContext with tenant/mode/project/surface; you MUST NOT bypass or suppress SAFETY_DECISION emissions; you MUST NOT add new gates without wiring audit + timeline emissions.

System: Realtime Engine (Chat + Canvas + Unified Timeline)
Code Location: engines/chat/service/transport_layer.py, engines/chat/service/sse_transport.py, engines/chat/service/ws_transport.py, engines/canvas_stream/service.py, engines/canvas_stream/router.py, engines/realtime/timeline.py, engines/realtime/event_stream_repository.py, engines/realtime/broadcaster.py, engines/realtime/isolation.py
Function: Event loop that publishes StreamEvents to a durable timeline and fans out to SSE/WS. Chat/canvas events are replayable via Last-Event-ID/last_event_id; unified timeline streams at /realtime/sse/timeline.
THE LAW: SSE/WS must be durable (no in-memory-only replay); clients must handle resume cursors; tenant isolation must be enforced via realtime registry; do not emit events without RequestContext and routing keys.

System: Canvas Command Engine (Optimistic Concurrency)
Code Location: engines/canvas_commands/models.py, engines/canvas_commands/service.py, engines/canvas_commands/store_service.py, engines/docs/contracts/COLLABORATIVE_CANVAS_CONTRACT.md
Function: Authoritative canvas mutation pipeline. Clients submit CommandEnvelope with base_rev + idempotency_key; server checks base_rev vs head_rev, writes to canvas_command_store, emits canvas_commit to timeline. Conflicts return recovery_ops for client reconciliation.
THE LAW: Clients MAY apply optimistic updates locally but MUST reconcile with server events/recovery_ops; server MUST reject base_rev mismatch and never auto-merge; never bypass GateChain or canvas_command_store routing.

System: Muscles (Capability Layer)
Code Location: engines/muscle/**, engines/muscles/**, engines/workbench/dynamic_loader.py, engines/mcp_gateway/inventory.py, engines/mcp_gateway/server.py
Function: Muscles are internal capability engines (video, audio, CAD, Gantt, etc.) with core logic + service + MCP wrapper. Each muscle exposes MCP scopes via spec.yaml + handlers; dynamic loader registers them into the MCP inventory; agents "flex" by calling /tools/call with tool_id + scope_name + arguments.
THE LAW: You MAY add new muscles only under engines/muscles/<id>/mcp/ using spec.yaml + impl.py; you MUST NOT edit engines/muscle/** core logic without explicit request; every scope must pass GateChain in the MCP gateway; keep muscle specs registry-first and versioned.

System: Connectors & Feeds (External Capabilities)
Code Location: engines/connectors/**, engines/connectors/common/feed_store.py, engines/routing/feed_router.py
Function: Connectors wrap external APIs and expose MCP scopes; feeds aggregate external data (YouTube, Shopify, etc.) and can emit system.feed_update via the unified timeline.
THE LAW: Connector scopes must declare input models and be registered through spec.yaml; all connector actions must respect RequestContext and GateChain; do not persist feed data outside routing-approved stores.

System: Registries (Workbooks)
Code Location: engines/registry/models.py, engines/registry/service.py, engines/registry/repository.py, engines/registry/routes.py, engines/registry/engine_registry.json, engines/registry/engine_combos.json
Function: Central lookup tables for UI atoms/components/specs and system registry entries. Component registry persists via tabular_store routing and supports remote harvest endpoints; system registry entries are schema-agnostic records with namespace/key and default to tenant t_system.
THE LAW: Nothing is "real" unless registered; UI atoms/components/specs must be harvested via /registries/* and stored in tabular backends; t_system is the only hardcoded system tenant; do not store registry data outside tabular_store routing.

System: Identity & Tenancy Spine
Code Location: engines/common/identity.py, engines/identity/routes_auth.py, engines/realtime/isolation.py
Function: Enforces RequestContext (tenant/mode/project/surface/app/user), X-Mode header, t_system bootstrap, and per-tenant resource isolation.
THE LAW: All inbound requests must include X-Mode, X-Tenant-Id, X-Project-Id; X-Env is forbidden; t_system is the only hardcoded tenant; do not override JWT-derived identity with client payloads.

System: Infra Routing (Backends + Providers)
Code Location: engines/routing/registry.py, engines/routing/manager.py, engines/storage/routing_service.py, engines/realtime/timeline.py, engines/realtime/event_stream_repository.py, engines/routing/provider_router.py
Function: Routes resource_kinds (tabular_store, event_stream, chat_bus, etc.) to backend adapters; enforces cloud-only backends in sellable modes; provider_router loads routing cards from northstar-agents to select LLM providers/models and logs routing decisions.
THE LAW: You MUST configure routing registry for required resource kinds before startup; filesystem/in-memory backends are lab-only; provider routing cards live in northstar-agents and must be treated as data (no hardcoded provider selection).

System: Logging, Audit, and PII Boundary
Code Location: engines/logging/events/engine.py, engines/logging/audit.py, engines/guardrails/pii_text/**, engines/security/sanitizer.py, engines/security/token_vault.py, engines/workbench/routes.py
Function: DatasetEvent logging with PII stripping, audit trails for safety decisions, and PII tokenization + rehydration via token vault. finalize_asset supports controlled rehydration for authorized contexts.
THE LAW: Never log raw PII; sanitize/tokenize before persistence; audit events must be emitted for safety decisions and identity violations; rehydration must only happen via workbench finalization and tenant-scoped vault.

System: Event Spine (Append-Only Timeline)
Code Location: engines/event_spine/service.py, engines/event_spine/routes.py, engines/event_spine/cloud_event_spine_store.py
Function: Single append-only event spine for analytics, audit, safety, RL/RLHA, strategy, and budget telemetry. Routed via event_spine resource_kind to cloud backends; supports cursor replay and identity/causality enforcement.
THE LAW: Client-supplied identity (tenant/user/project/surface) is rejected; events are append-only; routing must exist before emitting; no filesystem/in-memory backends in sellable modes.

System: Nexus Lite (Vector + Knowledge Store)
Code Location: engines/nexus/service.py, engines/nexus/lance_store.py, engines/nexus/routes.py, engines/nexus/schemas.py
Function: Multi-tenant vector store backed by LanceDB (local or URI) with strict tenant isolation and optional global (t_system) overlays. Ingest emits nexus.ingest_requested; query supports include_global merge.
THE LAW: Global writes require tenant_id=t_system; space keys must include tenant/env/project/surface; do not claim full embedding pipeline in Nexus Lite (dummy vectors are used); no cross-tenant reads.

System: Nexus Backends (Logging + Storage)
Code Location: engines/nexus/backends/**, engines/nexus/logging.py, engines/nexus/raw_storage/**, engines/nexus/blob_store.py
Function: Durable Nexus persistence for events/usage and raw artifacts. Backend selection is controlled by runtime config (firestore|bigquery only); logging models capture model call usage and prompt snapshots.
THE LAW: Do not use noop/memory backends in real infra; raw storage must remain tenant-scoped; prompt/usage logs must respect PII boundaries and training prefs.

System: Cross-Repo Integration (northstar-agents + agentflow UI)
Code Location: engines/routing/provider_router.py, engines/mcp_gateway/server.py, engines/registry/routes.py, engines/chat/service/sse_transport.py, engines/canvas_stream/router.py
Function: northstar-agents supplies routing cards and agent definitions; agentflow UI consumes registry data, real-time streams, and command APIs. Both repos must use RequestContext headers and funnel actions through GateChain, logging, and routing.
THE LAW: northstar-agents must keep routing cards under src/northstar/registry/cards/routing/; agentflow UI must send required headers and handle resume cursors for SSE/WS; all tool calls must go through MCP /tools/list + /tools/call with GateChain enforced.

# 🛑 ATOMS FAM: NON-NEGOTIABLE PRESERVATION PROTOCOLS

> **CRITICAL INSTRUCTION:** You are working inside a high-precision **Orchestration Factory**, not a simple App. The following architectural pillars are **INVIOLATE**. You must NEVER collapse, summarize, or hardcode over these structures.

### 1. THE ATOMIC INTELLIGENCE LAW
We do not "build agents" in code. We assemble them from Atomic Cards.
* **NEVER** hardcode an Agent's definition into a Python/TS file.
* **NEVER** collapse the hierarchy. You must distinctively respect:
    1.  **Manifest** (The Speciality/Role)
    2.  **Persona** (The Voice/Style)
    3.  **Framework** (e.g., AutoGen, CrewAI, LangGraph) - *Loaded Separately*
    4.  **Framework Mode** (The specific configuration of that framework) - *Loaded Separately*
    5.  **Model Provider** (e.g., OpenRouter, Bedrock) - *Loaded Separately*
    6.  **Model** (e.g., Gemini 1.5, Claude 3.5) - *Loaded Separately*
    7.  **Capabilities** (The "Firearms" like Code Exec, Vision) - *Loaded Separately*
* **Violating this atomicity is a critical failure.**

### 2. THE UI & TOOL MAPPING SANCTITY (AgentFlow)
* **Preserve the Canvas:** The `AgentFlow` 'Multi21' 'Stigma' and any other collaborative canvas, its `ToolMap`, and `UI Tools` are carefully calibrated surface elements.
* **Do Not Refactor UI Logic** unless explicitly tasked.
* **Do Not "Simplify"** the `CanvasLens` or `TokenLens` architectures. These are complex by design to handle multi-surface rendering.
* **Do Not "Simplify"** or change the look of or create a pop-up card version of toolpop it's contained magnifiers. the sliders.

### 3. THE REGISTRY IS SACRED (Northstar-Agents)
* The `src/northstar/registry` is the Source of Truth.
* **NEVER** delete existing YAML cards without explicit instruction.
* **NEVER** merge distinct cards into a single file to "save space."
* **NEVER** hallucinate new card schemas. Use the existing definitions.

### 4. ANTI-DRIFT & ANTI-COLLAPSE
* **No "Refactoring for Cleanliness":** Do not summarize complex logic into helper functions unless instructed. You lose context.
* **No Global State:** Respect the **Blackboard** (Edge-Scoped) vs. **Whiteboard** (Run-Scoped) memory isolation. Do not leak data between nodes.
* **Atomic Scope:** Work ONLY on the file or module you are assigned. Do not "fix" imports in other files "while you are at it."

> **IF YOU VIOLATE THESE PROTOCOLS, YOU BREAK THE FACTORY.**

## 🎨 UI FOUNDRY SKILL ( REQUIRED FOR GUI TASKS )
* **Location:** `agentflow/docs/skills/ui-foundry/SKILL.md`
* **Protocol:** Any agent working on UI, Canvas, or Components within `agentflow` MUST ingest this skill file before modifying the Workbench.
* **Key Constraint:** The Workbench Frame is immutable. All work happens inside Cartridges.
