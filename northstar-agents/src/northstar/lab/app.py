import streamlit as st
import threading
import json
import httpx
import os
from pathlib import Path
from typing import List

# Setup page
st.set_page_config(layout="wide", page_title="Northstar Lab")
st.title("Northstar Lab 🔬")
st.markdown("Connectivity & Truth Verification Console")

# Imports
try:
    from northstar.runtime.gateway_resolution import resolve_gateway
    from northstar.registry.schemas import ModelCard, NodeCard, RunProfileCard, TaskCard, PersonaCard
    from northstar.runtime.node_executor import NodeExecutor
    from northstar.runtime.context import AgentsRequestContext
    from northstar.runtime.audit.emitter import AuditEmitter
    from northstar.runtime.audit.events import AuditEvent
except ImportError as e:
    st.error(f"Failed to import Northstar runtime: {e}")
    st.stop()

# --- Helpers ---
class RemoteEventLogger(AuditEmitter):
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url

    def emit(self, event: AuditEvent) -> None:
        url = f"{self.base_url}/events/append"
        # Engine expects headers for identity
        headers = {
            "X-Tenant-Id": event.tenant_id or "t_lab",
            "X-Mode": "lab",
            "X-User-Id": str(getattr(event, "actor", "u_lab") or "u_lab"),
            "X-Project-Id": event.project_id or "p_lab",
            "X-Surface-Id": event.surface_id or "lab"
        }

        # Map to AppendEventRequest
        body = {
            "event_type": str(event.event_type.value) if hasattr(event.event_type, "value") else str(event.event_type),
            "source": "lab",
            "run_id": event.run_id,
            "payload": event.payload,
            "step_id": getattr(event, "step_id", None),
            "trace_id": getattr(event, "trace_id", None),
        }

        # Fire and forget
        try:
            # print(f"Sending to {url} with headers {headers}")
            httpx.post(url, json=body, headers=headers, timeout=0.5)
        except Exception as e:
            print(f"RemoteLog Error ({url}): {e}")

        # Also print to console for Streamlit logs
        print(f"RemoteLog: {event.event_type} {event.payload}")

# For this lab, since we want to see SSE from engine, we need to push to engine.
# But implementing a full HTTP client to push events to Engine might be complex if the endpoint isn't standard.
# Plan: "Wire NodeExecutor to report to a RemoteEventLogger... that pushes to northstar-engines".
# I'll implement a simple one that POSTs to `http://localhost:8000/v1/events` (mock) or just rely on the fact that
# if I run this locally, maybe I just want to see the local execution output in the "Test Bench"
# and the "X-Ray Panel" is verifying if the Engine *would* see it if connected.
# BUT, if NodeExecutor runs locally, and Engine is separate, Engine WON'T see events unless I push them.
# So "Verification Loop" fails if I don't push.

# Let's check `northstar-engines` routes to find the ingestion endpoint.
# `northstar-engines/engines/event_spine/routes.py`?

# --- Sidebar ---
st.sidebar.header("Configuration")
PROVIDERS = ["openrouter", "vertex", "bedrock", "azure_openai", "gemini"]
provider_id = st.sidebar.selectbox("Provider", PROVIDERS)

model_list = []
try:
    # We resolve gateway to list models
    # Note: resolving might fail if creds missing, we handle that
    gateway = resolve_gateway(provider_id)
    # We assume gateway has list_models now
    if hasattr(gateway, "list_models"):
        model_list = gateway.list_models()
    else:
        model_list = ["default"]
except Exception as e:
    st.sidebar.warning(f"Gateway not ready: {e}")
    model_list = ["default"]

model_id = st.sidebar.selectbox("Model", model_list)

# Persona Loader
st.sidebar.subheader("Persona")
registry_path = Path("src/northstar/registry/cards/personas")
if not registry_path.exists():
    registry_path = Path(__file__).resolve().parent.parent.parent.parent / "registry/cards/personas"

