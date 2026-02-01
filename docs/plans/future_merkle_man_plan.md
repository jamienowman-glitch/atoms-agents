# Future Plan: "The Merkle Man" (Blockchain Trust Anchor)

> **STATUS**: 🧊 **ON ICE** (Roadmap Item). Do not implement until Post-PMF (Day 100).
> **MARKETING NAME**: "The Merkle Man" 🕵️‍♂️

## Goal
Establish "Proof of Solvency" and "Immutable History" for the Snax Economy without issuing a volatile public token. We will use the Blockchain as a **Truth Anchor** service.

## The Strategy: "The Merkle Man"
Instead of processing every transaction on-chain (slow/expensive), "The Merkle Man" (our automated auditor) aggregates `snax_ledger` entries into a cryptographic fingerprint (Merkle Root) and publishes that fingerprint to a public blockchain (Solana/Ethereum) periodically.

## Architecture

### 1. The Aggregator (Core)
*   **Source**: `public.snax_ledger` (Postgres).
*   **Logic**:
    1.  Select all transactions for the period (e.g., last 24 hours).
    2.  Hash each transaction: `Hash(wallet_id + amount + timestamp + reason)`.
    3.  Build a **Merkle Tree** from these hashes.
    4.  Store the **Merkle Root** and the **Proof** in a local `audit_log` table.

### 2. The Anchor (Muscle)
*   **Action**: Publish the `Merkle Root` + `Timestamp` + `Period ID` to a smart contract or simple memo transaction on Solana.
*   **Cost**: Negligible (pennies/day).
*   **Result**: We get a `Transaction Hash` from Solana. This is the "Seal of Truth".

### 3. The Explorer (UI)
*   **User View**: A "Verified" badge on their Snax Balance.
*   **Audit View**: Users can click to see:
    *   "The Merkle Man verified your balance in Batch #502."
    *   "Batch #502 was Anchored to Solana Block #12345."
    *   Link to Solana Explorer showing the Anchor.

## Atomic Task List (When Activated)

### Phase 1: Core Logic
- [ ] **SQL**: Create `snax_audit_batches` table (batch_id, start_time, end_time, merkle_root, chain_tx_hash).
- [ ] **Python**: Implement `atoms-core/src/crypto/merkle.py` (Tree generation).

### Phase 2: The Muscle
- [ ] **Muscle**: Create `atoms-muscle/src/audit/merkle_man/mcp.py`.
- [ ] **Integration**: Use Helius/Solanapy to send the "Anchor Transaction".

### Phase 3: The UI
- [ ] **UI**: Add "Merkle Man Audit" link to Pricing Dashboard.
- [ ] **UI**: "Proof of Reserves" visualizer.
