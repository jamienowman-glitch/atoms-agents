"""Embedding Generation capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class EmbeddingGenerationCapability(BaseCapability):
    CAPABILITY_ID = "embedding_generation"
    NAME = "Embedding Generation"
    DESCRIPTION = "Create embeddings."
    SUPPORTED_BACKENDS = ['openai', 'huggingface']
