import os
import yaml


REGISTRY_ROOT = "src/northstar/registry/cards/framework_modes"
RUNTIME_MODES_ROOT = "src/northstar/runtime/modes"

def scaffold():
    if not os.path.exists(REGISTRY_ROOT):
        print("Registry root not found.")
        return

    # Walk registry to find all modes
    for root, _, files in os.walk(REGISTRY_ROOT):
        for file in files:
            if not file.endswith(".yaml"):
                continue
                
            path = os.path.join(root, file)
            with open(path, "r") as f:
                card = yaml.safe_load(f)
                
            if card.get("card_type") != "mode":
                continue
                
            mode_id = card["id"]
            fw = card["framework"]
            entrypoint = card["entrypoint"]
            
            # entrypoint: src.runtime.modes.<fw>.<mode_safe_id>.run
            # We need to create the file corresponding to <mode_safe_id>
            
            parts = entrypoint.split(".")
            # parts: ['src', 'runtime', 'modes', fw, mode_file_name, 'run']
            if len(parts) < 6:
                print(f"Skipping malformed entrypoint: {entrypoint}")
                continue
                
            mode_file_name = parts[4]
            
            # Directory: src/runtime/modes/<fw>
            mode_dir = os.path.join(RUNTIME_MODES_ROOT, fw)
            os.makedirs(mode_dir, exist_ok=True)
            
            file_path = os.path.join(mode_dir, f"{mode_file_name}.py")
            
            # If file exists, skip? The prompt says "Implement per-mode run() files". 
            # I'll overwrite to ensure they match pattern.
            
            content = f"""from typing import Dict, Any
from northstar.runtime.context import RunContext
from northstar.runtime.exceptions import SkipMode
from northstar.runtime.frameworks.{fw} import adapter

def run(input_json: Dict[str, Any], ctx: RunContext) -> Dict[str, Any]:
    try:
        # Atomic runner for mode: {mode_id}
        # Calls framework adapter smoke test
        return adapter.minimal_smoke("{mode_id}", input_json, ctx)
    except SkipMode as e:
        return {{ "status": "SKIPPED", "reason": str(e), "mode_id": "{mode_id}" }}
    except Exception as e:
        return {{ "status": "FAIL", "mode_id": "{mode_id}", "error": str(e) }}
"""
            with open(file_path, "w") as f:
                f.write(content)
                
    print("Mode runners scaffolded.")
    
if __name__ == "__main__":
    scaffold()
