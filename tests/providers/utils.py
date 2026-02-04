"""Shared helpers for provider tests."""
import math
import os
import random
import struct
import tempfile
import wave
from pathlib import Path

from atoms_agents.server.vault import VaultLoader
from botocore.exceptions import ClientError
import pytest

PROMPTS = [
    "Explain the benefits of modular systems in one sentence.",
    "Summarize the history of artificial intelligence.",
    "Describe a future where humans and AI co-create art.",
    "List three reasons why transparent logging matters.",
]

ENV_VAULT_MAP = {
    "OPENAI_API_KEY": ["openai-key.txt", "openai_api_key.txt", "openai.txt"],
    "ANTHROPIC_API_KEY": ["anthropic-api-key.txt", "anthropic_key.txt", "anthropic.txt"],
    "GOOGLE_API_KEY": ["gemini-aistudio.txt", "google-api-key.txt", "google_api_key.txt", "google.txt"],
    "OPENROUTER_API_KEY": ["openrouter", "openrouter-key.txt", "openrouter_api_key.txt", "openrouter.txt"],
    "GROQ_API_KEY": ["groq_key.txt", "groq_key copy.txt", "groq-key.txt", "groq.txt"],
    "MISTRAL_API_KEY": ["mistral-key.txt", "mistral_api_key.txt", "mistral.txt"],
    "NVIDIA_API_KEY": ["nvidia.txt", "nvidia-api-key.txt", "nvidia_key.txt"],
    "ELEVENLABS_API_KEY": ["elevenlabs-key.txt", "elevenlabs_api_key.txt", "elevenlabs.txt"],
    "HUGGINGFACE_API_KEY": ["huggingface-api-key.txt", "huggingface_api_key.txt", "huggingface.txt"],
    "AWS_ACCESS_KEY_ID": ["aws-access-key-id.txt"],
    "AWS_SECRET_ACCESS_KEY": ["aws-secret-access-key.txt"],
    "AWS_SESSION_TOKEN": ["aws-session-token.txt"],
    "AWS_REGION": ["aws-region.txt", "aws-default-region.txt"],
    "GOOGLE_MAPS_API_KEY": ["google-maps-key.txt", "google_maps_api_key.txt", "google_maps.txt"],
    "MAPBOX_API_KEY": ["mapbox-key.txt", "mapbox_api_key.txt", "mapbox.txt"],
}


def has_env_or_vault(env_var: str) -> bool:
    """Return True when a secret is available via vault or env."""
    if os.getenv(env_var):
        return True
    for filename in ENV_VAULT_MAP.get(env_var, []):
        if VaultLoader.load_secret(filename):
            return True
    return False


def skip_bedrock_unavailable(exc: Exception) -> None:
    """Skip Bedrock tests when the account is throttled or requires profiles."""
    if not isinstance(exc, ClientError):
        return
    error = exc.response.get("Error", {})
    code = error.get("Code", "")
    message = error.get("Message", "")
    if code == "ThrottlingException":
        pytest.skip(f"Bedrock throttled: {message}")
    if code == "ValidationException" and "inference profile" in message.lower():
        pytest.skip("Bedrock requires an inference profile for this model.")
    if code == "ResourceNotFoundException" and "end of its life" in message.lower():
        pytest.skip("Bedrock model version is end-of-life.")


def random_prompt() -> str:
    return random.choice(PROMPTS)


def build_dummy_wav(path: Path) -> None:
    frames_per_second = 8000
    duration_seconds = 0.5
    amplitude = 10000

    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(frames_per_second)
        samples = []
        for i in range(int(frames_per_second * duration_seconds)):
            value = int(amplitude * math.sin(2 * math.pi * 440 * (i / frames_per_second)))
            samples.append(struct.pack("<h", value))
        wf.writeframes(b"".join(samples))
