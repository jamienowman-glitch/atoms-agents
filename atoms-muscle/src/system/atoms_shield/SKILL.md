---
name: atoms-shield
description: The exclusive gateway to the Vault (~/northstar-keys/). All secret writes MUST go through this MCP server.
---

# Atoms-Shield: The Vault Guardian

## What It Does
This MCP server is the **ONLY** way to write secrets to the Vault. It enforces:
1. **Chemical Names**: Platform names must be single capitalized words (e.g., "Shopify", not "Shopify_Store")
2. **TOTP Gate**: Requires a 6-digit Authenticator code before any write
3. **Canonical Naming**: Outputs `PROVIDER_{SLUG}_{FIELD}` format
4. **Merkle Audit**: Every write is hashed for blockchain anchoring

## Available Tools

### `vault_write_secret`
The main tool. Writes a secret to the Vault.

**Arguments:**
| Arg | Type | Required | Description |
|-----|------|----------|-------------|
| platform | string | Yes | Chemical name (e.g., "Shopify") |
| secret_value | string | Yes | The secret to store |
| totp_code | string | Yes | 6-digit code from Authenticator |
| field | string | No | Type: API_KEY (default), CLIENT_SECRET, CLIENT_ID |
| agent_id | string | No | Your agent identifier |
| auth_token | string | Yes | User's Bearer token |

**Error Codes:**
- `CHEMICAL_NAME_ERROR`: Platform name is not valid (has spaces, underscores, etc.)
- `TOTP_ERROR`: The 6-digit code is invalid or expired
- `DUPLICATE_ERROR`: Key already exists (if overwrite is disabled)

### `vault_list_keys`
Lists all keys in the Vault. No authentication required.

### `vault_check_key`
Checks if a key exists without reading it.

## How to Run

```bash
cd atoms-muscle/src/system/atoms_shield
python mcp_server.py
```

## IDE Configuration

Add to your MCP server config:
```json
{
  "atoms-shield": {
    "command": "python",
    "args": ["/Users/jaynowman/dev/atoms-muscle/src/system/atoms_shield/mcp_server.py"]
  }
}
```
