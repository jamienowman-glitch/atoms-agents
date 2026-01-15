mport sys
import os
import unittest
from unittest.mock import MagicMock

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.capabilities.google.computer_use import GeminiComputerUseCapability

class TestGeminiComputerUseCapability(unittest.TestCase):
    def test_default_config(self):
        """Verify the default configuration output."""
        config = GeminiComputerUseCapability.get_config()
        
        # Check Model ID
        self.assertEqual(config["model_id"], "gemini-2.0-flash-exp")
        
        # Check Tools
        tools = config["tools"]
        self.assertEqual(len(tools), 1)
        self.assertIn("computer_use", tools[0])
        
        # Check Dimensions
        cu_tool = tools[0]["computer_use"]
        self.assertEqual(cu_tool["display_width_px"], 1024)
        self.assertEqual(cu_tool["display_height_px"], 768)
        
        print("\n[PASS] Default Config Verified")
        print(f"   Model: {config['model_id']}")
        print(f"   Tool : {config['tools']}")

    def test_custom_dimensions_and_model(self):
        """Verify overriding dimensions and model ID."""
        config = GeminiComputerUseCapability.get_config(
            screen_width=1920, 
            screen_height=1080, 
            model_id_override="gemini-3-pro-preview"
        )
        
        self.assertEqual(config["model_id"], "gemini-3-pro-preview")
        self.assertEqual(config["tools"][0]["computer_use"]["display_width_px"], 1920)
        self.assertEqual(config["tools"][0]["computer_use"]["display_height_px"], 1080)
        
        print("\n[PASS] Custom Config Verified")

if __name__ == "__main__":
    unittest.main()
