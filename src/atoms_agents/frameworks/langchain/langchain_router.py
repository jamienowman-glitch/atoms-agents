"""LangChain Router mode."""
from atoms_agents.frameworks.langchain.langchain_base import LangChainBaseFramework


class LangChainRouterFramework(LangChainBaseFramework):
    MODE_ID = "router"
    NAME = "LangChain Router"
    DESCRIPTION = "Router chain orchestration."
