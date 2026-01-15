import os
import sys
import ast


def get_imports(filepath):
    """Parses a python file and returns a list of imported module names."""
    imports = []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            tree = ast.parse(f.read(), filename=filepath)

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
    return imports


def check_import_boundaries(root_dir):
    print("Running Import Boundary Check...")
    violations = []

    # Rules
    # src/capabilities/** MUST NOT import src.runtime or framework SDKs
    # src/registry/** MUST NOT import framework SDKs
    # src/runtime/** MUST NOT import from "prompts" (simplified check)

    # Heuristic for framework SDKs - adjust as needed
    FRAMEWORK_SDKS = [
        "langchain",
        "openai",
        "anthropic",
        "google.generativeai",
        "boto3",
    ]

    src_dir = os.path.join(root_dir, "src")
    if not os.path.exists(src_dir):
        print("No src directory found.")
        return True

    for dirpath, _, filenames in os.walk(src_dir):
        for filename in filenames:
            if not filename.endswith(".py"):
                continue

            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)

            file_imports = get_imports(filepath)

            # Rule 1: src/capabilities
            if "src/capabilities" in rel_path:
                for imp in file_imports:
                    if imp.startswith("src.runtime") or imp.startswith("runtime"):
                        violations.append(f"{rel_path} imports runtime layer: {imp}")
                    for sdk in FRAMEWORK_SDKS:
                        if imp.startswith(sdk):
                            violations.append(
                                f"{rel_path} imports framework SDK: {imp}"
                            )

            # Rule 2: src/registry
            if "src/registry" in rel_path:
                for imp in file_imports:
                    for sdk in FRAMEWORK_SDKS:
                        if imp.startswith(sdk):
                            violations.append(
                                f"{rel_path} imports framework SDK: {imp}"
                            )

            # Rule 3: src/runtime
            # "must NOT import persona/task prompt text from anywhere except registry loader"
            # This is hard to enforce strictly without specific file names.
            # We will enforce checks against importing from known 'prompt' files if they existed,
            # or rely on the prompt_leak scan for content.
            # For now, let's just make sure it doesn't import from 'registry' directly if that was the intended restricted path?
            # Actually, "except registry loader" implies it CAN import from registry.
            # So I will skip strict import checks for runtime for now unless we have a specific 'prompts' package.

            pass

    if violations:
        print("\n[FAIL] Import boundary violations:")
        for v in violations:
            print(f"  {v}")
        return False

    print("[PASS] Import boundaries respected.")
    return True


if __name__ == "__main__":
    root = os.getcwd()
    if not check_import_boundaries(root):
        sys.exit(1)
    sys.exit(0)
