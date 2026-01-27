from typing import List, Dict, Any, Optional
import requests
import json
import mimetypes
import os
from atoms_agents.runtime.gateway import LLMGateway, CapabilityToggleRequest, ReadinessResult, ReadinessStatus
from atoms_agents.runtime.auth_loader import require_key

class GeminiGateway(LLMGateway):
    """
    Gemini AI Studio Gateway (REST API).
    Supports text and video/image input via File API.
    """
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
    # Supported capability keys: "thinking_level" (LOW/HIGH), "json_schema" (bool), "mime_type" (str)

    def _get_key(self) -> str:
        return require_key("GEMINI_API_KEY")

    def _upload_file(self, file_path: str, mime_type: str) -> str:
        """
        Uploads file to Gemini File API and returns file URI.
        1. POST /upload/v1beta/files -> upload_url
        2. POST to upload_url -> file info
        """
        key = self._get_key()

        # Step 1: Resumable upload init
        # Simplified: Use the smaller payload method if possible or standard upload
        # https://ai.google.dev/api/files#method:-files.create
        # Or better: `POST https://generativelanguage.googleapis.com/upload/v1beta/files?key=...`

        upload_url_base = "https://generativelanguage.googleapis.com/upload/v1beta/files"

        headers = {
            "X-Goog-Upload-Protocol": "raw",
            "X-Goog-Upload-Command": "start, upload, finalize",
            "X-Goog-Upload-Header-Content-Length": str(os.path.getsize(file_path)),
            "X-Goog-Upload-Header-Content-Type": mime_type,
            "Content-Type": mime_type
        }
        params = {"key": key}

        # Read file
        with open(file_path, "rb") as f:
            data = f.read()

        # Send
        # We also need json metadata for the file name/display name in a specialized header or multipart?
        # The REST API documentation says we can do it in one go for small files.
        # Let's try the simplest: metadata is optional.

        resp = requests.post(upload_url_base, headers=headers, params=params, data=data)
        resp.raise_for_status()

        # Response should contain `file` object with `uri`
        file_info = resp.json().get("file", {})
        uri = file_info.get("uri")
        if not uri:
            raise ValueError("Upload failed, no URI returned")

        # Check state? Usually 'PROCESSING' then 'ACTIVE'.
        # For video, it might take a moment.
        return uri

    def generate(
        self,
        messages: List[Dict[str, str]],
        model_card: Any,
        provider_config: Any,
        stream: bool = False,
        capability_toggles: Optional[List[CapabilityToggleRequest]] = None,
        limits: Optional[Any] = None,
        request_context: Optional[Any] = None,
    ) -> Dict[str, Any]:

        key = self._get_key()
        model_id = model_card.official_id_or_deployment # e.g. "gemini-1.5-pro-latest"

        url = f"{self.BASE_URL}/models/{model_id}:generateContent?key={key}"

        # Convert messages to Gemini Content
        contents = []

        # Check for video file in capabilities or message content?
        # Usually we pass a file path in the message content or a separate artifact?
        # Northstar convention: If message content starts with "file://", we declare it?
        # Or checking capabilities.

        for m in messages:
            role = "user" if m["role"] == "user" else "model"
            parts = []

            text = m["content"]

            # Hack for detection of local file to upload:
            # If text is JSON with {"file_path": ...} or similar, or just try to parse?
            # Or scan lines?
            # For this task, we will look for a special marker or just text.
            # Assuming mixed content text + file is passed as a list of parts in some upper layer?
            # But the signature here is List[Dict[str, str]] (keys: role, content simplified).
            # So we check if content is a valid local path to a video?

            if text.strip().startswith("file://") and (text.strip().endswith(".mp4") or text.strip().endswith(".mov")):
                fpath = text.strip()[7:] # remove file://
                if os.path.exists(fpath):
                    # Upload
                    try:
                        mime_type, _ = mimetypes.guess_type(fpath)
                        uri = self._upload_file(fpath, mime_type or "video/mp4")
                        parts.append({"file_data": {"mime_type": mime_type or "video/mp4", "file_uri": uri}})
                        # Add a text prompt if needed? Usually prompt follows
                    except Exception as e:
                        return {"status": "FAIL", "reason": f"Video Upload Failed: {e}"}
                else:
                    parts.append({"text": text})
            else:
                parts.append({"text": text})

            contents.append({"role": role, "parts": parts})

        gen_config = {
            "temperature": 0.7,
            "maxOutputTokens": 2048
        }

        # --- GEMINI 3 FLASH FEATURES ---
        if capability_toggles:
             for cap in capability_toggles:
                 if cap.capability_id == "thinking_high":
                     gen_config["thinking_level"] = "HIGH"
                 elif cap.capability_id == "json_mode":
                     gen_config["response_mime_type"] = "application/json"

        if limits and limits.max_output_tokens:
            gen_config["maxOutputTokens"] = limits.max_output_tokens

        payload = {
            "contents": contents,
            "generationConfig": gen_config
        }

        try:
            resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
            resp.raise_for_status()
            data = resp.json()

            # Extract text
            if "candidates" in data and len(data["candidates"]) > 0:
                cand = data["candidates"][0]
                content_parts = cand.get("content", {}).get("parts", [])
                text = "".join([p.get("text", "") for p in content_parts])

                # Extract usage
                usage_meta = data.get("usageMetadata", {})

                # Normalize to TokenUsage (input_tokens, output_tokens)
                input_tokens = usage_meta.get("promptTokenCount", 0)
                output_tokens = usage_meta.get("candidatesTokenCount", 0)
                total_tokens = usage_meta.get("totalTokenCount", 0)

                usage = {
                    "input_tokens": input_tokens,
                    "output_tokens": output_tokens,
                    "total_tokens": total_tokens
                }

                # Calculate Cost
                cost_usd = 0.0
                try:
                    # Lazy import to avoid circularity if any, or just import
                    from engines.budget.token_accounting import TokenAccountingService
                    acc = TokenAccountingService()
                    # Gemini is usually "google/gemini-..." or just "gemini-..."
                    # The model_id passed here is official_id e.g. "gemini-1.5-pro-latest"
                    # We should pass "google" as provider if we know it, or rely on internal logic.
                    # The gateway is GeminiGateway, so provider is likely "google" or "vertex" or "gemini"
                    # Price book has "google/gemini-..." keys.
                    cost_usd = acc.calculate_cost("google", model_id, usage)
                except ImportError:
                    print("Warning: TokenAccountingService not found.")
                except Exception as e:
                    print(f"Cost calc error: {e}")

                return {
                    "role": "assistant",
                    "content": text,
                    "usage": usage,
                    "model_id": model_id,
                    "cost_usd": cost_usd
                }
            else:
                 return {"status": "FAIL", "reason": "No candidates returned"}

        except Exception as e:
            msg = str(e)
            if "key=" in msg:
                 msg = msg.split("key=")[0] + "key=***"
            return {"status": "FAIL", "reason": f"Gemini Error: {msg}", "error": msg}

    def check_readiness(self) -> ReadinessResult:
        try:
            key = self._get_key()
            # List models
            resp = requests.get(f"{self.BASE_URL}/models?key={key}")
            if resp.status_code == 200:
                return ReadinessResult(ReadinessStatus.READY, "Gemini Connected", True)
            return ReadinessResult(ReadinessStatus.RateLimited, f"Status: {resp.status_code}", False)
        except Exception as e:
            return ReadinessResult(ReadinessStatus.MISSING_CREDS_OR_CONFIG, str(e), False)
