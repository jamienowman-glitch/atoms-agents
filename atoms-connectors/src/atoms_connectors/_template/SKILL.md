---
name: connector-template
description: Template for creating a connector contract + MCP connector spec.
---
# Purpose
Use this template to create a connector contract and align it with the Connector Factory UI.

# Steps
1. Create a provider contract JSON by copying the template:
   - `/Users/jaynowman/dev/atoms-core/docs/contracts/connector_factory/CONNECTOR_CONTRACT_TEMPLATE.json`
2. Fill in all sections:
   - Dev Account, Scopes, KPI, UTM, Budgets, OAuth/Marketplace, BYOK.
3. Ensure all scopes are listed and each scope has `requires_firearm` + `firearm_type_id` where needed.
4. Create or update the MCP connector spec:
   - `/Users/jaynowman/dev/atoms-connectors/src/{provider}/spec.yaml`
5. The contract is shown in the God Config UI as a **draft** until mapped and approved.

# Rules
- Firearms are the only gate. No danger/risk fields.
- UTM templates and metric mappings must follow the locked schemas.
- Skill file points to the contract, not the other way around.
