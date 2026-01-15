import sys
import os
import unittest

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.capabilities.bedrock.media import BedrockVideoCapability, BedrockImageCapability
from src.capabilities.openai.media import OpenAIImageCapability, OpenAITTSCapability
from src.capabilities.anthropic.computer_use import AnthropicComputerUseCapability
from src.capabilities.elevenlabs.tts import ElevenLabsTTSCapability

class TestMultiVendorCapabilities(unittest.TestCase):
    
    def test_bedrock_video(self):
        config = BedrockVideoCapability.get_config(duration_seconds=6)
        print(f"\n[Bedrock Video] {config}")
        self.assertEqual(config["inference_config"]["durationSeconds"], 6)
        self.assertIn("nova-reel", config["model_id"])

    def test_openai_image(self):
        config = OpenAIImageCapability.get_config(style="natural")
        print(f"\n[OpenAI Image] {config}")
        self.assertEqual(config["style"], "natural")
        self.assertEqual(config["model"], "dall-e-3")

    def test_anthropic_computer_use(self):
        config = AnthropicComputerUseCapability.get_config(screen_width=1024)
        print(f"\n[Anthropic Computer Use] {config}")
        self.assertEqual(len(config["tools"]), 3) # computer, bash, editor
        self.assertEqual(config["tools"][0]["name"], "computer")
        self.assertIn("anthropic-beta", config["required_headers"])

    def test_elevenlabs_tts(self):
        config = ElevenLabsTTSCapability.get_config(voice_id="MyVoice")
        print(f"\n[ElevenLabs TTS] {config}")
        self.assertEqual(config["voice_id"], "MyVoice")
        self.assertIn("similarity_boost", config["voice_settings"])

if __name__ == "__main__":
    unittest.main()
