import os
import sys
import yaml
import json
import importlib.util
import datetime
from pathlib import Path
from typing import Dict, Any
from src.capabilities._shared.model_resolver import resolve_bedrock_model, resolve_adk_model
from src.core.blackboard import Blackboard
from runtime.bedrock.gateway import BedrockGateway

# Ensure root is in path
sys.path.append(os.getcwd())

TIMESTAMP = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
MODES_DIR = "registry/framework_modes"
EVIDENCE_ROOT = f"docs/evidence/modes/{TIMESTAMP}"
MATRIX_MD = "docs/matrices/framework_modes_matrix.md"
MATRIX_JSON = "docs/matrices/framework_modes_matrix.json"

results = []

def log(msg):
    print(f"[Mode Sweep] {msg}")

def run_gate():
    log("Running Provider Gate...")
    ret = os.system("PYTHONPATH=. python3 scripts/verify_providers_live.py")
    if ret != 0:
        log("CRITICAL: Gates failed. Aborting.")
        sys.exit(1)
    log("Gates PASSED.")

def resolve_model(provider: str, capability: str = "text") -> str:
    # Use the shared resolver if it exists, else prompt error
    try:
        if provider == "bedrock": 
            return resolve_bedrock_model(capability)
        if provider == "adk": 
            return resolve_adk_model(capability)
    except:
        return "N/A"
    return "N/A"

