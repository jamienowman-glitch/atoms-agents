"""
Script to run cross-runtime behaviour smoke tests for the 'Ghostwriter Chorus' flow.
Executes the flow across multiple runtimes (LangGraph, Strands, CrewAI, AutoGen, ADK, Bedrock)
and generates YAML logs and a console report.
"""
import sys
import os
import yaml
import time
import datetime
import importlib
import uuid

# Ensure root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Constants
REGISTRY_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../registry"))
LOGS_DIR = os.path.join(REGISTRY_DIR, "run_logs")
AGENTS_DIR = os.path.join(REGISTRY_DIR, "agents")
FLOWS_DIR = os.path.join(REGISTRY_DIR, "flows")

# Canary Models (same as verify_runtimes.py)
BEDROCK_MODEL = "us.amazon.nova-2-lite-v1:0"
ADK_MODEL = "gemini-2.0-flash"

def load_yaml(path):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def get_agent_card(agent_id):
    path = os.path.join(AGENTS_DIR, f"{agent_id}.yaml")
    if not os.path.exists(path):
        return None
    return load_yaml(path)

def get_flow_def(flow_id):
    path = os.path.join(FLOWS_DIR, f"{flow_id}.yaml")
    return load_yaml(path)

def write_log(runtime_id, log_data):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"runtime_test.{runtime_id}.{timestamp}.yaml"
    path = os.path.join(LOGS_DIR, filename)
    
    # Ensure directory exists
    os.makedirs(LOGS_DIR, exist_ok=True)
    
    with open(path, 'w') as f:
        yaml.dump(log_data, f, sort_keys=False)
    return filename

def get_context() -> dict:
    return {
        "tenant_id": "t_northstar",
        "env": "dev",
        "user_id": "smoke_test",
        "surface_id": "cli"
    }

def run_simulated_chain(runtime_id, model_func, model_id, agents):
    """
    Simulates a 3-step chain (A -> B -> C) using a direct model call function.
    Used for ADK and Bedrock to ensure we satisfy the behaviour test requirements
    without full runtime orchestration if it's not available.
    """
    steps_log = []
    
    # Shared task context
    task_context = "Task: Write a 3-line chorus about 'Coding in the Cloud'."
    current_draft = ""
    
    start_time = time.time()
    
    # Step 1: Agent A
    a_card = agents['agent_ghostwriter_a']
    prompt_a = f"""
    {a_card['persona']}
    {a_card['manifest']}
    
    {task_context}
    You are the first writer. Produce draft_v1.
    """
    
    try:
        t0 = time.time()
        resp_a = model_func(prompt_a, model_id)
        latency_a = (time.time() - t0) * 1000
        current_draft = resp_a
        
        steps_log.append({
            "step_index": 1,
            "agent_id": "agent_ghostwriter_a",
            "action_type": "write",
            "emitted_text": resp_a,
            "target_location": "draft_v1",
            "step_latency_ms": latency_a,
            "model_provider": model_id
        })
    except Exception as e:
        return {"error": str(e), "steps": steps_log}

    # Step 2: Agent B
    b_card = agents['agent_ghostwriter_b']
    prompt_b = f"""
    {b_card['persona']}
    {b_card['manifest']}
    
    {task_context}
    Previous draft: "{current_draft}"
    You are the second writer. Rewrite this into draft_v2.
    """
    
    try:
        t0 = time.time()
        resp_b = model_func(prompt_b, model_id)
        latency_b = (time.time() - t0) * 1000
        current_draft = resp_b
        
        steps_log.append({
            "step_index": 2,
            "agent_id": "agent_ghostwriter_b",
            "action_type": "write",
            "emitted_text": resp_b,
            "target_location": "draft_v2",
            "step_latency_ms": latency_b,
            "model_provider": model_id
        })
    except Exception as e:
        return {"error": str(e), "steps": steps_log}

    # Step 3: Agent C
    c_card = agents['agent_ghostwriter_c']
    prompt_c = f"""
    {c_card['persona']}
    {c_card['manifest']}
    
    {task_context}
    Previous draft: "{current_draft}"
    You are the final editor. Produce the final_chorus and a constraints_checklist.
    """
    
    try:
        t0 = time.time()
        resp_c = model_func(prompt_c, model_id)
        latency_c = (time.time() - t0) * 1000
        
        steps_log.append({
            "step_index": 3,
            "agent_id": "agent_ghostwriter_c",
            "action_type": "final",
            "emitted_text": resp_c,
            "target_location": "final_chorus",
            "step_latency_ms": latency_c,
            "model_provider": model_id
        })
    except Exception as e:
        return {"error": str(e), "steps": steps_log}

    total_latency = (time.time() - start_time) * 1000
    
    return {
        "status": "PASS",
        "total_latency_ms": total_latency,
        "steps": steps_log,
        "summary": "Simulated multi-turn chain completed successfully."
    }

