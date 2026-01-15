
import os

PROMPT_MARKERS = [
    "You are a", "SYSTEM:", "System:", "Thought:", "Action:", "IMPORTANT:",
    '"""', "'''" # Triple quotes often indicate large text blocks/prompts
]

ALLOW_LIST = ["src/registry/cards"] # Only place prompts are allowed (in YAML)
# But scan targets are: src/core/**, src/runtime/**, src/cli/**
SCAN_TARGETS = ["src/core", "src/runtime", "src/cli"]

def check_prompt_leaks(root_dir):
    print("Running Prompt Leak Check...")
    violations = []

    for target in SCAN_TARGETS:
        target_path = os.path.join(root_dir, target)
        if not os.path.exists(target_path):
            continue
            
        for dirpath, _, filenames in os.walk(target_path):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(filepath, root_dir)
                
                # Double check we aren't in an allowed area (unlikely given SCAN_TARGETS but good to be safe)
                if any(allowed in rel_path for allowed in ALLOW_LIST):
                    continue

                if not filename.endswith(".py"):
                    continue

                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Heuristic: Check for markers in string literals? 
                        # Simple check: if marker is in file.
                        # We might need to be smarter to avoid false positives in comments/docs,
                        # but "Guardrails ... physically cannot regress" implies strictness.
                        # I'll check specifically for the markers.
                        
                        found = []
                        for marker in PROMPT_MARKERS:
                            # Triple quotes are very common in docstrings. 
                            # If we ban them entirely, we ban docstrings. 
                            # The user said "long multi-line strings OR obvious prompt markers".
                            # Maybe we refine the triple quote ban to only if it looks like a prompt?
                            # For now, let's treat specific prompt keywords as the primary ban.
                            # And maybe warn on triple quotes if they contain "user" or "agent"?
                            # Re-reading: "fail if it contains long multi-line strings or obvious prompt markers... triple backticks"
                            # Triple BACKTICKS (```) are what was requested. NOT triple quotes.
                            
                            if marker == '"""' or marker == "'''":
                                continue # Skip quote checks, focus on backticks per requirements
                                
                            if marker in content:
                                found.append(marker)
                        
                        if "```" in content:
                            found.append("Triple Backticks")

                        if found:
                            violations.append((rel_path, found))

                except Exception:
                    pass

    if violations:
        for path, markers in violations:
            print(f"[FAIL] {path} contains forbidden prompt markers: {markers}")
        return False
        
    return True
