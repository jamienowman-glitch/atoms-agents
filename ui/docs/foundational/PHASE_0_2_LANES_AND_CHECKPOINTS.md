# Phase 0→2 Lanes and Checkpoints (to Safety DoD handoff)

## Current State Snapshot
- Gate1: ModeCTX COMPLETE (PR #1); Envelope COMPLETE (PR #1); merge COMPLETE; No-InMemory and PII pre-call pending.
- Gate2: Memory Durable COMPLETE (PR #4 / f2f17f4); Stream Replay Durable COMPLETE (PR #6); Vector-ish ingest/retrieval COMPLETE (PR #7 / 78b629e); Cost kill-switch + /ops/status + Azure stubs COMPLETE (PR #5); AuditChain PENDING.
- Gate3: Client propagation not started (agents/UI/connectors) beyond existing header/mode groundwork; WS auth TODO in UI; connectors pending.
- Multi-cloud: GCS real (PASS), S3 supported but IAM blocked, Azure stub in contract.
- Cost controls: cost kill-switch + /ops/status landed in PR #5; verify via /ops/status.

## Remaining work before Safety DoD
- Gate1: No-InMemory/No-Noop; PII pre-call.
- Gate2: AuditChain.
- Gate3: UI WS auth/header enforcement; agents/header propagation/run+trace stability; connectors context/header propagation.

## Lanes (non-colliding)
### Lane A — Infrastructure & Contracts
- Repos: northstar-engines.
- Allow: engines/common/identity.py; logging/; chat/service/transport_layer.py; memory/; nexus/memory/; budget/; ops routes; routing config; docs/foundational.
- Deny: UI/agents/connectors code; muscle engines.
- Tests: pytest logs/test_event_contract.py; tests/test_real_infra_enforcement.py; tests/logs/test_stream_replay.py; logs/test_audit_hash_chain.py; memory/test_memory_persistence.py; logs/test_usage_events.py.
- PR pattern: `[Gate2/3][LaneA] …`

### Lane B — PII Boundary + Nexus/HAZE
- Repos: northstar-engines.
- Allow: chat/service/llm_client.py; nexus/vector_explorer/*; logging/events; shared PII hook; docs/foundational.
- Deny: core identity; UI/agents/connectors.
- Tests: pytest logs/test_pii_gate.py; vector_explorer/test_contract_mode.py.
- PR pattern: `[Gate1/2][LaneB] …`

### Lane C — Client Propagation
- Repos: ui, northstar-agents, northstar-connectors.
- Allow: transport/header middleware; SSE/WS clients; agent request context/adapters; docs/foundational.
- Deny: engines code.
- Tests: UI contract/header propagation check; agents context tests; connector integration checks (to be added).
- PR pattern: `[Gate3][Clients] …`

## Checkpoints
- Checkpoint A (Gate2 complete): AuditChain merged; all Gate2 tests pass; /ops/status reflects cost state; docs updated (status + gate checklists).
- Checkpoint B (Gate3 complete): UI/agents/connectors send required headers (X-Mode/X-Tenant-Id/X-Project-Id etc.); WS auth enforced; replay validated from client; docs updated.

## Safety DoD handoff trigger
We are ready to define Safety DoD when: Gate1 (No-InMemory + PII pre-call) and Gate2 (AuditChain) are complete, and Gate3 header propagation is in place so all events/streams/logs carry tenant/mode/project with durable storage and replay.***
