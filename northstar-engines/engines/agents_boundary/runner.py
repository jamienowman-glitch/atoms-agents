import uuid
from typing import Dict, Any
from northstar.runtime.node_executor import NodeExecutor
from northstar.registry.schemas import NodeCard, PersonaCard, TaskCard, RunProfileCard
from northstar.runtime.context import AgentsRequestContext, ContextMode

# Mock Registry for ephemeral execution
class EphemeralRegistry:
    def __init__(self, personas, tasks, models):
        self.personas = personas
        self.tasks = tasks
        self.models = models
        self.artifact_specs = {}

def run_agent_task(task: str, router_config: Dict[str, str], user_id: str = "u_system", tenant_id: str = "t_system") -> Dict[str, Any]:
    """
    Bridges the Engine to the Agent Runtime.
    Executes a task using a specific router configuration (provider/model).
    """

    # 1. Create Ephemeral Cards
    run_id = str(uuid.uuid4())
    ephemeral_persona_id = "p_ephemeral_assistant"
    ephemeral_task_id = "t_ephemeral_task"
    ephemeral_node_id = f"n_{run_id}"

    persona = PersonaCard(
        persona_id=ephemeral_persona_id,
        name="Helpful Assistant",
        description="You are a helpful AI assistant connected to the Northstar Engine.",
        principles=["Be concise", "Be accurate"]
    )

    task_card = TaskCard(
        task_id=ephemeral_task_id,
        name="Ad-Hoc Task",
        goal=task,
        acceptance_criteria=[],
        constraints=[]
    )

    node = NodeCard(
        node_id=ephemeral_node_id,
        name="Ephemeral Agent",
        kind="agent",
        persona_ref=ephemeral_persona_id,
        task_ref=ephemeral_task_id,
        provider_ref=router_config.get("provider"),
        model_ref=router_config.get("model"),
        card_type="node"
    )

    # 2. Setup Context
    request_context = AgentsRequestContext(
        tenant_id=tenant_id,
        mode=ContextMode.LAB,
        project_id="p_default",
        request_id=run_id,
        run_id=run_id,
        user_id=user_id,
        actor_id=user_id
    )

    profile = RunProfileCard(
        profile_id="default_profile",
        name="Default",
        persistence_backend="local",
        blackboard_backend="local",
        pii_strategy="passthrough",
        nexus_strategy="disabled",
        allow_local_fallback=True
    )

    # 3. Setup Registry
    registry = EphemeralRegistry(
        personas={ephemeral_persona_id: persona},
        tasks={ephemeral_task_id: task_card},
        models={}
    )

    # 4. Execute
    executor = NodeExecutor(registry_ctx=registry)

    result = executor.execute_node(
        node=node,
        profile=profile,
        request_context=request_context
    )

    # 5. Extract Content from Events
    generated_content = ""
    for event in result.events:
        if event.get("type") == "chain_of_thought":
            generated_content = event.get("content", "")
            break

    return {
        "status": result.status,
        "reason": result.reason,
        "content": generated_content,
        "events": result.events,
        "error": result.error
    }
