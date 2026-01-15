import os
import time
import json
import asyncio
import shutil
import datetime
import traceback
from typing import Dict, Any, List
import yaml
import sys
import json_repair


# --- Environment Setup ---
# Must happen before imports if they depend on env
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(REPO_ROOT)

from fastapi import FastAPI, UploadFile, Request, Form
from typing import Optional
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
import vertexai
from vertexai.generative_models import GenerativeModel


ARTIFACT_ROOT = os.path.join(REPO_ROOT, "registry", "run_artifacts")
APP_DIR = os.path.dirname(os.path.abspath(__file__))

# Ensure environment variables for Bedrock/AWS are present or passed through
OS_ENV = os.environ.copy()
OS_ENV["PYTHONPATH"] = REPO_ROOT
os.environ["OPENAI_API_KEY"] = "sk-fake-ui-key-for-crewai-validation"

# Load Keys from Desktop/Mount
key_dir = os.path.expanduser("~/northstar-keys")
comet_key_path = os.path.join(key_dir, "comet_key.txt")
if os.path.exists(comet_key_path):
    print(f"[SYSTEM] Loading Comet API Key from {comet_key_path}")
    with open(comet_key_path, "r") as f:
        os.environ["COMET_API_KEY"] = f.read().strip()

# Registry Paths
AGENT_REGISTRY_DIR = os.path.join(REPO_ROOT, "registry", "agents")
FLOW_REGISTRY_DIR = os.path.join(REPO_ROOT, "registry", "flows")


app = FastAPI()
templates = Jinja2Templates(directory=os.path.join(APP_DIR, "templates"))


# Load Keys Function
def load_key(filename):
    key_dir = os.path.expanduser("~/northstar-keys")
    path = os.path.join(key_dir, filename)
    if os.path.exists(path):
        with open(path, "r") as f:
            return f.read().strip()
    return None

# Load All Keys
os.environ["GROQ_API_KEY"] = load_key("groq_key.txt") or os.environ.get("GROQ_API_KEY", "")
os.environ["OPENROUTER_API_KEY"] = load_key("openrouter_key.txt") or os.environ.get("OPENROUTER_API_KEY", "")
os.environ["GOOGLE_API_KEY"] = load_key("google_ai_key.txt") or os.environ.get("GOOGLE_API_KEY", "")
os.environ["TAVILY_API_KEY"] = load_key("tavily_key.txt") or os.environ.get("TAVILY_API_KEY", "")
# Vertex fallback
os.environ["GCP_PROJECT_ID"] = os.environ.get("GCP_PROJECT_ID") or "northstar-os-dev" 

def run_vertex_sync(prompt, model_id="gemini-2.5-flash", system=None):
    # Google AI Studio fallback if Key Present, else Vertex
    if os.environ.get("GOOGLE_API_KEY"):
         import google.generativeai as genai
         genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
         model = genai.GenerativeModel(model_id, system_instruction=system)
         return model.generate_content(prompt).text
    else:
        # Vertex Legacy
        project_id = os.environ.get("GCP_PROJECT_ID")
        location = os.environ.get("GCP_REGION", "us-central1")
        vertexai.init(project=project_id, location=location)
        model = GenerativeModel(model_id, system_instruction=[system] if system else None)
        return model.generate_content(prompt).text

def run_groq_sync(prompt, model_id="llama-3.1-8b-instant", system=None):
    import requests
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key: raise Exception("Missing Groq Key")
    
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    msgs = [{"role": "user", "content": prompt}]
    if system: msgs.insert(0, {"role": "system", "content": system})
    
    resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json={
        "model": model_id, "messages": msgs
    })
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

def run_openrouter_sync(prompt, model_id="mistralai/mistral-7b-instruct:free", system=None):
    import requests
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key: raise Exception("Missing OpenRouter Key")
    
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    msgs = [{"role": "user", "content": prompt}]
    if system: msgs.insert(0, {"role": "system", "content": system})

    resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json={
        "model": model_id, "messages": msgs
    })
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


