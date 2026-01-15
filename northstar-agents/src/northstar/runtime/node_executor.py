import time
from typing import Dict, Any, Optional, List
from northstar.registry.schemas import NodeCard, RunProfileCard
from northstar.runtime.node_result import NodeRunResult
from northstar.runtime.audit.emitter import AuditEmitter, ConsoleAuditEmitter
from northstar.runtime.audit.events import AuditEvent, EventType
import uuid
# Will use gateways in future phases, for now scaffolding logic

from northstar.nexus.client import NexusClient, NoOpNexusClient
from northstar.runtime.context import AgentsRequestContext  # Type hint
from northstar.runtime.gateway_resolution import resolve_gateway


class NodeExecutor:
    def __init__(
        self,
        registry_ctx: Any,
        audit_emitter: Optional[AuditEmitter] = None,
        nexus_client: Optional[NexusClient] = None,
    ):
        self.registry = registry_ctx
        self.audit_emitter = audit_emitter or ConsoleAuditEmitter()
        self.nexus_client = nexus_client or NoOpNexusClient()

    def execute_node(
        self,
        node: NodeCard,
        profile: RunProfileCard,
        blackboard: Dict[str, Any],
        request_context: Optional[AgentsRequestContext] = None,
        provider_override: Optional[str] = None,
        model_override: Optional[str] = None,
    ) -> NodeRunResult:
        start_ts = time.time()
        events: List[Dict[str, Any]] = []
        run_id = str(uuid.uuid4())
        
        # Prepare context fields
        if not request_context:
            # FAIL-FAST: Context is mandatory for real execution to ensure headers propagate.
            # Exception: If user explicitly opts out or uses legacy test harness that doesn't care (but really we should enforce).
            # We raise ValueError.
            raise ValueError(
                "AgentsRequestContext is required for Node execution. "
                "Ensure you are running via a context-aware entrypoint (CLI/Server)."
            )

        ctx_args = {}
        if request_context:
            ctx_args = {
                "tenant_id": request_context.tenant_id,
                "mode": request_context.mode.value,
                "project_id": request_context.project_id,
                "request_id": request_context.request_id,
                "trace_id": request_context.trace_id,
                "step_id": request_context.step_id,
                "app_id": request_context.app_id,
                "surface_id": request_context.surface_id,
                "actor": request_context.actor_id or request_context.user_id,
            }

        self.audit_emitter.emit(
            AuditEvent(
                event_type=EventType.NODE_START,
                run_id=run_id,
                node_id=node.node_id,
                payload={"profile_id": profile.profile_id},
                **ctx_args, # type: ignore
            )
        )

        try:
            # 0. Early Validations
            if node.kind == "human":
                return self._skip(node, run_id, "Human-in-the-loop not implemented", start_ts, ctx_args)
            if node.kind in ["subflow", "framework_team"]:
                return self._skip(node, run_id, f"Kind {node.kind} not implemented", start_ts, ctx_args)
            if node.kind != "agent":
                return self._fail(node, run_id, f"Unknown node kind: {node.kind}", start_ts, events, ctx_args)

            # 1. Resolve Resources (Persona/Task)
            if not node.persona_ref or not node.task_ref:
                return self._skip(node, run_id, "Missing persona/task ref", start_ts, ctx_args)
            
            persona = self.registry.personas.get(node.persona_ref)
            task = self.registry.tasks.get(node.task_ref)
            if not persona or not task:
                return self._fail(node, run_id, "Persona or Task not found", start_ts, events, ctx_args)

            # 2. Resolve Provider/Model
            provider_id = provider_override or node.provider_ref
            model_id = model_override or node.model_ref

            if not provider_id:
                return self._fail(node, run_id, "No provider specified", start_ts, events, ctx_args)
            if not model_id:
                return self._fail(node, run_id, "No model specified", start_ts, events, ctx_args)

            events.append({"type": "resolution", "provider": provider_id, "model": model_id})

            # 3. Gateway Readiness
            try:
                gateway = resolve_gateway(provider_id)
            except ValueError as e:
                return self._fail(node, run_id, str(e), start_ts, events, ctx_args)

            readiness = gateway.check_readiness()
            events.append({"type": "readiness_check", "ready": readiness.ready, "reason": readiness.reason})
            if not readiness.ready:
                return self._skip(node, run_id, f"Provider not ready: {readiness.reason}", start_ts, ctx_args, events)

            # 4. Context & Invocation
            nexus_context = self._fetch_nexus_context(task, events)
            
            from northstar.runtime.prompting.composer import compose_messages
            messages = compose_messages(persona, task, blackboard, nexus_context=nexus_context)
            
            response = self._invoke_gateway(
                node, gateway, messages, model_id, provider_id, events, request_context
            )
            
            if response.get("status") == "FAIL":
                return self._fail(node, run_id, response.get("reason", "Gateway failed"), start_ts, events, ctx_args)

            content = response.get("content", "")
            if not content:
                return self._fail(node, run_id, "Empty response", start_ts, events, ctx_args)

            # 5. Outputs
            artifacts_written, writes = self._write_outputs(node, content, blackboard)
            
            # End
            self.audit_emitter.emit(
                AuditEvent(
                    event_type=EventType.NODE_END,
                    run_id=run_id,
                    node_id=node.node_id,
                    payload={"status": "PASS", "duration_ms": (time.time() - start_ts) * 1000},
                    **ctx_args, # type: ignore
                )
            )

            return NodeRunResult(
                node_id=node.node_id, status="PASS", reason="Executed successfully",
                started_ts=start_ts, ended_ts=time.time(),
                artifacts_written=artifacts_written, blackboard_writes=writes, events=events
            )

        except Exception as e:
            self.audit_emitter.emit(
                AuditEvent(
                    event_type=EventType.ERROR, run_id=run_id, node_id=node.node_id,
                    payload={"error": str(e)}, **ctx_args, # type: ignore
                )
            )
            return NodeRunResult(
                node_id=node.node_id, status="FAIL", reason=str(e),
                started_ts=start_ts, ended_ts=time.time(), error=str(e), events=events
            )

    def _skip(self, node: NodeCard, run_id: str, reason: str, start_ts: float, ctx_args: Dict[str, Any], events: Optional[List[Dict[str, Any]]] = None) -> NodeRunResult:
        return NodeRunResult(node.node_id, "SKIP", reason, start_ts, time.time(), events=events or [])

    def _fail(self, node: NodeCard, run_id: str, reason: str, start_ts: float, events: List[Dict[str, Any]], ctx_args: Dict[str, Any]) -> NodeRunResult:
        return NodeRunResult(node.node_id, "FAIL", reason, start_ts, time.time(), events=events)

    def _fetch_nexus_context(self, task: Any, events: List[Dict[str, Any]]) -> List[str]:
        nexus_docs = self.nexus_client.search(query=task.goal, k=3)
        nexus_context = [f"{d.document.content} (Score: {d.score:.2f})" for d in nexus_docs]
        if nexus_context:
            events.append({"type": "nexus_retrieval", "count": len(nexus_context)})
        return nexus_context

    def _invoke_gateway(
        self,
        node: NodeCard,
        gateway: Any,
        messages: List[Dict[str, Any]],
        model_id: str,
        provider_id: str,
        events: List[Dict[str, Any]],
        request_context: Optional[AgentsRequestContext] = None,
    ) -> Dict[str, Any]:
        model_card = self.registry.models.get(model_id)
        if not model_card:
            from northstar.registry.schemas import ModelCard
            model_card = ModelCard(model_id, provider_id, model_id)
        
        from northstar.runtime.gateway import CapabilityToggleRequest
        toggles = [CapabilityToggleRequest(capability_id=c) for c in node.capability_ids or []]
        
        events.append({"type": "invocation_start"})
        from northstar.runtime.limits import RunLimits
        limits = RunLimits(max_calls=1, max_output_tokens=4096, timeout_seconds=60.0)
        
        resp = gateway.generate(
            messages,
            model_card,
            None,
            capability_toggles=toggles,
            limits=limits,
            request_context=request_context,
        )
        events.append({"type": "invocation_end"})
        return dict(resp)

    def _write_outputs(self, node: NodeCard, content: str, blackboard: Dict[str, Any]) -> tuple[List[str], Dict[str, Any]]:
        from northstar.runtime.artifact_writer import ArtifactWriter
        specs = [self.registry.artifact_specs.get(aid) for aid in node.artifact_outputs]
        specs = [s for s in specs if s] # Filter None
        
        paths = []
        if specs:
            content_map = {s.artifact_spec_id: content for s in specs}
            paths = ArtifactWriter.write_artifacts(specs, content_map)
            
        writes = {}
        for key in node.blackboard_writes:
            val = f"See artifact: {paths[0] if paths else 'No artifact'}"
            writes[key] = val
            blackboard[key] = val
        return paths, writes
