from typing import Optional
import os
from src.core.identity.jwt_service import AuthContext # This seems to point to the other folder I haven't moved yet.
# Wait, if I move vault out of core, I need to verify where identity is.
# Let's pivot: The user hates "Burying". I should probably flatten ALL of 'src/core' to 'src'.
# But for now, I will just fix Vault to point to where Identity currently is.
from src.identity.jwt_service import AuthContext

# Local Path to Keys
VAULT_PATH = "/Users/jaynowman/northstar-keys/"
SYSTEM_TENANT_ID = "t_system" 

class VaultService:
    def get_secret(self, key_name: str, ctx: AuthContext) -> str:
        """
        Read a secret from the secure vault.
        Strictly enforces that only the System Tenant (Agents) can access.
        """
        # 1. SECURITY: STRICT GOD MODE CHECK
        if ctx.tenant_id != SYSTEM_TENANT_ID:
             # Log this attempt!
             print(f"🚨 ALERT: Tenant {ctx.tenant_id} attempted to access Vault Key: {key_name}")
             raise PermissionError(f"Access Denied: Tenant {ctx.tenant_id} cannot read Vault.")

        # 2. PATH TRAVERSAL CHECK
        if ".." in key_name or "/" in key_name:
            raise ValueError("Invalid key name.")

        # 3. READ
        try:
             with open(os.path.join(VAULT_PATH, key_name), "r") as f:
                 return f.read().strip()
        except FileNotFoundError:
             raise FileNotFoundError(f"Key {key_name} not found in Vault.")
