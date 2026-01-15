from src.models.types import ModelSpec, Vendor

def get_model_spec() -> ModelSpec:
    return ModelSpec(
        vendor=Vendor.PERPLEXITY,
        model_id="sonar-deep-research",
        api_surface="perplexity_chat",
        modalities_supported=["text"],
        default_params={"temperature": 0.2},
        cost_profile="expensive"
    )
