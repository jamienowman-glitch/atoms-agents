
import os
import re

root = "/Users/jaynowman/dev/aitoms_fam/aitom_family"
skip_prefix = "haze_"

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def write_file(path, content):
    ensure_dir(os.path.dirname(path))
    with open(path, 'w') as f:
        f.write(content)

# 1. Standard Token Definitions
def update_tokens(atom_path):
    # Colors
    write_file(os.path.join(atom_path, "exposed_tokens/colors/default.ts"), 
"""export default {
  surface: '#ffffff',
  text_primary: '#000000', 
  border: '#cccccc',
  accent: '#0066cc'
};""")
    
    # Typography (Axes + Basics)
    write_file(os.path.join(atom_path, "exposed_tokens/typography/default.ts"), 
"""export default {
  wght: 400,
  wdth: 100,
  slnt: 0,
  ital: 0,
  opsz: 14,
  fontSize: '16px',
  lineHeight: '1.5'
};""")

    # Layout
    write_file(os.path.join(atom_path, "exposed_tokens/layout/default.ts"), 
"""export default {
  padding: '16px',
  gap: '8px',
  radius: '4px'
};""")

    # Index
    write_file(os.path.join(atom_path, "exposed_tokens/_index.ts"), 
"""import colors from './colors/default';
import typography from './typography/default';
import layout from './layout/default';

export const tokens = {
  colors,
  typography,
  layout,
  // Fallbacks for others to avoid undefined
  copy: {},
  links: {},
  position: {},
  style: {},
  media: {},
  motion: {}
};
""")

# 2. Update Styles
def update_styles(atom_path):
    css_path = os.path.join(atom_path, "views/styles.css")
    # Append or overwrite standard var usage
    # We apply vars to a wrapper class usually, or *
    
    # Check if empty or simple
    base_css = ""
    if os.path.exists(css_path):
        with open(css_path, 'r') as f:
            base_css = f.read()
    
    # Ensure our vars are used. 
    # Since we are wrapping in View.tsx with a style block, the vars are defined there.
    # We just need to make sure the inner elements consume them if they differ from default inheritance.
    # Color and Font usually inherit.
    # Background might need explicit setting.
    
    new_css = base_css + """
/* Workbench Token Wiring */
.atom-token-wrapper {
  background-color: var(--ns-surface, #fff);
  color: var(--ns-text-primary, #000);
  border: 1px solid var(--ns-border, transparent);
  padding: var(--ns-padding, 0);
  border-radius: var(--ns-radius, 0);
  gap: var(--ns-gap, 0);
  font-family: "Roboto Flex", sans-serif;
  font-variation-settings: var(--ns-font-variation);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}
/*.atom-token-wrapper > * {
   We let children behave normally, inheriting font/color 
}*/
"""
    write_file(css_path, new_css)


# 3. Inject View Wrapper
def update_view(atom_path):
    view_path = os.path.join(atom_path, "views/View.tsx")
    if not os.path.exists(view_path):
        return

    with open(view_path, 'r') as f:
        content = f.read()

    # Check if already upgraded
    if "atom-token-wrapper" in content:
        return

    # Add Import
    if "import { tokens as defaultTokens }" not in content:
        # Try to insert after last import
        imports_end = content.rfind("import ")
        if imports_end != -1:
             # Find end of that line
             line_end = content.find("\n", imports_end)
             content = content[:line_end+1] + "import { tokens as defaultTokens } from '../exposed_tokens/_index';\n" + content[line_end+1:]
        else:
             content = "import { tokens as defaultTokens } from '../exposed_tokens/_index';\n" + content

    # Inject Logic start of component
    # Look for "export const View: React.FC<Props> = (inputProps) => {" or similar
    # My generated files follow a pattern.
    pattern = r"(export const View:.*?=>\s*\{)"
    match = re.search(pattern, content)
    
    logic_block = """
  // Token Wiring
  const t = (inputProps as any).tokens || defaultTokens;
  const wrapperStyle = {
    '--ns-surface': t.colors?.surface ?? '#fff',
    '--ns-text-primary': t.colors?.text_primary ?? '#000',
    '--ns-border': t.colors?.border ?? '#ccc',
    '--ns-padding': t.layout?.padding ?? '16px',
    '--ns-gap': t.layout?.gap ?? '8px',
    '--ns-radius': t.layout?.radius ?? '4px',
    '--ns-font-variation': `'wght' ${t.typography?.wght ?? 400}, 'wdth' ${t.typography?.wdth ?? 100}, 'slnt' ${t.typography?.slnt ?? 0}, 'ital' ${t.typography?.ital ?? 0}, 'opsz' ${t.typography?.opsz ?? 14}`,
    fontFamily: '"Roboto Flex", sans-serif',
  } as React.CSSProperties;
"""
    
    if match:
        content = content[:match.end()] + logic_block + content[match.end():]
    
    # Wrap Return
    # Find `return (`
    # We need to be careful with layout. 
    # If the View returns a single <div className="..."> ... </div>, 
    # wrapping it in ANTOHER div might break specific layout specs if the parent expected the root to be X.
    # But for "Workbench Ready" verification of atoms in isolation, a wrapper is usually fine.
    # AND the user explicitly said: "implement a wrapper that visibly shows token changes ... This is allowed"
    
    ret_idx = content.find("return (")
    if ret_idx != -1:
        # Insert opening wrapper
        content = content[:ret_idx + 8] + "\n    <div className=\"atom-token-wrapper\" style={wrapperStyle}>" + content[ret_idx + 8:]
        
        # Find closing `);` 
        # This is risky if there are multiple, but usually View ends with it.
        last_paren = content.rfind(");")
        if last_paren != -1:
            content = content[:last_paren] + "    </div>\n  " + content[last_paren:]

    write_file(view_path, content)


# EXECUTE
atoms = sorted(os.listdir(root))
for atom in atoms:
    path = os.path.join(root, atom)
    if not os.path.isdir(path) or atom.startswith(skip_prefix):
        continue
    
    print(f"Upgrading {atom}...")
    try:
        update_tokens(path)
        update_styles(path)
        update_view(path)
    except Exception as e:
        print(f"Error upgrading {atom}: {e}")

print("Upgrade complete.")
