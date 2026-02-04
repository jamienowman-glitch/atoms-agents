"""Google Imagen3Provider wrapping imagen-3."""
import os
from typing import Any, Dict, Optional

from atoms_agents.src.models.providers.google.base import GoogleImageProvider


class Imagen3Provider(GoogleImageProvider):
    MODEL_ID = "imagen-3"

    def __init__(self) -> None:
        super().__init__(self.MODEL_ID)

    async def generate_image(
        self,
        prompt: str,
        *,
        size: str = "1024x1024",
        image_count: int = 1,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        return await super().generate_image(
            prompt,
            size=size,
            image_count=image_count,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
            **kwargs,
        )
