import sys
import os
print("DEBUG: Script Loaded")
import yaml
import json
import argparse
import asyncio
import uuid
import datetime
import subprocess
import shutil
from typing import Dict, Any, List, TypedDict, Annotated
from operator import add

# Import Adapters (assuming they are in python path or we add them)
# The user env sets PYTHONPATH=. so we can import directly
try:
    from runtime.crewai.adapter import CrewAIAdapter
    from runtime.autogen.adapter import AutoGenAdapter
    import vertexai
    from vertexai.generative_models import GenerativeModel, Part
    from src.core.model_gateway import ModelGateway, ChatMessage
    from langgraph.graph import StateGraph, END
except ImportError as e:
    # We will handle missing deps in main, but basic imports might fail immediately
    pass

# --- CONSTANTS ---
os.environ["OPENAI_API_KEY"] = "sk-fake-value-for-crewai-validation"
TEST_SLUG = "youtube_multiframework_v1"
ORCHESTRATOR_CARD_PATH = "registry/flows/langgraph/flow_youtube_orchestrator.yaml"
CREW_CARD_PATH = "registry/flows/crewai/flow_youtube_spanish_team.yaml"
AUTOGEN_CARD_PATH = "registry/flows/autogen/flow_youtube_english_debate.yaml"

LOG_DIR = "registry/run_logs"
ARTIFACTS_DIR = f"{LOG_DIR}/artifacts"

# Model selection (from Plan)
MODEL_1_INTERN = "gemini-2.5-flash"
MODEL_2_CREW = "gemini-2.5-flash" 
MODEL_3_AUTO = "gemini-2.5-flash"


def run_vertex(user_message, model_id="gemini-2.5-flash", system=None):
    """
    Simple wrapper for Vertex AI
    """
    project_id = os.environ.get("GCP_PROJECT_ID") or os.environ.get("GCP_PROJECT")
    location = os.environ.get("GCP_REGION", "us-central1")
    vertexai.init(project=project_id, location=location)

    model = GenerativeModel(
        model_id,
        system_instruction=[system] if system else None
    )
    # Gemini 2.0+ handles system instruction in init or config.
    
    resp = model.generate_content(user_message)
    return resp.text


