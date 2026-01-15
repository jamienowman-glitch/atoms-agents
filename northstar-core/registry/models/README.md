# Northstar Model Registry

This folder contains the catalogs of foundation models available to Northstar.

## Files

- **`catalog.aws.bedrock.raw.json`**: A raw snapshot of models returned by AWS Bedrock's `list_foundation_models` API in `us-east-1`.
- **`catalog.aws.bedrock.curated.yaml`**: A curated, normalized list of models ready for consumption by Roots Manuva routing logic.
- **`catalog.*.stub.yaml`**: Placeholders for other providers (GCP, OpenAI, etc.).

## Schema

Curated entries follow this schema to ensure the router stays backend-agnostic:

```yaml
- id: "unique-model-id"
  provider: "canonical-provider-name"
  backend: "aws_bedrock" | "gcp_vertex" | "openai_api" | ...
  region: "region-name"
  modalities:
    input: ["TEXT", "IMAGE", ...]
    output: ["TEXT", ...]
  family: "nova" | "claude" | "gemini" | "generic"
  capability_tags: ["chat", "vision", "orchestration", ...]
  price_tier: "cheap" | "mid" | "premium"
  default_enabled: true | false
```

## Refreshing the Catalog

To update the Bedrock catalog:

```bash
source .venv/bin/activate
python -m src.core.models_registry.aws_bedrock_snapshot
python -m src.core.models_registry.aws_bedrock_curate
```
