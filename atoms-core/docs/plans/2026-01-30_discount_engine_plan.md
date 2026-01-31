# Tech Spec: Discount Engine (Production Ready)

**Status**: PROPOSED
**Architect**: Antigravity (on behalf of User)

## 1. Executive Summary
We are building a production-grade Discount Engine that enforces **Tenant-Scoped Budgets** and **Surface-Level Governance**.
It moves beyond simple "coupon codes" to a "Policy First" model where every discount is checked against a KPI ceiling (e.g., "Don't discount if MER < 2.0").

## 2. Architecture Laws

### A. The Tenant/Surface Law
*   **Tenants** own the money (Budget).
*   **Surfaces** owned the strategy (Policy).
*   **Discounts** are issued by mapped connectors (Shopify/Wix) but **governed** by `atoms-core`.

### B. The KPI Ceiling Law
*   Before any discount is redeemed, we check the **Core KPI Snapshot**.
*   If `current_kpi_value` (e.g. Profit) < `policy_kpi_floor`, the discount is **REJECTED**, even if the code is valid.
*   *Note*: This requires the "Connector Factory" to be feeding us live data.

### C. The Connector Injection Law
*   When an Agent (e.g. `Shopify Connector`) wants to issue a code, it **MUST** call `atoms-core.create_discount_code(type='connector', provider='shopify')`.
*   The system generates the code, logs the issuer, and returns it to the Agent to push to Shopify.

## 3. Database Schema (New `023_discount_engine.sql`)

We will introduce 4 core tables:
1.  `discount_policy`: The rules (Min/Max %, KPI Floors).
2.  `discount_codes`: The actual codes (UUID + Human Friendly string).
3.  `discount_redemptions`: The immutable ledger of usage.
4.  `discount_kpi_snapshots`: The cache of "Last Known Truth" for governance.

## 4. Atomic Task Plan

### Phase 1: Database Layer (Worker A)
**Goal**: Enforce the laws in Postgres.
*   [ ] **Patch**: Create `atoms-core/sql/023_discount_engine.sql`.
*   [ ] **Migrate**: Run migration (using `migrate_templates.py` pattern or manual).
*   [ ] **RLS**: Enable Row Level Security (Tenants can only see their own codes).

### Phase 2: Service Layer (Worker A)
**Goal**: The Brain of the operation.
*   [ ] **RPC**: `create_discount_code(policy_check=True)`.
*   [ ] **RPC**: `validate_discount_code(kpi_check=True)`.
*   [ ] **RPC**: `redeem_discount_code`.

### Phase 3: God Config UI (Worker B)
**Goal**: The Control Room.
*   [ ] **Route**: `src/app/god/config/pricing/discounts/page.tsx`.
*   [ ] **UI**: "Policy Editor" (Sliders for Min/Max %).
*   [ ] **UI**: "KPI Governor" (Select KPI -> Set Floor).
*   [ ] **UI**: "Headroom Monitor" (Red/Green indicator of budget).

### Phase 4: Connector Integration (Worker C - Agent)
**Goal**: Teach the Connectors.
*   [ ] **Skill**: Update `atoms-connectors/.agent/skills/build-connector` to include "Discount Injection".
*   [ ] **Standard**: "If platform supports coupons, import `atoms_core.discounts` and sync."

## 5. Verification
*   **Policy Test**: Try to create a 90% off code when Policy Max is 20%. (Must Fail).
*   **KPI Test**: Manually set `profit` to 0. Try to redeem code. (Must Fail).
*   **Isolation Test**: Tenant A cannot see Tenant B's codes.
