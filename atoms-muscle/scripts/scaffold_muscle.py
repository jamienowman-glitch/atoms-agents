import os
import argparse
import shutil
import subprocess
from pathlib import Path

# Templates
SERVICE_TEMPLATE = """import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class {class_name}Service:
    def __init__(self):
        # Initialize clients or load configuration here
        logger.info("Initializing {class_name}Service")

    async def execute_task(self, params: Dict[str, Any]) -> Dict[str, Any]:
        \"\"\"
        Core logic for the muscle.
        \"\"\"
        logger.info(f"Executing task with params: {params}")
        
        # TODO: Implement heavy lifting here
        
        return {"status": "success", "result": "Task completed"}
"""

MCP_TEMPLATE = """from typing import Any, Dict, List
from .service import {class_name}Service

# Initialize service
service = {class_name}Service()

def list_tools() -> List[Dict[str, Any]]:
    return [
        {
            "name": "{tool_name}",
            "description": "Description for {tool_name}. What does this muscle do?",
            "input_schema": {
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "description": "The specific action to perform."
                    }
                },
                "required": ["action"]
            }
        }
    ]

async def call_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    if name == "{tool_name}":
        try:
            result = await service.execute_task(arguments)
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Result: {result}"
                    }
                ]
            }
        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error: {str(e)}"
                    }
                ],
                "isError": True
            }

    raise ValueError(f"Unknown tool: {name}")
"""

SKILL_TEMPLATE = """---
name: {muscle_name}
description: {description}
category: {category}
---

# {muscle_title} Skill

## Overview
{description}

## Tools

### `{tool_name}`
**Description**: ...

**Arguments**:
*   `action` (string, required): ...

## Usage Examples

> "Run the {muscle_name} task..."
```json
{
  "action": "default_action"
}
```
"""

def to_camel_case(snake_str):
    return "".join(x.capitalize() for x in snake_str.lower().split("_"))

def main():
    parser = argparse.ArgumentParser(description="Scaffold a new Atoms Muscle")
    parser.add_argument("--name", required=True, help="Internal name of the muscle (snake_case), e.g. video_transcoder")
    parser.add_argument("--category", required=True, help="Category folder, e.g. video, audio, cad")
    parser.add_argument("--description", required=False, default="A new heavy lifting muscle.", help="Short description")
    
    args = parser.parse_args()
    
    name = args.name.lower().replace("-", "_")
    category = args.category.lower()
    class_name = to_camel_case(name)
    tool_name = f"run_{name}" # standardize tool naming? or just use name? Let's use name.
    # Actually, often tool names are verbs. Let's just use the name for now or `use_{name}`.
    # The user manual says "create_site". So maybe just the name if it's unique enough.
    # Let's default to `name`.
    tool_name = name 

    root_dir = Path(__file__).parent.parent
    src_dir = root_dir / "src"
    target_dir = src_dir / category / name
    
    print(f"🏭 MANUFACTURING MUSCLE: {name} ({category})")
    
    # 1. GIT BRANCH
    branch_name = f"feat/muscle-{name.replace('_', '-')}"
    try:
        current_branch = subprocess.check_output(["git", "branch", "--show-current"]).decode().strip()
        if current_branch != branch_name:
            print(f"🌿 Creating/Switching to branch: {branch_name}")
            # Check if exists
            subprocess.run(["git", "checkout", "-b", branch_name], check=False) 
            # If failed (exists), checkout
            subprocess.run(["git", "checkout", branch_name], check=False)
    except Exception as e:
        print(f"⚠️ Git operation failed (ignoring for dev/test): {e}")

    # 2. CREATE DIRECTORIES
    if target_dir.exists():
        print(f"⚠️ Directory {target_dir} already exists. Overwriting files.")
    else:
        target_dir.mkdir(parents=True, exist_ok=True)
        # Create empty __init__.py
        (target_dir / "__init__.py").touch()
        print(f"📁 Created directory: {target_dir}")

    # 3. WRITE TEMPLATES
    
    # service.py
    service_content = SERVICE_TEMPLATE.replace("{class_name}", class_name)
    with open(target_dir / "service.py", "w") as f:
        f.write(service_content)
    print("✅ Created service.py")

    # mcp.py
    mcp_content = MCP_TEMPLATE.replace("{class_name}", class_name).replace("{tool_name}", tool_name)
    with open(target_dir / "mcp.py", "w") as f:
        f.write(mcp_content)
    print("✅ Created mcp.py")

    # SKILL.md
    skill_content = SKILL_TEMPLATE.replace("{muscle_name}", name)\
                                  .replace("{muscle_title}", name.replace("_", " ").title())\
                                  .replace("{description}", args.description)\
                                  .replace("{category}", category)\
                                  .replace("{tool_name}", tool_name)
    with open(target_dir / "SKILL.md", "w") as f:
        f.write(skill_content)
    print("✅ Created SKILL.md")

    # AGENTS.md (Law)
    source_law = root_dir / "AGENTS.md"
    if source_law.exists():
        shutil.copy(source_law, target_dir / "AGENTS.md")
        print("⚖️  Injected AGENTS.md (Muscle Law)")
    else:
        print("⚠️ Could not find root AGENTS.md to copy.")

    # 4. Success
    print("\n🎉 MUSCLE SCAFFOLDED SUCCESSFULLY!")
    print(f"👉 Location: src/{category}/{name}")
    print("👉 Next Step: Run 'python3 scripts/sync_registry.py' (once you build it!)")

if __name__ == "__main__":
    main()
