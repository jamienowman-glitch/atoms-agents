# Wireframe AgentFlow Token Catalog v0

## Token naming rules

1) Paths are dot-separated, lower_snake:
`node.agent.model.provider_id`

2) IDs are explicit refs, never “embedded objects” unless needed:
`node.agent.card_ref = "agent_card:ae04seo@1.0.0"`
`node.agent.persona_ref = "persona:seo_v1@1.0.0"`

3) Persisted vs UI-only is separated by prefix:
*   Persisted: `graph.*`, `node.*`, `edge.*`, `board.*`, `run_ref.*`
*   UI-only: `ui.*` (never exported)

4) Every element instance has:
*   `element.id`
*   `element.kind` (enum)
*   `element.schema_id` (stable)

---

## Element kinds for the Wireframe AgentFlow canvas

These are the canvas element types TokenLens will understand (each has its own token schema):

**Graph-level (canvas root)**
*   `wf_graph`

**Nodes**
*   `agent_node`
*   `framework_node`
*   `blackboard_node`
*   `task_node`
*   `artefact_node`
*   `asset_node`
*   `router_node` (optional but useful for conditions/branching)

**Edges**
*   `flow_edge`

---

## Token Catalog v0 — Wireframe AgentFlow Builder

### A) wf_graph (graph root / FlowPackage identity)

**Identity + metadata**
*   `graph.id` (string, required)
*   `graph.name` (string, required)
*   `graph.description` (string)
*   `graph.tags` (string[])

**Enabled lenses (what’s active on this flow)**
*   `graph.lenses.enabled` (string[]; must include: agentflow, optionally others)

**Canvas attachments (so “GraphLens builder is a canvas too”)**
*   `graph.canvases.refs` (list of objects)
    *   `canvas_id` (string)
    *   `canvas_type` (enum: wireframe_agentflow, shopify_builder, video_timeline, freeform)
    *   `display_name` (string)
    *   `anchor` (string; UI jump target)

**Chat modes (exist, but we won’t fully tune yet)**
*   `graph.chat_modes.allowed` (string[]; refs to chatmodes registry)
*   `graph.chat_modes.default` (string)

**Run defaults (pure semantics; not connectors)**
*   `graph.run.defaults.timeout_ms` (number)
*   `graph.run.defaults.max_steps` (number)

---

### B) agent_node (agent selection + runtime knobs)

**Agent identity (manifest/card)**
*   `node.agent.card_ref` (string; registry ref, required)
*   `node.agent.name_override` (string; optional display name)

**Persona (separate from manifest)**
*   `node.agent.persona_ref` (string; registry ref)
*   `node.agent.persona_overrides.instructions` (string; optional)

**Model provider / model (separate tokens)**
*   `node.agent.model.provider_id` (string; provider registry id)
*   `node.agent.model.model_id` (string; model registry id)

**Capabilities (multi-select, real registry IDs)**
*   `node.agent.capabilities.enabled` (string[]; capability ids)
*   `node.agent.capabilities.locked` (string[]; optional “forced-on” if you later need it)

**Execution knobs (agent-local)**
*   `node.exec.timeout_ms` (number)
*   `node.exec.retries.max` (number)
*   `node.exec.retries.backoff_ms` (number)
*   `node.exec.concurrency` (number; default 1)
*   `node.exec.idempotency_key` (string; optional)

**Task attachment (agent can be assigned tasks via edges, but allow default)**
*   `node.task.default_task_ref` (string; optional)
*   `node.task.allow_adhoc` (bool; default true)

**Blackboard access bindings (do NOT make global)**
*   `node.blackboard.read_bindings` (list)
    *   `board_id` (string)
    *   `keys_prefixes` (string[]; optional)
*   `node.blackboard.write_bindings` (list)
    *   `board_id`
    *   `keys_prefixes`

**IO contracts (internal only)**
*   `node.io.inputs.schema_ref` (string; optional)
*   `node.io.outputs.schema_ref` (string; optional)

---

### C) framework_node (framework type + nested agents + manager + mode)

**Framework identity**
*   `node.framework.kind` (enum: autogen, adk, langgraph, crewai)
*   `node.framework.mode_ref` (string; framework_modes registry ref)

**Nested agents**
*   `node.framework.agent_node_ids` (string[]; references canvas element ids)

**Manager / lead agent (standardized across frameworks)**
*   `node.framework.manager.agent_node_id` (string; one of the nested agent ids)
*   `node.framework.manager.style` (enum: delegate, moderate, approve_only)

**Rounds / floors / ceilings**
*   `node.framework.rounds.min` (number; default 3)
*   `node.framework.rounds.max` (number; default 7)

**Discussion style toggles (framework-agnostic knobs)**
*   `node.framework.discussion.debate_enabled` (bool)
*   `node.framework.discussion.parallelism_enabled` (bool)
*   `node.framework.discussion.parallelism.max_parallel` (number)

