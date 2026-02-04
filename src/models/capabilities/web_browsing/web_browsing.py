"""Web Browsing capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class WebBrowsingCapability(BaseCapability):
    CAPABILITY_ID = "web_browsing"
    NAME = "Web Browsing"
    DESCRIPTION = "Computer-use browsing."
    SUPPORTED_BACKENDS = ['openai', 'anthropic']