persona_files = list(registry_path.glob("*.yaml")) if registry_path.exists() else []
persona_names = [p.stem for p in persona_files]
persona_select = st.sidebar.selectbox("Persona", ["None"] + persona_names)

# --- X-Ray State ---
# Use cache_resource to share a mutable list across reruns and thread
@st.cache_resource
def get_shared_buffer():
    return []

sse_events_buffer = get_shared_buffer()

# Background Listener
@st.cache_resource
def start_sse_listener():
    def sse_listener():
        url = "http://localhost:8000/realtime/sse/timeline"
        headers = {
            "X-Tenant-Id": "t_lab",
            "X-Mode": "lab"
        }
        try:
            with httpx.Client(timeout=None) as client:
                with client.stream("GET", url, headers=headers) as response:
                    for line in response.iter_lines():
                        if line.startswith("data: "):
                            try:
                                payload = json.loads(line[6:])
                                sse_events_buffer.append(payload)
                                # Keep last 50
                                if len(sse_events_buffer) > 50:
                                    sse_events_buffer.pop(0)
                            except Exception:
                                pass
        except Exception as e:
            print(f"SSE Listener died: {e}")

    t = threading.Thread(target=sse_listener, daemon=True)
    t.start()
    return t

start_sse_listener()

# --- Layout ---
col_main, col_xray = st.columns([1, 1])

with col_main:
    st.subheader("Test Bench")
    user_input = st.text_area("Input", height=150)

    if st.button("FIRE", type="primary"):
        st.info("Executing...")

        # Mock Registry
        class LabRegistry:
            def __init__(self):
                self.models = {}
                self.personas = {}
                self.tasks = {}
                self.artifact_specs = {}

        reg = LabRegistry()
        # Helper to load persona if needed
        # For now, we manually construct cards

        ctx = AgentsRequestContext(
            tenant_id="t_lab",
            env="dev",
            mode="lab",
            project_id="p_lab",
            user_id="u_lab",
            request_id="req_" + os.urandom(4).hex()
        )

        # Node
        node = NodeCard(
            node_id="n_lab_1",
            kind="agent",
            persona_ref=persona_select if persona_select != "None" else "brand_writer_v1",
            task_ref="t_lab_task",
            provider_ref=provider_id,
            model_ref=model_id,
        )

        # Populate Registry with minimal requirements
        reg.tasks["t_lab_task"] = TaskCard("t_lab_task", "Execute Prompt", user_input)
        reg.personas[node.persona_ref] = PersonaCard(node.persona_ref, "You are a helpful assistant.", "Helpful")

        # Executor
        remote_logger = RemoteEventLogger()
        executor = NodeExecutor(reg, audit_emitter=remote_logger)

        # Run
        try:
            result = executor.execute_node(
                node,
                RunProfileCard("p_lab", "default"),
                request_context=ctx,
                provider_override=provider_id,
                model_override=model_id
            )

            if result.status == "PASS":
                # Find output
                cot = next((e for e in result.events if e["type"] == "chain_of_thought"), None)
                if cot:
                    st.success(cot.get("content", "No content"))
                    st.json(cot)

                    # Display Commerce from LOCAL result
                    if "cost_usd" in cot:
                        st.metric("Local Cost Check", f"${cot['cost_usd']:.6f}")
                else:
                    st.warning("Executed but no chain_of_thought event.")
                    st.write(result.events)
            else:
                st.error(f"Failed: {result.reason}")
                st.write(result.error)

        except Exception as e:
            st.error(f"Crash: {e}")


with col_xray:
    st.subheader("X-Ray Panel (SSE)")
    if st.button("Refresh Stream"):
        pass # Rerun

    st.caption("Events from Engine (Realtime)")

    events = list(sse_events_buffer) # Copy
    for ev in reversed(events):
        # Format
        cost = ev.get("cost_usd", 0.0)
        usage = ev.get("usage", {})

        with st.expander(f"{ev.get('type')} (${cost:.6f})"):
            st.json(ev)
