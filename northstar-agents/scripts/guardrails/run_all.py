import sys
import os
import subprocess

# Add current directory to path to allow importing checks
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from checks.line_limit import check_line_limits
from checks.prompt_leaks import check_prompt_leaks
from checks.atomicity import check_atomicity
from checks.secrets import check_secrets
from checks.legacy_refs import check_legacy_refs
# from checks.import_boundaries import check_import_boundaries # Adding if present, or I can skip if I didn't move it.
# I did not move import_boundaries.py yet, it's still in the parent dir.
# Prompt: "Add scripts/guardrails/run_all.py and small modules under scripts/guardrails/checks/"
# I will keep import_boundaries.py where it is for now or move it?
# The prompt didn't strictly say "move import_boundaries", but "Guardrails to implement: ... 1..5".
# I'll import import_boundaries from parent if needed, but for now I'll just run the 5 modules I implemented as python calls?
# Actually, importing them is cleaner if I made them modules.
# But wait, run_all.py is in scripts/guardrails/, checks are in scripts/guardrails/checks/.


def run_external_check(command, description):
    print(f"--- {description} ---")
    try:
        # sys.executable to use current venv
        cmd_list = command.split()
        result = subprocess.run(cmd_list, check=False)
        if result.returncode != 0:
            print(f"[FAIL] {description} failed (exit code {result.returncode})")
            return False
        return True
    except Exception as e:
        print(f"[ERROR] Failed to run {description}: {e}")
        return False


def main():
    root = os.getcwd()
    all_passed = True

    # 1. Execute new python-based checks (imported)
    # Note: These return True/False and print their own output

    if not check_line_limits(root):
        all_passed = False
    print("")
    if not check_prompt_leaks(root):
        all_passed = False
    print("")
    if not check_atomicity(root):
        all_passed = False
    print("")
    if not check_secrets(root):
        all_passed = False
    print("")
    if not check_legacy_refs(root):
        all_passed = False
    print("")
    # Import check_namespace dynamically to avoid path issues if needed, or assume it's in path
    try:
        from scripts.guardrails.check_namespace import check_namespace

        if not check_namespace():  # wait, check_namespace throws sys.exit or returns?
            # My implementation calls sys.exit(1) on failure.
            # I should update it to return bool for consistency with others, or run it as external check.
            # Let's run it as external check to catch the exit.
            pass
    except ImportError:
        pass  # We will run it as external check below
    print("")

    # 2. Run external tools (lint, tests)
    # The existing import_boundaries.py is still in this dir, run it as script
    # Or I should have moved it. I'll just run it as a script for now to preserve it.
    python_exe = sys.executable

    external_checks = [
        (f"{python_exe} scripts/guardrails/check_namespace.py", "Namespace Check"),
        (
            f"{python_exe} scripts/guardrails/import_boundaries.py",
            "Import Boundary Check",
        ),
        (f"{python_exe} scripts/guardrails/check_no_dotenv.py", "No DotEnv Check"),
        (
            f"{python_exe} -m ruff check src scripts tests",
            "Ruff Lint",
        ),  # Explicit paths to check relevant code
        (f"{python_exe} -m mypy src/northstar", "Mypy Type Check"),
        (f"{python_exe} -m pytest tests", "Unit Tests"),
    ]

    for cmd, desc in external_checks:
        if not run_external_check(cmd, desc):
            all_passed = False
        print("")

    if not all_passed:
        print("[FAIL] One or more guardrails failed.")
        sys.exit(1)

    print("[SUCCESS] All guardrails passed!")
    sys.exit(0)


if __name__ == "__main__":
    main()
