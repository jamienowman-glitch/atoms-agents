"""AWS Bedrock Model Curation Tool"""
import json
import yaml
from pathlib import Path

# Paths
CORE_ROOT = Path(__file__).parent.parent.parent.parent
REGISTRY_MODELS = CORE_ROOT / "registry" / "models"
RAW_SNAPSHOT_FILE = REGISTRY_MODELS / "catalog.aws.bedrock.raw.json"
CURATED_FILE = REGISTRY_MODELS / "catalog.aws.bedrock.curated.yaml"

def infer_family(model_id):
    """Infers model family from model ID."""
    if model_id.startswith("amazon.nova"):
        return "nova"
    if model_id.startswith("anthropic.claude"):
        return "claude"
    if model_id.startswith("mistral."):
        return "mistral"
    if model_id.startswith("qwen."):
        return "qwen"
    return "generic"

def infer_capabilities(provider_name, modalities):
    """Infers capabilities based on provider and modalities."""
    tags = []
    
    # Modalities
    input_mods = modalities.get("input", [])
    output_mods = modalities.get("output", [])
    
    # Generic chat assumption for text-in models (refine if needed)
    if "TEXT" in input_mods:
         tags.extend(["chat", "orchestration"])
         
    if "IMAGE" in input_mods or "IMAGE" in output_mods:
        tags.append("vision")
    
    if "VIDEO" in input_mods or "VIDEO" in output_mods:
        tags.append("video")
        
    if "stability" in provider_name.lower():
        tags.extend(["image", "generation"])
        
    if "embedding" in provider_name.lower() or "embedding" in str(modalities).lower():
         # Basic catch for embeddings if they appear in this list (Bedrock list_foundation_models includes them)
         tags.append("embedding")
         if "IMAGE" in input_mods:
             tags.append("multimodal")

    return list(set(tags)) # Dedupe

def infer_price_tier(family, model_id):
    """Infers price tier."""
    lower_id = model_id.lower()
    
    cheap_keywords = [
        "nova-2-lite", "haiku", "ministral", "qwen-3", "qwen-4b", "qwen-12b", "micro", "nano"
    ]
    
    premium_keywords = [
        "nova-pro", "mistral-large", "qwen-80b", "openai-120b", "ultra", "opus"
    ]
    
    for kw in cheap_keywords:
        if kw in lower_id:
            return "cheap"
            
    for kw in premium_keywords:
        if kw in lower_id:
            return "premium"
            
    return "mid"

def is_mid_or_cheap(tier):
    return tier in ["mid", "cheap"]

def main():
    """Curates raw Bedrock JSON into standardized YAML."""
    print("Curating AWS Bedrock models to YAML...")
    
    if not RAW_SNAPSHOT_FILE.exists():
        print(f"Error: Raw snapshot file not found at {RAW_SNAPSHOT_FILE}")
        return

    with open(RAW_SNAPSHOT_FILE, "r") as f:
        raw_models = json.load(f)
        
    curated_models = []
    
    for m in raw_models:
        model_id = m.get("modelId")
        provider_name = m.get("providerName", "Unknown")
        input_modalities = m.get("inputModalities", [])
        output_modalities = m.get("outputModalities", [])
        
        # Normalize provider
        provider = provider_name.lower().replace(" ", "-")
        
        # Infer properties
        family = infer_family(model_id)
        
        modalities_dict = {
            "input": input_modalities,
            "output": output_modalities
        }
        
        price_tier = infer_price_tier(family, model_id)
        
        # Special case: Nova multimodal embeddings are explicitly "embedding"
        # The bedrock list often distinguishes them.
        # But our simple heuristic in infer_capabilities handles basic tagging.
        
        entry = {
            "id": model_id,
            "provider": provider,
            "backend": "aws_bedrock",
            "region": "us-east-1",
            "modalities": modalities_dict,
            "family": family,
            "capability_tags": infer_capabilities(provider_name, modalities_dict),
            "price_tier": price_tier,
            "default_enabled": is_mid_or_cheap(price_tier)
        }
        
        curated_models.append(entry)
        
    # Write to YAML
    with open(CURATED_FILE, "w") as f:
        # custom sort to put id first if possible, but standard dump is fine for now
        # yaml.dump doesn't preserve key order by default in older python versions without extra work,
        # but modern python dicts are ordered.
        yaml.dump(curated_models, f, sort_keys=False)
        
    print(f"Success! Curated {len(curated_models)} models to {CURATED_FILE}")

if __name__ == "__main__":
    main()
