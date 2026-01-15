from src.models.types import ModelSpec, Vendor

def get_model_spec() -> ModelSpec:
    return ModelSpec(
        vendor=Vendor.GOOGLE,
        model_id="gemini-2.0-flash-exp",
        api_surface="google_genai_sdk",
        modalities_supported=["text", "vision", "audio", "video", "func_call"],
        default_params={"temperature": 0.7},
        cost_profile="cheap"
    )
