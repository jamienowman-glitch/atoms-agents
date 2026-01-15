# Phase 0→2 Status Update (Mode-only, No-InMemory)

- Gate0 Storage: GCS PASS (gs://northstar-os-dev-northstar-raw, key tenants/t_system/lab/media_v2/smoke/<ts>.txt); S3 supported but blocked by AccessDenied on PutObject to bucket northstar-dev-boy for user northstar-dev.
- Gate1 Mode/Context: COMPLETE (ModeCTX implemented; X-Mode required, X-Env rejected) — merged via PR #1.
- Gate1 Event Envelope: COMPLETE (contract enforcement implemented; tests pass) — merged via PR #1.
- Gate1 Integration Merge: COMPLETE (ModeCTX + Envelope merged via PR #1).
- Gate1 Next lanes: No-InMemory/No-Noop, then PII pre-call (pending).
- Gate2 Memory Durable: COMPLETE (PR #4 / commit f2f17f4).
- Gate2 Stream Replay Durable: COMPLETE (PR #6).
- Gate2 Vector-ish ingest/retrieval (no Vertex): COMPLETE (PR #7 / commit 78b629e).
- Gate2 Cost kill-switch + /ops/status + Azure env contract stubs: COMPLETE (PR #5) — Azure added to multi-cloud contract.
- Gate2 AuditChain: PENDING (hash chaining/storage_class=audit not merged yet).
- Agents: AgentsRequestContext + audit correlation alignment DONE.
- UI: transport header injection + mode adoption DONE; WS auth still TODO choke-point.
