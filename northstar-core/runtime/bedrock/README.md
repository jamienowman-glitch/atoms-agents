# AWS Bedrock Runtime Adapter

This directory contains the runtime adapter for Amazon Bedrock foundation models.

## Configuration

The adapter is configured via standard AWS environment variables:

- `AWS_REGION` (or `AWS_DEFAULT_REGION`): The AWS region to use (default: `us-east-1`).
- `AWS_PROFILE`: Standard AWS CLI profile handling (implied by boto3).

## Usage (Internal)

This adapter is called by `src/core/runtimes/bedrock_runtime.py`, but can be smoked tested directly:

```python
from runtime.bedrock.client import run_bedrock
from runtime.bedrock.types import BedrockRequest

req = BedrockRequest(
    tenant_id="test-tenant",
    surface_id="squared",
    model_id="amazon.nova-2-lite-v1:0", # Example ID
    session_id="local-test",
    user_message="Hello from Northstar!"
)

resp = run_bedrock(req)
print(resp.messages[0].content)
```

## Implementation Notes

- Uses the modern `converse` API where available to standardize message passing across Nova, Claude, Mistral, etc.
