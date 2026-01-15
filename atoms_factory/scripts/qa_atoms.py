import os
import sys
import argparse
from pathlib import Path

# Constants
BUCKETS = [
    "exposed_tokens",
    "views",
    "behaviour",
    "layout",
    "typography",
    "colours",
    "icons",
    "data_schema",
    "tracking",
    "accessibility"
]

REQUIRED_TOKEN_GROUPS = [
    "content", "typography", "color", "border", "spacing", "size",
    "layout", "effects", "media", "interaction", "linking",
    "data_binding", "tracking", "accessibility", "constraints"
]

def check_atom(atom_name, base_dir):
    atom_dir = Path(base_dir) / "atoms" / "aitom_family" / atom_name
    
    if not atom_dir.exists():
        print(f"❌ Atom '{atom_name}' not found at {atom_dir}")
        return False

    errors = []

    # 1. Structure Check
    for bucket in BUCKETS:
        bucket_dir = atom_dir / bucket
        if not bucket_dir.exists():
            errors.append(f"Missing bucket: {bucket}")
        else:
            # Check for emptiness
            if not any(bucket_dir.iterdir()):
                errors.append(f"Empty bucket: {bucket} (must contain files or placeholder.md)")

    # 2. Schema Check
    schema_path = atom_dir / "exposed_tokens" / "schema.ts"
    if not schema_path.exists():
         # Fallback check for _index.ts but warn
         index_path = atom_dir / "exposed_tokens" / "_index.ts"
         if not index_path.exists():
             errors.append("Missing exposed_tokens/schema.ts (and no _index.ts found)")
         else:
             print(f"⚠️  Using _index.ts instead of schema.ts for {atom_name}")

    # 3. Default Check
    default_path = atom_dir / "exposed_tokens" / "default.ts"
    if not default_path.exists():
         errors.append("Missing exposed_tokens/default.ts")

    # 4. Content Analysis (Rudimentary)
    # Ideally we'd parse the TS, but for now we'll grep for keys in schema.ts
    if schema_path.exists():
        with open(schema_path, 'r') as f:
            content = f.read()
            for group in REQUIRED_TOKEN_GROUPS:
                if group not in content:
                    errors.append(f"Schema missing token group: {group}")

    if errors:
        print(f"❌ QA FAILED for {atom_name}:")
        for e in errors:
            print(f"  - {e}")
        return False
    else:
        print(f"✅ QA PASSED for {atom_name}")
        return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QA an atom for compliance.")
    parser.add_argument("--atom", help="Name of the atom (snake_case)", required=True)
    parser.add_argument("--root", default=".", help="Root of atoms_factory repo")
    
    args = parser.parse_args()
    success = check_atom(args.atom, args.root)
    sys.exit(0 if success else 1)
