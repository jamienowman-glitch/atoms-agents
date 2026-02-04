"""LangGraph Router mode."""
from atoms_agents.src.frameworks.langgraph.langgraph_base import LangGraphBaseFramework


class LangGraphRouterFramework(LangGraphBaseFramework):
    MODE_ID = "router"
    NAME = "LangGraph Router"
    DESCRIPTION = "Routing between subgraphs."