class MultiProviderRouter:
    def __init__(self, context):
        self.context = context
        
    def chat_sync(self, messages, system=None, model_id=None):
        prompt = ""
        for m in messages:
            role = getattr(m, 'role', None) or m.get('role')
            content = getattr(m, 'content', None) or m.get('content')
            prompt += f"{role}: {content}\n"
            
        # Priority 1: Groq (Fastest)
        try:
            text = run_groq_sync(prompt, "llama-3.1-8b-instant", system)
            return self._result(text, "llama-3.1-8b-instant@groq")
        except Exception as e:
            print(f"[ROUTER] Groq Failed: {e}")
            
        # Priority 2: Google (Smartest)
        try:
            # Updated to 2.5 Flash (1.5 deprecated/404)
            text = run_vertex_sync(prompt, "gemini-2.5-flash", system)
            return self._result(text, "gemini-2.5-flash@google")
        except Exception as e:
            print(f"[ROUTER] Google Failed: {e}")
            
        # Priority 3: OpenRouter (Fallback)
        try:
            text = run_openrouter_sync(prompt, "mistralai/mistral-7b-instruct:free", system)
            return self._result(text, "mistral-7b@openrouter")
        except Exception as e:
            print(f"[ROUTER] OpenRouter Failed: {e}")
            
        # Mock Fallback DELETED per user request
        raise Exception("All LLM Providers failed. Please check your API Keys (Groq/Google/OpenRouter).")

    def _result(self, text, model_id):
        from src.core.model_gateway import ChatResult
        return ChatResult(content=text, model_id=model_id, usage={})

    async def chat(self, messages, system=None, model_id=None):
        return await asyncio.to_thread(self.chat_sync, messages, system, model_id)



# Mock Database
runs: Dict[str, Any] = {}

