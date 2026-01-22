
import json
from typing import Dict, List, Any
from northstar.registry.schemas import PersonaCard, TaskCard

def compose_messages(
    persona: PersonaCard, 
    task: TaskCard, 
    inputs: Dict[str, Dict[str, Any]], # Namespaced by edge_id
    nexus_context: List[str] = None
) -> List[Dict[str, str]]:
    """
    Composes system and user messages from registry cards and inputs.
    No hidden prompt text allowed here.
    """
    
    # System Message Construction
    system_parts = [persona.description]
    if persona.principles:
        system_parts.append("\nPrinciples:")
        system_parts.extend([f"- {p}" for p in persona.principles])
        
    system_content = "\n".join(system_parts)
    
    # User Message Construction
    user_parts = [task.goal] # Start with goal
    
    if task.acceptance_criteria:
        user_parts.extend([f"- {ac}" for ac in task.acceptance_criteria])
        
    if task.constraints:
        user_parts.extend([f"- {c}" for c in task.constraints])
        
    if inputs:
        # Inputs are now namespaced by edge_id
        # We flatten them for the prompt but keep them somewhat organized
        # or just merge them if keys don't collide.
        # For safety/clarity, let's just dump the whole structure or flatten values
        # Decision: Dump with edge labels might be noisy. Let's merge values.
        # WARNING: Key collision risk. 
        # Better approach: "Input from [edge_id]: {data}"
        
        user_parts.append("\nInputs:")
        for edge_id, data in inputs.items():
            # user_parts.append(f"From {edge_id}:") 
            # In V1, we just dump the data dict. 
            # The edge_id is internal plumbing, the agent cares about the content.
            user_parts.append(json.dumps(data, indent=2))
        
    if nexus_context:
        user_parts.append("\nRelevant Context from Nexus:")
        user_parts.extend([f"- {ctx}" for ctx in nexus_context])
        
    user_content = "\n".join(user_parts)
    
    return [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_content}
    ]
