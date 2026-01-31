import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class VaultWriterService:
    def __init__(self):
        # Always use home directory logic for consistency
        self.vault_path = os.path.expanduser("~/northstar-keys")
        
        # Create vault dir if missing, with restricted permissions
        if not os.path.exists(self.vault_path):
            os.makedirs(self.vault_path, mode=0o700) 
            logger.info(f"Created secure vault at {self.vault_path}")

    async def write_secret(self, key: str, value: str) -> str:
        """
        Writes a secret to the vault.
        Key must be UPPERCASE_UNDERSCORE.
        """
        # 1. Validation
        if ".." in key or "/" in key:
            raise ValueError("Invalid key: Path traversal detected.")
        
        # Enforce Naming Convention: UPPERCASE_UNDERSCORE
        # Allow numbers.
        # e.g. DEFAULT_SHOPIFY_API_KEY
        clean_key = key.replace("_", "")
        if not clean_key.isalnum() or not key.isupper():
             raise ValueError(f"Invalid key '{key}'. Must be UPPERCASE_UNDERSCORE_ALPHANUMERIC.")

        # 2. Write
        file_path = os.path.join(self.vault_path, f"{key}.txt")
        
        try:
            with open(file_path, "w") as f:
                f.write(str(value).strip())
            
            # 3. Secure
            os.chmod(file_path, 0o600) # Read/Write for owner only
            logger.info(f"Securely wrote key: {key}")
            return "Success"
        except Exception as e:
            logger.error(f"Failed to write key {key}: {e}")
            raise e
