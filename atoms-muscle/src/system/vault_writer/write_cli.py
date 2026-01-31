import argparse
import os
import sys

# Standalone logic to avoid import hell with 'atoms-muscle' directory name
class VaultWriter:
    def __init__(self):
        self.vault_path = os.path.expanduser("~/northstar-keys")
        if not os.path.exists(self.vault_path):
            os.makedirs(self.vault_path, mode=0o700)

    def write(self, tenant, provider, field, value):
        # 1. Compute Key
        # Rule: UPPERCASE_UNDERSCORE
        def clean(s): return str(s).upper().replace("-", "_").strip()
        
        t = clean(tenant if tenant else "DEFAULT")
        p = clean(provider)
        f = clean(field)
        
        key = f"{t}_{p}_{f}"
        
        # 2. Validate
        if not key.replace("_", "").isalnum():
            raise ValueError(f"Computed key '{key}' contains invalid characters.")

        # 3. Write
        file_path = os.path.join(self.vault_path, f"{key}.txt")
        with open(file_path, "w") as f:
            f.write(value)
        
        os.chmod(file_path, 0o600)
        return key

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--tenant", default="default")
    parser.add_argument("--provider", required=True)
    parser.add_argument("--field", required=True)
    parser.add_argument("--value", required=True)
    
    args = parser.parse_args()
    
    try:
        writer = VaultWriter()
        key = writer.write(args.tenant, args.provider, args.field, args.value)
        print(f"SUCCESS: Wrote {key}")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)
