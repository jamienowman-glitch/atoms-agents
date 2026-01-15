
import sys
import json
from dataclasses import asdict
from typing import Dict, Any
from northstar.registry.schemas import ModeCard

def list_modes(modes: Dict[str, ModeCard]) -> None:
    print(f"{'MODE ID':<30} {'FRAMEWORK':<15} {'OFFICIAL NAME'}")
    print("-" * 65)
    for mode in modes.values():
        print(f"{mode.id:<30} {mode.framework:<15} {mode.official_name}")

def show_mode(modes: Dict[str, ModeCard], mode_id: str) -> None:
    if mode_id not in modes:
        print(f"Mode '{mode_id}' not found.")
        sys.exit(1)
    mode = modes[mode_id]
    print(json.dumps(asdict(mode), indent=2))

def run_mode(modes: Dict[str, ModeCard], profiles: Dict[str, Any], mode_id: str, profile_id: str, input_json: str) -> None:
    if mode_id not in modes:
        print(f"Error: Mode '{mode_id}' not found.")
        sys.exit(1)
    
    if profile_id not in profiles:
        print(f"Error: Profile '{profile_id}' not found.")
        sys.exit(1)

    print(f"Running mode '{mode_id}' with profile '{profile_id}'...")
    # Mock run
    print(f"Input: {input_json}")
    print("Run complete.")
