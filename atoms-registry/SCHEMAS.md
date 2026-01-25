# REGISTRY SCHEMA DOCUMENTATION

This registry defines the **State Machine** of the platform. It tracks components through their lifecycle, from "Wishlist" to "Live".

## Lifecycle Statuses
- **planned**: Wishlist item. Agent should pick this up to build.
- **alpha**: Implementation exists but is experimental.
- **testing**: Under verification.
- **live**: Production ready, available in Console.
- **detected**: Found in legacy scan, status pending verification.
- **deprecated**: Scheduled for removal.

## 1. MUSCLE (`atoms-registry/muscle/`)
Heavy lifters (AI, Processing, Rendering).

```yaml
- id: unique_id
  name: "Human Readable Name"
  status: live | planned | detected
  quality_tier: 1080p | 4k | experimental
  path: "path/to/source" # Optional
  capabilities: [list, of, features]
  requirements: [dependencies]
```

## 2. CONNECTORS (`atoms-registry/connectors/`)
External Integrations (MCP).

```yaml
- id: connector_id
  name: "Service Name"
  status: alpha | live
  test_bed:
    feature_key: boolean # Verified?
  ready_for_billing: boolean
```

## 3. SURFACES (`atoms-registry/surfaces/`)
Top-level Applications / Consoles.

```yaml
id: surface_id
name: "App Name"
entry_point: "/route"
flows:
  - id: flow_id
    canvases:
      - canvas_id: ref_id
        tools: [list, of, ui, tools]
        muscle_link: [list, of, muscle_ids]
```

## 4. CANVASES (`atoms-registry/canvases/`)
Reusable UI Units (Editors, Graphs, Timelines).

```yaml
- id: canvas_id
  name: "Canvas Name"
  type: graph | timeline | form | editor
  status: live | planned
  default_tools: [list]
```
