import datetime
import json

from dataclasses import dataclass, asdict, field
from typing import Dict, Any, List, Optional
from atoms_agents.runtime.dag_validator import DAGValidator
from atoms_agents.registry.schemas import FlowCard, NodeCard
from atoms_agents.runtime.node_executor import NodeExecutor

from atoms_agents.runtime.context import AgentsRequestContext, ContextMode
from atoms_agents.runtime.memory_gateway import HttpMemoryGateway
from atoms_agents.engines_boundary.client import EnginesBoundaryClient

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

    def execute_flow(
        self, 
        flow: FlowCard, 
        profile_id: str = "dev_local",
        request_context: Optional[AgentsRequestContext] = None
    ) -> FlowRunResult:
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

            # Get profile
            profile = self.ctx.profiles.get(profile_id)
            if not profile:
                 print(f"[FlowExecutor] Warning: Profile {profile_id} not found in registry context.")
                 raise ValueError(f"Profile {profile_id} not found")

            for node_id in execution_order:
                node = self.nodes_map[node_id]
                print(f"[FlowExecutor] Executing Node: {node_id}")

                # Calculate specific edges for this node
                inbound = [e.edge_id for e in flow.edges if e.target == node_id]
                outbound = [e.edge_id for e in flow.edges if e.source == node_id]

                # Execute with strict edge boundaries and context
                node_res_obj = self.node_executor.execute_node(
                    node,
                    profile,
                    request_context=request_context,
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

    def execute_factory_loop(
        self, 
        flow: FlowCard, 
        profile_id: str = "dev_local", 
        max_attempts: int = 3,
        tenant_id: str = None,
        user_id: str = None,
        project_id: str = None
    ) -> FlowRunResult:
        """
        Executes the flow within a Factory Loop V1 wrapper.
        Manages Explore -> Execute -> QA -> Refine -> Complete transitions.
        """
        from atoms_agents.runtime.loop_controller import LoopController, LoopContext, LoopState
        
        if not tenant_id:
             raise ValueError("tenant_id is required for factory loop execution")
        if not project_id:
             raise ValueError("project_id is required for factory loop execution (No-Placeholder Policy)")
        
        # 1. Init Loop Context
        run_id = f"run_{int(datetime.datetime.now().timestamp())}"
        ctx = LoopContext(
            run_id=run_id, 
            tenant_id=tenant_id,
            max_attempts=max_attempts
        )
        controller = LoopController(ctx)
        
        # Build AgentsRequestContext for memory gateway
        request_context = AgentsRequestContext(
            tenant_id=tenant_id,
            mode=ContextMode.SAAS,
            project_id=project_id,
            request_id=f"req_{run_id}",
            run_id=run_id,
            user_id=user_id
        )
        
        print(f"[FlowExecutor] Starting Factory Loop for flow {flow.flow_id} (Tenant: {tenant_id}, Run: {run_id})")
        
        # 2. Explore Phase
        controller.transition(LoopState.EXPLORE, "Starting exploration")
        
        # 3. Strategy/Execute Phase
        controller.transition(LoopState.EXECUTE, f"Entering execution phase for {flow.flow_id}")
        
        final_result = None
        
        while True:
            # Execute the Flow DAG with high-sovereignty context
            print(f"[FlowExecutor] Loop Attempt {ctx.current_attempt}/{max_attempts}")
            result = self.execute_flow(flow, profile_id, request_context=request_context)
            final_result = result
            
            if result.status == "failed":
                controller.transition(LoopState.FAILED, f"Execution failed: {result.error}")
                break
                
            # 4. QA Phase (Explicit Check)
            controller.transition(LoopState.QA_REVIEW, "Execution done, verifying results from memory")
            
            # HARDENING: We do NOT auto-pass. Use real blackboard evidence.
            qa_verdict = self._check_qa_verdict(flow, result, request_context)
            
            if qa_verdict is True:
                controller.evaluate_qa(True, "Automated QA passed")
                controller.transition(LoopState.COMPLETE, "Loop completed successfully via Auto-QA")
                break
            elif qa_verdict is False:
                print("[FlowExecutor] Auto-QA Failed. Moving to REFINE.")
                if controller.transition(LoopState.REFINE, "Automated QA failed"):
                    continue
                else:
                    break # Max attempts reached
            else:
                # Undecided -> HUMAN_GATE
                print("[FlowExecutor] No automated QA verdict. Triggering HUMAN_GATE.")
                controller.transition(LoopState.HUMAN_GATE, "Awaiting manual approval (Indeterminate Auto-QA)")
                break
            
        return final_result

    def _check_qa_verdict(self, flow: FlowCard, result: FlowRunResult, context: Optional[AgentsRequestContext] = None) -> Optional[bool]:
        """
        Scans for explicit QA verdicts.
        If context provided, uses MemoryGateway batch lookup for real evidence.
        Otherwise falls back to local result scan.
        """
        # 1. High-Sovereignty Path: Memory Gateway Batch Lookup
        if context:
            try:
                client = EnginesBoundaryClient()
                gateway = HttpMemoryGateway(client, context)
                edge_ids = [e.edge_id for e in flow.edges]
                
                # Fetch all inbound data for the run
                inbound_data = gateway.get_inbound_blackboards(edge_ids)
                
                for eid, data in inbound_data.items():
                    if "qa_passed" in data:
                        print(f"[FlowExecutor] QA Verdict found in memory for edge {eid}: {data['qa_passed']}")
                        return data["qa_passed"]
            except Exception as e:
                print(f"[FlowExecutor] Warning: Failed to fetch QA verdict from memory gateway: {e}")
        
        # 2. Local Fallback: Scan results written in current run (useful for lab/offline)
        for node_res in result.node_results:
            writes = node_res.get("writes", {})
            if "qa_passed" in writes:
                return writes["qa_passed"]
            
            for artifact_path in node_res.get("artifacts", []):
                if artifact_path.endswith("qa_verdict.json"):
                    try:
                        with open(artifact_path, "r") as f:
                            verdict_data = json.load(f)
                            return verdict_data.get("passed")
                    except: pass
        
        return None
