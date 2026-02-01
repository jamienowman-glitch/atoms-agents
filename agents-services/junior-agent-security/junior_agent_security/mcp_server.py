"""
Junior Agent Security - MCP Server
The standalone local sidecar entrypoint.
"""
from mcp.server.fastmcp import FastMCP
from .vault.naming import validate_chemical_name, ChemicalNameError
from .vault.writer import write_secret_to_disk, list_vault_keys, check_key_exists
from .totp.verifier import verify_totp_and_grant, TOTPError
from .totp.setup import generate_new_secret, save_verified_secret
from .db.sqlite import init_db

# Initialize DB on startup
init_db()

mcp = FastMCP("junior-agent-security")

@mcp.tool()
def vault_write_secret(
    platform: str,
    secret_value: str,
    totp_code: str,
    field: str = "API_KEY",
    agent_id: str = "unknown"
) -> dict:
    """
    Writes a secret to the Vault. REQUIRED: 6-digit TOTP code.
    
    Args:
        platform: Chemical name (e.g. "Shopify"). Single capitalized word.
        secret_value: The secret string.
        totp_code: 6-digit code from Junior Agent Security Authenticator.
        field: Key type (API_KEY, CLIENT_SECRET, etc.)
        agent_id: ID of the agent requesting this.
    """
    try:
        # 1. Validate Name
        validate_chemical_name(platform)
        
        # 2. Verify TOTP & Get License
        # 'local_developer' is the default user for this standalone tool
        grant = verify_totp_and_grant(totp_code, "VAULT_WRITE", agent_id)
        
        # 3. Write to Disk
        key_name = write_secret_to_disk(platform, field, secret_value)
        
        return {
            "success": True,
            "key_name": key_name,
            "merkle_hash": grant["merkle_hash"],
            "expires_at": grant["expires_at"]
        }
        
    except ChemicalNameError as e:
        return {"error": str(e), "code": "CHEMICAL_NAME_ERROR"}
    except TOTPError as e:
        return {"error": str(e), "code": "TOTP_ERROR"}
    except Exception as e:
        return {"error": str(e), "code": "INTERNAL_ERROR"}

@mcp.tool()
def vault_list_keys():
    """Lists all keys in the Vault."""
    return {"keys": list_vault_keys()}

@mcp.tool()
def vault_check_key(platform: str, field: str = "API_KEY"):
    """Checks if a key exists."""
    return {"exists": check_key_exists(platform, field)}

@mcp.tool()
def setup_totp_generate():
    """
    Generates a new TOTP secret/QR code for setup.
    Returns the secret and an ASCII QR code to display in terminal.
    """
    return generate_new_secret()

@mcp.tool()
def setup_totp_verify(secret: str, code: str):
    """
    Verifies and saves the TOTP secret if code is correct.
    """
    success = save_verified_secret("local_developer", secret, code)
    if success:
        return {"success": True, "message": "TOTP setup complete. You can now use vault_write_secret."}
    else:
        return {"error": "Invalid code", "success": False}

if __name__ == "__main__":
    mcp.run()
