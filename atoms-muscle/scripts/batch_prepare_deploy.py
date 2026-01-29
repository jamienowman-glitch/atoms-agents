#!/usr/bin/env python3
"""
batch_prepare_deploy.py

Runs prepare_deploy.py for every muscle in atoms-muscle/src.
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
from pathlib import Path


def iter_services(root: Path):
    for service in root.rglob("service.py"):
        yield service


def main() -> None:
    parser = argparse.ArgumentParser(description="Batch build deploy slices for all muscles")
    parser.add_argument("--root", default="atoms-muscle/src", help="Root dir to scan")
    parser.add_argument("--dry-run", action="store_true", help="Print commands without running")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of muscles")
    parser.add_argument("--clean", dest="clean", action="store_true", help="Delete _build before run (default)")
    parser.add_argument("--no-clean", dest="clean", action="store_false", help="Keep existing _build")
    parser.add_argument("--clean-after", action="store_true", help="Delete _build after run")
    parser.set_defaults(clean=True)
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        raise SystemExit(f"Root not found: {root}")

    repo_root = Path(__file__).resolve().parents[2]
    prepare = repo_root / "atoms-muscle" / "scripts" / "prepare_deploy.py"
    if not prepare.exists():
        raise SystemExit(f"prepare_deploy.py not found: {prepare}")
    build_root = repo_root / "_build"

    if args.clean and build_root.exists() and not args.dry_run:
        shutil.rmtree(build_root)

    services = sorted(iter_services(root))
    if args.limit and args.limit > 0:
        services = services[: args.limit]

    failures: list[str] = []
    for service in services:
        cmd = ["python3", str(prepare), str(service)]
        if args.dry_run:
            print("DRY", " ".join(cmd))
            continue
        print("RUN", " ".join(cmd))
        result = subprocess.run(cmd, cwd=repo_root)
        if result.returncode != 0:
            failures.append(str(service))

    if failures:
        print("\nFAILED:")
        for f in failures:
            print(f"- {f}")
        raise SystemExit(1)

    if args.clean_after and build_root.exists() and not args.dry_run:
        shutil.rmtree(build_root)

    print(f"\nOK: {len(services)} muscles processed")


if __name__ == "__main__":
    main()
