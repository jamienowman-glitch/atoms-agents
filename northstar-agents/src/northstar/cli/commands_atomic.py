
import sys
import json
from dataclasses import asdict
from typing import Dict, Any
from northstar.registry.schemas import PersonaCard, TaskCard, ArtifactSpecCard

def list_personas(personas: Dict[str, Any]) -> None:
    print(f"{'PERSONA ID':<35} {'NAME':<30}")
    print("-" * 65)
    for p in personas.values():
        if isinstance(p, PersonaCard):
            print(f"{p.persona_id:<35} {p.name:<30}")

def show_persona(personas: Dict[str, Any], persona_id: str) -> None:
    if persona_id not in personas:
        print(f"Persona '{persona_id}' not found.")
        sys.exit(1)
    
    p = personas[persona_id]
    print(json.dumps(asdict(p), indent=2))

def list_tasks(tasks: Dict[str, Any]) -> None:
    print(f"{'TASK ID':<35} {'NAME':<30}")
    print("-" * 65)
    for t in tasks.values():
        if isinstance(t, TaskCard):
            print(f"{t.task_id:<35} {t.name:<30}")

def show_task(tasks: Dict[str, Any], task_id: str) -> None:
    if task_id not in tasks:
        print(f"Task '{task_id}' not found.")
        sys.exit(1)
    
    t = tasks[task_id]
    print(json.dumps(asdict(t), indent=2))

def list_artifact_specs(specs: Dict[str, Any]) -> None:
    print(f"{'SPEC ID':<45} {'KIND':<15} {'NAME'}")
    print("-" * 80)
    for s in specs.values():
        if isinstance(s, ArtifactSpecCard):
            print(f"{s.artifact_spec_id:<45} {s.artifact_kind:<15} {s.name}")

def show_artifact_spec(specs: Dict[str, Any], spec_id: str) -> None:
    if spec_id not in specs:
        print(f"Artifact Spec '{spec_id}' not found.")
        sys.exit(1)
    
    s = specs[spec_id]
    print(json.dumps(asdict(s), indent=2))
