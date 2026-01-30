from pathlib import Path
from typing import Optional, Dict
from functools import lru_cache
from pydantic import BaseModel, ConfigDict

# Local "Vault" Paths - consistent with atoms-core
VAULT_DIR = Path("/Users/jaynowman/northstar-keys")
KEY_MAP = {
    "SUPABASE_URL": VAULT_DIR / "supabase-url.txt",
    "SUPABASE_SERVICE_KEY": VAULT_DIR / "supabase-service-role.txt",
}

class Settings(BaseModel):
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str

    model_config = ConfigDict(frozen=True)

def load_from_vault() -> Dict[str, str]:
    """
    Reads secrets from local secured files.
    """
    secrets = {}

    for key, path in KEY_MAP.items():
        if not path.exists():
            raise FileNotFoundError(f"CRITICAL: Missing Secret in Vault. Expected at: {path}")

        with open(path, "r") as f:
            val = f.read().strip()
            if not val:
                raise ValueError(f"CRITICAL: Secret file is empty: {path}")
            secrets[key] = val

    return secrets

@lru_cache
def get_settings() -> Settings:
    secrets = load_from_vault()
    return Settings(**secrets)
