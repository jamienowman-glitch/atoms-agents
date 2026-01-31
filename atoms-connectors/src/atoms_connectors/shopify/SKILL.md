---
name: connector-shopify
description: Contract-first connector skill for Shopify (build the contract, then the MCP spec).
---
# Contract-First Workflow
1. Copy and fill the contract template:
   - `/Users/jaynowman/dev/atoms-core/docs/contracts/connector_factory/CONNECTOR_CONTRACT_TEMPLATE.json`
2. Save the Shopify contract:
   - `/Users/jaynowman/dev/atoms-core/docs/contracts/connector_factory/SHOPIFY_CONNECTOR_CONTRACT.json`
3. Populate all sections (Dev Account, Scopes, KPI, UTM, Budgets, OAuth/Marketplace, BYOK).
4. Build or update the MCP spec:
   - `/Users/jaynowman/dev/atoms-connectors/src/shopify/spec.yaml`

# Rules
- Firearms are the only gate (no danger/risk fields).
- All scopes must be listed under `connector_scopes`.
- UTM templates and metric mappings must follow locked schemas.
