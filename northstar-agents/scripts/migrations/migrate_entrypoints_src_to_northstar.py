import os
import re

REGISTRY_ROOT = "src/northstar/registry/cards"

def migrate_entrypoints():
    print("Migrating ModeCard entrypoints from src.* to northstar.* ...")
    count = 0
    modified_files = []

    for root, dirs, files in os.walk(REGISTRY_ROOT):
        for file in files:
            if not file.endswith(".yaml"):
                continue
                
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
                
            # Regex to find entrypoint: src.
            # We want to be careful not to replace things that are already northstar.
            # Pattern: entrypoint: src.
            new_content = re.sub(r"entrypoint:\s*src\.", "entrypoint: northstar.", content)
            
            if new_content != content:
                with open(path, "w") as f:
                    f.write(new_content)
                modified_files.append(path)
                count += 1
                
    print(f"Migration complete. Modified {count} files.")
    for f in modified_files:
        print(f"  - {f}")

if __name__ == "__main__":
    migrate_entrypoints()
