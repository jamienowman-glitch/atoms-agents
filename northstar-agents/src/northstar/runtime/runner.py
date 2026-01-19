from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod
from northstar.registry.schemas.neutral import NeutralNodeCard, ComponentRef
from northstar.runtime.node_result import NodeRunResult
import time

class ComponentStrategy(ABC):
    """
    Abstract base for executing a specific component type (Agent, Framework, Connector).
    """
    @abstractmethod
    def execute(self, component: ComponentRef, inputs: Dict[str, Any], context: Any) -> Dict[str, Any]:
        pass

class AgentStrategy(ComponentStrategy):
    def execute(self, component: ComponentRef, inputs: Dict[str, Any], context: Any) -> Dict[str, Any]:
        # Placeholder for actual Agent Execution logic (which involves Prompting, Gateway, etc.)
        # This will eventually call into the existing logic repurposed from NodeExecutor
        return {
            "status": "success",
            "output": f"processed by agent {component.ref_id}",
            "artifacts": []
        }

class FrameworkStrategy(ComponentStrategy):
    def execute(self, component: ComponentRef, inputs: Dict[str, Any], context: Any) -> Dict[str, Any]:
        # Placeholder for Framework Execution
        return {
            "status": "success",
            "output": f"processed by framework {component.ref_id}",
            "artifacts": []
        }

class ConnectorStrategy(ComponentStrategy):
    def execute(self, component: ComponentRef, inputs: Dict[str, Any], context: Any) -> Dict[str, Any]:
        # Placeholder for Connector/Tool Execution
        return {
            "status": "success",
            "output": f"processed by connector {component.ref_id}",
            "artifacts": []
        }

class ComponentRunner:
    """
    Dispatcher that selects and runs the correct strategy for a component.
    """
    def __init__(self):
        self._strategies = {
            "agent": AgentStrategy(),
            "framework": FrameworkStrategy(),
            "connector": ConnectorStrategy()
        }

    def run_component(self, component: ComponentRef, inputs: Dict[str, Any], context: Any) -> Dict[str, Any]:
        strategy = self._strategies.get(component.component_type)
        if not strategy:
            raise ValueError(f"Unknown component type: {component.component_type}")
        
        return strategy.execute(component, inputs, context)
