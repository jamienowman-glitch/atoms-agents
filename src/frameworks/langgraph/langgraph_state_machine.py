"""LangGraph State Machine mode."""
from atoms_agents.src.frameworks.langgraph.langgraph_base import LangGraphBaseFramework


class LangGraphStateMachineFramework(LangGraphBaseFramework):
    MODE_ID = "state_machine"
    NAME = "LangGraph State Machine"
    DESCRIPTION = "Graph-driven state machine."
