import os
import yaml
import glob
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.resolve()
REGISTRY_DIR = REPO_ROOT / "registry/framework_modes"
INTEGRATION_DIR = REPO_ROOT / "integration"

def patch_cards():
    files = glob.glob(str(REGISTRY_DIR / "**/*.yaml"), recursive=True)
    count = 0
    
    for fpath in files:
        with open(fpath, 'r') as f:
            data = yaml.safe_load(f) or {}
            
        changed = False
        
        # 1. framework
        if "framework" not in data:
            # Infer from path (registry/framework_modes/<framework>/...)
            rel = os.path.relpath(fpath, REGISTRY_DIR)
            framework = rel.split(os.sep)[0]
            data["framework"] = framework
            changed = True
        
        framework = data["framework"]

        # 2. mode_id
        if "mode_id" not in data:
            # Use mode_name if present
            if "mode_name" in data:
                data["mode_id"] = data.pop("mode_name")
                changed = True
            else:
                data["mode_id"] = f"{framework}.{Path(fpath).stem}"
                changed = True
                
        # 3. invoke_entrypoint
        if "invoke_entrypoint" not in data:
            if "entrypoint" in data:
                data["invoke_entrypoint"] = data.pop("entrypoint")
                changed = True
        
        # Normalize entrypoint to use ":" check? (User said support both, or convert to one)
        # Choosing to assume existing are OK, just ensuring field existence.
        
        # 4. supports_streaming
        if "supports_streaming" not in data:
            # Heuristic: if filename contains stream, maybe?
            # Safer to default to "none" as requested unless sure.
            if "stream" in data["mode_id"].lower():
                 # Valid values: "token", "event", "none"
                 # Astream modes usually event
                 if "astream" in data["mode_id"].lower():
                     data["supports_streaming"] = "event"
                 elif "token" in data["mode_id"].lower():
                     data["supports_streaming"] = "token"
                 else:
                     data["supports_streaming"] = "none" # Default safe
            else:
                data["supports_streaming"] = "none"
            changed = True

        # 5. required_params
        if "required_params" not in data:
            # Check "parameters"
            params = data.get("parameters", {})
            if params:
                # If parameters dict exists, assume keys are required? 
                # Or just list them. Schema says list[str].
                data["required_params"] = list(params.keys())
            else:
                data["required_params"] = []
            changed = True

        # 6. pinned_version_ref
        if "pinned_version_ref" not in data:
            # Check if integration/<framework>/PINNED_VERSION.md exists
            pinned_path = INTEGRATION_DIR / framework / "PINNED_VERSION.md"
            if pinned_path.exists():
                data["pinned_version_ref"] = f"integration/{framework}/PINNED_VERSION.md"
            else:
                data["pinned_version_ref"] = "UNKNOWN"
            changed = True
            
        # 7. notes
        if "notes" not in data:
            data["notes"] = "UNKNOWN"
            changed = True
            
        if changed:
            print(f"Patching {os.path.relpath(fpath, REPO_ROOT)}")
            with open(fpath, 'w') as f:
                # Dump with default_flow_style=False to look somewhat nice, but pyyaml isn't perfect
                yaml.dump(data, f, sort_keys=False)
            count += 1
            
    print(f"Patched {count} files.")

if __name__ == "__main__":
    patch_cards()
