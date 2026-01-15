
import os
import sys
import yaml
import json
import glob
import importlib
import re
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)

def load_yaml(path):
    with open(path, "r") as f:
        return yaml.safe_load(f)

def find_files(pattern):
    return glob.glob(os.path.join(PROJECT_ROOT, pattern), recursive=True)

def check_import(entrypoint_str):
    """
    Checks if an entrypoint string (module.class.method or module.function) is importable.
    Returns (True, None) or (False, ErrorMessage).
    """
    if not entrypoint_str:
        return False, "No entrypoint defined"
    
    try:
        if ":" in entrypoint_str:
            module_name, obj_name = entrypoint_str.split(":", 1)
        else:
            parts = entrypoint_str.split(".")
            module_name = ".".join(parts[:-1])
            obj_name = parts[-1]
            
        mod = importlib.import_module(module_name)
        
        # Traverse attributes
        obj = mod
        for part in obj_name.split("."):
            obj = getattr(obj, part)
            
        return True, None
    except Exception as e:
        return False, str(e)

def extract_official_docs_url(framework):
    docs_path = os.path.join(PROJECT_ROOT, f"integration/{framework}/OFFICIAL_DOCS.md")
    if not os.path.exists(docs_path):
        return "MISSING"
    
    urls = []
    with open(docs_path, "r") as f:
        content = f.read()
        urls = re.findall(r'https?://[^\s)]+', content)
    
    return urls[0] if urls else "MISSING"

def extract_pinned_version(framework):
    pin_path = os.path.join(PROJECT_ROOT, f"integration/{framework}/PINNED_VERSION.md")
    if not os.path.exists(pin_path):
        return "MISSING"
    
    with open(pin_path, "r") as f:
        return f.read().strip()

def scan_framework_modes():
    modes = []
    mode_files = find_files("registry/framework_modes/**/*.yaml")
    
    # Pre-scan flows for usage
    flow_files = find_files("registry/flows/**/*.yaml")
    usage_map = {}
    for flow_path in flow_files:
        try:
            flow_data = load_yaml(flow_path)
            # Naive scan of steps
            steps = flow_data.get("steps", [])
            for step in steps:
                mode = step.get("mode")
                if mode:
                    if mode not in usage_map:
                        usage_map[mode] = []
                    usage_map[mode].append(os.path.relpath(flow_path, PROJECT_ROOT))
        except:
            pass # Ignore broken flows

    # Verification scripts
    verify_scripts = find_files("scripts/verify_*.py")
    test_files = find_files("tests/**/*.py")
    all_test_content = ""
    for fpath in verify_scripts + test_files:
        with open(fpath, "r", errors="ignore") as f:
            all_test_content += f.read() + "\n"

    for yaml_path in mode_files:
        try:
            data = load_yaml(yaml_path)
            entrypoint = data.get("entrypoint")
            framework = yaml_path.split("/")[-2]
            
            # Import check
            import_ok, import_err = check_import(entrypoint)
            
            # Docs
            official_docs = extract_official_docs_url(framework)
            pinned_ver = extract_pinned_version(framework)
            
            # Status
            verified = False
            if entrypoint and entrypoint in all_test_content:
                verified = True
            
            status = "RED"
            if import_ok:
                status = "YELLOW"
                if verified:
                    status = "GREEN"
            
            mode_id = data.get("mode_id", "UNKNOWN")
            
            mode_info = {
                "framework": framework,
                "mode_id": mode_id,
                "registry_path": os.path.relpath(yaml_path, PROJECT_ROOT),
                "invoke_entrypoint": entrypoint,
                "entrypoint_exists": "YES" if entrypoint else "NO",
                "entrypoint_import_check": "PASS" if import_ok else f"FAIL: {import_err}",
                "supports_streaming": data.get("supports_streaming", "MISSING"),
                "required_params": str(list(data.get("parameters", {}).keys())) if "parameters" in data else "MISSING",
                "notes": "Present" if "description" in data else "MISSING",
                "pinned_version_ref": pinned_ver,
                "integration_docs_present": "YES" if official_docs != "MISSING" else "NO",
                "official_docs_urls": official_docs,
                "used_by": usage_map.get(mode_id, []),
                "verified_by_script": verified,
                "status": status
            }
            modes.append(mode_info)
        except Exception as e:
            print(f"Error processing {yaml_path}: {e}")

    return modes

