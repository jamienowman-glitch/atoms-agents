# Marketplace Payout Engine Plan (The "Agent-Gains" Pivot)

> **Goal**: Transition from "Seller of Code" to "Marketplace Orchestrator". We sell Snax to Users; Users spend Snax on Developer Tools; We pay Developers their cut in Crypto.

## 1. The Financial Model (Flow of Money)

1.  **Inflow (Fiat/Crypto)**: User buys 1,000 Snax for £10. (Held in `snax_wallets`).
2.  **Usage (The Ledger)**: User runs `developer_x/super_muscle`. Cost: 10 Snax.
3.  **The Split (New Logic)**:
    *   **Platform Fee**: 30% (Configurable).
    *   **Developer Share**: 70%.
4.  **The Record**:
    *   User Wallet: `-10 Snax`.
    *   Developer Ledger: `+7 Snax (Pending Payout)`.
    *   Platform Ledger: `+3 Snax (Revenue)`.
5.  **Outflow (Settlement)**:
    *   Weekly Job: "Pay Developer X".
    *   Convert 7 Snax -> ETH/USDC (at current rate).
    *   Send to Developer's Crypto Wallet.

---

## 2. Architecture & Schema

### A. New Schema (`atoms-core/sql/060_marketplace_payouts.sql`)
1.  **`marketplace_contracts`**:
    *   `developer_id` (Tenant UUID).
    *   `platform_fee_percent` (Default 30, but overrideable per dev).
    *   `payout_wallet_address` (SOL/ETH address).
    *   `payout_chain` (solana | ethereum).
2.  **`developer_balance`**:
    *   `developer_id` (PK).
    *   `pending_snax` (Snax earned but not paid).
    *   `paid_snax_lifetime` (Total stats).
3.  **`payout_history`**:
    *   `payout_id`, `developer_id`, `snax_amount`, `crypto_amount`, `tx_hash`, `status`.

### B. Logic Updates (`snax_charge` RPC)
*   **Current**: Deducts from User, logs to ledger.
*   **New**:
    *   Lookup `tool_owner_id` (Developer).
    *   If `tool_owner_id == system`, keep 100%.
    *   If `tool_owner_id != system`:
        *   Calculate Split.
        *   `UPDATE developer_balance SET pending_snax += dev_share`.
    *   *Note: This keeps the critical hot-path fast.*

---

## 3. Configuration (The "God Config")
> User Requirement: "Stay like 43 page" (Flat, visible).

**Location**: `atoms-app/src/app/_flat_config/marketplace_god_config.tsx`

**UI Sections**:
1.  **Global Marketplace Settings**:
    *   `default_platform_fee` (Slider: 0-100%).
    *   `payout_currency` (ETH/SOL/USDC).
2.  **Developer Agreements (Overrides)**:
    *   List of Top Developers.
    *   Override Fee (e.g., "Whale Developer gets 90% split").
3.  **Payout Engine State**:
    *   "Pending Payouts": Total Snax owed to devs.
    *   "Est. Liquidity Needed": How much ETH we need in the hot wallet to pay everyone.

---

## 4. The Roadmap (Phasing)

### Phase 1: The Ledger Split (Accounting)
*   **Goal**: "Stop the bleeding." Start tracking who earns what *now*, even if we can't pay them yet.
*   **Action**: Apply Schema `060`. Update `snax_charge`.
*   **Result**: We know exactly how much we owe Developer X.

### Phase 2: The Trust Layer (The Merkle Man)
*   **Goal**: "Prove the count."
*   **Action**: Implement `future_merkle_man_plan.md`.
*   **Result**: Developers see "Verified" next to their earnings. This prevents churn.

### Phase 3: The Payout Pipeline (Crypto) (Settlement)
*   **Goal**: "Show me the money."
*   **Action**: Create `muscle_payout_sender`.
*   **Logic**:
    1.  Admin clicks "Process Payouts" in God Config.
    2.  System batches transactions via Helius/Coinbase API.
    3.  `developer_balance` is debited. `payout_history` is written.

---

## 5. Summary for "The Boss"
*   **We don't need to rebuild everything.** We just add a "Split" logic to the existing Snax transaction.
*   **We pay in Crypto.** This avoids 90% of international banking headaches (SWIFT, IBANs, etc.).
*   **We sell Trust.** The Merkle Man (Phase 2) makes us the *only* transparent AI marketplace.
