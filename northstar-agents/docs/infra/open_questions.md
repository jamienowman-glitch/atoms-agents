# Open Infrastructure Questions

## Backend Contracts
- What is the preferred object storage schema for multi-tenant users?
- How do we handle PII re-insertion for "human-in-the-loop" debugging?
- Is there a standard for audit trail retention?

## Tenancy
- Do agents share a single Blackboard instance with namespaced keys, or separate instances?
- How are secrets scoped per-flow vs per-user?

## Nexus Retrieval
- What are the boundaries for knowledge retrieval? Can an agent accidetally retrieve another user's context?
