from typing import Any, Dict
from .schemas import (
    ModeCard, 
    FrameworkAdapterCard, 
    RunProfileCard, 
    ProviderConfigCard, 
    ModelCard,
    CapabilityCard,
    CapabilityBindingCard,
    PersonaCard,
    TaskCard,
    ArtifactSpecCard,
    NodeCard,
    NodeCard,
    FlowCard,
    FlowEdge
)
from northstar.core.identifiers import generate_deterministic_edge_id

def parse_mode(data: Dict[str, Any]) -> ModeCard:
    required = ["id", "framework", "official_name", "invoke_primitive", "entrypoint"]
    for r in required:
        if r not in data:
            raise ValueError(f"ModeCard missing required field: {r}")
            
    return ModeCard(
        id=data["id"],
        framework=data["framework"],
        official_name=data["official_name"],
        invoke_primitive=data["invoke_primitive"],
        entrypoint=data["entrypoint"],
        params=data.get("params", {}),
        streaming_support=data.get("streaming_support", False),
        docs_urls=data.get("docs_urls", []),
        pinned_version=data.get("pinned_version"),
        confidence=data.get("confidence", "experimental"),
        notes=data.get("notes", "")
    )

def parse_framework(data: Dict[str, Any]) -> FrameworkAdapterCard:
    if "framework_id" not in data or "adapter_import_path" not in data:
            raise ValueError("FrameworkAdapterCard missing required fields")
            
    return FrameworkAdapterCard(
        framework_id=data["framework_id"],
        adapter_import_path=data["adapter_import_path"]
    )

def parse_profile(data: Dict[str, Any]) -> RunProfileCard:
    if "profile_id" not in data or "persistence_backend" not in data:
        raise ValueError("RunProfileCard missing required fields")
        
    return RunProfileCard(
        profile_id=data["profile_id"],
        name=data.get("name", data["profile_id"]),
        persistence_backend=data["persistence_backend"],
        blackboard_backend=data.get("blackboard_backend", "local"),
        pii_strategy=data.get("pii_strategy", "passthrough"),
        nexus_strategy=data.get("nexus_strategy", "disabled"),
        allow_local_fallback=data.get("allow_local_fallback", False),
        description=data.get("description", ""),
        notes=data.get("notes", "")
    )

def parse_provider(data: Dict[str, Any]) -> ProviderConfigCard:
    if "provider_id" not in data:
        raise ValueError("ProviderConfigCard missing provider_id")
        
    return ProviderConfigCard(
        provider_id=data["provider_id"],
        name=data.get("name", "Unknown"),
        required_fields=data.get("required_fields", []),
        notes=data.get("notes", "")
    )

def parse_model(data: Dict[str, Any]) -> ModelCard:
    official_id = data.get("model_or_deployment_id") or data.get("official_id_or_deployment")
    
    if "model_id" not in data or "provider_id" not in data or not official_id:
        raise ValueError("ModelCard missing required fields")
        
    return ModelCard(
        model_id=data["model_id"],
        provider_id=data["provider_id"],
        model_or_deployment_id=official_id,
        platform_api_surface=data.get("platform_api_surface", ""),
        invocation_primitive=data.get("invocation_primitive", ""),
        request_shape_minimal=data.get("request_shape_minimal", ""),
        streaming_support=data.get("streaming_support", "none"),
        credential_discovery=data.get("credential_discovery", ""),
        region_or_project_discovery=data.get("region_or_project_discovery", ""),
        default_creds_ok=data.get("default_creds_ok", False),
        docs_url=data.get("docs_url", ""),
        last_updated_or_version=data.get("last_updated_or_version", ""),
        confidence=data.get("confidence", "experimental"),
        notes=data.get("notes", "")
    )

def parse_capability(data: Dict[str, Any]) -> CapabilityCard:
    if "capability_id" not in data or "capability_name" not in data:
        raise ValueError("CapabilityCard missing required fields")

    return CapabilityCard(
        capability_id=data["capability_id"],
        capability_name=data["capability_name"],
        description=data.get("description", ""),
        embedded_or_separate=data.get("embedded_or_separate", "EMBEDDED")
    )

def parse_capability_binding(data: Dict[str, Any]) -> CapabilityBindingCard:
    if "binding_id" not in data or "provider_id" not in data or "model_or_deployment_id" not in data or "capability_id" not in data:
        raise ValueError("CapabilityBindingCard missing required fields")

    return CapabilityBindingCard(
        binding_id=data["binding_id"],
        provider_id=data["provider_id"],
        model_or_deployment_id=data["model_or_deployment_id"],
        capability_id=data["capability_id"],
        toggle_mechanism=data.get("toggle_mechanism", ""),
        minimal_toggle_snippet=data.get("minimal_toggle_snippet", ""),
        streaming_support=data.get("streaming_support", "none"),
        prereqs_or_allowlist=data.get("prereqs_or_allowlist", ""),
        docs_url=data.get("docs_url", ""),
        last_updated_or_version=data.get("last_updated_or_version", ""),
        confidence=data.get("confidence", "experimental"),
        notes=data.get("notes", "")
    )

