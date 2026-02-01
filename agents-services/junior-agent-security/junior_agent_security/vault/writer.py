"""
Vault Writer Module.
Handles physical file I/O to the vault directory.
"""
import os
from pathlib import Path
from .naming import get_canonical_key_name, validate_chemical_name

VAULT_PATH = Path("~/northstar-keys").expanduser()

def write_secret_to_disk(platform: str, field: str, secret_value: str):
    """
    Writes a secret to the secure vault directory.
    """
    if not VAULT_PATH.exists():
        VAULT_PATH.mkdir(mode=0o700, parents=True) # rwx------
        
    canonical_name = get_canonical_key_name(platform, field)
    file_path = VAULT_PATH / f"{canonical_name}.key"
    
    # Write with restricted permissions (600: rw-------)
    with open(file_path, "w") as f:
        f.write(secret_value)
    
    os.chmod(file_path, 0o600)
    
    return canonical_name

def list_vault_keys():
    """Returns list of keys in vault."""
    if not VAULT_PATH.exists():
        return []
    
    return sorted([f.stem for f in VAULT_PATH.glob("*.key")])

def check_key_exists(platform: str, field: str) -> bool:
    try:
        name = get_canonical_key_name(platform, field)
        return (VAULT_PATH / f"{name}.key").exists()
    except:
        return False
