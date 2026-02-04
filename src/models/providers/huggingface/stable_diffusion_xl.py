"""HuggingFace StableDiffusionXlProvider (stabilityai/stable-diffusion-xl-base-1.0) image generator."""
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.huggingface.base import HuggingFaceProviderBase


class StableDiffusionXlProvider(HuggingFaceProviderBase):
    MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate_image(
        self,
        prompt: str,
        *,
        image_count: int = 1,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
    ) -> Dict[str, Any]:
        return await super().generate_image(
            prompt,
            image_count=image_count,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )
