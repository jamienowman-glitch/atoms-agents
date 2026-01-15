import sys
import os
import importlib
from typing import Dict, Any, Optional

from northstar.registry.schemas import ModeCard, RunProfileCard
from northstar.runtime.context import RunContext
from northstar.core.logging import StructuredLogger
from northstar.core.cancellation import CancellationToken
from northstar.runtime.profiles import PersistenceFactory
from northstar.core.secrets import EnvSecretProvider

from northstar.core.connectivity import ConnectivityLedger, ModeLedger
from northstar.runtime.result import ModeRunResult

def get_profile(profiles: Dict[str, Any], profile_id: str) -> RunProfileCard:
    if profile_id not in profiles:
        print(f"Error: Profile '{profile_id}' not found.")
        sys.exit(1)
    p = profiles[profile_id]
    if not isinstance(p, RunProfileCard):
            print(f"Error: Card '{profile_id}' is not a RunProfileCard.")
            sys.exit(1)
    return p

def list_profiles(profiles: Dict[str, Any]) -> None:
    print(f"{'PROFILE ID':<20} {'NAME':<20} {'BACKEND'}")
    print("-" * 60)
    for p in profiles.values():
        if isinstance(p, RunProfileCard):
            print(f"{p.profile_id:<20} {p.name:<20} {p.persistence_backend}")





def show_ledger() -> None:
    print("=== FRAMEWORK CONNECTIVITY ===")
    conn_data = ConnectivityLedger.load()
    if not conn_data:
        print("(No history)")
    else:
        for fw, info in conn_data.items():
            status = "PASSED" if info.get("ever_passed") else "NEVER"
            print(f"{fw:<20} {status}")

    print("\n=== MODE CERTIFICATION ===")
    mode_data = ModeLedger.load()
    if not mode_data:
        print("(No history)")
    else:
        print(f"{'MODE ID':<30} {'CERTIFIED':<10} {'FRAMEWORK'}")
        print("-" * 60)
        for mode_id, info in mode_data.items():
            status = "YES" if info.get("ever_passed") else "NO"
            fw = info.get("framework", "unknown")
            print(f"{mode_id:<30} {status:<10} {fw}")

