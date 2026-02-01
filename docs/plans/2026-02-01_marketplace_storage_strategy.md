# Marketplace Storage Strategy (The Vaults)

> **Date**: 2026-02-01
> **Objective**: Define where data lives in the Marketplace (Code, Media, Money).

## 1. The Decision Matrix

| Data Type | Storage Location | Strategy | Why? |
| :--- | :--- | :--- | :--- |
| **Muscle Code** | **GitHub + Docker Hub** | Decentralized Execution | We cannot execute raw 3rd party Python. We run Containers. |
| **Heavy Media** | **S3 (AWS)** | `media_v2` (Tenant Scoped) | Cheapest, infinite scale. Users own their data. |
| **The Ledger** | **Postgres (Hot) + Solana (Cold)** | "The Merkle Man" | Speed for UI; Truth for Payouts. |
| **AEO Metadata** | **Supabase (`public.muscles`)** | AEO Keywords + Pitch | Structured search and "App Store" display. |

---

## 2. Heavy Media (S3) Decision

**The Requirement**: "Heavy media should be on S3."

*   **Skill**: `atoms-muscle/src/atoms_muscle/media/media_v2/SKILL.md`.
*   **Path Law**: `s3://{bucket}/tenants/{tenant_id}/{env}/media_v2/{asset_id}/{filename}`.
*   **Tenant Scoping**: CRITICAL. Tenant A must never be able to guess the URL of Tenant B.
*   **Legacy Cleanup**: The skill currently mentions `Firestore`. We are **MIGRATING TO SUPABASE**.
    *   *Action*: Update `media_v2` to write to `public.media_assets` (Postgres).

## 3. The 3rd Party Muscle Strategy (Where do they upload?)

**Question**: "When a developer uploads their tool, where does it go?"

**Answer**: They do NOT upload Python files to us.
1.  **The Source**: They push to a **Private Git Repo** (we gain read access).
2.  **The Build**: We (GitHub Actions) build a **Docker Image**.
3.  **The Artifact**: Stored in our **Private Docker Registry** (ECR/GHCR).
4.  **The Execution**: We pull the Container to run on GPU.

**Why?**
*   **Security**: We never run raw `eval()` on user code.
*   **Deps**: They need different CUDA versions. Containers solve this.

## 4. The Ledger (Blockchain)
**Question**: "Where does the ledger blockchain get stored?"

**Answer**:
1.  **Hot Ledger (Postgres)**: `public.snax_ledger`. Stores every micro-transaction (0.1 Snax).
2.  **Merkle Root (Solana)**: Once per day, we hash the Postgres ledger and write the **Root Hash** to a Solana Device.
    *   *Cost*: Tiny (<$0.001 per day).
    *   *Proof*: "Here is the hash of today's payments. It matches the database."

## 5. Required Actions (API Keys)

To make this reality, The Boss (User) needs to provide:
1.  **AWS S3 Credentials**: For `media_v2`.
    *   `AWS_ACCESS_KEY_ID`
    *   `AWS_SECRET_ACCESS_KEY`
    *   `AWS_REGION`
    *   `AWS_BUCKET_NAME`
2.  **Solana Wallet (Mainnet)**: For "The Merkle Man" anchor.
    *   `SOLANA_RPC_URL` (Alchemy/Helius)
    *   `SOLANA_PRIVATE_KEY` (The "Writer" Wallet)

These keys must be added to the **Vault** (`atoms-core/src/config/vault.py`), NOT `.env`.
