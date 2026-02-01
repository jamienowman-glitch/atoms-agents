# 🛡️ Junior Agent Security: The "Adult in the Room"
**Product Manual & Sales Strategy**

## 1. The Problem
**Agents are dangerous with secrets.**
- Developers paste `.env` files into chat windows.
- AI Agents write API keys to random files.
- There is no audit trail of *who* gave *what* key to *which* agent.

## 2. The Solution: "Physical Air-Gap for Vertical Workforce"
**Junior Agent Security (JAS)** is a local sidecar application that sits on your developer machine.

*   **The Vault**: Secrets are stored in a restricted folder (`chmod 600`), encrypted.
*   **The Gate**: When an agent tries to WRITE a secret, JAS blocks it and demands a **6-Digit TOTP Code** (like Google Authenticator).
*   **The Audit**: Every action is cryptographically hashed (Merkle Tree). You can prove exactly when a secret was added.

## 3. Commercial Strategy ("How we sell it")

### 🎯 Positioning
*   **"The Adult in the Room"**: Positioned for Enterprises/Teams who are scared of letting Junior devs + AI Agents loose.
*   **Zero Trust**: "Don't trust the AI. Trust the Math."

### 💰 Pricing Tiers
1.  **Free Tier (Community)**:
    - 1 Developer (Localhost).
    - Unlimited Secrets.
    - Local SQLite Audit Log.
    - **Cost**: $0.

2.  **Team Tier ($29/user/mo)**:
    - Centralized Audit Log (Supabase Sync).
    - Manager Approval Workflows (Slack Integration).
    - Shared Team Vaults.

3.  **Enterprise (Custom)**:
    - SSO / SAML.
    - On-Premise Merkle Anchor.
    - SIEM Integration (Splunk/Datadog).

## 4. How It Works (Technical)
1.  **Install**: `brew install atoms-security` (Future) or download `.app`.
2.  **Running**: It runs a local MCP server + a local Web Dashboard (`localhost:9090`).
3.  **Integration**: Point your AI Agent (Cursor/Windsurf) to the local MCP server.
4.  **Flow**:
    - Agent: "I need to save this Stripe Key."
    - JAS: "Requesting TOTP..."
    - Developer: Opens Phone -> Types `842911`.
    - JAS: "Verified. Key saved to Vault. Audit Hash `0x1a2b...` generated."
