# Infrastructure Options & Free Tier Analysis

**Status:** DRAFT PROPOSAL
**Date:** 2026-01-26
**Context:** Moving away from Vertex (Cost Kill Switch) to "Nexus Lite" and optimizing Free Tier usage across Supabase, Google Cloud, and AWS.

## 1. The Strategy: "Nexus Lite" & Aggressive Free Tiering

We are adopting a Hybrid Cloud approach to maximize free allowances.

### 🛑 BANNED: Vertex AI
*   **Reason**: High cost, pay-per-node/hour.
*   **Replacement**: **LanceDB** (Serverless/Embedded Vector DB).
*   **Storage**: Sits on standard object storage (Supabase Buckets, S3, or Local Disk).
*   **Cost**: $0 (Compute is local/Edge, Storage is cheap).

---

## 2. Resource Allocations (Options Map)

### A. Vector Embeddings (Memory)
| Provider | Technology | Free Tier Limit | Pros | Cons | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google** | Firestore (Vector) | N/A (High read costs) | Native to Google | Expensive at scale | ❌ Avoid for Vectors |
| **Supabase** | pgvector | 500MB DB Limit | Fast, SQL-integrated | Database size limit | ✅ **Start Here** |
| **Nexus Lite** | **LanceDB** | ∞ (Depends on Storage) | **ZERO COST**, limitless | Requires File Storage | 🚀 **Scale Here** |

**Proposal:** Use **LanceDB** backed by Supabase Storage (`/buckets/nexus`). This gives us professional vector search with zero running server costs.

### B. Hot Data (Logs, User State, Sessions)
| Provider | Technology | Free Tier Limit | Recommendation |
| :--- | :--- | :--- | :--- |
| **Google** | Firestore | 50k Reads/day, 20k Writes/day | ⚠️ **danger zone** for logs. Use for "Low Frequency, High Value" data only. |
| **Supabase** | PostgreSQL | 500MB total | ✅ **Primary Registry**. Best for relational data. |
| **Supabase** | Realtime | 2M messages/mo | ✅ **Live cursors/chat**. |

### C. Media Storage (Images, Videos, 3D Assets)
| Provider | Technology | Free Tier Limit | Cost after Free | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | Storage | 1 GB | $0.025/GB | ✅ **Incubator** (Start here) |
| **AWS** | S3 | 5 GB (12 mo) | Standard | ⚠️ Expires after 1 year |
| **Cloudflare** | R2 | 10 GB | $0/egress | 🚀 **Best Long Term** (Zero egress fees) |

---

## 3. The Allowance Registry (To Build)

We will create a `public.allowances` registry in Supabase to track our consumption against these limits.

### Schema Draft
```sql
CREATE TABLE public.infra_allowances (
    id UUID PRIMARY KEY,
    provider TEXT, -- 'supabase', 'google', 'resend'
    service TEXT, -- 'database', 'storage', 'emails'
    metric TEXT, -- 'mb_used', 'monthly_active_users', 'emails_sent'
    limit_amount BIGINT, -- e.g. 524288000 (500MB)
    current_usage BIGINT,
    reset_period TEXT -- 'monthly', 'never'
);
```

### Dashboard Visualization (`/dashboard/infra/cost`)
*   **Supabase DB**: [====--] 400/500 MB (Warning)
*   **Firestore Reads**: [=-----] 2k/50k (Safe)
*   **Resend Emails**: [===---] 1.5k/3k (Daily Limit)

---

## 4. Immediate Action Plan

1.  **Migration**: Ensure `northstar-engines` points `NexusVectorStore` to the new `LanceDB` implementation.
2.  **Storage**: Create `nexus` bucket in Supabase for LanceDB files.
3.  **Registry**: Deploy `infra_allowances` schema.
4.  **Visuals**: Build the Cost Dashboard to visualize these limits live.
