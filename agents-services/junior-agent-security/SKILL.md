---
name: junior-agent-security
description: Local security sidecar for AI agents. Enforces TOTP for secret writing.
---

# 👮 Junior Agent Security (JAS)

**The Adult in the Room for your AI Agents.**

JAS is a local MCP sidecar that sits between your AI agent (Cursor, VS Code, etc.) and your sensitive keys. It ensures:
1.  **Secrets are never written plainly** to `.env` files.
2.  **Every secret write is gated** by a 6-digit TOTP code from your phone.
3.  **Audit Trail**: Every action is hashed (Merkle Man) for accountability.

## Desktop App (Mac Only)

### Running the App
1.  **Double Click** the `JuniorAgentSecurity.app` in `agents-services/junior-agent-security/dist/`.
2.  This opens the **God Mode Lite Dashboard** in your browser.
3.  It runs a local server at `http://localhost:9090` (See Audit Logs & Grants).

### Connecting VS Code / Cursor
To use the MCP server from this app:

```json
{
  "junior-agent-security": {
    "command": "/Users/jaynowman/dev/agents-services/junior-agent-security/dist/JuniorAgentSecurity.app/Contents/MacOS/JuniorAgentSecurity",
    "args": ["mcp-serve"]
  }
}
```

## CLI Installation (Alternative)

1.  **Navigate to directory**:
    ```bash
    cd agents-services/junior-agent-security
    ```

2.  **Install**:
    ```bash
    poetry install
    ```

3.  **Setup TOTP**:
    ```bash
    # Generate QR Code
    poetry run junior-agent-security call setup_totp_generate
    
    # Verify (replace values from previous step)
    poetry run junior-agent-security call setup_totp_verify --secret <SECRET> --code <123456>
    ```

## IDE Configuration

Add this to your MCP settings (e.g., `cursor-mcp.json`):

```json
{
  "junior-agent-security": {
    "command": "poetry",
    "args": ["run", "junior-agent-security"],
    "cwd": "/Users/jaynowman/dev/agents-services/junior-agent-security"
  }
}
```

## Tools

### `vault_write_secret`
*   **Purpose**: Write a secret to `~/northstar-keys/`.
*   **Safety**: Requires `totp_code` (6 digits).
*   **Naming**: Enforces Chemical Names (e.g., "Shopify" not "shopify_store").

### `setup_totp_generate`
*   **Purpose**: Get your QR code for Google Authenticator.

## Troubleshooting

*   **Database**: Stores data in `~/.junior-agent-security/junior_agent_security.db`.
*   **Logs**: Check generic MCP logs in your IDE.
