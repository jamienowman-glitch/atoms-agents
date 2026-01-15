from typing import List, Dict, Any, Protocol, Optional
from dataclasses import dataclass

@dataclass
class NexusDocument:
    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None

@dataclass
class NexusSearchResult:
    document: NexusDocument
    score: float

class NexusClient(Protocol):
    def search(self, query: str, k: int = 5, filters: Optional[Dict[str, Any]] = None, tenant_id: Optional[str] = None) -> List[NexusSearchResult]:
        ...
    
    def insert(self, documents: List[NexusDocument], tenant_id: Optional[str] = None) -> None:
        ...

class NoOpNexusClient:
    def search(self, query: str, k: int = 5, filters: Optional[Dict[str, Any]] = None, tenant_id: Optional[str] = None) -> List[NexusSearchResult]:
        print(f"[NEXUS] NoOp Search: '{query}' (Tenant: {tenant_id})")
        return []

    def insert(self, documents: List[NexusDocument], tenant_id: Optional[str] = None) -> None:
        print(f"[NEXUS] NoOp Insert: {len(documents)} docs (Tenant: {tenant_id})")
