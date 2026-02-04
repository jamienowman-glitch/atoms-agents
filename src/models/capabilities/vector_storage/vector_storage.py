"""Vector Storage capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class VectorStorageCapability(BaseCapability):
    CAPABILITY_ID = "vector_storage"
    NAME = "Vector Storage"
    DESCRIPTION = "Store embeddings."
    SUPPORTED_BACKENDS = ['supabase', 'pinecone']
