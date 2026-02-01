from typing import Optional, Dict, Any
from atoms_agents.registry.loader import RegistryLoader, RegistryContext
from atoms_agents.core.workspace.store import WorkspaceStore
from atoms_agents.registry.parsers import parse_node, parse_flow
from atoms_agents.registry.schemas import NodeCard, FlowCard

class OverlayRegistryLoader:
    """
    Wraps the standard RegistryLoader to apply workspace overrides.
    Priority: Workspace Overlay > Registry.
    """
    def __init__(self, registry_root: str, workspace_store: WorkspaceStore):
        self.base_loader = RegistryLoader(registry_root)
        self.store = workspace_store

    def load_context(self, tenant_id: Optional[str] = None) -> RegistryContext:
        """
        Load the full registry context, apply tenant overlays, then workspace overrides.
        """
        # 1. Load base registry
        ctx = self.base_loader.load_context()

        # 2. Apply Tenant Overlays (if specified)
        if tenant_id:
            import os
            import yaml

            # Assuming standard structure: registry/cards/tenant_overlays/<tenant_id>/
            tenant_overlay_dir = os.path.join(self.base_loader.root_path, "tenant_overlays", tenant_id)

            if os.path.exists(tenant_overlay_dir):
                for root, _, files in os.walk(tenant_overlay_dir):
                    for file in files:
                        if file.endswith((".yaml", ".yml")):
                            filepath = os.path.join(root, file)
                            try:
                                with open(filepath, 'r') as f:
                                    data = yaml.safe_load(f)

                                # Detect type and apply
                                if "card_type" in data:
                                    if data["card_type"] == "node":
                                        card = NodeCard(**data)
                                        ctx.nodes[card.node_id] = card
                                    elif data["card_type"] == "flow":
                                        card = FlowCard(**data)
                                        ctx.flows[card.flow_id] = card
                            except Exception as e:
                                print(f"Warning: Failed to load tenant overlay {filepath}: {e}")

        # 3. Get list of workspace overrides
        overrides = self.store.list_overrides()

        # 4. Apply Node overrides
        for node_id in overrides.get("nodes", []):
            path = self.store.get_card_path("node", node_id)
            if path:
                try:
                    import yaml
                    with open(path, 'r') as f:
                        data = yaml.safe_load(f)

                    card = NodeCard(**data)
                    ctx.nodes[card.node_id] = card
                except Exception as e:
                    print(f"Warning: Failed to load node override {node_id}: {e}")

        # 5. Apply Flow overrides
        for flow_id in overrides.get("flows", []):
            path = self.store.get_card_path("flow", flow_id)
            if path:
                try:
                    import yaml
                    with open(path, 'r') as f:
                        data = yaml.safe_load(f)

                    card = FlowCard(**data)
                    ctx.flows[card.flow_id] = card
                except Exception as e:
                    print(f"Warning: Failed to load flow override {flow_id}: {e}")

        return ctx
