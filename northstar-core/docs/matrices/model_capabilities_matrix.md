# Live Capability Matrix

| Capability | Vendor | Status | Model ID | Reason/Evidence |
|---|---|---|---|---|
| bedrock.converse_stream_token | bedrock | PASS | global.amazon.nova-2-lite-v1:0 | Received 6+ chunks. Text: Hello! How can I help you today?... |
| bedrock.vision | bedrock | PASS | global.amazon.nova-2-lite-v1:0 | Output: The image shows a close-up view of a |
| adk.vision | adk | PASS | gemini-2.5-flash | Response: The image is completely black. It is a solid, uniform color with no discernible features,  |
| adk.text_generation | adk | FAIL | N/A | Cannot get the response text. Cannot get the Candidate text. Response candidate content has no parts |
| aws.polly_tts | aws | FAIL | N/A | An error occurred (AccessDeniedException) when calling the SynthesizeSpeech operation: User: arn:aws |
| aws.transcribe | aws | FAIL | N/A | An error occurred (AccessDeniedException) when calling the ListTranscriptionJobs operation: User: ar |
