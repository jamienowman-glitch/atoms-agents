
import pytest
from northstar.registry.loader import RegistryLoader
from northstar.registry.schemas import PersonaCard, TaskCard, ArtifactSpecCard
from northstar.registry.parsers import parse_persona, parse_task, parse_artifact_spec

def test_load_personas():
    loader = RegistryLoader("src/northstar/registry/cards")
    personas = loader.load_cards_from_dir("personas")
    assert len(personas) >= 2
    assert any(isinstance(p, PersonaCard) and p.persona_id == "persona.brand_writer_v1" for p in personas)
    
    # Check integrity
    for p in personas:
        assert p.persona_id.startswith("persona.")

def test_load_tasks():
    loader = RegistryLoader("src/northstar/registry/cards")
    tasks = loader.load_cards_from_dir("tasks")
    assert len(tasks) >= 2
    assert any(isinstance(t, TaskCard) and t.task_id == "task.write_landing_page_v1" for t in tasks)

    for t in tasks:
        assert t.task_id.startswith("task.")

def test_load_artifact_specs():
    loader = RegistryLoader("src/northstar/registry/cards")
    specs = loader.load_cards_from_dir("artifact_specs")
    assert len(specs) >= 2
    assert any(isinstance(s, ArtifactSpecCard) and s.artifact_spec_id == "artifact_spec.landing_page_markdown_v1" for s in specs)

    for s in specs:
        assert s.artifact_spec_id.startswith("artifact_spec.")

def test_parser_integrity_failures():
    # Test Persona prefix failure
    with pytest.raises(ValueError, match="Invalid persona_id prefix"):
        parse_persona({"persona_id": "bad_prefix", "name": "Bad", "description": "desc", "card_type": "persona"})

    # Test Task prefix failure
    with pytest.raises(ValueError, match="Invalid task_id prefix"):
        parse_task({"task_id": "bad.task", "name": "Bad", "goal": "goal", "card_type": "task"})

    # Test Artifact Spec prefix failure
    with pytest.raises(ValueError, match="Invalid artifact_spec_id prefix"):
        parse_artifact_spec({"artifact_spec_id": "bad_spec", "name": "Bad", "artifact_kind": "json", "card_type": "artifact_spec"})

def test_parser_missing_fields():
    with pytest.raises(ValueError, match="PersonaCard missing required fields"):
        parse_persona({"card_type": "persona", "persona_id": "persona.foo"}) # missing name/desc
