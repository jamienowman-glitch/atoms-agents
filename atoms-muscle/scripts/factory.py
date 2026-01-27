import os
import sys
import inspect
import importlib.util
from pathlib import Path

# TEMPLATE: MCP SERVER
MCP_TEMPLATE = """from mcp.server.fastmcp import FastMCP
from .service import {class_name}

# Initialize FastMCP
mcp = FastMCP("muscle-{category}-{name}")

# Initialize Service
service = {class_name}()

@mcp.tool()
def run_{name}(input_path: str, **kwargs) -> dict:
    \"""
    Executes the {class_name} logic.
    \"""
    return service.run(input_path, **kwargs)

if __name__ == "__main__":
    mcp.run()
"""

# TEMPLATE: SKILL.MD
SKILL_TEMPLATE = """---
name: muscle-{category}-{name}
description: {docstring}
metadata:
  type: mcp
  entrypoint: src/muscle/{category}/{name}/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Usage
This muscle provides `{name}` capabilities via MCP.

## Inputs
*   `input_path`: Path to the file (S3 or Local).

## Outputs
*   JSON Dictionary containing processing results.
"""

def wrap_muscle(muscle_path: str):
    path = Path(muscle_path)
    if not path.exists():
        print(f"❌ Path not found: {muscle_path}")
        return

    category = path.parent.name
    name = path.name
    service_file = path / "service.py"
    
    if not service_file.exists():
        # Check for core/logic.py if service.py is missing or minimal
        if (path / "core/logic.py").exists():
             service_file = path / "core/logic.py"
        else:
             print(f"⚠️  No service.py in {name}. Skipping.")
             return

    print(f"🏭 Wrapping {category}/{name}...")

    # 1. Analyze Service
    # (Simple string scan for now to avoid complex import pathing issues in this script)
    # in a real scenario, we'd use AST.
    class_name = "Service" # Default
    docstring = "Auto-generated description."
    found_classes = []
    
    with open(service_file, "r") as f:
        content = f.read()
        for line in content.splitlines():
            if line.strip().startswith("class "):
                cls = line.strip().split(" ")[1].split("(")[0].strip(":")
                found_classes.append(cls)

    # Heuristic: Prefer *Service, *Manager, *Engine
    for cls in found_classes:
        if cls.endswith("Service") or cls.endswith("Manager") or cls.endswith("Engine"):
            class_name = cls
            break
    else:
        if found_classes:
            class_name = found_classes[0]
    
    # 2. Write mcp.py
    mcp_file = path / "mcp.py"
    if not mcp_file.exists():
        with open(mcp_file, "w") as f:
            f.write(MCP_TEMPLATE.format(
                class_name=class_name,
                category=category,
                name=name
            ))
        print(f"   ✅ Created mcp.py")
    else:
        print(f"   ⏩ mcp.py exists")

    # 3. Write SKILL.md
    skill_file = path / "SKILL.md"
    if not skill_file.exists():
        with open(skill_file, "w") as f:
            f.write(SKILL_TEMPLATE.format(
                class_name=class_name,
                category=category,
                name=name,
                docstring=docstring
            ))
        print(f"   ✅ Created SKILL.md")
    else:
        print(f"   ⏩ SKILL.md exists")

def scan_directory(path: Path):
    print(f"🏭 Scanning {path}...")
    # Check if the path itself is a muscle (has service.py)
    if (path / "service.py").exists():
        wrap_muscle(str(path))
        return

    # Otherwise scan children
    for item in path.iterdir():
        if item.is_dir() and not item.name.startswith("_") and item.name != "legacy":
            # Check if this child is a muscle
            if (item / "service.py").exists():
                 wrap_muscle(str(item))
            # Or if it's a category containing muscles (recurse one level)
            else:
                for subitem in item.iterdir():
                    if subitem.is_dir() and (subitem / "service.py").exists():
                         wrap_muscle(str(subitem))

def main():
    root = Path("../src/muscle")
    
    # If arg provided, scan it as a root
    if len(sys.argv) > 1:
        target = Path(sys.argv[1])
        if not target.exists():
             print(f"❌ Target not found: {target}")
             return
        scan_directory(target)
        return

    # Default: Scan src/muscle
    scan_directory(root)

if __name__ == "__main__":
    main()
