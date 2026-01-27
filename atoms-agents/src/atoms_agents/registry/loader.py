import os
import yaml
from typing import List, Any, Dict
from dataclasses import dataclass
from atoms_agents.registry.schemas import (
    ModeCard,
    FrameworkAdapterCard,
    FrameworkCard,
    ProviderConfigCard,
    ModelCard,
    ModelFamilyCard,
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
from atoms_agents.registry.schemas.overlays import LensOverlayCard
from atoms_agents.registry.schemas.tenancy import TenantCard, PolicyPackCard, BudgetCard
from atoms_agents.registry.schemas.nexus import NexusProfileCard
from atoms_agents.registry.schemas.agent_cards import ReasoningProfileCard, FirearmsLicenseCard, AgentCard

# GraphLens
from atoms_agents.registry.schemas.neutral import NeutralNodeCard, ComponentRef
from atoms_agents.registry.schemas.lenses import (
    ContextLayerCard,
    TokenMapCard,
    SafetyProfileCard,
    LogPolicyCard,
    InteractionStateCard
)
from atoms_agents.registry.schemas.graph import GraphDefinitionCard

@dataclass
class RegistryContext:
    loader: "RegistryLoader"
    modes: Dict[str, ModeCard]
    frameworks: Dict[str, FrameworkCard] # New
    profiles: Dict[str, RunProfileCard]
    providers: Dict[str, ProviderConfigCard]
    families: Dict[str, ModelFamilyCard] # New
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

    # New Atomic Cards
    reasoning_profiles: Dict[str, ReasoningProfileCard]
    licenses: Dict[str, FirearmsLicenseCard]
    agents: Dict[str, AgentCard]

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
        # Load directories independently so one failure doesn't kill the whole registry
        cards_frameworks = self.load_cards_from_dir("frameworks")
        cards_modes = self.load_cards_from_dir("framework_modes")
        cards_profiles = self.load_cards_from_dir("profiles")
        cards_providers = self.load_cards_from_dir("providers")
        cards_families = self.load_cards_from_dir("families")
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

        # New Atomic Directories
        cards_reasoning = self.load_cards_from_dir("reasoning_profiles")
        cards_licenses = self.load_cards_from_dir("licenses")
        cards_agents = self.load_cards_from_dir("agents")

        # GraphLens Directories
        cards_neutral = self.load_cards_from_dir("neutral_nodes")
        cards_lenses = self.load_cards_from_dir("lenses")
        cards_graphs = self.load_cards_from_dir("graphs")

        return RegistryContext(
            loader=self,
            frameworks={c.framework_id: c for c in cards_frameworks if isinstance(c, FrameworkCard)},
            modes={c.id: c for c in cards_modes if isinstance(c, ModeCard)},
            profiles={c.profile_id: c for c in cards_profiles if isinstance(c, RunProfileCard)},
            providers={c.provider_id: c for c in cards_providers if isinstance(c, ProviderConfigCard)},
            families={c.family_id: c for c in cards_families if isinstance(c, ModelFamilyCard)},
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

            # New Atomic Cards
            reasoning_profiles={c.profile_id: c for c in cards_reasoning if isinstance(c, ReasoningProfileCard)},
            licenses={c.license_id: c for c in cards_licenses if isinstance(c, FirearmsLicenseCard)},
            agents={c.agent_id: c for c in cards_agents if isinstance(c, AgentCard)},

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
                    try:
                        cards.extend(self._load_file(filepath))
                    except Exception as e:
                        # Log error but don't stop loading other files
                        print(f"Error loading {filepath}: {e}")
        return cards


    def _load_file(self, filepath: str) -> List[Any]:
        loaded: List[Any] = []
        # We don't catch here anymore, let load_cards_from_dir handle it individually
        # But for robustness inside the file (bad yaml vs bad schema), we rely on parsers raising errors.

        with open(filepath, "r", encoding="utf-8") as f:
            docs = list(yaml.safe_load_all(f))

        from .parsers import (
            parse_mode, parse_framework, parse_framework_card, parse_profile,
            parse_provider, parse_model, parse_model_family, parse_capability,
            parse_capability_binding, parse_persona,
            parse_task, parse_artifact_spec,
            parse_node, parse_flow
        )

        for doc in docs:
            if not doc or not isinstance(doc, dict):
                continue

            card_type = doc.get("card_type")
            try:
                if card_type == "mode":
                    loaded.append(parse_mode(doc))
                elif card_type == "framework_adapter":
                    loaded.append(parse_framework(doc))
                elif card_type == "framework":
                    loaded.append(parse_framework_card(doc))
                elif card_type == "profile":
                    loaded.append(parse_profile(doc))
                elif card_type == "provider":
                    loaded.append(parse_provider(doc))
                elif card_type == "model":
                    loaded.append(parse_model(doc))
                elif card_type == "model_family":
                    loaded.append(parse_model_family(doc))
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
                    c = TenantCard(**{k: v for k, v in doc.items() if k != "card_type"})
                    loaded.append(c)
                elif card_type == "policy_pack":
                    rules_data = doc.get("rules", [])
                    from atoms_agents.registry.schemas.tenancy import PolicyRule
                    rules = [PolicyRule(**r) for r in rules_data]
                    doc["rules"] = rules
                    c = PolicyPackCard(**{k: v for k, v in doc.items() if k != "card_type"})
                    loaded.append(c)
                elif card_type == "budget":
                    c = BudgetCard(**{k: v for k, v in doc.items() if k != "card_type"})
                    loaded.append(c)
                elif card_type == "nexus_profile":
                    c = NexusProfileCard(**{k: v for k, v in doc.items() if k != "card_type"})
                    loaded.append(c)

                # --- New Atomic Parsers ---
                elif card_type == "reasoning_profile":
                    c = ReasoningProfileCard(**{k: v for k, v in doc.items() if k != "card_type"})
                    loaded.append(c)
                elif card_type == "firearms_license":
                    c = FirearmsLicenseCard(**{k: v for k, v in doc.items() if k != "card_type"})
                    loaded.append(c)
                elif card_type == "agent":
                    c = AgentCard(**{k: v for k, v in doc.items() if k != "card_type"})
                    loaded.append(c)

                # --- GraphLens Parsers ---
                elif card_type == "neutral_node":
                    components_data = doc.get("components", [])
                    components = [ComponentRef(**c) if isinstance(c, dict) else c for c in components_data]
                    doc["components"] = components
                    loaded.append(NeutralNodeCard(**{k: v for k, v in doc.items() if k != "card_type"}))

                elif card_type == "lens_context":
                    loaded.append(ContextLayerCard(**{k: v for k, v in doc.items() if k != "card_type"}))

                elif card_type == "lens_token_map":
                    loaded.append(TokenMapCard(**{k: v for k, v in doc.items() if k != "card_type"}))

                elif card_type == "lens_safety":
                    loaded.append(SafetyProfileCard(**{k: v for k, v in doc.items() if k != "card_type"}))

                elif card_type == "lens_log":
                    loaded.append(LogPolicyCard(**{k: v for k, v in doc.items() if k != "card_type"}))

                elif card_type == "lens_interaction":
                    loaded.append(InteractionStateCard(**{k: v for k, v in doc.items() if k != "card_type"}))

                elif card_type == "graph_def":
                    loaded.append(GraphDefinitionCard(**{k: v for k, v in doc.items() if k != "card_type"}))
                else:
                    print(f"Warning: Unknown card_type '{card_type}' in {filepath}")
            except Exception as e:
                # If a single card in a file fails, we might want to skip it or fail the whole file?
                # For now let's raise so the file fails, but other files load.
                raise ValueError(f"Error parsing card in {filepath}: {e}")

        return loaded
