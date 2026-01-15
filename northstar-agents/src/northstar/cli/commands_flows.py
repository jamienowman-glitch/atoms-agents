import sys
import json
from dataclasses import asdict
from typing import Dict, Any
from northstar.registry.schemas import FlowCard
from northstar.runtime.executor import FlowExecutor
from northstar.registry.loader import RegistryLoader
import os

def list_flows(flows: Dict[str, Any]) -> None:
    print(f"{'FLOW ID':<40} {'NAME':<30}")
    print("-" * 75)
    for f in flows.values():
        if isinstance(f, FlowCard):
            print(f"{f.flow_id:<40} {f.name:<30}")

def show_flow(flows: Dict[str, Any], flow_id: str) -> None:
    if flow_id not in flows:
        print(f"Flow '{flow_id}' not found.")
        sys.exit(1)
    
    f = flows[flow_id]
    print(json.dumps(asdict(f), indent=2))

def dry_run_flow(flows: Dict[str, Any], flow_id: str, profile_id: str) -> None:
    print(f"--- Dry Run: {flow_id} ---")
    if flow_id not in flows:
        print(f"Flow '{flow_id}' not found.")
        sys.exit(1)
        
    flow = flows[flow_id]
    
    # Initialize Executor to validate
    cards_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../registry/cards"))
    loader = RegistryLoader(cards_root)
    executor = FlowExecutor(loader)
    
    # Load and Validate
    executor.load_registry()
    from northstar.runtime.dag_validator import DAGValidator
    
    try:
        DAGValidator.validate_flow_integrity(flow, executor.nodes_map)
        order = DAGValidator.validate_dag(flow.nodes, flow.edges, flow.entry_node, flow.exit_nodes)
        print("[PASS] DAG Validation Successful.")
        print(f"[PASS] Execution Order: {order}")
        print("[PASS] All Node References Valid.")
    except Exception as e:
        print(f"[FAIL] Validation Failed: {e}")
        sys.exit(1)

def run_flow(ctx: Any, flow_id: str, profile_id: str = "dev_local") -> None:
    print(f"--- Executing Flow: {flow_id} ---")
    if flow_id not in ctx.flows:
        print(f"Flow '{flow_id}' not found.")
        sys.exit(1)

    flow = ctx.flows[flow_id]

    # Initialize Executor
    executor = FlowExecutor(ctx)
    
    result = executor.execute_flow(flow, profile_id)
    
    if result.status == "success":
        print("\n[SUCCESS] Flow execution completed.")
        print(f"Artifacts: {len(result.node_results)} nodes executed.")
        for art in result.artifacts_written:
             print(f"Report: {art}")
    else:
        print(f"\n[FAIL] Flow execution failed: {result.error}")
        sys.exit(1)
