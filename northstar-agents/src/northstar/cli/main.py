import argparse

def run_cli() -> None:
    parser = argparse.ArgumentParser(description="Northstar Agents CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # list-modes
    subparsers.add_parser("list-modes", help="List available modes")
    
    # list-providers
    subparsers.add_parser("list-providers", help="List available providers")
    
    # list-models
    subparsers.add_parser("list-models", help="List available models")

    # show-mode
    show_parser = subparsers.add_parser("show-mode", help="Show mode details")
    show_parser.add_argument("mode_id", help="ID of the mode to show")

    # run-mode
    run_parser = subparsers.add_parser("run-mode", help="Run a specific mode")
    run_parser.add_argument("mode_id", help="ID of the mode to run")
    run_parser.add_argument("--input-json", default="{}", help="Input JSON payload")
    run_parser.add_argument("--profile", default="dev_local", help="Profile ID (default: dev_local)")

    # verify-modes
    mv_parser = subparsers.add_parser("verify-modes", help="Verify all modes (smoke test)")
    mv_parser.add_argument("--profile", default="dev_local", help="Profile ID (default: dev_local)")
    mv_parser.add_argument("--allow-regression", action="store_true", help="Allow regression of live checks")

    # verify-framework
    vf_parser = subparsers.add_parser("verify-framework", help="Verify framework modes")
    vf_parser.add_argument("--framework", required=True, help="Framework ID (e.g. bedrock, autogen)")
    vf_parser.add_argument("--profile", default="dev_local", help="Profile ID (default: dev_local)")
    vf_parser.add_argument("--allow-regression", action="store_true", help="Allow regression of live checks")
    vf_parser.add_argument("--allow-mutate", action="store_true", help="Allow state-mutating API calls")
    vf_parser.add_argument("--provider", help="Target Provider ID (e.g. bedrock, azure_openai)")
    vf_parser.add_argument("--model", help="Target Model ID (e.g. bedrock_default, azure_default)")

    # doctor
    subparsers.add_parser("doctor", help="Check environment health")

    # list-profiles
    subparsers.add_parser("list-profiles", help="List available profiles")

    # list-capabilities
    subparsers.add_parser("list-capabilities", help="List available capabilities")
    
    # show-capability
    show_cap_parser = subparsers.add_parser("show-capability", help="Show capability details")
    show_cap_parser.add_argument("capability_id", help="ID of the capability to show")
    
    # list-capability-bindings
    bind_parser = subparsers.add_parser("list-capability-bindings", help="List capability bindings")
    bind_parser.add_argument("--model", help="Filter by Model ID (optional)")

    # show-ledger
    subparsers.add_parser("show-ledger", help="Show certification ledger")

    verify_live_parser = subparsers.add_parser("verify-live", help="Verify live capabilities")
    verify_live_parser.add_argument("--framework", required=True, choices=["bedrock", "adk"], help="Framework to verify")
    verify_live_parser.add_argument("--mode", help="Specific mode ID (optional)")
    verify_live_parser.add_argument("--allow-mutate", action="store_true", help="Allow state-mutating API calls")
    verify_live_parser.add_argument("--profile", default="dev_local", help="Profile ID (default: dev_local)")
    verify_live_parser.add_argument("--allow-regression", action="store_true", help="Allow regression of live checks")
    
    # list-personas
    subparsers.add_parser("list-personas", help="List available personas")
    
    # show-persona
    show_per_parser = subparsers.add_parser("show-persona", help="Show persona details")
    show_per_parser.add_argument("persona_id", help="ID of the persona to show")

    # list-tasks
    subparsers.add_parser("list-tasks", help="List available tasks")
    
    # show-task
    show_task_parser = subparsers.add_parser("show-task", help="Show task details")
    show_task_parser.add_argument("task_id", help="ID of the task to show")

    # list-artifact-specs
    subparsers.add_parser("list-artifact-specs", help="List available artifact specs")
    
    # show-artifact-spec
    show_spec_parser = subparsers.add_parser("show-artifact-spec", help="Show artifact spec details")
    show_spec_parser.add_argument("spec_id", help="ID of the artifact spec to show")
    
    # list-nodes
    subparsers.add_parser("list-nodes", help="List available nodes")
    
    # show-node
    show_node_parser = subparsers.add_parser("show-node", help="Show node details")
    show_node_parser.add_argument("node_id", help="ID of the node to show")
    
    # list-flows
    subparsers.add_parser("list-flows", help="List available flows")
    
    # show-flow
    show_flow_parser = subparsers.add_parser("show-flow", help="Show flow details")
    show_flow_parser.add_argument("flow_id", help="ID of the flow to show")
    
    # dry-run-flow
    dry_run_parser = subparsers.add_parser("dry-run-flow", help="Dry run flow validation")
    dry_run_parser.add_argument("flow_id", help="Flow ID to validate")
    dry_run_parser.add_argument("--profile", default="dev_local", help="Profile ID")

    # run-flow
    run_flow_parser = subparsers.add_parser("run-flow", help="Execute flow")
    run_flow_parser.add_argument("flow_id", help="Flow ID to execute")
    run_flow_parser.add_argument("--profile", default="dev_local", help="Profile ID")
    
    # render-flow
    render_flow_parser = subparsers.add_parser("render-flow", help="Render flow canvas")
    render_flow_parser.add_argument("flow_id", help="Flow ID to render")
    render_flow_parser.add_argument("--theme", default="light", choices=["light", "dark"], help="Theme")
    render_flow_parser.add_argument("--out", help="Output path")
    
    # render-run
    render_run_parser = subparsers.add_parser("render-run", help="Render run results")
    render_run_parser.add_argument("report_path", help="Path to run report JSON")
    render_run_parser.add_argument("--theme", default="light", choices=["light", "dark"], help="Theme")
    render_run_parser.add_argument("--out", help="Output path")
    
    # audit-repo
    subparsers.add_parser("audit-repo", help="Audit repository state")
    
    # run-node
    run_node_parser = subparsers.add_parser("run-node", help="Run a single node")
    run_node_parser.add_argument("node_id", help="Node ID")
    run_node_parser.add_argument("--profile", default="dev_local", help="Profile ID")
    run_node_parser.add_argument("--provider", help="Override provider ID")
    run_node_parser.add_argument("--model", help="Override model ID")
    
    # show-trace
    show_trace_parser = subparsers.add_parser("show-trace", help="Show trace details")
    show_trace_parser.add_argument("trace_path", help="Path to trace JSON")

    # certify-live
    parser_certify = subparsers.add_parser("certify-live", help="Live smoke test")
    parser_certify.add_argument("--provider", required=True, choices=["bedrock", "vertex", "azure_openai"], help="Provider ID")
    parser_certify.add_argument("--model", required=True, help="Model ID")
    parser_certify.add_argument("--profile", help="Run profile")

    # workspace-export
    exp_parser = subparsers.add_parser("workspace-export", help="Export workspace to folder")
    exp_parser.add_argument("--out-dir", required=True, help="Target directory path")

    # workspace-clear
    clear_parser = subparsers.add_parser("workspace-clear", help="Clear all workspace data")
    clear_parser.add_argument("--yes", action="store_true", help="Skip confirmation")
    
    # workspace-status
    subparsers.add_parser("workspace-status", help="List workspace overrides")

    # workspace-reset
    wr_parser = subparsers.add_parser("workspace-reset", help="Reset a card override")
    wr_parser.add_argument("--type", dest="card_type", choices=["node", "flow"], required=True, help="Card Type")
    wr_parser.add_argument("--id", dest="card_id", required=True, help="Card ID")

    # serve-builder
    serve_parser = subparsers.add_parser("serve-builder", help="Start interactive builder")
    serve_parser.add_argument("--port", type=int, default=8765, help="Port number (default: 8765)")

    # --- Authoring Commands (Phase 22) ---
    
    # new-node
    nn_parser = subparsers.add_parser("new-node", help="Create a new node")
    nn_parser.add_argument("--id", required=True, dest="node_id", help="Node ID (node.*)")
    nn_parser.add_argument("--name", required=True, help="Node Name")
    nn_parser.add_argument("--kind", required=True, choices=["agent", "subflow", "framework_team"], help="Node Kind")

    # set-node
    sn_parser = subparsers.add_parser("set-node", help="Update node properties")
    sn_parser.add_argument("node_id", help="Node ID")
    sn_parser.add_argument("--persona", help="Persona Ref")
    sn_parser.add_argument("--task", help="Task Ref")
    sn_parser.add_argument("--provider", help="Provider Ref")
    sn_parser.add_argument("--model", help="Model Ref")
    sn_parser.add_argument("--cap", dest="cap_list", help="Comma-separated capability IDs")

    # del-node (Dual purpose: delete node OR remove node from flow)
    dn_parser = subparsers.add_parser("del-node", help="Delete node or remove from flow")
    dn_parser.add_argument("target_id", help="Node ID to delete OR Flow ID to modify")
    dn_parser.add_argument("--node", dest="node_ref", help="Node to remove (if target is flow)")

    # new-flow
    nf_parser = subparsers.add_parser("new-flow", help="Create a new flow")
    nf_parser.add_argument("--id", required=True, dest="flow_id", help="Flow ID (flow.*)")
    nf_parser.add_argument("--name", required=True, help="Flow Name")
    nf_parser.add_argument("--objective", required=True, help="Flow Objective")
    nf_parser.add_argument("--entry", required=True, dest="entry_node", help="Entry Node ID")
    nf_parser.add_argument("--exit", dest="exit_node", help="Exit Node ID (optional)")

    # add-edge
    ae_parser = subparsers.add_parser("add-edge", help="Add edge to flow")
    ae_parser.add_argument("flow_id", help="Flow ID")
    ae_parser.add_argument("--from", required=True, dest="from_node", help="Source Node")
    ae_parser.add_argument("--to", required=True, dest="to_node", help="Target Node")

    # del-edge
    de_parser = subparsers.add_parser("del-edge", help="Remove edge from flow")
    de_parser.add_argument("flow_id", help="Flow ID")
    de_parser.add_argument("--from", required=True, dest="from_node", help="Source Node")
    de_parser.add_argument("--to", required=True, dest="to_node", help="Target Node")

    # add-node (To Flow)
    an_parser = subparsers.add_parser("add-node", help="Add node to flow")
    an_parser.add_argument("flow_id", help="Flow ID")
    an_parser.add_argument("--node", required=True, dest="node_ref", help="Node ID to add")

    # validate-flow
    vf_parser = subparsers.add_parser("validate-flow", help="Validate a flow")
    vf_parser.add_argument("--flow", required=True, dest="flow_id", help="Flow ID")
    vf_parser.add_argument("--live", action="store_true", help="Run live checks (cost incurring)")
    vf_parser.add_argument("--profile", dest="profile_id", help="RunProfile ID (optional)")
    vf_parser.add_argument("--tenant", dest="tenant_id", help="Tenant ID (optional)")

    # validate-node
    vn_parser = subparsers.add_parser("validate-node", help="Validate a single node")
    vn_parser.add_argument("--node", required=True, dest="node_id", help="Node ID")


    # list-tenants
    subparsers.add_parser("list-tenants", help="List all tenants")

    # show-tenant
    st_parser = subparsers.add_parser("show-tenant", help="Show details for a tenant")
    st_parser.add_argument("tenant_id", help="Tenant ID")

    # ui-export (headless)
    ue_parser = subparsers.add_parser("ui-export", help="Export GraphPayloadV1 for a flow")
    ue_parser.add_argument("--flow", required=True, dest="flow_id", help="Flow ID")
    ue_parser.add_argument("--out", dest="out_path", help="Output JSON path (optional)")
    ue_parser.add_argument("--tenant", dest="tenant_id", help="Tenant ID (apply overlays)")

    # ui-apply (headless)
    ua_parser = subparsers.add_parser("ui-apply", help="Apply JSON patch to workspace")
    ua_parser.add_argument("--type", dest="card_type", choices=["node", "flow"], required=True, help="Card Type")
    ua_parser.add_argument("--id", dest="card_id", required=True, help="Card ID")
    ua_parser.add_argument("--json", dest="json_path", required=True, help="Path to JSON payload")

    args = parser.parse_args()
    
    from northstar.cli.bootstrap import load_registry_for_cli
    ctx = load_registry_for_cli()

    
    # Dispatch command
    from northstar.cli.dispatcher import dispatch_command
    dispatch_command(ctx, args)

if __name__ == "__main__":
    run_cli()
