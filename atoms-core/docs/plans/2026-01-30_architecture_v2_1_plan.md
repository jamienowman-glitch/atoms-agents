# Tech Spec: Deep Recon Architecture v2.1 ("The Nervous System")

**Status**: PROPOSED
**Architect**: Antigravity (on behalf of User)

## 1. Executive Vision
We are upgrading the "Data Nervous System" to support the **Hierarchy of Power v2.1**.
This moves us from "Hardcoded Columns" to "Dynamic Configuration" for the Tenant -> Space -> Surface relationship.
It also introduces the **Feed Contract** (Space-level sharing) and the **Co-Founder View**.

## 2. Architecture Laws

### A. The Hierarchy (Power Structure)
1.  **Tenant** (Wallet): The Billing Entity. Owns Snax.
2.  **Space** (Context): The Data Boundary (Nexus + Feeds).
    *   *Law*: Data NEVER leaks between Spaces.
3.  **Surface** (Domain): The BrandWrapper (Flows + Canvases).
    *   *Law*: A Surface is mapped to ONE Space at a time, but this mapping is **Dynamic**.
    *   *Config*: We need a `space_surface_mappings` config, not just a column on the surface table.

### B. The Feed Contract
*   **Feeds live in the Space**.
*   If Surface A creates a Feed (e.g. "Competitor Watchlist"), Surface B can see it IF they share the Space.
*   **God Mode**: System automatically injects "Self-Feeds" (YouTube Channel) and "Niche Feeds" upon Space creation.

### C. The Commercial Hierarchy
*   **AgentFlow**: Unit of Work (Costs Snax).
*   **FlowStack**: Unit of Value (Marketplace Asset).
*   **Firm**: Unit of Scale (Subscription Level - Solo vs Firm).

## 3. Database Schema Updates (`030_architecture_v2_1.sql`)

### 1. Dynamic Mapping Table
We need to decouple `surfaces.space_key`.
```sql
create table space_surface_mappings (
    mapping_id uuid primary key,
    tenant_id uuid, -- Configuration Scope
    space_key text references spaces(key),
    surface_key text references surfaces(key),
    active boolean default true,
    unique(tenant_id, surface_key) -- A Surface maps to ONE Space per Tenant context
);
```

### 2. The Feed Registry
```sql
create table space_feeds (
    feed_id uuid primary key,
    space_key text not null, -- The Data Boundary
    tenant_id uuid not null,
    type text check (type in ('rss', 'api', 'webhook', 'system')),
    config jsonb, -- URL, Auth, etc.
    is_system_injected boolean default false
);
```

### 3. The Co-Founder Aggregate
A View or RPC that joins `space_feeds` + `nexus_memories` for a given Space to populate the "Bento Grid".

## 4. Atomic Task Plan

### Phase 1: Schema Reconstruction (Worker A - The Architect)
**Goal**: Implement v2.1 Hierarchy.
*   [ ] **Patch**: `atoms-core/sql/030_architecture_v2_1.sql` (Mappings + Feeds).
*   [ ] **Migration**: Move existing `surfaces.space_key` data into the new mapping table.

### Phase 2: Feed Logic (Worker A)
**Goal**: Build the Storage & Injection.
*   [ ] **RPC**: `create_space_feed(space_key, ...)`
*   [ ] **Trigger**: On `tenant_created`, trigger `inject_default_feeds`.

### Phase 3: Commercial Hook (Worker B)
**Goal**: Update `012_complete_registry.sql` to support FlowStacks.
*   [ ] **Table**: `flow_stacks` (marketable collections of AgentFlows).
*   [ ] **Pricing**: Add `unlock_fee_snax` to the schema.

## 5. Verification
*   **Isolation Test**: Create Feed A in Space X. Ensure Space Y (same Tenant) CANNOT see it.
*   **Sharing Test**: Map Surface 1 and Surface 2 to Space X. Ensure BOTH can see Feed A.
