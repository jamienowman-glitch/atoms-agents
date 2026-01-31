# Atomic Task Plan: Financial & Control Layer (Atoms Central Bank)

**Goal**: Implement the "Atoms Central Bank" using the Target-Based Pricing Model (Efficiency Oracle), Dual Payment Rails (Fiat + Crypto), and God Config Controls.

## 1. The Strategy: "The Law"
We are moving from Static Pricing to **Dynamic Target Pricing**.
*   **KPI**: Average Profit-After-Costs (KPI #2).
*   **Levers**: `snax_rate` (The Peg).
*   **Inputs**: `logging.server_costs`, `marketing.spend`.

## 2. Infrastructure (The Rails)

### A. Core Schema Updates (`atoms-core/sql/055_central_bank.sql`)
1.  **`public.exchange_rates`**:
    *   `pair` (text, PK): e.g., 'SOL-GBP', 'USDC-GBP'.
    *   `rate` (numeric): The live oracle rate.
    *   `updated_at`: Timestamptz.
2.  **`public.system_config` (Updates)**:
    *   `target_profit_margin` (float): e.g., 0.20.
    *   `snax_rate` (int): e.g., 100 (Snax per £1).
    *   `manual_override_active` (bool).
3.  **`public.snax_ledger` (Updates)**:
    *   Ensure `source` column supports `stripe`, `crypto_sol`, `crypto_usdc`.

### B. The Engines (Webhooks & Workers)
1.  **Crypto Rail (Guerrilla Stack)**:
    *   **Path**: `atoms-muscle/src/finance/crypto_listener/`.
    *   **Tech**: Helius Webhook -> Edge Function -> `snax_ledger.credit`.
    *   **Oracle**: CoinGecko poller updating `public.exchange_rates`.
2.  **Fiat Rail (Corporate Stack)**:
    *   **Path**: `atoms-muscle/src/finance/stripe_listener/`.
    *   **Tech**: Stripe Webhook -> `snax_ledger.credit`.
3.  **Efficiency Oracle (The Brain)**:
    *   **Path**: `atoms-core/src/billing/efficiency_oracle.py`.
    *   **Logic**:
        *   Calculate `RollingAverage(Cost)` over 7 days.
        *   Calculate `TargetRevenue = Cost * (1 + TargetMargin)`.
        *   Adjust `snax_rate` to meet Target.

## 3. The UI (God Controls)
*   **Path**: `atoms-ui/dashboard/finance/TreasuryDashboard.tsx`.
*   **Components**:
    *   **Target Slider**: Sets `system_config.target_profit_margin`.
    *   **Manual Override**: Toggle `manual_override_active`.
    *   **Live Viz**: Charts for `total_costs_index` vs `revenue`.

## 4. Atomic Tasks
- [ ] **SQL**: Create `055_central_bank.sql`.
- [ ] **Core**: Build `atoms-core/src/billing/efficiency_oracle.py`.
- [ ] **Muscle**: Build `atoms-muscle/src/finance/crypto_listener` (Helius).
- [ ] **UI**: Build `TreasuryDashboard.tsx`.
