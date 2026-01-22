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
from northstar.runtime.canvas_mirror import CanvasMirror
from northstar.runtime.memory_gateway import MemoryGateway, HttpMemoryGateway
from northstar.engines_boundary.client import EnginesBoundaryClient

VALID_VISIBILITIES = {"public", "internal", "system"}


class NodeExecutor:
    def __init__(
        self,
        registry_ctx: Any,
        audit_emitter: Optional[AuditEmitter] = None,
        nexus_client: Optional[NexusClient] = None,
        canvas_mirror: Optional[CanvasMirror] = None,
    ):
        self.registry = registry_ctx
        self.audit_emitter = audit_emitter or ConsoleAuditEmitter()
        self.nexus_client = nexus_client or NoOpNexusClient()
        self.canvas_mirror = canvas_mirror

    def execute_node(
        self,
        node: Any, # Can be NodeCard (Legacy) or NeutralNodeCard (New)
        profile: RunProfileCard,
        blackboard: Optional[Dict[str, Any]] = None,
        request_context: Optional[AgentsRequestContext] = None,
        provider_override: Optional[str] = None,
        model_override: Optional[str] = None,
        inbound_edge_ids: Optional[List[str]] = None,
        outbound_edge_ids: Optional[List[str]] = None,
    ) -> NodeRunResult:
        start_ts = time.time()
        events: List[Dict[str, Any]] = []
        run_id = str(uuid.uuid4())
        
        # Prepare context fields
        if not request_context:
            raise ValueError(
                "AgentsRequestContext is required for Node execution. "
                "Ensure you are running via a context-aware entrypoint (CLI/Server)."
            )
        if self.canvas_mirror:
            self._log_event(
                events,
                "canvas_mirror_attached",
                canvas_id=self.canvas_mirror.canvas_id,
                mirrored_events=len(self.canvas_mirror.snapshot()),
            )

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

        if not inbound_edge_ids: inbound_edge_ids = []
        if not outbound_edge_ids: outbound_edge_ids = []

        # Initialize Gateway
        # In a real DI system this is injected, for now we lazy load if not in context
        memory_gateway = None
        # Check RunContext if available (todo: pass RunContext instead of just Profile)
        # For now, we instantiate a gateway if we have a request context
        if request_context:
            client = EnginesBoundaryClient() # Default localhost
            memory_gateway = HttpMemoryGateway(client, request_context)

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
            # Detect Node Type
            is_neutral = hasattr(node, "components")
            
            if is_neutral:
                # --- NEW GRAPH_LENS PATH ---
                from northstar.runtime.runner import ComponentRunner
                runner = ComponentRunner()
                
                # Apply Middleware (Lenses) - Placeholder
                # context_lens = self._resolve_context_lens(node, events)
                # safety_lens = self._resolve_safety_lens(node, events)
                
                # Execute Components Sequentially (for now)
                # Ideally, a node with multiple components might run them in parallel or pipe them
                # For this iteration, we run the first component
                if not node.components:
                     return self._allow_pass(node, run_id, "Empty Neutral Node", start_ts, events, ctx_args)
                
                # Run the first component as the primary actor
                primary_comp = node.components[0]
                # Blackboard is replaced by request_context state or separate fetch (TODO)
                # For now just passing empty dict for component runner signature
                result = runner.run_component(primary_comp, {}, request_context)
                
                # Write Blackboard Outputs (if defined in component config or node)
                # For now, simplistic passing
                
                return NodeRunResult(
                    node_id=node.node_id, 
                    status="PASS", 
                    reason="Component Executed",
                    started_ts=start_ts, 
                    ended_ts=time.time(),
                    artifacts_written=result.get("artifacts", []), 
                    blackboard_writes={}, 
                    events=events
                )
            
            else:
                # --- LEGACY PATH (Backwards Compatibility) ---
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
                
                if not provider_id or not model_id:
                     return self._fail(node, run_id, "No provider specified or model missing", start_ts, events, ctx_args)

                from northstar.runtime.gateway import CapabilityToggleRequest
                toggles = [CapabilityToggleRequest(capability_id=c) for c in node.capability_ids or []]
                
                # 2a. Fetch Inbound Memory (The "Read" Step)
                inbound_blackboards = {}
                if memory_gateway:
                    inbound_blackboards = memory_gateway.get_inbound_blackboards(inbound_edge_ids)
                
                # --- SPINE-SYNC: CANVAS TOOL INGESTION ---
                if self.canvas_mirror:
                     canvas_tools = self.canvas_mirror.get_tools()
                     if canvas_tools:
                         # Append dynamic tools from the canvas
                         # Assuming Gateway can handle raw Tool Definitions in toggles or a separate arg
                         # For now, we simply log/append them as available functions if the gateway supports it
                         # or simplistic injection into context
                         self._log_event(events, "canvas_tools_detected", count=len(canvas_tools))
                         # TODO: Pass these properly to gateway.generate when gateway supports dynamic tool definitions
                         # For now, we inject into the request_context or similar so the model 'sees' them via prompt
                         
                self._log_event(
                    events,
                    "resolution",
                    provider=provider_id,
                    model=model_id,
                )

                # 3. Gateway Readiness
                try:
                    gateway = resolve_gateway(provider_id)
                except ValueError as e:
                    return self._fail(node, run_id, str(e), start_ts, events, ctx_args)

                readiness = gateway.check_readiness()
                self._log_event(
                    events,
                    "readiness_check",
                    ready=readiness.ready,
                    reason=readiness.reason,
                )
                if not readiness.ready:
                    return self._skip(node, run_id, f"Provider not ready: {readiness.reason}", start_ts, ctx_args, events)

                # 4. Context & Invocation
                nexus_context = self._fetch_nexus_context(task, events)

                from northstar.runtime.prompting.composer import compose_messages
                messages = compose_messages(
                    persona, 
                    task, 
                    inbound_blackboards, # Was blackboard
                    nexus_context=nexus_context
                )

                response = self._invoke_gateway(
                    node, gateway, messages, model_id, provider_id, events, request_context
                )
                
                if response.get("status") == "FAIL":
                    return self._fail(node, run_id, response.get("reason", "Gateway failed"), start_ts, events, ctx_args)

                content = response.get("content", "")
                if not content:
                    return self._fail(node, run_id, "Empty response", start_ts, events, ctx_args)

                self._log_chain_of_thought(events, response, provider_id, model_id)

                # 5. Outputs
                artifacts_written, writes = self._write_outputs(node, content)
                
                # Write to Memory Gateway (The "Write" Step)
                if memory_gateway and outbound_edge_ids:
                    for edge_id in outbound_edge_ids:
                        # We write the same output to all outbound edges (broadcast)
                        # Or we could filter based on connection handles if we parsed that far
                        memory_gateway.write_blackboard(
                            edge_id,
                            writes,
                            agent_id=request_context.actor_id or request_context.user_id,
                            source_node_id=node.node_id,
                        )
                
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

    def _allow_pass(self, node: Any, run_id: str, reason: str, start_ts: float, events: List[Dict[str, Any]], ctx_args: Dict[str, Any]) -> NodeRunResult:
         return NodeRunResult(node.node_id, "PASS", reason, start_ts, time.time(), events=events)

    def _skip(self, node: NodeCard, run_id: str, reason: str, start_ts: float, ctx_args: Dict[str, Any], events: Optional[List[Dict[str, Any]]] = None) -> NodeRunResult:
        return NodeRunResult(node.node_id, "SKIP", reason, start_ts, time.time(), events=events or [])

    def _fail(self, node: NodeCard, run_id: str, reason: str, start_ts: float, events: List[Dict[str, Any]], ctx_args: Dict[str, Any]) -> NodeRunResult:
        return NodeRunResult(node.node_id, "FAIL", reason, start_ts, time.time(), events=events)

    def _fetch_nexus_context(self, task: Any, events: List[Dict[str, Any]]) -> List[str]:
        nexus_docs = self.nexus_client.search(query=task.goal, k=3)
        nexus_context = [f"{d.document.content} (Score: {d.score:.2f})" for d in nexus_docs]
        if nexus_context:
            self._log_event(events, "nexus_retrieval", count=len(nexus_context))
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
        
        self._log_event(events, "invocation_start")
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
        self._log_event(events, "invocation_end")
        return dict(resp)

    def _log_event(
        self,
        events: List[Dict[str, Any]],
        event_type: str,
        *,
        visibility: str = "system",
        **payload: Any,
    ) -> None:
        entry: Dict[str, Any] = {"type": event_type, "visibility": self._normalize_visibility(visibility)}
        entry.update(payload)
        events.append(entry)

    def _log_chain_of_thought(
        self,
        events: List[Dict[str, Any]],
        response: Dict[str, Any],
        provider_id: str,
        model_id: str,
    ) -> None:
        payload: Dict[str, Any] = {"provider": provider_id, "model": model_id}
        for key in ("content", "analysis", "reason", "status"):
            if key in response:
                payload[key] = response[key]
        visibility = response.get("visibility") if isinstance(response.get("visibility"), str) else None
        if visibility not in VALID_VISIBILITIES:
            visibility = "internal"
        self._log_event(events, "chain_of_thought", visibility=visibility, **payload)

    def _normalize_visibility(self, value: str) -> str:
        return value if value in VALID_VISIBILITIES else "system"

    def attach_canvas_mirror(self, mirror: CanvasMirror) -> None:
        """Attach a CanvasMirror for downstream lenses to read."""
        self.canvas_mirror = mirror

    def _write_outputs(self, node: NodeCard, content: str) -> tuple[List[str], Dict[str, Any]]:
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
            # blackboard[key] = val # REMOVED GLOBAL WRITE
        return paths, writes
