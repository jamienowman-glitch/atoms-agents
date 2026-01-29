# AGENTS.md — Atoms Agents (The Brain)

## Active Initiatives: MAYBES & HAZE
- **MAYBES**: Note-taking city canvas where ToolPill/ToolPop create nodes (text/audio/image). Nodes can be forwarded to Harness flows. Data stored in Supabase registry; media stored in S3 with URI refs; tenant-compute first.
- **HAZE**: Nexus Explorer planetary canvas (first-person on curved surface). Client device CPU/GPU for interactive render; server render only for export/offline. Uses HAZE muscles (surface renderer, runner, preview, optional contours) and registers via Supabase.


> **The Northstar**: "We are creating Shopify, Klaviyo, Photoshop, CapCut... all run by Agents and Humans on collaborative Canvases."

## 🛑 THE ATOMIC MANDATE
1.  **Never Monolith**: Every concern must be its own "Atom" (Table, Component, Service, Site).
2.  **Registry First**: Agent definitions (Personas) live in the Registry.
3.  **Atomic Intelligence**: Agents are assembled from Cards (Persona + Model + Style), not hardcoded.

## 🏗️ CONTEXT
This repository holds the **Intelligence Logic**:
-   **Routing Cards**: Which model to use for what task.
-   **Prompt Templates**: The raw instructions.
## Tenant/Surface/Space Law
- Tenant is the billing unit. Snax wallets are tenant-scoped and spendable across all surfaces/spaces.
- Surface is the configuration layer for tenants. Data isolation is per-surface unless explicitly shared.
- Space is shared context across one or more surfaces; only surfaces explicitly mapped to a space share performance/nexus data.
- Do not hardcode surface names in schemas or code; treat surfaces/spaces as registry/config data.
