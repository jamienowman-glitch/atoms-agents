from src.models.types import ModelSpec, Vendor

def get_model_spec() -> ModelSpec:
    return ModelSpec(
        vendor=Vendor.ANTHROPIC,
        model_id="claude-3-5-sonnet-20241022",
        api_surface="anthropic_messages",
        modalities_supported=["text", "vision", "tool_use", "computer_use"],
        default_params={"max_tokens": 1024},
        cost_profile="normal"
    )