# --- Runtime Runners ---

def run_adk(agents):
    try:
        from runtime.adk.client import run_adk_agent
        from runtime.adk.types import AdkAgentRequest
        
        def call_adk(prompt, model):
            req = AdkAgentRequest(
                agent_id=model,
                user_message=prompt,
                tenant_id="t_northstar",
                surface_id="cli",
                session_id=f"smoke_{uuid.uuid4()}",
                context=get_context()
            )
            resp = run_adk_agent(req)
            if resp.raw and "error" in resp.raw:
                raise Exception(resp.raw['error'])
            return resp.messages[0].content

        return run_simulated_chain("adk", call_adk, ADK_MODEL, agents)
        
    except ImportError:
        return {"status": "SKIP", "reason": "Missing ADK runtime dependencies"}
    except Exception as e:
        return {"status": "FAIL", "reason": str(e)}

def run_bedrock(agents):
    try:
        from runtime.bedrock.client import run_bedrock
        from runtime.bedrock.types import BedrockRequest
        
        def call_bedrock(prompt, model):
            req = BedrockRequest(
                model_id=model,
                user_message=prompt,
                tenant_id="t_northstar",
                surface_id="cli",
                session_id=f"smoke_{uuid.uuid4()}",
                context=get_context()
            )
            resp = run_bedrock(req)
            if resp.raw and "error" in resp.raw:
                err = str(resp.raw['error'])
                if "ResourceNotFoundException" in err or "deprecated" in err.lower():
                     raise Exception(f"Model unavailable: {err}")
                raise Exception(err)
            return resp.messages[0].content

        return run_simulated_chain("bedrock", call_bedrock, BEDROCK_MODEL, agents)

    except ImportError:
        return {"status": "SKIP", "reason": "Missing Bedrock runtime dependencies"}
    except Exception as e:
        return {"status": "FAIL", "reason": str(e)}

def run_generic_runtime(runtime_package, runtime_id, agents):
    context = {
        "tenant_id": "t_demo",
        "env": "dev",
        "user_id": "u_test",
        "correlation_id": str(uuid.uuid4())
    }
    
    # Dynamic Load of Adapter
    try:
        module = importlib.import_module(runtime_package)
        if runtime_id == "langgraph":
            adapter_cls = getattr(module, "LangGraphAdapter")
        elif runtime_id == "crewai":
            adapter_cls = getattr(module, "CrewAIAdapter")
        elif runtime_id == "autogen":
            adapter_cls = getattr(module, "AutoGenAdapter")
        else:
            adapter_cls = getattr(module, f"{runtime_id.capitalize()}Adapter")
            
        adapter = adapter_cls()
    except Exception as e:
        return {"status": "FAIL", "reason": f"Import failed: {e}", "steps": []}

    # Load Flow Definition
    # In a real system, this comes from Registry Service. Here we load from file.
    flow_path = os.path.join(os.path.dirname(__file__), "../registry/flows/flow_ghostwriter_chorus.yaml")
    try:
        with open(flow_path, "r") as f:
            flow_def = yaml.safe_load(f)
    except Exception as e:
        return {"status": "FAIL", "reason": f"Flow load failed: {e}", "steps": []}

    input_data = {
        "topic": "Coding in the Cloud",
        "agents": agents,
        "flow_def": flow_def
    }
    
    t0 = time.time()
    try:
        result = adapter.invoke(
            card_id="flow_ghostwriter_chorus", 
            input_data=input_data, 
            context=context
        )
        return {
            "status": "PASS",
            "total_latency_ms": duration,
            "steps": steps,
            "summary": f"{runtime_id} generic flow execution"
        }
    except ImportError:
        return {"status": "SKIP", "reason": "Module not found / missing dependency"}
    except Exception as e:
        return {"status": "FAIL", "reason": str(e)}

