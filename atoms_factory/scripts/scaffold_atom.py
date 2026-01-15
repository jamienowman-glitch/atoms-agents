import os
import sys
import json
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

def create_file(path, content):
    with open(path, 'w') as f:
        f.write(content)
    print(f"Created: {path}")

def scaffold_atom(atom_name, base_dir):
    atom_dir = Path(base_dir) / "atoms" / "aitom_family" / atom_name
    
    if atom_dir.exists():
        print(f"Atom '{atom_name}' already exists at {atom_dir}")
        print("Ensuring checks for missing buckets...")
    else:
        os.makedirs(atom_dir)
        print(f"Created atom directory: {atom_dir}")

    # Create buckets
    for bucket in BUCKETS:
        bucket_dir = atom_dir / bucket
        if not bucket_dir.exists():
            os.makedirs(bucket_dir)
            print(f"  Created bucket: {bucket}")
        
        # Create placeholders for specific critical buckets if empty
        if bucket in ["tracking", "accessibility", "behaviour", "layout", "typography", "colours", "icons", "data_schema"]:
            placeholder = bucket_dir / "placeholder.md"
            if not any(bucket_dir.iterdir()):
                create_file(placeholder, f"# {bucket} placeholder\n\nThis bucket is required but currently empty for {atom_name}.")

    # Scaffold exposed_tokens/schema.ts
    schema_path = atom_dir / "exposed_tokens" / "schema.ts"
    if not schema_path.exists():
        schema_content = """export const SCHEMA = {
    // Identity
    meta: {
        atom_kind: '""" + atom_name + """',
        version: '1.0.0'
    },
"""
        for group in REQUIRED_TOKEN_GROUPS:
             schema_content += f"""    {group}: {{
        status: 'NA',
        reason: 'Scaffolding placeholder - please implement or confirm NA'
    }},
"""
        schema_content += "};\n"
        create_file(schema_path, schema_content)

    # Scaffold exposed_tokens/default.ts
    default_path = atom_dir / "exposed_tokens" / "default.ts"
    if not default_path.exists():
        create_file(default_path, "import { SCHEMA } from './schema';\n\nexport const DEFAULTS = {\n    ...SCHEMA,\n    // Override with concrete default values here\n};\n")

    # Scaffold views/View.tsx
    view_path = atom_dir / "views" / "View.tsx"
    if not view_path.exists():
        view_content = """import React from 'react';
import type { SCHEMA } from '../exposed_tokens/schema';

// Helper to infer type from SCHEMA (rudimentary)
type AtomProps = {
  tokens: typeof SCHEMA;
};

export const View: React.FC<AtomProps> = ({ tokens }) => {
  return (
    <div style={{
      padding: tokens.spacing?.padding ? \`\${tokens.spacing.padding.top} \${tokens.spacing.padding.right} \${tokens.spacing.padding.bottom} \${tokens.spacing.padding.left}\` : '10px',
      margin: tokens.spacing?.margin ? \`\${tokens.spacing.margin.top} \${tokens.spacing.margin.right} \${tokens.spacing.margin.bottom} \${tokens.spacing.margin.left}\` : '0px',
      backgroundColor: tokens.color?.background || 'transparent',
      border: tokens.border?.width ? \`\${tokens.border.width} \${tokens.border.style} \${tokens.border.color}\` : 'none',
      color: tokens.color?.text || 'inherit',
    }}>
      <div><strong>{tokens.meta?.atom_kind}</strong></div>
      {tokens.content?.text?.content && <div>{tokens.content.text.content}</div>}
    </div>
  );
};
"""
        create_file(view_path, view_content)

    print(f"✅ Scaffolding complete for {atom_name}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scaffold a new atom with 10-bucket structure.")
    parser.add_argument("atom_name", help="Name of the atom (snake_case)")
    parser.add_argument("--root", default=".", help="Root of atoms_factory repo")
    
    args = parser.parse_args()
    scaffold_atom(args.atom_name, args.root)
