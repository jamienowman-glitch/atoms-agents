import os
import yaml
from typing import List, Any, Dict
from dataclasses import dataclass
from northstar.registry.schemas import (
    ModeCard, 
    ProviderConfigCard, 
    ModelCard, 
    CapabilityCard, 
    CapabilityBindingCard, 
    PersonaCard, 
    TaskCard, 
    ArtifactSpecCard, 
    NodeCard, 
    FlowCard,
    NodeCard, 
    FlowCard,
    RunProfileCard
)
from northstar.registry.schemas.overlays import LensOverlayCard
from northstar.registry.schemas.tenancy import TenantCard, PolicyPackCard, BudgetCard
from northstar.registry.schemas.nexus import NexusProfileCard

# GraphLens
from northstar.registry.schemas.neutral import NeutralNodeCard, ComponentRef
from northstar.registry.schemas.lenses import (
    ContextLayerCard, 
    TokenMapCard, 
    SafetyProfileCard, 
    LogPolicyCard, 
    InteractionStateCard
)
from northstar.registry.schemas.graph import GraphDefinitionCard

@dataclass
class RegistryContext:
    loader: "RegistryLoader"
    modes: Dict[str, ModeCard]
    profiles: Dict[str, RunProfileCard]
    providers: Dict[str, ProviderConfigCard]
    models: Dict[str, ModelCard]
    capabilities: Dict[str, CapabilityCard]
    bindings: Dict[str, CapabilityBindingCard]
    personas: Dict[str, PersonaCard]
    tasks: Dict[str, TaskCard]
    artifact_specs: Dict[str, ArtifactSpecCard]
    nodes: Dict[str, NodeCard]
    flows: Dict[str, FlowCard]
    overlays: Dict[str, LensOverlayCard]
    tenants: Dict[str, TenantCard]
    policy_packs: Dict[str, PolicyPackCard]
    budgets: Dict[str, BudgetCard]
    nexus_profiles: Dict[str, NexusProfileCard]
    
    # GraphLens Architecture
    neutral_nodes: Dict[str, Any]
    lens_contexts: Dict[str, Any]
    lens_tokens: Dict[str, Any]
    lens_safety: Dict[str, Any]
    lens_logs: Dict[str, Any]
    lens_interactions: Dict[str, Any]
    graph_definitions: Dict[str, Any]