# --- Run Manager ---
class RunManager:
    def __init__(self, run_id: str, flow_path: str, input_path: str):
        self.run_id = run_id
        self.flow_path = flow_path
        self.input_path = input_path
        self.log_queue = asyncio.Queue()
        self.loop = asyncio.get_event_loop()
        self.artifact_dir = os.path.join(ARTIFACT_ROOT, "youtube_multiframework_v1", run_id)
        os.makedirs(self.artifact_dir, exist_ok=True)
        self.blackboard = {}
        self.cancel_event = asyncio.Event() # For soft cancellation check
        self._task = None # To hold the running task

    async def log_event(self, event: Dict[str, Any]):
        """
        Structured logging.
        event = {
            "type": "log" | "blackboard",
            "framework": str,
            "agent": str,
            "agent_path": str (optional),
            "step": str,
            "text": str,
            "event_type": "output" | "error" | "info" | "write" | "read" | "cancelled"
        }
        """
        # Add timestamp
        event["timestamp"] = datetime.datetime.utcnow().isoformat()
        await self.log_queue.put(event)

    async def emit(self, text: str, meta: Dict[str, Any] = None):
        # Legacy Shim: Convert old emit to new structured log
        meta = meta or {}
        evt = {
            "type": "log",
            "framework": meta.get("framework", "system"),
            "agent": meta.get("agent_id", "system"), 
            "step": meta.get("step_id", "unknown"),
            "text": text,
            "event_type": "info"
        }
        await self.log_event(evt)
        # Also print to stdout for safety
        print(f"[EMIT] {text}")

    async def run(self):
        try:
            print(f"[RunManager] Starting flow {self.flow_path}")
            
            # 0. Load Flow
            with open(self.flow_path, "r") as f:
                flow_def = yaml.safe_load(f)
                
            # --- Simple Executor Logic (In-Process) ---
            # 1. Setup Agents
            loaded_agents = {}
            steps = flow_def.get("steps", [])
            crew_agents = flow_def.get("crew_agents", []) # From CrewAI flow format
            manager_id = flow_def.get("manager_agent_id")
            
            # Helper to load agent def
            def load_agent(path):
                if path.startswith("registry/"):
                    path = os.path.join(REPO_ROOT, path)
                with open(path, "r") as f:
                    return yaml.safe_load(f)

            # Load Crew Agents
            for ca in crew_agents:
                aid = ca.get("agent_id")
                loaded_agents[aid] = load_agent(aid)
                
            if manager_id:
                loaded_agents[manager_id] = load_agent(manager_id)

            # 2. Sequential Execution (Naive)
            # For Factory, we just want to run the Manager (Foreman) -> who delegates to others?
            # Or run the "crew" logic?
            # The Factory Flow is "Hierarchical".
            # For this MVP, we will simulate a Sequential execution of the specialized agents based on inputs.
            
            # Extract Blueprint
            inputs = json.loads(self.input_path) # input_path holds JSON string in start_run
            blueprint = inputs.get("blueprint", {})
            
            await self.log_event({"type": "log", "text": f"Starting Build for: {blueprint.get('name')}", "event_type": "info"})
            
            # --- EXECUTION LOOP ---
            router = MultiProviderRouter({})
            
            # Step 1: HR Specialist (Create Agents)
            hr_agent_path = "registry/agents/meta/agent_factory_hr.yaml"
            hr_def = loaded_agents.get(hr_agent_path) or load_agent(hr_agent_path)
            
            await self.log_event({"type": "log", "text": "HR Specialist: Analyzing Roles...", "event_type": "info", "agent": "HR Specialist"})
            
            # We iterate over agents in blueprint and ask HR to create them
            for agent_plan in blueprint.get("agents", []):
                role = agent_plan.get("role")
                desc = agent_plan.get("details")
                
                prompt = hr_def["instruction_templates"]["create_agent"].format(
                    role=role, 
                    description=desc, 
                    framework="crewai", 
                    role_slug=role.lower().replace(" ", "_")
                )
                
                await self.log_event({"type": "log", "text": f"HR: Designing {role}...", "event_type": "info", "agent": "HR Specialist"})
                
                # Call LLM
                result = await router.chat([{"role": "user", "content": prompt}], system=hr_def["persona"], model_id=hr_def["default_model_id"])
                
                # Execute Tool (File Writer)
                # Naive Tool Execution: Find "```yaml" block or use Tool Calls?
                # The LLM prompt says "Output the full YAML content".
                # We should probably use a Tool Call if we really want to write it.
                # BUT the agent instructions say "Output the full YAML content".
                # Let's assume we parse the YAML and write it.
                
                import registry.tools.tool_file_writer as tool_lib
                content = result.content
                
                # Extract YAML
                import re
                yaml_match = re.search(r'```yaml\n(.*?)\n```', content, re.DOTALL)
                if yaml_match:
                    yaml_content = yaml_match.group(1)
                    filename = f"registry/agents/agent_{role.lower().replace(' ', '_')}.yaml"
                    res = tool_lib.write_registry_file(filename, yaml_content)
                    await self.log_event({"type": "log", "text": f"HR: {res}", "event_type": "write", "agent": "HR Specialist"})
                else:
                    await self.log_event({"type": "log", "text": f"HR: Failed to generate valid YAML for {role}", "event_type": "error"})

            # Step 2: Engineer (Create Flow)
            eng_agent_path = "registry/agents/meta/agent_factory_engineer.yaml"
            eng_def = loaded_agents.get(eng_agent_path) or load_agent(eng_agent_path)
            
            await self.log_event({"type": "log", "text": "Engineer: Designing Architecture...", "event_type": "info", "agent": "Structural Engineer"})
            
            flow_name = blueprint.get("name")
            agent_list = ", ".join([a["role"] for a in blueprint.get("agents", [])])
            
            prompt = eng_def["instruction_templates"]["create_flow"].format(
                flow_name=flow_name,
                agent_list=agent_list,
                framework="crewai",
                flow_slug=flow_name.lower().replace(" ", "_")
            )
            
            result = await router.chat([{"role": "user", "content": prompt}], system=eng_def["persona"], model_id=eng_def["default_model_id"])
            
            import registry.tools.tool_file_writer as tool_lib
            content = result.content
            yaml_match = re.search(r'```yaml\n(.*?)\n```', content, re.DOTALL)
            if yaml_match:
                yaml_content = yaml_match.group(1)
                filename = f"registry/flows/crewai/flow_{flow_name.lower().replace(' ', '_')}.yaml"
                res = tool_lib.write_registry_file(filename, yaml_content)
                await self.log_event({"type": "log", "text": f"Engineer: {res}", "event_type": "write", "agent": "Structural Engineer"})
            
            await self.log_event({"type": "log", "text": "Factory Build Complete.", "event_type": "info"})
            
        except asyncio.CancelledError:
            await self.log_event({"type": "log", "text": "Flow Cancelled by User", "event_type": "cancelled"})
        except Exception as e:
            traceback.print_exc()
            await self.log_event({"type": "log", "text": f"Flow Failed: {str(e)}", "event_type": "error"})
            
    def start(self):
        self._task = asyncio.create_task(self.run())
        
    async def stop(self):
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass


