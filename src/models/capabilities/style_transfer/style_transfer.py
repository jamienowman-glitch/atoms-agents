"""Style Transfer capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class StyleTransferCapability(BaseCapability):
    CAPABILITY_ID = "style_transfer"
    NAME = "Style Transfer"
    DESCRIPTION = "Apply artistic styles."
    SUPPORTED_BACKENDS = ['huggingface']
