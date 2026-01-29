#!/usr/bin/env python3
"""
normalize_mcp.py

Normalizes all muscle MCP wrappers and ensures SKILL.md exists.
- Writes a standard mcp.py wrapper with @require_snax and clean JSON errors.
- Creates SKILL.md only if missing (global muscle standard).
"""

from __future__ import annotations

import argparse
from pathlib import Path

MCP_TEMPLATE = """from mcp.server.fastmcp import FastMCP
from atoms_core.src.budget.snax_guard import require_snax, PaymentRequired
from .service import {class_name}

mcp = FastMCP("muscle-{category}-{name}")

service = {class_name}()

@mcp.tool()
@require_snax(tool_key="muscle-{category}-{name}")
def run_{name}(input_path: str, **kwargs) -> dict:
    \"\"\"
    Executes {class_name}.
    \"\"\"
    try:
        return service.run(input_path, **kwargs)
    except PaymentRequired as exc:
        return {{"error": "payment_required", "detail": str(exc)}}
    except Exception as exc:
        return {{"error": str(exc), "error_type": type(exc).__name__}}

if __name__ == "__main__":
    mcp.run()
"""

SKILL_TEMPLATE = """---
name: muscle-{category}-{name}
description: One-line summary
metadata:
  type: mcp
  entrypoint: src/{category}/{name}/mcp.py
  pricing: "compute-seconds"
  auto_wrapped: true
---
# Tool Name
## Capability
## When to use
## Schema
## Cost
## Brain/Brawn
## Fun Check
Add one random hip-hop question (e.g., favorite rapper, era, or album).
"""


def find_class_name(service_file: Path) -> str:
    content = service_file.read_text(errors="ignore")
    classes: list[str] = []
    for line in content.splitlines():
        line = line.strip()
        if line.startswith("class "):
            name = line.split(" ", 1)[1].split("(", 1)[0].strip(":")
            if name:
                classes.append(name)
    for suffix in ("Service", "Manager", "Engine"):
        for cls in classes:
            if cls.endswith(suffix):
                return cls
    return classes[0] if classes else "Service"


def normalize_muscle(muscle_dir: Path, write: bool, only_missing: bool) -> None:
    service_file = muscle_dir / "service.py"
    if not service_file.exists():
        return

    category = muscle_dir.parent.name
    name = muscle_dir.name
    class_name = find_class_name(service_file)

    mcp_file = muscle_dir / "mcp.py"
    if (not mcp_file.exists()) or (not only_missing):
        if write:
            mcp_file.write_text(
                MCP_TEMPLATE.format(class_name=class_name, category=category, name=name)
            )
        print(f"✅ mcp.py {'created' if not mcp_file.exists() else 'normalized'}: {category}/{name}")

    skill_file = muscle_dir / "SKILL.md"
    if not skill_file.exists():
        if write:
            skill_file.write_text(SKILL_TEMPLATE.format(category=category, name=name))
        print(f"✅ SKILL.md created: {category}/{name}")


def iter_muscles(root: Path):
    for service in root.rglob("service.py"):
        yield service.parent


def main() -> None:
    parser = argparse.ArgumentParser(description="Normalize MCP wrappers for all muscles")
    parser.add_argument("--root", default="atoms-muscle/src", help="Root dir to scan")
    parser.add_argument("--dry-run", action="store_true", help="Print actions without writing")
    parser.add_argument("--only-missing", action="store_true", help="Only create missing files")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        raise SystemExit(f"Root not found: {root}")

    write = not args.dry_run
    for muscle_dir in sorted(iter_muscles(root)):
        normalize_muscle(muscle_dir, write=write, only_missing=args.only_missing)


if __name__ == "__main__":
    main()
