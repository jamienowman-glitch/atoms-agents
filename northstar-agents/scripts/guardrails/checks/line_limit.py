
import os

def check_line_limits(root_dir, max_lines=250):
    exclusions = ["__init__.py"]
    exclude_dirs = ["tests/fixtures"]
    violations = []
    
    print(f"Running Line Limit Check (max {max_lines} lines)...")
    
    for dirpath, _, filenames in os.walk(root_dir):
        # Skip git/venv
        if ".git" in dirpath or ".venv" in dirpath:
            continue
            
        # Check exclusions
        rel_dir = os.path.relpath(dirpath, root_dir)
        if any(ex in rel_dir for ex in exclude_dirs):
            continue

        for filename in filenames:
            if not filename.endswith(".py"):
                continue
            if filename in exclusions:
                continue
                
            filepath = os.path.join(dirpath, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    if len(lines) > max_lines:
                        violations.append((os.path.relpath(filepath, root_dir), len(lines)))
            except Exception as e:
                print(f"[WARN] Could not read {filepath}: {e}")

    if violations:
        for path, count in violations:
            print(f"[FAIL] {path}: {count} lines")
        return False
    
    return True
