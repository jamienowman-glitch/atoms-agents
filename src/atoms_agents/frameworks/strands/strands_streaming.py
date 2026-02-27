"""Strands Streaming mode."""
from atoms_agents.frameworks.strands.strands_base import StrandsBaseFramework


class StrandsStreamingFramework(StrandsBaseFramework):
    MODE_ID = "streaming"
    NAME = "Strands Streaming"
    DESCRIPTION = "Streaming multi-agent mode."
