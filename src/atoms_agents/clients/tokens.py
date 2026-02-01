from typing import Any, List, Optional, Dict
from .http_base import BaseHttpClient


class TokensClient(BaseHttpClient):
    """
    Client for Token & Canvas operations.
    """

    async def get_token_catalog(
        self, canvas_id: str, element_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        path = f"canvas/{canvas_id}/token_catalog"
        params = {"element_id": element_id} if element_id else None
        return await self._request("GET", path, params=params)

    async def set_token(
        self,
        canvas_id: str,
        element_id: Optional[str],
        token_path: str,
        value: Any,
        user_id: str,
    ):
        """
        Sends a 'set_token' command to the canvas.
        """
        path = f"canvas/{canvas_id}/commands"
        payload = {
            "type": "set_token",
            "canvas_id": canvas_id,
            "args": {  # Flattened or structured depending on command envelope
                "element_id": element_id,
                "token_path": token_path,
                "value": value,
            },
            # Envelope meta would be constructed here or in backend args
        }
        # In P0 Engines implementation, envelope structure is:
        # { type, canvas_id, command_args: {...} } or similar.
        # Checking engines/canvas_commands/models.py from memory:
        # CommandEnvelope(type, canvas_id, args={...})

        # Adjusting payload to match CommandEnvelope
        # But wait, helper usually wraps complexity.
        # Let's send the raw envelope structure expected by router.

        envelope = {
            "type": "set_token",
            "canvas_id": canvas_id,
            "args": {
                "element_id": element_id,
                "token_path": token_path,
                "value": value,
            },
        }
        return await self._request("POST", path, json_data=envelope)

    async def get_canvas_snapshot(self, canvas_id: str) -> Dict[str, Any]:
        path = f"canvas/{canvas_id}/snapshot"
        return await self._request("GET", path)
