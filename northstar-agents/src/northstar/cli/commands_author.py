import sys
from typing import Any, List, Optional
from northstar.registry.writer import RegistryWriter

def _get_writer() -> RegistryWriter:
    return RegistryWriter()

def new_node(node_id: str, name: str, kind: str) -> None:
    writer = _get_writer()
    try:
        writer.create_node(node_id, name, kind)
        print(f"Created node: {node_id}")
    except Exception as e:
        print(f"Error creating node: {e}")
        sys.exit(1)

def set_node(node_id: str, persona: Optional[str] = None, task: Optional[str] = None, 
             provider: Optional[str] = None, model: Optional[str] = None, 
             cap_list: Optional[str] = None) -> None:
    writer = _get_writer()
    updates = {}
    if persona: updates["persona_ref"] = persona
    if task: updates["task_ref"] = task
    if provider: updates["provider_ref"] = provider
    if model: updates["model_ref"] = model
    
    if cap_list:
        updates["capability_ids"] = [c.strip() for c in cap_list.split(",") if c.strip()]
    
    try:
        writer.update_node_fields(node_id, updates)
        print(f"Updated node: {node_id}")
    except Exception as e:
        print(f"Error updating node: {e}")
        sys.exit(1)

def del_node(target_id: str, node_ref: Optional[str] = None) -> None:
    writer = _get_writer()
    try:
        if target_id.startswith("node."):
            writer.delete_node(target_id)
            print(f"Deleted node: {target_id}")
        elif target_id.startswith("flow."):
            if not node_ref:
                print("Error: Must specify --node when removing from a flow.")
                sys.exit(1)
            writer.remove_flow_node(target_id, node_ref)
            print(f"Removed node {node_ref} from flow {target_id}")
        else:
            print(f"Error: Invalid ID prefix '{target_id}'. Must be node.* or flow.*")
            sys.exit(1)
    except Exception as e:
        print(f"Error deleting: {e}")
        sys.exit(1)

def new_flow(flow_id: str, name: str, objective: str, entry_node: str, exit_node: Optional[str] = None) -> None:
    writer = _get_writer()
    try:
        writer.create_flow(flow_id, name, objective, entry_node)
        # If exit node specified, add it to exit_nodes list (and nodes list if usually implied)
        # Writer create_flow initializes nodes=[entry_node].
        if exit_node:
            writer.add_flow_node(flow_id, exit_node)
            # We need to manually update exit_nodes list as writer doesn't have explicit helper for that yet
            # Let's add specific logic or just rely on generic update if we had one for flows.
            # For now, let's just make sure it's in the node list.
            # To set exit_nodes, we might need a set-flow command or update writer.
            # Let's update writer to allow updating flow fields using generic mechanism or specific
            pass 
            
        print(f"Created flow: {flow_id}")
    except Exception as e:
        print(f"Error creating flow: {e}")
        sys.exit(1)

def add_edge(flow_id: str, from_node: str, to_node: str) -> None:
    writer = _get_writer()
    try:
        writer.add_flow_edge(flow_id, from_node, to_node)
        print(f"Added edge in {flow_id}: {from_node} -> {to_node}")
    except Exception as e:
        print(f"Error adding edge: {e}")
        sys.exit(1)

def del_edge(flow_id: str, from_node: str, to_node: str) -> None:
    writer = _get_writer()
    try:
        writer.remove_flow_edge(flow_id, from_node, to_node)
        print(f"Removed edge in {flow_id}: {from_node} -> {to_node}")
    except Exception as e:
        print(f"Error removing edge: {e}")
        sys.exit(1)

def add_node_to_flow(flow_id: str, node_id: str) -> None:
    writer = _get_writer()
    try:
        writer.add_flow_node(flow_id, node_id)
        print(f"Added node {node_id} to flow {flow_id}")
    except Exception as e:
        print(f"Error adding node to flow: {e}")
        sys.exit(1)

