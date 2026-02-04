"""Chunking Strategy capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class ChunkingStrategyCapability(BaseCapability):
    CAPABILITY_ID = "chunking_strategy"
    NAME = "Chunking Strategy"
    DESCRIPTION = "Split documents into chunks."
    SUPPORTED_BACKENDS = ['huggingface']