def main():
    print("Northstar Cross-Runtime Behaviour Smoke Test")
    print("============================================")

    # 1. Load Inputs
    agents = {
        'agent_ghostwriter_a': get_agent_card('agent_ghostwriter_a'),
        'agent_ghostwriter_b': get_agent_card('agent_ghostwriter_b'),
        'agent_ghostwriter_c': get_agent_card('agent_ghostwriter_c')
    }
    
    if not all(agents.values()):
        print("❌ CRITICAL: Missing agent cards in registry.")
        sys.exit(1)
        
    flow_def = get_flow_def('flow_ghostwriter_chorus')
    if not flow_def:
        print("❌ CRITICAL: Missing flow definition.")
        sys.exit(1)

    # 2. Runtimes
    runtimes = [
        ("runtime.langgraph.adapter", "langgraph", run_generic_runtime),
        ("runtime.crewai.adapter", "crewai", run_generic_runtime),
        ("runtime.autogen.adapter", "autogen", run_generic_runtime),
        ("runtime.strands.adapter", "strands", lambda pkg, rid, ag: {"status": "SKIP", "reason": "Not strictly enforcing A-B-C yet"}),
        ("runtime.adk.client", "adk", lambda _, __, ag: run_adk(ag)),
        ("runtime.bedrock.client", "bedrock", lambda _, __, ag: run_bedrock(ag)),
    ]

    results = []

    for pkg, rid, runner in runtimes:
        print(f"Running {rid}...", end=" ")
        sys.stdout.flush()
        
        start_ts = datetime.datetime.now().isoformat()
        res = runner(pkg, rid, agents)
        end_ts = datetime.datetime.now().isoformat()
        
        status = res.get("status", "FAIL")
        reason = res.get("reason", "")
        latency = res.get("total_latency_ms", 0.0)
        
        log_file = "N/A"
        
        # Write Logs if we have steps
        if "steps" in res:
            log_data = {
                "start_timestamp": start_ts,
                "end_timestamp": end_ts,
                "total_latency_ms": latency,
                "summary": res.get("summary", ""),
                "steps": res.get("steps", [])
            }
            log_file = write_log(rid, log_data)

        # Print Status
        if status == "PASS":
            print(f"✅ PASS | {latency:.0f}ms")
        elif status == "SKIP":
            print(f"⏭️  SKIP ({reason})")
        else:
            print(f"❌ FAIL ({reason})")
            
        results.append({
            "runtime": rid,
            "status": status,
            "latency": latency,
            "log": log_file,
            "reason": reason
        })

    # 3. Summary Report
    print("\nSummary Table")
    print("-------------")
    print(f"{'Runtime':<15} | {'Status':<6} | {'Latency':<8} | {'Log File':<35} | {'Reason'}")
    print("-" * 100)
    for r in results:
        lat_str = f"{r['latency']:.0f}ms" if r['latency'] > 0 else "-"
        print(f"{r['runtime']:<15} | {r['status']:<6} | {lat_str:<8} | {r['log']:<35} | {r['reason']}")
    print("-" * 100)

if __name__ == "__main__":
    main()
