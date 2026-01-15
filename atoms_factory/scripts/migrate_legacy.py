import os
import shutil
import re
from pathlib import Path

ATOMS_DIR = Path("atoms/aitom_family")
KNOWN_GOOD = {
    "section_container", "columns_grid", "hero_image_banner", "image_with_text",
    "featured_product_card", "featured_collection_grid", "rich_text_block",
    "cta_button", "video_block", "spacer", "divider", "nav_bar",
    "email_text", "email_image", "email_button", "email_social_row",
    "dm_message_text", "dm_card", "dm_gallery", "dm_quick_replies",
    "heading_block" 
}

# New Contract Groups
GROUPS = [
    "content", "typography", "color", "border", "spacing", "size",
    "layout", "effects", "media", "interaction", "linking",
    "data_binding", "tracking", "accessibility", "constraints"
]

def parse_ts_export(file_path):
    """
    Rudimentary parser for 'export default { ... }'
    Returns a dict of key-value pairs found int the object.
    """
    if not file_path.exists():
        return {}
    
    content = file_path.read_text()
    # Simple regex to find  key: 'value' or key: 123
    # This is fragile but likely sufficient for simple token files
    matches = re.findall(r"(\w+):\s*['\"]?([^'\",\n}]+)['\"]?", content)
    return {k: v for k, v in matches}

def generate_schema(atom_name, legacy_data):
    schema_lines = ["export const SCHEMA = {"]
    schema_lines.append(f"    meta: {{ atom_kind: '{atom_name}', version: '1.0.0' }},")

    # Mapping logic
    # Default to NA
    mapped = {g: {"status": "NA", "reason": "Legacy Migration"} for g in GROUPS}

    # COLOR
    if "colors" in legacy_data:
        mapped["color"] = legacy_data["colors"]
    
    # TYPOGRAPHY
    if "typography" in legacy_data:
        mapped["typography"] = legacy_data["typography"]

    # CONTENT (Copy)
    if "copy" in legacy_data:
        mapped["content"] = legacy_data["copy"]

    # LAYOUT
    if "layout" in legacy_data:
        mapped["layout"] = legacy_data["layout"] # Might overwrite position
    
    # BORDER / EFFECTS (Style)
    if "style" in legacy_data:
        # Heuristic: split style into border/effects if possible, or just dump into border for now
        mapped["border"] = legacy_data["style"] 
        # mapped["effects"] = ... complicated without deep parse

    # LINKING
    if "links" in legacy_data:
        mapped["linking"] = legacy_data["links"]

    # MEDIA
    if "media" in legacy_data:
        mapped["media"] = legacy_data["media"]

    # Write out keys
    for group in GROUPS:
        val = mapped[group]
        # Format dictionary as string
        val_str = str(val).replace("'", '"') 
        # Clean up python dict string to JS-ish
        schema_lines.append(f"    {group}: {val_str},")

    schema_lines.append("};")
    return "\n".join(schema_lines)

def generate_defaults():
    return "import { SCHEMA } from './schema';\n\nexport const DEFAULTS = {\n    ...SCHEMA\n};\n"

def generate_view(atom_name):
    return f"""import React from 'react';
import type {{ SCHEMA }} from '../exposed_tokens/schema';

type AtomProps = {{
  tokens: typeof SCHEMA;
}};

export const View: React.FC<AtomProps> = ({{ tokens }}) => {{
  return (
    <div style={{
      padding: '20px',
      border: '1px dashed #ccc',
      backgroundColor: '#f9f9f9',
      fontFamily: 'monospace'
    }}>
      <div style={{fontWeight: 'bold', marginBottom: 10}}>{atom_name} (Migrated)</div>
      <pre style={{fontSize: 10, overflow: 'auto'}}>
        {{JSON.stringify(tokens, null, 2)}}
      </pre>
    </div>
  );
}};
"""

def migrate():
    count_migrated = 0
    count_deleted = 0
    count_skipped = 0

    if not ATOMS_DIR.exists():
        print(f"Error: {ATOMS_DIR} not found.")
        return

    for atom_dir in ATOMS_DIR.iterdir():
        if not atom_dir.is_dir() or atom_dir.name.startswith("_"):
            continue
        
        name = atom_dir.name
        if name in KNOWN_GOOD:
            count_skipped += 1
            print(f"Skipping known good: {name}")
            continue

        token_index = atom_dir / "exposed_tokens" / "_index.ts"
        
        if token_index.exists():
            print(f"Migrating {name}...")
            
            # 1. Harvest Data
            legacy_data = {}
            tokens_dir = atom_dir / "exposed_tokens"
            
            subfiles = ["colors", "typography", "layout", "copy", "style", "links", "media"]
            for sub in subfiles:
                sub_path = tokens_dir / sub / "default.ts"
                data = parse_ts_export(sub_path)
                if data:
                    legacy_data[sub] = data

            # 2. Generate New Files
            schema_ts = generate_schema(name, legacy_data)
            defaults_ts = generate_defaults()
            view_tsx = generate_view(name)

            (tokens_dir / "schema.ts").write_text(schema_ts)
            (tokens_dir / "default.ts").write_text(defaults_ts)
            
            view_dir = atom_dir / "views"
            view_dir.mkdir(exist_ok=True)
            (view_dir / "View.tsx").write_text(view_tsx)

            # 3. Cleanup
            # Delete _index.ts and subfolders
            token_index.unlink()
            for sub in subfiles:
                sub_dir = tokens_dir / sub
                if sub_dir.exists():
                    shutil.rmtree(sub_dir)
            
            # Clean root junk
            for item in atom_dir.iterdir():
                if item.name not in ["exposed_tokens", "views"]:
                     if item.is_dir():
                         shutil.rmtree(item)
                     else:
                         item.unlink()

            count_migrated += 1
            
        else:
            print(f"Deleting empty/invalid atom: {name}")
            shutil.rmtree(atom_dir)
            count_deleted += 1

    print("-" * 30)
    print(f"Migration Complete.")
    print(f"Migrated: {count_migrated}")
    print(f"Deleted: {count_deleted}")
    print(f"Skipped: {count_skipped}")

if __name__ == "__main__":
    migrate()
