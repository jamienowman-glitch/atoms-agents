# Marketplace Controller ("Agent-Gains")

> **For**: The Boss / Operations
> **Goal**: Manage the transition from "Shop" to "Marketplace".

## 1. What is this page?
This is the **Control Center** for our 3rd Party Developer Ecosystem.
Here you control how much money we make from other people's code.

## 2. The Levers (How it works)

### A. The Platform Fee (The Cut)
*   **What it does**: Sets the percentage of every transaction that **WE KEEP**.
*   **Default**: 30%.
*   **Example**: If a user spends 10 Snax on a tool:
    *   **We keep**: 3 Snax.
    *   **Developer gets**: 7 Snax (Pending Payout).

### B. The Payout Engine (Settlement)
*   **Status**: Shows how much crypto we owe developers.
*   **Action**: When you click "Process Payouts" (Coming Soon), we batch-send ETH/SOL to their wallets.

### C. Developer Contracts
*   **Overrides**: You can set special deals for top partners (e.g., "Whale Dev gets 90%").

## 3. The Rules
1.  **NO REFUNDS**: Once a user spends Snax, it is split instantly. We cannot "un-split" it easily.
2.  **CRYPTO ONLY**: We do not payout in Fiat. Developers must provide a Solana or Ethereum address.

## 4. The Customer Journey (for Developers)
> "How does a coder get paid?"

### Step 1: The Upload (The Drop)
*   **Human**: Developer pushes their code to a private Git repo we control.
*   **System**: We build it into a **Docker Container** (Safe Mode). We NEVER run their raw Python directly on our metal.
*   **Result**: Their tool becomes a "Muscle" in the Registry (e.g., `muscle_video_upscale`).

### Step 2: The Sale (The Usage)
*   **Human**: A User (Creative Director) clicks "Upscale Video" in the Atoms App.
*   **System**: The `snax_charge` logic fires.
    *   Price: 10 Snax.
    *   User pays: 10 Snax.
    *   **The Split**: 30% to Us (3 Snax), 70% to Dev (7 Snax).
*   **Result**: The Developer's "Pending Balance" goes up instantly.

### Step 3: The Truth (The Merkle Man)
*   **Human**: The Developer checks their dashboard. They see a "Verified by Solana" badge.
*   **System**: Every night, "The Merkle Man" (our audit bot) hashes all transactions and posts a proof to the Solana Blockchain.
*   **Result**: Mathematical proof we aren't cooking the books.

### Step 4: The Payout (The Bag)
*   **Human**: At the end of the week (or when they hit a threshold), we send the money.
*   **System**: The `payout_sender` muscle wakes up.
    *   It reads the `developer_balance`.
    *   It calculates the exchange rate (Snax -> SOL/USDC).
    *   It sends real Crypto Transaction on Solana Mainnet.
*   **Result**: Developer gets paid in seconds, worldwide. No SWIFT codes. No Banks.

## 5. STARTUP PROTOCOL (Turn It On)
> **WARNING**: This activates REAL MONEY execution.

1.  **Go to Infrastructure Config**: `/_flat_config/god_config_infrastructure` (or find "God Config > Infrastructure" in side nav).
2.  **Add Provider**: create a new provider entry.
    *   **Name**: `Marketplace Solana Wallet` (Must be exact).
    *   **Driver**: `solana`.
    *   **Key**: Paste your **Private Key** (BS58 string).
3.  **Result**: The system will secure it as `MARKETPLACE_SOLANA_WALLET.key` in the Vault.
4.  **Action**: Click "Process Payouts" on this Dashboard. It will now successfully load that key and sign transactions.
