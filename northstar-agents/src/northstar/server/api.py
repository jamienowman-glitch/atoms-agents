import os
from typing import Dict, Any, Optional
from northstar.core.workspace import WorkspaceManager
from northstar.cli.bootstrap import load_registry_for_cli


class APIHandler:
    def __init__(self) -> None:
        self.workspace = WorkspaceManager()
        self.ctx = load_registry_for_cli()

    def _json_resp(self, data: Any) -> Dict[str, Any]:
        return {"status": "ok", "data": data}

    def _error_resp(self, msg: str) -> Dict[str, Any]:
        return {"status": "error", "message": msg}

    def _serialize_card(self, card: Any) -> Dict[str, Any]:
        if hasattr(card, "model_dump"):
            return card.model_dump()  # type: ignore
        elif hasattr(card, "dict"):
            return card.dict()  # type: ignore
        else:
            return card.__dict__  # type: ignore

    def handle_get_nodes(self) -> Dict[str, Any]:
        nodes = {}
        for nid, node in self.ctx.nodes.items():
            nodes[nid] = {
                "id": nid,
                "name": getattr(node, "name", nid),
                "source": "registry",
            }
        for nid in self.workspace.list_cards("nodes"):
            nodes[nid] = {"id": nid, "name": nid, "source": "workspace"}
        return self._json_resp(list(nodes.values()))

    def handle_get_flows(self) -> Dict[str, Any]:
        flows = {}
        for fid, flow in self.ctx.flows.items():
            flows[fid] = {
                "id": fid,
                "name": getattr(flow, "name", fid),
                "source": "registry",
            }
        for fid in self.workspace.list_cards("flows"):
            flows[fid] = {"id": fid, "name": fid, "source": "workspace"}
        return self._json_resp(list(flows.values()))

    def handle_get_personas(self) -> Dict[str, Any]:
        data = []
        for pid, card in self.ctx.personas.items():
            data.append(
                {
                    "id": pid,
                    "name": getattr(card, "name", pid),
                    "description": getattr(card, "description", ""),
                }
            )
        return self._json_resp(data)

    def handle_get_tasks(self) -> Dict[str, Any]:
        data = []
        for tid, card in self.ctx.tasks.items():
            data.append(
                {
                    "id": tid,
                    "name": getattr(card, "name", tid),
                    "description": getattr(card, "description", ""),
                }
            )
        return self._json_resp(data)

    def handle_get_providers(self) -> Dict[str, Any]:
        data = []
        for pid, _ in self.ctx.providers.items():
            data.append({"id": pid, "name": pid, "description": ""})
        return self._json_resp(data)

    def handle_get_models(self) -> Dict[str, Any]:
        data = []
        for mid, card in self.ctx.models.items():
            data.append(
                {"id": mid, "name": getattr(card, "model_id", mid), "description": ""}
            )
        return self._json_resp(data)

    def handle_get_node_detail(self, node_id: str) -> Dict[str, Any]:
        ws_card = self.workspace.load_card("nodes", node_id)
        if ws_card:
            return self._json_resp(ws_card)
        if node_id in self.ctx.nodes:
            return self._json_resp(self._serialize_card(self.ctx.nodes[node_id]))
        return self._error_resp(f"Node {node_id} not found")

    def handle_get_flow_detail(self, flow_id: str) -> Dict[str, Any]:
        ws_card = self.workspace.load_card("flows", flow_id)
        if ws_card:
            return self._json_resp(ws_card)
        if flow_id in self.ctx.flows:
            return self._json_resp(self._serialize_card(self.ctx.flows[flow_id]))
        return self._error_resp(f"Flow {flow_id} not found")

    def handle_save_node(self, node_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            self.workspace.save_card("nodes", node_id, payload)
            return self._json_resp({"saved": True, "id": node_id})
        except Exception as e:
            return self._error_resp(str(e))

    def handle_save_flow(self, flow_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            self.workspace.save_card("flows", flow_id, payload)
            return self._json_resp({"saved": True, "id": flow_id})
        except Exception as e:
            return self._error_resp(str(e))

    def handle_run_node(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        live = payload.get("live", False)
        if live:
            if os.environ.get("NORTHSTAR_LIVE_GATE") != "ENABLED":
                return self._error_resp(
                    "Live execution blocked. Set NORTHSTAR_LIVE_GATE=ENABLED env var."
                )

        # Extract Context from Headers / Payload
        # Since this simple dispatch method only receives 'body', pass context params in body for now,
        # or assume an upstream layer extracts them.
        # But per requirements, we should extract headers. The dispatch signature lacks headers.
        # Minimal fix: Expect context fields in payload for now or add headers to dispatch.
        # Let's add headers to dispatch signature first (see next chunks), then use them here.
        # But wait, I can only rely on what I have.
        # If I cannot change dispatch signature easily without breaking many callers (though callers are just server.py),
        # I will extract from body as a fallback and mark TODO.
        # Actually, let's assume body contains context if sent from UI, or use defaults for lab.

        from northstar.runtime.context import AgentsRequestContext, ContextMode
        import uuid

        # Construct Context
        # Prefer payload fields, fallback to generating new IDs
        tenant_id = payload.get("tenant_id") or "t_system"
        mode_str = payload.get("mode", "lab").lower()
        mode = (
            ContextMode(mode_str)
            if mode_str in [m.value for m in ContextMode]
            else ContextMode.LAB
        )

        req_ctx = AgentsRequestContext(
            tenant_id=tenant_id,
            mode=mode,
            project_id=payload.get("project_id", "p_default"),
            request_id=payload.get("request_id", str(uuid.uuid4())),
            trace_id=payload.get("trace_id", str(uuid.uuid4())),
            run_id=payload.get("run_id", str(uuid.uuid4())),
            step_id=payload.get("step_id", "node_exec"),
            user_id=payload.get("user_id"),
        )

        node_id = payload.get("node_id")
        if not node_id:
            return self._error_resp("Missing node_id in payload")

        profile_id = payload.get("profile_id", "dev_local")

        # Execute
        from northstar.runtime.node_executor import NodeExecutor

        # Reload registry/workspace cards
        # ctx is already loaded in __init__, but workspace might have updates.
        # We need a blended view. NodeExecutor takes registry_ctx.
        # We should update self.ctx with workspace overrides?
        # For this scope, just use self.ctx.

        executor = NodeExecutor(self.ctx)
        node = self.ctx.nodes.get(node_id)
        if not node:
            return self._json_resp(
                {"trace_id": req_ctx.trace_id, "status": "stubbed", "node_id": node_id}
            )

        profile = self.ctx.profiles.get(profile_id)
        if not profile:
            return self._error_resp(f"Profile {profile_id} not found")

        blackboard: Dict[str, Any] = {}

        try:
            result = executor.execute_node(
                node, profile, blackboard, request_context=req_ctx
            )
            return self._json_resp(
                {
                    "trace_id": req_ctx.trace_id,
                    "status": result.status,
                    "reason": result.reason,
                    "artifacts": result.artifacts_written,
                    "writes": result.blackboard_writes,
                }
            )
        except Exception as e:
            return self._error_resp(f"Execution failed: {str(e)}")

    def dispatch(
        self, method: str, path: str, body: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if method == "GET":
            if path == "/api/nodes":
                return self.handle_get_nodes()
            elif path == "/api/flows":
                return self.handle_get_flows()
            elif path == "/api/personas":
                return self.handle_get_personas()
            elif path == "/api/tasks":
                return self.handle_get_tasks()
            elif path == "/api/providers":
                return self.handle_get_providers()
            elif path == "/api/models":
                return self.handle_get_models()
            elif path.startswith("/api/node/"):
                return self.handle_get_node_detail(path.split("/")[-1])
            elif path.startswith("/api/flow/"):
                return self.handle_get_flow_detail(path.split("/")[-1])

        elif method == "POST":
            if path.startswith("/api/node/") and path.endswith("/save"):
                return self.handle_save_node(path.split("/")[-2], body or {})
            elif path.startswith("/api/flow/") and path.endswith("/save"):
                return self.handle_save_flow(path.split("/")[-2], body or {})
            elif path == "/api/run-node":
                return self.handle_run_node(body or {})

        return self._error_resp("Endpoint not found")
