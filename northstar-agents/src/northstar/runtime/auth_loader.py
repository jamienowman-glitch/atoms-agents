import os
from typing import Dict, Optional

# Constants for key paths
GROQ_KEY_PATH = "/Users/jaynowman/northstar-keys/groq_key.txt"
JULES_KEY_PATH = "/Users/jaynowman/northstar-keys/JULES-KEY.TXT"
GEMINI_KEY_PATH = "/Users/jaynowman/northstar-keys/gemini-aistudio.txt"
OPENROUTER_KEY_PATH = "/Users/jaynowman/northstar-keys/openrouter.txt"
NVIDIA_KEY_PATH = "/Users/jaynowman/northstar-keys/nvidia.txt"
COMET_KEY_PATH = "/Users/jaynowman/northstar-keys/comet_key.txt"

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
    except Exception as e:
        return None

def load_auth_keys() -> Dict[str, str]:
    """
    Loads local development keys into a dictionary.
    Keys: 'GROQ_API_KEY', 'JULES_API_KEY', etc.
    """
    keys = {}
    
    mapping = {
        "GROQ_API_KEY": GROQ_KEY_PATH,
        "JULES_API_KEY": JULES_KEY_PATH,
        "GEMINI_API_KEY": GEMINI_KEY_PATH,
        "OPENROUTER_API_KEY": OPENROUTER_KEY_PATH,
        "NVIDIA_API_KEY": NVIDIA_KEY_PATH,
        "COMET_API_KEY": COMET_KEY_PATH,
    }
    
    for env_var, path in mapping.items():
        val = _read_key_file(path)
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
