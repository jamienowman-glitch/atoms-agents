import os
import sys

def check_namespace():
    print("Running Namespace Check...")
    errors = []
    
    # 1. Check for src/src directory
    if os.path.exists("src/src"):
        errors.append("FAIL: Directory 'src/src' exists. The shim must be deleted.")

    # 2. Check for banned imports in Python files
    # Scans all .py files in src/northstar and tests
    # Banned: "import src." or "from src."
    
    dirs_to_scan = ["src/northstar", "tests", "scripts"]
    
    for scan_dir in dirs_to_scan:
        if not os.path.exists(scan_dir):
            continue
            
        for root, _, files in os.walk(scan_dir):
            for file in files:
                if not file.endswith(".py"):
                    continue
                
                path = os.path.join(root, file)
                # Skip migration script itself if it references src for regex purposes?
                # Actually our migration script uses regex string "src.", so reading it might flag it.
                # Let's simple skip the migration script from this check if needed, 
                # OR better, make the check robust to strings vs imports?
                # Simple string check is safer for "No usage" rule.
                # But migration script *needs* to contain the string to fix it.
                if "migrate_entrypoints" in file or "check_namespace" in file:
                    continue

                with open(path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines):
                    stripped = line.strip()
                    # Check for import src. or from src.
                    # We look for "src." preceded by space (import src.) or at start (from src.)
                    # Also handle "import src" (though strictly "northstar" is package).
                    # But prompt says "import src." or "from src."
                    
                    if "import src." in stripped or "from src." in stripped:
                         # Exclude comments? Simple check first.
                         if stripped.startswith("#"):
                             continue
                         errors.append(f"FAIL: {path}:{i+1} references 'src.' namespace: {stripped}")

    # 3. Check for banned entrypoints in YAML cards
    # Banned: "entrypoint: src."
    registry_root = "src/northstar/registry/cards"
    if os.path.exists(registry_root):
        for root, _, files in os.walk(registry_root):
            for file in files:
                if not file.endswith(".yaml"):
                    continue
                
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                if "entrypoint: src." in content:
                    errors.append(f"FAIL: {path} contains 'entrypoint: src.'")

    if errors:
        for e in errors:
            print(e)
        print("[FAIL] Namespace check failed.")
        sys.exit(1)
    
    print("[PASS] Namespace check passed.")

if __name__ == "__main__":
    check_namespace()
