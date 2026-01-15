# Phase 01: Schemas

## 1. ConnectorTemplate
Immutable definition of a connector's capabilities.

```yaml
type: object
required:
  - id
  - version
  - provider
  - auth_scheme
  - operations
properties:
  id:
    type: string
    pattern: "^[a-z0-9_-]+$"
    description: "Unique slug for the connector family (e.g. 'shopify')"
  version:
    type: string
    pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"
    description: "Semantic version of this template"
  provider:
    type: string
    description: "Display name of the provider"
  auth_scheme:
    type: object
    required:
      - type
      - fields
    properties:
      type:
        type: string
        enum: ["oauth2", "api_key", "basic", "none"]
      fields:
        type: array
        items:
          type: object
          required: ["key", "label", "secret"]
          properties:
            key: { type: string }
            label: { type: string }
            secret: { type: boolean, description: "If true, must be stored in GSM" }
  operations:
    type: object
    additionalProperties:
      type: object
      required:
        - description
        - inputs
        - outputs
        - strategy_lock_action
      properties:
        description: { type: string }
        inputs: { type: object, description: "JSON Schema for inputs" }
        outputs: { type: object, description: "JSON Schema for outputs" }
        strategy_lock_action: 
          type: string
          description: "Action ID to check against Strategy Lock"
        firearms_action:
          type: string
          description: "If present, requires Firearms licence check"
        dataset_event:
          type: object
          required: ["enabled"]
          properties:
            enabled: { type: boolean }
            train_ok: { type: boolean }
        usage_event:
          type: object
          required: ["tool_type"]
          properties:
            tool_type: { type: string }
            default_cost: { type: string }
```

## 2. ConnectorInstance
Runtime instantiation of a template for a specific tenant/env.

```yaml
type: object
required:
  - id
  - tenant_id
  - env
  - template_ref
  - config
  - enabled
properties:
  id:
    type: string
    description: "UUID"
  tenant_id:
    type: string
    pattern: "^t_[a-z0-9_-]+$"
  env:
    type: string
    enum: ["dev", "staging", "prod"]
  template_ref:
    type: object
    required: ["id", "version"]
    properties:
      id: { type: string }
      version: { type: string }
  config:
    type: object
    properties:
      auth:
        type: object
        additionalProperties: 
          type: string
          pattern: "^secret::.+$"
          description: "MUST start with secret:: for secret fields"
      settings:
        type: object
        description: "Non-secret configuration values"
  enabled:
    type: boolean
    default: true
  status:
    type: string
    enum: ["active", "error", "degraded"]
```

## Validation Rules
1. **Secret Safety**: `ConnectorInstance` config validator must reject any value for a `secret: true` field that does not start with `secret::`.
2. **Strategy Alignment**: All operations must have a defined `strategy_lock_action`.
3. **Usage Accounting**: All operations must define `usage_event.tool_type`.
