---
name: connector-youtube
description: Connector contract for YouTube (scopes, KPI mappings, UTM templates, firearms rules).
metadata:
  type: connector
  provider_slug: youtube
  entrypoint: src/youtube/spec.yaml
  contract: Connector Factory — God Config
---
# Usage
This connector defines YouTube scopes, KPI mappings, UTM templates, and firearms requirements for the God Config UI.

## Defaults
- Scopes: Full list from `connector_scopes` (YouTube).
- KPI mappings: Use `metric_mappings` with human approval.
- UTM templates: Use `utm_templates` with allowed variables.
- Firearms: Only `requires_firearm` + `firearm_type_id` is allowed.

## Notes
- This SKILL is a contract marker for internal configuration and agent work.
