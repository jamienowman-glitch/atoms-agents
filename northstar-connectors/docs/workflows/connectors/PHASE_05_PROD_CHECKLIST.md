# Phase 05: Production Checklist

## 1. Schema & Validation Tests
- [ ] **Template Schema**: Verify all registry templates validate against `ConnectorTemplate` schema.
- [ ] **Instance Schema**: Verify all DB instances validate against `ConnectorInstance` schema.
- [ ] **Secret Safety**: Attempt to save an instance with a plain-text secret in a `secret: true` field. MUST FAIL.

## 2. Gating & Security Tests
- [ ] **Strategy Lock**:
  - Mock `engines.strategy_lock` to deny action `shopify:write`.
  - Run `update_product` operation.
  - EXPECT: `StrategyViolationError`.
- [ ] **Firearms**:
  - Mock `engines.firearms` to return `status: revoked`.
  - Run `delete_product` operation.
  - EXPECT: `FirearmsViolationError`.
- [ ] **Tenant Isolation**:
  - Create instance for `tenant_A`.
  - Try to execute it using `tenant_B` context.
  - EXPECT: `SecurityError` / `NotFound`.

## 3. Operational Metadata Tests
- [ ] **Dataset Event**:
  - Run `get_products`.
  - Verify `DatasetEvent` is emitted with `tenantId` (camelCase) and `surface="connector"`.
- [ ] **Budget Event**:
  - Run `update_product` (mock success).
  - Verify `UsageEvent` is emitted with correct `tool_type` and `cost`.
- [ ] **Deterministic IDs**:
  - Verify `DatasetEvent.agentId` matches `ConnectorInstance.id` exactly.

## 4. Lifecycle Tests
- [ ] **Rollback**:
  - Create revision 1 (active).
  - Update to revision 2 (active).
  - Revert to revision 1.
  - EXPECT: New revision 3 created with content of revision 1.
- [ ] **Template Immutability**:
  - Attempt to push changes to an existing version file in `registry/`.
  - CI/CD Gate MUST reject.

## 5. Deployment Gates
- [ ] **Registry Sync**: Ensure registry YAMLs are synced to runtime cache (if used).
- [ ] **Secret Rotation**: Verify `SecretResolver` handles rotated GSM secrets without instance config updates.
