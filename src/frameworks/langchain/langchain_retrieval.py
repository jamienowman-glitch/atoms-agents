"""LangChain Retrieval mode."""
from atoms_agents.src.frameworks.langchain.langchain_base import LangChainBaseFramework


class LangChainRetrievalFramework(LangChainBaseFramework):
    MODE_ID = "retrieval"
    NAME = "LangChain Retrieval"
    DESCRIPTION = "Retrieval-augmented chain."
