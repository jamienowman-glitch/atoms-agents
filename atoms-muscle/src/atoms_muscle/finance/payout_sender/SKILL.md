---
name: payout-sender
description: Financial Settlement Engine. Reads pending Snax balances and executes Crypto transactions.
metadata:
  short-description: Pay Developers in Crypto
  version: 1.0.0
---

# 💸 Payout Sender

Use this skill to "Show me the money" and settle developer accounts.

## Capability
1.  **Read**: Scans `developer_balance` for pending Snax.
2.  **Convert**: Calculates Fiat/Crypto value (currently mock fixed rate).
3.  **Send**: Executes Solana Transfers via `solders`.
4.  **Record**: Updates `payout_history` and debits the ledger.

## Usage

### 1. Run Settlements (Manual / Cron)
```bash
python3 src/atoms_muscle/finance/payout_sender/sender.py
```

### 2. Output
*   **Database**: Updates `developer_balance` (decrements pending).
*   **History**: Inserts into `payout_history`.
*   **Blockchain**: Writes transfer transaction to Solana.

## Dependencies
*   `solana` (Python SDK)
*   `solders`
*   **Vault Keys**: `SOLANA_PRIVATE_KEY`
*   **Schema**: `060_marketplace_payouts.sql`
