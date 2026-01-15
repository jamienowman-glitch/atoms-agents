import os

ATOMS_BASE = "/Users/jaynowman/dev/atoms_factory/atoms/aitom_family"

def fix_imports():
    count = 0
    for root, dirs, files in os.walk(ATOMS_BASE):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                path = os.path.join(root, file)
                with open(path, "r") as f:
                    content = f.read()
                
                # Check for the bad import
                if "'../_shared/typography'" in content:
                    new_content = content.replace("'../_shared/typography'", "'../../_shared/typography'")
                    with open(path, "w") as f:
                        f.write(new_content)
                    print(f"Fixed: {path}")
                    count += 1
                elif '"../_shared/typography"' in content:
                    new_content = content.replace('"../_shared/typography"', '"../../_shared/typography"')
                    with open(path, "w") as f:
                        f.write(new_content)
                    print(f"Fixed: {path}")
                    count += 1

    print(f"Total files fixed: {count}")

if __name__ == "__main__":
    fix_imports()
