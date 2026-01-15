import os

ATOM_ROOT = "/Users/jaynowman/dev/aitoms_fam/aitom_family"
ATOMS = ["haze_fpv_canvas", "haze_fpv_hud", "haze_node_info"]

BUCKETS = [
    "behaviour", "layout", "views", "typography", "colours", 
    "icons", "data_schema", "tracking", "accessibility", "exposed_tokens"
]

def ensure_file(path, content):
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write(content)
        print(f"Created {path}")

def standardize():
    for atom in ATOMS:
        atom_path = os.path.join(ATOM_ROOT, atom)
        if not os.path.exists(atom_path):
            print(f"Skipping {atom} (not found)")
            continue

        print(f"Processing {atom}...")
        
        # 1. Create Buckets
        for bucket in BUCKETS:
            bucket_path = os.path.join(atom_path, bucket)
            if not os.path.exists(bucket_path):
                os.makedirs(bucket_path)
                print(f"  Created bucket: {bucket}")
            
            # 2. Populate N/A or default
            if bucket == "exposed_tokens":
                index_ts = os.path.join(bucket_path, "_index.ts")
                if not os.path.exists(index_ts):
                    ensure_file(index_ts, "export const tokens = {};\n")
            
            elif bucket == "views":
                view_tsx = os.path.join(bucket_path, "View.tsx")
                if not os.path.exists(view_tsx):
                    content = f"""import React from 'react';
import {{ tokens as defaultTokens }} from '../exposed_tokens/_index';

export const View = (inputProps: any) => {{
  const t = inputProps.tokens || defaultTokens;
  return <div>{atom} (Placeholder)</div>;
}};
"""
                    ensure_file(view_tsx, content)
            
            else:
                # Add check for empty bucket
                if not os.listdir(bucket_path):
                    readme = os.path.join(bucket_path, "README.md")
                    ensure_file(readme, "# Not Applicable\n\nThis bucket is currently empty.\n")

if __name__ == "__main__":
    standardize()
