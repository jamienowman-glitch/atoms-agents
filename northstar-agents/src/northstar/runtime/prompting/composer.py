
import json
from typing import Dict, List, Any
from northstar.registry.schemas import PersonaCard, TaskCard

def compose_messages(
    persona: PersonaCard, 
    task: TaskCard, 
    inputs: Dict[str, Any],
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
    # Minimal separators, no "Goal:" or "Constraints:" headers if possible, 
    # but the prompt requirements say "remove headings like Goal:/Constraints: from code".
    # Just join content
    
    user_parts = [task.goal] # Start with goal
    
    if task.acceptance_criteria:
        user_parts.extend([f"- {ac}" for ac in task.acceptance_criteria])
        
    if task.constraints:
        user_parts.extend([f"- {c}" for c in task.constraints])
        
    if inputs:
        user_parts.append(json.dumps(inputs, indent=2))
        
    if nexus_context:
        user_parts.append("\nRelevant Context from Nexus:")
        user_parts.extend([f"- {ctx}" for ctx in nexus_context])
        
    user_content = "\n".join(user_parts)
    
    return [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_content}
    ]