**Blackboard scope selector (your key requirement)**
*   `node.framework.blackboard.access_scope` (enum: framework_level, agent_level)
    *   `framework_level` means the whole framework can read/write bound boards
    *   `agent_level` means only selected nested agents can read/write (bindings live on those agent nodes)

---

### D) blackboard_node (board definition + retention; adjacency-scoped)

**Board identity**
*   `board.id` (string; required, stable)
*   `board.name` (string)
*   `board.description` (string)

**Key-space definition (lightweight, optional initially)**
*   `board.keys.allowed_prefixes` (string[]; e.g. ["plan.", "draft.", "metrics."])

**Persistence (optional, but you already have “persistence badge”)**
*   `board.persistence.enabled` (bool)
*   `board.persistence.policy` (enum: none, run_scoped, project_scoped)
*   Important: even if storage is namespaced by run_id, permissions remain adjacency-scoped by bindings.

---

### E) task_node (task is separate from agent + artefact)

**Task identity**
*   `task.ref` (string; task registry ref, required)

**Task payload (optional overrides)**
*   `task.instructions_override` (string)
*   `task.acceptance_criteria` (string)

**Assignment (what this task targets)**
*   `task.assignee.target_kind` (enum: agent_node, framework_node)
*   `task.assignee.target_id` (string; element id)

**Inputs**
*   `task.inputs.from_blackboard` (list of {board_id, key_prefix})
*   `task.inputs.from_artefacts` (string[]; artefact node ids)

---

### F) artefact_node (internal handoff object)

**Artefact identity**
*   `artefact.spec_ref` (string; artefact_specs registry ref)
*   `artefact.name` (string)

**Format**
*   `artefact.format` (enum: json, markdown, html, csv, image_ref, video_ref)
*   `artefact.schema_ref` (string; optional)

**Producer/consumers (optional; can be derived from edges, but helpful)**
*   `artefact.producer.node_id` (string)
*   `artefact.consumers.node_ids` (string[])

---

### G) asset_node (deliverable object; delivery lens does destinations later)

**Asset identity**
*   `asset.spec_ref` (string; asset_specs registry ref)
*   `asset.name` (string)

**Format**
*   `asset.format` (enum: doc, webpage, email, image, video, zip, other)
*   `asset.schema_ref` (string; optional)

**Delivery is NOT here**
*   Do not add connector/destination tokens here.
*   Delivery lens will attach destinations separately.

---

### H) router_node (branching, internal logic only)
*   `route.condition.enabled` (bool)
*   `route.condition.expr` (string)
*   `route.gating.mode` (enum: always, on_success, on_failure, on_warning)
*   `route.fallback.edge_id` (string; optional)

---

### I) flow_edge (wiring)

**Identity**
*   `edge.id` (string)
*   `edge.from.node_id` (string)
*   `edge.to.node_id` (string)

**Semantics**
*   `edge.kind` (enum: control, data)
*   `edge.enabled` (bool)

**Routing/gating**
*   `edge.route.gating.mode` (enum: always, on_success, on_failure, on_warning)
*   `edge.route.condition.expr` (string; optional)

**Data bindings (optional v0, but useful)**
*   `edge.data.bindings` (list of {from_path, to_path})

---

## TokenLens allocation rules

This is what the “long press / click inspector” should show per node kind:

**agent_node sections (in this order)**
1.  Agent Card (node.agent.card_ref, node.agent.name_override)
2.  Persona (node.agent.persona_ref, overrides)
3.  Model (provider_id, model_id)
4.  Capabilities (capabilities.enabled)
5.  Execution (timeout, retries, concurrency)
6.  Blackboard bindings (read/write bindings)
7.  IO (schema refs)

**framework_node**
1.  Framework (kind, mode_ref)
2.  Members (agent_node_ids, manager.agent_node_id)
3.  Rounds (min, max)
4.  Discussion (debate/parallelism)
5.  Blackboard scope (access_scope)

**blackboard_node**
1.  Board identity
2.  Allowed prefixes
3.  Persistence

**task_node**
1.  Task ref
2.  Assignee
3.  Inputs

**artefact_node**
1.  Spec ref + format
2.  Producer/consumers (optional)

**asset_node**
1.  Spec ref + format
2.  (Delivery lens handles destinations later)

**flow_edge**
1.  Kind + enabled
2.  Gating / condition
3.  Bindings (optional)

---

## Mobile “long press” control pages

For the mobile inspector, define “quick pages” you can swipe:

1.  **Timeout (L) + Retries (R)**
    *   `node.exec.timeout_ms` / `node.exec.retries.max`
2.  **Backoff (L) + Concurrency (R)**
    *   `node.exec.retries.backoff_ms` / `node.exec.concurrency`
3.  **Rounds min (L) + Rounds max (R) (framework only)**
    *   `node.framework.rounds.min` / `node.framework.rounds.max`
4.  **Debate toggle (L) + Parallelism toggle (R) (framework)**
    *   `node.framework.discussion.debate_enabled` / `node.framework.discussion.parallelism_enabled`

Everything else is select/multi-select/text.
