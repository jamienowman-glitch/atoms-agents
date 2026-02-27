import os
from pathlib import Path

class VaultLoader:
    @classmethod
    def vault_dir(cls) -> Path:
        base = (
            os.getenv("NORTHSTAR_KEYS_DIR")
            or os.getenv("NORTHSTAR_VAULT_DIR")
            or "/Users/jaynowman/northstar-keys"
        )
        return Path(base)

    @classmethod
    def load_secret(cls, filename: str) -> str:
        try:
            path = cls.vault_dir() / filename
            with open(path, 'r', encoding="utf-8") as f:
                return f.read().strip()
        except FileNotFoundError:
            print(f"VaultLoader: Secret file not found: {filename}")
            return ""
        except Exception as e:
            print(f"VaultLoader: Error loading {filename}: {e}")
            return ""