@app.get("/api/registry/agents")
def list_agents():
    agents = []
    if os.path.exists(AGENT_REGISTRY_DIR):
        for f in os.listdir(AGENT_REGISTRY_DIR):
            if f.endswith(".yaml"):
                path = os.path.join(AGENT_REGISTRY_DIR, f)
                with open(path, "r") as yf:
                    try:
                        data = yaml.safe_load(yf)
                        img = "" # Placeholder for agent image
                        # Attempt to map heuristic images
                        if "manager" in f: img = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                        elif "writer" in f: img = "https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
                        else: img = "https://cdn-icons-png.flaticon.com/512/11498/11498793.png"
                        
                        agents.append({
                            "id": f,
                            "name": data.get("name", f),
                            "role": data.get("role", "Assistant"),
                            "description": data.get("description", data.get("backstory", ""))[:100] + "...",
                            "imageUrl": img
                        })
                    except:
                        pass
    return agents

@app.post("/api/registry/agents")
async def create_agent(req: Request):
    data = await req.json()
    filename = data.get("filename")
    if not filename.endswith(".yaml"): filename += ".yaml"
    
    path = os.path.join(AGENT_REGISTRY_DIR, filename)
    with open(path, "w") as f:
        yaml.dump(data, f)
        
    return {"status": "ok", "path": path}




# --- BUILDER APIS ---

@app.post("/api/builder/export")
async def export_flow(req: Request):
    # Just echo back for now, client handles download
    data = await req.json()
    return data

@app.post("/api/builder/apply_action")
async def apply_action(req: Request):
    """
    Apply a single atomic action to the flow state.
    REAL implementation would manipulate a Python object graph.
    Here we mock it by returning the 'new' state instructions.
    """
    action = await req.json()
    # Logic to validate or execute action...
    # For now, we trust the client logic (since we are just a UI harness)
    return {"status": "ok", "action": action}

