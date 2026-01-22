from typing import Protocol, Dict, Any, List, TypedDict, Optional, cast
from northstar.engines_boundary.client import EnginesBoundaryClient
from northstar.runtime.context import AgentsRequestContext

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
    def read_whiteboard(self, edge_id: str) -> Dict[str, Any]:
        """Reads the whiteboard state used for caching/dedup."""
        ...

    def write_whiteboard(
        self,
        edge_id: str,
        data: Dict[str, Any],
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        """Writes run-global data to the whiteboard."""
        ...

    def write_blackboard(
        self,
        edge_id: str,
        data: Dict[str, Any],
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        """Writes output to the edge's blackboard."""
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

    def read_whiteboard(self, edge_id: str) -> Dict[str, Any]:
        path = f"/v1/memory/whiteboard/{edge_id}"
        try:
            return self.client.request_json("GET", path, self.ctx)
        except Exception:
            # Fallback to empty if not found or error, strictness can be configurable later
            return {}

    def write_whiteboard(
        self,
        edge_id: str,
        data: Dict[str, Any],
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        path = f"/v1/memory/whiteboard/{edge_id}"
        agent_identifier = agent_id or self.ctx.actor_id or self.ctx.user_id
        payload = {
            "data": data,
            "modified_by": self.ctx.user_id,
        }
        if agent_identifier:
            payload["agent_id"] = agent_identifier
        if source_node_id:
            payload["source_node_id"] = source_node_id
        provenance = _build_provenance(agent_identifier, source_node_id)
        if provenance:
            payload["provenance"] = provenance
        self.client.request_json("POST", path, self.ctx, json=payload)

    def write_blackboard(
        self,
        edge_id: str,
        data: Dict[str, Any],
        *,
        agent_id: Optional[str] = None,
        source_node_id: Optional[str] = None,
    ) -> None:
        path = f"/v1/memory/blackboard/{edge_id}"
        agent_identifier = agent_id or self.ctx.actor_id or self.ctx.user_id
        payload = {
            "data": data,
            "modified_by": self.ctx.user_id,  # Ensure attribution
        }
        if agent_identifier:
            payload["agent_id"] = agent_identifier
        if source_node_id:
            payload["source_node_id"] = source_node_id
        provenance = _build_provenance(agent_identifier, source_node_id)
        if provenance:
            payload["provenance"] = provenance
        self.client.request_json("POST", path, self.ctx, json=payload)

    def get_inbound_blackboards(self, edge_ids: List[str]) -> Dict[str, Dict[str, Any]]:
        if not edge_ids:
            return {}
            
        path = "/v1/memory/blackboards/batch"
        payload = {"edge_ids": edge_ids}
        response = self.client.request_json("POST", path, self.ctx, json=payload)
        return cast(Dict[str, Dict[str, Any]], response.get("blackboards", {}))
