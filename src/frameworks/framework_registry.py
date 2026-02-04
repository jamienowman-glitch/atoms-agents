from typing import List, Type

from atoms_agents.src.frameworks.autogen.autogen_groupchat import AutoGenGroupchatFramework
from atoms_agents.src.frameworks.autogen.autogen_twoimperative import AutoGenTwoimperativeFramework
from atoms_agents.src.frameworks.autogen.autogen_hierarchical import AutoGenHierarchicalFramework
from atoms_agents.src.frameworks.autogen.autogen_debate import AutoGenDebateFramework
from atoms_agents.src.frameworks.crewai.crewai_sequential import CrewAISequentialFramework
from atoms_agents.src.frameworks.crewai.crewai_hierarchical import CrewAIHierarchicalFramework
from atoms_agents.src.frameworks.crewai.crewai_hybrid import CrewAIHybridFramework
from atoms_agents.src.frameworks.camel.camel_role_play import CAMELRolePlayFramework
from atoms_agents.src.frameworks.camel.camel_task_decomposition import CAMELTaskDecompositionFramework
from atoms_agents.src.frameworks.camel.camel_collaboration import CAMELCollaborationFramework
from atoms_agents.src.frameworks.chatdev.chatdev_planning import ChatDevPlanningFramework
from atoms_agents.src.frameworks.chatdev.chatdev_coding import ChatDevCodingFramework
from atoms_agents.src.frameworks.chatdev.chatdev_review import ChatDevReviewFramework
from atoms_agents.src.frameworks.langgraph.langgraph_state_machine import LangGraphStateMachineFramework
from atoms_agents.src.frameworks.langgraph.langgraph_react import LangGraphReactFramework
from atoms_agents.src.frameworks.langgraph.langgraph_router import LangGraphRouterFramework
from atoms_agents.src.frameworks.nemo.nemo_orchestrator import NeMoOrchestratorFramework
from atoms_agents.src.frameworks.nemo.nemo_tool_use import NeMoToolUseFramework
from atoms_agents.src.frameworks.nemo.nemo_guardrails import NeMoGuardrailsFramework
from atoms_agents.src.frameworks.adk.adk_router import ADKRouterFramework
from atoms_agents.src.frameworks.adk.adk_toolchain import ADKToolchainFramework
from atoms_agents.src.frameworks.adk.adk_planning import ADKPlanningFramework
from atoms_agents.src.frameworks.langchain.langchain_agent_executor import LangChainAgentExecutorFramework
from atoms_agents.src.frameworks.langchain.langchain_router import LangChainRouterFramework
from atoms_agents.src.frameworks.langchain.langchain_retrieval import LangChainRetrievalFramework
from atoms_agents.src.frameworks.strands.strands_streaming import StrandsStreamingFramework
from atoms_agents.src.frameworks.strands.strands_parallel import StrandsParallelFramework
from atoms_agents.src.frameworks.strands.strands_branching import StrandsBranchingFramework
from atoms_agents.src.frameworks.swarm.swarm_coordinator import SwarmCoordinatorFramework
from atoms_agents.src.frameworks.swarm.swarm_mesh import SwarmMeshFramework

PROVIDER_FRAMEWORK_REGISTRY: List[Type] = [
    AutoGenGroupchatFramework,
    AutoGenTwoimperativeFramework,
    AutoGenHierarchicalFramework,
    AutoGenDebateFramework,
    CrewAISequentialFramework,
    CrewAIHierarchicalFramework,
    CrewAIHybridFramework,
    CAMELRolePlayFramework,
    CAMELTaskDecompositionFramework,
    CAMELCollaborationFramework,
    ChatDevPlanningFramework,
    ChatDevCodingFramework,
    ChatDevReviewFramework,
    LangGraphStateMachineFramework,
    LangGraphReactFramework,
    LangGraphRouterFramework,
    NeMoOrchestratorFramework,
    NeMoToolUseFramework,
    NeMoGuardrailsFramework,
    ADKRouterFramework,
    ADKToolchainFramework,
    ADKPlanningFramework,
    LangChainAgentExecutorFramework,
    LangChainRouterFramework,
    LangChainRetrievalFramework,
    StrandsStreamingFramework,
    StrandsParallelFramework,
    StrandsBranchingFramework,
    SwarmCoordinatorFramework,
    SwarmMeshFramework,
]

__all__ = ["PROVIDER_FRAMEWORK_REGISTRY"]