def verify_modes(
    modes: Dict[str, ModeCard], 
    profiles: Dict[str, Any], 
    profile_id: str, 
    allow_regression: bool, 
    target_framework: Optional[str] = None, 
    allow_mutate: bool = False,
    # Phase 11: Provider/Model args
    providers: Optional[Dict[str, Any]] = None,
    models: Optional[Dict[str, Any]] = None,
    provider_id: Optional[str] = None,
    model_id: Optional[str] = None
) -> None:
    profile = get_profile(profiles, profile_id)
    print(f"Verifying modes with profile: {profile.profile_id}")
    if target_framework:
        print(f"Target Framework: {target_framework}")
    if provider_id:
        print(f"Target Provider: {provider_id} / Model: {model_id}")

    print(f"{'MODE ID':<30} {'STATUS':<10} {'DETAILS'}")
    print("-" * 80)
    
    import tempfile
    
    # Filter modes if framework specified
    modes_to_run = modes
    if target_framework:
        modes_to_run = {k: v for k, v in modes.items() if v.framework == target_framework}
        
    # Resolve Gateway if requested
    gateway_instance: Optional[Any] = None
    provider_config_card = None
    model_card_obj = None

    if provider_id and model_id and providers and models:
        if provider_id not in providers:
            print(f"Error: Provider '{provider_id}' not found in registry.")
            sys.exit(1)
        if model_id not in models:
            print(f"Error: Model '{model_id}' not found in registry.")
            sys.exit(1)
            
        provider_config_card = providers[provider_id]
        model_card_obj = models[model_id]
        
        # Validation: Model must belong to provider
        if model_card_obj.provider_id != provider_id:
            print(f"Error: Model '{model_id}' belongs to '{model_card_obj.provider_id}', not '{provider_id}'.")
            sys.exit(1)

        # Instantiate Gateway
        try:
            if provider_id == "bedrock":
                from northstar.runtime.providers.bedrock import BedrockGateway
                gateway_instance = BedrockGateway()
            elif provider_id == "azure_openai":
                from northstar.runtime.providers.azure_openai import AzureOpenAIGateway
                gateway_instance = AzureOpenAIGateway()
            elif provider_id == "vertex":
                from northstar.runtime.providers.vertex import VertexGateway
                gateway_instance = VertexGateway()
            else:
                 print(f"Error: No Gateway implementation for provider type '{provider_id}'")
                 sys.exit(1)
        except ImportError as e:
            # If verify-framework fails to load gateway deps, that's a user environment error for verification
            print(f"Error loading provider '{provider_id}': {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Error initializing gateway '{provider_id}': {e}")
            sys.exit(1)

    with tempfile.TemporaryDirectory() as tmpdir:
        try:
            artifact_store = PersistenceFactory.get_artifact_store(profile, os.path.join(tmpdir, "artifacts"))
            blackboard = PersistenceFactory.get_blackboard(profile, os.path.join(tmpdir, "blackboard"))
            pii = PersistenceFactory.get_pii_strategy(profile)
            nexus = PersistenceFactory.get_nexus_client(profile)
        except Exception as e:
            print(f"ALL                            FAIL       Profile init error: {e}")
            sys.exit(1)

        ctx = RunContext(
            logger=StructuredLogger(os.path.join(tmpdir, "logs")),
            artifact_store=artifact_store,
            blackboard=blackboard,
            cancellation_token=CancellationToken(),
            secret_provider=EnvSecretProvider(),
            pii_strategy=pii,
            nexus_client=nexus,
            # Inject Gateway
            llm_gateway=gateway_instance,
            provider_config=provider_config_card,
            model_card=model_card_obj
        )
        
        for mode_id, mode in sorted(modes_to_run.items()):
            try:
                module_name, func_name = mode.entrypoint.rsplit(".", 1)
                module = importlib.import_module(module_name)
                func = getattr(module, func_name)
                
                input_data = {"_allow_mutate": allow_mutate} if allow_mutate else {}
                
                result = func(input_data, ctx)
                
                # Normalize result
                if isinstance(result, ModeRunResult):
                    status = result.status
                    details = result.reason
                else:
                    status = result.get("status", "UNKNOWN")
                    details = result.get("reason", "") or result.get("error", "") or str(result.get("output", ""))

                # --- REGRESSION CHECK ---
                if status == "SKIP":
                    # Check if it ever passed
                    if ModeLedger.is_regressed(mode_id) and not allow_regression:
                        status = "FAIL"
                        details = f"[REGRESSION] Prev passed. {details}"
                
                if status == "PASS":
                     ModeLedger.record_pass(mode_id, mode.framework)
                     ConnectivityLedger.record_pass(mode.framework, mode_id)

                if len(details) > 40:
                    details = details[:37] + "..."
                    
                print(f"{mode_id:<30} {status:<10} {details}")
                
            except ImportError:
                    print(f"{mode_id:<30} FAIL       ImportError (entrypoint missing?)")
            except Exception as e:
                    print(f"{mode_id:<30} FAIL       {str(e)}")

def verify_framework(
    modes: Dict[str, ModeCard], 
    profiles: Dict[str, Any], 
    framework: str, 
    profile_id: str, 
    allow_regression: bool, 
    allow_mutate: bool,
    # New args
    providers: Dict[str, Any],
    models: Dict[str, Any],
    provider_id: Optional[str] = None,
    model_id: Optional[str] = None
) -> None:
    verify_modes(
        modes=modes, 
        profiles=profiles, 
        profile_id=profile_id, 
        allow_regression=allow_regression, 
        target_framework=framework, 
        allow_mutate=allow_mutate,
        providers=providers,
        models=models,
        provider_id=provider_id,
        model_id=model_id
    )

def show_profile(profiles: Dict[str, Any], profile_id: str) -> None:
    if profile_id not in profiles:
        print(f"Error: Profile '{profile_id}' not found.")
        sys.exit(1)
    
    p = profiles[profile_id]
    import json
    from dataclasses import asdict
    print(json.dumps(asdict(p), indent=2))


