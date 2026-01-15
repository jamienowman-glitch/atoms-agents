#!/usr/bin/env python3
import os
import sys
import argparse
import shutil
import uuid
import yaml
import time
from datetime import datetime, timezone
from typing import Dict, Any, List

# Add project root to sys.path
sys.path.append(os.getcwd())

from runtime.langgraph.adapter import LangGraphAdapter
from runtime.autogen.adapter import AutoGenAdapter

# Constants
RUN_LOGS_DIR = "registry/run_logs"
RUN_ARTIFACTS_DIR = "registry/run_artifacts"
SCHEMA_VERSION = "1.0.0"

# Agent Definitions
AGENT_CARDS = {
    "agent_a": "registry/agents/agent_shiritori_a.yaml",
    "agent_b": "registry/agents/agent_shiritori_b.yaml",
    "agent_c": "registry/agents/agent_shiritori_c.yaml"
}

def load_agent_card(path: str) -> Dict[str, Any]:
    with open(path, 'r') as f:
        data = yaml.safe_load(f)
    return {
        "id": data["id"],
        "persona": data["spec"]["profile"]["persona"].strip(),
        "manifest": data["spec"]["profile"]["manifest"].strip()
    }

class DocBlackboardTestRunner:
    def __init__(self):
        self.results = []
        os.makedirs(RUN_LOGS_DIR, exist_ok=True)
        
        # Load agents
        self.agents_data = {}
        agent_dir = "registry/agents" # Define agent_dir
        files = ["agent_shiritori_a.yaml", "agent_shiritori_b.yaml", "agent_shiritori_c.yaml"]
        for f in files:
            path = os.path.join(agent_dir, f)
            try:
                key = f.replace(".yaml", "")
                self.agents_data[key] = load_agent_card(path) # Corrected to use global load_agent_card
            except Exception as e:
                print(f"❌ Failed to load agent card {path}: {e}")
                raise e

    def _get_adapter(self, runtime_name: str):
        if runtime_name == "langgraph":
            return LangGraphAdapter()
        elif runtime_name == "autogen":
            return AutoGenAdapter()
        else:
            raise ValueError(f"Unknown runtime: {runtime_name}")

    def run_test(self, runtime_name: str, input_file: str):
        print(f"--- Running Blackboard Doc Test: {runtime_name} ---")
        
        # Setup Artifacts Dir
        run_id = str(uuid.uuid4())
        artifacts_dir = os.path.join(RUN_ARTIFACTS_DIR, run_id)
        os.makedirs(artifacts_dir, exist_ok=True)
        
        # Copy Input
        shutil.copy(input_file, os.path.join(artifacts_dir, "input.txt"))

        # Load Adapter
        if runtime_name == "langgraph":
            adapter = LangGraphAdapter()
        elif runtime_name == "autogen":
            adapter = AutoGenAdapter()
        else:
            print(f"Skipping unknown runtime: {runtime_name}")
            return

        context = {
            "tenant_id": "t_demo",
            "env": "dev",
            "user_id": "u_test",
            "correlation_id": run_id
        }

        # Load Flow Definition
        flow_path = "registry/flows/flow_blackboard.yaml" # Adjusted path to be relative to current working directory
        try:
            with open(flow_path, "r") as f:
                flow_def = yaml.safe_load(f)
        except Exception as e:
            print(f"FAIL: Could not load flow def: {e}")
            return

        input_data = {
            "agents": self.agents_data,
            "max_turns": 9,
            "topic": "Shiritori",
            "flow_def": flow_def
        }

        start_time = time.time()
        result_log = {
            "run_id": run_id,
            "timestamp": time.time(),
            "runtime": runtime_name,
            "status": "Running"
        }
        
        try:
            api_result = adapter.invoke(card_id="flow_blackboard", input_data=input_data, context=context)
            duration = (time.time() - start_time) * 1000
            
            result_log["duration_ms"] = duration
            result_log["status"] = api_result.get("status", "FAIL")
            
            steps = api_result.get("steps", [])
            state = api_result.get("final_blackboard_state", {}) # Changed from final_state.opening_line_words to final_blackboard_state
            
            # Persist Step Artifacts
            result_log["steps"] = []
            for step in steps:
                step_idx = step.get("step_index")
                content = step.get("emitted_text", "")
                
                fname = f"step_{step_idx}_{step.get('agent_id')}.txt"
                fpath = os.path.join(artifacts_dir, fname)
                with open(fpath, "w") as f:
                    f.write(content)
                    
                step["artifact_path"] = f"registry/run_artifacts/{run_id}/{fname}"
                result_log["steps"].append(step)
                
            result_log["final_blackboard_state"] = state # Changed key to final_blackboard_state
            
        except Exception as e:
            result_log["status"] = "CRASH"
            result_log["error"] = str(e)
            import traceback # Added import for traceback
            traceback.print_exc()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Doc Blackboard Test")
    parser.add_argument("--runtime", required=True, help="Runtime adapter to use (langgraph, autogen)")
    parser.add_argument("--file", required=True, help="Path to input document")
    
    args = parser.parse_args()
    
    runner = DocBlackboardTestRunner()
    runner.run_test(args.runtime, args.file)
