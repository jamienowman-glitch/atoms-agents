import os
import shutil
from pathlib import Path

# Config
APP_ROOT = Path("atoms-app/src/app")
TARGET_ROOT = APP_ROOT / "_flat_config"
IGNORE_DIRS = {"_flat_config", "api", "node_modules"}

def flatten_configs():
    print(f"🚀 Starting Great Flattening in {APP_ROOT}")
    
    # 1. Find Pages
    pages = []
    for root, dirs, files in os.walk(APP_ROOT):
        # Skip ignored
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        if "page.tsx" in files:
            full_path = Path(root) / "page.tsx"
            rel_path = full_path.relative_to(APP_ROOT)
            
            # Generate ID
            # e.g. dashboard/infra/cost/page.tsx -> dashboard_infra_cost
            parts = rel_path.parent.parts
            if not parts:
                slug = "home"
            else:
                slug = "_".join(parts).replace("[", "").replace("]", "").lower()
            
            pages.append({
                "source": full_path,
                "slug": slug,
                "original_path": str(rel_path.parent)
            })

    print(f"📦 Found {len(pages)} pages to flatten.")

    # 2. Copy and Index
    index_links = []
    
    for page in pages:
        slug = page["slug"]
        dest_dir = TARGET_ROOT / slug
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy file
        shutil.copy2(page["source"], dest_dir / "page.tsx")
        
        # Add to index list
        link = f'<li><a href="/_flat_config/{slug}" class="text-blue-500 hover:underline">{slug}</a> <span class="text-gray-400 text-sm">({page["original_path"]})</span></li>'
        index_links.append(link)
        
        print(f"  -> Copied {slug}")

    # 3. Generate Master Index
    index_content = f"""
    import React from 'react';

    export default function FlatConfigIndex() {{
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">🎛️ The Flat Config Index ({len(pages)} Pages)</h1>
                <div className="bg-gray-900 text-gray-100 p-6 rounded-xl border border-gray-700">
                    <ul className="space-y-2 font-mono">
                        {chr(10).join(sorted(index_links))}
                    </ul>
                </div>
            </div>
        );
    }}
    """
    
    with open(TARGET_ROOT / "page.tsx", "w") as f:
        f.write(index_content)
        
    print("✅ Master Index Generated at _flat_config/page.tsx")

if __name__ == "__main__":
    flatten_configs()