class RegistryLoader:
    def __init__(self, root_path: str):
        self.root_path = root_path

    def load_context(self) -> RegistryContext:
        try:
            cards_modes = self.load_cards_from_dir("framework_modes")
            cards_profiles = self.load_cards_from_dir("profiles")
            cards_providers = self.load_cards_from_dir("providers")
            cards_models = self.load_cards_from_dir("models")
            cards_capabilities = self.load_cards_from_dir("capabilities")
            cards_bindings = self.load_cards_from_dir("capability_bindings")
            cards_personas = self.load_cards_from_dir("personas")
            cards_tasks = self.load_cards_from_dir("tasks")
            cards_artifact_specs = self.load_cards_from_dir("artifact_specs")
            cards_nodes = self.load_cards_from_dir("nodes")
            cards_flows = self.load_cards_from_dir("flows")
            cards_overlays = self.load_cards_from_dir("overlays")
            cards_tenants = self.load_cards_from_dir("tenants")
            cards_policies = self.load_cards_from_dir("policy_packs")
            cards_budgets = self.load_cards_from_dir("budgets")
            cards_nexus_profiles = self.load_cards_from_dir("nexus_profiles")
            
            # GraphLens Directories
            cards_neutral = self.load_cards_from_dir("neutral_nodes")
            cards_lenses = self.load_cards_from_dir("lenses")
            cards_graphs = self.load_cards_from_dir("graphs")
        except Exception as e:
            print(f"Error loading registry: {e}")
            cards_modes = []
            cards_profiles = []
            cards_providers = []
            cards_models = []
            cards_capabilities = []
            cards_bindings = []
            cards_personas = []
            cards_tasks = []
            cards_artifact_specs = []
            cards_nodes = []
            cards_flows = []
            cards_overlays = []
            cards_tenants = []
            cards_policies = []
            cards_budgets = []
            cards_nexus_profiles = []
            cards_neutral = []
            cards_lenses = []
            cards_graphs = []

        return RegistryContext(
            loader=self,
            modes={c.id: c for c in cards_modes if isinstance(c, ModeCard)},
            profiles={c.profile_id: c for c in cards_profiles if isinstance(c, RunProfileCard)},
            providers={c.provider_id: c for c in cards_providers if isinstance(c, ProviderConfigCard)},
            models={c.model_id: c for c in cards_models if isinstance(c, ModelCard)},
            capabilities={c.capability_id: c for c in cards_capabilities if isinstance(c, CapabilityCard)},
            bindings={c.binding_id: c for c in cards_bindings if isinstance(c, CapabilityBindingCard)},
            personas={c.persona_id: c for c in cards_personas if isinstance(c, PersonaCard)},
            tasks={c.task_id: c for c in cards_tasks if isinstance(c, TaskCard)},
            artifact_specs={c.artifact_spec_id: c for c in cards_artifact_specs if isinstance(c, ArtifactSpecCard)},
            nodes={c.node_id: c for c in cards_nodes if isinstance(c, NodeCard)},
            flows={c.flow_id: c for c in cards_flows if isinstance(c, FlowCard)},
            overlays={c.overlay_id: c for c in cards_overlays if hasattr(c, 'overlay_id')},
            tenants={c.tenant_id: c for c in cards_tenants if isinstance(c, TenantCard)},
            policy_packs={c.policy_pack_id: c for c in cards_policies if isinstance(c, PolicyPackCard)},
            budgets={c.budget_id: c for c in cards_budgets if isinstance(c, BudgetCard)},
            nexus_profiles={c.nexus_profile_id: c for c in cards_nexus_profiles if isinstance(c, NexusProfileCard)},
            
            # GraphLens
            neutral_nodes={c.node_id: c for c in cards_neutral if hasattr(c, 'node_id')},
            lens_contexts={c.context_id: c for c in cards_lenses if hasattr(c, 'context_id')},
            lens_tokens={c.token_map_id: c for c in cards_lenses if hasattr(c, 'token_map_id')},
            lens_safety={c.safety_id: c for c in cards_lenses if hasattr(c, 'safety_id')},
            lens_logs={c.policy_id: c for c in cards_lenses if hasattr(c, 'policy_id')},
            lens_interactions={c.state_id: c for c in cards_lenses if hasattr(c, 'state_id')},
            graph_definitions={c.graph_id: c for c in cards_graphs if hasattr(c, 'graph_id')}
        )

    def load_cards_from_dir(self, directory: str) -> List[Any]:
        cards: List[Any] = []
        full_path = os.path.join(self.root_path, directory)
        
        if not os.path.exists(full_path):
            return cards

        for root, _, files in os.walk(full_path):
            for file in files:
                if file.endswith((".yaml", ".yml")):
                    filepath = os.path.join(root, file)
                    cards.extend(self._load_file(filepath))
        return cards

    
    def _load_file(self, filepath: str) -> List[Any]:
        loaded: List[Any] = []
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                docs = list(yaml.safe_load_all(f))
                
            from .parsers import (
                parse_mode, parse_framework, parse_profile, 
                parse_provider, parse_model, parse_capability, 
                parse_capability_binding, parse_persona, 
                parse_task, parse_artifact_spec,
                parse_node, parse_flow
            )
            
            for doc in docs:
                if not doc or not isinstance(doc, dict):
                    continue
                
                card_type = doc.get("card_type")
                if card_type == "mode":
                    loaded.append(parse_mode(doc))
                elif card_type == "framework_adapter":
                    loaded.append(parse_framework(doc))
                elif card_type == "profile":
                    loaded.append(parse_profile(doc))
                elif card_type == "provider":
                    loaded.append(parse_provider(doc))
                elif card_type == "model":
                    loaded.append(parse_model(doc))
                elif card_type == "capability":
                    loaded.append(parse_capability(doc))
                elif card_type == "capability_binding":
                    loaded.append(parse_capability_binding(doc))
                elif card_type == "persona":
                    loaded.append(parse_persona(doc))
                elif card_type == "task":
                    loaded.append(parse_task(doc))
                elif card_type == "artifact_spec":
                    loaded.append(parse_artifact_spec(doc))
                elif card_type == "node":
                    loaded.append(parse_node(doc))
                elif card_type == "flow":
                    loaded.append(parse_flow(doc))
                elif card_type == "tenant":
                    # Simple dataclass instantiation
                    # Filter out non-field keys if necessary, or assume schema compliance
                    # For now, strict:
                    try:
                        c = TenantCard(**{k: v for k, v in doc.items() if k != "card_type"})
                        loaded.append(c)
                    except Exception as e:
                         print(f"Error parsing TenantCard: {e}")
                elif card_type == "policy_pack":
                    # Nested parsing for rules
                    rules_data = doc.get("rules", [])
                    from northstar.registry.schemas.tenancy import PolicyRule
                    rules = [PolicyRule(**r) for r in rules_data]
                    doc["rules"] = rules
                    try:
                        c = PolicyPackCard(**{k: v for k, v in doc.items() if k != "card_type"})
                        loaded.append(c)
                    except Exception as e:
                         print(f"Error parsing PolicyPackCard: {e}")
                elif card_type == "budget":
                    try:
                        c = BudgetCard(**{k: v for k, v in doc.items() if k != "card_type"})
                        loaded.append(c)
                    except Exception as e:
                         print(f"Error parsing BudgetCard: {e}")
                elif card_type == "nexus_profile":
                    try:
                        c = NexusProfileCard(**{k: v for k, v in doc.items() if k != "card_type"})
                        loaded.append(c)
                    except Exception as e:
                         print(f"Error parsing NexusProfileCard: {e}")
                
                # --- GraphLens Parsers ---
                elif card_type == "neutral_node":
                    try:
                        # Manual parsing of component refs might be needed if they are dicts
                        components_data = doc.get("components", [])
                        components = [ComponentRef(**c) if isinstance(c, dict) else c for c in components_data]
                        doc["components"] = components
                        loaded.append(NeutralNodeCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                    except Exception as e:
                        print(f"Error parsing NeutralNodeCard: {e}")

                elif card_type == "lens_context":
                    try:
                        loaded.append(ContextLayerCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                    except Exception as e:
                        print(f"Error parsing ContextLayerCard: {e}")

                elif card_type == "lens_token_map":
                    try:
                        loaded.append(TokenMapCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                    except Exception as e:
                        print(f"Error parsing TokenMapCard: {e}")
                        
                elif card_type == "lens_safety":
                    try:
                        loaded.append(SafetyProfileCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                    except Exception as e:
                        print(f"Error parsing SafetyProfileCard: {e}")

                elif card_type == "lens_log":
                    try:
                        loaded.append(LogPolicyCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                    except Exception as e:
                        print(f"Error parsing LogPolicyCard: {e}")
                        
                elif card_type == "lens_interaction":
                    try:
                        loaded.append(InteractionStateCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                    except Exception as e:
                        print(f"Error parsing InteractionStateCard: {e}")
                        
                elif card_type == "graph_def":
                    try:
                        # GraphDefinition definition handles edge parsing in post_init
                        loaded.append(GraphDefinitionCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                    except Exception as e:
                        print(f"Error parsing GraphDefinitionCard: {e}")
                else:
                    print(f"Warning: Unknown card_type '{card_type}' in {filepath}")
                    
        except Exception as e:
            raise ValueError(f"Error loading {filepath}: {e}")
            
        return loaded
