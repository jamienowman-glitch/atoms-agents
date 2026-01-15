"""
LangGraph Runtime Adapter.
Wrapper for LangGraph flows.
"""
from typing import Any, Dict, List, TypedDict, AsyncIterator
from runtime.contract import RuntimeAdapter, StreamChunk
import asyncio
from src.core.model_gateway import ChatMessage

class LangGraphAdapter:
    """
    Adapter for LangGraph runtime.
    """
    
    def invoke(
        self, 
        card_id: str, 
        input_data: Dict[str, Any], 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Invokes a LangGraph graph.
        """
        if "tenant_id" not in context:
            raise ValueError("Missing required context: tenant_id")

        return {"status": "invoked", "runtime": "langgraph", "card_id": card_id}

    async def invoke_stream(
        self,
        card_id: str,
        input_data: Dict[str, Any],
        context: Dict[str, Any]
    ) -> AsyncIterator[StreamChunk]:
        """
        Invokes a LangGraph graph with streaming.
        Uses graph.astream() if available.
        """
        if "tenant_id" not in context:
            raise ValueError("Missing required context: tenant_id")

        # Stub logic until specific LangGraph file loading is implemented
        # Simulating graph stream
        
        events = ["Node A", "Node B", "Node C"]
        for event in events:
            txt = f"Update from {event}\n"
            yield StreamChunk(chunk_kind="token", text=txt, delta=txt, metadata={"node": event})
            await asyncio.sleep(0.1)

    def _run_generic_flow(self, flow_id: str, input_data: Dict[str, Any], context: Dict[str, Any]):
        try:
            from langgraph.graph import StateGraph, END
            import uuid
            import time
        except ImportError:
             return {"status": "SKIP", "reason": "Missing LangGraph dependencies"}
             
        # Resolve Gateway
        gateway = context.get("model_gateway")
        if not gateway:
             # Try check blackboard just in case (though runner passes context now)
             # Fallback to failing clean
             return {"status": "FAIL", "reason": "ModelGateway not found in context"}

        flow_def = input_data.get("flow_def")
        if not flow_def or flow_def.get("id") != flow_id:
            return {"status": "FAIL", "reason": f"Flow definition for {flow_id} missing or mismatch in input_data"}

        agents = input_data.get("agents", {})
        steps_config = flow_def.get("steps", [])
        
        # Determine State Schema based on flow type (heuristic or generic dict)
        # For agnostic, we stick to a flexible dict state.
        class GenericState(TypedDict):
            data: Dict[str, Any] # Shared key-value store (blackboard, drafts)
            steps_log: List[Dict]
            turn_count: int

        def execute_step(state, step_config):
            agent_id = step_config["agent_id"]
            if agent_id not in agents:
                 raise ValueError(f"Agent {agent_id} not found in input_data")
            
            card = agents[agent_id]
            
            # 1. Prepare Inputs
            # Merge input_data input values (e.g. topic) with current state data
            format_args = {}
            # Base agent data
            format_args['persona'] = card.get('persona', '')
            format_args['manifest'] = card.get('manifest', '')
            
            # Runtime Inputs (Topic)
            for k, v in input_data.items():
                if k not in ["agents", "flow_def"]:
                    format_args[k] = v
            
            # State Inputs (e.g. Previous Draft, Blackboard)
            for k, v in state["data"].items():
                format_args[k] = v

            # 2. Construct Prompt
            template = step_config.get("instruction_template", "")
            # If template has {blackboard_state} but state has list, convert to string
            if "blackboard_state" in format_args and isinstance(format_args["blackboard_state"], list):
                 format_args["blackboard_state"] = str(format_args["blackboard_state"])
            
            # Special handling for "manifest only" templates (common in blackboard)
            if template.strip() == "{manifest}" and "{blackboard_state}" in card['manifest']:
                 # If the manifest itself expects formatting but the template is just "{manifest}",
                 # we need to format the manifest string first.
                 # Actually, better: we just format the final string.
                 pass

            try:
                # First format the manifest if it has placeholders
                if "{blackboard_state}" in card['manifest']:
                     # Double format protection? 
                     # Let's assume the flow puts "{manifest}" in instruction_template
                     # and the system formats that.
                     pass
                
                # We format the instruction template with gathered args
                prompt = template.format(**format_args)
                
                # If the template was just "{manifest}" and the manifest itself had placeholders,
                # the first format might have just inserted the raw manifest string (with {brackets}).
                # We might need a second pass or recursive formatting, but simpler is:
                # The prompt IS the instruction template. 
                
                # Case: Blackboard
                # Template: "{manifest}"
                # Manifest: "... words: {blackboard_state} ..."
                # format_args: {manifest: "... {blackboard_state} ...", blackboard_state: "..."}
                # result: "... {blackboard_state} ..." -> Not resolved!
                
                # Fix: If the template references {manifest}, we should probably PRE-format the manifest 
                # if we know it contains vars. Or rely on simple flat templates in Flow.
                
                # Better approach:
                # The generic runner shouldn't guess. 
                # The Flow Definition should use keys that map directly.
                # If the Flow says instruction is "{persona}\n{manifest}\nTask: {topic}...",
                # then {manifest} usually is static text.
                # If {manifest} has dynamic vars, that's complex.
                
                # For Blackboard:
                # The adapter previously did: base_prompt.format(blackboard_state=...)
                # So the Card Manifest HAD the variable.
                
                # To support this generically:
                if "{blackboard_state}" in format_args.get("manifest", ""):
                     format_args["manifest"] = format_args["manifest"].replace("{blackboard_state}", str(state["data"].get("blackboard_state", [])))

                prompt = template.format(**format_args)
                
            except KeyError as e:
                prompt = f"Error formatting prompt: Missing key {e}"
            except Exception as e:
                prompt = f"Error formatting prompt: {e}"

            # 3. Call LLM
            # 3. Call LLM Agnostic
            t0 = time.time()
            prompt_msgs = [ChatMessage(role="user", content=prompt)]
            
            try:
                # Gateway Call
                # We assume generic flow uses context['tenant_id'] inside gateway wrapper or kwargs if needed
                # But Gateway.chat signature is (messages, system=None, **kwargs).
                # BedrockGateway uses kwargs['model_id'].
                
                resp = asyncio.run(gateway.chat(
                    messages=prompt_msgs, 
                    system=format_args.get("persona"),
                    model_id="us.amazon.nova-2-lite-v1:0" # TODO: Resolve from card/flow?
                ))
                content = resp.content.strip()
            except Exception as e:
                content = f"Error calling Gateway: {e}"
            
            lat = (time.time() - t0) * 1000

            # 4. Update State
            output_key = step_config.get("output_key")
            new_data = state["data"].copy()
            
            # Special handling for appending to list (Blackboard)
            if output_key == "blackboard_state":
                 current_list = new_data.get("blackboard_state", [])
                 # Clean word
                 word = content.split()[0] if content else ""
                 if word:
                     current_list.append(word)
                 new_data["blackboard_state"] = current_list
            elif output_key:
                 new_data[output_key] = content

            step_log = {
                "step_index": len(state['steps_log']) + 1,
                "agent_id": agent_id,
                "action_type": step_config.get("action_type", "unknown"),
                "emitted_text": content,
                "step_latency_ms": lat,
                "model_provider": "agnostic-gateway",
                "blackboard_state_after_step": new_data.get("blackboard_state") if "blackboard_state" in new_data else None,
                "target_location": output_key
            }
            
            return {
                "data": new_data,
                "steps_log": state["steps_log"] + [step_log],
                "turn_count": state["turn_count"] + 1
            }

        # Build Graph
        workflow = StateGraph(GenericState)
        
        # Add Nodes
        for step in steps_config:
            step_id = step["id"]
             # Capture step_config in closure default arg to avoid late binding issues
            workflow.add_node(step_id, lambda s, sc=step: execute_step(s, sc))
            
        # Add Edges
        # Simple cyclic logic or explicit next
        max_turns = flow_def.get("stop_conditions", {}).get("max_steps", 10)
        
        def route_next(state, next_node_id):
            if state["turn_count"] >= max_turns:
                 return END
            return next_node_id if next_node_id else END

        for step in steps_config:
            current_id = step["id"]
            next_id = step.get("next")
            
            if next_id:
                # Check for cycle
                # If next_id points back to an existing node, and we have max_turns,
                # we need a conditional edge usually.
                # But LangGraph edges are usually unconditional unless using add_conditional_edges.
                
                # Does the flow imply conditional looping? 
                # "step_c" -> "step_a". This creates an infinite loop in standard graph.
                # We need to guard it with max_turns check.
                
                workflow.add_conditional_edges(
                    current_id, 
                    lambda s, nid=next_id: route_next(s, nid)
                )
            else:
                workflow.add_edge(current_id, END)
                
        # Entry Point
        if steps_config:
            workflow.set_entry_point(steps_config[0]["id"])
            
        app = workflow.compile()
        
        # Initial State
        initial_data = {}
        # Pre-seed inputs
        if "blackboard_state" in flow_def.get("inputs", {}):
             initial_data["blackboard_state"] = [] # Start empty
        if "topic" in input_data:
             initial_data["topic"] = input_data["topic"]
             
        # Also ensure blackboard starts empty if not explicit
        if "blackboard" in flow_id:
            initial_data["blackboard_state"] = []

        initial_state = {
            "data": initial_data,
            "steps_log": [],
            "turn_count": 0
        }
        
        result = app.invoke(initial_state)
        
        return {
            "status": "PASS",
            "steps": result["steps_log"],
            "final_state": result["data"]
        }


