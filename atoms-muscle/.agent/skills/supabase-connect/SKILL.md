---
name: supabase-connect
description: Teaches an Agent how to connect to Supabase via the Vault and sync the muscle registry without manual secrets.
metadata:
  short-description: Vault-backed Supabase sync instructions
  version: 1.0.0
---

# Supabase Connection Skill

Follow this skill whenever you must run `scripts/sync_muscles.py` or otherwise touch Supabase from inside `atoms-muscle`. Do not proceed until **all** the checklist below is satisfied.

## 1. Read the upstream docs
- `atoms-core/AGENTS.md` (§1.1, §4.3, §§126‑140) explains Supabase as the registry and how the OS expects you to authenticate.
- `atoms-core/docs/PRODUCTION_CHECKLIST.md` describes the Supabase dashboard steps, secrets, and Vault expectations.

## 2. Load Vault secrets (no `.env`)
1.  The Vault lives at `/Users/jaynowman/northstar-keys/`.
2.  Read the Supabase URL and service key:
    ```bash
    cat /Users/jaynowman/northstar-keys/supabase-url.txt
    cat /Users/jaynowman/northstar-keys/supabase-service-key.txt
    ```
3.  Never hardcode these values or use `.env` files; always re-read them before running sync.

## 3. Verify Supabase is reachable
1.  Confirm the host/port in `supabase-url` is listening. For example:
    ```bash
    export SUPABASE_URL=$(cat /Users/jaynowman/northstar-keys/supabase-url.txt)
    curl -I ${SUPABASE_URL} || echo "Supabase not reachable"
    ```
2.  If it is a local stack (localhost:54321), start it before syncing; otherwise the script will fail with `[Errno 61] Connection refused`.

## 4. Run the Muscle Sync
1.  Start the sentinel to generate MCP wrappers:
    ```bash
    python3 scripts/sentinel.py
    ```
2.  Once the sentinel finishes, run the sync:
    ```bash
    python3 scripts/sync_muscles.py
    ```
3.  Capture the stdout/stderr. If you see “connection refused,” document the missing service and rerun after Supabase is live.

## 5. Report & document
- Note the synced muscles, timestamps, and any Supabase errors in `docs/muscle-tech-specs/planetary-fps-spec.md` or a brief log entry.
- Mention the Supabase URL/service key you used (without copying secrets) so future agents know which Vault values map to the registry environment.

Following this skill keeps every agent working in lockstep: read the policy, load the Vault, verify the host, run sentinel/sync, and document results. Failure to follow these steps is why past agents got stuck.
