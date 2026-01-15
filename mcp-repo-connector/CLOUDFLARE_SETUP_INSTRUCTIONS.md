# Cloudflare Access Fix for MCP

To make your permanent URL (`https://app.squared-agents.app/mcp/sse`) work with ChatGPT, you must bypass Cloudflare Access for the MCP paths.

1.  **Open Cloudflare Zero Trust Dashboard**:
    *   Go to: hhttps://one.dash.cloudflare.com/
    *   Navigate to **Access** > **Applications**.

2.  **Find Your Application**:
    *   Search for permissions for: `app.squared-agents.app`
    *   Click **Edit** (pencil icon).

3.  **Add a Bypass Policy**:
    *   Click the **Policies** tab.
    *   Click **Add a Policy**.
    *   **Policy Name**: `Allow Public MCP`
    *   **Action**: Select **Bypass** from the dropdown.

4.  **Configure the Rule**:
    *   Under **Create additional rules**, set:
        *   **Standard**: `Path`
        *   **Operator**: `starts with`
        *   **Value**: `/mcp/`
    *   *Note: This covers both `/mcp/sse` and `/mcp/messages`.*

5.  **Save**:
    *   Click **Save policy**.

**That's it.**
Once saved, ChatGPT (and anyone else) can access:
`https://app.squared-agents.app/mcp/sse` without a 403 Forbidden error.
