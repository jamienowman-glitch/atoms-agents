from src.models.types import ModelSpec, Vendor

def get_model_spec() -> ModelSpec:
    return ModelSpec(
        vendor=Vendor.OPENAI,
        model_id="gpt-4o",
        api_surface="openai_chat_completions",
        modalities_supported=["text", "vision", "func_call"],
        default_params={"temperature": 0.7},
        cost_profile="normal"
    )
