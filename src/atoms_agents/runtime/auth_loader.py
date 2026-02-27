import os
from pathlib import Path
from typing import Dict, Optional, List


def _vault_dir() -> Path:
    # Location-independent override. Defaults to the historical path.
    base = (
        os.getenv("NORTHSTAR_KEYS_DIR")
        or os.getenv("NORTHSTAR_VAULT_DIR")
        or "/Users/jaynowman/northstar-keys"
    )
    return Path(base)

def _read_key_file(path: str) -> Optional[str]:
    """Reads a key from a file, stripping whitespace. Returns None if file invalid."""
    try:
        if not os.path.exists(path):
            return None
        with open(path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return None
            return content
    except Exception:
        return None

def _first_existing_value(vault: Path, candidates: List[str]) -> Optional[str]:
    for name in candidates:
        p = vault / name
        val = _read_key_file(str(p))
        if val:
            return val
    return None

def load_auth_keys() -> Dict[str, str]:
    """
    Loads local development keys into a dictionary.
    Keys: 'GROQ_API_KEY', 'JULES_API_KEY', etc.
    """
    keys = {}

    vault = _vault_dir()
    mapping = {
        # Prefer JAS/Vault-style `.key` secrets but accept historical `.txt` names.
        "GROQ_API_KEY": ["groq_key.txt", "groq.txt", "PROVIDER_GROQ_API_KEY.key", "PROVIDER_GROQ_KEY.key"],
        "JULES_API_KEY": ["JULES-KEY.TXT", "jules-key.txt", "PROVIDER_JULES_API_KEY.key", "PROVIDER_JULES_KEY.key"],
        "GEMINI_API_KEY": ["gemini-aistudio.txt", "gemini.txt", "PROVIDER_GEMINI_API_KEY.key", "PROVIDER_GEMINI_KEY.key"],
        "OPENROUTER_API_KEY": ["openrouter.txt", "openrouter", "PROVIDER_OPENROUTER_API_KEY.key", "PROVIDER_OPENROUTER_KEY.key"],
        "NVIDIA_API_KEY": ["nvidia.txt", "PROVIDER_NVIDIA_API_KEY.key", "PROVIDER_NVIDIA_KEY.key"],
        "COMET_API_KEY": ["comet_key.txt", "comet.txt", "PROVIDER_COMET_API_KEY.key", "PROVIDER_COMET_KEY.key"],
        "ELEVENLABS_API_KEY": ["elevenlabs.txt", "PROVIDER_ELEVENLABS_API_KEY.key", "PROVIDER_ELEVENLABS_KEY.key"],
        "MISTRAL_API_KEY": ["mistral.txt", "PROVIDER_MISTRAL_API_KEY.key", "PROVIDER_MISTRAL_KEY.key"],
    }

    for env_var, candidates in mapping.items():
        # If already set, do not override.
        if os.environ.get(env_var):
            keys[env_var] = os.environ[env_var]
            continue

        val = _first_existing_value(vault, candidates)
        if val:
            keys[env_var] = val
            os.environ[env_var] = val

    return keys

def require_key(key_name: str) -> str:
    """Helper to get a key or raise a clean error."""
    val = os.environ.get(key_name)
    if val:
        return val

    keys = load_auth_keys()
    if key_name in keys:
        return keys[key_name]

    raise ValueError(f"Missing required key: {key_name}. Please verify key file exists.")
