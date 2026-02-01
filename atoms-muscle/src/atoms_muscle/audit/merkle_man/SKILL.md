---
name: merkle-man
description: The Trust Anchor. Generates Merkle Trees from the Snax Ledger and publishes the Root to Solana.
metadata:
  short-description: Audit Snax Ledger
  version: 1.0.0
---

# 🕵️‍♂️ The Merkle Man

Use this skill to "Prove the count" and establish trust in the Snax Economy.

## Capability
1.  **Read**: Scans `public.snax_ledger` for new transactions.
2.  **Hash**: Generates a SHA256 Merkle Tree.
3.  **Anchor**: Publishes the Root Hash to Solana Mainnet.

## Usage

### 1. Run Audit (Manual)
```bash
python3 src/atoms_muscle/audit/merkle_man/run_audit.py
```

### 2. Output
*   **Database**: Writes to `public.snax_merkle_roots`.
*   **Blockchain**: Writes transaction to Solana.

## Dependencies
*   `solana` (Python SDK)
*   `solders`
*   **Vault Keys**: `SOLANA_PRIVATE_KEY`

## Verification
Check the `snax_merkle_roots` table.
*   `status`: 'anchored'
*   `tx_signature`: [The Solana Tx Hash]
