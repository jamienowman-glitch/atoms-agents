# Model Capabilities Inventory (Late Dec 2025)

## 1. Google Gemini (Unified Smart Toggles)
*Strategy: Check flags -> Swap Model ID.*
- **Text/Tools**: `gemini-3-pro-preview`
- **Video**: `veo-3.1-generate-001`
- **Image**: `gemini-3-pro-image-preview`
- **Audio**: `gemini-2.5-flash-native-audio`
- **Toggles**: `google_search`, `google_maps`, `code_execution` (Tools)

## 2. Audio / TTS
- **Primary (High Quality)**: **ElevenLabs** (`/v1/text-to-speech/{voice_id}/stream`)
- **Native Fallback**: OpenAI `tts-1`, Gemini Native Audio

## 3. AWS Bedrock
*Strategy: Amazon Nova Family.*
- **Video**: `amazon.nova-reel-v1` (S3 output)
- **Image**: `amazon.nova-canvas-v1`
- **Text/Tools**: `anthropic.claude-3-5-sonnet...` (via Converse API)

## 4. OpenAI
*Strategy: Responses API + Tools.*
- **Text/Tools**: `gpt-4o`
- **Tools**: `web_search`, `file_search`, `code_interpreter`, `computer_use`
- **Image**: `dall-e-3` (Separate endpoint)

## 5. Agent Garden (Templates)
We have identified key templates in `google/adk-samples` to port:
- **Podcast Agent**: Transcription & processing.
- **Marketing Agency**: Multi-agent asset generation.
