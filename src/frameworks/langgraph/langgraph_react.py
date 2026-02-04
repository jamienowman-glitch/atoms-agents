"""LangGraph ReAct mode."""
from atoms_agents.src.frameworks.langgraph.langgraph_base import LangGraphBaseFramework


class LangGraphReactFramework(LangGraphBaseFramework):
    MODE_ID = "react"
    NAME = "LangGraph ReAct"
    DESCRIPTION = "ReAct-style graph agent."
