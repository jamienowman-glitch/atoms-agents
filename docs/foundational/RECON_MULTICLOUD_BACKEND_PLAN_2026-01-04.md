# Multicloud Backend Plan — 2026-01-04

Routing registry selects backends per `tenant_id`/`mode`/`project_id`/`surface_id`. All entries must live in routing registry (no env fallbacks), and missing route returns 503 with the uniform error envelope.

## chat_store

- **GCP (Firestore)**: Collection `chat_messages`; document id `pk = {tenant_id}#{mode}#{project_id}#{thread_id}`, subcollection `messages` keyed by `ts#{message_id}`. Index on `thread_id + ts`. Snapshot documents in `chat_snapshots`.
- **AWS (DynamoDB)**: Table `chat_store` with `PK=chat#{tenant_id}#{project_id}#{thread_id}`, `SK=ts#{timestamp}#{message_id}`; GSI `run_id` optional for agent threads; TTL optional for transient threads.
- **Azure (Cosmos SQL)**: Container `chat_store`, partition key `/pk` where `pk=chat#{tenant_id}#{project_id}#{thread_id}`, `id=ts#{message_id}`; composite index on `ts`.
- **Routing example**: `{ "resource_kind": "chat_store", "backend_type": "firestore|dynamodb|cosmos", "config": { ... }, "modes": ["saas","enterprise","system"] }`
- **Provisioning**: Create collection/table/container with R/W IAM, enable autoscale/throughput; ensure point-in-time recovery (Dynamo) and TTL policy if used.

## config_store

- **GCP**: Firestore collection `config_store`; docs keyed `scope#{tenant|system}#{surface_id}` with version + payload.
- **AWS**: DynamoDB table `config_store`; `PK=config#{scope}#{tenant_id}`, `SK=version#{n}` with `latest` item; conditionally write to enforce versioning.
- **Azure**: Cosmos container `config_store`, partition `/pk` where `pk=config#{scope}#{tenant_id}`.
- **Routing example**: `{ "resource_kind": "config_store", "backend_type": "dynamodb", "config": { "table_name": "config_store", "region": "us-east-1" } }`
- **Provisioning**: Enable PITR (Dynamo) / backup (Firestore/Cosmos); restrict IAM to config service; add schema validation for scope keys.

## firearms_policy_store

- **GCP**: Firestore collection `firearms_policy`; docs for bindings (`binding#{action_name}`) and grants (`grant#{tenant_id}#{actor}`) stored under tenant collections; include `strategy_lock_required` flag.
- **AWS**: DynamoDB table `firearms_policy_store`; `PK=tenant#{tenant_id}`, `SK=bind#{action_name}` for bindings; grants use `PK=tenant#{tenant_id}`, `SK=grant#{actor_type}#{actor_id}#{firearm_id}`; GSI on `firearm_id`.
- **Azure**: Cosmos container `firearms_policy_store`, partition `/pk` (`pk=tenant#{tenant_id}`), `id` as above.
- **Routing example**: `{ "resource_kind": "firearms_policy_store", "backend_type": "cosmos", "config": { "account": "...", "database": "northstar-routing", "container": "firearms_policy_store", "partition_key": "/pk" } }`
- **Provisioning**: Enable unique constraints on action bindings where supported; audit writes; backups enabled; enforce TTL for expired grants if desired.

## strategy_policy_store

- **GCP**: Firestore collection `strategy_policy`; docs keyed `policy#{surface_id or global}#{action_name}` with lock requirements and default behaviors.
- **AWS**: DynamoDB table `strategy_policy_store`; `PK=tenant#{tenant_id}`, `SK=scope#{surface_id or global}#{action_name}`; store `requires_lock`, `lock_id`, `approver_policy`.
- **Azure**: Cosmos container `strategy_policy_store`, partition `/pk` (`pk=tenant#{tenant_id}`).
- **Routing example**: `{ "resource_kind": "strategy_policy_store", "backend_type": "firestore", "config": { "project": "ns-prod", "collection": "strategy_policy" } }`
- **Provisioning**: Throughput scaled for policy reads; PITR/backups; IAM scoped to strategy service; seed defaults for `surface=global`.

## canvas_command_store

- **GCP**: Firestore collection `canvas_commands`; `pk=canvas#{tenant_id}#{project_id}#{canvas_id}`, documents `rev#{n}` with idempotency key + payload; index on `rev`.
- **AWS**: DynamoDB table `canvas_command_store`; `PK=canvas#{tenant_id}#{project_id}#{canvas_id}`, `SK=rev#{n}`; GSI on `idempotency_key`; enable streams for replay pipeline.
- **Azure**: Cosmos container `canvas_command_store`, partition `/pk` (`pk=canvas#{tenant_id}#{project_id}#{canvas_id}`), `id=rev#{n}`.
- **Routing example**: `{ "resource_kind": "canvas_command_store", "backend_type": "dynamodb", "config": { "table_name": "canvas_command_store", "region": "us-east-1" } }`
- **Provisioning**: Strong write/read for head revision reads; enable streams/change feed for timeline backfill; PITR/backups enabled.

## Routing Selection Rules

- `tenant_id`/`mode`/`project_id` select route; surface-specific overrides allowed for `chat_store` and `strategy_policy_store`.
- No filesystem or memory backends in sellable modes; lab-only must still require explicit routing entry.
- Diagnostics endpoint should expose active routes and return 503 via the shared envelope when absent.
