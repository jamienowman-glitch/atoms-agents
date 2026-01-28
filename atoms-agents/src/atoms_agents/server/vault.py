import os

class VaultLoader:
    VAULT_PATH = '/Users/jaynowman/northstar-keys'

    @classmethod
    def load_secret(cls, filename: str) -> str:
        try:
            path = os.path.join(cls.VAULT_PATH, filename)
            with open(path, 'r') as f:
                return f.read().strip()
        except FileNotFoundError:
            print(f"VaultLoader: Secret file not found: {filename}")
            return ""
        except Exception as e:
            print(f"VaultLoader: Error loading {filename}: {e}")
            return ""
