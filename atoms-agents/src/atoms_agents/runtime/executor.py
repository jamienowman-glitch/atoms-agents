
import datetime
import json

from dataclasses import dataclass, asdict, field
from typing import Dict, Any, List, Optional
from atoms_agents.runtime.dag_validator import DAGValidator
from atoms_agents.registry.schemas import FlowCard, NodeCard
from atoms_agents.runtime.node_executor import NodeExecutor

@dataclass
class EdgeMap:
    inbound_edges: List[str] # edge_ids
    outbound_edges: List[str] # edge_ids

@dataclass
class FlowRunResult:
    flow_id: str
    status: str
    node_results: List[Dict[str, Any]] = field(default_factory=list)
    artifacts_written: List[str] = field(default_factory=list)
    started_ts: str = ""
    ended_ts: str = ""
    error: Optional[str] = None

class FlowExecutor:
    def __init__(self, registry_context: Any):
        self.ctx = registry_context
        self.nodes_map: Dict[str, NodeCard] = {}
        self.node_executor = NodeExecutor(registry_context)

    def load_registry(self) -> None:
        # Deprecated manual loading, now we pass context
        self.nodes_map = self.ctx.nodes

    def execute_flow(self, flow: FlowCard, profile_id: str = "dev_local") -> FlowRunResult:
        # Load registry if needed
        if not self.nodes_map:
            self.load_registry()

        result = FlowRunResult(
            flow_id=flow.flow_id,
            status="running",
            started_ts=datetime.datetime.now().isoformat()
        )

        try:
            # 1. Validate Structure & Integrity
            DAGValidator.validate_flow_integrity(flow, self.nodes_map)
            execution_order = DAGValidator.validate_dag(
                flow.nodes, flow.edges, flow.entry_node, flow.exit_nodes
            )

            print(f"[FlowExecutor] Execution Order: {execution_order}")

            # 2. Execute Nodes
            # blackboard: Dict[str, Any] = {} # REMOVED: Global state

            # Get profile
            profile = self.ctx.profiles.get(profile_id)
            if not profile:
                 # If profile missing, we might fail or warn. For now let's try to proceed if node executor handles it?
                 # Actually node executor needs profile.
                 # But verify_modes/framework might pass mock profile?
                 # Let's assume profile exists or fail.
                 print(f"[FlowExecutor] Warning: Profile {profile_id} not found in registry context.")
                 # We need a profile object to pass.
                 # If not found, we cannot proceed with real execution.
                 raise ValueError(f"Profile {profile_id} not found")

            for node_id in execution_order:
                node = self.nodes_map[node_id]
                print(f"[FlowExecutor] Executing Node: {node_id}")

                # Execute
                # Calculate specific edges for this node
                # TODO: This could be pre-calculated for O(1) lookup
                inbound = [
                    e.edge_id for e in flow.edges
                    if e.target == node_id
                ]
                outbound = [
                    e.edge_id for e in flow.edges
                    if e.source == node_id
                ]

                # Execute with strict edge boundries
                node_res_obj = self.node_executor.execute_node(
                    node,
                    profile,
                    inbound_edge_ids=inbound,
                    outbound_edge_ids=outbound
                )

                # Convert to dict for report
                node_res_dict = {
                    "node_id": node_res_obj.node_id,
                    "status": node_res_obj.status,
                    "reason": node_res_obj.reason,
                    "started_ts": node_res_obj.started_ts,
                    "ended_ts": node_res_obj.ended_ts,
                    "artifacts": node_res_obj.artifacts_written,
                    "writes": node_res_obj.blackboard_writes
                }

                result.node_results.append(node_res_dict)

                if node_res_obj.status == "FAIL":
                     result.status = "failed"
                     print(f"[FlowExecutor] Node {node_id} Failed: {node_res_obj.reason}")
                     break

            if result.status == "running":
                result.status = "success"

        except Exception as e:
            print(f"[FlowExecutor] Error: {e}")
            result.status = "failed"
            result.error = str(e)
            import traceback
            traceback.print_exc()

        result.ended_ts = datetime.datetime.now().isoformat()

        # 3. Write Report Artifact
        self._write_report(result)

        return result

    def _write_report(self, result: FlowRunResult) -> None:
        from atoms_agents.core.paths import get_artifacts_dir
        artifacts_dir = get_artifacts_dir()

        filename = f"flow_run_{result.flow_id}_{int(datetime.datetime.now().timestamp())}.json"
        path = artifacts_dir / filename

        with open(path, "w") as f:
            json.dump(asdict(result), f, indent=2)

        result.artifacts_written.append(str(path))
        print(f"[FlowExecutor] Run report written to: {path}")
