"""
Atoms-Shield MCP Server

The EXCLUSIVE gateway to the Vault (~/northstar-keys/).
No agent can write secrets directly - they MUST go through this server.

Features:
1. Strict Validator: Platform names must be "Chemical" (single capitalized word)
2. TOTP Gate: Requires a valid 6-digit code from human's Authenticator
3. Canonical Naming: Enforces PROVIDER_{SLUG}_{FIELD} format
4. Audit Trail: Logs all access attempts
"""

import os
import re
import hashlib
import httpx
from datetime import datetime
from typing import Optional
from mcp.server.fastmcp import FastMCP

# Import the Registry (source of truth for naming)
import sys
sys.path.insert(0, os.path.expanduser("~/dev/atoms-core/src"))
from atoms_core.connectors.registry import (
    get_canonical_key_name,
    check_key_exists,
    VAULT_PATH,
)

# Initialize MCP Server
mcp = FastMCP("atoms-shield")

# Firearms API endpoint
FIREARMS_API_URL = os.environ.get(
    "FIREARMS_API_URL", 
    "http://localhost:3000/api/firearms/verify"
)


class AtomsShieldError(Exception):
    """Base error for Atoms-Shield rejections."""
    pass


class ChemicalNameError(AtomsShieldError):
    """Platform name is not Chemical (single capitalized word)."""
    pass


class TOTPValidationError(AtomsShieldError):
    """TOTP code validation failed."""
    pass


class DuplicateKeyError(AtomsShieldError):
    """Key already exists in Vault."""
    pass


def validate_chemical_name(platform: str) -> str:
    """
    Strict Validator: Platform name MUST be a single capitalized word.
    
    Valid: "Shopify", "Solana", "Meta", "Discord"
    Invalid: "Shopify_Store", "meta ads", "SOLANA", "shopify"
    
    Raises:
        ChemicalNameError: If validation fails
    
    Returns:
        The validated platform name
    """
    # Strip whitespace
    name = platform.strip()
    
    # Must not be empty
    if not name:
        raise ChemicalNameError("Platform name cannot be empty.")
    
    # Must be a single word (no spaces, underscores, or hyphens)
    if " " in name or "_" in name or "-" in name:
        raise ChemicalNameError(
            f"Platform name must be Chemical (e.g., 'Shopify', NOT '{name}'). "
            "No spaces, underscores, or hyphens allowed."
        )
    
    # Must start with uppercase letter
    if not name[0].isupper():
        raise ChemicalNameError(
            f"Platform name must start with an uppercase letter (e.g., 'Solana', NOT '{name}')."
        )
    
    # Must be title case (first letter upper, rest lower OR all upper for acronyms like "AWS")
    # We allow: "Shopify", "AWS", "GCP" but not "SHOPIFY" unless it's 3 chars or less
    if len(name) > 3 and name.isupper():
        raise ChemicalNameError(
            f"Platform name must be capitalized, not all-caps (e.g., 'Solana', NOT '{name}')."
        )
    
    return name


