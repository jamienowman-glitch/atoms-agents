
import os
import ast

def check_atomicity(root_dir):
    print("Running Atomicity Check (One Mode/Provider per file)...")
    violations = []

    # 1. Modes: src/runtime/modes/** -> max 1 public run() entrypoint
    modes_dir = os.path.join(root_dir, "src/runtime/modes")
    if os.path.exists(modes_dir):
        for dirpath, _, filenames in os.walk(modes_dir):
            for filename in filenames:
                if not filename.endswith(".py") or filename == "__init__.py":
                    continue
                
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        tree = ast.parse(f.read())
                    
                    # Count public run() functions or methods
                    # "public run() entrypoint"
                    run_count = 0
                    
                    # Check module-level functions
                    for node in tree.body:
                        if isinstance(node, ast.FunctionDef):
                            if node.name == "run":
                                run_count += 1
                        elif isinstance(node, ast.ClassDef):
                            # Check methods in class
                            for item in node.body:
                                if isinstance(item, ast.FunctionDef):
                                    if item.name == "run" and not item.name.startswith("_"):
                                        run_count += 1
                                        
                    if run_count > 1:
                        violations.append(f"{os.path.relpath(filepath, root_dir)}: Defines {run_count} 'run()' entrypoints. Max 1 allowed.")
                        
                except Exception as e:
                    print(f"[WARN] Failed to parse {filepath}: {e}")

    # 2. Providers: src/runtime/providers/** -> max 1 concrete provider client class
    providers_dir = os.path.join(root_dir, "src/runtime/providers")
    if os.path.exists(providers_dir):
        for dirpath, _, filenames in os.walk(providers_dir):
            for filename in filenames:
                if not filename.endswith(".py") or filename == "__init__.py":
                    continue
                
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        tree = ast.parse(f.read())
                    
                    class_count = 0
                    for node in tree.body:
                        if isinstance(node, ast.ClassDef):
                            # Exclude Exceptions or private classes if needed? 
                            # "concrete provider client class". 
                            if not node.name.startswith("_") and "Exception" not in node.name:
                                class_count += 1
                    
                    if class_count > 1:
                        violations.append(f"{os.path.relpath(filepath, root_dir)}: Defines {class_count} classes. Max 1 provider client allowed.")

                except Exception as e:
                    print(f"[WARN] Failed to parse {filepath}: {e}")

    if violations:
        for v in violations:
            print(f"[FAIL] {v}")
        return False

    return True
