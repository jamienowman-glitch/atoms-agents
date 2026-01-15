1. Agent A Execution Plan
- A-1 event_spine: establish routed `event_spine` resource and append-only emit API; success = authenticated append writes to routed backend with identity/causality fields enforced.
- A-2 event_spine: enforce event shape/validation (tenant/mode/run/step/parent) and warning-first diagnostics on missing route; success = emit attempts log warnings when route absent, no stdout fallback.
- A-3 memory_store: route `memory_store`, expose get/set/delete with configured TTL; success = session state persists across restart/host with routing in use.
- A-4 blackboard_store: route `blackboard_store`, enforce versioned writes/list/read; success = coordinated state persists per tenant/mode/project/run with optimistic concurrency.
- A-5 safety/RL/RLHA/tuning/budget/strategy emit: wire GateChain and related emitters to event_spine API; success = every decision/lock/usage emits to spine with required metadata.
- A-6 diagnostics: surface warning-first for missing spine/memory/blackboard routes; success = startup proceeds with warnings and operations refuse silent fallback.

2. Agent B Execution Plan
- B-1 routing: create routed tabular resources `flow_store`, `graph_store`, `overlay_store`, `strategy_lock_store`, `notes_store`, `seo_config_store`; success = registry entries resolvable with no env fallbacks.
- B-2 flow_store/graph_store/overlay_store CRUD: implement routed CRUD with versioning and identity enforcement; success = artifacts persist via routing, version increments on write, survive restart.
- B-3 notes_store: implement notes/maybes CRUD per schema with identity enforcement; success = notes persist via routing, list/query by user/surface/project, survive restart.
- B-4 strategy_lock_store: persisted snapshots with version/history via tabular_store; success = locks stored durably and readable latest/versioned.
- B-5 seo_config_store: persisted SEO configs with versioned reads/writes; success = configs stored per tenant/mode/surface via routing.
- B-6 emit hooks: persistence actions (flow/graph/overlay/strategy_lock/notes/seo where required) emit audit/analytics/strategy events to event_spine API; success = events accepted by A’s API with proper identity/causality.
- B-7 diagnostics: warning-first on missing tabular/notes/seo routes; success = operations warn and block without filesystem/in-memory fallback.

3. Dependency Locks
- B-1 parallel with A-1.
- B-2 parallel with A-3.
- B-3 parallel with A-3.
- B-4 parallel with A-4.
- B-5 parallel with A-1.
- A-2 blocks B-6.
- A-5 blocks B-6.
- Integration point after A-2 + A-5 + B-6.

4. Guardrails
- Agent A must not change/create tabular stores, notes/seo stores, analytics schemas, budget ledger storage, UI/backend save handlers, connector/tool registries; no backend selection outside routing; warning-first behavior only (no startup refusal); no filesystem/in-memory persistence outside lab; no PII rehydration, no Nexus/RAG, no vector/embedder, no external connector execution assumptions.
- Agent B must not touch event spine internals, memory_store, blackboard_store, GateChain/safety pipeline, logging spine internals, auth core beyond endpoint validation; no backend selection outside routing; warning-first only; no filesystem/in-memory persistence outside lab; no PII rehydration, no Nexus/RAG, no vector/embedder, no external connector execution assumptions; no new stores beyond assigned.

5. Definition of Done
- Agent A done when event_spine routed and accepting validated append-only events; memory_store and blackboard_store persist via routing across restarts/hosts; safety/RL/RLHA/tuning/budget/strategy emits reach spine; missing-route conditions produce warnings (not startup failure) and refuse silent fallback; data queryable from routed spine backend.
- Agent B done when flow/graph/overlay/strategy_lock/notes/seo data persist via routed tabular/notes stores with versioned CRUD and identity enforcement; actions emit required events through A’s spine API; all persisted artifacts survive restart and are queryable via their APIs; missing-route conditions warn and block operations without filesystem/in-memory fallback.
