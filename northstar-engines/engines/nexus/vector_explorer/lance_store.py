"""LanceDB adapter for Vector Explorer."""
from __future__ import annotations

from typing import Any, Dict, List, Optional, Sequence

from engines.config import runtime_config
from engines.nexus.lance_store import LanceVectorStore
from engines.nexus.schemas import Scope, SpaceKey, NexusEmbedding, NexusKind
from engines.nexus.vector_explorer.vector_store import ExplorerVectorStore, ExplorerVectorHit

class LanceExplorerVectorStore(ExplorerVectorStore):
    """Adapter for LanceDB to work with Vector Explorer."""

    def __init__(self, store: Optional[LanceVectorStore] = None) -> None:
        self._store = store or LanceVectorStore()

    def upsert(
        self,
        item_id: str,
        vector: Sequence[float],
        tenant_id: str,
        env: str,
        space: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        key = self._make_key(tenant_id, env, space)

        # Default to 'data' kind if space doesn't match a known kind
        # This is required because NexusEmbedding enforces NexusKind enum
        kind = NexusKind.data
        try:
            if space in NexusKind.__members__:
                kind = NexusKind[space]
        except Exception:
            pass

        emb = NexusEmbedding(
            doc_id=item_id,
            tenant_id=tenant_id,
            env=env,
            kind=kind,
            embedding=list(vector),
            model_id="unknown",
            metadata=metadata or {}
        )
        self._store.upsert(key, [emb])

    def query(
        self,
        vector: Sequence[float],
        tenant_id: str,
        env: str,
        space: str,
        top_k: int = 10,
    ) -> List[ExplorerVectorHit]:
        key = self._make_key(tenant_id, env, space)
        result = self._store.query(key, list(vector), top_k)

        hits = []
        for doc in result.hits:
            score = doc.metadata.get("score", 0.0)
            hits.append(ExplorerVectorHit(
                id=doc.id,
                score=score,
                metadata=doc.metadata
            ))
        return hits

    def query_by_datapoint_id(
        self,
        anchor_id: str,
        tenant_id: str,
        env: str,
        space: str,
        top_k: int = 10,
    ) -> List[ExplorerVectorHit]:
        raise NotImplementedError("query_by_datapoint_id not implemented for LanceDB yet")

    def _make_key(self, tenant_id: str, env: str, space: str) -> SpaceKey:
        project_id = runtime_config.get_firestore_project() or "default"
        # Sanitize space -> space_id if needed, but assuming space is safe filename part
        return SpaceKey(
            scope=Scope.TENANT,
            tenant_id=tenant_id,
            env=env,
            project_id=project_id,
            surface_id="vector_explorer",
            space_id=space
        )
