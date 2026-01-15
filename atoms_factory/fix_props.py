import os
import re

ATOMS_BASE = "/Users/jaynowman/dev/atoms_factory/atoms/aitom_family"

def fix_input_props():
    count = 0
    for root, dirs, files in os.walk(ATOMS_BASE):
        if "View.tsx" in files:
            path = os.path.join(root, "View.tsx")
            with open(path, "r") as f:
                content = f.read()

            # Check if inputProps is used but signature is destructured
            if "inputProps" in content and "export const View: React.FC<Props> = (inputProps)" not in content:
                # Look for destructuring pattern: export const View: React.FC<Props> = ({ ... }) => {
                match = re.search(r"export const View: React.FC<Props> = \((\{.*?\})\) => \{", content, re.DOTALL)
                if match:
                    destructured_args = match.group(1)
                    print(f"Fixing {path}...")
                    
                    # Original: export const View: React.FC<Props> = ({ label = '...' }) => {
                    # New: export const View: React.FC<Props> = (inputProps) => {
                    #      const { label = '...' } = inputProps;
                    
                    new_signature = f"export const View: React.FC<Props> = (inputProps) => {{\n  const {destructured_args} = inputProps;"
                    
                    new_content = content.replace(match.group(0), new_signature)
                    
                    with open(path, "w") as f:
                        f.write(new_content)
                    
                    count += 1
                else:
                    # Maybe it's defined differently?
                    if "const t = (inputProps as any).tokens" in content:
                        print(f"WARNING: clean up check manually for {path}")
                        
    print(f"Total fixed: {count}")

if __name__ == "__main__":
    fix_input_props()
