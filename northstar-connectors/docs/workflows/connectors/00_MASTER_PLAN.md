# Connectors Planning Lane Master Plan

## Global Guardrails
- **No prompts/personas/orchestration/agent logic** in connectors runtime.
- **No changes to engines semantics** (Strategy Lock, Firearms, Budget, KPI, Temperature).
- Everything is **tenant_id + env scoped**.
- **Secrets**: GSM-only secret_ref strings; never store or invent secret values.
- Every operation declares **strategy_lock_action**, **firearms_action**, **DatasetEvent** logging, and **budget UsageEvent** fields.
- **No UI implementation** here.

## Workflow Phases
- **Phase 00: Contract Alignment**
  - Reconfirm guardrails vs engines canon.
  - Record TODOs for gaps; stop on ambiguity.
- **Phase 01: Schemas**
  - Define `ConnectorTemplate` and `ConnectorInstance` YAML schemas.
  - Validation rules/bundles.
- **Phase 02: Registry & History**
  - Registry storage, scoping, versioning, rollback.
- **Phase 03: Runtime Stubs**
  - Execution wrapper, gating, logging, budget, audit.
- **Phase 04: Shopify Template**
  - Author Shopify template YAML with full catalog.
- **Phase 05: Prod Checklist**
  - Production checklist + required tests.

## Stop Conditions
- Any missing canonical name/field or required new gate action → record TODO and stop.
- Any attempt to store secrets or touch runtime code → stop.
