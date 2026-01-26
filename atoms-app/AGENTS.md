
# Agents Registry (atoms-app)

## 🗺️ Strategic Infrastructure & Auth
> **CRITICAL**: These documents define The Law for Auth, Infrastructure, and Nexus Architecture. Read them before planning any changes.

*   [Auth & Key Playbook (GCP/AWS)](docs/infra/NORTHSTAR_AUTH_SETUP.md)
*   [Nexus Architecture (Domains & Isolation)](docs/infra/NEXUS_ARCHITECTURE.md)

## 🔐 SECURITY CONSTITUTION: THE VAULT LAW
*   **NO .ENV FILES:** Explicitly forbidden. Delete them on sight.
*   **THE VAULT PATTERN:** All Secrets must be loaded via `VaultLoader` from `/Users/jaynowman/northstar-keys/`.
*   **ZERO DRIFT:** Configuration is immutable.

## Agents
(No agents registered yet)
