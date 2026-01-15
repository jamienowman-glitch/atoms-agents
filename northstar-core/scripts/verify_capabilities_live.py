import importlib
import os
import sys
import argparse
import json
from dataclasses import dataclass
from typing import Dict, Any, List

@dataclass
class TestContext:
    model_id: str = "amazon.nova-micro-v1:0"
    model_id_vision: str = "amazon.nova-lite-v1:0"
    adk_model_id: str = "gemini-2.0-flash-exp"

def load_capability(path: str):
    spec = importlib.util.spec_from_file_location("cap_mod", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.Capability

def run_all(only_cap_id: str = None):
    base_dir = "src/capabilities"
    # 0. RUN GATES
    print("--- RUNNING PROVIDER FRESHNESS GATES ---")
    gate_exit = os.system("PYTHONPATH=. python3 scripts/verify_provider_connectivity.py")
    if gate_exit != 0:
        print("GATE FAILURE: Provider connectivity checks failed. Aborting verification.")
        sys.exit(1)
    print("--- GATES PASSED ---")

    # 1. Discover
    results = []
    os.makedirs("docs/verification_artifacts", exist_ok=True)
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".py") and file != "__init__.py":
                path = os.path.join(root, file)
                try:
                    Cap = load_capability(path)
                    
                    if only_cap_id and Cap.capability_id != only_cap_id:
                        continue
                        
                    print(f"Testing {Cap.capability_id} ({Cap.vendor})...")
                    ctx = TestContext()
                    result = Cap.live_test(ctx)
                    results.append(result)
                    print(f"  Result: {result['status']}")
                    
                    # Save Artifacts
                    if result['status'] == "PASS":
                         evidence = result.get('evidence', '')
                         filename = f"docs/verification_artifacts/{Cap.capability_id}.txt"
                         with open(filename, "w") as f:
                             f.write(evidence)
                         print(f"  Saved evidence to {filename}")

                    if result['status'] == "FAIL":
                        print(f"  Error: {result.get('error')}")
                    elif result['status'] == "PASS":
                        print(f"  Evidence: {result.get('evidence')[:100]}...")
                        
                except Exception as e:
                    print(f"Error loading {path}: {e}")

    # 2. Matrix Output
    output_md = "| Capability | Vendor | Status | Model ID | Reason/Evidence |\n|---|---|---|---|---|\n"
    for r in results:
        reason = r.get('evidence') or r.get('error') or r.get('skip_reason') or ""
        reason = reason.replace("\n", " ")[:100] # Truncate
        model_id = r.get('model_id', 'N/A')
        output_md += f"| {r['capability_id']} | {r['provider']} | {r['status']} | {model_id} | {reason} |\n"
        
    print("\n--- MATRIX ---")
    print(output_md)
    
    with open("docs/matrices/model_capabilities_matrix.md", "w") as f:
        f.write("# Live Capability Matrix\n\n" + output_md)
        
    with open("docs/matrices/model_capabilities_matrix.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="Run only specific capability ID")
    args = parser.parse_args()
    
    run_all(args.only)