# --- Co-Pilot API ---
@app.post("/api/builder/chat")
async def builder_chat(req: Request):
    """
    Co-Pilot Endpoint.
    Handles distinct 'Planning' (Architect) and 'Building' (Executor) modes.
    """
    data = await req.json()
    msg = data.get("message", "")
    current_flow = data.get("current_flow", [])
    mode = data.get("mode", "planning") # 'planning' | 'building'
    chat_history = data.get("chat_history", "")
    print(f"[DEBUG] Chat History Len: {len(chat_history)}", flush=True)
    print(f"[DEBUG] Chat History Content: {chat_history[:200]}...", flush=True)

    # 1. Load Registry Contexts
    agents = []
    if os.path.exists(AGENT_REGISTRY_DIR):
        for f in os.listdir(AGENT_REGISTRY_DIR):
            if f.endswith(".yaml"):
                agents.append(f)
                
    # Mock Connectors & Capabilities
    connectors = [
        {"id": "shopify", "name": "Shopify Admin (Agency)", "capabilities": ["create_blog", "update_theme", "inject_script", "audit_seo", "manage_products", "email_customers"]},
        {"id": "strava", "name": "Strava Connect", "capabilities": ["get_activities", "post_status"]},
        {"id": "youtube", "name": "YouTube V3 (OAuth)", "capabilities": ["upload_video", "get_channel_analytics", "search_videos", "get_comments"]},
        {"id": "http", "name": "HTTP Request", "capabilities": ["get", "post"]},
    ]
    
    # NATIVE Capabilities (Things the system can do without external connectors)
    native_capabilities = [
        "Native HTML Rendering (Use 'html_page' Output Block to render live HTML in the UI)",
        "Chat Interface (User Input)",
        "Report Generation (Text Output)"
    ]

    # 2. Construct Prompt based on Mode
    if mode == "planning":
        # --- ARCHITECT MODE (Pure Conversation) ---
        system_prompt = f"""You are the **Northstar Flow Architect**.
You are talking to a user who wants to build a sophisticated agentic workflow.

# Your Goal
Have a "back-and-forth" conversation to design the perfect flow. 
- **DO NOT** generate JSON actions or code. 
- **DO** ask clarifying questions. 
- **DO** suggest which Agents and Connectors would best solve their problem.

# Your Toolkit
## Native Capabilities (Built-in)
{json.dumps(native_capabilities, indent=2)}

## External Connectors
{json.dumps(connectors, indent=2)}

## Existing Agents
{json.dumps(agents, indent=2)}

# Instructions
1. Respond to the user ("{msg}") helpfully.
2. **VISUALIZATION RULE**: If the user's intent implies a flow structure (e.g. "I need a writer agent"), emit `add_step` and `add_agent` JSON actions IMMEDIATELY. Do not verify first. Just draw it.
3. PROPOSE A DRAFT PLAN quickly.
4. **BUILD RULE**: If user says "Build it", output `build_swarm`.

# Available Commands
- {{"cmd": "add_step", "id": "step_N", "title": "Step Title"}}
- {{"cmd": "add_agent", "step_id": "step_N", "agent_id": "Agent Role"}}
- {{"cmd": "build_swarm", "blueprint": {{ "name": "...", "description": "...", "agents": [{{"role": "...", "details": "..."}}], "flow": {{ "structure": "..." }} }} }}
"""
    
    # Call LLM
    gateway = MultiProviderRouter({}) 
    try:
        print(f"[DEBUG] Co-Pilot calling LLM (Groq Priority)...")
        result = await gateway.chat(
            messages=[{"role": "user", "content": msg}],
            system=system_prompt,
            model_id="llama-3.1-8b-instant" 
        )
        content = result.content
    except Exception as e:
        print(f"[ERROR] LLM Failed: {e}")
        return {"thought": f"System Error: {str(e)}", "actions": []}
    
    # Parse Actions (Unified)
    actions = []
    try:
        import json_repair
        import re
        
        # Strategy 1: strict blocks
        code_blocks = re.findall(r'```(?:json)?\n(.*?)\n```', content, re.DOTALL)
        for block in code_blocks:
             try:
                data = json_repair.loads(block)
                if isinstance(data, list): actions.extend(data)
                elif isinstance(data, dict): actions.append(data)
             except: pass
             
        # Strategy 2: Line scan (critical for weak LLMs)
        if not actions:
            for line in content.splitlines():
                line = line.strip()
                if line.startswith('`') and line.endswith('`'): line = line[1:-1]
                
                # Strategy 3: Universal Regex Parser
                # Captures: "add_step {...}" OR "add_agent {...}" OR just "{...}" with cmd inside
                # Pattern: (optional cmd word) + (json object)
                # Regex looks for: start of line -> optional whitespace -> optional word -> whitespace -> { ... }
                
                # Check for "cmd {...}" pattern
                match_cmd = re.search(r'(add_step|add_agent|build_swarm)\s*(\{.*\})', line)
                if match_cmd:
                    try:
                        cmd_str = match_cmd.group(1)
                        json_str = match_cmd.group(2)
                        obj = json_repair.loads(json_str)
                        if isinstance(obj, dict):
                            if "cmd" not in obj: obj["cmd"] = cmd_str
                            actions.append(obj)
                            continue
                    except: pass
                
                # Check for bare JSON "{...}"
                if '{' in line and '}' in line:
                     try:
                        cmd_match = re.search(r'\{.*"cmd"\s*:\s*".*?".*\}', line)
                        if cmd_match:
                             obj = json_repair.loads(cmd_match.group(0))
                             if isinstance(obj, dict): actions.append(obj)
                     except: pass
                        
            # Filter for valid commands only
            valid_cmds = ["build_swarm", "add_step", "add_agent"]
            actions = [a for a in actions if a.get("cmd") in valid_cmds]
        
        valid_cmds = ["build_swarm", "add_step", "add_agent"]
        actions = [a for a in actions if a.get("cmd") in valid_cmds]
            
    except Exception as e:
        print(f"[ERROR] Parse Failed: {e}")
        pass

    return {"thought": content, "actions": actions}