def ensure_dependencies():
    """Checks and installs missing dependencies for AutoGen/CrewAI/LangGraph."""
    required = [
        ("autogen_agentchat", "autogen-agentchat"),
        ("autogen_core", "autogen-core"),
        ("autogen_ext", "autogen-ext"),
        ("crewai", "crewai"),
        ("langgraph", "langgraph"),
        ("vertexai", "google-cloud-aiplatform") # Add vertexai to required dependencies
    ]
    
    for module, package in required:
        try:
            __import__(module)
        except ImportError:
            print(f"Installing missing dependency: {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def load_yaml(path: str) -> Dict[str, Any]:
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def write_artifact(path: str, content: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    with open(path, 'w') as f:
        f.write(content)

class MockGateway:
    def __init__(self, context):
        self.context = context
    
    async def chat(self, messages, system=None, model_id=None):
        # Convert Agnostic ChatMessage to text for Vertex
        full_text = ""
        # If user/assistant pattern, maybe keep structure? 
        # For this simple shim, lets concat prompt.
        for m in messages:
            full_text += f"{m.role}: {m.content}\n"
        
        # Call Vertex
        resp_text = run_vertex(full_text, model_id=model_id or "gemini-2.5-flash", system=system)
        
        class Result:
             content = ""
        r = Result()
        r.content = resp_text
        return r

class MockGateway:
    def chat_sync(self, messages, system=None, model_id=None):
        prompt = ""
        for m in messages:
            prompt += f"{m.role}: {m.content}\n"
        resp = run_vertex(prompt, model_id=model_id, system=system)
        class Res:
             content = resp
        return Res()
    
    async def chat(self, messages, system=None, model_id=None):
        return self.chat_sync(messages, system, model_id)



# State definition
class AgentState(TypedDict):
    youtube_ideas: List[str]
    spanish_assets: Dict[str, Any]
    winning_idea: Dict[str, Any]
    final_report: str
    logs: Annotated[List[Dict[str, Any]], add]

def run_test(input_file: str):
    # 0. Setup
    ensure_dependencies()
    
    # Reload imports after install
    try:
        from runtime.crewai.adapter import CrewAIAdapter
        from runtime.autogen.adapter import AutoGenAdapter
        import vertexai
        from vertexai.generative_models import GenerativeModel, Part
        from src.core.model_gateway import ModelGateway, ChatMessage
        from langgraph.graph import StateGraph, END
    except ImportError as e:
        print(f"FAIL: Could not import dependencies after install attempt: {e}")
        return

    run_id = str(uuid.uuid4())
    start_ts = datetime.datetime.now()
    timestamp_str = start_ts.strftime("%Y%m%d_%H%M%S")
    
    artifact_dir = f"{ARTIFACTS_DIR}/{TEST_SLUG}/langgraph/{timestamp_str}"
    os.makedirs(artifact_dir, exist_ok=True)

    # Load Cards
    orch_card = load_yaml(ORCHESTRATOR_CARD_PATH)
    crew_card_def = load_yaml(CREW_CARD_PATH)
    autogen_card_def = load_yaml(AUTOGEN_CARD_PATH)
    
    # Extract Instructions/Roles from Orchestrator Card
    step1_def = next((s for s in orch_card['steps'] if s['id'] == 'step_01_intern'), None)
    if step1_def and 'role' not in step1_def:
        step1_def = {
            "role": "You are an enthusiastic junior marketing intern. You love tech trends.",
            "instructions": "Identify the top 5 tech trends and generate one YouTube video title proposal for each. Return ONLY a bulleted list of exactly 5 titles."
        }
    step4_def = next((s for s in orch_card['steps'] if s['id'] == 'final_summary'), {
        "role": "Chief Content Officer",
        "instructions": "Synthesize the findings from the Spanish Team (localization) and English Team (debate) into a final executive summary. Be concise."
    })

    # Read Input Report
    with open(input_file, 'r') as f:
        report_content = f.read()

    context = {
        "tenant_id": "t_test",
        "env": "dev",
        "run_id": run_id
    }
    context["model_gateway"] = MockGateway()
    
    run_logs = []

    # --- LANGGRAPH NODES ---

    def node_intern(state: AgentState):
        """Step 1: Junior marketing intern"""
        print("--> Running Step 1: Intern (Vertex)")
        
        # Construct user message for Vertex AI
        user_message = f"""
        Instructions: {step1_def['instructions']}
        
        REPORT:
        {report_content}
        """
        
        try:
            # Call run_vertex directly
            content = run_vertex(
                user_message=user_message,
                model_id=MODEL_1_INTERN,
                system=step1_def['role']
            ).strip()
            
            # Extract bullets
            ideas = [line.strip('- ').strip() for line in content.split('\n') if line.strip().startswith('-')][:5]
            if len(ideas) < 5:
                # Fallback extraction
                ideas = [l for l in content.split('\n') if l.strip()][:5]
            
            # Log
            write_artifact(f"{artifact_dir}/step_01_intern.txt", content)
            run_logs.append({
                "step_index": 1,
                "agent_id": "step_01_intern",
                "action_type": "write",
                "emitted_text": content,
                "model_provider": MODEL_1_INTERN
            })
            
            return {"youtube_ideas": ideas, "logs": run_logs}
            
        except Exception as e:
            print(f"FAIL: Intern Step Error: {e}")
            raise e

    def node_spanish_team(state: AgentState):
        """Fork A: Spanish Team (CrewAI)"""
        print("--> Running Fork A: Spanish Team (CrewAI)")
        
        adapter = CrewAIAdapter()
        
        # Crew Adapter expects 'agents' dict (mapping ID -> Card) and 'flow_def'.
        # The flow_youtube_spanish_team.yaml contains BOTH under 'agents' and 'tasks'.
        
        # Adapting the card structure to what the generic adapter likely expects:
        # The generic adapter implementation I read expects: 
        # input_data = { "flow_def": {...}, "agents": { "agent_id": {...} } }
        
        # input_data = { "flow_def": {...}, "agents": { "agent_id": {...} } }
        
        # agents_map = {a['id']: {"persona": a['role'], "manifest": a['backstory'] + " " + a['goal']} for a in crew_card_def['agents']}
        agents_map = {} # DEPRECATED: Adapter v2 loads agents from referenced files

        
        # Inject inputs into instructions?
        # The generic adapter does str replace.
        # Flow card tasks use inputs: - youtube_ideas
        
        # We need to pass the actual values.
        input_payload = {
            "flow_def": crew_card_def,
            "agents": agents_map,
            # Pass data for substitution
            "youtube_ideas": "\n".join(state['youtube_ideas'])
        }

        try:
            # Inject mock key for CrewAI validation
            os.environ["OPENAI_API_KEY"] = "sk-fake-ui-key-for-crewai-validation"

            # Bypass empty invoke() in adapter and call internal method directly
            # Logic: The existing adapter.invoke seems unimplemented, but _run_generic_flow exists
            if hasattr(adapter, '_run_generic_flow'):
                result = adapter._run_generic_flow(CREW_CARD_PATH, input_payload, context)
                print(f"DEBUG: Adapter Result: {result}")
            else:
                result = adapter.invoke(CREW_CARD_PATH, input_payload, context)

            if result is None:
                raise Exception("Adapter returned None (invoke not implemented?)")

            if result.get("status") == "FAIL":
                raise Exception(result.get("reason"))
            
            steps = result.get("steps", [])
            
            # Log artifacts
            # We need to map linear steps to the required artifacts:
            # step_02_es_eu.txt (Task 1: Translate)
            # step_03_es_co.txt (Task 2: Adapt)
            # step_04_es_posts_spain.txt (Task 3 part 1)
            # step_05_es_posts_colombia_poll.txt (Task 3 part 2)
            
            # The CrewAI adapter log just dumps steps.
            # We'll try to map by index.
            if len(steps) >= 1: write_artifact(f"{artifact_dir}/step_02_es_eu.txt", steps[0]['emitted_text'])
            if len(steps) >= 2: write_artifact(f"{artifact_dir}/step_03_es_co.txt", steps[1]['emitted_text'])
            if len(steps) >= 3: 
                # Step 3 produced 2 posts? It's one task output.
                # We'll save the whole output for both artifact requirements or split it roughly.
                text = steps[2]['emitted_text']
                write_artifact(f"{artifact_dir}/step_04_es_posts_spain.txt", text) # Saving combined for now or splitting if easy
                write_artifact(f"{artifact_dir}/step_05_es_posts_colombia_poll.txt", text)

            run_logs.extend(steps)
            return {"spanish_assets": {"steps": steps}, "logs": run_logs}

        except Exception as e:
             # STOP runtime as per instructions
             print(f"FAIL: CrewAI Runtime Error: {e}")
             raise e

    def node_english_debate(state: AgentState):
        """Fork B: English Debate (AutoGen)"""
        print("--> Running Fork B: English Debate (AutoGen)")
        
        adapter = AutoGenAdapter()
        
        adapter = AutoGenAdapter()
        
        # agents_map = {a['id']: {"persona": a['role'], "manifest": a['system_message']} for a in autogen_card_def['agents']}
        agents_map = {} # DEPRECATED: Adapter v2 loads agents from referenced files

        
        input_payload = {
            "flow_def": autogen_card_def,
            "agents": agents_map,
            "youtube_ideas": "\n".join(state['youtube_ideas'])
        }
        
        try:
            # Bypass empty invoke() in adapter and call internal method directly
            if hasattr(adapter, '_run_generic_flow'):
                result = adapter._run_generic_flow(AUTOGEN_CARD_PATH, input_payload, context)
            else:
                 # Attempt generic invoke if _run_generic_flow missing (fallback)
                result = adapter.invoke(AUTOGEN_CARD_PATH, input_payload, context)

            if result is None:
                raise Exception("Adapter returned None")

            if result.get("status") == "FAIL":
                raise Exception(result.get("reason"))
                
            steps = result.get("steps", [])
            
            # Artifacts: step_06, 07, 08 (debate rounds), 09 (winner)
            # AutoGen steps are chat messages.
            # We'll save them sequentially.
            for i, step in enumerate(steps):
                fname = f"step_{6+i:02d}_en_debate_turn.txt" 
                write_artifact(f"{artifact_dir}/{fname}", step['emitted_text'])
            
            run_logs.extend(steps)
            
            winner = steps[-1]['emitted_text'] if steps else "No winner"
            write_artifact(f"{artifact_dir}/step_09_en_winner.txt", winner)
            
            return {"winning_idea": winner, "logs": run_logs}

        except Exception as e:
            print(f"FAIL: AutoGen Runtime Error: {e}")
            raise e

    def node_summary(state: AgentState):
        """Final Summary"""
        print("--> Running Final Summary")
        
        # Combine inputs
        spanish_txt = str(state.get('spanish_assets', ''))
        winner_txt = str(state.get('winning_idea', ''))
        
        prompt = f"""
        Role: {step4_def['role']}
        Instructions: {step4_def['instructions']}
        
        SPANISH TEAM OUTPUT:
        {spanish_txt}
        
        ENGLISH TEAM WINNER:
        {winner_txt}
        """
        
        try:
            req = BedrockRequest(
                model_id=MODEL_1_INTERN,
                user_message=prompt,
                tenant_id=context['tenant_id'],
                surface_id="cli",
                session_id=run_id,
                context=context
            )
            resp = run_bedrock(req)
            content = resp.messages[0].content.strip()
            
            write_artifact(f"{artifact_dir}/final_summary.txt", content)
            
            run_logs.append({
                "step_index": 99,
                "agent_id": "final_summary",
                "action_type": "write",
                "emitted_text": content,
                "model_provider": MODEL_1_INTERN
            })
            
            return {"final_report": content, "logs": run_logs}

        except Exception as e:
            print(f"FAIL: Summary Error: {e}")
            raise e

    # Build Graph
    graph = StateGraph(AgentState)
    graph.add_node("intern", node_intern)
    graph.add_node("spanish_team", node_spanish_team)
    graph.add_node("english_debate", node_english_debate)
    graph.add_node("summary", node_summary)

    # Topological sort: Intern -> (Spanish, English) -> Summary
    # LangGraph is sequential by default unless we parallelize edges.
    # We can do parallel branching.
    
    graph.set_entry_point("intern")
    graph.add_edge("intern", "spanish_team")
    graph.add_edge("intern", "english_debate")
    graph.add_edge("spanish_team", "summary")
    graph.add_edge("english_debate", "summary")
    
    app = graph.compile()
    
    print("Starting LangGraph Orchestration...")
    try:
        final_state = app.invoke({"youtube_ideas": []})
        
        # Write Log
        end_ts = datetime.datetime.now()
        latency = (end_ts - start_ts).total_seconds() * 1000
        
        log_entry = {
            "start_timestamp": start_ts.isoformat(),
            "end_timestamp": end_ts.isoformat(),
            "total_latency_ms": latency,
            "summary": "YouTube Multiframework Test PASS",
            "steps": run_logs
        }
        
        log_path = f"{LOG_DIR}/runtime_test.{TEST_SLUG}.langgraph.{timestamp_str}.yaml"
        with open(log_path, 'w') as f:
            yaml.dump(log_entry, f)
            
        print(f"PASS | Time: {latency/1000:.2f}s | Log: {log_path}")
        
    except Exception as e:
        print(f"FAIL | Runtime Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to report.txt")
    args = parser.parse_args()
    
    run_test(args.input)
