# Phase 00: Contract Alignment

## Canonical Names & Locations
We have verified the following canonical definitions in `northstar-engines`:

| Concept | Location | Key Fields | Notes |
| :--- | :--- | :--- | :--- |
| **RequestContext** | `engines.common.identity` | `tenant_id`, `env`, `user_id` | Strict `tenant_id` pattern. |
| **DatasetEvent** | `engines.dataset.events.schemas` | `tenantId`, `env`, `surface` | **Uses `tenantId` (camelCase)** |
| **UsageEvent** | `engines.budget.models` | `tenant_id`, `env`, `tokens_input` | Uses `tenant_id` (snake_case) |
| **StrategyLock** | `engines.strategy_lock.models` | `tenant_id`, `env`, `scope` | |
| **FirearmsLicence** | `engines.firearms.models` | `tenant_id`, `scope`, `level` | |

## Guardrail Verification
- **Scoping**: All models enforce `tenant_id` + `env`.
- **Secrets**: No direct secret storage observed in canonical models; `northstar-connectors` must use `secret_ref` only.
- **Engines Semantics**: We will use the models exactly as defined above.

## Gaps & TODOs
None. All required engine semantics are present.
We will proceed to Phase 01.
