"""Background Removal capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class BackgroundRemovalCapability(BaseCapability):
    CAPABILITY_ID = "background_removal"
    NAME = "Background Removal"
    DESCRIPTION = "Remove image background."
    SUPPORTED_BACKENDS = ['huggingface']