def parse_persona(data: Dict[str, Any]) -> PersonaCard:
    if "persona_id" not in data or "name" not in data or "description" not in data:
        raise ValueError("PersonaCard missing required fields")
    
    if not data["persona_id"].startswith("persona."):
        raise ValueError(f"Invalid persona_id prefix: {data['persona_id']}")

    for icon_field in ["icon_light", "icon_dark"]:
        if path := data.get(icon_field):
            if path.startswith("/") or "://" in path:
                raise ValueError(f"{icon_field} must be a relative path")

    return PersonaCard(
        persona_id=data["persona_id"],
        name=data["name"],
        description=data["description"],
        style_tags=data.get("style_tags", []),
        principles=data.get("principles", []),
        system_guidance_ref=data.get("system_guidance_ref"),
        version=data.get("version"),
        icon_light=data.get("icon_light"),
        icon_dark=data.get("icon_dark"),
        notes=data.get("notes", "")
    )

def parse_task(data: Dict[str, Any]) -> TaskCard:
    if "task_id" not in data or "name" not in data or "goal" not in data:
        raise ValueError("TaskCard missing required fields")
        
    if not data["task_id"].startswith("task."):
        raise ValueError(f"Invalid task_id prefix: {data['task_id']}")

    return TaskCard(
        task_id=data["task_id"],
        name=data["name"],
        goal=data["goal"],
        constraints=data.get("constraints", []),
        acceptance_criteria=data.get("acceptance_criteria", []),
        inputs_schema_ref=data.get("inputs_schema_ref"),
        outputs_schema_ref=data.get("outputs_schema_ref"),
        notes=data.get("notes", "")
    )

def parse_artifact_spec(data: Dict[str, Any]) -> ArtifactSpecCard:
    if "artifact_spec_id" not in data or "name" not in data or "artifact_kind" not in data:
        raise ValueError("ArtifactSpecCard missing required fields")
        
    if not data["artifact_spec_id"].startswith("artifact_spec."):
        raise ValueError(f"Invalid artifact_spec_id prefix: {data['artifact_spec_id']}")

    return ArtifactSpecCard(
        artifact_spec_id=data["artifact_spec_id"],
        name=data["name"],
        artifact_kind=data["artifact_kind"],
        mime_type=data.get("mime_type"),
        required_fields=data.get("required_fields", []),
        max_bytes=data.get("max_bytes"),
        viewer_hints=data.get("viewer_hints", {}),
        notes=data.get("notes", "")
    )

def parse_node(data: Dict[str, Any]) -> NodeCard:
    required = ["node_id", "name", "kind"]
    for r in required:
        if r not in data:
            raise ValueError(f"NodeCard missing required field: {r}")
            
    if data["kind"] not in ["agent", "framework_team", "subflow"]:
        raise ValueError(f"Invalid node kind: {data['kind']}")

    if data["kind"] == "agent" and not (data.get("persona_ref") and data.get("task_ref")):
        raise ValueError("Agent nodes require persona_ref and task_ref")
        
    return NodeCard(
        node_id=data["node_id"],
        name=data["name"],
        kind=data["kind"],
        persona_ref=data.get("persona_ref"),
        task_ref=data.get("task_ref"),
        artifact_outputs=data.get("artifact_outputs", []),
        blackboard_writes=data.get("blackboard_writes", []),
        blackboard_reads=data.get("blackboard_reads", []),
        model_ref=data.get("model_ref"),
        provider_ref=data.get("provider_ref"),
        capability_ids=data.get("capability_ids", []),
        tool_refs=data.get("tool_refs", []),
        framework_mode_ref=data.get("framework_mode_ref"),
        subflow_ref=data.get("subflow_ref"),
        timeouts=data.get("timeouts", {}),
        notes=data.get("notes", "")
    )

def parse_flow(data: Dict[str, Any]) -> FlowCard:
    required = ["flow_id", "name", "objective", "nodes", "edges", "entry_node", "exit_nodes"]
    for r in required:
        if r not in data:
            raise ValueError(f"FlowCard missing required field: {r}")
            
    parsed_edges = []
    for edge_data in data["edges"]:
        if "edge_id" not in edge_data:
            raise ValueError(f"FlowCard edge missing required field: edge_id. Data: {edge_data}")
            
        required_edge = ["source", "target"]
        for r in required_edge:
            if r not in edge_data:
                 raise ValueError(f"FlowCard edge missing required field: {r}")
        
        # Validate deterministic ID
        expected_id = generate_deterministic_edge_id(
            edge_data["source"],
            edge_data.get("source_handle", "default"),
            edge_data["target"],
            edge_data.get("target_handle", "default")
        )
        
        if edge_data["edge_id"] != expected_id:
             raise ValueError(f"Invalid edge_id '{edge_data['edge_id']}'. Expected deterministic ID: '{expected_id}'")

        parsed_edges.append(FlowEdge(
            edge_id=edge_data["edge_id"],
            source=edge_data["source"],
            target=edge_data["target"],
            source_handle=edge_data.get("source_handle", "default"),
            target_handle=edge_data.get("target_handle", "default"),
            connection_handle=edge_data.get("connection_handle", "default")
        ))

    return FlowCard(
        flow_id=data["flow_id"],
        name=data["name"],
        objective=data["objective"],
        nodes=data["nodes"],
        edges=parsed_edges,
        entry_node=data["entry_node"],
        exit_nodes=data["exit_nodes"],
        defaults=data.get("defaults", {}),
        contracts=data.get("contracts", {}),
        notes=data.get("notes", "")
    )
