
import os
import sys
from typing import Dict, Any
from northstar.registry.schemas import PersonaCard

def audit_repo(personas: Dict[str, Any]) -> None:
    print("--- Repo Audit ---")
    
    # 1. Check for legacy shims
    if os.path.exists("src/src"):
        print("[FAIL] Legacy 'src/src' shim found.")
        sys.exit(1)
    else:
        print("[PASS] No legacy 'src/src' shim.")
        
    # 2. Check for missing icons
    print("\n--- Persona Icon Check ---")
    missing_icons = 0
    for p in personas.values():
        if isinstance(p, PersonaCard):
            for kind, path in [("light", p.icon_light), ("dark", p.icon_dark)]:
                if path:
                    # Check existence relative to repo root (cwd)
                    if not os.path.exists(path):
                        print(f"[WARN] {p.persona_id} ({kind}): Icon not found at {path}")
                        missing_icons += 1
                        
    if missing_icons == 0:
        print("[PASS] All referenced icons exist.")
    else:
        print(f"[WARN] {missing_icons} missing icons found.")
        
    print("\n[SUCCESS] Audit completed.")
