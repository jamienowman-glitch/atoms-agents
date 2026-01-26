
"""Nexus Store: The Memory Engine (LanceDB Adapter)."""
import os
import lancedb
import pyarrow as pa
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

# Schema for the Nexus Memory
class NexusEmbedding(BaseModel):
    id: str
    tenant_id: str
    domain: str # health, business, finance
    surface: str # vo2, b2, agnx
    modality: str = "text" # text, image, video, audio
    text: Optional[str] = None
    vector: List[float] # Primary Semantic Vector (Text/Transcript)
    vector_visual: Optional[List[float]] = None # Visual Vibe (OpenCLIP)
    metadata: Dict[str, Any]

class NexusStore:
    def __init__(self, uri: str = "data/nexus-lancedb"):
        # Connect to LanceDB (Local or S3)
        self.db = lancedb.connect(uri)
        self.table_name = "vectors"
        self._ensure_table()

    def _ensure_table(self):
        # Define Schema if not exists
        if self.table_name not in self.db.table_names():
            schema = pa.schema([
                pa.field("id", pa.string()),
                pa.field("tenant_id", pa.string()),
                pa.field("domain", pa.string()),
                pa.field("surface", pa.string()),
                pa.field("modality", pa.string()),
                pa.field("text", pa.string()),
                pa.field("vector", pa.list_(pa.float32(), 1024)), # Mistral dim
                pa.field("vector_visual", pa.list_(pa.float32(), 512)), # CLIP dim
                pa.field("metadata", pa.string()), # JSON string
            ])
            self.db.create_table(self.table_name, schema=schema)
    
    def add(self, items: List[NexusEmbedding]):
        table = self.db.open_table(self.table_name)
        # Convert pydantic to dict
        data = [item.model_dump() for item in items]
        table.add(data)

    def search(self, query_vector: List[float], domain: str, limit: int = 5):
        table = self.db.open_table(self.table_name)
        # Filter by Domain (Isolation)
        results = table.search(query_vector) \
            .where(f"domain = '{domain}'") \
            .limit(limit) \
            .to_list()
        return results

# Singleton
_store = None

def get_nexus_store(uri: Optional[str] = None):
    global _store
    if not _store:
        # Default to env var or local
        target = uri or os.getenv("NEXUS_STORE_URI", "data/nexus-lancedb")
        _store = NexusStore(target)
    return _store
