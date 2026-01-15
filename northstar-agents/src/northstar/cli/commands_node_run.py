
import sys
import json
from typing import Any, Dict, Optional
from northstar.runtime.node_executor import NodeExecutor

def run_node(
    ctx: Any, 
    node_id: str, 
    profile_id: str,
    provider_id: Optional[str] = None,
    model_id: Optional[str] = None
) -> None:
    if node_id not in ctx.nodes:
        print(f"Node '{node_id}' not found.")
        sys.exit(1)
        
    node = ctx.nodes[node_id]
    profile = ctx.profiles.get(profile_id)
    if not profile:
        print(f"Profile '{profile_id}' not found.")
        sys.exit(1)

    print(f"Running Node: {node_id} using profile {profile_id}...")
    
    # Initialize Audit Emitter
    from northstar.runtime.audit.emitter import JSONLFileEmitter
    from northstar.core.paths import get_repo_root
    import os
    
    logs_dir = get_repo_root() / "logs"
    os.makedirs(logs_dir, exist_ok=True)
    audit_path = logs_dir / "audit.jsonl"
    emitter = JSONLFileEmitter(str(audit_path))
    
    executor = NodeExecutor(ctx, audit_emitter=emitter)
    blackboard: Dict[str, Any] = {} # Empty for isolated run
    
    result = executor.execute_node(
        node, profile, blackboard, 
        provider_override=provider_id, 
        model_override=model_id
    )
    
    # Print result
    print("-" * 50)
    print(f"Status: {result.status}")
    print(f"Reason: {result.reason}")
    print(f"Duration: {result.ended_ts - result.started_ts:.2f}s")
    if result.artifacts_written:
        print("Artifacts Written:")
        for a in result.artifacts_written:
            print(f"  - {a}")
    if result.blackboard_writes:
        print("Blackboard Writes:")
        for k, v in result.blackboard_writes.items():
            print(f"  - {k}: {v}")
    
    # Write trace snippet
    trace = {
        "node_id": result.node_id,
        "status": result.status,
        "result": {
            "artifacts": result.artifacts_written,
            "writes": result.blackboard_writes
        }
    }
    
    from northstar.core.paths import get_artifacts_dir
    out_path = get_artifacts_dir() / f"node_trace_{node_id}.json"
    
    with open(out_path, "w") as f:
        json.dump(trace, f, indent=2)
    print(f"\nTrace written to: {out_path}")

def show_trace(trace_path: str) -> None:
    try:
        with open(trace_path, "r") as f:
            data = json.load(f)
        print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Error reading trace: {e}")
        sys.exit(1)
