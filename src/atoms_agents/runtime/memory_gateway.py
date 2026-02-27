from typing import Protocol, Dict, Any, List, TypedDict, Optional, cast
from atoms_agents.engines_boundary.client import EnginesBoundaryClient
from atoms_agents.runtime.context import AgentsRequestContext

def _build_provenance(agent_id: Optional[str], source_node_id: Optional[str]) -> Dict[str, str]:
    result: Dict[str, str] = {}
    if agent_id:
        result["agent_id"] = agent_id
    if source_node_id:
        result["node_id"] = source_node_id
    return result

class MemoryRecord(TypedDict):
    content: Any
    timestamp: float
    modified_by: str

class MemoryGateway(Protocol):
    def read_whiteboard(self, scope_type: str, memory_scope_id: str, key: Optional[str] = None) -> Any:
        """
        Reads from whiteboard (Scoped).
        If key provided, returns value. If None, returns all entries as Dict.
        """
        ...

    def write_whiteboard(
        self,
        scope_type: str,
        memory_scope_id: str,
        key: str,
        value: Any,
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        """Writes to whiteboard (Scoped)."""
        ...

    def write_blackboard(
        self,
        edge_id: str,
        key: str,
        value: Any,
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        """Writes to blackboard (Run+Edge)."""
        ...

    def get_inbound_blackboards(self, edge_ids: List[str]) -> Dict[str, Dict[str, Any]]:
        """
        Fetches blackboards for all inbound edges.
        Returns mapped by edge_id: {edge_id_1: {key: val}, ...}
        """
        ...

class HttpMemoryGateway:
    def __init__(self, client: EnginesBoundaryClient, ctx: AgentsRequestContext):
        self.client = client
        self.ctx = ctx

    def _require_id(self, field: str) -> str:
        val = getattr(self.ctx, field, None)
        if not val:
            raise ValueError(f"Memory Gateway Strict Contract Violation: Context field '{field}' is required but missing.")
        return cast(str, val)

    def read_whiteboard(self, scope_type: str, memory_scope_id: str, key: Optional[str] = None) -> Any:
        tenant_id = self._require_id("tenant_id")
        path = "/v1/memory/whiteboard"
        params = {
            "scope_type": scope_type,
            "memory_scope_id": memory_scope_id,
            "request_tenant_id": tenant_id
        }
        if key:
            params["key"] = key
            
        return self.client.request_json("GET", path, self.ctx, params=params)

    def write_whiteboard(
        self,
        scope_type: str,
        memory_scope_id: str,
        key: str,
        value: Any,
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        path = "/v1/memory/whiteboard/write"
        agent_identifier = agent_id or self.ctx.actor_id or self.ctx.user_id
        
        # Determine strict identity context
        tenant_id = self._require_id("tenant_id")
        project_id = self._require_id("project_id") 
        run_id = self._require_id("run_id")

        payload = {
            "project_id": project_id,
            "scope_type": scope_type,
            "memory_scope_id": memory_scope_id,
            "run_id": run_id,
            "key": key,
            "value": value,
            "source_node_id": source_node_id,
            "agent_id": agent_identifier
        }
        
        params = {"request_tenant_id": tenant_id}
        self.client.request_json("POST", path, self.ctx, params=params, json=payload)

    def write_blackboard(
        self,
        edge_id: str,
        key: str,
        value: Any,
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        path = "/v1/memory/blackboard/write"
        agent_identifier = agent_id or self.ctx.actor_id or self.ctx.user_id
        
        tenant_id = self._require_id("tenant_id")
        project_id = self._require_id("project_id")
        run_id = self._require_id("run_id")

        payload = {
            "project_id": project_id,
            "run_id": run_id,
            "edge_id": edge_id,
            "key": key,
            "value": value,
            "source_node_id": source_node_id,
            "agent_id": agent_identifier
        }
        
        params = {"request_tenant_id": tenant_id}
        self.client.request_json("POST", path, self.ctx, params=params, json=payload)

    def get_inbound_blackboards(self, edge_ids: List[str]) -> Dict[str, Dict[str, Any]]:
        if not edge_ids:
            return {}
            
        tenant_id = self._require_id("tenant_id")
        run_id = self._require_id("run_id")
        
        path = "/v1/memory/blackboard/batch"
        payload = {
            "run_id": run_id,
            "edge_ids": edge_ids
        }
        params = {"request_tenant_id": tenant_id}
        
        return self.client.request_json("POST", path, self.ctx, params=params, json=payload)
