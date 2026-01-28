---
title: MAYBES Note Service — Core/Data Atomic Task Plan
date: 2026-01-28
owner: core-agent
status: draft
scope: atoms-core + atoms-app (supabase migrations)
---

# Goal
Implement a DB‑first, tenant‑scoped MAYBES note service in `atoms-core`, with Supabase schema + APIs that support the MAYBES canvas.

# Non‑Negotiables (repo laws)
- **Only modify** `/Users/jaynowman/dev/atoms-core/**` and `/Users/jaynowman/dev/atoms-app/supabase/**`.
- **No .env**; use Vault (`/Users/jaynowman/northstar-keys/`) via `src/vault`.
- **Tenant compute first**: UI does interactive rendering; server is persistence + auth.
- **No northstar‑engines** changes (deprecated).

# Required Reads (before any edits)
1. `/Users/jaynowman/dev/AGENTS.md`
2. `/Users/jaynowman/dev/atoms-core/AGENTS.md`
3. `/Users/jaynowman/dev/docs/plans/2026-01-27_realtime-collab-contract-and-atomic-task-plan.md`

# Production Definition (non‑negotiable)
- DB is the **source of truth**; no file‑based registries.
- All data is tenant/scoped and RLS‑protected.
- No local fallbacks; no in‑memory only storage.

# Atomic Tasks

## A. Data Model & Migrations (Supabase)
1. Add a new migration in `atoms-app/supabase/migrations/` for MAYBES:
   - `public.maybes_notes` table:
     - `id` (uuid pk)
     - `tenant_id`, `user_id`, `space_id`, `surface_id`
     - `type` (`text` | `audio` | `image`)
     - `content_text`, `content_uri`, `content_meta` (jsonb)
     - `position` (jsonb: x/y), `zoom` (optional)
     - `is_archived` (bool), `created_at`, `updated_at`
2. Enable RLS and add tenant/user policies (read/write).
3. Add indexes for `tenant_id`, `user_id`, `space_id`, `updated_at`.

## B. Media Handling (Audio/Image)
1. Use existing atoms‑core presigned upload flow to S3.
2. Store resulting asset URI in `maybes_notes.content_uri`.
3. Add validation for allowed mime types and max size.

## C. Core API Endpoints (atoms-core)
1. Create CRUD endpoints:
   - `POST /maybes/notes`
   - `GET /maybes/notes` (filtered by tenant/user/space)
   - `PATCH /maybes/notes/{id}`
   - `DELETE /maybes/notes/{id}` (soft delete / archive)
2. Enforce `IdentityMiddleware` and tenant scoping.
3. Ensure payloads align with the canvas schema (type, content, position, timestamp).

## D. Forward‑to‑Harness Hook
1. Add endpoint or command handler for forwarding:
   - `POST /maybes/forward`
2. Validate payload:
   - `id`, `type`, `content`, `timestamp`, `origin`
3. Emit event to the **existing** Realtime gateway / transport layer (SSE downstream, WS upstream).
4. Do not add new SSE/WS routes; reuse the canonical gateway.

## E. Registry Integration
1. Register the MAYBES canvas and node types in the DB registry via canonical flow.
2. Ensure registry entries map to the MAYBES contract JSON used by the UI.

## F. Tests & Validation
1. Add unit tests for:
   - Tenant isolation (RLS)
   - CRUD happy path
   - Forward hook validation
2. Add a minimal integration test using Supabase local stack (if available).

# Done Definition
- `maybes_notes` table exists with RLS + indexes.
- atoms‑core CRUD endpoints are live and tenant‑scoped.
- Forward hook works and emits harness events.
- Registry entries exist for MAYBES canvas and nodes.
