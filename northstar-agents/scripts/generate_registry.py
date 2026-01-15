
import csv
import os
import yaml
import re

# Paths
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCS_DIR = os.path.join(ROOT_DIR, "docs", "source_of_truth", "models")
CARDS_DIR = os.path.join(ROOT_DIR, "src", "northstar", "registry", "cards")

MODELS_TSV = os.path.join(DOCS_DIR, "model_connectivity_truth.tsv")
CAPABILITIES_TSV = os.path.join(DOCS_DIR, "model_capability_toggles_truth.tsv")

def slugify(text):
    text = text.lower()
    text = re.sub(r'[\s\.\:\-]+', '_', text)
    return text.strip('_')

def write_yaml(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        yaml.dump(data, f, sort_keys=False)
    print(f"Generated {path}")

def generate_models():
    print(f"Reading {MODELS_TSV}...")
    with open(MODELS_TSV, "r") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            provider_id = row["provider_id"]
            if not provider_id or provider_id == "unknown" or "[MISSING]" in row["model_or_deployment_id"]:
                continue
            
            # Generate model_id
            # Strategy: provider_id + slugified(model_or_deployment_id)
            # Avoid overly long names if possible, but uniqueness is key.
            # Clean up common prefixes like "us.", "anthropic." to make it cleaner?
            # User requirement: "model_id (registry id)"
            
            model_slug = slugify(row["model_or_deployment_id"])
            # Remove provider prefix if redundant?
            # e.g. bedrock_us_amazon_nova_pro_v1_0
            model_id = f"{provider_id}_{model_slug}"
            
            # YAML Content
            card = {
                "card_type": "model",
                "model_id": model_id,
                "provider_id": provider_id,
                "model_or_deployment_id": row["model_or_deployment_id"],
                "platform_api_surface": row["platform_api_surface"],
                "invocation_primitive": row["invocation_primitive"],
                "request_shape_minimal": row["request_shape_minimal"],
                "streaming_support": row["streaming_support"],
                "credential_discovery": row["credential_discovery"],
                "region_or_project_discovery": row["region_or_project_discovery"],
                "default_creds_ok": row["default_creds_ok"].upper() == "YES",
                "docs_url": row["docs_url"],
                "last_updated_or_version": row["last_updated_or_version"],
                "confidence": row["confidence"].lower(),
                "notes": row["notes"]
            }
            
            write_yaml(os.path.join(CARDS_DIR, "models", f"{model_id}.yaml"), card)

def generate_capabilities():
    print(f"Reading {CAPABILITIES_TSV}...")
    seen_capabilities = set()
    
    with open(CAPABILITIES_TSV, "r") as f:
        reader = csv.DictReader(f, delimiter="\t")
        rows = list(reader) # Read all to process bindings too
        
        # 1. Unique Capabilities
        for row in rows:
            cap_id = row["capability_id"]
            if cap_id not in seen_capabilities and cap_id:
                seen_capabilities.add(cap_id)
                card = {
                    "card_type": "capability",
                    "capability_id": cap_id,
                    "capability_name": row["capability_name"],
                    "embedded_or_separate": row["embedded_or_separate"],
                    "description": f"Enables {row['capability_name']}" # Minimal desc
                }
                write_yaml(os.path.join(CARDS_DIR, "capabilities", f"{cap_id}.yaml"), card)
        
        # 2. Bindings
        for row in rows:
            if not row["capability_id"]:
                continue
            
            # generate binding_id
            # provider + model_slug + capability
            provider_id = row["provider_id"]
            model_slug = slugify(row["model_or_deployment_id"])
            cap_id = row["capability_id"]
            binding_id = f"{provider_id}_{model_slug}_{cap_id}"
            
            card = {
                "card_type": "capability_binding",
                "binding_id": binding_id,
                "provider_id": provider_id,
                "model_or_deployment_id": row["model_or_deployment_id"],
                "capability_id": cap_id,
                "toggle_mechanism": row["toggle_mechanism"],
                "minimal_toggle_snippet": row["minimal_toggle_snippet"],
                "streaming_support": row["streaming_support"],
                "prereqs_or_allowlist": row["prereqs_or_allowlist"],
                "docs_url": row["docs_url"],
                "last_updated_or_version": row["last_updated_or_version"],
                "confidence": row["confidence"].lower(),
                "notes": row["notes"]
            }
            write_yaml(os.path.join(CARDS_DIR, "capability_bindings", f"{binding_id}.yaml"), card)

if __name__ == "__main__":
    generate_models()
    generate_capabilities()