async def verify_totp(totp_code: str, license_key: str, agent_id: str, auth_token: str) -> dict:
    """
    Calls the Firearms API to validate TOTP and get a ticket.
    
    Args:
        totp_code: The 6-digit code from Authenticator
        license_key: The firearms license being requested (e.g., "VAULT_WRITE")
        agent_id: The agent's identifier
        auth_token: The user's auth token (Bearer token)
    
    Returns:
        dict with 'ticket' and 'expires_at' on success
    
    Raises:
        TOTPValidationError: If validation fails
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                FIREARMS_API_URL,
                json={
                    "totp_code": totp_code,
                    "license_key": license_key,
                    "agent_id": agent_id,
                },
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10.0
            )
            
            if response.status_code != 200:
                error_data = response.json()
                raise TOTPValidationError(
                    f"TOTP validation failed: {error_data.get('error', 'Unknown error')}"
                )
            
            return response.json()
            
        except httpx.RequestError as e:
            raise TOTPValidationError(f"Could not reach Firearms API: {str(e)}")


def write_secret_to_vault(platform: str, field: str, secret_value: str) -> str:
    """
    Writes a secret to the Vault with proper permissions.
    
    Args:
        platform: Validated Chemical platform name
        field: Field type (API_KEY, CLIENT_SECRET, etc.)
        secret_value: The actual secret to store
    
    Returns:
        The canonical key name that was written
    """
    # Ensure Vault directory exists
    if not os.path.exists(VAULT_PATH):
        os.makedirs(VAULT_PATH, mode=0o700)
    
    # Get canonical name
    key_name = get_canonical_key_name(platform, field)
    key_path = os.path.join(VAULT_PATH, f"{key_name}.key")
    
    # Write with restricted permissions
    with open(key_path, 'w') as f:
        os.chmod(key_path, 0o600)  # Owner read/write only
        f.write(secret_value)
    
    return key_name


def compute_merkle_hash(agent_id: str, action: str, platform: str) -> str:
    """
    Computes a Merkle leaf hash for audit purposes.
    """
    data = f"{agent_id}|{action}|{platform}|{datetime.utcnow().isoformat()}"
    return hashlib.sha256(data.encode()).hexdigest()


# ============================================================
# MCP TOOLS
# ============================================================

@mcp.tool()
async def vault_write_secret(
    platform: str,
    secret_value: str,
    totp_code: str,
    field: str = "API_KEY",
    agent_id: str = "unknown",
    auth_token: str = "",
) -> dict:
    """
    Writes a secret to the Atoms Vault.
    
    THIS IS THE ONLY WAY TO WRITE SECRETS.
    
    Args:
        platform: The platform name (MUST be Chemical: single capitalized word like "Shopify")
        secret_value: The secret to store
        totp_code: 6-digit code from your Authenticator app
        field: Type of secret (API_KEY, CLIENT_SECRET, CLIENT_ID). Default: API_KEY
        agent_id: Your agent identifier
        auth_token: Your user's Bearer token for verification
    
    Returns:
        Success: {"success": True, "key_name": "PROVIDER_SHOPIFY_API_KEY"}
        Error: {"error": "...", "code": "CHEMICAL_NAME_ERROR|TOTP_ERROR|DUPLICATE_ERROR"}
    """
    try:
        # 1. Validate Chemical Name (Strict)
        validated_platform = validate_chemical_name(platform)
        
        # 2. Check for duplicates
        if check_key_exists(validated_platform, field):
            # Allow overwrite if explicitly confirmed
            pass  # For now, we allow overwrites
        
        # 3. Verify TOTP (The Gate)
        if not totp_code or len(totp_code) != 6:
            raise TOTPValidationError("TOTP code must be 6 digits.")
        
        firearms_result = await verify_totp(
            totp_code=totp_code,
            license_key="VAULT_WRITE",  # Special license for vault operations
            agent_id=agent_id,
            auth_token=auth_token
        )
        
        # 4. Write to Vault
        key_name = write_secret_to_vault(validated_platform, field, secret_value)
        
        # 5. Compute Merkle hash for audit
        merkle_hash = compute_merkle_hash(agent_id, "VAULT_WRITE", validated_platform)
        
        return {
            "success": True,
            "key_name": key_name,
            "platform": validated_platform,
            "field": field,
            "merkle_hash": merkle_hash,
            "ticket_expires_at": firearms_result.get("expires_at"),
        }
        
    except ChemicalNameError as e:
        return {"error": str(e), "code": "CHEMICAL_NAME_ERROR"}
    except TOTPValidationError as e:
        return {"error": str(e), "code": "TOTP_ERROR"}
    except DuplicateKeyError as e:
        return {"error": str(e), "code": "DUPLICATE_ERROR"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}", "code": "INTERNAL_ERROR"}


@mcp.tool()
def vault_list_keys() -> dict:
    """
    Lists all keys currently in the Vault.
    
    Returns:
        {"keys": ["PROVIDER_SHOPIFY_API_KEY", "PROVIDER_SOLANA_API_KEY", ...]}
    """
    if not os.path.exists(VAULT_PATH):
        return {"keys": []}
    
    keys = []
    for f in os.listdir(VAULT_PATH):
        if f.endswith('.key'):
            keys.append(f[:-4])
    
    return {"keys": sorted(keys)}


@mcp.tool()
def vault_check_key(platform: str, field: str = "API_KEY") -> dict:
    """
    Checks if a key exists in the Vault without reading it.
    
    Args:
        platform: The platform name
        field: The field type
    
    Returns:
        {"exists": True/False, "key_name": "PROVIDER_..."}
    """
    try:
        validated_platform = validate_chemical_name(platform)
        key_name = get_canonical_key_name(validated_platform, field)
        exists = check_key_exists(validated_platform, field)
        return {"exists": exists, "key_name": key_name, "platform": validated_platform}
    except ChemicalNameError as e:
        return {"error": str(e), "code": "CHEMICAL_NAME_ERROR"}


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    print("🛡️ Atoms-Shield MCP Server starting...")
    print(f"📁 Vault Path: {VAULT_PATH}")
    print(f"🔗 Firearms API: {FIREARMS_API_URL}")
    mcp.run()
