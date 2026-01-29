#!/usr/bin/env python3
"""
prepare_deploy.py

Mission: Build a clean, isolated deployment slice for a specific Muscle.
Enforces:
1. No northstar-engines imports (Fail Fast).
2. Explicit atoms-core slicing (Copy only what is needed).
3. Standard Dockerfile generation.

Usage:
    python3 scripts/prepare_deploy.py atoms-muscle/src/video/extract/service.py
"""

import os
import sys
import shutil
import ast
import argparse
import re
from pathlib import Path

# Constants
ATOMS_CORE_ROOT = Path("atoms-core")
BUILD_ROOT = Path("_build")
FORBIDDEN_IMPORTS = ["northstar_engines", "northstar-engines", "northstar.engines"]
FORBIDDEN_PATTERNS = [
    re.compile(r"northstar[-_.]engines", re.IGNORECASE),
]

def fail_fast(message):
    print(f"❌ FATAL: {message}")
    sys.exit(1)

def scan_forbidden_text(file_path: Path) -> None:
    content = file_path.read_text()
    for pattern in FORBIDDEN_PATTERNS:
        if pattern.search(content):
            fail_fast(f"Forbidden reference detected in {file_path}: {pattern.pattern}")


def parse_imports(file_path: Path, broad_imports: set[str]) -> set[str]:
    """
    Parses a python file and returns a set of top-level imports.
    Also checks for forbidden imports.
    """
    scan_forbidden_text(file_path)
    with open(file_path, "r") as f:
        try:
            tree = ast.parse(f.read(), filename=file_path)
        except SyntaxError as e:
            fail_fast(f"Syntax error in {file_path}: {e}")

    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                check_forbidden(alias.name)
                imports.add(alias.name)
                if alias.name == "atoms_core":
                    broad_imports.add(alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                check_forbidden(node.module)
                # Capture the full module path to analyze atoms_core usage
                imports.add(node.module)
                if node.module == "atoms_core":
                    broad_imports.add(node.module)
                if node.module == "atoms_core.src":
                    for alias in node.names:
                        imports.add(f"{node.module}.{alias.name}")
    return imports

def check_forbidden(module_name):
    for bad in FORBIDDEN_IMPORTS:
        if module_name.startswith(bad):
            fail_fast(f"Forbidden import detected: '{module_name}'. The Rescue Rule strictly prohibits importing '{bad}'.")

def get_atoms_core_modules(imports, broad_imports: set[str]):
    """
    Identifies which atoms_core modules are needed.
    Returns a set of paths relative to atoms-core/src (e.g., 'identity', 'audio').
    """
    if broad_imports:
        fail_fast("Broad 'atoms_core' imports detected. Use explicit 'atoms_core.src.<module>' imports only.")
    modules = set()
    for imp in imports:
        # Expected pattern: atoms_core.src.<module>
        if imp.startswith("atoms_core.src."):
            parts = imp.split(".")
            if len(parts) >= 3:
                modules.add(parts[2]) # atoms_core.src.identity -> identity
    return modules

def prepare_build_dir(muscle_key):
    target_dir = BUILD_ROOT / muscle_key
    if target_dir.exists():
        shutil.rmtree(target_dir)
    target_dir.mkdir(parents=True)
    return target_dir

def copy_muscle(muscle_path, build_dir):
    """
    Copies the muscle source to _build/<key>/src/<category>/<name>/
    muscle_path is .../src/category/name/service.py
    """
    # muscle_path = atoms-muscle/src/category/name/service.py
    # we want to copy the folder containing service.py
    muscle_dir = muscle_path.parent

    # Calculate relative path from atoms-muscle root
    # assuming standard structure atoms-muscle/src/...
    try:
        # finding 'src' in parts
        parts = muscle_dir.parts
        src_index = parts.index("src")
        # rel_path e.g. src/category/name
        rel_path = Path(*parts[src_index:])
    except ValueError:
        fail_fast(f"Muscle path {muscle_path} does not follow standard 'src/...' structure.")

    dest_dir = build_dir / rel_path
    shutil.copytree(muscle_dir, dest_dir)
    print(f"✅ Copied muscle code to {dest_dir}")

    # Enforce Law: mcp.py must exist
    if not (dest_dir / "mcp.py").exists():
        fail_fast(f"Muscle Law Violation: mcp.py not found in {dest_dir}. Every muscle must have an mcp.py wrapper.")

    src_root = build_dir / "src"
    src_root.mkdir(exist_ok=True)
    (src_root / "__init__.py").touch()

    return dest_dir


def collect_imports(root_dir: Path) -> tuple[set[str], set[str]]:
    imports: set[str] = set()
    broad_imports: set[str] = set()
    for py_file in root_dir.rglob("*.py"):
        imports.update(parse_imports(py_file, broad_imports))
    return imports, broad_imports

def copy_atoms_core_slice(modules, build_dir):
    """
    Copies requested modules from atoms-core/src/X to _build/<key>/atoms_core/src/X
    """
    core_dest = build_dir / "atoms_core"
    core_src_dest = core_dest / "src"
    core_src_dest.mkdir(parents=True)

    # Always create __init__.py files
    (core_dest / "__init__.py").touch()
    (core_src_dest / "__init__.py").touch()

    if not modules:
        print("ℹ️  No explicit atoms-core imports found. Skipping core slice.")
        return

    src_root = ATOMS_CORE_ROOT / "src"
    if not src_root.exists():
        fail_fast(f"atoms-core/src not found at {src_root}")

    for mod in modules:
        source = src_root / mod
        if source.exists() and source.is_dir():
            # Fail fast if forbidden refs exist inside atoms-core slice
            for py_file in source.rglob("*.py"):
                scan_forbidden_text(py_file)
            shutil.copytree(source, core_src_dest / mod)
            print(f"✅ Copied atoms-core module: {mod}")
        else:
            print(f"⚠️  Warning: Requested module '{mod}' not found in atoms-core/src/")

def generate_dockerfile(build_dir, muscle_rel_path):
    dockerfile = f"""
FROM python:3.11-slim

WORKDIR /app

# System dependencies (standard set)
RUN apt-get update && apt-get install -y --no-install-recommends \\
    ffmpeg \\
    libsm6 \\
    libxext6 \\
    && rm -rf /var/lib/apt/lists/*

# Copy code
COPY . /app

# Install python deps
RUN pip install --no-cache-dir -r requirements.txt

# Environment
ENV PYTHONPATH="/app"
ENV PORT=8080

# Entrypoint (Assumes mcp.py exists as per Law)
CMD ["fastmcp", "run", "{muscle_rel_path}/mcp.py"]
"""
    with open(build_dir / "Dockerfile", "w") as f:
        f.write(dockerfile.strip())
    print("✅ Generated Dockerfile")

def generate_requirements(build_dir):
    # Standard runtime deps
    reqs = [
        "fastmcp",
        "pydantic",
        "httpx",
        "uvicorn",
        "numpy",
        # Add common scientific/AI libs here or make it dynamic
        # For now, keeping it minimal to pass build
    ]
    with open(build_dir / "requirements.txt", "w") as f:
        f.write("\n".join(reqs))
    print("✅ Generated requirements.txt")

def main():
    parser = argparse.ArgumentParser(description="Prepare Muscle for Deployment")
    parser.add_argument("service_path", help="Path to the muscle service.py (e.g., atoms-muscle/src/video/extract/service.py)")
    args = parser.parse_args()

    service_path = Path(args.service_path)
    if not service_path.exists():
        fail_fast(f"File not found: {service_path}")
    if service_path.name != "service.py":
        fail_fast("Input must be a service.py file at atoms-muscle/src/{category}/{name}/service.py")

    # Derive key
    # src/category/name -> muscle-category-name
    try:
        parts = service_path.parent.parts
        src_index = parts.index("src")
        category = parts[src_index+1]
        name = parts[src_index+2]
        muscle_key = f"muscle-{category}-{name}"
    except (ValueError, IndexError):
        muscle_key = "muscle-unknown"

    print(f"🚀 Preparing deploy for {muscle_key}...")

    # 1. Analyze Imports (Recursive Safety Check)
    print("🔍 Scanning for forbidden imports and collecting atoms-core usage...")
    muscle_dir = service_path.parent
    imports, broad_imports = collect_imports(muscle_dir)
    core_modules = get_atoms_core_modules(imports, broad_imports)

    # 2. Prepare Build Dir
    build_dir = prepare_build_dir(muscle_key)

    # 3. Copy Muscle Code
    muscle_dir_dest = copy_muscle(service_path, build_dir)

    # Calculate relative path for Docker CMD
    # _build/key/src/cat/name -> src/cat/name
    muscle_rel_path = muscle_dir_dest.relative_to(build_dir)

    # 4. Copy Atoms Core Slice
    copy_atoms_core_slice(core_modules, build_dir)

    # 5. Generate Artifacts
    generate_requirements(build_dir)
    generate_dockerfile(build_dir, muscle_rel_path)

    print(f"\n✨ Build complete: {build_dir}")
    print(f"👉 To build: cd {build_dir} && docker build -t {muscle_key} .")

if __name__ == "__main__":
    main()
