# MCP Local Dev Connector (Operatorless Edition)

A secure, zero-terminal desktop app to give ChatGPT Developer Mode access to your local `/Users/jaynowman/dev`.

## One-Click Start

1. Double-click `Start Connector.command`.
   - Before first run: `chmod +x "Start Connector.command"` (run once or right click -> Open).
2. The UI will open automatically at `http://localhost:8000/ui`.

## Session Controls (UI)

- **Write Mode**: Disabled by default. Toggle "Enable Writes" in the sidebar to enable for 60 minutes. Requires confirmation.
- **Scope**: Select specific repositories or use `dev-root` to search everything. "Lock Scope" prevents AI from switching.
- **Connection**:
    - Click "Start Tunnel" to get a public HTTPS URL.
    - Copy URL.
    - Paste into ChatGPT (Settings > Apps > Developer Mode).

## Security Features

- **Hard Sandbox**: `/Users/jaynowman/dev` only.
- **Secrets Blocked**: `.env`, keys, credentials denied.
- **Write Protection**:
    - Auto-expires after 60 mins.
    - Enforced branch protection (no main/master).
    - Patches default to dry-run first.
    
## Troubleshooting

- **Server won't start?**: Ensure you have Python 3 installed.
- **Tunnel fails?**: Install `brew install cloudflared`.
- **Self-Test**: Click "Run Self-Test" in the UI sidebar to verify sandboxing.
