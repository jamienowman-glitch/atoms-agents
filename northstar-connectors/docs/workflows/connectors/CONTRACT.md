# Connectors Lane Contract

## Immutable Guardrails

1. **Runtime Scope**: 
   - No prompts, personas, orchestration, or agent logic in connectors runtime.
   - Behavior lives in core cards/manifests later.

2. **Engines Semantics**:
   - Do not change definitions of Strategy Lock, Firearms, Budget, KPI, Temperature.
   - Only call them by documented interface.

3. **Scoping**:
   - Everything is `tenant_id` + `env` scoped.

4. **Secrets**:
   - GSM-only `secret_ref` strings.
   - Never store or invent secret values.

5. **Operational Metadata**:
   - Every operation MUST declare:
     - `strategy_lock_action`
     - `firearms_action` (for dangerous ops)
     - `DatasetEvent` logging
     - `budget UsageEvent` fields

6. **UI**:
   - No UI implementation here (UI spec/contract only).
