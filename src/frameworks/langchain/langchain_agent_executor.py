"""LangChain Agent Executor mode."""
from atoms_agents.src.frameworks.langchain.langchain_base import LangChainBaseFramework


class LangChainAgentExecutorFramework(LangChainBaseFramework):
    MODE_ID = "agent_executor"
    NAME = "LangChain Agent Executor"
    DESCRIPTION = "Agent executor loop."
