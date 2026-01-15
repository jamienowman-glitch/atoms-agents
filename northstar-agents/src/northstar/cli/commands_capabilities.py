
import sys
import json
from dataclasses import asdict
from typing import Dict, Any, Optional
from northstar.registry.schemas import CapabilityCard, CapabilityBindingCard

def list_capabilities(capabilities: Dict[str, Any]) -> None:
    print(f"{'CAPABILITY ID':<25} {'NAME':<30} {'TYPE'}")
    print("-" * 65)
    for c in capabilities.values():
        if isinstance(c, CapabilityCard):
            print(f"{c.capability_id:<25} {c.capability_name:<30} {c.embedded_or_separate}")

def show_capability(capabilities: Dict[str, Any], capability_id: str) -> None:
    if capability_id not in capabilities:
        print(f"Capability '{capability_id}' not found.")
        sys.exit(1)
    
    cap = capabilities[capability_id]
    print(json.dumps(asdict(cap), indent=2))

def list_capability_bindings(bindings: Dict[str, Any], model_id: Optional[str] = None) -> None:
    print(f"{'BINDING ID':<50} {'MODEL':<30} {'CAPABILITY'}")
    print("-" * 100)
    
    count = 0
    for b in bindings.values():
        if isinstance(b, CapabilityBindingCard):
            # Basic textual match filter if requested. 
            # Note: This matches against the binding's model deployment ID string, 
            # NOT the registry model_id strictly, unless we looked it up.
            # Given the CLI arg is just a string, simple filtering is safest for a list command.
            if model_id and model_id not in b.model_or_deployment_id and model_id not in b.binding_id:
                continue
                
            print(f"{b.binding_id:<50} {b.model_or_deployment_id:<30} {b.capability_id}")
            count += 1
        
    print(f"\nTotal: {count}")
