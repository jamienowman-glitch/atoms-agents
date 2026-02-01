# Marketplace Pivot ("Agent-Gains"): Master Execution Plan v2.0 (Worker Ready)

> **Date**: 2026-02-01
> **Objective**: Pivot Atoms-Fam from a Direct-To-Consumer shop into a **Developer Marketplace**. We facilitate the sale of 3rd Party Muscles, taking a platform fee, and paying out in Crypto.

## 1. The Strategy Contracts (Read First)
**Agents MUST read these before executing work.**

### A. The Payout Engine (How Money Moves)
*   **Plan**: `docs/plans/2026-02-01_marketplace_payout_engine_plan.md`
*   **Core Logic**: Split every Snax transaction. Store Developer Balance. Payout weekly.

### B. The Economic Model (How Prices Work)
*   **Plan**: `docs/plans/2026-02-01_marketplace_economic_model.md`
*   **Core Logic**: **"Dynamic Floor"**. We fix the Snax Peg (10:1). We float the "Wholesale Floor".
*   **Discount Logic**: Platform pays for promotions (Marketing Spend); Developer gets full face value.

### C. The Trust Anchor (The Merkle Man)
*   **Plan**: `docs/plans/future_merkle_man_plan.md`
*   **Core Logic**: Daily Merkle Roots of the payout ledger published to Solana.

---

## 2. Infrastructure Roadmap (Production)

### Phase 0: The Vault Injection (Keys)
**Goal**: Provide the credentials for S3 and Solana.
*   **Location**: `/Users/jaynowman/northstar-keys/` (The Vault).
*   **Required Files**:
    1.  `AWS_ACCESS_KEY_ID`: Your AWS Key ID.
    2.  `AWS_SECRET_ACCESS_KEY`: Your AWS Secret.
    3.  `AWS_BUCKET_NAME`: Name of the S3 bucket (e.g. `atoms-media-v2`).
    4.  `SOLANA_PRIVATE_KEY`: Your Solana Writer Wallet Private Key (Base58 string).
    *   *Genesis Tip*: If you don't have one, run `solana-keygen new --no-outfile` and copy the private key string.

### Phase 1: The Ledger Split (Accounting)
**Goal**: Start tracking "Who owns what Snax" immediately.
1.  **Schema**: Apply `atoms-core/sql/060_marketplace_payouts.sql`.
2.  **RPC**: Update `snax_charge` to perform the `Platform Fee / Developer Share` split.
3.  **App**: Update `atoms-app` to display "Developer Balance" in the Dashboard.

### Phase 2: The Logic Integration (Pricing & Discounts)
**Goal**: Connect the Pricing Engine to the Discount Engine.
1.  **Discount Integration**: Ensure `mnb_discount_engine` (Postgres) is aware of the new `wholesale_floor`.
    *   *Rule*: You cannot discount below the Floor Price + 1% Margin.
2.  **Muscle Packaging**: Update `atoms-muscle/.agent/skills/create-muscle/SKILL.md`:
    *   Add `pricing.markup_snax` to the `SKILL.md` template.
    *   Add `pricing.wholesale_floor_snax` (Read-only) to the metadata.

### Phase 3: The God Config (Human-Readable)
**Goal**: A Production-Ready Config Screen for The Boss.
1.  **UI**: `_flat_config/marketplace_god_config.tsx`.
    *   **NO NESTING**: Flat list of sliders/toggles.
2.  **Documentation Mandate (`humans.md`)**:
    *   **Requirement**: Every config page (Pricing, Payouts, Marketplace) MUST have a link to a `humans.md` file.
    *   **Content**: Plain English explanation of how the system works (e.g., "This slider changes the Platform Fee. If you set it to 30%, we keep 3 Snax of every 10 Snax spent.").
    *   **Location**: `atoms-app/src/app/_flat_config/marketplace_god_config/humans.md`.

---

## 3. Agent Mandates (Worker Instructions)

### A. The "Clean Up" Mandate
We must remove the old "Central Bank" logic to prevent conflict.
1.  **DELETE**: Logic that auto-updates `system_config.snax_exchange_rate`. (The number is now constant).
2.  **FREEZE**: `snax_exchange_rate` is LOCKED at `10`.
3.  **REPLACE**: The "Efficiency Oracle" now targets `pricing.wholesale_floor_snax`, NOT `system_config.snax_exchange_rate`.

### B. The "Packaging" Mandate
When packaging a muscle (User or Ours):
1.  **Check Skill**: Does `SKILL.md` have `pricing` metadata?
2.  **Check Registry**: Does `public.muscles` have `markup_snax` set?
3.  **Sync**: Run `python3 atoms-muscle/scripts/sync_muscles.py` to push pricing to Supabase.

### C. The "Discount" Mandate
1.  **Check Coupons**: When a user applies a code, calculate the `net_value`.
2.  **Check Floor**: `net_value` MUST probably be `>= wholesale_floor` (unless we are burning Marketing Budget).
3.  **Log It**: Record the "Marketing Spend" (Difference between Face Value and Paid Value) in `public.snax_ledger`.