def validate_flow(ctx: Any, flow_id: str, live: bool = False, tenant_id: Optional[str] = None, profile: Optional[str] = None) -> None:
    from northstar.core.validation import FlowValidator
    
    # Reload context with tenant overlay if requested
    if tenant_id:
        from northstar.core.workspace.overlay_loader import OverlayRegistryLoader
        
        if isinstance(ctx.loader, OverlayRegistryLoader):
            print(f"Loading context for tenant: {tenant_id}")
            ctx = ctx.loader.load_context(tenant_id=tenant_id)
        else:
            # Upgrade to OverlayRegistryLoader
            from northstar.core.workspace.store import WorkspaceStore
            print(f"Upgrading loader to apply tenant: {tenant_id}")
            store = WorkspaceStore()
            # ctx.loader.root_path should exist
            overlay_loader = OverlayRegistryLoader(ctx.loader.root_path, store)
            ctx = overlay_loader.load_context(tenant_id=tenant_id)

    validator = FlowValidator(ctx)
    report = validator.validate(flow_id, live=live, tenant_id=tenant_id, profile=profile)
    
    # Report is now a Pydantic model (ValidationReportV1)
    # Use model_dump_json or json.dumps(model_dump)
    print(report.model_dump_json(indent=2))
    
    if not report.valid:
        sys.exit(1)

def validate_node(ctx: Any, node_id: str) -> None:
    from northstar.core.validation import FlowValidator
    
    validator = FlowValidator(ctx)
    report = validator.validate_node(node_id)
    
    print(report.model_dump_json(indent=2))
    
    if not report.valid:
        sys.exit(1)

def ui_export(ctx: Any, flow_id: str, out_path: Optional[str] = None, tenant_id: Optional[str] = None) -> None:
    from northstar.core.validation import FlowValidator
    from northstar.ui_contract.graph_payload_v1 import GraphPayloadV1
    
    # Reload context with tenant overlay if requested
    if tenant_id:
        from northstar.core.workspace.overlay_loader import OverlayRegistryLoader
        
        if isinstance(ctx.loader, OverlayRegistryLoader):
            ctx = ctx.loader.load_context(tenant_id=tenant_id)
        else:
            from northstar.core.workspace.store import WorkspaceStore
            store = WorkspaceStore()
            overlay_loader = OverlayRegistryLoader(ctx.loader.root_path, store)
            ctx = overlay_loader.load_context(tenant_id=tenant_id)

    # Validation logic already returns the dict structure matching GraphPayloadV1
    # We should strictly parse it into the model to ensure contract compliance.
    validator = FlowValidator(ctx)
    data = validator.export_graph(flow_id, tenant_id=tenant_id)
    
    if "error" in data:
        print(f"Error: {data['error']}")
        sys.exit(1)
        
    try:
        payload = GraphPayloadV1(**data)
        json_output = payload.model_dump_json(indent=2)
        
        if out_path:
            with open(out_path, 'w') as f:
                f.write(json_output)
            print(f"Exported UI payload for {flow_id} to {out_path}")
        else:
            print(json_output)
            
    except Exception as e:
        print(f"Error generating payload: {e}")
        sys.exit(1)

def ui_apply(ctx: Any, card_type: str, card_id: str, json_path: str) -> None:
    from northstar.core.workspace.store import WorkspaceStore
    from northstar.registry.schemas import NodeCard, FlowCard
    import json
    
    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
            
        store = WorkspaceStore()
        
        if card_type == "node":
            # Validate schema
            card = NodeCard(**data)
            if card.node_id != card_id:
                raise ValueError(f"ID mismatch: Argument {card_id} vs Payload {card.node_id}")
            store.write_card(card)
            
        elif card_type == "flow":
            card = FlowCard(**data)
            if card.flow_id != card_id:
                raise ValueError(f"ID mismatch: Argument {card_id} vs Payload {card.flow_id}")
            store.write_card(card)
        else:
            print(f"Error: Unsupported card type '{card_type}'")
            sys.exit(1)
            
        print(f"Applied {card_type} {card_id} to workspace.")
        
        # Optional: Re-validate immediately?
        # For now, just confirm write.
        
    except Exception as e:
        print(f"Error applying change: {e}")
        sys.exit(1)

def export_flow(ctx: Any, flow_id: str, out_path: str) -> None:
    # Alias to ui_export for back-compat but using new strict logic
    ui_export(ctx, flow_id, out_path)
