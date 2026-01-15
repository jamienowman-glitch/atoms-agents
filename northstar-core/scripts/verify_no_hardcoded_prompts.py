#!/usr/bin/env python3
import os
import ast
import sys
import re

# Tripwire configuration
# We look for forbidden phrases that indicate baked-in task logic.
FORBIDDEN_PHRASES = [
    r"Task: .*? topic",
    r"3-line chorus",
    r"Write draft_v1",
    r"Rewrite this chorus",
    r"Shiritori",
    r"Coding in the Cloud"
]

# Forbidden AST nodes in Adapters
# We don't want adapters defining explicit nodes like "agent_a", "agent_b" unless dynamically.
# Harder to enforce via simple AST, but we can look for strings like "agent_a" in add_node calls.
FORBIDDEN_STRINGS = [
    "agent_ghostwriter_a",
    "agent_shiritori_a"
]

IGNORE_FILES = [
    "verify_no_hardcoded_prompts.py",
    "run_runtime_behaviour_test.py", # Allowed to have the topic injected
    "run_blackboard_test.py",        # Allowed to have the topic injected
    "run_doc_blackboard_test.py"     # Allowed to have the topic injected
]

# We scan these directories
SCAN_DIRS = [
    "runtime/langgraph",
    "runtime/autogen",
    "runtime/crewai",
]

def check_file(filepath):
    """
    Checks a file for forbidden phrases and patterns.
    """
    violations = []
    
    with open(filepath, "r") as f:
        content = f.read()
        
    # Check 1: Regex text search
    for phrase in FORBIDDEN_PHRASES:
        if re.search(phrase, content):
            # Checking if it's inside a comment?
            # Simple check first.
            violations.append(f"Forbidden phrase found: '{phrase}'")

    # Check 2: AST Walk for string literals in code (ignoring comments)
    try:
        tree = ast.parse(content)
        for node in ast.walk(tree):
            if isinstance(node, ast.Str) or (sys.version_info >= (3, 8) and isinstance(node, ast.Constant) and isinstance(node.value, str)):
                s_val = node.s if isinstance(node, ast.Str) else node.value
                
                # Check forbidden constants
                for fs in FORBIDDEN_STRINGS:
                    if fs in s_val:
                        # Allow if it's dynamic? No, we shouldn't see "agent_ghostwriter_a" hardcoded in adapter.
                        # It should come from a variable.
                        violations.append(f"Hardcoded agent ID found: '{fs}'")
                        
    except SyntaxError:
        pass # Not a python file or syntax error
        
    return violations

def main():
    print("--- 🕵️‍♀️ Tripwire: Scanning for Hardcoded Prompts ---")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    failed = False
    
    for relative_dir in SCAN_DIRS:
        abs_dir = os.path.join(base_dir, relative_dir)
        if not os.path.exists(abs_dir): continue
        
        for root, _, files in os.walk(abs_dir):
            for file in files:
                if not file.endswith(".py"): continue
                if file in IGNORE_FILES: continue
                
                path = os.path.join(root, file)
                rel_path = os.path.relpath(path, base_dir)
                
                violations = check_file(path)
                if violations:
                    print(f"❌ VIOLATION in {rel_path}:")
                    for v in violations:
                        print(f"  - {v}")
                    failed = True
                else:
                    # print(f"✅ {rel_path} passed.")
                    pass

    if failed:
        print("\n💥 TRIPWIRE TRIGGERED: Hardcoded prompts or topology detected in Runtime Adapters.")
        sys.exit(1)
    else:
        print("\n✨ All Runtime Adapters are clean of hardcoded logic.")
        sys.exit(0)

if __name__ == "__main__":
    main()
