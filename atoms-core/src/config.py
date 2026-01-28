from pathlib import Path
from functools import lru_cache
from pydantic import BaseModel, ConfigDict

# Local "Vault" Paths
VAULT_DIR = Path("/Users/jaynowman/northstar-keys")
KEY_MAP = {
    "SUPABASE_URL": VAULT_DIR / "supabase-url.txt",
    "SUPABASE_ANON_KEY": VAULT_DIR / "supabase_publishable_api.txt",
    "OPENAI_API_KEY": VAULT_DIR / "openrouter",
}

class Settings(BaseModel):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    OPENAI_API_KEY: str
    SYSTEM_KEY: str
    
    # GSM_CONNECTED flag for status reporting
    GSM_CONNECTED: bool = False

    model_config = ConfigDict(frozen=True)

def load_from_vault() -> dict:
    """
    Reads secrets from local secured files.
    Fails hard if a tracked key is missing to prevent configuration drift.
    """
    secrets = {}
    
    # 1. Load Mapped Keys
    for key, path in KEY_MAP.items():
        if not path.exists():
            raise FileNotFoundError(f"CRITICAL: Missing Secret in Vault. Expected at: {path}")
        
        with open(path, "r") as f:
            val = f.read().strip()
            if not val:
                raise ValueError(f"CRITICAL: Secret file is empty: {path}")
            secrets[key] = val

    # 2. System Key (Vault Preferred)
    system_key_path = VAULT_DIR / "system-key.txt"
    if system_key_path.exists():
        with open(system_key_path, "r") as f:
            system_key = f.read().strip()
            if not system_key:
                raise ValueError(f"CRITICAL: Secret file is empty: {system_key_path}")
            secrets["SYSTEM_KEY"] = system_key
    else:
        secrets["SYSTEM_KEY"] = "test_system_key"

    return secrets

@lru_cache
def get_settings() -> Settings:
    # Future: Check env var to decide if we load from GSM or Local Vault
    # if os.getenv("ENV") == "PRODUCTION":
    #     secrets = load_from_gsm()
    # else:
    
    secrets = load_from_vault()
    return Settings(**secrets)