def scan_capabilities():
    caps = []
    cap_files = find_files("src/capabilities/**/*.py")
    
    # Verification scripts content reuse
    verify_scripts = find_files("scripts/verify_*.py")
    test_files = find_files("tests/**/*.py")
    all_test_content = ""
    for fpath in verify_scripts + test_files:
        with open(fpath, "r", errors="ignore") as f:
            all_test_content += f.read() + "\n"

    for py_path in cap_files:
        if "__init__" in py_path: continue
        
        try:
            rel_path = os.path.relpath(py_path, PROJECT_ROOT)
            parts = rel_path.split(os.sep)
            # src/capabilities/VENDOR/CAPABILITY.py
            vendor = parts[2]
            cap_name = parts[3].replace(".py", "")
            
            # Dynamic import to check attributes
            module_name = rel_path.replace(".py", "").replace(os.sep, ".")
            import_ok, import_err = check_import(module_name)
            
            entrypoints = []
            if import_ok:
                mod = importlib.import_module(module_name)
                for attr in dir(mod):
                    if "Capability" in attr or "get_config" in attr:
                        entrypoints.append(attr)
            
            verified = module_name in all_test_content or rel_path in all_test_content
            
            status = "RED"
            if import_ok:
                status = "YELLOW"
                if verified:
                    status = "GREEN"

            cap_info = {
                "vendor": vendor,
                "capability_name": cap_name,
                "module_path": rel_path,
                "entrypoint_candidates": entrypoints,
                "entrypoint_primary": "get_config" if "get_config" in str(entrypoints) else "UNKNOWN",
                "requires_credentials": "UNKNOWN", # Hard to verify without AST parsing
                "supports_streaming": "N/A", # Capabilities usually config gens
                "status": status,
                "verified_by_script": verified
            }
            caps.append(cap_info)
            
        except Exception as e:
             print(f"Error processing {py_path}: {e}")
            
    return caps

def write_matrices(modes, caps):
    # JSON
    with open("docs/matrices/framework_modes_matrix.json", "w") as f:
        json.dump(modes, f, indent=2)
    with open("docs/matrices/model_capabilities_matrix.json", "w") as f:
        json.dump(caps, f, indent=2)

    # Markdown - Modes
    with open("docs/matrices/framework_modes_matrix.md", "w") as f:
        f.write("# Framework Modes Matrix\n\n")
        f.write("| Status | Framework | Mode ID | Entrypoint Check | Streaming | Tests |\n")
        f.write("|---|---|---|---|---|---|\n")
        for m in modes:
            icon = {"GREEN": "✅", "YELLOW": "⚠️", "RED": "❌"}[m["status"]]
            f.write(f"| {icon} | {m['framework']} | `{m['mode_id']}` | {m['entrypoint_import_check']} | {m['supports_streaming']} | {m['verified_by_script']} |\n")

    # Markdown - Capabilities
    with open("docs/matrices/model_capabilities_matrix.md", "w") as f:
        f.write("# Model Capabilities Matrix\n\n")
        f.write("| Status | Vendor | Capability | Module | Verification |\n")
        f.write("|---|---|---|---|---|\n")
        for c in caps:
            icon = {"GREEN": "✅", "YELLOW": "⚠️", "RED": "❌"}[c["status"]]
            f.write(f"| {icon} | {c['vendor']} | {c['capability_name']} | `{c['module_path']}` | {c['verified_by_script']} |\n")

    # Master Index
    with open("docs/matrices/capability_master_index.md", "w") as f:
        f.write("# Repo Truth Master Index\n\n")
        f.write("Generated from filesystem scan.\n\n")
        f.write("- [Framework Modes Matrix](framework_modes_matrix.md)\n")
        f.write("- [Model Capabilities Matrix](model_capabilities_matrix.md)\n\n")
        
        f.write("## Totals\n")
        f.write(f"- Framework Modes: {len(modes)}\n")
        f.write(f"- Capabilities: {len(caps)}\n\n")
        
        f.write("## Known Gaps (Repo Truth)\n")
        red_modes = [m for m in modes if m['status'] == 'RED']
        missing_stream = [m for m in modes if m['supports_streaming'] == 'MISSING' or m['supports_streaming'] is None]
        
        f.write(f"### Red Modes ({len(red_modes)})\n")
        for m in red_modes:
            f.write(f"- {m['mode_id']}: {m['entrypoint_import_check']}\n")
            
        f.write(f"\n### Missing Streaming Metadata ({len(missing_stream)})\n")
        for m in missing_stream:
            f.write(f"- {m['mode_id']}\n")


def print_summary(modes, caps):
    print("\n--- MATRIX GENERATION COMPLETE ---")
    print(f"Framework Modes: {len(modes)}")
    print(f"Capabilities:    {len(caps)}")
    
    m_green = len([m for m in modes if m['status'] == 'GREEN'])
    m_yellow = len([m for m in modes if m['status'] == 'YELLOW'])
    m_red = len([m for m in modes if m['status'] == 'RED'])
    
    print(f"\nModes Status: GREEN={m_green}, YELLOW={m_yellow}, RED={m_red}")
    
    if m_red > 0:
        print("\nTOP RED ITEMS (Modes):")
        for m in [m for m in modes if m['status'] == 'RED'][:10]:
            print(f"- {m['mode_id']} ({m['framework']}): {m['entrypoint_import_check']}")
            
    c_green = len([c for c in caps if c['status'] == 'GREEN'])
    c_yellow = len([c for c in caps if c['status'] == 'YELLOW'])
    c_red = len([c for c in caps if c['status'] == 'RED'])
    
    print(f"\nCaps Status:  GREEN={c_green}, YELLOW={c_yellow}, RED={c_red}")


if __name__ == "__main__":
    print("Scanning Framework Modes...")
    modes = scan_framework_modes()
    print("Scanning Capabilities...")
    caps = scan_capabilities()
    
    print("Writing Matrices...")
    write_matrices(modes, caps)
    
    print_summary(modes, caps)
