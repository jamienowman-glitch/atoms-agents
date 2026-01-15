def check_package(package_name: str, import_name: str = "") -> str:
    """Checks if a package is installed by importing it."""
    name_to_import = import_name if import_name else package_name
    try:
        __import__(name_to_import)
        return "INSTALLED"
    except ImportError:
        return "MISSING"

def check_aws_creds() -> str:
    # Best effort check without side effects
    if check_package("bedrock", "boto3") == "MISSING":
        return "N/A (boto3 missing)"
    try:
        import boto3
        session = boto3.Session()
        if session.get_credentials():
             return "LIVE READY"
        return "MISSING"
    except Exception as e:
        return f"ERROR ({str(e)})"

def check_gcp_creds() -> str:
     if check_package("adk", "google.auth") == "MISSING":
         return "N/A (google-auth missing)"
     try:
         import google.auth
         # default() looks for env vars or ADC files
         creds, project = google.auth.default()
         if creds:
             return f"LIVE READY (Project: {project})"
         return "MISSING"
     except Exception as e:
         return f"ERROR ({str(e)})"

def run_doctor() -> None:
    print(f"{'COMPONENT':<20} {'STATUS':<30}")
    print("-" * 50)
    
    # Check packages: label -> import_name
    pkgs = {
        "bedrock": "boto3",
        "adk": "google.auth",
        "autogen": "autogen", # package is pyautogen, import is autogen
        "crewai": "crewai",
        "langgraph": "langgraph",
        "strands": "strands"
    }
    
    for label, import_name in pkgs.items():
        # Pass both label and import name (we used label as package name in earlier calls but intention is import)
        status = check_package(label, import_name)
        print(f"{label:<20} {status:<30}")
        
    print("-" * 50)
    print(f"{'CREDENTIALS':<20} {'STATUS':<30}")
    print("-" * 50)
    print(f"{'AWS (Bedrock)':<20} {check_aws_creds():<30}")
    print(f"{'GCP (ADK)':<20} {check_gcp_creds():<30}")

    # Certification Stats
    print("\n[Mode Certification]")
    from northstar.core.connectivity import ConnectivityLedger, ModeLedger
    ModeLedger.load()
    # certified_count removed
    print(f"Modes Certified: {len(ModeLedger.load())}")
    
    print("\n--- Provider Check ---")
    try:
        import os
        from northstar.registry.loader import RegistryLoader
        cards_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../registry/cards"))
        loader = RegistryLoader(cards_root)
        providers = loader.load_cards_from_dir("providers")
        print(f"Registered Providers: {len(providers)}")
        for p in providers:
            # Check if dependencies installed?
            status = "INSTALLED" # Simplified check
            if p.provider_id == "azure_openai":
                try: 
                    import azure.ai.openai # noqa: F401
                    status = "OK" 
                except ImportError: 
                    status = "MISSING DEPS"
            elif p.provider_id == "bedrock":
                try: 
                    import boto3 # noqa: F401
                    status = "OK" 
                except ImportError: 
                    status = "MISSING DEPS"
            elif p.provider_id == "vertex":
                try: 
                    import vertexai # noqa: F401
                    status = "OK" 
                except ImportError: 
                    status = "MISSING DEPS"
            print(f"- {p.provider_id:<15}: {status}")

        models = loader.load_cards_from_dir("models")
        capabilities = loader.load_cards_from_dir("capabilities")
        bindings = loader.load_cards_from_dir("capability_bindings")

        print("\n--- Registry Stats ---")
        print(f"Models Loaded:       {len(models)}")
        print(f"Capabilities Loaded: {len(capabilities)}")
        print(f"Bindings Loaded:     {len(bindings)}")

    except Exception as e:
        print(f"Provider check skipped: {e}")
    
    conn_data = ConnectivityLedger.load()
    print("Certified Frameworks:")
    if not conn_data:
        print("  (None)")
    else:
        for fw, v in conn_data.items():
            if v.get("ever_passed"):
                print(f"  - {fw}")
