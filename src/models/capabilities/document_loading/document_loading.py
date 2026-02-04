"""Document Loading capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class DocumentLoadingCapability(BaseCapability):
    CAPABILITY_ID = "document_loading"
    NAME = "Document Loading"
    DESCRIPTION = "Load documents."
    SUPPORTED_BACKENDS = ['huggingface']
