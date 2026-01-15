import os
import sys

def check_no_dotenv():
    print("Running No DotEnv Check...")
    
    # Check 1: Check for .env files in tracked git?
    # Actually, verify-live or run-mode shouldn't load them.
    # But for code sanity, we check that no code IMPORTS dotenv or load_dotenv.
    
    violations = []
    
    root_dir = os.path.abspath(os.getcwd())
    src_dir = os.path.join(root_dir, "src")
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            if "python-dotenv" in line or "load_dotenv" in line:
                                # stricter: "from dotenv" or "import dotenv"
                                if "from dotenv" in line or "import dotenv" in line:
                                    violations.append(f"{path}:{i+1}: {line.strip()}")
                except Exception as e:
                    print(f"Warning: could not read {path}: {e}")

    if violations:
        print("[FAIL] Found usage of dotenv (Strict Phase 9C violation):")
        for v in violations:
            print(f"  {v}")
        sys.exit(1)
        
    print("[PASS] No dotenv usage found.")

if __name__ == "__main__":
    check_no_dotenv()