@app.get("/builder", response_class=HTMLResponse)
def builder_ui(request: Request):
    return templates.TemplateResponse("builder.html", {"request": request})

@app.get("/simulator", response_class=HTMLResponse)
def simulator_ui(request: Request):
    return templates.TemplateResponse("simulator.html", {"request": request})

# --- OpenAI Compatibility Layer (Loopback) ---
from pydantic import BaseModel
class OpenAIMessage(BaseModel):
    role: str
    content: str

class OpenAIRequest(BaseModel):
    model: str
    messages: List[OpenAIMessage]
    stream: bool = False

@app.get("/v1/models")
async def list_models():
    return {
        "object": "list",
        "data": [
            {"id": "llama-3.1-8b-instant", "object": "model", "created": 1234567890, "owned_by": "loopback"},
            {"id": "gemini-2.5-flash", "object": "model", "created": 1234567890, "owned_by": "loopback"}
        ]
    }

@app.post("/v1/chat/completions")
async def chat_completions(req: OpenAIRequest):
    # Create Context
    context = {
        "tenant_id": "loopback", 
        "run_id": "loopback_request",
    }
    router = MultiProviderRouter(context)
    
    # Convert Messages
    from src.core.model_gateway import ChatMessage # dynamic import
    gateway_msgs = []
    for m in req.messages:
        gateway_msgs.append(ChatMessage(role=m.role, content=m.content))
        
    # Call Sync (Router is sync basically)
    # We use chat_sync (via chat async wrapper)
    result = await router.chat(gateway_msgs, model_id=req.model)
    
    # Format Response
    usage = result.usage or {}
    # Ensure tokens are ints (fix for CrewAI None > 0 crash)
    final_usage = {
        "prompt_tokens": usage.get("prompt_tokens", 0) or 0,
        "completion_tokens": usage.get("completion_tokens", 0) or 0,
        "total_tokens": usage.get("total_tokens", 0) or 0
    }
    
    return {
        "id": "chatcmpl-loops",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": req.model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": result.content
                },
                "finish_reason": "stop"
            }
        ],
        "usage": final_usage
    }



# --- Simulator APIs ---

@app.get("/api/registry/flows")
async def list_flows():
    """List all available flow YAMLs."""
    flows = []
    if os.path.exists(FLOW_REGISTRY_DIR):
        for root, dirs, files in os.walk(FLOW_REGISTRY_DIR):
            for file in files:
                if file.endswith(".yaml") or file.endswith(".yml"):
                    # Relative path for ID
                    abs_path = os.path.join(root, file)
                    rel_path = os.path.relpath(abs_path, REPO_ROOT)
                    flows.append({
                        "id": rel_path,
                        "filename": file,
                        "path": abs_path
                    })
    return {"flows": flows}

