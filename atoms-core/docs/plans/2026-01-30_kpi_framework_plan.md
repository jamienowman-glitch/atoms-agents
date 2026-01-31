# Tech Spec: Surface KPI & Temperature Framework (Production Ready)

**Status**: PROPOSED
**Architect**: Antigravity (on behalf of User)

## 1. Executive Summary
We are tightening the "BI Classic" and "Agent Governance" layers to match the new **Surgical Merged Specification**.
The goal is to provide a "Locked Definition" for measuring business health (Profit, MER, Growth, Discount Rate, Returns, AOA) and to strictly enforce "Temperature" as the behavioral regulator for Agents.

## 2. Architecture Laws

### A. The Card is Truth
*   KPI Definitions are **Locked** in the Database (`core_kpis` table), but their *active set* and parameters are configured via **Surface Cards** (JSONB).
*   Code must **NEVER** hardcode "Profit = A - B". It must ask the Card/DB: "How do we measure Profit for this tenant?"

### B. The Contribution Law
*   Connectors (Shopify, Wix, etc.) must **declare** their contribution.
*   They don't just "dump data"; they say "I contribute to `gross_sales` (Exact) and `marketing_spend` (Estimate)".
*   The system uses these declarations to rollup the Core KPIs.

### C. Temperature as a Regulator
*   Temperature (0-100) is not just a dashboard metric; it is a **Signal**.
*   Agents read Temperature to decide **Cadence** (How often do I act?) and **Constraints** (Am I allowed to discount?).
*   Bands are **Locked**: Ice (0-40), Blue (40-55), Yellow (55-65), Green (65-75), Overheating (75-90), Red (90-100).

## 3. Database Schema Updates (`024_kpi_framework_update.sql`)

We need to patch `020_core_kpis.sql` and `014_temperature_config.sql`.

### Table: `core_kpis` (Update)
*   [x] `profit_after_costs`: Update definition to "Net Sales - Min Included Costs".
*   [x] `mer`: Update definition to "Net Sales / Total Marketing Spend".
*   [x] `growth`: Update definition to "YoY Change in Profit".
*   [x] `discount_rate`: Update definition to "Total Discounts / Gross Sales".
*   [x] `returns_rate`: Update definition to "Returned Units / Sold Units".
*   [NEW] `aoa`: Insert "Active Owned Audience" (90D Unique Engaged).

### Table: `temperature_bands` (New/Replace)
*   Replace generic config with the **Standard 6 Bands**:
    *   Ice, Blue, Yellow (Low), Green, Yellow (High), Red.
*   Store "Behavioral Intent" metadata for Agents to read.

### Table: `connector_contribution_kpis` (New)
*   Maps `provider_metric` -> `core_kpi`.
*   Includes `is_estimate` boolean.
*   Includes `missing_components` JSONB.

## 4. Atomic Task Plan

### Phase 1: Database Layer (Worker A)
**Goal**: Enforce the Locked Definitions.
*   [ ] **Patch**: Create `atoms-core/sql/024_kpi_framework_update.sql`.
*   [ ] **Data**: Insert/Update the 6 Core KPIs with exact Spec text.
*   [ ] **Data**: Insert the 6 Temperature Bands into a new registry table `temperature_bands_registry`.

### Phase 2: Contribution Logic (Worker A)
**Goal**: Enable Connectors to map data.
*   [ ] **Extend**: `connector_factory_patch.sql` to support declared contributions.
*   [ ] **RPC**: `register_connector_contribution(...)`.

### Phase 3: Agent Skill (Worker B)
**Goal**: Teach Agents to read the Temperature.
*   [ ] **Skill**: Create `atoms-connectors/.agent/skills/read-temperature/SKILL.md`.
*   [ ] **Prompt**: "If Temperature is Red (95), DO NOT optimize for Growth. Optimize for Stability."

## 5. Verification
*   **KPI Check**: Query `core_kpis` and verify `aoa` exists with correct description.
*   **Temperature Check**: Query `temperature_bands_registry` and verify 6 bands exist.
*   **Mapping Check**: Verify `shopify` can map `total_sales` to `gross_sales` with `is_estimate=false`.
