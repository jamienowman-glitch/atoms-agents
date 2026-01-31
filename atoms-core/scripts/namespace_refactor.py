import os
import shutil
from pathlib import Path

REPOS = {
    "atoms-core": "atoms_core",
    "atoms-muscle": "atoms_muscle",
    "atoms-connectors": "atoms_connectors"
}

ROOT = Path("/Users/jaynowman/dev")

def refactor_namespaces():
    print("🚀 Starting Python Namespace Refactor...")
    
    for repo_name, namespace in REPOS.items():
        src_dir = ROOT / repo_name / "src"
        target_dir = src_dir / namespace
        
        if not src_dir.exists():
            print(f"⚠️  Skipping {repo_name}: src not found")
            continue
            
        print(f"📦 Processing {repo_name} -> {namespace}")
        
        # Create target
        target_dir.mkdir(exist_ok=True)
        
        # Move items
        moved_count = 0
        for item in os.listdir(src_dir):
            if item == namespace or item.startswith("."):
                continue
            
            source_path = src_dir / item
            dest_path = target_dir / item
            
            print(f"  -> Moving {item}")
            shutil.move(str(source_path), str(dest_path))
            moved_count += 1
            
        # Create __init__.py
        init_file = target_dir / "__init__.py"
        if not init_file.exists():
            print("  -> Creating __init__.py")
            init_file.touch()
            
        print(f"✅ Moved {moved_count} items in {repo_name}")

if __name__ == "__main__":
    refactor_namespaces()
