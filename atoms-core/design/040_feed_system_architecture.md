# 040 Feed System Architecture

## Overview
This document outlines the architecture for the Feed System, which serves as the sensory organs for Spaces. It covers the schema, ingestion engine, and automation logic ("God Mode").

## 1. Schema Design
(See `atoms-core/sql/040_feed_system.sql`)

## 2. The Ingestion Engine (Architecture)

### Components
1.  **The Poller**: A scheduled Edge Function (invoked via `pg_cron` or Supabase Scheduled Functions) that queries `feeds_config`.
    -   *Role*: Active Fetcher.
    -   *Logic*: Fetch new data, deduplicate against `external_id`, insert into `feed_items`.
2.  **The Catcher**: An exposed Webhook Endpoint (Edge Function) for passive listening.
    -   *Role*: Passive Listener.
    -   *Logic*: Verify origin signature, map payload to `feed_items` schema, insert.
3.  **The Vectorizer**: A Database Trigger that activates upon insertion into `feed_items`.
    -   *Role*: Semantic Processor.
    -   *Logic*: Asynchronously generate embeddings for `content_payload` and store in `nexus_memory`.

### Ingestion Loop Diagram

```mermaid
graph TD
    subgraph Sources
        RSS[RSS Feed]
        YT[YouTube Channel]
        Shop[Shopify Webhook]
        Cal[Calendar API]
    end

    subgraph Edge Functions
        Poller[The Poller (Cron)]
        Catcher[The Catcher (Webhook)]
    end

    subgraph Database
        Config[feeds_config]
        Items[feed_items]
        Memory[nexus_memory]
    end

    RSS --> Poller
    YT --> Poller
    Cal --> Poller
    Shop --> Catcher

    Poller -- Read Active Feeds --> Config
    Poller -- Fetch & Dedup --> Items
    Catcher -- Verify & Map --> Items

    Items -- Trigger (After Insert) --> Vectorizer[The Vectorizer]
    Vectorizer -- Generate Embedding --> Memory
```

### The Vectorizer & Nexus Memory
-   **Trigger**: `AFTER INSERT ON feed_items`
-   **Function**: `process_feed_item_embedding()`
-   **Storage Target**: `nexus_memory` (Semantic Layer)
-   **Data Flow**:
    1.  New row in `feed_items`.
    2.  Trigger fires `supabase_functions.http_request` (or internal `pg_vector` call).
    3.  Text content is extracted from `content_payload`.
    4.  Embedding is generated (e.g., OpenAI `text-embedding-3-small`).
    5.  Result stored in `nexus_memory` with reference to `feed_item_id`.

## 3. God Mode Automation (The Injection)

### "Self-Feed" Trigger
**Objective**: When a user links a data source (e.g., connects a YouTube account), automatically create a `feeds_config` entry.

**Implementation Plan**:
1.  **Trigger Source**: `public.connector_accounts` (or equivalent table tracking linked providers).
2.  **Event**: `AFTER INSERT`.
3.  **Action**: Execute function `auto_inject_provider_feed()`.
4.  **Logic**:
    -   Check `provider_slug` (e.g., 'youtube', 'shopify').
    -   If supported, extract configuration (Channel ID, Store URL) from the connected account metadata.
    -   Insert into `feeds_config`:
        -   `tenant_id`: owner of the account.
        -   `type`: Mapped type (e.g., `YOUTUBE_CHANNEL`).
        -   `source_url`: Constructed URL.
        -   `status`: `ACTIVE`.

### "Niche Discovery" Injection
**Objective**: Implement a master feed pattern where Tenants subscribe to shared feeds (e.g., "Health News") to avoid duplicate polling.

**Implementation Plan**:
1.  **Global Feeds Table**: A designated set of `feeds_config` rows with `tenant_id IS NULL` (Global).
2.  **Subscription Mechanism**:
    -   **Implicit**: If a Tenant has a Surface in Space 'Health', they automatically see Global Feeds for 'Health' via RLS (`tenant_id IS NULL`).
    -   **Explicit (Optional)**: A `feed_subscriptions` table if users want to "mute" global feeds.
3.  **Optimization**:
    -   The Poller only runs once for the Global Feed row.
    -   All Tenants in that Space benefit from the fresh `feed_items` immediately.

### Automation Workflows
1.  **Tenant Creation**:
    -   **Trigger**: New Tenant provisioned.
    -   **Action**: God Mode checks the Tenant's industry/niche.
    -   **Result**: Auto-injects specific Global Feeds (by creating references or relying on implicit Space access) and sets up default "System Injected" feeds (e.g., "Tenant Alerts").
