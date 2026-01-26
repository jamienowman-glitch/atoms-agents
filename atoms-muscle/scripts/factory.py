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
        print(f"⚠️  No service.py in {name}. Skipping.")
        return

    print(f"🏭 Wrapping {category}/{name}...")

    # 1. Analyze Service
    # (Simple string scan for now to avoid complex import pathing issues in this script)
    # in a real scenario, we'd use AST.
    class_name = "Service" # Default
    docstring = "Auto-generated description."
    
    with open(service_file, "r") as f:
        content = f.read()
        for line in content.splitlines():
            if line.strip().startswith("class "):
                class_name = line.strip().split(" ")[1].split("(")[0].strip(":")
                break
    
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

def main():
    root = Path("../src/muscle")
    # If arg provided, just wrap that one
    if len(sys.argv) > 1:
        target = sys.argv[1]
        wrap_muscle(target)
        return

    # Else, scan all
    print(f"🏭 Scanning {root}...")
    for category in root.iterdir():
        if category.is_dir() and not category.name.startswith("_") and category.name != "legacy":
            for muscle in category.iterdir():
                if muscle.is_dir() and not muscle.name.startswith("_"):
                    wrap_muscle(str(muscle))

if __name__ == "__main__":
    main()
