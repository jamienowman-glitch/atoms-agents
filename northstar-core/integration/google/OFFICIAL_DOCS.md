# Google Gemini / Vertex AI Official Docs (Late Dec 2025)

## API Reference
- Vertex AI Generative AI: https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini
- Image Generation (Imagen 3): https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview
- Video Generation (Veo): https://cloud.google.com/vertex-ai/generative-ai/docs/video/overview
- Agent Garden Samples: https://github.com/google/adk-samples

## Toggleable Capabilities
- Grounding: `tools=[tool.from_google_search_retrieval(...)]`
- Code Execution: `tools=[{"code_execution": {}}]`
- Context Caching: Supported for large prompts
