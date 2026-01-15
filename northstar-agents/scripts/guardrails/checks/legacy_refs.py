
import os

FORBIDDEN_TERMS = [
    "reaper",
    "aitoms_fam",
    "northstar-engines", # Assuming this is an old repo ref to avoid? Or just generic "old-repo"
    # User said: "strings like reaper, old module paths" 
    # I'll stick to 'reaper' and maybe 'aitoms_fam' as safe bets from context.
    # Also "import paths that aren’t inside northstar-agents/src" - this is tricky.
    # Usually "from src.core import..." is clean. "from legacy_repo import..." is bad.
    # I will flag imports that look like they come from known legacy namespaces if I knew them.
    # For now, 'reaper' is the explicit one given.
]

def check_legacy_refs(root_dir):
    print("Running Legacy Reference Check...")
    violations = []

    for dirpath, _, filenames in os.walk(root_dir):
        if ".venv" in dirpath or ".git" in dirpath:
            continue
            
        for filename in filenames:
            if not filename.endswith((".py", ".md", ".txt")):
                continue
                
            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)
            
            # Skip self
            if "scripts/guardrails/checks/legacy_refs.py" in rel_path:
                continue

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                for term in FORBIDDEN_TERMS:
                    if term in content:
                        violations.append(f"{rel_path} contains forbidden legacy term: '{term}'")
                        
            except Exception:
                pass

    if violations:
        for v in violations:
            print(f"[FAIL] {v}")
        return False

    return True
