from typing import Dict, Any
from atoms_agents.runtime.context import RunContext
from atoms_agents.runtime.result import ModeRunResult
from atoms_agents.runtime.adapters.crewai_gateway import NorthstarCrewAILLM

def run(input_data: Dict[str, Any], ctx: RunContext) -> ModeRunResult:
    # 1. Check Dependencies
    try:
        import crewai # noqa: F401
        from crewai import Agent, Task, Crew, Process
    except ImportError:
        return ModeRunResult(status="SKIP", reason="crewai not installed")

    # 2. Check Context
    if not ctx.llm_gateway:
         return ModeRunResult(status="SKIP", reason="No LLMGateway provided in context")

    # 3. Execution
    try:
        # Wrap Gateway for CrewAI
        llm_wrapper = NorthstarCrewAILLM(
            gateway=ctx.llm_gateway,
            provider_config=ctx.provider_config,
            model_card=ctx.model_card
        )

        # Define Agents
        researcher = Agent(
            role='Researcher',
            goal='Research new AI trends',
            backstory='You are an AI researcher',
            verbose=True,
            allow_delegation=False,
            llm=llm_wrapper # Injected LLM
        )

        # Define Tasks
        task1 = Task(
            description='Find 1 latest AI trend',
            agent=researcher,
            expected_output='A strict one sentence summary'
        )

        # Instantiate Crew
        crew = Crew(
            agents=[researcher],
            tasks=[task1],
            verbose=True,
            process=Process.sequential
        )

        # Real Call: Kickoff
        result = crew.kickoff()

        return ModeRunResult(
            status="PASS",
            reason="CrewAI Sequential execution successful via Gateway",
            output=str(result)
        )

    except Exception as e:
        return ModeRunResult(status="FAIL", reason=f"CrewAI Error: {e}")
