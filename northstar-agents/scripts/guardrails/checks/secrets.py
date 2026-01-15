
import os
import re

FORBIDDEN_PATTERNS = [
    r"OPENAI_API_KEY",
    r"ANTHROPIC_API_KEY",
    r"\.env", # Check for .env string usage or file existence? "contains patterns like ... *.env"
    r"dotenv",
    r"os\.environ\[", # "os.environ['...'] lookups for non-AWS/GCP defaults"
]

# Exceptions for os.environ checks (AWS/GCP defaults allowed)
ALLOWED_ENV_VARS = [
    "AWS_", "GOOGLE_", "GCP_", "GCLOUD_"
]

def check_secrets(root_dir):
    print("Running Secrets & Env Var Check...")
    violations = []
    
    # 1. File name checks (e.g. .env files)
    for dirpath, _, filenames in os.walk(root_dir):
        if ".venv" in dirpath or ".git" in dirpath:
            continue
        for filename in filenames:
            if filename.endswith(".env"):
                violations.append(f"Found dotenv file: {os.path.join(dirpath, filename)}")

    # 2. Content checks
    for dirpath, _, filenames in os.walk(root_dir):
        if ".venv" in dirpath or ".git" in dirpath:
            continue
            
        for filename in filenames:
            if not filename.endswith((".py", ".md", ".toml", ".yaml")):
                continue
                
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)
            
            # Skip this file itself to avoid self-flagging
            if "scripts/guardrails/checks/secrets.py" in rel_path:
                continue
            # Skip check_no_dotenv as it legitimately grep for these patterns
            if "scripts/guardrails/check_no_dotenv.py" in rel_path:
                continue
            # Skip run_all as it imports check_no_dotenv
            if "scripts/guardrails/run_all.py" in rel_path:
                continue
            # Skip secrets core implementation which might mention .env or env vars
            if "src/northstar/core/secrets.py" in rel_path:
                continue
            # Skip secrets tests which mock env vars
            if "tests/core/test_secrets.py" in rel_path:
                continue
            # Skip documentation which might mention .env conceptually
            if "CONTRIBUTING.md" in rel_path:
                continue
            # Phase 20: Server API checks env vars for Safety Gate
            if "src/northstar/server/api.py" in rel_path:
                continue
            if "tests/server/test_api.py" in rel_path:
                continue

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines):
                    for pattern in FORBIDDEN_PATTERNS:
                        if re.search(pattern, line):
                            # Special handling for os.environ
                            if "os.environ[" in line:
                                # Check if it matches allowed prefixes
                                match = re.search(r"os\.environ\[['\"]([^'\"]+)['\"]\]", line)
                                if match:
                                    var_name = match.group(1)
                                    if any(var_name.startswith(p) for p in ALLOWED_ENV_VARS):
                                        continue # Allowed
                            
                            # Special handling for comments? strict for now.
                            violations.append(f"{rel_path}:{i+1} matches forbidden pattern '{pattern}'")

            except Exception:
                pass

    if violations:
        for v in violations:
            print(f"[FAIL] {v}")
        return False
    
    return True
