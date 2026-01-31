
---
name: muscle-factory-site-spawner
description: "The Factory Tool that builds and deploys other tools!"
metadata:
  type: mcp
  entrypoint: src/atoms_muscle/factory/site_spawner/mcp.py
  pricing: "flat_fee"
  auto_wrapped: true
---
# Site Spawner
This muscle allows an Agent (or the God Config UI) to purchase a domain and deploy a standard Microsite Template pre-configured for a specific Muscle.

## Tools
- `check_domain_availability(domain)`
- `buy_and_deploy_site(muscle_key, domain, provider)`
