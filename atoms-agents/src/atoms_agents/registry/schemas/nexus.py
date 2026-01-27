from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class NexusProfileCard:
    nexus_profile_id: str
    provider: str  # e.g., "pinecone", "chroma", "pgvector"
    dimension: int
    index_name: str
    connection_args: Dict[str, Any]
    card_type: str = "nexus_profile"
