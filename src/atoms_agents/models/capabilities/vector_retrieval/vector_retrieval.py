"""Vector Retrieval capability."""
from atoms_agents.models.capabilities.base_capability import BaseCapability


class VectorRetrievalCapability(BaseCapability):
    CAPABILITY_ID = "vector_retrieval"
    NAME = "Vector Retrieval"
    DESCRIPTION = "Retrieve embeddings."
    SUPPORTED_BACKENDS = ['supabase', 'pinecone']
