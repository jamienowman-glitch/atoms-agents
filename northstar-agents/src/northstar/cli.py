import sys
import uuid
import argparse
from northstar.core.logging import setup_logger
from northstar.runtime.context import AgentsRequestContext, ContextMode
from northstar.registry.loader import RegistryLoader
from northstar.runtime.executor import FlowExecutor

def main():
    parser = argparse.ArgumentParser(description="NorthStar Agents CLI")
    parser.add_argument("--flow", required=True, help="Flow ID to execute")
    parser.add_argument("--profile", default="dev_local", help="Run Profile ID")
    parser.add_argument("--project", default="cli_project", help="Project ID")
    parser.add_argument("--user", default="cli_user", help="User ID")
    
    args = parser.parse_args()
    
    # 1. Setup Context
    ctx = AgentsRequestContext(
        tenant_id="cli_tenant",
        mode=ContextMode.LAB,
        project_id=args.project,
        request_id=str(uuid.uuid4()),
        run_id=str(uuid.uuid4()), # Deterministic Run ID
        user_id=args.user,
        actor_id=args.user,
        app_id="northstar-cli",
        surface_id="cli"
    )
    
    setup_logger()
    
    # 2. Load Registry
    print("Loading Registry...")
    registry = RegistryLoader(
        base_path="/Users/jaynowman/dev/northstar-agents", # Hardcoded for now as per env
        request_context=ctx
    ).load()
    
    # 3. Find Flow
    flow = registry.flows.get(args.flow)
    if not flow:
        print(f"Error: Flow {args.flow} not found.")
        sys.exit(1)
        
    # 4. Execute
    print(f"Starting Flow: {flow.name} (Run ID: {ctx.run_id})")
    executor = FlowExecutor(registry)
    result = executor.execute_flow(flow, profile_id=args.profile)
    
    # 5. Report
    print(f"Flow Status: {result.status}")
    if result.error:
        print(f"Error: {result.error}")
        sys.exit(1)
        
    sys.exit(0)

if __name__ == "__main__":
    main()