class RunRequest(BaseModel):
    flow_id: str
    inputs: Dict[str, Any]
    framework_override: Optional[str] = None

@app.post("/api/run/start")
async def start_run(req: Request):
    data = await req.json()
    flow_id = data.get("flow_id")
    inputs = data.get("inputs", {})
    
    run_id = f"run_{int(time.time())}"
    print(f"[SIMULATOR] Starting Run {run_id} for {flow_id}")
    
    # 1. Resolve Flow Path
    if flow_id.startswith("registry/"):
        flow_path = os.path.join(REPO_ROOT, flow_id)
    else:
        flow_path = os.path.join(FLOW_REGISTRY_DIR, flow_id)
        
    if not os.path.exists(flow_path):
        return {"error": f"Flow not found: {flow_path}"}
        
    # 2. Create Manager
    mgr = RunManager(run_id, flow_path, json.dumps(inputs))
    runs[run_id] = mgr 
    
    # 3. Start Background Task
    mgr.start()
    
    return {"run_id": run_id, "status": "starting"}

@app.get("/api/run/{run_id}/stream")
async def stream_run(run_id: str):
    """Stream logs for a run."""
    async def event_generator():
        mgr = runs.get(run_id)
        if not mgr:
            yield f"data: {json.dumps({'type': 'error', 'text': 'Run not found'})}\n\n"
            return

        while True:
            if mgr._task.done() and mgr.log_queue.empty():
                yield f"data: {json.dumps({'type': 'end'})}\n\n"
                break
                
            try:
                # Wait for log
                event = await asyncio.wait_for(mgr.log_queue.get(), timeout=1.0)
                yield f"data: {json.dumps(event)}\n\n"
            except asyncio.TimeoutError:
                yield ": keep-alive\n\n"
                
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# --- Shopify App Proxy Endpoint ---
from utils.shopify_auth import verify_shopify_proxy_hmac

@app.get("/api/shopify/proxy")
async def shopify_proxy(request: Request):
    """
    Handles requests from Shopify App Proxy.
    Verifies HMAC and returns content to be rendered in the storefront.
    """
    params = dict(request.query_params)
    
    # 1. Load Config (Lazy Load)
    try:
        shopify_config_path = os.path.expanduser("~/northstar-keys/shopify_config.json")
        shared_secret = ""
        if os.path.exists(shopify_config_path):
            with open(shopify_config_path, "r") as f:
                config = json.load(f)
                shared_secret = config.get("client_secret", "") 
    except Exception as e:
        print(f"[ERROR] Failed to load Shopify keys: {e}")
        return HTMLResponse(content="<div>Configuration Error</div>", status_code=500)

    # 2. Verify HMAC (If secret exists)
    if shared_secret:
        is_valid = verify_shopify_proxy_hmac(params, shared_secret)
        if not is_valid:
            print("[SECURITY] Shopify Proxy HMAC Failed!")
            return HTMLResponse(content="<div>Security Error: Invalid Signature</div>", status_code=403)
    else:
        print("[WARNING] Skipping HMAC check: No client_secret in shopify_config.json")

    # 3. Return Chat Interface
    return HTMLResponse(content="""
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; font-family: sans-serif;">
            <h3>✨ Northstar Voice Connected</h3>
            <p>Welcome, Store Visitor.</p>
            <div id="northstar-chat-interface">
                <!-- React App will mount here in Phase 4 -->
                <input type="text" placeholder="Ask me about products..." style="width: 100%; padding: 8px;">
            </div>
        </div>
    """, media_type="application/liquid")

@app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def catch_all(request: Request, path_name: str):
    print(f"[DEBUG] 404 CATCH: {request.method} {path_name}")
    return {"detail": "Debug-Catch-All"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
