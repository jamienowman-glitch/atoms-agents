# DEEP RECON ARCHITECTURE: VERSION 2.1
# The Hierarchy of Power (Dynamic Config)

## 1. The Core Hierarchy

### Level 1: The Tenant (The Wallet)
*   **Role**: The User Identity.
*   **Data**: Snax Balance.
*   **Function**: Can own multiple Spaces.

### Level 2: The Space (The Context Container)
*   **Definition**: A silo of shared **NEXUS** (Vector Space) memory, data, and configuration.
*   **Dynamic Isolation**: Spaces are isolated. Data (Nexus/Feeds) **NEVER** leaks between Spaces.
*   **Examples**: "Space A" (Business), "Space B" (Personal).
*   **Shared Assets**:
    *   **The Nexus**: Vector DB of all raw media (images, videos) and memories.
    *   **The Feeds**: All data streams (RSS, API, Webhooks).
    *   **The Config**: Shared Budget, Brand Voice, User Notes.

### Level 3: The Surface (The Domain & Branding)
*   **Role**: The distinct URL, Brand Identity, and Demographic Interface.
*   **Function**: Clusters demographics (e.g. `agnx` for Marketers, `cubed3` for Gamers).
*   **Dynamic Mapping**: A Surface is mapped to **ONE** Space at a time via configuration (`space_surface_mappings`).
*   **Contents**:
    *   **Flows**: Agent Graphs (e.g. "Post to Instagram").
    *   **Canvases**: UI Builders (e.g. 3D Store Builder).
    *   **Projects**: Scoped Work Units.

### Level 4: The Commercial Units
*   **AgentFlow**: The Unit of Work. Costs Snax per **RUN**.
*   **FlowStack**: The Unit of Value. A chain of Flows (Marketplace Asset).
*   **Firm**: The Unit of Scale. The subscription tier (Solo vs Firm).

## 2. The Data Contract

### Feed Contract (Space-Level)
*   Feeds live in the **SPACE**.
*   Surfaces read from their mapped Space.
*   **God Mode**: Automatically creates "Self-Feed" (YouTube) and "Niche Feeds" upon Space creation.

### Co-Founder View (Active BI)
*   Scope: **Space-Level**.
*   Function: Aggregates data from all Surfaces mapped to the Space (Marketing + Finance) to give holistic advice.

## 3. The Code Laws
1.  **Do Not Hardcode Mappings**: Use `space_surface_mappings` table.
2.  **Respect The Boundary**: Nexus/Feed queries must ALWAYS filter by `space_key` AND `tenant_id`.
3.  **Naming Consistency**: Use `Tenant`, `Space`, `Surface`, `AgentFlow`, `Run`.
