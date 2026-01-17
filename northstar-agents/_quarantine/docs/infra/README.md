# Infrastructure Policy

## "No Silent Fallback"
Existing persistence backends (ArtifactStore, Blackboard) must NEVER silently fall back to local implementations when an infrastructure profile is requested. If credentials or connectivity fail, the system must error out explicitly.

## Injection Requirements
For a profile to be "infra-ready", it must inject:
1. **ArtifactStore**: S3/GCS/AzureBlob implementation.
2. **Blackboard**: Redis/DynamoDB implementation.
3. **PII Strategy**: Encryption/Redaction service.
4. **Nexus Client**: Remote knowledge graph connection.

## Readiness Checklist
- [ ] Profile defined in `registry/cards/profiles/`.
- [ ] Secrets provided via `EnvSecretProvider` (no dot-env files in prod).
- [ ] Network policy allows egress to cloud providers.
- [ ] Logging configured to ship structured logs to central aggregator.
