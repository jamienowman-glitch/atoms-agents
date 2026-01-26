# Nexus Architecture: Domains of Life

**Status:** PROPOSAL
**Date:** 2026-01-26
**Problem:** Need Tenant isolation (Security) + Domain isolation (Don't mix Health/Finance) + Surface sharing (Sleep app needs Gym data).

## 1. The Hierarchy

We solve this by introducing **Domains** (Clusters) between Tenants and Surfaces.

```mermaid
graph TD
    User((User / Tenant)) --> Health[Health Domain]
    User --> Business[Business Domain]
    User --> Finance[Finance Domain]

    Health --> VO2[Surface: VO2 (Training)]
    Health --> B2[Surface: B2 (Diet)]
    Health --> Sleep[Surface: Sleep Engine]

    Business --> AGNx[Surface: AGNˣ (Marketing)]
    Business --> AfterTime[Surface: AfterTime (Video)]
    Business --> Shopify[Connector: Shopify]
    
    Finance --> P2[Surface: P2 (Crypto/Stonks)]
    Finance --> Tax[Surface: Tax Engine]
```

## 2. Data Access Rules

### A. The "Domain Nexus" (Shared Context)
Data is stored at the **Domain Level** by default.
*   **Example**: When `VO2` (Training) records a "Heavy Leg Day", it writes to the `Health` Nexus.
*   **Result**: The `Sleep` surface (also in `Health`) *automatically* sees this vector. It knows you did heavy legs, so it adjusts your wake-up alarm.
*   **Isolation**: The `AGNˣ` (Business) surface *cannot* see this. Your marketing bot doesn't know about your leg day.

### B. The "Surface Nexus" (Private Context)
Some data is purely app-specific (e.g. UI state, draft configs).
*   Stored at `Surface` Level.
*   Only that specific surface sees it.

### C. "Many Worlds" (The Cross-Over)
If you specifically want a Dashboard that sees *everything* (The "God View"), you mount **Multiple Domains**.
*   **Many Worlds Surface**: Mounts `[Health, Business, Finance]`.
*   It fuses the vectors from all three to give you the "Whole Life" view.

---

## 3. Storage Structure (LanceDB on S3)

The file paths in S3 (`s3://northstar-vectors-dev/`) will reflect this:

1.  **Health Domain**:
    `s3://.../{tenant_id}/domains/health/vectors.lance`
    *   (Accessible by: VO2, B2, Sleep)

2.  **Business Domain**:
    `s3://.../{tenant_id}/domains/business/vectors.lance`
    *   (Accessible by: AGNˣ, AfterTime)

3.  **Global/Shared**:
    `s3://.../{tenant_id}/global/vectors.lance`
    *   (Identity, Billing, Credits)

---

## 4. The "Single Credit" Model

*   **Identities Table**: One user row.
*   **Wallets Table**: One "Credit Balance" per user.
*   **Usage**:
    *   Running a model in `VO2` burns credits from the main wallet.
    *   Running a rental in `AGNˣ` burns credits from the main wallet.
*   **Benefit**: You sell **"Northstar Credits"**, not "Health App Subscription".

## 5. Summary

*   **Sign-up**: Once.
*   **Bill**: Once.
*   **Data**: Grouped by **"Areas of Life"** (Health, Business).
*   **Surfaces**: Are just "Apps" that work within an Area.
