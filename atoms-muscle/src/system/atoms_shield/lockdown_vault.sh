#!/bin/bash
# lockdown_vault.sh
# Changes permissions on ~/northstar-keys/ so only the current user can write.
# Run this BEFORE starting the Atoms-Shield daemon.

VAULT_PATH="$HOME/northstar-keys"

echo "🔒 Atoms-Shield Vault Lockdown"
echo "==============================="

# Create vault directory if it doesn't exist
if [ ! -d "$VAULT_PATH" ]; then
    echo "Creating vault directory: $VAULT_PATH"
    mkdir -p "$VAULT_PATH"
fi

# Set strict permissions: owner read/write/execute only
echo "Setting permissions to 700 (owner only)..."
chmod 700 "$VAULT_PATH"

# Set all existing .key files to 600 (owner read/write only)
echo "Securing existing key files..."
find "$VAULT_PATH" -name "*.key" -exec chmod 600 {} \;

# Verify
echo ""
echo "✅ Vault locked down successfully!"
echo "   Directory: $VAULT_PATH"
echo "   Permissions: $(stat -f '%A' "$VAULT_PATH" 2>/dev/null || stat -c '%a' "$VAULT_PATH")"
echo ""
echo "⚠️  NOTE: This only prevents OTHER users from accessing the vault."
echo "   IDE agents running as YOUR user can still write directly unless"
echo "   they are configured to use the Atoms-Shield MCP server."
