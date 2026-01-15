import os
from pathlib import Path

ATOMS_DIR = Path("atoms/aitom_family")

def fix_views():
    count = 0
    for atom_dir in ATOMS_DIR.iterdir():
        view_path = atom_dir / "views/View.tsx"
        if view_path.exists():
            content = view_path.read_text()
            # Check for inner broken styles directly
            if "style={fontWeight: 'bold'" in content or "style={fontSize: 10" in content:
                print(f"Fixing {atom_dir.name}...")
                new_content = content
                # We also need to close it with }}
                # The end of that block looks like:
                #       fontFamily: 'monospace'\n    }>\n
                
                new_content = new_content.replace(
                    "fontFamily: 'monospace'\n    }>",
                    "fontFamily: 'monospace'\n    }}>"
                )
                
                # Fix inner div
                new_content = new_content.replace(
                    "<div style={fontWeight: 'bold', marginBottom: 10}>",
                    "<div style={{fontWeight: 'bold', marginBottom: 10}}>"
                )

                # Fix pre tag
                new_content = new_content.replace(
                    "<pre style={fontSize: 10, overflow: 'auto'}>",
                    "<pre style={{fontSize: 10, overflow: 'auto'}}>"
                )
                
                view_path.write_text(new_content)
                count += 1
    
    print(f"Fixed {count} files.")

if __name__ == "__main__":
    fix_views()
