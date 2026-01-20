from typing import Dict, Any, AsyncGenerator, Optional
import os
from northstar.runtime.gateway import GatewayProvider, ReadinessCheck
from northstar.registry.schemas import ModelCard
from northstar.runtime.limits import RunLimits
from northstar.runtime.context import AgentsRequestContext

class ElevenLabsProvider(GatewayProvider):
    def __init__(self, provider_id: str):
        self.provider_id = provider_id
        self.api_key = os.getenv("ELEVENLABS_API_KEY")

    def check_readiness(self) -> ReadinessCheck:
        if not self.api_key:
             return ReadinessCheck(ready=False, reason="ELEVENLABS_API_KEY missing")
        return ReadinessCheck(ready=True)

    async def generate_stream(
        self,
        messages: list[Dict[str, Any]],
        model: ModelCard,
        run_config: Any,
        capability_toggles: list,
        limits: RunLimits,
        request_context: Optional[AgentsRequestContext] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        
        # Scribe Logic (Audio -> Transcript with Timestamps)
        # Input usually is a file stream or path
        
        # Check for 'audio_input' in messages
        audio_file = None
        for m in messages:
             if "file_path" in m: # Hypothetical
                 audio_file = m["file_path"]
                 break
        
        if not audio_file:
             yield {"type": "error", "error": "No audio file found for Scribe"}
             return

        try:
            from elevenlabs.client import ElevenLabs
            client = ElevenLabs(api_key=self.api_key)
            
            # Transcription
            # Note: This is usually synchronous or polling, simplified here
            with open(audio_file, "rb") as f:
                transcription = client.audio.transcriptions.create(
                    file=f,
                    model="scribe_v1",
                    diarization=True
                )
                
            # Output structured data
            # Yielding word-level timestamps
            for word in transcription.words:
                yield {
                    "type": "content_delta", 
                    "content": f"[{word.start}-{word.end}] {word.word} "
                }
                
        except ImportError:
             yield {"type": "error", "error": "elevenlabs lib not installed"}
        except Exception as e:
             yield {"type": "error", "error": str(e)}
