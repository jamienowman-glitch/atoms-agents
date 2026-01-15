import os
import sys
import yaml
import glob
import datetime
from pathlib import Path

def get_repo_root():
    # Assumes script is in scripts/ directory
    return Path(__file__).parent.parent.resolve()

def load_yaml(path):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def scan_modes(repo_root):
    modes_dir = repo_root / "registry/framework_modes"
    if not modes_dir.exists():
        print(f"Error: {modes_dir} does not exist.")
        sys.exit(1)

    mode_files = sorted(glob.glob(str(modes_dir / "**/*.yaml"), recursive=True))
    modes_data = []

    for file_path in mode_files:
        rel_path = os.path.relpath(file_path, repo_root)
        try:
            data = load_yaml(file_path)
            
            # Extract fields with fallbacks
            mode_id = data.get("mode_id", data.get("mode_name", f"MISSING:mode_id"))
            framework = data.get("framework", "MISSING:framework")
            
            # Entrypoint mapping
            invoke_entrypoint = data.get("invoke_entrypoint", data.get("entrypoint", "MISSING:invoke_entrypoint"))
            
            supports_streaming = data.get("supports_streaming", "MISSING:supports_streaming")
            
            params = data.get("parameters", {})
            required_params = list(params.keys()) if isinstance(params, dict) else []
            
            pinned_version_ref = data.get("pinned_version_ref", "MISSING:pinned_version_ref")
            notes = data.get("notes", "MISSING:notes")
            
            modes_data.append({
                "path": rel_path,
                "framework": framework,
                "mode_id": mode_id,
                "invoke_entrypoint": invoke_entrypoint,
                "supports_streaming": supports_streaming,
                "required_params": required_params,
                "pinned_version_ref": pinned_version_ref,
                "notes": notes,
                "parse_error": None
            })
        except Exception as e:
            modes_data.append({
                "path": rel_path,
                "parse_error": str(e)
            })
            
    return modes_data

def scan_flows_usage(repo_root):
    flows_dir = repo_root / "registry/flows"
    if not flows_dir.exists():
        return {}
        
    flow_files = sorted(glob.glob(str(flows_dir / "**/*.yaml"), recursive=True))
    usage_map = {} # mode_id -> [flow_path]
    
    for file_path in flow_files:
        rel_path = os.path.relpath(file_path, repo_root)
        try:
            data = load_yaml(file_path)
            # Naive scan for steps with 'mode'
            # Flows usually have 'steps': [ { 'mode': '...' } ] or 'tasks': ...
            # We'll look for 'mode' key recursively or just in obvious places
            # Assuming standard Northstar Flow shape: steps list
            
            steps = data.get("steps", [])
            if isinstance(steps, list):
                for step in steps:
                    if isinstance(step, dict):
                        mode_ref = step.get("mode")
                        if mode_ref:
                            if mode_ref not in usage_map:
                                usage_map[mode_ref] = []
                            if rel_path not in usage_map[mode_ref]:
                                usage_map[mode_ref].append(rel_path)
                                
        except Exception:
            pass # Ignore flow parse errors for usage scan
            
    return usage_map

def generate_report(modes, usage_map):
    lines = []
    lines.append("# Modes Snapshot")
    lines.append(f"Total count: {len(modes)}")
    lines.append("")
    
    for m in modes:
        if m.get("parse_error"):
            lines.append(f"- path: {m['path']}")
            lines.append(f"  PARSE_ERROR: {m['parse_error']}")
            lines.append("")
            continue
            
        lines.append(f"- path: {m['path']}")
        lines.append(f"  framework: {m['framework']}")
        lines.append(f"  mode_id: {m['mode_id']}")
        lines.append(f"  invoke_entrypoint: {m['invoke_entrypoint']}")
        lines.append(f"  supports_streaming: {m['supports_streaming']}")
        lines.append(f"  required_params: {m['required_params']}")
        lines.append(f"  pinned_version_ref: {m['pinned_version_ref']}")
        lines.append(f"  notes: {m['notes']}")
        
        # Usage
        used_by = usage_map.get(m['mode_id'], [])
        if used_by:
            lines.append(f"  used_by: {used_by}")
        else:
            lines.append(f"  used_by: []")
            
        lines.append("")
        
    return "\n".join(lines)

def main():
    root = get_repo_root()
    modes = scan_modes(root)
    usage = scan_flows_usage(root)
    
    report = generate_report(modes, usage)
    
    # Print to stdout
    print(report)
    
    # Write to file
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = root / "registry/run_logs/snapshots"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / f"modes_snapshot.{ts}.md"
    with open(output_file, 'w') as f:
        f.write(report)
        
    print(f"\n[Snapshot written to {output_file}]")

if __name__ == "__main__":
    main()