def run_mode(framework: str, mode_file: str):
    mode_path = Path(mode_file)
    mode_id = mode_path.stem
    evidence_dir = f"{EVIDENCE_ROOT}/{framework}/{mode_id}"
    os.makedirs(evidence_dir, exist_ok=True)
    
    log(f"Testing {framework} :: {mode_id}...")
    
    result = {
        "framework": framework,
        "mode_id": mode_id,
        "status": "Starting",
        "model_id": "N/A",
        "evidence_path": evidence_dir
    }
    
    try:
        # 1. Load Config
        with open(mode_path) as f:
            config = yaml.safe_load(f)
            
        # 2. Check Invoker
        entrypoint = config.get("invoke_entrypoint")
        if not entrypoint:
            result["status"] = "FAIL"
            result["error"] = "No invoke_entrypoint defined"
            return result
        
        module_path, func_name = entrypoint.split(":")
        
        # 3. Import Invoker
        spec = importlib.util.spec_from_file_location("invoker_mod", f"{module_path.replace('.', '/')}.py")
        if not spec or not spec.loader:
             # Try local import
             mod = importlib.import_module(module_path)
             invoker = getattr(mod, func_name)
        else:
             mod = importlib.util.module_from_spec(spec)
             spec.loader.exec_module(mod)
             invoker = getattr(mod, func_name)
             
        # 4. Prepare Context
        # Resolve Models
        bedrock_model = resolve_bedrock_model("text") # e.g. nova-2-lite
        adk_model = resolve_adk_model("text")         # e.g. gemini-2.5-flash
        
        # Inject Gateway (The "Agnostic" Bridge)
        gateway = BedrockGateway(default_model=bedrock_model)
        
        blackboard = Blackboard()
        context = {
            "tenant_id": "test-tenant-live",
            "session_id": "live-verification-" + TIMESTAMP,
            "user_id": "verifier",
            "blackboard": blackboard,
            "resolved_models": {
                "bedrock": bedrock_model,
                "adk": adk_model
            },
            "model_gateway": gateway # <--- INJECTION
        }
        
        # --- THE EXECUTION ---
        # Construct Request based on Framework
        
        # Load smoke flow
        smoke_flow_path = f"registry/flows/smoke_live/{framework}/generic.yaml"
        # Try specific if exists
        specific_flow = f"registry/flows/smoke_live/{framework}/flow_smoke_{mode_id}.yaml"
        if os.path.exists(specific_flow):
            smoke_flow_path = specific_flow
            
        if not os.path.exists(smoke_flow_path):
             result["status"] = "SKIP"
             result["reason"] = "No generic/specific smoke flow found."
             return result

        with open(smoke_flow_path) as f:
            smoke_flow = yaml.safe_load(f)
            
        # Execute Invoker based on signature heuristics
        # Most take (input_data, context)
        # We need to craft input_data that looks like what the mode expects.
        # This is the tricky part: "minimal smoke flow" needs to match the input schema of the mode.
        # However, most modes in this repo are "Flow Interpreters" (they take a flow definition).
        # OR they are "Agent Runners" (they take a task/prompt).
        
        # Heuristic: Check if mode config has 'input_schema' or similar, or just try generic payload.
        # For 'autogen', 'crewai', 'langgraph', 'bedrock' modes here, they usually take:
        # input_data = { "flow_def": ..., "user_input": ... }
        
        # We will wrap the smoke flow into a structure the invoker likely expects.
        
        input_data = {}
        
        # 1. Flow Def (if framework uses it)
        input_data["flow_def"] = smoke_flow
        
        # 2. User Input / Prompt
        # Extract from first step of smoke flow
        first_step = smoke_flow.get("steps", [{}])[0]
        user_prompt = first_step.get("prompt") or first_step.get("task") or first_step.get("input") or "Hello"
        input_data["user_message"] = user_prompt
        input_data["topic"] = user_prompt # For debate/round_robin
        
        # 3. Context Update (Merge, don't clobber)
        context.update({
            "tenant_id": "test-tenant-live",
            "session_id": "live-verification-" + TIMESTAMP,
            "user_id": "verifier"
        })
        
        # INJECT MODEL ID into input_data or context override
        # Most adapters look at card 'default_model_id' or context overrides.
        if framework == "adk":
             context["adk_model_id"] = adk_model
        else:
             context["model_id"] = bedrock_model
             
        # Call Invoker
        log(f"  Running {func_name}(...)")
        
        # Check if async (many are)
        import asyncio
        import inspect
        
        output = None
        
        class MockBlackboard:
             def __init__(self): pass
             
        async def mock_emit(event, data=None):
             # print(f"    [EMIT] {event} {data}")
             pass
        
        # Smart Heuristic using Inspect
        sig = inspect.signature(invoker)
        params = sig.parameters
        
        if "blackboard" in params or "emit" in params:
             # New Signature: (mode_card, flow_card, inputs, blackboard, emit)
             # Config matches mode_card, smoke_flow matches flow_card.
             # Inputs: wrap user_message
             lg_inputs = {"input_text": user_prompt, "user_message": user_prompt}
             
             # Pass Context explicitly
             
             if inspect.iscoroutinefunction(invoker):
                 # Check if it accepts context (heuristic: 6 params or check name)
                 # We will assume NEW STANDARD: (mode, flow, inputs, blackboard, emit, context)
                 # If invoker doesn't support it, it might fail. We should try/catch or inspect.
                 try:
                     log(f"  [DEBUG] Trying signature with context for {func_name}")
                     output = asyncio.run(invoker(config, smoke_flow, lg_inputs, MockBlackboard(), mock_emit, context=context))
                 except TypeError as e:
                     log(f"  [WARN] Failed context signature: {e}")
                     # Fallback to old signature (without context)
                     # But wait, our refactored modes REQUIRE context for gateway.
                     log("  [WARN] Invoker might not accept context. Trying 5 args.")
                     output = asyncio.run(invoker(config, smoke_flow, lg_inputs, MockBlackboard(), mock_emit))
             else:
                 log(f"  [DEBUG] Fallback to legacy signature for {func_name}")
                 output = invoker(config, smoke_flow, lg_inputs, MockBlackboard(), mock_emit)
                 
        elif inspect.iscoroutinefunction(invoker):
             log(f"  [DEBUG] Using simple async (input, context) signature")
             output = asyncio.run(invoker(input_data, context))
        else:
             # Check arguments count to be safe? 
             # Assuming standard contract: invoker(input_data, context) or invoker(request)
             # Let's try (input_data, context) first as per adapter.py seen earlier
             try:
                 output = invoker(input_data, context)
             except TypeError:
                 # Fallback: maybe it takes a Request object?
                 # If so, we are stuck without constructing it strictly.
                 # But standard pattern here is (input, context).
                 # Let's try 1 arg
                 output = invoker(input_data)

        # Validate Output
        # output is usually a dict with "status", "result", "messages", etc.
        
        log(f"  Output: {str(output)[:200]}")
        
        result["status"] = "PASS" # Tentative
        evidence_text = str(output)
        
        # Check for error in output
        if isinstance(output, dict) and output.get("status") == "FAIL":
             result["status"] = "FAIL"
             result["error"] = output.get("reason", "Unknown failure")
             
        # Check output against expectation in smoke flow
        expected = first_step.get("expected_keyword") or first_step.get("expected_output") or first_step.get("expected_output_key")
        
        if expected and result["status"] == "PASS":
             if expected not in evidence_text:
                  result["status"] = "FAIL"
                  result["error"] = f"Expected '{expected}' not found in output."

        # Save Output for Evidence
        with open(f"{evidence_dir}/output.txt", "w") as f:
            f.write(evidence_text)
            
        result["model_id"] = bedrock_model if framework != "adk" else adk_model # Best guess of what was used


    except Exception as e:
        result["status"] = "FAIL"
        result["error"] = str(e)
        import traceback
        with open(f"{evidence_dir}/error.log", "w") as f:
            f.write(traceback.format_exc())
            
    # Save artifacts
    with open(f"{evidence_dir}/run.json", "w") as f:
        json.dump(result, f, indent=2)
        
    return result

def main():
    run_gate()
    
    os.makedirs(EVIDENCE_ROOT, exist_ok=True)
    
    for root, dirs, files in os.walk(MODES_DIR):
        framework = os.path.basename(root)
        if framework == "framework_modes": continue
        
        for file in files:
            if file.endswith(".yaml"):
                full_path = os.path.join(root, file)
                res = run_mode(framework, full_path)
                results.append(res)
                log(f"  Result: {res['status']}")

    # Generate Matrices
    md_out = "| Framework | Mode | Status | Model ID | Evidence |\n|---|---|---|---|---|\n"
    for r in results:
        ev_link = r.get('evidence_path', 'N/A')
        md_out += f"| {r['framework']} | {r['mode_id']} | {r['status']} | {r['model_id']} | `{ev_link}` |\n"
        
    with open(MATRIX_MD, "w") as f: f.write(md_out)
    with open(MATRIX_JSON, "w") as f: json.dump(results, f, indent=2)
    
    log(f"Sweep Complete. Matrix saved to {MATRIX_MD}")

if __name__ == "__main__":
    main()
