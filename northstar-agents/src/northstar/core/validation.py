from typing import Dict, Any, List, Optional, Set
import json
from northstar.registry.schemas import FlowCard, NodeCard
from northstar.core.workspace.overlay_loader import OverlayRegistryLoader 
# We need OverlayRegistryLoader to properly load workspace priorities if we weren't injecting it?
# Actually FlowValidator gets 'ctx' which is already loaded.
# But it also creates "WorkspaceManager" manually.
# In Phase 23 Part A, we moved WorkspaceManager to __init__.
from northstar.core.workspace import WorkspaceManager
from northstar.ui_contract.graph_payload_v1 import (
    ValidationReportV1, ValidationItem, FlowData, NodeData, EdgeData
)

class FlowValidator:
    def __init__(self, ctx: Any):
        self.ctx = ctx
        self.workspace = WorkspaceManager() # Defaults to .northstar/workspace
        
        # State for current validation run
        self.reports: Dict[str, ValidationItem] = {}
        self.live_results: Dict[str, Any] = {} 

    def _get_item(self, item_id: str) -> ValidationItem:
        if item_id not in self.reports:
            self.reports[item_id] = ValidationItem(id=item_id, valid=True)
        return self.reports[item_id]

    def _add_error(self, item_id: str, msg: str, ref_field: Optional[str] = None):
        item = self._get_item(item_id)
        item.valid = False
        item.errors.append(msg)
        if ref_field:
            item.missing_refs.append(ref_field)

    def _add_warning(self, item_id: str, msg: str):
        item = self._get_item(item_id)
        item.warnings.append(msg)

    def validate_node(self, node_id: str) -> ValidationReportV1:
        """Validate a single node in isolation."""
        self.reports = {}
        self.live_results = {}
        
        node = self._load_node(node_id)
        if not node:
            self._add_error(node_id, f"Node {node_id} not found.")
        else:
            self._validate_node_integrity(node)

        return self._finalize_report()

    def validate(self, flow_id: str, live: bool = False, profile: Optional[str] = None, tenant_id: Optional[str] = None) -> ValidationReportV1:
        self.reports = {}
        self.live_results = {}
        
        # Resolve Tenant & Policies
        policies = []
        budget = None
        if tenant_id:
            tenant = self.ctx.tenants.get(tenant_id)
            if not tenant:
                self._add_error(flow_id, f"Tenant '{tenant_id}' not found.")
                return self._finalize_report(tenant_id)
            
            # Resolve policies
            for pid in tenant.policy_pack_refs:
                pack = self.ctx.policy_packs.get(pid)
                if pack:
                    policies.append(pack)
                else:
                    self._add_warning(flow_id, f"Referenced policy pack '{pid}' not found.")
            
            # Resolve Budget
            if tenant.budget_ref:
                budget = self.ctx.budgets.get(tenant.budget_ref)
                if not budget:
                    self._add_warning(flow_id, f"Referenced budget '{tenant.budget_ref}' not found.")
        
        # 1. Load Flow
        flow_card = self._load_flow(flow_id)
        if not flow_card:
            self._add_error(flow_id, f"Flow {flow_id} not found.")
            return self._finalize_report(tenant_id)

        # 2. Graph & Node Checks
        nodes: Dict[str, NodeCard] = {}
        flow_report = self._get_item(flow_id) # Ensure flow entry exists

        for node_id in flow_card.nodes:
            node = self._load_node(node_id)
            if not node:
                self._add_error(flow_id, f"Node {node_id} referenced in flow but not found.")
            else:
                nodes[node_id] = node
                self._validate_node_integrity(node)
                # Check policies
                if policies:
                    self._check_policies(node, policies)

        # 2b. Check Budget (Static)
        if budget:
            if budget.max_nodes_per_run and len(nodes) > budget.max_nodes_per_run:
                self._add_error(flow_id, f"Budget Violation: Flow has {len(nodes)} nodes, max allowed is {budget.max_nodes_per_run}")

        # 3. Connectivity
        self._validate_connectivity(flow_card, nodes)

        # 4. Live Checks
        if live:
            self._run_live_checks(nodes, profile)

        return self._finalize_report(tenant_id, policies)

    def _finalize_report(self, tenant_id: Optional[str] = None, policies: List[Any] = None) -> ValidationReportV1:
        # Check if any item is invalid
        overall_valid = all(item.valid for item in self.reports.values())
        return ValidationReportV1(
            valid=overall_valid,
            tenant_id=tenant_id,
            applied_policies=[p.policy_pack_id for p in (policies or [])],
            items=self.reports,
            live_results=self.live_results
        )

    def _check_policies(self, node: Any, policies: List[Any]):
        nid = node.node_id
        for pack in policies:
            for rule in pack.rules:
                if rule.applies_to == "node":
                     # Check selector
                     match = True
                     # Selector is a dict, we match all keys against node attributes
                     # Special keys: "capability_id" needs list check
                     for k, v in rule.selector.items():
                         if k == "capability_id":
                             if not hasattr(node, "capability_ids") or v not in node.capability_ids:
                                 match = False
                                 break
                         elif hasattr(node, k):
                             # exact match string
                             if getattr(node, k) != v:
                                 match = False
                                 break
                         else:
                             # Attribute missing, fail match
                             match = False
                             break
                     
                     if match:
                         msg = f"Policy Violation [{pack.policy_pack_id}:{rule.rule_id}]: {rule.message}"
                         item = self._get_item(nid)
                         item.policy_violations.append(msg)
                         
                         if rule.action == "FAIL":
                             self._add_error(nid, msg)
                         elif rule.action == "WARN":
                             self._add_warning(nid, msg)

    def export_graph(self, flow_id: str, tenant_id: Optional[str] = None) -> Dict[str, Any]:
         # Re-run validation to get report
         report = self.validate(flow_id, tenant_id=tenant_id)
         
         flow_card = self._load_flow(flow_id)
         if not flow_card:
             return {"error": "Flow not found"}
             
         nodes_list = []
         edges_list = []

         for node_id in flow_card.nodes:
             node = self._load_node(node_id)
             if node:
                 # Resolve names
                 n_data = NodeData(
                     id=node.node_id,
                     name=node.name,
                     kind=node.kind,
                     persona_ref=node.persona_ref,
                     task_ref=node.task_ref,
                     provider_ref=node.provider_ref,
                     model_ref=node.model_ref,
                     capabilities=node.capability_ids if hasattr(node, 'capability_ids') else []
                 )
                 nodes_list.append(n_data)
        
         # Edges
         edges = flow_card.edges if isinstance(flow_card.edges, list) else []
         for idx, e in enumerate(edges):
             src = e.get("from") if isinstance(e, dict) else e.from_node
             dst = e.get("to") if isinstance(e, dict) else e.to_node
             edges_list.append(EdgeData(
                 id=f"edge_{idx}",
                 source=src,
                 target=dst
             ))

         return {
             "flow": FlowData(
                 id=flow_card.flow_id,
                 name=flow_card.name,
                 objective=flow_card.objective,
                 entry_node=flow_card.entry_node,
                 exit_nodes=flow_card.exit_nodes
             ).model_dump(),
             "nodes": [n.model_dump() for n in nodes_list],
             "edges": [e.model_dump() for e in edges_list],
             "registry": { # Placeholder until we populate real registry refs
                 "personas": [], "tasks": [], "providers": [], "models": [], "capabilities": []
             },
             "validation": report.model_dump()
         }

    def export_graph(self, flow_id: str, tenant_id: Optional[str] = None) -> Dict[str, Any]:
         # Re-run validation to get report
         report = self.validate(flow_id, tenant_id=tenant_id)
         
         flow_card = self._load_flow(flow_id)
         if not flow_card:
             return {"error": "Flow not found"}
             
         nodes_list = []
         edges_list = []

         for node_id in flow_card.nodes:
             node = self._load_node(node_id)
             if node:
                 # Resolve names
                 n_data = NodeData(
                     id=node.node_id,
                     name=node.name,
                     kind=node.kind,
                     persona_ref=node.persona_ref,
                     task_ref=node.task_ref,
                     provider_ref=node.provider_ref,
                     model_ref=node.model_ref,
                     capabilities=node.capability_ids if hasattr(node, 'capability_ids') else []
                 )
                 nodes_list.append(n_data)
        
         # Edges
         edges = flow_card.edges if isinstance(flow_card.edges, list) else []
         for idx, e in enumerate(edges):
             src = e.get("from") if isinstance(e, dict) else e.from_node
             dst = e.get("to") if isinstance(e, dict) else e.to_node
             edges_list.append(EdgeData(
                 id=f"edge_{idx}",
                 source=src,
                 target=dst
             ))

         return {
             "flow": FlowData(
                 id=flow_card.flow_id,
                 name=flow_card.name,
                 objective=flow_card.objective,
                 entry_node=flow_card.entry_node,
                 exit_nodes=flow_card.exit_nodes
             ).model_dump(),
             "nodes": [n.model_dump() for n in nodes_list],
             "edges": [e.model_dump() for e in edges_list],
             "registry": { # Placeholder until we populate real registry refs
                 "personas": [], "tasks": [], "providers": [], "models": [], "capabilities": []
             },
             "validation": report.model_dump()
         }

    def _load_flow(self, flow_id: str) -> Optional[FlowCard]:
         ws_data = self.workspace.load_card("flows", flow_id)
         if ws_data:
             class QuickCard:
                 def __init__(self, d): self.__dict__.update(d)
             return QuickCard(ws_data)
             
         return self.ctx.flows.get(flow_id)

    def _load_node(self, node_id: str) -> Optional[NodeCard]:
        ws_data = self.workspace.load_card("nodes", node_id)
        if ws_data:
            class QuickCard:
                 def __init__(self, d): 
                     self.provider_ref = d.get('provider_ref')
                     self.model_ref = d.get('model_ref')
                     self.persona_ref = d.get('persona_ref')
                     self.task_ref = d.get('task_ref')
                     self.capability_ids = d.get('capability_ids', [])
                     self.kind = d.get('kind')
                     self.node_id = d.get('node_id') or d.get('id')
                     self.name = d.get('name')
                     self.__dict__.update(d)
            return QuickCard(ws_data)
            
        return self.ctx.nodes.get(node_id)

    def _validate_node_integrity(self, node: Any) -> None:
        nid = node.node_id
        if node.kind == "agent":
            if not node.persona_ref:
                self._add_error(nid, "Missing persona_ref", "persona_ref")
            elif node.persona_ref not in self.ctx.personas:
                self._add_error(nid, f"Referenced persona '{node.persona_ref}' not found", "persona_ref")
                
            if not node.task_ref:
                self._add_error(nid, "Missing task_ref", "task_ref")
            elif node.task_ref not in self.ctx.tasks:
                 self._add_error(nid, f"Referenced task '{node.task_ref}' not found", "task_ref")
                 
            # Provider/Model
            if not node.provider_ref:
                self._add_error(nid, "Missing provider_ref", "provider_ref")
            elif not node.model_ref:
                self._add_error(nid, "Missing model_ref", "model_ref")
            else:
                 if node.provider_ref not in self.ctx.providers:
                     self._add_error(nid, f"Unknown provider '{node.provider_ref}'", "provider_ref")
                 if node.model_ref not in self.ctx.models:
                     self._add_error(nid, f"Unknown model '{node.model_ref}'", "model_ref")
                     
                 # Capabilities
                 if hasattr(node, "capability_ids") and node.capability_ids:
                     for cap_id in node.capability_ids:
                         if cap_id not in self.ctx.capabilities:
                             self._add_error(nid, f"Unknown capability '{cap_id}'")
                         else:
                             binding = self._find_binding(node.provider_ref, node.model_ref, cap_id)
                             if not binding:
                                 self._add_error(nid, f"No capability binding for '{cap_id}' on {node.provider_ref}/{node.model_ref}")

    def _find_binding(self, provider: str, model: str, capability: str) -> bool:
        for b in self.ctx.bindings:
            if b.capability_id == capability and b.provider_id == provider:
                if b.model_or_deployment_id == model:
                    return True
        return False

    def _validate_connectivity(self, flow: Any, nodes: Dict[str, Any]) -> None:
        fid = flow.flow_id
        if flow.entry_node not in nodes:
            self._add_error(fid, f"Entry node '{flow.entry_node}' missing from node list")
            
        # BFS
        queue = [flow.entry_node]
        visited = {flow.entry_node}
        adj = {n: [] for n in nodes}
        edges = flow.edges if isinstance(flow.edges, list) else []
        
        for e in edges:
            src = e.get("from") if isinstance(e, dict) else e.from_node
            dst = e.get("to") if isinstance(e, dict) else e.to_node
            if src in adj: adj[src].append(dst)
                
        while queue:
            curr = queue.pop(0)
            for neighbor in adj.get(curr, []):
                if neighbor not in visited and neighbor in nodes:
                    visited.add(neighbor)
                    queue.append(neighbor)
                    
        unreachable = set(nodes.keys()) - visited
        if unreachable:
            for u in unreachable:
                self._add_warning(u, "Node is unreachable from entry point")
            self._add_warning(fid, f"Unreachable nodes detected: {len(unreachable)}")

    def _run_live_checks(self, nodes: Dict[str, Any], profile: Optional[str]) -> None:
        targets = set()
        for n in nodes.values():
            if n.kind == "agent" and n.provider_ref and n.model_ref:
                targets.add((n.provider_ref, n.model_ref))
                
        from northstar.runtime.live.certifier import Certifier
        # Assuming Runtime is working, otherwise catch error
        
        try:
            certifier = Certifier(self.ctx)
            for (prov, mod) in targets:
                key = f"{prov}:{mod}"
                print(f"Running live certification for {key}...")
                try:
                    result = certifier.certify(prov, mod, profile)
                    status = "PASS" if result.success else "FAIL"
                    self.live_results[key] = f"{status} ({result.latency_ms:.2f}ms)"
                    
                    if not result.success:
                        # Append to all nodes using this provider/model?
                        # Or just global results? 
                        # Best to attach to nodes using it.
                        affected = [n.node_id for n in nodes.values() 
                                    if n.provider_ref == prov and n.model_ref == mod]
                        for nid in affected:
                             self._add_error(nid, f"Live Check Failed: {result.reason}")

                except Exception as e:
                     self.live_results[key] = f"ERROR: {str(e)}"
                     affected = [n.node_id for n in nodes.values() 
                                 if n.provider_ref == prov and n.model_ref == mod]
                     for nid in affected:
                         self._add_error(nid, f"Live Check Error: {e}")
        except Exception as e:
            print(f"Live checks skipped due to runtime error: {e}")
