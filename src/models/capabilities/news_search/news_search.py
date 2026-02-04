"""News Search capability."""
from atoms_agents.src.models.capabilities.base_capability import BaseCapability


class NewsSearchCapability(BaseCapability):
    CAPABILITY_ID = "news_search"
    NAME = "News Search"
    DESCRIPTION = "Search news sources."
    SUPPORTED_BACKENDS = ['openrouter', 'google']
