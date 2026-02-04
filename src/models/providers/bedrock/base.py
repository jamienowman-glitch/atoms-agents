"""Shared Bedrock provider helpers."""
import asyncio
import json
from typing import Any, Dict, Optional

import boto3

from atoms_agents.src.models.providers.common import log_inference_event, require_secret, resolve_secret


class BedrockProviderBase:
    """Base class for AWS Bedrock providers."""

    PROVIDER_ID = "prov_bedrock"

    def __init__(self, model_id: str) -> None:
        if not model_id:
            raise ValueError("Bedrock model_id is required")
        self.model_id = model_id
        access_key = require_secret("AWS_ACCESS_KEY_ID", "aws-access-key-id.txt")
        secret_key = require_secret("AWS_SECRET_ACCESS_KEY", "aws-secret-access-key.txt")
        session_token = resolve_secret("AWS_SESSION_TOKEN", "aws-session-token.txt")
        region = resolve_secret("AWS_REGION", "aws-region.txt", "aws-default-region.txt")
        client_kwargs: Dict[str, Any] = {
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
        }
        if session_token:
            client_kwargs["aws_session_token"] = session_token
        if region:
            client_kwargs["region_name"] = region
        self.client = boto3.client("bedrock-runtime", **client_kwargs)

    @staticmethod
    def _render_body(body: Any) -> str:
        try:
            return body.decode("utf-8")
        except AttributeError:
            if isinstance(body, str):
                return body
            try:
                return json.dumps(body)
            except Exception:
                return ""

    async def _log_response(
        self,
        prompt: str,
        output: Optional[str],
        canvas_id: Optional[str],
        thread_id: Optional[str],
        actor_id: str,
        error: Optional[str] = None,
    ) -> None:
        await log_inference_event(
            provider_id=self.PROVIDER_ID,
            model_id=self.model_id,
            input_text=prompt,
            output_text=output,
            tokens_used=0,
            cost=0.0,
            error=error,
            canvas_id=canvas_id,
            thread_id=thread_id,
            actor_id=actor_id,
        )

    async def generate(
        self,
        prompt: str,
        *,
        payload: Optional[Dict[str, Any]] = None,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> str:
        body_payload: Dict[str, Any] = payload.copy() if payload else {"inputText": prompt}
        body_payload.update(kwargs)
        try:
            response = await asyncio.to_thread(
                self.client.invoke_model,
                modelId=self.model_id,
                body=json.dumps(body_payload).encode("utf-8"),
                contentType="application/json",
                accept="application/json",
            )
            body = response.get("body")
            content = self._render_body(body.read() if hasattr(body, "read") else body)
            await self._log_response(
                prompt=prompt,
                output=content,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return content
        except Exception as exc:  # pragma: no cover
            await self._log_response(
                prompt=prompt,
                output=None,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise

    async def generate_image(
        self,
        prompt: str,
        *,
        canvas_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        actor_id: str = "system",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        payload = {"inputText": prompt}
        payload.update(kwargs)
        try:
            response = await asyncio.to_thread(
                self.client.invoke_model,
                modelId=self.model_id,
                body=json.dumps(payload).encode("utf-8"),
                contentType="application/json",
                accept="application/json",
            )
            body = response.get("body")
            content = self._render_body(body.read() if hasattr(body, "read") else body)
            await self._log_response(
                prompt=prompt,
                output=content,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
            )
            return {"result": content}
        except Exception as exc:  # pragma: no cover
            await self._log_response(
                prompt=prompt,
                output=None,
                canvas_id=canvas_id,
                thread_id=thread_id,
                actor_id=actor_id,
                error=str(exc),
            )
            raise
