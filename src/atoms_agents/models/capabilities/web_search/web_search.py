"""Web Search capability."""
from atoms_agents.models.capabilities.base_capability import BaseCapability


class WebSearchCapability(BaseCapability):
    CAPABILITY_ID = "web_search"
    NAME = "Web Search"
    DESCRIPTION = "Search the web."
    SUPPORTED_BACKENDS = ['openrouter', 'google']
