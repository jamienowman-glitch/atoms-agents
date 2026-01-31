---
name: vault_writer
description: Securely writes secrets to the Northstar Vault.
category: system
---

# Vault Writer Skill

This muscle is the **Gatekeeper of Secrets**. It allows us to persist API keys and sensitive configuration to the secure `~/northstar-keys/` directory without exposing them in logs or databases.

## Tools

### `write_secret`
Writes a key-value pair to disk.

**Arguments**:
*   `key`: Must be `UPPERCASE_UNDERSCORE`. naming convention: `{{TENANT}}_{{PROVIDER}}_{{FIELD}}`.
*   `value`: The raw secret string.

## Security
*   Files are chmod `600` (Owner R/W only).
*   Keys are validated to prevent path traversal.
*   This tool **NEVER** reads values back. Reading is done by the Connector/Muscle runtime, not via MCP tools.
